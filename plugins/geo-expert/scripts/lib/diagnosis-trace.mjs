import { loadWorkspaceGraph } from './index-builder.mjs';
import { DiagnosisError, requireObject, sortedUnique } from './diagnosis-io.mjs';

export async function traceProposal({ workspace, proposalId }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const proposal = requireObject(graph, proposalId, 'asset_proposal');
  const querySetRefs = graph.objects
    .filter(({ data }) => data.record_type === 'query_set'
      && data.query_versions.some(({ ref }) => proposal.data.query_refs.includes(ref))
      && data.goal_refs.some((ref) => proposal.data.goal_refs.includes(ref)))
    .map(({ data }) => data.id);
  const evidence = proposal.data.evidence_refs
    .map((ref) => requireObject(graph, ref, 'evidence').data);
  const sourceRefs = evidence.flatMap((item) => item.source_refs ?? []);
  const adoptions = graph.objects.filter(({ data }) =>
    data.record_type === 'adoption_record' && data.proposal_ref === proposalId);
  const adoptionRefs = adoptions.map(({ data }) => data.id);
  const publications = graph.objects.filter(({ data }) =>
    data.record_type === 'asset_publication' && data.proposal_ref === proposalId);
  const publicationRefs = publications.map(({ data }) => data.id);
  const retestFindings = graph.objects.filter(({ data }) =>
    data.record_type === 'finding' && proposal.data.finding_refs.includes(data.retest_of_ref));
  const retestFindingRefs = retestFindings.map(({ data }) => data.id);
  const retestRuns = graph.objects.filter(({ data }) => data.record_type === 'run'
    && ((data.publication_refs ?? []).some((ref) => publicationRefs.includes(ref))
      || (data.retest_of_refs ?? []).some((ref) => proposal.data.finding_refs.includes(ref))));
  const gates = [];
  if (querySetRefs.length === 0) {
    gates.push({ code: 'TRACE_INCOMPLETE', relation: 'query_set' });
  }
  if (adoptions.length === 0 || adoptions.every(({ data }) => data.status !== 'decided')) {
    gates.push({ code: 'ADOPTION_PENDING' });
  }
  if (publications.length === 0 || publications.every(({ data }) => data.status !== 'confirmed')) {
    gates.push({ code: 'PUBLICATION_PENDING' });
  }
  if (retestFindings.length === 0 || retestRuns.length === 0) {
    gates.push({ code: 'RETEST_PENDING' });
  }
  return {
    proposal_ref: proposalId,
    goal_refs: sortedUnique(proposal.data.goal_refs),
    query_set_refs: sortedUnique(querySetRefs),
    query_refs: sortedUnique(proposal.data.query_refs),
    knowledge_release_refs: sortedUnique(
      proposal.data.knowledge_release_versions.map(({ ref }) => ref),
    ),
    claim_refs: sortedUnique(proposal.data.claim_versions.map(({ ref }) => ref)),
    evidence_refs: sortedUnique(proposal.data.evidence_refs),
    source_refs: sortedUnique(sourceRefs),
    finding_refs: sortedUnique(proposal.data.finding_refs),
    asset_ref: proposal.data.asset_ref,
    adoption_refs: sortedUnique(adoptionRefs),
    publication_refs: sortedUnique(publicationRefs),
    retest_run_refs: sortedUnique(retestRuns.map(({ data }) => data.id)),
    retest_finding_refs: sortedUnique(retestFindingRefs),
    lifecycle_ready: gates.length === 0,
    gates,
  };
}

export function assertTraceComplete(trace) {
  if (trace.gates.some(({ code }) => code === 'TRACE_INCOMPLETE')) {
    throw new DiagnosisError('TRACE_INCOMPLETE', 'Proposal trace 缺少必需关系', {
      gates: trace.gates,
    });
  }
  return trace;
}
