import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  prepareAdoption,
  preparePublication,
  proposeAssets,
} from '../plugins/geo-expert/scripts/lib/asset-proposal.mjs';
import { traceProposal } from '../plugins/geo-expert/scripts/lib/diagnosis-trace.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  auditSite,
  technicalRetest,
} from '../plugins/geo-expert/scripts/lib/site-audit.mjs';
import { querySetContentSha } from '../plugins/geo-expert/scripts/lib/knowledge-query.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW, query, writeObject } from './helpers/object-fixtures.mjs';
import {
  APPROVAL,
  m4ReadyWorkspace,
  sitePlan,
  writeSiteSnapshots,
} from './helpers/m4-fixtures.mjs';

async function writeGap(root) {
  await writeObject(root, 'findings/content-gap.md', {
    id: 'FND-TEST-GAP-001', record_type: 'finding', status: 'waiting_human', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Synthetic content gap',
    finding_code: 'CONTENT_MISSING', finding_kind: 'semantic', item_state: 'inferred',
    rule_version: 'm4-gap-v1', diagnosis_class: 'content_gap',
    query_refs: ['Q-TEST-001'], claim_refs: ['CLM-TEST-001'],
    evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'], asset_refs: ['AST-TEST-ABOUT-001'], source_refs: [],
    gap_basis: {
      supporting_evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'], counter_evidence_refs: [],
      unresolved_conflicts: [], rationale: 'The approved message is absent from the target asset.',
    },
  });
}

function proposalPlan(overrides = {}) {
  return {
    path: 'assets/proposals/about.md',
    id: 'PRP-TEST-001',
    title: 'Synthetic About proposal',
    asset_ref: 'AST-TEST-ABOUT-001',
    goal_refs: ['GOAL-TEST-001'],
    query_refs: ['Q-TEST-001'],
    finding_refs: ['FND-TEST-GAP-001'],
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
    body: '# About\n\nSynthetic Brand provides a documented service.\n',
    recommendation_items: [{
      item_id: 'REC-TEST-001', section: 'About',
      action: 'Add the approved capability statement.',
      claim_refs: ['CLM-TEST-001'], evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
      finding_refs: ['FND-TEST-GAP-001'],
      risk: {
        level: 'low', type: 'none', reason: 'Approved evidence is sufficient.',
        suggested_weakening: 'Not required.',
      },
    }],
    ...overrides,
  };
}

