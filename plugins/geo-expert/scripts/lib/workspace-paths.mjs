import { createHash, randomBytes } from 'node:crypto';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

export class WorkspacePathError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'WorkspacePathError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function stableStringify(value, spacing = 0) {
  return `${JSON.stringify(canonicalize(value), null, spacing)}${spacing ? '\n' : ''}`;
}

export function assertSafeRelativePath(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new WorkspacePathError('PATH_ESCAPE', '路径必须是非空相对路径');
  }
  if (relativePath.includes('\\') || path.posix.isAbsolute(relativePath)) {
    throw new WorkspacePathError('PATH_ESCAPE', '路径不是安全的工作区相对路径');
  }
  const parts = relativePath.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new WorkspacePathError('PATH_ESCAPE', '路径包含不允许的段');
  }
  return parts.join('/');
}

export function resolveWithin(workspace, relativePath) {
  const root = path.resolve(workspace);
  const safe = assertSafeRelativePath(relativePath);
  const target = path.resolve(root, ...safe.split('/'));
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw new WorkspacePathError('PATH_ESCAPE', '路径逃逸工作区');
  }
  return target;
}

async function maybeLstat(target) {
  try {
    return await lstat(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export async function assertNoSymlinkPath(workspace, relativePath, { allowMissingLeaf = false } = {}) {
  const root = path.resolve(workspace);
  const rootStat = await maybeLstat(root);
  if (!rootStat) throw new WorkspacePathError('WORKSPACE_NOT_FOUND', '工作区不存在');
  if (rootStat.isSymbolicLink()) {
    throw new WorkspacePathError('SYMLINK_NOT_ALLOWED', '工作区根不能是符号链接');
  }
  const safe = assertSafeRelativePath(relativePath);
  let current = root;
  for (const [index, part] of safe.split('/').entries()) {
    current = path.join(current, part);
    const stat = await maybeLstat(current);
    if (!stat) {
      if (allowMissingLeaf) return;
      throw new WorkspacePathError('PATH_NOT_FOUND', '工作区内路径不存在', { path: safe });
    }
    if (stat.isSymbolicLink()) {
      throw new WorkspacePathError('SYMLINK_NOT_ALLOWED', '工作区对象路径不能包含符号链接', {
        path: safe,
      });
    }
    if (index < safe.split('/').length - 1 && !stat.isDirectory()) {
      throw new WorkspacePathError('PATH_NOT_FOUND', '路径父级不是目录', { path: safe });
    }
  }
}

export async function walkMarkdownFiles(workspace, { ignore = () => false } = {}) {
  const root = path.resolve(workspace);
  const files = [];
  async function visit(relativeDir) {
    const absoluteDir = relativeDir ? resolveWithin(root, relativeDir) : root;
    const dirStat = await lstat(absoluteDir);
    if (dirStat.isSymbolicLink()) {
      throw new WorkspacePathError('SYMLINK_NOT_ALLOWED', '扫描目录不能是符号链接', {
        path: relativeDir,
      });
    }
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const relative = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      if (ignore(relative, entry)) continue;
      const target = resolveWithin(root, relative);
      const stat = await lstat(target);
      if (stat.isSymbolicLink()) {
        throw new WorkspacePathError('SYMLINK_NOT_ALLOWED', '扫描路径不能包含符号链接', {
          path: relative,
        });
      }
      if (stat.isDirectory()) await visit(relative);
      else if (stat.isFile() && entry.name.endsWith('.md')) files.push(target);
    }
  }
  await visit('');
  return files;
}

async function ensureSafeParent(workspace, relativePath) {
  const safe = assertSafeRelativePath(relativePath);
  const parent = path.posix.dirname(safe);
  if (parent !== '.') {
    await assertNoSymlinkPath(workspace, parent, { allowMissingLeaf: true });
    await mkdir(resolveWithin(workspace, parent), { recursive: true });
    await assertNoSymlinkPath(workspace, parent);
  }
  return safe;
}

export async function writeCreateOnly(
  workspace,
  relativePath,
  content,
  { idempotent = false, conflictCode = 'OBJECT_CONFLICT' } = {},
) {
  const safe = await ensureSafeParent(workspace, relativePath);
  const target = resolveWithin(workspace, safe);
  await assertNoSymlinkPath(workspace, safe, { allowMissingLeaf: true });
  try {
    await writeFile(target, content, { flag: 'wx' });
    return { action: 'created', path: safe };
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    await assertNoSymlinkPath(workspace, safe);
    if (idempotent) {
      const existing = await readFile(target);
      const requested = Buffer.isBuffer(content) ? content : Buffer.from(content);
      if (existing.equals(requested)) return { action: 'kept', path: safe };
    }
    throw new WorkspacePathError(conflictCode, '目标已存在且内容不同', { path: safe });
  }
}

export async function atomicWrite(workspace, relativePath, content) {
  const safe = await ensureSafeParent(workspace, relativePath);
  const target = resolveWithin(workspace, safe);
  await assertNoSymlinkPath(workspace, safe, { allowMissingLeaf: true });
  const temporary = `${safe}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  const temporaryTarget = resolveWithin(workspace, temporary);
  try {
    await writeFile(temporaryTarget, content, { flag: 'wx' });
    await rename(temporaryTarget, target);
  } catch (error) {
    await rm(temporaryTarget, { force: true });
    throw error;
  }
  return safe;
}
