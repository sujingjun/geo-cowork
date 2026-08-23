# M3 业务对象全量批准决定

- 决定人：MyyShop Owner（本会话用户）
- 决定时间：2026-08-24T06:46:23+08:00
- 原始指令：`业务对象全部批准`
- 决定引用：`workspace://cycles/preparation/decisions/2026-08-24-m3-business-objects-approved.md`

## 状态映射

- Perception Goal：`approved`
- Query：`formal`
- Document、Evidence：`approved`
- Claims、Answer Card：`published`，表示进入本地正式 Knowledge Release
- Query Set：`frozen`
- Knowledge Release：`published/ready`
- Evidence Plan：`active`
- Source 保持 `active`，Run 保持 `completed/not_evaluated`；这些类型没有业务 approval 状态。

## 保留边界

- `EVIDENCE_INSUFFICIENT` 继续保留：批准不把 legacy 草稿或产品方案伪造成不存在的 first-party、data 或 case Evidence。
- Claim Scope、Answer limitations 与 forbidden statements 继续生效。
- Knowledge Release 的 `published` 只表示进入本地正式知识包，不表示官网、FAQ、Schema、llms、媒体、插件或任何外部渠道已经发布。
- 本决定不授权真实平台采集、GA4/GSC 访问、CMS 写入、commit、push、PR、部署或外部发布。

## 时间校正

候选对象最初使用了晚于实际文件创建时间的占位时间。本次以本地文件 birth time 校正 `created_at/captured_at`，审批时间使用本轮指令发生后的实际本地时间；该校正不改变业务内容或证据类别。

