export type TikTokCommentSentiment = 'positive' | 'neutral' | 'negative'

export interface TikTokCommentAnalysisItem {
  comment_id: string
  sentiment: TikTokCommentSentiment
  confidence: number
  keywords: string[]
}

export interface TikTokCommentKeywordCount {
  keyword: string
  count: number
}

export interface TikTokCommentAnalysisSummary {
  positive_count: number
  neutral_count: number
  negative_count: number
  analyzed_comment_count: number
  keywords: TikTokCommentKeywordCount[]
}

export interface TikTokCommentAnalysisRequest {
  creator_identity: string
  comments: Array<{
    comment_id: string
    video_id: string | null
    text: string
  }>
}

export interface TikTokCommentAnalysisResponse {
  creator_identity: string
  items: TikTokCommentAnalysisItem[]
  summary: TikTokCommentAnalysisSummary
  analyzed_at: string
}
