#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { collectPublicSite } from './lib/public-site-collector.mjs';

const ALLOWED_ARGS = new Set(['workspace', 'plan', 'now']);

export function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`未知参数: ${token}`);
    const key = token.slice(2);
    if (!ALLOWED_ARGS.has(key)) throw new Error(`未知参数: ${token}`);
    if (key in args) throw new Error(`重复参数: ${token}`);
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`${token} 缺少值`);
    args[key] = value;
  }
  if (!args.workspace || !args.plan) throw new Error('缺少 --workspace 或 --plan');
  return args;
}

export async function execute(args) {
  const planPath = path.resolve(args.plan);
  const plan = JSON.parse(await readFile(planPath, 'utf8'));
  return collectPublicSite({
    workspace: path.resolve(args.workspace),
    plan,
    now: args.now ?? new Date().toISOString(),
  });
}

async function main() {
  try {
    console.log(JSON.stringify(await execute(parseArgs(process.argv.slice(2))), null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
      details: Object.fromEntries(
        ['attempts', 'fields', 'from', 'path', 'status', 'target', 'to', 'url']
          .filter((key) => error[key] !== undefined)
          .map((key) => [key, error[key]]),
      ),
    }));
    const conflicts = new Set(['COLLECTION_CONFLICT', 'PARTIAL_ARTIFACT']);
    process.exitCode = conflicts.has(error.code) ? 3 : error.code ? 1 : 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

