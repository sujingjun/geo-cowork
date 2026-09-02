import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { executePopupWorkbenchClick } from './popup-script-harness'
import { observeConfiguredRoute } from './router-harness'
import { routerCases } from './router-cases'

test('工具栏弹窗点击打开工作台时创建规范扩展标签页', async () => {
  const popupScript = readFileSync('public/popup.js', 'utf-8')

  assert.deepEqual(await executePopupWorkbenchClick(popupScript), [{
    url: 'chrome-extension://example/index.html#/workbench'
  }])
})

test('扩展构建通过真实 Vue Router 初始化三个哈希入口', async (context) => {
  for (const { route } of routerCases) {
    await context.test(route, async () => {
      const expectedUrl = `chrome-extension://example/index.html#${route}`

      assert.equal(await observeConfiguredRoute(expectedUrl, true), expectedUrl)
    })
  }
})

test('普通 Web 构建通过真实 Vue Router 保持无哈希入口', async (context) => {
  for (const { route } of routerCases) {
    await context.test(route, async () => {
      const expectedUrl = `http://localhost:3000${route}`

      assert.equal(await observeConfiguredRoute(expectedUrl, false), expectedUrl)
    })
  }
})
