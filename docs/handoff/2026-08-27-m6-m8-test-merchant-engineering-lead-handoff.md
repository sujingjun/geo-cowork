---
title: M6—M8 测试商户系统工程闭环总 Lead 交接
status: proposed
created: 2026-08-27
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/handoff/2026-08-26-m5-baseline-closeout-and-knowledge-optimization-handoff.md
  - workspaces/myyshop/STATUS.md
  - workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md
  - 2026-08-27 当前用户指令：先以独立测试商户、MyyShop 脱敏内测结构和已批准定位完成系统工程闭环，允许适当模拟数据；工程完成后再由用户建立真实 MyyShop 商户进行内部测试
  - 2026-08-27 当前用户指令：由 gpt-5.6-sol ultra 担任总 Lead，委派不同推理档位的 gpt-5.6-sol 子 Agent，最后由总 Lead验收
scope: M6—M8 测试商户范围的 SDD、实现、验证、跨宿主一致性与总 Lead 验收；不建立真实 MyyShop 商户
---

# M6—M8 测试商户系统工程闭环总 Lead 交接

## 1. 唯一目标

由 `gpt-5.6-sol`、Codex `ultra` 推理档位担任总 Lead，在独立工作树中完成：

> 以 `geo-cowork` 最终产品方案为目标，使用独立测试商户、用户已批准的 MyyShop 定位语义、脱敏内测数据结构和显式模拟数据，完成 M6 Analytics + Cycle 1、M7 Strategy Branch + Cycle 2、M8 Cross-host Conformance 的系统工程闭环；总 Lead 负责拆解、委派、集成、独立红测和最终验收。

本目标只完成“测试商户范围的系统工程闭环”。完成后由用户另行建立真实 MyyShop 商户并启动真实内部测试；不得提前创建或伪造真实 MyyShop 商户、Evidence、业务批准、外部 Publication、Analytics 观察或业务效果。

## 2. 开场必做

总 Lead 的第一轮必须：

1. 阅读根 `AGENTS.md` 与 `docs/workflow.md` 全文；
2. 阅读本 Handoff、最终产品方案、最新 M5 Handoff、`workspaces/myyshop/STATUS.md` 和内容/证据缺口报告；
3. 核对绝对工作目录、分支、HEAD、上游 ahead/behind、dirty/untracked 状态；
4. 运行当前只读基线，不改写 indexes：

   ```bash
   node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
   node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
   npm run check:docs
   npm run validate:plugin
   npm test
   ```

5. 记录任何基线失败；不得把继承改动归因于本任务，不得 reset、覆盖或整理无关内容；
6. 先完成 M6—M8 SDD 套件并停在 Spec 人工批准门；未经用户看到并明确批准新增 Spec，不进入相应实现。

## 3. 当前基线

- 主仓：`/Users/sujingjun/geo-cowork`
- 创建 Handoff 时分支：`main`
- 创建 Handoff 时 HEAD：`a5d8365cb124893e2a79154e27d84c7b73ffc58b`
- 本地追踪状态：`HEAD...origin/main = 0/0`，未在本任务中 fetch
- 创建 Handoff 前已知未跟踪文件：`workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md`
- M2—M5 已完成既定本地工程验收；M5 真实两槽英文 Baseline 已存在，但 10 个 Review 仍为 candidate，Source 为 40/100，真实 Claim Support、Publication、post-change Retest 和 Analytics 仍未完成。
- `geo-lifecycle`、`geo-analytics`、`geo-strategy-discovery` 与 M6—M8 详细 SDD 当前不存在。
- 最终产品方案第 7.2 节仍残留“3 次采样”，但 approved Requirement/PRD/Spec 0006、最终方案头部和 M5 里程碑均已冻结为两个独立 slot；本任务应做最小一致性修正为 2，不改变其他 M5 语义。

## 4. 测试商户与真实 MyyShop 隔离合同

