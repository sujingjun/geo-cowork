import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { sha256 } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { createM7CandidateReadyCycleOneWorkspace } from './m7-cycle1-review-fixtures.mjs';
import { M6_NOW, writeM6Object } from './m6-fixtures.mjs';
import { STRATEGY_CLI, runNode } from './m7-cycle2-fixtures.mjs';

export async function writeJson(root, relative, value) {
  const target = path.join(root, ...relative.split('/'));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
  return target;
}

async function cloneReview(root, sourcePath, targetPath, id, sampleRef) {
  const source = matter(await readFile(path.join(root, sourcePath), 'utf8')).data;
  await writeM6Object(root, targetPath, {
    ...source,
    id,
    title: `Synthetic reviewed dimension ${id}`,
    sample_ref: sampleRef,
    updated_at: M6_NOW,
    exploratory: {
      ...source.exploratory,
      decision_dimension_candidates: ['Pricing clarity'],
    },
  });
}

export async function createStrategyCliWorkspace() {
  const fixture = await createM7CandidateReadyCycleOneWorkspace();
  const root = fixture.root;
  const secondSample = matter(await readFile(
    path.join(root, 'cycles/m6/answers/smp-m6-base-s2-001.md'),
    'utf8',
  )).data;
  await writeM6Object(root, 'strategy/inputs/smp-m7-claude-001.md', {
    ...secondSample,
    id: 'SMP-M7-CLAUDE-001',
    title: 'Synthetic Claude strategy sample',
    platform: 'claude',
    updated_at: M6_NOW,
  });
  await cloneReview(
    root,
    'cycles/m6/reviews/arv-m6-base-s1-001.md',
    'strategy/inputs/arv-m7-pricing-s1.md',
    'ARV-M7-PRICING-S1-001',
    'SMP-M6-BASE-S1-001',
  );
  await cloneReview(
    root,
    'cycles/m6/reviews/arv-m6-base-s2-001.md',
    'strategy/inputs/arv-m7-pricing-s2.md',
    'ARV-M7-PRICING-S2-001',
    'SMP-M7-CLAUDE-001',
  );
  const content = matter(await readFile(
    path.join(root, 'cycles/m6/findings/fnd-m6-content-gap-001.md'),
    'utf8',
  )).data;
  await writeM6Object(root, 'strategy/inputs/fnd-m7-evidence-gap-001.md', {
    ...content,
    id: 'FND-M7-EVIDENCE-GAP-001',
    title: 'Synthetic evidence gap for strategy eligibility',
    diagnosis_class: 'evidence_gap',
    updated_at: M6_NOW,
    approval: {
      approved_by: 'Fixture Strategy Reviewer',
      approved_at: M6_NOW,
      decision_ref: 'fixture://decision/m7-evidence-gap-001',
    },
  });
  const rule = {
    schema_version: 'm7-strategy-eligibility-rule/1.0.0',
    id: 'm7-strategy-eligibility-test-v1',
    version: '1.0.0',
    scope: 'Synthetic pricing clarity.',
    real_execution_authorized: false,
  };
  await writeJson(root, 'fixtures/m7-cli/eligibility-rule.json', rule);
  const candidateRule = {
    schema_version: 'm7-cycle-goal-candidate-rule/1.0.0',
    id: 'm7-cycle-goal-candidate-test-v1',
    version: '1.0.0',
    kind_order: {
      query_cluster: 1, content_gap: 2, evidence_gap: 3,
      severe_misperception: 4, recommendation_reason: 5, product_gap: 6,
    },
    sort: [
      'priority_ascending', 'kind_order_ascending',
      'candidate_content_key_ascii_ascending',
    ],
    derived_fields: {
      rationale_template: 'Cycle Review froze a {candidate_kind} input with approved source tuples.',
      limitations: [
        'Synthetic test-only evidence; no real product or business conclusion.',
      ],
    },
    hidden_score: false,
    real_execution_authorized: false,
  };
  await writeJson(root, 'fixtures/m7-cli/candidate-generator-rule.json', candidateRule);
  for (const [name, text] of [
    ['body.md', '# 测试商户战略建议\n\n仅用于 synthetic/test_only 工程验证。\n'],
    ['opportunity.md', '# 机会分析\n\n测试商户定价清晰度机会。\n'],
    ['prd-draft.md', '# PRD 草案\n\n未批准，仅用于测试。\n'],
    ['validation-plan.md', '# 人工验证计划\n\n必须由人工独立复核。\n'],
  ]) {
    const target = path.join(root, 'fixtures/m7-cli', name);
    await writeFile(target, text);
  }
  const productBytes = await readFile(
    path.join(root, 'cycles/m6/findings/fnd-m7-product-gap-001.md'),
  );
  const reviewBytes = await readFile(
    path.join(root, 'cycles/m7/reviews/crv-m7-cycle-one-decided-001.md'),
  );
  const invocation = {
    schema_version: 'm7-fixture-human-decision/1.0.0',
    decision_kind: 'strategy_invocation',
    cycle_review_version: {
      ref: fixture.decided.id,
      version: fixture.decided.version,
      file_sha256: sha256(reviewBytes),
    },
    human_invocation: {
      decision_ref: 'fixture://decision/m7-cli-invocation-001',
      invoked_by: 'Fixture Strategy Reviewer',
      invoked_at: M6_NOW,
      requested_scope: 'Synthetic pricing clarity.',
    },
    conversation_history_used: false,
    fresh_process_required: true,
    real_execution_authorized: false,
  };
  await writeJson(root, 'fixtures/m7-cli/invocation.json', invocation);
  const sourcePaths = [
    'cycles/m6/cycle.md',
    'cycles/m7/reviews/crv-m7-cycle-one-decided-001.md',
    'queries/formal/query.md',
    'cycles/m6/answers/smp-m6-base-s1-001.md',
    'strategy/inputs/smp-m7-claude-001.md',
    'strategy/inputs/arv-m7-pricing-s1.md',
    'strategy/inputs/arv-m7-pricing-s2.md',
    'evidence/records/evd-m7-user-demand-001.md',
    'evidence/records/evd-m7-capability-gap-001.md',
    'cycles/m6/findings/fnd-m6-content-gap-001.md',
    'strategy/inputs/fnd-m7-evidence-gap-001.md',
    'cycles/m6/findings/fnd-m7-product-gap-001.md',
  ];
  const plan = {
    schema_version: 'm7-strategy-workflow-plan/1.0.0',
    workspace_scope: 'test_only',
    merchant_ref: 'TMT-M6-TEST-001',
    commands: ['assess', 'propose-dimensions', 'assemble-output', 'trace'],
    network_access: false,
    real_execution_authorized: false,
    invoke: {
      decision_path: 'fixtures/m7-cli/invocation.json',
      cycle_path: 'cycles/m6/cycle.md',
      review_path: 'cycles/m7/reviews/crv-m7-cycle-one-decided-001.md',
      run_ref: 'RUN-M7-CLI-STRATEGY-001',
      snapshot_ref: 'CIS-M7-CLI-STRATEGY-001',
      source_paths: sourcePaths,
      eligibility_rule_path: 'fixtures/m7-cli/eligibility-rule.json',
      candidate_generator_rule_path: 'fixtures/m7-cli/candidate-generator-rule.json',
      waiting: {
        id: 'STA-M7-CLI-WAITING-001',
        path: 'strategy/assessments/sta-m7-cli-waiting-001.md',
      },
    },
    dimension_candidate: {
      id: 'DDM-M7-CLI-CANDIDATE-001',
      path: 'strategy/dimensions/ddm-m7-cli-candidate-001.md',
      assessment_ref: 'STA-M7-CLI-DECIDED-001',
      assessment_path: 'strategy/assessments/sta-m7-cli-decided-001.md',
      definition: '判断测试商户定价信息能否支持比较与推荐。',
    },
    output: {
      id: 'STO-M7-CLI-DRAFT-001',
      path: 'strategy/outputs/sto-m7-cli-draft-001.md',
      assessment_ref: 'STA-M7-CLI-DECIDED-001',
      assessment_path: 'strategy/assessments/sta-m7-cli-decided-001.md',
      dimension_refs: ['DDM-M7-CLI-FACTOR-001'],
      dimension_paths: ['strategy/dimensions/ddm-m7-cli-factor-001.md'],
      body_path: 'fixtures/m7-cli/body.md',
      artifacts: [
        { role: 'opportunity_analysis', source_path: 'fixtures/m7-cli/opportunity.md', path: 'outputs/opportunity.md' },
        { role: 'prd_draft', source_path: 'fixtures/m7-cli/prd-draft.md', path: 'outputs/prd-draft.md' },
        { role: 'human_validation_plan', source_path: 'fixtures/m7-cli/validation-plan.md', path: 'outputs/validation-plan.md' },
      ],
      opportunity_statement: '验证测试商户定价清晰度是否构成产品机会。',
      limitations: ['仅限 synthetic/test_only，不构成真实产品结论。'],
      validation_plan_contract: {
        hypothesis: '定价清晰度可能影响测试商户的比较与推荐。',
        required_evidence: ['两条独立的用户兴趣观察。'],
        method: '由新上下文人工复核测试材料。',
        result_criteria: {
          success: '独立证据支持该维度。',
          fail: '独立证据否定该维度。',
          inconclusive: '证据不足。',
        },
        owner: 'Fixture Product Reviewer',
        stop_conditions: ['请求真实数据、账号或外部写入时立即停止。'],
        real_execution_authorized: false,
        auto_approval: false,
      },
    },
  };
  const planPath = await writeJson(root, 'fixtures/m7-cli/plan.json', plan);
  return { ...fixture, root, plan, planPath, invocation, productSha: sha256(productBytes) };
}

