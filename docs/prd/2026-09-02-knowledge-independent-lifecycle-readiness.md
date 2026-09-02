---
title: Knowledge-Independent GEO Lifecycle Readiness PRD
status: approved
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/requirements/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/adr/0001-one-merchant-development-test-knowledge-base.md
  - 2026-09-02 MyyShop Owner 明确批准按最终共享理解实施
scope: 单 Merchant 下开发测试知识库、就绪演练、真实 Observation 与工程验收体验
---

# Knowledge-Independent GEO Lifecycle Readiness PRD

## 1. 用户与问题

MyyShop 研发负责人需要在真实品牌知识库尚未交付时完成产品工程开发与验收，同时保留真实品牌事实、人工批准、外部发布和业务效果的全部边界。当前“虚构测试商户”模型错误地把测试边界放在 Merchant 身份上，也没有把真实 GA4/GSC 结果接入正式 Observation 流程。

## 2. 用户旅程

1. 创建 MyyShop development-test Workspace，显示唯一线上 Merchant、测试知识库及其隔离边界。
2. 使用 test-only 知识完成 Query Portfolio、两个 synthetic Cycle、Strategy 与 Cross-host 工程验收。
3. 对真实 MyyShop Workspace 执行只读 Readiness，得到逐门缺口；不创建 Cycle，不把知识缺席写成 Content Gap。
4. 在当次授权范围内读取 GA4/GSC，直接形成真实 Observation；可以确定性计算非因果 Business Signal，并创建 candidate Evidence。
5. 对本地聚合业务文件执行同一 Observation 流程；缺少文件时只报告未提供。
6. 真实知识切片到位后，把运行输入切换到真实 `knowledge_base_ref`；测试知识库归档，代码不变。

## 3. 业务规则

- 一个 Merchant 可以在 0→1 阶段同时关联一个 development-test 知识库和一个尚未就绪的真实知识库入口，但同一次 Run 只能选择一个。
- development-test 知识对象必须直接标记 test-only；真实线上配置不因此变成 synthetic，也不能证明知识内容真实。
- Observation、Business Signal、candidate Evidence 是三种不同对象；只有 Evidence 可以在后续人工流程中被审核，Signal 永远不承担 Evidence 或因果角色。
- Readiness 只报告已观察事实和未满足门；不得自动创建、批准或发布业务对象。
- 真实 Cycle 的最小知识门是所选 Goal/Query Set 的完整批准闭包，不是全局知识数量。

## 4. 验收

| ID | 场景 | 通过条件 |
| --- | --- | --- |
| BA-01 | 单 Merchant | development-test 与真实 Workspace 使用相同 Merchant 与线上 locator，不存在 `test_merchant` |
| BA-02 | 测试知识隔离 | test-only 对象不能成为真实 Claim/Evidence/Publication，也不能自动转正 |
| BA-03 | Query Portfolio | 无真实知识时仍可生成、人工批准并冻结 Query Set；无自动批准 |
| BA-04 | Readiness 演练 | 不创建正式 Cycle；知识缺席为 input gate，`content_gap_inferred:false` |
| BA-05 | Analytics | 当次授权的 GA4/GSC 形成真实 ANO、非因果 BSIG、candidate EVD；无批准 |
| BA-06 | 业务文件 | 聚合 JSON/CSV 可转换；PII、secret、未知字段和原始行级数据 fail closed |
| BA-07 | 双 Cycle | synthetic Cycle 1/2、人工选择与恢复完整通过 |
| BA-08 | M8 | required host tiers 通过；unsupported/native optional 不冒充通过 |
| BA-09 | 切换 | 真实切片满足时只替换 `knowledge_base_ref`，不改代码、不混入测试知识 |

## 5. 非目标

真实品牌知识编写或批准、真实消费者平台 UI 自动化、外部 Publication、部署、发布、业务效果归因、全部 120 条知识完成均不在本次工程验收中。
