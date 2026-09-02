import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  M6_MERCHANT_ID,
  M6_KNOWLEDGE_BASE_ID,
  M6_SUBJECT_LOCATOR,
  M6_TEST_SCOPE,
  M6_WORKSPACE_ID,
  createM6FixtureWorkspace,
  m6KnowledgeBaseData,
  m6MerchantData,
  readM6FixtureJson,
  seedM6FreezeInputs,
} from './helpers/m6-fixtures.mjs';
import { sha256, stableStringify } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REAL_MYYSHOP = path.join(REPO_ROOT, 'workspaces', 'myyshop');

async function isolationApi() {
  return import('../plugins/geo-expert/scripts/lib/workspace-scope.mjs');
}

function syntheticQuery(id = 'Q-M6-ISOLATION-001') {
  return {
    id,
    record_type: 'query',
    status: 'candidate',
    version: '1.0.0',
    created_at: '2026-08-27T00:00:00Z',
    updated_at: '2026-08-27T00:00:00Z',
    test_scope: { ...M6_TEST_SCOPE },
    query_text: 'Synthetic query?',
    language: 'en-US',
  };
}

test('M6 fixture 使用唯一 MyyShop online Merchant 与 test-only KBASE', async () => {
  const identity = await readM6FixtureJson('workspace.json');
  assert.equal(identity.workspace_id, M6_WORKSPACE_ID);
  assert.match(identity.workspace_id, /^ws_[a-z0-9]{26}$/);
  assert.equal(identity.workspace_mode, 'development_test');
  assert.equal(identity.merchant_ref, M6_MERCHANT_ID);
  assert.equal(identity.merchant_mode, 'online');
  assert.equal(identity.execution_scope, 'synthetic_test');
  assert.equal(identity.knowledge_base_ref, M6_KNOWLEDGE_BASE_ID);
  assert.equal(identity.knowledge_base_mode, 'test_only');
  assert.equal(identity.subject_locator, M6_SUBJECT_LOCATOR);
  assert.equal(identity.online_configuration.ga4_property_id, '356373250');

  const merchant = m6MerchantData();
  assert.equal(merchant.id, M6_MERCHANT_ID);
  assert.equal(merchant.canonical_locator, M6_SUBJECT_LOCATOR);
  assert.equal(merchant.account_mode, 'online');
  assert.equal(merchant.test_scope, undefined);
  assert.deepEqual(m6KnowledgeBaseData().test_scope, M6_TEST_SCOPE);
});

