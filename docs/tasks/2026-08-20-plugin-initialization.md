---
title: 插件初始化任务清单（里程碑 0—1）
status: verified
created: 2026-08-20
source: docs/plans/2026-08-20-plugin-initialization-plan.md
scope: 仓库重新定基线、三宿主插件骨架、geo-workspace-init 与真实宿主验证
---

# 插件初始化任务清单（里程碑 0—1）

> 全部任务已执行并通过验证，事实以 [`../records/2026-08-20-plugin-initialization-acceptance.md`](../records/2026-08-20-plugin-initialization-acceptance.md) 为准。

## T-001 仓库重新定基线

- 对应：PRD §3.1；Plan 步骤 2
- 目标：消除仓库定位冲突
- 成功标准：`AGENTS.md` 描述本地 GEO 专家插件定位；根 `README.md` 说明产品、安装、工作区与边界；`docs/README.md` 导航新 canonical 工件；`.gitignore` 允许根 README/package.json/CHANGELOG/tests 与两个新 Marketplace 目录
- 范围外：改写 `docs/workflow.md`；批量改写知识条目
- 前置依赖：无
- 目标文件：`AGENTS.md`、`README.md`、`docs/README.md`、`.gitignore`、`package.json`、`CHANGELOG.md`
- 验证命令：`git status --short` 确认新文件可被跟踪
- 状态：done

## T-002 三宿主 Marketplace

- 对应：Spec 0001 §4；Plan 步骤 3
- 目标：三宿主可发现 geo-expert
- 成功标准：`.agents/plugins/marketplace.json`、`.claude-plugin/marketplace.json`、`.codebuddy-plugin/marketplace.json` 存在且指向 `./plugins/geo-expert`
- 范围外：发布到任何远程市场
- 前置依赖：T-001
- 目标文件：三个 marketplace.json
- 验证命令：`node plugins/geo-expert/scripts/validate-plugin.mjs`
- 状态：done

## T-003 插件骨架与 Manifest

- 对应：Spec 0001 §2—§3；Plan 步骤 4
- 目标：三宿主识别同一插件
- 成功标准：三个 plugin.json 存在，`name: geo-expert`、版本一致；插件 README/CHANGELOG 存在
- 范围外：Commands、Agents、Hooks、MCP
- 前置依赖：T-002
- 目标文件：`plugins/geo-expert/.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`.codebuddy-plugin/plugin.json`、`README.md`、`CHANGELOG.md`
- 验证命令：`claude plugin validate ./plugins/geo-expert`、`codebuddy plugin validate ./plugins/geo-expert`
- 状态：done

## T-004 工作区模板与脚本

- 对应：Spec 0002；Plan 步骤 5—6
- 目标：幂等初始化与校验
- 成功标准：模板齐全；init 输出 JSON 含 created/kept/workspace_id；重复 init 全 kept 且字节不变；validate 对完整工作区退出码 0、对缺失项退出码 1
- 范围外：brand/ 目录、知识条目模板
- 前置依赖：T-003
- 目标文件：`plugins/geo-expert/assets/workspace-template/*`、`scripts/workspace-init.mjs`、`scripts/workspace-validate.mjs`、`scripts/validate-plugin.mjs`
- 验证命令：`node plugins/geo-expert/scripts/workspace-init.mjs --workspace ./tmp/workspace-init-smoke` 后 `workspace-validate.mjs`
- 状态：done

## T-005 geo-workspace-init Skill

- 对应：Spec 0001 §5；Plan 步骤 7
- 目标：三宿主共享的初始化入口
- 成功标准：SKILL.md Frontmatter 仅 name/description；正文含触发、输入、必读、步骤、输出、权限边界、停止条件、验收、示例
- 范围外：其余 9 个 Skill
- 前置依赖：T-004
- 目标文件：`plugins/geo-expert/skills/geo-workspace-init/SKILL.md`
- 验证命令：`node plugins/geo-expert/scripts/validate-plugin.mjs`
- 状态：done

## T-006 Fixture 与自动化测试

- 对应：Plan §5；Plan 步骤 1、8
- 目标：失败测试先行并转绿
- 成功标准：`node --test` 全绿；覆盖幂等、不覆盖、身份保留、dry-run、缺失检测、插件契约
- 前置依赖：T-004、T-005
- 目标文件：`tests/*.test.mjs`、`tests/fixtures/workspace-valid/`
- 验证命令：`node --test`
- 状态：done

## T-007 三宿主真实验证

- 对应：Plan §7 验收门；Plan 步骤 10—12
- 目标：真实宿主运行 Skill
- 成功标准：Claude、CodeBuddy validate 通过并实际运行 `/geo-expert:geo-workspace-init`；Codex 市场添加、安装、Skill 触发成功；三宿主必需文件集合一致
- 前置依赖：T-006
- 验证命令：见 Plan §7 与 Handoff §10
- 状态：done
- 备注：CodeBuddy CLI 使用 WorkBuddy.app 内嵌路径；Codex 使用 `codex plugin marketplace add .` + `codex plugin add` + `codex exec`

## T-008 Acceptance Record 与下一 Handoff

- 对应：Handoff §7、§12
- 目标：可交接收口
- 成功标准：Record 含全部真实命令、退出码、首次失败与修复、未验证项；下一 Handoff 指向里程碑 2
- 前置依赖：T-007
- 目标文件：`docs/records/2026-08-20-plugin-initialization-acceptance.md`、`docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`
- 状态：done
