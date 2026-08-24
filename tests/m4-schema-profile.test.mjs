import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  validateDiagnosisWorkspace,
} from '../plugins/geo-expert/scripts/lib/diagnosis-profile.mjs';
import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  readMarkdownObject,
  validateObjectData,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW, writeObject } from './helpers/object-fixtures.mjs';
import { APPROVAL, m4ReadyWorkspace } from './helpers/m4-fixtures.mjs';

function proposalData(overrides = {}) {
  const body = '# About\n\nSynthetic proposal.\n';
  return {
    id: 'PRP-TEST-001',
    record_type: 'asset_proposal',
    status: 'draft',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic About proposal',
    asset_ref: 'AST-TEST-ABOUT-001',
    goal_refs: ['GOAL-TEST-001'],
    query_refs: ['Q-TEST-001'],
    finding_refs: ['FND-TEST-GAP-001'],
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
    body_sha256: sha256(body),
    recommendation_items: [{
      item_id: 'REC-TEST-001',
      section: 'About',
      action: 'Use the approved capability statement.',
      claim_refs: ['CLM-TEST-001'],
      evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
      finding_refs: ['FND-TEST-GAP-001'],
      risk: {
        level: 'low',
        type: 'none',
        reason: 'Approved synthetic evidence is sufficient.',
        suggested_weakening: 'Not required.',
      },
    }],
    ...overrides,
  };
}

