import { readFile } from 'node:fs/promises';
import {
  realContext,
  putJson,
  putObject,
  jsonAt,
  realObject,
  approvalFrom,
  writeObjectBundle,
} from './real-journey-store.mjs';
import { createOwnerPackage } from './owner-feedback.mjs';
import { expandEvidenceObjects } from './snapshot-support.mjs';
import {
  atomicWrite,
  resolveWithin,
  stableStringify,
} from './workspace-paths.mjs';
import { requireReal } from './real-cycle-contract.mjs';
import {
  readPublicPage,
  pageText,
  checkedFeedback,
} from './real-publication.mjs';
import path from 'node:path';
import { loadModelEnvironment, chatJSON } from './model-client.mjs';

export async function prepareRealKnowledge(workspace) {
  const { plan, graph } = await realContext(workspace);
  requireReal(
    plan?.knowledge,
    'REAL_PLAN_REQUIRED',
    'Provide a reviewed real-cycle execution plan',
  );
  const bundlePath = `${plan.cycle_dir}/knowledge-proposal.json`;
  let bundle = await jsonAt(workspace, bundlePath, null);
  if (!bundle) {
    const claims = plan.knowledge.claim_refs.map((id) => graph.byId.get(id));
    requireReal(
      claims.length &&
        claims.every(
          (o) =>
            o?.data.approval &&
            ['approved', 'published'].includes(o.data.status),
        ),
      'KNOWLEDGE_INPUT_ABSENT',
      'Approved statements are required',
    );
    const originals = expandEvidenceObjects(graph, claims);
    const observations = [];
    for (const id of plan.asset_refs) {
      const asset = graph.byId.get(id);
      requireReal(
        asset?.data.record_type === 'asset',
        'BROKEN_REF',
        `Missing asset ${id}`,
      );
      const location = `${plan.cycle_dir}/knowledge-sources/${id}.json`;
      let captured = await jsonAt(workspace, location, null);
      if (!captured) {
        try {
          captured = await readPublicPage(asset.data.locator);
        } catch (error) {
          captured = {
            locator: asset.data.locator,
            captured_at: new Date().toISOString(),
            status: 'unavailable',
            reason: error.code ?? error.message,
          };
        }
        await putJson(workspace, location, captured);
      }
      observations.push({
        path: location,
        locator: asset.data.locator,
        status: captured.status,
        text: captured.html ? pageText(captured.html).slice(0, 16000) : '',
        limitation:
          'Public page observation is not automatically approved claim support.',
      });
    }
    let englishAnswer = plan.knowledge.english_answer;
    if (!englishAnswer) {
      await loadModelEnvironment();
      const generated = await chatJSON({
        provider: plan.provider ?? 'deepseek',
        auditDir: path.join(workspace, 'runs/model-calls'),
        system:
          'Draft an English answer to the supplied goal using ONLY approved statements and their explicit evidence/scope limits. Return JSON {answer:string,limitations:[]}. Clearly identify unavailable information. Do not imply approval or public release.',
        input: {
          goal: graph.byId.get(plan.goal_ref)?.data,
          knowledge: claims.map((c) => c.data),
        },
      });
      requireReal(
        generated.output.answer?.trim(),
        'KNOWLEDGE_INPUT_ABSENT',
        'English answer could not be prepared',
      );
      englishAnswer = generated.output.answer;
      await putJson(
        workspace,
        `${plan.cycle_dir}/knowledge-generation.json`,
        generated,
      );
    }
    bundle = {
      id: `KNOWLEDGE-${plan.cycle_ref}`,
      version: '1.0.0',
      created_at: new Date().toISOString(),
      knowledge_base_ref: plan.knowledge_base_ref,
      query_set_ref: plan.query_set_ref,
      goal_ref: plan.goal_ref,
      release_ref: plan.knowledge.release_ref,
      answer_ref: plan.knowledge.answer_ref,
      english_answer: englishAnswer,
      claim_versions: claims.map((o) => ({
        ref: o.data.id,
        version: o.data.version,
      })),
      evidence_refs: [...new Set(claims.flatMap((o) => o.data.evidence_refs))],
      limitations: [
        ...new Set(
          claims.flatMap((o) => [
            o.data.scope,
            ...(o.data.evidence_sufficiency?.missing ?? []).map(
              (m) => `Evidence remains insufficient: ${m}`,
            ),
          ]),
        ),
      ],
      originals: originals.map((o) => ({
        id: o.data.id,
        path: o.path,
        version: o.data.version,
      })),
      observations,
    };
    await putJson(workspace, bundlePath, bundle);
  }
  const originals = bundle.originals.map((o) => graph.byId.get(o.id));
  const pack = await createOwnerPackage({
    workspace,
    id: `OWNER-KNOWLEDGE-${plan.cycle_ref}`,
    kind: 'real_knowledge',
    objects: [{ data: bundle, path: bundlePath }, ...originals],
    title: '首轮真实知识切片：事实与范围确认',
    body: `## 首轮目标\n${graph.byId.get(plan.goal_ref)?.data.goal_statement}\n\n## 拟使用的英文答案\n${bundle.english_answer}\n\n## 沿用的已批准事实\n${bundle.claim_versions.map((v) => `- ${graph.byId.get(v.ref).data.statement}`).join('\n')}\n\n## 必须保留的限制\n${bundle.limitations.map((x) => `- ${x}`).join('\n')}\n\n## 当前官网观察\n${bundle.observations.map((o) => `### ${o.locator}\n状态：${o.status}\n${o.text}\n原始快照：${o.path}`).join('\n\n')}\n\n批准仅确认该知识切片和英文表述供本轮使用，不表示公开网页已经更新，也不消除证据不足提示。当前官网观察尚未自动作为 Claim 支持证据。`,
  });
  return { waiting_human: true, package: pack.file, knowledge_base_ref: null };
}