### 4.1 两个环境

```text
测试商户 Workspace
→ 证明系统工程能力
→ 允许 synthetic/test_only 数据
→ 不构成 MyyShop 事实

真实 workspaces/myyshop
→ 保留现有真实材料和业务对象
→ 不写模拟 Claim/Evidence/批准/效果
→ 工程闭环完成后才由用户建立真实商户内部测试
```

### 4.2 测试商户约束

- 业务演示可称“MyyShop 内测商户”，canonical fixture 必须使用独立测试 Workspace ID、测试 namespace 和清晰的 `synthetic/test_only` 标记。
- 测试品牌身份不得冒充真实 MyyShop 法定实体；需要 Schema 中可解析的虚构标识和 `.invalid` locator。
- 可采用用户提供的 MyyShop 当前定位语义作为测试合同，但必须标注为“用于测试的语义投影”，不能成为真实 MyyShop 新 Claim。
- 允许使用脱敏后的数据形状和已公开/已授权结构；不得读取或保存凭据、账号标识、Cookie、`.env`、真实个人数据或未授权企业数据。
- 可模拟：产品能力矩阵、Evidence、案例、Adoption、Publication、Technical Retest、Answer Retest、GA4/GSC/业务事件与 Cycle Review。
- 每个模拟对象必须可从 ID、状态、来源或扩展字段看出 test-only；fixture 结果不得进入真实业务指标分母。
- synthetic approval 只允许存在于 fixture，用于验证状态机和 validator；不得复制到真实品牌对象。

## 5. 三道完成门

| 门 | 可以由本目标完成 | 不得冒充 |
| --- | --- | --- |
| 测试商户工程门 | M6—M8 功能、异常、恢复、跨宿主确定性验证 | 真实 MyyShop 业务批准或效果 |
| 真实 MyyShop 内测门 | 本目标只准备接入能力和 Runbook | 用户尚未建立的真实 MyyShop 商户测试 |
| v1 正式完成门 | 本目标可准备 Release Candidate 工件 | 最终方案要求的两个真实 MyyShop GEO Cycle、真实 Publication/Analytics 与 v1 Release |

状态仍只使用仓库既定状态；通过 `scope` 和 Record 明确“test merchant engineering”，不得新增 `engineering_complete`、`released` 等伪状态词。

## 6. 总 Lead 委派合同

### 6.1 允许的子 Agent 配置

用户已明确要求使用 `gpt-5.6-sol` 的不同推理能力。总 Lead 可按以下工作包委派，模型固定为 `gpt-5.6-sol`：

| 工作包 | 建议推理档位 | 职责 |
| --- | --- | --- |
| SDD 与合同审查 | `xhigh` | Requirement、PRD、Architecture、Specs、Plan、Tasks；发现契约冲突 |
| M6 生命周期与 Analytics | `high` | Cycle 状态、版本冻结、观察导入、模拟 Analytics、Review |
| M7 战略分支与 Cycle 2 | `high` | 人工触发、Decision Dimension、Product Gap、Cycle 2 选择 |
| M8 一致性与对抗验收 | `max` | 跨宿主、红测、安全、确定性、伪造/污染负例、最终 QA |

总 Lead 保持 `ultra`，负责全局上下文、依赖顺序、设计取舍、集成和最终结论。子 Agent 不得自行批准 Spec、发布、commit、push、PR、部署或扩大授权。

### 6.2 并行规则

- 最多并行处理真实独立、文件范围不重叠的工作；共享同一工作树时，明确每个 Agent 的目标文件和禁止触碰范围。
- SDD Agent 可以先行；M6/M7/M8 实现必须等待对应 Spec 获得用户明确批准。
- M6 是 M7 的输入，M6/M7 是 M8 旅程验收的输入；不得用并行名义跳过依赖。
- 每个子 Agent 必须回报：目标、实际修改、验证命令/退出码、失败与修复、未验证项、Git diff 范围。
- 总 Lead 必须逐项复核子 Agent 修改，不接受“已完成”自述或作者自己的绿测作为独立验收。
- 最终 QA 必须在所有实现修改稳定后运行；任何后续改动都会使旧 QA 失效并要求重跑受影响检查。

