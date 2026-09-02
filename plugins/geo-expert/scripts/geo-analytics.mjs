#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  computeBusinessSignal,
  ingestFixtureObservation,
  materializeObservationEvidence,
} from './lib/analytics-cycle.mjs';

const COMMANDS = new Set([
  'ingest-fixture', 'compute-signals', 'materialize-evidence', 'ingest-business-file',
]);

function invalid(message) {
  const error = new Error(message);
  error.code = 'INVALID_ARGUMENT';
  return error;
}

function assertNetworkDisabled() {
  if (process.env.GEO_M6_NETWORK_DISABLED !== '1') {
    const error = new Error('M6 离线 CLI 要求 GEO_M6_NETWORK_DISABLED=1');
    error.code = 'NETWORK_GUARD_REQUIRED';
    throw error;
  }
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw invalid('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!flag.startsWith('--')) throw invalid(`未知参数: ${flag}`);
    args[flag.slice(2)] = rest[++index] ?? null;
  }
  if (!args.workspace) throw invalid('缺少 --workspace');
  if (!args.plan) throw invalid('缺少 --plan');
  return args;
}

async function readPlan(file) {
  try {
    return JSON.parse(await readFile(path.resolve(file), 'utf8'));
  } catch {
    throw invalid('plan 无法读取或不是合法 JSON');
  }
}

async function execute(args) {
  const workspace = path.resolve(args.workspace);
  const plan = await readPlan(args.plan);
  if (args.command === 'ingest-business-file') {
    const { materializeBusinessFileBundle } = await import('./lib/business-file-materializer.mjs');
    return { ...(await materializeBusinessFileBundle({ workspace, plan })), network_accessed: false };
  }
  if (args.command === 'ingest-fixture') {
    return { ...(await ingestFixtureObservation({ workspace, plan })), network_accessed: false };
  }
  if (args.command === 'compute-signals') {
    return { ...(await computeBusinessSignal({ workspace, plan })), network_accessed: false };
  }
  return { ...(await materializeObservationEvidence({ workspace, plan })), network_accessed: false };
}

function exitCode(error) {
  if (error.code === 'INVALID_ARGUMENT') return 2;
  if (['OBJECT_CONFLICT', 'ANALYTICS_ARTIFACT_CONFLICT'].includes(error.code)) return 3;
  return 1;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('geo-analytics commands: ingest-fixture compute-signals materialize-evidence ingest-business-file');
      return;
    }
    assertNetworkDisabled();
    console.log(JSON.stringify(await execute(args), null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'M6_ANALYTICS_FAILED',
      message: error.message,
      diagnostics: error.diagnostics ?? [],
    }));
    process.exitCode = exitCode(error);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };
