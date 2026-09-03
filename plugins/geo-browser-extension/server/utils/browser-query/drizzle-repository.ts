import { and, asc, eq, sql } from 'drizzle-orm'
import type { PgliteDatabase } from 'drizzle-orm/pglite'

import * as schema from '../../db/schema'
import type {
  BrowserArtifact,
  BrowserQueryTask,
  ExtractionRecord,
  PendingQueryResult,
  QueryCapture,
  StoredCycleQueryInput
} from '../../../shared/types/browser-query'
import { canonicalJson } from './canonical'
import { fail } from './errors'
import type { BrowserQueryRepository } from './repository'

export type BrowserQueryDatabase = PgliteDatabase<typeof schema>

function same(left: unknown, right: unknown) {
  return canonicalJson(left) === canonicalJson(right)
}

export class DrizzleBrowserQueryRepository implements BrowserQueryRepository {
  constructor(private database: BrowserQueryDatabase) {}

  async getCycleInput(id: string) {
    const [row] = await this.database.select({ payload: schema.browserCycleQueryInputs.payload })
      .from(schema.browserCycleQueryInputs)
      .where(eq(schema.browserCycleQueryInputs.id, id))
      .limit(1)
    return row?.payload ?? null
  }

  async getCycleInputByRequestId(requestId: string) {
    const [row] = await this.database.select({ payload: schema.browserCycleQueryInputs.payload })
      .from(schema.browserCycleQueryInputs)
      .where(eq(schema.browserCycleQueryInputs.requestId, requestId))
      .limit(1)
    return row?.payload ?? null
  }

  async listCycleInputs(cycleRef?: string) {
    return (await this.database.select({ payload: schema.browserCycleQueryInputs.payload })
      .from(schema.browserCycleQueryInputs)
      .where(cycleRef ? eq(schema.browserCycleQueryInputs.cycleRef, cycleRef) : undefined)
      .orderBy(
        asc(schema.browserCycleQueryInputs.registeredAt),
        asc(schema.browserCycleQueryInputs.id)
      )).map(row => row.payload)
  }

  async createCycleInput(input: StoredCycleQueryInput) {
    const inserted = await this.database.insert(schema.browserCycleQueryInputs).values({
      id: input.input_id,
      requestId: input.request_id,
      cycleRef: input.cycle.ref,
      fingerprint: input.fingerprint,
      payload: input,
      registeredAt: input.registered_at
    }).onConflictDoNothing().returning({ id: schema.browserCycleQueryInputs.id })
    if (inserted.length) return 'created' as const
    const current = await this.getCycleInputByRequestId(input.request_id)
    if (!current || !same(current, input)) {
      fail('CYCLE_QUERY_INPUT_CONFLICT', 'Cycle Query Input conflicts with durable bytes')
    }
    return 'kept' as const
  }

  async getTask(id: string) {
    const [row] = await this.database.select({ payload: schema.browserQueryTasks.payload })
      .from(schema.browserQueryTasks)
      .where(eq(schema.browserQueryTasks.id, id))
      .limit(1)
    return row?.payload ?? null
  }

  async getTaskByRequestId(requestId: string) {
    const [row] = await this.database.select({ payload: schema.browserQueryTasks.payload })
      .from(schema.browserQueryTasks)
      .where(eq(schema.browserQueryTasks.requestId, requestId))
      .limit(1)
    return row?.payload ?? null
  }

  async listTasks(cycleRef?: string) {
    return (await this.database.select({ payload: schema.browserQueryTasks.payload })
      .from(schema.browserQueryTasks)
      .where(cycleRef ? eq(schema.browserQueryTasks.cycleRef, cycleRef) : undefined)
      .orderBy(asc(schema.browserQueryTasks.createdAt), asc(schema.browserQueryTasks.id)))
      .map(row => row.payload)
  }

