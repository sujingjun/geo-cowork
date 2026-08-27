---
title: M6—M8 测试商户 SDD Owner 批准记录
status: verified
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/requirements/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-sdd-approval-handoff.md
  - 2026-08-27 Owner 明确决定：批准所有设计，后续按推荐方向推进；保留人工 review，并委派全新上下文的 gpt-5.6-sol Agent 独立决策
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
task_scope: 只记录 Owner 对 M6—M8 SDD 的批准事实、批准范围与仍然有效的门禁；不实现、不访问真实系统、不执行 Git 远端或发布动作
---

# M6—M8 测试商户 SDD Owner 批准记录

## 1. 记录结论

Owner 已在 2026-08-27 明确批准全部 M6—M8 设计，并要求后续按现有 SDD 推荐方向推进。本记录据此把以下工件的 Frontmatter 状态从 `proposed` 更新为 `approved`：

- Requirement；
- PRD；
- Architecture；
- Spec 0007、0008、0009；
- Plan；
- Task。

这是对 Owner 已作决定的如实记录，不是 Agent 自行批准，也不是由文档存在、`check:docs` 或本地测试推导批准。

## 2. 批准范围

Owner 的“批准所有设计并按推荐方向推进”与 SDD 中待决项一致，具体覆盖：

1. Spec 0007 的独立测试商户、Cycle/Analytics、Observation/Signal/Evidence 分离、CAS、恢复与污染防护合同；
2. Spec 0008 的人工 invocation、eligibility、M4 open Product Gap 只读消费、Decision Dimension 人工门、GCB/GCD/GSEL 与 Cycle 2 合同；
3. Spec 0009 的 Codex/Claude Code required packaging/shared Tool 检查、WorkBuddy 中国区 required test-only semantic fixture、optional native/manual 不替代 required、两层无聊天上下文恢复与测试商户 ERC 合同；
4. 按 Plan 的 `M6 → M7 → M8 → 稳定快照独立 QA` 顺序推进；
5. 保留所有人工 review、fixture human decision、Owner/事实负责人、独立对抗 QA 和最终验收门；
6. 按已批准的委派方案使用新的 `gpt-5.6-sol` Agent 上下文承担实现阶段的独立决策与审查。

Spec 0003、0004 的当前条款被 Owner 接受为本任务的 inherited baseline。该决定只表示 Spec 0007—0009 的实现可以继承这些条款；不回写、不提升或改变 Spec 0003、0004 历史文件当前状态。

## 3. 未被批准扩大的范围

本次批准没有授权：

- 建立真实 MyyShop 商户，或把测试商户、fixture approval、synthetic Evidence/Observation/Publication/Cycle 转成真实事实；
- 访问真实 GA4、GSC、CRM、CMS、消费者平台、真实企业或用户数据、凭据、Cookie、Token、`.env` 或未脱敏 PII；
- 外部 Publication、站点/CMS/媒体/Schema/llms/PR/社交写入；
- 把测试商户工程绿测表述为真实 MyyShop 内测、两个真实 GEO Cycle、业务效果、v1 Release 或生产就绪；
- commit、push、创建 PR、merge、部署、release、切换流量或修改远端 CI/云资源。

实现阶段仍须遵守现有 Spec 的 fail-closed 隔离、显式人工门、文件 ownership、先红测、稳定快照与任何后续修改使旧 QA 失效的规则。

## 4. 本次实际修改

- 更新八份已批准 SDD 的 Frontmatter 状态、更新时间与 Owner 批准来源，并只同步被 Owner 决定取代的 `proposed`、未获批停止和 T01 未完成等状态性文字；未改写字段、状态机、错误码、范围或其他正文合同语义；
- 新增本批准 Record；
- 将 SDD Approval Handoff 更新为 `verified`，记录批准决定与批准后开场；
- 最小更新 `docs/README.md` 的 M6—M8 状态与本 Record 导航。

本次没有修改 Lead Handoff、Runbook、MyyShop 内容/证据缺口报告、`plugins/`、`tests/` 或任何 Workspace 业务对象。

## 5. 实际验证

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run check:docs` | 0 | `ok:true`；86 files / 153 links；`errors: []` |
| `git diff --check` | 0 | 无输出，未发现空白错误 |

## 6. 当前门禁与下一步

T01 的 Owner 批准门已完成。后续可按已批准 Plan 从 T02 开始，先建立失败测试，再做最小实现；实现、独立 QA、人工 review、测试商户工程验收、真实 MyyShop 内测、发布与业务效果仍是彼此独立的后续门。

本 Record 的 `verified` 只说明批准事实和本次文档更新已经按记录完成，不证明任何 M6—M8 实现、测试、宿主交互、真实业务或发布结果。
