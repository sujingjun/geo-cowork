import { readFile } from 'node:fs/promises';

import { materializeFixtureSample } from './answer-sample.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class BrowserQueryResultError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'BrowserQueryResultError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fail(code, message, details = {}) {
  throw new BrowserQueryResultError(code, message, details);
}

function without(object, key) {
  const { [key]: ignored, ...rest } = object;
  void ignored;
  return rest;
}

function validateBindings(result, expected) {
  const { capture, pending } = result;
  if (pending.cycle_ref !== expected.cycle.ref
      || capture.cycle.ref !== expected.cycle.ref
      || capture.cycle.version !== expected.cycle.version) {
    fail('QUERY_SET_VERSION_DRIFT', 'Browser result Cycle version does not match Cowork input');
  }
  if (capture.query_set.ref !== expected.query_set.ref
      || capture.query_set.version !== expected.query_set.version
      || capture.query_set.content_sha256 !== expected.query_set.content_sha256) {
    fail('QUERY_SET_VERSION_DRIFT', 'Browser result Query Set version or hash drifted');
  }
  const query = expected.queries.get(capture.query.ref);
  if (!query || query.version !== capture.query.version
      || query.query_text_sha256 !== capture.query.query_text_sha256) {
    fail('QUERY_INPUT_DRIFT', 'Browser result Query version or text hash drifted');
  }
}

function validateMetadata(result) {
  const { pending, capture, extraction } = result;
  if (pending.capture_id !== capture.capture_id
      || pending.extraction_id !== extraction.extraction_id
      || extraction.capture_id !== capture.capture_id
      || pending.raw_artifact_id !== capture.answer_html_artifact.artifact_id
      || pending.raw_byte_length !== capture.answer_html_artifact.byte_length
      || pending.raw_sha256 !== capture.answer_html_artifact.sha256) {
    fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Pending, Capture and Extraction identities do not close');
  }
  const capturePayload = sha256(stableStringify(without(capture, 'capture_payload_sha256')));
  const extractionPayload = sha256(stableStringify(without(extraction, 'output_sha256')));
  if (capture.capture_payload_sha256 !== capturePayload
      || extraction.output_sha256 !== extractionPayload
      || pending.capture_sha256 !== sha256(stableStringify(capture))
      || pending.extraction_sha256 !== sha256(stableStringify(extraction))) {
    fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Browser result metadata checksum does not close');
  }
}

async function readRawArtifact({ client, pending, chunkSize }) {
  const chunks = [];
  let offset = 0;
  do {
    const chunk = await client.getQueryResultArtifact({
      result_id: pending.result_id,
      artifact_id: pending.raw_artifact_id,
      offset,
      max_bytes: chunkSize,
    });
    if (chunk.artifact_id !== pending.raw_artifact_id
        || chunk.offset !== offset
        || chunk.total_bytes !== pending.raw_byte_length
        || chunk.sha256 !== pending.raw_sha256
        || chunk.encoding !== 'base64') {
      fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Raw artifact chunk metadata drifted');
    }
    let bytes;
    try {
      bytes = Buffer.from(chunk.data_base64, 'base64');
    } catch {
      fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Raw artifact chunk is not valid base64');
    }
    if (bytes.length === 0 && chunk.next_offset !== null) {
      fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Raw artifact pagination made no progress');
    }
    chunks.push(bytes);
    if (chunk.next_offset === null) break;
    if (!Number.isInteger(chunk.next_offset) || chunk.next_offset <= offset) {
      fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Raw artifact next offset is invalid');
    }
    offset = chunk.next_offset;
  } while (offset < pending.raw_byte_length);
  const raw = Buffer.concat(chunks);
  if (raw.length !== pending.raw_byte_length || sha256(raw) !== pending.raw_sha256) {
    fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Raw artifact bytes or SHA-256 do not close');
  }
  return raw;
}

