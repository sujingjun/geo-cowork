---
title: Browser Query Task MCP 自动化实施记录
status: implemented
created: 2026-09-03
updated: 2026-09-03
source:
  - docs/prd/2026-09-03-browser-query-task-mcp-automation.md
  - docs/specs/0013-browser-query-task-mcp-automation.md
  - docs/plans/2026-09-03-browser-query-task-mcp-automation-plan.md
  - docs/tasks/2026-09-03-browser-query-task-mcp-automation.md
  - docs/records/2026-09-03-browser-cowork-communication-research-record.md
scope: T01—T08 本地实现、离线测试、真实 Chrome for Testing loopback UI、MCP/Cowork 接收、插件重装；不含真实平台、真实模型、发布或部署
workspace: /Users/sujingjun/geo-cowork
branch: main
baseline: 7da911728c75d4babe30cb09614eadd117169f0b; local main ahead of origin/main by 4; no fetch
---

# Browser Query Task MCP 自动化实施记录

## 1. 结论

Owner 于 2026-09-03 明确批准 PRD、Spec 0013 与 Plan，并授权开始本地实现。本轮完成 Browser Server durable CQI/BQT/Attempt、raw HTML、Fake extraction、pending/ack、Streamable HTTP MCP、Extension 登录接管/checkpoint、Cowork intake/M5 seam 与 Codex 插件注册。

Browser 范围的专项测试、类型检查、定向 lint、数据库迁移、modern/legacy socket smoke、真实 Chrome for Testing Extension + loopback fixture 与 Cowork 可靠接收均已通过。整体状态仍为 `implemented`，不是 `verified`：全仓 `npm test` 有 3 个与本任务无关的过期 Analytics 授权失败，全量 Extension lint 有既有错误，Nuxt build 虽生成完整产物并打印完成，但 PGlite CLI 进程没有自行退出。

## 2. 实际变更

### Browser Server

- 新增 `Cycle Query Input`、Browser Query Task/Attempt、Query Capture/raw artifact、Extraction Result 与 Pending Result 的类型、Zod Schema、稳定 ID/checksum、状态机和 Repository 接口。
- 新增内存 Repository 与 Drizzle Repository；migration `0006_sour_scalphunter.sql` 创建 6 张 `browser_*` 表，task mutation 使用 expected revision，raw/capture/extraction/pending 为 create-only。
- 新增 Fake Extractor 与 provider injection seam；默认无 real extractor 时以 `EXTRACTION_MODEL_FAILED` fail closed。
- 新增 `/api/browser-query/**` 产品 API；Extension 创建和推进 Task，Cowork 不调用内部 mutation。
- 新增 `/mcp`：官方 `@modelcontextprotocol/server@2.0.0`，同一 endpoint 服务 `2026-07-28` modern 与 2025-era legacy stateless。
- MCP 与产品通道分别使用 `GEO_BROWSER_MCP_TOKEN`、`GEO_BROWSER_PRODUCT_TOKEN`；只绑定/接受 loopback Host，校验 bearer、Origin、body size、Tool/Schema。对 Chrome 实际不发送 Origin 的 Extension 请求，仅在 Origin 缺失且 bearer 正确时接受；任何存在但非 `chrome-extension://` 的产品 Origin 仍拒绝。
- 仅为上述独立 bearer 路由关闭 cookie-CSRF；站点其他路由的 `nuxt-csurf` 保持不变。

### Extension Client

- Side Panel 改为列出已注册 CQI、选择 Cycle/Query Set 并创建 Browser-owned Task。
- 每条 Query 打开新标签页；最小 DOM detector 判断登录，未登录进入 `waiting_human`，人工登录后继续同一 attempt。
- `chrome.storage.local` 只保存 task/attempt/tab/stage/before-count checkpoint，不保存 token、cookie、storage、账号 ID 或凭据。
- 自动路径拆成 submit 与 capture 两段；提交后 checkpoint 可只恢复 answer capture，不会再次 submit。`submit_intent` 或 submitted 恢复为 `submission_unknown`，不能作为 Query retry。
- 保存 answer root `outerHTML`、可见文本、Citation occurrence、result URL 与 detector diagnostics；不保存全页 DOM，不用 `innerHTML` 回显。
- extraction failure 只重试同一 raw extraction；只有明确 `system_failure` 能创建新 Query Attempt。

