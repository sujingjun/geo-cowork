/**
 * AI Agent tool definitions for the Creator Workbench.
 *
 * These tools allow the Agent to orchestrate creator discovery,
 * DM outreach, and profile enrichment.
 *
 * Browser-state tools intentionally omit execute so the current page can
 * route them through the Chrome extension bridge.
 */

import { tool } from 'ai'
import type { InferUITools, UIMessage } from 'ai'
import { z } from 'zod'

/**
 * search_creators — Search for creators by keyword with optional filters.
 *
 * In extension mode: triggers Douyin search interception flow.
 * In web mode: queries the local creator store.
 */
export const searchCreatorsTool = tool({
  description: '搜索达人。支持按关键词、粉丝量级范围筛选。在插件模式下会自动打开抖音搜索页并拦截数据。',
  inputSchema: z.object({
    keyword: z.string().describe('搜索关键词，如"美妆"、"健身"'),
    minFollowers: z.number().optional().describe('最小粉丝数'),
    maxFollowers: z.number().optional().describe('最大粉丝数'),
    targetCount: z.number().optional().default(50).describe('目标采集数量')
  }),
  outputSchema: z.unknown()
})

/**
 * crawl_comments — Crawl comments from a video to find potential creators.
 */
export const crawlCommentsTool = tool({
  description: '从指定视频的评论区抓取用户，用于发现潜在达人。需要提供视频URL或aweme_id。',
  inputSchema: z.object({
    videoUrl: z.string().optional().describe('抖音视频URL'),
    awemeId: z.string().optional().describe('抖音视频ID')
  }),
  outputSchema: z.unknown()
})

/**
 * get_creator_profile — Get detailed profile for a specific creator.
 */
export const getCreatorProfileTool = tool({
  description: '获取指定达人的详细资料，包括粉丝数、签名、作品数等。',
  inputSchema: z.object({
    platform: z.enum(['douyin', 'tiktok']).describe('达人平台'),
    recipientId: z.string().describe('抖音 sec_uid 或 TikTok 用户名')
  }),
  outputSchema: z.unknown()
})

/**
 * send_dm — Send a DM to a creator.
 */
export const sendDmTool = tool({
  description: '向达人发送私信。必须提供平台、该平台的收件人标识和完整消息内容。抖音使用 sec_uid，TikTok 使用用户名。页面会在真实发送前要求用户确认。',
  inputSchema: z.object({
    platform: z.enum(['douyin', 'tiktok']).describe('达人平台：douyin 或 tiktok'),
    recipientId: z.string().describe('平台收件人标识：抖音 sec_uid 或 TikTok 用户名'),
    message: z.string().describe('私信内容'),
    templateId: z.string().optional().describe('文案模板ID（可选）')
  }),
  outputSchema: z.unknown()
})

/**
 * create_message_template — Generate a personalized message template.
 */
export const createMessageTemplateTool = tool({
  description: '生成个性化私信文案模板。支持变量占位符如{{昵称}}、{{领域}}等。可根据达人画像自动生成。',
  inputSchema: z.object({
    purpose: z.string().describe('文案目的，如"新品种草"、"合作邀请"'),
    tone: z.string().optional().default('友好').describe('语气风格，如"友好"、"正式"、"活泼"'),
    variables: z.array(z.string()).optional().describe('需要包含的变量占位符'),
    targetDescription: z.string().optional().describe('目标达人描述，如"美妆领域1万-10万粉丝"')
  }),
  execute: async ({ purpose, tone, variables, targetDescription }) => {
    // Generate a template based on the parameters
    const templates: Record<string, string> = {
      新品种草: `{{昵称}}你好！我注意到你在${targetDescription || '美妆'}领域的优质内容，特别喜欢你最近的作品。我们有一款新品非常适合你的风格，想邀请你体验种草。有兴趣了解详情吗？`,
      合作邀请: `{{昵称}}你好！我是品牌方，一直在关注你的账号。你的内容质量和粉丝互动都非常好，想和你聊一个合作机会。方便详细沟通吗？`,
      default: `{{昵称}}你好！关注你很久了，特别喜欢你的内容风格。有个合作想和你聊聊，方便吗？`
    }

    const content = templates[purpose] || templates['default']!

    return {
      name: `${purpose}-${tone}`,
      content,
      variables: variables || ['昵称', '领域'],
      message: `已生成"${purpose}"文案模板，语气为${tone}`
    }
  }
})

/**
 * check_outreach_status — Check the status of outreach tasks.
 */
export const checkOutreachStatusTool = tool({
  description: '查看触达任务状态，包括已发送、已回复、已转化等统计。',
  inputSchema: z.object({
    status: z.string().optional().describe('筛选状态：pending/sent/replied/converted'),
    page: z.number().optional().default(1),
    pageSize: z.number().optional().default(20)
  }),
  outputSchema: z.unknown()
})

/**
 * analyze_page — Report the latest page-analysis results, or judge a pasted
 * HTML snippet directly (web mode).
 *
 * In extension mode, page analysis runs automatically when a supported
 * profile page (e.g. a TikTok @username page) finishes loading; this tool
 * reports what the analysis pipeline recently mined.
 */
export const analyzePageTool = tool({
  description: '查询页面画像分析结果。插件模式下打开 TikTok 达人主页会自动完成识别并入库，本工具返回最近分析到的达人；网页模式可传入 htmlSnippet 直接判定。',
  inputSchema: z.object({
    htmlSnippet: z.string().optional().describe('可选：粘贴的页面HTML片段（仅网页模式需要）'),
    url: z.string().optional().describe('可选：该片段对应的页面URL')
  }),
  outputSchema: z.unknown()
})

/**
 * All agent tools combined.
 */
export const agentTools = {
  search_creators: searchCreatorsTool,
  crawl_comments: crawlCommentsTool,
  get_creator_profile: getCreatorProfileTool,
  send_dm: sendDmTool,
  create_message_template: createMessageTemplateTool,
  check_outreach_status: checkOutreachStatusTool,
  analyze_page: analyzePageTool
}

export type CreatorAgentUIMessage = UIMessage<unknown, Record<string, never>, InferUITools<typeof agentTools>>
