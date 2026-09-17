import { readFile, open, unlink } from 'node:fs/promises';

import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  querySetContentSha,
  validateKnowledgeWorkspace,
} from './knowledge-query.mjs';
import {
  assertNoTestKnowledgeContamination,
  preflightTestKnowledgeWrite,
  validateDevelopmentKnowledgeWorkspace,
} from './workspace-scope.mjs';
import { serializeMarkdownObject, validateObjectData } from './object-contract.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  compareUtf8,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
  atomicWrite,
} from './workspace-paths.mjs';

export class QueryPortfolioError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'QueryPortfolioError';
    this.code = code;
    Object.assign(this, details);
  }
}

export const QP_RULES = Object.freeze({
  normalize: 'qp-normalize-v1',
  intent: 'qp-intent-v1',
  priority: 'qp-priority-v1',
  cluster: 'qp-cluster-v1',
  id: 'qp-id-v1',
});

export const QP_SOURCE_CLASSES = Object.freeze({
  generative_platform_observation: 'P0',
  first_party_user_data: 'P1',
  community_expression: 'P2',
  competitor_material: 'P3',
  manual_import: 'P2',
  gsc_search_query: 'P1',
  knowledge_generated: 'P3',
});

const PRIORITY_ORDER = Object.freeze(['P0', 'P1', 'P2', 'P3']);
const ACTIVE_QUERY_STATUSES = Object.freeze(['candidate', 'formal']);
const CLUSTER_SIMILARITY_THRESHOLD = 0.6;

const INTENT_RULES = Object.freeze([
  ['comparison', /(?:^|\s)vs\.?(?:\s|$)|\bcompar|difference between|对比|区别|还是/],
  ['recommendation', /\bbest\b|\btop\b|\brecommend|\bshould i\b|推荐|哪个好/],
  ['pricing', /\bpric|\bcost\b|how much|\bfree\b|收费|多少钱|价格|免费/],
  ['reputation', /\bsafe\b|\blegit\b|\bscam\b|trustworthy|\breviews?\b|靠谱|安全|评价|骗局/],
  ['capability', /how to|\bcan\b|\bdoes\b|\bfeatures?\b|功能|怎么用|如何|支持/],
  ['brand_definition', /^what (?:is|are) |^who (?:is|are) |tell me about|什么是|是什么|介绍一下/],
]);

const CLUSTER_STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'do',
  'does', 'did', 'what', 'who', 'whom', 'which', 'when', 'where', 'why', 'how',
  'of', 'for', 'to', 'in', 'on', 'at', 'with', 'and', 'or', 'not', 'tell',
  'me', 'about', 'i', 'should', 'my', 'your', 'it', 'its', 'this', 'that', 'vs',
  '是', '什么', '吗', '了', '呢', '吧', '啊', '的', '和', '与', '在', '对',
  '从', '被', '把', '有', '个', '怎么', '如何', '哪', '哪些', '这些', '那些',
  '告诉', '介绍', '关于',
]);

const EDGE_PUNCT = /^[?!.,;:、。？！，；：]+|[?!.,;:、。？！，；：]+$/g;
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function fail(code, message, details = {}) {
  throw new QueryPortfolioError(code, message, details);
}

function requireObject(graph, ref, type) {
  const object = graph.byId.get(ref);
  if (!object) fail('BROKEN_REF', '对象引用不存在', { ref });
  if (object.data.record_type !== type) {
    fail('REF_TYPE_MISMATCH', '对象引用类型错误', { ref, expected: type, actual: object.data.record_type });
  }
  return object;
}

function requireArray(value, code, field) {
  if (!Array.isArray(value) || value.length === 0) fail(code, `缺少或为空: ${field}`, { field });
}

// --- 规则：qp-normalize-v1 ---

export function normalizeQueryText(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    fail('QP_QUERY_TEXT_INVALID', 'query_text 为空');
  }
  const normalized = text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
    .replace(EDGE_PUNCT, '');
  if (normalized === '') fail('QP_QUERY_TEXT_INVALID', '归一化后为空', { query_text: text });
  return normalized;
}

// --- 规则：qp-intent-v1 ---

export function classifyIntent(normalizedText) {
  for (const [intent, pattern] of INTENT_RULES) {
    if (pattern.test(normalizedText)) return intent;
  }
  return 'other';
}

