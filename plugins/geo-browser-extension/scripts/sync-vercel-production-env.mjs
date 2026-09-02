#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

function readEnvFile(filePath) {
  const env = {}

  if (!existsSync(filePath))
    return env

  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#') || !line.includes('='))
      continue

    const separatorIndex = line.indexOf('=')
    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()
    env[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }

  return env
}

function isUsableValue(value) {
  if (!value || /^<.*>$/.test(value))
    return false

  const lowerValue = value.toLowerCase()
  return ![
    'your-',
    'your_',
    'placeholder',
    'example',
    'replace-me',
    'changeme'
  ].some(marker => lowerValue.includes(marker))
}

function runVercelEnvAdd(key, value) {
  const result = spawnSync('pnpm', ['dlx', 'vercel@54.14.0', 'env', 'add', key, 'production'], {
    input: `${value}\n`,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const output = `${result.stdout || ''}${result.stderr || ''}`.split(value).join('[redacted]')
  process.stdout.write(output)

  if (result.status !== 0)
    process.exit(result.status || 1)
}

const localEnv = readEnvFile('.env')
const productionEnv = readEnvFile('.vercel/.env.production.local')

const entries = {
  DATABASE_URL: productionEnv.POSTGRES_URL,
  NUXT_PUBLIC_SITE_URL: 'https://geo-site-building-web.vercel.app',
  NUXT_SESSION_PASSWORD: localEnv.NUXT_SESSION_PASSWORD,
  DEEPSEEK_API_KEY: localEnv.DEEPSEEK_API_KEY,
  DEEPSEEK_BASE_URL: localEnv.DEEPSEEK_BASE_URL,
  OPENAI_API_KEY: localEnv.OPENAI_API_KEY,
  OPENAI_BASE_URL: localEnv.OPENAI_BASE_URL,
  ANTHROPIC_API_KEY: localEnv.ANTHROPIC_API_KEY,
  ANTHROPIC_BASE_URL: localEnv.ANTHROPIC_BASE_URL,
  NUXT_OAUTH_GITHUB_CLIENT_ID: localEnv.NUXT_OAUTH_GITHUB_CLIENT_ID,
  NUXT_OAUTH_GITHUB_CLIENT_SECRET: localEnv.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
  NUXT_OAUTH_GOOGLE_CLIENT_ID: localEnv.NUXT_OAUTH_GOOGLE_CLIENT_ID,
  NUXT_OAUTH_GOOGLE_CLIENT_SECRET: localEnv.NUXT_OAUTH_GOOGLE_CLIENT_SECRET
}

for (const [key, value] of Object.entries(entries)) {
  if (!isUsableValue(value)) {
    console.log(`Skipping ${key} (empty or placeholder)`)
    continue
  }

  console.log(`Adding ${key} to production`)
  runVercelEnvAdd(key, value)
}
