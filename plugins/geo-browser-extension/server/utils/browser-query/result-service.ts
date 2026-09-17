import striptags from 'striptags'

import type {
  BrowserExtractor,
  BrowserQueryTask,
  ExtractionRecord,
  PendingQueryResult,
  QueryCapture
} from '../../../shared/types/browser-query'
import { fingerprint, sha256, stableId } from './canonical'
import { BrowserQueryError, fail, safeError } from './errors'
import type { BrowserQueryRepository } from './repository'
import {
  acknowledgementSchema,
  artifactReadSchema,
  captureSubmissionSchema,
  extractionOutputSchema,
  pendingListSchema
} from './schemas'
import {
  assertPrivateTextSafe,
  checkedUrl,
  currentAttempt,
  nextTaskStatus,
  parseContract,
  scanForbiddenKeys
} from './service-helpers'

type PersistTask = (
  task: BrowserQueryTask,
  expectedRevision: number,
  now: string
) => Promise<void>

export function matchesExtractorProfile(record: Pick<ExtractionRecord, 'status' | 'provenance'>, profile: BrowserExtractor['profile']) {
  return record.status === 'completed'
    && record.provenance.provider === profile.provider
    && record.provenance.model === profile.model
    && record.provenance.prompt_sha256 === profile.promptSha256
    && record.provenance.schema_version === profile.schemaVersion
}

function resultCursor(item: PendingQueryResult) {
  return Buffer.from(JSON.stringify([item.created_at, item.result_id])).toString('base64url')
}

function parseResultCursor(value: string | undefined) {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
    if (Array.isArray(parsed) && parsed.length === 2
      && parsed.every(item => typeof item === 'string' && item)) {
      return { createdAt: parsed[0] as string, resultId: parsed[1] as string }
    }
  } catch {
    // Stable public error below.
  }
  fail('CYCLE_QUERY_INPUT_INVALID', 'Pending result cursor is invalid')
}

function compareUtf8(left: string, right: string) {
  return Buffer.compare(Buffer.from(left), Buffer.from(right))
}

export class BrowserQueryResultService {
  constructor(private options: {
    repository: BrowserQueryRepository
    extractor: BrowserExtractor
    getTask(taskId: string): Promise<BrowserQueryTask>
    persistTask: PersistTask
  }) {}