// --- 规则：qp-priority-v1 ---

export function priorityForSourceClasses(sourceClasses) {
  const priorities = sourceClasses
    .map((sourceClass) => QP_SOURCE_CLASSES[sourceClass])
    .filter(Boolean)
    .sort((left, right) => PRIORITY_ORDER.indexOf(left) - PRIORITY_ORDER.indexOf(right));
  if (priorities.length === 0) {
    fail('QP_SOURCE_REQUIRED', '来源类别无法映射优先级', { source_classes: sourceClasses });
  }
  return priorities[0];
}

function bestPriority(priorities) {
  return [...priorities]
    .filter((priority) => PRIORITY_ORDER.includes(priority))
    .sort((left, right) => PRIORITY_ORDER.indexOf(left) - PRIORITY_ORDER.indexOf(right))[0];
}

// --- 规则：qp-id-v1 ---

export function generateQueryIdentity({ normalizedText, language, goalRef }) {
  const slugTokens = normalizedText.match(/[a-z0-9]+/g) ?? [];
  const slug = (slugTokens.slice(0, 5).map((token) => token.slice(0, 12)).join('-')
    .slice(0, 40).toUpperCase()) || 'QUERY';
  const lang = String(language).split(/[-_]/)[0].toUpperCase();
  const digest = sha256(stableStringify({ normalized_text: normalizedText, language, ...(goalRef ? { goal_ref: goalRef } : {}) }))
    .slice(0, 4).toUpperCase();
  const id = `Q-${slug}-${lang}-${digest}`;
  return { id, path: `queries/candidates/${id.toLowerCase()}.md` };
}

// --- 规则：qp-cluster-v1 ---

function clusterTokens(normalizedText) {
  const runs = normalizedText.match(/[a-z0-9]+|[㐀-鿿぀-ヿ가-힯]+/g) ?? [];
  const tokens = [];
  for (const run of runs) {
    if (/[a-z0-9]/.test(run[0])) {
      tokens.push(run);
    } else if (run.length === 1) {
      tokens.push(run);
    } else {
      for (let index = 0; index + 1 < run.length; index += 1) tokens.push(run.slice(index, index + 2));
    }
  }
  return new Set([...tokens].filter((token) => !CLUSTER_STOPWORDS.has(token)));
}

