#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildPublicSiteM4Inputs } from './lib/public-site-m4-inputs.mjs';

const ALLOWED_ARGS = new Set(['workspace', 'summary', 'mapping']);

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`未知参数: ${token}`);
    const key = token.slice(2);
    if (!ALLOWED_ARGS.has(key)) throw new Error(`未知参数: ${token}`);
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`${token} 缺少值`);
    args[key] = value;
  }
  if (!args.workspace || !args.summary || !args.mapping) {
    throw new Error('缺少 --workspace、--summary 或 --mapping');
  }
  return args;
}

async function execute(args) {
  const workspace = path.resolve(args.workspace);
  const mapping = JSON.parse(await readFile(path.resolve(args.mapping), 'utf8'));
  return buildPublicSiteM4Inputs({
    workspace,
    collectionSummaryPath: args.summary,
    mapping,
  });
}

async function main() {
  try {
    console.log(JSON.stringify(await execute(parseArgs(process.argv.slice(2))), null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
    }));
    process.exitCode = error.code === 'M4_INPUT_CONFLICT' ? 3 : error.code ? 1 : 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };

