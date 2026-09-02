export type LlmProviderId = 'openai' | 'deepseek'

export interface LlmModelDefinition {
  label: string
  value: string
  provider: LlmProviderId
  icon: string
}
