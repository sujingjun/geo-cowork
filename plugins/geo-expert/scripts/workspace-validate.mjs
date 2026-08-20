#!/usr/bin/env node
// workspace-validate.mjs — 校验 GEO 品牌工作区结构（Spec 0002 §6）
// 退出码：0 合规；1 缺失或错误；2 参数非法或找不到工作区
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REQUIRED_DIRS, REQUIRED_FILES } from './workspace-init.mjs';

const ID_PATTERN = /^ws_[a-z0-9]{26}$/;
const IDENTITY_FIELDS = ['schema_version', 'workspace_id', 'brand', 'created_at', 'created_by'];

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function findUp(start) {
  let dir = path.resolve(start);
  for (;;) {
    if (await isFile(path.join(dir, 'workspace.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export async function validateWorkspace(root) {
  const missing = [];
  const errors = [];

  for (const dir of REQUIRED_DIRS) {
    if (!(await isDir(path.join(root, dir)))) missing.push(`${dir}/`);
  }
  for (const file of REQUIRED_FILES) {
    if (!(await isFile(path.join(root, file)))) missing.push(file);
  }

  const wsJsonPath = path.join(root, 'workspace.json');
  if (await isFile(wsJsonPath)) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(wsJsonPath, 'utf8'));
    } catch (err) {
      errors.push(`workspace.json 无法解析: ${err.message}`);
      parsed = null;
    }
    if (parsed) {
      for (const field of IDENTITY_FIELDS) {
        if (!(field in parsed)) errors.push(`workspace.json 缺少必需字段: ${field}`);
      }
      if (parsed.workspace_id && !ID_PATTERN.test(parsed.workspace_id)) {
        errors.push(`workspace_id 格式非法: ${parsed.workspace_id}`);
      }
    }
  }

  return { workspace: root, ok: missing.length === 0 && errors.length === 0, missing, errors };
}

async function main() {
  const argv = process.argv.slice(2);
  let workspace = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--workspace') {
      workspace = argv[++i] ?? null;
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      console.log('用法: node workspace-validate.mjs [--workspace <path>]');
      process.exit(0);
    } else {
      console.error(JSON.stringify({ error: `未知参数: ${argv[i]}` }));
      process.exit(2);
    }
  }

  let root;
  if (workspace) {
    root = path.resolve(workspace);
    if (!(await isDir(root))) {
      console.error(JSON.stringify({ error: `工作区目录不存在: ${root}` }));
      process.exit(2);
    }
  } else {
    root = await findUp(process.cwd());
    if (!root) {
      console.error(JSON.stringify({ error: '未指定 --workspace，且从当前目录向上未找到 workspace.json' }));
      process.exit(2);
    }
  }

  const result = await validateWorkspace(root);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
