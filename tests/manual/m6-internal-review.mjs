#!/usr/bin/env node
import { cp, lstat, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateWorkspace } from '../../plugins/geo-expert/scripts/workspace-validate.mjs';
import { traceCycle } from '../../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import { createM6CompletedBusinessTraceWorkspace } from '../helpers/m6-completed-business-fixture.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REAL_MYYSHOP = path.join(REPO_ROOT, 'workspaces', 'myyshop');

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const index = argv.indexOf('--workspace');
  if (index < 0 || !argv[index + 1]) {
    const error = new Error('缺少 --workspace <new-empty-path>');
    error.code = 'INVALID_ARGUMENT';
    throw error;
  }
  return { workspace: argv[index + 1] };
}

async function exists(target) {
  try { await lstat(target); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function inside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === '' || !relative.startsWith('..') && !path.isAbsolute(relative);
}

async function main() {
  let fixture;
  let staging;
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('用法: node tests/manual/m6-internal-review.mjs --workspace <new-empty-path>');
      return;
    }
    const target = path.resolve(args.workspace);
    if (inside(target, REAL_MYYSHOP)) {
      const error = new Error('人工内测 Workspace 不得等于或位于真实 workspaces/myyshop');
      error.code = 'REAL_WORKSPACE_WRITE_FORBIDDEN';
      throw error;
    }
    if (await exists(target)) {
      const error = new Error('目标已存在；为避免覆盖，请提供全新路径');
      error.code = 'TARGET_EXISTS';
      throw error;
    }
    await mkdir(path.dirname(target), { recursive: true });
    fixture = await createM6CompletedBusinessTraceWorkspace();
    staging = `${target}.staging-${process.pid}`;
    if (await exists(staging)) {
      const error = new Error('staging 目标已存在');
      error.code = 'TARGET_EXISTS';
      throw error;
    }
    await cp(fixture.root, staging, { recursive: true, force: false, errorOnExist: true });
    const validation = await validateWorkspace(staging, { objects: true });
    const trace = await traceCycle({ workspace: staging, cycleId: fixture.cycle.id });
    if (!validation.ok || !trace.lifecycle_ready) {
      const error = new Error('生成的 Review Workspace 未通过对象校验或 Cycle trace');
      error.code = 'REVIEW_WORKSPACE_INVALID';
      error.diagnostics = { validation, trace };
      throw error;
    }
    await rename(staging, target);
    staging = null;
    console.log(JSON.stringify({
      ok: true,
      workspace: target,
      cycle_id: fixture.cycle.id,
      status: trace.status,
      aggregate_stage: trace.aggregate_stage,
      completion_scope: trace.completion_scope,
      synthetic: trace.synthetic,
      real_myyshop_impact: trace.real_myyshop_impact,
      network_accessed: false,
      next_action: 'Follow docs/runbooks/m6-test-merchant-internal-review.md',
    }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'M6_INTERNAL_REVIEW_FAILED',
      message: error.message,
      diagnostics: error.diagnostics ?? null,
    }));
    process.exitCode = error.code === 'INVALID_ARGUMENT' ? 2 : 1;
  } finally {
    if (fixture?.root) await rm(fixture.root, { recursive: true, force: true });
    if (staging) await rm(staging, { recursive: true, force: true });
  }
}

main();
