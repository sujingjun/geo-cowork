import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  isFixtureLocator,
  isSubset,
  sortedUnique,
} from './diagnosis-io.mjs';
import { sha256, stableStringify } from './workspace-paths.mjs';

const NEW_TYPES = new Set(['asset_proposal', 'adoption_record', 'asset_publication']);
const M4_MARKERS = {
  finding: ['diagnosis_class', 'gap_basis', 'retest_of_ref'],
  asset: ['asset_role', 'control_scope', 'goal_refs', 'query_refs', 'claim_versions', 'knowledge_release_versions'],
  evidence: [
    'collection_state', 'access_state', 'original_content_state', 'support_kind',
    'independent_support_refs', 'counter_evidence_refs', 'confidence', 'proof_scope', 'detector_code',
  ],
  evidence_plan: ['finding_refs', 'asset_refs', 'deployment_targets'],
  run: [
    'goal_refs', 'query_set_versions', 'knowledge_release_versions',
    'publication_refs', 'retest_of_refs', 'development_fixture',
    'manifest_fingerprint', 'detector_results',
  ],
};

function addError(errors, code, object, details = {}) {
  errors.push({ code, id: object.data.id, path: object.path, ...details });
}

function isM4Object(data) {
  if (NEW_TYPES.has(data.record_type)) return true;
  return (M4_MARKERS[data.record_type] ?? []).some((field) => field in data);
}

function missingList(data, fields) {
  return fields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null
      || (typeof value === 'string' && value.trim() === '')
      || (Array.isArray(value) && value.length === 0);
  });
}

function hasExactVersion(items, ref, version) {
  return (items ?? []).some((item) => item.ref === ref && item.version === version);
}

