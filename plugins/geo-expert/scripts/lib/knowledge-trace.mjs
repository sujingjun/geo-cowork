import { loadWorkspaceGraph } from './index-builder.mjs';

class KnowledgeTraceError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'KnowledgeTraceError';
    this.code = code;
    Object.assign(this, details);
  }
}

function sortedUnique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function objectFor(graph, ref, type) {
  const object = graph.byId.get(ref);
  if (!object) throw new KnowledgeTraceError('BROKEN_REF', '对象引用不存在', { ref });
  if (object.data.record_type !== type) {
    throw new KnowledgeTraceError('REF_TYPE_MISMATCH', '对象引用类型错误', {
      ref, expected: type, actual: object.data.record_type,
    });
  }
  return object;
}

function gate(object, allowedStatuses, options = {}) {
  const reasons = [];
  if (!allowedStatuses.includes(object.data.status)) reasons.push('status');
  if (options.approval && !object.data.approval) reasons.push('approval');
  if (options.readiness && object.data.readiness !== options.readiness) reasons.push('readiness');
  return reasons.length === 0 ? null : {
    code: 'LIFECYCLE_NOT_READY',
    ref: object.data.id,
    record_type: object.data.record_type,
    status: object.data.status,
    reasons,
  };
}

export async function traceQuery({ workspace, queryId }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const query = objectFor(graph, queryId, 'query');
  const cards = graph.objects.filter(({ data }) =>
    data.record_type === 'answer_card' && data.query_refs.includes(queryId));
  const claimRefs = sortedUnique(cards.flatMap(({ data }) => data.claim_versions.map((item) => item.ref)));
  const claims = claimRefs.map((ref) => graph.byId.get(ref)).filter(Boolean);
  const evidenceRefs = sortedUnique([
    ...cards.flatMap(({ data }) => data.evidence_refs ?? []),
    ...claims.flatMap(({ data }) => data.evidence_refs ?? []),
  ]);
  const sourceRefs = sortedUnique(evidenceRefs.flatMap((ref) => graph.byId.get(ref)?.data.source_refs ?? []));
  const documentRefs = sortedUnique(claims.flatMap(({ data }) => data.document_refs ?? []));
  const goalRefs = sortedUnique(query.data.goal_refs ?? []);
  const querySets = graph.objects.filter(({ data }) => data.record_type === 'query_set'
    && data.query_versions.some((item) => item.ref === queryId && item.version === query.data.version));
  const explicitReleases = sortedUnique([
    ...cards.flatMap(({ data }) => data.release_refs ?? []),
    ...claims.flatMap(({ data }) => data.release_refs ?? []),
  ]);
  const matchingReleases = graph.objects
    .filter(({ data }) => data.record_type === 'knowledge_release'
      && (data.answer_card_versions.some((item) => cards.some((card) => card.data.id === item.ref))
        || data.claim_versions.some((item) => claimRefs.includes(item.ref))))
    .map(({ data }) => data.id);
  const releaseRefs = sortedUnique([...explicitReleases, ...matchingReleases]);
  if (cards.length === 0 || claimRefs.length === 0 || evidenceRefs.length === 0
      || sourceRefs.length === 0 || documentRefs.length === 0 || releaseRefs.length === 0) {
    throw new KnowledgeTraceError('TRACE_INCOMPLETE', 'Query 追溯链不完整', { query_id: queryId });
  }

  const objects = [
    [query, ['formal'], { approval: true }],
    ...goalRefs.map((ref) => [objectFor(graph, ref, 'perception_goal'), ['approved', 'active'], { approval: true }]),
    ...querySets.map((object) => [object, ['frozen'], { approval: true }]),
    ...cards.map((object) => [object, ['approved', 'published'], { approval: true }]),
    ...claims.map((object) => [object, ['approved', 'published'], { approval: true }]),
    ...evidenceRefs.map((ref) => [objectFor(graph, ref, 'evidence'), ['approved'], { approval: true }]),
    ...sourceRefs.map((ref) => [objectFor(graph, ref, 'source'), ['active'], {}]),
    ...documentRefs.map((ref) => [objectFor(graph, ref, 'document'), ['approved'], { approval: true }]),
    ...releaseRefs.map((ref) => [objectFor(graph, ref, 'knowledge_release'), ['published'], {
      approval: true, readiness: 'ready',
    }]),
  ];
  const gates = objects.map(([object, statuses, options]) => gate(object, statuses, options)).filter(Boolean);
  if (goalRefs.length === 0) {
    gates.push({ code: 'LIFECYCLE_NOT_READY', ref: queryId, record_type: 'query', status: query.data.status, reasons: ['goal_refs'] });
  }
  if (querySets.length === 0) {
    gates.push({ code: 'LIFECYCLE_NOT_READY', ref: queryId, record_type: 'query', status: query.data.status, reasons: ['query_set'] });
  }
  return {
    query_ref: queryId,
    goal_refs: goalRefs,
    query_set_refs: sortedUnique(querySets.map(({ data }) => data.id)),
    answer_card_refs: sortedUnique(cards.map(({ data }) => data.id)),
    claim_refs: claimRefs,
    evidence_refs: evidenceRefs,
    source_refs: sourceRefs,
    document_refs: documentRefs,
    release_refs: releaseRefs,
    lifecycle_ready: gates.length === 0,
    gates,
  };
}
