#!/usr/bin/env node
// validate-plugin.mjs — 插件包契约自检（Spec 0001 §6—§7）
// 在仓库任意目录运行均可；契约相对插件根与仓库根解析。
// 退出码：0 合规；1 存在违规
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarkdownObjectText } from './lib/object-contract.mjs';
import { validateGeoBrowserMcpConfig } from './lib/plugin-mcp-config.mjs';

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PLUGIN_ROOT, '..', '..');

const MANIFESTS = ['.codex-plugin', '.claude-plugin'].map((d) =>
  path.join(PLUGIN_ROOT, d, 'plugin.json'),
);
const MARKETPLACES = [
  '.agents/plugins/marketplace.json',
  '.claude-plugin/marketplace.json',
].map((p) => path.join(REPO_ROOT, p));
const MCP_CONFIG = path.join(PLUGIN_ROOT, '.mcp.json');

const violations = [];
const checked = [];
const REQUIRED_SKILL_HEADINGS = [
  '触发场景', '输入', '开工前必读', '步骤', '输出', '可做事项',
  '禁止事项', '失败与停止条件', '验收方式', '示例',
];

function fail(message) {
  violations.push(message);
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    fail(`${path.relative(REPO_ROOT, file)}: JSON 解析失败 (${err.message})`);
    return null;
  }
}

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function checkManifests() {
  const manifests = [];
  for (const file of MANIFESTS) {
    const data = await readJson(file);
    if (!data) continue;
    const rel = path.relative(REPO_ROOT, file);
    checked.push(rel);
    if (data.name !== 'geo-expert') fail(`${rel}: name 必须为 "geo-expert"，实际 "${data.name}"`);
    if (!data.version) fail(`${rel}: 缺少 version`);
    if (!data.description) fail(`${rel}: 缺少 description`);
    if (file.includes('.codex-plugin')) {
      if (data.skills !== './skills/') fail(`${rel}: skills 指针必须为 "./skills/"`);
      if (data.mcpServers !== './.mcp.json') {
        fail(`${rel}: mcpServers 必须严格指向 "./.mcp.json"`);
      }
      for (const forbidden of ['apps', 'hooks']) {
        if (forbidden in data) fail(`${rel}: 本阶段禁止字段 ${forbidden}`);
      }
    }
    manifests.push({ rel, data });
  }
  const versions = new Set(manifests.map((m) => m.data.version));
  if (versions.size > 1) {
    fail(`各 Manifest 版本不一致: ${[...versions].join(', ')}`);
  }
}

async function checkMcpConfig() {
  const data = await readJson(MCP_CONFIG);
  if (!data) return;
  try {
    validateGeoBrowserMcpConfig(data);
    checked.push(path.relative(REPO_ROOT, MCP_CONFIG));
  } catch (error) {
    fail(`${path.relative(REPO_ROOT, MCP_CONFIG)}: ${error.message}`);
  }
}

function parseFrontmatter(text, rel) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    fail(`${rel}: 缺少 YAML Frontmatter`);
    return null;
  }
  const fields = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-z-]+):\s*(.+)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
}

async function checkSkills() {
  const skillsDir = path.join(PLUGIN_ROOT, 'skills');
  if (!(await isDir(skillsDir))) {
    fail('skills/ 目录不存在');
    return;
  }
  const entries = await readdir(skillsDir);
  if (entries.length === 0) fail('skills/ 目录为空');
  for (const entry of entries) {
    const skillFile = path.join(skillsDir, entry, 'SKILL.md');
    const rel = path.relative(REPO_ROOT, skillFile);
    let text;
    try {
      text = await readFile(skillFile, 'utf8');
    } catch {
      fail(`${rel}: 不存在或不可读`);
      continue;
    }
    checked.push(rel);
    const fm = parseFrontmatter(text, rel);
    if (!fm) continue;
    if (!fm.name) fail(`${rel}: Frontmatter 缺少 name`);
    else if (fm.name !== entry) fail(`${rel}: name "${fm.name}" 与目录名 "${entry}" 不一致`);
    if (!fm.description) fail(`${rel}: Frontmatter 缺少 description`);
    for (const heading of REQUIRED_SKILL_HEADINGS) {
      if (!text.includes(`## ${heading}`)) fail(`${rel}: 缺少正文小节 ${heading}`);
    }
  }
}