## 7. 必需 SDD 工件

总 Lead 先创建以下 proposed 工件，并保证职责分离：

1. `docs/requirements/2026-08-27-m6-m8-test-merchant-engineering-closure.md`
2. `docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md`
3. `docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md`
4. `docs/specs/0007-cycle-analytics-test-merchant.md`
5. `docs/specs/0008-strategy-discovery-cycle-two.md`
6. `docs/specs/0009-cross-host-conformance-engineering-release.md`
7. `docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md`
8. `docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md`

同时更新 `docs/README.md` 导航，最小修正最终产品方案的 2-slot 冲突，创建窄范围 SDD Record，并在等待 Spec 批准时更新本 Handoff 或创建 successor Handoff。

Spec 至少定义：

- 新 canonical 类型、ID、状态机、refs、version pin、indexes 和 trace；
- Test Merchant identity、synthetic provenance、真实 Workspace 污染防护；
- Cycle 创建、冻结、阶段推进、恢复、supersede、Review 与结果边界；
- Analytics Observation 与 Evidence Snapshot 的严格分离；
- GA4/GSC/业务事件的 fixture adapter 和未来 read-only connector seam；
- Adoption、Publication、Technical Retest、Answer Retest 的独立门；
- strategy Skill 仅人工触发、决策维度生命周期和 Product Gap 证据门；
- Cycle 1 → Cycle 2 的确定性候选生成与人工选择；
- Codex/Claude Code/WorkBuddy 的相同 Workspace/Tool 语义；
- redaction、secret marker、path/symlink、create-only artifact、并发、恢复和故障注入；
- 测试商户工程验收与真实 MyyShop/v1 完成门的分离。

## 8. 实现工作包

用户批准 Specs 后，按以下顺序最小实现。

### WP-M6：Cycle 与 Analytics 工程闭环

- 实现 `geo-lifecycle` 与 `geo-analytics` Skill；
- 增加 Cycle/Goal 版本冻结和阶段推进 Tool；
- 增加 Analytics Observation、业务信号、Cycle Review 等必要合同；
- 提供纯本地 fixture adapter，不连接真实 GA4/GSC/CRM；
- 跑通 Baseline → Gap/Proposal → synthetic Adoption/Publication → Technical Retest → Answer Retest → Analytics → Cycle Review；
- 覆盖非法顺序、版本漂移、输入变化、重复调用、恢复和污染防护。

### WP-M7：战略分支与第二周期

- 实现 `geo-strategy-discovery`，只允许显式人工触发；
- 实现 trigger check、Decision Dimension、Product Gap/opportunity 与 PRD/validation plan 输出；
- 从 Cycle 1 Review 生成可解释的 Cycle 2 Goal candidates，由 fixture human decision 选择；
- 跑通完整 Cycle 2，并证明不调用 strategy Skill 时主线仍可运行；
- 不把模型输出、单次答案或竞品陈述自动升级为产品事实或 Approved Claim。

### WP-M8：跨宿主与工程 Release Candidate

- 增加 Codex、Claude Code、WorkBuddy 中国区 conformance fixtures/检查；
- 相同确定性输入必须产生相同 index、Finding、trace、Cycle 结果和 diagnostics；
- 补齐 capability matrix、delegation contract、安全脱敏、sample workspace、Runbook、two-cycle engineering retrospective；
- 生成 scope 明确的 Release Candidate Record，状态不得表示真实 v1 已发布；
- 证明新 Session 不依赖原聊天即可从 Workspace/Handoff 恢复。

## 9. 验收测试矩阵

总 Lead 必须要求先有失败测试，再做最小实现，并至少覆盖：

