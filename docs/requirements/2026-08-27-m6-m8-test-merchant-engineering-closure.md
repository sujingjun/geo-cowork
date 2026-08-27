---
title: M6—M8 测试商户系统工程闭环原始需求
status: approved
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md
  - docs/handoff/2026-08-26-m5-baseline-closeout-and-knowledge-optimization-handoff.md
  - workspaces/myyshop/STATUS.md
  - workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 当前用户指令：先以独立测试商户完成 M6—M8 系统工程闭环，工程完成后再由用户建立真实 MyyShop 商户内测
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: 测试商户范围的 M6 Analytics、M7 战略发现与第二周期、M8 跨宿主工程验收需求；不含实现与真实 MyyShop 执行
---

# M6—M8 测试商户系统工程闭环原始需求

## 1. 原始诉求

在不触碰真实 `workspaces/myyshop` 业务对象、不读取真实账号或企业数据、不执行外部写入的前提下，建立一个与真实 MyyShop 明确隔离的测试商户，用脱敏结构和显式 `synthetic/test_only` 数据跑通：

```text
M6：Cycle 1 + Analytics + Cycle Review
→ M7：人工触发战略发现 + Cycle 2 人工选题 + Cycle 2
→ M8：Codex / Claude Code / WorkBuddy 中国区边界内的一致性与工程候选验收
```

职责分离的 SDD 套件已完成并获得 Owner 明确批准，后续可按已批准 Plan 进入代码、测试、Skill、fixture 与运行时实现；各阶段人工门仍按合同保留。

## 2. 需要解决的问题

1. M2—M5 已有对象、索引、refs、Run、Gap、Publication、Retest 与 Answer Sample 合同，但 M6—M8 仍缺少可实施的 Cycle/Analytics、战略分支与跨宿主一致性合同。
2. 真实 MyyShop 仍缺业务材料、Publication、GA4/GSC/业务事件授权和真实 Cycle 条件，不能把这些缺口用模拟数据补写到真实 Workspace。
3. Analytics Observation、第一方 Evidence Snapshot、Publication、平台答案变化和业务结果之间容易被错误合并，需要可机检的边界。
4. Cycle 2 必须从 Cycle 1 Review 产生候选并由人类选择，不能由 Agent 自动决定；战略分支也不能成为主线隐式步骤。
5. 三宿主目标必须服从既有包装事实：Codex、Claude Code 已有插件包装；WorkBuddy 中国区没有官方开发者包装契约，不能虚构 Manifest 或真实宿主验收。
6. 测试商户绿测只能证明系统工程能力，不能证明真实 MyyShop 内测、两个真实 GEO Cycle、外部发布、真实 Analytics 或业务改善。

## 3. 核心需求

### 3.1 测试商户隔离

- 使用独立 Workspace 路径、独立 `workspace_id`、独立测试 namespace；禁止位于 `workspaces/myyshop/` 内。
- 身份必须明确为虚构测试主体，canonical locator 使用 `.invalid`；不得冒充 MyyShop 法定实体。
- 所有模拟对象必须携带机器可检的 `synthetic/test_only` provenance；fixture approval 也必须是测试批准，不能进入真实对象。
- 允许复用用户已批准的 MyyShop 定位语义作为“用于测试的语义投影”，但不得据此创建或升级真实 MyyShop Claim、Evidence、批准或效果。
- 禁止凭据、Cookie、环境变量值、账号标识、真实个人数据和未授权企业数据进入 Workspace 或测试输出。

### 3.2 M6 Cycle 与 Analytics

- Cycle 启动前冻结 Goal、Query Set、Knowledge Release、Asset、Collector Profile 和测量口径的精确版本。
- Cycle 阶段必须有合法状态机、非法顺序拒绝、重复调用幂等、并发互斥、中断恢复和输入漂移 supersede。
- Adoption、Publication、Technical Retest、Answer Retest、Analytics 与 Cycle Review 是独立门，不允许 checkbox 或上游绿测替代下游事实。
- Analytics 仅通过本地 fixture adapter 演示；为未来 GA4/GSC/业务文件保留 read-only connector seam，但本目标不连接真实系统。
- Analytics Observation 只表示观测；只有符合第一方口径、另经明确人类决定并物化为新 Evidence 对象的 snapshot 才可能成为 Evidence。二者不得复用 ID、状态或隐式升级。
- Cycle Review 必须保留观察性归因边界，不宣称单一内容变更造成访问、注册或其他因果结果。

### 3.3 M7 战略分支与 Cycle 2

