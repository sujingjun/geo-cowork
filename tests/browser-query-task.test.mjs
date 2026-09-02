import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

import matter from 'gray-matter';

import {
  completeBrowserQuery,
  failBrowserQuery,
  markBrowserQueryUncertain,
  openBrowserQueryTask,
  recoverBrowserQueryTask,
  retryBrowserQuery,
  startBrowserQuery,
} from '../plugins/geo-expert/scripts/lib/browser-query-task.mjs';
import { createBrowserQueryTaskServer } from '../plugins/geo-expert/scripts/browser-query-task.mjs';
import { materializeSuccessfulBrowserAttempt } from '../plugins/geo-expert/scripts/lib/browser-query-task-attempt.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { withBrowserQueryTaskLease } from '../plugins/geo-expert/scripts/lib/browser-query-task-store.mjs';
import { createM6FrozenCycleWorkspace } from './helpers/m6-cycle-fixtures.mjs';

function fixturePlan(taskId = 'BQT-TEST-001') {
  return {
    schema_version: 'geo-browser-query-task-plan-v1',
    task_id: taskId,
    cycle_ref: 'CYC-M6-TEST-001',
    cycle_version: '1.0.0',
    query_set: { ref: 'QS-M6-TEST-001', version: '1.0.0' },
    authorization_ref: 'fixture://authorization/browser-query-task',
    development_fixture: true,
    platform: {
      id: 'fixture',
      entry_url: 'http://127.0.0.1:9321/task',
      execution_mode: 'dom_automation',
      selector_version: 'fixture-selectors-v1',
      terminal_detector_version: 'fixture-terminal-v1',
      selectors: {
        input: '#prompt',
        submit: '#submit',
        answer: '.answer',
        citation: '.answer a',
        busy: '[aria-busy="true"]',
        timeout_ms: 30_000,
        stable_ms: 500,
      },
    },
  };
}

async function browserTaskWorkspace() {
  return (await createM6FrozenCycleWorkspace()).root;
}

async function addManualAuthorization(workspace, plan) {
  const decisionRef = 'workspace://cycles/preparation/decisions/browser-query-task-approved.json';
  const decision = {
    schema_version: 'geo-browser-query-authorization-v1',
    status: 'approved',
    decision_ref: decisionRef,
    platform: plan.platform.id,
    product_entry: plan.platform.entry_url,
    login_state: 'logged_in',
    region: 'US',
    language: 'en-US',
    collection_method: 'manual',
    query_submission_allowed: true,
    allowed_artifacts: ['answer_text', 'citation_raw', 'collector_log'],
    artifact_retention_days: {
      answer_text: 365,
      citation_raw: 365,
      collector_log: 365,
    },
    privacy: {
      answer_region_only: true,
      account_identifier_stored: false,
      credentials_stored: false,
    },
    access_roles: ['Fixture Owner'],
    deletion_responsibility: 'Fixture Owner',
    stop_conditions: [
      'challenge', 'account_warning', 'privacy_minimization_failed', 'selector_drift',
    ],
    external_writes: false,
    approved_by: 'Fixture Owner',
    approved_at: '2026-09-02T00:00:00Z',
    expires_at: '2026-10-02T00:00:00Z',
  };
  const bytes = Buffer.from(`${JSON.stringify(decision, null, 2)}\n`);
  const relative = decisionRef.slice('workspace://'.length);
  await mkdir(path.dirname(path.join(workspace, relative)), { recursive: true });
  await writeFile(path.join(workspace, relative), bytes);
  plan.authorization_ref = decisionRef;
  plan.authorization_sha256 = sha256(bytes);
  return plan;
}