test('multi-goal 同一 Asset 只物化一份 Proposal，重复幂等且 trace 保留 gates', async () => {
  const root = await m4ReadyWorkspace();
  await writeGap(root);
  await writeObject(root, 'cycles/preparation/goal-2.md', {
    id: 'GOAL-TEST-002', record_type: 'perception_goal', status: 'approved', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Synthetic trust goal',
    goal_statement: 'Represent trust accurately.', success_question: 'Is Synthetic Brand documented?',
    query_set_refs: ['QS-TEST-002'], approval: APPROVAL,
  });
  await writeObject(root, 'queries/formal/query-2.md', query({
    id: 'Q-TEST-002', status: 'formal', title: 'Is Synthetic Brand documented?',
    query_text: 'Is Synthetic Brand documented?', normalized_text: 'is synthetic brand documented',
    goal_refs: ['GOAL-TEST-002'], discovery_source_refs: ['SRC-TEST-001'], approval: APPROVAL,
  }));
  const queryVersions = [{
    ref: 'Q-TEST-002', version: '1.0.0',
    query_text: 'Is Synthetic Brand documented?', language: 'en',
  }];
  await writeObject(root, 'queries/sets/set-2.md', {
    id: 'QS-TEST-002', record_type: 'query_set', status: 'frozen', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Synthetic trust set',
    goal_refs: ['GOAL-TEST-002'],
    query_versions: queryVersions.map(({ ref, version }) => ({ ref, version })),
    frozen_at: NOW, frozen_by: 'Fixture Human Reviewer',
    content_sha256: querySetContentSha(queryVersions), approval: APPROVAL,
  });
  const asset = await readMarkdownObject(path.join(root, 'assets/own/about.md'), { workspace: root });
  await writeObject(root, 'assets/own/about.md', {
    ...asset.data,
    goal_refs: ['GOAL-TEST-001', 'GOAL-TEST-002'],
    query_refs: ['Q-TEST-001', 'Q-TEST-002'],
  });
  await assert.rejects(
    proposeAssets({
      workspace: root,
      plan: { proposals: [proposalPlan({
        id: 'PRP-TEST-PARTIAL-001',
        path: 'assets/proposals/about-partial.md',
      })] },
      now: NOW,
    }),
    (error) => error.code === 'GAP_CLASSIFICATION_INVALID',
  );
  await assert.rejects(readFile(path.join(root, 'assets/proposals/about-partial.md')));
  const plan = proposalPlan({
    goal_refs: ['GOAL-TEST-001', 'GOAL-TEST-002'],
    query_refs: ['Q-TEST-001', 'Q-TEST-002'],
  });
  const first = await proposeAssets({ workspace: root, plan: { proposals: [plan] }, now: NOW });
  assert.deepEqual(first.created, ['assets/proposals/about.md']);
  const repeated = await proposeAssets({
    workspace: root,
    plan: { proposals: [plan] },
    now: '2026-08-24T01:00:00+08:00',
  });
  assert.deepEqual(repeated.kept, ['assets/proposals/about.md']);
  const proposal = await readMarkdownObject(path.join(root, 'assets/proposals/about.md'), { workspace: root });
  assert.equal(proposal.data.body_sha256, sha256(proposal.content));
  assert.deepEqual(proposal.data.goal_refs, ['GOAL-TEST-001', 'GOAL-TEST-002']);
  const trace = await traceProposal({ workspace: root, proposalId: 'PRP-TEST-001' });
  assert.deepEqual(trace.goal_refs, ['GOAL-TEST-001', 'GOAL-TEST-002']);
  assert.ok(trace.gates.some((gate) => gate.code === 'ADOPTION_PENDING'));
  assert.ok(trace.gates.some((gate) => gate.code === 'PUBLICATION_PENDING'));
  assert.ok(trace.gates.some((gate) => gate.code === 'RETEST_PENDING'));
  await rm(root, { recursive: true });
});

test('Proposal 冲突在写入前失败，证据不足时风险弱化必填', async () => {
  const root = await m4ReadyWorkspace();
  await writeGap(root);
  const first = proposalPlan();
  const second = proposalPlan({
    id: 'PRP-TEST-002',
    path: 'assets/proposals/about-conflict.md',
    body: '# About\n\nConflicting body.\n',
  });
  await assert.rejects(
    proposeAssets({ workspace: root, plan: { proposals: [first, second] }, now: NOW }),
    (error) => ['DUPLICATE_ASSET_PROPOSAL', 'PROPOSAL_CONFLICT'].includes(error.code),
  );
  await assert.rejects(readFile(path.join(root, first.path)));
  await assert.rejects(readFile(path.join(root, second.path)));

  const claim = await readMarkdownObject(path.join(root, 'knowledge/claims/claim.md'), { workspace: root });
  await writeObject(root, 'knowledge/claims/claim.md', {
    ...claim.data,
    evidence_sufficiency: {
      status: 'insufficient', rule_version: 'm3-evidence-sufficiency-v1', missing: ['case'],
    },
  });
  await assert.rejects(
    proposeAssets({ workspace: root, plan: { proposals: [first] }, now: NOW }),
    (error) => error.code === 'GAP_CLASSIFICATION_INVALID',
  );
  const gap = await readMarkdownObject(path.join(root, 'findings/content-gap.md'), { workspace: root });
  await writeObject(root, 'findings/content-gap.md', {
    ...gap.data,
    diagnosis_class: 'evidence_gap',
    finding_code: 'EVIDENCE_MISSING',
    gap_basis: {
      ...gap.data.gap_basis,
      rationale: 'The approved Claim lacks case Evidence.',
    },
  });
  const risky = proposalPlan({
    recommendation_items: [{
      ...first.recommendation_items[0],
      risk: {
        level: 'high', type: 'evidence_insufficient', reason: 'Case Evidence is missing.',
        suggested_weakening: 'Describe only the documented scope.',
      },
    }],
  });
  const created = await proposeAssets({ workspace: root, plan: { proposals: [risky] }, now: NOW });
  assert.deepEqual(created.created, ['assets/proposals/about.md']);
  await rm(root, { recursive: true });
});

