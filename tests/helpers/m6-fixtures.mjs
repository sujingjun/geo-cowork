import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { collectorProfileFingerprint } from '../../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { serializeMarkdownObject } from '../../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { querySetContentSha } from '../../plugins/geo-expert/scripts/lib/knowledge-query.mjs';
import { sha256, stableStringify } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { REQUIRED_DIRS } from '../../plugins/geo-expert/scripts/workspace-init.mjs';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const M6_FIXTURE_ROOT = path.resolve(THIS_DIR, '..', 'fixtures', 'm6-test-merchant');

export const M6_NOW = '2026-08-27T00:00:00Z';
export const M6_WORKSPACE_ID = 'ws_m6testmerchant000000000000';
export const M6_NAMESPACE = 'm6-test-merchant-v1';
export const M6_SUBJECT_LOCATOR = 'https://m6-test-merchant.invalid/';
export const M6_MERCHANT_ID = 'TMT-M6-TEST-001';
export const M6_CYCLE_ID = 'CYC-M6-TEST-001';
export const M6_RUN_ID = 'RUN-M6-CIS-001';

export const M6_APPROVAL = Object.freeze({
  approved_by: 'Fixture Human Reviewer',
  approved_at: M6_NOW,
  decision_ref: 'fixture://approval/m6-test-only-001',
});

export const M6_TEST_SCOPE = Object.freeze({
  kind: 'synthetic',
  usage: 'test_only',
  merchant_ref: M6_MERCHANT_ID,
  workspace_id: M6_WORKSPACE_ID,
});

const CONTRACT_FILES = Object.freeze({
  measurement_contract: 'contracts/measurement-contract.json',
  signal_rule: 'contracts/signal-rule.json',
  sensitive_data_policy: 'contracts/sensitive-data-policy.json',
});

export function fixturePath(relative) {
  return path.join(M6_FIXTURE_ROOT, ...relative.split('/'));
}

export async function readM6FixtureJson(relative) {
  return JSON.parse(await readFile(fixturePath(relative), 'utf8'));
}

export async function writeM6Object(root, relative, data, body = '# M6 synthetic fixture\n') {
  const target = path.join(root, ...relative.split('/'));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, serializeMarkdownObject(data, body));
  return target;
}

export function m6TestMerchantData(overrides = {}) {
  return {
    id: M6_MERCHANT_ID,
    record_type: 'test_merchant',
    status: 'frozen',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title: 'M6 synthetic test merchant',
    test_scope: { ...M6_TEST_SCOPE },
    workspace_id: M6_WORKSPACE_ID,
    workspace_namespace: M6_NAMESPACE,
    display_name: 'M6 Synthetic Test Merchant',
    identity: {
      legal_entity_kind: 'fictitious',
      canonical_locator: M6_SUBJECT_LOCATOR,
      real_brand_identity_claimed: false,
    },
    provenance: {
      kind: 'synthetic',
      usage: 'test_only',
      decision_ref: M6_APPROVAL.decision_ref,
      semantic_projection_ref: 'workspace://contracts/myyshop-positioning-test-projection-v1',
    },
    real_workspace_forbidden: ['workspaces/myyshop'],
    approval: { ...M6_APPROVAL },
    ...overrides,
  };
}

function common(id, recordType, status, title) {
  return {
    id,
    record_type: recordType,
    status,
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title,
    test_scope: { ...M6_TEST_SCOPE },
  };
}

