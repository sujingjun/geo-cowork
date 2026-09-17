import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['server/**/*.test.ts', 'app/**/*.test.ts'],
    exclude: ['node_modules/**', '.nuxt/**', '.output/**', 'tests/**/*.mjs'],
    setupFiles: ['./tests/model-setup.ts'],
    testTimeout: 120_000,
    hookTimeout: 120_000,
    fileParallelism: false
  }
})
