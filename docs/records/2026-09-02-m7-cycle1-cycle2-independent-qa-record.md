---
title: M7 synthetic Cycle 1 到 Cycle 2 独立 QA 记录
status: verified
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/prd/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/plans/2026-09-02-knowledge-independent-lifecycle-readiness-plan.md
  - docs/tasks/2026-09-02-knowledge-independent-lifecycle-readiness.md
scope: T06；同一 MyyShop online Merchant 与 development-test/test_only KBASE 下的 synthetic Cycle 1、Strategy/GSEL、Cycle 2 和旧 test_merchant runtime surface 清退
workdir: /Users/sujingjun/geo-cowork
baseline: main at 9b0a2c5b45868dc5b71e076e2a876c02dbca7e6b; cached HEAD...origin/main 0/0; dirty shared checkout; no fetch
---

# M7 synthetic Cycle 1 到 Cycle 2 独立 QA 记录

## 1. 结论

在本 Record 明示的 `synthetic_test` / `test_only` 工程范围内，独立 QA 结论为 `verified`：`P0=0`、`P1=0`，没有未解决的相关测试失败。

已实际跑通并复验：同一 `MER-MYYSHOP-001` 与 `KBASE-MYYSHOP-DEVTEST-001` 下的完整 synthetic Cycle 1、显式 Strategy 分支、独立人工 fixture 决定、GCB/GCD/GSEL、全新 freeze CIS 与完整 synthetic Cycle 2。此结论不证明真实 MyyShop 品牌知识、批准、Publication、消费者平台执行或业务效果。

## 2. 目标、成功标准与授权边界

- 目标：独立复核 Task T06，不修改产品实现；验证 M6/M7 专项、Cycle 1 到 Cycle 2 端到端链、人工门、恢复/污染负例与旧 `test_merchant` runtime surface 清退。
- 成功标准：相关测试全部通过；同一 Merchant + test-only KBASE scope 闭合；Cycle 2 必须由 decided Cycle 1 Review、decided GSEL、selected Candidate 与独立 Goal fixture approval 驱动；没有自动选择或自动批准。
- QA 可写范围：仅本 Record。
- 禁止并遵守：未联网、未调用真实 GA4/GSC 或其他第三方 API、未操作消费者 UI、未创建真实 Cycle/Claim/Evidence/批准/Publication、未 commit/push/PR/deploy/release。

## 3. Git 与运行基线

- Checkout：`/Users/sujingjun/geo-cowork`
- Branch：`main`
- HEAD：`9b0a2c5b45868dc5b71e076e2a876c02dbca7e6b`
- 本地缓存 remote 比较：`git rev-list --left-right --count HEAD...origin/main` 为 `0 0`；本次未 fetch，因此不把它解释为远端当前事实。
- Remote：`origin git@github.com:sujingjun/geo-cowork.git`（fetch/push URL 相同）；未执行任何远端操作。
- 工作区：dirty。创建本 Record 前一次观测为 98 个 tracked changes、31 个 nonignored untracked entries、其中 15 个 tracked deletions；收口观测为 100 个 tracked changes、32 个 nonignored untracked entries、其中 15 个 tracked deletions。期间集成负责人补齐包装与现行 Query Portfolio 文档，本 Record 是新增 untracked entry；其余既有改动不归因于本 QA。
- Runtime：Node `v22.14.0`，npm `10.9.2`。