export function m6SchemaSamples() {
  const hash = 'a'.repeat(64);
  const refVersion = (ref) => ({ ref, version: '1.0.0' });
  return {
    test_merchant: m6TestMerchantData(),
    cycle_input_snapshot: {
      ...common('CIS-M6-TEST-001', 'cycle_input_snapshot', 'recorded', 'Freeze snapshot'),
      merchant_ref: M6_MERCHANT_ID,
      cycle_ref: M6_CYCLE_ID,
      snapshot_kind: 'freeze',
      manifest: {
        schema_version: 'cycle-input-snapshot/1.0.0',
        artifact_path: 'outputs/snapshots/cis-m6-test-001/manifest.json',
        sha256: hash,
        fingerprint: hash,
      },
      source_entries: [{
        entry_key: hash,
        object_id: 'GOAL-M6-TEST-001',
        record_type: 'perception_goal',
        object_version: '1.0.0',
        object_path: 'cycles/preparation/goal.md',
        content_sha256: hash,
        file_sha256: hash,
        snapshot_path: 'outputs/snapshots/cis-m6-test-001/objects/goal.md',
        snapshot_sha256: hash,
      }],
      artifact_entries: [{
        entry_key: hash,
        role: 'measurement_contract',
        source_path: 'execution/contracts/measurement-contract.json',
        snapshot_path: 'outputs/snapshots/cis-m6-test-001/artifacts/measurement-contract.json',
        media_type: 'application/json',
        source_sha256: hash,
        snapshot_sha256: hash,
      }],
      run_ref: M6_RUN_ID,
    },
    cycle_transition: {
      ...common('CTR-M6-TEST-001', 'cycle_transition', 'recorded', 'Cycle transition'),
      cycle_ref: M6_CYCLE_ID,
      goal_ref: 'GOAL-M6-TEST-001',
      operation_id: 'op-m6-baseline-recorded-001',
      operation_fingerprint: hash,
      expected_cycle_version: '1.0.0',
      input_snapshot_version: refVersion('CIS-M6-TEST-001'),
      gate_snapshot_version: refVersion('CIS-M6-TEST-002'),
      from_status: 'active',
      to_status: 'active',
      from_stage: 'frozen',
      to_stage: 'baseline_recorded',
      required_gate_entry_keys: [hash],
      lease_revision: 1,
      actor: { kind: 'deterministic_tool' },
    },
    analytics_observation: {
      ...common('ANO-M6-TEST-001', 'analytics_observation', 'recorded', 'Analytics observation'),
      merchant_ref: M6_MERCHANT_ID,
      cycle_ref: M6_CYCLE_ID,
      goal_ref: 'GOAL-M6-TEST-001',
      run_ref: 'RUN-M6-ANALYTICS-001',
      adapter: {
        kind: 'fixture', name: 'm6-fixture', version: '1.0.0',
        access_mode: 'fixture', authorization_ref: 'fixture://authorization/m6-analytics-001',
      },
      measurement_contract: {
        version: '1.0.0', artifact_path: 'execution/contracts/measurement-contract.json',
        artifact_entry_key: hash, sha256: hash,
      },
      sensitive_data_policy: {
        id: 'sensitive-data-policy-m6-fixture-v1', version: '1.0.0',
        artifact_entry_key: hash, sha256: hash,
      },
      time_window: {
        starts_at: '2026-08-01T00:00:00Z', ends_at: '2026-08-08T00:00:00Z',
        as_of: '2026-08-09T00:00:00Z',
      },
      metrics: [{
        metric_id: 'ai_visits', definition: 'Synthetic AI visits.', value: 20,
        unit: 'visits', dimensions: { source_group: 'synthetic_ai' },
        state: 'observed', limitation: null,
      }],
      artifacts: [{
        path: 'raw/analytics/complete.json', sha256: hash, media_type: 'application/json',
      }],
      quality: { completeness: 'complete', warnings: [] },
      causal_claim: false,
    },
    business_signal: {
      ...common('BSIG-M6-TEST-001', 'business_signal', 'computed', 'Business signal'),
      merchant_ref: M6_MERCHANT_ID,
      cycle_ref: M6_CYCLE_ID,
      goal_ref: 'GOAL-M6-TEST-001',
      run_ref: 'RUN-M6-ANALYTICS-001',
      observation_versions: [refVersion('ANO-M6-TEST-001')],
      measurement_contract: {
        version: '1.0.0', artifact_path: 'execution/contracts/measurement-contract.json',
        artifact_entry_key: hash, sha256: hash,
      },
      rule: {
        id: 'signal-rule-m6-fixture-v1', version: '1.0.0',
        artifact_path: 'execution/contracts/signal-rule.json', artifact_entry_key: hash, sha256: hash,
      },
      signal_kind: 'ai_registration',
      denominator: { definition: 'Synthetic AI visits.', value: 20, state: 'known' },
      calculation: {
        value: 0.1, unit: 'registrations_per_visit', state: 'signal_observed',
        explanation: '2 synthetic registrations / 20 synthetic visits.',
      },
      causal_claim: false,
    },
    cycle_review: {
      ...common('CRV-M6-TEST-001', 'cycle_review', 'waiting_human', 'Cycle review'),
      merchant_ref: M6_MERCHANT_ID,
      cycle_ref: M6_CYCLE_ID,
      reviewed_cycle_input_version: '1.0.9',
      review_input_snapshot_version: refVersion('CIS-M6-TEST-REVIEW-001'),
      review_input_fingerprint: hash,
      goal_results: [{
        goal_entry_key: hash,
        perception_goal: 'inconclusive',
        observations: ['Synthetic observation only.'],
        business_signal_entry_keys: [hash],
        limitations: ['No real analytics or external publication.'],
        forbidden_conclusions: ['Do not claim causal or real MyyShop impact.'],
      }],
      next_cycle_candidate_inputs: [],
    },
  };
}

