#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { importLegacyOpsGeo } from './lib/legacy-ops-geo.mjs';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (['--workspace', '--input', '--namespace', '--now'].includes(key)) {
      args[key.slice(2)] = argv[++index] ?? null;
    } else throw new Error(`未知参数: ${key}`);
  }
  for (const required of ['workspace', 'input', 'namespace']) {
    if (!args[required]) throw new Error(`缺少 --${required}`);
  }
  return args;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await importLegacyOpsGeo({
      workspace: path.resolve(args.workspace),
      inputPath: path.resolve(args.input),
      namespace: args.namespace,
      now: args.now ?? new Date().toISOString(),
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.code ?? 'INVALID_ARGUMENT', message: error.message }));
    const pathError = ['PATH_ESCAPE', 'WORKSPACE_NOT_FOUND', 'INPUT_NOT_FOUND', 'INVALID_NAMESPACE', 'ENOENT']
      .includes(error.code);
    process.exit(error.code === 'IMPORT_CONFLICT' ? 3 : pathError ? 2 : error.code ? 1 : 2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