function jaccard(left, right) {
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function clusterKey({ language, intent, memberRefs }) {
  return `QC-${sha256(stableStringify({
    language,
    intent,
    member_refs: [...memberRefs].sort(compareUtf8),
  })).slice(0, 12).toUpperCase()}`;
}

export function clusterQueries(queries) {
  // queries: [{ data }] — 同一 Goal 下的活跃 Query；(language, intent) 分桶后确定性 union-find 聚类。
  const buckets = new Map();
  for (const query of queries) {
    const bucketKey = `${query.data.language}\u0000${query.data.intent}`;
    if (!buckets.has(bucketKey)) buckets.set(bucketKey, []);
    buckets.get(bucketKey).push(query);
  }
  const clusters = [];
  for (const [bucketKey, members] of [...buckets.entries()].sort((left, right) => compareUtf8(left[0], right[0]))) {
    const [language, intent] = bucketKey.split('\u0000');
    const ordered = [...members].sort((left, right) => compareUtf8(left.data.id, right.data.id));
    const tokenSets = new Map(ordered.map((member) => [member.data.id, clusterTokens(member.data.normalized_text)]));
    const parent = new Map(ordered.map((member) => [member.data.id, member.data.id]));
    const find = (id) => {
      const root = parent.get(id);
      if (root === id) return id;
      const resolved = find(root);
      parent.set(id, resolved);
      return resolved;
    };
    for (let i = 0; i < ordered.length; i += 1) {
      for (let j = i + 1; j < ordered.length; j += 1) {
        const similarity = jaccard(tokenSets.get(ordered[i].data.id), tokenSets.get(ordered[j].data.id));
        if (similarity >= CLUSTER_SIMILARITY_THRESHOLD) {
          const [leftRoot, rightRoot] = [find(ordered[i].data.id), find(ordered[j].data.id)];
          if (leftRoot !== rightRoot) parent.set(leftRoot, rightRoot);
        }
      }
    }
    const groups = new Map();
    for (const member of ordered) {
      const root = find(member.data.id);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(member);
    }
    for (const group of [...groups.values()].sort((left, right) => compareUtf8(left[0].data.id, right[0].data.id))) {
      const memberRefs = group.map((member) => member.data.id).sort(compareUtf8);
      clusters.push({
        cluster_key: clusterKey({ language, intent, memberRefs }),
        language,
        intent,
        member_refs: group.map((member) => ({
          ref: member.data.id,
          version: member.data.version,
          status: member.data.status,
        })),
        representative_ref: memberRefs[0],
        suggested_priority: bestPriority(group.map((member) => member.data.priority)),
        formal_count: group.filter((member) => member.data.status === 'formal').length,
      });
    }
  }
  return clusters.sort((left, right) => compareUtf8(left.cluster_key, right.cluster_key));
}

// --- 双路写入 ---

async function readWorkspaceIdentity(workspace) {
  try {
    return JSON.parse(await readFile(resolveWithin(workspace, 'workspace.json'), 'utf8'));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    fail('QP_PLAN_INVALID', 'workspace.json 不可读', { cause_code: error.code });
    return null;
  }
}

async function loadGraph(workspace) {
  try {
    return await loadWorkspaceGraph({ workspace });
  } catch (error) {
    if (error.code === 'INDEX_VALIDATION_FAILED') {
      throw new QueryPortfolioError('INDEX_VALIDATION_FAILED', '工作区对象校验失败', {
        diagnostics: error.diagnostics,
      });
    }
    throw error;
  }
}

async function portfolioWriteContext(workspace) {
  const identity = await readWorkspaceIdentity(workspace);
  const testOnly = identity?.workspace_mode === 'development_test';
  let merchantId = null;
  let knowledgeBaseId = null;
  if (testOnly) {
    const graph = await loadGraph(workspace);
    const merchant = graph.byId.get(identity.merchant_ref)?.data;
    const knowledgeBase = graph.byId.get(identity.knowledge_base_ref)?.data;
    if (merchant?.record_type !== 'merchant' || knowledgeBase?.record_type !== 'brand_knowledge_base') {
      fail('QP_TEST_KNOWLEDGE_REQUIRED', 'development-test Workspace 缺少 Merchant/KBASE');
    }
    merchantId = merchant.id;
    knowledgeBaseId = knowledgeBase.id;
  }
  return { identity, testOnly, merchantId, knowledgeBaseId };
}

function decorateOutput(context, output) {
  const data = { ...output.data };
  if (context.testOnly) {
    data.test_scope = {
      kind: 'synthetic',
      usage: 'test_only',
      merchant_ref: context.merchantId,
      workspace_id: context.identity.workspace_id,
      knowledge_base_ref: context.knowledgeBaseId,
    };
  }
  const body = output.body ?? `# ${data.title ?? data.id}\n`;
  return {
    path: assertSafeRelativePath(output.path),
    data,
    body,
    content: serializeMarkdownObject(data, body),
  };
}

async function readExistingBytes(workspace, safePath) {
  try {
    return await readFile(resolveWithin(workspace, safePath), 'utf8');
  } catch (error) {
    if (['PATH_NOT_FOUND', 'ENOENT'].includes(error.code)) return null;
    throw error;
  }
}

async function writeDecoratedOutputs(workspace, context, decorated) {
  const created = [];
  const kept = [];
  for (const output of decorated) {
    await assertNoSymlinkPath(workspace, output.path, { allowMissingLeaf: true });
    const existing = await readExistingBytes(workspace, output.path);
    if (existing !== null && existing !== output.content) {
      fail('OBJECT_CONFLICT', '目标已存在且内容不同', { path: output.path });
    }
    if (context.testOnly) {
      await preflightTestKnowledgeWrite({ workspace, data: output.data, body: output.body });
    } else {
      validateObjectData(output.data, { path: output.path });
    }
    const result = await writeCreateOnly(workspace, output.path, output.content, {
      idempotent: true,
      conflictCode: 'OBJECT_CONFLICT',
    });
    (result.action === 'created' ? created : kept).push(result.path);
  }
  return { created, kept };
}

// --- intake ---

function assertIntakePlan(plan) {
  if (!plan || typeof plan !== 'object' || plan.schema_version !== 'qp-intake-plan/1.0.0') {
    fail('QP_PLAN_INVALID', 'schema_version 必须为 qp-intake-plan/1.0.0');
  }
  if (typeof plan.run_id !== 'string' || !plan.run_id.startsWith('RUN-')) {
    fail('QP_PLAN_INVALID', 'run_id 必须以 RUN- 开头');
  }
  if (typeof plan.goal_ref !== 'string' || plan.goal_ref.trim() === '') {
    fail('QP_GOAL_REQUIRED', '缺少 goal_ref');
  }
  requireArray(plan.sources, 'QP_PLAN_INVALID', 'sources');
  for (const group of plan.sources) {
    if (!group || typeof group !== 'object') fail('QP_PLAN_INVALID', 'source 组非法');
    if (typeof group.source_ref !== 'string' || group.source_ref.trim() === '') {
      fail('QP_SOURCE_REQUIRED', '缺少 source_ref');
    }
    if (!(group.source_class in QP_SOURCE_CLASSES)) {
      fail('QP_PLAN_INVALID', 'source_class 非法', {
        source_class: group.source_class,
        allowed: Object.keys(QP_SOURCE_CLASSES),
      });
    }
    if (typeof group.observed_at !== 'string' || !RFC3339.test(group.observed_at)) {
      fail('QP_PLAN_INVALID', 'observed_at 必须是合法 RFC3339');
    }
    requireArray(group.entries, 'QP_PLAN_INVALID', 'entries');
    for (const entry of group.entries) {
      if (!entry || typeof entry !== 'object') fail('QP_PLAN_INVALID', 'entry 非法');
      if (typeof entry.query_text !== 'string' || entry.query_text.trim() === '') {
        fail('QP_QUERY_TEXT_INVALID', 'query_text 为空');
      }
      if (typeof entry.language !== 'string' || entry.language.trim().length < 2) {
        fail('QP_PLAN_INVALID', 'language 至少 2 个字符');
      }
    }
  }
}

export async function intakeQueryPortfolio({ workspace, plan, now }) {
  assertIntakePlan(plan);
  const timestamp = now ?? new Date().toISOString();
  const graph = await loadGraph(workspace);
  requireObject(graph, plan.goal_ref, 'perception_goal');

  const observations = new Map();
  for (const group of plan.sources) {
    const sourceObject = requireObject(graph, group.source_ref, 'source');
    if (sourceObject.data.status !== 'active') {
      fail('QP_SOURCE_REQUIRED', '来源必须为 active', {
        ref: group.source_ref,
        status: sourceObject.data.status,
      });
    }
    const seenInGroup = new Set();
    for (const entry of group.entries) {
      const language = entry.language.trim();
      const normalized = normalizeQueryText(entry.query_text);
      const key = `${normalized}\u0000${language}`;
      if (seenInGroup.has(key)) {
        fail('DUPLICATE_QUERY', '同一来源在 plan 内重复观察同一 Query', {
          source_ref: group.source_ref,
          normalized_text: normalized,
          language,
        });
      }
      seenInGroup.add(key);
      const observation = observations.get(key) ?? {
        normalized_text: normalized,
        language,
        texts: [],
        sources: [],
      };
      observation.texts.push(entry.query_text);
      observation.sources.push({
        ref: group.source_ref,
        source_class: group.source_class,
        observed_at: group.observed_at,
      });
      observations.set(key, observation);
    }
  }

  const context = await portfolioWriteContext(workspace);
  const duplicates = [];
  const updates = [];
  const prepared = [];
  const preparedSummaries = [];
  for (const key of [...observations.keys()].sort(compareUtf8)) {
    const observation = observations.get(key);
    const sourceClasses = [...new Set(observation.sources.map((source) => source.source_class))];
    const { id, path } = generateQueryIdentity({
      normalizedText: observation.normalized_text,
      language: observation.language,
      ...(plan.goal_scoped_ids ? { goalRef: plan.goal_ref } : {}),
    });
    const queryText = [...observation.texts].sort(compareUtf8)[0];
    const data = {
      id,
      record_type: 'query',
      status: 'candidate',
      version: '1.0.0',
      created_at: timestamp,
      updated_at: timestamp,
      title: queryText,
      query_text: queryText,
      language: observation.language,
      normalized_text: observation.normalized_text,
      intent: classifyIntent(observation.normalized_text),
      priority: priorityForSourceClasses(sourceClasses),
      goal_refs: [plan.goal_ref],
      discovery_source_refs: [...new Set(observation.sources.map((source) => source.ref))].sort(compareUtf8),
      extensions: {
        'geo.qp_intake': {
          rules: { ...QP_RULES },
          sources: [...observation.sources].sort((left, right) => compareUtf8(left.ref, right.ref)),
        },
      },
    };

    const existing = graph.objects.find((object) => object.data.record_type === 'query'
      && ACTIVE_QUERY_STATUSES.includes(object.data.status)
      && (object.data.goal_refs ?? []).includes(plan.goal_ref)
      && object.data.normalized_text === observation.normalized_text
      && object.data.language === observation.language);
    if (existing) {
      const decorated = decorateOutput(context, { path, data });
      const existingBytes = await readExistingBytes(workspace, decorated.path);
      const idempotentReplay = existing.data.id === id && existingBytes === decorated.content;
      if (!idempotentReplay) {
        if (plan.merge_sources && existing.data.status === 'candidate') {
          const priorSources = existing.data.extensions?.['geo.qp_intake']?.sources ?? [];
          const mergedSources = [...new Map([...priorSources, ...observation.sources].map(s => [s.ref, s])).values()].sort((a, b) => compareUtf8(a.ref, b.ref));
          if (mergedSources.length > priorSources.length) {
            const version = existing.data.version.split('.').map(Number);
            version[2] += 1;
            const mergedData = { ...existing.data, version: version.join('.'), updated_at: timestamp,
              discovery_source_refs: [...new Set(mergedSources.map(s => s.ref))].sort(compareUtf8),
              priority: priorityForSourceClasses(mergedSources.map(s => s.source_class)),
              extensions: { ...existing.data.extensions, 'geo.qp_intake': { rules: { ...QP_RULES }, sources: mergedSources } },
            };
            updates.push({ before: await readExistingBytes(workspace, existing.path), output: decorateOutput(context, { path: existing.path, data: mergedData, body: existing.content }) });
          }
          preparedSummaries.push(summaryOf(existing.data, mergedSources.map(s => s.source_class)));
        }
        duplicates.push({
          normalized_text: observation.normalized_text,
          language: observation.language,
          existing_ref: existing.data.id,
          source_refs: observation.sources.map((source) => source.ref),
        });
        continue;
      }
      prepared.push(decorated);
      preparedSummaries.push(summaryOf(data, sourceClasses));
      continue;
    }

    const conflicting = graph.byId.get(id);
    if (conflicting && (conflicting.data.normalized_text !== observation.normalized_text
      || conflicting.data.language !== observation.language)) {
      fail('QP_ID_COLLISION', '生成的 stable ID 与语义不同的既有对象冲突', {
        id,
        conflicting_path: conflicting.path,
      });
    }
    if (graph.objects.some((object) => object.path === path && object.data.id !== id)) {
      fail('OBJECT_CONFLICT', '目标路径已被其他对象占用', { path });
    }
    prepared.push(decorateOutput(context, { path, data }));
    preparedSummaries.push(summaryOf(data, sourceClasses));
  }

  const writeResult = await writeDecoratedOutputs(workspace, context, prepared);
  for (const { before, output } of updates) {
    const lockPath = resolveWithin(workspace, `${output.path}.lock`);
    const lock = await open(lockPath, 'wx').catch(() => fail('OBJECT_CONFLICT', 'Query 正在更新'));
    try {
      if (await readExistingBytes(workspace, output.path) !== before) fail('OBJECT_CONFLICT', 'Query 在更新前已改变');
      validateObjectData(output.data, { path: output.path });
      if (context.testOnly) await preflightTestKnowledgeWrite({ workspace, data: output.data, body: output.body });
      await atomicWrite(workspace, output.path, output.content);
    } finally { await lock.close(); await unlink(lockPath); }
  }
  return {
    run_id: plan.run_id,
    goal_ref: plan.goal_ref,
    created: writeResult.created,
    kept: writeResult.kept,
    updated: updates.map(item => item.output.path),
    duplicates,
    queries: preparedSummaries,
  };
}

function summaryOf(data, sourceClasses) {
  return {
    id: data.id,
    path: `queries/candidates/${data.id.toLowerCase()}.md`,
    query_text: data.query_text,
    normalized_text: data.normalized_text,
    intent: data.intent,
    priority: data.priority,
    source_classes: [...sourceClasses].sort(compareUtf8),
  };
}

// --- report ---

function activeGoalQueries(graph, goalRef) {
  return graph.objects.filter((object) => object.data.record_type === 'query'
    && (object.data.goal_refs ?? []).includes(goalRef)
    && !['stale', 'deprecated'].includes(object.data.status));
}

export function buildPortfolioReport({ goalRef, queries, now }) {
  const counts = { candidate: 0, formal: 0 };
  for (const query of queries) {
    if (counts[query.data.status] !== undefined) counts[query.data.status] += 1;
  }
  const clusters = clusterQueries(queries);
  const languages = {};
  const intents = {};
  for (const query of queries) {
    const language = languages[query.data.language] ?? { total: 0, formal: 0 };
    language.total += 1;
    if (query.data.status === 'formal') language.formal += 1;
    languages[query.data.language] = language;
    const intent = intents[query.data.intent] ?? { total: 0, formal: 0 };
    intent.total += 1;
    if (query.data.status === 'formal') intent.formal += 1;
    intents[query.data.intent] = intent;
  }
  const uncoveredClusters = clusters.filter((cluster) => cluster.formal_count === 0);
  const languagesWithoutFormal = Object.entries(languages)
    .filter(([, value]) => value.formal === 0)
    .map(([language]) => language)
    .sort(compareUtf8);
  return {
    schema_version: 'qp-portfolio-report/1.0.0',
    goal_ref: goalRef,
    generated_at: now,
    rule_versions: { ...QP_RULES },
    query_counts: { ...counts, total: queries.length },
    clusters,
    coverage: {
      languages,
      intents,
      clusters_total: clusters.length,
      clusters_with_formal: clusters.length - uncoveredClusters.length,
      uncovered_cluster_keys: uncoveredClusters.map((cluster) => cluster.cluster_key),
      languages_without_formal: languagesWithoutFormal,
    },
  };
}

export async function reportQueryPortfolio({ workspace, goalRef, now }) {
  if (typeof goalRef !== 'string' || goalRef.trim() === '') {
    fail('QP_GOAL_REQUIRED', '缺少 --goal');
  }
  const timestamp = now ?? new Date().toISOString();
  const graph = await loadGraph(workspace);
  requireObject(graph, goalRef, 'perception_goal');
  const queries = activeGoalQueries(graph, goalRef);
  const report = buildPortfolioReport({ goalRef, queries, now: timestamp });
  const key = sha256(stableStringify(report)).slice(0, 8);
  const path = `queries/portfolio/reports/${goalRef.toLowerCase()}-${key}.json`;
  const content = stableStringify(report, 2);
  const identity = await readWorkspaceIdentity(workspace);
  if (identity?.workspace_mode === 'development_test') {
    try {
      assertNoTestKnowledgeContamination(content);
    } catch (error) {
      throw new QueryPortfolioError('SYNTHETIC_REAL_REF_CONTAMINATION', error.message, {
        fields: error.fields,
      });
    }
  }
  await assertNoSymlinkPath(workspace, path, { allowMissingLeaf: true });
  const result = await writeCreateOnly(workspace, path, content, {
    idempotent: true,
    conflictCode: 'QP_REPORT_CONFLICT',
  });
  return { report, artifact_path: result.path, action: result.action };
}

// --- assemble ---

function assertAssemblePlan(plan) {
  if (!plan || typeof plan !== 'object' || plan.schema_version !== 'qp-assemble-plan/1.0.0') {
    fail('QP_PLAN_INVALID', 'schema_version 必须为 qp-assemble-plan/1.0.0');
  }
  if (typeof plan.id !== 'string' || !plan.id.startsWith('QS-')) {
    fail('QP_PLAN_INVALID', 'id 必须以 QS- 开头');
  }
  if (typeof plan.path !== 'string' || plan.path.trim() === '') {
    fail('QP_PLAN_INVALID', '缺少 path');
  }
  requireArray(plan.goal_refs, 'QP_PLAN_INVALID', 'goal_refs');
  requireArray(plan.query_versions, 'QP_PLAN_INVALID', 'query_versions');
  const refs = new Set();
  for (const item of plan.query_versions) {
    if (!item || typeof item.ref !== 'string' || typeof item.version !== 'string') {
      fail('QP_PLAN_INVALID', 'query_versions 项必须含 ref 与 version');
    }
    if (refs.has(item.ref)) fail('QP_PLAN_INVALID', 'query_versions 内 ref 重复', { ref: item.ref });
    refs.add(item.ref);
  }
}

export async function assemblePortfolioQuerySet({ workspace, plan, now }) {
  assertAssemblePlan(plan);
  const timestamp = now ?? new Date().toISOString();
  const graph = await loadGraph(workspace);
  for (const ref of plan.goal_refs) requireObject(graph, ref, 'perception_goal');
  const queries = new Map();
  for (const item of plan.query_versions) {
    const query = requireObject(graph, item.ref, 'query');
    for (const field of ['normalized_text', 'intent', 'priority', 'goal_refs']) {
      const value = query.data[field];
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        fail('M3_FIELD_REQUIRED', 'Query 缺少 M3 必填字段', { ref: item.ref, field });
      }
    }
    if (query.data.version !== item.version) {
      fail('VERSION_DRIFT', '对象版本引用与当前对象不一致', {
        ref: item.ref,
        expected: item.version,
        actual: query.data.version,
      });
    }
    queries.set(item.ref, query);
  }
  const existing = graph.byId.get(plan.id);
  if (existing && existing.path !== plan.path) {
    fail('OBJECT_CONFLICT', 'stable ID 已存在于其他路径', {
      id: plan.id,
      existing_path: existing.path,
      requested_path: plan.path,
    });
  }
  if (graph.objects.some((object) => object.path === plan.path && object.data.id !== plan.id)) {
    fail('OBJECT_CONFLICT', '目标路径已被其他对象占用', { path: plan.path });
  }
  const data = {
    id: plan.id,
    record_type: 'query_set',
    status: 'draft',
    version: '1.0.0',
    created_at: timestamp,
    updated_at: timestamp,
    ...(plan.title ? { title: plan.title } : {}),
    goal_refs: plan.goal_refs,
    query_versions: plan.query_versions,
  };
  const context = await portfolioWriteContext(workspace);
  const writeResult = await writeDecoratedOutputs(workspace, context, [
    decorateOutput(context, { path: plan.path, data }),
  ]);
  const contentSha = querySetContentSha(plan.query_versions.map((item) => ({
    ref: item.ref,
    version: item.version,
    query_text: queries.get(item.ref).data.query_text,
    language: queries.get(item.ref).data.language,
  })));
  return {
    created: writeResult.created,
    kept: writeResult.kept,
    data,
    content_sha256_preview: contentSha,
  };
}

