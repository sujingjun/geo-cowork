import { describe, expect, it } from 'vitest'
import { createBrowserExtractor } from './extractor'
import { extractionOutputSchema } from './schemas'
import { matchesExtractorProfile } from './result-service'

describe('Real Browser extraction', () => {
  it.each(['deepseek'])('calls configured %s and preserves raw answer and citations', async (provider) => {
    const raw = 'MyyShop engineering input. This text is synthetic.'
    const citations = [{ occurrence_ordinal: 1, url: 'https://example.invalid/proof', title: 'Synthetic proof', context: 'engineering input' }]
    const extractor = createBrowserExtractor(provider)
    const extracted = await extractor.extract({
      query: { ref: 'Q-REAL-MODEL-001', version: '1.0.0', query_text_sha256: 'a'.repeat(64) },
      outcome: 'success', answerText: raw, safeHtmlText: raw, citations, rawSha256: 'b'.repeat(64)
    }) as { output: unknown, audit: { duration_ms: number, usage: unknown } }
    const output = extractionOutputSchema.parse(extracted.output)
    expect(extracted.audit.duration_ms).toBeGreaterThan(0)
    expect(extracted.audit.usage).toBeTruthy()
    expect(output.answer.text).toBe(raw)
    expect(output.citations).toEqual(citations)
    expect(extractor.profile.provider).toBe(provider)
  })
  it('preserves compatible provider and opaque model configuration without a network call', () => {
    const selected = createBrowserExtractor('openai-compatible', 'custom/models/example')
    expect(selected.profile).toMatchObject({ provider: 'openai-compatible', model: 'custom/models/example' })
  })
  it('rejects obsolete fake provider instead of producing successful output', async () => {
    await expect(createBrowserExtractor('fake').extract({
      query: { ref: 'Q-INVALID-001', version: '1.0.0', query_text_sha256: 'a'.repeat(64) },
      outcome: 'success', answerText: '', safeHtmlText: '', citations: [], rawSha256: 'b'.repeat(64)
    })).rejects.toMatchObject({ code: 'MODEL_PROVIDER_INVALID' })
  })
})

it('does not reuse a completed result from a different provider or model', () => {
  const profile = createBrowserExtractor('deepseek', 'deepseek-flash').profile
  const record = { status: 'completed' as const, provenance: { provider: profile.provider, model: profile.model, prompt_version: profile.promptVersion, prompt_sha256: profile.promptSha256, schema_version: profile.schemaVersion, started_at: '2026-09-16T00:00:00Z', completed_at: '2026-09-16T00:00:01Z' } }
  expect(matchesExtractorProfile(record, profile)).toBe(true)
  expect(matchesExtractorProfile(record, { ...profile, provider: 'openai-compatible' })).toBe(false)
  expect(matchesExtractorProfile(record, { ...profile, model: 'custom/model' })).toBe(false)
})
