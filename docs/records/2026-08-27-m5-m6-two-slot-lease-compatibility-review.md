---
title: M5→M6 两槽与 Lease 兼容性技术复核
status: verified
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/records/2026-08-27-m6-m8-sdd-approval-record.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - plugins/geo-expert/schemas/m5-record-types.schema.json
  - plugins/geo-expert/schemas/m6-record-types.schema.json
  - plugins/geo-expert/scripts/lib/object-contract.mjs
  - plugins/geo-expert/scripts/lib/answer-profile.mjs
  - plugins/geo-expert/scripts/lib/m6-profile.mjs
  - workspaces/myyshop/indexes/collector-profiles.json
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b；工作树在本复核前已有 M6—M9 实现与文档未提交改动；未 fetch
task_scope: Owner 委派的 M5→M6 两槽与 lease 窄合同技术决策；只改 Spec 0007、Plan、Task、Record 与最小导航/Handoff；不改代码、测试、真实 Workspace 或其他业务合同
---

# M5→M6 两槽与 Lease 兼容性技术复核

## 1. 复核结论

采用分层兼容，而不是追溯性收紧基础 Schema：

1. M5 Collector Profile 基础 Schema 保留 `sampling_count: [2, 3]`，仅用于解析获批两槽协议之前的历史 exploratory 对象。
2. approved Spec 0006 的正式协议仍是两个独立 slot。M5 `baseline/post_change_retest`、M6 test profile 和所有新 Collector Profile/materializer 必须由语义 validator 强制 `sampling_count: 2`；历史 3 不得进入 Baseline、Retest、Answer Aggregation 或 Cycle。
3. Answer Sample 与 M5 Run `sample_slots` 的 ordinal 永远只允许 1、2；历史 Profile 的 3 不是第三个 Sample slot。
4. M5 基础 Run Schema 在既有 lease nested contract 中增加可选正整数 `revision`，以兼容没有 revision 的历史 M5 Run。
5. M6 Schema 不重新声明 `run.properties.lease`。M6 profile 仅对 `skill: geo-lifecycle | geo-analytics` 的 Run 强制 `lease.revision` 与其他 M6 字段；历史 `geo-answer-cycle` Run 不被追溯纳入 M6 profile。

这是 test-merchant engineering 范围的技术合同复核，不是 MyyShop 业务批准、真实采集授权、M6 实现验收或发布决定。

## 2. 真实 Workspace 反例与机制证据

### 2.1 两槽兼容

真实 `workspaces/myyshop` 的 11 个 Collector Profile 中，有 6 个历史 exploratory Profile 保存 `sampling_count: 3`：ChatGPT manual smoke、Gemini manual smoke、Google AI manual smoke、Claude manual smoke、Claude US manual smoke 与 Perplexity user export。它们均早于后续正式英文两槽 Baseline，必须保留为不可变审计历史。

因此基础 Schema 若改成 `const: 2`，会让这 6 个对象在 base graph parse 阶段失败。保留 `[2,3]` 只解决读取兼容；正式两槽 Profile 仍由 `language_contract`/formal plan/profile validator 与 materializer 强制 2，Sample/Run ordinal Schema 只允许 1、2。

### 2.2 Lease 兼容

真实 Workspace 有 7 个历史 M5 Run frontmatter 含 lease，但均没有 `lease.revision`。`object-contract.mjs` 对同名类型 properties 做浅合并；若 M6 Schema 重新声明 nested `run.lease` 并把 revision 设为必填，后注册定义会整体覆盖 M5 lease，导致历史 `geo-answer-cycle` Run 在 base graph parse 阶段失效。

最小兼容是只在 M5 基础 lease 增加可选 `revision`，不由 M6 Schema 覆盖 nested lease；M6 的运行期强约束留在 `m6-profile.mjs`，按 Run `skill` 精确路由。

## 3. 必需红测

- 基础 Schema 对真实 6 个 `sampling_count:3` Profile 保持可读；formal/M6 test profile 与所有新 materializer 输入 3 时失败。
- `sampling_count:3` Profile 不能进入 Baseline、`post_change_retest`、Answer Aggregation 或 Cycle。
- Answer Sample ordinal 3 和 M5 Run `sample_slots.ordinal:3` 在基础 Schema 失败。
- 没有 lease revision 的历史 `geo-answer-cycle` Run 可被基础 Schema 解析。
- M6 Schema 不得含 nested `run.properties.lease` 覆盖；`geo-lifecycle/geo-analytics` Run 缺 revision 时由 M6 profile 以 `M6_FIELD_REQUIRED` 失败，revision 为正整数时才可继续。
- 兼容修复后必须复跑真实 MyyShop `workspace-validate --objects`、`answer-cycle validate` 与 index `--check`，不得修改真实 Workspace bytes。

## 4. 实际验证

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `rg -l '^sampling_count: 3$' workspaces/myyshop/cycles/m5/profiles` | 0 | 精确找到 6 个历史 exploratory Profile |
| `rg -l '^lease:$' workspaces/myyshop/runs/*/run.md` 与 revision 复核 | 0 | 精确找到 7 个历史 M5 lease；均无 `revision` |
| `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects` | 0 | `ok:true`；328 个对象的 base graph 无 error/warning |
| `node plugins/geo-expert/scripts/answer-cycle.mjs validate --workspace workspaces/myyshop` | 0 | errors 为空；11 个已知 Profile warning 与 `SOURCE_CLASSIFICATION_DEFERRED(40/100)` |
| `node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check` | 0 | 328 objects、legacy 120、31 indexes、`written: []` |
| `node --test tests/m6-schema-profile.test.mjs tests/m5-run-recovery.test.mjs` | 0 | 8/8 通过；覆盖历史 sampling 3 parse、正式两槽 ordinal、M6 profile required 与 M5 lease 恢复 |

文档修改后的 `check:docs` 与 `git diff --check` 结果见下一节收口；本复核未通过写命令改动真实 Workspace。

## 5. 已验证边界与未验证项

已验证的是：权威 Spec 与实际 graph 的冲突原因、最小兼容方向、现有专项测试与真实 MyyShop 只读回归在当前工作树通过。

未验证且不由本 Record 推出：M6 lifecycle/analytics 完整实现、CAS 并发正确性、真实 Analytics、真实 MyyShop Cycle、人工 Review、业务效果、commit、push、PR、deploy 或 release。后续任何代码或测试修改都会使本次运行证据不再代表新快照，必须按 Plan 重跑受影响检查。

## 6. 文档收口验证

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run check:docs` | 0 | `ok:true`；89 files / 159 links；`errors: []` |
| `git diff --check` | 0 | 无输出，未发现空白错误 |
