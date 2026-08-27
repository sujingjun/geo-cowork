---
title: M6—M8 测试商户 SDD 准备记录
status: verified
created: 2026-08-27
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
  - docs/runbooks/geo-cowork-account-data-readiness.md
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
task_scope: 仅准备 proposed M6—M8 SDD、镜像用户提供 Runbook、最小导航与两槽文字一致性修正；不实现、不批准
---

# M6—M8 测试商户 SDD 准备记录

## 1. 任务目标与成功标准

目标：在当前独立 worktree 中基于实际源码、approved Spec 0005/0006、最终产品方案、Lead Handoff、M5 Handoff、MyyShop 状态/缺口材料与账号 Runbook，准备职责分离的 M6—M8 测试商户 SDD，并停在人工批准门。

成功标准：

1. 10 份指定 SDD 文件存在；实施类文件和 successor Handoff 保持 `proposed`。
2. Runbook 与主 checkout 用户新增文件字节一致，不改变其 `proposed` 状态。
3. `docs/README.md` 导航完整；最终产品方案第 7.2 节只把正式采样 3 次修正为 2 次。
4. `npm run check:docs` 与 `git diff --check` 实际通过。
5. 不产生代码、Schema、Skill、fixture、tests、业务对象或 Git 远端动作。

## 2. 开工 Git 基线

- 绝对 checkout：`/Users/sujingjun/.codex/worktrees/4910/geo-cowork`
- 分支：detached HEAD
- HEAD：`a5d8365cb124893e2a79154e27d84c7b73ffc58b`
- 本地 `HEAD...origin/main`：0/0；未 fetch
- 开工继承未跟踪文件仅：
  - `docs/handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md`
  - `workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md`
- 两份继承文件在本 SDD 任务中只读，未编辑、覆盖或归因于本任务。

## 3. 总 Lead 先行执行的继承基线

以下命令由总 Lead 在同一 checkout 实际执行；本 SDD Agent 继承结果，未冒充自己的复跑：

| 阶段 | 命令 | exit | 实际结果 |
| --- | --- | ---: | --- |
| 首次 | `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects` | 1 | 缺 `gray-matter` 模块，加载失败 |
| 首次 | `node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check` | 1 | 缺 `gray-matter` 模块，加载失败 |
| 首次 | `npm run check:docs` | 0 | 74 files / 136 links |
| 首次 | `npm run validate:plugin` | 1 | 缺 `ajv` 模块，加载失败 |
| 首次 | `npm test` | 1 | top-level output 35；11 pass / 24 fail，失败由 `ajv/gray-matter` 加载缺失导致 |
| 依赖恢复 | `npm ci --ignore-scripts` | 0 | added 15 packages；0 vulnerabilities；只写 Git ignored `node_modules` |
| 复跑 | `workspace-validate ... --objects` | 0 | Workspace ok |
| 复跑 | `build-index ... --check` | 0 | object_count 328、legacy_count 120、`written: []` |
| 复跑 | `npm run check:docs` | 0 | 74 files / 136 links |
| 复跑 | `npm run validate:plugin` | 0 | plugin ok |
| 复跑 | `npm test` | 0 | 112 tests；112 pass / 0 fail |

首次失败是 ignored `node_modules` 缺失造成的模块加载失败，不是产品代码缺陷。`npm ci --ignore-scripts` 只恢复本地依赖，不属于产品实现，也没有 tracked diff。

## 4. 实际修改

### 4.1 新增 SDD

- Requirement、PRD、Architecture；
- Spec 0007 Cycle/Analytics/Test Merchant；
- Spec 0008 Strategy/Cycle 2；
- Spec 0009 Cross-host/Engineering Candidate；
- Plan、Task、本文 Record、successor Approval Handoff。

全部实施类工件与 Handoff 保持 `proposed`；本文最终状态只可能证明“SDD 准备与文档检查”。

### 4.2 最小既有文档修改

