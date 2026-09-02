import assert from 'node:assert/strict'
import test from 'node:test'

import {
  executeAutomaticAgentTool,
  getAgentErrorMessage,
  isAgentToolConfirmationRequired,
  resolveAgentApiUrl
} from '../../app/utils/agent-runtime'

test('扩展页面把 Agent 请求发送到已配置的服务端', () => {
  assert.equal(resolveAgentApiUrl({
    isExtension: true,
    storedApiBase: 'http://localhost:3000/',
    configuredApiBase: ''
  }), 'http://localhost:3000/api/agent/chat')
})

test('扩展页面未配置服务端时给出明确错误', () => {
  assert.throws(() => resolveAgentApiUrl({
    isExtension: true,
    storedApiBase: '',
    configuredApiBase: ''
  }), /未配置服务端地址/)
})

test('网页模式继续使用同源 Agent 接口', () => {
  assert.equal(resolveAgentApiUrl({
    isExtension: false,
    storedApiBase: '',
    configuredApiBase: ''
  }), '/api/agent/chat')
})

test('Agent 服务端无法连接时给出可执行的本地启动提示', () => {
  assert.equal(
    getAgentErrorMessage(
      new TypeError('Failed to fetch'),
      'http://localhost:3000/api/agent/chat'
    ),
    '无法连接 AI Agent 服务端（http://localhost:3000）。请确认服务已启动，并使用本地测试扩展构建。'
  )
})

test('搜索达人工具通过当前页面的扩展桥接执行', async () => {
  let received: unknown
  const result = await executeAutomaticAgentTool('search_creators', {
    keyword: '美妆',
    minFollowers: 1000,
    maxFollowers: 10000,
    targetCount: 50
  }, {
    searchCreators: async (input) => {
      received = input
      return { status: 'started' }
    }
  })

  assert.deepEqual(received, {
    keyword: '美妆',
    minFollowers: 1000,
    maxFollowers: 10000,
    targetCount: 50
  })
  assert.deepEqual(result, { status: 'started' })
})

test('浏览器能力工具都通过当前页面的扩展桥接执行', async () => {
  const calls: Array<[string, Record<string, unknown>]> = []
  const bridge = {
    searchCreators: async (input: Record<string, unknown>) => ({ input }),
    crawlComments: async (input: Record<string, unknown>) => {
      calls.push(['crawl_comments', input])
      return { status: 'started' }
    },
    getCreatorProfile: async (input: Record<string, unknown>) => {
      calls.push(['get_creator_profile', input])
      return { found: true }
    },
    checkOutreachStatus: async (input: Record<string, unknown>) => {
      calls.push(['check_outreach_status', input])
      return { total: 2 }
    },
    analyzePage: async (input: Record<string, unknown>) => {
      calls.push(['analyze_page', input])
      return { success: true }
    }
  }

  await executeAutomaticAgentTool('crawl_comments', { awemeId: '123' }, bridge)
  await executeAutomaticAgentTool('get_creator_profile', { secUid: 'sec-1' }, bridge)
  await executeAutomaticAgentTool('check_outreach_status', { status: 'sent' }, bridge)
  await executeAutomaticAgentTool('analyze_page', {}, bridge)

  assert.deepEqual(calls, [
    ['crawl_comments', { awemeId: '123' }],
    ['get_creator_profile', { secUid: 'sec-1' }],
    ['check_outreach_status', { status: 'sent' }],
    ['analyze_page', {}]
  ])
})

test('只有真实私信发送必须等待用户确认', () => {
  assert.equal(isAgentToolConfirmationRequired('send_dm'), true)
  assert.equal(isAgentToolConfirmationRequired('search_creators'), false)
  assert.equal(isAgentToolConfirmationRequired('create_message_template'), false)
})
