import { readFile } from 'node:fs/promises';

import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

const PROFILE_FIELDS = [
  'platform', 'product_entry', 'region', 'language', 'login_state',
  'conversation_state', 'web_search_state', 'model_mode',
  'query_template_version', 'sampling_count', 'time_window', 'device',
  'collection_method',
];

const M5_TYPES = new Set([
  'collector_profile', 'answer_sample', 'citation_observation',
  'source_classification', 'claim_support_review', 'answer_review',
  'answer_aggregation',
]);

export class AnswerProfileError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnswerProfileError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function collectorProfileFingerprint(data) {
  const fields = data.language_contract ? [...PROFILE_FIELDS, 'language_contract'] : PROFILE_FIELDS;
  const payload = Object.fromEntries(fields.map((field) => [field, data[field]]));
  return sha256(stableStringify(payload));
}

export function validateCollectorProfileData(data) {
  if (data.profile_fingerprint !== collectorProfileFingerprint(data)) {
    throw new AnswerProfileError(
      'PROFILE_FINGERPRINT_MISMATCH',
      'Collector Profile fingerprint 不一致',
      { id: data.id },
    );
  }
  if (Date.parse(data.time_window.starts_at) >= Date.parse(data.time_window.ends_at)) {
    throw new AnswerProfileError('M5_FIELD_REQUIRED', 'Collector Profile time window 非法', {
      id: data.id,
      field: 'time_window',
    });
  }
  if (data.status === 'frozen' && !data.approval) {
    throw new AnswerProfileError('PROFILE_NOT_FROZEN', 'frozen Profile 缺少人工批准', {
      id: data.id,
    });
  }
  if (data.language_contract) {
    if (data.sampling_count !== 2
        || data.language_contract.primary_language !== 'en-US'
        || data.language_contract.role === 'primary' && data.language !== 'en-US') {
      throw new AnswerProfileError('M5_FIELD_REQUIRED', 'M5 当前语言合同要求英文主线使用两个正式 slot', {
        id: data.id,
        field: 'language_contract',
      });
    }
  }
  return data;
}

export function sampleSlotKey({
  purpose,
  queryRef,
  queryVersion,
  platform,
  collectorProfileRef,
  collectorProfileVersion,
  queryTemplateVersion,
  timeWindowId,
  ordinal,
}) {
  return sha256(stableStringify({
    purpose,
    query_ref: queryRef,
    query_version: queryVersion,
    platform,
    collector_profile_ref: collectorProfileRef,
    collector_profile_version: collectorProfileVersion,
    query_template_version: queryTemplateVersion,
    time_window_id: timeWindowId,
    ordinal,
  }));
}

function addError(errors, code, object, details = {}) {
  errors.push({ code, id: object.data.id, path: object.path, ...details });
}

function profileFor(graph, data) {
  const profile = graph.byId.get(data.collector_profile_ref);
  if (!profile || profile.data.record_type !== 'collector_profile') return null;
  return profile;
}

