---
title: Spec 0010 — GA4/GSC Read-only Analytics
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/prd/2026-09-01-ga4-gsc-readonly-analytics.md
  - docs/architecture/2026-09-01-ga4-gsc-readonly-analytics-architecture.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-adc-bootstrap-scope-authorized.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized-v2.md
  - 2026-09-01 当前用户明确指令：完成基建，执行真实读取冒烟测试
scope: MyyShop GA4/GSC 精确资源的真实只读 preflight、请求、归一化与临时结果合同
---

# Spec 0010 — GA4/GSC Read-only Analytics

## 1. 继承与边界

继承 Spec 0003 的 checksum/create-only/path 安全与 Spec 0007 的 Observation/Evidence/因果分离，但不加载 Spec 0007 Test Merchant profile，也不写 ANO/BSIG/EVD。当前用户指令只批准本 Spec 的两个固定资源与一次最小 smoke。

## 2. 计划合同

计划 `schema_version` 固定为 `ga4-gsc-readonly-smoke/1.0.0`，必需字段：

```json
{
  "run_id": "RUN-MYYSHOP-GA4-GSC-SMOKE-20260901",
  "workspace_id": "ws_myyshop2026082400000000000",
  "authorization": {
    "ref": "workspace://cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized-v2.md",
    "sha256": "<64 hex>",
    "expires_at": "2026-09-02T00:00:00+08:00"
  },
  "time_window": {"start_date": "2026-08-23", "end_date": "2026-08-29"},
  "ga4": {
    "property_id": "356373250",
    "dimensions": ["date"],
    "metrics": ["sessions", "activeUsers", "screenPageViews"],
    "limit": 10
  },
  "gsc": {
    "site_url": "https://www.myyshop.com/",
    "dimensions": ["date"],
    "type": "web",
    "aggregation_type": "byProperty",
    "data_state": "final",
    "row_limit": 10
  }
}
```

字段、顺序、资源、日期与上限必须精确匹配；不接受额外 source、filter、metric、dimension、URL 或 credential 字段。authorization ref 必须位于当前 Workspace，bytes sha 匹配且未过期。

## 3. 请求合同

### 3.1 GA4

- `POST https://analyticsdata.googleapis.com/v1beta/properties/356373250:runReport`
- OAuth scope：`https://www.googleapis.com/auth/analytics.readonly`
- body 只包含固定 date range、dimension、metrics、limit、`keepEmptyRows:false`、`returnPropertyQuota:true`。

### 3.2 GSC

- `POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.myyshop.com%2F/searchAnalytics/query`
- OAuth scope：`https://www.googleapis.com/auth/webmasters.readonly`
- body 只包含固定 start/end、`dimensions:[date]`、`type:web`、`aggregationType:byProperty`、`dataState:final`、`rowLimit:10`、`startRow:0`。

以上两项是 GA4/GSC 数据 API 的请求 scope。gcloud 建立 ADC 时可能要求额外的 `https://www.googleapis.com/auth/cloud-platform` 认证引导 scope；该 scope 必须由独立授权决定覆盖，不得作为数据 API 请求 scope，也不得因此扩大数据字段或写入能力。

API Key、write scope、Cookie、浏览器 Session、任意 endpoint override 均禁止。

## 4. 执行门

真实请求同时要求：

1. `GEO_ANALYTICS_REAL_READ=1`；
2. CLI 参数 `--confirm-readonly`；
3. authorization bytes、expiry、workspace ID 与计划匹配；
4. ADC 可用且 token 未被输出；
5. output 位于 `tmp/geo-analytics/<run_id>/`，不存在 symlink。

缺一项在网络前失败。dry-run 不加载 ADC、不发网络、不写业务响应。

## 5. 输出合同

```json
{
  "schema_version": "ga4-gsc-readonly-result/1.0.0",
  "run_id": "...",
  "sources": {
    "ga4": {"status": "ok|unavailable", "row_count": 0, "rows": []},
    "gsc": {"status": "ok|unavailable", "row_count": 0, "rows": []}
  },
  "quality": {"warnings": []},
  "causal_claim": false,
  "persisted_to_workspace": false
}
```

结果另含 plan/authorization/request fingerprints、captured_at 和各响应 checksum，但不得含 header、token、账号邮箱、credential path 或 Google 用户信息。零行是合法 `unavailable`，不能改写为成功数据观察。

## 6. CLI

```text
geo-analytics-readonly.mjs doctor --workspace <path> --plan <json>
geo-analytics-readonly.mjs dry-run --workspace <path> --plan <json>
geo-analytics-readonly.mjs smoke --workspace <path> --plan <json> --output <path> --confirm-readonly
```

`doctor` 只查本地前置和 ADC presence，不打印内容；`dry-run` 只生成脱敏请求摘要；`smoke` 执行两个固定请求并 create-only 写结果。

## 7. 错误码

至少包括：`READONLY_PLAN_INVALID`、`READONLY_AUTHORIZATION_REQUIRED`、`READONLY_AUTHORIZATION_DRIFT`、`READONLY_SCOPE_FORBIDDEN`、`READONLY_NETWORK_CONFIRMATION_REQUIRED`、`READONLY_ADC_UNAVAILABLE`、`READONLY_API_FORBIDDEN`、`READONLY_API_FAILED`、`READONLY_RESPONSE_INVALID`、`READONLY_OUTPUT_FORBIDDEN`、`READONLY_OUTPUT_CONFLICT`。

## 8. 验收

- 单元测试使用 injected request seam，不访问 Google；先红后绿。
- CLI dry-run、授权漂移、scope/host/字段/输出路径/重复 bytes 正负例通过。
- live smoke 只在 TDD 与回归通过后执行；Record 区分 API 连通、数据存在和业务结论。
