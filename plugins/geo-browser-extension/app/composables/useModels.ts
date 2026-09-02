import { MODELS } from '#shared/utils/models'

export function useModels() {
  const model = useCookie<string>('model', { default: () => 'deepseek/deepseek-v4-flash' })

  // 验证并修复旧的模型名称
  if (model.value && !MODELS.some(m => m.value === model.value)) {
    console.warn(`Invalid model "${model.value}" in cookie, resetting to default`)
    model.value = 'deepseek/deepseek-v4-flash'
  }

  return {
    models: MODELS,
    model
  }
}