## 4. 实际命令与结果

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run test:m6-cycle` | 0 | 113/113 pass；含完整 Cycle 1、九门、CAS/lease/recovery、Analytics、污染与真实 Workspace zero-write 负例 |
| `npm run test:m7-strategy` | 0 | 57/57 pass；含 Strategy Gate、DDM、GCB/GCD/GSEL、Cycle 2、trace、恢复与安全负例 |
| `node --test tests/m6-cycle-e2e.test.mjs tests/m7-cycle2-e2e.test.mjs` | 0 | 9/9 pass；显式重跑完整 Cycle 1 与完整 Cycle 2 E2E |
| `node --test tests/lifecycle-readiness.test.mjs tests/m6-test-knowledge-workspace.test.mjs` | 0 | 21/21 pass；单 online Merchant、test-only KBASE、scope、知识缺席语义和真实 Workspace zero-write |
| `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop-development-test --objects` | 0 | `ok:true`；0 missing/error/object_error/warning |
| `node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop-development-test --check` | 0 | 13 canonical objects、0 legacy、0 warning、`written:[]` |
| `GEO_M6_NETWORK_DISABLED=1 GEO_M7_NETWORK_DISABLED=1 node plugins/geo-expert/scripts/geo-lifecycle.mjs validate --workspace workspaces/myyshop-development-test` | 0 | Merchant/KBASE 可解析；0 error、0 warning |
| 以 `rg` 检查 active plugin/schema/scripts/skills、M6/M7 tests/fixtures 和 development Workspace，再以 `test ! -e` 检查四个旧路径 | 0 | `legacy_test_merchant_runtime_surface_absent=true` |
| `npm run validate:plugin`（首次） | 1 | 新增 `geo-readiness` 与 `geo-conformance` Skill 各缺 10 个标准正文小节；未指向 M7 runtime |
| `npm run validate:plugin`（集成侧补齐 Skill 后复跑） | 0 | `ok:true`；M6/M7/M8 schema、scripts、libs、Skills 与模板均进入包装检查 |
| `npm run check:docs` | 0 | 120 files / 183 links；0 error |
| `git diff --check` | 0 | 无 whitespace error |

## 5. 首次失败、修复与独立性

首次 `validate:plugin` 失败时，QA 未修改实现，而是将 20 条缺节 violation 交回集成负责人。集成负责人补齐两个新 Skill 后，QA 独立复跑为 `ok:true`。该失败已关闭，不作为 M7 runtime 缺陷掩盖，也不把首次失败省略。

本 QA 只创建本 Record；没有修改 runtime、schema、fixture 或测试来使结果转绿。测试使用临时 Workspace，并由测试清理；canonical development-test Workspace 的 index `--check` 证明没有派生写入。

## 6. 已验证范围

### 6.1 单 Merchant 与 KBASE 隔离

- development-test Workspace 使用唯一 online Merchant `MER-MYYSHOP-001`，Merchant 对象不带 `test_scope`。
- synthetic 对象的 `test_scope` 同时锁定 `merchant_ref`、`workspace_id` 与 `knowledge_base_ref`；跨 Workspace、缺 scope、伪装 extension、真实对象引用与真实 Workspace 写入均 fail closed。
- development-test KBASE 为 `KBASE-MYYSHOP-DEVTEST-001` / `mode:test_only` / `status:frozen`；本 QA 没有测试或执行自动转正。

### 6.2 Cycle 1 到 Cycle 2

- Cycle 1 从 freeze 开始，经九个显式 gate 到 decided Review；Analytics 与 Review 没有合并。
- Strategy 只能在 fixture human invocation 后执行；eligibility 从 pinned CIS 计算，不能由 plan 自报。
- Product Gap candidate 必须闭合同一 pinned Product Gap identity、decided/proceed STA、DDM `decision_factor` 与 STO；普通 candidate 不被迫进入 Strategy。
- GSEL draft 不自动选择；decided GSEL 对 Candidate 做唯一、互斥、无遗漏分区。Cycle 2 使用独立 Goal fixture approval，不能复用 Cycle 1 approval。
- Cycle 2 创建新 freeze CIS，再完整经过九门；缺 predecessor、selection、selected Candidate、独立 Goal approval、snapshot bytes 或 gate 时 fail loud。
- 三份 fixture 人工决定由 fresh Node process 的独立文件证据承载；它们只对 test-only 工程有效。

### 6.3 旧身份逻辑清退

Active runtime/Schema/Skill/M6-M7 test surface 未发现 `test_merchant`、`TMT-*`、`prepare-test-merchant` 或 `m6-test-merchant` 引用。以下路径实际不存在：

- `plugins/geo-expert/scripts/lib/m6-test-merchant.mjs`
- `plugins/geo-expert/assets/object-templates/test-merchant.md`
- `tests/fixtures/m6-test-merchant/`
- `tests/m6-test-merchant-isolation.test.mjs`

历史 Spec、Record、Handoff 与 Git 历史可保留旧术语；它们不等于当前 runtime 注册。现行 Query Portfolio Requirement/PRD/Spec/Architecture/Plan/Task 已由集成侧迁移到 online Merchant + development-test KBASE 术语，未改写历史 Record。

## 7. 未验证与不得外推

- 没有真实品牌知识切片；test-only Claim/Evidence/Knowledge Release 和 fixture approval 均不是 MyyShop 真实事实或批准。
- Workspace 中存在真实线上 locator/非凭据 Analytics 配置，只证明配置文件可被本地 validator 读取；不证明账号可用、数据已授权、GA4/GSC 读取成功或 Observation 已形成。
- synthetic `asset_publication` fixture 只承担状态机 gate，不是外部 Publication；未对任何真实页面、平台或业务系统写入。
- 未执行真实消费者平台采集或 UI 自动化，未绕过平台条款。
- Analytics/Business Signal 未被解释为 GEO 因果效果；没有验证真实业务提升。
- M8 Cross-host Conformance 由独立 Task/Record 验收，不由本 Record 代替。
- 未验证 commit、push、PR、merge、部署、发布或生产运行。

## 8. 风险与下一步

- 本结论针对当前共享 dirty checkout 的被测文件快照。若本 Record 后修改 M6/M7 runtime、schema、fixture 或 tests，必须重跑本节相关命令，不能沿用本结论。
- 最终 Knowledge-Independent Lifecycle Readiness 仍需由独立 M8 QA、完整 `npm test`、真实 Workspace 只读 Readiness 与最终验收 Record 收口；本 Record 的 docs/plugin 专项已通过，但不替代全项目最终验收。
