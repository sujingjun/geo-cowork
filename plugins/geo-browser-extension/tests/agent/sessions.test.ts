import assert from 'node:assert/strict'
import test from 'node:test'

import type { CreatorAgentUIMessage } from '../../shared/utils/tools/agent'
import {
  createAgentSession,
  getAgentSessionTitle,
  restoreAgentSessions,
  shouldCreateAgentSession
} from '../../app/utils/agent-session'

function userMessage(text: string): CreatorAgentUIMessage {
  return {
    id: 'message-1',
    role: 'user',
    parts: [{ type: 'text', text }]
  }
}

test('新建 Agent 会话以新对话作为左栏初始名称', () => {
  assert.deepEqual(createAgentSession('session-1', '2026-08-30T00:00:00.000Z'), {
    id: 'session-1',
    title: '新对话',
    messages: [],
    createdAt: '2026-08-30T00:00:00.000Z',
    updatedAt: '2026-08-30T00:00:00.000Z'
  })
})

test('会话标题取第一条用户文本并压缩空白', () => {
  assert.equal(
    getAgentSessionTitle([userMessage('  帮我找\n美妆达人  ')]),
    '帮我找 美妆达人'
  )
})

test('恢复本地会话时跳过无效数据并补足空标题', () => {
  const sessions = restoreAgentSessions([
    {
      id: 'session-1',
      title: '',
      messages: [userMessage('生成合作邀请')],
      createdAt: '2026-08-30T00:00:00.000Z',
      updatedAt: '2026-08-30T00:01:00.000Z'
    },
    {
      id: 'session-1',
      title: '重复会话',
      messages: [],
      createdAt: '2026-08-30T00:00:00.000Z',
      updatedAt: '2026-08-30T00:02:00.000Z'
    },
    { id: 2 }
  ])

  assert.equal(sessions.length, 1)
  assert.equal(sessions[0]?.title, '生成合作邀请')
})

test('恢复多个空会话时最多保留一个且不改变非空会话', () => {
  const firstMessages = [userMessage('第一段会话内容')]
  const secondMessages = [userMessage('第二段会话内容')]
  const storedSessions = [
    {
      id: 'empty-session-1',
      title: '新对话',
      messages: [],
      createdAt: '2026-08-30T00:00:00.000Z',
      updatedAt: '2026-08-30T00:00:00.000Z'
    },
    {
      id: 'session-1',
      title: '保留标题一',
      messages: firstMessages,
      createdAt: '2026-08-30T00:01:00.000Z',
      updatedAt: '2026-08-30T00:02:00.000Z'
    },
    {
      id: 'empty-session-2',
      title: '新对话',
      messages: [],
      createdAt: '2026-08-30T00:03:00.000Z',
      updatedAt: '2026-08-30T00:03:00.000Z'
    },
    {
      id: 'session-2',
      title: '保留标题二',
      messages: secondMessages,
      createdAt: '2026-08-30T00:04:00.000Z',
      updatedAt: '2026-08-30T00:05:00.000Z'
    }
  ]
  const sessions = restoreAgentSessions(storedSessions)

  assert.equal(sessions.filter(session => session.messages.length === 0).length, 1)
  assert.deepEqual(
    sessions.filter(session => session.messages.length > 0),
    [
      {
        id: 'session-1',
        title: '保留标题一',
        messages: firstMessages,
        createdAt: '2026-08-30T00:01:00.000Z',
        updatedAt: '2026-08-30T00:02:00.000Z'
      },
      {
        id: 'session-2',
        title: '保留标题二',
        messages: secondMessages,
        createdAt: '2026-08-30T00:04:00.000Z',
        updatedAt: '2026-08-30T00:05:00.000Z'
      }
    ]
  )
  for (const activeSessionId of ['missing-session', 'session-2']) {
    assert.deepEqual(
      restoreAgentSessions(storedSessions, activeSessionId)
        .filter(session => session.messages.length === 0)
        .map(session => session.id),
      ['empty-session-1']
    )
  }
})

test('恢复多个空会话时优先保留当前选中的空会话', () => {
  const firstNonEmptySession = {
    id: 'session-1',
    title: '保留标题一',
    messages: [userMessage('第一段会话内容')],
    createdAt: '2026-08-30T00:01:00.000Z',
    updatedAt: '2026-08-30T00:02:00.000Z'
  }
  const secondNonEmptySession = {
    id: 'session-2',
    title: '保留标题二',
    messages: [userMessage('第二段会话内容')],
    createdAt: '2026-08-30T00:04:00.000Z',
    updatedAt: '2026-08-30T00:05:00.000Z'
  }
  const sessions = restoreAgentSessions([
    {
      id: 'empty-session-1',
      title: '新对话',
      messages: [],
      createdAt: '2026-08-30T00:00:00.000Z',
      updatedAt: '2026-08-30T00:00:00.000Z'
    },
    firstNonEmptySession,
    {
      id: 'empty-session-2',
      title: '新对话',
      messages: [],
      createdAt: '2026-08-30T00:03:00.000Z',
      updatedAt: '2026-08-30T00:03:00.000Z'
    },
    secondNonEmptySession
  ], 'empty-session-2')

  assert.deepEqual(
    sessions.filter(session => session.messages.length === 0).map(session => session.id),
    ['empty-session-2']
  )
  assert.deepEqual(
    sessions.filter(session => session.messages.length > 0),
    [firstNonEmptySession, secondNonEmptySession]
  )
})

test('当前 Agent 会话为空时不重复新增会话', () => {
  assert.equal(shouldCreateAgentSession([]), false)
  assert.equal(shouldCreateAgentSession([userMessage('帮我找达人')]), true)
})
