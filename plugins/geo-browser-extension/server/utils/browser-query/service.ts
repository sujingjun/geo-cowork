import type {
  BrowserAttemptStage,
  BrowserExtractor,
  BrowserPlatformAdapterRegistry,
  BrowserQueryAttempt,
  BrowserQueryTask,
  BrowserTaskQuery,
  StoredCycleQueryInput
} from '../../../shared/types/browser-query'
import { fingerprint, sha256, stableId } from './canonical'
import { fail } from './errors'
import type { BrowserQueryRepository } from './repository'
import { BrowserQueryResultService } from './result-service'
import {
  attemptAdvanceSchema,
  continueAttemptSchema,
  cycleQueryInputSchema,
  failAttemptSchema,
  retryQuerySchema,
  taskCreateSchema,
  taskListSchema,
  taskRevisionSchema,
  waitForHumanSchema
} from './schemas'
import {
  assertPrivateTextSafe,
  checkedUrl,
  currentAttempt,
  nextTaskStatus,
  parseContract,
  requireTask,
  scanForbiddenKeys
} from './service-helpers'

const STAGE_TRANSITIONS: Partial<Record<BrowserAttemptStage, BrowserAttemptStage[]>> = {
  opening_platform: ['checking_login'],
  checking_login: ['ready'],
  ready: ['submitted'],
  submitted: ['waiting_response']
}

function taskCursor(task: BrowserQueryTask) {
  return Buffer.from(JSON.stringify([task.created_at, task.task_id])).toString('base64url')
}

function parseTaskCursor(value: string | undefined) {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
    if (Array.isArray(parsed) && parsed.length === 2
      && parsed.every(item => typeof item === 'string' && item)) {
      return { createdAt: parsed[0] as string, taskId: parsed[1] as string }
    }
  } catch {
    // Stable public error below.
  }
  fail('CYCLE_QUERY_INPUT_INVALID', 'Browser Task cursor is invalid')
}

function compareUtf8(left: string, right: string) {
  return Buffer.compare(Buffer.from(left), Buffer.from(right))
}

export class BrowserQueryService {
  private repository: BrowserQueryRepository
  private adapterRegistry: BrowserPlatformAdapterRegistry
  private results: BrowserQueryResultService

  constructor(options: {
    repository: BrowserQueryRepository
    adapterRegistry: BrowserPlatformAdapterRegistry
    extractor: BrowserExtractor
  }) {
    this.repository = options.repository
    this.adapterRegistry = options.adapterRegistry
    this.results = new BrowserQueryResultService({
      repository: options.repository,
      extractor: options.extractor,
      getTask: taskId => this.getTask(taskId),
      persistTask: (task, expectedRevision, now) =>
        this.persistTask(task, expectedRevision, now)
    })
  }

