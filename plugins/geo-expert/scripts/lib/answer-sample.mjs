import { readFile } from 'node:fs/promises';

import {
  sampleSlotKey,
} from './answer-profile.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { writeRunArtifact } from './run-store.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

const FORBIDDEN_KEYS = new Set([
  'authorization', 'cookie', 'cookies', 'password', 'token', 'access_token',
  'api_key', 'account_email', 'local_storage', 'session_storage', 'credentials',
]);

export class AnswerSampleError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnswerSampleError';
    this.code = code;
    Object.assign(this, details);
  }
}

function scanSensitive(value, path = []) {
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) scanSensitive(item, [...path, index]);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
      throw new AnswerSampleError('PRIVACY_SCOPE_VIOLATION', 'Fixture plan 包含禁止的账号或凭据字段', {
        field: [...path, key].join('.'),
      });
    }
    scanSensitive(item, [...path, key]);
  }
}

export function assertNoSensitiveFixtureInput(value) {
  scanSensitive(value);
  return value;
}

export function rawManifestSha(artifacts) {
  return sha256(stableStringify(artifacts));
}

export function assertManualAnswerPrivacy(answerText) {
  if (typeof answerText !== 'string' || answerText.trim() === '') {
    throw new AnswerSampleError('RAW_ARTIFACT_REQUIRED', 'manual answer text 不能为空');
  }
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(answerText)
      || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i.test(answerText)
      || /(?:authorization|cookie|access[_-]?token)\s*[:=]/i.test(answerText)) {
    throw new AnswerSampleError(
      'PRIVACY_SCOPE_VIOLATION',
      'manual answer 含账号标识或凭据形态，拒绝写盘',
    );
  }
  return answerText;
}

// Formal metadata includes an authorization *reference*, never credentials.
export function assertRealCapturePrivacy(capture) {
  const visit = (value, trail = []) => {
    if (Array.isArray(value)) { value.forEach((item, i) => visit(item, [...trail, i])); return; }
    if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if (key === 'authorization' && trail.length === 0 && item && typeof item === 'object'
            && Object.keys(item).every(k => ['ref', 'sha256', 'expires_at'].includes(k))) continue;
        if (FORBIDDEN_KEYS.has(key.toLowerCase()) || ['answer_html', 'html', 'screenshot', 'dom', 'account_id', 'user_id', 'email', 'email_address', 'session_id', 'localstorage', 'sessionstorage', 'apikey'].includes(key.toLowerCase()))
          throw new AnswerSampleError('PRIVACY_SCOPE_VIOLATION', 'Formal capture contains account, credential or unscoped page data');
        visit(item, [...trail, key]);
      }
    } else if (typeof value === 'string' && value.trim()) assertManualAnswerPrivacy(value);
  };
  visit(capture);
  return capture;
}

function requiredRoles(sample) {
  if (['success', 'refusal'].includes(sample.outcome)) return ['answer_text'];
  if (['timeout', 'no_result', 'challenge', 'system_failure'].includes(sample.outcome)) {
    return ['collector_log', 'screenshot'];
  }
  return [];
}

function validateArtifactPlan(sample) {
  const roles = new Set(sample.artifacts.map((artifact) => artifact.role));
  const required = requiredRoles(sample);
  if (required.length === 1 && !roles.has(required[0])) {
    throw new AnswerSampleError('RAW_ARTIFACT_REQUIRED', `Sample ${sample.outcome} 缺少 ${required[0]}`);
  }
  if (required.length === 2 && !required.some((role) => roles.has(role))) {
    throw new AnswerSampleError('RAW_ARTIFACT_REQUIRED', `Sample ${sample.outcome} 缺少诊断 artifact`);
  }
  if (sample.artifacts.length === 0) {
    throw new AnswerSampleError('RAW_ARTIFACT_REQUIRED', 'Sample 至少需要一个 artifact');
  }
}

async function artifactBytes(workspace, artifact) {
  if (artifact.content !== undefined) return Buffer.from(artifact.content);
  const sourcePath = assertSafeRelativePath(artifact.source_path);
  await assertNoSymlinkPath(workspace, sourcePath);
  return readFile(resolveWithin(workspace, sourcePath));
}

async function writeArtifacts({ workspace, runId, sample }) {
  const descriptors = [];
  for (const artifact of sample.artifacts) {
    const outputPath = assertSafeRelativePath(artifact.output_path);
    if (!outputPath.startsWith('raw/') && !outputPath.startsWith('outputs/')) {
      throw new AnswerSampleError('RAW_ARTIFACT_REQUIRED', 'artifact 输出必须位于 raw/ 或 outputs/');
    }
    const bytes = await artifactBytes(workspace, artifact);
    await writeRunArtifact({
      workspace,
      runId,
      relativePath: outputPath,
      content: bytes,
      idempotent: true,
      conflictCode: 'RAW_ARTIFACT_CONFLICT',
    });
    descriptors.push({
      role: artifact.role,
      availability: 'captured',
      path: outputPath,
      sha256: sha256(bytes),
      media_type: artifact.media_type,
    });
  }
  return descriptors;
}

