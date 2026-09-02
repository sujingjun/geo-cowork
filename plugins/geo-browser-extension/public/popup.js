const elements = {
  creatorList: document.querySelector('#creator-list'),
  discoveredCount: document.querySelector('#discovered-count'),
  insertedCount: document.querySelector('#inserted-count'),
  openWorkbench: document.querySelector('#open-workbench'),
  pendingCommentCount: document.querySelector('#pending-comment-count'),
  poolCount: document.querySelector('#pool-count'),
  retry: document.querySelector('#retry'),
  status: document.querySelector('#status'),
  updatedCount: document.querySelector('#updated-count')
}

function formatCount(value) {
  if (value == null) return '-'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return String(value)
}

function normalizeHandle(value) {
  return typeof value === 'string' ? value.trim().replace(/^@/, '') : ''
}

function getCreatorDisplayName(creator) {
  if (creator.nickname?.trim()) return creator.nickname.trim()
  const handle = normalizeHandle(creator.unique_id)
    || normalizeHandle(creator.platform_uid)
    || normalizeHandle(creator.short_id)
  if (handle) return `@${handle}`
  const stableId = normalizeHandle(creator.stable_id) || normalizeHandle(creator.sec_uid)
  if (stableId) {
    const label = creator.platform === 'tiktok' ? 'TikTok 达人' : '抖音达人'
    return `${label} · ${stableId.slice(0, 8)}${stableId.length > 8 ? '…' : ''}`
  }
  return '未命名达人'
}

function getCreatorProfileUrl(creator) {
  if (creator.platform === 'tiktok') {
    const username = normalizeHandle(creator.platform_uid) || normalizeHandle(creator.unique_id)
    return username ? `https://www.tiktok.com/@${encodeURIComponent(username)}` : null
  }
  const secUid = normalizeHandle(creator.sec_uid)
  return secUid ? `https://www.douyin.com/user/${encodeURIComponent(secUid)}` : null
}

function appendText(parent, tagName, className, text) {
  const element = document.createElement(tagName)
  element.className = className
  element.textContent = text
  parent.appendChild(element)
  return element
}

function createCreatorCard(creator) {
  const card = document.createElement('article')
  card.className = 'creator-card'

  const header = document.createElement('div')
  header.className = 'creator-card-header'
  appendText(header, 'strong', '', getCreatorDisplayName(creator))
  appendText(header, 'span', 'platform-badge', creator.platform === 'tiktok' ? 'TikTok' : '抖音')
  card.appendChild(header)

  const publicId = normalizeHandle(creator.platform_uid)
    || normalizeHandle(creator.unique_id)
    || normalizeHandle(creator.sec_uid)
  appendText(card, 'p', 'creator-handle', publicId ? `@${publicId}` : '暂无公开账号')

  const metrics = document.createElement('div')
  metrics.className = 'creator-card-metrics'
  appendText(metrics, 'span', '', `粉丝 ${formatCount(creator.follower_count)}`)
  appendText(metrics, 'span', '', `作品 ${formatCount(creator.aweme_count)}`)
  appendText(metrics, 'span', '', `获赞 ${formatCount(creator.total_favorited)}`)
  card.appendChild(metrics)

  const actions = document.createElement('div')
  actions.className = 'creator-card-actions'
  const profileUrl = getCreatorProfileUrl(creator)
  const profileButton = appendText(actions, 'button', 'secondary-action', '打开主页')
  profileButton.type = 'button'
  profileButton.disabled = !profileUrl
  profileButton.addEventListener('click', async () => {
    if (profileUrl) await chrome.tabs.create({ url: profileUrl })
  })

  const deleteButton = appendText(actions, 'button', 'danger-action', '删除')
  deleteButton.type = 'button'
  deleteButton.addEventListener('click', async () => {
    if (!confirm(`确认删除“${getCreatorDisplayName(creator)}”吗？此操作会同时清理相关采集数据。`)) return
    try {
      const result = await chrome.runtime.sendMessage({
        type: 'DELETE_CREATOR',
        params: { creatorId: creator.id }
      })
      if (!result?.success) throw new Error(result?.error || '删除达人失败')
      await loadData()
    } catch (error) {
      elements.status.textContent = error instanceof Error ? error.message : '删除达人失败'
    }
  })
  card.appendChild(actions)
  return card
}

function renderCreatorList(creators) {
  elements.creatorList.replaceChildren()
  if (creators.length === 0) {
    appendText(elements.creatorList, 'p', 'empty-state', '当前页面暂未发现达人。请停留在达人、搜索或视频页面完成识别。')
    return
  }
  const fragment = document.createDocumentFragment()
  for (const creator of creators) fragment.appendChild(createCreatorCard(creator))
  elements.creatorList.appendChild(fragment)
}

function renderDiscoverySummary(summary) {
  elements.discoveredCount.textContent = formatCount(summary?.discovered || 0)
  elements.insertedCount.textContent = formatCount(summary?.inserted || 0)
  elements.updatedCount.textContent = formatCount(summary?.updated || 0)
  elements.pendingCommentCount.textContent = formatCount(summary?.pending_comments || 0)
}

function renderStatus(analysis, summary, creatorCount) {
  if (summary?.inserted || summary?.updated) {
    elements.status.textContent = `识别完成：新增 ${summary.inserted || 0} 位，完善 ${summary.updated || 0} 位达人`
    return
  }
  if (creatorCount > 0) {
    elements.status.textContent = `当前页面发现 ${creatorCount} 位达人`
    return
  }
  elements.status.textContent = analysis?.reason || '当前页面暂未发现达人'
}

async function loadData() {
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const searchParams = new URLSearchParams(window.location.search)
    const fallbackPageUrl = searchParams.get('pageUrl') || ''
    const fallbackTabId = Number(searchParams.get('sourceTabId'))
    const pageUrl = fallbackPageUrl || activeTab?.url || ''
    const sourceTabId = Number.isInteger(fallbackTabId) && fallbackTabId > 0
      ? fallbackTabId
      : activeTab?.id
    const [analysisResult, pageResult] = await Promise.all([
      chrome.runtime.sendMessage({ type: 'GET_LAST_ANALYSIS' }),
      chrome.runtime.sendMessage({
        type: 'GET_PAGE_CREATOR_LIST',
        params: { pageUrl, tabId: sourceTabId }
      })
    ])
    const creators = pageResult.items || []
    renderCreatorList(creators)
    renderDiscoverySummary(pageResult.summary || { discovered: creators.length })
    const currentAnalysis = analysisResult.analysis?.url === pageUrl ? analysisResult.analysis : null
    renderStatus(currentAnalysis, pageResult.summary, creators.length)
    elements.poolCount.textContent = `本页发现：${pageResult.total || 0}`
  } catch (error) {
    elements.status.textContent = error instanceof Error ? error.message : '读取达人列表失败'
  }
}

elements.retry.addEventListener('click', async () => {
  elements.retry.disabled = true
  elements.status.textContent = '正在重新识别当前页面…'
  try {
    const result = await chrome.runtime.sendMessage({ type: 'ANALYZE_PAGE', params: {} })
    if (!result.success) throw new Error(result.error || '分析失败')
    await loadData()
  } catch (error) {
    elements.status.textContent = error instanceof Error ? error.message : '分析失败'
  } finally {
    elements.retry.disabled = false
  }
})

elements.openWorkbench.addEventListener('click', async () => {
  await chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/workbench') })
})

void loadData()
