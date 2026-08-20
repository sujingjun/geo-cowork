---
title: 里程碑 2（Query 与知识）Handoff
status: proposed
date: 2026-08-20
target_repository: https://github.com/sujingjun/geo-cowork
target_milestones: [2]
predecessor: docs/records/2026-08-20-plugin-initialization-acceptance.md
---

# 里程碑 2（Query 与知识）Handoff

## 1. 接手角色

你负责在已完成的插件骨架（Codex、Claude Code）上，实现里程碑 2：跑通 GEO 第 1、2 步（Query Portfolio 与 Knowledge Audit）。你不负责站点、舆情、答案测试或云端建设。

## 2. 开工前必读

1. `AGENTS.md`
2. `docs/workflow.md`
3. `docs/records/2026-08-20-plugin-initialization-acceptance.md`（里程碑 0—1 验收事实）
4. `docs/specs/0001-plugin-package-contract.md`、`docs/specs/0002-workspace-contract.md`
5. `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md` §8、§10、§11
6. `workspaces/myyshop/knowledge/README.md` 与 `00-governance/`（Query Catalog、版本基线）

## 3. 当前基线

- 三 Manifest、三 Marketplace 曾在 Claude 2.1.237、CodeBuddy 2.115.0、Codex 0.146.0 真实验证通过；
- 2026-08-20 按用户指令移除 CodeBuddy 适配：现为两 Manifest、两 Marketplace，插件版本 0.2.0；第三宿主为 WorkBuddy（中国区），其包装契约待官方开发者契约（见 docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md §5.3）；里程碑 2 的宿主验证范围为 Codex 与 Claude Code；
- `geo-workspace-init` 可用；工作区契约 v1.0.0 生效；
- `node --test` 12/12 通过；所有变更在工作树中，尚未 commit（需人类授权）；
- MyyShop 知识库 120 条保持原样。

## 4. 本次目标

| Skill | 责任 |
| --- | --- |
| `geo-query-portfolio` | Query 候选、正式集合、聚类、优先级和覆盖 |
| `geo-knowledge-audit` | Claim、Evidence、Owner、Scope、有效期和冲突检查 |

要求：

- 遵守 Spec 0001（SKILL.md 契约、Manifest 不复制业务规则）与 Spec 0002（工作区定位与幂等）；
- 产物写入工作区 `queries/`、`knowledge/`，使用统一 Finding 格式（重新定基线方案 §10）；
- 候选 Query 与候选知识一律为 `draft`，Agent 不得自动批准；
- 为两个 Skill 补充 `node:test` 测试与 Fixture，并在三个宿主做真实 Smoke Test；
- 开始前如需新 Spec（如 Query/Knowledge 文件契约），先按 `docs/workflow.md` 建档并保持 `proposed`，待人类批准。

## 5. 停止条件

- 需要改动 Spec 0001/0002 的已验证行为：停止并请求决策；
- 需要批量改写 MyyShop 现有知识条目：停止；
- 需要 MCP、云端接入、自动批准或发布：停止；
- 未获当次明确授权需要 commit/push/PR：停止。

## 6. 下一 Session 开场指令

```text
你正在继续 sujingjun/geo-cowork 里程碑 2（Query 与知识）。
先读 AGENTS.md、docs/workflow.md、docs/records/2026-08-20-plugin-initialization-acceptance.md、
本 Handoff、两个 Spec 和 MyyShop 知识库 README。
确认 git status 与 HEAD 后，按 docs/workflow.md 建立里程碑 2 的 Requirement/PRD/Spec/Plan/Task，
实现 geo-query-portfolio 与 geo-knowledge-audit，完成 Codex 与 Claude Code 真实验证，写 Record 与下一 Handoff。
未经明确授权不 commit、不 push、不创建 PR。
```