export async function materializeFixtureSample(args) {
  return materializeRecordedSample(args);
}

export async function materializeRealSample(args) {
  const { assertRealSlot } = await import('./real-cycle-contract.mjs');
  assertRealSlot(args.slot, args.capture, args.priorCaptures ?? []);
  return materializeRecordedSample({ ...args, realCapture: args.capture });
}

async function materializeRecordedSample({ workspace, plan, sample, realCapture }) {
  assertNoSensitiveFixtureInput(sample);
  validateArtifactPlan(sample);
  const graph = await loadWorkspaceGraph({ workspace });
  const queryVersion = plan.query_cluster.query_versions[0];
  const query = graph.byId.get(queryVersion.ref)?.data;
  const querySet = graph.byId.get(plan.query_set_versions[0].ref)?.data;
  const profile = graph.byId.get(plan.profile.data.id)?.data;
  const run = graph.byId.get(plan.run.id)?.data;
  if (!query || query.version !== queryVersion.version || query.status !== 'formal'
      || !querySet || querySet.status !== 'frozen'
      || !profile || profile.status !== 'frozen'
      || !run || run.skill !== 'geo-answer-cycle') {
    throw new AnswerSampleError('ANALYSIS_CHAIN_INCOMPLETE', 'M5 Sample 输入链不完整');
  }
  const artifacts = await writeArtifacts({ workspace, runId: plan.run.id, sample });
  const data = {
    id: sample.id,
    record_type: 'answer_sample',
    status: 'recorded',
    version: '1.0.0',
    created_at: sample.captured_at,
    updated_at: sample.captured_at,
    title: `Recorded sample ${sample.ordinal}`,
    ...(profile.test_scope ? { test_scope: { ...profile.test_scope } } : {}),
    ...((sample.extraction || realCapture) ? {extensions:{
      ...(sample.extraction ? {'geo.extraction':sample.extraction} : {}),
      ...(realCapture ? {'geo.real_capture': { cycle_ref: realCapture.cycle_ref, knowledge_base_ref: realCapture.knowledge_base_ref,
        conversation_id: realCapture.conversation_id, result_url: realCapture.result_url, window_id: realCapture.window.id,
        raw_path: sample.capture_path, raw_sha256: sample.capture_sha256 }} : {}),
    }} : {}),
    purpose: plan.purpose,
    query_ref: query.id,
    query_version: query.version,
    query_set_ref: querySet.id,
    query_set_version: querySet.version,
    intent: query.intent,
    platform: profile.platform,
    collector_profile_ref: profile.id,
    collector_profile_version: profile.version,
    run_ref: run.id,
    slot_key: sampleSlotKey({
      purpose: plan.purpose,
      queryRef: query.id,
      queryVersion: query.version,
      platform: profile.platform,
      collectorProfileRef: profile.id,
      collectorProfileVersion: profile.version,
      queryTemplateVersion: profile.query_template_version,
      timeWindowId: profile.time_window.id,
      ordinal: sample.ordinal,
    }),
    ordinal: sample.ordinal,
    attempt_no: sample.attempt_no ?? 1,
    ...(sample.retry_of_ref ? { retry_of_ref: sample.retry_of_ref } : {}),
    outcome: sample.outcome,
    captured_at: sample.captured_at,
    collection_method: realCapture ? profile.collection_method : 'recorded_fixture',
    artifacts,
    raw_manifest_sha256: rawManifestSha(artifacts),
    privacy: {
      account_identifier_stored: false,
      credentials_stored: false,
      answer_region_only: true,
      redaction_notes: [realCapture ? 'Real consumer answer region only; account data excluded.' : 'Synthetic .invalid recorded fixture; no account data.'],
    },
    ...(plan.purpose === 'post_change_retest' ? { publication_refs: sample.publication_refs ?? [], technical_retest_run_refs: sample.technical_retest_run_refs ?? [], baseline_aggregation_refs: sample.baseline_aggregation_refs ?? [] } : {}),
    ...(sample.cancellation ? { cancellation: sample.cancellation } : {}),
  };
  validateObjectData(data, { path: sample.path });
  const result = await writeCreateOnly(
    workspace,
    sample.path,
    serializeMarkdownObject(data, `# Recorded Sample ${sample.ordinal}\n`),
    { idempotent: true, conflictCode: 'SAMPLE_SLOT_CONFLICT' },
  );
  return { ...data, action: result.action };
}