async function validateSample(graph, object, errors) {
  const data = object.data;
  const profile = profileFor(graph, data);
  if (!profile || profile.data.status !== 'frozen') {
    addError(errors, 'PROFILE_NOT_FROZEN', object);
    return;
  }
  if (profile.data.version !== data.collector_profile_version
      || profile.data.platform !== data.platform
      || profile.data.collection_method !== data.collection_method) {
    addError(errors, 'AGGREGATION_INPUT_DRIFT', object, { field: 'collector_profile_ref' });
  }
  const expectedSlot = sampleSlotKey({
    purpose: data.purpose,
    queryRef: data.query_ref,
    queryVersion: data.query_version,
    platform: data.platform,
    collectorProfileRef: data.collector_profile_ref,
    collectorProfileVersion: data.collector_profile_version,
    queryTemplateVersion: profile.data.query_template_version,
    timeWindowId: profile.data.time_window.id,
    ordinal: data.ordinal,
  });
  if (expectedSlot !== data.slot_key) addError(errors, 'SAMPLE_SLOT_CONFLICT', object);
  if (data.raw_manifest_sha256 !== sha256(stableStringify(data.artifacts))) {
    addError(errors, 'CHECKSUM_MISMATCH', object, { field: 'raw_manifest_sha256' });
  }
  const roles = new Set(data.artifacts
    .filter((artifact) => artifact.availability === 'captured')
    .map((artifact) => artifact.role));
  if (['success', 'refusal'].includes(data.outcome) && !roles.has('answer_text')) {
    addError(errors, 'RAW_ARTIFACT_REQUIRED', object, { field: 'answer_text' });
  }
  if (['timeout', 'no_result', 'challenge', 'system_failure'].includes(data.outcome)
      && !roles.has('collector_log') && !roles.has('screenshot')) {
    addError(errors, 'RAW_ARTIFACT_REQUIRED', object, { field: 'collector_log' });
  }
  for (const artifact of data.artifacts) {
    if (artifact.availability === 'unavailable') {
      if (!artifact.unavailable_reason) addError(errors, 'RAW_ARTIFACT_REQUIRED', object);
      continue;
    }
    if (!artifact.path?.startsWith('raw/') && !artifact.path?.startsWith('outputs/')) {
      addError(errors, 'RAW_ARTIFACT_REQUIRED', object, { path: artifact.path });
      continue;
    }
    try {
      const bytes = await readFile(resolveWithin(
        graph.root,
        `runs/${data.run_ref}/${artifact.path}`,
      ));
      if (sha256(bytes) !== artifact.sha256) {
        addError(errors, 'CHECKSUM_MISMATCH', object, { path: artifact.path });
      }
    } catch (error) {
      addError(errors, error.code === 'PATH_ESCAPE' ? 'PRIVACY_SCOPE_VIOLATION' : 'RAW_ARTIFACT_REQUIRED', object, {
        path: artifact.path,
      });
    }
  }
  if (data.privacy.account_identifier_stored || data.privacy.credentials_stored) {
    addError(errors, 'PRIVACY_SCOPE_VIOLATION', object);
  }
  if (data.retry_of_ref) {
    const prior = graph.byId.get(data.retry_of_ref)?.data;
    if (!prior || prior.record_type !== 'answer_sample'
        || prior.outcome !== 'system_failure'
        || prior.slot_key !== data.slot_key
        || data.attempt_no !== prior.attempt_no + 1) {
      addError(errors, 'SAMPLE_NOT_INDEPENDENT', object, { field: 'retry_of_ref' });
    }
  } else if (data.attempt_no !== 1) {
    addError(errors, 'SAMPLE_NOT_INDEPENDENT', object, { field: 'attempt_no' });
  }
}

function validateCitation(graph, object, errors) {
  const data = object.data;
  const sample = graph.byId.get(data.sample_ref)?.data;
  const source = graph.byId.get(data.source_ref)?.data;
  if (!sample || sample.record_type !== 'answer_sample'
      || sample.raw_manifest_sha256 !== data.sample_raw_manifest_sha256) {
    addError(errors, 'AGGREGATION_INPUT_DRIFT', object, { field: 'sample_ref' });
  }
  if (!source || source.record_type !== 'source'
      || (source.discovery?.citation_ref === data.id && source.identity?.key === undefined)) {
    addError(errors, 'CITATION_SOURCE_PAIR_INCOMPLETE', object);
  }
}

function validateSource(graph, object, errors) {
  const data = object.data;
  if (!data.discovery && !data.identity) return;
  if (data.source_kind !== 'consumer_citation' || !data.discovery || !data.identity) {
    addError(errors, 'SOURCE_IDENTITY_CONFLICT', object);
    return;
  }
  const citation = graph.byId.get(data.discovery.citation_ref)?.data;
  if (!citation || citation.record_type !== 'citation_observation'
      || citation.source_ref !== data.id) {
    addError(errors, 'CITATION_SOURCE_PAIR_INCOMPLETE', object);
  }
}

function validateClassification(graph, object, errors, warnings) {
  const data = object.data;
  if (data.secondary_source_types.includes(data.primary_source_type)) {
    addError(errors, 'SOURCE_CLASSIFICATION_CONFLICT', object);
  }
  if (data.citation_refs.some((ref) => graph.byId.get(ref)?.data.source_ref !== data.source_ref)) {
    addError(errors, 'SOURCE_CANDIDATE_UNOBSERVED', object);
  }
  if (data.status === 'superseded') return;
  if (data.primary_source_type === 'unknown') warnings.push({
    code: 'SOURCE_TYPE_UNKNOWN', id: data.id, path: object.path,
  });
  if (data.review_required) warnings.push({
    code: 'CLASSIFICATION_REVIEW_REQUIRED', id: data.id, path: object.path,
  });
}

