#!/usr/bin/env node
import {
  lstat,
  readFile,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ENTRIES = ['README.md', 'AGENTS.md', 'CHANGELOG.md', 'docs'];
const EXTERNAL_SCHEMES = /^(?:https?:|mailto:|workspace:|repo:|fixture:|app:)/i;

async function optionalStat(target) {
  try {
    return await lstat(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function markdownFiles(root, entries, errors) {
  const files = [];
  async function visit(target, relative) {
    const stat = await optionalStat(target);
    if (!stat) {
      errors.push({ file: relative, line: 0, target: relative, code: 'ENTRY_MISSING' });
      return;
    }
    if (stat.isSymbolicLink()) {
      errors.push({ file: relative, line: 0, target: relative, code: 'SYMLINK_NOT_ALLOWED' });
      return;
    }
    if (stat.isDirectory()) {
      const children = await readdir(target, { withFileTypes: true });
      children.sort((left, right) => left.name.localeCompare(right.name));
      for (const child of children) {
        await visit(path.join(target, child.name), path.posix.join(relative, child.name));
      }
    } else if (stat.isFile() && target.endsWith('.md')) {
      files.push({ absolute: target, relative });
    }
  }
  for (const entry of entries) {
    if (typeof entry !== 'string' || entry.length === 0 || path.isAbsolute(entry)) {
      throw new Error('entries 必须是非空仓库相对路径');
    }
    const absolute = path.resolve(root, entry);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
      throw new Error('entry 逃逸 root');
    }
    await visit(absolute, entry.split(path.sep).join('/'));
  }
  return files;
}

function targetsByLine(text) {
  const targets = [];
  let fence = null;
  for (const [index, original] of text.split(/\r?\n/).entries()) {
    const marker = original.match(/^\s*(```+|~~~+)/)?.[1]?.slice(0, 3);
    if (marker) {
      fence = fence === marker ? null : fence ?? marker;
      continue;
    }
    if (fence) continue;
    const line = original.replace(/`[^`]*`/g, '');
    const inline = /!?\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)/g;
    for (const match of line.matchAll(inline)) {
      targets.push({ line: index + 1, target: match[1].replace(/^<|>$/g, '') });
    }
    const reference = line.match(/^\s*\[[^\]]+\]:\s*(<[^>]+>|\S+)/);
    if (reference) {
      targets.push({ line: index + 1, target: reference[1].replace(/^<|>$/g, '') });
    }
  }
  return targets;
}

function localTarget(root, sourceFile, target) {
  if (!target || target.startsWith('#') || EXTERNAL_SCHEMES.test(target)) return null;
  const withoutFragment = target.split('#', 1)[0].split('?', 1)[0];
  if (!withoutFragment) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    decoded = withoutFragment;
  }
  return decoded.startsWith('/')
    ? path.resolve(root, decoded.slice(1))
    : path.resolve(path.dirname(sourceFile), decoded);
}

export async function checkMarkdownLinks({
  root,
  entries = DEFAULT_ENTRIES,
}) {
  const resolvedRoot = path.resolve(root);
  const errors = [];
  const files = await markdownFiles(resolvedRoot, entries, errors);
  let checkedLinks = 0;
  for (const file of files) {
    const text = await readFile(file.absolute, 'utf8');
    for (const item of targetsByLine(text)) {
      const target = localTarget(resolvedRoot, file.absolute, item.target);
      if (!target) continue;
      checkedLinks += 1;
      if (target !== resolvedRoot && !target.startsWith(`${resolvedRoot}${path.sep}`)) {
        errors.push({
          file: file.relative,
          line: item.line,
          target: item.target,
          code: 'LINK_TARGET_ESCAPE',
        });
      } else if (!(await optionalStat(target))) {
        errors.push({
          file: file.relative,
          line: item.line,
          target: item.target,
          code: 'LINK_TARGET_MISSING',
        });
      }
    }
  }
  errors.sort((left, right) => left.file.localeCompare(right.file)
    || left.line - right.line || left.target.localeCompare(right.target));
  return { ok: errors.length === 0, checked_files: files.length, checked_links: checkedLinks, errors };
}

function parseArgs(argv) {
  const args = { entries: DEFAULT_ENTRIES };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[++index];
    if (!value) throw new Error(`${token} 缺少值`);
    if (token === '--root') args.root = value;
    else if (token === '--entries') args.entries = value.split(',').filter(Boolean);
    else throw new Error(`未知参数: ${token}`);
  }
  return args;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await checkMarkdownLinks({
      root: args.root ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..'),
      entries: args.entries,
    });
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({ error: 'INVALID_ARGUMENT', message: error.message }));
    process.exitCode = 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

