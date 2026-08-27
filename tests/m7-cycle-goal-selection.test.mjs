import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import {
  buildDecidedGoalSelection,
  buildDraftGoalSelection,
  validateGoalSelection,
} from '../plugins/geo-expert/scripts/lib/cycle-goal-selection.mjs';
import {
  M7_CONTEXT,
  buildProductCandidateBundle,
  readFixtureJson,
} from './helpers/m7-cycle2-fixtures.mjs';

const exec = promisify(execFile);

test('GSEL draft 不含 selected/approval/supersedes，Tool 不自动选择', () => {
  const { batch, candidates } = buildProductCandidateBundle();
  const draft = buildDraftGoalSelection({ context: M7_CONTEXT, batch, candidates });
  assert.equal(draft.status, 'draft');
  assert.equal(draft.decision.selected_candidate_version, null);
  assert.deepEqual(draft.decision.rejected_candidate_versions, []);
  assert.deepEqual(draft.decision.deferred_candidate_versions, []);
  assert.equal(draft.approval, undefined);
  assert.equal(draft.supersedes_ref, undefined);
  assert.deepEqual(validateGoalSelection(draft).errors, []);
});

test('fresh Node process 只凭 draft + fixture human decision 创建新 decided GSEL', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m7-gsel-fresh-'));
  try {
    const { batch, candidates } = buildProductCandidateBundle();
    const draft = buildDraftGoalSelection({ context: M7_CONTEXT, batch, candidates });
    const decision = await readFixtureJson('decisions/goal-selection.json');
    decision.selected_candidate_ref = candidates[0].id;
    const draftPath = path.join(root, 'draft.json');
    const decisionPath = path.join(root, 'decision.json');
    await writeFile(draftPath, `${JSON.stringify(draft)}\n`);
    await writeFile(decisionPath, `${JSON.stringify(decision)}\n`);
    const moduleUrl = new URL(
      '../plugins/geo-expert/scripts/lib/cycle-goal-selection.mjs',
      import.meta.url,
    ).href;
    const script = `
      import { readFile } from 'node:fs/promises';
      import { buildDecidedGoalSelection } from ${JSON.stringify(moduleUrl)};
      const draft = JSON.parse(await readFile(process.argv[1], 'utf8'));
      const decision = JSON.parse(await readFile(process.argv[2], 'utf8'));
      const context = {
        merchant_ref: draft.merchant_ref,
        test_scope: draft.test_scope,
        created_at: decision.approval.approved_at,
      };
      const selected = draft.candidate_versions.find((item) => item.ref === decision.selected_candidate_ref);
      const data = buildDecidedGoalSelection({
        context, draft, selected, rejected: [], deferred: [],
        reason: decision.reason, approval: decision.approval,
      });
      console.log(JSON.stringify({ data, conversation_history_used: false }));
    `;
    const child = await exec(process.execPath, [
      '--input-type=module', '-e', script, draftPath, decisionPath,
    ], { cwd: os.tmpdir() });
    const result = JSON.parse(child.stdout);
    assert.equal(result.conversation_history_used, false);
    assert.equal(result.data.status, 'decided');
    assert.notEqual(result.data.id, draft.id);
    assert.equal(result.data.supersedes_ref, draft.id);
    assert.deepEqual(validateGoalSelection(result.data, { prior: draft }).errors, []);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('decided GSEL 必须对同一 batch 做唯一、互斥、无遗漏分区', () => {
  const { batch, candidates } = buildProductCandidateBundle();
  const draft = buildDraftGoalSelection({ context: M7_CONTEXT, batch, candidates });
  const approval = {
    approved_by: 'Fixture Human', approved_at: M7_CONTEXT.created_at,
    decision_ref: 'fixture://decision/m7-selection-partition-001',
  };
  assert.throws(
    () => buildDecidedGoalSelection({
      context: M7_CONTEXT,
      draft,
      selected: candidates[0],
      rejected: [candidates[0]],
      deferred: [],
      reason: 'Invalid duplicate partition.',
      approval,
    }),
    (error) => error.code === 'GOAL_SELECTION_PARTITION_INVALID',
  );
  assert.throws(
    () => buildDecidedGoalSelection({
      context: M7_CONTEXT,
      draft,
      selected: null,
      rejected: [],
      deferred: [],
      reason: 'Invalid missing partition.',
      approval,
    }),
    (error) => error.code === 'GOAL_SELECTION_PARTITION_INVALID',
  );
});

test('无 selected 的完整拒绝/推迟决定合法，但不能启动 Cycle 2', () => {
  const { batch, candidates } = buildProductCandidateBundle();
  const draft = buildDraftGoalSelection({ context: M7_CONTEXT, batch, candidates });
  const decided = buildDecidedGoalSelection({
    context: M7_CONTEXT,
    draft,
    selected: null,
    rejected: [],
    deferred: candidates.map(({ id, version }) => ({ ref: id, version })),
    reason: 'Fixture human deferred all candidates.',
    approval: {
      approved_by: 'Fixture Human', approved_at: M7_CONTEXT.created_at,
      decision_ref: 'fixture://decision/m7-selection-deferred-001',
    },
  });
  assert.deepEqual(validateGoalSelection(decided, { prior: draft }).errors, []);
  assert.equal(decided.decision.selected_candidate_version, null);
});
