---
title: GA4/GSC 真实只读分析接入验证记录
status: verified
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/requirements/2026-09-01-ga4-gsc-readonly-analytics.md
  - docs/prd/2026-09-01-ga4-gsc-readonly-analytics.md
  - docs/specs/0010-ga4-gsc-readonly-analytics.md
  - docs/plans/2026-09-01-ga4-gsc-readonly-analytics-plan.md
  - docs/runbooks/ga4-gsc-readonly-analytics.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized.md
  - 2026-09-01 当前用户授权的 OAuth/ADC 与真实只读 smoke
scope: MyyShop GA4 Property 356373250 与 GSC URL-prefix Property 的最小真实只读认证、请求和响应冒烟
workdir: /Users/sujingjun/geo-cowork
baseline: main HEAD 4834aa7; working tree dirty; no commit/push/PR
---

# GA4/GSC 真实只读分析接入验证记录

## 1. 结论

在批准的时间窗、资源、字段和只读范围内，GA4 与 GSC 真实读取冒烟均通过。两项 source 均返回 `ok`，各 7 行，无质量 warning；输出只保留在本次临时目录，未写入 `workspaces/myyshop` canonical 对象。

`verified` 仅覆盖本 Record 声明的认证、固定请求、响应归一化和最小真实 smoke；不代表数据完整、GEO 提升、注册改善、因果关系、业务 Evidence 批准、生产发布或应用审核通过。

## 2. 实际命令与结果

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run test:analytics-readonly` | 0 | 13/13 pass |
| `npm test` | 0 | 298/298 pass |
| `npm run validate:plugin` | 0 | `ok: true` |
| `npm run check:docs` | 0 | 105 files / 175 links / 0 errors |
| `geo-analytics-readonly doctor`（ADC 建立前） | 0 | authorization ready；ADC unavailable；未联网 |
| `geo-analytics-readonly doctor`（ADC 建立后） | 0 | authorization ready；ADC available；未读取凭据内容；未联网 |
| `geo-analytics-readonly dry-run` | 0 | 固定 GA4/GSC 请求摘要；未读取凭据；未联网 |
| `geo-analytics-readonly smoke --confirm-readonly` | 0 | 两个真实只读请求成功；结果目录 create-only |

### 2.1 真实 smoke 摘要

| Source | 精确资源 | 状态 | row count | response checksum | warning |
| --- | --- | --- | ---: | --- | --- |
| GA4 | Property `356373250` | `ok` | 7 | `d36eb140abdc7c7cc60b4e48fbb00c7ac79418e9f0466430ac8e9abb815c226d` | none |
| GSC | `https://www.myyshop.com/` | `ok` | 7 | `3a8fca74445a7c5f2fc0d45e38d3b95b83fbf7d37def73aaa4e1152cb2f2a728` | none |

固定结果字段：`causal_claim:false`、`persisted_to_workspace:false`、`credential_accessed:true`、`network_accessed:true`。业务响应正文不进入本 Record。

## 3. 外部配置核验

- Google Cloud Project：`myyshop20221102`。
- Google Analytics Data API 与 Search Console API 已启用。
- OAuth Data Access 已保存 `analytics.readonly` 与 `webmasters.readonly`；未添加写入 scope。
- OAuth client 为 Desktop 类型；client JSON 保存在仓库外受控本机目录。
- ADC 已由 Google 官方 OAuth 流程建立；本 Record 不记录凭据内容、Token、Client Secret 或账号邮箱。
- OAuth 应用保持 `External / In production`；`analytics.readonly` 尚未完成 Google 审核。本次单账号本机 smoke 不以审核通过为前提。

## 4. 首次失败与修复

- 向导首次启动时本地 `TERM` 未设置，终端清屏步骤提前退出；使用临时 `TERM=xterm-256color` 重跑，未修改业务代码。
- 向导内置的 gcloud 命令未包含 gcloud 要求的 `cloud-platform` 基础 scope，返回 scope 参数错误。用户随后明确授权该 scope，使用仓库外 Desktop client 和三项已授权 scope 建立 ADC，之后 `doctor` 与 smoke 通过。
- 当前向导脚本的可重跑命令仍需后续补齐 `cloud-platform` 说明；本次未扩大其他数据 scope，也未自动申请审核。

## 5. 未通过但不属于本 Task 的检查

以下两个命令均因同一组既有 Workspace 文件失败，未改动这些文件，也未影响本次 Analytics smoke：

- `workspace-validate --objects`：`strategy/business-brand-knowledge-v1/` 下 6 个 Markdown 文件为未知 `record_type`。
- `build-index --check`：同上，返回 `INDEX_VALIDATION_FAILED`。

该问题应由独立 Workspace schema/legacy 兼容任务处理，不在本次 GA4/GSC 只读接入范围内。

## 6. 未验证边界与下一步

- GSC Search Analytics 只按日期聚合读取，不能推导 Query/Page 全量数据。
- 本次只证明指定窗口的接口可读，不证明数据完整性、延迟、归因、GEO 或商业效果。
- 未创建 Analytics Observation、Business Signal、Evidence、Claim 或业务结论。
- 未执行 OAuth 审核提交、Property/用户/Sitemap 修改、外部写入、commit、push、PR、部署或发布。
- 本次临时真实响应在 Record 创建后删除；ADC 可按 Runbook 使用 `gcloud auth application-default revoke` 撤销。
