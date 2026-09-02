// https://nuxt.com/docs/api/configuration/nuxt-config
import { LOCAL_EXTENSION_API_BASE } from './extension/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@comark/nuxt',
    'nuxt-auth-utils',
    'nuxt-charts',
    'nuxt-csurf',
    '@pinia/nuxt'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  app: {
    baseURL: './',
    buildAssetsDir: 'assets/'
  },

  router: {
    options: {
      hashMode: process.env.EXTENSION_BUILD === '1'
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      agentApiBase: process.env.EXTENSION_LOCAL_TEST === '1'
        ? LOCAL_EXTENSION_API_BASE
        : ''
    }
  },

  routeRules: {
    // Machine-to-machine endpoints called by the extension service worker
    // (no browser cookies involved, so CSRF protection does not apply).
    '/api/creators/batch': { csurf: false },
    '/api/discovery/tiktok/upsert': { csurf: false },
    '/api/discovery/tiktok/analyze-comments': { csurf: false },
    '/api/discovery/tiktok/**': { csurf: false },
    '/api/analyze-page': { csurf: false },
    '/api/agent/chat': { csurf: false }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    experimental: {
      openAPI: true
    },
    prerender: {
      crawlLinks: true,
      routes: ['/']
    },
    static: true
  },

  vite: {
    optimizeDeps: {
      include: ['striptags']
    },
    build: {
      rollupOptions: {
        onLog(level, log, defaultHandler) {
          const msg = typeof log === 'string' ? log : log.message
          // Suppress benign, known-noise warnings from dependencies:
          // - nuxt's module-preload polyfill doesn't emit a sourcemap for its transform
          // - @vueuse/core ships /* #__PURE__ */ comments Rollup can't position
          if (
            msg.includes('module-preload-polyfill')
            || msg.includes('#__PURE__')
            || msg.includes('annotation that Rollup cannot interpret')
          ) {
            return
          }
          defaultHandler(level, log)
        }
      }
    }
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['@types/chrome']
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    assets: {
      prefix: 'fonts'
    }
  }
})
