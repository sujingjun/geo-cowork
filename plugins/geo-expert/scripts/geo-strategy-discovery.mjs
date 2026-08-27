#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  advanceDimension, assembleStrategyOutput, createDimensionCandidate,
  decideStrategy, invokeStrategy,
} from './lib/strategy-workflow.mjs';
import { traceStrategyWorkspace } from './lib/strategy-workflow-trace.mjs';
import {
  assertTestWorkspaceWriteAllowed, validateTestMerchantWorkspace,
} from './lib/m6-test-merchant.mjs';

const COMMANDS = new Set(['assess', 'propose-dimensions', 'assemble-output', 'trace']);

function failure(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  return error;
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw failure('INVALID_ARGUMENT', '缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!flag.startsWith('--')) throw failure('INVALID_ARGUMENT', `未知参数: ${flag}`);
    const value = rest[index + 1];
    if (value === undefined || value.startsWith('--')) {
      throw failure('INVALID_ARGUMENT', `参数缺值: ${flag}`);
    }
    const key = flag.slice(2);
    if (args[key] !== undefined) throw failure('INVALID_ARGUMENT', `重复参数: ${flag}`);
    args[key] = value;
    index += 1;
  }
  if (!args.workspace) throw failure('INVALID_ARGUMENT', '缺少 --workspace');
  if (!args.plan && command !== 'trace') throw failure('INVALID_ARGUMENT', '缺少 --plan');
  if (command === 'trace' && !args.assessment && !args.plan) {
    throw failure('INVALID_ARGUMENT', 'trace 缺少 --assessment');
  }
  return args;
}

function assertNetworkDisabled() {
  if (process.env.GEO_M7_NETWORK_DISABLED !== '1') {
    throw failure('NETWORK_GUARD_REQUIRED', 'M7 CLI 要求 GEO_M7_NETWORK_DISABLED=1');
  }
}

async function readPlan(file) {
  if (!file) return {
    schema_version: 'm7-strategy-workflow-plan/1.0.0',
    workspace_scope: 'test_only', commands: ['trace'],
    network_access: false, real_execution_authorized: false,
  };
  try {
    return JSON.parse(await readFile(path.resolve(file), 'utf8'));
  } catch {
    throw failure('INVALID_ARGUMENT', 'plan 无法读取或不是合法 JSON');
  }
}

function assertPlan(plan, command) {
  if (plan.workspace_scope !== 'test_only'
      || plan.real_execution_authorized !== false
      || plan.network_access !== false
      || !plan.commands?.includes(command)) {
    throw failure('STRATEGY_TRIGGER_SCOPE_MISMATCH', 'M7 plan Scope/command 不匹配');
  }
  for (const field of [
    'assessment_input', 'assessment_context', 'eligibility_result', 'prior_dimension',
    'dimension_decision', 'strategy_output', 'trace_input',
  ]) {
    if (plan[field] !== undefined) {
      throw failure('STRATEGY_ELIGIBILITY_SELF_REPORT_FORBIDDEN', `plan 不得内嵌 ${field}`);
    }
  }
}

async function validateWorkspace(root) {
  await assertTestWorkspaceWriteAllowed({ workspace: root });
  const validation = await validateTestMerchantWorkspace({ workspace: root });
  if (validation.errors.length > 0) {
    throw failure(validation.errors[0].code, 'M7 Test Workspace 未就绪', {
      diagnostics: validation.errors,
    });
  }
}

async function execute(args) {
  const root = path.resolve(args.workspace);
  const plan = await readPlan(args.plan);
  assertPlan(plan, args.command);
  await validateWorkspace(root);
  let result;
  if (args.command === 'assess' && args.phase === 'invoke') {
    result = await invokeStrategy({ root, plan });
  } else if (args.command === 'assess' && args.phase === 'decide') {
    if (!args.decision) throw failure('INVALID_ARGUMENT', 'decide 缺少 --decision');
    result = await decideStrategy({ root, decisionPath: args.decision });
  } else if (args.command === 'propose-dimensions' && args.phase === 'create-candidate') {
    result = await createDimensionCandidate({ root, config: plan.dimension_candidate });
  } else if (args.command === 'propose-dimensions' && args.phase === 'advance') {
    if (!args.decision) throw failure('INVALID_ARGUMENT', 'advance 缺少 --decision');
    result = await advanceDimension({ root, decisionPath: args.decision });
  } else if (args.command === 'assemble-output' && args.phase === 'assemble') {
    result = await assembleStrategyOutput({ root, config: plan.output });
  } else if (args.command === 'trace') {
    const assessmentRef = args.assessment ?? plan.assessment_ref;
    if (!assessmentRef) throw failure('INVALID_ARGUMENT', 'trace 缺少 Assessment ID');
    result = await traceStrategyWorkspace({ root, assessmentRef });
  } else {
    const states = {
      assess: 'waiting_explicit_strategy_input',
      'propose-dimensions': 'waiting_explicit_dimension_input',
      'assemble-output': 'waiting_explicit_output_input',
    };
    result = { state: states[args.command], written_paths: [] };
  }
  return {
    ok: result.errors ? result.errors.length === 0 : true,
    command: args.command, scope: 'test_only', auto_approval: false,
    network_accessed: false, ...result,
  };
}

function exitCode(error) {
  if (error.code === 'INVALID_ARGUMENT') return 2;
  if (['OBJECT_CONFLICT', 'RUN_CONFLICT', 'CYCLE_INPUT_SNAPSHOT_CONFLICT',
    'STRATEGY_ASSESSMENT_CONFLICT', 'DECISION_DIMENSION_CONFLICT',
    'STRATEGY_OUTPUT_CONFLICT'].includes(error.code)) return 3;
  return 1;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('geo-strategy-discovery commands: assess propose-dimensions assemble-output trace');
      return;
    }
    assertNetworkDisabled();
    console.log(JSON.stringify(await execute(args), null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'M7_STRATEGY_FAILED', message: error.message,
      diagnostics: error.diagnostics ?? [],
    }));
    process.exitCode = exitCode(error);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };
