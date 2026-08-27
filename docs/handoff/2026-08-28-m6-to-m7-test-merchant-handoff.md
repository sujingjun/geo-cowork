---
title: M6 verified 至 M7 Strategy/Cycle 2 测试商户交接
status: proposed
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
scope: M7 Gate 0、eligibility、Decision Dimension、Strategy Output、GCB/GCD/GSEL 与完整 synthetic Cycle 2；不含真实业务战略决定
---

# M6 verified 至 M7 Strategy/Cycle 2 测试商户交接

## 1. 入口事实

- M6 synthetic/test-only Cycle 1 已由独立 max QA verified，证据见 M6 Record；
- M7 Spec、Plan、Task 已由 Owner approved；DDM 四态状态机已由全新 xhigh 技术 Review 闭合；
- M7 当前已有 22 个预期红测，0 pass / 22 fail，失败仅为 6 类 M7 类型与 15 个 owned API 尚不存在；
- M6 的 strategy/review CIS、Cycle2 freeze/CAS、test_scope 和污染防护是 M7 必须复用的公开边界，不得复制第二套生命周期。

## 2. 实施顺序

1. 注册 M7 六类对象、indexes、refs/version refs 与 profile；
2. 实现 STA Gate 0 + eligibility，禁止调用方自报 pass；
3. 实现 DDM 四态、新 ID + 直接 `supersedes_ref` 与三类 decision；
4. 实现 STO 三类 create-only artifacts；
5. 实现 GCB/GCD 确定性 batch/content/instance key 与 Product Gap 同 tuple gates；
6. 实现 GSEL 独立人工选择，并由 `geo-lifecycle` 创建新的 Goal/freeze CIS/Cycle 2；
7. 通过全新上下文 synthetic human Review 决定 strategy proceed、DDM factor 与 GSEL；
8. 跑通完整 Cycle 2，并证明不触发 strategy 时普通候选路径仍成立；
9. 稳定后由不同 max Agent独立对抗 QA。

## 3. 文件 ownership

- M7 high：`m7-record-types.schema.json`、`geo-strategy-discovery` scripts/libs/Skill、M7 fixtures/tests；
- 总 Lead：`object-contract.mjs`、`index-builder.mjs`、package/validator/docs、`geo-lifecycle` Cycle2 接线；
- M6 文件非必要不得修改；任何 M6/shared 改动使 M6 QA 失效，必须重跑受影响门；
- 独立 QA 只新增/运行红测与 Record，不直接修业务实现。

## 4. 停止条件

- 需要修改 approved Spec 0005 Product Gap 核心语义；
- strategy 自动触发、candidate Review/裸 Sample 被当作通过证据；
- Product Gap review tuple 与 strategy tuple 不同；
- Agent 自动选择 GSEL、自动批准 Goal/Claim/PRD；
- 需要真实账号、数据、外部系统或真实 MyyShop 写入；
- shared worktree 出现同目标文件无法归因修改。

## 5. 下一 Agent 第一动作

完整阅读 `AGENTS.md`、`docs/workflow.md`、本 Handoff、M6 Record、Spec 0008、Plan/Task；核对 checkout/HEAD/dirty；运行 M6 只读回归和四组 M7 红测。先确认失败仍只来自缺 M7 类型/API，再开始最小实现。
