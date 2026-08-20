---
title: 插件初始化实施计划（里程碑 0—1）
status: proposed
created: 2026-08-20
source: docs/specs/0001-plugin-package-contract.md; docs/specs/0002-workspace-contract.md; docs/handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md
scope: geo-cowork 仓库重新定基线与三宿主插件骨架的实施顺序、测试策略与验收门
---

# 插件初始化实施计划（里程碑 0—1）

## 1. 当前系统现状

- 仓库已有 SDD 工作流、文档导航、MyyShop 工作区知识库（120 条）；
- `AGENTS.md` 与实际跟踪内容冲突（声称只有 `docs/` tracked，实际已跟踪 `workspaces/`、允许 `plugins/`）；
- 无根 README、无 Marketplace、无插件 Manifest、无 Skill、无脚本、无测试；
- 宿主环境实测：Node v22.14.0、Claude Code 2.1.237、Codex CLI 0.146.0、CodeBuddy CLI 2.115.0（WorkBuddy.app 内嵌）均可用。

## 2. 目标与差距

| 目标 | 差距 |
| --- | --- |
| 仓库定位一致 | 需改 `AGENTS.md`、新建根 README、更新 `docs/README.md`、放宽 `.gitignore` 例外 |
| 三宿主识别同一插件 | 需建 3 个 Manifest + 3 个 Marketplace |
| 工作区可幂等初始化 | 需建模板、`workspace-init.mjs`、`workspace-validate.mjs`、`geo-workspace-init` Skill |
| 可复验 | 需建 Fixture、`node:test` 测试、三宿主真实 Smoke Test |

## 3. 技术方案

按 `docs/architecture/2026-08-20-cross-host-plugin-architecture.md`：单插件目录 + 三 Manifest 适配层 + 确定性脚本下沉 + 两段式工作区定位。零运行时依赖，Node 20+ ESM。

## 4. 实施顺序

1. 建立结构与失败测试（测试断言尚不存在的脚本与契约行为）；
2. 修正仓库定位（`AGENTS.md`、根 `README.md`、`docs/README.md`、`.gitignore`、`package.json`、`CHANGELOG.md`）；
3. 三个 Marketplace；
4. 三个 Manifest + 插件 README/CHANGELOG；
5. `assets/workspace-template/` 模板；
6. `scripts/workspace-init.mjs`、`workspace-validate.mjs`、`validate-plugin.mjs`；
7. `skills/geo-workspace-init/SKILL.md`；
8. Fixture 与测试补全，运行 `node --test` 至通过；
9. 本地验证四命令；
10. Claude Code 真实验证（`plugin validate` + `--plugin-dir` 运行 Skill）；
11. CodeBuddy 真实验证（`plugin validate` + `--plugin-dir` 运行 Skill）；
12. Codex 真实验证（市场添加、安装、Skill Smoke Test）；
13. Acceptance Record 与下一 Handoff。

## 5. 测试策略

| 层级 | 内容 | 工具 |
| --- | --- | --- |
| 单元 | init 幂等、不覆盖、workspace.json 身份保留、占位替换、dry-run、validate 缺失检测、validate-plugin 契约检查 | `node:test` + `tests/fixtures/` |
| 静态 | `validate-plugin.mjs` 全量合规 | Node 脚本 |
| 宿主真实 | 三宿主 validate / marketplace add / Skill 运行，产物与 Fixture 必需集合比对 | 宿主 CLI |

首次失败必须记录原始输出与修复过程，写入 Record。

## 6. 风险

| 风险 | 缓解 |
| --- | --- |
| CodeBuddy Manifest 字段与 Claude 不完全同构 | 以 `codebuddy plugin validate` 实测为准，差异写入 Record |
| Codex Skill 在 CLI exec 模式触发方式不同 | 实测 `codex plugin add` 后以显式提示触发，记录真实命令 |
| `claude -p` 非交互运行 Skill 的参数传递 | 在提示词中显式给出 `--workspace` 路径 |
| 宿主 CLI 版本升级导致命令变化 | Record 中记录精确版本号与命令 |

## 7. 验收门

- `node --test` 全绿；
- `validate-plugin.mjs` 退出码 0；
- 空目录 init → validate 退出码 0；重复 init 全部 `kept`；
- `claude plugin validate`、`codebuddy plugin validate` 通过；
- Claude、CodeBuddy `--plugin-dir` 实际运行 `/geo-expert:geo-workspace-init` 并产出合规工作区；
- Codex 市场添加、安装、Skill 触发成功，产物文件集合与 Fixture 一致；
- 三宿主必需文件集合一致；
- Acceptance Record 记录全部真实命令、退出码与未验证项。

## 8. 回滚

所有变更为新增文件与文档改写，未获授权不 commit；回滚即 `git status` 核对后删除新增路径、还原改写文件，无数据迁移风险。