export async function createM6FixtureWorkspace() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-test-merchant-'));
  for (const dir of [
    ...REQUIRED_DIRS,
    'knowledge/documents', 'knowledge/claims', 'knowledge/answer-cards', 'knowledge/releases',
    'queries/formal', 'queries/sets', 'evidence/sources', 'evidence/records',
    'evidence/snapshots', 'assets/own', 'execution/contracts', 'fixtures/analytics',
  ]) await mkdir(path.join(root, ...dir.split('/')), { recursive: true });

  await copyFile(fixturePath('workspace.json'), path.join(root, 'workspace.json'));
  await copyFile(fixturePath('README.md'), path.join(root, 'README.md'));
  await writeFile(path.join(root, 'STATUS.md'), '# M6 Synthetic Test Merchant\n\nTest-only fixture.\n');
  for (const [role, relative] of Object.entries(CONTRACT_FILES)) {
    const targetName = `${role.replaceAll('_', '-')}.json`;
    await copyFile(fixturePath(relative), path.join(root, 'execution/contracts', targetName));
  }
  for (const file of [
    'complete.json', 'partial.json', 'no-signal.json', 'zero-denominator.json',
    'negative.json', 'forbidden-pii.json',
  ]) {
    await copyFile(fixturePath(`analytics/${file}`), path.join(root, 'fixtures/analytics', file));
  }
  return root;
}

