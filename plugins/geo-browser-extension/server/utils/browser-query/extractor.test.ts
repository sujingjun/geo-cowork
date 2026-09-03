import { describe, expect, it } from 'vitest'

import { createBrowserExtractor } from './extractor'

describe('Browser extractor seam', () => {
  it('uses a deterministic fake without network and disables real providers by default', async () => {
    const fake = createBrowserExtractor('fake')
    const output = await fake.extract({
      query: { ref: 'Q-TEST-001', version: '1.0.0', query_text_sha256: 'a'.repeat(64) },
      outcome: 'success',
      answerText: 'Fixture answer',
      safeHtmlText: 'Fixture answer',
      citations: [],
      rawSha256: 'b'.repeat(64)
    })
    expect(output).toMatchObject({
      answer: { text: 'Fixture answer', completeness: 'complete' },
      citations: []
    })
    expect(await fake.extract({
      query: { ref: 'Q-TEST-001', version: '1.0.0', query_text_sha256: 'a'.repeat(64) },
      outcome: 'refusal',
      answerText: 'Fixture refusal',
      safeHtmlText: 'Fixture refusal',
      citations: [],
      rawSha256: 'b'.repeat(64)
    })).toMatchObject({ answer: { refusal: true } })

    await expect(createBrowserExtractor('disabled').extract({
      query: { ref: 'Q-TEST-001', version: '1.0.0', query_text_sha256: 'a'.repeat(64) },
      outcome: 'refusal',
      answerText: 'No real call',
      safeHtmlText: 'No real call',
      citations: [],
      rawSha256: 'b'.repeat(64)
    })).rejects.toMatchObject({ code: 'EXTRACTION_MODEL_FAILED' })
  })
})