async function checkMarketplaces() {
  for (const file of MARKETPLACES) {
    const data = await readJson(file);
    if (!data) continue;
    const rel = path.relative(REPO_ROOT, file);
    checked.push(rel);
    if (!Array.isArray(data.plugins) || data.plugins.length === 0) {
      fail(`${rel}: plugins 为空`);
      continue;
    }
    for (const plugin of data.plugins) {
      const sourcePath =
        typeof plugin.source === 'string' ? plugin.source : plugin.source?.path;
      if (!sourcePath) {
        fail(`${rel}: 插件 ${plugin.name} 缺少 source 路径`);
        continue;
      }
      // Marketplace 的 source 路径相对仓库根解析（Spec 0001 §4）
      const resolved = path.resolve(REPO_ROOT, sourcePath);
      if (!(await isDir(resolved))) {
        fail(`${rel}: 插件 ${plugin.name} 的 source 路径不存在: ${sourcePath}`);
      }
    }
  }
}

async function checkTemplates() {
  for (const file of ['README.md', 'STATUS.md', 'workspace.json']) {
    const p = path.join(PLUGIN_ROOT, 'assets', 'workspace-template', file);
    try {
      await readFile(p, 'utf8');
      checked.push(path.relative(REPO_ROOT, p));
    } catch {
      fail(`工作区模板缺失: ${path.relative(REPO_ROOT, p)}`);
    }
  }
  for (const file of [
    'query.md', 'claim.md', 'source.md', 'evidence.md',
    'finding.md', 'asset.md', 'run.md', 'cycle.md',
    'document.md', 'answer-card.md', 'knowledge-release.md',
    'query-set.md', 'evidence-plan.md', 'perception-goal.md',
    'asset-proposal.md', 'adoption-record.md', 'asset-publication.md',
    'collector-profile.md', 'answer-sample.md', 'citation-observation.md',
    'source-classification.md', 'claim-support-review.md', 'answer-review.md',
    'answer-aggregation.md',
    'merchant.md', 'brand-knowledge-base.md', 'cycle-input-snapshot.md', 'cycle-transition.md',
    'analytics-observation.md', 'business-signal.md', 'cycle-review.md',
    'strategy-assessment.md', 'decision-dimension.md',
    'cycle-goal-candidate-batch.md', 'cycle-goal-candidate.md',
    'cycle-goal-selection.md', 'strategy-output.md',
  ]) {
    const p = path.join(PLUGIN_ROOT, 'assets', 'object-templates', file);
    try {
      parseMarkdownObjectText(await readFile(p, 'utf8'), {
        path: path.relative(REPO_ROOT, p),
      });
      checked.push(path.relative(REPO_ROOT, p));
    } catch (error) {
      fail(`对象模板无效: ${path.relative(REPO_ROOT, p)} (${error.code ?? error.message})`);
    }
  }
}

