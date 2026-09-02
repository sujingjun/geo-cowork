import { generateObject } from 'ai'
import { DEFAULT_LLM_MODEL } from '../../../../shared/utils/models'
import { client } from '../../../utils/db'
import { resolveAiModel } from '../../../utils/ai-providers'
import {
  createTikTokCommentAnalysisResponse,
  tiktokCommentAnalysisModelSchema,
  tiktokCommentAnalysisRequestSchema
} from '../../../utils/tiktok-comment-analysis'
import {
  ensureTikTokDiscoveryTables,
  saveTikTokCommentAnalysis
} from '../../../utils/tiktok-discovery-repository'

defineRouteMeta({
  openAPI: {
    description: '用户主动触发 TikTok 评论情感与关键词分析。评论原文不写入服务端数据库。',
    tags: ['creator-discovery']
  }
})

const ANALYSIS_PROMPT = `你负责分析公开视频下的评论文字。

对每条评论：
- sentiment 只能是 positive、neutral、negative
- confidence 为 0 到 1
- keywords 最多 5 个，使用评论原语言中的简短词组
- 只根据评论文字判断，不推断评论者或创作者的性别、肤色、年龄等个人属性
- comment_id 必须原样返回，每个输入 ID 恰好返回一次
`

export default defineEventHandler(async (event) => {
  const request = await readValidatedBody(event, tiktokCommentAnalysisRequestSchema.parse)
  const { object } = await generateObject({
    model: resolveAiModel(DEFAULT_LLM_MODEL),
    schema: tiktokCommentAnalysisModelSchema,
    system: ANALYSIS_PROMPT,
    prompt: JSON.stringify(request.comments)
  })
  const response = createTikTokCommentAnalysisResponse(
    request,
    object.items,
    new Date().toISOString()
  )

  await ensureTikTokDiscoveryTables(client)
  await saveTikTokCommentAnalysis(
    client,
    response,
    new Map(request.comments.map(comment => [comment.comment_id, comment.video_id]))
  )
  return response
})
