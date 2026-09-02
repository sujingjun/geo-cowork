import assert from 'node:assert/strict'
import test from 'node:test'

import { agentTools } from '../../shared/utils/tools/agent'

test('浏览器状态相关工具交给当前页面执行', () => {
  const clientToolNames = [
    'search_creators',
    'crawl_comments',
    'get_creator_profile',
    'send_dm',
    'check_outreach_status',
    'analyze_page'
  ] as const

  for (const toolName of clientToolNames) {
    assert.equal(agentTools[toolName].execute, undefined, `${toolName} 不应在服务端执行`)
  }
})

test('文案生成工具保留服务端执行能力', () => {
  assert.equal(typeof agentTools.create_message_template.execute, 'function')
})
