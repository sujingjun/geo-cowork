import { readFile } from 'node:fs/promises';
import { modelHash } from './model-client.mjs';
import { resolveWithin, writeCreateOnly } from './workspace-paths.mjs';
import {
  startKnowledgeWorkspace,
  applyKnowledgeApproval,
} from './knowledge-workspace.mjs';
import { ownerInbox, acceptOwnerFeedback } from './owner-feedback.mjs';
import {
  findJourneyCycle,
  prepareJourneyFreeze,
} from './journey-cycle-inputs.mjs';

import { withJourneyLock } from './journey-lock.mjs';

export async function executeKnowledgeJourney(args) {
  try {
    const identity = JSON.parse(
      await readFile(resolveWithin(args.workspace, 'workspace.json'), 'utf8'),
    );
    if (identity.workspace_mode !== 'development_test')
      throw Object.assign(
        new Error(
          'Knowledge rehearsal commands require an isolated development-test workspace',
        ),
        { code: 'REAL_WORKSPACE_WRITE_FORBIDDEN' },
      );
  } catch (error) {
    if (error.code !== 'ENOENT' || args.command !== 'start') throw error;
  }
  return ['start', 'continue', 'apply-feedback'].includes(args.command)
    ? withJourneyLock(args.workspace, () => executeJourneyUnlocked(args))
    : executeJourneyUnlocked(args);
}

async function executeJourneyUnlocked(args) {
  const workspace = args.workspace;
  if (args.command === 'start')
    return startKnowledgeWorkspace({
      workspace,
      input: args.input,
      inputDir: args['input-dir'],
      goalText: args['goal-text'],
      provider: args.provider,
      model: args.model,
    });
  if (args.command === 'inbox') return { pending: await ownerInbox(workspace) };
  if (args.command === 'apply-feedback') {
    const text = await readFile(args.file, 'utf8');
    const feedback = await acceptOwnerFeedback({ workspace, text });
    const appliedPath = `reviews/applications/${feedback.package.id}-${modelHash(text)}.json`;
    try {
      await readFile(resolveWithin(workspace, appliedPath));
      return { kept: true, package: feedback.package.id };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const result =
      feedback.package.kind === 'knowledge'
        ? await applyKnowledgeApproval(workspace, feedback)
        : await (
            await import('./journey-stages.mjs')
          ).applyJourneyFeedback(workspace, feedback);
    await writeCreateOnly(
      workspace,
      appliedPath,
      JSON.stringify({
        package_id: feedback.package.id,
        decision_sha256: modelHash(text),
        applied_at: new Date().toISOString(),
      }),
      { idempotent: true },
    );
    return result;
  }
  const inbox = await ownerInbox(workspace);
  if (args.command === 'report')
    return (await import('./journey-report.mjs')).renderJourneyReport(
      workspace,
    );
  if (inbox.length)
    return {
      waiting_human: true,
      pending: inbox.map((p) => ({ id: p.id, file: p.file })),
    };
  let { cycle } = await findJourneyCycle(workspace);
  if (!cycle) {
    await prepareJourneyFreeze(workspace);
    ({ cycle } = await findJourneyCycle(workspace));
  }
  const { continueJourneyStages } = await import('./journey-stages.mjs');
  return continueJourneyStages(workspace, cycle);
}