export async function materializeManualSample({ workspace, plan, answerText }) {
  assertManualAnswerPrivacy(answerText);
  assertNoSensitiveFixtureInput(plan);
  const graph = await loadWorkspaceGraph({ workspace });
  const query = graph.byId.get(plan.query_version.ref)?.data;
  const querySet = graph.byId.get(plan.query_set_versions[0].ref)?.data;
  const profile = graph.byId.get(plan.profile.data.id)?.data;
  const run = graph.byId.get(plan.run.id)?.data;
  if (!query || query.version !== plan.query_version.version || query.status !== 'formal'
      || !querySet || querySet.status !== 'frozen'
      || !profile || profile.status !== 'frozen' || profile.collection_method !== 'manual'
      || !run || run.skill !== 'geo-answer-cycle') {
    throw new AnswerSampleError('ANALYSIS_CHAIN_INCOMPLETE', 'manual Sample 输入链不完整');
  }
  const answerBytes = Buffer.from(answerText);
  const logContent = stableStringify({
    collection_method: 'manual',
    operator_role: 'MyyShop Owner',
    temporary_chat: Boolean(plan.sample.temporary_chat),
    account_identifier_stored: false,
    credentials_stored: false,
    copied_by_user: true,
    manual_source_kind: plan.manual_source?.kind ?? 'owner_manual_copy',
    capture_surface: plan.manual_source?.capture_surface ?? 'owner_browser',
    result_url: plan.manual_source?.result_url ?? null,
    ...(plan.manual_source?.observed_model_mode
      ? { observed_model_mode: plan.manual_source.observed_model_mode }
      : {}),
  }, 2);
  const logBytes = Buffer.from(logContent);
  await writeRunArtifact({
    workspace,
    runId: run.id,
    relativePath: plan.sample.answer_output_path,
    content: answerBytes,
    idempotent: true,
    conflictCode: 'RAW_ARTIFACT_CONFLICT',
  });
  await writeRunArtifact({
    workspace,
    runId: run.id,
    relativePath: plan.sample.log_output_path,
    content: logBytes,
    idempotent: true,
    conflictCode: 'RAW_ARTIFACT_CONFLICT',
  });
  const artifacts = [
    {
      role: 'answer_text', availability: 'captured', path: plan.sample.answer_output_path,
      sha256: sha256(answerBytes), media_type: 'text/markdown',
    },
    {
      role: 'collector_log', availability: 'captured', path: plan.sample.log_output_path,
      sha256: sha256(logBytes), media_type: 'application/json',
    },
    {
      role: 'screenshot', availability: 'unavailable',
      unavailable_reason: 'Manual privacy mode: no account or full-page screenshot retained.',
    },
    {
      role: 'dom', availability: 'unavailable',
      unavailable_reason: 'Manual privacy mode: page DOM was not extracted.',
    },
  ];
  const data = {
    id: plan.sample.id,
    record_type: 'answer_sample',
    status: 'recorded',
    version: '1.0.0',
    created_at: plan.sample.captured_at,
    updated_at: plan.sample.captured_at,
    title: `Manual ${profile.platform} ${plan.purpose} sample ${plan.sample.ordinal}`,
    purpose: plan.purpose,
    query_ref: query.id,
    query_version: query.version,
    query_set_ref: querySet.id,
    query_set_version: querySet.version,
    intent: query.intent,
    platform: profile.platform,
    collector_profile_ref: profile.id,
    collector_profile_version: profile.version,
    run_ref: run.id,
    slot_key: sampleSlotKey({
      purpose: plan.purpose,
      queryRef: query.id,
      queryVersion: query.version,
      platform: profile.platform,
      collectorProfileRef: profile.id,
      collectorProfileVersion: profile.version,
      queryTemplateVersion: profile.query_template_version,
      timeWindowId: profile.time_window.id,
      ordinal: plan.sample.ordinal,
    }),
    ordinal: plan.sample.ordinal,
    attempt_no: plan.sample.attempt_no ?? 1,
    outcome: plan.sample.outcome,
    captured_at: plan.sample.captured_at,
    collection_method: 'manual',
    artifacts,
    raw_manifest_sha256: rawManifestSha(artifacts),
    privacy: {
      account_identifier_stored: false,
      credentials_stored: false,
      answer_region_only: true,
      redaction_notes: [
        'Owner supplied the complete result through the approved Chrome/manual path.',
        'No account chrome, email, cookie, storage, screenshot or DOM retained.',
      ],
    },
  };
  validateObjectData(data, { path: plan.sample.path });
  const result = await writeCreateOnly(
    workspace,
    plan.sample.path,
    serializeMarkdownObject(data, `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'SAMPLE_SLOT_CONFLICT' },
  );
  return { ...data, action: result.action };
}
