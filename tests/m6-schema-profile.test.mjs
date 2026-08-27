import { test } from 'node:test';
import assert from 'node:assert/strict';

import { collectorProfile } from './helpers/m5-fixtures.mjs';
import { validateCollectorProfileData } from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import {
  M6_NOW,
  M6_TEST_SCOPE,
  m6SchemaSamples,
} from './helpers/m6-fixtures.mjs';
import {
  RECORD_TYPES,
  validateObjectData,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { inputFingerprint } from '../plugins/geo-expert/scripts/lib/run-store.mjs';

const M6_TYPES = [
  'test_merchant',
  'cycle_input_snapshot',
  'cycle_transition',
  'analytics_observation',
  'business_signal',
  'cycle_review',
];

function answerSampleWithOrdinal(ordinal) {
  return {
    id: 'SMP-M6-RED-001',
    record_type: 'answer_sample',
    status: 'recorded',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    purpose: 'baseline',
    query_ref: 'Q-M6-RED-001',
    query_version: '1.0.0',
    query_set_ref: 'QS-M6-RED-001',
    query_set_version: '1.0.0',
    intent: 'definition',
    platform: 'chatgpt',
    collector_profile_ref: 'CPF-M6-RED-001',
    collector_profile_version: '1.0.0',
    run_ref: 'RUN-M6-RED-001',
    slot_key: 'a'.repeat(64),
    ordinal,
    attempt_no: 1,
    outcome: 'success',
    captured_at: M6_NOW,
    collection_method: 'recorded_fixture',
    artifacts: [{
      role: 'answer_text',
      availability: 'captured',
      path: 'raw/answer.txt',
      sha256: 'b'.repeat(64),
      media_type: 'text/plain',
    }],
    raw_manifest_sha256: 'c'.repeat(64),
    privacy: {
      account_identifier_stored: false,
      credentials_stored: false,
      answer_region_only: true,
      redaction_notes: [],
    },
  };
}

function answerRunWithOrdinal(ordinal) {
  const inputVersions = {};
  return {
    id: 'RUN-M6-RED-001',
    record_type: 'run',
    status: 'pending',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    skill: 'geo-answer-cycle',
    skill_version: '1.0.0',
    input_refs: [],
    input_versions: inputVersions,
    input_fingerprint: inputFingerprint(inputVersions),
    completed_steps: [],
    output_artifacts: [],
    business_result: 'not_evaluated',
    next_action: 'start',
    authorization_ref: 'fixture://authorization/m6-red-001',
    purpose: 'baseline',
    profile_versions: [],
    query_set_versions: [],
    sample_slots: [{
      slot_key: 'd'.repeat(64),
      query_ref: 'Q-M6-RED-001',
      platform: 'chatgpt',
      ordinal,
      completed_steps: [],
      step_proofs: {},
      attempt_refs: [],
      selected_sample_ref: null,
    }],
    collector_contract: {
      schema_version: '1.0.0',
      collector_version: '1.0.0',
      tool_policy_version: '1.0.0',
    },
  };
}

test('Spec 0007 注册六类 M6 对象并拒绝未知字段', () => {
  for (const type of M6_TYPES) assert.ok(RECORD_TYPES.includes(type), `缺少 M6 类型 ${type}`);
  for (const [type, sample] of Object.entries(m6SchemaSamples())) {
    assert.equal(validateObjectData(sample).record_type, type);
    assert.throws(
      () => validateObjectData({ ...sample, unexpected_m6_field: true }),
      (error) => error.code === 'INVALID_FRONTMATTER',
    );
  }
});

test('公共对象允许合法顶层 test_scope，且 M6 profile 不从 extensions 读取核心隔离字段', async () => {
  const base = {
    id: 'Q-M6-RED-001',
    record_type: 'query',
    status: 'candidate',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    query_text: 'Synthetic query?',
    language: 'en-US',
  };
  assert.doesNotThrow(() => validateObjectData({
    ...base,
    test_scope: { ...M6_TEST_SCOPE },
  }));
  const { validateM6Object } = await import(
    '../plugins/geo-expert/scripts/lib/m6-profile.mjs'
  );
  const result = validateM6Object({
    data: { ...base, extensions: { 'm6.test_scope': { ...M6_TEST_SCOPE } } },
    path: '<memory>',
  }, { testWorkspace: true });
  assert.ok(result.errors.some((item) => item.code === 'TEST_MERCHANT_SCOPE_REQUIRED'));
});

test('base Schema 兼容历史 sampling_count 3，但正式 language profile 仍强制两个 slot', () => {
  const profile = collectorProfile({
    sampling_count: 3,
    language_contract: {
      role: 'primary',
      object_key: 'm6-formal-two-slot',
      primary_language: 'en-US',
      primary_query_ref: 'Q-M6-RED-001',
      semantic_contract_ref: 'workspace://contracts/m6-formal-two-slot',
    },
  });
  assert.doesNotThrow(() => validateObjectData(profile));
  assert.throws(
    () => validateCollectorProfileData(profile),
    (error) => error.code === 'M5_FIELD_REQUIRED',
  );
});

test('approved 两槽合同拒绝 Answer Sample ordinal 3', () => {
  assert.throws(
    () => validateObjectData(answerSampleWithOrdinal(3)),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
});

test('approved 两槽合同拒绝 M5 Run sample_slots ordinal 3', () => {
  assert.throws(
    () => validateObjectData(answerRunWithOrdinal(3)),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
});

test('M6 profile 对 cycle/evidence/run 扩展必填独立 fail closed', async () => {
  const { validateM6Object } = await import(
    '../plugins/geo-expert/scripts/lib/m6-profile.mjs'
  );
  for (const data of [
    {
      id: 'CYC-M6-RED-001', record_type: 'cycle', status: 'proposed', version: '1.0.0',
      created_at: M6_NOW, updated_at: M6_NOW, core_versions: {},
      scope: 'test_merchant_engineering',
    },
    {
      id: 'EVD-M6-RED-001', record_type: 'evidence', status: 'candidate', version: '1.0.0',
      created_at: M6_NOW, updated_at: M6_NOW,
      source_refs: ['SRC-M6-RED-001'], locator: 'https://m6-red.invalid/fact',
      captured_at: M6_NOW,
      snapshot: { path: 'evidence/snapshots/fact.txt', sha256: 'e'.repeat(64), media_type: 'text/plain' },
      collector: { name: 'fixture', version: '1.0.0' },
      observation_versions: [],
    },
    { ...answerRunWithOrdinal(1), skill: 'geo-lifecycle' },
  ]) {
    const result = validateM6Object({ data, path: '<memory>' });
    assert.ok(result.errors.some((item) => item.code === 'M6_FIELD_REQUIRED'));
  }
});