### Cowork 与插件

- 新增 Cowork create-only Browser intake、Cycle/Query Set/Query exact version 校验、raw chunk/SHA-256 闭合、ack input 与 ack 后本地 M5 retry seam。
- synthetic Browser intake 已通过既有 M5 `Answer Sample` 合同物化；Browser Server 不写 Workspace、不创建 Review/Source Classification/Evidence/Claim。
- 新增 `plugins/geo-expert/.mcp.json`，Codex Manifest 以 `mcpServers` 指向该文件；validator 拒绝明文 token、非固定 loopback URL、额外 Server 与未知字段。
- `geo-answer-cycle` 增加 Browser pending 的 list → get → chunks → local intake → ack → M5 顺序与停止条件。
- 按本地 Marketplace 更新流程安装 `geo-expert@geo-cowork` 版本 `0.3.0+codex.20260902182838`；`codex mcp list/get` 识别 `geo-browser` 为 enabled Streamable HTTP，bearer env 为 `GEO_BROWSER_MCP_TOKEN`。

## 3. 红测与真实浏览器修复

1. 新 service/MCP 测试最初因模块不存在而红；实现 CQI、状态机、raw/extraction/pending/ack 后转绿。
2. Drizzle schema/repository 测试最初因 6 张表与 Repository 不存在而红；生成 migration 0006 并通过 PGlite 重启/revision 集成测试。
3. 首次真实 MCP socket 请求被全局 CSRF 返回 403；改为仅精确 bearer 路由豁免后 modern/legacy 均通过。
4. 真实 Extension GET 不发送 Origin；根据实际请求头，改为 bearer + loopback 必须，Origin 若存在则必须为 Extension。
5. Side Panel 首次连接报 `Illegal invocation`；将原生 `fetch` 显式绑定 `globalThis` 并增加 receiver 回归测试。
6. 页面已产生结果但 Capture 未发出；原因是注入函数引用模块闭包。改为 self-contained 注入函数，并测试序列化函数不引用外部 helper。
7. Capture body 多出 runner 内部 `ok` 字段而被 strict Schema 拒绝；发送前移除，并把 capture API failure 按已提交状态处理为 `submission_unknown`。
8. 快速页面加载发生 `tabs.get=loading` 与 `onUpdated` 事件错过竞态；改为事件 + 50ms 状态复查，测试覆盖前两次旧状态、第三次 `complete`。
9. pending 已创建但 task revision 尚未提交时，恢复曾会再次调用 Extractor；故障注入后改为复用既有 completed extraction/pending，只补齐 task 状态。
10. 第一条 Query 为 `waiting_human` 时产品 API 仍可 claim 第二条；改为 Task 仅在 `pending` 时允许 claim，保持单 active attempt。
11. task/pending cursor 曾只比较 ID；改为按 Spec 的 `(created_at UTF-8, id UTF-8)` tuple 编解码和分页。
12. Capture 曾只校验 result URL origin；现在冻结既有 adapter `result_url_origins`，允许 Gemini/Google AI 已批准的共享 origin，同时拒绝不同 formal attempt 复用同一 result URL。

## 4. 实际验证

