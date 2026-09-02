import type { AgentRuntimeBridge, AutomaticAgentToolName } from './agent-runtime.types'

const AUTOMATIC_AGENT_TOOL_NAMES: AutomaticAgentToolName[] = [
  'search_creators',
  'crawl_comments',
  'get_creator_profile',
  'check_outreach_status',
  'analyze_page'
]

interface ResolveAgentApiUrlOptions {
  isExtension: boolean
  storedApiBase: unknown
  configuredApiBase: unknown
}

function normalizeApiBase(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\/+$/, '') : ''
}

export function resolveAgentApiUrl(options: ResolveAgentApiUrlOptions): string {
  if (!options.isExtension) return '/api/agent/chat'

  const apiBase = normalizeApiBase(options.storedApiBase)
    || normalizeApiBase(options.configuredApiBase)

  if (!apiBase) {
    throw new Error('AI Agent 未配置服务端地址（api_base）')
  }

  return `${apiBase}/api/agent/chat`
}

export function getAgentErrorMessage(error: unknown, apiUrl = ''): string {
  const originalMessage = error instanceof Error ? error.message : String(error || 'AI Agent 请求失败')
  const normalizedMessage = originalMessage.toLowerCase()
  if (normalizedMessage.includes('failed to fetch')
    || normalizedMessage.includes('networkerror')
    || normalizedMessage.includes('load failed')) {
    let server = apiUrl
    try {
      server = new URL(apiUrl).origin
    } catch {
      // Keep the original URL when it is relative or malformed.
    }
    const target = server ? `（${server}）` : ''
    return `无法连接 AI Agent 服务端${target}。请确认服务已启动，并使用本地测试扩展构建。`
  }

  if (originalMessage[0] === '{') {
    try {
      return JSON.parse(originalMessage).message || originalMessage
    } catch {
      // Keep the original error text.
    }
  }
  return originalMessage
}

export async function executeAutomaticAgentTool(
  toolName: AutomaticAgentToolName,
  input: Record<string, unknown>,
  bridge: AgentRuntimeBridge
): Promise<unknown> {
  switch (toolName) {
    case 'search_creators':
      return bridge.searchCreators(input)
    case 'crawl_comments':
      return bridge.crawlComments(input)
    case 'get_creator_profile':
      return bridge.getCreatorProfile(input)
    case 'check_outreach_status':
      return bridge.checkOutreachStatus(input)
    case 'analyze_page':
      return bridge.analyzePage(input)
  }
}

export function isAgentToolConfirmationRequired(toolName: string): boolean {
  return toolName === 'send_dm'
}

export function isAutomaticAgentToolName(toolName: string): toolName is AutomaticAgentToolName {
  return AUTOMATIC_AGENT_TOOL_NAMES.includes(toolName as AutomaticAgentToolName)
}
