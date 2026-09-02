---
title: Knowledge-Independent GEO Lifecycle Readiness 实施计划
status: approved
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - 2026-09-02 MyyShop Owner 明确批准实施
scope: 本地实现、真实只读 Analytics、synthetic 双 Cycle、M8 和文档验收；不发布部署
---

# Knowledge-Independent GEO Lifecycle Readiness 实施计划

## 1. 基线

HEAD `9b0a2c5` 与 `origin/main` 一致。Query Portfolio 与 GA4/GSC smoke 既有 Task/Record 为 verified；M6 与 M7 Circle 1 verified；Strategy/Cycle 2/M8 仍 deferred。Query Portfolio Record 含一个 NUL 文档字节，M8 尚无实现。

## 2. 顺序与验证

1. 建立新 SDD/ADR 与红测 → 新身份、KBASE、Readiness、真实 Analytics、业务文件、M8 测试先失败。
2. 迁移 Workspace scope → 单 Merchant 与 KBASE 校验通过，旧 test_merchant surface 消失。
3. 迁移 Query Portfolio/M6/M7 → 专项测试、双 Cycle E2E 与人工门负例通过。
4. 实现 Readiness → real MyyShop 只读演练不创建 Cycle，知识缺席不生成 Content Gap。
5. 实现 Analytics → fixture requester 验证完整落盘；在有效当次授权内执行真实 GA4/GSC 采集并仅记录安全摘要。
6. 实现 business file adapter → JSON/CSV 正例与 PII/逐行/缺文件负例。
7. 实现 M8 → required tier、mismatch、unsupported、WorkBuddy 边界与敏感数据负例。
8. 稳定快照全验收 → Query、Analytics、M6、M7、M8、docs、plugin、MyyShop 只读回归和完整 `npm test`。

## 3. 停止条件

需要扩大真实 API 资源/字段/scope、遇到 PII、需要真实消费者 UI 自动化、自动批准、外部写入、Publication、部署或发布时停止。commit、push、PR 不在本次授权内。