test('M4 新类型注册，未知字段失败，M2 最小对象保持兼容', () => {
  assert.equal(validateObjectData(proposalData()).record_type, 'asset_proposal');
  assert.equal(validateObjectData({
    id: 'ADR-TEST-001', record_type: 'adoption_record', status: 'draft', version: '1.0.0',
    created_at: NOW, updated_at: NOW, proposal_ref: 'PRP-TEST-001',
    asset_ref: 'AST-TEST-ABOUT-001',
    decisions: [{ item_id: 'REC-TEST-001', decision: 'pending', reason: '待人工决定' }],
  }).record_type, 'adoption_record');
  assert.equal(validateObjectData({
    id: 'PUB-TEST-001', record_type: 'asset_publication', status: 'draft', version: '1.0.0',
    created_at: NOW, updated_at: NOW, proposal_ref: 'PRP-TEST-001',
    adoption_ref: 'ADR-TEST-001', asset_ref: 'AST-TEST-ABOUT-001',
  }).record_type, 'asset_publication');
  assert.throws(
    () => validateObjectData({ ...proposalData(), unexpected: true }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
  assert.throws(
    () => validateObjectData({ ...proposalData(), goal_refs: [] }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
  assert.throws(
    () => validateObjectData({ ...proposalData(), status: 'approved' }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
  assert.equal(validateObjectData({
    id: 'FND-M2-MINIMAL-001', record_type: 'finding', status: 'open', version: '1.0.0',
    created_at: NOW, updated_at: NOW, finding_code: 'MINIMAL', finding_kind: 'semantic',
    item_state: 'unverifiable', rule_version: 'm2-v1',
  }).record_type, 'finding');
});

test('M4 profile 区分 Content/Evidence/Product Gap 与人工门', async () => {
  const root = await m4ReadyWorkspace();
  const base = {
    record_type: 'finding', version: '1.0.0', created_at: NOW, updated_at: NOW,
    finding_code: 'SYNTHETIC_GAP', finding_kind: 'semantic', item_state: 'inferred', rule_version: 'm4-gap-v1',
    query_refs: ['Q-TEST-001'], claim_refs: ['CLM-TEST-001'],
    evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'], asset_refs: ['AST-TEST-ABOUT-001'], source_refs: [],
    gap_basis: {
      supporting_evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
      counter_evidence_refs: [], unresolved_conflicts: [], rationale: 'Synthetic gap.',
    },
  };
  await writeObject(root, 'findings/content.md', {
    ...base, id: 'FND-TEST-CONTENT-001', status: 'waiting_human',
    title: 'Content gap', diagnosis_class: 'content_gap',
  });
  await writeObject(root, 'findings/evidence.md', {
    ...base, id: 'FND-TEST-EVIDENCE-001', status: 'waiting_human',
    title: 'Evidence gap', diagnosis_class: 'evidence_gap',
  });
  let result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.code === 'GAP_CLASSIFICATION_INVALID'
    && item.id === 'FND-TEST-EVIDENCE-001'));

  await writeObject(root, 'knowledge/claims/claim.md', {
    ...(await import('./helpers/object-fixtures.mjs')).claim({
      status: 'published', document_refs: ['DOC-TEST-001'], evidence_refs: ['EVD-TEST-001'],
      scope: 'Synthetic fixture only.', release_refs: ['KR-TEST-001'], approval: APPROVAL,
      evidence_sufficiency: {
        status: 'insufficient', rule_version: 'm3-evidence-sufficiency-v1', missing: ['case'],
      },
    }),
  });
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.code === 'CONTENT_GAP_EVIDENCE_INSUFFICIENT'));
  assert.ok(!result.errors.some((item) => item.code === 'GAP_CLASSIFICATION_INVALID'
    && item.id === 'FND-TEST-EVIDENCE-001'));

  await writeObject(root, 'findings/product.md', {
    ...base, id: 'FND-TEST-PRODUCT-001', status: 'waiting_human',
    title: 'Product gap', diagnosis_class: 'product_gap',
  });
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.code === 'PRODUCT_GAP_SUPPORT_MISSING'));

  const baseEvidence = await readMarkdownObject(
    path.join(root, 'evidence/records/brand.md'),
    { workspace: root },
  );
  await writeObject(root, 'evidence/records/product-demand.md', {
    ...baseEvidence.data,
    id: 'EVD-TEST-PRODUCT-DEMAND-001',
    title: 'Independent synthetic demand',
    access_state: 'accessible', original_content_state: 'captured',
    support_kind: 'independent', independent_support_refs: [], counter_evidence_refs: [],
    confidence: 'medium', confidence_reason: 'Synthetic independent demand fixture.',
    proof_scope: 'original_content',
  });
  await writeObject(root, 'evidence/records/product-capability.md', {
    ...baseEvidence.data,
    id: 'EVD-TEST-PRODUCT-CAPABILITY-001',
    title: 'First-party synthetic capability gap',
    source_refs: ['SRC-SITE-001'],
    locator: 'https://brand.example.invalid/unrelated',
    access_state: 'accessible', original_content_state: 'captured',
    support_kind: 'first_party', independent_support_refs: ['EVD-TEST-PRODUCT-DEMAND-001'],
    counter_evidence_refs: [], confidence: 'medium',
    confidence_reason: 'Synthetic first-party capability fixture.',
    proof_scope: 'original_content',
  });
  await writeObject(root, 'findings/product.md', {
    ...base,
    id: 'FND-TEST-PRODUCT-001', status: 'waiting_human',
    title: 'Product gap', diagnosis_class: 'product_gap',
    evidence_refs: ['EVD-TEST-PRODUCT-DEMAND-001', 'EVD-TEST-PRODUCT-CAPABILITY-001'],
    source_refs: ['SRC-TEST-001', 'SRC-SITE-001'],
    gap_basis: {
      supporting_evidence_refs: ['EVD-TEST-PRODUCT-DEMAND-001', 'EVD-TEST-PRODUCT-CAPABILITY-001'],
      counter_evidence_refs: [], unresolved_conflicts: [], rationale: 'Synthetic demand and capability gap.',
    },
  });
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.id === 'FND-TEST-PRODUCT-001'
    && item.code === 'PRODUCT_GAP_SUPPORT_MISSING'));
  const capability = await readMarkdownObject(
    path.join(root, 'evidence/records/product-capability.md'),
    { workspace: root },
  );
  await writeObject(root, 'evidence/records/product-capability.md', {
    ...capability.data,
    locator: 'https://brand.example.invalid/about',
  });
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(!result.errors.some((item) => item.id === 'FND-TEST-PRODUCT-001'
    && item.code === 'PRODUCT_GAP_SUPPORT_MISSING'));

  await writeObject(root, 'findings/evidence.md', {
    ...base, id: 'FND-TEST-EVIDENCE-001', status: 'open',
    title: 'Evidence gap', diagnosis_class: 'evidence_gap',
  });
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.code === 'GAP_REQUIRES_HUMAN'));
  await rm(root, { recursive: true });
});

