---
name: geo-answer-cycle
description: 编排 M5 Consumer Answer Testing 的 Profile、Browser MCP 结果接收、两次独立样本、Citation-driven Source 归档、100 Source 批量分类、Review 与聚合；真实消费者平台仅在逐平台授权门通过后使用。
---

# geo-answer-cycle

## 真实工程采集（Spec 0014）

`geo-playwright.mjs collect-playwright --platform <chatgpt|gemini|perplexity> --output <run-dir>` 与 `resume-collection` 通过固定 Playwright MCP 0.0.81 连接浏览器。先保存提交意图，三个指定平台各一次、全局串行至少 120 秒；未知提交不重发。raw → 真实 DeepSeek 提取 → 带 checksum 的本地接收；模型失败不重做 Query。

该入口使用独立工程验证 Run，不要求先创建正式真实 Cycle，也不计为双槽 Baseline。已经完成的 Run 续跑必须幂等。Browser Extractor 不再提供 Fake 成功路径。OpenAI-compatible 当前只验证配置和切换，真实访问由公司网络条件决定。

## 触发场景

- 用脱敏录制 Fixture 验证 M5 Answer Testing 全链；
- 在已有逐平台授权时准备消费者 UI Baseline 或 Publication 后 Retest。
- 接收 Browser Server 已完成并置入 pending queue 的 Query Capture 与 Extraction Result。

## 输入

工作区、批准的 Spec 0006、formal Query/frozen Query Set/published-ready Knowledge Release 精确版本、frozen Collector Profile、采样目的和授权决定。Browser 路径还需要批准的 Spec 0013、active GEO Cycle 及其 frozen input snapshot。离线验收只接受 `.invalid` 与工作区内录制文件。

## 开工前必读

读取 Spec 0006、当前 M5 Plan/Task/Record 和目标工作区状态；使用 Browser 路径时同时读取 Spec 0013。先运行 `answer-cycle.mjs validate`，再核对 Profile fingerprint、授权范围、两个 slot、英文主线/中文辅助语义合同和未通过的依赖门。

## 步骤

1. 使用 `answer-cycle.mjs plan` 冻结平台、Query、Profile、时间窗和两个 ordinal。
2. 离线任务调用 `collect-fixture`；Owner exact result URL 批次调用 `collect-manual-batch`，不得由 Agent 提交平台 Query。
3. Browser 路径先用 `register_cycle_query_input` 注册 active Cycle 的精确 frozen 输入；Browser Query Task 由用户在扩展创建和推进，Cowork 不调用内部 task mutation API。
4. 结果严格按 `list_pending_query_results` → `get_query_result` → `get_query_result_artifact` 分块读取 → 本地 create-only intake 与 SHA-256 闭合 → `acknowledge_query_result`。版本或 bytes 冲突时不 ack；ack 后的 M5 失败只从本地 intake 重试，可用 `browser-query-result.mjs verify` 复核。
5. manual/Browser 路径只归档 Source；达到 100 个唯一 Source 后另启批量 Classification/Claim Support Task。调用 `review-manual-batch` 物化 Answer Review。
6. 两个 slot 完整后调用 `aggregate-manual-batch`；分类阈值前 Source Type、party relation 与 Claim Support 保持 partial/unknown。
7. 记录 Run、失败状态、warning、实际验证和未授权边界。

## 输出

Profile、Run、不可变 Sample/raw、Citation/Source 归档、分类队列进度、Answer Review、Aggregation 引用，以及当前门禁和下一动作。

## 可做事项

- 运行已批准的本地 Fixture、确定性校验和聚合；
- 读取并确认 Browser Server 的 pending result；ack 只表示 raw/extraction 已可靠接收；
- 保留 refusal、timeout、no result、challenge、cancelled 与 system failure；
- 在真实平台前请求逐平台授权和隐私决定。

## 禁止事项

- 不以 API、搜索摘要、单次回答或外部榜单替代正式消费者 UI 样本；
- 不在 100 个唯一 Source 前创建当前有效 Classification 或 Claim Support；
- 不自动安装 Playwright、下载浏览器、登录账号或扩大入口 allowlist；
- 不让 Browser Server 创建 Answer Sample、Review、Source 分类、Evidence 或业务结论，也不把 ack 当成批准；
- 不把 M5 Observation 当 Claim Evidence、M6 业务效果或因果结论。

## 失败与停止条件

Profile/版本漂移、授权缺字段、unknown 提交状态、selector drift、challenge、隐私无法最小化、Browser raw/extraction checksum 不闭合、依赖门未通过或 Citation/Source 闭包冲突时停止受影响平台并保留已写 artifact。

## 验收方式

`npm run test:m5-answer`、`answer-cycle.mjs validate` 和全量回归通过；raw 与旧 Review 字节不变；两个 slot、失败状态、Source 归档/100 条分类门、分析链和指标均可追溯。

## 示例

```bash
node <plugin-root>/scripts/answer-cycle.mjs collect-fixture --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/answer-cycle.mjs aggregate --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/browser-query-result.mjs verify --workspace <workspace> --manifest <workspace-relative-manifest.json>
```