test('同一 Proposal 唯一键并发创建只有一个成功', async () => {
  const root = await m4ReadyWorkspace();
  await writeGap(root);
  const first = proposalPlan();
  const second = proposalPlan({
    id: 'PRP-TEST-002',
    path: 'assets/proposals/about-concurrent.md',
    body: '# About\n\nConflicting concurrent body.\n',
  });
  const results = await Promise.allSettled([
    proposeAssets({ workspace: root, plan: { proposals: [first] }, now: NOW }),
    proposeAssets({ workspace: root, plan: { proposals: [second] }, now: NOW }),
  ]);
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 1);
  assert.equal(results.filter(({ status }) => status === 'rejected').length, 1);
  assert.ok(results.find(({ status }) => status === 'rejected').reason.code
    === 'DUPLICATE_ASSET_PROPOSAL');
  const existing = await Promise.all([
    readFile(path.join(root, first.path)).then(() => true, () => false),
    readFile(path.join(root, second.path)).then(() => true, () => false),
  ]);
  assert.equal(existing.filter(Boolean).length, 1);
  await rm(root, { recursive: true });
});

test('Adoption 与 Publication Tool 只创建 draft template', async () => {
  const root = await m4ReadyWorkspace();
  await writeGap(root);
  await proposeAssets({ workspace: root, plan: { proposals: [proposalPlan()] }, now: NOW });
  await assert.rejects(
    prepareAdoption({
      workspace: root, proposalId: 'PRP-TEST-001', id: 'ADR-TEST-001',
      relativePath: 'assets/adoptions/adoption.md', now: NOW, status: 'decided',
    }),
    (error) => error.code === 'AUTO_ADOPTION_FORBIDDEN',
  );
  const adoption = await prepareAdoption({
    workspace: root, proposalId: 'PRP-TEST-001', id: 'ADR-TEST-001',
    relativePath: 'assets/adoptions/adoption.md', now: NOW,
  });
  assert.equal(adoption.data.status, 'draft');
  assert.ok(adoption.data.decisions.every((item) => item.decision === 'pending'));
  await assert.rejects(
    preparePublication({
      workspace: root, adoptionId: 'ADR-TEST-001', id: 'PUB-TEST-001',
      relativePath: 'assets/publications/publication.md', now: NOW, status: 'confirmed',
    }),
    (error) => error.code === 'AUTO_PUBLICATION_FORBIDDEN',
  );
  const publication = await preparePublication({
    workspace: root, adoptionId: 'ADR-TEST-001', id: 'PUB-TEST-001',
    relativePath: 'assets/publications/publication.md', now: NOW,
  });
  assert.equal(publication.data.status, 'draft');
  await rm(root, { recursive: true });
});

