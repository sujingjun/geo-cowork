import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  QP_RULES,
  assemblePortfolioQuerySet,
  buildPortfolioReport,
  classifyIntent,
  clusterQueries,
  generateQueryIdentity,
  intakeQueryPortfolio,
  normalizeQueryText,
  prefreezeQuerySet,
  priorityForSourceClasses,
  reportQueryPortfolio,
  validateQueryPortfolioWorkspace,
} from '../plugins/geo-expert/scripts/lib/query-portfolio.mjs';
import { querySetContentSha } from '../plugins/geo-expert/scripts/lib/knowledge-query.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { NOW, query, source, temporaryWorkspace, writeObject } from './helpers/object-fixtures.mjs';
import {
  QP_APPROVAL,
  QP_GOAL_ID,
  QP_SOURCE_COMMUNITY_ID,
  QP_SOURCE_PLATFORM_ID,
} from './helpers/query-portfolio-fixtures.mjs';

const GOAL = {
  id: QP_GOAL_ID,
  record_type: 'perception_goal',
  status: 'approved',
  version: '1.0.0',
  created_at: NOW,
  updated_at: NOW,
  title: 'Unit test goal',
  goal_statement: '让生成式平台正确理解测试品牌。',
  success_question: '测试品牌是什么？',
  approval: { ...QP_APPROVAL },
};

const SOURCE_PLATFORM = source({
  id: QP_SOURCE_PLATFORM_ID,
  title: 'Unit test observation source',
  name: 'Unit test observation source',
  source_kind: 'generative_platform_observation',
  locator: 'https://qp-unit.invalid/observation',
});

const SOURCE_COMMUNITY = source({
  id: QP_SOURCE_COMMUNITY_ID,
  title: 'Unit test community source',
  name: 'Unit test community source',
  source_kind: 'community_expression',
  locator: 'https://qp-unit.invalid/community',
});

async function unitWorkspace() {
  const root = await temporaryWorkspace('geo-query-portfolio-unit-');
  await writeObject(root, 'cycles/preparation/goal.md', GOAL);
  await writeObject(root, 'evidence/sources/platform.md', SOURCE_PLATFORM);
  await writeObject(root, 'evidence/sources/community.md', SOURCE_COMMUNITY);
  return root;
}

function intakePlan(overrides = {}) {
  return {
    schema_version: 'qp-intake-plan/1.0.0',
    run_id: 'RUN-QP-UNIT-001',
    goal_ref: QP_GOAL_ID,
    sources: [
      {
        source_ref: QP_SOURCE_PLATFORM_ID,
        source_class: 'generative_platform_observation',
        observed_at: '2026-09-01T00:00:00Z',
        entries: [
          { query_text: 'What is QP Test Merchant?', language: 'en-US' },
        ],
      },
    ],
    ...overrides,
  };
}

test('qp-normalize-v1：NFKC、小写、空白折叠与首尾标点', () => {
  assert.equal(normalizeQueryText('  What is QP Test Merchant? '), 'what is qp test merchant');
  assert.equal(normalizeQueryText('ＱＰ测试商家是什么？'), 'qp测试商家是什么');
  assert.equal(normalizeQueryText('what   is x'), 'what is x');
  assert.equal(normalizeQueryText('what is x!!!'), 'what is x');
  assert.throws(() => normalizeQueryText('!!!'), (error) => error.code === 'QP_QUERY_TEXT_INVALID');
  assert.throws(() => normalizeQueryText('   '), (error) => error.code === 'QP_QUERY_TEXT_INVALID');
});

