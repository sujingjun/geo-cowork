# GEO Lifecycle

本上下文统一描述 GEO 工程验收、真实知识、Cycle 启动与执行、Review 和跨宿主完成边界，避免把工程能力、业务流程和业务结果混为一谈。

## Language

**GEO Cycle**：
由 Cowork 创建并启动的版本化 GEO 生命周期单位；启动后锁定本轮使用的 frozen Query Set。浏览器任务可以引用 Cycle，但不创建、启动或推进 Cycle。
_Avoid_: Circle、Browser Query Task

**GEO 产品里程碑（Milestone）**：
有明确交付与验收门的产品阶段；它组织 M2—M8 的建设，不等于单个 GEO Cycle 的运行阶段或完成结果。
_Avoid_: Cycle 阶段、Circle

**Cycle Blocker**：
阻止某个具名 required transition 的未满足条件，必须能够指出目标 transition、当前证据、责任人和解除动作。warning、等待未来观察、optional 未执行项和非关键维护积压不是 Cycle Blocker。
_Avoid_: 所有待办、所有红灯、仅因 waiting_human 就称其为 blocker

**Agent 主导、人类门禁执行（Agent-led, Owner-gated Execution）**：
Agent 负责准备、执行、验证和记录完整 GEO Cycle；事实判断、人工 Review、真实数据授权、外部 Publication、Cycle 2 Goal 选择与发布决定由 Owner 明确作出。
_Avoid_: Agent 自动批准、Owner 手工编排全部步骤

**知识独立工程就绪（Knowledge-Independent Engineering Readiness）**：
在没有真实品牌知识库时，依靠明确标记的开发测试品牌知识库和 synthetic/test-only 材料完整验证 GEO Lifecycle 的工程合同。它不表示任何真实品牌知识、真实 Cycle、Publication 或业务效果已经成立。
_Avoid_: 真实 Cycle 就绪、生产就绪、业务就绪

**真实知识切片（Real Knowledge Slice）**：
围绕一个 Goal 的完整知识闭包：所选 frozen Query Set 中每个 Query 均可追溯到经人工批准的 Answer Card、Claim、Evidence、Source/Document，并纳入内部 Knowledge Release。它按 Goal 范围判断，不以全局知识条目数量为门槛。
_Avoid_: 完整知识库、120 条知识门槛、synthetic 知识

**真实 Cycle 启动就绪（Real Cycle Start Readiness）**：
知识独立工程已就绪，且拟启动 Goal 的真实知识切片及启动阶段所需人工决定均已满足。它不要求预先完成 M4 外部 Publication，也不等于整个 Cycle 可以无条件完成。
_Avoid_: 工程就绪、全周期完成、发布就绪

**Knowledge Release**：
经人工批准、供 GEO Lifecycle 内部消费的版本化知识包。它不表示任何外部页面或资产已经发布。
_Avoid_: Publication、外部发布

**Publication**：
资产已在外部目标实际发布且具有可核验发布证明的业务事件。它不能由 Knowledge Release、Proposal 或工程测试推断得出。
_Avoid_: Knowledge Release、发布建议、模拟发布

**知识输入缺席（Knowledge Input Absence）**：
某个 Goal 所需真实知识对象尚未提供或未形成批准闭包的状态；它只构成就绪阻塞项，不构成 Content Gap 结论。
_Avoid_: Content Gap、零内容

**Content Gap**：
依据适用诊断合同和已授权材料确认的内容供给缺口。目录缺失、知识输入缺席或尚未完成采集本身都不能证明 Content Gap。
_Avoid_: 缺文件、知识输入缺席

**商户（Merchant）**：
一个真实在线品牌及其唯一商户身份。测试和真实运行复用同一商户身份，不为测试另造商户、账号或品牌。
_Avoid_: 测试商户、虚构商户、环境商户

**品牌知识库（Brand Knowledge Base）**：
归属于一个商户、供真实 GEO Lifecycle 使用的唯一 canonical 知识集合。常态下一个商户只有一套品牌知识库。
_Avoid_: 测试资料、多个环境知识库、文档目录

