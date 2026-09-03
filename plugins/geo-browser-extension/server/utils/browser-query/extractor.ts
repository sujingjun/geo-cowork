import type { BrowserExtractor } from '../../../shared/types/browser-query'
import { sha256 } from './canonical'
import { BrowserQueryError } from './errors'

const PROMPT = 'Extract answer text, structure, citation occurrences, neutral annotations and warnings. Do not infer GEO claims or business conclusions.'

export function createBrowserExtractor(mode: string | undefined): BrowserExtractor {
  const profile = {
    provider: mode === 'fake' ? 'fake' : 'disabled',
    model: mode === 'fake' ? 'fixture-extractor-v1' : 'none',
    promptVersion: 'browser-query-extract-v1',
    promptSha256: sha256(PROMPT),
    schemaVersion: 'geo-browser-extraction-result-v1' as const
  }
  if (mode !== 'fake') {
    return {
      profile,
      async extract() {
        throw new BrowserQueryError(
          'EXTRACTION_MODEL_FAILED',
          'No extractor is configured; real model use requires separate authorization'
        )
      }
    }
  }
  return {
    profile,
    async extract(input) {
      return {
        answer: {
          text: input.answerText,
          html_structure_summary: input.safeHtmlText === input.answerText
            ? 'text-only answer root'
            : 'answer root with structured HTML',
          refusal: input.outcome === 'refusal',
          completeness: input.answerText.trim() ? 'complete' : 'unknown'
        },
        citations: input.citations,
        platform_annotations: [],
        warnings: []
      }
    }
  }
}
