import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { writeCreateOnly } from './workspace-paths.mjs';

const HARD_FIELDS = [
  'platform', 'product_entry', 'region', 'language', 'login_state',
  'web_search_state', 'query_template_version', 'sampling_count',
];
const SOFT_FIELDS = ['model_mode', 'collection_method', 'conversation_state'];
const OUTCOMES = [
  'success', 'refusal', 'timeout', 'no_result',
  'challenge', 'cancelled', 'system_failure',
];

export class AnswerAggregationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnswerAggregationError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fieldValue(profile, field) {
  if (field === 'time_window') {
    return Date.parse(profile.time_window.ends_at) - Date.parse(profile.time_window.starts_at);
  }
  return profile[field];
}

export function compareCollectorProfiles(before, after) {
  const fieldDifferences = [];
  let hardMismatch = false;
  let partial = false;
  for (const field of [...HARD_FIELDS, 'time_window']) {
    const left = fieldValue(before, field);
    const right = fieldValue(after, field);
    if (left === 'unknown' || right === 'unknown') {
      partial = true;
      fieldDifferences.push({ field, before: left, after: right, severity: 'unknown' });
    } else if (left !== right) {
      hardMismatch = true;
      fieldDifferences.push({ field, before: left, after: right, severity: 'hard' });
    }
  }
  for (const field of SOFT_FIELDS) {
    const left = fieldValue(before, field);
    const right = fieldValue(after, field);
    if (left === 'unknown' || right === 'unknown' || left !== right) {
      partial = true;
      fieldDifferences.push({ field, before: left, after: right, severity: 'soft' });
    }
  }
  const deviceFields = ['class', 'os', 'browser', 'viewport'];
  for (const field of deviceFields) {
    const left = before.device[field];
    const right = after.device[field];
    if (left === 'unknown' || right === 'unknown' || left !== right) {
      partial = true;
      fieldDifferences.push({ field: `device.${field}`, before: left, after: right, severity: 'soft' });
    }
  }
  const result = hardMismatch ? false : partial ? 'partial' : true;
  return {
    result,
    field_differences: fieldDifferences,
    notes: result === true ? [] : [
      hardMismatch ? '存在硬条件差异，不可比较。' : '存在未知或软条件差异，仅部分可比。',
    ],
  };
}

function currentObjects(graph, type) {
  return graph.objects.filter(({ data }) =>
    data.record_type === type && data.status !== 'superseded');
}

function refVersions(objects) {
  return objects
    .map(({ data }) => ({ ref: data.id, version: data.version }))
    .sort((a, b) => a.ref.localeCompare(b.ref));
}

function outcomeCounts(samples) {
  return Object.fromEntries(OUTCOMES.map((outcome) => [
    outcome,
    samples.filter((sample) => sample.outcome === outcome).length,
  ]));
}

function citationUnits(citations) {
  const byKey = new Map();
  for (const citation of citations) {
    const key = `${citation.sample_ref}\0${citation.url_normalized}`;
    const previous = byKey.get(key);
    if (previous && (previous.citation_domain !== citation.citation_domain
      || previous.source_ref !== citation.source_ref)) {
      throw new AnswerAggregationError('SOURCE_CLASSIFICATION_CONFLICT', 'Citation 单元关系冲突');
    }
    if (!previous) byKey.set(key, citation);
  }
  return [...byKey.values()];
}