test('M4 profile 拒绝越过目标 Asset/KR 的 Content Gap 与错误 Evidence Scope', async () => {
  const root = await m4ReadyWorkspace();
  const claim = await readMarkdownObject(path.join(root, 'knowledge/claims/claim.md'), { workspace: root });
  await writeObject(root, 'knowledge/claims/unrelated.md', {
    ...claim.data,
    id: 'CLM-TEST-002',
    title: 'Unrelated approved claim',
    release_refs: [],
  });
  await writeObject(root, 'findings/unrelated-content.md', {
    id: 'FND-TEST-UNRELATED-001', record_type: 'finding', status: 'waiting_human', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Unrelated content gap',
    finding_code: 'CONTENT_MISSING', finding_kind: 'semantic', item_state: 'inferred',
    rule_version: 'm4-gap-v1', diagnosis_class: 'content_gap',
    query_refs: ['Q-TEST-001'], claim_refs: ['CLM-TEST-002'],
    evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
    asset_refs: ['AST-TEST-ABOUT-001'], source_refs: [],
    gap_basis: {
      supporting_evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
      counter_evidence_refs: [], unresolved_conflicts: [], rationale: 'Unrelated claim.',
    },
  });
  const baseEvidence = await readMarkdownObject(
    path.join(root, 'evidence/records/brand.md'),
    { workspace: root },
  );
  await writeObject(root, 'evidence/records/scope-mismatch.md', {
    ...baseEvidence.data,
    id: 'EVD-TEST-SCOPE-001',
    title: 'Blocked observation with invalid scope',
    access_state: 'blocked',
    original_content_state: 'captured',
    support_kind: 'platform_observation',
    independent_support_refs: [],
    counter_evidence_refs: [],
    confidence: 'unknown',
    confidence_reason: 'Synthetic access was blocked.',
    proof_scope: 'original_content',
  });
  const result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.id === 'FND-TEST-UNRELATED-001'
    && item.code === 'GAP_CLASSIFICATION_INVALID'));
  assert.ok(result.errors.some((item) => item.id === 'EVD-TEST-SCOPE-001'
    && item.code === 'EVIDENCE_SCOPE_MISMATCH'));
  await rm(root, { recursive: true });
});

