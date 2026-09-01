import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { serializeMarkdownObject } from '../../plugins/geo-expert/scripts/lib/object-contract.mjs';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const QP_FIXTURE_ROOT = path.resolve(THIS_DIR, '..', 'fixtures', 'query-portfolio');

export const QP_NOW = '2026-09-01T00:00:00Z';
export const QP_WORKSPACE_ID = `ws_${'qptestportfolio'.padEnd(26, '0')}`;
export const QP_NAMESPACE = 'query-portfolio-v1';
export const QP_SUBJECT_LOCATOR = 'https://qp-test-merchant.invalid/';
export const QP_MERCHANT_ID = 'TMT-QP-TEST-001';
export const QP_GOAL_ID = 'GOAL-QP-TEST-001';
export const QP_SOURCE_PLATFORM_ID = 'SRC-QP-TEST-001';
export const QP_SOURCE_COMMUNITY_ID = 'SRC-QP-TEST-002';
export const QP_QUERY_SET_ID = 'QS-QP-TEST-001';

export const QP_APPROVAL = Object.freeze({
  approved_by: 'Fixture Human Reviewer',
  approved_at: QP_NOW,
  decision_ref: 'fixture://approval/qp-test-only-001',
});

export const QP_TEST_SCOPE = Object.freeze({
  kind: 'synthetic',
  usage: 'test_only',
  merchant_ref: QP_MERCHANT_ID,
  workspace_id: QP_WORKSPACE_ID,
});

export function qpTestMerchantData() {
  return {
    id: QP_MERCHANT_ID,
    record_type: 'test_merchant',
    status: 'frozen',
    version: '1.0.0',
    created_at: QP_NOW,
    updated_at: QP_NOW,
    title: 'QP synthetic test merchant',
    test_scope: { ...QP_TEST_SCOPE },
    workspace_id: QP_WORKSPACE_ID,
    workspace_namespace: QP_NAMESPACE,
    display_name: 'QP Synthetic Test Merchant',
    identity: {
      legal_entity_kind: 'fictitious',
      canonical_locator: QP_SUBJECT_LOCATOR,
      real_brand_identity_claimed: false,
    },
    provenance: {
      kind: 'synthetic',
      usage: 'test_only',
      decision_ref: QP_APPROVAL.decision_ref,
      semantic_projection_ref: 'fixture://projection/qp-positioning-v1',
    },
    real_workspace_forbidden: ['workspaces/myyshop'],
    approval: { ...QP_APPROVAL },
  };
}

function qpCommon(id, recordType, status, title) {
  return {
    id,
    record_type: recordType,
    status,
    version: '1.0.0',
    created_at: QP_NOW,
    updated_at: QP_NOW,
    title,
    test_scope: { ...QP_TEST_SCOPE },
  };
}

export function qpSourceData() {
  return {
    ...qpCommon(QP_SOURCE_PLATFORM_ID, 'source', 'active', 'QP synthetic observation source'),
    name: 'QP synthetic generative platform observation',
    source_kind: 'generative_platform_observation',
    locator: 'https://qp-test-merchant.invalid/observation',
  };
}

export function qpCommunitySourceData() {
  return {
    ...qpCommon(QP_SOURCE_COMMUNITY_ID, 'source', 'active', 'QP synthetic community source'),
    name: 'QP synthetic community expression',
    source_kind: 'community_expression',
    locator: 'https://qp-test-merchant.invalid/community',
  };
}

export function qpGoalData() {
  return {
    ...qpCommon(QP_GOAL_ID, 'perception_goal', 'approved', 'QP test perception goal'),
    goal_statement: '让生成式平台正确理解 QP Synthetic Test Merchant 是什么。',
    success_question: 'QP Synthetic Test Merchant 是什么？',
    approval: { ...QP_APPROVAL },
  };
}

export async function readIntakePlan() {
  return JSON.parse(await readFile(path.join(QP_FIXTURE_ROOT, 'plans/intake-basic.json'), 'utf8'));
}

export async function writeQpObject(root, relative, data, body = '# QP synthetic fixture\n') {
  const target = path.join(root, ...relative.split('/'));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, serializeMarkdownObject(data, body));
  return target;
}

export async function createQueryPortfolioFixtureWorkspace() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-query-portfolio-'));
  for (const dir of [
    'queries/candidates', 'queries/formal', 'queries/sets', 'queries/portfolio/reports',
    'knowledge/documents', 'knowledge/claims', 'knowledge/answer-cards', 'knowledge/releases',
    'evidence/sources', 'evidence/records', 'assets/own', 'indexes', 'runs', 'cycles',
  ]) {
    await mkdir(path.join(root, ...dir.split('/')), { recursive: true });
  }
  await writeFile(path.join(root, 'workspace.json'), `${JSON.stringify({
    schema_version: '1.0.0',
    workspace_id: QP_WORKSPACE_ID,
    brand: 'QP Synthetic Test Merchant',
    created_at: QP_NOW,
    created_by: 'query-portfolio-fixture/1.0.0',
    workspace_mode: 'test_only',
    test_namespace: QP_NAMESPACE,
    legal_entity: false,
    subject_locator: QP_SUBJECT_LOCATOR,
  }, null, 2)}\n`);
  await copyFile(
    path.join(QP_FIXTURE_ROOT, 'README.md'),
    path.join(root, 'README.md'),
  );
  await writeFile(path.join(root, 'STATUS.md'), '# QP Synthetic Test Merchant\n\nTest-only fixture.\n');
  await writeQpObject(root, 'cycles/preparation/test-merchant.md', qpTestMerchantData());
  await writeQpObject(root, 'evidence/sources/src-qp-test-001.md', qpSourceData());
  await writeQpObject(root, 'evidence/sources/src-qp-test-002.md', qpCommunitySourceData());
  await writeQpObject(root, 'cycles/preparation/goal.md', qpGoalData());
  return root;
}

// --- 人工操作模拟（测试中等同人类编辑对象文件） ---

async function editObject(root, relative, mutate) {
  const target = path.join(root, ...relative.split('/'));
  const parsed = matter(await readFile(target, 'utf8'));
  mutate(parsed.data);
  await writeFile(target, serializeMarkdownObject(parsed.data, parsed.content));
  return parsed.data;
}

export async function promoteQueryToFormal(root, queryId, { approval = QP_APPROVAL, priority } = {}) {
  return editObject(root, `queries/candidates/${queryId.toLowerCase()}.md`, (data) => {
    data.status = 'formal';
    data.approval = { ...approval };
    if (priority) data.priority = priority;
  });
}

export async function freezeQuerySet(root, relative, { contentSha256, frozenBy = 'Fixture Human Reviewer', approval = QP_APPROVAL }) {
  return editObject(root, relative, (data) => {
    data.status = 'frozen';
    data.frozen_at = QP_NOW;
    data.frozen_by = frozenBy;
    data.content_sha256 = contentSha256;
    data.approval = { ...approval };
  });
}
