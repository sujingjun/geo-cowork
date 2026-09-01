#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  assemblePortfolioQuerySet,
  intakeQueryPortfolio,
  prefreezeQuerySet,
  reportQueryPortfolio,
  validateQueryPortfolioWorkspace,
} from './lib/query-portfolio.mjs';

const COMMAND_FLAGS = {
  intake: new Set(['workspace', 'plan', 'now']),
  report: new Set(['workspace', 'goal', 'now']),
  assemble: new Set(['workspace', 'plan', 'now']),
  prefreeze: new Set(['workspace', 'query-set']),
  validate: new Set(['workspace']),
};

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const allowed = Object.keys(COMMAND_FLAGS);
  if (!allowed.includes(command)) throw new Error('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith('--')) throw new Error(`未知参数: ${key}`);
    const name = key.slice(2);
    if (!COMMAND_FLAGS[command].has(name)) throw new Error(`未知参数: ${key}`);
    const value = rest[++index];
    if (value === undefined || value === null || value.startsWith('--')) {
      throw new Error(`参数缺值: ${key}`);
    }
    if (args[name] !== undefined) throw new Error(`参数重复: ${key}`);
    args[name] = value;
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
    if (args.command === 'intake') {
      result = await intakeQueryPortfolio({ workspace, plan: await planFrom(args.plan), now });
    } else if (args.command === 'report') {
      result = await reportQueryPortfolio({ workspace, goalRef: args.goal, now });
    } else if (args.command === 'assemble') {
      result = await assemblePortfolioQuerySet({ workspace, plan: await planFrom(args.plan), now });
    } else if (args.command === 'prefreeze') {
      result = await prefreezeQuerySet({ workspace, querySetId: args['query-set'] });
      if (result.state !== 'frozen' && !result.ready) process.exitCode = 1;
      if (result.state === 'frozen' && !result.valid) process.exitCode = 1;
    } else {
      result = await validateQueryPortfolioWorkspace({ workspace });
      if (result.errors.length > 0) process.exitCode = 1;
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
      diagnostics: error.diagnostics ?? undefined,
    }));
    const pathError = ['PATH_ESCAPE', 'WORKSPACE_NOT_FOUND', 'ENOENT'].includes(error.code);
    process.exit(error.code === 'OBJECT_CONFLICT' || error.code === 'QP_REPORT_CONFLICT' ? 3
      : pathError ? 2 : error.code ? 1 : 2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
