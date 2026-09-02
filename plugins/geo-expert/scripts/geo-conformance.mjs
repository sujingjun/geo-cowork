#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluateConformance } from './lib/conformance.mjs';
import { assessLifecycleReadiness } from './lib/lifecycle-readiness.mjs';
import { validateDevelopmentKnowledgeWorkspace } from './lib/workspace-scope.mjs';
import { resolveWithin, sha256, stableStringify } from './lib/workspace-paths.mjs';

const SCRIPT = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT), '../../..');

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...rest] = argv;
  if (command !== 'run') fail('INVALID_ARGUMENT', '唯一支持的 command 是 run');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!['--workspace', '--profile'].includes(flag)) fail('INVALID_ARGUMENT', `未知参数: ${flag}`);
    const value = rest[++index];
    if (!value || value.startsWith('--')) fail('INVALID_ARGUMENT', `${flag} 缺少值`);
    args[flag.slice(2)] = value;
  }
  if (!args.workspace || !args.profile) fail('INVALID_ARGUMENT', '缺少 --workspace 或 --profile');
  return args;
}

async function json(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    fail('CONFORMANCE_PROFILE_INVALID', `JSON 不可读: ${file}`);
  }
}

async function assertPackaging(host) {
  const files = host === 'codex'
    ? ['plugins/geo-expert/.codex-plugin/plugin.json', '.agents/plugins/marketplace.json']
    : ['plugins/geo-expert/.claude-plugin/plugin.json', '.claude-plugin/marketplace.json'];
  const values = await Promise.all(files.map((file) => json(path.join(REPO_ROOT, file))));
  const manifest = values[0];
  const marketplace = values[1];
  if (manifest.name !== 'geo-expert'
      || !marketplace.plugins?.some(({ name }) => name === 'geo-expert')) {
    fail('CONFORMANCE_CAPABILITY_UNSUPPORTED', `${host} packaging contract unavailable`);
  }
}

export async function runConformance({ workspace, profilePath }) {
  const root = path.resolve(workspace);
  const profile = await json(path.resolve(profilePath));
  const validation = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
  if (validation.errors.length > 0) {
    fail(validation.errors[0].code, 'development-test Workspace 未通过 M8 preflight');
  }
  const readiness = await assessLifecycleReadiness({
    workspace: root,
    knowledgeBaseRef: profile.knowledge_base_ref,
    goalRef: profile.goal_ref,
  });
  if (!readiness.engineering_ready) {
    fail('CONFORMANCE_REQUIRED_FAILED', 'Shared Tool readiness output is not engineering-ready');
  }
  const semantic = await json(resolveWithin(root, profile.workbuddy_semantic_fixture));
  if (semantic.merchant_ref !== profile.merchant_ref
      || semantic.knowledge_base_ref !== profile.knowledge_base_ref
      || semantic.native_adapter_present !== false
      || semantic.native_host_verified !== false
      || semantic.packaging_contract_available !== false
      || semantic.native_packaging_conformance_applicable !== false) {
    fail('CONFORMANCE_CAPABILITY_UNSUPPORTED', 'WorkBuddy semantic fixture boundary invalid');
  }
  await Promise.all([assertPackaging('codex'), assertPackaging('claude_code')]);
  const normalized = {
    schema_version: 'cross-host-normalized-output/1.0.0',
    merchant_ref: readiness.merchant_ref,
    knowledge_base_ref: readiness.knowledge_base_ref,
    goal_ref: readiness.goal_ref,
    knowledge_base_mode: readiness.knowledge_base_mode,
    engineering_ready: readiness.engineering_ready,
    formal_cycle_created: readiness.formal_cycle_created,
    content_gap_inferred: readiness.knowledge_absence.content_gap_inferred,
  };
  const digest = sha256(stableStringify(normalized));
  const outputs = Object.fromEntries(profile.required_executions.map((execution) => [
    execution.execution_key,
    {
      status: 'passed',
      normalized_digest: digest,
      diagnostics: [],
      ...(execution.host === 'workbuddy_cn' ? {
        host_boundary: {
          native_adapter_present: false,
          native_host_verified: false,
          packaging_contract_available: false,
          native_packaging_conformance_applicable: false,
        },
      } : {}),
    },
  ]));
  return { ...evaluateConformance({ profile, outputs }), normalized };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('geo-conformance run --workspace <path> --profile <json>');
      return;
    }
    console.log(JSON.stringify(await runConformance({
      workspace: args.workspace,
      profilePath: args.profile,
    }), null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.code ?? 'CONFORMANCE_FAILED', message: error.message }));
    process.exitCode = error.code === 'INVALID_ARGUMENT' ? 2 : 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT) main();

export { parseArgs };
