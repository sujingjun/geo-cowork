---
title: M6—M8 测试商户系统工程闭环 PRD
status: approved
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/requirements/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: 测试商户的双周期产品体验、业务规则、验收与非目标；不定义代码、Schema 或命令
---

# M6—M8 测试商户系统工程闭环 PRD

## 1. 产品问题

最终产品方案要求 MyyShop 完成两个真实 GEO Cycle 后才达到 v1 完成门，但当前真实 Workspace 仍缺业务材料、发布链和 Analytics 授权。研发负责人需要先证明系统能够安全、可恢复地运行完整双周期，同时清楚看到哪些结果只是模拟、哪些门仍须真实业务完成。

## 2. 核心用户

- 核心用户：MyyShop 当前研发负责人，负责查看测试商户的完整旅程、在人工门作选择并判断是否进入真实内测准备。
- 协作用户：GEO 运营、品牌/产品/数据/法务事实负责人，未来在真实商户阶段提供材料、批准与只读数据权限；本轮只验证其决策点是否被正确保留。

## 3. 产品目标

1. 用独立测试商户展示从冻结输入到 Cycle Review 的完整 Cycle 1。
2. 由 Cycle 1 Review 生成可解释的 Cycle 2 候选，并让用户显式选择后完成 Cycle 2。
3. 展示 Analytics Observation、Evidence、Publication、Answer 变化和业务结果互不替代。
4. 在 Codex、Claude Code 及 WorkBuddy 中国区允许的边界内，给出可复验的一致性与 fail-loud 结果。
5. 生成范围清楚的测试商户工程验收材料，为真实 MyyShop 商户内测提供前置依据，但不越过真实门。

## 4. 用户旅程

### 4.1 建立测试商户

用户看到独立测试 Workspace 身份、`.invalid` locator、`synthetic/test_only` 标记和与真实 MyyShop 隔离的说明。系统拒绝真实 Workspace 路径、真实 locator、真实账号标识或缺少测试 provenance 的输入。

### 4.2 运行 Cycle 1

1. 用户确认用于测试的语义投影和测试批准。
2. 系统冻结 Goal、Query Set、Knowledge Release、Asset、采样与测量口径版本。
3. 系统依次记录 synthetic Baseline、Gap/Proposal、fixture Adoption、fixture Publication、Technical Retest、Answer Retest 和 Analytics Observation。
4. 任一阶段缺少前置或版本漂移时停止并指出缺口，不把后续阶段伪装为完成。
5. 用户查看 Cycle Review，看到观察结果、局限、未支持的因果说法和下一周期候选来源。

### 4.3 人工选择 Cycle 2

系统从 Cycle 1 Review 按稳定规则生成候选，显示每个候选的来源、优先理由、证据缺口和风险。用户必须显式选择、拒绝或推迟；没有人类决定时 Cycle 2 不启动。

若 M4 已用双证据和人工 approval 确认 `open` Product Gap，用户可显式调用战略发现，让 M7 消费该 Gap 并查看 eligibility、Decision Dimension、机会分析、PRD 草案与人工验证计划；M7 不创建或确认 Product Gap。未调用时，普通 GEO 主线与非战略 Cycle 2 候选不受影响。

### 4.4 运行 Cycle 2 与查看工程候选结论

Cycle 2 使用所选目标重新冻结输入并完成同样的阶段链。用户最终看到：

- 两个测试 Cycle 的可追溯对象链；
- 每个阶段的版本、refs、观察和人工决定；
- 安全、恢复、污染负例与跨宿主差异；
- “测试商户工程门”是否通过；
- 真实 MyyShop、真实数据、真实发布、两个真实周期和 v1 Release 仍待执行的清单。

## 5. 业务规则

### 5.1 测试身份与数据

- 测试商户可使用 MyyShop 已批准定位的语义投影，但所有对象必须可辨认为测试数据。
- fixture approval 只证明状态机能够处理人类决定，不是 MyyShop Owner、法务、产品或数据批准。
- synthetic 结果不进入真实 Workspace、真实 Source/Evidence/Claim、真实 Analytics 指标或 v1 分母。
- 任何真实与 synthetic 双向引用都视为污染并阻断当前动作。

