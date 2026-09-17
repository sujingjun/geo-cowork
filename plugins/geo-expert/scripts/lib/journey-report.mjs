import { readFile, readdir } from 'node:fs/promises';
import { loadWorkspaceGraph } from './index-builder.mjs';
import { readJourneyInput } from './knowledge-workspace.mjs';
import { ownerInbox } from './owner-feedback.mjs';
import { atomicWrite, resolveWithin } from './workspace-paths.mjs';
import { modelHash } from './model-client.mjs';

export async function knowledgeImpactReport(workspace) {
  const context = await readJourneyInput(workspace);
  const graph = await loadWorkspaceGraph({ workspace });
  const impacts = [];
  for (const doc of graph.objects.filter(
    (o) =>
      o.data.record_type === 'document' &&
      o.data.extensions?.['geo.knowledge_input'],
  )) {
    const input = doc.data.extensions['geo.knowledge_input'];
    let current;
    try {
      current = modelHash(
        await readFile(resolveWithin(workspace, input.raw_path), 'utf8'),
      );
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      current = null;
    }
    if (current !== input.sha256) {
      const claims = graph.objects.filter(
        (o) =>
          o.data.record_type === 'claim' &&
          o.data.document_refs?.includes(doc.data.id),
      );
      impacts.push({
        path: input.raw_path,
        kind: current ? 'changed' : 'missing',
        frozen_sha256: input.sha256,
        current_sha256: current,
        document_ref: doc.data.id,
        claim_refs: claims.map((o) => o.data.id),
        action:
          'Review a new knowledge revision; active Cycle keeps its frozen version.',
      });
    }
  }
  return { seed_sha256: context.seed_sha256, impacts };
}
export async function renderJourneyReport(workspace) {
  const context = await readJourneyInput(workspace);
  const graph = await loadWorkspaceGraph({ workspace });
  const inbox = await ownerInbox(workspace);
  const impact = await knowledgeImpactReport(workspace);
  const link = (o) => `[${o.data.title ?? o.data.id}](../${o.path})`;
  const cycles = graph.objects
    .filter((o) => o.data.record_type === 'cycle')
    .sort((a, b) => a.data.cycle_number - b.data.cycle_number);
  const lines = [
    '# GEO 演练报告',
    '',
    '本工作区为 synthetic/test_only。提取与语义处理使用真实 DeepSeek；发布仅发生在隔离本地演练环境。本文证明工程行为，不代表真实品牌事实或业务提升。',
    '',
    '## 1. 知识维护',
    '',
    '[Knowledge index](../knowledge/README.md)',
    ...context.seed.entries.map(
      (e) =>
        `- ${e.category} / ${e.title}: ${e.superseded ? 'superseded' : !e.evidence ? 'evidence missing' : 'supported input'}`,
    ),
    '',
    `Detected raw-input changes: ${impact.impacts.length}. Frozen canonical inputs remain unchanged.`,
    ...impact.impacts.map((i) => `- ${i.path}: ${i.kind}; ${i.action}`),
    '',
    '## 2. 周期与候选问题',
    '',
  ];
  for (const cycle of cycles) {
    const meta = cycle.data.extensions?.['geo.journey'];
    const qs = meta && graph.byId.get(meta.query_set_ref);
    lines.push(
      `### Cycle ${cycle.data.cycle_number}: ${cycle.data.aggregate_stage}`,
      `- Status: ${cycle.data.status}; completion: ${cycle.data.completion_scope}`,
    );
    if (qs) {
      lines.push(`- Frozen set: ${link(qs)}`);
      for (const q of qs.data.query_versions) {
        const query = graph.byId.get(q.ref);
        lines.push(`- ${link(query)} — ${query.data.query_text}`);
      }
    }
    const samples = graph.objects.filter(
      (o) =>
        o.data.record_type === 'answer_sample' &&
        o.data.query_set_ref === qs?.data.id,
    );
    lines.push(
      `- Baseline slots: ${samples.filter((s) => s.data.purpose === 'baseline').length}; retest slots: ${samples.filter((s) => s.data.purpose === 'post_change_retest').length}`,
      '',
    );
  }
  lines.push(
    '## 3. 答案观察与分析',
    '',
    ...graph.objects
      .filter((o) => o.data.record_type === 'answer_aggregation')
      .map(
        (o) =>
          `- ${link(o)} — ${o.data.platform}, ${o.data.purpose}, ${o.data.selected_sample_versions.length} slots; raw and reviewed lineage are pinned.`,
      ),
    '',
    '## 4. 内容、证据与产品缺口',
    '',
    ...graph.objects
      .filter(
        (o) =>
          o.data.record_type === 'finding' &&
          o.data.finding_kind === 'semantic',
      )
      .map(
        (o) =>
          `- ${link(o)} — ${o.data.diagnosis_class}; ${o.data.status}. ${o.data.extensions?.['geo.semantic_analysis']?.next_action ?? ''}`,
      ),
    '',
    ...graph.objects
      .filter((o) => o.data.record_type === 'evidence_plan')
      .map(
        (o) => `- Evidence task: ${link(o)}; owner: ${o.data.provider_owner}`,
      ),
    '',
    '## 5. 自有与外部资产建议',
    '',
    ...graph.objects
      .filter((o) => o.data.record_type === 'asset_proposal')
      .map(
        (o) =>
          `- ${link(o)} — ${graph.byId.get(o.data.asset_ref)?.data.control_scope}`,
      ),
    '',
    '## 6. 采用与发布反馈',
    '',
    ...graph.objects
      .filter((o) =>
        ['adoption_record', 'asset_publication'].includes(o.data.record_type),
      )
      .map((o) => `- ${link(o)} — ${o.data.status}`),
    '',
    '## 7. 技术与平台复测',
    '',
    ...graph.objects
      .filter(
        (o) =>
          o.data.record_type === 'run' &&
          o.data.skill === 'geo-site-technical-retest',
      )
      .map(
        (o) =>
          `- ${link(o)} — ${(o.data.detector_results ?? []).filter((d) => d.state === 'pass').length} passed checks; remaining results retained.`,
      ),
    '',
    '## 8. Analytics 与业务观察',
    '',
    ...graph.objects
      .filter((o) => o.data.record_type === 'business_signal')
      .map(
        (o) =>
          `- ${link(o)} — ${o.data.calculation.state}; value ${o.data.calculation.value ?? 'unavailable'}; non-causal.`,
      ),
    '',
    '## 9. 周期复盘与下一目标',
    '',
    ...graph.objects
      .filter((o) =>
        [
          'cycle_review',
          'cycle_goal_candidate',
          'cycle_goal_selection',
        ].includes(o.data.record_type),
      )
      .map((o) => `- ${link(o)} — ${o.data.status}`),
    '',
    '## 待审核事项',
    '',
    ...inbox.map((p) => `- [${p.title}](../${p.file})`),
    ...(inbox.length ? [] : ['当前没有未回复的审核包。']),
    '',
  );
  await atomicWrite(
    workspace,
    'reports/geo-cycle-overview.md',
    lines.join('\n'),
  );
  await atomicWrite(
    workspace,
    'reports/knowledge-impact.json',
    JSON.stringify(impact, null, 2),
  );
  return {
    path: 'reports/geo-cycle-overview.md',
    cycles: cycles.map((o) => ({
      id: o.data.id,
      status: o.data.status,
      stage: o.data.aggregate_stage,
    })),
    pending: inbox.map((p) => p.id),
    knowledge_impacts: impact.impacts.length,
  };
}
