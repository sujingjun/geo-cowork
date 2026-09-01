---
title: GA4/GSC 真实只读分析接入 PRD
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/requirements/2026-09-01-ga4-gsc-readonly-analytics.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-09-01 当前用户明确指令：完成基建，执行真实读取冒烟测试
scope: 真实只读连接的用户旅程、业务规则、验收与非目标
---

# GA4/GSC 真实只读分析接入 PRD

## 1. 用户与价值

MyyShop 数据负责人和 GEO 负责人需要确认“账号与 API 真的可读”，并得到结构稳定的聚合输入；同时必须清楚区分接口连通、数据存在、Observation、Evidence 与业务效果。

## 2. 用户旅程

1. 负责人查看计划中的精确 Property、scope、日期、字段和停止条件。
2. 系统先 dry-run，展示即将调用的官方 host、方法和请求摘要，不读取凭据。
3. 人类通过 Google 官方 OAuth/ADC 完成登录与授权，凭据留在用户控制的本机配置中。
4. 操作者显式设置真实读取开关并执行 smoke。
5. 系统输出 GA4/GSC 各自的读取状态、行数、口径、质量 warning、checksum 与非因果声明。
6. 临时响应只用于当前验证；是否进入真实 Workspace 对象由后续独立计划与人工决定处理。

## 3. 业务规则

- 连接成功不等于数据完整；GSC top-row 限制、延迟和零行必须如实表达。
- 数据存在不等于 Evidence approved；指标变化不等于内容变更造成变化。
- smoke 只使用按日聚合，不读取 Query、Page 或用户级维度。
- 任何 scope、Property、时间窗、字段或 host 漂移都必须在发请求前失败。
- 未设置双重显式开关、授权文件不匹配、ADC 不存在或权限不足时不降级到 Cookie、浏览器 Profile、API Key 或写 scope。

## 4. 业务验收

| 编号 | 场景 | 通过条件 |
| --- | --- | --- |
| BA-01 | dry-run | 无网络、无凭据即可看到稳定且脱敏的两个请求摘要 |
| BA-02 | 最小权限 | 仅申请两项 read-only scope，写 scope 或未知 scope 被拒绝 |
| BA-03 | GA4 smoke | 固定 Property 的 `runReport` 成功并归一化 |
| BA-04 | GSC smoke | 固定 URL-prefix Property 的 `searchAnalytics.query` 成功并归一化 |
| BA-05 | 数据边界 | 无账号、Token、Cookie、用户级或高基数明细进入输出与 Git |
| BA-06 | 结论边界 | 输出固定 `causal_claim:false`，不创建 Evidence/Claim |

## 5. 非目标与完成边界

本次完成最多证明真实只读接口基础设施和指定 Property 的最小读取可用，不证明 GA4/GSC 数据质量完整、GEO 提升、注册改善、真实 Cycle 完成或生产发布。

