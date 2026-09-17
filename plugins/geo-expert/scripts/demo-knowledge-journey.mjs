#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ownerInbox } from './lib/owner-feedback.mjs';
import { readJourneyInput } from './lib/knowledge-workspace.mjs';
const exec = promisify(execFile);
const argv = process.argv.slice(2);
const at = argv.indexOf('--workspace');
if (at < 0 || !argv[at + 1])
  throw new Error('Provide --workspace for the isolated rehearsal');
const workspace = path.resolve(argv[at + 1]);
const cli = fileURLToPath(new URL('./geo-lifecycle.mjs', import.meta.url));
const source = JSON.parse(
  await readFile(
    fileURLToPath(
      new URL(
        '../assets/knowledge-driven-seed/owner-feedback.json',
        import.meta.url,
      ),
    ),
    'utf8',
  ),
);
async function run(command, args = []) {
  const result = await exec(
    process.execPath,
    [cli, command, '--workspace', workspace, ...args],
    { maxBuffer: 20 * 1024 * 1024, timeout: 30 * 60 * 1000 },
  );
  if (result.stderr) process.stderr.write(result.stderr);
  return JSON.parse(result.stdout);
}
await run('start');
for (let step = 0; step < 30; step++) {
  const pending = await ownerInbox(workspace);
  if (pending.length) {
    const context = await readJourneyInput(workspace);
    for (const pack of pending) {
      const decision = source.decisions[pack.kind];
      if (!decision)
        throw new Error(`No independent fixture feedback for ${pack.kind}`);
      const offset = {
        knowledge: 0,
        answer_review: pack.id.includes('-AFTER-') ? 8 : 1,
        adoption: 1,
        publication: 2,
        cycle_review: 9,
        goal_selection: 10,
      }[pack.kind];
      const time = new Date(
        Date.parse(context.created_at) + offset * 86400000 + 300000,
      ).toISOString();
      const text = `包：${pack.id}\n校验：${pack.sha256}\n决定：${decision.decision}\n决定人：${source.actor}\n时间：${time}\n说明：${decision.reason}\n`;
      const directory = path.join(workspace, 'reviews', 'fixture-input');
      await mkdir(directory, { recursive: true });
      const file = path.join(directory, `${pack.id}.md`);
      await writeFile(file, text);
      await run('apply-feedback', ['--file', file]);
      process.stderr.write(`Fixture feedback applied: ${pack.id}\n`);
    }
  }
  const result = await run('continue');
  if (result.needs_input) throw new Error(result.next_action ?? result.reason);
  if (result.completed) {
    const report = await run('report');
    console.log(
      JSON.stringify({ completed: true, workspace, report }, null, 2),
    );
    break;
  }
  if (step === 29) throw new Error('Rehearsal did not reach completion');
}
