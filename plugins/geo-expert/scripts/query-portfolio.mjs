#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQueryImport, ingestQueryInputs, collectGscQueries, generateKnowledgeQueries } from './lib/query-inputs.mjs';

import {
  assemblePortfolioQuerySet,
  intakeQueryPortfolio,
  prefreezeQuerySet,
  reportQueryPortfolio,
  validateQueryPortfolioWorkspace,
} from './lib/query-portfolio.mjs';

const COMMAND_FLAGS = {
  import: new Set(['workspace', 'goal', 'file', 'text', 'format', 'language', 'owner']),
  'collect-gsc': new Set(['workspace', 'goal', 'site', 'start', 'end', 'output']),
  generate: new Set(['workspace', 'goal', 'knowledge', 'clues', 'count', 'provider', 'model']),
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
    if (args.command === 'import') {
      const raw = args.file ? await readFile(path.resolve(args.file), 'utf8') : args.text;
      if (!raw || !args.goal) throw new Error('import requires goal and file/text');
      const format = args.format ?? (args.file ? path.extname(args.file).slice(1) : 'txt');
      const entries = parseQueryImport(raw, format, args.language);
      result = await ingestQueryInputs({ workspace, goal: args.goal, entries, raw, owner: args.owner,
        sourceKind: 'manual_import', sourceDetail: { filename: args.file ? path.basename(args.file) : null, format } });
    } else if (args.command === 'collect-gsc') {
      const report = await collectGscQueries({ workspace, site: args.site, start: args.start, end: args.end, outputDir: args.output });
      result = { status: report.status, rows: report.rows.length, input_path: report.input_path, error: report.error };
      if (report.status === 'completed' && args.goal) result.intake = await ingestQueryInputs({ workspace, goal: args.goal,
        entries: parseQueryImport(JSON.stringify(report.rows), 'json'), raw: report, sourceKind: 'gsc_search_query',
        sourceDetail: { site: report.site, window: report.window, coverage: report.coverage } });
      if (['failed', 'partial'].includes(report.status)) process.exitCode = 1;
    } else if (args.command === 'generate') {
      result = await generateKnowledgeQueries({ workspace, goal: args.goal, knowledgeFiles: (args.knowledge ?? '').split(',').filter(Boolean),
        clues: args.clues ? JSON.parse(await readFile(path.resolve(args.clues), 'utf8')) : [],
        count: Number(args.count ?? 6), provider: args.provider, model: args.model });
    } else if (args.command === 'intake') {
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
