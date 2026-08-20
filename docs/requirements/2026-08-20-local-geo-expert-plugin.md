---
title: 本地 GEO 专家插件原始需求
status: proposed
created: 2026-08-20
source: docs/handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md; docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md
scope: geo-cowork 仓库里程碑 0（仓库重新定基线）与里程碑 1（三宿主插件骨架）
---

# 本地 GEO 专家插件原始需求

## 1. 业务诉求

MyyShop 品牌团队需要一套本地优先的 GEO（Generative Engine Optimization）专家能力，让企业品牌能够在 ChatGPT、Perplexity、Gemini 等生成式平台上被正确、完整、可追溯地呈现。

当前已有的资产是：`geo-cowork` 仓库中的 SDD 工作流、文档体系和 MyyShop 品牌知识库雏形（120 条知识条目）。这些资产目前只能在单条对话中手工使用，无法被多个 Agent 宿主稳定安装、重复执行和跨 Session 交接。

## 2. 问题陈述

1. 仓库定位冲突：`AGENTS.md` 把仓库定义为"SDD 控制面"，声称只有 `docs/` 被跟踪；实际已跟踪 `workspaces/` 并允许 `plugins/`，且产品目标已转为本地 GEO 专家插件。
2. 没有插件包装：Codex、Claude Code、CodeBuddy/WorkBuddy 三个宿主都没有可识别的 Manifest 和 Marketplace，能力无法被安装。
3. 没有工作区契约：品牌工作区的目录结构、身份文件、初始化和校验规则尚未定义，三个宿主无法对同一品牌工作区产生一致结果。
4. 没有可复验的入口：第一个 Skill（工作区初始化）及其确定性脚本、Fixture 和测试不存在。

## 3. 约束与边界

- 双仓分工已定：`sujingjun/geo-cowork` 负责本地插件与工作区；`weiyan2026/geo-agents` 是未来云端系统，两者当前无运行时依赖。
- 技术栈：Node.js 20+、ESM `.mjs`、`node:test`、零运行时依赖。
- 不引入 MCP、服务进程、数据库、浏览器自动化、Hooks、自定义 Agent 或后台 Monitor。
- 不批量改写现有 MyyShop 知识条目。
- 未经当次明确授权不 commit、push、创建 PR。
- 本次只实施里程碑 0 和 1，不进入 Query、知识、站点或答案测试里程碑。

## 4. 待确认假设

| 假设 | 依据 | 风险 |
| --- | --- | --- |
| CodeBuddy 兼容 Claude 插件目录约定，且显式 `.codebuddy-plugin/` 优先 | 重新定基线方案 §5.3、WorkBuddy 内置插件实例 | 低；以 `codebuddy plugin validate` 实测为准 |
| Codex 本地 Marketplace 可用 `codex plugin marketplace add <path>` 添加 | Codex CLI 0.146.0 实测帮助输出 | 低 |
| 三个宿主对 `SKILL.md` 的 `name` + `description` Frontmatter 交集兼容 | 三份官方规范 | 低 |

## 5. 来源

- `docs/handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md`（本次执行指令）
- `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`（双仓分工与里程碑决策）
- `workspaces/myyshop/knowledge/README.md`（知识治理定义）
