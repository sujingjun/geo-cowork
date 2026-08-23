import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { importLegacyOpsGeo } from '../plugins/geo-expert/scripts/lib/legacy-ops-geo.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW, temporaryWorkspace } from './helpers/object-fixtures.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE = path.join(REPO_ROOT, 'tests/fixtures/m2-contract/ops-geo-legacy-synthetic.json');
const SNAPSHOT = path.join(REPO_ROOT, 'tests/fixtures/m2-contract/homepage.txt');

test('legacy audit 确定性迁移，缺 Evidence 的 Finding 降级且分数不可比较', async () => {
  const root = await temporaryWorkspace();
  await mkdir(path.join(root, 'imports'), { recursive: true });
  await mkdir(path.join(root, 'legacy/raw'), { recursive: true });
  const input = path.join(root, 'imports/legacy.json');
  await copyFile(FIXTURE, input);
  await copyFile(SNAPSHOT, path.join(root, 'legacy/raw/homepage.txt'));
  const inputHash = sha256(await readFile(input));

  const first = await importLegacyOpsGeo({
    workspace: root,
    inputPath: input,
    namespace: 'SYNTHETIC',
    now: NOW,
  });
  assert.equal(first.legacy_score.comparable, false);
  assert.equal(first.legacy_score.rubric_version, 'legacy-unknown');
  assert.deepEqual(first.evidence_refs, ['EVD-LEGACY-SYNTHETIC-001']);
  assert.deepEqual(first.finding_refs, [
    'FND-LEGACY-SYNTHETIC-001',
    'FND-LEGACY-SYNTHETIC-002',
  ]);

  const observed = await readMarkdownObject(
    path.join(root, 'evidence/legacy/SYNTHETIC/findings/fnd-legacy-synthetic-001.md'),
    { workspace: root },
  );
  const unverifiable = await readMarkdownObject(
    path.join(root, 'evidence/legacy/SYNTHETIC/findings/fnd-legacy-synthetic-002.md'),
    { workspace: root },
  );
  assert.equal(observed.data.item_state, 'observed');
  assert.deepEqual(observed.data.evidence_refs, ['EVD-LEGACY-SYNTHETIC-001']);
  assert.equal(unverifiable.data.item_state, 'unverifiable');
  assert.deepEqual(unverifiable.data.evidence_refs, []);
  assert.equal(sha256(await readFile(input)), inputHash, '迁移修改了输入');

  const second = await importLegacyOpsGeo({
    workspace: root,
    inputPath: input,
    namespace: 'SYNTHETIC',
    now: '2026-08-24T00:01:00+08:00',
  });
  assert.equal(second.input_sha256, first.input_sha256);
  assert.ok(second.kept.length > 0);

  const findingPath = path.join(
    root,
    'evidence/legacy/SYNTHETIC/findings/fnd-legacy-synthetic-001.md',
  );
  const conflicting = `${await readFile(findingPath, 'utf8')}\nconflict\n`;
  await writeFile(findingPath, conflicting);
  await assert.rejects(
    importLegacyOpsGeo({ workspace: root, inputPath: input, namespace: 'SYNTHETIC', now: NOW }),
    (error) => error.code === 'IMPORT_CONFLICT',
  );
  assert.equal(await readFile(findingPath, 'utf8'), conflicting);
  await rm(root, { recursive: true });
});

test('legacy snapshot checksum 错误时迁移失败且不生成 Finding', async () => {
  const root = await temporaryWorkspace();
  await mkdir(path.join(root, 'imports'), { recursive: true });
  await mkdir(path.join(root, 'legacy/raw'), { recursive: true });
  const input = path.join(root, 'imports/legacy.json');
  await copyFile(FIXTURE, input);
  await copyFile(SNAPSHOT, path.join(root, 'legacy/raw/homepage.txt'));
  await rm(path.join(root, 'legacy/raw/homepage.txt'));
  await assert.rejects(
    importLegacyOpsGeo({ workspace: root, inputPath: input, namespace: 'SYNTHETIC', now: NOW }),
    (error) => error.code === 'SNAPSHOT_NOT_FOUND',
  );
  await assert.rejects(readFile(
    path.join(root, 'evidence/legacy/SYNTHETIC/findings/fnd-legacy-synthetic-001.md'),
  ));
  await rm(root, { recursive: true });
});
