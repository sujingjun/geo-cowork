#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  prepareAdoption,
  preparePublication,
  proposeAssets,
} from './lib/asset-proposal.mjs';
import { validateDiagnosisWorkspace } from './lib/diagnosis-profile.mjs';
import { traceProposal } from './lib/diagnosis-trace.mjs';
import { ingestResearch } from './lib/research-input.mjs';
import { auditSite, technicalRetest } from './lib/site-audit.mjs';

const COMMANDS = new Set([
  'validate',
  'site-audit',
  'research-ingest',
  'propose-assets',
  'prepare-adoption',
  'prepare-publication',
  'trace',
  'technical-retest',
]);

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw new Error('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith('--')) throw new Error(`未知参数: ${key}`);
    args[key.slice(2)] = rest[++index] ?? null;
  }
  if (!args.workspace) throw new Error('缺少 --workspace');
  return args;
}

async function jsonFrom(file, label) {
  if (!file) throw new Error(`缺少 --${label}`);
  return JSON.parse(await readFile(path.resolve(file), 'utf8'));
}

async function execute(args) {
  const workspace = path.resolve(args.workspace);
  const now = args.now ?? new Date().toISOString();
  if (args.command === 'validate') return validateDiagnosisWorkspace({ workspace });
  if (args.command === 'trace') {
    if (!args.proposal) throw new Error('trace 缺少 --proposal');
    return traceProposal({ workspace, proposalId: args.proposal });
  }
  if (args.command === 'prepare-adoption') {
    if (!args.proposal || !args.id || !args.path) {
      throw new Error('prepare-adoption 缺少 --proposal、--id 或 --path');
    }
    return prepareAdoption({
      workspace,
      proposalId: args.proposal,
      id: args.id,
      relativePath: args.path,
      now,
    });
  }
  if (args.command === 'prepare-publication') {
    if (!args.adoption || !args.id || !args.path) {
      throw new Error('prepare-publication 缺少 --adoption、--id 或 --path');
    }
    return preparePublication({
      workspace,
      adoptionId: args.adoption,
      id: args.id,
      relativePath: args.path,
      now,
    });
  }
  const plan = await jsonFrom(args.plan, 'plan');
  if (args.command === 'propose-assets') return proposeAssets({ workspace, plan, now });
  const manifest = await jsonFrom(args.manifest, 'manifest');
  if (args.command === 'site-audit') return auditSite({ workspace, manifest, plan, now });
  if (args.command === 'research-ingest') return ingestResearch({ workspace, manifest, plan, now });
  return technicalRetest({ workspace, manifest, plan, now });
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
    const conflicts = new Set([
      'OBJECT_CONFLICT', 'DUPLICATE_ASSET_PROPOSAL', 'PROPOSAL_CONFLICT',
    ]);
    const pathErrors = new Set(['PATH_ESCAPE', 'WORKSPACE_NOT_FOUND', 'ENOENT']);
    process.exit(conflicts.has(error.code) ? 3 : pathErrors.has(error.code) || !error.code ? 2 : 1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };
