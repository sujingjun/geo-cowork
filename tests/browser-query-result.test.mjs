import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  loadReceivedBrowserResult,
  materializeBrowserIntakeSample,
  syncBrowserQueryResults,
} from '../plugins/geo-expert/scripts/lib/browser-query-result.mjs';
import { initializeAnswerRun } from '../plugins/geo-expert/scripts/lib/answer-run.mjs';
import { m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';
import {
  sha256,
  stableStringify,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

function fixtureResult(rawHtml = '<article><p>Fixture answer</p></article>') {
  const raw = Buffer.from(rawHtml);
  const captureBase = {
    schema_version: 'geo-browser-query-capture-v2',
    capture_id: 'BQC-TEST-001',
    task_id: 'BQT-TEST-001',
    attempt_id: `${'a'.repeat(64)}/attempt-1`,
    cycle: { ref: 'CYC-TEST-001', version: '1.0.0' },
    query_set: { ref: 'QS-TEST-001', version: '1.0.0', content_sha256: 'b'.repeat(64) },
    query: { ref: 'Q-TEST-001', version: '1.0.0', query_text_sha256: 'c'.repeat(64) },
    platform: 'chatgpt',
    profile: { ref: 'CPF-TEST-001', version: '1.0.0' },
    collection_mode: 'manual_assist',
    conversation_state: 'unknown',
    conversation_proof: { kind: 'entry_only' },
    outcome: 'success',
    result_url: 'https://chatgpt.com/share/fixture',
    captured_at: '2026-09-03T07:00:00Z',
    answer_text: 'Fixture answer',
    answer_html_artifact: {
      artifact_id: 'BQA-TEST-001',
      media_type: 'text/html',
      byte_length: raw.length,
      sha256: sha256(raw),
    },
    citations: [],
    selector_version: 'manual-v1',
    terminal_detector_version: 'manual-v1',
    detector_diagnostics: {},
  };
  const capture = {
    ...captureBase,
    capture_payload_sha256: sha256(stableStringify(captureBase)),
  };
  const extractionBase = {
    schema_version: 'geo-browser-extraction-result-v1',
    extraction_id: 'BQX-TEST-001',
    capture_id: capture.capture_id,
    attempt_no: 1,
    raw_sha256: sha256(raw),
    status: 'completed',
    answer: {
      text: 'Fixture answer', html_structure_summary: 'article',
      refusal: false, completeness: 'complete',
    },
    citations: [],
    platform_annotations: [],
    warnings: [],
    provenance: {
      provider: 'fake', model: 'fixture', prompt_version: 'v1',
      prompt_sha256: 'd'.repeat(64), schema_version: 'geo-browser-extraction-result-v1',
      started_at: '2026-09-03T07:00:01Z', completed_at: '2026-09-03T07:00:01Z',
    },
  };
  const extraction = {
    ...extractionBase,
    output_sha256: sha256(stableStringify(extractionBase)),
  };
  const pending = {
    schema_version: 'geo-browser-pending-result-v1',
    result_id: 'BQR-TEST-001',
    task_id: capture.task_id,
    capture_id: capture.capture_id,
    extraction_id: extraction.extraction_id,
    cycle_ref: capture.cycle.ref,
    query_ref: capture.query.ref,
    outcome: 'success',
    capture_sha256: sha256(stableStringify(capture)),
    extraction_sha256: sha256(stableStringify(extraction)),
    raw_artifact_id: capture.answer_html_artifact.artifact_id,
    raw_byte_length: raw.length,
    raw_sha256: sha256(raw),
    status: 'pending',
    created_at: '2026-09-03T07:00:02Z',
  };
  return { raw, pending, capture, extraction };
}

function fakeClient(fixture, calls) {
  return {
    async listPendingQueryResults() {
      calls.push('list');
      return { items: [fixture.pending], next_cursor: null };
    },
    async getQueryResult(resultId) {
      calls.push(`get:${resultId}`);
      return {
        pending: fixture.pending,
        capture: fixture.capture,
        extraction: fixture.extraction,
      };
    },
    async getQueryResultArtifact({ offset, max_bytes: maxBytes }) {
      calls.push(`chunk:${offset}`);
      const end = Math.min(offset + maxBytes, fixture.raw.length);
      return {
        artifact_id: fixture.pending.raw_artifact_id,
        offset,
        next_offset: end < fixture.raw.length ? end : null,
        total_bytes: fixture.raw.length,
        sha256: fixture.pending.raw_sha256,
        encoding: 'base64',
        data_base64: fixture.raw.subarray(offset, end).toString('base64'),
      };
    },
    async acknowledgeQueryResult(input) {
      calls.push(`ack:${input.result_id}`);
      return { action: 'acknowledged' };
    },
  };
}

const expected = {
  cycle: { ref: 'CYC-TEST-001', version: '1.0.0' },
  query_set: { ref: 'QS-TEST-001', version: '1.0.0', content_sha256: 'b'.repeat(64) },
  queries: new Map([['Q-TEST-001', { version: '1.0.0', query_text_sha256: 'c'.repeat(64) }]]),
};

test('Cowork reliably stores raw/extraction before ack and can retry materialization locally', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'geo-browser-intake-'));
  const fixture = fixtureResult();
  const calls = [];
  try {
    await assert.rejects(
      syncBrowserQueryResults({
        workspace,
        cycleRef: 'CYC-TEST-001',
        expected,
        client: fakeClient(fixture, calls),
        chunkSize: 11,
        materialize: async () => {
          throw Object.assign(new Error('fixture M5 failure'), { code: 'M5_FIXTURE_FAILED' });
        },
      }),
      error => error.code === 'M5_FIXTURE_FAILED' && Boolean(error.intake_manifest_path),
    );
    assert.ok(calls.indexOf('ack:BQR-TEST-001') > calls.indexOf('chunk:33'));
    const manifestPath = 'runs/BQT-TEST-001/browser-intake/BQR-TEST-001/manifest.json';
    const received = await loadReceivedBrowserResult({ workspace, manifestPath });
    assert.equal(received.raw.toString('utf8'), fixture.raw.toString('utf8'));
    assert.equal(received.result.capture.capture_id, 'BQC-TEST-001');
    assert.equal(received.manifest.ack_input.receiver_fingerprint.length, 64);
    assert.equal(
      sha256(await readFile(path.join(workspace, manifestPath))),
      received.manifest_file_sha256,
    );

    let recovered = false;
    await loadReceivedBrowserResult({
      workspace,
      manifestPath,
      materialize: async bundle => {
        recovered = bundle.result.extraction.status === 'completed';
      },
    });
    assert.equal(recovered, true);
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('Cycle or Query version drift fails before raw read and acknowledgement', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'geo-browser-intake-drift-'));
  const fixture = fixtureResult();
  fixture.capture.query.version = '2.0.0';
  const calls = [];
  try {
    await assert.rejects(
      syncBrowserQueryResults({
        workspace,
        cycleRef: 'CYC-TEST-001',
        expected,
        client: fakeClient(fixture, calls),
      }),
      error => error.code === 'QUERY_INPUT_DRIFT',
    );
    assert.deepEqual(calls, ['list', 'get:BQR-TEST-001']);
  } finally {
    await rm(workspace, { recursive: true });
  }
});