test('qp-intent-v1：固定顺序关键词判定', () => {
  assert.equal(classifyIntent('what is qp test merchant'), 'brand_definition');
  assert.equal(classifyIntent('who is qp test merchant'), 'brand_definition');
  assert.equal(classifyIntent('qp测试商家是什么'), 'brand_definition');
  assert.equal(classifyIntent('qp test merchant vs competitor'), 'comparison');
  assert.equal(classifyIntent('compare qp test merchant with others'), 'comparison');
  assert.equal(classifyIntent('qp test merchant 对比'), 'comparison');
  assert.equal(classifyIntent('best platform for creators'), 'recommendation');
  assert.equal(classifyIntent('should i use qp test merchant'), 'recommendation');
  assert.equal(classifyIntent('qp test merchant pricing'), 'pricing');
  assert.equal(classifyIntent('how much does qp test merchant cost'), 'pricing');
  assert.equal(classifyIntent('qp test merchant price'), 'pricing');
  assert.equal(classifyIntent('is qp test merchant legit'), 'reputation');
  assert.equal(classifyIntent('qp test merchant reviews'), 'reputation');
  assert.equal(classifyIntent('qp test merchant 靠谱吗'), 'reputation');
  assert.equal(classifyIntent('how to use qp test merchant'), 'capability');
  assert.equal(classifyIntent('does qp test merchant support export'), 'capability');
  assert.equal(classifyIntent('random unrelated text'), 'other');
  assert.equal(classifyIntent('what is the best price for x'), 'recommendation');
  assert.equal(classifyIntent('what is the price for x'), 'pricing');
});

test('qp-priority-v1：来源类别映射与最高优先级', () => {
  assert.equal(priorityForSourceClasses(['competitor_material']), 'P3');
  assert.equal(priorityForSourceClasses(['community_expression', 'first_party_user_data']), 'P1');
  assert.equal(
    priorityForSourceClasses(['community_expression', 'generative_platform_observation']),
    'P0',
  );
  assert.throws(() => priorityForSourceClasses(['made_up_class']), (error) => error.code === 'QP_SOURCE_REQUIRED');
});

test('qp-id-v1：确定性生成与区分度', () => {
  const first = generateQueryIdentity({ normalizedText: 'what is qp test merchant', language: 'en-US' });
  const repeated = generateQueryIdentity({ normalizedText: 'what is qp test merchant', language: 'en-US' });
  const second = generateQueryIdentity({
    normalizedText: 'what is qp test merchant platform',
    language: 'en-US',
  });
  const chinese = generateQueryIdentity({ normalizedText: 'qp测试商家是什么', language: 'zh-CN' });
  assert.deepEqual(first, repeated);
  assert.notEqual(first.id, second.id);
  assert.match(first.id, /^Q-WHAT-IS-QP-TEST-MERCHANT-EN-[0-9A-F]{4}$/);
  assert.match(chinese.id, /^Q-QP-ZH-[0-9A-F]{4}$/);
  assert.equal(chinese.path, `queries/candidates/${chinese.id.toLowerCase()}.md`);
});

test('qp-cluster-v1：意图桶内相似聚类、跨意图不合并、确定性', () => {
  const queries = [
    { data: { id: 'Q-A-EN-0001', language: 'en-US', intent: 'brand_definition', normalized_text: 'what is qp test merchant', priority: 'P0', status: 'candidate', version: '1.0.0' } },
    { data: { id: 'Q-B-EN-0002', language: 'en-US', intent: 'brand_definition', normalized_text: 'what is qp test merchant platform', priority: 'P1', status: 'formal', version: '1.0.0' } },
    { data: { id: 'Q-C-EN-0003', language: 'en-US', intent: 'reputation', normalized_text: 'is qp test merchant legit', priority: 'P0', status: 'candidate', version: '1.0.0' } },
    { data: { id: 'Q-D-ZH-0004', language: 'zh-CN', intent: 'brand_definition', normalized_text: 'qp测试商家是什么', priority: 'P0', status: 'candidate', version: '1.0.0' } },
    { data: { id: 'Q-E-ZH-0005', language: 'zh-CN', intent: 'brand_definition', normalized_text: 'qp测试商家是什么平台', priority: 'P0', status: 'candidate', version: '1.0.0' } },
  ];
  const clusters = clusterQueries(queries);
  assert.equal(clusters.length, 3);
  const definition = clusters.find((cluster) => cluster.intent === 'brand_definition' && cluster.language === 'en-US');
  assert.equal(definition.member_refs.length, 2);
  assert.equal(definition.representative_ref, 'Q-A-EN-0001');
  assert.equal(definition.suggested_priority, 'P0');
  assert.equal(definition.formal_count, 1);
  const reputation = clusters.find((cluster) => cluster.intent === 'reputation');
  assert.equal(reputation.member_refs.length, 1);
  const chinese = clusters.find((cluster) => cluster.language === 'zh-CN');
  assert.equal(chinese.member_refs.length, 2);
  assert.deepEqual(clusterQueries(queries), clusters);
  assert.deepEqual(clusterQueries([...queries].reverse()), clusters);
});

