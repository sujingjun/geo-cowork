---
title: 移除 CodeBuddy 适配与 WorkBuddy（中国区）专家体系切换 Handoff
status: proposed
date: 2026-08-20
target_repository: https://github.com/sujingjun/geo-cowork
target_milestones: [1-WorkBuddy 切换]
predecessor: docs/records/2026-08-20-workbuddy-pivot-record.md
supersedes_note: 本文件原为「里程碑 1 加固」Handoff；同日按用户指令移除 CodeBuddy 适配后整体更新，原内容以 docs/records/2026-08-20-milestone-1-hardening-record.md 为准
---

# 移除 CodeBuddy 适配与 WorkBuddy（中国区）专家体系切换 Handoff

## 1. 接手角色

你负责在「移除 CodeBuddy 适配、第三宿主切换为 WorkBuddy（中国区）」已完成的基线上，进入里程碑 2（Query 与知识，宿主范围为 Codex 与 Claude Code），并跟踪 WorkBuddy 官方开发者契约的发布。你不负责站点、舆情、答案测试或云端建设。

## 2. 开工前必读

1. `AGENTS.md`
2. `docs/workflow.md`
3. `docs/records/2026-08-20-workbuddy-pivot-record.md`（本次切换验收事实）
4. `docs/records/2026-08-20-plugin-initialization-acceptance.md`（里程碑 0-1 验收事实，含 CodeBuddy 历史验证）
5. `docs/specs/0001-plugin-package-contract.md`（已修订：两 Manifest、两 Marketplace；WorkBuddy 待契约）、`docs/specs/0002-workspace-contract.md`
6. `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md` §5.3（WorkBuddy 定位与恢复条件）、§8、§10、§11
7. `docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`（里程碑 2 入口，已同步本次切换）

## 3. 当前基线

- HEAD `0af4a16`（里程碑 0-1 已提交）；本次切换的全部变更在工作树中，未 commit，需人类授权；
- 插件 `geo-expert` 0.2.0：仅 `.codex-plugin/`、`.claude-plugin/` 两个 Manifest，仓库根两个 Marketplace；`.codebuddy-plugin/` 已删除，`validate-plugin.mjs` 受检 8 项；
- 变更后验证通过：`node --test` 12/12；`claude plugin validate` ✔；Codex 重装 `geo-expert@geo-cowork 0.2.0 installed, enabled`；用户 CodeBuddy 配置中的 `geo-cowork` 市场注册已移除；
- WorkBuddy（中国区）定位：**不提供插件包装**。官方文档（workbuddy.cn 专家中心/技能市场/实践八）截至 2026-08-20 未发布开发者契约（无 manifest、文件格式、导入协议或 CLI 命令）；过渡期通过「我的专家/创建技能」以自然语言指向本仓 Skills 与本地工作区；
- 官方文档：<https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Expert-Center>

## 4. 本次目标

1. **进入里程碑 2（Query 与知识）**：按里程碑 2 Handoff 执行；先建立 Requirement/PRD/Spec/Plan/Task 并保持 `proposed`，待人类批准后再实现；宿主验证范围为 Codex 与 Claude Code；
2. **WorkBuddy 契约跟踪**（低频）：开工时快速核对 workbuddy.cn 文档是否发布专家/技能开发者契约；若发布，停止并按 `docs/workflow.md` 新立 Spec 恢复仓库级适配，不得自行虚构格式；
3. 交互式宿主命令补验（原里程碑 1 加固遗留）：在交互式 Claude Code 会话执行 `/reload-plugins`，把结果补记到 Record（CodeBuddy 侧已随适配移除，不再需要）。

## 5. 停止条件

- WorkBuddy 官方发布开发者契约（需要新 Spec 决策）：停止并请求决策；
- 需要改动 Spec 0001/0002 的已验证行为：停止并请求决策；
- 里程碑 2 的 PRD/Spec 未获人类批准就进入实现：停止；
- 需要批量改写 MyyShop 现有知识条目：停止；
- 需要 MCP、云端接入、自动批准或发布：停止；
- 未获当次明确授权需要 commit/push/PR：停止。

## 6. 下一 Session 开场指令

```text
你正在继续 sujingjun/geo-cowork：CodeBuddy 适配已移除，第三宿主为 WorkBuddy（中国区，待官方开发者契约）。
先读 AGENTS.md、docs/workflow.md、docs/records/2026-08-20-workbuddy-pivot-record.md、
里程碑 2 Handoff 和重新定基线方案 §5.3。
确认 git status 与 HEAD 后：
1. 快速核对 workbuddy.cn 是否发布 WorkBuddy 专家/技能开发者契约，未发布则继续；
2. 按 docs/workflow.md 建立里程碑 2 的 Requirement/PRD/Spec/Plan/Task（保持 proposed），
   获批准后实现 geo-query-portfolio 与 geo-knowledge-audit，
   完成 Codex 与 Claude Code 真实验证，写 Record 与下一 Handoff。
未经明确授权不 commit、不 push、不创建 PR。
```
