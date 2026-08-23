#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createRun,
  resumeRun,
  writeRunArtifact,
} from './lib/run-store.mjs';

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!['create', 'artifact', 'resume'].includes(command)) throw new Error('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key.startsWith('--')) throw new Error(`未知参数: ${key}`);
    args[key.slice(2)] = rest[++index] ?? null;
  }
  if (!args.workspace || !args.run) throw new Error('缺少 --workspace 或 --run');
  return args;
}

async function readJsonFile(file) {
  return JSON.parse(await readFile(path.resolve(file), 'utf8'));
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const workspace = path.resolve(args.workspace);
    const now = args.now ?? new Date().toISOString();
    let result;
    if (args.command === 'create') {
      if (!args.skill || !args['skill-version'] || !args.inputs) {
        throw new Error('create 缺少 --skill、--skill-version 或 --inputs');
      }
      result = await createRun({
        workspace,
        runId: args.run,
        skill: args.skill,
        skillVersion: args['skill-version'],
        inputVersions: await readJsonFile(args.inputs),
        now,
      });
    } else if (args.command === 'artifact') {
      if (!args.path || !args['content-file']) throw new Error('artifact 缺少路径参数');
      result = await writeRunArtifact({
        workspace,
        runId: args.run,
        relativePath: args.path,
        content: await readFile(path.resolve(args['content-file'])),
      });
    } else {
      if (!args['new-run'] || !args.inputs) throw new Error('resume 缺少 --new-run 或 --inputs');
      result = await resumeRun({
        workspace,
        runId: args.run,
        currentInputVersions: await readJsonFile(args.inputs),
        newRunId: args['new-run'],
        now,
      });
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.code ?? 'INVALID_ARGUMENT', message: error.message }));
    const pathError = ['PATH_ESCAPE', 'WORKSPACE_NOT_FOUND', 'ENOENT'].includes(error.code);
    process.exit(['RUN_CONFLICT', 'ARTIFACT_EXISTS'].includes(error.code) ? 3 : pathError ? 2 : error.code ? 1 : 2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