function validateFinding(graph, object, errors) {
  const data = object.data;
  for (const field of missingList(data, [
    'diagnosis_class', 'query_refs', 'claim_refs', 'evidence_refs', 'asset_refs',
  ])) addError(errors, 'M4_FIELD_REQUIRED', object, { field });
  if (!Array.isArray(data.source_refs)) {
    addError(errors, 'M4_FIELD_REQUIRED', object, { field: 'source_refs' });
  }
  if (!data.diagnosis_class) return;
  const assets = (data.asset_refs ?? []).map((ref) => graph.byId.get(ref)?.data).filter(Boolean);
  const queriesOutsideAssets = (data.query_refs ?? []).filter((ref) =>
    !assets.some((asset) => asset.query_refs?.includes(ref)));
  const claimsOutsideAssets = (data.claim_refs ?? []).filter((ref) => {
    const claim = graph.byId.get(ref)?.data;
    return !claim || !assets.some((asset) => hasExactVersion(asset.claim_versions, ref, claim.version));
  });
  if (queriesOutsideAssets.length > 0 || claimsOutsideAssets.length > 0) {
    addError(errors, 'GAP_CLASSIFICATION_INVALID', object, {
      reason: 'finding_outside_asset_scope',
      refs: [...queriesOutsideAssets, ...claimsOutsideAssets].sort(),
    });
  }
  const technical = data.diagnosis_class === 'technical';
  if (technical) {
    if (data.finding_kind !== 'technical'
        || !['observed', 'blocked', 'unverifiable'].includes(data.item_state)
        || !['open', 'resolved'].includes(data.status)
        || data.gap_basis) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object);
    }
  } else {
    if (data.finding_kind !== 'semantic'
        || !['inferred', 'blocked', 'unverifiable'].includes(data.item_state)
        || !data.gap_basis) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object);
      return;
    }
    if (['open', 'dismissed'].includes(data.status) && !data.approval) {
      addError(errors, 'GAP_REQUIRES_HUMAN', object);
    }
    if (data.status === 'waiting_human' && data.approval) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { field: 'approval' });
    }
    const supporting = data.gap_basis.supporting_evidence_refs ?? [];
    const counter = data.gap_basis.counter_evidence_refs ?? [];
    if (!isSubset(supporting, data.evidence_refs)
        || !isSubset(counter, data.evidence_refs)
        || supporting.some((ref) => counter.includes(ref))) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { field: 'gap_basis' });
    }
  }

  const claims = (data.claim_refs ?? []).map((ref) => graph.byId.get(ref)?.data).filter(Boolean);
  if (data.diagnosis_class === 'content_gap') {
    if (claims.some((claim) => !['approved', 'published'].includes(claim.status)
        || claim.evidence_sufficiency?.status !== 'sufficient')) {
      addError(errors, 'CONTENT_GAP_EVIDENCE_INSUFFICIENT', object);
    }
    if ((data.evidence_refs ?? []).some((ref) => graph.byId.get(ref)?.data.status === 'stale')) {
      addError(errors, 'CONTENT_GAP_EVIDENCE_INSUFFICIENT', object, { reason: 'stale_evidence' });
    }
    const assetLocators = new Set((data.asset_refs ?? [])
      .map((ref) => graph.byId.get(ref)?.data.locator).filter(Boolean));
    const hasAssetEvidence = (data.evidence_refs ?? []).some((ref) => {
      const evidence = graph.byId.get(ref)?.data;
      return evidence?.proof_scope === 'target_content' && assetLocators.has(evidence.locator);
    });
    if (!hasAssetEvidence) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { reason: 'asset_evidence_missing' });
    }
    const claimsOutsideReleases = (data.claim_refs ?? []).filter((ref) => {
      const claim = graph.byId.get(ref)?.data;
      return !claim || !assets.some((asset) => (asset.knowledge_release_versions ?? []).some((releaseVersion) => {
        const release = graph.byId.get(releaseVersion.ref)?.data;
        return release?.version === releaseVersion.version
          && hasExactVersion(release.claim_versions, ref, claim.version);
      }));
    });
    if (claimsOutsideReleases.length > 0) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, {
        reason: 'claim_outside_knowledge_release',
        refs: claimsOutsideReleases.sort(),
      });
    }
  }
  if (data.diagnosis_class === 'evidence_gap') {
    const stale = (data.evidence_refs ?? []).some((ref) => graph.byId.get(ref)?.data.status === 'stale');
    const insufficient = claims.some((claim) =>
      ['insufficient', 'unknown'].includes(claim.evidence_sufficiency?.status));
    const conflict = (data.gap_basis?.unresolved_conflicts?.length ?? 0) > 0;
    if (!stale && !insufficient && !conflict) addError(errors, 'GAP_CLASSIFICATION_INVALID', object);
  }
  if (data.diagnosis_class === 'product_gap') {
    const supporting = (data.gap_basis?.supporting_evidence_refs ?? [])
      .map((ref) => graph.byId.get(ref)?.data).filter(Boolean);
    const assetLocators = new Set(assets.map((asset) => asset.locator).filter(Boolean));
    const hasDemand = supporting.some((evidence) => ['user', 'independent'].includes(evidence.support_kind)
      || ['user', 'independent_third_party'].includes(evidence.extensions?.['geo.evidence_category']));
    const hasCapability = supporting.some((evidence) =>
      (evidence.support_kind === 'first_party'
        || evidence.extensions?.['geo.evidence_category'] === 'first_party')
      && assetLocators.has(evidence.locator));
    if (!hasDemand || !hasCapability
        || (supporting.length > 0 && supporting.every((item) => item.support_kind === 'platform_observation'))) {
      addError(errors, 'PRODUCT_GAP_SUPPORT_MISSING', object);
    }
  }
  if (data.item_state === 'observed') {
    const evidence = (data.evidence_refs ?? []).map((ref) => graph.byId.get(ref)?.data).filter(Boolean);
    if (evidence.length > 0 && evidence.every((item) => item.proof_scope === 'collection_failure')) {
      addError(errors, 'EVIDENCE_SCOPE_MISMATCH', object);
    }
  }
  if (data.retest_of_ref) {
    const prior = graph.byId.get(data.retest_of_ref)?.data;
    if (!prior || prior.record_type !== 'finding'
        || prior.finding_code !== data.finding_code
        || stableStringify(prior.asset_refs ?? []) !== stableStringify(data.asset_refs ?? [])) {
      addError(errors, 'RETEST_INPUT_DRIFT', object, { ref: data.retest_of_ref });
    }
  }
}

