#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assessLifecycleReadiness } from './lib/lifecycle-readiness.mjs';

function invalid(message) {
  return Object.assign(new Error(message), { code: 'INVALID_ARGUMENT' });
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...rest] = argv;
  if (command !== 'report') throw invalid('唯一支持的 command 是 report');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!['--workspace', '--knowledge-base', '--goal'].includes(flag)) {
      throw invalid(`未知参数: ${flag}`);
    }
    const value = rest[++index];
    if (!value || value.startsWith('--')) throw invalid(`${flag} 缺少值`);
    args[flag.slice(2)] = value;
  }
  if (!args.workspace || !args['knowledge-base'] || !args.goal) {
    throw invalid('缺少 --workspace、--knowledge-base 或 --goal');
  }
  return args;
}

async function execute(args) {
  return assessLifecycleReadiness({
    workspace: path.resolve(args.workspace),
    knowledgeBaseRef: args['knowledge-base'],
    goalRef: args.goal,
  });
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('geo-readiness report --workspace <path> --knowledge-base <KBASE-ID> --goal <GOAL-ID>');
      return;
    }
    console.log(JSON.stringify(await execute(args), null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.code ?? 'READINESS_FAILED', message: error.message }));
    process.exitCode = error.code === 'INVALID_ARGUMENT' ? 2 : 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };
