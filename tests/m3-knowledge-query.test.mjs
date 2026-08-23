import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  assembleKnowledgeRelease,
  assembleQuerySet,
  proposeKnowledge,
  querySetContentSha,
  traceQuery,
  validateKnowledgeWorkspace,
} from '../plugins/geo-expert/scripts/lib/knowledge-query.mjs';
import { validateObjectData } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  NOW,
  evidence,
  query,
  source,
  temporaryWorkspace,
  writeObject,
} from './helpers/object-fixtures.mjs';

const APPROVAL = {
  approved_by: 'Fixture Human Reviewer',
  approved_at: NOW,
  decision_ref: 'fixture://approval/decision-001',
};

async function approvedBase() {
  const root = await temporaryWorkspace('geo-m3-test-');
  const snapshotPath = 'evidence/snapshots/brand.txt';
  const snapshot = 'Synthetic Brand is a documented service.\n';
  await mkdir(path.join(root, 'evidence/snapshots'), { recursive: true });
  await writeFile(path.join(root, snapshotPath), snapshot);
  await writeObject(root, 'evidence/sources/source.md', source());
  await writeObject(root, 'evidence/records/evidence.md', evidence(snapshotPath, sha256(snapshot)));
  await writeObject(root, 'knowledge/documents/document.md', {
    id: 'DOC-TEST-001',
    record_type: 'document',
    status: 'approved',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic brand baseline',
    scope: 'Synthetic test only',
    source_refs: ['SRC-TEST-001'],
    legacy_refs: [],
    approval: APPROVAL,
  });
  await writeObject(root, 'cycles/preparation/goal.md', {
    id: 'GOAL-TEST-001',
    record_type: 'perception_goal',
    status: 'approved',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic definition goal',
    goal_statement: 'Represent Synthetic Brand accurately.',
    success_question: 'What is Synthetic Brand?',
    query_set_refs: [],
    approval: APPROVAL,
  });
  await writeObject(root, 'queries/formal/query.md', {
    ...query(),
    status: 'formal',
    normalized_text: 'what is synthetic brand',
    intent: 'definition',
    priority: 'P0',
    goal_refs: ['GOAL-TEST-001'],
    discovery_source_refs: ['SRC-TEST-001'],
    legacy_refs: [],
    approval: APPROVAL,
  });
  return { root, snapshotPath, snapshot };
}

test('approved Document 只能物化 candidate Claim/Answer Card，非 approved 拒绝', async () => {
  const { root } = await approvedBase();
  const plan = {
    document_ref: 'DOC-TEST-001',
    claims: [{
      path: 'knowledge/claims/claim.md',
      id: 'CLM-TEST-001',
      title: 'Synthetic capability claim',
      statement: 'Synthetic Brand provides a documented service.',
      risk_type: 'capability_fact',
      risk_level: 'medium',
      scope: 'Synthetic test only',
      evidence_refs: ['EVD-TEST-001'],
    }],
    answer_cards: [{
      path: 'knowledge/answer-cards/answer.md',
      id: 'ANS-TEST-001',
      title: 'What is Synthetic Brand?',
      query_refs: ['Q-TEST-001'],
      claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
      evidence_refs: ['EVD-TEST-001'],
      direct_answer: 'Synthetic Brand provides a documented service.',
      limitations: ['Synthetic fixture only.'],
      forbidden_statements: ['No guaranteed outcomes.'],
    }],
  };

  const result = await proposeKnowledge({ workspace: root, plan, now: NOW });
  assert.deepEqual(result.created.sort(), [
    'knowledge/answer-cards/answer.md',
    'knowledge/claims/claim.md',
  ]);
  const repeated = await proposeKnowledge({
    workspace: root,
    plan,
    now: '2026-08-24T01:00:00+08:00',
  });
  assert.deepEqual(repeated.kept.sort(), [
    'knowledge/answer-cards/answer.md',
    'knowledge/claims/claim.md',
  ]);
  const validation = await validateKnowledgeWorkspace({ workspace: root });
  assert.deepEqual(validation.errors, []);
  assert.ok(validation.warnings.some((warning) => warning.code === 'EVIDENCE_INSUFFICIENT'));

  await writeObject(root, 'knowledge/documents/document.md', {
    id: 'DOC-TEST-001',
    record_type: 'document',
    status: 'reviewed',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic brand baseline',
    scope: 'Synthetic test only',
    source_refs: ['SRC-TEST-001'],
    legacy_refs: [],
  });
  await assert.rejects(
    proposeKnowledge({ workspace: root, plan: { ...plan, claims: [], answer_cards: [] }, now: NOW }),
    (error) => error.code === 'DOCUMENT_NOT_APPROVED',
  );
  await rm(root, { recursive: true });
});