test('development KBASE validator 接受身份并检查每个 synthetic 对象的顶层 test_scope', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { validateDevelopmentKnowledgeWorkspace } = await isolationApi();
    const result = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
    assert.deepEqual(result.errors, []);
    assert.equal(result.identity.workspace_id, M6_WORKSPACE_ID);
    assert.equal(result.knowledgeBase.id, M6_KNOWLEDGE_BASE_ID);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('根 identity 缺 Merchant/KBASE scope 或线上配置漂移时 fail closed', async (t) => {
  const invalidCases = [
    ['missing merchant', { merchant_ref: undefined }],
    ['unknown mode', { workspace_mode: 'unknown' }],
    ['wrong execution scope', { execution_scope: 'authorized_real' }],
    ['missing knowledge base', { knowledge_base_ref: undefined }],
  ];
  for (const [label, patch] of invalidCases) {
    await t.test(label, async () => {
      const root = await createM6FixtureWorkspace();
      try {
        await seedM6FreezeInputs(root);
        const file = path.join(root, 'workspace.json');
        const identity = JSON.parse(await readFile(file, 'utf8'));
        for (const [key, value] of Object.entries(patch)) {
          if (value === undefined) delete identity[key];
          else identity[key] = value;
        }
        await writeFile(file, `${JSON.stringify(identity, null, 2)}\n`);
        const { validateDevelopmentKnowledgeWorkspace } = await isolationApi();
        const result = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
        assert.ok(result.errors.some((item) => item.code === 'WORKSPACE_SCOPE_INVALID'));
      } finally {
        await rm(root, { recursive: true });
      }
    });
  }
});

test('写入预检拒绝缺失/伪装 test_scope 与跨 Workspace merchant_ref', async (t) => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { preflightTestKnowledgeWrite } = await isolationApi();
    const base = syntheticQuery();
    delete base.test_scope;
    await t.test('missing top-level test_scope', async () => {
      await assert.rejects(
        preflightTestKnowledgeWrite({ workspace: root, data: base, body: '# Synthetic\n' }),
        (error) => error.code === 'TEST_KNOWLEDGE_SCOPE_REQUIRED',
      );
    });
    await t.test('extensions cannot replace top-level test_scope', async () => {
      await assert.rejects(
        preflightTestKnowledgeWrite({
          workspace: root,
          data: { ...base, extensions: { 'm6.test_scope': { ...M6_TEST_SCOPE } } },
          body: '# Synthetic\n',
        }),
        (error) => error.code === 'TEST_KNOWLEDGE_SCOPE_REQUIRED',
      );
    });
    await t.test('cross-workspace merchant_ref', async () => {
      await assert.rejects(
        preflightTestKnowledgeWrite({
          workspace: root,
          data: {
            ...base,
            test_scope: {
              ...M6_TEST_SCOPE,
              merchant_ref: 'MER-OTHER-WORKSPACE-001',
            },
          },
          body: '# Synthetic\n',
        }),
        (error) => error.code === 'TEST_KNOWLEDGE_SCOPE_REQUIRED',
      );
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('污染预检覆盖 direct/version/Run input、正文 URL 与 manifest locator', async (t) => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { preflightTestKnowledgeWrite } = await isolationApi();
    const cases = [
      ['direct ref', {
        data: {
          id: 'EVD-M6-CONTAMINATION-001', record_type: 'evidence', status: 'candidate',
          version: '1.0.0', created_at: '2026-08-27T00:00:00Z', updated_at: '2026-08-27T00:00:00Z',
          test_scope: { ...M6_TEST_SCOPE }, source_refs: ['SRC-MYYSHOP-REAL-001'],
          locator: 'https://dev-knowledge.invalid/fact', captured_at: '2026-08-27T00:00:00Z',
          snapshot: { path: 'evidence/snapshots/source.txt', sha256: 'a'.repeat(64), media_type: 'text/plain' },
          collector: { name: 'fixture', version: '1.0.0' },
        },
      }],
      ['version ref', {
        data: {
          id: 'ANS-M6-CONTAMINATION-001', record_type: 'answer_card', status: 'candidate',
          version: '1.0.0', created_at: '2026-08-27T00:00:00Z', updated_at: '2026-08-27T00:00:00Z',
          test_scope: { ...M6_TEST_SCOPE }, query_refs: ['Q-M6-TEST-001'],
          claim_versions: [{ ref: 'CLM-MYYSHOP-REAL-001', version: '1.0.0' }],
          direct_answer: 'Synthetic.', limitations: [], forbidden_statements: [],
        },
      }],
      ['Run input', {
        data: {
          id: 'RUN-M6-CONTAMINATION-001', record_type: 'run', status: 'pending',
          version: '1.0.0', created_at: '2026-08-27T00:00:00Z', updated_at: '2026-08-27T00:00:00Z',
          test_scope: { ...M6_TEST_SCOPE }, skill: 'geo-lifecycle', skill_version: '1.0.0',
          input_refs: ['CLM-MYYSHOP-REAL-001'],
          input_versions: { 'CLM-MYYSHOP-REAL-001': '1.0.0' },
          input_fingerprint: sha256(stableStringify({ 'CLM-MYYSHOP-REAL-001': '1.0.0' })),
          completed_steps: [], output_artifacts: [], business_result: 'not_evaluated', next_action: 'start',
        },
      }],
      ['body URL', {
        data: syntheticQuery('Q-M6-CONTAMINATION-002'),
        body: '# Synthetic\n\nhttps://www.myyshop.com/account\n',
      }],
      ['manifest locator', {
        data: syntheticQuery('Q-M6-CONTAMINATION-003'),
        manifest: { output_root: 'workspaces/myyshop', locator: 'https://www.myyshop.com/' },
      }],
    ];
    for (const [label, input] of cases) {
      await t.test(label, async () => {
        await assert.rejects(
          preflightTestKnowledgeWrite({ workspace: root, body: '# Synthetic\n', ...input }),
          (error) => error.code === 'SYNTHETIC_REAL_REF_CONTAMINATION',
        );
      });
    }
  } finally {
    await rm(root, { recursive: true });
  }
});

test('真实 MyyShop 只读校验拒绝 M6 test-only 写入且不改变任何字节', async () => {
  const { assertDevelopmentWorkspaceWriteAllowed } = await isolationApi();
  const before = await readFile(path.join(REAL_MYYSHOP, 'workspace.json'));
  await assert.rejects(
    assertDevelopmentWorkspaceWriteAllowed({ workspace: REAL_MYYSHOP }),
    (error) => error.code === 'REAL_WORKSPACE_WRITE_FORBIDDEN',
  );
  assert.deepEqual(await readFile(path.join(REAL_MYYSHOP, 'workspace.json')), before);
});
