import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const manifest = JSON.parse(readFileSync('manifest.json', 'utf-8'))

test('Chrome 工具栏弹窗直接打开画像分析路由', () => {
  assert.equal(manifest.action.default_popup, 'popup.html')
  assert.match(readFileSync('public/popup.html', 'utf-8'), /popup\.js/)
  const popupScript = readFileSync('public/popup.js', 'utf-8')
  assert.match(popupScript, /GET_LAST_ANALYSIS/)
  assert.match(popupScript, /ANALYZE_PAGE/)
  assert.match(popupScript, /GET_PAGE_CREATOR_LIST/)
})

test('Chrome 工具栏弹窗使用稳定外框并让分析结果内部滚动', () => {
  const popupStyles = readFileSync('public/popup.css', 'utf-8')

  assert.match(popupStyles, /html,\s*body\s*{[^}]*inline-size:\s*400px;[^}]*block-size:\s*560px;/s)
  assert.match(popupStyles, /main\s*{[^}]*grid-template-rows:\s*auto auto minmax\(0, 1fr\) auto auto;/s)
  assert.match(popupStyles, /#creator-list\s*{[^}]*overflow-y:\s*auto;/s)
})

test('TikTok 页面同时加载被动发现内容脚本和主世界响应观察脚本', () => {
  const tiktokScripts = manifest.content_scripts.filter((entry: { matches: string[] }) =>
    entry.matches.includes('https://www.tiktok.com/*')
  )

  assert.deepEqual(tiktokScripts, [
    {
      matches: ['https://www.tiktok.com/*'],
      js: ['content.js'],
      run_at: 'document_idle'
    },
    {
      matches: ['https://www.tiktok.com/*'],
      js: ['tiktok-inject.js'],
      run_at: 'document_start',
      world: 'MAIN'
    }
  ])

  assert.match(readFileSync('extension/content.ts', 'utf-8'), /initTikTokPassiveDiscovery\(\)/)
  assert.match(readFileSync('scripts/build-extension.ts', 'utf-8'), /tiktok-inject\.ts[^\n]+tiktok-inject\.js/)
})

test('工具栏弹窗展示最近 TikTok 页面发现摘要', () => {
  const popupHtml = readFileSync('public/popup.html', 'utf-8')
  const popupScript = readFileSync('public/popup.js', 'utf-8')

  assert.match(popupHtml, /id="discovery-summary"/)
  assert.match(popupHtml, /id="discovered-count"/)
  assert.match(popupHtml, /id="updated-count"/)
  assert.match(popupHtml, /id="pending-comment-count"/)
  assert.match(popupScript, /pageResult\.summary/)
})

test('工具栏弹窗只展示当前活动页面发现的达人卡片', () => {
  const popupHtml = readFileSync('public/popup.html', 'utf-8')
  const popupScript = readFileSync('public/popup.js', 'utf-8')

  assert.match(popupHtml, /id="creator-list"/)
  assert.match(popupScript, /chrome\.tabs\.query\(\{ active:\s*true, currentWindow:\s*true \}\)/)
  assert.match(popupScript, /GET_PAGE_CREATOR_LIST/)
  assert.doesNotMatch(popupScript, /GET_CREATOR_LIST/)
  assert.match(popupScript, /打开主页/)
  assert.match(popupScript, /DELETE_CREATOR/)
  assert.match(popupScript, /confirm\(/)
})
