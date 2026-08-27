import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import {
  buildCandidateBatchPlan,
} from '../../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs';
import {
  buildDecidedGoalSelection,
  buildDraftGoalSelection,
} from '../../plugins/geo-expert/scripts/lib/cycle-goal-selection.mjs';
import {
  strategyArtifactFingerprint,
} from '../../plugins/geo-expert/scripts/lib/strategy-output.mjs';
import { sha256, stableStringify } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { createM7CandidateReadyCycleOneWorkspace } from './m7-cycle1-review-fixtures.mjs';
import {
  M6_MERCHANT_ID,
  M6_NOW,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  m6SchemaSamples,
  seedM6FreezeInputs,
  writeM6Object,
} from './m6-fixtures.mjs';
import {
  M7_FIXTURE_ROOT,
  candidateDescriptor,
  decisionDimensionMatrix,
  readM7Fixture,
  strategyAssessmentData,
  strategyOutputData,
} from './m7-fixtures.mjs';

const exec = promisify(execFile);
const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(THIS_DIR, '..', '..');
export const STRATEGY_CLI = path.join(
  REPO_ROOT,
  'plugins/geo-expert/scripts/geo-strategy-discovery.mjs',
);
export const LIFECYCLE_CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-lifecycle.mjs');
export const ANALYTICS_CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-analytics.mjs');
export const STRATEGY_SKILL = path.join(
  REPO_ROOT,
  'plugins/geo-expert/skills/geo-strategy-discovery/SKILL.md',
);

export const M7_CONTEXT = Object.freeze({
  merchant_ref: M6_MERCHANT_ID,
  test_scope: { ...M6_TEST_SCOPE },
  created_at: M6_NOW,
  run_ref: 'RUN-M7-CANDIDATES-001',
  review_ref: 'CRV-M6-CYCLE-ONE-DECIDED-001',
  review_version: '1.0.0',
  review_file_sha256: 'f'.repeat(64),
  review_input_snapshot_version: { ref: 'CIS-M7-REVIEW-001', version: '1.0.0' },
  review_snapshot_fingerprint: 'e'.repeat(64),
  generator_rule: {
    id: 'm7-cycle-goal-candidate-test-v1',
    version: '1.0.0',
    artifact_path: 'outputs/contracts/m7-candidate-generator-rule.json',
    sha256: '6'.repeat(64),
  },
});

export function fixturePath(relative) {
  return path.join(M7_FIXTURE_ROOT, ...relative.split('/'));
}

export async function readFixtureJson(relative) {
  return JSON.parse(await readFile(fixturePath(relative), 'utf8'));
}

export async function writeJson(root, relative, value) {
  const target = path.join(root, ...relative.split('/'));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
  return target;
}

export async function runNode(script, args, {
  cwd = os.tmpdir(),
  env = {},
} = {}) {
  return exec(process.execPath, [script, ...args], {
    cwd,
    env: {
      ...process.env,
      GEO_M6_NETWORK_DISABLED: '1',
      GEO_M7_NETWORK_DISABLED: '1',
      ...env,
    },
  });
}

export async function createM7Workspace() {
  const root = await createM6FixtureWorkspace();
  await seedM6FreezeInputs(root);
  const runVersions = { [M6_MERCHANT_ID]: '1.0.0' };
  await writeM6Object(root, 'runs/RUN-M7-STRATEGY-001/run.md', {
    id: 'RUN-M7-STRATEGY-001', record_type: 'run', status: 'running', version: '1.0.0',
    created_at: M6_NOW, updated_at: M6_NOW, title: 'Synthetic M7 Strategy Run',
    test_scope: { ...M6_TEST_SCOPE },
    skill: 'geo-strategy-discovery', skill_version: '1.0.0',
    input_refs: [M6_MERCHANT_ID], input_versions: runVersions,
    input_fingerprint: sha256(stableStringify(runVersions)),
    completed_steps: [], output_artifacts: [], business_result: 'not_evaluated',
    next_action: 'Materialize synthetic Strategy Output.',
  });
  const cis = {
    ...m6SchemaSamples().cycle_input_snapshot,
    id: 'CIS-M7-STRATEGY-001',
    title: 'Synthetic M7 strategy snapshot',
    snapshot_kind: 'strategy',
    run_ref: 'RUN-M7-STRATEGY-001',
  };
  await writeM6Object(root, 'cycles/m7/snapshots/cis-m7-strategy-001.md', cis);
  const waitingReview = {
    ...m6SchemaSamples().cycle_review,
    id: 'CRV-M7-CYCLE-ONE-WAITING-001',
    title: 'Synthetic waiting Cycle 1 Review',
    review_input_snapshot_version: { ref: cis.id, version: cis.version },
  };
  await writeM6Object(root, 'cycles/m7/reviews/crv-m7-cycle-one-waiting-001.md', waitingReview);
  const review = {
    ...waitingReview,
    id: 'CRV-M7-CYCLE-ONE-DECIDED-001',
    status: 'decided',
    title: 'Synthetic decided Cycle 1 Review',
    approval: {
      approved_by: 'Fixture Cycle Reviewer', approved_at: M6_NOW,
      decision_ref: 'fixture://decision/m7-cycle-one-review-001',
    },
    supersedes_ref: waitingReview.id,
  };
  await writeM6Object(root, 'cycles/m7/reviews/crv-m7-cycle-one-decided-001.md', review);
  const gates = buildStrategyGateObjects();
  await writeM6Object(root, 'strategy/assessments/sta-m7-waiting-001.md', gates.waiting);
  await writeM6Object(root, 'strategy/assessments/sta-m7-decided-001.md', gates.assessment);
  await writeM6Object(root, 'strategy/dimensions/ddm-m7-validated-001.md', decisionDimensionMatrix().validated);
  await writeM6Object(root, 'strategy/dimensions/ddm-m7-factor-001.md', gates.dimension);
  return root;
}