test('Proposal profile 校验 body hash、section、风险与人工对象', async () => {
  const root = await m4ReadyWorkspace();
  await writeObject(root, 'findings/gap.md', {
    id: 'FND-TEST-GAP-001', record_type: 'finding', status: 'waiting_human', version: '1.0.0',
    created_at: NOW, updated_at: NOW, title: 'Synthetic content gap',
    finding_code: 'CONTENT_MISSING', finding_kind: 'semantic', item_state: 'inferred',
    rule_version: 'm4-gap-v1', diagnosis_class: 'content_gap', query_refs: ['Q-TEST-001'],
    claim_refs: ['CLM-TEST-001'], evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
    asset_refs: ['AST-TEST-ABOUT-001'], source_refs: [],
    gap_basis: {
      supporting_evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'], counter_evidence_refs: [],
      unresolved_conflicts: [], rationale: 'The synthetic body is absent.',
    },
  });
  await writeObject(root, 'assets/proposals/proposal.md', proposalData(), '# About\n\nSynthetic proposal.\n');
  await writeObject(root, 'assets/adoptions/adoption.md', {
    id: 'ADR-TEST-001', record_type: 'adoption_record', status: 'decided', version: '1.0.0',
    created_at: NOW, updated_at: NOW, proposal_ref: 'PRP-TEST-001',
    asset_ref: 'AST-TEST-ABOUT-001',
    decisions: [{ item_id: 'REC-TEST-001', decision: 'accepted', reason: 'Approved fixture.' }],
    approval: APPROVAL,
  });
  await writeObject(root, 'assets/publications/publication.md', {
    id: 'PUB-TEST-001', record_type: 'asset_publication', status: 'confirmed', version: '1.0.0',
    created_at: NOW, updated_at: NOW, proposal_ref: 'PRP-TEST-001',
    adoption_ref: 'ADR-TEST-001', asset_ref: 'AST-TEST-ABOUT-001',
    published_item_ids: ['REC-TEST-001'], published_locator: 'https://brand.example.invalid/about',
    content_sha256: 'a'.repeat(64), published_at: NOW, approval: APPROVAL,
  });
  let result = await validateDiagnosisWorkspace({ workspace: root });
  assert.deepEqual(result.errors, []);
  const asset = await readMarkdownObject(path.join(root, 'assets/own/about.md'), { workspace: root });
  await writeObject(root, 'assets/own/other.md', {
    ...asset.data,
    id: 'AST-TEST-OTHER-001',
    title: 'Other synthetic Asset',
    locator: 'https://brand.example.invalid/other',
  });
  await writeObject(root, 'assets/publications/publication.md', {
    id: 'PUB-TEST-001', record_type: 'asset_publication', status: 'confirmed', version: '1.0.0',
    created_at: NOW, updated_at: NOW, proposal_ref: 'PRP-TEST-001',
    adoption_ref: 'ADR-TEST-001', asset_ref: 'AST-TEST-OTHER-001',
    published_item_ids: ['REC-TEST-001'], published_locator: 'https://brand.example.invalid/other',
    content_sha256: 'a'.repeat(64), published_at: NOW, approval: APPROVAL,
  });
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.id === 'PUB-TEST-001'
    && item.code === 'GAP_CLASSIFICATION_INVALID'));
  await writeObject(root, 'assets/proposals/proposal.md', {
    ...proposalData(),
    body_sha256: 'b'.repeat(64),
    recommendation_items: [{
      ...proposalData().recommendation_items[0],
      section: 'Missing',
    }],
  }, '# About\n\nSynthetic proposal.\n');
  result = await validateDiagnosisWorkspace({ workspace: root });
  assert.ok(result.errors.some((item) => item.code === 'CHECKSUM_MISMATCH'));
  assert.ok(result.errors.some((item) => item.code === 'M4_FIELD_REQUIRED'));
  await rm(root, { recursive: true });
});

test('M4 index 新增三类 index 并保留精确版本校验', async () => {
  const root = await m4ReadyWorkspace();
  const body = '# About\n\nSynthetic proposal.\n';
  await writeObject(root, 'findings/gap.md', {
    id: 'FND-TEST-GAP-001', record_type: 'finding', status: 'waiting_human', version: '1.0.0',
    created_at: NOW, updated_at: NOW, finding_code: 'CONTENT_MISSING', finding_kind: 'semantic',
    item_state: 'inferred', rule_version: 'm4-gap-v1', diagnosis_class: 'content_gap',
    query_refs: ['Q-TEST-001'], claim_refs: ['CLM-TEST-001'], evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'],
    asset_refs: ['AST-TEST-ABOUT-001'], source_refs: [],
    gap_basis: { supporting_evidence_refs: ['EVD-TEST-001', 'EVD-TEST-ASSET-001'], counter_evidence_refs: [], unresolved_conflicts: [], rationale: 'Gap.' },
  });
  await writeObject(root, 'assets/proposals/proposal.md', proposalData({ body_sha256: sha256(body) }), body);
  const built = await buildIndexes({ workspace: root });
  assert.ok(built.indexes.includes('asset-proposals.json'));
  assert.ok(built.indexes.includes('adoption-records.json'));
  assert.ok(built.indexes.includes('asset-publications.json'));
  const index = JSON.parse(await readFile(path.join(root, 'indexes/asset-proposals.json'), 'utf8'));
  assert.equal(index.objects[0].id, 'PRP-TEST-001');
  await writeObject(root, 'assets/proposals/proposal.md', proposalData({
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '9.9.9' }],
    body_sha256: sha256(body),
  }), body);
  await assert.rejects(
    buildIndexes({ workspace: root, write: false }),
    (error) => error.diagnostics.some((item) => item.code === 'REF_VERSION_MISMATCH'),
  );
  await rm(root, { recursive: true });
});