  async captureQueryResult(value: unknown) {
    scanForbiddenKeys(value)
    const input = parseContract(captureSubmissionSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    assertPrivateTextSafe(input.answer_text)
    const task = await this.options.getTask(input.task_id)
    this.assertRevision(task, input.expected_revision)
    const { query, attempt } = currentAttempt(task, input.attempt_id)
    const canCapture = attempt.stage === 'waiting_response'
      || (attempt.stage === 'waiting_human'
        && ['submission_unknown', 'result_confirmation'].includes(attempt.waiting_reason ?? ''))
    if (!canCapture || !attempt.conversation_state || !attempt.conversation_proof) {
      fail('QUERY_TASK_TRANSITION_INVALID', 'Attempt is not ready to capture a result')
    }
    const resultUrl = checkedUrl(input.result_url, 'PLATFORM_ALLOWLIST_VIOLATION')
    if (!task.platform.result_url_origins.includes(resultUrl.origin)) {
      fail('PLATFORM_ALLOWLIST_VIOLATION', 'Result URL is outside the platform origin')
    }
    const rawBytes = Buffer.from(input.answer_html)
    const rawSha = sha256(rawBytes)
    const existingUrl = await this.options.repository.findCaptureByResultUrl(
      task.platform.id,
      resultUrl.toString()
    )
    if (existingUrl && (existingUrl.task_id !== task.task_id
      || existingUrl.attempt_id !== attempt.attempt_id)) {
      fail('RESULT_URL_CONFLICT', 'Result URL is already bound to another formal attempt')
    }
    if (existingUrl && existingUrl.answer_html_artifact.sha256 !== rawSha) {
      fail('RAW_ARTIFACT_CONFLICT', 'Formal attempt result URL already has different raw bytes')
    }
    const artifactId = stableId('BQA', { media_type: 'text/html', sha256: rawSha })
    await this.options.repository.createArtifact({
      artifact_id: artifactId,
      media_type: 'text/html',
      bytes: rawBytes,
      byte_length: rawBytes.length,
      sha256: rawSha,
      created_at: input.captured_at
    })
    const captureBase = {
      schema_version: 'geo-browser-query-capture-v2' as const,
      capture_id: stableId('BQC', {
        task_id: task.task_id,
        attempt_id: attempt.attempt_id,
        raw_sha256: rawSha
      }),
      task_id: task.task_id,
      attempt_id: attempt.attempt_id,
      cycle: { ref: task.cycle.ref, version: task.cycle.version },
      query_set: task.query_set,
      query: {
        ref: query.ref,
        version: query.version,
        query_text_sha256: query.query_text_sha256
      },
      platform: task.platform.id,
      profile: { ref: task.platform.profile_ref, version: task.platform.profile_version },
      collection_mode: task.platform.execution_mode,
      conversation_state: attempt.conversation_state,
      conversation_proof: attempt.conversation_proof,
      outcome: input.outcome,
      result_url: resultUrl.toString(),
      captured_at: input.captured_at,
      answer_text: input.answer_text,
      answer_html_artifact: {
        artifact_id: artifactId,
        media_type: 'text/html' as const,
        byte_length: rawBytes.length,
        sha256: rawSha
      },
      citations: input.citations,
      selector_version: task.platform.selector_version,
      terminal_detector_version: task.platform.terminal_detector_version,
      detector_diagnostics: input.detector_diagnostics
    }
    const capture: QueryCapture = {
      ...captureBase,
      capture_payload_sha256: fingerprint(captureBase)
    }
    await this.options.repository.createCapture(capture)
    attempt.stage = 'extraction_pending'
    attempt.outcome = capture.outcome
    attempt.capture_id = capture.capture_id
    attempt.captured_at = input.captured_at
    delete attempt.waiting_reason
    query.status = 'running'
    task.status = 'running'
    await this.options.persistTask(task, input.expected_revision, input.captured_at)
    const extraction = await this.extractCapture(capture, input.captured_at)
    return { capture, ...extraction }
  }

  async retryExtraction(value: { capture_id: string, now: string }) {
    const capture = await this.options.repository.getCapture(value.capture_id)
    if (!capture) fail('RESULT_NOT_FOUND', 'Capture not found')
    if (!Number.isFinite(Date.parse(value.now))) {
      fail('CYCLE_QUERY_INPUT_INVALID', 'now must be RFC3339')
    }
    return this.extractCapture(capture, value.now)
  }

  async listPendingResults(value: unknown) {
    const input = parseContract(pendingListSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    const all = await this.options.repository.listPendingResults({
      cycleRef: input.cycle_ref,
      taskId: input.task_id
    })
    const cursor = parseResultCursor(input.cursor)
    const eligible = cursor
      ? all.filter(item => compareUtf8(item.created_at, cursor.createdAt) > 0
        || (item.created_at === cursor.createdAt
          && compareUtf8(item.result_id, cursor.resultId) > 0))
      : all
    const items = eligible.slice(0, input.limit)
    return {
      items: items.map(item => ({ ...item })),
      next_cursor: eligible.length > input.limit && items.length
        ? resultCursor(items.at(-1)!)
        : null
    }
  }

  async getQueryResult(resultId: string) {
    const pending = await this.options.repository.getPendingResult(resultId)
    if (!pending) fail('RESULT_NOT_FOUND', 'Pending result not found')
    const capture = await this.options.repository.getCapture(pending.capture_id)
    const extraction = await this.options.repository.getExtraction(pending.extraction_id)
    if (!capture || !extraction) fail('RESULT_NOT_FOUND', 'Pending result payload is incomplete')
    return { pending, capture, extraction }
  }

  async getResultArtifact(value: unknown) {
    const input = parseContract(artifactReadSchema, value, 'ARTIFACT_RANGE_INVALID')
    const pending = await this.options.repository.getPendingResult(input.result_id)
    if (!pending) fail('RESULT_NOT_FOUND', 'Pending result not found')
    if (pending.raw_artifact_id !== input.artifact_id) {
      fail('RESULT_NOT_FOUND', 'Artifact does not belong to result')
    }
    const artifact = await this.options.repository.getArtifact(input.artifact_id)
    if (!artifact) fail('RESULT_NOT_FOUND', 'Artifact not found')
    if (input.offset >= artifact.byte_length && artifact.byte_length !== 0) {
      fail('ARTIFACT_RANGE_INVALID', 'Artifact offset is out of range')
    }
    const end = Math.min(input.offset + input.max_bytes, artifact.byte_length)
    const bytes = Buffer.from(artifact.bytes).subarray(input.offset, end)
    return {
      artifact_id: artifact.artifact_id,
      media_type: artifact.media_type,
      offset: input.offset,
      next_offset: end < artifact.byte_length ? end : null,
      total_bytes: artifact.byte_length,
      sha256: artifact.sha256,
      encoding: 'base64',
      data_base64: bytes.toString('base64')
    }
  }

  async acknowledgeResult(value: unknown) {
    const input = parseContract(acknowledgementSchema, value, 'RESULT_ACK_CONFLICT')
    const pending = await this.options.repository.getPendingResult(input.result_id)
    if (!pending) fail('RESULT_NOT_FOUND', 'Pending result not found')
    if (pending.capture_sha256 !== input.capture_sha256
      || pending.extraction_sha256 !== input.extraction_sha256) {
      fail('RESULT_ACK_CONFLICT', 'Acknowledgement checksums do not match result')
    }
    const action = await this.options.repository.acknowledgePendingResult(input.result_id, {
      receiverFingerprint: input.receiver_fingerprint,
      receivedAt: input.received_at
    })
    if (action === 'acknowledged') {
      const task = await this.options.getTask(pending.task_id)
      const located = task.queries.flatMap(query => query.attempts
        .map(attempt => ({ query, attempt })))
        .find(item => item.attempt.result_id === pending.result_id)
      if (located) {
        located.attempt.stage = 'acknowledged'
        located.attempt.completed_at = input.received_at
        await this.options.persistTask(task, task.revision, input.received_at)
      }
    }
    return { action, result_id: input.result_id }
  }

  private async extractCapture(capture: QueryCapture, now: string) {
    const prior = await this.options.repository.listExtractions(capture.capture_id)
    const completed = [...prior].reverse().find(item => matchesExtractorProfile(item, this.options.extractor.profile))
    const created = completed
      ? { extraction: completed, pending: await this.ensurePending(capture, completed) }
      : await this.buildExtraction({
          capture,
          extractionId: stableId('BQX', {
            capture_id: capture.capture_id,
            attempt_no: prior.length + 1
          }),
          attemptNo: prior.length + 1,
          provenance: {
            provider: this.options.extractor.profile.provider,
            model: this.options.extractor.profile.model,
            prompt_version: this.options.extractor.profile.promptVersion,
            prompt_sha256: this.options.extractor.profile.promptSha256,
            schema_version: this.options.extractor.profile.schemaVersion,
            started_at: now,
            completed_at: now
          }
        })
    const task = await this.options.getTask(capture.task_id)
    const { query, attempt } = currentAttempt(task, capture.attempt_id)
    if (created.pending) {
      attempt.stage = created.pending.status === 'acknowledged'
        ? 'acknowledged'
        : 'result_pending'
      attempt.extraction_id = created.extraction.extraction_id
      attempt.result_id = created.pending.result_id
      attempt.completed_at = created.pending.acknowledged_at ?? now
      delete attempt.extraction_failure
      query.status = 'completed'
    } else {
      attempt.stage = 'extraction_pending'
      attempt.extraction_failure = created.extraction.diagnostics
      query.status = 'failed'
    }
    task.status = nextTaskStatus(task)
    if (task.status === 'completed') task.completed_at = now
    await this.options.persistTask(task, task.revision, now)
    return { ...created, task }
  }

  private async buildExtraction(input: {
    capture: QueryCapture
    extractionId: string
    attemptNo: number
    provenance: ExtractionRecord['provenance']
  }): Promise<{ extraction: ExtractionRecord, pending: PendingQueryResult | null }> {
    const { capture, extractionId, attemptNo, provenance } = input
    provenance.started_at = new Date().toISOString()
    try {
      const raw = await this.options.repository.getArtifact(capture.answer_html_artifact.artifact_id)
      if (!raw || raw.sha256 !== capture.answer_html_artifact.sha256) {
        fail('RAW_ARTIFACT_CONFLICT', 'Capture raw artifact is missing or changed')
      }
      const citations = capture.citations.map(citation => ({
        occurrence_ordinal: citation.ordinal,
        url: citation.href_normalized,
        title: citation.title,
        context: citation.anchor_or_context
      }))
      const extracted = await this.options.extractor.extract({
        query: capture.query,
        outcome: capture.outcome,
        answerText: capture.answer_text,
        safeHtmlText: striptags(Buffer.from(raw.bytes).toString('utf8')),
        citations,
        rawSha256: raw.sha256
      })
      const envelope = extracted && typeof extracted === 'object' && 'output' in extracted && 'audit' in extracted
        ? extracted as { output: unknown, audit: Record<string, unknown> }
        : null
      const output = parseContract(extractionOutputSchema, envelope ? envelope.output : extracted, 'EXTRACTION_SCHEMA_INVALID')
      provenance.completed_at = new Date().toISOString()
      if (envelope) {
        const audit = envelope.audit
        if (typeof audit.started_at === 'string') provenance.started_at = audit.started_at
        if (typeof audit.completed_at === 'string') provenance.completed_at = audit.completed_at
        if (typeof audit.id === 'string') provenance.call_id = audit.id
        if (typeof audit.duration_ms === 'number') provenance.duration_ms = audit.duration_ms
        if (typeof audit.response_model === 'string') provenance.response_model = audit.response_model
        provenance.usage = audit.usage && typeof audit.usage === 'object' && !Array.isArray(audit.usage)
          ? audit.usage as Record<string, unknown>
          : null
      }
      const base = {
        schema_version: 'geo-browser-extraction-result-v1' as const,
        extraction_id: extractionId,
        capture_id: capture.capture_id,
        attempt_no: attemptNo,
        raw_sha256: raw.sha256,
        status: 'completed' as const,
        ...output,
        provenance
      }
      const extraction: ExtractionRecord = { ...base, output_sha256: fingerprint(base) }
      await this.options.repository.createExtraction(extraction)
      const pending = await this.ensurePending(capture, extraction)
      return { extraction, pending }
    } catch (error) {
      provenance.completed_at = new Date().toISOString()
      const diagnosis = error instanceof BrowserQueryError
        ? safeError(error)
        : safeError(new BrowserQueryError('EXTRACTION_MODEL_FAILED', 'Extractor failed'))
      const base = {
        schema_version: 'geo-browser-extraction-result-v1' as const,
        extraction_id: extractionId,
        capture_id: capture.capture_id,
        attempt_no: attemptNo,
        raw_sha256: capture.answer_html_artifact.sha256,
        status: 'failed' as const,
        diagnostics: diagnosis,
        provenance
      }
      const extraction: ExtractionRecord = { ...base, output_sha256: fingerprint(base) }
      await this.options.repository.createExtraction(extraction)
      return { extraction, pending: null }
    }
  }

  private async ensurePending(capture: QueryCapture, extraction: ExtractionRecord) {
    const resultId = stableId('BQR', {
      capture_id: capture.capture_id,
      extraction_id: extraction.extraction_id
    })
    const existing = await this.options.repository.getPendingResult(resultId)
    if (existing) return existing
    const pending: PendingQueryResult = {
      schema_version: 'geo-browser-pending-result-v1',
      result_id: resultId,
      task_id: capture.task_id,
      capture_id: capture.capture_id,
      extraction_id: extraction.extraction_id,
      cycle_ref: capture.cycle.ref,
      query_ref: capture.query.ref,
      outcome: capture.outcome,
      capture_sha256: fingerprint(capture),
      extraction_sha256: fingerprint(extraction),
      raw_artifact_id: capture.answer_html_artifact.artifact_id,
      raw_byte_length: capture.answer_html_artifact.byte_length,
      raw_sha256: capture.answer_html_artifact.sha256,
      status: 'pending',
      created_at: extraction.provenance.completed_at
    }
    await this.options.repository.createPendingResult(pending)
    return pending
  }

  private assertRevision(task: BrowserQueryTask, expectedRevision: number) {
    if (task.revision !== expectedRevision) {
      fail('QUERY_TASK_REVISION_CONFLICT', 'Browser task revision conflict', {
        expected_revision: expectedRevision,
        actual_revision: task.revision
      })
    }
  }
}