  async registerCycleQueryInput(value: unknown) {
    scanForbiddenKeys(value)
    const input = parseContract(cycleQueryInputSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    const refs = new Set(input.queries.map(query => query.ref))
    if (refs.size !== input.queries.length
      || input.queries.some((query, index) => query.ordinal !== index + 1)) {
      fail('CYCLE_QUERY_INPUT_INVALID', 'Query refs must be unique and ordinals contiguous')
    }
    const adapter = this.adapterRegistry[input.platform.id]
    if (!adapter) fail('PLATFORM_ADAPTER_NOT_FOUND', 'Platform adapter not found')
    const authorizationMatches = input.platform.id === 'fixture'
      ? input.platform.authorization_ref.startsWith('fixture://')
      : input.platform.authorization_ref.startsWith('workspace://')
    if (!authorizationMatches) {
      fail('CYCLE_QUERY_INPUT_INVALID', 'Authorization reference does not match platform scope')
    }
    const entryUrl = checkedUrl(input.platform.entry_url, 'PLATFORM_ALLOWLIST_VIOLATION').toString()
    if (!adapter.exactEntryUrls.map(url => new URL(url).toString()).includes(entryUrl)) {
      fail('PLATFORM_ALLOWLIST_VIOLATION', 'Platform entry URL is outside the exact adapter allowlist')
    }
    if (input.platform.policy_status !== adapter.policyStatus
      || (input.platform.execution_mode === 'dom_automation' && adapter.policyStatus !== 'allowed')
      || (input.platform.policy_status === 'manual_only'
        && input.platform.execution_mode !== 'manual_assist')) {
      fail('PLATFORM_TERMS_BLOCKED', 'Platform policy does not allow the requested execution mode')
    }
    const normalized = {
      ...input,
      platform: { ...input.platform, entry_url: entryUrl },
      queries: input.queries.map(query => ({
        ...query,
        query_text_sha256: sha256(query.query_text)
      })),
      adapter: structuredClone(adapter)
    }
    const inputFingerprint = fingerprint(normalized)
    const stored: StoredCycleQueryInput = {
      ...normalized,
      input_id: stableId('CQI', normalized),
      fingerprint: inputFingerprint
    }
    const priorRequest = await this.repository.getCycleInputByRequestId(input.request_id)
    if (priorRequest) {
      if (priorRequest.fingerprint !== inputFingerprint) {
        fail('CYCLE_QUERY_INPUT_CONFLICT', 'Request ID already registered with different bytes')
      }
      return { action: 'kept' as const, input: priorRequest }
    }
    const action = await this.repository.createCycleInput(stored)
    return { action, input: stored }
  }

  async getCycleQueryInput(inputId: string) {
    const input = await this.repository.getCycleInput(inputId)
    if (!input) fail('CYCLE_QUERY_INPUT_NOT_FOUND', 'Cycle Query Input not found')
    return input
  }

  listCycleQueryInputs(filters: { cycle_ref?: string } = {}) {
    return this.repository.listCycleInputs(filters.cycle_ref)
  }

  async createTask(value: unknown) {
    const request = parseContract(taskCreateSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    const input = await this.getCycleQueryInput(request.input_id)
    if (input.fingerprint !== request.input_fingerprint) {
      fail('CYCLE_QUERY_INPUT_CONFLICT', 'Task input fingerprint does not match registered input')
    }
    const existing = await this.repository.getTaskByRequestId(request.request_id)
    const taskId = stableId('BQT', {
      request_id: request.request_id,
      input_id: request.input_id,
      input_fingerprint: request.input_fingerprint
    })
    if (existing) {
      if (existing.task_id !== taskId) fail('BROWSER_QUERY_TASK_CONFLICT', 'Task request ID conflict')
      return { action: 'kept' as const, task: existing }
    }
    const task: BrowserQueryTask = {
      schema_version: 'geo-browser-query-task-v2',
      task_id: taskId,
      request_id: request.request_id,
      input_id: input.input_id,
      input_fingerprint: input.fingerprint,
      cycle: input.cycle,
      query_set: input.query_set,
      platform: {
        ...input.platform,
        adapter_id: input.adapter.id,
        adapter_version: input.adapter.version,
        selector_version: input.adapter.selectorVersion,
        terminal_detector_version: input.adapter.terminalDetectorVersion,
        result_url_origins: input.adapter.resultUrlOrigins
          ?? [...new Set(input.adapter.exactEntryUrls.map(url => new URL(url).origin))],
        ...(input.adapter.selectors ? { selectors: input.adapter.selectors } : {})
      },
      status: 'pending',
      revision: 0,
      queries: input.queries.map(query => ({
        ref: query.ref,
        version: query.version,
        query_text: query.query_text,
        query_text_sha256: query.query_text_sha256,
        language: query.language,
        ordinal: query.ordinal,
        status: 'pending',
        attempts: []
      })),
      created_at: request.created_at,
      updated_at: request.created_at
    }
    const action = await this.repository.createTask(task)
    return { action, task }
  }

  async getTask(taskId: string) {
    return requireTask(await this.repository.getTask(taskId))
  }

  async listBrowserQueryTasks(value: unknown = {}) {
    const input = parseContract(taskListSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    const tasks = await this.repository.listTasks(input.cycle_ref)
    const cursor = parseTaskCursor(input.cursor)
    const eligible = cursor
      ? tasks.filter(task => compareUtf8(task.created_at, cursor.createdAt) > 0
        || (task.created_at === cursor.createdAt
          && compareUtf8(task.task_id, cursor.taskId) > 0))
      : tasks
    const page = eligible.slice(0, input.limit)
    return {
      items: page.map(task => this.taskSummary(task)),
      next_cursor: eligible.length > input.limit && page.length
        ? taskCursor(page.at(-1)!)
        : null
    }
  }

  async getTaskSummary(taskId: string) {
    return this.taskSummary(await this.getTask(taskId))
  }

  async claimNextQuery(value: unknown) {
    const input = parseContract(taskRevisionSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    const task = await this.getTask(input.task_id)
    this.assertRevision(task, input.expected_revision)
    if (task.status !== 'pending') {
      fail('QUERY_TASK_TRANSITION_INVALID', 'Task is not ready to claim another Query')
    }
    const query = task.queries.find(item => item.status === 'pending')
    if (!query) fail('QUERY_TASK_TRANSITION_INVALID', 'Task has no pending Query')
    const attemptNo = query.attempts.length + 1
    const attempt: BrowserQueryAttempt = {
      attempt_id: `${query.query_text_sha256}/attempt-${attemptNo}`,
      attempt_no: attemptNo,
      stage: 'opening_platform',
      started_at: input.now
    }
    query.attempts.push(attempt)
    query.status = 'running'
    task.status = 'running'
    await this.persistTask(task, input.expected_revision, input.now)
    return { task, query: structuredClone(query), attempt: structuredClone(attempt) }
  }

  async advanceAttempt(value: unknown) {
    const input = parseContract(attemptAdvanceSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    return this.mutateAttempt(input, (task, query, attempt) => {
      if (!STAGE_TRANSITIONS[attempt.stage]?.includes(input.stage)) {
        fail('QUERY_TASK_TRANSITION_INVALID', `Cannot move ${attempt.stage} to ${input.stage}`)
      }
      if (input.stage === 'ready') {
        if (!input.conversation_state || !input.conversation_proof) {
          fail('QUERY_TASK_TRANSITION_INVALID', 'Ready requires conversation proof')
        }
        if (input.conversation_state === 'continued') {
          fail('QUERY_TASK_TRANSITION_INVALID', 'Formal Query cannot reuse a conversation')
        }
        attempt.conversation_state = input.conversation_state
        attempt.conversation_proof = input.conversation_proof
      }
      attempt.stage = input.stage
      if (input.stage === 'submitted') attempt.submitted_at = input.now
      query.status = 'running'
      task.status = 'running'
    })
  }

  async waitForHuman(value: unknown) {
    const input = parseContract(waitForHumanSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    return this.mutateAttempt(input, (task, query, attempt) => {
      const valid = attempt.stage === 'checking_login'
        ? ['login_required', 'challenge'].includes(input.reason)
        : attempt.stage === 'ready'
          ? ['result_confirmation', 'submission_unknown'].includes(input.reason)
          : ['submitted', 'waiting_response'].includes(attempt.stage)
            && ['submission_unknown', 'challenge', 'result_confirmation'].includes(input.reason)
      if (!valid) fail('QUERY_TASK_TRANSITION_INVALID', 'Waiting-human reason does not match stage')
      attempt.stage = 'waiting_human'
      attempt.waiting_reason = input.reason
      query.status = 'waiting_human'
      task.status = 'waiting_human'
    })
  }

  async continueAttempt(value: unknown) {
    const input = parseContract(continueAttemptSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    return this.mutateAttempt(input, (task, query, attempt) => {
      if (attempt.stage !== 'waiting_human') {
        fail('QUERY_TASK_TRANSITION_INVALID', 'Only waiting_human can continue')
      }
      attempt.stage = attempt.waiting_reason === 'login_required' || attempt.waiting_reason === 'challenge'
        ? 'checking_login'
        : 'waiting_response'
      delete attempt.waiting_reason
      query.status = 'running'
      task.status = 'running'
    })
  }

  async failAttempt(value: unknown) {
    const input = parseContract(failAttemptSchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    assertPrivateTextSafe(input.failure_reason)
    return this.mutateAttempt(input, (task, query, attempt) => {
      if (['result_pending', 'acknowledged'].includes(attempt.stage) || attempt.completed_at) {
        fail('QUERY_TASK_TRANSITION_INVALID', 'A terminal attempt cannot be failed again')
      }
      attempt.outcome = input.outcome
      attempt.failure_reason = input.failure_reason
      attempt.completed_at = input.now
      delete attempt.waiting_reason
      if (input.outcome === 'system_failure') query.status = 'failed'
      else if (input.outcome === 'challenge') query.status = 'blocked'
      else if (input.outcome === 'cancelled') query.status = 'cancelled'
      else query.status = 'completed'
      task.status = nextTaskStatus(task)
      if (task.status === 'completed') task.completed_at = input.now
    })
  }

  async retryQuery(value: unknown) {
    const input = parseContract(retryQuerySchema, value, 'CYCLE_QUERY_INPUT_INVALID')
    const task = await this.getTask(input.task_id)
    this.assertRevision(task, input.expected_revision)
    const query = task.queries.find(item => item.ref === input.query_ref)
    const lastAttempt = query?.attempts.at(-1)
    if (!query || query.status !== 'failed' || lastAttempt?.outcome !== 'system_failure') {
      fail('QUERY_TASK_TRANSITION_INVALID', 'Only system_failure permits a new Query attempt')
    }
    query.status = 'pending'
    task.status = nextTaskStatus(task)
    delete task.completed_at
    await this.persistTask(task, input.expected_revision, input.now)
    return { task, query: structuredClone(query) }
  }

  async captureQueryResult(value: unknown) {
    return this.results.captureQueryResult(value)
  }

  async retryExtraction(value: { capture_id: string, now: string }) {
    return this.results.retryExtraction(value)
  }

  async listPendingResults(value: unknown) {
    return this.results.listPendingResults(value)
  }

  async getQueryResult(resultId: string) {
    return this.results.getQueryResult(resultId)
  }

  async getResultArtifact(value: unknown) {
    return this.results.getResultArtifact(value)
  }

  async acknowledgeResult(value: unknown) {
    return this.results.acknowledgeResult(value)
  }

  private async mutateAttempt(
    input: { task_id: string, attempt_id: string, expected_revision: number, now: string },
    mutation: (
      task: BrowserQueryTask,
      query: BrowserTaskQuery,
      attempt: BrowserQueryAttempt
    ) => void
  ) {
    const task = await this.getTask(input.task_id)
    this.assertRevision(task, input.expected_revision)
    const { query, attempt } = currentAttempt(task, input.attempt_id)
    mutation(task, query, attempt)
    await this.persistTask(task, input.expected_revision, input.now)
    return { task, query: structuredClone(query), attempt: structuredClone(attempt) }
  }

  private assertRevision(task: BrowserQueryTask, expectedRevision: number) {
    if (task.revision !== expectedRevision) {
      fail('QUERY_TASK_REVISION_CONFLICT', 'Browser task revision conflict', {
        expected_revision: expectedRevision,
        actual_revision: task.revision
      })
    }
  }

  private async persistTask(task: BrowserQueryTask, expectedRevision: number, now: string) {
    task.revision = expectedRevision + 1
    task.updated_at = now
    await this.repository.saveTask(task, expectedRevision)
  }

  private taskSummary(task: BrowserQueryTask) {
    return {
      schema_version: 'geo-browser-task-summary-v1',
      task_id: task.task_id,
      cycle_ref: task.cycle.ref,
      query_set_ref: task.query_set.ref,
      status: task.status,
      revision: task.revision,
      query_count: task.queries.length,
      completed_count: task.queries.filter(query => query.status === 'completed').length,
      pending_result_count: task.queries.flatMap(query => query.attempts)
        .filter(attempt => attempt.stage === 'result_pending').length,
      acknowledged_count: task.queries.flatMap(query => query.attempts)
        .filter(attempt => attempt.stage === 'acknowledged').length,
      waiting_reasons: task.queries.flatMap(query => query.attempts)
        .flatMap(attempt => attempt.waiting_reason ? [attempt.waiting_reason] : []),
      queries: task.queries.map(query => ({
        ref: query.ref,
        version: query.version,
        ordinal: query.ordinal,
        status: query.status,
        attempts: query.attempts.map(attempt => ({
          attempt_id: attempt.attempt_id,
          attempt_no: attempt.attempt_no,
          stage: attempt.stage,
          outcome: attempt.outcome,
          waiting_reason: attempt.waiting_reason
        }))
      }))
    }
  }
}
