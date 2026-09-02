import type { CreatorAgentUIMessage } from '../../shared/utils/tools/agent'

export const DEFAULT_AGENT_SESSION_TITLE = '新对话'

const MAX_AGENT_SESSION_TITLE_LENGTH = 30

export interface AgentSession {
  id: string
  title: string
  messages: CreatorAgentUIMessage[]
  createdAt: string
  updatedAt: string
}

export function createAgentSession(
  id = crypto.randomUUID(),
  timestamp = new Date().toISOString()
): AgentSession {
  return {
    id,
    title: DEFAULT_AGENT_SESSION_TITLE,
    messages: [],
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

export function getAgentSessionTitle(messages: CreatorAgentUIMessage[]): string {
  for (const message of messages) {
    if (message?.role !== 'user') continue

    for (const part of message.parts ?? []) {
      if (part.type !== 'text') continue

      const title = part.text.replace(/\s+/g, ' ').trim()
      if (title) return title.slice(0, MAX_AGENT_SESSION_TITLE_LENGTH)
    }
  }

  return DEFAULT_AGENT_SESSION_TITLE
}

export function cloneAgentMessages(messages: CreatorAgentUIMessage[]): CreatorAgentUIMessage[] {
  return JSON.parse(JSON.stringify(messages)) as CreatorAgentUIMessage[]
}

export function shouldCreateAgentSession(messages: CreatorAgentUIMessage[]): boolean {
  return messages.length > 0
}

export function restoreAgentSessions(
  value: unknown,
  activeSessionId: string | null = null
): AgentSession[] {
  if (!Array.isArray(value)) return []

  const restoredIds = new Set<string>()

  const sessions = value.flatMap((item): AgentSession[] => {
    if (!isRecord(item)
      || typeof item.id !== 'string'
      || !Array.isArray(item.messages)
      || typeof item.createdAt !== 'string'
      || typeof item.updatedAt !== 'string') {
      return []
    }
    if (restoredIds.has(item.id)) return []
    restoredIds.add(item.id)

    const messages = item.messages as CreatorAgentUIMessage[]
    const title = typeof item.title === 'string' && item.title.trim()
      ? item.title.trim()
      : getAgentSessionTitle(messages)

    return [{
      id: item.id,
      title,
      messages,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }]
  })

  const emptySessionId = sessions.find(
    session => session.id === activeSessionId && session.messages.length === 0
  )?.id ?? sessions.find(session => session.messages.length === 0)?.id

  return sessions.filter(session => session.messages.length > 0 || session.id === emptySessionId)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}
