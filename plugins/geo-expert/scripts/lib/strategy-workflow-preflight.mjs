import { serializeMarkdownObject, validateObjectData } from './object-contract.mjs';
import {
  compareUtf8, sha256, stableStringify, writeCreateOnly,
} from './workspace-paths.mjs';

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export async function createStrategyRun({
  root, runRef, now, inputVersions, testScope, outputArtifacts,
}) {
  const versions = Object.fromEntries(
    Object.entries(inputVersions).sort(([a], [b]) => compareUtf8(a, b)),
  );
  const data = {
    id: runRef, record_type: 'run', status: 'pending', version: '1.0.0',
    created_at: now, updated_at: now, title: 'geo-strategy-discovery run',
    test_scope: { ...testScope }, skill: 'geo-strategy-discovery', skill_version: '1.0.0',
    input_refs: Object.keys(versions), input_versions: versions,
    input_fingerprint: sha256(stableStringify(versions)),
    completed_steps: [], output_artifacts: outputArtifacts,
    business_result: 'not_evaluated', next_action: 'start',
    finding_refs: [], evidence_refs: [], asset_refs: [], failure_reason: null,
  };
  validateObjectData(data, { path: `runs/${runRef}/run.md` });
  return writeCreateOnly(
    root, `runs/${runRef}/run.md`, serializeMarkdownObject(data, `# Run ${runRef}\n`),
    { idempotent: true, conflictCode: 'RUN_CONFLICT' },
  );
}

export function snapshotViewFromPlan(plan, parsedObjects, artifactBytes) {
  const entries = new Map(plan.source_entries.map((entry) => [entry.entry_key, {
    entry_key: entry.entry_key, file_sha256: entry.file_sha256,
    data: parsedObjects.get(entry.object_id).data,
    content: parsedObjects.get(entry.object_id).content,
    snapshot_path: entry.snapshot_path,
  }]));
  const artifactEntries = new Map(plan.artifact_entries.map((entry) => [entry.entry_key, {
    ...entry, bytes: artifactBytes.get(entry.source_path),
  }]));
  return {
    snapshot_id: plan.snapshot.id, snapshot_kind: 'strategy',
    fingerprint: plan.manifest.fingerprint, entries,
    artifact_entries: artifactEntries, source: 'validated_live_preflight',
  };
}

export function eligibilityInput(snapshot, invocation) {
  const values = [...snapshot.entries.entries()];
  const byType = (type) => values.filter(([, item]) => item.data.record_type === type);
  const reviewed = byType('answer_review').filter(([, item]) =>
    item.data.status === 'reviewed'
    && (item.data.exploratory?.decision_dimension_candidates?.length ?? 0) > 0);
  const evidence = byType('evidence').filter(([, item]) => item.data.status === 'approved');
  const findings = byType('finding').filter(([, item]) =>
    ['content_gap', 'evidence_gap', 'product_gap'].includes(item.data.diagnosis_class));
  const products = findings.filter(([, item]) =>
    item.data.diagnosis_class === 'product_gap'
    && item.data.status === 'open' && item.data.approval);
  if (reviewed.length < 2 || evidence.length < 2 || products.length !== 1
      || !findings.some(([, item]) => item.data.diagnosis_class === 'content_gap')
      || !findings.some(([, item]) => item.data.diagnosis_class === 'evidence_gap')) {
    fail('STRATEGY_TRIGGER_CHECK_INCOMPLETE', 'strategy CIS eligibility 输入不完整');
  }
  const [productKey, product] = products[0];
  const rule = [...snapshot.artifact_entries.entries()].find(([, item]) => {
    try {
      return JSON.parse(item.bytes.toString('utf8')).schema_version
        === 'm7-strategy-eligibility-rule/1.0.0';
    } catch { return false; }
  });
  if (!rule) fail('STRATEGY_TRIGGER_CHECK_INCOMPLETE', 'strategy CIS 缺 eligibility rule');
  return {
    human_invocation: invocation,
    review_entry_keys: reviewed.map(([key]) => key).sort(compareUtf8),
    evidence_entry_keys: evidence.map(([key]) => key).sort(compareUtf8),
    finding_entry_keys: findings.map(([key]) => key).sort(compareUtf8),
    product_gap_entry_key: productKey,
    product_gap_identity: {
      object_id: product.data.id, record_type: 'finding',
      object_version: product.data.version, file_sha256: product.file_sha256,
    },
    eligibility_rule_entry_key: rule[0],
  };
}