function domainMetrics(units) {
  const counts = new Map();
  for (const unit of units) {
    counts.set(unit.citation_domain, (counts.get(unit.citation_domain) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([domain, count]) => ({
      domain,
      count,
      share: units.length === 0 ? null : count / units.length,
    }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));
}

function diversityMetrics(units, classificationsBySource) {
  const known = units
    .map((unit) => classificationsBySource.get(unit.source_ref))
    .filter((classification) => classification
      && classification.primary_source_type !== 'unknown');
  const counts = new Map();
  for (const classification of known) {
    counts.set(
      classification.primary_source_type,
      (counts.get(classification.primary_source_type) ?? 0) + 1,
    );
  }
  let entropy = null;
  if (known.length > 0) {
    entropy = -[...counts.values()].reduce((sum, count) => {
      const probability = count / known.length;
      return sum + probability * Math.log(probability);
    }, 0) / Math.log(5);
  }
  const coverage = units.length === 0 ? null : known.length / units.length;
  return {
    distinct_source_types: counts.size,
    distinct_citation_domains: new Set(units.map((unit) => unit.citation_domain)).size,
    classification_coverage: coverage,
    normalized_source_type_entropy: entropy,
    status: coverage === 1 ? 'computed' : 'partial',
  };
}

function partyMetrics(units, classificationsBySource) {
  const counts = { first_party: 0, third_party: 0, unknown: 0 };
  for (const unit of units) {
    const relation = classificationsBySource.get(unit.source_ref)?.party_relation ?? 'unknown';
    counts[relation] += 1;
  }
  const total = units.length;
  return {
    first_party_count: counts.first_party,
    third_party_count: counts.third_party,
    unknown_count: counts.unknown,
    first_party_share: total === 0 ? null : counts.first_party / total,
    third_party_share: total === 0 ? null : counts.third_party / total,
    unknown_share: total === 0 ? null : counts.unknown / total,
    party_coverage: total === 0 ? null : (counts.first_party + counts.third_party) / total,
    ratio: counts.third_party === 0 ? null : counts.first_party / counts.third_party,
    ratio_reason: counts.third_party === 0 ? 'NO_THIRD_PARTY_CITATIONS' : null,
  };
}

export function sourceVolatility({
  currentDomains,
  previousDomains,
  comparability,
  currentWindow,
  previousWindow,
}) {
  if (comparability !== true) return { value: null, reason: 'COMPARABILITY_NOT_TRUE' };
  if (Date.parse(previousWindow.ends_at) > Date.parse(currentWindow.starts_at)) {
    return { value: null, reason: 'TIME_WINDOWS_OVERLAP' };
  }
  const currentTotal = currentDomains.reduce((sum, item) => sum + item.count, 0);
  const previousTotal = previousDomains.reduce((sum, item) => sum + item.count, 0);
  if (currentTotal === 0 || previousTotal === 0) return { value: null, reason: 'NO_CITATIONS' };
  const current = new Map(currentDomains.map((item) => [item.domain, item.share]));
  const previous = new Map(previousDomains.map((item) => [item.domain, item.share]));
  const domains = new Set([...current.keys(), ...previous.keys()]);
  const value = 0.5 * [...domains]
    .reduce((sum, domain) => sum + Math.abs((current.get(domain) ?? 0) - (previous.get(domain) ?? 0)), 0);
  return { value, reason: null };
}

function assertFormalSlots(samples, purpose) {
  if (purpose === 'exploratory') return;
  if (samples.length !== 3
      || samples.map((sample) => sample.ordinal).sort().join(',') !== '1,2,3'
      || new Set(samples.map((sample) => sample.slot_key)).size !== 3) {
    throw new AnswerAggregationError('SAMPLE_NOT_INDEPENDENT', '正式 Aggregation 必须包含三个独立 slot');
  }
}

export async function materializeAnswerAggregation({ workspace, plan, now }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const samples = plan.samples.map((item) => graph.byId.get(item.id)?.data);
  if (samples.some((sample) => !sample || sample.record_type !== 'answer_sample')) {
    throw new AnswerAggregationError('ANALYSIS_CHAIN_INCOMPLETE', 'Aggregation 缺少 Sample');
  }
  assertFormalSlots(samples, plan.purpose);
  const sampleIds = new Set(samples.map((sample) => sample.id));
  const citations = currentObjects(graph, 'citation_observation')
    .map(({ data }) => data)
    .filter((citation) => sampleIds.has(citation.sample_ref));
  const units = citationUnits(citations);
  const sourceIds = new Set(units.map((unit) => unit.source_ref));
  const sources = currentObjects(graph, 'source')
    .filter(({ data }) => sourceIds.has(data.id));
  const classifications = currentObjects(graph, 'source_classification')
    .filter(({ data }) => sourceIds.has(data.source_ref));
  const classificationsBySource = new Map(classifications.map(({ data }) => [data.source_ref, data]));
  const citationIds = new Set(citations.map((citation) => citation.id));
  const supports = currentObjects(graph, 'claim_support_review')
    .filter(({ data }) => citationIds.has(data.citation_ref));
  const supportByCitation = new Map(supports.map(({ data }) => [data.citation_ref, data]));
  const reviews = currentObjects(graph, 'answer_review')
    .filter(({ data }) => sampleIds.has(data.sample_ref));
  const reviewBySample = new Map(reviews.map(({ data }) => [data.sample_ref, data]));
  if (units.some((unit) => !classificationsBySource.has(unit.source_ref)
      || !supportByCitation.has(unit.id))
      || samples.some((sample) => !reviewBySample.has(sample.id))) {
    throw new AnswerAggregationError('ANALYSIS_CHAIN_INCOMPLETE', 'Aggregation 分析链不完整');
  }

  const profile = graph.byId.get(plan.profile.data.id)?.data;
  let comparability = compareCollectorProfiles(profile, profile);
  const domains = domainMetrics(units);
  let volatility = { value: null, reason: 'NO_COMPARISON_BASELINE' };
  if (plan.aggregation.compared_to_ref) {
    const previous = graph.byId.get(plan.aggregation.compared_to_ref)?.data;
    const previousProfile = previous
      ? graph.byId.get(previous.profile_versions[0]?.ref)?.data
      : null;
    if (!previous || previous.record_type !== 'answer_aggregation' || !previousProfile
        || previous.industry !== plan.industry
        || previous.platform !== profile.platform
        || previous.query_cluster.id !== plan.query_cluster.id) {
      throw new AnswerAggregationError('COMPARABILITY_FALSE', '前一 Aggregation 维度不匹配');
    }
    comparability = {
      ...compareCollectorProfiles(previousProfile, profile),
      compared_to_ref: previous.id,
    };
    volatility = sourceVolatility({
      currentDomains: domains,
      previousDomains: previous.metrics.citation_share.domains,
      comparability: comparability.result,
      currentWindow: profile.time_window,
      previousWindow: previous.time_window,
    });
  }
  const allCitations = currentObjects(graph, 'citation_observation').map(({ data }) => data);
  const sampleById = new Map(currentObjects(graph, 'answer_sample').map(({ data }) => [data.id, data]));
  const lifecycle = sources.map(({ data: source }) => {
    const observations = allCitations
      .filter((citation) => citation.source_ref === source.id)
      .map((citation) => sampleById.get(citation.sample_ref))
      .filter(Boolean);
    return observations.some((sample) =>
      Date.parse(sample.captured_at) < Date.parse(profile.time_window.starts_at))
      ? 'returning'
      : 'new';
  });
  const metrics = {
    expected_sample_count: plan.purpose === 'exploratory' ? samples.length : 3,
    selected_sample_count: samples.length,
    outcome_counts: outcomeCounts(samples),
    system_failure_attempt_count: samples.filter((sample) => sample.outcome === 'system_failure').length,
    no_citation_answer_count: samples.filter((sample) =>
      !citations.some((citation) => citation.sample_ref === sample.id)).length,
    total_citation_units: units.length,
    top_citation_domains: domains.slice(0, plan.aggregation.top_n ?? 10),
    citation_share: {
      denominator: units.length,
      domains,
      reason: units.length === 0 ? 'NO_CITATIONS' : null,
    },
    source_diversity: diversityMetrics(units, classificationsBySource),
    party_relation: partyMetrics(units, classificationsBySource),
    source_volatility: volatility,
    new_source_count: lifecycle.filter((item) => item === 'new').length,
    returning_source_count: lifecycle.filter((item) => item === 'returning').length,
    classification_counts: {
      candidate: classifications.filter(({ data }) => data.status === 'candidate').length,
      reviewed: classifications.filter(({ data }) => data.status === 'reviewed').length,
      unresolved: classifications.filter(({ data }) =>
        data.primary_source_type === 'unknown' || data.review_required).length,
    },
    review_required_count: [
      ...classifications.map(({ data }) => data),
      ...supports.map(({ data }) => data),
      ...reviews.map(({ data }) => data),
    ].filter((item) => item.review_required).length,
  };
  const data = {
    id: plan.aggregation.id,
    record_type: 'answer_aggregation',
    status: 'computed',
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `Answer Aggregation ${plan.aggregation.id}`,
    purpose: plan.purpose,
    industry: plan.industry,
    platform: profile.platform,
    query_cluster: plan.query_cluster,
    time_window: profile.time_window,
    profile_versions: [{ ref: profile.id, version: profile.version }],
    selected_sample_versions: samples
      .map((sample) => ({
        slot_key: sample.slot_key,
        ref: sample.id,
        version: sample.version,
        raw_manifest_sha256: sample.raw_manifest_sha256,
      }))
      .sort((a, b) => a.slot_key.localeCompare(b.slot_key)),
    citation_versions: refVersions(citations.map((dataItem) => ({ data: dataItem }))),
    source_versions: refVersions(sources),
    classification_versions: refVersions(classifications),
    claim_support_review_versions: refVersions(supports),
    answer_review_versions: reviews
      .map(({ data: review }) => ({
        ref: review.id,
        version: review.version,
        rubric_sha256: review.rubric.sha256,
      }))
      .sort((a, b) => a.ref.localeCompare(b.ref)),
    comparability,
    metrics,
  };
  validateObjectData(data, { path: plan.aggregation.path });
  const result = await writeCreateOnly(
    workspace,
    plan.aggregation.path,
    serializeMarkdownObject(data, `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'AGGREGATION_INPUT_DRIFT' },
  );
  return { ...data, action: result.action };
}
