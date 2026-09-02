#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  collectReadonlySources,
  preflightReadonlyPlan,
  READONLY_SCOPES,
} from './lib/analytics-readonly.mjs';
import {
  stableStringify,
  writeCreateOnly,
} from './lib/workspace-paths.mjs';

const COMMANDS = new Set(['doctor', 'dry-run', 'smoke', 'collect-observe']);
const SCRIPT_FILE = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_FILE), '../../..');

function invalid(message) {
  return Object.assign(new Error(message), { code: 'INVALID_ARGUMENT' });
}

function printHelp() {
  console.log(`geo-analytics-readonly commands:
  doctor --workspace <path> --plan <json>
  dry-run --workspace <path> --plan <json>
  smoke --workspace <path> --plan <json> --output <path> --confirm-readonly
  collect-observe --workspace <path> --plan <json> --observation-plan <json> --confirm-readonly`);
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw invalid('缺少或非法 command');
  const args = { command, confirmReadonly: false };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (flag === '--confirm-readonly') {
      args.confirmReadonly = true;
      continue;
    }
    if (!['--workspace', '--plan', '--output', '--observation-plan'].includes(flag)) {
      throw invalid(`未知参数: ${flag}`);
    }
    const value = rest[++index];
    if (!value || value.startsWith('--')) throw invalid(`${flag} 缺少值`);
    args[flag.slice(2)] = value;
  }
  if (!args.workspace || !args.plan) throw invalid('缺少 --workspace 或 --plan');
  if (command === 'smoke' && !args.output) throw invalid('smoke 缺少 --output');
  if (command === 'collect-observe' && !args['observation-plan']) {
    throw invalid('collect-observe 缺少 --observation-plan');
  }
  return args;
}

async function readPlan(planPath) {
  try {
    return JSON.parse(await readFile(path.resolve(planPath), 'utf8'));
  } catch {
    throw invalid('plan 无法读取或不是合法 JSON');
  }
}

