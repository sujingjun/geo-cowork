import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  prepareOneGlanse,
  startOneGlanse,
  statusOneGlanse,
  receiveOneGlanse,
  analyzeOneGlanse,
  readCompleteResponse,
} from '../plugins/geo-expert/scripts/lib/oneglanse-intake.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

async function fixture(t) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'geo-oneglanse-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await mkdir(path.join(workspace, 'queries'));
  await writeFile(
    path.join(workspace, 'workspace.json'),
    JSON.stringify({ workspace_id: 'ws-test', brand: 'Example' }),
  );
  await writeFile(
    path.join(workspace, 'queries/query.md'),
    '---\nid: Q-EXAMPLE-001\nrecord_type: query\nversion: 1.0.0\nquery_text: What is Example?\nnormalized_text: what is example\ndiscovery_source_refs: [SRC-EXAMPLE-001]\n---\n',
  );
  const plan = {
    schema_version: 'oneglanse-run-plan-v1',
    run_id: 'RUN-EXAMPLE-001',
    workspace_id: 'ws-test',
    oneglanse_workspace_id: 'remote-test',
    provider: 'gemini',
    query: {
      path: 'queries/query.md',
      ref: 'Q-EXAMPLE-001',
      version: '1.0.0',
      field: 'normalized_text',
    },
    authorization: {
      scope: 'single-query-engineering',
      automatic_analysis: true,
      reference: 'fixture://oneglanse-contract',
    },
  };
  const raw = {
    id: 'r1',
    workspace_id: 'remote-test',
    prompt_id: 'p1',
    prompt: 'what is example',
    model: 'gemini',
    model_provider: 'gemini',
    prompt_run_at: '2026-01-01 00:00:00',
    created_at: '2026-01-01 00:01:00',
    response: 'Example 全文 🐱\n'.repeat(12000),
    sources: [
      {
        title: 'Title',
        cited_text: '引用🐱'.repeat(5000),
        url: 'https://example.invalid/ref#section',
        domain: 'example.invalid',
        favicon: null,
      },
    ],
  };
  const bytes = Buffer.from(JSON.stringify(raw));
  const state = {
    calls: [],
    starts: 0,
    scope: {
      prompts: [{ id: 'p1', prompt: 'what is example' }],
      ready_providers: ['gemini'],
      revision: 'a'.repeat(64),
    },
  };
  async function call(name, args) {
    state.calls.push({ name, args });
    assert.equal(args.workspace_id, 'remote-test');
    if (name === 'oneglanse_capabilities')
      return {
        contract_version: '1.0.0',
        server_version: '0.1.0',
        collector_version: 'fixture',
        limits: { automatic_analysis: true },
        allowed: { providers: ['gemini'], prompt_texts: ['what is example'] },
      };
    if (['oneglanse_prompts_read', 'oneglanse_prompts_save'].includes(name))
      return {
        prompts: [{ id: 'p1', prompt: 'what is example' }],
        revision: 'b'.repeat(64),
      };
    if (name === 'oneglanse_workspace_read')
      return { id: 'remote-test', run_scope: state.scope };
    if (name === 'oneglanse_run_start') {
      state.starts++;
      return {
        status: 'queued',
        job_id: 'job-native',
        job_receipt: 'signed-receipt',
      };
    }
    if (name === 'oneglanse_run_status')
      return {
        job_id: 'job-native',
        availability: 'unavailable',
        progress: null,
      };
    if (name === 'oneglanse_responses_list')
      return { items: [{ id: 'r1' }], next_cursor: null };
    if (name === 'oneglanse_response_read') {
      const end = Math.min(bytes.length, args.offset_bytes + args.max_bytes);
      return {
        response_id: 'r1',
        encoding: 'base64',
        content_type: 'application/json; charset=utf-8',
        total_bytes: bytes.length,
        sha256: sha256(bytes),
        offset_bytes: args.offset_bytes,
        next_offset: end === bytes.length ? null : end,
        data: bytes.subarray(args.offset_bytes, end).toString('base64'),
      };
    }
    throw new Error(`Unexpected tool ${name}`);
  }
  return {
    workspace,
    plan,
    call,
    state,
    raw,
    bytes,
    base: path.join(workspace, 'runs/RUN-EXAMPLE-001/oneglanse-intake'),
  };
}

