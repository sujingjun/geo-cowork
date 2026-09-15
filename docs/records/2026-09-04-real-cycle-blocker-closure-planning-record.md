---
title: 真实 GEO Cycle 阻塞收口规划记录
status: verified
created: 2026-09-04
updated: 2026-09-04
source:
  - CONTEXT.md
  - CONTEXT-MAP.md
  - docs/prd/2026-09-04-authorized-real-geo-cycle.md
  - docs/plans/2026-09-04-real-cycle-blocker-closure-plan.md
  - docs/tasks/2026-09-04-real-cycle-blocker-closure.md
  - docs/workflow.md
  - "2026-09-04 grill-with-docs Owner 五项确认"
scope: 当前阻塞审计、领域词汇、Owner 决定、proposed PRD/roadmap/task map 与独立文档评审；不含 PRD/Spec 批准、实现、真实运行或外部动作
workdir: /Users/sujingjun/geo-cowork
baseline: main@d848cdf1ba83a40f3f243e24b66db0f275cec424；开工 clean；origin/main 落后本地 15 个提交
---

# 真实 GEO Cycle 阻塞收口规划记录

## 1. 结论

本次 `grill-with-docs` 已形成并记录共享理解：以 `real_cycle_start_ready:true` 为第一检查点，由 Agent 主导、Owner 逐门判断与授权，完成两个真实 MyyShop GEO Cycle 后收口 M8/v1。Cycle 1 使用英文 `What is MyyShop?` 的最小真实知识切片；Citation Observation 参与来源与观察 provenance，但不阻塞任何真实 Cycle transition。

本 Record 的 `verified` 只表示访谈决定、当前仓库事实、文档引用和规划一致性已检查。新 Plan/Task 均为 `proposed`；authorized-real PRD、Spec 0014、实现、真实 KBASE、Cycle、Publication、平台/Analytics 访问、Release、commit、push、PR 和 deploy 均未获本次授权或执行。

## 2. Owner 确认的五项决定

1. 总目标是两个真实 GEO Cycle + M8/v1；Start-ready 不是终点。
2. Citation 当前只记录与形成 provenance/观察指标，40→100 和 Classification/Claim Support 不进入任何 Cycle required gate；其独立 M5/v1 地位由新 PRD 明确。
3. Agent 主导计划、实现、验证和 Cycle 编排；Owner 负责事实、Review、授权、Adoption、Publication、Cycle 2 Goal 与发布决定。
4. Cycle 1 采用英文 `What is MyyShop?` 的最小 Goal-scoped Real Knowledge Slice；中文不进入 required frozen Query Set/CIS/track/gate。
5. M8/v1 要求两个真实 Cycle full、Codex/Claude native、WorkBuddy manual 配置/跨会话证据和独立 semantic fixture lane；WorkBuddy native 无正式合同时保持 optional。

## 3. 审计发现的关键阻塞

- 当前 real KBASE 不存在，Workspace 仍是 `knowledge_base_ref:null / real_pending`。
- 现有代码只验证 authorized-real `create-cycle`；M6 advance/Review/Trace 与 M7 Candidate/GSEL/Cycle2 仍固定 test-only。
- M6 Publication gate 固定 `.invalid`，阶段 gate 没有完整校验 Query×Platform×slot×window 与 Cycle/Goal ownership。
- 10 个 Answer Review 均为 candidate；没有 Owner decision→新 ID reviewed successor→新 Aggregation successor 的可审计 seam。
- Browser extraction 只有 fake/disabled，Cowork intake 只接受 fixture；规则型或模型型 real extraction 必须由新 PRD/Spec 决定。
- Citation/Source queue 当前可能通过 Source bytes 变化触发 CIS drift，必须增加 active Cycle non-interference 合同。
- M8 现有对象不能表达双 real Cycle/native/manual 证据，且当前中央 digest fan-out 不能证明独立宿主执行。
- Start-ready 与 Safe-to-create 不是同一门：前者是知识/Readiness 判断，后者还要 real runtime seam 与完整 operational input package。

## 4. 实际文档变更

- 扩展根 `CONTEXT.md`，新增 Milestone、Cycle Blocker、Agent-led/Owner-gated、Baseline、Citation、Retest、Review 与 M8/v1 词汇。
- 新增 `CONTEXT-MAP.md`，映射 GEO Lifecycle 与 GEO Browser Extension；更新 `.gitignore` allowlist。
- 在 Browser Context 新增 `Cycle Query Input`。
- 新增 proposed Plan 与 program-level proposed Task map；冻结 blocker registry、G0–G5/G2A、阶段依赖、Owner Gates、停止条件和验证矩阵。
- 在 Owner “批准起草”授权下新增 proposed authorized-real/v1 PRD；D1–D5 仍待 Owner 批准或修改。
- 更新 `docs/README.md`、`docs/wiki/index.md` 与 `workspaces/myyshop/STATUS.md`；旧 M5 Handoff 保持历史字节，由导航注明新顺序仍是 proposed。
- 未创建 ADR：本次是可调整的产品门、顺序和 execution-scope 扩展；若未来迁移 legacy `published` 状态才另行判断 ADR。

## 5. 实际验证

| 检查 | 结果 |
| --- | --- |
| `npm run check:docs` | 通过；新增 Record 前 141 个 Markdown、215 个内部链接、0 errors |
| 最终 `npm run check:docs` | 通过；142 个 Markdown、217 个内部链接、0 errors |
| `node --test tests/doc-links.test.mjs` | 1/1 通过 |
| `git diff --check` | 通过 |
| gray-matter Frontmatter parse | Plan、Task、Wiki 均可解析；Plan/Task 为 `proposed` |
| `.gitignore` / `git status` | `CONTEXT-MAP.md` 已解除忽略并可纳入 Git |
| 独立 SDD Review | 首轮发现 SDD 顺序、G2/G2A、Release、Citation/v1、Task 字段等问题；最终复审 P0=0、P1=0 |
| 独立 Dependency Review | 发现 Strategy 顺序、M8 表达、Retest schedule、KBASE membership、decision seam 与 Citation drift 等问题；最终复审 P0=0、P1=0 |
| 独立 Context/Navigation Review | 最终未发现必须修复项；Context/Map/导航与 proposed 状态一致 |

未运行根全量、Extension build、真实浏览器或外部系统；本次只有文档和导航变更。

## 6. 下一步与授权门

下一步由 Owner 审阅 proposed authorized-real/v1 PRD 的 D1–D5：100 Source 的独立 M5/v1 地位、无正向信号的 M6/v1 业务门、Browser extraction 产品约束、Week 8 延长规则和 development-test KBASE 归档时点。PRD 获批后才起草 Spec 0014，再回写 Plan/child Tasks。只有 Owner 依次批准这些工件并授权本地实现，才进入代码红测。

当前工作树保留未提交规划修改；未执行 commit 或 push。
