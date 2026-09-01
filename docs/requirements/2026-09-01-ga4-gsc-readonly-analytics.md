---
title: GA4/GSC 真实只读分析接入需求
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-09-01 当前用户明确指令：完成 GA4/GSC 基建，执行真实读取冒烟测试
scope: MyyShop GA4/GSC 真实只读连接基建与最小聚合冒烟；不含完整业务分析、Evidence 批准或外部写入
---

# GA4/GSC 真实只读分析接入需求

## 1. 问题

现有 M6 只验证 `synthetic/test_only` fixture，真实 GA4/GSC adapter 仍只有 seam 和配置占位。需要在不放宽原 fixture 安全门的前提下，建立独立真实只读入口，并证明目标 Property 的认证、权限、请求与响应归一化可运行。

## 2. 本次目标

1. 提供 GA4 Data API 与 GSC Search Analytics API 的只读 adapter。
2. 使用用户控制的 OAuth/ADC；凭据、Token、Cookie、账号标识不进入仓库、计划或日志。
3. 用一个固定短时间窗完成低维度聚合冒烟读取。
4. 产出可供后续分析消费的统一、非因果 JSON；本次不写真实 `analytics_observation`、Evidence 或 Claim。
5. 保持现有 `geo-analytics` fixture CLI、M6 测试与真实 MyyShop canonical 对象字节不变。

## 3. 获授权资源与范围

- GA4 Property：`356373250`。
- GSC Property：`https://www.myyshop.com/` URL-prefix Property。
- 时间窗：`2026-08-23` 至 `2026-08-29`，均为完整日期。
- GA4：`date`；`sessions`、`activeUsers`、`screenPageViews`。
- GSC：`date`；`clicks`、`impressions`、`ctr`、`position`；`type:web`、`dataState:final`、property 聚合。
- 只允许 `analytics.readonly` 与 `webmasters.readonly`。

## 4. 成功标准

- 红测先证明缺少实现、越权 scope、任意 host、缺授权引用和意外持久化都会失败。
- dry-run 在无凭据、无网络时输出确定性请求摘要。
- 真实 smoke 对两个固定资源各执行至多一次业务请求，响应为成功 HTTP 且结构可解析；零行必须显示为 `unavailable`，不能伪造数据存在。
- 结果只写入 Git 忽略的临时目录；Record 只记录状态、行数、checksum、口径和限制，不提交业务数值。
- 专项、M2—M7 回归、插件与文档检查通过。

## 5. 非目标

- 修改 GA4/GSC 配置、用户、Property、Sitemap 或索引状态；
- Query/Page/Country/Device 明细、高基数导出或用户级数据；
- 完整 56 天分析、GEO 效果归因、注册漏斗或跨源用户关联；
- 自动 Evidence materialization、批准、Claim、Publication 或因果判断；
- commit、push、PR、发布或部署。

