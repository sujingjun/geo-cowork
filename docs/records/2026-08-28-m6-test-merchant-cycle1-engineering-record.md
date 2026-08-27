---
title: M6 测试商户 Analytics 与 Cycle 1 工程验收记录
status: verified
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/records/2026-08-27-m6-m8-sdd-approval-record.md
  - docs/records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
task_scope: synthetic/test_only Test Merchant、M6 Analytics、完整 Cycle 1、对抗 QA 与真实 MyyShop 只读回归；不含真实业务执行
---

# M6 测试商户 Analytics 与 Cycle 1 工程验收记录

## 1. 结论

M6 `synthetic/test_only` 测试商户工程范围已在稳定快照上通过独立 max QA，可标记为 `verified` 并进入 M7。该结论只证明本地工程能力，不证明真实 MyyShop Publication、Analytics、真实 GEO Cycle、业务效果、发布或部署。

## 2. 实际交付

- fail-closed Test Merchant 根身份、顶层 `test_scope`、`.invalid` locator 与真实/模拟双向污染防护；
- freeze/transition/review/strategy CIS 完整对象与 artifact bytes、create-only 恢复和历史 trace；
- multi-goal track、九阶段状态机、transition intent、真实 lock/CAS、stale takeover 与 revision fencing；
- fixture Analytics、ANO、BSIG、Measurement/Rule/Policy CIS pin、Observation → candidate Evidence 独立物化；
- `geo-lifecycle`、`geo-analytics` 两个公开 CLI 与 Skills；
- 完整 Cycle 1：两槽 Baseline → Diagnosis/Proposal → decided Adoption → confirmed `.invalid` Publication → Technical Retest → 两槽 Answer Retest → Analytics → fresh-process Review → completed trace；
- 缺门、all-rejected、恢复、并发、污染、policy 弱化、伪九门和伪 Review entry 负例。

M5 历史兼容保持：6 个历史 exploratory `sampling_count:3` Profile 只作 parse；所有正式/测试新运行固定 2 slot，ordinal 只允许 1/2。历史 M5 lease 的 revision 可缺，M6 lifecycle/analytics Run 必须有 revision。

## 3. Agent 分工与独立 Review

| 角色 | 配置 | 实际职责 |
| --- | --- | --- |
| 总 Lead | `gpt-5.6-sol/ultra` | shared schema/registry、Workspace 身份、M5 兼容、插件注册、集成与最终复验 |
| M6 实现 Agent | 新上下文 `gpt-5.6-sol/high` | M6 owned schema、runtime、CLI、Skills、fixtures 与作者测试 |
| Core 对抗 QA | 新上下文 `gpt-5.6-sol/max` | 28 项独立攻击测试；不修改业务实现 |
| Final M6 QA | 新上下文 `gpt-5.6-sol/max` | 19 项最终攻击、完整门禁、manifest 初末一致性与验收结论 |
| 窄合同 Review | 新上下文 `gpt-5.6-sol/xhigh` | M5/M6 两槽与 lease 历史兼容决策；不修改真实对象 |

作者绿测没有直接成为验收。Core QA 首次发现 freeze/gate 漂移、lease 绕过、Review cutoff 自报、Analytics/PII/Evidence fail-open 等 P0；Final QA 又发现伪九门、all-rejected 后伪发布、policy/CIS 不同源、multi-goal 丢轨、Analytics Run broken ref 等 P0。全部先固化为失败测试，再做最小修复。

## 4. 实际验证

| 命令 | exit | 结果 |
| --- | ---: | --- |
| `npm run test:m6-cycle` | 0 | 113/113 pass |
| `node --test tests/m6-final-*.test.mjs` | 0 | 19/19 final adversarial pass |
| `npm run validate:plugin` | 0 | M6 schema/scripts/libs/templates/Skills 均在显式 registry |
| `npm run check:docs` | 0 | 89 files / 159 links（本 Record 前） |
| `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects` | 0 | 328 canonical，零错误 |
| `node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check` | 0 | 328 objects / 120 legacy / 31 indexes / `written:[]` |
| `node plugins/geo-expert/scripts/answer-cycle.mjs validate --workspace workspaces/myyshop` | 0 | 零 error；11 个既有 Profile warning、40/100 Source 分类门保留 |
| `git diff --check` | 0 | 无 whitespace error |

Final QA 稳定快照：

- M6 scope 79 文件：`a960e16b2c00762abaf3293a3680efad4f5d5d05b97c43800359f6a4d57ada15`；
- dirty 102 文件：`b0bb20c7e15989f37e9a954774211097408823ad7b8871e3a94368fbfe5f6d86`；
- MyyShop 612 文件：`38d07b00df5b530c124d10a38c42305534c562e7dcf6856addc0ba4b990b46be`；
- 全仓 923 文件：`90b60b40adfca95d3a479609fb029b5a1b7d1c0d005fc52aa9e0b5ed1d808e9c`。

QA 前后哈希完全一致。Git 为 detached HEAD；未 commit、push、PR、deploy 或 release。

## 5. 未验证与下一步

- 当前完整 `npm test` 仍含 22 个预期 M7 红测；它们是下一里程碑输入，不属于 M6 回归；
- 未访问真实 GA4/GSC/CRM/CMS/消费者平台；
- 未建立真实 MyyShop 商户，未产生真实 Publication、Analytics 或业务效果；
- M7 必须先把现有 22 个红测转绿，再跑完整 synthetic Cycle 2；
- 任意后续 M6/shared 修改都会使本 QA 快照失效并要求重跑受影响检查。
