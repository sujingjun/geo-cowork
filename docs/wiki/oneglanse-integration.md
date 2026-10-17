---
title: OneGlanse 采集与 cowork 对接
kind: architecture
status: implemented
sources:
  - docs/records/2026-10-17-myyshop-geo-full-flow-audit.md
  - docs/records/2026-10-17-oneglanse-mcp-integration-record.md
  - docs/tasks/2026-10-17-oneglanse-mcp-integration.md
  - plugins/geo-expert/skills/geo-answer-cycle/references/oneglanse.md
  - plugins/geo-expert/scripts/lib/oneglanse-intake.mjs
  - docs/plans/2026-10-17-oneglanse-mcp-integration-plan.md
  - docs/records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md
  - docs/records/2026-10-17-oneglanse-mcp-planning-record.md
  - docs/specs/0013-browser-query-task-mcp-automation.md
  - docs/specs/0015-authorized-real-two-cycle.md
updated: 2026-10-17
---

# OneGlanse 采集与 cowork 对接

首版由 cowork 生成 Query，通过现有 Skill 和 MCP 使用 OneGlanse；OneGlanse 负责 MCP Server 授权、Tools 和能力接口，沿用现有采集与分析行为，完整回传已保存的答案和引用。未提供的信息保持未知，不把接口接通当作正式采样完成。本地 stdio Server/9 Tools、三个既有 Skill 与薄接收入口已实现。MyyShop 一个 Query/Gemini 的授权保存、原生运行、完整回传与本地候选分析已验证；当前采集与 MCP 均已在 `dhnb/oneglanse` 运行；本仓默认模型分析凭据已配置但连接失败，cowork 独立的 DeepSeek 候选诊断通过。

- [整体流程与能力缺口](../records/2026-10-17-myyshop-geo-full-flow-audit.md)：当前源码真实试跑、临时知识构建、正式接口停止位置及按责任划分的缺口。
- [联调记录](../records/2026-10-17-oneglanse-mcp-integration-record.md)：真实 response、SHA-256、测试与未通过项。
- [Skill 调用入口](../../plugins/geo-expert/skills/geo-answer-cycle/references/oneglanse.md)：公开 MCP 顺序、输入、未知提交与本地恢复。
- [GEO 候选观察](../records/2026-10-17-oneglanse-geo-observation.md)：单次回答及来源列表的证据边界。
- [开发计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)：首版责任、现有能力封装、MCP 授权和 Tools、两侧 MyyShop 映射与分阶段验收。
- [边界与清理记录](../records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)：AGENTS 简洁设计约定、非 myyshop 演练目录清理、恢复依据与验证。
- [源码核验记录](../records/2026-10-17-oneglanse-mcp-planning-record.md)：两仓基线、当前能力和缺口、本轮检查范围。
- [既有 Browser MCP 合同](../specs/0013-browser-query-task-mcp-automation.md)：当前注册与接收边界；新增 OneGlanse 入口需明确增量合同。
- [正式采样合同](../specs/0015-authorized-real-two-cycle.md)：Query/Profile/slot、独立会话、授权和观察窗口；新增 collector 不自动解除[当前真实业务暂停](real-cycles.md)。

本页仅作导航，具体接口与状态以计划、后续批准合同和实际验证为准。

正式闭环尚未成立：英文 Query 原始追溯缺失，临时补链得到 candidate Answer Card/draft Release；真实 KBASE/Release 和证据未就绪，OneGlanse intake 尚未接到正式 Sample/Review/Cycle。当前来源列表为空的语义和新会话等证明保持未知。
