---
title: GEO Browser Assistant Chrome 基建最小切片验收记录
status: verified
created: 2026-09-02
source:
  - plugins/geo-browser-extension/CONTEXT.md
  - docs/workflow.md
  - "2026-09-02 当前用户指令：GEO Browser Assistant 采用薄客户端与 Side Panel；站点能力保持 SSR；最小切片只展示活动标签页标题与 URL"
  - "2026-09-02 当前用户指令：禁用 TDD skill，移除该执行前提后继续任务"
scope: Chrome Manifest V3、Side Panel、Service Worker、活动页标题与 URL、扩展构建及本地验证
---

# GEO Browser Assistant Chrome 基建最小切片验收记录

## 1. 结论

Chrome 基建最小切片已在本 Record 范围验证：扩展工具栏入口配置为打开 Side Panel，面板经 Service Worker 查询当前活动标签页，并展示标题与 URL。站点继续保持 Nuxt SSR；本轮没有把 AI、鉴权、数据或站点生成打包进扩展。

本结论不表示生成式平台 Query 测试已经实现，不授权真实平台访问，也不表示扩展已发布到 Chrome Web Store。

## 2. 工作区与基线

- checkout：`/Users/sujingjun/.codex/worktrees/geo-browser-extension-bootstrap/geo-cowork`
- branch：`codex/geo-browser-extension-bootstrap`
- 开工 HEAD：`0ac8839097f40f88ffd0b074e72bbd731055daa7`
- 插件：`plugins/geo-browser-extension`
- 开工状态：clean

## 3. 已确认边界

- `GEO Browser Assistant` 是浏览器薄客户端。
- `GEO Site Service` 保持 SSR，并拥有 AI、鉴权、数据和站点生成能力。
- `Assistant Panel` 使用 Chrome Side Panel，不使用 Popup 承载持续流程。
- 最小切片只读取 `Active Page Context` 的标题与 URL。
- 不读取正文或 DOM；不增加 content script、`host_permissions`、服务端调用或平台适配。

## 4. 实际变更

- 新增 Manifest V3、模块化 Service Worker 与 Side Panel 静态页面。
- 新增 `tabs`、`sidePanel` 两项权限；未声明 `host_permissions`。
- 工具栏 action 通过 `openPanelOnActionClick` 唤起 Side Panel。
- 新增独立扩展构建脚本，输出到 `.output/extension`，不改变 Nuxt SSR 构建入口。
- 新增扩展契约/消息链验收测试、使用说明与领域词汇表。

## 5. 实际验证

| 检查 | 结果 |
| --- | --- |
| `pnpm build:extension` | 通过；生成 8 个扩展文件 |
| `pnpm exec vitest run tests/extension/bootstrap.test.ts` | 1/1 通过 |
| `pnpm exec vitest run` | 10 个文件、35/35 通过 |
| `pnpm exec eslint extension scripts/build-extension.mjs tests/extension/bootstrap.test.ts` | 通过 |
| `pnpm typecheck` | 通过；保留既有 localhost site URL warning |
| 隔离临时 Chrome + `--load-extension` | 通过；发现 `chrome-extension://.../service-worker.js` target |
| Manifest 权限检查 | `sidePanel`、`tabs`；无 `host_permissions`、content script、Popup |
| `npm run check:docs` | 114 个 Markdown、185 个本地链接、0 errors |
| `git diff --check` | 通过 |

全仓 `pnpm lint` 未通过：现有未修改的 seed 与 AI provider 文件共有 8 个 error、57 个 warning；本次修改文件的定向 lint 已通过，本轮没有清理这些范围外问题。

## 6. 未验证与授权边界

- 未在用户日常 Chrome Profile 中执行工具栏点击与可视化 Side Panel 验收；真实 Chrome 已仅用隔离临时 Profile 验证扩展和 Service Worker 可加载。
- 未读取或保存页面正文、DOM、账号状态、cookie、storage 或凭据。
- 未连接 GEO Site Service，未调用 AI、数据库、OAuth、外部 API 或生成式平台。
- 未执行 commit、push、PR、release、deploy 或 Chrome Web Store 发布。
- 后续 Query 测试切片必须继续保留人工操作、平台授权、Sample/Citation 证据与自动化许可之间的边界。
