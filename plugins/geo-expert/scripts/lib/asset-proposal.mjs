import { mkdir, rmdir } from 'node:fs/promises';

import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  commonData,
  DiagnosisError,
  prepareOutputs,
  requireObject,
  sortedUnique,
  validateVersionRefs,
  writePreparedOutputs,
} from './diagnosis-io.mjs';
import {
  proposalUniqueKey,
  validateDiagnosisObject,
} from './diagnosis-profile.mjs';
import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

const PROPOSAL_LOCK_ROOT = 'runs/.locks/asset-proposals';
const PROPOSAL_LOCK_TIMEOUT_MS = 5_000;

function normalizedBody(body) {
  if (typeof body !== 'string' || body.trim() === '') {
    throw new DiagnosisError('M4_FIELD_REQUIRED', 'Proposal 必须提供完整 Markdown body');
  }
  return body.endsWith('\n') ? body : `${body}\n`;
}

function assertRefs(graph, item) {
  const asset = requireObject(graph, item.asset_ref, 'asset');
  for (const ref of item.goal_refs ?? []) requireObject(graph, ref, 'perception_goal');
  for (const ref of item.query_refs ?? []) requireObject(graph, ref, 'query');
  for (const ref of item.finding_refs ?? []) requireObject(graph, ref, 'finding');
  for (const ref of item.evidence_refs ?? []) requireObject(graph, ref, 'evidence');
  validateVersionRefs(graph, item.knowledge_release_versions, 'knowledge_release');
  validateVersionRefs(graph, item.claim_versions, 'claim');
  if (stableStringify(sortedUnique(item.goal_refs)) !== stableStringify(sortedUnique(asset.data.goal_refs))
      || stableStringify(sortedUnique(item.query_refs)) !== stableStringify(sortedUnique(asset.data.query_refs))) {
    throw new DiagnosisError('GAP_CLASSIFICATION_INVALID', 'Proposal 必须覆盖目标 Asset 的完整 Goal/Query 集合');
  }
  for (const ref of item.finding_refs ?? []) {
    const finding = requireObject(graph, ref, 'finding');
    if (!finding.data.asset_refs.includes(item.asset_ref)) {
      throw new DiagnosisError('GAP_CLASSIFICATION_INVALID', 'Proposal Finding 不属于目标 Asset', { ref });
    }
    const findingValidation = validateDiagnosisObject(graph, finding);
    if (findingValidation.errors.length > 0) {
      throw new DiagnosisError('GAP_CLASSIFICATION_INVALID', 'Proposal 引用了未通过 M4 profile 的 Finding', {
        ref,
        diagnostics: findingValidation.errors,
      });
    }
  }
}

function proposalObject(graph, item, now) {
  const body = normalizedBody(item.body);
  const data = {
    ...commonData(item, 'asset_proposal', 'draft', now, graph.byId.get(item.id)),
    title: item.title ?? `Asset Proposal ${item.id}`,
    asset_ref: item.asset_ref,
    goal_refs: sortedUnique(item.goal_refs),
    query_refs: sortedUnique(item.query_refs),
    finding_refs: sortedUnique(item.finding_refs),
    knowledge_release_versions: [...(item.knowledge_release_versions ?? [])]
      .sort((a, b) => a.ref.localeCompare(b.ref)),
    claim_versions: [...(item.claim_versions ?? [])].sort((a, b) => a.ref.localeCompare(b.ref)),
    evidence_refs: sortedUnique(item.evidence_refs),
    body_sha256: sha256(body),
    recommendation_items: [...(item.recommendation_items ?? [])]
      .map((entry) => ({
        ...entry,
        claim_refs: sortedUnique(entry.claim_refs),
        evidence_refs: sortedUnique(entry.evidence_refs),
        finding_refs: sortedUnique(entry.finding_refs),
      }))
      .sort((a, b) => a.section.localeCompare(b.section) || a.item_id.localeCompare(b.item_id)),
  };
  return { path: item.path, data, body, conflictCode: 'PROPOSAL_CONFLICT' };
}

function assertUniqueProposalKeys(graph, outputs) {
  const planned = new Map();
  for (const output of outputs) {
    const key = proposalUniqueKey(output.data);
    const previous = planned.get(key);
    if (previous) {
      const code = previous.content === output.content
        ? 'DUPLICATE_ASSET_PROPOSAL' : 'PROPOSAL_CONFLICT';
      throw new DiagnosisError(code, '同一 Asset 与输入版本集合只能有一份 Proposal');
    }
    planned.set(key, output);
  }
  for (const existing of graph.objects.filter(({ data }) =>
    data.record_type === 'asset_proposal' && data.status !== 'superseded')) {
    const plannedOutput = planned.get(proposalUniqueKey(existing.data));
    if (!plannedOutput || plannedOutput.data.id === existing.data.id) continue;
    throw new DiagnosisError('DUPLICATE_ASSET_PROPOSAL', '同一 Asset 与输入版本集合已有 Proposal', {
      existing_ref: existing.data.id,
    });
  }
}

function validateProposalOutputs(graph, prepared) {
  assertUniqueProposalKeys(graph, prepared);
  for (const output of prepared) {
    const validation = validateDiagnosisObject(graph, { ...output, content: output.body });
    if (validation.errors.length > 0) {
      throw new DiagnosisError(
        validation.errors[0].code,
        'Proposal 不符合 M4 profile',
        { diagnostics: validation.errors },
      );
    }
  }
}

async function prepareProposalOutputs({ workspace, graph, plan, now }) {
  for (const item of plan.proposals) assertRefs(graph, item);
  const rawOutputs = plan.proposals.map((item) => proposalObject(graph, item, now));
  const prepared = await prepareOutputs({ workspace, graph, outputs: rawOutputs });
  validateProposalOutputs(graph, prepared);
  return prepared;
}

