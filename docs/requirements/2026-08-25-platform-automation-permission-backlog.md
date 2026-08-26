---
title: 平台自动采集许可需求池条目
status: proposed
planning_state: 待规划
created: 2026-08-25
activation_authority: MyyShop Owner
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-25-m5-playwright-and-consumer-platform-authorized.md
  - "2026-08-25 当前用户指令：去除 Adapter written_permission_ref 限制；遗留项放入 Requirements 需求池，由 Owner 决定是否开启规范，状态待规划"
scope: 全部里程碑完成后可能需要的平台许可、生产自动采集与正式上线需求候选
---

# 平台自动采集许可需求池条目

## 需求编号

`REQ-BACKLOG-PLATFORM-AUTOMATION-PERMISSION-001`

## 原始诉求

项目最终准备上线或启动生产消费者平台采集时，可能需要取得并复核 ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews 与 Claude 的平台许可、合同、官方支持工单或适用服务条款依据。

该事项只进入 Requirements 需求池。当前不创建对应 PRD、Architecture、Spec、Plan、Task、Runbook 或 Release，也不自动安排实施。

## 当前状态

- 仓库规范状态：`proposed`；
- 业务规划状态：`待规划`；
- 是否启动规范化：仅由 `MyyShop Owner` 另行明确决定；
- 当前优先级、排期、负责人、预算与目标版本：均未决定。

## Owner 决定启动后需要澄清

- 目标平台和 exact product entry；
- 需要 browser automation、API、官方 export 还是其他支持方式；
- 是否允许自动提交 Query、提取 Output/Citation 和本地保存；
- 账号、地区、语言、模型、并发、频率、样本数与时间窗；
- artifact、隐私最小化、保留期、删除责任和停止条件；
- 许可的出具主体、生效、到期、撤销、变更通知与验证方式；
- 是否形成独立 PRD/Spec，及其与 M5/T10/Release/Runbook 的关系。

## 当前约束

- Adapter 不再包含或强制 `written_permission_ref`；
- 本需求池条目不表示平台已经许可，也不授权真实自动采集；
- 当前 adapter 的 `terms_blocked/manual_only`、Terms/robots、challenge、隐私和账号安全边界继续有效；
- Owner Chrome 登录、内部授权、付费订阅或 API key 不能自动证明 consumer UI 自动采集范围；
- ChatGPT/Gemini 现有 manual exploratory Sample 继续只作平台 Observation，不是 Baseline；
- 开发阶段 Google AI/Claude manual exploratory 与 Perplexity `user_supplied_export` ingestion 不属于本自动化许可需求；Perplexity 页面 manual 和 browser automation 继续 blocked；
- 未经 Owner 决定，不得从本条目自动起草或批准后续规范。

## 非目标

- 当前申请平台许可；
- 当前解除平台 Terms guard；
- 当前启动生产采集、发布或部署；
- 用 API Sample 替代消费者 UI Sample；
- 把需求池存在误报为已规划、已批准或已实现。