async function createGoogleRequester() {
  let client;
  try {
    const { GoogleAuth } = await import('google-auth-library');
    const auth = new GoogleAuth({ scopes: [...READONLY_SCOPES] });
    client = await auth.getClient();
    await client.getAccessToken();
  } catch {
    throw Object.assign(
      new Error('Google Application Default Credentials 不可用'),
      { code: 'READONLY_ADC_UNAVAILABLE' },
    );
  }
  return async (source, request) => {
    const expectedHost = source === 'ga4'
      ? 'analyticsdata.googleapis.com'
      : 'www.googleapis.com';
    if (new URL(request.url).hostname !== expectedHost
        || !READONLY_SCOPES.includes(request.scope)) {
      throw Object.assign(
        new Error(`${source} host/scope 不在只读 allowlist`),
        { code: 'READONLY_SCOPE_FORBIDDEN' },
      );
    }
    try {
      const response = await client.request({
        url: request.url,
        method: request.method,
        data: request.body,
        timeout: 20_000,
        retry: false,
      });
      return response.data;
    } catch (error) {
      const status = error.response?.status ?? null;
      const code = status === 401
        ? 'READONLY_ADC_UNAVAILABLE'
        : status === 403
          ? 'READONLY_API_FORBIDDEN'
          : 'READONLY_API_FAILED';
      throw Object.assign(
        new Error(`${source} 只读请求失败${status ? ` (HTTP ${status})` : ''}`),
        { code },
      );
    }
  };
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function checkCredentialPrerequisites() {
  const adcCandidate = process.env.GOOGLE_APPLICATION_CREDENTIALS
    || (process.platform === 'win32' && process.env.APPDATA
      ? path.join(process.env.APPDATA, 'gcloud', 'application_default_credentials.json')
      : path.join(os.homedir(), '.config', 'gcloud', 'application_default_credentials.json'));
  const executable = process.platform === 'win32' ? 'gcloud.cmd' : 'gcloud';
  const gcloudCandidates = (process.env.PATH ?? '')
    .split(path.delimiter)
    .filter(Boolean)
    .map((entry) => path.join(entry, executable));
  let libraryAvailable = true;
  try {
    await import('google-auth-library');
  } catch {
    libraryAvailable = false;
  }
  return {
    adc_available: await exists(adcCandidate),
    gcloud_available: (await Promise.all(gcloudCandidates.map(exists))).some(Boolean),
    google_auth_library_available: libraryAvailable,
  };
}

async function writeSmokeResult(output, value) {
  const relative = path.relative(REPO_ROOT, output).split(path.sep).join('/');
  return writeCreateOnly(REPO_ROOT, relative, stableStringify(value, 2), {
    idempotent: true,
    conflictCode: 'READONLY_OUTPUT_CONFLICT',
  });
}

async function execute(args, dependencies = {}) {
  const workspace = path.resolve(args.workspace);
  const plan = await readPlan(args.plan);
  const now = dependencies.now ?? new Date();
  const preflight = await preflightReadonlyPlan({ workspace, plan, now });
  if (args.command === 'dry-run') {
    return {
      mode: 'dry-run',
      run_id: plan.run_id,
      authorization_sha256: preflight.authorization_sha256,
      requests: preflight.requests,
      credential_accessed: false,
      network_accessed: false,
    };
  }
  if (args.command === 'doctor') {
    const checkCredentials = dependencies.checkCredentials ?? checkCredentialPrerequisites;
    return {
      mode: 'doctor',
      run_id: plan.run_id,
      authorization_ready: true,
      ...(await checkCredentials()),
      credential_content_read: false,
      network_accessed: false,
    };
  }
  if (['smoke', 'collect-observe'].includes(args.command)
      && (!args.confirmReadonly
        || (dependencies.realReadEnabled ?? process.env.GEO_ANALYTICS_REAL_READ === '1') !== true)) {
    throw Object.assign(
      new Error('真实读取同时要求 --confirm-readonly 与 GEO_ANALYTICS_REAL_READ=1'),
      { code: 'READONLY_NETWORK_CONFIRMATION_REQUIRED' },
    );
  }
  if (args.command === 'smoke' || args.command === 'collect-observe') {
    if (args.command === 'collect-observe') {
      const createRequester = dependencies.createRequester ?? createGoogleRequester;
      const request = await createRequester([...READONLY_SCOPES]);
      const result = await collectReadonlySources({ plan, request, now });
      const observationPlan = await readPlan(args['observation-plan']);
      const materialize = dependencies.materializeResult
        ?? (await import('./lib/real-analytics-materializer.mjs')).materializeRealAnalyticsBundle;
      const bundle = await materialize({ workspace, readonlyPlan: plan, result, plan: observationPlan });
      return {
        mode: 'collect-observe',
        ...bundle,
        credential_accessed: true,
        network_accessed: true,
      };
    }
    const output = path.resolve(args.output);
    const allowedRoot = path.join(REPO_ROOT, 'tmp', 'geo-analytics', plan.run_id);
    if (!output.startsWith(`${allowedRoot}${path.sep}`) || path.extname(output) !== '.json') {
      throw Object.assign(
        new Error('output 必须位于当前 Run 的 tmp/geo-analytics 目录且使用 .json'),
        { code: 'READONLY_OUTPUT_FORBIDDEN' },
      );
    }
    const createRequester = dependencies.createRequester ?? createGoogleRequester;
    const request = await createRequester([...READONLY_SCOPES]);
    const result = await collectReadonlySources({ plan, request, now });
    const writeResult = dependencies.writeResult ?? writeSmokeResult;
    const write = await writeResult(output, result);
    return {
      mode: 'smoke',
      run_id: plan.run_id,
      output: path.relative(REPO_ROOT, output).split(path.sep).join('/'),
      output_action: write.action,
      sources: Object.fromEntries(Object.entries(result.sources).map(([source, value]) => [
        source,
        {
          status: value.status,
          row_count: value.row_count,
          response_checksum: value.response_checksum,
        },
      ])),
      quality: result.quality,
      causal_claim: false,
      persisted_to_workspace: false,
      credential_accessed: true,
      network_accessed: true,
    };
  }
  throw Object.assign(new Error(`${args.command} 尚未实现`), { code: 'READONLY_NOT_IMPLEMENTED' });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  console.log(JSON.stringify(await execute(args), null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_FILE) {
  main().catch((error) => {
    console.error(JSON.stringify({
      error: error.code ?? 'READONLY_FAILED',
      message: error.message,
    }));
    process.exitCode = error.code === 'INVALID_ARGUMENT' ? 2 : 1;
  });
}

export { execute, main, parseArgs };
