---
name: geo-answer-cycle
description: 编排 M5 Consumer Answer Testing 的 Profile、三次录制样本、Citation-driven Source、Review 与聚合；真实消费者平台仅在逐平台授权和 Playwright 门通过后使用。
---

# geo-answer-cycle

## 触发场景

- 用脱敏录制 Fixture 验证 M5 Answer Testing 全链；
- 在已有逐平台授权时准备消费者 UI Baseline 或 Publication 后 Retest。

## 输入

工作区、批准的 Spec 0006、formal Query/frozen Query Set/published-ready Knowledge Release 精确版本、frozen Collector Profile、采样目的和授权决定。离线验收只接受 `.invalid` 与工作区内录制文件。

## 开工前必读

读取 Spec 0006、当前 M5 Plan/Task/Record 和目标工作区状态。先运行 `answer-cycle.mjs validate`，再核对 Profile fingerprint、授权范围、三个 slot 和未通过的依赖门。

## 步骤

1. 使用 `answer-cycle.mjs plan` 冻结平台、Query、Profile、时间窗和三个 ordinal。
2. 离线任务调用 `collect-fixture`；不得启动浏览器或联网。
3. 调用 `review` 物化 Source Classification、Claim Support 与 Answer Review。
4. 调用 `aggregate` 计算 Spec 0006 五项指标和 comparability。
5. 记录 Run、失败状态、warning、实际验证和未授权边界。

## 输出

Profile、Run、不可变 Sample/raw、Citation/Source、Classification、Claim Support、Answer Review、Aggregation 引用，以及当前门禁和下一动作。

## 可做事项

- 运行已批准的本地 Fixture、确定性校验和聚合；
- 保留 refusal、timeout、no result、challenge、cancelled 与 system failure；
- 在真实平台前请求逐平台授权和隐私决定。

## 禁止事项

- 不以 API、搜索摘要、单次回答或外部榜单替代正式消费者 UI 样本；
- 不自动安装 Playwright、下载浏览器、登录账号或扩大入口 allowlist；
- 不把 M5 Observation 当 Claim Evidence、M6 业务效果或因果结论。

## 失败与停止条件

Profile/版本漂移、授权缺字段、unknown 提交状态、selector drift、challenge、隐私无法最小化、依赖门未通过或 Citation/Source 闭包冲突时停止受影响平台并保留已写 artifact。

## 验收方式

`npm run test:m5-answer`、`answer-cycle.mjs validate` 和全量回归通过；raw 与旧 Review 字节不变；三个 slot、失败状态、分析链和指标均可追溯。

## 示例

```bash
node <plugin-root>/scripts/answer-cycle.mjs collect-fixture --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/answer-cycle.mjs aggregate --workspace <workspace> --plan <plan.json>
```
