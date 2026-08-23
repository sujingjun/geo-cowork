#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildIndexes } from './lib/index-builder.mjs';

function parseArgs(argv) {
  const args = { workspace: null, check: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--workspace') args.workspace = argv[++index] ?? null;
    else if (argv[index] === '--check') args.check = true;
    else throw new Error(`未知参数: ${argv[index]}`);
  }
  if (!args.workspace) throw new Error('缺少 --workspace');
  return args;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await buildIndexes({ workspace: path.resolve(args.workspace), write: !args.check });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
      diagnostics: error.diagnostics ?? [],
    }, null, 2));
    process.exit(['PATH_ESCAPE', 'WORKSPACE_NOT_FOUND', 'ENOENT'].includes(error.code) ? 2 : error.code ? 1 : 2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
