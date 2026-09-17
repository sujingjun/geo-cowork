import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm, readFile } from 'node:fs/promises';
import {
  parseQueryImport,
  gscQueryWindow,
  ingestQueryInputs,
} from '../plugins/geo-expert/scripts/lib/query-inputs.mjs';
import {
  createQueryPortfolioFixtureWorkspace,
  QP_GOAL_ID,
} from './helpers/query-portfolio-fixtures.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';

test('manual Query import handles quoted CSV, multiline values, JSON and normalized duplicates', () => {
  const rows = parseQueryImport(
    'query_text,language\n"What is A, Inc?",en-US\n"Line one\nline two",en-US\n',
    'csv',
  );
  assert.equal(rows.length, 2);
  assert.equal(rows[0].query_text, 'What is A, Inc?');
  assert.equal(rows[1].query_text, 'Line one\nline two');
  assert.equal(parseQueryImport('What is Brand?\nWHAT IS BRAND?').length, 1);
  assert.throws(() => parseQueryImport('query_text\n"unfinished', 'csv'));
});

test('GSC default 28-day window uses PT date across UTC and daylight-saving boundaries', () => {
  assert.deepEqual(gscQueryWindow(new Date('2026-09-16T01:00:00Z')), {
    start_date: '2026-08-16',
    end_date: '2026-09-12',
    timezone: 'America/Los_Angeles',
  });
});

test('new sources merge into a candidate with version bump and retain immutable input receipts', async () => {
  const workspace = await createQueryPortfolioFixtureWorkspace();
  try {
    const args = {
      workspace,
      goal: QP_GOAL_ID,
      entries: parseQueryImport('What is an example brand?'),
      sourceKind: 'manual_import',
      sourceDetail: { file: 'one.txt' },
      raw: 'What is an example brand?',
    };
    const first = await ingestQueryInputs(args);
    const replay = await ingestQueryInputs(args);
    assert.equal(replay.replay, true);
    const second = await ingestQueryInputs({
      ...args,
      sourceDetail: { file: 'two.txt' },
    });
    const graph = await loadWorkspaceGraph({ workspace });
    const query = graph.objects.find((o) =>
      o.data.discovery_source_refs?.includes(first.source_ref),
    );
    assert.equal(query.data.version, '1.0.1');
    assert.deepEqual(
      new Set(query.data.discovery_source_refs),
      new Set([first.source_ref, second.source_ref]),
    );
    assert.equal(second.updated.length, 1);
    assert.ok(
      (await readFile(`${workspace}/${first.input_path}`, 'utf8')).includes(
        'one.txt',
      ),
    );
    await assert.rejects(
      ingestQueryInputs({ ...args, sourceKind: 'gsc_search_query' }),
      { code: 'SYNTHETIC_REAL_REF_CONTAMINATION' },
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});
