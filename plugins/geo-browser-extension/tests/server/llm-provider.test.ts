import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveAiModel } from '../../server/utils/ai-providers'

test('三个模型分别解析到对应的 OpenAI-compatible 自定义网关', () => {
  const env = {
    OPENAI_API_KEY: 'openai-test-key',
    OPENAI_BASE_URL: 'https://openai.example.test/v1',
    DEEPSEEK_API_KEY: 'deepseek-test-key',
    DEEPSEEK_BASE_URL: 'https://deepseek.example.test/v1'
  }

  const gpt = resolveAiModel('gpt-5.4', env)
  const flash = resolveAiModel('deepseek-v4-flash', env)
  const pro = resolveAiModel('deepseek-v4-pro', env)

  assert.deepEqual([
    { modelId: gpt.modelId, provider: gpt.provider },
    { modelId: flash.modelId, provider: flash.provider },
    { modelId: pro.modelId, provider: pro.provider }
  ], [
    { modelId: 'gpt-5.4', provider: 'custom-openai.chat' },
    { modelId: 'deepseek-v4-flash', provider: 'deepseek.chat' },
    { modelId: 'deepseek-v4-pro', provider: 'deepseek.chat' }
  ])
})

test('所选 provider 配置不完整时拒绝回退到官方默认地址', () => {
  assert.throws(
    () => resolveAiModel('gpt-5.4', {
      DEEPSEEK_API_KEY: 'deepseek-test-key',
      DEEPSEEK_BASE_URL: 'https://deepseek.example.test/v1'
    }),
    { message: '模型 gpt-5.4 缺少环境变量：OPENAI_API_KEY、OPENAI_BASE_URL' }
  )

  assert.throws(
    () => resolveAiModel('deepseek-v4-flash', {
      OPENAI_API_KEY: 'openai-test-key',
      OPENAI_BASE_URL: 'https://openai.example.test/v1'
    }),
    { message: '模型 deepseek-v4-flash 缺少环境变量：DEEPSEEK_API_KEY、DEEPSEEK_BASE_URL' }
  )
})