function validateAsset(graph, object, errors) {
  const data = object.data;
  for (const field of missingList(data, [
    'asset_role', 'control_scope', 'goal_refs', 'query_refs',
    'claim_versions', 'knowledge_release_versions',
  ])) addError(errors, 'M4_FIELD_REQUIRED', object, { field });
  if ((data.asset_kind === 'own') !== (data.control_scope === 'own')) {
    addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { field: 'control_scope' });
  }
  for (const ref of data.goal_refs ?? []) {
    if (!['approved', 'active'].includes(graph.byId.get(ref)?.data.status)) {
      addError(errors, 'INPUT_NOT_M4_READY', object, { ref });
    }
  }
  for (const ref of data.query_refs ?? []) {
    if (graph.byId.get(ref)?.data.status !== 'formal') addError(errors, 'INPUT_NOT_M4_READY', object, { ref });
  }
  for (const item of data.claim_versions ?? []) {
    const covered = (data.knowledge_release_versions ?? []).some((releaseVersion) => {
      const release = graph.byId.get(releaseVersion.ref)?.data;
      return release?.version === releaseVersion.version
        && hasExactVersion(release.claim_versions, item.ref, item.version);
    });
    if (!covered) addError(errors, 'INPUT_NOT_M4_READY', object, { ref: item.ref, reason: 'claim_not_released' });
  }
}

function validateEvidence(_graph, object, errors) {
  const data = object.data;
  const researchMarkers = [
    'access_state', 'original_content_state', 'support_kind',
    'independent_support_refs', 'counter_evidence_refs',
    'confidence', 'confidence_reason',
  ];
  if (researchMarkers.some((field) => field in data)) {
    for (const field of [...researchMarkers, 'proof_scope']) {
      if (!(field in data) || data[field] === null
          || (typeof data[field] === 'string' && data[field].trim() === '')) {
        addError(errors, 'M4_FIELD_REQUIRED', object, { field });
      }
    }
    const invalidBlockedScope = data.access_state !== 'accessible'
      && (data.original_content_state === 'captured' || data.proof_scope !== 'collection_failure');
    const invalidCapturedScope = data.access_state === 'accessible'
      && data.original_content_state === 'captured' && data.proof_scope !== 'original_content';
    const invalidMetadataScope = data.access_state === 'accessible'
      && data.original_content_state !== 'captured' && data.proof_scope !== 'metadata_only';
    if (invalidBlockedScope || invalidCapturedScope || invalidMetadataScope) {
      addError(errors, 'EVIDENCE_SCOPE_MISMATCH', object);
    }
  }
  if ('collection_state' in data) {
    for (const field of ['collection_state', 'proof_scope', 'detector_code']) {
      if (!data[field]) addError(errors, 'M4_FIELD_REQUIRED', object, { field });
    }
    if ((data.collection_state === 'captured'
          && !['target_content', 'metadata_only'].includes(data.proof_scope))
        || (data.collection_state !== 'captured' && data.proof_scope !== 'collection_failure')) {
      addError(errors, 'EVIDENCE_SCOPE_MISMATCH', object);
    }
  }
}

function validateRun(graph, object, errors) {
  const data = object.data;
  for (const field of missingList(data, [
    'goal_refs', 'query_set_versions', 'knowledge_release_versions', 'asset_refs',
  ])) addError(errors, 'M4_FIELD_REQUIRED', object, { field });
  for (const field of ['publication_refs', 'retest_of_refs']) {
    if (!Array.isArray(data[field])) addError(errors, 'M4_FIELD_REQUIRED', object, { field });
  }
  if (typeof data.development_fixture !== 'boolean') {
    addError(errors, 'M4_FIELD_REQUIRED', object, { field: 'development_fixture' });
  }
  if (['geo-site', 'geo-site-technical-retest', 'geo-reputation', 'geo-competitor'].includes(data.skill)
      && !data.manifest_fingerprint) {
    addError(errors, 'M4_FIELD_REQUIRED', object, { field: 'manifest_fingerprint' });
  }
  if (['geo-site', 'geo-site-technical-retest'].includes(data.skill)
      && (!Array.isArray(data.detector_results) || data.detector_results.length === 0)) {
    addError(errors, 'M4_FIELD_REQUIRED', object, { field: 'detector_results' });
  }
  if (data.development_fixture) {
    const assets = (data.asset_refs ?? []).map((ref) => graph.byId.get(ref)?.data).filter(Boolean);
    if (assets.some((asset) => !isFixtureLocator(asset.locator))) {
      addError(errors, 'INPUT_NOT_M4_READY', object, { reason: 'fixture_locator' });
    }
  } else {
    for (const ref of data.goal_refs ?? []) {
      if (!['approved', 'active'].includes(graph.byId.get(ref)?.data.status)) {
        addError(errors, 'INPUT_NOT_M4_READY', object, { ref });
      }
    }
    for (const item of data.query_set_versions ?? []) {
      if (graph.byId.get(item.ref)?.data.status !== 'frozen') addError(errors, 'INPUT_NOT_M4_READY', object, { ref: item.ref });
    }
    for (const item of data.knowledge_release_versions ?? []) {
      const release = graph.byId.get(item.ref)?.data;
      if (release?.status !== 'published' || release?.readiness !== 'ready') {
        addError(errors, 'INPUT_NOT_M4_READY', object, { ref: item.ref });
      }
    }
  }
}