test('Query task 持久化失败、重试与完整回答/Citation 回写', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan();
  const queryPath = `${workspace}/queries/formal/query.md`;
  const originalQuery = await readFile(queryPath, 'utf8');
  const expectedQueryText = matter(originalQuery).data.query_text;
  try {
    const opened = await openBrowserQueryTask({
      workspace,
      plan,
      now: '2026-09-02T10:00:00Z',
    });
    assert.equal(opened.action, 'created');
    assert.equal(opened.state.status, 'pending');
    assert.equal(opened.state.queries[0].query_text, expectedQueryText);
    assert.equal(opened.state.cycle_binding.cycle.ref, 'CYC-M6-TEST-001');

    const started = await startBrowserQuery({
      workspace,
      plan,
      now: '2026-09-02T10:01:00Z',
    });
    assert.equal(started.query.attempt_count, 1);
    assert.equal(started.state.status, 'running');

    const recovered = await recoverBrowserQueryTask({
      workspace,
      plan,
      now: '2026-09-02T10:01:30Z',
    });
    assert.equal(recovered.state.status, 'waiting_human');
    assert.equal(recovered.query?.status ?? recovered.state.queries[0].status, 'waiting_human');

    const failed = await failBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      reason: 'fixture selector drift',
      now: '2026-09-02T10:02:00Z',
    });
    assert.equal(failed.state.status, 'failed');
    assert.equal(failed.query.attempts[0].failure_reason, 'fixture selector drift');
    assert.match(
      await readFile(`${workspace}/${failed.query.attempts[0].collector_log_path}`, 'utf8'),
      /fixture selector drift/,
    );

    const retried = await retryBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      now: '2026-09-02T10:03:00Z',
    });
    assert.equal(retried.query.status, 'pending');
    await startBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      now: '2026-09-02T10:04:00Z',
    });
    await assert.rejects(
      completeBrowserQuery({
        workspace,
        plan,
        queryRef: 'Q-M6-TEST-001',
        answerText: 'Unsafe capture must not land.',
        citations: [{ url: 'https://source.example/page?access_token=secret' }],
        resultUrl: 'http://127.0.0.1:9321/result/unsafe',
        now: '2026-09-02T10:04:30Z',
      }),
      error => error.code === 'PRIVACY_SCOPE_VIOLATION',
    );
    const completed = await completeBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      answerText: 'Synthetic complete answer with source.',
      citations: [
        { url: 'HTTPS://www.source.example:443/page#fragment', title: 'Source A', context: 'Answer source' },
        { url: 'https://www.source.example/page#second', title: 'Source A again', context: '' },
      ],
      resultUrl: 'http://127.0.0.1:9321/result/2',
      now: '2026-09-02T10:05:00Z',
    });
    assert.equal(completed.state.status, 'completed');
    assert.equal(completed.query.attempt_count, 2);
    assert.equal(completed.capture.artifacts.length, 3);
    assert.deepEqual(completed.capture.privacy, {
      account_identifier_stored: false,
      credentials_stored: false,
      answer_region_only: true,
    });
    const capture = JSON.parse(await readFile(
      `${workspace}/${completed.query.attempts[1].capture_path}`,
      'utf8',
    ));
    assert.equal(capture.query_ref, 'Q-M6-TEST-001');
    assert.equal(capture.outcome, 'success');
    const citationArtifact = capture.artifacts.find((artifact) => artifact.role === 'citation_raw');
    const answerArtifact = capture.artifacts.find((artifact) => artifact.role === 'answer_text');
    assert.equal(
      await readFile(`${workspace}/${answerArtifact.path}`, 'utf8'),
      'Synthetic complete answer with source.',
      '完整回答字节不得被改写',
    );
    const citationRaw = JSON.parse(await readFile(`${workspace}/${citationArtifact.path}`, 'utf8'));
    assert.equal(citationRaw.length, 2, '重复 Citation occurrence 必须保留');
    assert.equal(citationRaw[0].url_normalized, 'https://www.source.example/page');

    const resumed = await openBrowserQueryTask({
      workspace,
      plan,
      now: '2026-09-02T11:00:00Z',
    });
    assert.equal(resumed.action, 'resumed');
    assert.equal(resumed.state.status, 'completed');
    assert.equal(await readFile(queryPath, 'utf8'), originalQuery, '不得改写 canonical Query');
    const statePath = path.join(workspace, resumed.state_path);
    const stateBytes = await readFile(statePath);
    const tamperedState = JSON.parse(stateBytes.toString('utf8'));
    tamperedState.queries[0].query_text = 'tampered query';
    await writeFile(statePath, JSON.stringify(tamperedState, null, 2));
    await assert.rejects(
      openBrowserQueryTask({ workspace, plan, now: '2026-09-02T11:00:30Z' }),
      error => error.code === 'QUERY_TASK_STATE_CONFLICT',
    );
    await writeFile(statePath, stateBytes);
    await writeFile(`${workspace}/${answerArtifact.path}`, 'tampered');
    await assert.rejects(
      openBrowserQueryTask({ workspace, plan, now: '2026-09-02T11:01:00Z' }),
      error => error.code === 'QUERY_TASK_ARTIFACT_CHECKSUM_MISMATCH',
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('Cycle 与 Query Set 精确绑定不匹配时拒绝创建任务', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-CYCLE-MISMATCH');
  plan.query_set.ref = 'QS-OTHER-001';
  try {
    await assert.rejects(
      openBrowserQueryTask({ workspace, plan }),
      error => error.code === 'CYCLE_QUERY_SET_MISMATCH',
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('同一 attempt 已冻结 success 后不能再记录 system_failure', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-OUTCOME-CONFLICT');
  try {
    await openBrowserQueryTask({ workspace, plan });
    const started = await startBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      now: '2026-09-02T13:00:00Z',
    });
    const query = started.state.queries[0];
    const materialized = await materializeSuccessfulBrowserAttempt({
      workspace,
      state: started.state,
      query,
      attempt: query.attempts[0],
      answerText: 'Crash-window answer.',
      citations: [],
      resultUrl: 'http://127.0.0.1:9321/result',
      now: '2026-09-02T13:01:00Z',
    });
    const outcomeJournal = await readFile(
      path.join(workspace, materialized.outcome_path),
      'utf8',
    );
    assert.doesNotMatch(outcomeJournal, /Crash-window answer/);
    await Promise.all([
      materialized.capture_path,
      materialized.capture.artifacts.find((artifact) => artifact.role === 'collector_log').path,
    ].map((relative) => rm(path.join(workspace, relative))));
    await assert.rejects(
      failBrowserQuery({
        workspace,
        plan,
        queryRef: 'Q-M6-TEST-001',
        reason: 'incorrect opposite outcome',
        now: '2026-09-02T13:02:00Z',
      }),
      error => error.code === 'QUERY_ATTEMPT_OUTCOME_CONFLICT',
    );
    const recovered = await recoverBrowserQueryTask({
      workspace,
      plan,
      now: '2026-09-02T13:03:00Z',
    });
    assert.equal(recovered.state.status, 'completed');
    assert.equal(recovered.state.queries[0].attempts[0].outcome, 'success');
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('challenge 是停止终态且不能作为 system failure 重试', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-CHALLENGE');
  try {
    await openBrowserQueryTask({ workspace, plan });
    await startBrowserQuery({ workspace, plan, queryRef: 'Q-M6-TEST-001' });
    const blocked = await failBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      outcome: 'challenge',
      reason: 'platform challenge observed',
    });
    assert.equal(blocked.state.status, 'blocked');
    assert.equal(blocked.query.attempts[0].outcome, 'challenge');
    await assert.rejects(
      retryBrowserQuery({ workspace, plan, queryRef: 'Q-M6-TEST-001' }),
      error => error.code === 'QUERY_TASK_TRANSITION_INVALID',
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('提交后异常进入 waiting_human，不能直接重试但可人工补录终态', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-UNCERTAIN');
  try {
    await openBrowserQueryTask({ workspace, plan });
    await startBrowserQuery({ workspace, plan, queryRef: 'Q-M6-TEST-001' });
    const uncertain = await markBrowserQueryUncertain({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      reason: 'extension transport disconnected after submit',
    });
    assert.equal(uncertain.state.status, 'waiting_human');
    await assert.rejects(
      retryBrowserQuery({ workspace, plan, queryRef: 'Q-M6-TEST-001' }),
      error => error.code === 'QUERY_TASK_TRANSITION_INVALID',
    );
    const completed = await completeBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      answerText: 'Human-confirmed complete answer.',
      citations: [],
      resultUrl: 'http://127.0.0.1:9321/result',
    });
    assert.equal(completed.state.status, 'completed');
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('持久 lease 阻止第二个服务进程同时改写 task state', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-LEASE');
  try {
    const opened = await openBrowserQueryTask({
      workspace,
      plan,
      now: '2026-09-02T14:00:00Z',
    });
    await withBrowserQueryTaskLease({
      workspace,
      taskId: plan.task_id,
      fingerprint: opened.state.plan_fingerprint,
      expectedRevision: opened.state.revision,
      ttlMs: 1_200,
      async operation({ assertCurrent }) {
        await new Promise(resolve => setTimeout(resolve, 1_300));
        await assertCurrent();
        await assert.rejects(
          startBrowserQuery({
            workspace,
            plan,
            queryRef: 'Q-M6-TEST-001',
            now: '2026-09-02T14:00:02Z',
          }),
          error => error.code === 'QUERY_TASK_LEASE_ACTIVE',
        );
      },
    });
    await mkdir(path.join(
      workspace,
      'runs',
      plan.task_id,
      '.browser-query-task-lease',
    ));
    const recovered = await startBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
    });
    assert.equal(recovered.state.status, 'running');
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('已登录不绕过消费者平台 automation policy', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-POLICY');
  plan.development_fixture = false;
  plan.authorization_ref = 'workspace://decisions/browser-query-task-approved.md';
  plan.authorization_sha256 = '0'.repeat(64);
  plan.platform = {
    id: 'chatgpt',
    entry_url: 'https://chatgpt.com/',
    execution_mode: 'dom_automation',
    selectors: {
      input: '#prompt-textarea', submit: '[data-testid="send-button"]',
      answer: '[data-message-author-role="assistant"]', citation: 'a[href]',
    },
  };
  try {
    await assert.rejects(
      openBrowserQueryTask({ workspace, plan }),
      error => error.code === 'PLATFORM_TERMS_BLOCKED',
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('消费者平台 manual assist 可保存人工提供的完整结果', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-MANUAL');
  plan.development_fixture = false;
  plan.platform = {
    id: 'chatgpt',
    entry_url: 'https://chatgpt.com/',
    execution_mode: 'manual_assist',
  };
  await addManualAuthorization(workspace, plan);
  try {
    const opened = await openBrowserQueryTask({ workspace, plan });
    assert.equal(opened.state.platform.execution_mode, 'manual_assist');
    assert.equal(opened.state.platform.policy.status, 'manual_only');
    await startBrowserQuery({ workspace, plan, queryRef: 'Q-M6-TEST-001' });
    const completed = await completeBrowserQuery({
      workspace,
      plan,
      queryRef: 'Q-M6-TEST-001',
      answerText: 'Owner supplied complete answer.',
      citations: [],
      resultUrl: 'https://chatgpt.com/share/fixture-result',
    });
    assert.equal(completed.state.status, 'completed');
    assert.equal(completed.capture.execution_mode, 'manual_assist');
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('真实平台 authorization bytes 漂移时在创建 task 前失败', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-AUTH-DRIFT');
  plan.development_fixture = false;
  plan.platform = {
    id: 'chatgpt',
    entry_url: 'https://chatgpt.com/',
    execution_mode: 'manual_assist',
  };
  await addManualAuthorization(workspace, plan);
  plan.authorization_sha256 = '0'.repeat(64);
  try {
    await assert.rejects(
      openBrowserQueryTask({ workspace, plan }),
      error => error.code === 'COLLECTION_AUTHORIZATION_REQUIRED',
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('loopback HTTP 服务要求临时 token 并恢复任务状态', async () => {
  const workspace = await browserTaskWorkspace();
  const plan = fixturePlan('BQT-TEST-HTTP');
  const token = 'test-session-token-123456';
  let tick = 0;
  const server = createBrowserQueryTaskServer({
    workspace,
    plan,
    token,
    now: () => `2026-09-02T12:00:0${tick++}Z`,
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  try {
    const denied = await fetch(`${base}/api/task`, {
      headers: { Origin: 'chrome-extension://test-extension' },
    });
    assert.equal(denied.status, 401);
    const loaded = await fetch(`${base}/api/task`, {
      headers: {
        Origin: 'chrome-extension://test-extension',
        Authorization: `Bearer ${token}`,
      },
    });
    assert.equal(loaded.status, 200);
    assert.equal((await loaded.json()).state.task_id, 'BQT-TEST-HTTP');
    const startRequest = () => fetch(`${base}/api/task/start`, {
      method: 'POST',
      headers: {
        Origin: 'chrome-extension://test-extension',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query_ref: 'Q-M6-TEST-001' }),
    });
    const concurrent = await Promise.all([startRequest(), startRequest()]);
    assert.deepEqual(concurrent.map(response => response.status).sort(), [200, 409]);
    const accepted = concurrent.find(response => response.status === 200);
    assert.equal((await accepted.json()).state.status, 'running');
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(workspace, { recursive: true });
  }
});