async function receiveResult({ workspace, result, raw, now }) {
  const root = `runs/${result.pending.task_id}/browser-intake/${result.pending.result_id}`;
  const rawPath = `${root}/answer.html`;
  const resultPath = `${root}/result.json`;
  const manifestPath = `${root}/manifest.json`;
  const resultBytes = Buffer.from(stableStringify(result, 2));
  const manifestBase = {
    schema_version: 'geo-browser-result-intake-v1',
    result_id: result.pending.result_id,
    task_id: result.pending.task_id,
    cycle: result.capture.cycle,
    query_set: result.capture.query_set,
    query: result.capture.query,
    capture_id: result.capture.capture_id,
    extraction_id: result.extraction.extraction_id,
    received_at: now,
    files: {
      raw_html: {
        path: rawPath,
        media_type: 'text/html',
        byte_length: raw.length,
        sha256: sha256(raw),
      },
      result: {
        path: resultPath,
        media_type: 'application/json',
        byte_length: resultBytes.length,
        sha256: sha256(resultBytes),
      },
    },
  };
  const receiverFingerprint = sha256(stableStringify(manifestBase));
  const ackInput = {
    result_id: result.pending.result_id,
    capture_sha256: result.pending.capture_sha256,
    extraction_sha256: result.pending.extraction_sha256,
    receiver_fingerprint: receiverFingerprint,
    received_at: now,
  };
  const manifest = { ...manifestBase, ack_input: ackInput };
  const manifestBytes = Buffer.from(stableStringify(manifest, 2));
  await writeCreateOnly(workspace, rawPath, raw, {
    idempotent: true,
    conflictCode: 'CANONICAL_MATERIALIZATION_CONFLICT',
  });
  await writeCreateOnly(workspace, resultPath, resultBytes, {
    idempotent: true,
    conflictCode: 'CANONICAL_MATERIALIZATION_CONFLICT',
  });
  await writeCreateOnly(workspace, manifestPath, manifestBytes, {
    idempotent: true,
    conflictCode: 'CANONICAL_MATERIALIZATION_CONFLICT',
  });
  return { manifest, manifestPath, ackInput };
}

export async function loadReceivedBrowserResult({
  workspace,
  manifestPath,
  materialize,
}) {
  const safeManifestPath = assertSafeRelativePath(manifestPath);
  await assertNoSymlinkPath(workspace, safeManifestPath);
  const manifestBytes = await readFile(resolveWithin(workspace, safeManifestPath));
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  if (manifest.schema_version !== 'geo-browser-result-intake-v1') {
    fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Unknown Browser intake schema');
  }
  const rawPath = assertSafeRelativePath(manifest.files?.raw_html?.path);
  const resultPath = assertSafeRelativePath(manifest.files?.result?.path);
  await Promise.all([
    assertNoSymlinkPath(workspace, rawPath),
    assertNoSymlinkPath(workspace, resultPath),
  ]);
  const [raw, resultBytes] = await Promise.all([
    readFile(resolveWithin(workspace, rawPath)),
    readFile(resolveWithin(workspace, resultPath)),
  ]);
  if (raw.length !== manifest.files.raw_html.byte_length
      || sha256(raw) !== manifest.files.raw_html.sha256
      || resultBytes.length !== manifest.files.result.byte_length
      || sha256(resultBytes) !== manifest.files.result.sha256) {
    fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Browser intake files changed after receipt');
  }
  const bundle = {
    manifest,
    result: JSON.parse(resultBytes.toString('utf8')),
    raw,
    manifest_file_sha256: sha256(manifestBytes),
  };
  if (materialize) await materialize(bundle);
  return bundle;
}

