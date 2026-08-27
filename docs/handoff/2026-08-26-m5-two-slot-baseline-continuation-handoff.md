---
title: M5 两槽英文 Baseline 继续执行交接
status: verified
created: 2026-08-26
source:
  - docs/records/2026-08-26-m5-two-slot-english-baseline-slot1-record.md
  - docs/records/2026-08-26-m5-two-slot-english-baseline-record.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
scope: 五平台第 2 槽、两槽 Review/Aggregation、100 Source 分类门与 M5 收口
---

# M5 两槽英文 Baseline 继续执行交接

> 执行结果：本 Handoff 要求的五平台第 2 槽、candidate Review 与逐平台 Aggregation 已于 2026-08-26 完成。以下“下一次输入”保留为已执行历史；当前出口改为 10 个 Review 人工确认、40/100 Source 继续归档及后续 M3/M4 门。

## 当前状态

- 五个平台两个正式英文 Sample 均已完成；所有 Run 为 `completed`，完成 2/2。
- 统一 Query：`Q-MYYSHOP-WHAT-IS-EN-BASELINE-001` / `What is MyyShop?`。
- 统一 Query Set：`QS-MYYSHOP-DEFINITION-EN-BASELINE-001`。
- 当前 Source 进度：40/100，剩余 60；当前有效 Classification 为 0，27 个旧 candidate 已 superseded。
- 当前有 10 个 candidate Answer Review 与 5 个 computed Aggregation；comparability 全部 partial。

## 下一次输入（已执行历史）

Owner 为每个平台分别使用全新会话，人工提交完全相同的英文 Query，并提供第 2 个 exact result URL：

```text
ChatGPT result URL
Gemini result URL
Google AI result URL
Perplexity result URL
Claude result URL
```

当前冻结 time window 截止 `2026-08-31T23:59:59+08:00`。若第 2 槽晚于该时间，必须创建新 Profile/Run，不得修改现有 Profile 或硬塞入旧窗口。

不得复制第 1 槽，不得把重试成功替换拒答/超时/无结果，也不得由 Agent 自动提交 Query。若某平台失败，提供失败终态和可安全保存的最小日志；失败本身就是 ordinal 2 的观察。

## 第 2 槽执行顺序（已执行历史）

1. 复制本轮 intake manifest 为 slot 2，保持同一 Query、Query Set、Profile、`profile_frozen_at`、time window 和语义合同，只更新 ordinal、Sample ID、captured_at、result URL、完整回答与 Citation。
2. 运行 `answer-cycle.mjs collect-manual-batch`；五个 Run 应从 `waiting_human` 转为 `completed`，每个 selected slot 为 2/2。
3. 运行 `review-manual-batch`，按同一 rubric `2.0.0` 创建第 2 槽 candidate Review。
4. 在 Source 未达 100 前，Aggregation 只允许计算不依赖分类的结果；Source Type、party relation 与 Claim Support 保持 deferred/null，不得提前补分类。
5. 逐平台创建两槽 Baseline Aggregation 与整体 M5 Record；只有五个平台 2/2 且验证通过，M5 Task 才可评审是否由 `implemented` 提升为 `verified`。

## 独立后续门

- Source 达 100：新建批量 Classification + Claim Support Task，不能在采集任务中顺手分类。
- 中文采样：可选；需绑定同一 `object_key/semantic_contract_ref`，与英文分别聚合。
- 最新业务知识库：单独回到 M3 Knowledge 流程更新 Document/Claim/Answer Card/KR，不由 M5 Observation 自动批准。
- 内容优化：基于两槽 Baseline 与知识库缺口进入 M4 Gap/Proposal/Adoption/Publication；当前平台回答“不准确”只是问题证据，不是已发布修复。
- M6：等待 M5 Baseline、M4 Publication/Technical Retest 与 Analytics 授权，不在本 Handoff 自动开始。

## 停止条件

- Query 文本、语言、对象语义、Profile 或 time window 改变；
- 页面需要验证码、登录恢复、账号设置或敏感信息无法隔离；
- 结果 URL 不是 Owner 明确提供；
- 想用 API、搜索摘要或旧 Sample 补第 2 槽；
- 想在 100 Source 前创建当前有效 Classification；
- 需要 commit、push、PR、外部发布、部署或删除历史而无当次授权。
