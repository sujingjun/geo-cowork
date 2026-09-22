import { readFile, open, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  writeCreateOnly,
  atomicWrite,
  stableStringify,
  resolveWithin,
} from './workspace-paths.mjs';
import { assertRealCapturePrivacy } from './answer-sample.mjs';
import {
  extractAnswer,
  loadModelEnvironment,
  modelHash,
} from './model-client.mjs';

export const ENGINEERING_PLATFORMS = Object.freeze({
  chatgpt: 'https://chatgpt.com/',
  gemini: 'https://gemini.google.com/app',
  perplexity: 'https://www.perplexity.ai/',
});
const fail = (code, message) => {
  throw Object.assign(new Error(message), { code });
};
async function load(root) {
  return JSON.parse(await readFile(path.join(root, 'run.json'), 'utf8'));
}
export async function withCaptureLock(root, work, name = 'run.lock') {
  await mkdir(root, { recursive: true });
  const file = path.join(root, name);
  let lock;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      lock = await open(file, 'wx');
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let recovery;
      try {
        recovery = await open(`${file}.recovery`, 'wx');
      } catch (e) {
        if (e.code === 'EEXIST')
          fail('CAPTURE_RUN_BUSY', 'Capture lease recovery is in progress');
        throw e;
      }
      try {
        let owner;
        try {
          owner = JSON.parse(await readFile(file, 'utf8'));
        } catch (e) {
          if (e.code === 'ENOENT') continue;
          fail('CAPTURE_RUN_BUSY', 'Capture lease requires inspection');
        }
        if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0)
          fail('CAPTURE_RUN_BUSY', 'Capture lease requires inspection');
        try {
          process.kill(owner.pid, 0);
          fail('CAPTURE_RUN_BUSY', 'Another collector holds the run lease');
        } catch (e) {
          if (e.code !== 'ESRCH') throw e;
        }
        if (attempt) fail('CAPTURE_RUN_BUSY', 'Capture lease changed');
        await unlink(file);
      } finally {
        await recovery.close();
        await unlink(`${file}.recovery`);
      }
    }
  }
  if (!lock) fail('CAPTURE_RUN_BUSY', 'Capture lease changed during recovery');
  await lock.writeFile(
    JSON.stringify({ pid: process.pid, acquired_at: new Date().toISOString() }),
  );
  try {
    return await work();
  } finally {
    await lock.close();
    await unlink(file);
  }
}
export async function prepareEngineeringCapture(
  root,
  query = 'What is MyyShop?',
  formalPlan,
) {
  try {
    const old = await load(root);
    if (old.query.text !== query)
      fail('CAPTURE_QUERY_CONFLICT', 'Run query differs');
    if (
      (old.formal_plan_sha256 ?? null) !==
      (formalPlan ? modelHash(stableStringify(formalPlan)) : null)
    )
      fail('CAPTURE_QUERY_CONFLICT', 'Frozen formal slot differs');
    return old;
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const data = {
    schema_version: 'geo-engineering-capture-run-v1',
    run_id: formalPlan?.run_ref ?? 'RUN-GEO-MCP-20260916',
    purpose: formalPlan?.purpose ?? 'engineering_validation',
    execution_scope: 'authorized_real',
    authorization:
      formalPlan?.authorization ??
      'Owner 2026-09-16 implementation request: ChatGPT/Gemini/Perplexity once each, >=120 seconds apart',
    ...(formalPlan
      ? {
          formal_plan_sha256: modelHash(stableStringify(formalPlan)),
          formal_slot: formalPlan,
        }
      : {}),
    query: {
      ref: formalPlan?.query_ref ?? 'Q-MYYSHOP-WHAT-IS-EN-BASELINE-001',
      version: formalPlan?.query_version ?? '1.0.0',
      text: query,
      sha256: modelHash(query),
    },
    provider_default: 'deepseek',
    min_interval_ms: 120000,
    last_submission_at: null,
    platforms: Object.fromEntries(
      Object.keys(ENGINEERING_PLATFORMS).map((platform) => [
        platform,
        { status: 'pending', submissions: 0 },
      ]),
    ),
  };
  await writeCreateOnly(root, 'run.json', stableStringify(data, 2), {
    idempotent: true,
  });
  return data;
}
export async function claimEngineeringSubmission(
  root,
  platform,
  now = new Date(),
  beforeSubmit,
) {
  return withCaptureLock(root, async () => {
    const run = await load(root);
    const item = run.platforms[platform];
    if (run.formal_slot && run.formal_slot.platform !== platform)
      fail('FORMAL_SLOT_MISMATCH', 'Wrong platform for frozen slot');
    if (!Number.isFinite(now.getTime()))
      fail('CAPTURE_INVALID', 'Invalid submission time');
    if (!item || item.submissions !== 0)
      fail(
        'SUBMISSION_UNKNOWN',
        'Query already submitted or platform outside run',
      );
    if (
      run.last_submission_at &&
      now.getTime() - Date.parse(run.last_submission_at) < run.min_interval_ms
    )
      fail(
        'COLLECTION_RATE_LIMIT',
        'Wait at least 120 seconds between submissions',
      );
    if (beforeSubmit) await beforeSubmit();
    item.status = 'submission_unknown';
    item.submissions = 1;
    item.submitted_at = now.toISOString();
    run.last_submission_at = item.submitted_at;
    await atomicWrite(root, 'run.json', stableStringify(run, 2));
    return { platform, query: run.query, submitted_at: item.submitted_at };
  });
}
export async function recordEngineeringCapture(root, platform, raw) {
  return withCaptureLock(root, async () => {
    const run = await load(root);
    const item = run.platforms[platform];
    if (!item || item.submissions !== 1)
      fail('CAPTURE_NOT_SUBMITTED', 'No matching submission');
    if (
      (!(
        run.formal_slot &&
        ['timeout', 'no_result', 'challenge', 'cancelled'].includes(raw.outcome)
      ) &&
        !raw.answer_text?.trim()) ||
      !Number.isFinite(Date.parse(raw.captured_at)) ||
      Date.parse(raw.captured_at) < Date.parse(item.submitted_at)
    )
      fail('CAPTURE_INVALID', 'Missing answer or invalid collection time');
    if (
      new URL(raw.result_url).origin !==
      new URL(ENGINEERING_PLATFORMS[platform]).origin
    )
      fail('CAPTURE_ORIGIN_INVALID', 'Wrong platform result');
    if (
      item.raw_sha256 === modelHash(stableStringify(raw)) &&
      item.capture_path
    )
      return JSON.parse(
        await readFile(resolveWithin(root, item.capture_path), 'utf8'),
      );
    if (run.formal_slot) {
      if (raw.context_token !== item.context_token || !item.context_token)
        fail('RESULT_BINDING_CHANGED', 'Capture context changed');
      assertRealCapturePrivacy(raw);
    }
    const data = {
      ...raw,
      platform,
      collector: 'playwright_mcp',
      purpose: run.purpose,
      execution_scope: run.execution_scope,
      query: run.query,
      run_ref: run.run_id,
      raw_sha256: modelHash(stableStringify(raw)),
    };
    await writeCreateOnly(
      root,
      `${platform}/capture.json`,
      stableStringify(data, 2),
      { idempotent: true, conflictCode: 'RAW_ARTIFACT_CONFLICT' },
    );
    item.status = 'captured';
    item.raw_sha256 = data.raw_sha256;
    item.capture_path = `${platform}/capture.json`;
    await atomicWrite(root, 'run.json', stableStringify(run, 2));
    return data;
  });
}
export async function extractEngineeringCapture(root, platform, options = {}) {
  await loadModelEnvironment();
  const run = await load(root);
  const item = run.platforms[platform];
  if (!item?.capture_path)
    fail('CAPTURE_REQUIRED', 'Capture is required before extraction');
  const capture = JSON.parse(
    await readFile(resolveWithin(root, item.capture_path), 'utf8'),
  );
  const {
    platform: _p,
    collector: _c,
    purpose: _u,
    execution_scope: _s,
    query: _q,
    run_ref: _r,
    raw_sha256,
    ...raw
  } = capture;
  if (
    modelHash(stableStringify(raw)) !== raw_sha256 ||
    raw_sha256 !== item.raw_sha256
  )
    fail('RAW_ARTIFACT_CONFLICT', 'Raw capture checksum changed');
  const input = {
    query: capture.query,
    answerText: capture.answer_text,
    safeHtmlText: capture.answer_text,
    outcome: capture.outcome ?? 'success',
    citations: capture.citations ?? [],
    rawSha256: raw_sha256,
  };
  const result = await extractAnswer(input, {
    ...options,
    auditDir: path.join(root, 'model-calls'),
  });
  const extraction = {
    schema_version: 'geo-engineering-extraction-v1',
    capture_sha256: raw_sha256,
    ...result,
  };
  const relative = `${platform}/extractions/${result.audit.id}.json`;
  await writeCreateOnly(root, relative, stableStringify(extraction, 2), {
    idempotent: true,
  });
  await withCaptureLock(root, async () => {
    const current = await load(root);
    current.platforms[platform].status = 'completed';
    current.platforms[platform].extractions = [
      ...(current.platforms[platform].extractions ?? []),
      relative,
    ];
    await atomicWrite(root, 'run.json', stableStringify(current, 2));
  });
  return { platform, extraction: relative, audit: result.audit };
}
export const readEngineeringCaptureRun = load;

export async function bindEngineeringContext(root, platform, token) {
  return withCaptureLock(root, async () => {
    const run = await load(root);
    const item = run.platforms[platform];
    if (!item || item.submissions)
      fail('SUBMISSION_UNKNOWN', 'A submitted Query cannot be rebound');
    item.context_token = token;
    await atomicWrite(root, 'run.json', stableStringify(run, 2));
    return token;
  });
}

export async function claimRealWorkspaceSubmission(
  workspace,
  slotId,
  now = new Date(),
) {
  return withCaptureLock(
    path.join(workspace, 'execution'),
    async () => {
      let previous;
      try {
        previous = JSON.parse(
          await readFile(
            path.join(workspace, 'execution/real-capture-rate.json'),
            'utf8',
          ),
        );
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
      if (
        !Number.isFinite(now.getTime()) ||
        (previous &&
          (!Number.isFinite(Date.parse(previous.submitted_at)) ||
            now.getTime() - Date.parse(previous.submitted_at) < 120000))
      )
        fail(
          'COLLECTION_RATE_LIMIT',
          'At least 120 seconds between real submissions across the workspace',
        );
      const data = { submitted_at: now.toISOString(), slot_id: slotId };
      await atomicWrite(
        workspace,
        'execution/real-capture-rate.json',
        stableStringify(data, 2),
      );
      return data;
    },
    'real-capture-rate.lock',
  );
}
