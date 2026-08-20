#!/usr/bin/env node
// workspace-init.mjs — 幂等初始化 GEO 品牌工作区（Spec 0002 §5）
// 退出码：0 成功；2 参数非法；3 workspace.json 身份冲突
import { mkdir, open, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_DIR = path.join(PLUGIN_ROOT, 'assets', 'workspace-template');

export const REQUIRED_DIRS = [
  'queries',
  'knowledge',
  'site',
  'reputation',
  'answers',
  'competitors',
  'strategy',
  'execution',
  'runs',
  'cycles',
];

export const REQUIRED_FILES = ['README.md', 'STATUS.md', 'workspace.json'];

const IDENTITY_FIELDS = ['schema_version', 'workspace_id', 'brand', 'created_at', 'created_by'];

function parseArgs(argv) {
  const args = { workspace: null, brand: null, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--workspace') {
      args.workspace = argv[++i] ?? null;
    } else if (arg === '--brand') {
      args.brand = argv[++i] ?? null;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`未知参数: ${arg}`);
    }
  }
  if (args.workspace === '') throw new Error('--workspace 需要路径值');
  if (args.brand === '') throw new Error('--brand 需要名称值');
  return args;
}

function generateWorkspaceId() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(26);
  let id = 'ws_';
  for (const b of bytes) id += alphabet[b % alphabet.length];
  return id;
}

async function exists(p) {
  try {
    await open(p, 'r').then((f) => f.close());
    return true;
  } catch {
    return false;
  }
}

async function pluginVersion() {
  const manifest = JSON.parse(
    await readFile(path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json'), 'utf8'),
  );
  return manifest.version;
}

export async function initWorkspace({ workspace, brand, dryRun = false }) {
  const root = path.resolve(workspace ?? process.cwd());
  const brandName = brand ?? path.basename(root);
  const created = [];
  const kept = [];

  const wsJsonPath = path.join(root, 'workspace.json');
  let workspaceId;

  if (await exists(wsJsonPath)) {
    // 已存在身份文件：校验必需字段，身份保持不变（Spec 0002 §5.2.4）
    let parsed;
    try {
      parsed = JSON.parse(await readFile(wsJsonPath, 'utf8'));
    } catch (err) {
      const e = new Error(`workspace.json 无法解析: ${err.message}`);
      e.code = 'IDENTITY_CONFLICT';
      throw e;
    }
    const missing = IDENTITY_FIELDS.filter((f) => !(f in parsed));
    if (missing.length > 0) {
      const e = new Error(`workspace.json 缺少必需字段: ${missing.join(', ')}`);
      e.code = 'IDENTITY_CONFLICT';
      throw e;
    }
    workspaceId = parsed.workspace_id;
    kept.push('workspace.json');
  }

  if (dryRun) {
    for (const dir of REQUIRED_DIRS) {
      if (!(await exists(path.join(root, dir)))) created.push(`${dir}/`);
    }
    for (const file of REQUIRED_FILES) {
      if (file === 'workspace.json' && kept.includes('workspace.json')) continue;
      if (!(await exists(path.join(root, file)))) created.push(file);
      else if (!kept.includes(file)) kept.push(file);
    }
    return { workspace: root, dry_run: true, created, kept, workspace_id: workspaceId ?? null };
  }

  await mkdir(root, { recursive: true });

  for (const dir of REQUIRED_DIRS) {
    if (await exists(path.join(root, dir))) {
      kept.push(`${dir}/`);
    } else {
      await mkdir(path.join(root, dir), { recursive: true });
      created.push(`${dir}/`);
    }
  }

  if (!workspaceId) workspaceId = generateWorkspaceId();

  const replacements = {
    '{{BRAND}}': brandName,
    '{{WORKSPACE_ID}}': workspaceId,
    '{{CREATED_AT}}': new Date().toISOString(),
    '{{PLUGIN_VERSION}}': await pluginVersion(),
  };

  for (const file of REQUIRED_FILES) {
    if (kept.includes(file)) continue; // workspace.json 已存在并保留
    const target = path.join(root, file);
    const template = await readFile(path.join(TEMPLATE_DIR, file), 'utf8');
    const content = Object.entries(replacements).reduce(
      (text, [placeholder, value]) => text.replaceAll(placeholder, value),
      template,
    );
    try {
      // 'wx'：不存在才写入，并发下到者按已存在处理（Spec 0002 §7）
      await writeFile(target, content, { flag: 'wx' });
      created.push(file);
    } catch (err) {
      if (err.code === 'EEXIST') {
        kept.push(file);
      } else {
        throw err;
      }
    }
  }

  return { workspace: root, created, kept, workspace_id: workspaceId };
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(2);
  }
  if (args.help) {
    console.log('用法: node workspace-init.mjs [--workspace <path>] [--brand <name>] [--dry-run]');
    process.exit(0);
  }
  try {
    const result = await initWorkspace(args);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(err.code === 'IDENTITY_CONFLICT' ? 3 : 2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
