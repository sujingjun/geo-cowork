#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  aggregateFixtureCycle,
  collectFixtureCycle,
  normalizeSampleCitations,
  planAnswerCycle,
  readPlan,
  resumeAnswerRun,
  reviewFixtureCycle,
  validateAnswerWorkspace,
} from './lib/answer-cycle.mjs';
import {
  assertPlatformAutomationAllowed,
  getPlatformAdapter,
} from './collectors/platforms/index.mjs';
import { smokeGlobalPlaywright } from './collectors/playwright-base.mjs';
import { ingestManualBaselineBatch } from './lib/manual-baseline-batch.mjs';
import { reviewManualBaselineBatch } from './lib/manual-review-batch.mjs';
import { aggregateManualBaselineBatch } from './lib/manual-aggregation-batch.mjs';

const COMMANDS = new Set([
  'validate', 'plan', 'collect-fixture', 'collect', 'normalize-citations',
  'review', 'aggregate', 'resume',
  'runtime-smoke', 'platform-smoke',
  'collect-manual-batch',
  'review-manual-batch',
  'aggregate-manual-batch',
]);

function invalid(message) {
  const error = new Error(message);
  error.code = 'INVALID_ARGUMENT';
  return error;
}

export function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw invalid('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith('--')) throw invalid(`未知参数: ${key}`);
    args[key.slice(2)] = rest[++index] ?? null;
  }
  if (!args.workspace) throw invalid('缺少 --workspace');
  return args;
}

async function requiredPlan(args) {
  if (!args.plan) throw invalid('缺少 --plan');
  return readPlan(path.resolve(args.plan));
}

export async function execute(args) {
  const workspace = path.resolve(args.workspace);
  if (args.command === 'validate') return validateAnswerWorkspace({ workspace });
  if (args.command === 'runtime-smoke') {
    return smokeGlobalPlaywright({ expectedVersion: args.version ?? '1.62.1' });
  }
  if (['collect', 'platform-smoke'].includes(args.command)) {
    if (!args.platform) throw invalid(`${args.command} 缺少 --platform`);
    const adapter = getPlatformAdapter(args.platform);
    assertPlatformAutomationAllowed(adapter);
    const error = new Error('平台自动化许可通过后仍需按 plan 冻结真实 collect 输入');
    error.code = 'PLAYWRIGHT_GATE_NOT_APPROVED';
    throw error;
  }
  if (args.command === 'resume') {
    if (!args.run) throw invalid('resume 缺少 --run');
    return resumeAnswerRun({
      workspace,
      runId: args.run,
      ownerId: args.owner ?? `answer-cycle-${process.pid}`,
      now: args.now ?? new Date().toISOString(),
      ttlMs: Number(args['ttl-ms'] ?? 60_000),
    });
  }
  if (args.command === 'normalize-citations') {
    if (!args.sample) throw invalid('normalize-citations 缺少 --sample');
    return normalizeSampleCitations({ workspace, sampleId: args.sample });
  }
  const plan = await requiredPlan(args);
  if (args.command === 'collect-manual-batch') {
    return ingestManualBaselineBatch({ workspace, manifest: plan });
  }
  if (args.command === 'review-manual-batch') {
    return reviewManualBaselineBatch({ workspace, manifest: plan });
  }
  if (args.command === 'aggregate-manual-batch') {
    return aggregateManualBaselineBatch({ workspace, manifest: plan });
  }
  if (args.command === 'plan') return planAnswerCycle(plan);
  if (args.command === 'collect-fixture') return collectFixtureCycle({ workspace, plan });
  if (args.command === 'review') return reviewFixtureCycle({ workspace, plan });
  return aggregateFixtureCycle({ workspace, plan });
}

async function main() {
  try {
    const result = await execute(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
    if (Array.isArray(result.errors) && result.errors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
      diagnostics: error.diagnostics ?? [],
    }));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
