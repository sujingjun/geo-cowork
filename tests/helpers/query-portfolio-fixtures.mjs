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
export const QP_SUBJECT_LOCATOR = 'https://www.myyshop.com/';
export const QP_MERCHANT_ID = 'MER-MYYSHOP-001';
export const QP_KNOWLEDGE_BASE_ID = 'KBASE-MYYSHOP-QP-DEVTEST-001';
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
  knowledge_base_ref: QP_KNOWLEDGE_BASE_ID,
});

export function qpMerchantData() {
  return {
    id: QP_MERCHANT_ID,
    record_type: 'merchant',
    status: 'active',
    version: '1.0.0',
    created_at: QP_NOW,
    updated_at: QP_NOW,
    title: 'MyyShop online merchant identity',
    display_name: 'MyyShop',
    canonical_locator: QP_SUBJECT_LOCATOR,
    account_mode: 'online',
  };
}

export function qpKnowledgeBaseData() {
  return {
    ...qpCommon(QP_KNOWLEDGE_BASE_ID, 'brand_knowledge_base', 'frozen', 'QP development test knowledge base'),
    merchant_ref: QP_MERCHANT_ID,
    mode: 'test_only',
    root_path: 'knowledge',
    provenance: { kind: 'synthetic', usage: 'test_only', decision_ref: QP_APPROVAL.decision_ref },
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
    locator: 'https://qp-dev-knowledge.invalid/observation',
  };
}

export function qpCommunitySourceData() {
  return {
    ...qpCommon(QP_SOURCE_COMMUNITY_ID, 'source', 'active', 'QP synthetic community source'),
    name: 'QP synthetic community expression',
    source_kind: 'community_expression',
    locator: 'https://qp-dev-knowledge.invalid/community',
  };
}

export function qpGoalData() {
  return {
    ...qpCommon(QP_GOAL_ID, 'perception_goal', 'approved', 'QP test perception goal'),
    goal_statement: '让生成式平台正确理解 QP Development Test Knowledge Base 是什么。',
    success_question: 'QP Development Test Knowledge Base 是什么？',
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
    'knowledge/meta', 'knowledge/documents', 'knowledge/claims', 'knowledge/answer-cards', 'knowledge/releases',
    'evidence/sources', 'evidence/records', 'assets/own', 'indexes', 'runs', 'cycles',
    'execution/identity',
  ]) {
    await mkdir(path.join(root, ...dir.split('/')), { recursive: true });
  }
  await writeFile(path.join(root, 'workspace.json'), `${JSON.stringify({
    schema_version: '1.0.0',
    workspace_id: QP_WORKSPACE_ID,
    brand: 'MyyShop',
    created_at: QP_NOW,
    created_by: 'query-portfolio-fixture/1.0.0',
    workspace_mode: 'development_test',
    merchant_ref: QP_MERCHANT_ID,
    merchant_mode: 'online',
    subject_locator: QP_SUBJECT_LOCATOR,
    execution_scope: 'synthetic_test',
    knowledge_base_ref: QP_KNOWLEDGE_BASE_ID,
    knowledge_base_mode: 'test_only',
    online_configuration: {
      ga4_property_id: '356373250',
      gsc_site_url: 'https://www.myyshop.com/',
      analytics_plan: 'cycles/preparation/analytics/ga4-gsc-readonly-plan.json',
    },
  }, null, 2)}\n`);
  await copyFile(
    path.join(QP_FIXTURE_ROOT, 'README.md'),
    path.join(root, 'README.md'),
  );
  await writeFile(path.join(root, 'STATUS.md'), '# QP Development Test Knowledge Base\n\nTest-only fixture.\n');
  await writeQpObject(root, 'execution/identity/merchant.md', qpMerchantData());
  await writeQpObject(root, 'knowledge/meta/knowledge-base.md', qpKnowledgeBaseData());
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