export async function applyRealKnowledge(workspace, feedback) {
  await checkedFeedback(workspace, feedback, 'real_knowledge');
  const { plan, graph, identity } = await realContext(workspace);
  requireReal(
    feedback.decision.decision === 'approve',
    'OWNER_FEEDBACK_REQUIRED',
    'Knowledge requires Owner approval',
  );
  const bundle = await jsonAt(workspace, feedback.package.targets[0].path);
  requireReal(
    bundle.knowledge_base_ref === plan.knowledge_base_ref &&
      bundle.goal_ref === plan.goal_ref,
    'KNOWLEDGE_BASE_SCOPE_MISMATCH',
    'Knowledge decision belongs to another cycle',
  );
  const approval = approvalFrom(feedback),
    now = feedback.decision.at;
  const merchant = graph.byId.get(identity.merchant_ref)?.data;
  requireReal(
    merchant?.record_type === 'merchant' &&
      merchant.status === 'active' &&
      merchant.canonical_locator === identity.subject_locator,
    'WORKSPACE_SCOPE_INVALID',
    'A matching active Merchant is required before activating real knowledge',
  );
  const qs = graph.byId.get(bundle.query_set_ref);
  requireReal(
    qs?.data.status === 'frozen' && qs.data.approval,
    'KNOWLEDGE_INPUT_ABSENT',
    'Frozen Query Set required',
  );
  for (const version of bundle.claim_versions)
    requireReal(
      graph.byId.get(version.ref)?.data.version === version.version,
      'READINESS_INPUT_DRIFT',
      'Claim version changed',
    );
  const kb = {
    ...realObject(
      bundle.knowledge_base_ref,
      'brand_knowledge_base',
      'active',
      'MyyShop real goal-scoped knowledge',
      now,
    ),
    merchant_ref: identity.merchant_ref,
    mode: 'real',
    root_path: 'knowledge',
    provenance: {
      kind: 'real',
      usage: 'brand_operations',
      decision_ref: feedback.decision_ref,
    },
    approval,
  };
  const card = {
    ...realObject(
      bundle.answer_ref,
      'answer_card',
      'published',
      'What is MyyShop? — approved English answer',
      now,
    ),
    query_refs: qs.data.query_versions.map((v) => v.ref),
    claim_versions: bundle.claim_versions,
    evidence_refs: bundle.evidence_refs,
    direct_answer: bundle.english_answer,
    limitations: bundle.limitations,
    forbidden_statements: [
      'No unsupported capability, availability, growth or revenue guarantees.',
      'Internal knowledge release is not external publication.',
    ],
    release_refs: [bundle.release_ref],
    approval,
  };
  const release = {
    ...realObject(
      bundle.release_ref,
      'knowledge_release',
      'published',
      'MyyShop real English knowledge release',
      now,
    ),
    release_version: '1.0.0',
    claim_versions: bundle.claim_versions,
    answer_card_versions: [{ ref: card.id, version: card.version }],
    readiness: 'ready',
    approval,
  };
  requireReal(
    !identity.knowledge_base_ref || identity.knowledge_base_ref === kb.id,
    'KNOWLEDGE_BASE_SCOPE_MISMATCH',
    'Cannot replace an existing real knowledge base',
  );
  const existingBase = graph.byId.get(kb.id)?.data;
  if (existingBase)
    requireReal(
      existingBase.mode === 'real' &&
        existingBase.merchant_ref === identity.merchant_ref &&
        existingBase.approval,
      'KNOWLEDGE_BASE_SCOPE_MISMATCH',
      'Existing knowledge base belongs to another scope',
    );
  await writeObjectBundle(
    workspace,
    plan.run_ref,
    `knowledge/real/${plan.cycle_ref.toLowerCase()}`,
    [...(existingBase ? [] : [kb]), card, release],
  );
  await atomicWrite(
    workspace,
    'workspace.json',
    stableStringify(
      { ...identity, knowledge_base_ref: kb.id, knowledge_base_mode: 'real' },
      2,
    ),
  );
  return { knowledge_base_ref: kb.id, release_ref: release.id };
}