function validateClaimSupport(graph, object, errors, warnings) {
  const data = object.data;
  const citation = graph.byId.get(data.citation_ref)?.data;
  const classification = graph.byId.get(data.classification_ref)?.data;
  const claim = graph.byId.get(data.claim_ref)?.data;
  if (!citation || !classification || classification.source_ref !== citation.source_ref
      || !claim || claim.version !== data.claim_version) {
    addError(errors, 'CLAIM_SUPPORT_INCOMPLETE', object);
  }
  if (data.review_required) warnings.push({
    code: 'CLAIM_SUPPORT_REVIEW_REQUIRED', id: data.id, path: object.path,
  });
}

function validateReview(graph, object, errors) {
  const data = object.data;
  const sample = graph.byId.get(data.sample_ref)?.data;
  if (!sample || sample.raw_manifest_sha256 !== data.sample_raw_manifest_sha256) {
    addError(errors, 'RUBRIC_DRIFT', object);
  }
}

function validateRun(object, errors) {
  const data = object.data;
  if (data.skill !== 'geo-answer-cycle') return;
  for (const field of [
    'authorization_ref', 'purpose', 'profile_versions', 'query_set_versions',
    'sample_slots', 'collector_contract',
  ]) {
    if (data[field] === undefined || (Array.isArray(data[field]) && data[field].length === 0)) {
      addError(errors, 'M5_FIELD_REQUIRED', object, { field });
    }
  }
  const keys = new Set();
  for (const slot of data.sample_slots ?? []) {
    if (keys.has(slot.slot_key)) addError(errors, 'SAMPLE_SLOT_CONFLICT', object);
    keys.add(slot.slot_key);
    if (slot.completed_steps.some((step) => !slot.step_proofs[step])) {
      addError(errors, 'LEASE_STALE_RECOVERY_REQUIRED', object, { slot_key: slot.slot_key });
    }
  }
}

export async function validateAnswerWorkspace({ workspace }) {
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
    if (object.data.record_type === 'collector_profile') {
      try {
        validateCollectorProfileData(object.data);
      } catch (error) {
        addError(errors, error.code, object);
      }
      if (PROFILE_FIELDS.some((field) => object.data[field] === 'unknown')) {
        warnings.push({ code: 'PROFILE_FIELD_UNKNOWN', id: object.data.id, path: object.path });
      }
    } else if (object.data.record_type === 'answer_sample') {
      await validateSample(graph, object, errors);
    } else if (object.data.record_type === 'citation_observation') {
      validateCitation(graph, object, errors);
    } else if (object.data.record_type === 'source') {
      validateSource(graph, object, errors);
    } else if (object.data.record_type === 'source_classification') {
      validateClassification(graph, object, errors, warnings);
    } else if (object.data.record_type === 'claim_support_review') {
      validateClaimSupport(graph, object, errors, warnings);
    } else if (object.data.record_type === 'answer_review') {
      validateReview(graph, object, errors);
    } else if (object.data.record_type === 'run') {
      validateRun(object, errors);
    } else if (M5_TYPES.has(object.data.record_type)) {
      // answer_aggregation 的输入闭包由聚合器与 index version refs 共同校验。
    }
  }
  const attempts = new Map();
  for (const object of graph.objects.filter(({ data }) => data.record_type === 'answer_sample')) {
    const key = `${object.data.slot_key}\0${object.data.attempt_no}`;
    const previous = attempts.get(key);
    if (previous) addError(errors, 'SAMPLE_SLOT_CONFLICT', object, { duplicate_of: previous.data.id });
    else attempts.set(key, object);
  }
  const sourceIds = new Set(graph.objects
    .filter(({ data }) => data.record_type === 'citation_observation'
      && data.status !== 'superseded')
    .map(({ data }) => data.source_ref));
  if (sourceIds.size > 0) {
    const queued = [...sourceIds]
      .map((id) => graph.byId.get(id)?.data)
      .filter((source) => source?.classification_queue
        && source.classification_queue.status !== 'classified');
    if (queued.length > 0) {
      const threshold = queued[0].classification_queue.threshold;
      warnings.push({
        code: sourceIds.size >= threshold
          ? 'SOURCE_CLASSIFICATION_BATCH_READY'
          : 'SOURCE_CLASSIFICATION_DEFERRED',
        unique_source_count: sourceIds.size,
        threshold,
        remaining_to_batch: Math.max(0, threshold - sourceIds.size),
      });
    }
  }
  return { errors, warnings };
}