**开发测试品牌知识库（Development Test Brand Knowledge Base）**：
0→1 开发阶段在同一商户下临时存在、以 synthetic/test-only 内容验证完整工程流程的隔离知识集合。它不是该商户的真实品牌知识库，其内容和结论不能升级为真实 Claim、Evidence、Publication 或业务效果。
_Avoid_: 真实品牌知识库、第二商户知识库、候选真实知识

**知识库切换（Knowledge Base Switch）**：
通过显式 knowledge base reference 为一次运行选择开发测试或真实品牌知识库。切换不复制、合并或提升任何知识对象，也不改变商户身份。
_Avoid_: 知识迁移、测试转正、自动合并

**商户授权范围（Merchant Authorization Scope）**：
人工针对某个商户明确授权的资源、数据类别、时间窗和操作边界。授权不能从一次读取推及其他商户、其他数据或后续运行。
_Avoid_: 商户可见性、自动发现权限、永久授权

**执行范围（Execution Scope）**：
同一商户下区分 synthetic/test-only 工程运行与 authorized-real 运行的边界。它改变输入和产物可承担的证明角色，但不创建第二个商户身份。
_Avoid_: 测试商户、线上商户副本

**Synthetic Test Run**：
在真实商户身份下使用明确标记的 synthetic/test-only 输入验证工程合同的运行。其产物只能证明工程行为，不能充当真实 Observation、Evidence、Claim、Publication 或业务效果。
_Avoid_: 测试商户、真实 Cycle、线上验证

**商户 Observation（Merchant Observation）**：
从授权商户的真实只读数据形成、保留真实来源和测量口径的观察记录。它可以支持非因果 Business Signal 和待人工审核的 candidate Evidence，但本身不是 Evidence、Claim 或业务效果。
_Avoid_: 业务效果、已批准 Evidence、因果结论

**Platform Answer Baseline**：
在冻结 Query、平台、Collector Profile 和时间窗下形成的正式消费者答案观察集合，用于后续比较而不是证明品牌事实或业务效果。
_Avoid_: 品牌基线、Git baseline、单次回答

**Citation Observation**：
消费者答案中一次可定位引用的不可变观察记录；它参与 Source identity、Baseline/Retest provenance 与观察指标，但不构成任何真实 GEO Cycle transition 的 required gate。
_Avoid_: approved Evidence、Claim Support、Cycle Blocker

**Source 批量分类触发器（Source Batch Classification Trigger）**：
达到 100 个唯一 Citation Source 后启动批量 Classification 与 Claim Support 的维护触发器；它不阻塞真实 GEO Cycle 的启动、推进或完成。
_Avoid_: Source 分类门、Real Knowledge Slice 门、Cycle 完成门

**Technical Retest**：
在 confirmed Asset Publication 后，对同一 Asset 的确定性技术规则重新检查并保存可追溯结果。
_Avoid_: Platform Answer Retest、业务效果验证

**Platform Answer Retest**：
在 confirmed Asset Publication 与 Technical Retest 后，按冻结协议重新观察消费者平台答案并与 Platform Answer Baseline 比较。
_Avoid_: Technical Retest、一次性 Smoke

**Cycle Review**：
锁定一个真实 GEO Cycle 的输入、结果、Observation、限制与禁止结论后，由 Owner 作出 `decided` 判断的版本化业务复核；它产生 Cycle 2 候选，但不自动选择下一 Goal。
_Avoid_: 自动总结、测试报告、Agent 自批

**M8/v1 Conformance Gate**：
两个真实 GEO Cycle 达到 `review_decided/full` 后的最终跨宿主门；Codex 与 Claude Code 是独立 native lanes，WorkBuddy manual 只验证配置与跨会话继续，第三条可比 lane 明确是 `test_only_semantic_fixture/shared_tool` 而非 WorkBuddy native。
_Avoid_: fixture-only conformance、WorkBuddy native 硬门、部署完成
