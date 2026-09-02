/**
 * POST /api/agent/chat — AI Agent SSE streaming endpoint.
 *
 * Receives user messages and streams Agent responses with tool calls.
 * Uses the AI SDK's streamText with agent tools for orchestration.
 *
 * Body: { messages: UIMessage[], model?: string }
 * Returns: SSE stream (UIMessageStream)
 */

import type { UIMessage } from 'ai'
import { createAgentUIStreamResponse, smoothStream, stepCountIs, ToolLoopAgent } from 'ai'
import { z } from 'zod'
import { DEFAULT_LLM_MODEL, isLlmModelId } from '../../../shared/utils/models'
import { resolveAiModel } from '../../utils/ai-providers'

defineRouteMeta({
  openAPI: {
    description: 'AI Agent chat with tool use for creator workbench.',
    tags: ['agent']
  }
})

const AGENT_SYSTEM_PROMPT = `你是"达人建联工作台"的 AI Agent 助手。你的职责是帮助用户通过自然语言完成达人挖掘、私信触达和对话转化。

**核心能力：**
1. 搜索达人 — 根据用户描述的关键词和筛选条件搜索目标达人
2. 抓取评论 — 从视频评论区发现潜在达人
3. 获取达人详情 — 查询达人详细资料
4. 发送私信 — 向达人发送个性化私信
5. 生成文案 — 根据目的和语气生成个性化私信模板
6. 查看触达状态 — 查看达人池状态和触达进度
7. 页面画像分析 — 插件模式下打开 TikTok 达人主页会自动识别达人画像并入库；用 analyze_page 查询最近分析结果

**交互规则：**
- 用中文回复
- 当用户描述需求时，主动解析意图并调用相应工具
- 搜索、抓取评论、详情、触达状态和页面画像工具由当前浏览器页面执行，必须等待页面返回真实结果后再总结
- 用户明确要求发送且已经给出平台、平台收件人标识和完整私信内容时，直接调用 send_dm，不要先用文字再次询问；抖音收件人标识用 sec_uid，TikTok 用用户名，页面会在执行工具前展示最终确认按钮
- 工具执行后，用简洁的语言总结结果
- 如果需要用户提供更多信息（如关键词、粉丝量级），主动询问
- 对于复杂任务，分步骤执行并汇报进度
- 不使用 Markdown 标题（#），用**加粗**代替

**示例对话：**
用户：帮我找美妆领域、粉丝1k-10k的达人，找50个
Agent：好的，我来帮你搜索美妆领域的达人。→ 调用 search_creators 工具 → 返回结果摘要

用户：给这批达人发新品种草文案
Agent：我来生成新品种草文案模板。→ 调用 create_message_template 工具 → 展示文案 → 确认后调用 send_dm`

export default defineEventHandler(async (event) => {
  const { messages, model } = await readValidatedBody(event, z.object({
    messages: z.array(z.custom<UIMessage>()),
    model: z.string().refine(isLlmModelId, { message: '不支持的模型' }).optional().default(DEFAULT_LLM_MODEL)
  }).parse)

  const abortController = new AbortController()
  event.node.req.on('close', () => abortController.abort())

  const agent = new ToolLoopAgent({
    model: resolveAiModel(model),
    instructions: AGENT_SYSTEM_PROMPT,
    tools: agentTools,
    stopWhen: stepCountIs(10)
  })

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    abortSignal: abortController.signal,
    experimental_transform: smoothStream(),
    sendSources: true,
    sendReasoning: true
  })
})
