import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  createOwnerPackage,
  acceptOwnerFeedback,
  ownerInbox,
} from '../plugins/geo-expert/scripts/lib/owner-feedback.mjs';

test('Owner feedback binds immutable target bytes and rejects changed targets or ambiguous feedback', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-owner-'));
  try {
    await writeFile(
      path.join(root, 'workspace.json'),
      JSON.stringify({ workspace_mode: 'development_test' }),
    );
    await mkdir(path.join(root, 'objects'));
    await writeFile(path.join(root, 'objects/one.txt'), 'candidate');
    const pack = await createOwnerPackage({
      workspace: root,
      id: 'OWNER-TEST',
      kind: 'answer_review',
      objects: [
        { path: 'objects/one.txt', data: { id: 'ARV-ONE', version: '1.0.0' } },
      ],
      title: 'Review',
      body: 'Candidate claim',
    });
    const text = `包：${pack.id}\n校验：${pack.sha256}\n决定：approve\n决定人：Fixture human\n时间：2026-09-16T00:00:00Z\n说明：Reviewed raw evidence.\n`;
    assert.equal((await ownerInbox(root)).length, 1);
    await writeFile(path.join(root, 'objects/one.txt'), 'different');
    await assert.rejects(acceptOwnerFeedback({ workspace: root, text }), {
      code: 'OWNER_FEEDBACK_STALE',
    });
    await writeFile(path.join(root, 'objects/one.txt'), 'candidate');
    await acceptOwnerFeedback({ workspace: root, text });
    assert.equal((await ownerInbox(root)).length, 0);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('deferred feedback stays visible, can be superseded, and a final approval cannot be overwritten', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-owner-defer-'));
  try {
    await writeFile(
      path.join(root, 'workspace.json'),
      JSON.stringify({ workspace_mode: 'development_test' }),
    );
    await writeFile(path.join(root, 'subject.txt'), 'subject');
    const pack = await createOwnerPackage({
      workspace: root,
      id: 'OWNER-DEFER',
      kind: 'adoption',
      objects: [
        { path: 'subject.txt', data: { id: 'PRP-ONE', version: '1.0.0' } },
      ],
      title: 'Proposal',
      body: 'Read me',
    });
    const make = (decision) =>
      `包：${pack.id}\n校验：${pack.sha256}\n决定：${decision}\n决定人：Fixture human\n时间：2026-09-16T00:00:00Z\n说明：Explicit decision.\n`;
    await acceptOwnerFeedback({ workspace: root, text: make('defer') });
    assert.equal((await ownerInbox(root))[0].feedback_decision, 'defer');
    await acceptOwnerFeedback({ workspace: root, text: make('approve') });
    assert.equal((await ownerInbox(root)).length, 0);
    assert.equal(
      (await acceptOwnerFeedback({ workspace: root, text: make('approve') }))
        .replay,
      true,
    );
    await assert.rejects(
      acceptOwnerFeedback({ workspace: root, text: make('reject') }),
      { code: 'OWNER_FEEDBACK_CONFLICT' },
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('modified content is opaque and cannot inject a second approval field', async () => {
  const { parseOwnerFeedback } = await import(
    '../plugins/geo-expert/scripts/lib/owner-feedback.mjs'
  );
  const data = parseOwnerFeedback(
    `包：OWNER-MODIFY\n校验：${'a'.repeat(64)}\n决定：modify\n决定人：Fixture human\n说明：Edit wording.\n修改内容：Some content\n决定：approve\n`,
  );
  assert.equal(data.decision, 'modify');
  assert.ok(data.modified_text.includes('决定：approve'));
});