test('a received synthetic Browser intake materializes through the existing M5 Answer Sample contract', async () => {
  const workspace = await m5ReadyWorkspace();
  const fixture = fixtureResult();
  const plan = m5FixturePlan();
  const calls = [];
  try {
    await initializeAnswerRun({ workspace, plan });
    const synced = await syncBrowserQueryResults({
      workspace,
      cycleRef: 'CYC-TEST-001',
      expected,
      client: fakeClient(fixture, calls),
      now: '2026-09-03T07:01:00Z',
      materialize: bundle => materializeBrowserIntakeSample({
        workspace,
        bundle,
        plan,
        sample: {
          id: 'SMP-TEST-001',
          path: 'cycles/m5/samples/smp-test-001.md',
          ordinal: 1,
        },
      }),
    });
    assert.equal(synced.received[0].ack.action, 'acknowledged');
    const sample = await readFile(path.join(workspace, 'cycles/m5/samples/smp-test-001.md'), 'utf8');
    assert.match(sample, /record_type: answer_sample/);
    assert.match(sample, /collection_method: recorded_fixture/);
    assert.equal(
      await readFile(path.join(workspace, 'runs/RUN-TEST-M5-001/raw/browser/BQC-TEST-001/answer.html'), 'utf8'),
      fixture.raw.toString('utf8'),
    );
  } finally {
    await rm(workspace, { recursive: true });
  }
});
