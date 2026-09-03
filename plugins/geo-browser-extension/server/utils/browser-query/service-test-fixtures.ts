import type { BrowserExtractor } from '../../../shared/types/browser-query'
import { MemoryBrowserQueryRepository } from './memory-repository'
import { BrowserQueryService } from './service'

const SHA = 'a'.repeat(64)

export function cycleInput(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: 'geo-cycle-query-input-v1',
    request_id: 'REQ-CQI-001',
    cycle: { ref: 'CYC-TEST-001', version: '1.0.0', status: 'active' },
    query_set: {
      ref: 'QS-TEST-001',
      version: '1.0.0',
      content_sha256: SHA
    },
    queries: [{
      ref: 'Q-TEST-001',
      version: '1.0.0',
      query_text: 'What is the fixture brand?',
      language: 'en-US',
      ordinal: 1
    }],
    platform: {
      id: 'fixture',
      entry_url: 'http://127.0.0.1:9321/task',
      execution_mode: 'dom_automation',
      policy_status: 'allowed',
      profile_ref: 'CPF-TEST-001',
      profile_version: '1.0.0',
      authorization_ref: 'fixture://browser-query-task',
      authorization_sha256: SHA
    },
    registered_at: '2026-09-03T01:00:00Z',
    ...overrides
  }
}

export function adapterRegistry() {
  return {
    fixture: {
      id: 'fixture',
      version: '1.0.0',
      policyStatus: 'allowed' as const,
      exactEntryUrls: ['http://127.0.0.1:9321/task'],
      selectorVersion: 'fixture-selectors-v2',
      terminalDetectorVersion: 'fixture-terminal-v2',
      selectors: {
        input: '#prompt',
        submit: '#submit',
        answer: '.answer',
        citation: '.answer a',
        busy: '[aria-busy="true"]',
        loggedIn: '[data-login-state="logged-in"]',
        loggedOut: '[data-login-state="logged-out"]',
        timeoutMs: 30_000,
        stableMs: 500
      }
    }
  }
}

export function fakeExtractor(): BrowserExtractor {
  return {
    profile: {
      provider: 'fake',
      model: 'fixture-extractor-v1',
      promptVersion: 'browser-query-extract-v1',
      promptSha256: 'b'.repeat(64),
      schemaVersion: 'geo-browser-extraction-result-v1'
    },
    async extract(input) {
      return {
        answer: {
          text: input.answerText,
          html_structure_summary: 'one answer root',
          refusal: input.outcome === 'refusal',
          completeness: 'complete'
        },
        citations: input.citations,
        platform_annotations: [],
        warnings: []
      }
    }
  }
}

export function service(extractor: BrowserExtractor = fakeExtractor()) {
  return new BrowserQueryService({
    repository: new MemoryBrowserQueryRepository(),
    adapterRegistry: adapterRegistry(),
    extractor
  })
}

export async function registeredTask(subject = service()) {
  const registered = await subject.registerCycleQueryInput(cycleInput())
  const task = await subject.createTask({
    schema_version: 'geo-browser-query-task-create-v1',
    request_id: 'REQ-BQT-001',
    input_id: registered.input.input_id,
    input_fingerprint: registered.input.fingerprint,
    created_at: '2026-09-03T01:01:00Z'
  })
  return { subject, registered, task }
}