test('assemble 只创建 draft Query Set 与 draft Release，不自动 freeze/publish', async () => {
  const { root } = await approvedBase();
  await proposeKnowledge({
    workspace: root,
    now: NOW,
    plan: {
      document_ref: 'DOC-TEST-001',
      claims: [{
        path: 'knowledge/claims/claim.md', id: 'CLM-TEST-001', title: 'Claim',
        statement: 'Synthetic Brand provides a service.', risk_type: 'capability_fact',
        risk_level: 'medium', scope: 'Synthetic', evidence_refs: ['EVD-TEST-001'],
      }],
      answer_cards: [{
        path: 'knowledge/answer-cards/answer.md', id: 'ANS-TEST-001', title: 'Answer',
        query_refs: ['Q-TEST-001'], claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
        evidence_refs: ['EVD-TEST-001'], direct_answer: 'Synthetic answer.', limitations: [],
        forbidden_statements: [],
      }],
    },
  });
  const set = await assembleQuerySet({
    workspace: root,
    now: NOW,
    plan: {
      path: 'queries/sets/set.md', id: 'QS-TEST-001', title: 'Synthetic set',
      goal_refs: ['GOAL-TEST-001'], query_versions: [{ ref: 'Q-TEST-001', version: '1.0.0' }],
    },
  });
  const release = await assembleKnowledgeRelease({
    workspace: root,
    now: NOW,
    plan: {
      path: 'knowledge/releases/release.md', id: 'KR-TEST-001', title: 'Synthetic release',
      release_version: '1.0.0', claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
      answer_card_versions: [{ ref: 'ANS-TEST-001', version: '1.0.0' }],
    },
  });
  assert.equal(set.data.status, 'draft');
  assert.equal(release.data.status, 'draft');
  assert.equal(release.data.readiness, 'incomplete');
  const trace = await traceQuery({ workspace: root, queryId: 'Q-TEST-001' });
  assert.equal(trace.lifecycle_ready, false);
  assert.ok(trace.gates.some((gate) => gate.ref === 'QS-TEST-001'));
  assert.ok(trace.gates.some((gate) => gate.ref === 'KR-TEST-001'));
  await rm(root, { recursive: true });
});

