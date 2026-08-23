---
title: M3 Knowledge & Query Operating System 任务清单
status: verified
created: 2026-08-24
source: docs/plans/2026-08-24-m3-knowledge-query-operating-system-plan.md
scope: M3 Schema/Tool/Skills、合成批准 Fixture、MyyShop candidate slice 与验收
---

# M3 Knowledge & Query Operating System 任务清单

## M3-T01 SDD 与 M2 依赖审查

- 对应：Requirement、PRD、Architecture、Spec 0004、Plan
- 目标：冻结单 Goal M3 行为与 M4 边界
- 成功标准：文档职责分离，状态/批准/refs/版本门可测试
- 范围外：自行批准与 M4 实现
- 前置依赖：最终产品方案、Spec 0003
- 目标文件：M3 canonical SDD 工件
- 测试要求：链接和元数据核验
- 验证命令：`git diff --check`
- 风险：把旧 Query/Knowledge Handoff 当当前批准基线
- 状态：verified
- Session/Handoff：当前 `/goal`

## M3-T02 M3 Schema 与 validator

- 对应：Spec 0004 §2—§5、§9；Plan Slice A
- 目标：注册六类 M3 对象并实现 approval/status/readiness 语义
- 成功标准：正常与非法状态、version pins、duplicate Query、stale/sufficiency warning 可复验
- 范围外：语义研究和真实批准
- 前置依赖：M2 verified
- 目标文件：M3 Schema、`scripts/lib/knowledge-query.mjs`、模板、tests
- 测试要求：Spec 0004 §9 与 Plan 矩阵
- 验证命令：`node --test tests/m3-knowledge-query.test.mjs`
- 风险：readiness 被误当批准状态
- 状态：verified

## M3-T03 propose/assemble/trace Tool

- 对应：Spec 0004 §6—§8；Plan Slice B/C
- 目标：从显式计划 create-only 物化 candidates、draft Set/Release 并验证 trace
- 成功标准：approved Fixture Document 可提案；自动批准拒绝；draft/frozen/published 门通过合成测试
- 范围外：Tool 自行抽取语义或更新批准状态
- 前置依赖：M3-T02
- 目标文件：`scripts/knowledge-query.mjs`、Fixture、tests
- 测试要求：idempotent、冲突前无半成品、异常 I/O 可幂等恢复、trace incomplete 与 lifecycle gate
- 验证命令：`npm run test:m3-knowledge-query`
- 风险：合成批准被误表述为 MyyShop 批准
- 状态：verified

## M3-T04 四个 Skills

- 对应：Architecture §2；Plan Slice D
- 目标：提供 Knowledge/Query/Evidence 专业入口与上层编排
- 成功标准：每个 Skill 有输入、必读、步骤、输出、人工门、禁止项、失败/停止、验收、示例；不复制 Schema
- 范围外：M4 Skills、Agent Runtime
- 前置依赖：M3-T03
- 目标文件：四个 `SKILL.md`
- 测试要求：plugin validator 识别 Frontmatter，静态边界检查
- 验证命令：`npm run validate:plugin`
- 风险：编排 Skill 重复专业规则
- 状态：verified

## M3-T05 MyyShop candidate KR v1

- 对应：PRD §3.5；Plan Slice D
- 目标：建立“What is MyyShop”可追溯候选链，不伪造批准
- 成功标准：Goal/Query/Source/Evidence/Document/Claims/Answer/Set/KR/Evidence Plan/Run 通过 object 和 M3 validate；trace 完整；Set/KR 为 draft
- 范围外：formal/freeze/publish、站点或平台变更
- 前置依赖：M3-T03、M3-T04
- 目标文件：`workspaces/myyshop/` 新 canonical 对象与 indexes
- 测试要求：legacy 120 hash 不变、candidate/draft 状态断言
- 验证命令：Plan §5
- 风险：产品计划 Evidence 被错误提升为品牌业务批准
- 状态：verified

## M3-T06 项目 Lead 验收与 M4 Handoff

- 对应：工作流 §10、§11、§14、§17
- 目标：独立复核 M3 diff、全量门与授权边界，建立 M4 接手指令
- 成功标准：Acceptance Record 可复现；M4 Handoff 列明已过开发门与待 Owner 门
- 范围外：批准 M4 Spec、实现 M4、Git/发布操作
- 前置依赖：M3-T02—T05
- 目标文件：M3 Record、M4 Handoff、docs navigation
- 测试要求：全量回归、trace、indexes、diff check
- 验证命令：见最终 Records
- 风险：把 candidate slice 或合成 Fixture 当真实 KR 发布
- 状态：verified

## 收口记录

全部任务的本地工程成功标准与 MyyShop candidate/draft slice 已按 [`../records/2026-08-24-m3-knowledge-query-operating-system-record.md`](../records/2026-08-24-m3-knowledge-query-operating-system-record.md) 验证。`verified` 不提升 Requirement/PRD/Spec/Plan，也不表示真实 MyyShop approval、frozen Query Set、published Knowledge Release、M4 诊断、发布或部署。