test('single Query saves exact mapping, starts once, receives full raw bytes and analyzes locally', async (t) => {
  const f = await fixture(t);
  assert.equal((await prepareOneGlanse(f)).prompt_id, 'p1');
  const prepared = JSON.parse(
    await readFile(path.join(f.base, 'prepared.json')),
  );
  assert.equal(prepared.query.original_text, 'What is Example?');
  assert.equal(prepared.query.submitted_text, 'what is example');
  assert.deepEqual(
    f.state.calls.find((c) => c.name === 'oneglanse_prompts_save').args.prompts,
    ['what is example'],
  );
  assert.equal((await startOneGlanse(f)).reused, false);
  assert.equal((await startOneGlanse(f)).reused, true);
  assert.equal(f.state.starts, 1);
  assert.equal((await statusOneGlanse(f)).availability, 'unavailable');
  assert.equal(f.state.starts, 1);
  assert.equal((await receiveOneGlanse(f)).response_count, 1);
  const intake = JSON.parse(await readFile(path.join(f.base, 'received.json')));
  const file = path.join(f.workspace, intake.responses[0].path);
  assert.deepEqual(await readFile(file), f.bytes);
  await receiveOneGlanse(f);
  assert.deepEqual(await readFile(file), f.bytes);
  const offline = {
    ...f,
    call: () => {
      throw new Error('Analysis must be offline');
    },
  };
  assert.equal(
    (await analyzeOneGlanse(offline)).formal_baseline_eligible,
    false,
  );
  await analyzeOneGlanse(offline);
  const analysis = JSON.parse(
    await readFile(path.join(f.base, 'analysis.json')),
  );
  assert.equal(analysis.observations[0].sources[0].occurrence_count, null);
  assert.equal(
    analysis.observations[0].sources[0].cited_text,
    f.raw.sources[0].cited_text,
  );
  assert.equal(analysis.formal_cycle_resumed, false);
  await writeFile(file, 'tampered');
  await assert.rejects(analyzeOneGlanse(offline), { code: 'INTAKE_INTEGRITY' });
});

test('unknown start is durable and never resubmitted, including concurrent attempts', async (t) => {
  const f = await fixture(t);
  await prepareOneGlanse(f);
  let attempts = 0;
  const call = async (name, args) => {
    if (name === 'oneglanse_run_start') {
      attempts++;
      throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
    }
    return f.call(name, args);
  };
  const outcomes = await Promise.allSettled([
    startOneGlanse({ ...f, call }),
    startOneGlanse({ ...f, call }),
  ]);
  assert.ok(outcomes.every((o) => o.status === 'rejected'));
  assert.equal(attempts, 1);
  await assert.rejects(startOneGlanse({ ...f, call }), {
    code: 'SUBMISSION_UNKNOWN',
  });
  assert.equal(attempts, 1);
});

test('workspace, Query drift and widened effective scope block submission', async (t) => {
  const f = await fixture(t);
  await assert.rejects(
    prepareOneGlanse({ ...f, plan: { ...f.plan, workspace_id: 'other' } }),
    { code: 'WORKSPACE_MISMATCH' },
  );
  await prepareOneGlanse(f);
  f.state.scope.ready_providers.push('chatgpt');
  await assert.rejects(startOneGlanse(f), { code: 'RUN_SCOPE_MISMATCH' });
  assert.equal(f.state.starts, 0);
  f.state.scope.ready_providers.pop();
  await writeFile(path.join(f.workspace, 'queries/query.md'), 'changed');
  await assert.rejects(startOneGlanse(f), { code: 'QUERY_VERSION_MISMATCH' });
});

test('truncated, corrupt, changing and non-progressing chunks are rejected', async (t) => {
  const f = await fixture(t);
  for (const mutate of [
    (c) => ({ ...c, next_offset: null }),
    (c) => ({ ...c, data: Buffer.from('corrupt').toString('base64') }),
    (c) => ({ ...c, next_offset: 0 }),
    (c) => ({ ...c, sha256: 'f'.repeat(64) }),
    (c) => ({ ...c, response_id: 'other' }),
  ]) {
    const call = async (name, args) => mutate(await f.call(name, args));
    await assert.rejects(
      readCompleteResponse(call, { workspace_id: 'remote-test' }, 'r1'),
      { code: 'INTAKE_INTEGRITY' },
    );
  }
});

test('no responses does not freeze an empty window, and broken pagination does not publish intake', async (t) => {
  const f = await fixture(t);
  await prepareOneGlanse(f);
  await startOneGlanse(f);
  const running = async (name, args) =>
    name === 'oneglanse_run_status'
      ? {
          job_id: 'job-native',
          availability: 'available',
          progress: { status: 'pending' },
        }
      : f.call(name, args);
  await assert.rejects(receiveOneGlanse({ ...f, call: running }), {
    code: 'RUN_IN_PROGRESS',
  });
  const call = async (name, args) =>
    name === 'oneglanse_responses_list'
      ? { items: [], next_cursor: null }
      : f.call(name, args);
  await assert.rejects(receiveOneGlanse({ ...f, call }), {
    code: 'NO_RESPONSES_YET',
  });
  await assert.rejects(readFile(path.join(f.base, 'response-filter.json')), {
    code: 'ENOENT',
  });
  const loop = async (name, args) =>
    name === 'oneglanse_responses_list'
      ? { items: [{ id: 'r1' }], next_cursor: 'r1' }
      : f.call(name, args);
  await assert.rejects(receiveOneGlanse({ ...f, call: loop }), {
    code: 'INTAKE_INTEGRITY',
  });
  await assert.rejects(readFile(path.join(f.base, 'received.json')), {
    code: 'ENOENT',
  });
});

test('local paths cannot escape through Query paths or symlinked Run directories', async (t) => {
  const f = await fixture(t);
  await assert.rejects(
    prepareOneGlanse({
      ...f,
      plan: { ...f.plan, query: { ...f.plan.query, path: '../outside.md' } },
    }),
    { code: 'PATH_ESCAPE' },
  );
  await symlink(os.tmpdir(), path.join(f.workspace, 'runs'));
  await assert.rejects(prepareOneGlanse(f), { code: 'SYMLINK_NOT_ALLOWED' });
});
