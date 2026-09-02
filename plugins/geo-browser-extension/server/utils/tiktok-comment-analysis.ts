import { z } from 'zod'
import type {
  TikTokCommentAnalysisItem,
  TikTokCommentAnalysisRequest,
  TikTokCommentAnalysisResponse,
  TikTokCommentAnalysisSummary
} from '../../shared/types/tiktok-comment-analysis'
import {
  MAX_TIKTOK_COMMENTS_PER_ANALYSIS,
  MAX_TIKTOK_KEYWORDS_PER_COMMENT,
  MAX_TIKTOK_SUMMARY_KEYWORDS
} from './tiktok-comment-analysis.constants'

export const tiktokCommentAnalysisRequestSchema = z.object({
  creator_identity: z.string().min(1),
  comments: z.array(z.object({
    comment_id: z.string().min(1),
    video_id: z.string().nullable(),
    text: z.string().min(1).max(1000)
  }).strict()).min(1).max(MAX_TIKTOK_COMMENTS_PER_ANALYSIS)
}).strict()

export const tiktokCommentAnalysisModelSchema = z.object({
  items: z.array(z.object({
    comment_id: z.string().min(1),
    sentiment: z.enum(['positive', 'neutral', 'negative']),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string().min(1)).max(MAX_TIKTOK_KEYWORDS_PER_COMMENT)
  }).strict())
}).strict()

export function summarizeTikTokCommentAnalyses(
  items: TikTokCommentAnalysisItem[]
): TikTokCommentAnalysisSummary {
  const keywordCounts = new Map<string, number>()
  let positiveCount = 0
  let neutralCount = 0
  let negativeCount = 0

  for (const item of items) {
    if (item.sentiment === 'positive') positiveCount++
    else if (item.sentiment === 'negative') negativeCount++
    else neutralCount++

    for (const rawKeyword of item.keywords) {
      const keyword = rawKeyword.trim()
      if (!keyword) continue
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1)
    }
  }

  const keywords = Array.from(keywordCounts, ([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword, 'zh-CN'))
    .slice(0, MAX_TIKTOK_SUMMARY_KEYWORDS)

  return {
    positive_count: positiveCount,
    neutral_count: neutralCount,
    negative_count: negativeCount,
    analyzed_comment_count: items.length,
    keywords
  }
}

export function createTikTokCommentAnalysisResponse(
  request: TikTokCommentAnalysisRequest,
  items: TikTokCommentAnalysisItem[],
  analyzedAt: string
): TikTokCommentAnalysisResponse {
  const requestedIds = new Set(request.comments.map(comment => comment.comment_id))
  const returnedIds = new Set(items.map(item => item.comment_id))
  const complete = requestedIds.size === request.comments.length
    && returnedIds.size === items.length
    && requestedIds.size === returnedIds.size
    && Array.from(requestedIds).every(id => returnedIds.has(id))
  if (!complete) throw new Error('模型结果未覆盖本次全部评论')

  return {
    creator_identity: request.creator_identity,
    items,
    summary: summarizeTikTokCommentAnalyses(items),
    analyzed_at: analyzedAt
  }
}
