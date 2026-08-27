---
title: Owner M7 / Circle 1 阶段目标调整记录
status: verified
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md
  - docs/runbooks/m6-test-merchant-internal-review.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - 2026-08-28 Owner 最新指令：最终目标调整为完成 M7、确保 Circle 1 可跑通；先人工内测，确认后再进行后续 M8 Strategy Discovery 与 Circle 2
scope: 当前阶段唯一终点、后续工作 deferred 边界与里程碑名称解释；不批准真实系统访问
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
---

# Owner M7 / Circle 1 阶段目标调整记录

## 1. 最新决定

本阶段唯一终点调整为：完成当前 M7 工程收口，证明独立 `synthetic/test_only` 测试商户的 Circle 1 可从空目标路径生成、通过对象校验与 lifecycle trace，并交给 Owner 人工内测。

在 Owner 提交 Circle 1 人工内测结论并再次明确授权前，以下事项全部 `deferred`：

- Strategy Discovery 的真实工程验收；
- decided Strategy Assessment、Decision Dimension、Strategy Output 的本阶段结论；
- GCB/GCD/GSEL 与 Circle 2；
- M8 Cross-host Conformance；
- 真实 MyyShop 商户、真实 GA4/GSC/CRM/CMS/消费者平台访问；
- commit、push、PR、merge、deploy、release。

## 2. 里程碑名称解释

原最终产品计划把 `M7` 定义为 Strategy Branch + Cycle 2，把 `M8` 定义为 Cross-host Conformance。Owner 本次把当前阶段口径收缩为“M7 / Circle 1 人工接管”，并把 Strategy Discovery + Circle 2 称为后续 M8 工作。

为避免改写历史：

- 原 Plan/Spec/T07—T12 的文本与编号保留；
- 本 Record 是当前执行控制面的优先级更高补充；
- 本阶段的 `M7 complete` 只表示 Circle 1 工程/人工接管门完成，不表示原 Plan 的 Strategy/Cycle 2 M7 已完成；
- 下一阶段启动前必须先依据 Owner 内测反馈重新定基线，明确后续 M8 是否同时包含 Strategy/Cycle 2 与 Cross-host Conformance。

## 3. 已产生但停用的后续现场

范围调整前已产生 M7 Strategy/Cycle 2 的 proposed Schema、模块、fixtures/tests、模板与局部 CLI 接线。它们保留在 dirty worktree 作为后续现场，不 reset、不冒充当前验收，不进入 Circle 1 成功结论；任何后续复用必须重新运行红测、完整旅程和独立 QA。

## 4. 当前验收标准

1. `npm run test:m6-cycle` 全绿；
2. M6 final adversarial tests 全绿；
3. plugin/docs、MyyShop 只读 validate/index/answer/diff checks 不回归；
4. 从全新目标路径运行 `tests/manual/m6-internal-review.mjs`，输出 completed/full/synthetic/no real impact/no network；
5. 新生成 Workspace 再通过 `workspace-validate --objects` 与 `geo-lifecycle trace`；
6. 全新 gpt-5.6-sol max 上下文在稳定 Circle 1 manifest 上独立红测，无 P0；
7. 形成 verified 人工接管 Handoff，明确所有 deferred 门。

本 Record 不证明真实 MyyShop、真实 Publication/Analytics、真实 Circle、业务效果、Strategy、Circle 2、跨宿主、发布或部署。
