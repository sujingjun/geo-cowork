#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  assembleKnowledgeRelease,
  assembleQuerySet,
  proposeKnowledge,
  traceQuery,
  validateKnowledgeWorkspace,
} from './lib/knowledge-query.mjs';

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const allowed = ['propose', 'assemble-release', 'assemble-query-set', 'validate', 'trace'];
  if (!allowed.includes(command)) throw new Error('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith('--')) throw new Error(`未知参数: ${key}`);
    args[key.slice(2)] = rest[++index] ?? null;
  }
  if (!args.workspace) throw new Error('缺少 --workspace');
  return args;
}

async function planFrom(file) {
  if (!file) throw new Error('缺少 --plan');
  return JSON.parse(await readFile(path.resolve(file), 'utf8'));
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const workspace = path.resolve(args.workspace);
    const now = args.now ?? new Date().toISOString();
    let result;
    if (args.command === 'propose') {
      result = await proposeKnowledge({ workspace, plan: await planFrom(args.plan), now });
    } else if (args.command === 'assemble-release') {
      result = await assembleKnowledgeRelease({ workspace, plan: await planFrom(args.plan), now });
    } else if (args.command === 'assemble-query-set') {
      result = await assembleQuerySet({ workspace, plan: await planFrom(args.plan), now });
    } else if (args.command === 'validate') {
      result = await validateKnowledgeWorkspace({ workspace });
      if (result.errors.length > 0) process.exitCode = 1;
    } else {
      if (!args.query) throw new Error('trace 缺少 --query');
      result = await traceQuery({ workspace, queryId: args.query });
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.code ?? 'INVALID_ARGUMENT', message: error.message }));
    const pathError = ['PATH_ESCAPE', 'WORKSPACE_NOT_FOUND', 'ENOENT'].includes(error.code);
    process.exit(error.code === 'OBJECT_CONFLICT' ? 3 : pathError ? 2 : error.code ? 1 : 2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