test('formal/frozen/published 合成链通过，trace 可达 Source/Evidence/Document', async () => {
  const { root } = await approvedBase();
  const publishedClaim = {
    id: 'CLM-TEST-001', record_type: 'claim', status: 'published', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Published claim',
    statement: 'Synthetic Brand provides a documented service.', risk_type: 'capability_fact',
    risk_level: 'low', evidence_refs: ['EVD-TEST-001'], document_refs: ['DOC-TEST-001'],
    scope: 'Synthetic test only',
    evidence_sufficiency: {
      status: 'insufficient', rule_version: 'm3-evidence-sufficiency-v1', missing: ['data_or_case'],
    },
    release_refs: ['KR-TEST-001'], approval: APPROVAL,
  };
  await writeObject(root, 'knowledge/claims/claim.md', publishedClaim);
  await writeObject(root, 'knowledge/answer-cards/answer.md', {
    id: 'ANS-TEST-001', record_type: 'answer_card', status: 'published', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Published answer', query_refs: ['Q-TEST-001'],
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }], evidence_refs: ['EVD-TEST-001'],
    direct_answer: 'Synthetic Brand provides a documented service.', limitations: [], forbidden_statements: [],
    release_refs: ['KR-TEST-001'], approval: APPROVAL,
  });
  const queryVersions = [{
    ref: 'Q-TEST-001', version: '1.0.0', query_text: 'What is Synthetic Brand?', language: 'en',
  }];
  await writeObject(root, 'queries/sets/set.md', {
    id: 'QS-TEST-001', record_type: 'query_set', status: 'frozen', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Frozen set', goal_refs: ['GOAL-TEST-001'],
    query_versions: queryVersions.map(({ ref, version }) => ({ ref, version })),
    frozen_at: NOW, frozen_by: 'Fixture Human Reviewer',
    content_sha256: querySetContentSha(queryVersions), approval: APPROVAL,
  });
  await writeObject(root, 'knowledge/releases/release.md', {
    id: 'KR-TEST-001', record_type: 'knowledge_release', status: 'published', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Published release', release_version: '1.0.0',
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    answer_card_versions: [{ ref: 'ANS-TEST-001', version: '1.0.0' }],
    readiness: 'ready', approval: APPROVAL,
  });

  const validation = await validateKnowledgeWorkspace({ workspace: root });
  assert.deepEqual(validation.errors, []);
  assert.ok(validation.warnings.some((warning) => warning.code === 'EVIDENCE_INSUFFICIENT'));
  const trace = await traceQuery({ workspace: root, queryId: 'Q-TEST-001' });
  assert.deepEqual(trace.answer_card_refs, ['ANS-TEST-001']);
  assert.deepEqual(trace.claim_refs, ['CLM-TEST-001']);
  assert.deepEqual(trace.evidence_refs, ['EVD-TEST-001']);
  assert.deepEqual(trace.source_refs, ['SRC-TEST-001']);
  assert.deepEqual(trace.document_refs, ['DOC-TEST-001']);
  assert.deepEqual(trace.release_refs, ['KR-TEST-001']);
  assert.equal(trace.lifecycle_ready, true);
  assert.deepEqual(trace.gates, []);
  await writeObject(root, 'queries/sets/set.md', {
    id: 'QS-TEST-001', record_type: 'query_set', status: 'frozen', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Drifted set', goal_refs: ['GOAL-TEST-001'],
    query_versions: [{ ref: 'Q-TEST-001', version: '1.0.0' }],
    frozen_at: NOW, frozen_by: 'Fixture Human Reviewer', content_sha256: 'a'.repeat(64), approval: APPROVAL,
  });
  const drifted = await validateKnowledgeWorkspace({ workspace: root });
  assert.ok(drifted.errors.some((error) => error.code === 'VERSION_DRIFT'));
  await rm(root, { recursive: true });
});

test('stale Evidence 只给 warning；重复 formal Query 报错', async () => {
  const { root, snapshotPath, snapshot } = await approvedBase();
  await writeObject(root, 'evidence/records/evidence.md', evidence(snapshotPath, sha256(snapshot), {
    status: 'stale',
  }));
  await writeObject(root, 'queries/formal/query-duplicate.md', {
    ...query({ id: 'Q-TEST-002' }),
    status: 'formal', normalized_text: 'what is synthetic brand', intent: 'definition', priority: 'P0',
    goal_refs: ['GOAL-TEST-001'], discovery_source_refs: [], legacy_refs: [], approval: APPROVAL,
  });
  const validation = await validateKnowledgeWorkspace({ workspace: root });
  assert.ok(validation.warnings.some((warning) => warning.code === 'STALE_EVIDENCE'));
  assert.ok(validation.errors.some((error) => error.code === 'DUPLICATE_QUERY'));
  await rm(root, { recursive: true });
});

test('M3 validator 对只有 M2 最小字段的 Query/Claim 报迁移字段缺失', async () => {
  const root = await temporaryWorkspace('geo-m3-minimal-');
  await writeObject(root, 'queries/candidates/minimal.md', {
    id: 'Q-M3-MINIMAL-001', record_type: 'query', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, query_text: 'Minimal?', language: 'en',
  });
  await writeObject(root, 'knowledge/claims/minimal.md', {
    id: 'CLM-M3-MINIMAL-001', record_type: 'claim', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, statement: 'Minimal.', risk_type: 'ordinary_fact',
    risk_level: 'low', evidence_refs: [],
  });
  const validation = await validateKnowledgeWorkspace({ workspace: root });
  assert.ok(validation.errors.some((error) => error.code === 'M3_FIELD_REQUIRED'));
  await rm(root, { recursive: true });
});

test('propose 拒绝自动批准、重复输出与预检冲突，冲突前不产生半成品', async () => {
  const { root } = await approvedBase();
  const claimPlan = {
    path: 'knowledge/claims/planned.md', id: 'CLM-PLAN-001', title: 'Planned claim',
    statement: 'Synthetic planned claim.', risk_type: 'ordinary_fact', risk_level: 'low',
    scope: 'Synthetic', evidence_refs: ['EVD-TEST-001'],
  };
  await assert.rejects(
    proposeKnowledge({
      workspace: root, now: NOW,
      plan: { document_ref: 'DOC-TEST-001', claims: [{ ...claimPlan, status: 'approved' }], answer_cards: [] },
    }),
    (error) => error.code === 'AUTO_APPROVAL_FORBIDDEN',
  );
  await assert.rejects(
    proposeKnowledge({
      workspace: root, now: NOW,
      plan: {
        document_ref: 'DOC-TEST-001',
        claims: [claimPlan, { ...claimPlan, id: 'CLM-PLAN-002' }],
        answer_cards: [],
      },
    }),
    (error) => error.code === 'OBJECT_CONFLICT',
  );

  const occupied = path.join(root, 'knowledge/answer-cards/occupied.md');
  await writeFile(occupied, '# occupied\n');
  await assert.rejects(
    proposeKnowledge({
      workspace: root, now: NOW,
      plan: {
        document_ref: 'DOC-TEST-001',
        claims: [{ ...claimPlan, path: 'knowledge/claims/no-partial.md', id: 'CLM-NO-PARTIAL-001' }],
        answer_cards: [{
          path: 'knowledge/answer-cards/occupied.md', id: 'ANS-NO-PARTIAL-001', title: 'Answer',
          query_refs: ['Q-TEST-001'],
          claim_versions: [{ ref: 'CLM-NO-PARTIAL-001', version: '1.0.0' }],
          evidence_refs: ['EVD-TEST-001'], direct_answer: 'Synthetic answer.',
          limitations: [], forbidden_statements: [],
        }],
      },
    }),
    (error) => error.code === 'OBJECT_CONFLICT',
  );
  await assert.rejects(
    readFile(path.join(root, 'knowledge/claims/no-partial.md')),
    (error) => error.code === 'ENOENT',
  );
  await rm(root, { recursive: true });
});

test('stable ID 已在其他路径存在时，propose 明确冲突', async () => {
  const { root } = await approvedBase();
  const plan = {
    document_ref: 'DOC-TEST-001',
    claims: [{
      path: 'knowledge/claims/original.md', id: 'CLM-STABLE-001', title: 'Stable claim',
      statement: 'Synthetic stable claim.', risk_type: 'ordinary_fact', risk_level: 'low',
      scope: 'Synthetic', evidence_refs: ['EVD-TEST-001'],
    }],
    answer_cards: [],
  };
  await proposeKnowledge({ workspace: root, plan, now: NOW });
  await assert.rejects(
    proposeKnowledge({
      workspace: root,
      plan: {
        ...plan,
        claims: [{ ...plan.claims[0], path: 'knowledge/claims/moved.md' }],
      },
      now: NOW,
    }),
    (error) => error.code === 'OBJECT_CONFLICT' && error.existing_path === 'knowledge/claims/original.md',
  );
  await rm(root, { recursive: true });
});