export async function materializeCycle2SourceInputs(root, plan) {
  for (const file of plan.workspace_files ?? []) {
    if (sha256(file.content) !== file.sha256) throw new Error(`fixture checksum mismatch: ${file.path}`);
    await writeJsonText(root, file.path, file.content);
  }
  for (const object of plan.source_objects ?? []) {
    await writeM6Object(root, object.path, object.data, `# ${object.data.title}\n`);
  }
  return {
    source_paths: [...plan.source_paths],
    artifact_paths: [...plan.artifact_paths],
    object_ids: plan.source_objects.map((item) => item.data.id),
  };
}

async function writeJsonText(root, relative, content) {
  const target = path.join(root, ...relative.split('/'));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
  return target;
}

export async function createCycle2InputWorkspace() {
  const root = await createM6FixtureWorkspace();
  await seedM6FreezeInputs(root);
  const plan = await readFixtureJson('plans/cycle-2-e2e.json');
  await materializeCycle2SourceInputs(root, plan);
  return { root, plan };
}

export function buildProductCandidateBundle() {
  const descriptor = candidateDescriptor({ candidateKind: 'product_gap' });
  const { batch, candidates } = buildCandidateBatchPlan({
    context: M7_CONTEXT,
    descriptors: [descriptor],
  });
  const selection = buildDraftGoalSelection({
    context: M7_CONTEXT,
    batch,
    candidates,
  });
  return { descriptor, batch, candidate: candidates[0], candidates, selection };
}

export function bindCycle2PlanWithActualSelection(plan) {
  const bundle = buildProductCandidateBundle();
  const selection = buildDecidedGoalSelection({
    context: M7_CONTEXT,
    draft: bundle.selection,
    selected: { ref: bundle.candidate.id, version: bundle.candidate.version },
    rejected: [],
    deferred: [],
    reason: 'Fixture human selected the actual hash-derived Product Gap candidate.',
    approval: {
      approved_by: 'Fixture Cycle Reviewer', approved_at: M6_NOW,
      decision_ref: 'fixture://decision/m7-goal-selection-actual-001',
    },
  });
  return {
    plan: {
      ...structuredClone(plan),
      predecessor_review_version: { ref: 'CRV-M7-CYCLE-ONE-DECIDED-001', version: '1.0.0' },
      goal_selection_version: { ref: selection.id, version: selection.version },
      selected_candidate_version: { ref: bundle.candidate.id, version: bundle.candidate.version },
    },
    ...bundle,
    decidedSelection: selection,
  };
}

export function buildOrdinaryCandidateBundle() {
  const descriptor = candidateDescriptor({ candidateKind: 'query_cluster' });
  const { batch, candidates } = buildCandidateBatchPlan({
    context: M7_CONTEXT,
    descriptors: [descriptor],
  });
  return { descriptor, batch, candidate: candidates[0], candidates };
}

export function buildStrategyGateObjects() {
  const waiting = strategyAssessmentData();
  const assessment = strategyAssessmentData({
    id: 'STA-M7-DECIDED-001',
    status: 'decided',
    decision: 'proceed',
    approval: {
      approved_by: 'Fixture Strategy Reviewer',
      approved_at: M6_NOW,
      decision_ref: 'fixture://decision/m7-strategy-proceed-fresh-001',
    },
    supersedesRef: waiting.id,
  });
  return {
    waiting,
    assessment,
    dimension: decisionDimensionMatrix().factor,
    output: strategyOutputData(),
  };
}

export async function buildValidStrategyOutput() {
  const artifactContents = new Map();
  for (const [role, relative] of [
    ['opportunity_analysis', 'outputs/opportunity-analysis.md'],
    ['prd_draft', 'outputs/prd-draft.md'],
    ['human_validation_plan', 'outputs/human-validation-plan.md'],
  ]) artifactContents.set(role, await readM7Fixture(relative));
  const body = '# 测试商户战略建议\n\nSynthetic fixture only.\n';
  const base = strategyOutputData();
  const data = strategyOutputData({
    artifacts: base.artifacts.map((artifact) => ({
      ...artifact,
      sha256: sha256(artifactContents.get(artifact.role)),
    })),
    body_sha256: sha256(body),
  });
  data.artifact_manifest_fingerprint = strategyArtifactFingerprint(data.artifacts);
  return { data, body, artifactContents };
}

export async function readHumanDecisions() {
  return Promise.all([
    readFixtureJson('decisions/strategy-proceed.json'),
    readFixtureJson('decisions/dimension-factor.json'),
    readFixtureJson('decisions/goal-selection.json'),
  ]);
}

export async function createCycleOneHandoffWorkspace() {
  const fixture = await createM7CandidateReadyCycleOneWorkspace();
  const cycle2Plan = await readFixtureJson('plans/cycle-2-e2e.json');
  return {
    ...fixture,
    cycle2Plan,
    decisions: await readHumanDecisions(),
  };
}