export async function writeProceedDecision(root, output) {
  return writeJson(root, 'fixtures/m7-cli/proceed.json', {
    schema_version: 'm7-fixture-human-decision/1.0.0',
    decision_kind: 'strategy_assessment',
    subject_version: {
      ref: output.assessment_ref,
      version: '1.0.0',
      file_sha256: output.assessment_file_sha256,
    },
    strategy_snapshot_version: output.strategy_snapshot_version,
    target: {
      id: 'STA-M7-CLI-DECIDED-001',
      path: 'strategy/assessments/sta-m7-cli-decided-001.md',
    },
    decision: 'proceed',
    approval: {
      approved_by: 'Fixture Strategy Reviewer',
      approved_at: M6_NOW,
      decision_ref: 'fixture://decision/m7-cli-proceed-001',
    },
    conversation_history_used: false,
    fresh_process_required: true,
    real_execution_authorized: false,
  });
}

export async function writeDimensionDecision(root, {
  priorRef, priorPath, priorSha, snapshotVersion, targetId, targetPath, status, decision,
}) {
  return writeJson(root, `fixtures/m7-cli/${targetId.toLowerCase()}.json`, {
    schema_version: 'm7-fixture-human-decision/1.0.0',
    decision_kind: 'decision_dimension_transition',
    subject_version: { ref: priorRef, version: '1.0.0', file_sha256: priorSha },
    subject_path: priorPath,
    strategy_snapshot_version: snapshotVersion,
    target: { id: targetId, path: targetPath, status },
    decision,
    conversation_history_used: false,
    fresh_process_required: true,
    real_execution_authorized: false,
  });
}

