/**
 * Main World injection — hooks fetch / XMLHttpRequest to intercept
 * Douyin API responses.
 *
 * Intercepted endpoints:
 *   /aweme/v1/web/comment/list      → extract comment users (sec_uid)
 *   /aweme/v1/web/search/item        → extract video search results (author info)
 *   /aweme/v1/web/user/profile/other → extract user profile data
 *   /aweme/v1/web/aweme/post         → extract user video posts
 */
;(function () {
  console.log('[CreatorWorkbench] Inject script loaded')

  // ─── Cloak utility: disguise hooked functions as native ──────────

  function cloakNative(hijackedFn: Function, originalFn: Function) {
    if (originalFn && originalFn.name) {
      try {
        Object.defineProperty(hijackedFn, 'name', {
          value: originalFn.name,
          writable: false,
          configurable: true,
          enumerable: false
        })
      } catch (_) {
        // ignore
      }
    }
    const nativeStr = `function ${originalFn ? originalFn.name : ''}() { [native code] }`
    hijackedFn.toString = function () { return nativeStr } as any
    ;(hijackedFn.toString as any).toString = function () {
      return 'function toString() { [native code] }'
    }
  }

  // ─── Message helpers ─────────────────────────────────────────────

  function sendToContentScript(type: string, payload: unknown, source: string) {
    try {
      window.postMessage({ type, payload }, '*')
    } catch (e) {
      console.error(`[CreatorWorkbench] ${source}: postMessage failed:`, e)
    }
  }

  function sendCommentData(data: unknown, source: string) {
    const d = data as any
    const userCount = Array.isArray(d?.users) ? d.users.length : 0
    const commentCount = Array.isArray(d?.comments) ? d.comments.length : 0
    console.log(`[CreatorWorkbench] ${source} sending comment data: users=${userCount}, comments=${commentCount}`)
    sendToContentScript('DOUYIN_COMMENT_EXTENSION_DATA', data, source)
  }

  function sendSearchItemData(payload: unknown, source: string) {
    const p = payload as any
    const videoCount = Array.isArray(p?.videos) ? p.videos.length : 0
    console.log(`[CreatorWorkbench] ${source} sending search/item data: videos=${videoCount}`)
    sendToContentScript('DOUYIN_SEARCH_ITEM_DATA', payload, source)
  }

  function sendProfileData(payload: unknown, source: string) {
    console.log(`[CreatorWorkbench] ${source} sending user profile data`)
    sendToContentScript('DOUYIN_USER_PROFILE_DATA', payload, source)
  }

  function sendAwemePostData(payload: unknown, source: string) {
    const p = payload as any
    const videoCount = Array.isArray(p?.videos) ? p.videos.length : 0
    console.log(`[CreatorWorkbench] ${source} sending aweme/post data: videos=${videoCount}`)
    sendToContentScript('DOUYIN_AWEME_POST_DATA', payload, source)
  }

  // ─── URL matchers ────────────────────────────────────────────────

  function isCommentListUrl(url: string): boolean {
    if (!url) return false
    return url.includes('/aweme/v1/web/comment/list') || (url.includes('comment') && url.includes('list'))
  }

  function isSearchItemUrl(url: string): boolean {
    if (!url) return false
    return url.includes('/aweme/v1/web/search/item')
  }

  function isUserProfileUrl(url: string): boolean {
    if (!url) return false
    return url.includes('/aweme/v1/web/user/profile/other')
  }

  function isAwemePostUrl(url: string): boolean {
    if (!url) return false
    return url.includes('/aweme/v1/web/aweme/post')
  }

  // ─── Data extraction functions ───────────────────────────────────

  /**
   * Pick the best available avatar URL from an author object.
   */
  function pickAvatarUrl(author: any): string | null {
    if (!author || typeof author !== 'object') return null
    return (
      author?.avatar_thumb?.url_list?.[0] ||
      author?.avatar_medium?.url_list?.[0] ||
      author?.avatar_168x168?.url_list?.[0] ||
      author?.avatar_300x300?.url_list?.[0] ||
      author?.avatar_larger?.url_list?.[0] ||
      null
    )
  }

  /**
   * Extract video search results from search/item API cards.
   */
  function extractVideosFromSearchItemCards(cards: any[]): any[] {
    const videos: any[] = []
    const seen = new Set<string>()

    ;(cards || []).forEach((card: any) => {
      if (!card || card.type !== 1) return
      const aweme = card.aweme_info
      if (!aweme || typeof aweme !== 'object') return
      const awemeId = aweme.aweme_id
      if (!awemeId || seen.has(awemeId)) return

      const author = aweme.author || {}
      const avatarUrl = pickAvatarUrl(author)
      videos.push({
        aweme_id: awemeId,
        desc: aweme.desc || '',
        create_time: aweme.create_time || null,
        video_url: `https://www.douyin.com/video/${awemeId}`,
        author: {
          uid: author.uid || null,
          sec_uid: author.sec_uid || null,
          nickname: author.nickname || null,
          signature: author.signature || null,
          follower_count: author.follower_count ?? null,
          short_id: author.short_id || null,
          unique_id: author.unique_id || null,
          avatar_thumb: avatarUrl ? { url_list: [avatarUrl] } : null,
          avatar_url: avatarUrl
        }
      })
      seen.add(awemeId)
    })

    return videos
  }

  /**
   * Extract users and comments from comment/list API response.
   */
  function extractUsersAndComments(data: any): { users: any[]; comments: any[] } | null {
    const comments = data?.comments || data?.data?.comments || data?.obj
    if (!comments || !Array.isArray(comments)) return null

    const users: any[] = []
    const commentList: any[] = []

    comments.forEach((comment: any) => {
      const secUid = comment?.user?.sec_uid
      if (secUid) {
        users.push({
          sec_uid: secUid,
          url: `https://www.douyin.com/user/${secUid}`,
          aweme_id: comment.aweme_id || null,
          nickname: comment.user.nickname || null
        })
      }
      if (comment?.cid && secUid) {
        commentList.push({
          cid: comment.cid,
          sec_uid: secUid,
          text: comment.text ?? '',
          aweme_id: comment.aweme_id || null,
          create_time: comment.create_time || null
        })
      }
    })

    return { users, comments: commentList }
  }

  // ─── Response parsers ────────────────────────────────────────────

  function tryParseCommentResponse(responseText: string, source: string): boolean {
    try {
      const response = JSON.parse(responseText)
      const extracted = extractUsersAndComments(response)
      if (extracted && (extracted.users.length > 0 || extracted.comments.length > 0)) {
        console.log(`[CreatorWorkbench] ${source} extracted ${extracted.users.length} users, ${extracted.comments.length} comments`)
        sendCommentData(extracted, source)
        return true
      }
      return false
    } catch (err) {
      console.error(`[CreatorWorkbench] ${source} comment parse failed:`, err)
      return false
    }
  }

  function tryParseSearchItemJson(json: any, source: string, urlString: string): boolean {
    try {
      const cards =
        (Array.isArray(json) && json) ||
        (Array.isArray(json?.data) && json.data) ||
        (Array.isArray(json?.data?.data) && json.data.data) ||
        []

      const videos = extractVideosFromSearchItemCards(cards)
      if (videos.length > 0) {
        let keyword: string | null = null
        let offset: number | null = null
        let count: number | null = null
        try {
          const u = new URL(String(urlString || ''), window.location.origin)
          keyword = u.searchParams.get('keyword')
          const rawOffset = u.searchParams.get('offset')
          const rawCount = u.searchParams.get('count')
          offset = rawOffset != null ? Number(rawOffset) : null
          count = rawCount != null ? Number(rawCount) : null
          if (!Number.isFinite(offset as number)) offset = null
          if (!Number.isFinite(count as number)) count = null
        } catch (_) {
          // ignore URL parse error
        }

        const meta = {
          status_code: json?.status_code ?? null,
          has_more: json?.has_more ?? null,
          cursor: json?.cursor ?? null,
          total: json?.total ?? null,
          extra: json?.extra ?? null,
          keyword: keyword || null,
          offset,
          count
        }

        sendSearchItemData({ url: urlString || null, meta, videos }, source)
        return true
      }
      return false
    } catch (err) {
      console.error(`[CreatorWorkbench] ${source} search/item parse failed:`, err)
      return false
    }
  }

  function tryParseUserProfileJson(json: any, source: string, urlString: string): boolean {
    try {
      const user = json?.user
      if (!user) return false

      const profile = {
        sec_uid: user.sec_uid,
        uid: user.uid,
        nickname: user.nickname,
        signature: user.signature,
        custom_verify: user.custom_verify,
        enterprise_verify_reason: user.enterprise_verify_reason,
        follower_count: user.follower_count,
        following_count: user.following_count,
        mplatform_followers_count: user.mplatform_followers_count,
        aweme_count: user.aweme_count,
        total_favorited: user.total_favorited,
        region: user.region,
        avatar_url: pickAvatarUrl(user),
        unique_id: user.unique_id,
        short_id: user.short_id
      }

      sendProfileData({ url: urlString, profile }, source)
      return true
    } catch (err) {
      console.error(`[CreatorWorkbench] ${source} user profile parse failed:`, err)
      return false
    }
  }

  function tryParseAwemePostJson(json: any, source: string, urlString: string): boolean {
    try {
      const list = json?.aweme_list || []
      if (!Array.isArray(list) || list.length === 0) return false

      const recentVideos = list.slice(0, 20).map((v: any) => ({
        aweme_id: v.aweme_id,
        desc: v.desc,
        create_time: v.create_time,
        region: v.region || null,
        is_top: v.is_top || null,
        duration: v.duration || null,
        aweme_type: v.aweme_type || null,
        text_extra: Array.isArray(v.text_extra) ? v.text_extra.map((t: any) => t.hashtag_name).filter(Boolean) : [],
        video_tag: Array.isArray(v.video_tag) ? v.video_tag.map((t: any) => t.tag_name) : [],
        statistics: {
          digg_count: v.statistics?.digg_count,
          comment_count: v.statistics?.comment_count,
          share_count: v.statistics?.share_count,
          collect_count: v.statistics?.collect_count,
          play_count: v.statistics?.play_count,
          admire_count: v.statistics?.admire_count
        },
        commerce_info: v.commerce_info || v.anchor_info || null
      }))

      sendAwemePostData({ url: urlString, videos: recentVideos }, source)
      return true
    } catch (err) {
      console.error(`[CreatorWorkbench] ${source} aweme/post parse failed:`, err)
      return false
    }
  }

  // ─── Fetch hook ──────────────────────────────────────────────────

  const originalFetch = window.fetch

  window.fetch = function (...args: any[]) {
    const url = args[0]
    const urlString: string = typeof url === 'string'
      ? url
      : (url?.url || String(url?.toString?.() || ''))

    if (isCommentListUrl(urlString)) {
      console.log('[CreatorWorkbench] fetch intercept comment/list:', urlString)
      return originalFetch.apply(this, args).then((response: Response) => {
        const cloned = response.clone()
        cloned.json()
          .then((data: any) => {
            const extracted = extractUsersAndComments(data)
            if (extracted && (extracted.users.length > 0 || extracted.comments.length > 0)) {
              sendCommentData(extracted, 'fetch-comment')
            }
          })
          .catch((err: any) => console.error('[CreatorWorkbench] fetch comment parse failed:', err))
        return response
      })
    }

    if (isSearchItemUrl(urlString)) {
      console.log('[CreatorWorkbench] fetch intercept search/item:', urlString)
      return originalFetch.apply(this, args).then((response: Response) => {
        const cloned = response.clone()
        cloned.json()
          .then((json: any) => tryParseSearchItemJson(json, 'fetch-search-item', urlString))
          .catch((err: any) => console.error('[CreatorWorkbench] fetch search/item parse failed:', err))
        return response
      })
    }

    if (isUserProfileUrl(urlString)) {
      console.log('[CreatorWorkbench] fetch intercept user/profile:', urlString)
      return originalFetch.apply(this, args).then((response: Response) => {
        const cloned = response.clone()
        cloned.json()
          .then((json: any) => tryParseUserProfileJson(json, 'fetch-profile', urlString))
          .catch(() => {})
        return response
      })
    }

    if (isAwemePostUrl(urlString)) {
      console.log('[CreatorWorkbench] fetch intercept aweme/post:', urlString)
      return originalFetch.apply(this, args).then((response: Response) => {
        const cloned = response.clone()
        cloned.json()
          .then((json: any) => tryParseAwemePostJson(json, 'fetch-post', urlString))
          .catch(() => {})
        return response
      })
    }

    return originalFetch.apply(this, args)
  } as typeof window.fetch

  cloakNative(window.fetch, originalFetch)

  // ─── XHR hook ────────────────────────────────────────────────────

  const originalXHROpen = XMLHttpRequest.prototype.open
  const originalXHRSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method: string, url: string, ...rest: any[]) {
    ;(this as any)._cwUrl = url
    return originalXHROpen.apply(this, [method, url, ...rest] as any)
  } as typeof XMLHttpRequest.prototype.open

  cloakNative(XMLHttpRequest.prototype.open, originalXHROpen)

  XMLHttpRequest.prototype.send = function (...args: any[]) {
    const xhr = this as XMLHttpRequest
    const url: string = (xhr as any)._cwUrl || ''

    if (isCommentListUrl(url) || isSearchItemUrl(url) || isUserProfileUrl(url) || isAwemePostUrl(url)) {
      console.log('[CreatorWorkbench] XHR intercept:', url)

      const marker = '__cwListener'
      if (!(xhr as any)[marker]) {
        ;(xhr as any)[marker] = true

        const processResponse = () => {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let responseText: string | null = null
            if (typeof xhr.response === 'string') {
              responseText = xhr.response
            } else if (xhr.response instanceof ArrayBuffer) {
              responseText = new TextDecoder('utf-8').decode(xhr.response)
            } else {
              responseText = xhr.responseText || null
            }

            if (responseText) {
              if (isSearchItemUrl(url)) {
                try {
                  tryParseSearchItemJson(JSON.parse(responseText), 'xhr-search-item', url)
                } catch (e) {
                  console.error('[CreatorWorkbench] XHR search/item parse failed:', e)
                }
              } else if (isUserProfileUrl(url)) {
                try {
                  tryParseUserProfileJson(JSON.parse(responseText), 'xhr-profile', url)
                } catch (e) {
                  console.error('[CreatorWorkbench] XHR profile parse failed:', e)
                }
              } else if (isAwemePostUrl(url)) {
                try {
                  tryParseAwemePostJson(JSON.parse(responseText), 'xhr-post', url)
                } catch (e) {
                  console.error('[CreatorWorkbench] XHR post parse failed:', e)
                }
              } else {
                tryParseCommentResponse(responseText, 'xhr-comment')
              }
            }
          }
        }

        const originalHandler = xhr.onreadystatechange
        xhr.onreadystatechange = function (...onArgs: any[]) {
          processResponse()
          if (typeof originalHandler === 'function') {
            return (originalHandler as any).apply(this, onArgs)
          }
        }
      }
    }

    return originalXHRSend.apply(this, args as any)
  } as typeof XMLHttpRequest.prototype.send

  cloakNative(XMLHttpRequest.prototype.send, originalXHRSend)

  console.log('[CreatorWorkbench] Inject script fully initialized')
})()