test('Technical Retest 需要 Publication；development fixture 例外并保留旧字节', async () => {
  const root = await m4ReadyWorkspace();
  const brokenManifest = await writeSiteSnapshots(root, {
    html: '<html><head><meta name="description" content="Synthetic"></head><body><h1>About</h1></body></html>',
  });
  await auditSite({ workspace: root, manifest: brokenManifest, plan: sitePlan(), now: NOW });
  const oldPath = path.join(root, 'findings/m4-title-present.md');
  const oldBytes = await readFile(oldPath);
  const fixedManifest = await writeSiteSnapshots(root, { prefix: 'retest-' });
  const retestPlan = sitePlan('RUN-M4-RETEST-001');
  retestPlan.retest_of_refs = ['FND-M4-TITLE-PRESENT-001'];
  retestPlan.input_versions['FND-M4-TITLE-PRESENT-001'] = '1.0.0';
  retestPlan.outputs.TITLE_PRESENT = {
    evidence: { id: 'EVD-M4-RETEST-TITLE-001', path: 'evidence/records/retest-title.md' },
    finding: { id: 'FND-M4-RETEST-TITLE-001', path: 'findings/retest-title.md' },
  };
  const realPlan = { ...retestPlan, development_fixture: false };
  await assert.rejects(
    technicalRetest({ workspace: root, manifest: fixedManifest, plan: realPlan, now: NOW }),
    (error) => error.code === 'PUBLICATION_REQUIRED',
  );
  const result = await technicalRetest({
    workspace: root, manifest: fixedManifest, plan: retestPlan, now: NOW,
  });
  assert.deepEqual(result.finding_refs, ['FND-M4-RETEST-TITLE-001']);
  const retest = await readMarkdownObject(path.join(root, 'findings/retest-title.md'), { workspace: root });
  assert.equal(retest.data.status, 'resolved');
  assert.equal(retest.data.retest_of_ref, 'FND-M4-TITLE-PRESENT-001');
  assert.deepEqual(await readFile(oldPath), oldBytes);

  const persistentManifest = await writeSiteSnapshots(root, {
    prefix: 'persistent-',
    html: '<html><head><meta name="description" content="Synthetic"></head><body><h1>About</h1></body></html>',
  });
  const persistentPlan = sitePlan('RUN-M4-RETEST-002');
  persistentPlan.retest_of_refs = ['FND-M4-TITLE-PRESENT-001'];
  persistentPlan.input_versions['FND-M4-TITLE-PRESENT-001'] = '1.0.0';
  persistentPlan.outputs.TITLE_PRESENT = {
    evidence: { id: 'EVD-M4-RETEST-TITLE-002', path: 'evidence/records/retest-title-persistent.md' },
    finding: { id: 'FND-M4-RETEST-TITLE-002', path: 'findings/retest-title-persistent.md' },
  };
  await technicalRetest({
    workspace: root, manifest: persistentManifest, plan: persistentPlan, now: NOW,
  });
  const persistent = await readMarkdownObject(
    path.join(root, 'findings/retest-title-persistent.md'),
    { workspace: root },
  );
  assert.equal(persistent.data.status, 'open');
  assert.equal(persistent.data.item_state, 'observed');
  await rm(root, { recursive: true });
});

test('合成全链分离 Gap、Proposal、Adoption、Publication 与 Retest gate', async () => {
  const root = await m4ReadyWorkspace();
  const beforeManifest = await writeSiteSnapshots(root, {
    prefix: 'chain-before-',
    html: [
      '<html><head><meta name="description" content="Synthetic">',
      '<meta name="robots" content="index,follow">',
      '<link rel="canonical" href="https://brand.example.invalid/about">',
      '<script type="application/ld+json">{"@context":"https://schema.org"}</script>',
      '</head><body><h1>About</h1></body></html>',
    ].join(''),
  });
  await auditSite({ workspace: root, manifest: beforeManifest, plan: sitePlan('RUN-M4-CHAIN-001'), now: NOW });
  await writeGap(root);
  const gap = await readMarkdownObject(path.join(root, 'findings/content-gap.md'), { workspace: root });
  await writeObject(root, 'findings/content-gap.md', {
    ...gap.data,
    status: 'open',
    approval: APPROVAL,
  });

  const base = proposalPlan();
  const allEvidence = [...base.evidence_refs, 'EVD-M4-TITLE-PRESENT-001'];
  const allFindings = [...base.finding_refs, 'FND-M4-TITLE-PRESENT-001'];
  await proposeAssets({
    workspace: root,
    plan: { proposals: [{
      ...base,
      evidence_refs: allEvidence,
      finding_refs: allFindings,
      recommendation_items: [{
        ...base.recommendation_items[0],
        evidence_refs: allEvidence,
        finding_refs: allFindings,
      }],
    }] },
    now: NOW,
  });
  await prepareAdoption({
    workspace: root, proposalId: 'PRP-TEST-001', id: 'ADR-TEST-001',
    relativePath: 'assets/adoptions/adoption.md', now: NOW,
  });
  const adoption = await readMarkdownObject(
    path.join(root, 'assets/adoptions/adoption.md'),
    { workspace: root },
  );
  await writeObject(root, 'assets/adoptions/adoption.md', {
    ...adoption.data,
    status: 'decided',
    decisions: [{ item_id: 'REC-TEST-001', decision: 'accepted', reason: 'Fixture human accepted.' }],
    approval: APPROVAL,
  });
  await preparePublication({
    workspace: root, adoptionId: 'ADR-TEST-001', id: 'PUB-TEST-001',
    relativePath: 'assets/publications/publication.md', now: NOW,
  });
  const publication = await readMarkdownObject(
    path.join(root, 'assets/publications/publication.md'),
    { workspace: root },
  );
  await writeObject(root, 'assets/publications/publication.md', {
    ...publication.data,
    status: 'confirmed',
    published_item_ids: ['REC-TEST-001'],
    published_locator: 'https://brand.example.invalid/about',
    content_sha256: sha256('Synthetic fixture publication.\n'),
    published_at: NOW,
    approval: APPROVAL,
  });

  const afterManifest = await writeSiteSnapshots(root, { prefix: 'chain-after-' });
  const retestPlan = sitePlan('RUN-M4-CHAIN-RETEST-001');
  retestPlan.retest_of_refs = ['FND-M4-TITLE-PRESENT-001'];
  retestPlan.publication_refs = ['PUB-TEST-001'];
  retestPlan.input_versions['FND-M4-TITLE-PRESENT-001'] = '1.0.0';
  retestPlan.input_versions['PUB-TEST-001'] = '1.0.0';
  retestPlan.outputs.TITLE_PRESENT = {
    evidence: { id: 'EVD-M4-CHAIN-RETEST-001', path: 'evidence/records/chain-retest.md' },
    finding: { id: 'FND-M4-CHAIN-RETEST-001', path: 'findings/chain-retest.md' },
  };
  await technicalRetest({ workspace: root, manifest: afterManifest, plan: retestPlan, now: NOW });
  const trace = await traceProposal({ workspace: root, proposalId: 'PRP-TEST-001' });
  assert.equal(trace.lifecycle_ready, true);
  assert.deepEqual(trace.gates, []);
  await rm(root, { recursive: true });
});

