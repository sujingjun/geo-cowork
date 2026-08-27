---
title: M7 Review 候选生成合同独立技术评审记录
status: verified
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/records/2026-08-27-m6-m8-sdd-approval-record.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md
  - 2026-08-28 Owner 指令：M7 继续完成并按已批准推荐方向推进
scope: test-only Cycle Review 到 GCB/GCD 的 rationale/limitations 确定性来源；不改变真实 MyyShop 或外部访问授权
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
---

# M7 Review 候选生成合同独立技术评审记录

## 1. 问题

Spec 0007 的 `next_cycle_candidate_inputs` 冻结 Goal、source tuples、priority、gaps 与 risks；Spec 0008 的 GCD 同时要求 `rationale/limitations` 并把它们纳入 `candidate_content_key`。若 Tool 临场硬编码或从 plan、聊天历史补齐，这两个字段就不再由冻结输入确定，无法证明相同输入生成相同 bytes。

## 2. 决定

采用最小版本化规则派生方案，不扩大 CRV 字段：

1. Candidate Run 的 `outputs/` 保存 create-only `generator_rule` artifact。
2. 规则完整 bytes 与 SHA-256 冻结在 GCB；ID、version、path 或 checksum 变化均生成新 batch。
3. `rationale` 只允许固定模板对 `candidate_kind` 做字面替换；`limitations` 逐字复制规则中的固定非空数组。
4. Tool 仍只能从 decided CRV 与 review CIS tuples 读取候选事实；plan 自报候选、聊天历史、模型记忆与工作区外文件全部拒绝。
5. 该规则只生成测试商户候选说明，不形成真实 Product Gap、业务优先级或产品投资结论。

## 3. 第一性原理理由

- CRV 保存已由人工 Review 冻结的事实输入，职责不因展示文案而扩张。
- 派生文案的规则本身可审计、可复算、可版本化；同一 Review、CIS 与 rule bytes 唯一决定 GCB/GCD bytes。
- 任何规则漂移都会进入 batch key，旧候选保持 create-only，不被新文案静默改写。

## 4. 验证与边界

本 Record 只闭合 approved Spec 0007/0008 之间的确定性字段来源，不批准真实数据、真实战略研究、真实 MyyShop Cycle 2、发布或部署。实现仍须通过独立对抗 QA、完整九门 Cycle 2 与稳定快照验收。
