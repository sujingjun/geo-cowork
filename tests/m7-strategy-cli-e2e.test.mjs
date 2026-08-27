import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { STRATEGY_CLI, runNode } from './helpers/m7-cycle2-fixtures.mjs';
import {
  createStrategyCliWorkspace,
  materializeFullStrategyFlow,
  writeDimensionDecision,
  writeJson,
  writeProceedDecision,
} from './helpers/m7-strategy-cli-fixtures.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

async function command(root, planPath, name, phase, extra = []) {
  const result = await runNode(STRATEGY_CLI, [
    name, '--workspace', root, '--plan', planPath, '--phase', phase, ...extra,
  ]);
  return JSON.parse(result.stdout);
}

test('公开 CLI 从 canonical workspace 与 fresh decisions 跑通 STA→DDM factor→STO→trace', async () => {
  const fixture = await createStrategyCliWorkspace();
  try {
    const flow = await materializeFullStrategyFlow(fixture);
    assert.equal(flow.invoked.assessment_status, 'waiting_human');
    assert.equal(flow.decided.assessment_status, 'decided');
    assert.equal(flow.factor.dimension_status, 'decision_factor');
    assert.equal(flow.output.strategy_output_ref, 'STO-M7-CLI-DRAFT-001');
    assert.equal(flow.candidate_rule_path,
      'runs/RUN-M7-CLI-STRATEGY-001/outputs/contracts/m7-candidate-generator-rule.json');
    assert.equal(
      sha256(await readFile(path.join(fixture.root, flow.candidate_rule_path))),
      flow.candidate_rule_sha256,
    );
    const run = matter(await readFile(path.join(
      fixture.root, 'runs/RUN-M7-CLI-STRATEGY-001/run.md',
    ), 'utf8')).data;
    assert.equal(run.output_artifacts.includes(
      'outputs/contracts/m7-candidate-generator-rule.json',
    ), true);
    assert.equal(flow.strategy_snapshot.ref, 'CIS-M7-CLI-STRATEGY-001');
    const traced = await command(fixture.root, fixture.planPath, 'trace', 'workspace', [
      '--assessment', 'STA-M7-CLI-DECIDED-001',
    ]);
    assert.equal(traced.result, 'complete');
    assert.deepEqual(traced.errors, []);
    assert.deepEqual(
      traced.dimension_lineage.map((item) => item.status),
      ['candidate', 'validated', 'decision_factor'],
    );
    assert.equal(traced.network_accessed, false);
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('空触发与伪造 waiting checksum 在任何目标写入前失败', async () => {
  const fixture = await createStrategyCliWorkspace();
  try {
    const invalid = structuredClone(fixture.invocation);
    delete invalid.human_invocation.decision_ref;
    await writeJson(fixture.root, 'fixtures/m7-cli/invocation.json', invalid);
    await assert.rejects(
      command(fixture.root, fixture.planPath, 'assess', 'invoke'),
      (error) => JSON.parse(error.stderr).error === 'STRATEGY_HUMAN_TRIGGER_REQUIRED',
    );
    await assert.rejects(
      access(path.join(fixture.root, 'runs/RUN-M7-CLI-STRATEGY-001/run.md')),
      (error) => error.code === 'ENOENT',
    );
    await writeJson(fixture.root, 'fixtures/m7-cli/invocation.json', fixture.invocation);
    const invoked = await command(fixture.root, fixture.planPath, 'assess', 'invoke');
    const proceedPath = await writeProceedDecision(fixture.root, invoked);
    const forged = JSON.parse(await readFile(proceedPath, 'utf8'));
    forged.subject_version.file_sha256 = '0'.repeat(64);
    await writeFile(proceedPath, `${JSON.stringify(forged, null, 2)}\n`);
    await assert.rejects(
      command(fixture.root, fixture.planPath, 'assess', 'decide', ['--decision', proceedPath]),
      (error) => JSON.parse(error.stderr).error === 'STRATEGY_DECISION_INPUT_DRIFT',
    );
    await assert.rejects(
      access(path.join(fixture.root, 'strategy/assessments/sta-m7-cli-decided-001.md')),
      (error) => error.code === 'ENOENT',
    );
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('strategy snapshot copy 漂移 fail closed；live object 后续漂移不改变冻结链', async () => {
  const fixture = await createStrategyCliWorkspace();
  try {
    const invoked = await command(fixture.root, fixture.planPath, 'assess', 'invoke');
    const proceedPath = await writeProceedDecision(fixture.root, invoked);
    const cis = matter(await readFile(path.join(
      fixture.root, 'cycles/m6/snapshots/cis-m7-cli-strategy-001.md',
    ), 'utf8')).data;
    const productEntry = cis.source_entries.find((item) => item.object_id === 'FND-M7-PRODUCT-GAP-001');
    const snapshotCopy = path.join(fixture.root, 'runs', cis.run_ref, productEntry.snapshot_path);
    const originalCopy = await readFile(snapshotCopy);
    await writeFile(snapshotCopy, `${originalCopy.toString('utf8')}\n漂移\n`);
    await assert.rejects(
      command(fixture.root, fixture.planPath, 'assess', 'decide', ['--decision', proceedPath]),
      (error) => JSON.parse(error.stderr).error === 'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
    );
    await writeFile(snapshotCopy, originalCopy);
    const livePath = path.join(fixture.root, 'cycles/m6/findings/fnd-m7-product-gap-001.md');
    const live = matter(await readFile(livePath, 'utf8'));
    live.data.title = 'Later live title drift';
    live.data.version = '1.0.1';
    await writeFile(livePath, matter.stringify(live.content, live.data, { lineWidth: -1 }));
    const flow = await fullStrategyFlowFromInvoked(fixture, invoked, proceedPath);
    assert.equal(flow.output.strategy_output_ref, 'STO-M7-CLI-DRAFT-001');
    const traced = await command(fixture.root, fixture.planPath, 'trace', 'workspace', [
      '--assessment', 'STA-M7-CLI-DECIDED-001',
    ]);
    assert.equal(traced.result, 'complete');
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

async function fullStrategyFlowFromInvoked(fixture, invoked, proceedPath) {
  await command(fixture.root, fixture.planPath, 'assess', 'decide', ['--decision', proceedPath]);
  const candidate = await command(fixture.root, fixture.planPath, 'propose-dimensions', 'create-candidate');
  const validationPath = await writeDimensionDecision(fixture.root, {
    priorRef: candidate.dimension_ref, priorPath: fixture.plan.dimension_candidate.path,
    priorSha: candidate.dimension_file_sha256, snapshotVersion: candidate.strategy_snapshot_version,
    targetId: 'DDM-M7-CLI-VALIDATED-001', targetPath: 'strategy/dimensions/ddm-m7-cli-validated-001.md',
    status: 'validated', decision: {
      decided_by: 'Fixture Dimension Reviewer', decided_at: '2026-08-27T00:01:00Z',
      decision_ref: 'fixture://decision/m7-cli-validation-001', verdict: 'validated', reason: '冻结证据支持。',
    },
  });
  const validated = await command(fixture.root, fixture.planPath, 'propose-dimensions', 'advance', ['--decision', validationPath]);
  const factorPath = await writeDimensionDecision(fixture.root, {
    priorRef: validated.dimension_ref, priorPath: 'strategy/dimensions/ddm-m7-cli-validated-001.md',
    priorSha: validated.dimension_file_sha256, snapshotVersion: validated.strategy_snapshot_version,
    targetId: 'DDM-M7-CLI-FACTOR-001', targetPath: 'strategy/dimensions/ddm-m7-cli-factor-001.md',
    status: 'decision_factor', decision: {
      decided_by: 'Fixture Factor Reviewer', decided_at: '2026-08-27T00:02:00Z',
      decision_ref: 'fixture://decision/m7-cli-factor-001', verdict: 'promoted', reason: '冻结观察支持因素。',
    },
  });
  await command(fixture.root, fixture.planPath, 'propose-dimensions', 'advance', ['--decision', factorPath]);
  return { invoked, output: await command(fixture.root, fixture.planPath, 'assemble-output', 'assemble') };
}

test('real MyyShop workspace 继续保持 zero-write', async () => {
  const fixture = await createStrategyCliWorkspace();
  try {
    await assert.rejects(
      command(path.resolve('workspaces/myyshop'), fixture.planPath, 'assess', 'invoke'),
      (error) => JSON.parse(error.stderr).error === 'REAL_WORKSPACE_WRITE_FORBIDDEN',
    );
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('plan 内嵌 eligibility/object 自报结果必须在写入前拒绝', async () => {
  const fixture = await createStrategyCliWorkspace();
  try {
    const plan = { ...fixture.plan, eligibility_result: 'eligible' };
    const forgedPlan = await writeJson(
      fixture.root, 'fixtures/m7-cli/forged-plan.json', plan,
    );
    await assert.rejects(
      command(fixture.root, forgedPlan, 'assess', 'invoke'),
      (error) => JSON.parse(error.stderr).error
        === 'STRATEGY_ELIGIBILITY_SELF_REPORT_FORBIDDEN',
    );
    await assert.rejects(
      access(path.join(fixture.root, 'runs/RUN-M7-CLI-STRATEGY-001/run.md')),
      (error) => error.code === 'ENOENT',
    );
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});