test('Owner modify produces an immutable draft successor and a new review package without adoption', async () => {
  const root = await m4ReadyWorkspace();
  try {
    await writeGap(root);
    await proposeAssets({workspace:root,plan:{proposals:[proposalPlan({body:'# About\n\nDraft introduction awaiting clarification.\n'})]},now:NOW});
    await writeFile(path.join(root,'workspace.json'),JSON.stringify({workspace_mode:'development_test'}));
    const {loadWorkspaceGraph}=await import('../plugins/geo-expert/scripts/lib/index-builder.mjs');
    const {createOwnerPackage,acceptOwnerFeedback}=await import('../plugins/geo-expert/scripts/lib/owner-feedback.mjs');
    const {reviseProposalFromFeedback}=await import('../plugins/geo-expert/scripts/lib/proposal-revision.mjs');
    const graph=await loadWorkspaceGraph({workspace:root});const proposal=graph.byId.get('PRP-TEST-001');
    const before=await readFile(path.join(root,proposal.path),'utf8');
    const pack=await createOwnerPackage({workspace:root,id:'OWNER-MODIFY-TEST',kind:'adoption',objects:[proposal],title:'Review proposal',body:proposal.content});
    const statement=graph.byId.get('CLM-TEST-001').data.statement;
    const text=`包：${pack.id}\n校验：${pack.sha256}\n决定：modify\n决定人：Fixture reviewer\n时间：${NOW}\n说明：Use the approved statement.\n修改内容：${statement}\n`;
    const feedback=await acceptOwnerFeedback({workspace:root,text});const changed=await reviseProposalFromFeedback(root,feedback);
    const next=await loadWorkspaceGraph({workspace:root});const revised=next.byId.get(changed.proposal_ref);
    assert.equal(revised.data.status,'draft');assert.equal(revised.data.supersedes_ref,proposal.data.id);
    assert.equal(revised.data.recommendation_items[0].proposed_text,statement);
    assert.equal(await readFile(path.join(root,proposal.path),'utf8'),before);
    assert.equal(next.objects.filter(o=>o.data.record_type==='adoption_record').length,0);
    assert.ok(changed.waiting_human);
  } finally { await rm(root,{recursive:true}); }
});