// --- prefreeze ---

function expectedContentSha(graph, queryVersions) {
  return querySetContentSha(queryVersions.map(({ ref, version }) => {
    const query = graph.byId.get(ref)?.data;
    return {
      ref,
      version,
      query_text: query?.query_text,
      language: query?.language,
    };
  }));
}

export async function prefreezeQuerySet({ workspace, querySetId }) {
  if (typeof querySetId !== 'string' || querySetId.trim() === '') {
    fail('QP_PLAN_INVALID', '缺少 --query-set');
  }
  const graph = await loadGraph(workspace);
  const querySet = requireObject(graph, querySetId, 'query_set');
  const data = querySet.data;
  const gates = gatesOf(data, graph);

  if (data.status === 'frozen') {
    if (!data.frozen_at || !data.frozen_by || !data.content_sha256) {
      gates.push({ code: 'APPROVAL_REQUIRED', ref: data.id, field: 'freeze_metadata' });
    }
    if (data.content_sha256 && data.content_sha256 !== expectedContentSha(graph, data.query_versions)) {
      gates.push({ code: 'VERSION_DRIFT', ref: data.id, field: 'content_sha256' });
    }
    return { state: 'frozen', valid: gates.length === 0, gates, warnings: [], coverage: null };
  }

  const warnings = [];
  const setRefs = new Set(data.query_versions.map((item) => item.ref));
  const setLanguages = new Set(data.query_versions
    .map((item) => graph.byId.get(item.ref)?.data?.language)
    .filter(Boolean));
  for (const goalRef of data.goal_refs) {
    const goalQueries = activeGoalQueries(graph, goalRef);
    for (const cluster of clusterQueries(goalQueries)) {
      if (!cluster.member_refs.some((member) => setRefs.has(member.ref))) {
        warnings.push({
          code: 'QP_COVERAGE_GAP',
          cluster_key: cluster.cluster_key,
          representative_ref: cluster.representative_ref,
        });
      }
    }
    for (const language of [...new Set(goalQueries.map((query) => query.data.language))].sort(compareUtf8)) {
      if (!setLanguages.has(language)) {
        warnings.push({ code: 'QP_COVERAGE_GAP', language });
      }
    }
  }

  return {
    state: data.status,
    ready: gates.length === 0,
    gates,
    warnings,
    expected_content_sha256: expectedContentSha(graph, data.query_versions),
    freeze_fields: ['status: frozen', 'frozen_at', 'frozen_by', 'content_sha256', 'approval'],
  };
}

