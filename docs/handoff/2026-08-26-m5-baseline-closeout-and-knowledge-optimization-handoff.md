---
title: M5 Baseline 收口与知识优化交接
status: proposed
created: 2026-08-26
source:
  - docs/records/2026-08-26-m5-two-slot-english-baseline-record.md
  - workspaces/myyshop/STATUS.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md
scope: Answer Review 人工确认、40/100 Source、M3 知识更新、M4 优化与 post-change Retest 前置
---

# M5 Baseline 收口与知识优化交接

## 已完成基线

- 五个平台正式英文 Baseline：2/2；Run 全部 completed。
- 10 个 candidate Answer Review；Gemini 两槽定位 fail，其余平台两槽 partial。
- 5 个 computed Aggregation；comparability 全部 partial。
- 133 个 Citation Observation，40/100 个唯一 Source；当前有效 Classification/Claim Support 为 0。
- 自动采集仍 blocked；本轮只验证 Owner exact result URL 的 manual 路径。

## 下一顺序

1. Owner 审阅 10 个 candidate Answer Review，确认或修改 `current_positioning/risk_boundary`；未确认前不把 Agent 评语当业务批准。
2. 把 Owner 当前定位作为输入回到 M3：建立最新 Document、原子 Claim、Answer Card 与 Knowledge Release 新版本；解决或保留两条 Evidence warning。
3. 继续通过后续获授权真实 Citation 累积 Source；达到 100 后新建批量 Classification + Claim Support Task。不得为了当前 Baseline 补齐指标而提前分类。
4. 用人工确认的 Baseline + 新 Knowledge Release 进入 M4 Content/Evidence Gap；形成 Proposal，由 Owner 决定 Adoption。
5. 只有外部 Publication confirmed 后执行 Technical Retest 与 M5 post-change Retest；Baseline 不能冒充 Retest。
6. M6 Analytics + Real GEO Cycle 1 继续等待 Analytics 只读授权与上述 Publication/Retest 链。

## 当前不成立的结论

- 平台回答已准确；
- MyyShop 最新知识库已完成；
- 40 个 Source 已分类或支持 Claim；
- 内容优化已经发布；
- GEO、流量、注册或业务结果已改善；
- 插件已 release/deploy。

## 授权边界

不自动修改或发布官网内容，不访问 GA4/GSC，不自动提交消费者平台 Query，不 commit/push/PR。任何 Source 扩展仍只能来自获授权真实 Citation Observation，不能导入外部榜单或静态域名清单。
