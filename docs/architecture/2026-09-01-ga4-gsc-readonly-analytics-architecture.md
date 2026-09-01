---
title: GA4/GSC 真实只读分析接入架构
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/prd/2026-09-01-ga4-gsc-readonly-analytics.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
scope: 真实只读 adapter、认证边界、数据流、临时产物与既有 fixture 隔离
---

# GA4/GSC 真实只读分析接入架构

## 1. 目标形态

```text
approved plan + Workspace authorization
                 │
                 ▼
       geo-analytics-readonly CLI
         │                   │
         ▼                   ▼
 Google ADC              preflight guard
         │          host/resource/scope/fields
         └──────────┬────────┘
                    ▼
         GA4 Data API / GSC API
                    │
                    ▼
        deterministic normalizer
                    │
                    ▼
  ignored tmp artifact + redacted status/checksum
```

## 2. 隔离决策

- 保留 `geo-analytics.mjs` 为 fixture-only；不修改其 `GEO_M6_NETWORK_DISABLED=1` 红线。
- 新入口只消费精确授权计划，不能被 M6 Test Merchant 自动调用。
- 真实响应不写 `workspaces/myyshop` canonical 对象；临时文件固定在仓库 `tmp/geo-analytics/`，完成 Record 后删除。
- 后续把聚合数据登记为真实 Observation 时另立对象 profile、materialization plan 和人工门。

## 3. 认证与网络

- Node 使用 Google Application Default Credentials；认证文件由 Google Cloud CLI/官方 OAuth 流程管理。
- 代码只获得请求 header，不输出 token，不读取浏览器 Cookie、Profile 或 `.env` 值。
- host allowlist 固定为 `analyticsdata.googleapis.com` 与 `www.googleapis.com`；不接受计划提供任意 base URL。
- 每个 source 单并发、单业务请求、20 秒超时、smoke 不自动重试，避免重复配额消耗。

## 4. 数据与质量

- GA4 adapter 输出请求维度/指标、响应行、rowCount、metadata 与 quota 摘要。
- GSC adapter 输出请求维度、响应行、aggregation type 与 metadata。
- normalizer 只接受预先登记字段，将数字字符串转换为有限数值；未知 header、错列、非有限数值或超限行数失败。
- 输出带 request fingerprint、response checksum、`causal_claim:false` 和 `persisted_to_workspace:false`。

## 5. 失败策略

授权、ADC、scope、Property、host、日期、字段、响应 Schema、超时或 create-only 冲突任一失败即停止；不切换到宽权限、不调用第二入口补偿、不产生成功结论。

