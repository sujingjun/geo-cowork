import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  materializeStrategyOutput,
  validateStrategyOutput,
} from '../plugins/geo-expert/scripts/lib/strategy-output.mjs';
import {
  buildValidStrategyOutput,
  createM7Workspace,
} from './helpers/m7-cycle2-fixtures.mjs';

test('STO 三类 artifact 恰好各一份，body/hash/manifest 分开复算', async () => {
  const fixture = await buildValidStrategyOutput();
  assert.deepEqual(validateStrategyOutput(fixture).errors, []);
  assert.deepEqual(
    fixture.data.artifacts.map((item) => item.role).sort(),
    ['human_validation_plan', 'opportunity_analysis', 'prd_draft'],
  );
  assert.notEqual(fixture.data.body_sha256, fixture.data.artifact_manifest_fingerprint);
  for (const artifact of fixture.data.artifacts) {
    assert.equal(artifact.path.startsWith('outputs/'), true);
    assert.equal(artifact.media_type, 'text/markdown');
  }
});

test('STO 只写对应 Strategy Run outputs，重复同 bytes kept', async () => {
  const root = await createM7Workspace();
  try {
    const fixture = await buildValidStrategyOutput();
    const args = {
      workspace: root,
      path: 'strategy/outputs/sto-m7-draft-001.md',
      ...fixture,
    };
    const first = await materializeStrategyOutput(args);
    const second = await materializeStrategyOutput(args);
    assert.equal(first.action, 'created');
    assert.equal(second.action, 'kept');
    for (const artifact of fixture.data.artifacts) {
      const bytes = await readFile(path.join(root, 'runs', fixture.data.run_ref, artifact.path));
      assert.deepEqual(bytes, Buffer.from(fixture.artifactContents.get(artifact.role)));
      await assert.rejects(
        access(path.join(root, artifact.path)),
        (error) => error.code === 'ENOENT',
      );
    }
  } finally {
    await rm(root, { recursive: true });
  }
});

test('STO checksum/path/role 冲突必须 zero-write', async () => {
  const root = await createM7Workspace();
  try {
    const fixture = await buildValidStrategyOutput();
    const invalidCases = [
      { ...fixture.data, body_sha256: '0'.repeat(64) },
      {
        ...fixture.data,
        artifacts: fixture.data.artifacts.map((item, index) =>
          index === 0 ? { ...item, path: 'raw/forbidden.md' } : item),
      },
      {
        ...fixture.data,
        artifacts: fixture.data.artifacts.map((item, index) =>
          index === 0 ? { ...item, role: 'prd_draft' } : item),
      },
    ];
    for (const data of invalidCases) {
      await assert.rejects(
        materializeStrategyOutput({
          workspace: root,
          path: 'strategy/outputs/sto-m7-invalid.md',
          data,
          body: fixture.body,
          artifactContents: fixture.artifactContents,
        }),
        (error) => error.code === 'STRATEGY_OUTPUT_CONFLICT',
      );
      await assert.rejects(
        access(path.join(root, 'strategy/outputs/sto-m7-invalid.md')),
        (error) => error.code === 'ENOENT',
      );
    }
  } finally {
    await rm(root, { recursive: true });
  }
});

test('任一既存 artifact bytes 冲突时，STO 与其他 artifacts 均不得部分写入', async () => {
  const root = await createM7Workspace();
  try {
    const fixture = await buildValidStrategyOutput();
    const conflicting = fixture.data.artifacts[0];
    const target = path.join(root, 'runs', fixture.data.run_ref, conflicting.path);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, 'conflicting bytes\n');
    await assert.rejects(
      materializeStrategyOutput({
        workspace: root,
        path: 'strategy/outputs/sto-m7-conflict.md',
        ...fixture,
      }),
      (error) => error.code === 'STRATEGY_OUTPUT_CONFLICT',
    );
    await assert.rejects(
      access(path.join(root, 'strategy/outputs/sto-m7-conflict.md')),
      (error) => error.code === 'ENOENT',
    );
    for (const artifact of fixture.data.artifacts.slice(1)) {
      await assert.rejects(
        access(path.join(root, 'runs', fixture.data.run_ref, artifact.path)),
        (error) => error.code === 'ENOENT',
      );
    }
  } finally {
    await rm(root, { recursive: true });
  }
});