- 正常双周期旅程；
- 缺批准、缺版本、缺 refs、缺 Analytics、缺 Publication、缺 Retest；
- synthetic 对象尝试引用真实 MyyShop、真实对象尝试引用 synthetic fixture；
- fixture approval/Observation 尝试进入真实 Claim、Knowledge Release 或业务分母；
- 重复调用、并发冲突、进程中断、stale lock、resume、supersede；
- path escape、symlink、secret marker、凭据/个人信息泄漏；
- Cycle 2 未引用 Cycle 1 Review、未经人工选择、strategy 自动触发；
- Analytics Observation 被误当因果或 Evidence；
- Publication checkbox 被误当真实外部发布；
- 子宿主输出漂移、缺 capability、unsupported capability 静默降级；
- 任意工程绿测被错误表述为真实 MyyShop/v1 完成。

## 10. 总 Lead 最终验收

最终验收必须由总 Lead在稳定快照上执行，不依赖实现 Agent 自述。至少运行：

```bash
npm run check:docs
npm run validate:plugin
npm test
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
git diff --check
```

新增专项脚本和测试命令由新 Plan/Tasks 明确；总 Lead 必须另外运行：

- M6/M7/M8 全部专项测试；
- 测试商户完整双周期端到端旅程；
- synthetic/real 污染负例；
- 跨宿主确定性复验；
- 安全、脱敏和恢复故障矩阵；
- final adversarial review。

最终报告必须包含：

1. 绝对 checkout 路径；
2. 分支、HEAD、上游 ahead/behind、dirty/untracked；
3. 各子 Agent 身份、模型档位、任务与实际结果；
4. 首次失败测试及最小修复；
5. 全部命令、退出码和测试数量；
6. 已验证范围与未验证边界；
7. 明确结论只能是“测试商户范围的系统工程闭环是否通过”；
8. 真实 MyyShop 商户、两个真实 Cycle、外部 Publication、真实 Analytics、业务效果、commit/push/PR/deploy/release 仍分别列为未执行或待授权。

## 11. 授权边界

当前用户授权：

- 在独立工作树内读取仓库、创建 SDD、实现本地代码、使用脱敏 fixture/模拟数据、运行本地测试、更新 Record/Handoff；
- 总 Lead 使用 `gpt-5.6-sol` `ultra`，并委派 `gpt-5.6-sol` `high/xhigh/max` 子 Agent；
- 使用独立测试商户完成系统工程闭环。

当前未授权：

- Agent 自行批准新 PRD/Spec；
- 建立真实 MyyShop 商户或把测试商户转成真实商户；
- 读取未授权真实企业/用户数据、凭据、账号状态或 `.env`；
- 访问真实 GA4/GSC/CRM、消费者平台或其他外部系统；
- 自动发布站点、CMS、媒体、Schema、llms、PR 或社交内容；
- commit、push、创建 PR、merge、部署、release 或切换流量；
- 将工程验收表述为真实 MyyShop 内测、两个真实 Cycle、v1 完成或业务效果。

## 12. 停止条件

遇到以下情况必须停止受影响工作并保留可复验输出：

- 新 Spec 尚未得到用户明确批准；
- 测试数据与真实 MyyShop Workspace 无法可靠隔离；
- 需要真实账号、凭据、未授权数据或外部写入；
- 现有 approved Spec 与新设计发生实质冲突；
- shared worktree 出现无法归因的同文件并发修改；
- refs/checksum/secret/path/symlink 校验失败；
- 要完成声明必须依赖真实 Publication、真实 Analytics 或真实业务决定。

## 13. 完成后的下一棒

测试商户工程闭环通过后，只准备一份真实 MyyShop 内测启动清单和 Handoff。由用户建立真实 MyyShop 商户、确认数据与权限、指定事实 Owner/Approver，再启动真实内部测试；不得由本 Lead 自动跨越该边界。