- `docs/README.md`：保留主 checkout 新增的 Lead Handoff/Runbook/目录导航语义，并加入本轮 SDD 链。
- `docs/plans/2026-08-23-geo-cowork-final-product-plan.md`：第 7.2 节唯一语义修改为正式 Baseline/Retest 每平台×每 Query 2 次；没有改其他产品语义。

### 4.3 Runbook 镜像

从主 checkout 的 `/Users/sujingjun/geo-cowork/docs/runbooks/geo-cowork-account-data-readiness.md` 完整读取并通过 `apply_patch` 原样镜像到当前 worktree。来源文件 SHA-256 为 `66f5ef3ab762fa433065ebd224c3b7e421a77fbe5907a2885afe27991255b869`；未改写内容或状态。

## 5. 失败与修复

- 继承基线首次失败与依赖恢复见 §3；没有把缺依赖写成代码缺陷。
- 本 SDD 编写过程中发现并修订的合同冲突包括：核心 test scope 不放 extensions、Cycle 多 Goal 独立、Observation/Business Signal/Evidence 分离、M4 Product Gap ownership、GCD/GSEL 分离、WorkBuddy 无 native 包装、CIS 局部不可变历史、transition intent/CAS/session recovery/stable snapshot。
- 这些修订仍是 proposed 合同，不是实现修复或验证结果。

## 6. 本轮实际验证

| 命令 | exit | 实际结果 |
| --- | ---: | --- |
| `npm run check:docs` | 0 | `ok:true`；85 files / 151 links；errors 为空 |
| `git diff --check` | 0 | 无输出，tracked diff 无空白错误 |
| 对本任务 10 份 SDD + Runbook 执行尾随空白与 Tab 的 `rg` 检测 wrapper | 0 | 两项均无输出；新增 Markdown 未发现尾随空白或 Tab |
| `shasum -a 256 /Users/sujingjun/geo-cowork/docs/runbooks/geo-cowork-account-data-readiness.md docs/runbooks/geo-cowork-account-data-readiness.md` | 0 | 两份均为 `66f5ef3ab762fa433065ebd224c3b7e421a77fbe5907a2885afe27991255b869` |
| `shasum -a 256 docs/specs/0007-cycle-analytics-test-merchant.md docs/specs/0008-strategy-discovery-cycle-two.md docs/specs/0009-cross-host-conformance-engineering-release.md` | 0 | `0007=5fb49d7e…41e8f`、`0008=94da0669…30c9c`、`0009=93b9025f…fad52` |
| `git status --short` | 0 | tracked 修改仅 `docs/README.md` 与最终产品方案；新增 SDD/Runbook 为 untracked；两份继承 untracked 仍保留 |

本文 `verified` 只覆盖“SDD 文件已准备、Runbook 字节镜像、文档链接与 tracked diff whitespace 检查”。它不表示 Requirement/PRD/Spec/Plan/Handoff approved，也不表示任何 M6—M8 实现、测试或工程门通过。

### 6.1 最终 diff 范围

本任务修改：

- 新增 10 份指定 SDD；
- 新增用户提供 Runbook 的原样镜像；
- 修改 `docs/README.md` 导航；
- 修改最终产品方案第 7.2 节一行“3 次 → 2 次”。

本任务未修改 `plugins/`、`tests/`、`package.json` 或任何 `workspaces/myyshop` 业务对象。Lead Handoff 与缺口报告仍是继承未跟踪文件，不属于本任务修改。

## 7. 未验证与未执行

- Spec 0007—0009 尚未人工批准；
- 没有实现代码、Schema、Tool、Skill、fixture 或测试；
- 没有运行 M6/M7/M8 专项测试、双周期 E2E、真实宿主交互、session recovery 或 ERC；
- 没有建立真实 MyyShop 商户，未访问 GA4/GSC/CRM/CMS/消费者平台；
- 没有外部 Publication、真实 Analytics、两个真实 GEO Cycle或业务效果；
- 没有 commit、push、PR、deploy 或 release。

## 8. 当前授权结论

当前只允许把本 SDD 套件交给 Owner 审查。`check:docs` 或本文后续 `verified` 只证明 Record 所列文档检查，不批准 Spec，不证明实现或测试商户工程门通过。
