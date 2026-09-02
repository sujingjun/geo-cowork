import { CREATOR_STATUS_LABELS } from './constants'
import type { AgentRuntimeDependencies, CrawlCommentsInput, CreatorProfileInput, OutreachStatusInput, SearchCreatorsInput } from './agent-runtime.types'
import type { Creator } from './types'

export function createAgentRuntime(dependencies: AgentRuntimeDependencies) {
  async function searchCreators(input: SearchCreatorsInput) {
    const keyword = input.keyword.trim()
    const url = `https://www.douyin.com/search/${encodeURIComponent(keyword)}`
    const tab = await dependencies.openTab(url)

    return {
      success: true,
      status: 'started',
      tabId: tab.id,
      message: `已打开“${keyword}”的抖音搜索页，搜索结果会自动进入达人池`
    }
  }

  async function crawlComments(input: CrawlCommentsInput) {
    let url: string
    if (input.videoUrl) {
      const parsedUrl = new URL(input.videoUrl)
      if (parsedUrl.hostname !== 'www.douyin.com' || !parsedUrl.pathname.startsWith('/video/')) {
        throw new Error('仅支持抖音视频地址')
      }
      url = parsedUrl.toString()
    } else if (input.awemeId?.trim()) {
      url = `https://www.douyin.com/video/${encodeURIComponent(input.awemeId.trim())}`
    } else {
      throw new Error('请提供抖音视频地址或 aweme_id')
    }

    const tab = await dependencies.openTab(url)
    return {
      success: true,
      status: 'started',
      tabId: tab.id,
      message: '已打开抖音视频，页面评论加载后会自动采集评论用户'
    }
  }

  function getCreatorProfile(input: CreatorProfileInput) {
    const recipientId = input.recipientId.trim().replace(/^@/, '')
    const creator = dependencies.getCreators().find(item => item.platform === input.platform && (
      input.platform === 'tiktok'
        ? item.platform_uid === recipientId
        : item.sec_uid === recipientId
    ))
    const cachedProfile = input.platform === 'douyin'
      ? dependencies.getProfile(recipientId)
      : undefined
    const profile = cachedProfile ? { ...creator, ...cachedProfile } : creator

    if (!profile) {
      return { found: false, message: `未找到 ${input.platform} 平台标识为 ${recipientId} 的达人` }
    }

    const status = creator?.status ? CREATOR_STATUS_LABELS[creator.status] : '未知'
    return {
      found: true,
      profile,
      message: `达人 ${String(profile.nickname || recipientId)}：粉丝 ${String(profile.follower_count ?? '未知')}，状态 ${status}`
    }
  }

  function checkOutreachStatus(input: OutreachStatusInput) {
    const creators = dependencies.getCreators()
    const statuses: Creator['status'][] = ['pending', 'sent', 'replied', 'converted', 'blocked']
    const summary = Object.fromEntries(statuses.map(status => [
      status,
      creators.filter(creator => creator.status === status).length
    ])) as Record<Creator['status'], number>
    const filtered = input.status
      ? creators.filter(creator => creator.status === input.status)
      : creators
    const page = Math.max(1, Number(input.page) || 1)
    const pageSize = Math.max(1, Number(input.pageSize) || 20)
    const start = (page - 1) * pageSize
    const label = input.status && input.status in CREATOR_STATUS_LABELS
      ? CREATOR_STATUS_LABELS[input.status as Creator['status']]
      : '全部'

    return {
      total: filtered.length,
      items: filtered.slice(start, start + pageSize),
      summary,
      message: `当前有 ${filtered.length} 个${label}状态的达人`
    }
  }

  return {
    searchCreators,
    crawlComments,
    getCreatorProfile,
    checkOutreachStatus
  }
}