test('M3 新对象的核心集合字段不允许为空', () => {
  const common = {
    version: '1.0.0', created_at: NOW, updated_at: NOW,
  };
  const invalid = [
    { ...common, id: 'DOC-EMPTY-001', record_type: 'document', status: 'draft', scope: 'x', source_refs: [] },
    {
      ...common, id: 'ANS-EMPTY-001', record_type: 'answer_card', status: 'candidate', query_refs: [],
      claim_versions: [], direct_answer: 'x', limitations: [], forbidden_statements: [],
    },
    {
      ...common, id: 'KR-EMPTY-001', record_type: 'knowledge_release', status: 'draft', release_version: '1.0.0',
      claim_versions: [], answer_card_versions: [], readiness: 'incomplete',
    },
    { ...common, id: 'QS-EMPTY-001', record_type: 'query_set', status: 'draft', goal_refs: [], query_versions: [] },
    {
      ...common, id: 'EPL-EMPTY-001', record_type: 'evidence_plan', status: 'draft', claim_refs: [],
      current_gap: 'x', required_evidence: [], minimum_acceptance: 'x', source_categories: [],
      provider_owner: 'x', acceptance_method: 'x', retest_query_refs: [],
    },
  ];
  for (const object of invalid) {
    assert.throws(
      () => validateObjectData(object),
      (error) => error.code === 'INVALID_FRONTMATTER',
      object.id,
    );
  }
});

test('validator 阻止无批准 formal、未批准 Goal 冻结与不完整 published Release', async () => {
  const { root } = await approvedBase();
  await writeObject(root, 'queries/formal/no-approval.md', {
    ...query({ id: 'Q-NO-APPROVAL-001' }), status: 'formal', normalized_text: 'synthetic without approval',
    goal_refs: ['GOAL-TEST-001'],
  });
  await writeObject(root, 'cycles/preparation/candidate-goal.md', {
    id: 'GOAL-CANDIDATE-001', record_type: 'perception_goal', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, goal_statement: 'Candidate goal.', success_question: 'Candidate?',
  });
  const versions = [{
    ref: 'Q-TEST-001', version: '1.0.0', query_text: 'What is Synthetic Brand?', language: 'en',
  }];
  await writeObject(root, 'queries/sets/unapproved-goal.md', {
    id: 'QS-UNAPPROVED-001', record_type: 'query_set', status: 'frozen', version: '1.0.0',
    created_at: NOW, updated_at: NOW, goal_refs: ['GOAL-CANDIDATE-001'],
    query_versions: [{ ref: 'Q-TEST-001', version: '1.0.0' }], frozen_at: NOW,
    frozen_by: 'Fixture Human Reviewer', content_sha256: querySetContentSha(versions), approval: APPROVAL,
  });
  await writeObject(root, 'knowledge/claims/incomplete.md', {
    id: 'CLM-INCOMPLETE-001', record_type: 'claim', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, statement: 'Incomplete.', risk_type: 'ordinary_fact', risk_level: 'low',
    evidence_refs: [], document_refs: ['DOC-TEST-001'], scope: 'Synthetic',
    evidence_sufficiency: { status: 'sufficient', rule_version: 'm3-evidence-sufficiency-v1', missing: [] },
  });
  await writeObject(root, 'knowledge/answer-cards/incomplete.md', {
    id: 'ANS-INCOMPLETE-001', record_type: 'answer_card', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, query_refs: ['Q-TEST-001'],
    claim_versions: [{ ref: 'CLM-INCOMPLETE-001', version: '1.0.0' }], evidence_refs: [],
    direct_answer: 'Incomplete.', limitations: [], forbidden_statements: [],
  });
  await writeObject(root, 'knowledge/releases/incomplete.md', {
    id: 'KR-INCOMPLETE-001', record_type: 'knowledge_release', status: 'published', version: '1.0.0',
    created_at: NOW, updated_at: NOW, release_version: '1.0.0',
    claim_versions: [{ ref: 'CLM-INCOMPLETE-001', version: '1.0.0' }],
    answer_card_versions: [{ ref: 'ANS-INCOMPLETE-001', version: '1.0.0' }],
    readiness: 'ready', approval: APPROVAL,
  });
  await writeObject(root, 'knowledge/documents/document.md', {
    id: 'DOC-TEST-001', record_type: 'document', status: 'draft', version: '1.0.0',
    created_at: NOW, updated_at: NOW, scope: 'Synthetic test only', source_refs: ['SRC-TEST-001'],
  });

  const validation = await validateKnowledgeWorkspace({ workspace: root });
  assert.ok(validation.errors.some((error) => error.code === 'APPROVAL_REQUIRED' && error.id === 'Q-NO-APPROVAL-001'));
  assert.ok(validation.errors.some((error) => error.code === 'GOAL_NOT_APPROVED'));
  assert.ok(validation.errors.some((error) => error.code === 'RELEASE_NOT_READY' && error.id === 'KR-INCOMPLETE-001'));
  assert.ok(validation.errors.some((error) => error.code === 'RELEASE_NOT_READY' && error.ref === 'DOC-TEST-001'));
  assert.ok(validation.errors.some((error) => error.code === 'TRACE_INCOMPLETE' && error.id === 'KR-INCOMPLETE-001'));
  assert.ok(validation.warnings.some((warning) => warning.code === 'EVIDENCE_SUFFICIENCY_DRIFT'));
  await assert.rejects(
    traceQuery({ workspace: root, queryId: 'Q-TEST-001' }),
    (error) => error.code === 'TRACE_INCOMPLETE',
  );
  await rm(root, { recursive: true });
});