export function proposalUniqueKey(data) {
  return stableStringify({
    asset_ref: data.asset_ref,
    goal_refs: sortedUnique(data.goal_refs),
    query_refs: sortedUnique(data.query_refs),
    knowledge_release_versions: [...(data.knowledge_release_versions ?? [])]
      .sort((a, b) => a.ref.localeCompare(b.ref)),
    claim_versions: [...(data.claim_versions ?? [])].sort((a, b) => a.ref.localeCompare(b.ref)),
  });
}

function hasSection(body, section) {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^#{1,6}\\s+${escaped}\\s*$`, 'm').test(body);
}

function validateProposal(graph, object, errors) {
  const data = object.data;
  const asset = graph.byId.get(data.asset_ref)?.data;
  if (!asset
      || stableStringify(sortedUnique(data.goal_refs)) !== stableStringify(sortedUnique(asset.goal_refs))
      || stableStringify(sortedUnique(data.query_refs)) !== stableStringify(sortedUnique(asset.query_refs))
      || !data.claim_versions.every((item) => hasExactVersion(asset.claim_versions, item.ref, item.version))
      || !data.knowledge_release_versions.every((item) =>
        hasExactVersion(asset.knowledge_release_versions, item.ref, item.version))) {
    addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { reason: 'proposal_outside_asset_scope' });
  }
  if (sha256(object.content) !== data.body_sha256) addError(errors, 'CHECKSUM_MISMATCH', object, { field: 'body_sha256' });
  const itemIds = new Set();
  for (const ref of data.finding_refs) {
    const findingEvidence = graph.byId.get(ref)?.data.evidence_refs ?? [];
    if (!isSubset(findingEvidence, data.evidence_refs)) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { ref, field: 'evidence_refs' });
    }
  }
  for (const item of data.recommendation_items) {
    if (itemIds.has(item.item_id) || !hasSection(object.content, item.section)) {
      addError(errors, 'M4_FIELD_REQUIRED', object, { field: 'recommendation_items.section' });
    }
    itemIds.add(item.item_id);
    if (!isSubset(item.claim_refs, data.claim_versions.map(({ ref }) => ref))
        || !isSubset(item.evidence_refs, data.evidence_refs)
        || !isSubset(item.finding_refs, data.finding_refs)) {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { item_id: item.item_id });
    }
    const riskyClaim = item.claim_refs.some((ref) => {
      const claim = graph.byId.get(ref)?.data;
      return !['approved', 'published'].includes(claim?.status)
        || claim?.evidence_sufficiency?.status !== 'sufficient';
    });
    const riskyEvidence = item.evidence_refs.some((ref) => graph.byId.get(ref)?.data.status === 'stale');
    const conflict = item.finding_refs.some((ref) =>
      (graph.byId.get(ref)?.data.gap_basis?.unresolved_conflicts?.length ?? 0) > 0);
    if ((riskyClaim || riskyEvidence || conflict) && item.risk.type === 'none') {
      addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { item_id: item.item_id, field: 'risk' });
    }
  }
}

function validateAdoption(graph, object, errors) {
  const data = object.data;
  const proposal = graph.byId.get(data.proposal_ref)?.data;
  if (!proposal || proposal.record_type !== 'asset_proposal' || proposal.asset_ref !== data.asset_ref) {
    addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { field: 'proposal_ref' });
    return;
  }
  const expected = proposal.recommendation_items.map((item) => item.item_id).sort();
  const actual = data.decisions.map((item) => item.item_id).sort();
  if (stableStringify(expected) !== stableStringify(actual)) {
    addError(errors, 'M4_FIELD_REQUIRED', object, { field: 'decisions' });
  }
  if (data.status === 'draft' && data.decisions.some((item) => item.decision !== 'pending')) {
    addError(errors, 'AUTO_ADOPTION_FORBIDDEN', object);
  }
  if (data.status === 'decided') {
    if (!data.approval || data.decisions.some((item) => item.decision === 'pending')) {
      addError(errors, 'GAP_REQUIRES_HUMAN', object);
    }
    for (const item of data.decisions) {
      if (item.decision === 'modified' && !item.modified_text?.trim()) {
        addError(errors, 'M4_FIELD_REQUIRED', object, { item_id: item.item_id, field: 'modified_text' });
      }
    }
  }
}

