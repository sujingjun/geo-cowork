---
title: M8 Conformance 合同闭包独立技术评审记录
status: verified
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/records/2026-08-27-m6-m8-sdd-approval-record.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-sdd-approval-handoff.md
  - 2026-08-27 Owner 最新委派：由全新上下文 M8 窄合同技术 Review Agent 在 test-merchant engineering 范围内独立决定 CFP artifact 归属、Repository 三态快照与 Tool contract closure
scope: Spec 0009 的 CFP artifact 历史归属、Repository HEAD/index/worktree 稳定快照、Tool contract closure、对应错误与红测；不是业务或发布批准
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
task_scope: 只修改 Spec 0009 相关字段、算法、错误与红测，并补本 Record 与最小 README/Approval Handoff 链接；不修改代码、测试、其他 Spec、Runbook 或 Workspace
---

# M8 Conformance 合同闭包独立技术评审记录

## 1. 评审结论

本次独立技术评审在 Owner 已批准的 test-merchant engineering 范围内，选择以下三项最小闭包；它们只决定可实现、可复算的 M8 技术合同，不改变真实宿主、真实 MyyShop、业务批准或发布门。

### 1.1 CFP artifact 归属

CFP 增加 direct `profile_run_ref`，所有标为 Run-owned 的 Workspace/profile artifact 都必须属于该 Profile Run，并由 checksum 与 `conformance-profile-artifact-manifest/1.0.0` 完整闭包。repository pin 仍保持 repo-relative，不伪装成 Run output。

`profile_run_ref` 不 exact-pin Run version。Run 按既有生命周期升版不应让 frozen CFP 自失效；历史复验依赖 stable Run ID、create-only artifact path/bytes、CFP checksums、profile artifact manifest 与 sample Workspace CIS/manifest pins。artifact 缺失或 bytes 漂移仍 fail closed。

### 1.2 Repository 三态稳定快照

Repository manifest 升为 `geo-cowork-repo-manifest/2.0.0`，每个逻辑 path 独立保存 HEAD、index、worktree 的实际 path/mode/blob SHA-256，worktree 另存 size。路径集合取 HEAD tree、stage-0 index 与非 ignored untracked 的并集，因此 staged delete、staged rename 与 staged-only bytes/mode 都不会丢失。

状态只从 `git status --porcelain=v1 -z` 的 X/Y code 解析。只有 X/Y 为 rename/copy 时才消费第二个 NUL path，并强制 old/new/observed layer 条件；其他 row 不得误吞下一条 path。unmerged index fail closed。`dirty_path_manifest` 保留同一三态 identity，不再用工作树/HEAD 二态替代 index。

### 1.3 Tool contract closure

Tool closure 使用固定十个 roots：M6—M8 三个 Schema、四个 entry script 与三项 Skill。四个脚本递归解析 static import、re-export 与 literal relative dynamic import；非 literal dynamic import 直接失败。非 ESM import 的额外 Schema、模板、asset、policy、registry 必须显式 pin，运行时读取 closure 外 repository resource 失败。

roots、explicit pins、external specifiers 与 closure entries 全部按 UTF-8 bytes 排序，不使用 `localeCompare`；manifest fingerprint、ERC path+sha 与 `tool_contracts` 集合必须相互闭合。

## 2. 选择理由

- direct Run ref 保留 Spec 0003 的 stable Run ID + 可升版语义；artifact 的不可变性由 create-only path 与 bytes checksum证明，不需要引入会随 Run 升版漂移的 exact-version pin。
- HEAD/worktree 二态无法区分 staged-only change。index blob/mode 是 Git 待提交事实，必须作为独立状态参与快照和 stale 判断。
- 手写 Tool 文件清单会在共享库拆分或 runtime asset 增加时静默漏项。固定 roots + 递归 literal import + 显式 resource pins 把代码依赖和非代码依赖都变成可机检集合。
- 三项方案都以 fail-closed 为优先，不增加真实宿主适配、业务语义或发布授权。

## 3. 实际修改

- Spec 0009：补 Owner 委派与本 Review Record source；新增 `profile_run_ref`、profile artifact manifest 与 direct-ref 历史规则；冻结 Repository v2 三态 item、NUL rename/copy 算法和 staged-only 判定；冻结 Tool contract manifest roots/递归 closure/显式 pins/UTF-8 排序；补对应错误与失败测试要求。
- 本 Record：记录独立技术决定、理由、范围与验证。
- `docs/README.md` 与 Approval Handoff：只增加本 Review Record 的导航链接。

未修改代码、tests、Spec 0001—0008、Plan、Task、Runbook 或 Workspace；未执行真实宿主交互、真实账号/数据访问、commit、push、PR、部署或发布。

## 4. 实际验证

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run check:docs` | 0 | `ok:true`；89 files / 159 links；`errors: []` |
| `git diff --check` | 0 | 无输出，未发现 tracked diff 空白错误 |

## 5. 明确边界

本 Record 只评审 test-merchant engineering 的 M8 机器合同。它不证明 Codex、Claude Code 或 WorkBuddy 中国区真实宿主运行，不证明真实 MyyShop 商户、真实 Publication/Analytics、两个真实 Cycle、业务效果、ERC reviewed、v1 Release 或 production ready，也不构成业务、发布、部署或 Git 远端批准。
