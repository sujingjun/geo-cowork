import { describe, expect, it } from 'vitest'

import { browserAdapterRegistry } from './adapters'

describe('Browser adapter registry', () => {
  it('keeps all real consumer platforms manual_only and fixture automation loopback-only', () => {
    for (const id of ['chatgpt', 'gemini', 'perplexity', 'google_ai', 'claude']) {
      expect(browserAdapterRegistry[id]?.policyStatus).toBe('manual_only')
      expect(browserAdapterRegistry[id]?.selectors).toBeUndefined()
    }
    expect(browserAdapterRegistry.fixture?.policyStatus).toBe('allowed')
    expect(browserAdapterRegistry.fixture?.exactEntryUrls).toEqual([
      'http://127.0.0.1:9321/task'
    ])
    expect(browserAdapterRegistry.gemini?.resultUrlOrigins).toContain('https://share.gemini.google')
    expect(browserAdapterRegistry.google_ai?.resultUrlOrigins).toContain('https://share.google')
  })
})