async function checkRuntime() {
  for (const file of [
    'common-object.schema.json', 'm2-record-types.schema.json', 'm3-record-types.schema.json',
    'm4-record-types.schema.json',
    'm5-record-types.schema.json',
    'm6-record-types.schema.json',
    'm7-record-types.schema.json',
    'm8-record-types.schema.json',
  ]) {
    const p = path.join(PLUGIN_ROOT, 'schemas', file);
    const data = await readJson(p);
    if (data) checked.push(path.relative(REPO_ROOT, p));
  }
  for (const file of [
    'build-index.mjs', 'run-lifecycle.mjs', 'legacy-ops-geo-import.mjs',
    'knowledge-query.mjs', 'workspace-init.mjs', 'workspace-validate.mjs',
    'diagnosis.mjs', 'collect-public-site.mjs', 'prepare-public-site-m4-inputs.mjs',
    'check-doc-links.mjs',
    'browser-query-result.mjs',
    'answer-cycle.mjs',
    'geo-lifecycle.mjs', 'geo-analytics.mjs', 'geo-strategy-discovery.mjs',
    'geo-analytics-readonly.mjs', 'geo-readiness.mjs', 'geo-conformance.mjs',
  ]) {
    const p = path.join(PLUGIN_ROOT, 'scripts', file);
    try {
      await readFile(p, 'utf8');
      checked.push(path.relative(REPO_ROOT, p));
    } catch {
      fail(`运行脚本缺失: ${path.relative(REPO_ROOT, p)}`);
    }
  }
  for (const file of [
    'knowledge-query.mjs', 'knowledge-trace.mjs',
    'diagnosis-io.mjs', 'diagnosis-profile.mjs', 'diagnosis-trace.mjs',
    'site-audit.mjs', 'research-input.mjs', 'asset-proposal.mjs',
    'public-site-collection-plan.mjs', 'public-site-collector.mjs',
    'public-site-m4-inputs.mjs',
    'answer-profile.mjs', 'answer-run.mjs', 'answer-sample.mjs',
    'answer-manual.mjs', 'manual-baseline-batch.mjs', 'manual-review-batch.mjs',
    'manual-aggregation-batch.mjs',
    'm5-policy.mjs', 'source-batch.mjs',
    'source-registry.mjs', 'citation-analysis.mjs', 'answer-review.mjs',
    'answer-aggregation.mjs', 'answer-cycle.mjs',
    'm6-profile.mjs', 'workspace-scope.mjs',
    'analytics-observation-inputs.mjs', 'real-analytics-materializer.mjs',
    'business-file-materializer.mjs', 'lifecycle-readiness.mjs', 'conformance.mjs',
    'cycle-snapshot.mjs', 'cycle-lock.mjs', 'cycle-gates.mjs',
    'cycle-lifecycle.mjs', 'analytics-cycle.mjs', 'cycle-trace.mjs',
    'strategy-assessment.mjs', 'decision-dimension.mjs',
    'strategy-output.mjs', 'strategy-profile.mjs', 'strategy-trace.mjs',
    'strategy-workflow.mjs', 'cycle-goal-candidates.mjs',
    'cycle-goal-selection.mjs', 'cycle-two.mjs', 'cycle-two-workspace.mjs',
    'cycle-two-proposal.mjs', 'cycle-two-apply.mjs',
    'browser-query-result.mjs', 'plugin-mcp-config.mjs',
  ]) {
    const p = path.join(PLUGIN_ROOT, 'scripts', 'lib', file);
    try {
      await readFile(p, 'utf8');
      checked.push(path.relative(REPO_ROOT, p));
    } catch {
      fail(`运行库缺失: ${path.relative(REPO_ROOT, p)}`);
    }
  }
  for (const file of [
    'playwright-base.mjs',
    'platforms/chatgpt.mjs', 'platforms/gemini.mjs',
    'platforms/perplexity.mjs', 'platforms/google-ai.mjs',
    'platforms/claude.mjs', 'platforms/index.mjs',
  ]) {
    const p = path.join(PLUGIN_ROOT, 'scripts', 'collectors', file);
    try {
      await readFile(p, 'utf8');
      checked.push(path.relative(REPO_ROOT, p));
    } catch {
      fail(`Collector 模块缺失: ${path.relative(REPO_ROOT, p)}`);
    }
  }
  const rootPackage = await readJson(path.join(REPO_ROOT, 'package.json'));
  if (rootPackage) {
    if (rootPackage.dependencies?.['gray-matter'] !== '4.0.3') {
      fail('package.json: gray-matter 必须锁定为 4.0.3');
    }
    if (rootPackage.dependencies?.ajv !== '8.20.0') {
      fail('package.json: ajv 必须锁定为 8.20.0');
    }
    checked.push('package.json');
  }
}

await checkManifests();
await checkMcpConfig();
await checkSkills();
await checkMarketplaces();
await checkTemplates();
await checkRuntime();

if (violations.length > 0) {
  console.error(JSON.stringify({ ok: false, violations }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, checked }, null, 2));