async function ensureProposalLockRoot(workspace) {
  await assertNoSymlinkPath(workspace, PROPOSAL_LOCK_ROOT, { allowMissingLeaf: true });
  await mkdir(resolveWithin(workspace, PROPOSAL_LOCK_ROOT), { recursive: true });
  await assertNoSymlinkPath(workspace, PROPOSAL_LOCK_ROOT);
}

async function acquireProposalLock(workspace, uniqueKey) {
  await ensureProposalLockRoot(workspace);
  const relativePath = `${PROPOSAL_LOCK_ROOT}/${sha256(uniqueKey)}`;
  const target = resolveWithin(workspace, relativePath);
  const deadline = Date.now() + PROPOSAL_LOCK_TIMEOUT_MS;
  while (true) {
    try {
      await mkdir(target);
      return relativePath;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() >= deadline) {
        throw new DiagnosisError('DUPLICATE_ASSET_PROPOSAL', '等待同一 Proposal 唯一键的并发写入超时');
      }
      await new Promise((resolve) => { setTimeout(resolve, 10); });
    }
  }
}

async function acquireProposalLocks(workspace, prepared) {
  const keys = [...new Set(prepared.map(({ data }) => proposalUniqueKey(data)))].sort();
  const acquired = [];
  try {
    for (const key of keys) acquired.push(await acquireProposalLock(workspace, key));
    return acquired;
  } catch (error) {
    for (const relativePath of acquired.reverse()) {
      await rmdir(resolveWithin(workspace, relativePath));
    }
    throw error;
  }
}

async function releaseProposalLocks(workspace, locks) {
  for (const relativePath of [...locks].reverse()) {
    await assertNoSymlinkPath(workspace, relativePath);
    await rmdir(resolveWithin(workspace, relativePath));
  }
}

export async function proposeAssets({ workspace, plan, now }) {
  if (!Array.isArray(plan?.proposals) || plan.proposals.length === 0) {
    throw new DiagnosisError('M4_FIELD_REQUIRED', 'propose-assets plan 缺少 proposals');
  }
  let graph = await loadWorkspaceGraph({ workspace });
  let prepared = await prepareProposalOutputs({ workspace, graph, plan, now });
  const locks = await acquireProposalLocks(workspace, prepared);
  try {
    graph = await loadWorkspaceGraph({ workspace });
    prepared = await prepareProposalOutputs({ workspace, graph, plan, now });
    const written = await writePreparedOutputs({ workspace, prepared });
    return {
      ...written,
      proposal_refs: prepared.map(({ data }) => data.id).sort(),
    };
  } finally {
    await releaseProposalLocks(workspace, locks);
  }
}

export async function prepareAdoption({
  workspace,
  proposalId,
  id,
  relativePath,
  now,
  status = 'draft',
}) {
  if (status !== 'draft') {
    throw new DiagnosisError('AUTO_ADOPTION_FORBIDDEN', 'Tool 只能创建全 pending 的 draft Adoption');
  }
  const graph = await loadWorkspaceGraph({ workspace });
  const proposal = requireObject(graph, proposalId, 'asset_proposal');
  const data = {
    ...commonData({ id }, 'adoption_record', 'draft', now, graph.byId.get(id)),
    title: `Adoption for ${proposalId}`,
    proposal_ref: proposalId,
    asset_ref: proposal.data.asset_ref,
    decisions: proposal.data.recommendation_items.map(({ item_id }) => ({
      item_id,
      decision: 'pending',
      reason: '待人工决定',
    })),
  };
  const prepared = await prepareOutputs({
    workspace,
    graph,
    outputs: [{ path: relativePath, data, body: `# Adoption ${id}\n` }],
  });
  const validation = validateDiagnosisObject(graph, prepared[0]);
  if (validation.errors.length > 0) {
    throw new DiagnosisError(validation.errors[0].code, 'Adoption template 不符合 M4 profile', {
      diagnostics: validation.errors,
    });
  }
  const written = await writePreparedOutputs({ workspace, prepared });
  return { ...written, data };
}

export async function preparePublication({
  workspace,
  adoptionId,
  id,
  relativePath,
  now,
  status = 'draft',
}) {
  if (status !== 'draft') {
    throw new DiagnosisError('AUTO_PUBLICATION_FORBIDDEN', 'Tool 只能创建 draft Publication template');
  }
  const graph = await loadWorkspaceGraph({ workspace });
  const adoption = requireObject(graph, adoptionId, 'adoption_record');
  const data = {
    ...commonData({ id }, 'asset_publication', 'draft', now, graph.byId.get(id)),
    title: `Publication for ${adoption.data.proposal_ref}`,
    proposal_ref: adoption.data.proposal_ref,
    adoption_ref: adoptionId,
    asset_ref: adoption.data.asset_ref,
  };
  const prepared = await prepareOutputs({
    workspace,
    graph,
    outputs: [{ path: relativePath, data, body: `# Publication ${id}\n` }],
  });
  const validation = validateDiagnosisObject(graph, prepared[0]);
  if (validation.errors.length > 0) {
    throw new DiagnosisError(validation.errors[0].code, 'Publication template 不符合 M4 profile', {
      diagnostics: validation.errors,
    });
  }
  const written = await writePreparedOutputs({ workspace, prepared });
  return { ...written, data };
}

export function proposalContentFingerprint(data, body) {
  return stableStringify({
    unique_key: proposalUniqueKey(data),
    body_sha256: sha256(normalizedBody(body)),
    recommendation_items: data.recommendation_items,
  });
}