| 检查 | 实际结果 |
| --- | --- |
| 开工基线 `node --test tests/browser-query-task.test.mjs` | 10/10 通过 |
| 开工基线 Extension test | 4/4 通过 |
| `pnpm test:browser-query` | 8 files / 23 tests 通过 |
| `npm run test:extension` | 6/6 通过 |
| Browser 相关根测试 | 16/16 通过 |
| `pnpm typecheck` | 通过 |
| Browser 变更文件定向 ESLint | 通过，0 error / 0 warning |
| `pnpm build:extension` | 通过，MV3 产物包含 checkpoint/error policy/client/runner/Side Panel |
| DB migration/readback | 6 张 `browser_*` 表存在；PGlite Repository restart/revision test 通过 |
| live MCP smoke | modern task `BQT-6B3428DA29CD7C247CF79F613733BD34` / result `BQR-A3BE8239FA2E08363149B64BB10A4648` 通过；legacy task `BQT-8B2F02DB5C2B26E6C377187E43051B20` / result `BQR-3393D648F5FEEFB51EDB4F07D9EDFC46` 通过 |
| 真实 Chrome for Testing Extension UI | `BQT-CC91F651761EB361BAA00AE4A0E52AE7`：logged-out → waiting_human → 人工 fixture login → 同 attempt submit/capture → completed |
| UI 产物 | `BQR-35D8373CC2E417DDEF38159C5385CFD5`；raw 178 bytes，SHA-256 `e109710b135498fafce0e70f36aad94b2e1e469578b45521e28e0593205d4c2e`，1 Citation，extraction completed |
| Cowork live intake | 上述 UI result 写入临时 Workspace 的 answer/result/manifest，checksum 复核后 ack `acknowledged`；临时目录随后删除 |
| Codex 插件 | 两套 validator 通过；本地 Marketplace 重装；`codex mcp get geo-browser` 显示 enabled/streamable_http/正确 URL 与 bearer env |
| `npm run check:docs` | 137 files / 205 links / 0 errors |
| MyyShop validate/index | 336 canonical objects、120 legacy；0 error/warning；index check `written: []` |
| `git status --porcelain workspaces/myyshop` | 空；真实 MyyShop Workspace 无写入 |
| `git diff --check` | 通过 |

## 5. 未通过的全仓门

### 全仓测试

`npm test` 实际执行 353 tests：350 pass、3 fail。失败均在 `tests/analytics-readonly-cli.test.mjs`，当前真实只读授权已过期，返回 `READONLY_AUTHORIZATION_REQUIRED`，而测试仍期待 dry-run 或其他前置错误。Browser 代码没有修改 Analytics 文件或授权；本轮未延长授权、未改测试顺序、未调用 GA4/GSC。

### 全量 lint

`pnpm lint` 返回 8 errors / 57 warnings，均在本轮未修改的 `seed-products.mjs`、`server/api/db/seed.post.ts`、`server/utils/ai-providers.ts` 及既有 console warning。Browser 变更文件的定向 lint 为 0。

### Nuxt build 进程退出

`CI=1 pnpm build` 完成 client、server、Nitro、migration packaging，生成 `/mcp`、Browser API route 与 migration 0006，并打印 `✨ Build complete!`；但本地 PGlite 相关 CLI 句柄没有自行退出，等待后人工 `Ctrl-C`，因此不能记录为 exit 0。生成的 Server 随后实际启动并通过 modern/legacy socket smoke。

## 6. 未验证与授权边界

- 未在用户日常 Chrome Profile 通过“加载已解压扩展程序”复验；真实浏览器证据来自本机 Chrome for Testing 151。branded Chrome 152 的命令行 Extension 加载仍不可用。
- 未访问 ChatGPT、Gemini、Perplexity、Google AI、Claude 页面；五个平台保持 `manual_only`，无 adapter 被提升为 `allowed`。
- 未读取 cookie、local/session storage、邮箱、账号 ID 或凭据。
- 未调用真实或付费模型；只使用 deterministic Fake Extractor。
- 未执行真实品牌 Browser Cycle、Baseline/Retest、Review、100 Source 分类、Publication、业务效果或生产验证。
- 未 commit、push、创建 PR、merge、部署、发布或上架 Chrome Web Store。

## 7. 下一步

1. 若要把 Task 提升为 `verified`，先由独立任务处理或重新授权 Analytics 过期测试，并修复 Nuxt/PGlite CLI 退出；不得在本任务里静默延长真实数据授权。
2. 在新的 Codex thread 中加载已重装插件，使用用户本地设置的 `GEO_BROWSER_MCP_TOKEN` 复核 Tool 可见性；当前 thread 不动态加载新插件内容。
3. 真实平台仍需逐平台独立授权、精确 host permission、adapter 变更与真实 UI Record；不能从本次 loopback fixture 推断。
