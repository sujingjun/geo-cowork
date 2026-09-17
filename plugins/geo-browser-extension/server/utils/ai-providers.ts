import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { google, createGoogleGenerativeAI } from '@ai-sdk/google'
import { deepseek, createDeepSeek } from '@ai-sdk/deepseek'
import type { LanguageModel } from 'ai'

interface RuntimeConfig {
  openai?: {
    apiKey?: string
    baseURL?: string
  }
  anthropic?: {
    apiKey?: string
    baseURL?: string
  }
  google?: {
    apiKey?: string
    baseURL?: string
  }
  deepseek?: {
    apiKey?: string
    baseURL?: string
  }
}

/**
 * 初始化 AI 模型提供商
 * @param modelString - 模型字符串，格式: 'provider/model-name'
 * @param config - 运行时配置
 * @returns 配置好的语言模型实例
 */
export function initializeAIProvider(modelString: string, config: RuntimeConfig): LanguageModel {
  const slash = modelString.indexOf('/')
  const provider = modelString.slice(0, slash)
  const modelName = slash >= 0 ? modelString.slice(slash + 1) : ''

  if (!modelName) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid model format: ${modelString}. Expected format: 'provider/model-name'`
    })
  }

  switch (provider) {
    case 'anthropic': {
      try {
        // 检查是否需要自定义配置
        if (config.anthropic?.apiKey || config.anthropic?.baseURL) {
          const anthropicProvider = createAnthropic({
            apiKey: config.anthropic?.apiKey,
            baseURL: config.anthropic?.baseURL
          })
          return anthropicProvider(modelName) as LanguageModel
        } else {
          // 使用默认配置（需要环境变量 ANTHROPIC_API_KEY）
          return anthropic(modelName) as LanguageModel
        }
      } catch (error: unknown) {
        console.error(`Anthropic initialization error: ${error instanceof Error ? error.message : 'Unknown provider error'}`)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to initialize Anthropic model: ${modelName}. Please check your ANTHROPIC_API_KEY environment variable.`
        })
      }
    }

    case 'openai': {
      try {
        // 检查是否需要自定义配置
        if (config.openai?.apiKey || config.openai?.baseURL) {
          const openaiProvider = createOpenAI({
            apiKey: config.openai?.apiKey,
            baseURL: config.openai?.baseURL
          })
          return openaiProvider(modelName) as LanguageModel
        } else {
          // 使用默认配置（需要环境变量 OPENAI_API_KEY）
          return openai(modelName) as LanguageModel
        }
      } catch (error: unknown) {
        console.error(`OpenAI initialization error: ${error instanceof Error ? error.message : 'Unknown provider error'}`)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to initialize OpenAI model: ${modelName}. Please check your OPENAI_API_KEY environment variable. See docs/ai-配置-修复.md for help.`
        })
      }
    }

    case 'google': {
      try {
        // 检查是否需要自定义配置
        if (config.google?.apiKey || config.google?.baseURL) {
          const googleProvider = createGoogleGenerativeAI({
            apiKey: config.google?.apiKey,
            baseURL: config.google?.baseURL
          })
          return googleProvider(modelName) as LanguageModel
        } else {
          // 使用默认配置（需要环境变量 GOOGLE_GENERATIVE_AI_API_KEY）
          return google(modelName) as LanguageModel
        }
      } catch (error: unknown) {
        console.error(`Google initialization error: ${error instanceof Error ? error.message : 'Unknown provider error'}`)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to initialize Google model: ${modelName}. Please check your GOOGLE_GENERATIVE_AI_API_KEY environment variable.`
        })
      }
    }

    case 'deepseek': {
      try {
        // 检查是否需要自定义配置
        if (config.deepseek?.apiKey || config.deepseek?.baseURL) {
          const deepseekProvider = createDeepSeek({
            apiKey: config.deepseek?.apiKey,
            baseURL: config.deepseek?.baseURL
          })
          return deepseekProvider(modelName) as LanguageModel
        } else {
          // 使用默认配置（需要环境变量 DEEPSEEK_API_KEY）
          return deepseek(modelName) as LanguageModel
        }
      } catch (error: unknown) {
        console.error(`DeepSeek initialization error: ${error instanceof Error ? error.message : 'Unknown provider error'}`)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to initialize DeepSeek model: ${modelName}. Please check your DEEPSEEK_API_KEY environment variable.`
        })
      }
    }

    default:
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported provider: ${provider}. Supported providers: openai, anthropic, google, deepseek`
      })
  }
}

/**
 * 生成聊天标题的模型初始化
 * @param config - 运行时配置
 * @returns 配置好的语言模型实例
 */
export function initializeTitleGeneratorModel(config: RuntimeConfig): LanguageModel {
  try {
    // 优先使用 OpenAI 生成标题（成本低、速度快）
    return initializeAIProvider('deepseek/deepseek-v4-flash', config)
  } catch (error: unknown) {
    console.error(`Title generator initialization failed: ${error instanceof Error ? error.message : 'Unknown provider error'}`)
    console.error('Please configure OPENAI_API_KEY environment variable')
    console.error('See docs/ai-配置-修复.md for detailed setup instructions')
    throw error
  }
}