  async createTask(task: BrowserQueryTask) {
    const inserted = await this.database.insert(schema.browserQueryTasks).values({
      id: task.task_id,
      requestId: task.request_id,
      inputId: task.input_id,
      cycleRef: task.cycle.ref,
      status: task.status,
      revision: task.revision,
      payload: task,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }).onConflictDoNothing().returning({ id: schema.browserQueryTasks.id })
    if (inserted.length) return 'created' as const
    const current = await this.getTaskByRequestId(task.request_id)
    if (!current || !same(current, task)) {
      fail('BROWSER_QUERY_TASK_CONFLICT', 'Browser Query Task conflicts with durable bytes')
    }
    return 'kept' as const
  }

  async saveTask(task: BrowserQueryTask, expectedRevision: number) {
    const updated = await this.database.update(schema.browserQueryTasks).set({
      status: task.status,
      revision: task.revision,
      payload: task,
      updatedAt: task.updated_at
    }).where(and(
      eq(schema.browserQueryTasks.id, task.task_id),
      eq(schema.browserQueryTasks.revision, expectedRevision)
    )).returning({ id: schema.browserQueryTasks.id })
    if (!updated.length) fail('QUERY_TASK_REVISION_CONFLICT', 'Browser Query Task revision conflict')
  }

  async getArtifact(id: string) {
    const [row] = await this.database.select().from(schema.browserQueryArtifacts)
      .where(eq(schema.browserQueryArtifacts.id, id)).limit(1)
    if (!row) return null
    return {
      artifact_id: row.id,
      media_type: row.mediaType,
      bytes: Buffer.from(row.contentBase64, 'base64'),
      byte_length: row.byteLength,
      sha256: row.sha256,
      created_at: row.createdAt
    }
  }

  async createArtifact(artifact: BrowserArtifact) {
    const inserted = await this.database.insert(schema.browserQueryArtifacts).values({
      id: artifact.artifact_id,
      mediaType: artifact.media_type,
      byteLength: artifact.byte_length,
      sha256: artifact.sha256,
      contentBase64: Buffer.from(artifact.bytes).toString('base64'),
      createdAt: artifact.created_at
    }).onConflictDoNothing().returning({ id: schema.browserQueryArtifacts.id })
    if (inserted.length) return 'created' as const
    const current = await this.getArtifact(artifact.artifact_id)
    if (!current || current.sha256 !== artifact.sha256
      || !Buffer.from(current.bytes).equals(Buffer.from(artifact.bytes))) {
      fail('RAW_ARTIFACT_CONFLICT', 'Raw artifact ID has different bytes')
    }
    return 'kept' as const
  }

  async getCapture(id: string) {
    const [row] = await this.database.select({ payload: schema.browserQueryCaptures.payload })
      .from(schema.browserQueryCaptures)
      .where(eq(schema.browserQueryCaptures.id, id)).limit(1)
    return row?.payload ?? null
  }

  async findCaptureByResultUrl(platform: string, resultUrl: string) {
    const [row] = await this.database.select({ payload: schema.browserQueryCaptures.payload })
      .from(schema.browserQueryCaptures)
      .where(and(
        sql`${schema.browserQueryCaptures.payload}->>'platform' = ${platform}`,
        sql`${schema.browserQueryCaptures.payload}->>'result_url' = ${resultUrl}`
      )).limit(1)
    return row?.payload ?? null
  }

  async createCapture(capture: QueryCapture) {
    const inserted = await this.database.insert(schema.browserQueryCaptures).values({
      id: capture.capture_id,
      taskId: capture.task_id,
      artifactId: capture.answer_html_artifact.artifact_id,
      payload: capture,
      capturedAt: capture.captured_at
    }).onConflictDoNothing().returning({ id: schema.browserQueryCaptures.id })
    if (inserted.length) return 'created' as const
    const current = await this.getCapture(capture.capture_id)
    if (!current || !same(current, capture)) fail('RAW_ARTIFACT_CONFLICT', 'Capture bytes conflict')
    return 'kept' as const
  }

  async listExtractions(captureId: string) {
    return (await this.database.select({ payload: schema.browserExtractionResults.payload })
      .from(schema.browserExtractionResults)
      .where(eq(schema.browserExtractionResults.captureId, captureId))
      .orderBy(asc(schema.browserExtractionResults.attemptNo)))
      .map(row => row.payload)
  }

