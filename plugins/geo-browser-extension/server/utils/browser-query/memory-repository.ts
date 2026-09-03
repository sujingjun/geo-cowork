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

function clone<T>(value: T): T {
  return structuredClone(value)
}

function equal(left: unknown, right: unknown) {
  return canonicalJson(left) === canonicalJson(right)
}

export class MemoryBrowserQueryRepository implements BrowserQueryRepository {
  private cycleInputs = new Map<string, StoredCycleQueryInput>()
  private tasks = new Map<string, BrowserQueryTask>()
  private artifacts = new Map<string, BrowserArtifact>()
  private captures = new Map<string, QueryCapture>()
  private extractions = new Map<string, ExtractionRecord>()
  private pending = new Map<string, PendingQueryResult>()

  async getCycleInput(id: string) {
    return clone(this.cycleInputs.get(id) ?? null)
  }

  async getCycleInputByRequestId(requestId: string) {
    return clone([...this.cycleInputs.values()].find(item => item.request_id === requestId) ?? null)
  }

  async listCycleInputs(cycleRef?: string) {
    return clone([...this.cycleInputs.values()]
      .filter(item => !cycleRef || item.cycle.ref === cycleRef)
      .sort((left, right) => left.registered_at.localeCompare(right.registered_at)
        || left.input_id.localeCompare(right.input_id)))
  }

  async createCycleInput(input: StoredCycleQueryInput) {
    const current = this.cycleInputs.get(input.input_id)
    if (current) {
      if (!equal(current, input)) fail('CYCLE_QUERY_INPUT_CONFLICT', 'Cycle input ID bytes conflict')
      return 'kept' as const
    }
    this.cycleInputs.set(input.input_id, clone(input))
    return 'created' as const
  }

  async getTask(id: string) {
    return clone(this.tasks.get(id) ?? null)
  }

  async getTaskByRequestId(requestId: string) {
    return clone([...this.tasks.values()].find(item => item.request_id === requestId) ?? null)
  }

  async listTasks(cycleRef?: string) {
    return clone([...this.tasks.values()]
      .filter(item => !cycleRef || item.cycle.ref === cycleRef)
      .sort((left, right) => left.created_at.localeCompare(right.created_at)
        || left.task_id.localeCompare(right.task_id)))
  }

  async createTask(task: BrowserQueryTask) {
    const current = this.tasks.get(task.task_id)
    if (current) {
      if (!equal(current, task)) fail('BROWSER_QUERY_TASK_CONFLICT', 'Browser task ID conflict')
      return 'kept' as const
    }
    this.tasks.set(task.task_id, clone(task))
    return 'created' as const
  }

  async saveTask(task: BrowserQueryTask, expectedRevision: number) {
    const current = this.tasks.get(task.task_id)
    if (!current || current.revision !== expectedRevision) {
      fail('QUERY_TASK_REVISION_CONFLICT', 'Browser task revision conflict', {
        expected_revision: expectedRevision,
        actual_revision: current?.revision
      })
    }
    this.tasks.set(task.task_id, clone(task))
  }

  async getArtifact(id: string) {
    return clone(this.artifacts.get(id) ?? null)
  }

  async createArtifact(artifact: BrowserArtifact) {
    return this.createImmutable(this.artifacts, artifact.artifact_id, artifact, 'RAW_ARTIFACT_CONFLICT')
  }

  async getCapture(id: string) {
    return clone(this.captures.get(id) ?? null)
  }

  async findCaptureByResultUrl(platform: string, resultUrl: string) {
    return clone([...this.captures.values()].find(item =>
      item.platform === platform && item.result_url === resultUrl) ?? null)
  }

  async createCapture(capture: QueryCapture) {
    return this.createImmutable(this.captures, capture.capture_id, capture, 'RAW_ARTIFACT_CONFLICT')
  }

  async listExtractions(captureId: string) {
    return clone([...this.extractions.values()]
      .filter(item => item.capture_id === captureId)
      .sort((left, right) => left.attempt_no - right.attempt_no))
  }

  async getExtraction(id: string) {
    return clone(this.extractions.get(id) ?? null)
  }

  async createExtraction(extraction: ExtractionRecord) {
    return this.createImmutable(
      this.extractions,
      extraction.extraction_id,
      extraction,
      'EXTRACTION_RESULT_CONFLICT'
    )
  }

  async getPendingResult(id: string) {
    return clone(this.pending.get(id) ?? null)
  }

  async listPendingResults({ cycleRef, taskId }: { cycleRef?: string, taskId?: string }) {
    return clone([...this.pending.values()]
      .filter(item => item.status === 'pending')
      .filter(item => !cycleRef || item.cycle_ref === cycleRef)
      .filter(item => !taskId || item.task_id === taskId)
      .sort((left, right) => left.created_at.localeCompare(right.created_at)
        || left.result_id.localeCompare(right.result_id)))
  }

  async createPendingResult(result: PendingQueryResult) {
    return this.createImmutable(this.pending, result.result_id, result, 'PENDING_RESULT_CONFLICT')
  }

  async acknowledgePendingResult(
    id: string,
    input: { receiverFingerprint: string, receivedAt: string }
  ) {
    const current = this.pending.get(id)
    if (!current) fail('RESULT_NOT_FOUND', 'Pending result not found')
    if (current.status === 'acknowledged') {
      if (current.receiver_fingerprint !== input.receiverFingerprint) {
        fail('RESULT_ACK_CONFLICT', 'Result already acknowledged by different bytes')
      }
      return 'kept' as const
    }
    current.status = 'acknowledged'
    current.receiver_fingerprint = input.receiverFingerprint
    current.acknowledged_at = input.receivedAt
    return 'acknowledged' as const
  }

  private async createImmutable<T>(
    store: Map<string, T>,
    id: string,
    value: T,
    conflictCode: string
  ) {
    const current = store.get(id)
    if (current) {
      if (!equal(current, value)) fail(conflictCode, `${id} bytes conflict`)
      return 'kept' as const
    }
    store.set(id, clone(value))
    return 'created' as const
  }
}
