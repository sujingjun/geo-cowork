---
title: M7 Decision Dimension 状态机独立技术评审记录
status: verified
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-08-27-m6-m8-sdd-approval-record.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-sdd-approval-handoff.md
  - 2026-08-27 Owner 最新委派：由全新上下文独立技术人工 Review Agent 在 test-merchant engineering 范围内决定 DDM 窄 Spec 矛盾
scope: Spec 0008 Decision Dimension 状态机、decision 字段闭包、错误与红测要求；不是 MyyShop 业务批准
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
task_scope: 只修改 Spec 0008 的 DDM 相关合同，并补本 Record 与最小导航/交接链接；不修改代码、测试、其他 Spec、Runbook 或 Workspace
---

# M7 Decision Dimension 状态机独立技术评审记录

## 1. 评审结论

本次独立技术评审选择四态、单向、create-only 的最小一致状态机：

```text
candidate
→ validated | deprecated
validated
→ decision_factor | validated | deprecated
decision_factor
→ deprecated
```

删除 `validated → candidate`。candidate 只表示“尚未验证”；一旦已有人工 validation 结论，再回到 candidate 会抹去已发生的结论，违反审计和 create-only 历史要求。

每次推进都创建新 DDM ID，并用 `supersedes_ref` 指向直接前态；旧 DDM 保持原状态和原 bytes，不回写为 `superseded`。因此 DDM 的语义状态只保留 `candidate/validated/decision_factor/deprecated`，历史关系由对象链表示。

## 2. Decision 闭包

采用“一次状态推进只新增一个决定”的最小方案：

1. `candidate → validated/deprecated` 新增 validation decision；validated/rejected 分别映射两个目标状态。
2. `validated → decision_factor/validated/deprecated` 新增 factor decision；promoted 只进入 decision_factor，rejected 必须明确选择保留 validated 或进入 deprecated。
3. `decision_factor → deprecated` 新增 deprecation decision，显式记录已经成立的 factor 被退役。
4. 新对象携带 lineage 里已经成立的旧 decision 块；validation rejected、factor rejected 与 factor retired 都保留在新 ID 和 trace 中。

candidate 或 validated 阶段的 rejection 本身已经是该次推进的人工负结论，因此不再复制一个同义 deprecation decision。只有已经进入 decision_factor 后的退役需要独立 deprecation decision。这样既闭合 deprecated 的三条来源，又不增加重复人工门。

## 3. 选择理由

- 状态表示当前研究结论，decision 表示导致该结论的人类动作，两者一一可复验。
- `validated → validated` 不是原地停留，而是以新 ID 保存“维度仍成立，但本次 factor 判断被拒绝”的负结论。
- `validated → deprecated` 保存 validation accepted + factor rejected；`decision_factor → deprecated` 保存 validation accepted + factor promoted + deprecation decision，历史语义不会被终态覆盖。
- Product Gap 仍只读消费 Spec 0005 已 approved/open 且带人工 approval 的 Finding；本评审没有改变 Product Gap Schema、证据门或业务含义。

## 4. 实际修改

- Spec 0008：补 Review Record source；闭合四态图、decision 字段矩阵、新 ID/supersedes/create-only 规则、trace、错误码与红测要求。
- 本 Record：记录 Owner 委派、技术决定、理由、验证和范围边界。
- `docs/README.md` 与 Approval Handoff：只增加本 Review Record 的导航链接。

未修改代码、tests、Spec 0005/0007/0009、Plan、Task、Runbook 或 Workspace；未执行 commit、push、PR、部署或发布。

## 5. 实际验证

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run check:docs` | 0 | `ok:true`；87 files / 155 links；`errors: []` |
| `git diff --check` | 0 | 无输出，未发现空白错误 |

## 6. 明确边界

本 Record 的最终 `verified` 仅表示 Owner 委派范围内的 Spec 矛盾已形成自洽、可测试的技术合同并通过文档检查。它不是 MyyShop 业务批准，不证明真实 Decision Dimension、Product Gap、用户需要、产品投资结论、真实 Cycle 2、实现完成、发布或业务效果。