test('assemble 的 M3 profile 拒绝只有 M2 最小字段的 Query 与 Claim', async () => {
  const root = await temporaryWorkspace('geo-m3-profile-');
  await writeObject(root, 'cycles/preparation/goal.md', {
    id: 'GOAL-PROFILE-001', record_type: 'perception_goal', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, goal_statement: 'Profile gate.', success_question: 'Profile?',
  });
  await writeObject(root, 'queries/candidates/minimal.md', {
    id: 'Q-PROFILE-001', record_type: 'query', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, query_text: 'Minimal?', language: 'en',
  });
  await writeObject(root, 'knowledge/claims/minimal.md', {
    id: 'CLM-PROFILE-001', record_type: 'claim', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, statement: 'Minimal.', risk_type: 'ordinary_fact', risk_level: 'low',
  });
  await writeObject(root, 'knowledge/answer-cards/minimal.md', {
    id: 'ANS-PROFILE-001', record_type: 'answer_card', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, query_refs: ['Q-PROFILE-001'],
    claim_versions: [{ ref: 'CLM-PROFILE-001', version: '1.0.0' }], direct_answer: 'Minimal.',
    limitations: [], forbidden_statements: [],
  });
  await assert.rejects(
    assembleQuerySet({
      workspace: root, now: NOW,
      plan: {
        path: 'queries/sets/profile.md', id: 'QS-PROFILE-001', goal_refs: ['GOAL-PROFILE-001'],
        query_versions: [{ ref: 'Q-PROFILE-001', version: '1.0.0' }],
      },
    }),
    (error) => error.code === 'M3_FIELD_REQUIRED' && error.ref === 'Q-PROFILE-001',
  );
  await assert.rejects(
    assembleKnowledgeRelease({
      workspace: root, now: NOW,
      plan: {
        path: 'knowledge/releases/profile.md', id: 'KR-PROFILE-001', release_version: '1.0.0',
        claim_versions: [{ ref: 'CLM-PROFILE-001', version: '1.0.0' }],
        answer_card_versions: [{ ref: 'ANS-PROFILE-001', version: '1.0.0' }],
      },
    }),
    (error) => error.code === 'M3_FIELD_REQUIRED' && error.ref === 'CLM-PROFILE-001',
  );
  await rm(root, { recursive: true });
});
