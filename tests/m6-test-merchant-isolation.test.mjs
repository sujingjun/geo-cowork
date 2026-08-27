import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  M6_MERCHANT_ID,
  M6_NAMESPACE,
  M6_SUBJECT_LOCATOR,
  M6_TEST_SCOPE,
  M6_WORKSPACE_ID,
  createM6FixtureWorkspace,
  m6TestMerchantData,
  readM6FixtureJson,
  seedM6FreezeInputs,
} from './helpers/m6-fixtures.mjs';
import { sha256, stableStringify } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REAL_MYYSHOP = path.join(REPO_ROOT, 'workspaces', 'myyshop');

async function isolationApi() {
  return import('../plugins/geo-expert/scripts/lib/m6-test-merchant.mjs');
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

test('M6 fixture 根身份是独立 test_only、fictitious 与 .invalid', async () => {
  const identity = await readM6FixtureJson('workspace.json');
  assert.equal(identity.workspace_id, M6_WORKSPACE_ID);
  assert.match(identity.workspace_id, /^ws_[a-z0-9]{26}$/);
  assert.equal(identity.workspace_mode, 'test_only');
  assert.equal(identity.test_namespace, M6_NAMESPACE);
  assert.equal(identity.legal_entity, false);
  assert.equal(identity.subject_locator, M6_SUBJECT_LOCATOR);
  assert.equal(new URL(identity.subject_locator).hostname.endsWith('.invalid'), true);

  const merchant = m6TestMerchantData();
  assert.equal(merchant.id, M6_MERCHANT_ID);
  assert.equal(merchant.identity.legal_entity_kind, 'fictitious');
  assert.equal(merchant.identity.real_brand_identity_claimed, false);
  assert.deepEqual(merchant.test_scope, M6_TEST_SCOPE);
});

test('Test Merchant validator 接受完整根身份并检查每个 synthetic 对象的顶层 test_scope', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { validateTestMerchantWorkspace } = await isolationApi();
    const result = await validateTestMerchantWorkspace({ workspace: root });
    assert.deepEqual(result.errors, []);
    assert.equal(result.identity.workspace_id, M6_WORKSPACE_ID);
    assert.equal(result.synthetic, true);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('根 identity 缺字段、非 test_only、legal entity 或非 .invalid 时 fail closed', async (t) => {
  const invalidCases = [
    ['missing namespace', { test_namespace: undefined }],
    ['unknown mode', { workspace_mode: 'unknown' }],
    ['legal entity', { legal_entity: true }],
    ['real locator', { subject_locator: 'https://www.myyshop.com/' }],
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
        const { validateTestMerchantWorkspace } = await isolationApi();
        const result = await validateTestMerchantWorkspace({ workspace: root });
        assert.ok(result.errors.some((item) => item.code === 'TEST_MERCHANT_IDENTITY_INVALID'));
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
    const { preflightSyntheticWrite } = await isolationApi();
    const base = syntheticQuery();
    delete base.test_scope;
    await t.test('missing top-level test_scope', async () => {
      await assert.rejects(
        preflightSyntheticWrite({ workspace: root, data: base, body: '# Synthetic\n' }),
        (error) => error.code === 'TEST_MERCHANT_SCOPE_REQUIRED',
      );
    });
    await t.test('extensions cannot replace top-level test_scope', async () => {
      await assert.rejects(
        preflightSyntheticWrite({
          workspace: root,
          data: { ...base, extensions: { 'm6.test_scope': { ...M6_TEST_SCOPE } } },
          body: '# Synthetic\n',
        }),
        (error) => error.code === 'TEST_MERCHANT_SCOPE_REQUIRED',
      );
    });
    await t.test('cross-workspace merchant_ref', async () => {
      await assert.rejects(
        preflightSyntheticWrite({
          workspace: root,
          data: {
            ...base,
            test_scope: {
              ...M6_TEST_SCOPE,
              merchant_ref: 'TMT-OTHER-WORKSPACE-001',
            },
          },
          body: '# Synthetic\n',
        }),
        (error) => error.code === 'SYNTHETIC_REAL_REF_CONTAMINATION',
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
    const { preflightSyntheticWrite } = await isolationApi();
    const cases = [
      ['direct ref', {
        data: {
          id: 'EVD-M6-CONTAMINATION-001', record_type: 'evidence', status: 'candidate',
          version: '1.0.0', created_at: '2026-08-27T00:00:00Z', updated_at: '2026-08-27T00:00:00Z',
          test_scope: { ...M6_TEST_SCOPE }, source_refs: ['SRC-MYYSHOP-REAL-001'],
          locator: 'https://m6-test-merchant.invalid/fact', captured_at: '2026-08-27T00:00:00Z',
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
          preflightSyntheticWrite({ workspace: root, body: '# Synthetic\n', ...input }),
          (error) => error.code === 'SYNTHETIC_REAL_REF_CONTAMINATION',
        );
      });
    }
  } finally {
    await rm(root, { recursive: true });
  }
});

test('真实 MyyShop 只读校验拒绝 M6 test-only 写入且不改变任何字节', async () => {
  const { assertTestWorkspaceWriteAllowed } = await isolationApi();
  const before = await readFile(path.join(REAL_MYYSHOP, 'workspace.json'));
  await assert.rejects(
    assertTestWorkspaceWriteAllowed({ workspace: REAL_MYYSHOP }),
    (error) => error.code === 'REAL_WORKSPACE_WRITE_FORBIDDEN',
  );
  assert.deepEqual(await readFile(path.join(REAL_MYYSHOP, 'workspace.json')), before);
});