async function strategyCommand(root, planPath, command, phase, extra = []) {
  const result = await runNode(STRATEGY_CLI, [
    command, '--workspace', root, '--plan', planPath, '--phase', phase, ...extra,
  ]);
  return JSON.parse(result.stdout);
}

export async function materializeFullStrategyFlow(fixture) {
  const invoked = await strategyCommand(fixture.root, fixture.planPath, 'assess', 'invoke');
  const proceedPath = await writeProceedDecision(fixture.root, invoked);
  const decided = await strategyCommand(
    fixture.root, fixture.planPath, 'assess', 'decide', ['--decision', proceedPath],
  );
  const candidate = await strategyCommand(
    fixture.root, fixture.planPath, 'propose-dimensions', 'create-candidate',
  );
  const validationPath = await writeDimensionDecision(fixture.root, {
    priorRef: candidate.dimension_ref,
    priorPath: fixture.plan.dimension_candidate.path,
    priorSha: candidate.dimension_file_sha256,
    snapshotVersion: candidate.strategy_snapshot_version,
    targetId: 'DDM-M7-CLI-VALIDATED-001',
    targetPath: 'strategy/dimensions/ddm-m7-cli-validated-001.md',
    status: 'validated',
    decision: {
      decided_by: 'Fixture Dimension Reviewer', decided_at: '2026-08-27T00:01:00Z',
      decision_ref: 'fixture://decision/m7-cli-validation-001', verdict: 'validated',
      reason: '两个已冻结的 reviewed observations 支持该维度。',
    },
  });
  const validated = await strategyCommand(
    fixture.root, fixture.planPath, 'propose-dimensions', 'advance',
    ['--decision', validationPath],
  );
  const factorPath = await writeDimensionDecision(fixture.root, {
    priorRef: validated.dimension_ref,
    priorPath: 'strategy/dimensions/ddm-m7-cli-validated-001.md',
    priorSha: validated.dimension_file_sha256,
    snapshotVersion: validated.strategy_snapshot_version,
    targetId: 'DDM-M7-CLI-FACTOR-001',
    targetPath: 'strategy/dimensions/ddm-m7-cli-factor-001.md',
    status: 'decision_factor',
    decision: {
      decided_by: 'Fixture Factor Reviewer', decided_at: '2026-08-27T00:02:00Z',
      decision_ref: 'fixture://decision/m7-cli-factor-001', verdict: 'promoted',
      reason: '该维度影响测试商户的比较与推荐。',
    },
  });
  const factor = await strategyCommand(
    fixture.root, fixture.planPath, 'propose-dimensions', 'advance',
    ['--decision', factorPath],
  );
  const output = await strategyCommand(
    fixture.root, fixture.planPath, 'assemble-output', 'assemble',
  );
  const versioned = (id, objectPath) => ({ id, ref: id, path: objectPath, version: '1.0.0' });
  return {
    invoked, decided, candidate, validated, factor, output,
    run_ref: invoked.run_ref,
    candidate_rule_path: `runs/${invoked.run_ref}/${invoked.rules.candidate_generator.path}`,
    candidate_rule_sha256: invoked.rules.candidate_generator.sha256,
    strategy_snapshot: {
      ...invoked.strategy_snapshot_version,
      id: invoked.strategy_snapshot_version.ref,
      path: `cycles/m6/snapshots/${invoked.strategy_snapshot_version.ref.toLowerCase()}.md`,
    },
    waiting_assessment: versioned(invoked.assessment_ref, invoked.assessment_path),
    decided_assessment: versioned(decided.assessment_ref, decided.assessment_path),
    candidate_dimension: versioned(candidate.dimension_ref, candidate.dimension_path),
    validated_dimension: versioned(validated.dimension_ref, validated.dimension_path),
    factor_dimension: versioned(factor.dimension_ref, factor.dimension_path),
    strategy_output: versioned(output.strategy_output_ref, output.strategy_output_path),
  };
}