### 5.2 Cycle 与版本

- Cycle 启动后，冻结集合不能原地改变；变化必须保留旧 Cycle/Run 并创建 superseding 对象。
- 阶段只能按合同推进；重复相同动作幂等，输入不同则显式冲突。
- `completed` 只说明该 Cycle 的合同步骤完成，不表示结果为好、已发布或产生业务改善。

### 5.3 Analytics 与 Evidence

- GA4、GSC、服务端或模拟业务事件首先都是 Observation。
- Observation 不自动成为 Evidence；只有满足口径、来源、时间窗、snapshot、checksum、Scope 和人类审核的新对象才能承担 Evidence 角色。
- 观察到访问或注册信号不等于内容变更造成该结果。

### 5.4 战略分支

- 战略发现只能由用户主动调用；系统不得根据低分、单次答案或竞品说法自动触发。
- Decision Dimension 与 Cycle 2 Goal 选择都有独立人工门；Product Gap 的双证据与人工确认门属于 M4，M7 只 version-pin 消费。
- 战略输出只提供建议，不自动批准 Claim、产品 PRD、研发预算或发布。

### 5.5 宿主一致性

- Codex、Claude Code 以已适配包装执行相同能力；缺 capability 必须明确失败。
- WorkBuddy 中国区当前只验证 test-only 语义 fixture 和人工配置说明能否保持合同，不宣称插件包装或真实宿主运行通过。
- packaging static、direct shared Tool 与 native interactive 是不同 tier；低 tier 通过不能冒充真实交互宿主验收。
- 环境差异必须列出，不能把不可比输出强行判为一致。
- 全新 Session/进程不使用原聊天，只凭 checkout、sample Workspace 与 Handoff恢复当前 stage、next action 和 trace/index digests；依赖聊天记忆则验收失败。

## 6. 业务验收

| 编号 | 验收场景 | 通过条件 |
| --- | --- | --- |
| BA-01 | 测试商户建立 | 独立身份、`.invalid` locator、测试 provenance 完整；真实路径/身份输入被拒绝 |
| BA-02 | Cycle 1 | 按冻结版本完成双重 Retest、Analytics Observation 与人工 Review，缺门时 fail loud |
| BA-03 | Observation/Evidence 分离 | 不能把 Observation、指标或 fixture approval 直接升级为真实 Evidence/Claim |
| BA-04 | Cycle 2 选择 | 候选来自 Cycle 1 Review；没有 fixture human decision 时不启动 |
| BA-05 | 战略分支 | 仅显式触发；只消费 M4 已确认 open Product Gap，不创建/确认 Gap，证据或版本不合格时拒绝 |
| BA-06 | 双周期旅程 | 两个 synthetic Cycle 可从 refs/index/trace 复原，旧对象与原始工件未被覆盖 |
| BA-07 | 跨宿主 | 可比确定性输出一致；unsupported/漂移明确失败；WorkBuddy 边界没有被伪装 |
| BA-08 | 安全与恢复 | 污染、secret、path/symlink、并发、stale lock 和中断恢复负例可复验 |
| BA-09 | 完成门表达 | 最终结论只回答测试商户工程门；真实 MyyShop/v1 门明确未完成 |

## 7. 非目标

- 真实 MyyShop 商户建立、材料补齐、业务批准或内部测试；
- 真实 GA4/GSC/CRM/消费者平台访问与效果归因；
- 自动发布或修改外部资产；
- 新的综合 GEO 分数或工程完成伪状态；
- WorkBuddy Manifest、Marketplace、自动导入或真实宿主验收；
- 云端多租户、数据库、队列或新的 Agent Runtime；
- commit、push、PR、部署或发布。

## 8. 上线与完成边界

本 PRD 被批准并实现、测试通过后，最多形成“测试商户范围的系统工程闭环”结论。真实 MyyShop 内测必须由用户另行创建真实商户、确认事实 Owner/Approver、数据权限与发布边界；v1 正式完成仍要求最终产品方案中的两个真实 MyyShop GEO Cycle。
