import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  computeBusinessSignal,
  ingestFixtureObservation,
} from '../../plugins/geo-expert/scripts/lib/analytics-cycle.mjs';
import {
  assembleCycleReview,
  decideCycleReview,
} from '../../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import { sha256 } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  M6_APPROVAL,
  M6_TEST_SCOPE,
} from './m6-fixtures.mjs';

async function descriptor(root, spec) {
  return {
    ...spec,
    sha256: sha256(await readFile(path.join(root, ...spec.path.split('/')))),
  };
}

export async function materializeM6OutputGateFixtures(root, bundle, { includeReview = true } = {}) {
  const observationPlan = {
    schema_version: 'm6-analytics-observation-plan/1.0.0',
    observation: bundle.analytics.observation,
    merchant_ref: bundle.create_cycle.merchant_ref,
    cycle_ref: bundle.create_cycle.cycle_id,
    goal_ref: bundle.create_cycle.goal_ref,
    run_ref: 'RUN-M6-ANALYTICS-E2E-001',
    adapter: {
      kind: 'fixture', name: 'm6-fixture', version: '1.0.0', access_mode: 'fixture',
      authorization_ref: 'fixture://authorization/m6-e2e-output-fixture',
    },
    input_path: bundle.analytics.observation.input_path,
    raw_output_path: bundle.analytics.observation.raw_output_path,
    measurement_contract_path: 'execution/contracts/measurement-contract.json',
    signal_rule_path: 'execution/contracts/signal-rule.json',
    sensitive_data_policy_path: 'execution/contracts/sensitive-data-policy.json',
    test_scope: { ...M6_TEST_SCOPE },
  };
  await ingestFixtureObservation({ workspace: root, plan: observationPlan });
  await computeBusinessSignal({
    workspace: root,
    plan: {
      schema_version: 'm6-business-signal-plan/1.0.0',
      signal: bundle.analytics.signal,
      merchant_ref: bundle.create_cycle.merchant_ref,
      cycle_ref: bundle.create_cycle.cycle_id,
      goal_ref: bundle.create_cycle.goal_ref,
      run_ref: 'RUN-M6-ANALYTICS-E2E-001',
      observation_versions: [{ ref: bundle.analytics.observation.id, version: '1.0.0' }],
      measurement_contract_path: 'execution/contracts/measurement-contract.json',
      rule_path: 'execution/contracts/signal-rule.json',
      test_scope: { ...M6_TEST_SCOPE },
    },
  });

  const analytics = await Promise.all(
    bundle.gates.find((gate) => gate.name === 'analytics').object_specs
      .map((spec) => descriptor(root, spec)),
  );
  if (!includeReview) return { byGate: { analytics } };

  const goalEntryKey = 'a'.repeat(64);
  const reviewPlan = {
    schema_version: 'm6-cycle-review-plan/1.0.0',
    merchant_ref: bundle.create_cycle.merchant_ref,
    cycle_ref: bundle.create_cycle.cycle_id,
    reviewed_cycle_input_version: '1.0.7',
    review_snapshot: {
      id: bundle.review.snapshot_id,
      base_freeze_snapshot_version: { ref: bundle.create_cycle.snapshot_id, version: '1.0.0' },
      pre_review_transition_snapshot_versions: [{ ref: 'CIS-M6-E2E-ANALYTICS-001', version: '1.0.0' }],
      pre_review_entry_keys: ['b'.repeat(64)],
      source_paths: [
        'cycles/preparation/test-merchant.md',
        'cycles/preparation/goal.md',
        bundle.analytics.observation.path,
        bundle.analytics.signal.path,
      ],
      artifact_paths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    },
    waiting_review: { id: bundle.review.waiting_id, path: bundle.review.waiting_path },
    goal_results: [{
      goal_entry_key: goalEntryKey,
      perception_goal: 'inconclusive',
      observations: ['Synthetic output gate fixture.'],
      business_signal_entry_keys: ['c'.repeat(64)],
      limitations: ['Synthetic fixture only.'],
      forbidden_conclusions: ['No causal or real MyyShop conclusion.'],
    }],
    next_cycle_candidate_inputs: [],
    test_scope: { ...M6_TEST_SCOPE },
  };
  await assembleCycleReview({ workspace: root, plan: reviewPlan });
  await decideCycleReview({
    workspace: root,
    decision: {
      waiting_review_ref: bundle.review.waiting_id,
      decided_review: { id: bundle.review.decided_id, path: bundle.review.decided_path },
      approval: { ...M6_APPROVAL, decision_ref: bundle.review.decision_ref },
      goal_results: reviewPlan.goal_results,
      test_scope: { ...M6_TEST_SCOPE },
    },
  });

  const specs = Object.fromEntries(bundle.gates.slice(6).map((gate) => [gate.name, gate.object_specs]));
  return {
    byGate: {
      analytics,
      review_waiting: await Promise.all(specs.review_waiting.map((spec) => descriptor(root, spec))),
      review_decided: await Promise.all(specs.review_decided.map((spec) => descriptor(root, spec))),
    },
  };
}
