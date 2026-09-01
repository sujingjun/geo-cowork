import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  NOW,
  claim,
  evidence,
  query,
  source,
  temporaryWorkspace,
  writeObject,
} from './helpers/object-fixtures.mjs';

async function validGraph() {
  const root = await temporaryWorkspace();
  const snapshotPath = 'evidence/snapshots/fact.txt';
  const snapshot = 'index fixture fact\n';
  await mkdir(path.join(root, 'evidence/snapshots'), { recursive: true });
  await writeFile(path.join(root, snapshotPath), snapshot);
  await writeObject(root, 'evidence/sources/source.md', source());
  await writeObject(root, 'evidence/records/evidence.md', evidence(snapshotPath, sha256(snapshot), {
    status: 'candidate',
    approval: undefined,
  }));
  await writeObject(root, 'knowledge/claims/claim.md', claim());
  await writeObject(root, 'queries/candidates/query.md', query());
  await writeObject(root, 'cycles/preparation/finding.md', {
    id: 'FND-TEST-001',
    record_type: 'finding',
    status: 'open',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    finding_code: 'SYNTHETIC_CHECK',
    finding_kind: 'technical',
    item_state: 'observed',
    rule_version: 'fixture-v1',
    query_refs: ['Q-TEST-001'],
    claim_refs: ['CLM-TEST-001'],
    evidence_refs: ['EVD-TEST-001'],
  });
  return root;
}

test('indexes 可删除重建且连续构建字节一致，不修改 Markdown', async () => {
  const root = await validGraph();
  const claimPath = path.join(root, 'knowledge/claims/claim.md');
  const beforeMarkdown = sha256(await readFile(claimPath));

  const first = await buildIndexes({ workspace: root, write: true });
  const firstBytes = await readFile(path.join(root, 'indexes/claims.json'), 'utf8');
  await rm(path.join(root, 'indexes'), { recursive: true });
  const second = await buildIndexes({ workspace: root, write: true });
  const secondBytes = await readFile(path.join(root, 'indexes/claims.json'), 'utf8');

  assert.equal(first.object_count, 5);
  assert.equal(second.object_count, 5);
  assert.equal(firstBytes, secondBytes);
  assert.equal(sha256(await readFile(claimPath)), beforeMarkdown);
  await rm(root, { recursive: true });
});

test('duplicate ID、broken ref、错误 ref 类型均返回路径化诊断', async (t) => {
  await t.test('duplicate ID', async () => {
    const root = await validGraph();
    await writeObject(root, 'evidence/sources/duplicate.md', source({ title: 'Duplicate' }));
    await assert.rejects(buildIndexes({ workspace: root, write: false }), (error) => {
      assert.equal(error.code, 'INDEX_VALIDATION_FAILED');
      assert.ok(error.diagnostics.some((d) => d.code === 'DUPLICATE_ID' && d.paths.length === 2));
      return true;
    });
    await rm(root, { recursive: true });
  });

  await t.test('broken ref', async () => {
    const root = await validGraph();
    await writeObject(root, 'knowledge/claims/claim.md', claim({ evidence_refs: ['EVD-MISSING-001'] }));
    await assert.rejects(buildIndexes({ workspace: root, write: false }), (error) => {
      assert.ok(error.diagnostics.some((d) =>
        d.code === 'BROKEN_REF' && d.path === 'knowledge/claims/claim.md' && d.ref === 'EVD-MISSING-001'));
      return true;
    });
    await rm(root, { recursive: true });
  });

  await t.test('ref type mismatch', async () => {
    const root = await validGraph();
    await writeObject(root, 'knowledge/claims/claim.md', claim({ evidence_refs: ['SRC-TEST-001'] }));
    await assert.rejects(buildIndexes({ workspace: root, write: false }), (error) => {
      assert.ok(error.diagnostics.some((d) => d.code === 'REF_TYPE_MISMATCH'));
      return true;
    });
    await rm(root, { recursive: true });
  });

  await t.test('ref version mismatch', async () => {
    const root = await validGraph();
    await writeObject(root, 'knowledge/answer-cards/answer.md', {
      id: 'ANS-TEST-001', record_type: 'answer_card', status: 'candidate', version: '1.0.0',
      created_at: NOW, updated_at: NOW, query_refs: ['Q-TEST-001'],
      claim_versions: [{ ref: 'CLM-TEST-001', version: '9.9.9' }], evidence_refs: ['EVD-TEST-001'],
      direct_answer: 'Synthetic.', limitations: [], forbidden_statements: [],
    });
    await assert.rejects(buildIndexes({ workspace: root, write: false }), (error) => {
      assert.ok(error.diagnostics.some((d) => d.code === 'REF_VERSION_MISMATCH'));
      return true;
    });
    await rm(root, { recursive: true });
  });
});

test('失败构建不改旧 index，并发构建最终 JSON 完整', async () => {
  const root = await validGraph();
  await buildIndexes({ workspace: root, write: true });
  const indexPath = path.join(root, 'indexes/claims.json');
  const before = await readFile(indexPath, 'utf8');
  await writeObject(root, 'knowledge/claims/claim.md', claim({ evidence_refs: ['EVD-MISSING-001'] }));
  await assert.rejects(buildIndexes({ workspace: root, write: true }));
  assert.equal(await readFile(indexPath, 'utf8'), before);
  await writeObject(root, 'knowledge/claims/claim.md', claim());
  await Promise.all([
    buildIndexes({ workspace: root, write: true }),
    buildIndexes({ workspace: root, write: true }),
  ]);
  assert.equal(JSON.parse(await readFile(indexPath, 'utf8')).record_type, 'claim');
  await rm(root, { recursive: true });
});

test('legacy knowledge 进入兼容索引，模板与治理文件被排除', async () => {
  const root = await validGraph();
  const legacy = {
    record_type: 'knowledge_entry',
    id: 'KB-SYNTHETIC-001',
    query_id: 'Q-LEGACY-001',
    status: 'draft',
    version: '0.1.0',
  };
  await writeObject(root, 'knowledge/02-brand-identity/legacy.md', legacy);
  await writeObject(root, 'knowledge/01-templates/template.md', {
    ...legacy,
    id: 'KB-TEMPLATE-001',
    query_id: 'Q-TEMPLATE-001',
  });
  await writeFile(path.join(root, 'knowledge/00-governance/notes.md'), '# Governance\n');

  const result = await buildIndexes({ workspace: root, write: true });
  const index = JSON.parse(await readFile(path.join(root, 'indexes/legacy-knowledge.json'), 'utf8'));
  assert.equal(result.legacy_count, 1);
  assert.deepEqual(index.objects.map((item) => item.id), ['KB-SYNTHETIC-001']);
  assert.equal(index.objects[0].contract_status, 'legacy');
  await rm(root, { recursive: true });
});

test('业务品牌准备资料包作为规划文档排除，不进入对象索引', async () => {
  const root = await validGraph();
  const packageFiles = [
    '01-business-input-template.md',
    '05-circle1-business-readiness.md',
    '06-source-notes.md',
    'README.md',
    'pr/README.md',
    'site/README.md',
  ];
  for (const relative of packageFiles) {
    const target = path.join(root, 'strategy/business-brand-knowledge-v1', relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `---\ntitle: Planning document\nstatus: proposed\n---\n\n# Planning\n`);
  }
  await writeObject(root, 'strategy/operational/source.md', source({ id: 'SRC-TEST-002' }));

  const result = await buildIndexes({ workspace: root, write: false });
  assert.equal(result.object_count, 6);
  assert.equal(result.legacy_count, 0);
  await rm(root, { recursive: true });
});
