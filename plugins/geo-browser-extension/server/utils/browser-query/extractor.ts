import type { BrowserExtractor } from '../../../shared/types/browser-query'
import { EXTRACTION_PROMPT, extractAnswer, modelHash, resolveModelConfig } from '../../../../geo-expert/scripts/lib/model-client.mjs'
import { extractionOutputSchema } from './schemas'

export function createBrowserExtractor(provider?: string, model?: string): BrowserExtractor {
  const selected = provider ?? process.env.GEO_MODEL_PROVIDER ?? 'deepseek'
  const selectedModel = model ?? process.env[selected === 'deepseek' ? 'DEEPSEEK_MODEL' : 'OPENAI_MODEL'] ?? ''
  return {
    profile: {
      provider: selected, model: selectedModel,
      promptVersion: 'browser-query-extract-v2', promptSha256: modelHash(EXTRACTION_PROMPT),
      schemaVersion: 'geo-browser-extraction-result-v1'
    },
    async extract(input) {
      resolveModelConfig({ provider: selected, model: selectedModel })
      const result = await extractAnswer(input, {
        provider: selected, model: selectedModel,
        auditDir: process.env.GEO_MODEL_AUDIT_DIR ?? '.data/model-calls'
      })
      return { output: extractionOutputSchema.parse(result.output), audit: result.audit }
    }
  }
}
