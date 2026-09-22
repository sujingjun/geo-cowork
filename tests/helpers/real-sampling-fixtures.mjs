import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  createM6FixtureWorkspace,
  seedM6FreezeInputs,
} from './m6-fixtures.mjs';
import { walkMarkdownFiles } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { serializeMarkdownObject } from '../../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { putJson } from '../../plugins/geo-expert/scripts/lib/real-journey-store.mjs';
import { freezeRealCycle } from '../../plugins/geo-expert/scripts/lib/real-cycle-progress.mjs';
import { FORMAL_COLLECTION_METHODS } from '../../plugins/geo-expert/scripts/lib/playwright-collector.mjs';

// Isolated state-contract fixture only. Its content is not business evidence.
export async function createRealSamplingWorkspace() {
  const root = await createM6FixtureWorkspace();
  await seedM6FreezeInputs(root);
  const identity = JSON.parse(
    await readFile(path.join(root, 'workspace.json'), 'utf8'),
  );
  Object.assign(identity, {
    workspace_mode: 'online',
    execution_scope: 'authorized_real',
    knowledge_base_mode: 'real',
  });
  await writeFile(path.join(root, 'workspace.json'), JSON.stringify(identity));
  for (const file of await walkMarkdownFiles(root, {
    ignore: (r) => r.startsWith('indexes/'),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const p = matter(text);
    if (!p.data.record_type || p.data.record_type === 'knowledge_entry')
      continue;
    delete p.data.test_scope;
    if (p.data.record_type === 'brand_knowledge_base')
      Object.assign(p.data, {
        mode: 'real',
        status: 'active',
        provenance: {
          kind: 'real',
          usage: 'brand_operations',
          decision_ref: 'fixture://real-path-contract-test',
        },
      });
    await writeFile(file, serializeMarkdownObject(p.data, p.content));
  }
  const auth = await putJson(root, 'execution/formal-authorization.json', {
    actor: 'Contract test',
    scope: 'isolated state validation, no real platform submission',
  });
  const plan = {
    cycle_ref: 'CYC-REAL-SAMPLING-001',
    cycle_number: 1,
    cycle_dir: 'cycles/real-sampling',
    run_ref: 'RUN-REAL-SAMPLING-001',
    merchant_ref: identity.merchant_ref,
    knowledge_base_ref: identity.knowledge_base_ref,
    goal_ref: 'GOAL-M6-TEST-001',
    query_set_ref: 'QS-M6-TEST-001',
    knowledge: { release_ref: 'KR-M6-TEST-001' },
    asset_refs: ['AST-M6-TEST-001'],
    collection_methods: FORMAL_COLLECTION_METHODS,
    provider: 'deepseek',
    execution_owner: 'Contract test',
    created_at: new Date().toISOString(),
    authorization: {
      ref: `workspace://${auth.path}`,
      sha256: auth.sha256,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    },
    contracts: {
      measurement_contract: 'execution/contracts/measurement-contract.json',
      signal_rule: 'execution/contracts/signal-rule.json',
      sensitive_data_policy: 'execution/contracts/sensitive-data-policy.json',
    },
  };
  await putJson(root, 'cycles/preparation/real-cycle-plan.json', plan);
  await freezeRealCycle(root);
  return root;
}
