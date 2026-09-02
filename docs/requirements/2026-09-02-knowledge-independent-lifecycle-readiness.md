---
title: Knowledge-Independent GEO Lifecycle Readiness 原始需求
status: approved
created: 2026-09-02
updated: 2026-09-02
source:
  - 2026-09-02 当前用户明确目标、禁止项与 grill-with-docs 五轮确认
scope: MyyShop 单 Merchant 的开发测试知识库、真实数据 Observation、双 Cycle、M8 与最终就绪交接
---

# Knowledge-Independent GEO Lifecycle Readiness 原始需求

## 目标

在不伪造任何 MyyShop Claim、Evidence、批准、Publication 或业务效果的前提下，使仓库在真实品牌知识库缺席时可以完成全套工程验收；真实知识切片到位后，仅切换显式 `knowledge_base_ref` 即可启动真实 Cycle，无需修改代码。

## 已确认领域决定

- MyyShop 是当前唯一 Merchant，测试与真实运行复用同一线上商户身份及非凭据配置。
- 0→1 开发期创建隔离 Workspace 和 `test_only` 品牌知识库；这不是第二个商户，也不是 MyyShop 真实品牌知识库。
- 测试知识库中的 Claim、Evidence 与批准只具 test-only 证明角色，绝不自动转正、迁移或混入真实知识库。
- 真实知识闭包按 Goal 与 frozen Query Set 判断，不以全部 120 条知识为门槛。
- 真实 GA4/GSC 结果可形成真实 Observation、非因果 Business Signal 与 candidate Evidence；不得自动批准或写成 GEO 因果效果。
- 旧 `test_merchant` 逻辑完成迁移后归档删除。

## 实施顺序

1. 重新定基线并核对 M6/M7、GA4/GSC、Workspace 与 deferred 文档。
2. 复核已验证的 Query Portfolio。
3. 只输出真实 Cycle Readiness Report，不创建正式 Cycle。
4. 实现 GA4/GSC 与服务端业务文件到 Observation 的受控输入。
5. 重验 synthetic Cycle 1/2，形成独立 M7 QA Record。
6. 实现并验收 M8 Cross-host Conformance。
7. 形成最终验收 Record 与真实启动 Runbook。

## 禁止项

- 使用 synthetic 数据填充真实 MyyShop Claim/Evidence；
- 自动批准 Query、Claim、Evidence、Adoption、Publication 或 Cycle Review；
- 绕过平台条款执行消费者 UI 自动化；
- 把 GA4/GSC 或业务相关性写成 GEO 因果效果；
- 把知识目录缺失直接认定为 Content Gap；
- 等待全部 120 条知识才允许 Goal 范围内的真实 Cycle 启动。
