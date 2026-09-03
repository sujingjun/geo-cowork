import type { NuxtConfig } from '@nuxt/schema'

const browserQueryRouteRules = {
  '/mcp': { csurf: false },
  '/api/browser-query/**': { csurf: false }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@comark/nuxt',
    '@nuxthub/core',
    'nuxt-auth-utils',
    'nuxt-charts',
    'nuxt-csurf',
    '@nuxt/a11y',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/device',
    '@nuxtjs/emotion',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    oauth: {
      amazon: {
        clientId: process.env.NUXT_OAUTH_AMAZON_CLIENT_ID || process.env.AMAZON_LWA_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_AMAZON_CLIENT_SECRET || process.env.AMAZON_LWA_CLIENT_SECRET || ''
      },
      shopify: {
        clientId: process.env.NUXT_OAUTH_SHOPIFY_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_SHOPIFY_CLIENT_SECRET || ''
      },
      google: {
        clientId: '',
        clientSecret: ''
      }
    },
    amazon: {
      environment: process.env.AMAZON_SP_API_ENVIRONMENT || 'production',
      applicationId: process.env.AMAZON_SP_API_APPLICATION_ID || '',
      sellerCentralAuthorizeUrl: process.env.AMAZON_SELLER_CENTRAL_AUTHORIZE_URL || '', // https://sellercentral.amazon.com/apps/authorize/consent
      authorizationVersion: process.env.AMAZON_SP_API_AUTH_VERSION || '',
      sandboxRefreshToken: process.env.AMAZON_SP_API_SANDBOX_REFRESH_TOKEN || '',
      region: process.env.AMAZON_SP_API_REGION || 'us-east-1',
      marketplaceId: process.env.AMAZON_MARKETPLACE_ID || '', // ATVPDKIKX0DER
      spApiEndpoint: process.env.AMAZON_SP_API_ENDPOINT || '' // https://sellingpartnerapi-na.amazon.com
    },
    // AI Provider Configuration. Keep secrets in environment variables only.
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL || ''
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseURL: process.env.ANTHROPIC_BASE_URL || ''
    },
    google: {
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
      baseURL: process.env.GOOGLE_BASE_URL || ''
    },
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: process.env.DEEPSEEK_BASE_URL || ''
    },
    shopify: {
      scopes: process.env.NUXT_OAUTH_SHOPIFY_SCOPES || 'read_products',
      apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10'
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
    }
  },

  // nuxt-csurf 1.6.5 augments an older Nitro route type; preserve its documented runtime shape.
  routeRules: browserQueryRouteRules as unknown as NonNullable<NuxtConfig['routeRules']>,

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  hub: {
    db: 'postgresql',
    blob: true
  },

  vite: {
    optimizeDeps: {
      include: ['striptags']
    }
  },

  csurf: {
    encryptSecret: process.env.NUXT_SESSION_PASSWORD || '',
    cookie: {
      sameSite: 'lax'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
