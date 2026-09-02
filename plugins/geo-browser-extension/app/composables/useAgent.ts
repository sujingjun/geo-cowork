/**
 * Shared AI Agent session for every workbench page.
 *
 * The language model runs on the configured Nuxt server. Tools that need the
 * current browser state are executed in this page through the extension bridge.
 */

import { Chat } from '@ai-sdk/vue'
import { createGlobalState } from '@vueuse/core'
import {
  DefaultChatTransport,
  getToolName,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls
} from 'ai'
import type { CreatorAgentUIMessage } from '../../shared/utils/tools/agent'
import type { AgentRuntimeBridge } from '../utils/agent-runtime.types'
import {
  cloneAgentMessages,
  createAgentSession,
  getAgentSessionTitle,
  restoreAgentSessions,
  shouldCreateAgentSession,
  type AgentSession
} from '../utils/agent-session'
import {
  executeAutomaticAgentTool,
  getAgentErrorMessage,
  isAgentToolConfirmationRequired,
  isAutomaticAgentToolName,
  resolveAgentApiUrl
} from '../utils/agent-runtime'

const useAgentState = createGlobalState(() => {
  const toast = useToast()
  const runtimeConfig = useRuntimeConfig()
  const extensionBridge = useExtensionBridge()

  const input = ref('')
  const storedActiveSessionId = loadActiveAgentSessionId()
  const restoredSessions = loadAgentSessions(storedActiveSessionId)
  const agentSessions = ref<AgentSession[]>(restoredSessions.length ? restoredSessions : [createAgentSession()])
  const activeSessionId = ref(
    agentSessions.value.some(session => session.id === storedActiveSessionId)
      ? storedActiveSessionId!
      : agentSessions.value[0]!.id
  )
  const sessionId = activeSessionId

  const runtimeBridge: AgentRuntimeBridge = {
    searchCreators: extensionBridge.searchCreators,
    crawlComments: extensionBridge.crawlComments,
    getCreatorProfile: extensionBridge.getCreatorProfile,
    checkOutreachStatus: extensionBridge.checkOutreachStatus,
    analyzePage: extensionBridge.analyzePage,
    sendDm: extensionBridge.sendDm
  }
  const activeAgentApiUrl = ref('')

  function createChat(session: AgentSession): Chat<CreatorAgentUIMessage> {
    const chat = new Chat<CreatorAgentUIMessage>({
      id: session.id,
      messages: cloneAgentMessages(session.messages),
      transport: new DefaultChatTransport<CreatorAgentUIMessage>({
        api: '/api/agent/chat',
        prepareSendMessagesRequest: async (options) => {
          const api = resolveAgentApiUrl({
            isExtension: extensionBridge.isExtension.value,
            storedApiBase: await extensionBridge.getAgentApiBase(),
            configuredApiBase: runtimeConfig.public.agentApiBase
          })
          activeAgentApiUrl.value = api
          return {
            api,
            body: {
              ...options.body,
              id: options.id,
              messages: options.messages,
              trigger: options.trigger,
              messageId: options.messageId
            },
            headers: options.headers,
            credentials: extensionBridge.isExtension.value ? 'omit' : options.credentials
          }
        }
      }),
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      async onToolCall({ toolCall }) {
        if (toolCall.dynamic || isAgentToolConfirmationRequired(toolCall.toolName)) return
        if (!isAutomaticAgentToolName(toolCall.toolName)) return

        try {
          const output = await executeAutomaticAgentTool(
            toolCall.toolName,
            toolCall.input as Record<string, unknown>,
            runtimeBridge
          )
          void chat.addToolOutput({
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            output
          })
        } catch (error) {
          void chat.addToolOutput({
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            state: 'output-error',
            errorText: error instanceof Error ? error.message : '工具执行失败'
          })
        }
      },
      onError(error) {
        toast.add({
          description: getAgentErrorMessage(error, activeAgentApiUrl.value),
          icon: 'i-lucide-alert-circle',
          color: 'error',
          duration: 5000
        })
      }
    })

    return chat
  }

  const activeChat = shallowRef(createChat(agentSessions.value.find(session => session.id === activeSessionId.value)!))
  const messages = computed(() => activeChat.value.messages)
  const isStreaming = computed(() => activeChat.value.status === 'submitted' || activeChat.value.status === 'streaming')
  const activeToolCalls = computed(() => messages.value.flatMap(message => message.parts
    .filter(isToolUIPart)
    .map(part => ({
      name: getToolName(part),
      state: part.state,
      input: part.input,
      output: part.output
    }))))

  function persistSessions() {
    if (!import.meta.client) return

    try {
      localStorage.setItem(AGENT_SESSIONS_STORAGE_KEY, JSON.stringify(agentSessions.value))
      localStorage.setItem(AGENT_ACTIVE_SESSION_STORAGE_KEY, activeSessionId.value)
    } catch {
      toast.add({
        description: '浏览器存储不可用，本次 Agent 会话仅在当前页面保留',
        icon: 'i-lucide-alert-circle',
        color: 'warning'
      })
    }
  }

  function syncSession(sessionId: string, sessionMessages: CreatorAgentUIMessage[]) {
    const session = agentSessions.value.find(item => item.id === sessionId)
    if (!session) return

    const updatedSession: AgentSession = {
      ...session,
      messages: cloneAgentMessages(sessionMessages),
      title: getAgentSessionTitle(sessionMessages),
      updatedAt: new Date().toISOString()
    }

    agentSessions.value = [
      updatedSession,
      ...agentSessions.value.filter(item => item.id !== sessionId)
    ]
    persistSessions()
  }

  watch(messages, (sessionMessages) => {
    syncSession(activeSessionId.value, sessionMessages)
  }, { deep: true })

  async function send(text?: string) {
    const content = (text ?? input.value).trim()
    if (!content || isStreaming.value) return

    input.value = ''
    await activeChat.value.sendMessage({ text: content })
  }

  async function regenerate() {
    if (isStreaming.value) return
    await activeChat.value.regenerate()
  }

  function clear() {
    if (isStreaming.value) return

    activeChat.value.messages = []
    syncSession(activeSessionId.value, [])
  }

  function startNewSession(): boolean {
    if (isStreaming.value) {
      toast.add({
        description: '请等待当前回复完成后再新建会话',
        color: 'warning'
      })
      return false
    }

    if (!shouldCreateAgentSession(messages.value)) {
      return true
    }

    syncSession(activeSessionId.value, messages.value)

    const session = createAgentSession()
    agentSessions.value = [session, ...agentSessions.value]
    activeSessionId.value = session.id
    activeChat.value = createChat(session)
    input.value = ''
    persistSessions()
    return true
  }

  function selectSession(id: string): boolean {
    if (id === activeSessionId.value) return true

    if (isStreaming.value) {
      toast.add({
        description: '请等待当前回复完成后再切换会话',
        color: 'warning'
      })
      return false
    }

    const session = agentSessions.value.find(item => item.id === id)
    if (!session) return false

    syncSession(activeSessionId.value, messages.value)
    activeSessionId.value = id
    activeChat.value = createChat(session)
    input.value = ''
    persistSessions()
    return true
  }

  async function confirmToolCall(toolCallId: string, approved: boolean) {
    const chat = activeChat.value
    const part = chat.messages
      .flatMap(message => message.parts)
      .find(item => isToolUIPart(item) && item.toolCallId === toolCallId)

    if (!part || !isToolUIPart(part) || getToolName(part) !== 'send_dm' || part.state !== 'input-available') {
      return
    }

    if (!approved) {
      await chat.addToolOutput({
        tool: 'send_dm',
        toolCallId,
        output: {
          success: false,
          status: 'cancelled',
          message: '用户已取消私信发送'
        }
      })
      return
    }

    try {
      const output = await runtimeBridge.sendDm(part.input as Record<string, unknown>)
      await chat.addToolOutput({ tool: 'send_dm', toolCallId, output })
    } catch (error) {
      await chat.addToolOutput({
        tool: 'send_dm',
        toolCallId,
        state: 'output-error',
        errorText: error instanceof Error ? error.message : '私信发送失败'
      })
    }
  }

  function quickSearchCreators(keyword: string, minFollowers?: number, maxFollowers?: number) {
    const parts = [`帮我找${keyword}领域的达人`]
    if (minFollowers || maxFollowers) {
      const min = minFollowers ? formatFollowerCount(minFollowers) : '0'
      const max = maxFollowers ? formatFollowerCount(maxFollowers) : '不限'
      parts.push(`粉丝${min}-${max}`)
    }
    parts.push('找50个')
    void send(parts.join('，'))
  }

  function quickGenerateTemplate(purpose: string) {
    void send(`帮我生成一个"${purpose}"的私信文案模板`)
  }

  return {
    input,
    isStreaming,
    messages,
    activeToolCalls,
    agentSessions,
    activeSessionId,
    sessionId,
    send,
    regenerate,
    clear,
    startNewSession,
    selectSession,
    confirmToolCall,
    quickSearchCreators,
    quickGenerateTemplate
  }
})

export function useAgent() {
  return useAgentState()
}

const AGENT_SESSIONS_STORAGE_KEY = 'creator-workbench.agent-sessions.v1'
const AGENT_ACTIVE_SESSION_STORAGE_KEY = 'creator-workbench.active-agent-session.v1'

function loadAgentSessions(activeSessionId: string | null): AgentSession[] {
  if (!import.meta.client) return []

  try {
    const value = localStorage.getItem(AGENT_SESSIONS_STORAGE_KEY)
    return value ? restoreAgentSessions(JSON.parse(value), activeSessionId) : []
  } catch {
    return []
  }
}

function loadActiveAgentSessionId(): string | null {
  if (!import.meta.client) return null

  try {
    return localStorage.getItem(AGENT_ACTIVE_SESSION_STORAGE_KEY)
  } catch {
    return null
  }
}

function formatFollowerCount(n: number): string {
  if (n >= 10000) return `${n / 10000}万`
  if (n >= 1000) return `${n / 1000}k`
  return String(n)
}
