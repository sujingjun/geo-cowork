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
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-adc-bootstrap-scope-authorized.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized-v2.md
  - 2026-09-01 当前用户授权的 OAuth/ADC 与真实只读 smoke
scope: MyyShop GA4 Property 356373250 与 GSC URL-prefix Property 的最小真实只读认证、请求和响应冒烟
workdir: /Users/sujingjun/geo-cowork
baseline: live smoke at main HEAD 4834aa7; current hardening at main HEAD 2f8ad10; working tree dirty; local ahead origin/main 1/0; no push/PR
---

# GA4/GSC 真实只读分析接入验证记录

## 1. 结论

在批准的时间窗、资源、字段和只读范围内，GA4 与 GSC 真实读取冒烟均通过。原授权链和补充 ADC bootstrap 授权链下，两项 source 均返回 `ok`，各 7 行，无质量 warning；输出只保留在临时目录，未写入 `workspaces/myyshop` canonical 对象。

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

### 2.2 v2 授权链复测

当前 smoke plan 使用授权决定 v2，authorization checksum 为 `f3677932e90407089c88b4d2a54159149e9a4c3cd7cc8746a0adbff683661107`。复测仍为同一资源、日期、字段和单请求限制：

| Source | 状态 | row count | response checksum | warning |
| --- | --- | ---: | --- | --- |
| GA4 | `ok` | 7 | `8f179f67ceb1887a4af07a61a0c70daad5e677acb69ecd72eb5fa50229ee3f6d` | none |
| GSC | `ok` | 7 | `3a8fca74445a7c5f2fc0d45e38d3b95b83fbf7d37def73aaa4e1152cb2f2a728` | none |

## 3. 外部配置核验

- Google Cloud Project：`myyshop20221102`。
- Google Analytics Data API 与 Search Console API 已启用。
- OAuth Data Access 已保存 `analytics.readonly` 与 `webmasters.readonly`；未添加写入 scope。
- `cloud-platform` 的 ADC 引导 scope 已由独立补充授权决定覆盖；它不进入 GA4/GSC API 请求合同。
- OAuth client 为 Desktop 类型；client JSON 保存在仓库外受控本机目录。
- ADC 已由 Google 官方 OAuth 流程建立；本 Record 不记录凭据内容、Token、Client Secret 或账号邮箱。
- OAuth 应用保持 `External / In production`；`analytics.readonly` 尚未完成 Google 审核。本次单账号本机 smoke 不以审核通过为前提。

## 4. 首次失败与修复

- 向导首次启动时本地 `TERM` 未设置，终端清屏步骤提前退出；使用临时 `TERM=xterm-256color` 重跑，未修改业务代码。
- 向导内置的 gcloud 命令最初未包含 gcloud 要求的 `cloud-platform` 基础 scope，返回 scope 参数错误。用户随后明确授权该 scope，使用仓库外 Desktop client 和三项已授权 scope 建立 ADC，之后 `doctor` 与 smoke 通过。
- 后续本地硬化已把 `cloud-platform` 基础 scope 和说明补入向导与 Runbook；实际 API 请求仍限定为两个 read-only scope，未扩大其他数据 scope，也未自动申请审核。

## 5. 未通过但不属于本 Task 的检查

初始验证时以下两个命令均因同一组既有 Workspace 文件失败，未改动这些业务文件，也未影响本次 Analytics smoke：

- `workspace-validate --objects`：`strategy/business-brand-knowledge-v1/` 下 6 个 Markdown 文件为未知 `record_type`。
- `build-index --check`：同上，返回 `INDEX_VALIDATION_FAILED`。

后续已通过 index builder 的明确规划目录兼容规则修复；该目录中的资料包继续作为规划文档，不物化为业务对象。

## 6. 未验证边界与下一步

- GSC Search Analytics 只按日期聚合读取，不能推导 Query/Page 全量数据。
- 本次只证明指定窗口的接口可读，不证明数据完整性、延迟、归因、GEO 或商业效果。
- 未创建 Analytics Observation、Business Signal、Evidence、Claim 或业务结论。
- 未执行 OAuth 审核提交、Property/用户/Sitemap 修改、外部写入、commit、push、PR、部署或发布。
- 两次临时真实响应均已移入系统废纸篓并移除 Run 目录，未永久清空废纸篓；ADC 仍可按 Runbook 使用 `gcloud auth application-default revoke` 撤销。

## 7. Record 后的本地硬化复核

- 当前 checkout：`main` HEAD `2f8ad10`；工作区在本次硬化后有未提交变更；本地相对 `origin/main` 为 `1/0`。
- `npm run test:analytics-readonly`：14/14 pass。
- `npm test`：300/300 pass。
- `npm test`：300/300 pass。
- `node --test tests/analytics-readonly-cli.test.mjs`：7/7 pass；新增 setup scope、清屏回退和 Runbook 拼写回归。
- `node --test tests/m2-index-ref.test.mjs`：9/9 pass；新增业务品牌准备资料包规划文档排除回归。
- `bash -n plugins/geo-expert/scripts/setup-google-analytics-readonly.sh`：pass。
- `shellcheck plugins/geo-expert/scripts/setup-google-analytics-readonly.sh`：pass。
- `workspace-validate --objects`：pass；328 个对象、120 个 legacy、无 warning。
- `build-index --check`：pass；`written:[]`。
- `npm run check:docs`：106 files / 176 links / 0 errors。
- `git diff --check`：pass。