export async function materializeBrowserIntakeSample({
  workspace,
  bundle,
  plan,
  sample,
}) {
  const { capture, extraction } = bundle.result;
  const queryVersion = plan.query_cluster?.query_versions?.[0];
  const querySetVersion = plan.query_set_versions?.[0];
  const profile = plan.profile?.data;
  if (plan.schema_version !== 'm5-recorded-fixture-plan-v1'
      || !plan.authorization_ref?.startsWith('fixture://')) {
    fail(
      'CANONICAL_MATERIALIZATION_CONFLICT',
      'This local materializer only accepts explicitly synthetic recorded-fixture plans',
    );
  }
  if (!queryVersion || queryVersion.ref !== capture.query.ref
      || queryVersion.version !== capture.query.version
      || !querySetVersion || querySetVersion.ref !== capture.query_set.ref
      || querySetVersion.version !== capture.query_set.version
      || !profile || profile.id !== capture.profile.ref
      || profile.version !== capture.profile.version
      || profile.platform !== capture.platform
      || extraction.status !== 'completed') {
    fail(
      'CANONICAL_MATERIALIZATION_CONFLICT',
      'Browser intake does not match the frozen M5 fixture plan',
    );
  }
  const attemptNo = Number.parseInt(capture.attempt_id.split('attempt-').at(-1), 10);
  if (!Number.isInteger(attemptNo) || attemptNo < 1) {
    fail('CANONICAL_MATERIALIZATION_CONFLICT', 'Browser attempt ID is invalid');
  }
  const outputRoot = `raw/browser/${capture.capture_id}`;
  const collectorLog = stableStringify({
    schema_version: 'geo-browser-m5-intake-log-v1',
    browser_task_id: capture.task_id,
    browser_capture_id: capture.capture_id,
    browser_extraction_id: extraction.extraction_id,
    conversation_state: capture.conversation_state,
    result_url: capture.result_url,
    selector_version: capture.selector_version,
    terminal_detector_version: capture.terminal_detector_version,
    account_identifier_stored: false,
    credentials_stored: false,
  }, 2);
  return materializeFixtureSample({
    workspace,
    plan,
    sample: {
      id: sample.id,
      path: sample.path,
      ordinal: sample.ordinal,
      outcome: capture.outcome,
      captured_at: capture.captured_at,
      attempt_no: attemptNo,
      artifacts: [
        {
          role: 'answer_text',
          content: capture.answer_text,
          output_path: `${outputRoot}/answer.txt`,
          media_type: 'text/plain',
        },
        {
          role: 'html',
          content: bundle.raw,
          output_path: `${outputRoot}/answer.html`,
          media_type: 'text/html',
        },
        {
          role: 'collector_log',
          content: collectorLog,
          output_path: `${outputRoot}/collector-log.json`,
          media_type: 'application/json',
        },
      ],
    },
  });
}

export async function syncBrowserQueryResults({
  workspace,
  cycleRef,
  expected,
  client,
  chunkSize = 262_144,
  now = new Date().toISOString(),
  materialize,
}) {
  if (!Number.isInteger(chunkSize) || chunkSize < 1 || chunkSize > 262_144) {
    fail('ARTIFACT_RANGE_INVALID', 'chunkSize must be 1..262144');
  }
  const received = [];
  let cursor;
  do {
    const page = await client.listPendingQueryResults({
      cycle_ref: cycleRef,
      cursor,
      limit: 100,
    });
    for (const item of page.items) {
      const result = await client.getQueryResult(item.result_id);
      validateBindings(result, expected);
      validateMetadata(result);
      const raw = await readRawArtifact({ client, pending: result.pending, chunkSize });
      const local = await receiveResult({ workspace, result, raw, now });
      const ack = await client.acknowledgeQueryResult(local.ackInput);
      const entry = { ...local, ack };
      received.push(entry);
      if (materialize) {
        try {
          await loadReceivedBrowserResult({
            workspace,
            manifestPath: local.manifestPath,
            materialize,
          });
        } catch (error) {
          error.intake_manifest_path = local.manifestPath;
          throw error;
        }
      }
    }
    cursor = page.next_cursor ?? undefined;
  } while (cursor);
  return { ok: true, received };
}
