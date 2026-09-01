---
title: GA4/GSC 真实只读分析接入 Runbook
status: implemented
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/specs/0010-ga4-gsc-readonly-analytics.md
  - docs/plans/2026-09-01-ga4-gsc-readonly-analytics-plan.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-adc-bootstrap-scope-authorized.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized-v2.md
scope: 本机 OAuth/ADC 准备、preflight、dry-run、真实 smoke、故障和撤销
---

# GA4/GSC 真实只读分析接入 Runbook

## 1. 固定入口

```bash
npm install --ignore-scripts
npm run test:analytics-readonly
npm run analytics:readonly -- doctor \
  --workspace workspaces/myyshop \
  --plan workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json
npm run analytics:readonly -- dry-run \
  --workspace workspaces/myyshop \
  --plan workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json
```

`doctor` 只检查授权、SDK、gcloud 与 ADC 文件是否存在，不读取凭据内容。`dry-run` 不加载凭据、不联网、不写业务响应。

## 2. 一次性 OAuth/ADC 准备

前置：目标 Google 账号具有 GA4 Property `356373250` Viewer 权限，以及 GSC URL-prefix Property `https://www.myyshop.com/` read 权限。

```bash
npm run setup:analytics-readonly
```

向导只把非秘密 Project ID 和 OAuth client 文件路径写到被 Git 忽略的 `.env`。Desktop OAuth client JSON 与 gcloud ADC 都必须留在仓库之外；不要把内容、Token、账号邮箱、Cookie 或浏览器 Profile 发到聊天或日志。

gcloud 建立 ADC 时还要求 `cloud-platform` 作为认证引导基础 scope；它不改变 API 请求合同。实际 GA4/GSC 数据请求仍只使用以下两个 read-only scope：

```text
https://www.googleapis.com/auth/analytics.readonly
https://www.googleapis.com/auth/webmasters.readonly
```

官方参考：[Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)、[GA4 runReport](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)、[GSC Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)。

## 3. 真实 smoke

只有 exact plan、授权 bytes、日期、资源与专项/回归均未漂移时执行：

```bash
GEO_ANALYTICS_REAL_READ=1 npm run analytics:readonly -- smoke \
  --workspace workspaces/myyshop \
  --plan workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json \
  --output tmp/geo-analytics/RUN-MYYSHOP-GA4-GSC-SMOKE-20260901/result.json \
  --confirm-readonly
```

stdout 只显示 source 状态、row count 和 checksum；完整聚合行只在 Git 忽略的临时结果中。GA4/GSC 各发一个请求，不自动重试。

## 4. 结果解释

- `ok`：认证、目标资源、API 和响应 Schema 可读，且该窗口至少一行。
- `unavailable`：API 调用成功但零行；不改写为正向结果。
- GSC Search Analytics 不保证返回全部行；本 smoke 只按日期读取，不能推广为 Query/Page 全量分析。
- 任意结果都固定 `causal_claim:false`，且本次不写真实 ANO/BSIG/EVD/Claim。

## 5. 故障分流

| 错误 | 处理 |
| --- | --- |
| `READONLY_ADC_UNAVAILABLE` | 重新运行 OAuth 向导；不要改用 Cookie 或把 Token 放入 `.env` |
| `READONLY_API_FORBIDDEN` | 核对目标账号 Viewer/read 权限、API enable 与 OAuth consent；不得自动提升为 Editor/Owner |
| `READONLY_AUTHORIZATION_DRIFT` | 停止；重新审核授权决定与 plan checksum |
| `READONLY_RESPONSE_INVALID` | 保存错误码，不保存未知响应；核对 API 变更后更新 Spec/测试 |
| quota/timeout/5xx | 停止本次 smoke；不自动重试或扩大日期 |

## 6. 清理与撤销

Record 完成后，只删除本次 Agent 创建的 `tmp/geo-analytics/RUN-MYYSHOP-GA4-GSC-SMOKE-20260901/` 临时结果。撤销本机 ADC：

```bash
gcloud auth application-default revoke
```

撤销 OAuth client、GA4/GSC 角色或 Google Cloud Project 属外部资源变更，需要新的明确授权；不要由脚本自动执行。
