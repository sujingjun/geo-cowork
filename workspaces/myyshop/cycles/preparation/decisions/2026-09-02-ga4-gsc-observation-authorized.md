# GA4/GSC 只读 Observation 物化授权决定

- 决定人：MyyShop Owner（当前会话用户）
- 决定日期：2026-09-02
- 到期时间：2026-09-03T00:00:00+08:00
- 来源：当前用户明确要求所有配置使用 MyyShop 线上真实配置，完成 MyyShop 数据采集与 Observation 流程，并允许输出非因果 Business Signal 与 candidate Evidence。

## 精确范围

- GA4 Property：`356373250`；dimension `date`；metrics `sessions`、`activeUsers`、`screenPageViews`；沿用 `2026-08-23`—`2026-08-29` 已批准窗口；只读单请求。
- GSC Property：`https://www.myyshop.com/`；dimension `date`；metrics 为 API 固定聚合字段；沿用相同窗口；只读单请求。
- 允许在本地真实 MyyShop Workspace create-only 写入 normalized raw、Analytics Observation、非因果 Business Signal、Source、Run 和 `candidate` Evidence。

## 明确不授权

- 扩大资源、字段、时间窗或 OAuth scope；
- 任何写入 GA4/GSC 的操作；
- 自动批准 Evidence、修改 Claim、创建正式 Cycle、Publication、部署或发布；
- 把相关性、CTR、访问、用户或页面量写成 GEO/内容因果效果。
