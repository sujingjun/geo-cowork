import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

import { getLlmModelDefinition } from '../../shared/utils/models'
import type {
  AiProviderConfigurations,
  AiProviderCredentials,
  AiProviderEnvironment,
  AiProviderFactoryInput,
  AiProviderConfiguration
} from './ai-providers.types'

const PROVIDER_CONFIGURATIONS: AiProviderConfigurations = {
  openai: {
    providerName: 'custom-openai',
    apiKeyEnvironmentVariable: 'OPENAI_API_KEY',
    baseUrlEnvironmentVariable: 'OPENAI_BASE_URL'
  },
  deepseek: {
    providerName: 'deepseek',
    apiKeyEnvironmentVariable: 'DEEPSEEK_API_KEY',
    baseUrlEnvironmentVariable: 'DEEPSEEK_BASE_URL'
  }
}

const PROVIDER_FACTORIES = {
  openai: ({ modelId, providerName, apiKey, baseURL }: AiProviderFactoryInput) =>
    createOpenAI({ name: providerName, apiKey, baseURL }).chat(modelId),
  deepseek: ({ modelId, apiKey, baseURL }: AiProviderFactoryInput) =>
    createDeepSeek({ apiKey, baseURL })(modelId)
}

function readProviderCredentials(
  modelId: string,
  configuration: AiProviderConfiguration,
  env: AiProviderEnvironment
): AiProviderCredentials {
  const apiKey = env[configuration.apiKeyEnvironmentVariable]?.trim()
  const baseURL = env[configuration.baseUrlEnvironmentVariable]?.trim()
  const missingVariables = [
    !apiKey && configuration.apiKeyEnvironmentVariable,
    !baseURL && configuration.baseUrlEnvironmentVariable
  ].filter((name): name is string => Boolean(name))

  if (!apiKey || !baseURL) {
    throw new Error(`模型 ${modelId} 缺少环境变量：${missingVariables.join('、')}`)
  }

  return { apiKey, baseURL }
}

export function resolveAiModel(modelId: string, env: AiProviderEnvironment = process.env) {
  const model = getLlmModelDefinition(modelId)
  if (!model) throw new Error(`不支持的模型：${modelId}`)

  const providerConfiguration = PROVIDER_CONFIGURATIONS[model.provider]
  const credentials = readProviderCredentials(modelId, providerConfiguration, env)
  return PROVIDER_FACTORIES[model.provider]({
    modelId: model.value,
    providerName: providerConfiguration.providerName,
    ...credentials
  })
}
