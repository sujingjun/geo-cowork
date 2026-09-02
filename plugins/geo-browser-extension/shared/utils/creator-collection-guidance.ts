import { RECOMMENDED_COMMENT_SAMPLE_SIZE } from '../constants/creator-collection'
import type {
  CreatorCollectionGuidance,
  CreatorCollectionGuidanceInput
} from '../types/creator-collection-guidance'
import { getCreatorProfileUrl } from './creator-display'

export function getCreatorCollectionGuidance(
  input: CreatorCollectionGuidanceInput
): CreatorCollectionGuidance[] {
  const guidance: CreatorCollectionGuidance[] = []
  const profileUrl = getCreatorProfileUrl(input.creator)
  const missingProfileFields = [
    !input.creator.avatar_url && '头像',
    !input.creator.signature && '简介',
    !input.creator.country && '国家',
    !input.creator.language && '语言',
    input.creator.follower_count == null && '粉丝数'
  ].filter((field): field is string => Boolean(field))
  if (profileUrl && missingProfileFields.length > 0) {
    guidance.push({
      kind: 'profile',
      label: '打开达人主页补全画像',
      message: `${missingProfileFields.join('、')}存在缺失。`,
      url: profileUrl
    })
  }

  const incompleteVideo = input.videos.find(video =>
    video.url && (
      video.like_count == null
      || video.play_count == null
      || video.favorite_count == null
      || video.comment_count == null
      || video.share_count == null
    )
  )
  if (incompleteVideo?.url) {
    const missingVideoFields = [
      incompleteVideo.like_count == null && '点赞',
      incompleteVideo.play_count == null && '播放',
      incompleteVideo.favorite_count == null && '收藏',
      incompleteVideo.comment_count == null && '评论',
      incompleteVideo.share_count == null && '分享'
    ].filter((field): field is string => Boolean(field))
    guidance.push({
      kind: 'video',
      label: '打开视频页补全指标',
      message: `${missingVideoFields.join('、')}次数存在缺失。`,
      url: incompleteVideo.url
    })
  }

  const commentVideoUrl = input.videos.find(video => video.url)?.url
  if (commentVideoUrl && input.collectedCommentCount < RECOMMENDED_COMMENT_SAMPLE_SIZE) {
    guidance.push({
      kind: 'comments',
      label: '打开视频页继续采集评论',
      message: `当前已采集 ${input.collectedCommentCount} 条评论，建议至少采集 ${RECOMMENDED_COMMENT_SAMPLE_SIZE} 条。`,
      url: commentVideoUrl
    })
  }
  return guidance
}
