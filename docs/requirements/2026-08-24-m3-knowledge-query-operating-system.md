---
title: M3 Knowledge & Query Operating System 原始需求
status: proposed
created: 2026-08-24
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0003-contract-provenance-kernel.md
scope: M3 完整文档、Claim/Evidence、Knowledge Release、Query 与 Query Set
---

# M3 Knowledge & Query Operating System 原始需求

## 1. 业务诉求

MyyShop 研发负责人需要把完整品牌文档中的叙事与边界，转成机器可调用但仍由人类批准的原子 Claim、Evidence、Answer Card、Knowledge Release 和正式 Query Set。第一条纵切围绕“让生成式平台正确回答 What is MyyShop”，为后续 M4 诊断提供稳定输入，不启动真实平台采样或内容发布。

## 2. 当前问题

1. 120 条 legacy knowledge 都是 `draft`，Query/Claim/Evidence 没有独立对象或 refs。
2. `Q-ANSWER-001` 与答案卡存在，但“一句话定义”“全球”“全生命周期”等范围仍需核验，不能自动批准。
3. Source/Evidence、Claim 风险、Evidence Sufficiency、Knowledge Release 与 Query Set freeze 没有机器契约。
4. 旧知识状态和 `published` 语义与当前批准产品方案冲突。
5. 现有知识必须兼容索引，不能批量改写成新对象。

## 3. 必须支持的动作

- 从一份人工批准 Document 形成可审查的 candidate Claims 与 Answer Card 提案。
- 按五类 Claim 风险给出确定性 Evidence Sufficiency 建议，但不自动改变状态。
- 独立登记 Source 与可定位 Evidence，Evidence stale 只提示复核。
- 人类批准 Query candidate 后，才能成为 `formal`；冻结 Query Set 时锁定 Query version。
- Knowledge Release 锁定 Claim 与 Answer Card 的精确版本；发布前验证所有批准与 refs。
- 从 Query 追溯 Answer Card、Claim、Evidence、Source 与上游 Document。
- 为证据不足 Claim 形成 Evidence Plan，不执行 M4 诊断或采集。
- 120 条 legacy knowledge 通过 compatibility index 导航，原文件不变。

## 4. 成功标准

1. 非 approved Document 不能作为自动提案输入；approved Document 的提案只生成 candidate。
2. Query candidate 不能自动 formal；formal 必须有人类 approval attestation。
3. frozen Query Set 只含 formal Query，精确锁定版本与内容 hash。
4. published Knowledge Release 只含 approved/published Claim 与 approved/published Answer Card，精确锁定版本。
5. Claim `published` 只表示进入 Knowledge Release，不表示网站或媒体发布。
6. Evidence stale 产生 warning，不回退 Claim 或 Release。
7. “What is MyyShop” 建立一条 candidate Query → candidate Answer Card → candidate Claim → candidate Evidence → Source 的可追溯链；KR v1 与 Query Set v1 保持 draft，trace 明确 `lifecycle_ready:false`，等待 Owner 决策。
8. 合成批准 Fixture 证明 formal/freeze/published 的完整机器规则；不把 Fixture 当 MyyShop 业务批准。

## 5. 约束与边界

- 继承 Spec 0003 的 Markdown authoritative、stable IDs/refs、derived indexes、不可覆盖 Run artifacts 和安全边界。
- Host Agent 负责语义提案；Node Tool 只校验、物化明确输入和构建派生关系。
- 不把模型建议、legacy knowledge 或最终产品计划自动升级为企业事实批准。
- 不读取真实企业私有数据，不调用真实模型、平台或第三方 API。
- 不进入 Finding、Asset、Content/Evidence/Product Gap、站点审计、内容建议或 Technical Retest。

## 6. 非目标

- M4 诊断与 Asset Proposal；
- M5 消费者 UI 采样；
- M6 GA4/GSC 与真实 Cycle；
- M7 战略发现；
- 自动批准、自动发布、CMS/Git PR、数据库或云端同步。

## 7. 待人工决定

- 新 M3 PRD/Spec 的批准状态。
- MyyShop brand Document、Evidence、Claim、formal Query、frozen Query Set 与 Knowledge Release 的业务批准。
- Evidence Plan 所需的真实内部资料是否允许读取。
