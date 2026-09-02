---
title: MyyShop GA4/GSC Observation 真实采集与物化记录
status: verified
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/specs/0010-ga4-gsc-readonly-analytics.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/tasks/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-02-ga4-gsc-observation-authorized.md
scope: 固定 MyyShop GA4/GSC 资源与 2026-08-23—2026-08-29 窗口的真实只读采集、Observation、非因果 Signal 与 candidate Evidence
workdir: /Users/sujingjun/geo-cowork
baseline: main HEAD 9ffff86；origin/main 落后本地一个既有提交；本次真实产物与 Record 未提交
---

# MyyShop GA4/GSC Observation 真实采集与物化记录

## 1. 结论

在当次精确授权范围内，GA4 Property `356373250` 与 GSC URL-prefix `https://www.myyshop.com/` 的真实只读采集和受控物化均通过：两项 source 均为 `ok`、各 7 行、0 quality warning。

create-only 形成：

- Source：`SRC-MYYSHOP-GA4-20260902`、`SRC-MYYSHOP-GSC-20260902`；
- Observation：`ANO-MYYSHOP-GA4-20260902`、`ANO-MYYSHOP-GSC-20260902`，均 `recorded`；
- Business Signal：`BSIG-MYYSHOP-GSC-20260902`，`computed`、`causal_claim:false`；
- Evidence：`EVD-MYYSHOP-ANALYTICS-20260902`，仅 `candidate`、无 approval；
- Run：`RUN-MYYSHOP-GA4-GSC-OBS-20260902`，`completed`。

raw checksum 为 `41dcaf47d8d53b8e4faf270c35ae424bffe0911e4737c4fc80c16c48dd81a3f0`，且 raw 固定 `persisted_to_workspace:true`、`causal_claim:false`。本 Record 不记录业务指标数值。

## 2. 授权与认证

- 授权 checksum：`9cfbb9f1714dd26c5a6c2199973f227970440acc1c3d04cb1db6e8b1a2c24f6d`；执行时未过期。
- 数据 API scope 仍只有 `analytics.readonly` 与 `webmasters.readonly`；`cloud-platform` 仅用于 gcloud ADC 引导。
- 默认 gcloud client 登录未完成回调，已取消；随后只检查仓库外 Desktop OAuth client 配置存在性，不读取或输出路径/内容。
- 用户在浏览器中亲自完成企业 SSO、密码/MFA（如有）和 Google 授权；凭据保留在用户控制的 ADC，未进入仓库、日志或 Record。
- `gcloud auth application-default print-access-token >/dev/null` exit 0；access token 未显示。

## 3. 实际命令与结果

| 命令 | exit | 结果 |
| --- | ---: | --- |
| ADC refresh check（stdout 丢弃） | 0 | token 可刷新，不读取内容 |
| `npm run test:analytics-readonly` | 0 | 15/15 |
| Observation / business-file 专项 | 0 | 5/5 |
| exact-plan `dry-run` | 0 | 固定资源、窗口、字段、limit 与两个 readonly scope；无网络/凭据读取 |
| `collect-observe --confirm-readonly` | 0 | GA4/GSC 各一个真实请求；bundle created |
| `workspace-validate --objects` | 0 | 0 error / 0 warning |
| `knowledge-query validate` | 0 | 两条既有 `EVIDENCE_INSUFFICIENT` warning 原样保留 |
| `query-portfolio validate` | 0 | 上述两条 warning + 三条既有 coverage advisory；0 error |
| `build-index` + index refs 检查 | 0 | 336 canonical objects / 120 legacy；新对象均可从对应 index 查到 |

## 4. 首次错误产物与修复

首轮物化后复核发现 raw 仍带采集阶段的 `persisted_to_workspace:false`，与文件已经进入真实 Workspace 的事实不一致。该 bundle 尚未提交，已精确删除本轮新建的 7 个对象、1 个 raw 及空目录，重建派生 index；未删除既有 MyyShop 数据。

随后修改 materializer，使 canonical raw 固定 `persisted_to_workspace:true`，补测试并以同一授权、相同对象 ID 重新真实采集。第二次执行成功，当前 checksum 与对象链均来自修复后 bundle；首轮错误 bundle 不再存在。

## 5. 明确边界

- Observation 不是 Evidence；Business Signal 不是 Evidence；candidate Evidence 未获批准，也未绑定或更新任何 Claim。
- 本次日期维度聚合不能识别 AI referrer，不能证明内容变更、GEO 提升、注册改善或任何因果效果。
- 没有创建正式 Cycle、Content Gap、Adoption、Publication、部署或发布。
- 真实品牌知识库仍缺席；本次 Analytics 成功不改变 `real_cycle_start_ready:false`。