  async getExtraction(id: string) {
    const [row] = await this.database.select({ payload: schema.browserExtractionResults.payload })
      .from(schema.browserExtractionResults)
      .where(eq(schema.browserExtractionResults.id, id)).limit(1)
    return row?.payload ?? null
  }

  async createExtraction(extraction: ExtractionRecord) {
    const inserted = await this.database.insert(schema.browserExtractionResults).values({
      id: extraction.extraction_id,
      captureId: extraction.capture_id,
      attemptNo: extraction.attempt_no,
      status: extraction.status,
      payload: extraction,
      completedAt: extraction.provenance.completed_at
    }).onConflictDoNothing().returning({ id: schema.browserExtractionResults.id })
    if (inserted.length) return 'created' as const
    const current = await this.getExtraction(extraction.extraction_id)
    if (!current || !same(current, extraction)) {
      fail('EXTRACTION_RESULT_CONFLICT', 'Extraction result bytes conflict')
    }
    return 'kept' as const
  }

  async getPendingResult(id: string) {
    const [row] = await this.database.select({ payload: schema.browserPendingQueryResults.payload })
      .from(schema.browserPendingQueryResults)
      .where(eq(schema.browserPendingQueryResults.id, id)).limit(1)
    return row?.payload ?? null
  }

  async listPendingResults({ cycleRef, taskId }: { cycleRef?: string, taskId?: string }) {
    const filters = [eq(schema.browserPendingQueryResults.status, 'pending')]
    if (cycleRef) filters.push(eq(schema.browserPendingQueryResults.cycleRef, cycleRef))
    if (taskId) filters.push(eq(schema.browserPendingQueryResults.taskId, taskId))
    return (await this.database.select({ payload: schema.browserPendingQueryResults.payload })
      .from(schema.browserPendingQueryResults)
      .where(and(...filters))
      .orderBy(
        asc(schema.browserPendingQueryResults.createdAt),
        asc(schema.browserPendingQueryResults.id)
      )).map(row => row.payload)
  }

  async createPendingResult(result: PendingQueryResult) {
    const inserted = await this.database.insert(schema.browserPendingQueryResults).values({
      id: result.result_id,
      taskId: result.task_id,
      cycleRef: result.cycle_ref,
      captureId: result.capture_id,
      extractionId: result.extraction_id,
      status: result.status,
      payload: result,
      createdAt: result.created_at
    }).onConflictDoNothing().returning({ id: schema.browserPendingQueryResults.id })
    if (inserted.length) return 'created' as const
    const current = await this.getPendingResult(result.result_id)
    if (!current || !same(current, result)) fail('PENDING_RESULT_CONFLICT', 'Pending result conflict')
    return 'kept' as const
  }

  async acknowledgePendingResult(
    id: string,
    input: { receiverFingerprint: string, receivedAt: string }
  ) {
    const current = await this.getPendingResult(id)
    if (!current) fail('RESULT_NOT_FOUND', 'Pending result not found')
    if (current.status === 'acknowledged') {
      if (current.receiver_fingerprint !== input.receiverFingerprint) {
        fail('RESULT_ACK_CONFLICT', 'Result was acknowledged with another fingerprint')
      }
      return 'kept' as const
    }
    const next: PendingQueryResult = {
      ...current,
      status: 'acknowledged',
      receiver_fingerprint: input.receiverFingerprint,
      acknowledged_at: input.receivedAt
    }
    const updated = await this.database.update(schema.browserPendingQueryResults).set({
      status: 'acknowledged',
      receiverFingerprint: input.receiverFingerprint,
      acknowledgedAt: input.receivedAt,
      payload: next
    }).where(and(
      eq(schema.browserPendingQueryResults.id, id),
      eq(schema.browserPendingQueryResults.status, 'pending')
    )).returning({ id: schema.browserPendingQueryResults.id })
    if (!updated.length) {
      const raced = await this.getPendingResult(id)
      if (raced?.receiver_fingerprint === input.receiverFingerprint) return 'kept' as const
      fail('RESULT_ACK_CONFLICT', 'Concurrent acknowledgement conflict')
    }
    return 'acknowledged' as const
  }
}
