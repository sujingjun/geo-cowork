#!/usr/bin/env node
// validate-plugin.mjs — 插件包契约自检（Spec 0001 §6—§7）
// 在仓库任意目录运行均可；契约相对插件根与仓库根解析。
// 退出码：0 合规；1 存在违规
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PLUGIN_ROOT, '..', '..');

const MANIFESTS = ['.codex-plugin', '.claude-plugin', '.codebuddy-plugin'].map((d) =>
  path.join(PLUGIN_ROOT, d, 'plugin.json'),
);
const MARKETPLACES = [
  '.agents/plugins/marketplace.json',
  '.claude-plugin/marketplace.json',
  '.codebuddy-plugin/marketplace.json',
].map((p) => path.join(REPO_ROOT, p));

const violations = [];
const checked = [];

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
      for (const forbidden of ['mcpServers', 'apps', 'hooks']) {
        if (forbidden in data) fail(`${rel}: 本阶段禁止字段 ${forbidden}`);
      }
    }
    manifests.push({ rel, data });
  }
  const versions = new Set(manifests.map((m) => m.data.version));
  if (versions.size > 1) {
    fail(`三个 Manifest 版本不一致: ${[...versions].join(', ')}`);
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
}

await checkManifests();
await checkSkills();
await checkMarketplaces();
await checkTemplates();

if (violations.length > 0) {
  console.error(JSON.stringify({ ok: false, violations }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, checked }, null, 2));
