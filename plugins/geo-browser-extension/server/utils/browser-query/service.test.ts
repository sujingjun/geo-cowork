import { describe, expect, it } from 'vitest'

import type { BrowserExtractor, BrowserQueryTask } from '../../../shared/types/browser-query'
import { BrowserQueryService } from './service'
import { MemoryBrowserQueryRepository } from './memory-repository'
import {
  adapterRegistry,
  cycleInput,
  fakeExtractor,
  registeredTask,
  service
} from './service-test-fixtures'

describe('BrowserQueryService', () => {
  it('registers immutable Cycle input and rejects same request with changed bytes', async () => {
    const subject = service()
    const created = await subject.registerCycleQueryInput(cycleInput())
    const kept = await subject.registerCycleQueryInput(cycleInput())

    expect(created.action).toBe('created')
    expect(created.input.input_id).toMatch(/^CQI-[A-F0-9]+$/)
    expect(kept.action).toBe('kept')
    expect(await subject.listCycleQueryInputs({ cycle_ref: 'CYC-TEST-001' }))
      .toHaveLength(1)

    await expect(subject.registerCycleQueryInput(cycleInput({
      queries: [{
        ref: 'Q-TEST-001',
        version: '1.0.0',
        query_text: 'Changed bytes',
        language: 'en-US',
        ordinal: 1
      }]
    }))).rejects.toMatchObject({ code: 'CYCLE_QUERY_INPUT_CONFLICT' })

    const wrongAuthorization = cycleInput()
    wrongAuthorization.request_id = 'REQ-CQI-INVALID-AUTH'
    wrongAuthorization.platform.authorization_ref = 'workspace://real-decision.json'
    await expect(subject.registerCycleQueryInput(wrongAuthorization))
      .rejects.toMatchObject({ code: 'CYCLE_QUERY_INPUT_INVALID' })
  })

  it('freezes a Browser task and enforces revision plus login/submission transitions', async () => {
    const { subject, task } = await registeredTask()
    const claimed = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T01:02:00Z'
    })

    expect(claimed.task.status).toBe('running')
    expect(claimed.attempt.stage).toBe('opening_platform')
    expect(claimed.task.queries[0]!.query_text).toBe('What is the fixture brand?')

    await expect(subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T01:02:01Z'
    })).rejects.toMatchObject({ code: 'QUERY_TASK_REVISION_CONFLICT' })

    const checking = await subject.advanceAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: 1,
      stage: 'checking_login',
      now: '2026-09-03T01:02:02Z'
    })
    const waiting = await subject.waitForHuman({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: checking.task.revision,
      reason: 'login_required',
      now: '2026-09-03T01:02:03Z'
    })
    expect(waiting.task.status).toBe('waiting_human')

    const resumed = await subject.continueAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: waiting.task.revision,
      now: '2026-09-03T01:03:00Z'
    })
    const ready = await subject.advanceAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: resumed.task.revision,
      stage: 'ready',
      conversation_state: 'new',
      conversation_proof: {
        kind: 'fresh_tab_entry',
        url: 'http://127.0.0.1:9321/task'
      },
      now: '2026-09-03T01:03:01Z'
    })
    const submitted = await subject.advanceAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: ready.task.revision,
      stage: 'submitted',
      now: '2026-09-03T01:03:02Z'
    })

    await expect(subject.advanceAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: submitted.task.revision,
      stage: 'submitted',
      now: '2026-09-03T01:03:03Z'
    })).rejects.toMatchObject({ code: 'QUERY_TASK_TRANSITION_INVALID' })
  })

  it('stores full answer HTML, extracts once, queues result, chunks raw and acknowledges idempotently', async () => {
    const { subject, task } = await registeredTask()
    const claimed = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T01:02:00Z'
    })
    let revision = claimed.task.revision
    for (const stage of ['checking_login', 'ready', 'submitted', 'waiting_response'] as const) {
      const advanced = await subject.advanceAttempt({
        task_id: task.task.task_id,
        attempt_id: claimed.attempt.attempt_id,
        expected_revision: revision,
        stage,
        ...(stage === 'ready'
          ? {
              conversation_state: 'new' as const,
              conversation_proof: { kind: 'fresh_tab_entry', url: 'http://127.0.0.1:9321/task' }
            }
          : {}),
        now: '2026-09-03T01:03:00Z'
      })
      revision = advanced.task.revision
    }

    const html = '<article class="answer"><p>Fixture answer.</p><a href="https://source.example/a">Source</a></article>'
    const captured = await subject.captureQueryResult({
      schema_version: 'geo-browser-query-capture-submission-v1',
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: revision,
      outcome: 'success',
      answer_html: html,
      answer_text: 'Fixture answer.',
      citations: [{
        ordinal: 1,
        href_raw: 'https://source.example/a',
        href_normalized: 'https://source.example/a',
        title: 'Source',
        anchor_or_context: 'Fixture answer.'
      }],
      result_url: 'http://127.0.0.1:9321/result/1',
      detector_diagnostics: { answer_count_before: 0, answer_count_after: 1 },
      captured_at: '2026-09-03T01:04:00Z'
    })

    expect(captured.capture.answer_html_artifact.byte_length).toBe(Buffer.byteLength(html))
    expect(captured.extraction.status).toBe('completed')
    expect(captured.pending!.status).toBe('pending')
    expect(captured.task.status).toBe('completed')
    expect(captured.task.queries[0]!.attempts[0]!.outcome).toBe('success')

    const listed = await subject.listPendingResults({
      cycle_ref: 'CYC-TEST-001',
      limit: 10
    })
    expect(listed.items).toHaveLength(1)
    expect(JSON.stringify(listed)).not.toContain(html)

    const chunk = await subject.getResultArtifact({
      result_id: captured.pending!.result_id,
      artifact_id: captured.capture.answer_html_artifact.artifact_id,
      offset: 0,
      max_bytes: 32
    })
    expect(Buffer.from(chunk.data_base64, 'base64').toString('utf8')).toBe(html.slice(0, 32))
    expect(chunk.next_offset).toBe(32)

    const ack = {
      result_id: captured.pending!.result_id,
      capture_sha256: captured.pending!.capture_sha256,
      extraction_sha256: captured.pending!.extraction_sha256,
      receiver_fingerprint: 'c'.repeat(64),
      received_at: '2026-09-03T01:05:00Z'
    }
    expect((await subject.acknowledgeResult(ack)).action).toBe('acknowledged')
    expect((await subject.acknowledgeResult(ack)).action).toBe('kept')
    await expect(subject.acknowledgeResult({
      ...ack,
      receiver_fingerprint: 'd'.repeat(64)
    })).rejects.toMatchObject({ code: 'RESULT_ACK_CONFLICT' })
  })

  it('retains raw capture when extraction output is invalid and retries without a new Query attempt', async () => {
    let valid = false
    const extractor: BrowserExtractor = {
      ...fakeExtractor(),
      async extract(input) {
        return valid
          ? fakeExtractor().extract(input)
          : { answer: { text: input.answerText } }
      }
    }
    const { subject, task } = await registeredTask(service(extractor))
    const claimed = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T01:02:00Z'
    })
    let revision = claimed.task.revision
    for (const stage of ['checking_login', 'ready', 'submitted', 'waiting_response'] as const) {
      const advanced = await subject.advanceAttempt({
        task_id: task.task.task_id,
        attempt_id: claimed.attempt.attempt_id,
        expected_revision: revision,
        stage,
        ...(stage === 'ready'
          ? {
              conversation_state: 'unknown' as const,
              conversation_proof: { kind: 'entry_only', url: 'http://127.0.0.1:9321/task' }
            }
          : {}),
        now: '2026-09-03T01:03:00Z'
      })
      revision = advanced.task.revision
    }
    const captured = await subject.captureQueryResult({
      schema_version: 'geo-browser-query-capture-submission-v1',
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: revision,
      outcome: 'success',
      answer_html: '<article>raw survives</article>',
      answer_text: 'raw survives',
      citations: [],
      result_url: 'http://127.0.0.1:9321/result/2',
      detector_diagnostics: {},
      captured_at: '2026-09-03T01:04:00Z'
    })
    expect(captured.extraction.status).toBe('failed')
    expect(captured.pending).toBeNull()

    valid = true
    const retried = await subject.retryExtraction({
      capture_id: captured.capture.capture_id,
      now: '2026-09-03T01:05:00Z'
    })
    expect(retried.extraction.status).toBe('completed')
    expect(retried.pending!.status).toBe('pending')
    expect((await subject.getTask(task.task.task_id)).queries[0]!.attempts).toHaveLength(1)
  })

  it('preserves a system failure attempt and only then permits a new Query attempt', async () => {
    const { subject, task } = await registeredTask()
    const claimed = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T06:00:00Z'
    })
    const failed = await subject.failAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: claimed.task.revision,
      outcome: 'system_failure',
      failure_reason: 'fixture pre-submit failure',
      now: '2026-09-03T06:01:00Z'
    })
    expect(failed.task.status).toBe('failed')
    const retried = await subject.retryQuery({
      task_id: task.task.task_id,
      query_ref: claimed.query.ref,
      expected_revision: failed.task.revision,
      now: '2026-09-03T06:02:00Z'
    })
    expect(retried.query.status).toBe('pending')
    const second = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: retried.task.revision,
      now: '2026-09-03T06:03:00Z'
    })
    expect(second.query.attempts).toHaveLength(2)
  })

  it('turns a persisted submit_intent into submission_unknown without Query retry', async () => {
    const { subject, task } = await registeredTask()
    const claimed = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T07:00:00Z'
    })
    const checking = await subject.advanceAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: claimed.task.revision,
      stage: 'checking_login',
      now: '2026-09-03T07:00:01Z'
    })
    const ready = await subject.advanceAttempt({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: checking.task.revision,
      stage: 'ready',
      conversation_state: 'new',
      conversation_proof: { kind: 'fresh_tab_entry' },
      now: '2026-09-03T07:00:02Z'
    })
    const waiting = await subject.waitForHuman({
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: ready.task.revision,
      reason: 'submission_unknown',
      now: '2026-09-03T07:00:03Z'
    })
    expect(waiting.attempt.waiting_reason).toBe('submission_unknown')
    await expect(subject.retryQuery({
      task_id: task.task.task_id,
      query_ref: claimed.query.ref,
      expected_revision: waiting.task.revision,
      now: '2026-09-03T07:00:04Z'
    })).rejects.toMatchObject({ code: 'QUERY_TASK_TRANSITION_INVALID' })
  })

  it('reuses a completed extraction after a crash before task result revision commit', async () => {
    class CrashAfterPendingRepository extends MemoryBrowserQueryRepository {
      crash = true

      override async saveTask(task: BrowserQueryTask, expectedRevision: number) {
        if (this.crash && task.queries.some(query => query.attempts.some(
          attempt => attempt.stage === 'result_pending'
        ))) {
          this.crash = false
          throw Object.assign(new Error('simulated task commit crash'), { code: 'SIMULATED_CRASH' })
        }
        return super.saveTask(task, expectedRevision)
      }
    }
    const repository = new CrashAfterPendingRepository()
    let extractionCalls = 0
    const extractor: BrowserExtractor = {
      ...fakeExtractor(),
      async extract(input) {
        extractionCalls += 1
        return fakeExtractor().extract(input)
      }
    }
    const subject = new BrowserQueryService({
      repository,
      adapterRegistry: adapterRegistry(),
      extractor
    })
    const { task } = await registeredTask(subject)
    const claimed = await subject.claimNextQuery({
      task_id: task.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T08:00:00Z'
    })
    let revision = claimed.task.revision
    for (const stage of ['checking_login', 'ready', 'submitted', 'waiting_response'] as const) {
      const advanced = await subject.advanceAttempt({
        task_id: task.task.task_id,
        attempt_id: claimed.attempt.attempt_id,
        expected_revision: revision,
        stage,
        ...(stage === 'ready'
          ? {
              conversation_state: 'new' as const,
              conversation_proof: { kind: 'fresh_tab_entry' }
            }
          : {}),
        now: '2026-09-03T08:00:01Z'
      })
      revision = advanced.task.revision
    }
    await expect(subject.captureQueryResult({
      schema_version: 'geo-browser-query-capture-submission-v1',
      task_id: task.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: revision,
      outcome: 'success',
      answer_html: '<article>survives commit crash</article>',
      answer_text: 'survives commit crash',
      citations: [],
      result_url: 'http://127.0.0.1:9321/result/crash',
      detector_diagnostics: {},
      captured_at: '2026-09-03T08:00:02Z'
    })).rejects.toMatchObject({ code: 'SIMULATED_CRASH' })
    const stuck = await subject.getTask(task.task.task_id)
    const captureId = stuck.queries[0]!.attempts[0]!.capture_id!
    const recovered = await subject.retryExtraction({
      capture_id: captureId,
      now: '2026-09-03T08:00:03Z'
    })
    expect(recovered.pending!.status).toBe('pending')
    expect(recovered.task.status).toBe('completed')
    expect(extractionCalls).toBe(1)
    expect((await subject.listPendingResults({ task_id: task.task.task_id, limit: 10 })).items)
      .toHaveLength(1)
  })

  it('does not claim the next Query while the current attempt waits for a human', async () => {
    const subject = service()
    const registered = await subject.registerCycleQueryInput(cycleInput({
      queries: [
        {
          ref: 'Q-TEST-001', version: '1.0.0', query_text: 'First Query',
          language: 'en-US', ordinal: 1
        },
        {
          ref: 'Q-TEST-002', version: '1.0.0', query_text: 'Second Query',
          language: 'en-US', ordinal: 2
        }
      ]
    }))
    const created = await subject.createTask({
      schema_version: 'geo-browser-query-task-create-v1',
      request_id: 'REQ-BQT-SERIAL-001',
      input_id: registered.input.input_id,
      input_fingerprint: registered.input.fingerprint,
      created_at: '2026-09-03T09:00:00Z'
    })
    const claimed = await subject.claimNextQuery({
      task_id: created.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T09:00:01Z'
    })
    const checking = await subject.advanceAttempt({
      task_id: created.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: claimed.task.revision,
      stage: 'checking_login',
      now: '2026-09-03T09:00:02Z'
    })
    const waiting = await subject.waitForHuman({
      task_id: created.task.task_id,
      attempt_id: claimed.attempt.attempt_id,
      expected_revision: checking.task.revision,
      reason: 'login_required',
      now: '2026-09-03T09:00:03Z'
    })
    await expect(subject.claimNextQuery({
      task_id: created.task.task_id,
      expected_revision: waiting.task.revision,
      now: '2026-09-03T09:00:04Z'
    })).rejects.toMatchObject({ code: 'QUERY_TASK_TRANSITION_INVALID' })
  })
})
