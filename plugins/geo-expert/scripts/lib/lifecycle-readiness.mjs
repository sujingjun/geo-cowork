import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { loadWorkspaceGraph } from './index-builder.mjs';

export class LifecycleReadinessError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'LifecycleReadinessError';
    this.code = code;
    Object.assign(this, details);
  }
}

function gate(code, status, reason, refs = []) {
  return { code, status, reason, refs: [...new Set(refs)].sort() };
}

function isApproved(data) {
  return Boolean(data?.approval)
    && ['approved', 'published', 'formal', 'frozen', 'active'].includes(data.status);
}

function knowledgeClosure({ graph, knowledgeBase, goalRef }) {
  const failures = [];
  const refs = [];
  const goal = graph.byId.get(goalRef)?.data;
  if (!goal || goal.record_type !== 'perception_goal' || !isApproved(goal)) {
    return { ready: false, failures: ['goal'], refs };
  }
  refs.push(goal.id);
  const querySets = (goal.query_set_refs ?? [])
    .map((ref) => graph.byId.get(ref)?.data)
    .filter((item) => item?.record_type === 'query_set' && item.status === 'frozen' && item.approval);
  if (querySets.length === 0) failures.push('query_set');
  const releaseObjects = graph.objects.filter(({ data, path: objectPath }) =>
    data.record_type === 'knowledge_release'
      && data.status === 'published'
      && data.approval
      && (!knowledgeBase || objectPath.startsWith(`${knowledgeBase.root_path}/`)));
  if (releaseObjects.length === 0) failures.push('knowledge_release');
  refs.push(...releaseObjects.map(({ data }) => data.id));

  for (const querySet of querySets) {
    refs.push(querySet.id);
    for (const version of querySet.query_versions ?? []) {
      const query = graph.byId.get(version.ref)?.data;
      if (!query || query.version !== version.version || query.status !== 'formal' || !query.approval) {
        failures.push(`query:${version.ref}`);
        continue;
      }
      refs.push(query.id);
      const answers = graph.objects.filter(({ data, path: objectPath }) =>
        data.record_type === 'answer_card'
          && ['approved', 'published'].includes(data.status)
          && data.approval
          && data.query_refs?.includes(query.id)
          && (!knowledgeBase || objectPath.startsWith(`${knowledgeBase.root_path}/`)));
      if (answers.length === 0) failures.push(`answer_card:${query.id}`);
      for (const { data: answer } of answers) {
        refs.push(answer.id);
        for (const claimVersion of answer.claim_versions ?? []) {
          const claimObject = graph.byId.get(claimVersion.ref);
          const claim = claimObject?.data;
          if (!claim || claim.version !== claimVersion.version
              || !['approved', 'published'].includes(claim.status) || !claim.approval
              || knowledgeBase && !claimObject.path.startsWith(`${knowledgeBase.root_path}/`)) {
            failures.push(`claim:${claimVersion.ref}`);
            continue;
          }
          refs.push(claim.id);
          for (const evidenceRef of claim.evidence_refs ?? []) {
            const evidence = graph.byId.get(evidenceRef)?.data;
            if (!evidence || evidence.record_type !== 'evidence'
                || evidence.status !== 'approved' || !evidence.approval) {
              failures.push(`evidence:${evidenceRef}`);
            } else {
              refs.push(evidence.id, ...(evidence.source_refs ?? []));
            }
          }
          for (const documentRef of claim.document_refs ?? []) {
            const documentObject = graph.byId.get(documentRef);
            const document = documentObject?.data;
            if (!document || document.record_type !== 'document'
                || document.status !== 'approved' || !document.approval
                || knowledgeBase && !documentObject.path.startsWith(`${knowledgeBase.root_path}/`)) {
              failures.push(`document:${documentRef}`);
            } else {
              refs.push(document.id);
            }
          }
        }
      }
    }
  }
  return { ready: failures.length === 0, failures: [...new Set(failures)].sort(), refs };
}

export async function assessLifecycleReadiness({ workspace, knowledgeBaseRef, goalRef }) {
  const root = path.resolve(workspace);
  let identity;
  try {
    identity = JSON.parse(await readFile(path.join(root, 'workspace.json'), 'utf8'));
  } catch {
    throw new LifecycleReadinessError('WORKSPACE_SCOPE_INVALID', 'workspace.json 不可读');
  }
  const graph = await loadWorkspaceGraph({ workspace: root });
  const knowledgeBaseObject = graph.byId.get(knowledgeBaseRef);
  if (identity.workspace_mode === 'development_test'
      && knowledgeBaseRef !== identity.knowledge_base_ref) {
    throw new LifecycleReadinessError(
      'KNOWLEDGE_BASE_SCOPE_MISMATCH',
      'knowledge_base_ref 与 development-test Workspace 不一致',
    );
  }
  const knowledgeBase = knowledgeBaseObject?.data;
  if (knowledgeBase && (knowledgeBase.record_type !== 'brand_knowledge_base'
      || knowledgeBase.merchant_ref !== identity.merchant_ref)) {
    throw new LifecycleReadinessError('KNOWLEDGE_BASE_SCOPE_MISMATCH', 'Knowledge Base 不属于当前 Merchant');
  }
  const closure = knowledgeBase
    ? knowledgeClosure({ graph, knowledgeBase, goalRef })
    : { ready: false, failures: ['knowledge_base'], refs: [] };
  const testMode = knowledgeBase?.mode === 'test_only';
  const analyticsConfigured = Boolean(
    identity.online_configuration?.ga4_property_id
      && identity.online_configuration?.gsc_site_url,
  );
  const gates = [
    gate(
      'MERCHANT_IDENTITY',
      identity.merchant_ref ? 'pass' : 'blocked',
      identity.merchant_ref ? 'Merchant identity present.' : 'Merchant identity missing.',
      identity.merchant_ref ? [identity.merchant_ref] : [],
    ),
    gate(
      closure.ready ? 'KNOWLEDGE_CLOSURE_READY' : 'KNOWLEDGE_INPUT_ABSENT',
      closure.ready ? 'pass' : 'blocked',
      closure.ready
        ? 'Goal-scoped approved knowledge closure is complete.'
        : `Missing knowledge inputs: ${closure.failures.join(', ')}`,
      closure.refs,
    ),
    gate(
      'ANALYTICS_CONFIGURATION',
      analyticsConfigured ? 'pass' : 'blocked',
      analyticsConfigured ? 'GA4/GSC non-secret resource configuration present.' : 'Analytics configuration missing.',
    ),
    gate(
      'BUSINESS_FILE_NOT_PROVIDED',
      'not_applicable',
      'No authorized aggregate business file was supplied for this readiness run.',
    ),
  ];
  return {
    schema_version: 'lifecycle-readiness/1.0.0',
    workspace: root,
    merchant_ref: identity.merchant_ref ?? null,
    knowledge_base_ref: knowledgeBaseRef,
    goal_ref: goalRef,
    knowledge_base_mode: knowledgeBase?.mode ?? 'missing',
    engineering_ready: Boolean(testMode && closure.ready && analyticsConfigured),
    real_cycle_start_ready: Boolean(!testMode && closure.ready && analyticsConfigured),
    formal_cycle_created: false,
    gates,
    knowledge_absence: {
      missing: !closure.ready,
      content_gap_inferred: false,
    },
    limitations: [
      'Readiness is a read-only gate report.',
      'It does not approve knowledge, create a Cycle, prove Publication, or claim business effect.',
    ],
  };
}
