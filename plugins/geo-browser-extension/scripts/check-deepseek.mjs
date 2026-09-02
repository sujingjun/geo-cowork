#!/usr/bin/env node

/**
 * DeepSeek 配置测试工具
 * 快速验证 DeepSeek API 配置是否正确
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testDeepSeek() {
  log('\n🚀 DeepSeek 配置测试\n', 'cyan')

  // 检查环境变量
  const envPath = join(process.cwd(), '.env')

  if (!existsSync(envPath)) {
    log('❌ 未找到 .env 文件', 'red')
    log('\n💡 请在项目根目录创建 .env 文件，并添加:', 'yellow')
    log('   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n')
    process.exit(1)
  }

  const env = readFileSync(envPath, 'utf-8')
  const lines = env.split('\n').filter(line => line.trim() && !line.startsWith('#'))

  const envVars = {}
  lines.forEach((line) => {
    const [key, ...values] = line.split('=')
    if (key) {
      envVars[key.trim()] = values.join('=').trim()
    }
  })

  const apiKey = envVars.DEEPSEEK_API_KEY
  const baseURL = envVars.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

  if (!apiKey) {
    log('❌ 未配置 DEEPSEEK_API_KEY', 'red')
    log('\n💡 请在 .env 文件中添加:', 'yellow')
    log('   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n')
    log('📖 获取 API 密钥: https://platform.deepseek.com/\n')
    process.exit(1)
  }

  // 显示配置信息
  log('📋 当前配置:\n', 'blue')
  const masked = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4)
  log(`   API Key: ${masked}`, 'cyan')
  log(`   Base URL: ${baseURL}`, 'cyan')

  // 测试 API 连接
  log('\n🔍 测试 API 连接...\n', 'blue')

  try {
    const response = await fetch(`${baseURL}/v1/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    log('✅ API 连接成功！', 'green')
    log('\n📦 可用模型:\n', 'blue')

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((model) => {
        log(`   • ${model.id}`, 'cyan')
      })
    }

    log('\n✨ DeepSeek 配置完成！', 'green')
    log('\n💡 下一步:', 'yellow')
    log('   1. 运行: pnpm dev')
    log('   2. 在聊天界面选择 DeepSeek 模型')
    log('   3. 开始体验 DeepSeek AI 助手\n')
  } catch (error) {
    log('❌ API 连接失败', 'red')
    log(`\n错误详情: ${error.message}`, 'red')

    log('\n🔧 故障排除:', 'yellow')
    log('   1. 检查 API Key 是否正确')
    log('   2. 确认 API Key 已激活且有配额')
    log('   3. 检查网络连接')
    log('   4. 访问 https://platform.deepseek.com/ 查看账户状态')
    log('\n📖 详细文档: docs/deepseek-配置-指南.md\n')
    process.exit(1)
  }
}

// 运行测试
testDeepSeek()
