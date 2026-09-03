import { readFile } from 'node:fs/promises'

import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { afterEach, describe, expect, it } from 'vitest'

import * as schema from '../../db/schema'
import { DrizzleBrowserQueryRepository } from './drizzle-repository'
import { BrowserQueryService } from './service'

const clients: PGlite[] = []

afterEach(async () => {
  await Promise.all(clients.splice(0).map(client => client.close()))
})

async function repository() {
  const client = new PGlite()
  clients.push(client)
  const migration = await readFile(new URL(
    '../../db/migrations/postgresql/0006_sour_scalphunter.sql',
    import.meta.url
  ), 'utf8')
  await client.exec(migration)
  const database = drizzle(client, { schema })
  return new DrizzleBrowserQueryRepository(database)
}

function service(repo: DrizzleBrowserQueryRepository) {
  return new BrowserQueryService({
    repository: repo,
    adapterRegistry: {
      fixture: {
        id: 'fixture', version: '1.0.0', policyStatus: 'allowed',
        exactEntryUrls: ['http://127.0.0.1:9321/task'],
        selectorVersion: 'fixture-v2', terminalDetectorVersion: 'fixture-v2',
        selectors: {
          input: '#prompt', submit: '#submit', answer: '.answer', citation: 'a',
          timeoutMs: 30_000, stableMs: 500
        }
      }
    },
    extractor: {
      profile: {
        provider: 'fake', model: 'fake-v1', promptVersion: 'v1',
        promptSha256: 'b'.repeat(64), schemaVersion: 'geo-browser-extraction-result-v1'
      },
      async extract(input) {
        return {
          answer: {
            text: input.answerText,
            html_structure_summary: 'article',
            refusal: false,
            completeness: 'complete'
          },
          citations: input.citations,
          platform_annotations: [],
          warnings: []
        }
      }
    }
  })
}

describe('DrizzleBrowserQueryRepository', () => {
  it('persists CQI and optimistic Browser Task revisions across service instances', async () => {
    const repo = await repository()
    const first = service(repo)
    const registered = await first.registerCycleQueryInput({
      schema_version: 'geo-cycle-query-input-v1',
      request_id: 'REQ-DB-CQI-001',
      cycle: { ref: 'CYC-DB-001', version: '1.0.0', status: 'active' },
      query_set: { ref: 'QS-DB-001', version: '1.0.0', content_sha256: 'a'.repeat(64) },
      queries: [{
        ref: 'Q-DB-001', version: '1.0.0', query_text: 'DB fixture query',
        language: 'en-US', ordinal: 1
      }],
      platform: {
        id: 'fixture', entry_url: 'http://127.0.0.1:9321/task',
        execution_mode: 'dom_automation', policy_status: 'allowed',
        profile_ref: 'CPF-DB-001', profile_version: '1.0.0',
        authorization_ref: 'fixture://db', authorization_sha256: 'c'.repeat(64)
      },
      registered_at: '2026-09-03T03:00:00Z'
    })
    const created = await first.createTask({
      schema_version: 'geo-browser-query-task-create-v1',
      request_id: 'REQ-DB-BQT-001',
      input_id: registered.input.input_id,
      input_fingerprint: registered.input.fingerprint,
      created_at: '2026-09-03T03:01:00Z'
    })
    await first.claimNextQuery({
      task_id: created.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T03:02:00Z'
    })

    const restarted = service(repo)
    expect((await restarted.getTask(created.task.task_id)).revision).toBe(1)
    expect((await restarted.listCycleQueryInputs({ cycle_ref: 'CYC-DB-001' }))).toHaveLength(1)
    await expect(restarted.claimNextQuery({
      task_id: created.task.task_id,
      expected_revision: 0,
      now: '2026-09-03T03:03:00Z'
    })).rejects.toMatchObject({ code: 'QUERY_TASK_REVISION_CONFLICT' })
  })
})
