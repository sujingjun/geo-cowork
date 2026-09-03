#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadReceivedBrowserResult,
  materializeBrowserIntakeSample,
} from './lib/browser-query-result.mjs';

function invalid(message) {
  const error = new Error(message);
  error.code = 'INVALID_ARGUMENT';
  return error;
}

export function parseBrowserQueryResultArgs(argv) {
  const [command, ...rest] = argv;
  if (!['verify', 'materialize-fixture'].includes(command)) {
    throw invalid('command 必须是 verify 或 materialize-fixture');
  }
  const args = { command };
  const allowed = new Set(['workspace', 'manifest', 'plan', 'sample']);
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!flag.startsWith('--') || !allowed.has(flag.slice(2))) throw invalid(`未知参数: ${flag}`);
    const value = rest[++index];
    if (!value || value.startsWith('--')) throw invalid(`参数缺值: ${flag}`);
    args[flag.slice(2)] = value;
  }
  if (!args.workspace || !args.manifest) throw invalid('缺少 --workspace 或 --manifest');
  if (command === 'materialize-fixture' && (!args.plan || !args.sample)) {
    throw invalid('materialize-fixture 还需要 --plan 与 --sample');
  }
  return args;
}

async function readJson(file) {
  return JSON.parse(await readFile(path.resolve(file), 'utf8'));
}

async function main() {
  try {
    const args = parseBrowserQueryResultArgs(process.argv.slice(2));
    const workspace = path.resolve(args.workspace);
    const bundle = await loadReceivedBrowserResult({
      workspace,
      manifestPath: args.manifest,
    });
    let materialized = null;
    if (args.command === 'materialize-fixture') {
      materialized = await materializeBrowserIntakeSample({
        workspace,
        bundle,
        plan: await readJson(args.plan),
        sample: await readJson(args.sample),
      });
    }
    console.log(JSON.stringify({
      ok: true,
      result_id: bundle.manifest.result_id,
      manifest_sha256: bundle.manifest_file_sha256,
      ...(materialized ? {
        materialized: { id: materialized.id, action: materialized.action },
      } : {}),
    }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      ok: false,
      code: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
    }));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