test('intake：生成 candidate、幂等 kept 与规则溯源', async () => {
  const root = await unitWorkspace();
  try {
    const first = await intakeQueryPortfolio({
      workspace: root,
      plan: intakePlan(),
      now: NOW,
    });
    assert.deepEqual(first.created, ['queries/candidates/'
      + first.queries[0].id.toLowerCase() + '.md']);
    assert.deepEqual(first.kept, []);
    assert.equal(first.duplicates.length, 0);
    const generated = first.queries[0];
    assert.equal(generated.normalized_text, 'what is qp test merchant');
    assert.equal(generated.intent, 'brand_definition');
    assert.equal(generated.priority, 'P0');
    assert.deepEqual(generated.source_classes, ['generative_platform_observation']);

    const text = await readFile(path.join(root, generated.path), 'utf8');
    assert.match(text, /^---\n/);
    assert.match(text, /record_type: query/);
    assert.match(text, /status: candidate/);
    const parsed = (await import('gray-matter')).default(text).data;
    assert.equal(parsed.id, generated.id);
    assert.deepEqual(parsed.goal_refs, [QP_GOAL_ID]);
    assert.deepEqual(parsed.discovery_source_refs, [QP_SOURCE_PLATFORM_ID]);
    assert.equal(parsed.extensions['geo.qp_intake'].rules.normalize, QP_RULES.normalize);
    assert.equal(parsed.approval, undefined);

    const repeated = await intakeQueryPortfolio({
      workspace: root,
      plan: intakePlan(),
      now: NOW,
    });
    assert.deepEqual(repeated.created, []);
    assert.deepEqual(repeated.kept, [generated.path]);
    assert.equal(repeated.duplicates.length, 0);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('intake：同源重复整体失败且无部分写入', async () => {
  const root = await unitWorkspace();
  try {
    const plan = intakePlan();
    plan.sources[0].entries.push({ query_text: 'What is QP Test Merchant', language: 'en-US' });
    await assert.rejects(
      intakeQueryPortfolio({ workspace: root, plan, now: NOW }),
      (error) => error.code === 'DUPLICATE_QUERY',
    );
    const graph = await loadWorkspaceGraph({ workspace: root });
    assert.equal(graph.objects.filter((object) => object.data.record_type === 'query').length, 0);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('intake：跨来源合并、多来源优先级与展示文本取字节序最小', async () => {
  const root = await unitWorkspace();
  try {
    const plan = intakePlan();
    plan.sources.push({
      source_ref: QP_SOURCE_COMMUNITY_ID,
      source_class: 'community_expression',
      observed_at: '2026-09-01T00:00:00Z',
      entries: [{ query_text: 'what is QP test merchant', language: 'en-US' }],
    });
    const result = await intakeQueryPortfolio({ workspace: root, plan, now: NOW });
    assert.equal(result.queries.length, 1);
    const generated = result.queries[0];
    assert.equal(generated.priority, 'P0');
    const graph = await loadWorkspaceGraph({ workspace: root });
    const created = graph.byId.get(generated.id);
    assert.deepEqual(created.data.discovery_source_refs, [QP_SOURCE_PLATFORM_ID, QP_SOURCE_COMMUNITY_ID]);
    assert.equal(created.data.query_text, 'What is QP Test Merchant?');
    assert.equal(created.data.extensions['geo.qp_intake'].sources.length, 2);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('intake：对既有活跃 Query 的重复观察跳过并报告', async () => {
  const root = await unitWorkspace();
  try {
    await writeObject(root, 'queries/formal/q-existing-001.md', query({
      id: 'Q-EXISTING-001',
      status: 'formal',
      title: 'Existing formal query',
      query_text: 'What is QP Test Merchant?',
      language: 'en-US',
      normalized_text: 'what is qp test merchant',
      intent: 'brand_definition',
      priority: 'P0',
      goal_refs: [QP_GOAL_ID],
      approval: { ...QP_APPROVAL },
    }));
    const result = await intakeQueryPortfolio({ workspace: root, plan: intakePlan(), now: NOW });
    assert.equal(result.queries.length, 0);
    assert.equal(result.duplicates.length, 1);
    assert.equal(result.duplicates[0].existing_ref, 'Q-EXISTING-001');
    assert.deepEqual(result.duplicates[0].source_refs, [QP_SOURCE_PLATFORM_ID]);
    const graph = await loadWorkspaceGraph({ workspace: root });
    assert.equal(graph.objects.filter((object) => object.data.record_type === 'query').length, 1);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('intake：计划合同负例', async () => {
  const root = await unitWorkspace();
  try {
    const cases = [
      [intakePlan({ schema_version: 'qp-intake-plan/0.9.0' }), 'QP_PLAN_INVALID'],
      [intakePlan({ run_id: 'X-1' }), 'QP_PLAN_INVALID'],
      [intakePlan({ goal_ref: 'GOAL-MISSING-001' }), 'BROKEN_REF'],
      [intakePlan({ goal_ref: QP_SOURCE_PLATFORM_ID }), 'REF_TYPE_MISMATCH'],
      [intakePlan({ sources: [] }), 'QP_PLAN_INVALID'],
      [intakePlan({
        sources: [{
          source_ref: QP_SOURCE_PLATFORM_ID,
          source_class: 'not_a_class',
          observed_at: '2026-09-01T00:00:00Z',
          entries: [{ query_text: 'a', language: 'en-US' }],
        }],
      }), 'QP_PLAN_INVALID'],
      [intakePlan({
        sources: [{
          source_ref: QP_SOURCE_PLATFORM_ID,
          source_class: 'generative_platform_observation',
          observed_at: 'not-a-date',
          entries: [{ query_text: 'a', language: 'en-US' }],
        }],
      }), 'QP_PLAN_INVALID'],
      [intakePlan({
        sources: [{
          source_ref: QP_SOURCE_PLATFORM_ID,
          source_class: 'generative_platform_observation',
          observed_at: '2026-09-01T00:00:00Z',
          entries: [{ query_text: '', language: 'en-US' }],
        }],
      }), 'QP_QUERY_TEXT_INVALID'],
      [intakePlan({
        sources: [{
          source_ref: QP_SOURCE_PLATFORM_ID,
          source_class: 'generative_platform_observation',
          observed_at: '2026-09-01T00:00:00Z',
          entries: [{ query_text: 'what is x', language: 'e' }],
        }],
      }), 'QP_PLAN_INVALID'],
    ];
    for (const [plan, code] of cases) {
      await assert.rejects(
        intakeQueryPortfolio({ workspace: root, plan, now: NOW }),
        (error) => error.code === code,
      );
    }
    const staleSource = source({
      id: 'SRC-QP-STALE-001',
      status: 'stale',
      title: 'Stale source',
      name: 'Stale source',
      locator: 'https://qp-unit.invalid/stale',
    });
    await writeObject(root, 'evidence/sources/stale.md', staleSource);
    await assert.rejects(
      intakeQueryPortfolio({
        workspace: root,
        plan: intakePlan({
          sources: [{
            source_ref: 'SRC-QP-STALE-001',
            source_class: 'generative_platform_observation',
            observed_at: '2026-09-01T00:00:00Z',
            entries: [{ query_text: 'what is x', language: 'en-US' }],
          }],
        }),
        now: NOW,
      }),
      (error) => error.code === 'QP_SOURCE_REQUIRED',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

async function formalWorkspace() {
  const root = await unitWorkspace();
  const intake = await intakeQueryPortfolio({
    workspace: root,
    plan: intakePlan(),
    now: NOW,
  });
  const generated = intake.queries[0];
  const graph = await loadWorkspaceGraph({ workspace: root });
  const object = graph.byId.get(generated.id);
  const promoted = {
    ...object.data,
    status: 'formal',
    approval: { ...QP_APPROVAL },
  };
  await (await import('node:fs/promises')).writeFile(
    path.join(root, generated.path),
    serializeMarkdownObject(promoted, `# ${promoted.title}\n`),
  );
  return { root, query: promoted };
}

test('assemble：draft 组装与 content_sha256 预览', async () => {
  const { root, query } = await formalWorkspace();
  try {
    const plan = {
      schema_version: 'qp-assemble-plan/1.0.0',
      id: 'QS-QP-UNIT-001',
      path: 'queries/sets/qs-qp-unit-001.md',
      title: 'Unit test query set',
      goal_refs: [QP_GOAL_ID],
      query_versions: [{ ref: query.id, version: query.version }],
    };
    const result = await assemblePortfolioQuerySet({ workspace: root, plan, now: NOW });
    assert.deepEqual(result.created, ['queries/sets/qs-qp-unit-001.md']);
    assert.equal(result.data.status, 'draft');
    assert.equal(result.data.approval, undefined);
    assert.equal(result.data.frozen_at, undefined);
    assert.equal(
      result.content_sha256_preview,
      querySetContentSha([{
        ref: query.id,
        version: query.version,
        query_text: query.query_text,
        language: query.language,
      }]),
    );
    const repeated = await assemblePortfolioQuerySet({ workspace: root, plan, now: NOW });
    assert.deepEqual(repeated.created, []);
    assert.deepEqual(repeated.kept, ['queries/sets/qs-qp-unit-001.md']);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('assemble：版本漂移、重复 ref 与非法计划', async () => {
  const { root, query } = await formalWorkspace();
  try {
    await assert.rejects(
      assemblePortfolioQuerySet({
        workspace: root,
        plan: {
          schema_version: 'qp-assemble-plan/1.0.0',
          id: 'QS-QP-UNIT-002',
          path: 'queries/sets/qs-qp-unit-002.md',
          goal_refs: [QP_GOAL_ID],
          query_versions: [{ ref: query.id, version: '9.9.9' }],
        },
        now: NOW,
      }),
      (error) => error.code === 'VERSION_DRIFT',
    );
    await assert.rejects(
      assemblePortfolioQuerySet({
        workspace: root,
        plan: {
          schema_version: 'qp-assemble-plan/1.0.0',
          id: 'QS-QP-UNIT-003',
          path: 'queries/sets/qs-qp-unit-003.md',
          goal_refs: [QP_GOAL_ID],
          query_versions: [
            { ref: query.id, version: '1.0.0' },
            { ref: query.id, version: '1.0.0' },
          ],
        },
        now: NOW,
      }),
      (error) => error.code === 'QP_PLAN_INVALID',
    );
    await assert.rejects(
      assemblePortfolioQuerySet({
        workspace: root,
        plan: {
          schema_version: 'qp-assemble-plan/1.0.0',
          id: 'X-1',
          path: 'queries/sets/x.md',
          goal_refs: [QP_GOAL_ID],
          query_versions: [{ ref: query.id, version: '1.0.0' }],
        },
        now: NOW,
      }),
      (error) => error.code === 'QP_PLAN_INVALID',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

async function draftSetWorkspace() {
  const { root, query } = await formalWorkspace();
  await assemblePortfolioQuerySet({
    workspace: root,
    plan: {
      schema_version: 'qp-assemble-plan/1.0.0',
      id: 'QS-QP-UNIT-001',
      path: 'queries/sets/qs-qp-unit-001.md',
      goal_refs: [QP_GOAL_ID],
      query_versions: [{ ref: query.id, version: query.version }],
    },
    now: NOW,
  });
  return { root, query };
}

test('prefreeze：门禁矩阵与期望哈希', async () => {
  const candidateRoot = await unitWorkspace();
  try {
    // candidate Query 组装 draft：prefreeze 应报 QUERY_NOT_FORMAL
    const intake = await intakeQueryPortfolio({
      workspace: candidateRoot,
      plan: intakePlan(),
      now: NOW,
    });
    await assemblePortfolioQuerySet({
      workspace: candidateRoot,
      plan: {
        schema_version: 'qp-assemble-plan/1.0.0',
        id: 'QS-QP-UNIT-001',
        path: 'queries/sets/qs-qp-unit-001.md',
        goal_refs: [QP_GOAL_ID],
        query_versions: [{ ref: intake.queries[0].id, version: '1.0.0' }],
      },
      now: NOW,
    });
    const blocked = await prefreezeQuerySet({ workspace: candidateRoot, querySetId: 'QS-QP-UNIT-001' });
    assert.equal(blocked.ready, false);
    assert.equal(blocked.gates.length, 2);
    assert.equal(blocked.gates[0].code, 'QUERY_NOT_FORMAL');
    assert.equal(blocked.gates[1].code, 'APPROVAL_REQUIRED');
  } finally {
    await rm(candidateRoot, { recursive: true });
  }

  const { root, query } = await draftSetWorkspace();
  try {
    const ready = await prefreezeQuerySet({ workspace: root, querySetId: 'QS-QP-UNIT-001' });
    assert.equal(ready.ready, true);
    assert.deepEqual(ready.gates, []);
    assert.equal(ready.state, 'draft');
    assert.equal(
      ready.expected_content_sha256,
      querySetContentSha([{
        ref: query.id,
        version: query.version,
        query_text: query.query_text,
        language: query.language,
      }]),
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('validate：M3 合并、drift 与覆盖 warning', async () => {
  const { root, query } = await draftSetWorkspace();
  try {
    const clean = await validateQueryPortfolioWorkspace({ workspace: root });
    assert.deepEqual(clean.errors, []);
    assert.deepEqual(clean.warnings, []);

    // 人工修改 normalized_text 与 intent 制造 drift warning
    const graph = await loadWorkspaceGraph({ workspace: root });
    const object = graph.byId.get(query.id);
    const drifted = {
      ...object.data,
      normalized_text: 'totally different text',
      intent: 'pricing',
    };
    await (await import('node:fs/promises')).writeFile(
      path.join(root, object.path),
      serializeMarkdownObject(drifted, `# ${drifted.title}\n`),
    );
    const driftResult = await validateQueryPortfolioWorkspace({ workspace: root });
    assert.deepEqual(driftResult.errors, []);
    const codes = driftResult.warnings.map((warning) => warning.code).sort();
    assert.deepEqual(codes, ['QP_INTENT_DRIFT', 'QP_NORMALIZATION_DRIFT']);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('report：聚类覆盖视图、内容键工件与确定性', async () => {
  const root = await unitWorkspace();
  try {
    const plan = intakePlan();
    plan.sources[0].entries.push(
      { query_text: 'what is qp test merchant platform', language: 'en-US' },
      { query_text: 'is qp test merchant legit', language: 'en-US' },
      { query_text: 'qp test merchant pricing', language: 'en-US' },
    );
    const intake = await intakeQueryPortfolio({ workspace: root, plan, now: NOW });
    assert.equal(intake.queries.length, 4);

    const first = await reportQueryPortfolio({ workspace: root, goalRef: QP_GOAL_ID, now: NOW });
    assert.equal(first.report.schema_version, 'qp-portfolio-report/1.0.0');
    assert.equal(first.action, 'created');
    assert.equal(first.report.query_counts.total, 4);
    assert.equal(first.report.query_counts.candidate, 4);
    assert.equal(first.report.clusters.length, 3);
    assert.equal(first.report.coverage.clusters_total, 3);
    assert.equal(first.report.coverage.clusters_with_formal, 0);
    assert.equal(first.report.coverage.uncovered_cluster_keys.length, 3);
    assert.deepEqual(first.report.coverage.languages_without_formal, ['en-US']);
    assert.equal(first.report.rule_versions.cluster, QP_RULES.cluster);

    const repeated = await reportQueryPortfolio({ workspace: root, goalRef: QP_GOAL_ID, now: NOW });
    assert.equal(repeated.action, 'kept');
    assert.equal(repeated.artifact_path, first.artifact_path);
    assert.deepEqual(repeated.report, first.report);
    assert.match(first.artifact_path, /^queries\/portfolio\/reports\/goal-qp-test-001-[0-9a-f]{8}\.json$/);

    const expected = buildPortfolioReport({
      goalRef: QP_GOAL_ID,
      queries: (await loadWorkspaceGraph({ workspace: root })).objects
        .filter((object) => object.data.record_type === 'query'),
      now: NOW,
    });
    assert.deepEqual(first.report, expected);

    await assert.rejects(
      reportQueryPortfolio({ workspace: root, goalRef: QP_SOURCE_PLATFORM_ID, now: NOW }),
      (error) => error.code === 'REF_TYPE_MISMATCH',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('frozen Query Set 覆盖缺口 warning 与 index 重建', async () => {
  const root = await unitWorkspace();
  try {
    const plan = intakePlan();
    plan.sources[0].entries.push({ query_text: 'is qp test merchant legit', language: 'en-US' });
    const intake = await intakeQueryPortfolio({ workspace: root, plan, now: NOW });
    // 人工只批准 definition Query，legit 保持 candidate
    const definition = intake.queries.find((item) => item.intent === 'brand_definition');
    const graph = await loadWorkspaceGraph({ workspace: root });
    const object = graph.byId.get(definition.id);
    await (await import('node:fs/promises')).writeFile(
      path.join(root, object.path),
      serializeMarkdownObject({ ...object.data, status: 'formal', approval: { ...QP_APPROVAL } }, `# ${object.data.title}\n`),
    );
    await assemblePortfolioQuerySet({
      workspace: root,
      plan: {
        schema_version: 'qp-assemble-plan/1.0.0',
        id: 'QS-QP-UNIT-001',
        path: 'queries/sets/qs-qp-unit-001.md',
        goal_refs: [QP_GOAL_ID],
        query_versions: [{ ref: definition.id, version: '1.0.0' }],
      },
      now: NOW,
    });
    const prefreeze = await prefreezeQuerySet({ workspace: root, querySetId: 'QS-QP-UNIT-001' });
    assert.equal(prefreeze.ready, true);
    assert.equal(prefreeze.warnings.filter((warning) => warning.code === 'QP_COVERAGE_GAP').length >= 1, true);

    const sha = prefreeze.expected_content_sha256;
    const setGraph = await loadWorkspaceGraph({ workspace: root });
    const setObject = setGraph.byId.get('QS-QP-UNIT-001');
    await (await import('node:fs/promises')).writeFile(
      path.join(root, setObject.path),
      serializeMarkdownObject({
        ...setObject.data,
        status: 'frozen',
        frozen_at: NOW,
        frozen_by: 'Fixture Human Reviewer',
        content_sha256: sha,
        approval: { ...QP_APPROVAL },
      }, `# ${setObject.data.title}\n`),
    );

    const validation = await validateQueryPortfolioWorkspace({ workspace: root });
    assert.deepEqual(validation.errors, []);
    assert.equal(validation.warnings.some((warning) => warning.code === 'QP_COVERAGE_GAP'), true);

    const indexes = await buildIndexes({ workspace: root });
    assert.ok(indexes.indexes.includes('queries.json'));
    assert.ok(indexes.indexes.includes('query-sets.json'));
    const queriesIndex = JSON.parse(await readFile(path.join(root, 'indexes/queries.json'), 'utf8'));
    assert.equal(queriesIndex.objects.length, 2);
    const setsIndex = JSON.parse(await readFile(path.join(root, 'indexes/query-sets.json'), 'utf8'));
    assert.equal(setsIndex.objects.length, 1);
  } finally {
    await rm(root, { recursive: true });
  }
});
