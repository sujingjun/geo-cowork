# GA4/GSC 真实只读冒烟授权决定

- 决定人：MyyShop Owner（本会话用户）
- 决定时间：2026-09-01T07:20:33+08:00
- 原始指令：`完成基建，执行真实读取冒烟测试`
- 决定引用：`workspace://cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized.md`
- 到期时间：2026-09-02T00:00:00+08:00

## 获授权目标

| 系统 | 精确资源 | 只读方法 |
| --- | --- | --- |
| GA4 | Property `356373250` | Data API `properties.runReport` |
| GSC | URL-prefix Property `https://www.myyshop.com/` | `searchAnalytics.query` |

## 获授权口径

- 时间窗：`2026-08-23`—`2026-08-29`。
- GA4 dimension：`date`；metrics：`sessions`、`activeUsers`、`screenPageViews`；limit `10`。
- GSC dimension：`date`；metrics 为 API 固定返回的 `clicks`、`impressions`、`ctr`、`position`；`type:web`、`dataState:final`、`aggregationType:byProperty`、row limit `10`。
- OAuth scopes 仅为 `https://www.googleapis.com/auth/analytics.readonly` 与 `https://www.googleapis.com/auth/webmasters.readonly`。
- 并发 `1`；每个系统至多一个业务请求；超时 `20s`；不自动重试。

## 产物与保留

- 真实响应只进入 Git 忽略的 `tmp/geo-analytics/`，不进入 `workspaces/myyshop` canonical 对象。
- 本次 Record 完成后删除 Agent 创建的临时业务响应；Record 只保留状态、row count、checksum、口径和 warning，不保留业务数值。
- 凭据由 Google 官方 OAuth/ADC 管理；仓库、聊天、命令参数、日志和截图不得出现 token、Cookie、Client Secret、账号邮箱或 credential 内容。

## 未授权事项

- GA4/GSC 写入、Admin/Owner 用户管理、Sitemap 提交、索引请求或 Property 变更；
- Query、Page、Country、Device、高基数明细、用户级数据或收入/成本指标；
- 读取 `.env`/浏览器 Profile、使用 Cookie/API Key、扩大 OAuth scope；
- 写真实 ANO/BSIG/EVD/Claim、自动批准 Evidence、因果判断；
- commit、push、PR、发布或部署。

## 停止条件

授权文件漂移或过期、目标资源不匹配、只读权限不足且需要升级、出现 credential/PII、API 要求额外计费确认、未知字段/高基数响应、配额或安全错误时立即停止，不自动扩大权限或范围。

