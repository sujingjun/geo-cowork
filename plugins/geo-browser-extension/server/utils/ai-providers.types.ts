import type { LlmProviderId } from '../../shared/types/llm'

export interface AiProviderEnvironment {
  readonly [name: string]: string | undefined
}

export interface AiProviderConfiguration {
  providerName: string
  apiKeyEnvironmentVariable: string
  baseUrlEnvironmentVariable: string
}

export interface AiProviderFactoryInput {
  modelId: string
  providerName: string
  apiKey: string
  baseURL: string
}

export interface AiProviderCredentials {
  apiKey: string
  baseURL: string
}

export type AiProviderConfigurations = Record<LlmProviderId, AiProviderConfiguration>
