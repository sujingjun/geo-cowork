import type { LlmModelDefinition } from '../types/llm'

export const MODELS = [
  { label: 'GPT-5.4', value: 'gpt-5.4', provider: 'openai', icon: 'i-simple-icons-openai' },
  { label: 'DeepSeek V4 Flash', value: 'deepseek-v4-flash', provider: 'deepseek', icon: 'i-simple-icons-deepseek' },
  { label: 'DeepSeek V4 Pro', value: 'deepseek-v4-pro', provider: 'deepseek', icon: 'i-simple-icons-deepseek' }
] as const satisfies readonly LlmModelDefinition[]

export type LlmModelId = typeof MODELS[number]['value']

export const DEFAULT_LLM_MODEL: LlmModelId = 'gpt-5.4'

export function getLlmModelDefinition(modelId: string) {
  return MODELS.find(model => model.value === modelId)
}

export function isLlmModelId(modelId: string): modelId is LlmModelId {
  return getLlmModelDefinition(modelId) !== undefined
}
