# GA4/GSC ADC bootstrap scope 授权补充决定

- 决定人：MyyShop Owner（本会话用户）
- 决定日期：2026-09-01
- 原始指令：允许授权 `https://www.googleapis.com/auth/cloud-platform` 与 `https://www.googleapis.com/auth/analytics.readonly`
- 适用范围：为 `gcloud auth application-default login` 建立本机 ADC
- 到期时间：2026-09-02T00:00:00+08:00

## 授权内容

- 允许 `https://www.googleapis.com/auth/cloud-platform` 作为 gcloud ADC 所需的认证引导基础 scope。
- 允许既有 `https://www.googleapis.com/auth/analytics.readonly` 与 `https://www.googleapis.com/auth/webmasters.readonly` 用于本次批准的 GA4/GSC 只读 smoke。

## 边界

- `cloud-platform` 仅解决 ADC 建立，不改变 GA4/GSC API 请求合同；实际数据请求仍只使用两个 read-only scope。
- 不授权 GA4/GSC 写入、Admin/Owner 用户管理、Sitemap/索引修改、Query/Page 高基数读取、用户级数据、收入/成本指标或任何其他 OAuth scope。
- 不授权 OAuth 审核提交、commit、push、PR、发布或部署。
