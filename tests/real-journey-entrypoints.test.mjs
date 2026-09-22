import assert from 'node:assert/strict';
import test from 'node:test';
import {
  mkdir,
  readFile,
  readdir,
  writeFile,
  stat,
  rm,
} from 'node:fs/promises';
import path from 'node:path';
import fsPromises from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { createRun } from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { m4ReadyWorkspace } from './helpers/m4-fixtures.mjs';
import { executeKnowledgeJourney } from '../plugins/geo-expert/scripts/lib/journey-entrypoints.mjs';
import {
  sha256,
  stableStringify,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

// Every workspace is isolated under the OS temp directory. The online identity
// exercises the real command branch; all content below is explicitly test data.
// A supplied English draft and cached page observation avoid model/network calls.
const cycle = 'CYC-ENTRYPOINT-ISOLATED-ONE';
const cycleDir = 'cycles/entrypoint-isolated-one';
const planPath = 'cycles/preparation/real-cycle-plan.json';
const authPath = 'reviews/entrypoint-authorization.md';
const sourceObservation = `${cycleDir}/knowledge-sources/AST-TEST-ABOUT-001.json`;
const packageId = `OWNER-KNOWLEDGE-${cycle}`;
const packageJson = `reviews/packages/${packageId}.json`;
const packageMd = `reviews/packages/${packageId}.md`;
const reportPath = 'reports/real-cycle-overview.md';

async function write(workspace, relative, value) {
  await mkdir(path.dirname(path.join(workspace, relative)), {
    recursive: true,
  });
  await writeFile(
    path.join(workspace, relative),
    typeof value === 'string' ? value : stableStringify(value, 2),
  );
}
async function snapshot(workspace) {
  const files = {};
  async function walk(relative = '') {
    for (const entry of (
      await readdir(path.join(workspace, relative), { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(relative, entry.name);
      if (entry.isDirectory()) await walk(file);
      else {
        const info = await stat(path.join(workspace, file), { bigint: true });
        files[file] = {
          sha256: sha256(await readFile(path.join(workspace, file))),
          size: String(info.size),
          modified: String(info.mtimeNs),
        };
      }
    }
  }
  await walk();
  return files;
}
function without(files, excluded) {
  return Object.fromEntries(
    Object.entries(files).filter(([file]) => !excluded.includes(file)),
  );
}
async function fixture(t, { withPlan = true } = {}) {
  const workspace = await m4ReadyWorkspace();
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const priorEnv = Object.fromEntries(
    ['GEO_ENV_FILE', 'DEEPSEEK_API_KEY'].map((key) => [key, process.env[key]]),
  );
  process.env.GEO_ENV_FILE = path.join(workspace, 'does-not-exist.env');
  delete process.env.DEEPSEEK_API_KEY;
  t.after(() => {
    for (const [key, value] of Object.entries(priorEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  const network = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('OFFLINE_ISOLATED_FIXTURE_MUST_NOT_CALL_NETWORK');
  });
  const identity = {
    workspace_id: 'ws_entrypointisolated0000000000',
    workspace_mode: 'online',
    execution_scope: 'authorized_real',
    merchant_ref: 'MER-ENTRYPOINT-ONE',
    merchant_mode: 'online',
    subject_locator: 'https://entrypoint.example.invalid/',
    knowledge_base_ref: null,
    knowledge_base_mode: 'real',
    online_configuration: {
      ga4_property_id: '356373250',
      gsc_site_url: 'https://entrypoint.example.invalid/',
      analytics_plan: planPath,
    },
  };
  await write(workspace, 'workspace.json', identity);
  await write(
    workspace,
    'ISOLATED_TEST_ONLY.txt',
    'Local fixture only. No real Owner decision, public observation, model response, or business result.\n',
  );
  const authorization =
    'Explicit isolated fixture authorization; not a real business authorization.\n';
  await write(workspace, authPath, authorization);
  const contracts = {};
  for (const role of [
    'measurement_contract',
    'signal_rule',
    'sensitive_data_policy',
  ]) {
    const file = `execution/contracts/entrypoint-${role}.json`;
    contracts[role] = file;
    // Minimal preparation-only contracts: this suite never freezes a real cycle.
    await write(workspace, file, {
      id: `isolated-${role}`,
      scope: 'authorized_real',
      version: '1.0.0',
      fixture: true,
    });
  }
  const plan = {
    cycle_ref: cycle,
    cycle_number: 1,
    cycle_dir: cycleDir,
    run_ref: 'RUN-ENTRYPOINT-ISOLATED-ONE',
    merchant_ref: identity.merchant_ref,
    knowledge_base_ref: 'KBASE-ENTRYPOINT-REAL-ONE',
    goal_ref: 'GOAL-TEST-001',
    query_set_ref: 'QS-TEST-001',
    asset_refs: ['AST-TEST-ABOUT-001'],
    provider: 'deepseek',
    contracts,
    authorization: {
      ref: `workspace://${authPath}`,
      sha256: sha256(authorization),
      expires_at: '2099-01-01T00:00:00Z',
    },
    collection_methods: {
      chatgpt: 'manual',
      gemini: 'manual',
      perplexity: 'manual',
      google_ai: 'manual',
      claude: 'manual',
    },
    analytics: {
      property_id: '356373250',
      site_url: 'https://entrypoint.example.invalid/',
      property_time_zone: null,
      registration_event: null,
      registration_approval_ref: null,
    },
    knowledge: {
      release_ref: 'KR-ENTRYPOINT-NEW-ONE',
      answer_ref: 'ANS-ENTRYPOINT-NEW-ONE',
      claim_refs: ['CLM-TEST-001'],
      english_answer:
        'ISOLATED TEST DRAFT: Synthetic Brand provides a documented service. This manually supplied draft is not generated model evidence.',
    },
  };
  await write(
    workspace,
    'execution/identity/merchant.md',
    serializeMarkdownObject(
      {
        id: identity.merchant_ref,
        record_type: 'merchant',
        status: 'active',
        version: '1.0.0',
        created_at: '2026-08-24T00:00:00Z',
        updated_at: '2026-08-24T00:00:00Z',
        title: 'Isolated entrypoint test Merchant',
        display_name: 'Isolated entrypoint fixture',
        canonical_locator: identity.subject_locator,
        account_mode: 'online',
      },
      '# Isolated test Merchant; no live business execution.\n',
    ),
  );
  await createRun({
    workspace,
    runId: plan.run_ref,
    skill: 'geo-lifecycle',
    skillVersion: '1.0.0',
    inputVersions: {
      [identity.merchant_ref]: '1.0.0',
      [plan.goal_ref]: '1.0.0',
    },
    now: '2026-08-24T00:00:00Z',
  });
  if (withPlan) await write(workspace, planPath, plan);
  await write(workspace, sourceObservation, {
    fixture: true,
    status: 'captured',
    locator: 'https://brand.example.invalid/about',
    captured_at: '2026-08-24T00:00:00Z',
    html: '<html><body><h1>ISOLATED TEST OBSERVATION</h1><p>Cached fixture page; never fetched from a real website.</p></body></html>',
    provenance: 'isolated_test_fixture_not_a_live_capture',
  });
  return { workspace, identity, plan, network };
}
const execute = (workspace, command, extra = {}) =>
  executeKnowledgeJourney({ workspace, command, ...extra });
async function feedback(workspace, decision, suffix = decision) {
  const bytes = await readFile(path.join(workspace, packageJson), 'utf8');
  const file = `reviews/test-inputs/${suffix}.md`;
  await write(
    workspace,
    file,
    `包：${packageId}\n校验：${sha256(bytes)}\n决定：${decision}\n决定人：Isolated Fixture Owner\n时间：2026-09-01T00:00:00Z\n说明：Isolated ${decision} decision for command-contract tests only.\n`,
  );
  return path.join(workspace, file);
}

test('online preflight and inbox are repeatable zero-write reports with absent KBASE and no plan', async (t) => {
  const { workspace, network } = await fixture(t, { withPlan: false });
  const before = await snapshot(workspace);
  const first = await execute(workspace, 'preflight');
  const inbox = await execute(workspace, 'inbox');
  const second = await execute(workspace, 'preflight');
  assert.equal(first.formal_cycle_created, false);
  assert.equal(first.safe_to_create, false);
  assert.equal(first.knowledge_base_mode, 'missing');
  assert.equal(first.knowledge_absence.content_gap_inferred, false);
  assert.ok(first.blockers.some((b) => b.code === 'KNOWLEDGE_INPUT_ABSENT'));
  assert.ok(first.blockers.some((b) => b.code === 'REAL_PLAN_REQUIRED'));
  assert.deepEqual(first, second);
  assert.deepEqual(inbox.pending, []);
  assert.deepEqual(await snapshot(workspace), before);
  assert.equal(network.mock.callCount(), 0);
});

test('preflight/inbox with preparation plan preserve all files and expose specific data limitations', async (t) => {
  const { workspace, network } = await fixture(t);
  const before = await snapshot(workspace);
  for (const command of ['preflight', 'inbox', 'preflight', 'inbox']) {
    const value = await execute(workspace, command),
      status = value.preflight ?? value;
    assert.equal(status.formal_cycle_created, false);
    assert.equal(status.stage, 'preparation');
    assert.equal(status.knowledge_absence.content_gap_inferred, false);
    for (const code of [
      'KNOWLEDGE_INPUT_ABSENT',
      'KNOWLEDGE_RELEASE_REQUIRED',
      'GA4_TIMEZONE_UNCONFIRMED',
      'MODEL_CONFIGURATION_REQUIRED',
    ])
      assert.ok(
        status.blockers.some((b) => b.code === code),
        code,
      );
  }
  assert.deepEqual(await snapshot(workspace), before);
  assert.equal(network.mock.callCount(), 0);
});

test('report writes only its requested overview and cannot imply a missing KBASE is a completed cycle', async (t) => {
  const { workspace } = await fixture(t);
  const before = await snapshot(workspace);
  const report = await execute(workspace, 'report');
  assert.equal(report.report, reportPath);
  assert.equal(report.formal_cycle_created, false);
  const content = await readFile(path.join(workspace, reportPath), 'utf8');
  assert.match(content, /真实周期：0/);
  assert.match(content, /完整完成：0\/2/);
  assert.match(content, /KNOWLEDGE_INPUT_ABSENT/);
  await execute(workspace, 'report');
  assert.deepEqual(without(await snapshot(workspace), [reportPath]), before);
});

test('start prepares one immutable knowledge review package using only explicitly cached observations', async (t) => {
  const { workspace, plan, network } = await fixture(t);
  const before = await snapshot(workspace),
    result = await execute(workspace, 'start');
  assert.equal(result.waiting_human, true);
  assert.equal(result.package, packageMd);
  assert.equal(result.knowledge_base_ref, null);
  const after = await snapshot(workspace),
    added = Object.keys(after)
      .filter((file) => !before[file])
      .sort();
  assert.deepEqual(
    added,
    [
      `${cycleDir}/knowledge-proposal.json`,
      `reviews/feedback/${packageId}.md`,
      packageJson,
      packageMd,
    ].sort(),
  );
  assert.deepEqual(without(after, added), before);
  const pack = JSON.parse(
    await readFile(path.join(workspace, packageJson), 'utf8'),
  );
  const bundle = JSON.parse(
    await readFile(
      path.join(workspace, `${cycleDir}/knowledge-proposal.json`),
      'utf8',
    ),
  );
  assert.equal(pack.kind, 'real_knowledge');
  assert.equal(pack.targets[0].id, `KNOWLEDGE-${cycle}`);
  assert.equal(bundle.english_answer, plan.knowledge.english_answer);
  assert.equal(bundle.observations[0].path, sourceObservation);
  assert.match(bundle.observations[0].text, /ISOLATED TEST OBSERVATION/);
  assert.equal(bundle.approval, undefined);
  assert.equal(pack.approval, undefined);
  assert.equal((await execute(workspace, 'inbox')).pending.length, 1);
  for (const command of ['start', 'continue', 'inbox', 'preflight'])
    await execute(workspace, command);
  assert.deepEqual(await snapshot(workspace), after);
  assert.equal(network.mock.callCount(), 0);
});

for (const decision of ['reject', 'defer'])
  test(`Owner ${decision} stays visible, does not approve knowledge and replays without unrelated drift`, async (t) => {
    const { workspace, network } = await fixture(t);
    await execute(workspace, 'start');
    const file = await feedback(workspace, decision),
      before = await snapshot(workspace);
    const result = await execute(workspace, 'apply-feedback', { file });
    assert.equal(result.waiting_human, true);
    assert.equal(result.decision, decision);
    const after = await snapshot(workspace),
      added = Object.keys(after).filter((item) => !before[item]);
    assert.deepEqual(added, [`reviews/decisions/${packageId}.json`]);
    assert.deepEqual(without(after, added), before);
    const receipt = JSON.parse(
      await readFile(path.join(workspace, added[0]), 'utf8'),
    );
    assert.equal(receipt.decision, decision);
    assert.equal(receipt.scope, 'authorized_real');
    const inbox = await execute(workspace, 'inbox');
    assert.equal(inbox.pending.length, 1);
    assert.equal(inbox.pending[0].feedback_decision, decision);
    assert.equal(inbox.preflight.formal_cycle_created, false);
    for (const command of ['start', 'continue'])
      assert.equal((await execute(workspace, command)).waiting_human, true);
    await execute(workspace, 'apply-feedback', { file });
    assert.deepEqual(await snapshot(workspace), after);
    assert.equal(
      JSON.parse(await readFile(path.join(workspace, 'workspace.json'), 'utf8'))
        .knowledge_base_ref,
      null,
    );
    assert.equal(network.mock.callCount(), 0);
  });

test('defer can become reject with a historical receipt; a final rejection cannot be turned into approval', async (t) => {
  const { workspace } = await fixture(t);
  await execute(workspace, 'start');
  const defer = await feedback(workspace, 'defer');
  await execute(workspace, 'apply-feedback', { file: defer });
  const reject = await feedback(workspace, 'reject');
  await execute(workspace, 'apply-feedback', { file: reject });
  const history = await readdir(
    path.join(workspace, 'reviews/decisions/history'),
  );
  assert.equal(history.length, 1);
  assert.equal(
    JSON.parse(
      await readFile(
        path.join(workspace, 'reviews/decisions/history', history[0]),
        'utf8',
      ),
    ).decision,
    'defer',
  );
  const approve = await feedback(workspace, 'approve'),
    before = await snapshot(workspace);
  await assert.rejects(
    execute(workspace, 'apply-feedback', { file: approve }),
    { code: 'OWNER_FEEDBACK_CONFLICT' },
  );
  assert.deepEqual(await snapshot(workspace), before);
  assert.equal(
    (await execute(workspace, 'inbox')).pending[0].feedback_decision,
    'reject',
  );
});

test('changed review target is refused without recording Owner approval or creating KBASE', async (t) => {
  const { workspace } = await fixture(t);
  await execute(workspace, 'start');
  const file = await feedback(workspace, 'approve');
  const bundlePath = path.join(
      workspace,
      `${cycleDir}/knowledge-proposal.json`,
    ),
    bundle = JSON.parse(await readFile(bundlePath, 'utf8'));
  await writeFile(
    bundlePath,
    stableStringify(
      { ...bundle, english_answer: 'An altered unreviewed draft.' },
      2,
    ),
  );
  const before = await snapshot(workspace);
  await assert.rejects(execute(workspace, 'apply-feedback', { file }), {
    code: 'OWNER_FEEDBACK_STALE',
  });
  assert.deepEqual(await snapshot(workspace), before);
});

test('online execution_scope contamination is rejected before any preparation write', async (t) => {
  const { workspace, identity } = await fixture(t);
  await write(workspace, 'workspace.json', {
    ...identity,
    execution_scope: 'synthetic_test',
  });
  const before = await snapshot(workspace);
  for (const command of ['preflight', 'inbox', 'start', 'continue'])
    await assert.rejects(execute(workspace, command), {
      code: 'WORKSPACE_SCOPE_INVALID',
    });
  assert.deepEqual(await snapshot(workspace), before);
});

test('authorization byte drift is reported read-only and rejects write commands before recovery journals are processed', async (t) => {
  const { workspace } = await fixture(t);
  await write(
    workspace,
    authPath,
    'Changed authorization bytes; original hash no longer matches.',
  );
  // If recovery runs before authorization, this deliberately incomplete journal
  // raises CITATION_SOURCE_PAIR_INCOMPLETE, proving the ordering regression.
  await write(
    workspace,
    'runs/RUN-ISOLATED-RECOVERY/outputs/citation-pairs/CIT-ISOLATED-ONE.json',
    {
      sha256: '0'.repeat(64),
      sample: { run_ref: 'RUN-ISOLATED-RECOVERY' },
      occurrence: { id: 'CIT-ISOLATED-ONE' },
    },
  );
  const before = await snapshot(workspace);
  const preflight = await execute(workspace, 'preflight');
  assert.ok(
    preflight.blockers.some((b) => b.code === 'REAL_AUTHORIZATION_DRIFT'),
  );
  assert.ok(
    (await execute(workspace, 'inbox')).preflight.blockers.some(
      (b) => b.code === 'REAL_AUTHORIZATION_DRIFT',
    ),
  );
  for (const command of ['start', 'continue'])
    await assert.rejects(execute(workspace, command), {
      code: 'REAL_AUTHORIZATION_DRIFT',
    });
  assert.deepEqual(await snapshot(workspace), before);
});

test('expired authorization fails before starting knowledge preparation and preserves all artifacts', async (t) => {
  const { workspace, plan } = await fixture(t);
  await write(workspace, planPath, {
    ...plan,
    authorization: {
      ...plan.authorization,
      expires_at: '2020-01-01T00:00:00Z',
    },
  });
  const before = await snapshot(workspace);
  assert.ok(
    (await execute(workspace, 'preflight')).blockers.some(
      (b) => b.code === 'REAL_AUTHORIZATION_REQUIRED',
    ),
  );
  await assert.rejects(execute(workspace, 'start'), {
    code: 'REAL_AUTHORIZATION_REQUIRED',
  });
  assert.deepEqual(await snapshot(workspace), before);
});

function bundleFiles(plan) {
  const folder = `knowledge/real/${plan.cycle_ref.toLowerCase()}`;
  const ids = [
    plan.knowledge_base_ref,
    plan.knowledge.answer_ref,
    plan.knowledge.release_ref,
  ];
  return {
    folder,
    ids,
    files: ids.map((id) => `${folder}/${id.toLowerCase()}.md`).sort(),
  };
}
function watchRename(t, intercept) {
  const original = fsPromises.rename;
  const mocked = t.mock.method(fsPromises, 'rename', async (from, to) =>
    intercept(from, to, original),
  );
  syncBuiltinESMExports();
  const restore = () => {
    mocked.mock.restore();
    syncBuiltinESMExports();
  };
  t.after(restore);
  return restore;
}

test('Owner approval publishes the complete KBASE/Answer/Release group with one directory rename and preserves old facts', async (t) => {
  const { workspace, plan, network } = await fixture(t);
  await execute(workspace, 'start');
  const file = await feedback(workspace, 'approve'),
    before = await snapshot(workspace),
    bundle = bundleFiles(plan);
  const visibility = [];
  const restore = watchRename(t, async (from, to, original) => {
    if (to === path.join(workspace, bundle.folder)) {
      assert.match(
        from,
        new RegExp(`/runs/${plan.run_ref}/outputs/real-bundles/[a-f0-9]{64}$`),
      );
      assert.deepEqual(
        (await readdir(from)).sort(),
        bundle.files.map((item) => path.basename(item)).sort(),
      );
      const beforePublish = await loadWorkspaceGraph({ workspace });
      visibility.push(
        bundle.ids.filter((id) => beforePublish.byId.has(id)).length,
      );
      const result = await original(from, to);
      const afterPublish = await loadWorkspaceGraph({ workspace });
      visibility.push(
        bundle.ids.filter((id) => afterPublish.byId.has(id)).length,
      );
      return result;
    }
    return original(from, to);
  });
  const result = await execute(workspace, 'apply-feedback', { file });
  restore();
  assert.deepEqual(visibility, [0, 3]);
  assert.equal(result.knowledge_base_ref, plan.knowledge_base_ref);
  assert.equal(result.release_ref, plan.knowledge.release_ref);
  const graph = await loadWorkspaceGraph({ workspace });
  for (const id of bundle.ids)
    assert.equal(
      graph.byId.get(id).data.approval.approved_by,
      'Isolated Fixture Owner',
    );
  assert.equal(
    graph.byId.get(plan.knowledge.answer_ref).data.release_refs[0],
    plan.knowledge.release_ref,
  );
  assert.equal(
    graph.byId.get(plan.knowledge.release_ref).data.answer_card_versions[0].ref,
    plan.knowledge.answer_ref,
  );
  assert.equal(
    JSON.parse(await readFile(path.join(workspace, 'workspace.json'), 'utf8'))
      .knowledge_base_ref,
    plan.knowledge_base_ref,
  );
  const after = await snapshot(workspace),
    added = Object.keys(after).filter((item) => !before[item]);
  for (const file of bundle.files) assert.ok(added.includes(file));
  assert.deepEqual(
    without(after, [...added, 'workspace.json']),
    without(before, ['workspace.json']),
  );
  assert.ok(
    !Object.keys(after).some((item) => item.startsWith('runs/undefined/')),
  );
  assert.ok(
    !Object.keys(after).some((item) => item.includes('/outputs/real-bundles/')),
  );
  assert.equal((await execute(workspace, 'inbox')).pending.length, 0);
  await execute(workspace, 'apply-feedback', { file });
  assert.deepEqual(await snapshot(workspace), after);
  assert.equal(network.mock.callCount(), 0);
});

test('continue recovers a persisted Owner approval after group publish but before identity switch and application receipt', async (t) => {
  const { workspace, plan, network } = await fixture(t);
  await execute(workspace, 'start');
  const file = await feedback(workspace, 'approve'),
    text = await readFile(file, 'utf8'),
    before = await snapshot(workspace);
  const bundle = bundleFiles(plan),
    application = `reviews/applications/${packageId}-${sha256(text)}.json`;
  let groupPublished = false;
  const restore = watchRename(t, async (from, to, original) => {
    if (to === path.join(workspace, 'workspace.json')) {
      assert.equal(groupPublished, true);
      throw Object.assign(
        new Error('Injected failure after atomic group publication.'),
        { code: 'TEST_IDENTITY_SWITCH_CRASH' },
      );
    }
    const result = await original(from, to);
    if (to === path.join(workspace, bundle.folder)) groupPublished = true;
    return result;
  });
  await assert.rejects(execute(workspace, 'apply-feedback', { file }), {
    code: 'TEST_IDENTITY_SWITCH_CRASH',
  });
  restore();
  const interrupted = await snapshot(workspace);
  assert.equal(groupPublished, true);
  assert.equal(
    JSON.parse(await readFile(path.join(workspace, 'workspace.json'), 'utf8'))
      .knowledge_base_ref,
    null,
  );
  assert.equal(interrupted[application], undefined);
  assert.ok(interrupted[`reviews/decisions/${packageId}.json`]);
  const interruptedGraph = await loadWorkspaceGraph({ workspace });
  assert.equal(
    bundle.ids.filter((id) => interruptedGraph.byId.has(id)).length,
    3,
  );
  for (const [oldPath, fingerprint] of Object.entries(before))
    assert.deepEqual(interrupted[oldPath], fingerprint, oldPath);
  // Recovery must use the durable original receipt, even if the input file has
  // gone away. No second approval and no generated decision are provided.
  await rm(file);
  await execute(workspace, 'continue');
  const recovered = await snapshot(workspace);
  assert.equal(
    JSON.parse(await readFile(path.join(workspace, 'workspace.json'), 'utf8'))
      .knowledge_base_ref,
    plan.knowledge_base_ref,
  );
  assert.ok(recovered[application]);
  assert.equal(
    JSON.parse(await readFile(path.join(workspace, application), 'utf8'))
      .decision_sha256,
    sha256(text),
  );
  for (const item of bundle.files)
    assert.deepEqual(recovered[item], interrupted[item], item);
  assert.deepEqual(
    recovered[`reviews/decisions/${packageId}.json`],
    interrupted[`reviews/decisions/${packageId}.json`],
  );
  const graph = await loadWorkspaceGraph({ workspace });
  assert.equal(bundle.ids.filter((id) => graph.byId.has(id)).length, 3);
  assert.equal((await execute(workspace, 'inbox')).pending.length, 0);
  await execute(workspace, 'continue');
  assert.deepEqual(await snapshot(workspace), recovered);
  assert.equal(network.mock.callCount(), 0);
});

test('Owner pause is a zero-write gate for direct commands and frozen runtime authorization', async (t) => {
  const { workspace, plan, network } = await fixture(t);
  const frozen = structuredClone(plan);
  await write(workspace, planPath, { ...plan, execution_paused: true });
  const before = await snapshot(workspace);
  const { assertRealAuthorization } = await import(
    '../plugins/geo-expert/scripts/lib/real-journey-store.mjs'
  );
  await assert.rejects(
    assertRealAuthorization(workspace, frozen),
    (error) => error.code === 'REAL_EXECUTION_PAUSED',
  );
  for (const command of ['start', 'continue'])
    await assert.rejects(
      execute(workspace, command),
      (error) => error.code === 'REAL_EXECUTION_PAUSED',
    );
  const result = await execute(workspace, 'preflight');
  assert.ok(result.blockers.some((b) => b.code === 'REAL_EXECUTION_PAUSED'));
  assert.equal(result.safe_to_create, false);
  assert.deepEqual(await snapshot(workspace), before);
  assert.equal(network.mock.callCount(), 0);
});