- `geo-strategy-discovery` 只能由可追溯的人类显式触发；不调用时主线仍可完整运行。
- Decision Dimension 保持 `candidate → validated → decision_factor` 的人类门；模型输出或单次平台答案不能自动推进。
- Product Gap 必须先按 approved Spec 0005 由 M4 以“用户需要/真实社区或独立支持 Evidence + 当前能力缺失或不足的一方/批准 Evidence”双证据和人工 approval 确认为 `open`；M7 只消费，不创建或确认。单条 Query、平台回答、竞品自述不能成立。
- Cycle 1 Review 以确定性规则生成 Cycle 2 Goal 候选；必须由 fixture 中显式的人类决定选择或拒绝，Agent 不得自动选择。
- PRD 与人工验证计划只能作为战略建议工件，不得变成已批准产品事实、Claim 或真实研发授权。

### 3.4 M8 跨宿主与工程验收

- Codex 与 Claude Code 使用既有已适配包装和同一确定性脚本验证；宿主包装不得复制业务规则。
- WorkBuddy 中国区只允许 `test_only` 语义 fixture 与人工配置检查；不得新增或伪造 WorkBuddy Manifest、Marketplace、导入协议或 CLI 验收。
- 同一冻结 Workspace 输入在可比范围内必须得到相同 indexes、Finding、trace、Cycle 结果与 diagnostics；不可比字段必须显式列出。
- 缺 capability、unsupported capability、宿主输出漂移或包装缺失必须 fail loud，禁止静默跳过、降级或换路径补数。
- 必须冻结 delegation contract、capability matrix、独立 sample Workspace manifest 与 successor Handoff；全新无聊天上下文进程只凭 checkout/Workspace/Handoff 恢复 stage、next action 与 digests，并记录 `conversation_history_used:false`。
- 工程候选记录必须明确 scope 为测试商户，不得命名或表述为真实 v1 发布。

### 3.5 安全、恢复与污染负例

- 覆盖 path escape、symlink、secret marker、凭据/个人信息、真实/模拟双向引用污染、create-only 冲突、并发竞争、stale lock、半成品恢复、resume 与 supersede。
- canonical Markdown 是事实源；indexes 可删除重建且字节稳定；所有新 refs、精确版本、index 与 trace 边必须闭合。
- 原始工件 create-only；恢复只补齐已冻结 plan 中缺失且 checksum 一致的部分，不覆盖旧字节。
- 任何工程检查不得写入真实 MyyShop Workspace 或把测试对象计入真实指标分母。

## 4. 完成门

| 门 | 本需求允许完成 | 本需求不能证明 |
| --- | --- | --- |
| 测试商户工程门 | 脱敏双周期、异常/恢复、安全、确定性与宿主边界内的一致性 | 真实 MyyShop 事实、批准、发布、Analytics 或效果 |
| 真实 MyyShop 内测门 | 仅准备后续接入合同、清单与 Runbook | 用户尚未建立的真实商户内测 |
| v1 正式完成门 | 仅准备 scope 受限的工程候选证据 | 两个真实 MyyShop GEO Cycle、真实外部 Publication 与 v1 Release |

三个门不得通过新增状态词合并；沿用仓库既有状态，并由对象 `scope` 与 Record 明确边界。

## 5. 成功标准

1. Requirement、PRD、Architecture、Spec 0007—0009、Plan、Task、Record 与等待批准 Handoff 职责分离、链接完整。
2. 三份新增 Spec 清楚定义类型、ID、状态机、refs、version pin、indexes、trace、错误与负例。
3. Plan/Task 明确先红测、最小实现、稳定快照独立验收和后续改动使旧 QA 失效的规则。
4. M8 合同包含可机检 capability/delegation/sample Workspace/Handoff pins 与 new-session recovery gate。
5. 所有实施类工件的 Owner 批准可追溯；本批准记录轮不产生实现文件或测试数据。
6. 最终产品方案第 7.2 节与 approved Spec 0006 的正式两槽协议一致，只把“3 次”修正为“2 次”。

## 6. 范围外事项

- 创建、改写、批准或删除 `workspaces/myyshop` 中任何业务对象；
- 真实 GA4、GSC、CRM、业务文件或消费者平台访问；
- 自动站点/CMS/媒体/Schema/llms/PR/社交发布；
- 新增 WorkBuddy 包装或宣称真实 WorkBuddy 宿主验收；
- 除用户提供的账号与数据准备 Runbook 原样镜像/引用外，不新建真实系统操作 Runbook，也不实现代码、Schema、模板、Skill、fixture 或测试；
- commit、push、PR、merge、deploy、release 或生产流量操作。

## 7. 已记录的人类决定

1. Owner 已批准 Spec 0007 作为测试商户 Cycle/Analytics 实施依据。
2. Owner 已批准 Spec 0008 的人工触发战略分支和 Cycle 2 选择合同。
3. Owner 已批准 Spec 0009 的宿主差异口径，WorkBuddy 仍仅做 test-only semantic fixture；optional 人工检查不替代 required 门。
4. Owner 已批准按 Plan 的依赖顺序实施，不并行跳过 M6 → M7 → M8 输入关系。
