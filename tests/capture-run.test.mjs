import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  prepareEngineeringCapture,
  claimEngineeringSubmission,
  recordEngineeringCapture,
  readEngineeringCaptureRun,
} from '../plugins/geo-expert/scripts/lib/capture-run.mjs';

test('engineering submission is persisted before browser work; rate and duplicate guards survive reload', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-capture-'));
  try {
    await prepareEngineeringCapture(root);
    const start = new Date('2026-09-16T00:00:00Z');
    await claimEngineeringSubmission(root, 'chatgpt', start);
    await assert.rejects(
      claimEngineeringSubmission(
        root,
        'chatgpt',
        new Date(start.getTime() + 200000),
      ),
      { code: 'SUBMISSION_UNKNOWN' },
    );
    await assert.rejects(
      claimEngineeringSubmission(
        root,
        'gemini',
        new Date(start.getTime() + 119999),
      ),
      { code: 'COLLECTION_RATE_LIMIT' },
    );
    await claimEngineeringSubmission(
      root,
      'gemini',
      new Date(start.getTime() + 120000),
    );
    assert.equal(
      (await readEngineeringCaptureRun(root)).platforms.chatgpt.submissions,
      1,
    );
    await assert.rejects(
      recordEngineeringCapture(root, 'chatgpt', {
        answer_text: 'text',
        captured_at: '2026-09-16T00:00:01Z',
        result_url: 'https://gemini.google.com/app',
      }),
      { code: 'CAPTURE_ORIGIN_INVALID' },
    );
  } finally {
    await rm(root, { recursive: true });
  }
});
