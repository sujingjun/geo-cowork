#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * 环境变量配置检查工具。
 * 默认检查本地 .env；生产发布前使用 --production 检查 Vercel 拉取的生产环境文件。
 */

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const args = process.argv.slice(2)
const isProduction = args.includes('--production')
const fileArgIndex = args.indexOf('--file')
const envFile = fileArgIndex >= 0 && args[fileArgIndex + 1]
  ? args[fileArgIndex + 1]
  : '.env'

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function readEnvFile(filePath) {
  const fullPath = resolve(process.cwd(), filePath)

  if (!existsSync(fullPath)) {
    throw new Error(`未找到环境变量文件: ${filePath}`)
  }

  const env = readFileSync(fullPath, 'utf-8')
  const envVars = {}
  const presentKeys = new Set()

  for (const rawLine of env.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1)
      continue

    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()
    presentKeys.add(key)
    envVars[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }

  return { envVars, fullPath, presentKeys }
}

function maskValue(value) {
  if (!value)
    return ''

  if (value.length <= 10)
    return `${value.slice(0, 2)}...`

  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

function isConfigured(envVars, presentKeys, key) {
  return Boolean(envVars[key]) || (isProduction && presentKeys.has(key))
}

function formatConfiguredValue(envVars, key) {
  return envVars[key] ? '已配置' : '已配置（Vercel 加密变量，本地不可回读）'
}

function checkRequired(envVars, presentKeys, required) {
  let isValid = true

  for (const [key, config] of Object.entries(required)) {
    const value = envVars[key]

    if (!isConfigured(envVars, presentKeys, key)) {
      log(`❌ ${key} - 未配置 (${config.description})`, 'red')
      isValid = false
      continue
    }

    if (config.minLength && value && value.length < config.minLength) {
      log(`⚠️  ${key} - 已配置但长度不足 (${value.length}/${config.minLength} 字符)`, 'yellow')
      isValid = false
      continue
    }

    log(`✅ ${key} - ${formatConfiguredValue(envVars, key)}`, 'green')
  }

  return isValid
}

function checkDatabase(envVars, presentKeys) {
  const databaseKeys = ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRESQL_URL']
  const configuredKey = databaseKeys.find(key => isConfigured(envVars, presentKeys, key))

  if (!configuredKey) {
    log('❌ DATABASE_URL / POSTGRES_URL / POSTGRESQL_URL - 未配置 (生产 PostgreSQL / Supabase 连接串)', 'red')
    return false
  }

  log(`✅ ${configuredKey} - ${formatConfiguredValue(envVars, configuredKey)} (生产 PostgreSQL / Supabase 连接串)`, 'green')
  return true
}

function checkEnvFile() {
  log('\n🔍 检查环境变量配置...\n', 'cyan')

  let envVars
  let presentKeys
  let fullPath

  try {
    const result = readEnvFile(envFile)
    envVars = result.envVars
    presentKeys = result.presentKeys
    fullPath = result.fullPath
  } catch (error) {
    log(`❌ ${error.message}`, 'red')
    log('\n💡 本地开发: cp .env.example .env 后补齐变量', 'yellow')
    log('💡 生产发布: 先运行 pnpm vercel:pull:prod，再运行 pnpm check:env:production\n', 'yellow')
    return false
  }

  log(`📄 文件: ${fullPath}`, 'blue')
  log(`🌱 模式: ${isProduction ? 'production' : 'development'}\n`, 'blue')

  const required = {
    NUXT_SESSION_PASSWORD: {
      minLength: 32,
      description: '会话加密密钥'
    }
  }

  if (isProduction) {
    required.NUXT_PUBLIC_SITE_URL = {
      description: '生产站点 canonical URL / OAuth 回调基准地址'
    }
  }

  log('📋 必需配置:\n', 'blue')
  let isValid = checkRequired(envVars, presentKeys, required)

  if (isProduction)
    isValid = checkDatabase(envVars, presentKeys) && isValid

  const aiProviders = {
    AI_GATEWAY_API_KEY: 'Vercel AI Gateway',
    OPENAI_API_KEY: 'OpenAI',
    ANTHROPIC_API_KEY: 'Anthropic (Claude)',
    GOOGLE_GENERATIVE_AI_API_KEY: 'Google (Gemini)',
    DEEPSEEK_API_KEY: 'DeepSeek'
  }

  log('\n🤖 AI 提供商配置:\n', 'blue')
  const configuredProviders = []

  for (const [key, name] of Object.entries(aiProviders)) {
    if (isConfigured(envVars, presentKeys, key)) {
      configuredProviders.push(name)
      const detail = envVars[key]
        ? `已配置 (${maskValue(envVars[key])})`
        : '已配置（Vercel 加密变量，本地不可回读）'
      log(`✅ ${name} - ${detail}`, 'green')
    } else {
      log(`⚪ ${name} - 未配置`, 'reset')
    }
  }

  if (configuredProviders.length === 0) {
    log('\n❌ 未配置任何 AI 提供商，AI 对话不可用', 'red')
    isValid = false
  }

  const oauthPairs = [
    ['NUXT_OAUTH_GITHUB_CLIENT_ID', 'NUXT_OAUTH_GITHUB_CLIENT_SECRET', 'GitHub OAuth'],
    ['NUXT_OAUTH_GOOGLE_CLIENT_ID', 'NUXT_OAUTH_GOOGLE_CLIENT_SECRET', 'Google OAuth'],
    ['NUXT_OAUTH_AMAZON_CLIENT_ID', 'NUXT_OAUTH_AMAZON_CLIENT_SECRET', 'Amazon LWA OAuth'],
    ['NUXT_OAUTH_SHOPIFY_CLIENT_ID', 'NUXT_OAUTH_SHOPIFY_CLIENT_SECRET', 'Shopify OAuth']
  ]

  log('\n🔐 OAuth 配置:\n', 'blue')
  for (const [clientIdKey, secretKey, name] of oauthPairs) {
    const hasClientId = isConfigured(envVars, presentKeys, clientIdKey)
    const hasSecret = isConfigured(envVars, presentKeys, secretKey)

    if (hasClientId && hasSecret) {
      log(`✅ ${name} - 已配置`, 'green')
    } else if (hasClientId || hasSecret) {
      log(`⚠️  ${name} - 只配置了一半，请同时配置 ${clientIdKey} 和 ${secretKey}`, 'yellow')
      isValid = false
    } else {
      log(`⚪ ${name} - 未配置`, 'reset')
    }
  }

  const amazonApplicationId = isConfigured(envVars, presentKeys, 'AMAZON_SP_API_APPLICATION_ID')
  if (amazonApplicationId) {
    log('✅ Amazon SP-API application id - 已配置', 'green')
  } else {
    log('⚪ Amazon SP-API application id - 未配置（Amazon 授权 URL 需要 AMAZON_SP_API_APPLICATION_ID）', 'reset')
  }

  if (envVars.AMAZON_SP_API_ENVIRONMENT === 'sandbox') {
    if (isConfigured(envVars, presentKeys, 'AMAZON_SP_API_SANDBOX_REFRESH_TOKEN')) {
      log('✅ Amazon SP-API sandbox refresh token - 已配置', 'green')
    } else {
      log('❌ AMAZON_SP_API_SANDBOX_REFRESH_TOKEN - 未配置（沙箱调用需要在解决方案提供商门户创建 Token）', 'red')
      isValid = false
    }
  }

  log('\n🔧 可选配置:\n', 'blue')
  const optional = {
    BLOB_READ_WRITE_TOKEN: 'Vercel Blob 文件上传',
    OPENAI_BASE_URL: 'OpenAI 自定义端点',
    ANTHROPIC_BASE_URL: 'Anthropic 自定义端点',
    GOOGLE_BASE_URL: 'Google 自定义端点',
    DEEPSEEK_BASE_URL: 'DeepSeek 自定义端点',
    NUXT_OAUTH_SHOPIFY_SCOPES: 'Shopify OAuth scopes',
    SHOPIFY_API_VERSION: 'Shopify Admin API version'
  }

  for (const [key, description] of Object.entries(optional)) {
    if (isConfigured(envVars, presentKeys, key)) {
      log(`✅ ${key} - 已配置 (${description})`, 'green')
    } else {
      log(`⚪ ${key} - 未配置 (${description})`, 'reset')
    }
  }

  if (isProduction && !envVars.DATABASE_URL && ['POSTGRES_URL', 'POSTGRESQL_URL'].some(key => presentKeys.has(key)))
    log('\n⚠️  使用 POSTGRES_URL/POSTGRESQL_URL 作为生产数据库入口；若改为本地 prebuilt 发布，请确认本地能读取真实连接串。', 'yellow')

  log('\n📊 配置总结:\n', 'cyan')
  log(`   AI 提供商: ${configuredProviders.join(', ') || '未配置'}`, configuredProviders.length ? 'green' : 'red')
  log(`   状态: ${isValid ? '✅ 通过' : '❌ 未通过'}`, isValid ? 'green' : 'red')

  if (!isValid) {
    log('\n📖 生产发布参考: docs/生产-部署.md\n', 'yellow')
  }

  return isValid
}

process.exit(checkEnvFile() ? 0 : 1)
