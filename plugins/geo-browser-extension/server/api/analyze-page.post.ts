/**
 * POST /api/analyze-page — LLM judgment for page-analysis candidates.
 *
 * Receives a compact heuristic candidate extracted by the extension content
 * script (never full HTML) and decides whether the page contains a public
 * creator profile, normalizing the profile fields when it does.
 *
 * Body: { platform, url, candidate: { isProfilePage, confidence, extractedFields, signals, rawSummary } }
 * Returns: { is_creator_profile, confidence, platform, normalized, reason }
 */

import { generateObject } from 'ai'
import { z } from 'zod'
import { DEFAULT_LLM_MODEL } from '../../shared/utils/models'
import { resolveAiModel } from '../utils/ai-providers'

defineRouteMeta({
  openAPI: {
    description: 'Judge whether a social media page contains a creator profile (LLM).',
    tags: ['agent']
  }
})

const inputSchema = z.object({
  platform: z.enum(['tiktok', 'douyin', 'instagram', 'facebook']),
  url: z.string(),
  candidate: z.object({
    isProfilePage: z.boolean(),
    confidence: z.number(),
    extractedFields: z.record(z.string(), z.unknown()),
    signals: z.array(z.object({
      type: z.string(),
      name: z.string(),
      value: z.unknown().optional(),
      confidence: z.number()
    })),
    rawSummary: z.string().max(4000)
  })
})

const outputSchema = z.object({
  is_creator_profile: z.boolean().describe('该页面是否包含公开达人（创作者）画像'),
  confidence: z.number().min(0).max(1).describe('判定置信度'),
  platform: z.enum(['tiktok', 'douyin', 'instagram', 'facebook']),
  normalized: z.object({
    platform_uid: z.string().describe('平台唯一标识，如 TikTok @username'),
    nickname: z.string().nullable(),
    avatar_url: z.string().nullable(),
    signature: z.string().nullable(),
    follower_count: z.number().nullable(),
    following_count: z.number().nullable(),
    video_count: z.number().nullable(),
    total_favorited: z.number().nullable(),
    region: z.string().nullable()
  }).nullable().describe('判定为达人时输出规范化画像字段，否则为 null'),
  reason: z.string().describe('一句中文判定依据，展示给用户')
})

const ANALYZE_PROMPT = `你是一个社媒页面分类器。根据输入的页面候选摘要（由浏览器插件从页面 HTML 结构中启发式提取），判断该页面是否包含一个公开的达人/创作者画像（profile）。

判定标准：
- 是达人画像：页面是某个具体用户的公开主页，包含昵称、粉丝数、简介等画像字段
- 不是：平台首页、信息流、登录墙、验证码页、错误页、纯视频播放页（无作者完整画像）等

若判定为达人画像，将提取到的字段规范化输出：
- platform_uid 必填（TikTok 为 @username，不含 @）
- 粉丝数等计数字段输出纯数字；无法确定的字段输出 null
- 不要编造输入中不存在的字段值

用中文输出 reason（一句话说明判定依据）。`

export default defineEventHandler(async (event) => {
  const { platform, url, candidate } = await readValidatedBody(event, inputSchema.parse)

  const { object } = await generateObject({
    model: resolveAiModel(DEFAULT_LLM_MODEL),
    schema: outputSchema,
    system: ANALYZE_PROMPT,
    prompt: [
      `平台: ${platform}`,
      `页面URL: ${url}`,
      `启发式判定: isProfilePage=${candidate.isProfilePage}, confidence=${candidate.confidence}`,
      `页面摘要:\n${candidate.rawSummary}`
    ].join('\n')
  })

  console.log(`[analyze-page] ${platform} ${url} → is_creator_profile=${object.is_creator_profile} (${object.confidence})`)

  return object
})
