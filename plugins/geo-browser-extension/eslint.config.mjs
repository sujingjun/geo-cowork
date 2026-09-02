// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Nuxt ESLint 配置会自动从 nuxt.config.ts 中读取 stylistic 设置
  {
    rules: {
    // 通用规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/max-attributes-per-line': ['error', { singleline: 3 }]
    }
  }
)