function gatesOf(data, graph) {
  const gates = [];
  for (const item of data.query_versions) {
    const query = graph.byId.get(item.ref)?.data;
    if (!query) {
      gates.push({ code: 'BROKEN_REF', ref: item.ref, field: 'query_versions' });
      continue;
    }
    if (query.version !== item.version) {
      gates.push({ code: 'VERSION_DRIFT', ref: item.ref, field: 'query_versions' });
    }
    if (query.status !== 'formal') {
      gates.push({ code: 'QUERY_NOT_FORMAL', ref: item.ref, field: 'status' });
    }
    if (!query.approval) {
      gates.push({ code: 'APPROVAL_REQUIRED', ref: item.ref, field: 'approval' });
    }
  }
  for (const ref of data.goal_refs) {
    const goal = graph.byId.get(ref)?.data;
    if (!goal) gates.push({ code: 'BROKEN_REF', ref, field: 'goal_refs' });
    else if (!['approved', 'active'].includes(goal.status)) {
      gates.push({ code: 'GOAL_NOT_APPROVED', ref, field: 'goal_refs' });
    }
  }
  return gates;
}

// --- validate ---

export async function validateQueryPortfolioWorkspace({ workspace }) {
  const errors = [];
  const warnings = [];
  const knowledge = await validateKnowledgeWorkspace({ workspace });
  errors.push(...knowledge.errors);
  warnings.push(...knowledge.warnings);

  let graph;
  try {
    graph = await loadGraph(workspace);
  } catch (error) {
    if (error.code === 'INDEX_VALIDATION_FAILED') {
      errors.push(...error.diagnostics);
      return { errors, warnings };
    }
    throw error;
  }

  for (const object of graph.objects) {
    if (object.data.record_type !== 'query'
      || !object.data.extensions?.['geo.qp_intake']
      || ['stale', 'deprecated'].includes(object.data.status)) continue;
    let recomputed = null;
    try {
      recomputed = normalizeQueryText(object.data.query_text);
    } catch (error) {
      if (error.code !== 'QP_QUERY_TEXT_INVALID') throw error;
    }
    if (recomputed !== object.data.normalized_text) {
      warnings.push({
        code: 'QP_NORMALIZATION_DRIFT',
        id: object.data.id,
        path: object.path,
        expected: recomputed,
        actual: object.data.normalized_text,
      });
    }
    const intent = classifyIntent(object.data.normalized_text);
    if (intent !== object.data.intent) {
      warnings.push({
        code: 'QP_INTENT_DRIFT',
        id: object.data.id,
        path: object.path,
        expected: intent,
        actual: object.data.intent,
      });
    }
  }

  for (const object of graph.objects.filter((item) => item.data.record_type === 'query_set'
    && item.data.status === 'frozen')) {
    const setRefs = new Set(object.data.query_versions.map((item) => item.ref));
    for (const goalRef of object.data.goal_refs) {
      for (const cluster of clusterQueries(activeGoalQueries(graph, goalRef))) {
        if (!cluster.member_refs.some((member) => setRefs.has(member.ref))) {
          warnings.push({
            code: 'QP_COVERAGE_GAP',
            id: object.data.id,
            path: object.path,
            cluster_key: cluster.cluster_key,
            representative_ref: cluster.representative_ref,
          });
        }
      }
    }
  }

  const identity = await readWorkspaceIdentity(workspace);
  if (identity?.workspace_mode === 'development_test') {
    const testValidation = await validateDevelopmentKnowledgeWorkspace({ workspace });
    errors.push(...testValidation.errors);
  }

  return { errors, warnings };
}
