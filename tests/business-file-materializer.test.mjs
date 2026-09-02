import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { materializeBusinessFileBundle } from '../plugins/geo-expert/scripts/lib/business-file-materializer.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { initWorkspace } from '../plugins/geo-expert/scripts/workspace-init.mjs';

async function workspace() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-business-file-'));
  const identity = {
    schema_version: '1.0.0', workspace_id: 'ws_myyshop2026082400000000000', brand: 'MyyShop',
    created_at: '2026-08-24T00:00:00Z', created_by: 'test', workspace_mode: 'online',
    merchant_ref: 'MER-MYYSHOP-001', merchant_mode: 'online', subject_locator: 'https://www.myyshop.com/',
    execution_scope: 'authorized_real', knowledge_base_ref: null, knowledge_base_mode: 'real_pending',
    online_configuration: { ga4_property_id: '356373250', gsc_site_url: 'https://www.myyshop.com/', analytics_plan: 'plan.json' },
  };
  await writeFile(path.join(root, 'workspace.json'), `${JSON.stringify(identity, null, 2)}\n`);
  await initWorkspace({ workspace: root, brand: 'MyyShop' });
  await mkdir(path.join(root, 'execution/identity'), { recursive: true });
  await writeFile(path.join(root, 'execution/identity/merchant.md'), serializeMarkdownObject({
    id: 'MER-MYYSHOP-001', record_type: 'merchant', status: 'active', version: '1.0.0',
    created_at: '2026-09-02T02:00:00Z', updated_at: '2026-09-02T02:00:00Z',
    display_name: 'MyyShop', canonical_locator: 'https://www.myyshop.com/', account_mode: 'online',
  }, '# Merchant\n'));
  for (const [name, data] of Object.entries({
    measurement: { id: 'business-measurement-v1', version: '1.0.0' },
    policy: { id: 'business-policy-v1', version: '1.0.0' },
    rule: { id: 'business-ratio-v1', version: '1.0.0' },
  })) {
    await mkdir(path.join(root, 'execution/contracts'), { recursive: true });
    await writeFile(path.join(root, `execution/contracts/${name}.json`), `${JSON.stringify(data)}\n`);
  }
  const authorization = Buffer.from('# Business file authorization\n');
  await mkdir(path.join(root, 'cycles/preparation/decisions'), { recursive: true });
  await writeFile(path.join(root, 'cycles/preparation/decisions/business-file.md'), authorization);
  await mkdir(path.join(root, 'imports'), { recursive: true });
  await writeFile(path.join(root, 'imports/aggregate.csv'), 'metric_id,value,unit,segment\nregistrations,12,count,all\nvisits,120,count,all\n');
  return { root, authorizationSha: sha256(authorization) };
}

function plan(authorizationSha, inputPath = 'imports/aggregate.csv') {
  const item = (id, itemPath) => ({ id, path: itemPath });
  return {
    schema_version: 'business-file-observation-plan/1.0.0', merchant_ref: 'MER-MYYSHOP-001',
    execution_scope: 'authorized_real', adapter_kind: 'business_file', format: 'csv', input_path: inputPath,
    authorization: { ref: 'workspace://cycles/preparation/decisions/business-file.md', sha256: authorizationSha },
    metadata: {
      starts_at: '2026-08-23T00:00:00Z', ends_at: '2026-08-30T00:00:00Z',
      as_of: '2026-09-02T02:00:00Z', owner_role: 'MyyShop Data Owner',
    },
    source: { ...item('SRC-MYYSHOP-BUSINESS-FILE-001', 'evidence/sources/src-myyshop-business-file-001.md'), name: 'MyyShop aggregate export' },
    run: item('RUN-MYYSHOP-BUSINESS-FILE-001', 'runs/RUN-MYYSHOP-BUSINESS-FILE-001/run.md'),
    observation: item('ANO-MYYSHOP-BUSINESS-FILE-001', 'cycles/analytics/ano-myyshop-business-file-001.md'),
    signal: { ...item('BSIG-MYYSHOP-BUSINESS-FILE-001', 'cycles/analytics/bsig-myyshop-business-file-001.md'), numerator_metric_id: 'registrations', denominator_metric_id: 'visits', unit: 'registrations_per_visit' },
    evidence: { ...item('EVD-MYYSHOP-BUSINESS-FILE-001', 'evidence/records/evd-myyshop-business-file-001.md'), status: 'candidate' },
    contracts: {
      measurement: { path: 'execution/contracts/measurement.json' },
      sensitive_data_policy: { path: 'execution/contracts/policy.json' },
      signal_rule: { path: 'execution/contracts/rule.json' },
    },
  };
}

test('聚合业务文件一次生成 ANO/BSIG/candidate EVD，不生成 approval', async () => {
  const fixture = await workspace();
  try {
    const result = await materializeBusinessFileBundle({ workspace: fixture.root, plan: plan(fixture.authorizationSha) });
    assert.equal(result.evidence_status, 'candidate');
    assert.equal(result.causal_claim, false);
    assert.equal(result.auto_approved, false);
    const graph = await loadWorkspaceGraph({ workspace: fixture.root });
    assert.equal(graph.byId.get(result.evidence_ref).data.approval, undefined);
    assert.equal(graph.byId.get(result.business_signal_ref).data.calculation.value, 0.1);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('缺少真实业务文件只返回 BUSINESS_FILE_NOT_PROVIDED', async () => {
  const fixture = await workspace();
  try {
    await assert.rejects(
      materializeBusinessFileBundle({ workspace: fixture.root, plan: plan(fixture.authorizationSha, 'imports/missing.csv') }),
      (error) => error.code === 'BUSINESS_FILE_NOT_PROVIDED',
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