export async function seedM6FreezeInputs(root, { skipMerchant = false } = {}) {
  const sourceSnapshot = 'Synthetic test merchant capability statement.\n';
  await mkdir(path.join(root, 'evidence/snapshots'), { recursive: true });
  await mkdir(path.join(root, 'execution/contracts'), { recursive: true });
  await mkdir(path.join(root, 'fixtures/analytics'), { recursive: true });
  for (const [role, relative] of Object.entries(CONTRACT_FILES)) {
    await copyFile(
      fixturePath(relative),
      path.join(root, 'execution/contracts', `${role.replaceAll('_', '-')}.json`),
    );
  }
  for (const file of [
    'complete.json', 'partial.json', 'no-signal.json', 'zero-denominator.json',
    'negative.json', 'forbidden-pii.json',
  ]) {
    await copyFile(fixturePath(`analytics/${file}`), path.join(root, 'fixtures/analytics', file));
  }
  await writeFile(path.join(root, 'evidence/snapshots/source.txt'), sourceSnapshot);
  if (!skipMerchant) {
    await writeM6Object(root, 'cycles/preparation/test-merchant.md', m6TestMerchantData());
  }
  await writeM6Object(root, 'evidence/sources/source.md', {
    ...common('SRC-M6-TEST-001', 'source', 'active', 'Synthetic source'),
    name: 'Synthetic fixture source', source_kind: 'first_party_document',
    locator: 'https://m6-test-merchant.invalid/source',
  });
  await writeM6Object(root, 'evidence/records/evidence.md', {
    ...common('EVD-M6-TEST-001', 'evidence', 'approved', 'Synthetic evidence'),
    source_refs: ['SRC-M6-TEST-001'], claim_refs: ['CLM-M6-TEST-001'],
    locator: 'https://m6-test-merchant.invalid/source#fact', captured_at: M6_NOW,
    snapshot: {
      path: 'evidence/snapshots/source.txt', sha256: sha256(sourceSnapshot), media_type: 'text/plain',
    },
    collector: { name: 'm6-fixture', version: '1.0.0' },
    scope: 'Synthetic test only.', approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'knowledge/documents/document.md', {
    ...common('DOC-M6-TEST-001', 'document', 'approved', 'Synthetic document'),
    scope: 'Synthetic test only.', source_refs: ['SRC-M6-TEST-001'],
    claim_refs: ['CLM-M6-TEST-001'], approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'cycles/preparation/goal.md', {
    ...common('GOAL-M6-TEST-001', 'perception_goal', 'approved', 'Synthetic goal'),
    goal_statement: 'Represent the synthetic test merchant accurately.',
    success_question: 'What is the synthetic test merchant?',
    query_set_refs: ['QS-M6-TEST-001'], approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'queries/formal/query.md', {
    ...common('Q-M6-TEST-001', 'query', 'formal', 'Synthetic query'),
    query_text: 'What is the synthetic test merchant?', language: 'en-US',
    normalized_text: 'what is the synthetic test merchant', intent: 'definition', priority: 'P0',
    goal_refs: ['GOAL-M6-TEST-001'], discovery_source_refs: ['SRC-M6-TEST-001'],
    legacy_refs: [], approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'knowledge/claims/claim.md', {
    ...common('CLM-M6-TEST-001', 'claim', 'published', 'Synthetic claim'),
    statement: 'The synthetic test merchant provides a documented fixture capability.',
    risk_type: 'capability_fact', risk_level: 'low', evidence_refs: ['EVD-M6-TEST-001'],
    document_refs: ['DOC-M6-TEST-001'], scope: 'Synthetic test only.',
    evidence_sufficiency: {
      status: 'sufficient', rule_version: 'm3-evidence-sufficiency-v1', missing: [],
    },
    release_refs: ['KR-M6-TEST-001'], approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'knowledge/answer-cards/answer.md', {
    ...common('ANS-M6-TEST-001', 'answer_card', 'published', 'Synthetic answer card'),
    query_refs: ['Q-M6-TEST-001'],
    claim_versions: [{ ref: 'CLM-M6-TEST-001', version: '1.0.0' }],
    evidence_refs: ['EVD-M6-TEST-001'],
    direct_answer: 'The synthetic test merchant provides a documented fixture capability.',
    limitations: ['Synthetic fixture only.'], forbidden_statements: ['No real business effect.'],
    release_refs: ['KR-M6-TEST-001'], approval: { ...M6_APPROVAL },
  });
  const queryVersions = [{
    ref: 'Q-M6-TEST-001', version: '1.0.0',
    query_text: 'What is the synthetic test merchant?', language: 'en-US',
  }];
  await writeM6Object(root, 'queries/sets/query-set.md', {
    ...common('QS-M6-TEST-001', 'query_set', 'frozen', 'Synthetic query set'),
    goal_refs: ['GOAL-M6-TEST-001'],
    query_versions: queryVersions.map(({ ref, version }) => ({ ref, version })),
    frozen_at: M6_NOW, frozen_by: 'Fixture Human Reviewer',
    content_sha256: querySetContentSha(queryVersions), approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'knowledge/releases/release.md', {
    ...common('KR-M6-TEST-001', 'knowledge_release', 'published', 'Synthetic release'),
    release_version: '1.0.0',
    claim_versions: [{ ref: 'CLM-M6-TEST-001', version: '1.0.0' }],
    answer_card_versions: [{ ref: 'ANS-M6-TEST-001', version: '1.0.0' }],
    readiness: 'ready', approval: { ...M6_APPROVAL },
  });
  await writeM6Object(root, 'assets/own/about.md', {
    ...common('AST-M6-TEST-001', 'asset', 'active', 'Synthetic About asset'),
    asset_kind: 'own', locator: 'https://m6-test-merchant.invalid/about',
    source_refs: ['SRC-M6-TEST-001'], asset_role: 'about', control_scope: 'own',
    goal_refs: ['GOAL-M6-TEST-001'], query_refs: ['Q-M6-TEST-001'],
    claim_versions: [{ ref: 'CLM-M6-TEST-001', version: '1.0.0' }],
    knowledge_release_versions: [{ ref: 'KR-M6-TEST-001', version: '1.0.0' }],
  });
  const profile = {
    ...common('CPF-M6-TEST-001', 'collector_profile', 'frozen', 'Synthetic collector profile'),
    platform: 'chatgpt', product_entry: 'https://consumer.m6-test-merchant.invalid/chat',
    region: 'US', language: 'en-US', login_state: 'logged_out', conversation_state: 'new',
    web_search_state: 'on', model_mode: 'recorded-fixture', query_template_version: '1.0.0',
    sampling_count: 2,
    time_window: {
      id: 'TW-M6-TEST-001', starts_at: '2026-08-01T00:00:00Z', ends_at: '2026-08-08T00:00:00Z',
    },
    device: { class: 'desktop', os: 'fixture-os', browser: 'fixture-browser', viewport: '1280x720' },
    collection_method: 'recorded_fixture', approval: { ...M6_APPROVAL },
  };
  profile.profile_fingerprint = collectorProfileFingerprint(profile);
  await writeM6Object(root, 'cycles/preparation/collector-profile.md', profile);

  const sourcePaths = [
      'cycles/preparation/test-merchant.md', 'cycles/preparation/goal.md',
      'queries/formal/query.md', 'queries/sets/query-set.md',
      'knowledge/documents/document.md', 'knowledge/claims/claim.md',
      'knowledge/answer-cards/answer.md', 'knowledge/releases/release.md',
      'evidence/sources/source.md', 'evidence/records/evidence.md',
      'assets/own/about.md', 'cycles/preparation/collector-profile.md',
  ];
  const artifactPaths = Object.entries(CONTRACT_FILES).map(([role]) => ({
      role,
      path: `execution/contracts/${role.replaceAll('_', '-')}.json`,
      media_type: 'application/json',
  }));
  return { sourcePaths, artifactPaths };
}

function byteCompare(a, b) {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

export async function buildM6SnapshotPlan(root, {
  id = 'CIS-M6-TEST-001',
  snapshotKind = 'freeze',
  sourcePaths,
  artifactPaths,
  baseFreezeSnapshotVersion,
  preReviewTransitionSnapshotVersions = [],
  preReviewEntryKeys = [],
} = {}) {
  const base = `outputs/snapshots/${id.toLowerCase()}`;
  const sourceEntries = [];
  for (const objectPath of sourcePaths) {
    const bytes = await readFile(path.join(root, ...objectPath.split('/')));
    const parsed = matter(bytes.toString('utf8'));
    const snapshotPath = `${base}/objects/${objectPath}`;
    const entry = {
      object_id: parsed.data.id,
      record_type: parsed.data.record_type,
      object_version: String(parsed.data.version),
      object_path: objectPath,
      content_sha256: sha256(parsed.content),
      file_sha256: sha256(bytes),
      snapshot_path: snapshotPath,
      snapshot_sha256: sha256(bytes),
    };
    entry.entry_key = sha256(stableStringify(entry));
    sourceEntries.push(entry);
  }
  const artifactEntries = [];
  for (const artifact of artifactPaths) {
    const bytes = await readFile(path.join(root, ...artifact.path.split('/')));
    const snapshotPath = `${base}/artifacts/${path.posix.basename(artifact.path)}`;
    const entry = {
      role: artifact.role,
      source_path: artifact.path,
      snapshot_path: snapshotPath,
      media_type: artifact.media_type,
      source_sha256: sha256(bytes),
      snapshot_sha256: sha256(bytes),
    };
    entry.entry_key = sha256(stableStringify(entry));
    artifactEntries.push(entry);
  }
  sourceEntries.sort((a, b) => byteCompare(a.entry_key, b.entry_key));
  artifactEntries.sort((a, b) => byteCompare(a.entry_key, b.entry_key));
  const fingerprintPayload = {
    source_entries: sourceEntries,
    artifact_entries: artifactEntries,
    base_freeze_snapshot_version: baseFreezeSnapshotVersion ?? null,
    pre_review_transition_snapshot_versions: preReviewTransitionSnapshotVersions,
    pre_review_entry_keys: [...preReviewEntryKeys].sort(byteCompare),
  };
  const fingerprint = sha256(stableStringify(fingerprintPayload));
  const manifestPayload = {
    schema_version: 'cycle-input-snapshot/1.0.0',
    snapshot_id: id,
    snapshot_kind: snapshotKind,
    fingerprint,
    ...fingerprintPayload,
  };
  const manifestBytes = stableStringify(manifestPayload, 2);
  return {
    schema_version: 'm6-cycle-input-snapshot-plan/1.0.0',
    snapshot: {
      id,
      path: `cycles/m6/snapshots/${id.toLowerCase()}.md`,
      version: '1.0.0',
      kind: snapshotKind,
    },
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    run_ref: M6_RUN_ID,
    source_entries: sourceEntries,
    artifact_entries: artifactEntries,
    ...(baseFreezeSnapshotVersion
      ? { base_freeze_snapshot_version: baseFreezeSnapshotVersion }
      : {}),
    pre_review_transition_snapshot_versions: preReviewTransitionSnapshotVersions,
    pre_review_entry_keys: [...preReviewEntryKeys].sort(byteCompare),
    manifest: {
      schema_version: 'cycle-input-snapshot/1.0.0',
      artifact_path: `${base}/manifest.json`,
      fingerprint,
      sha256: sha256(manifestBytes),
      bytes: manifestBytes,
    },
  };
}
