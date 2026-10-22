import path from 'node:path'
import { catalog, snapshotDirectory } from './lib/build-context'
import { projectAfterParse, projectBeforeParse } from './lib/content'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/content', './modules/knowledge'],
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  content: {
    watch: { enabled: false },
    build: { markdown: { toc: { searchDepth: 3 } } },
    experimental: { sqliteConnector: 'native' },
    ...(snapshotDirectory ? { _localDatabase: { type: 'sqlite', filename: path.join(snapshotDirectory, 'content.sqlite') } } : {})
  },
  ui: { fonts: false },
  runtimeConfig: {
    public: {
      knowledge: {
        brand: catalog?.workspace.brand || 'Knowledge',
        workspaceId: catalog?.workspace.id || '',
        revision: catalog?.revision || '',
        logicalEntries: catalog?.logicalEntries || 0
      }
    }
  },
  compatibilityDate: '2026-06-30',
  nitro: {
    serverAssets: snapshotDirectory ? [{ baseName: 'knowledge', dir: snapshotDirectory, pattern: 'snapshot.json' }] : [],
    prerender: { crawlLinks: false }
  },
  hooks: {
    'content:file:beforeParse': (ctx) => { if (catalog) projectBeforeParse(catalog, ctx) },
    'content:file:afterParse': (ctx) => { if (catalog) projectAfterParse(catalog, ctx) }
  },
  eslint: { config: { stylistic: { commaDangle: 'never', braceStyle: '1tbs' } } }
})
