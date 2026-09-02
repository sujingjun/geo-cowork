import { DEFAULT_LLM_MODEL, isLlmModelId, MODELS } from '#shared/utils/models'
import type { LlmModelId } from '#shared/utils/models'

export function useModels() {
  const model = useCookie<LlmModelId>('model', { default: () => DEFAULT_LLM_MODEL })
  if (!isLlmModelId(model.value)) model.value = DEFAULT_LLM_MODEL

  return {
    models: [...MODELS],
    model
  }
}
