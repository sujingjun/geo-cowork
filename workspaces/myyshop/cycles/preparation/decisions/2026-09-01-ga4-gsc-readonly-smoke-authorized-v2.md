# GA4/GSC 真实只读冒烟授权决定 v2

- 决定人：MyyShop Owner（本会话用户）
- 决定日期：2026-09-01
- supersedes：`workspace://cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized.md`
- 原始指令：允许为本次 ADC 登录授权 `cloud-platform` 与 `analytics.readonly`
- 到期时间：2026-09-02T00:00:00+08:00

## 获授权目标

| 系统 | 精确资源 | 只读方法 |
| --- | --- | --- |
| GA4 | Property `356373250` | Data API `properties.runReport` |
| GSC | URL-prefix Property `https://www.myyshop.com/` | `searchAnalytics.query` |

## Scope 分层

- 允许 `https://www.googleapis.com/auth/cloud-platform`，仅用于 gcloud 建立本机 Application Default Credentials；该 scope 不进入任何 GA4/GSC 数据 API 请求。
- GA4 数据请求只允许 `https://www.googleapis.com/auth/analytics.readonly`。
- GSC 数据请求只允许 `https://www.googleapis.com/auth/webmasters.readonly`。

## 获授权口径

- 时间窗：`2026-08-23`—`2026-08-29`。
- GA4 dimension：`date`；metrics：`sessions`、`activeUsers`、`screenPageViews`；limit `10`。
- GSC dimension：`date`；metrics 为 API 固定返回的 `clicks`、`impressions`、`ctr`、`position`；`type:web`、`dataState:final`、`aggregationType:byProperty`、row limit `10`。
- 并发 `1`；每个系统至多一个业务请求；超时 `20s`；不自动重试。

## 未授权事项

- 其他 OAuth scope、GA4/GSC 写入、Admin/Owner 用户管理、Sitemap 提交、索引请求或 Property 变更；
- Query、Page、Country、Device、高基数明细、用户级数据、收入/成本指标或完整业务分析；
- 写真实 ANO/BSIG/EVD/Claim、自动批准 Evidence、因果判断、commit、push、PR、发布或部署。
