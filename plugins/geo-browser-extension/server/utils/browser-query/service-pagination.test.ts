import { describe, expect, it } from 'vitest'

import type { BrowserQueryTask, PendingQueryResult } from '../../../shared/types/browser-query'
import { MemoryBrowserQueryRepository } from './memory-repository'
import { BrowserQueryService } from './service'
import { adapterRegistry, realExtractor, registeredTask } from './service-test-fixtures'

describe('BrowserQueryService pagination and URL identity', () => {
  it('paginates pending results by created_at then result_id tuple', async () => {
    const repository = new MemoryBrowserQueryRepository()
    const subject = new BrowserQueryService({
      repository,
      adapterRegistry: adapterRegistry(),
      extractor: realExtractor()
    })
    const pending = (resultId: string, createdAt: string): PendingQueryResult => ({
      schema_version: 'geo-browser-pending-result-v1',
      result_id: resultId,
      task_id: 'BQT-PAGE-001',
      capture_id: 'BQC-PAGE-001',
      extraction_id: 'BQX-PAGE-001',
      cycle_ref: 'CYC-PAGE-001',
      query_ref: 'Q-PAGE-001',
      outcome: 'success',
      capture_sha256: 'a'.repeat(64),
      extraction_sha256: 'b'.repeat(64),
      raw_artifact_id: 'BQA-PAGE-001',
      raw_byte_length: 1,
      raw_sha256: 'c'.repeat(64),
      status: 'pending',
      created_at: createdAt
    })
    await repository.createPendingResult(pending('BQR-Z', '2026-09-03T10:00:00Z'))
    await repository.createPendingResult(pending('BQR-A', '2026-09-03T10:01:00Z'))
    const first = await subject.listPendingResults({ limit: 1 })
    const second = await subject.listPendingResults({ limit: 1, cursor: first.next_cursor })
    expect(first.items.map(item => item.result_id)).toEqual(['BQR-Z'])
    expect(second.items.map(item => item.result_id)).toEqual(['BQR-A'])
    expect(second.next_cursor).toBeNull()
  })

  it('paginates Browser Task summaries by created_at then task_id tuple', async () => {
    const repository = new MemoryBrowserQueryRepository()
    const subject = new BrowserQueryService({
      repository,
      adapterRegistry: adapterRegistry(),
      extractor: realExtractor()
    })
    const task = (taskId: string, requestId: string, createdAt: string): BrowserQueryTask => ({
      schema_version: 'geo-browser-query-task-v2',
      task_id: taskId,
      request_id: requestId,
      input_id: 'CQI-PAGE-001',
      input_fingerprint: 'a'.repeat(64),
      cycle: { ref: 'CYC-PAGE-001', version: '1.0.0', status: 'active' },
      query_set: { ref: 'QS-PAGE-001', version: '1.0.0', content_sha256: 'b'.repeat(64) },
      platform: {
        id: 'fixture', entry_url: 'http://127.0.0.1:9321/task',
        execution_mode: 'dom_automation', policy_status: 'allowed',
        profile_ref: 'CPF-PAGE-001', profile_version: '1.0.0',
        authorization_ref: 'fixture://page', authorization_sha256: 'c'.repeat(64),
        adapter_id: 'fixture', adapter_version: '1.0.0',
        selector_version: 'fixture-v2', terminal_detector_version: 'fixture-v2',
        result_url_origins: ['http://127.0.0.1:9321']
      },
      status: 'pending', revision: 0, queries: [],
      created_at: createdAt, updated_at: createdAt
    })
    await repository.createTask(task('BQT-Z', 'REQ-PAGE-Z', '2026-09-03T11:00:00Z'))
    await repository.createTask(task('BQT-A', 'REQ-PAGE-A', '2026-09-03T11:01:00Z'))
    const first = await subject.listBrowserQueryTasks({ cycle_ref: 'CYC-PAGE-001', limit: 1 })
    const second = await subject.listBrowserQueryTasks({
      cycle_ref: 'CYC-PAGE-001', limit: 1, cursor: first.next_cursor
    })
    expect(first.items.map(item => item.task_id)).toEqual(['BQT-Z'])
    expect(second.items.map(item => item.task_id)).toEqual(['BQT-A'])
  })

  it('rejects one result URL being reused by a different formal attempt', async () => {
    const { subject, registered, task: firstTask } = await registeredTask()
    const secondTask = await subject.createTask({
      schema_version: 'geo-browser-query-task-create-v1',
      request_id: 'REQ-BQT-RESULT-URL-002',
      input_id: registered.input.input_id,
      input_fingerprint: registered.input.fingerprint,
      created_at: '2026-09-03T12:00:00Z'
    })
    const prepare = async (task: BrowserQueryTask, minute: string) => {
      const claimed = await subject.claimNextQuery({
        task_id: task.task_id,
        expected_revision: 0,
        now: `2026-09-03T12:${minute}:00Z`
      })
      let revision = claimed.task.revision
      for (const stage of ['checking_login', 'ready', 'submitted', 'waiting_response'] as const) {
        const advanced = await subject.advanceAttempt({
          task_id: task.task_id,
          attempt_id: claimed.attempt.attempt_id,
          expected_revision: revision,
          stage,
          ...(stage === 'ready'
            ? {
                conversation_state: 'new' as const,
                conversation_proof: { kind: 'fresh_tab_entry', task_id: task.task_id }
              }
            : {}),
          now: `2026-09-03T12:${minute}:01Z`
        })
        revision = advanced.task.revision
      }
      return { attempt: claimed.attempt, revision }
    }
    const first = await prepare(firstTask.task, '01')
    const sharedResult = 'http://127.0.0.1:9321/result/shared'
    await subject.captureQueryResult({
      schema_version: 'geo-browser-query-capture-submission-v1',
      task_id: firstTask.task.task_id,
      attempt_id: first.attempt.attempt_id,
      expected_revision: first.revision,
      outcome: 'success',
      answer_html: '<article>first slot</article>',
      answer_text: 'first slot', citations: [], result_url: sharedResult,
      detector_diagnostics: {}, captured_at: '2026-09-03T12:01:02Z'
    })
    const second = await prepare(secondTask.task, '02')
    await expect(subject.captureQueryResult({
      schema_version: 'geo-browser-query-capture-submission-v1',
      task_id: secondTask.task.task_id,
      attempt_id: second.attempt.attempt_id,
      expected_revision: second.revision,
      outcome: 'success',
      answer_html: '<article>second slot</article>',
      answer_text: 'second slot', citations: [], result_url: sharedResult,
      detector_diagnostics: {}, captured_at: '2026-09-03T12:02:02Z'
    })).rejects.toMatchObject({ code: 'RESULT_URL_CONFLICT' })
  })
})