function validatePublication(graph, object, errors) {
  const data = object.data;
  const proposal = graph.byId.get(data.proposal_ref)?.data;
  const adoption = graph.byId.get(data.adoption_ref)?.data;
  if (!proposal || proposal.record_type !== 'asset_proposal'
      || !adoption || adoption.record_type !== 'adoption_record'
      || adoption.proposal_ref !== data.proposal_ref
      || proposal.asset_ref !== data.asset_ref
      || adoption.asset_ref !== data.asset_ref) {
    addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { reason: 'publication_relation_mismatch' });
  }
  if (data.status === 'draft') return;
  if (!data.approval) addError(errors, 'GAP_REQUIRES_HUMAN', object);
  if (data.status === 'withdrawn') return;
  for (const field of missingList(data, [
    'published_item_ids', 'published_locator', 'content_sha256', 'published_at',
  ])) addError(errors, 'M4_FIELD_REQUIRED', object, { field });
  if (adoption?.status !== 'decided') {
    addError(errors, 'PUBLICATION_REQUIRED', object, { ref: data.adoption_ref });
    return;
  }
  const allowed = adoption.decisions
    .filter((item) => ['accepted', 'modified'].includes(item.decision))
    .map((item) => item.item_id);
  if (!isSubset(data.published_item_ids, allowed)) {
    addError(errors, 'GAP_CLASSIFICATION_INVALID', object, { field: 'published_item_ids' });
  }
}

export function validateDiagnosisObject(graph, object) {
  const errors = [];
  const warnings = [];
  if (!isM4Object(object.data)) return { errors, warnings };
  switch (object.data.record_type) {
    case 'finding': validateFinding(graph, object, errors); break;
    case 'asset': validateAsset(graph, object, errors); break;
    case 'evidence': validateEvidence(graph, object, errors); break;
    case 'run': validateRun(graph, object, errors); break;
    case 'asset_proposal': validateProposal(graph, object, errors); break;
    case 'adoption_record': validateAdoption(graph, object, errors); break;
    case 'asset_publication': validatePublication(graph, object, errors); break;
    case 'evidence_plan':
      for (const field of missingList(object.data, ['finding_refs', 'asset_refs', 'deployment_targets'])) {
        addError(errors, 'M4_FIELD_REQUIRED', object, { field });
      }
      break;
    default: break;
  }
  if (object.data.record_type === 'evidence') {
    if (object.data.access_state === 'blocked') warnings.push({ code: 'SOURCE_BLOCKED', id: object.data.id });
    if (object.data.original_content_state === 'missing') warnings.push({ code: 'ORIGINAL_CONTENT_MISSING', id: object.data.id });
    if (object.data.confidence === 'low') warnings.push({ code: 'LOW_CONFIDENCE', id: object.data.id });
    if (object.data.support_kind && object.data.support_kind !== 'independent'
        && (object.data.independent_support_refs?.length ?? 0) === 0) {
      warnings.push({ code: 'INDEPENDENT_SUPPORT_MISSING', id: object.data.id });
    }
  }
  return { errors, warnings };
}

export async function validateDiagnosisWorkspace({ workspace }) {
  let graph;
  try {
    graph = await loadWorkspaceGraph({ workspace });
  } catch (error) {
    if (error.code === 'INDEX_VALIDATION_FAILED') return { errors: error.diagnostics, warnings: [] };
    throw error;
  }
  const errors = [];
  const warnings = [];
  for (const object of graph.objects) {
    const result = validateDiagnosisObject(graph, object);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  const proposals = graph.objects.filter(({ data }) =>
    data.record_type === 'asset_proposal' && data.status !== 'superseded');
  const seen = new Map();
  for (const proposal of proposals) {
    const key = proposalUniqueKey(proposal.data);
    const previous = seen.get(key);
    if (previous) addError(errors, 'DUPLICATE_ASSET_PROPOSAL', proposal, { duplicate_of: previous.data.id });
    else seen.set(key, proposal);
  }
  return { errors, warnings };
}
