---
title: GEO Browser Assistant Query 测试最小业务切片记录
status: implemented
created: 2026-09-02
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/records/2026-09-02-geo-browser-assistant-bootstrap-record.md
  - "2026-09-02 当前用户指令：获取 Cycle 的 Query 测试集合，逐条提交并采集完整回答与引用，回写项目，记录状态与失败原因并支持重启"
scope: Chrome Side Panel、loopback Query Task Service、frozen Query Set、逐条 attempt、raw capture、失败与恢复、平台自动化许可门
workspace: /Users/sujingjun/.codex/worktrees/geo-browser-extension-bootstrap/geo-cowork
branch: codex/geo-browser-extension-bootstrap
baseline: 0ac8839097f40f88ffd0b074e72bbd731055daa7
---

# GEO Browser Assistant Query 测试最小业务切片记录

## 1. 结论

本轮完成一个可运行的纵向最小切片：本地任务服务从显式品牌工作区读取精确版本的 frozen Query Set，Chrome Side Panel 逐条启动 Query；成功 attempt 保存完整回答、逐次 Citation raw、结果 URL、capture manifest 与 SHA-256，失败 attempt 保存 collector log；任务服务重启后从工作区恢复状态，失败 Query 可保留历史后重新启动。

状态为 `implemented`，不是 `verified`：自动化链路已经在真实 Chromium DOM + loopback fixture 上跑通，但更新后的扩展没有安装到用户 Chrome Profile，也没有访问任何真实消费者平台。

## 2. 成功标准与结果

| 成功标准 | 结果 |
| --- | --- |
| 从 Cycle frozen snapshot 绑定的 Query Set 获取全部 Query 文本与精确版本 | 已实现；Cycle、CIS、entry key、Query Set/Query 逐层核验 |
| 逐条 Query，单任务不并发运行多条 | 已实现；HTTP mutation 串行化，并发 start 一次成功、一次 `409` |
| 获许可平台自动输入、提交、等待回答稳定、提取完整回答与 Citation | 已实现；仅 `automation.status=allowed` 可进入，fixture runtime 通过 |
| 现有消费者平台支持人工登录后的 Query 测试 | 已实现 `manual_assist`；复制 Query、打开平台、人工提交并提供完整结果 |
| 按项目边界回写回答、Citation、结果 URL 与 checksum | 已实现；写入 `runs/<task>/browser-query-attempts/` 的 create-only artifact |
| 更新 Query 执行状态与任务状态 | 已实现；不改写 canonical Query 文件 |
| 失败记录原因并支持重启 | 已实现；仅 `system_failure` 可重试，其他平台终态不可被成功覆盖 |
| 服务进程重启恢复 | 已实现；`running` 恢复为 `waiting_human`，完整半成品可按 outcome journal 收敛 |

## 3. 实际变更

- 新增 `plugins/geo-expert/scripts/browser-query-task.mjs` loopback HTTP 服务；只接受临时 Bearer token 与 Chrome extension origin。
- 新增 contract、state/lease、attempt artifact 与状态机模块；真实授权锁定结构化决定 SHA-256，跨进程写入使用持久 lease/revision。
- 扩展新增 Query Task client、获许可 DOM runner、manual assist 表单、任务进度、失败与重试交互。
- 扩展权限增加 `clipboardWrite`、`scripting` 与 `http://127.0.0.1/*` loopback host permission；真实平台 origin 不预授权，仍须 adapter policy 与后续精确 manifest permission 同时满足。
- 新增无网络、无真实账号的生成式平台 fixture 与示例 task plan。
- 保留参考工程既有 Nuxt SSR、AI、鉴权、数据库与部署依赖，只增加独立的 extension 构建、fixture 与测试脚本。

## 4. 实际验证

| 命令或检查 | 结果 |
| --- | --- |
| `node --test tests/browser-query-task.test.mjs` | 10/10 通过 |
| `npm --prefix plugins/geo-browser-extension run test:extension` | 4/4 通过 |
| `npm --prefix plugins/geo-browser-extension run build:extension` | 通过；生成 MV3 extension |
| 相关 `.mjs/.js` 的 `node --check` | 通过 |
| 扩展变更文件定向 ESLint | 通过；0 error / 0 warning |
| `npm --prefix plugins/geo-browser-extension run typecheck` | 通过；保留既有 localhost site URL warning |
| `git diff --check` | 通过 |
| 真实 Chromium DOM fixture + `performPlatformQuery` | 通过；输入 Query、提交、等待稳定、取得完整回答/1 条 Citation/结果 URL |
| fixture capture → loopback `/api/task/complete` | 通过；Cycle/CIS/Query Set binding、revision 2、success outcome、answer/Citation/collector log 与 capture/outcome 均闭合 |
| branded Chrome 152 `--load-extension` | 未加载；Chrome M137 起 branded build 已移除该命令行加载路径 |
| 根 `npm test` | 331/334 通过；3 项既有 GA4/GSC 测试因授权快照到期失败；本切片测试全部通过 |

首次测试未进入业务逻辑，因为独立 worktree 缺少根依赖 `gray-matter`；使用根 `package.json` 本地补齐依赖且未改锁文件后通过。首次 fixture 测试还修正了测试对象的真实 Query 路径与大小写预期。

## 5. 状态机与恢复边界

```text
pending → running → completed
             ├──→ waiting_human → completed / typed terminal
             ├──→ failed(system_failure) → pending（retry）→ running
             └──→ blocked(challenge)
```

- 只有 `pending` 可开始，只有 active attempt 可结束，只有 `system_failure` 对应的 `failed` 可重试。
- 每个 attempt 先 create-only 冻结只含路径/checksum/result URL 的 outcome materialization plan，再补齐 answer、Citation、collector log 与 capture；outcome 不复制回答正文，同一路径重复完成只接受相同 payload fingerprint。
- task state 是可变控制面，canonical Query 和 Query Set 只读。
- 同一 loopback 进程内 mutation 串行；多个服务进程由持久 lease 拒绝并发写，stale lease 留存 history 后才能接管。

## 6. 授权与未验证边界

- ChatGPT、Perplexity、Google AI、Claude 当前仍为 `terms_blocked`，Gemini 为 `manual_only`；已登录不能解除该门。
- 未在真实平台执行 Query、自动提取 Output 或写入账号；没有读取 cookie、local/session storage、邮箱或其他账号标识。
- 未在用户 Chrome Profile 安装或可视化验收更新后的 Side Panel；加载已解压扩展属于单独人工/UI 门。
- 本切片保存 M5 raw capture 输入，不自动物化 Answer Sample、Source、Review、Aggregation、Evidence、Claim 或业务结论。
- 未发布到 Chrome Web Store，未部署 loopback 服务，也未推送远端。
