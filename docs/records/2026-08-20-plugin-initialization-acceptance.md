---
title: 插件初始化验收记录（里程碑 0—1）
status: verified
created: 2026-08-20
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 48bb687（工作树未 commit，全部变更留在工作树）
task: docs/tasks/2026-08-20-plugin-initialization.md
plan: docs/plans/2026-08-20-plugin-initialization-plan.md
specs: [docs/specs/0001-plugin-package-contract.md, docs/specs/0002-workspace-contract.md]
scope: 仓库重新定基线、三宿主插件骨架、geo-workspace-init、本地与真实宿主验证
---

# 插件初始化验收记录（里程碑 0—1）

## 1. 基线与工作树初始状态

- 分支 `main`，HEAD `48bb687 docs: rebaseline local GEO expert plugin`，开工时 `git status --short` 干净。
- 宿主环境实测：Node v22.14.0；Claude Code 2.1.237（`~/.local/bin/claude`）；Codex CLI 0.146.0（`~/.local/bin/codex`）；CodeBuddy CLI 2.115.0（WorkBuddy.app 内嵌 `/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/cli/bin/codebuddy`，PATH 中无独立 codebuddy）。

## 2. 实际变更

### 修改

- `AGENTS.md`：仓库定位从"SDD 控制面"改为本地 GEO 专家插件仓库；列出实际 tracked 内容；补充插件红线指向。
- `.gitignore`：新增 `!/.claude-plugin/`、`!/.codebuddy-plugin/`、`!tests`、`!README.md`、`!CHANGELOG.md`、`!package.json` 例外（此前这些路径会被 `/*` 忽略）。
- `docs/README.md`：导航里程碑 0—1 canonical 工件与新目录。
- `plugins/geo-expert/README.md`：从两行草稿扩写为插件说明。

### 新建

- 文档：`docs/requirements/`、`docs/prd/`、`docs/architecture/`、`docs/specs/0001`、`docs/specs/0002`、`docs/plans/2026-08-20-plugin-initialization-plan.md`、`docs/tasks/2026-08-20-plugin-initialization.md`、本 Record、里程碑 2 Handoff。
- 仓库根：`README.md`、`CHANGELOG.md`、`package.json`。
- Marketplace：`.agents/plugins/marketplace.json`、`.claude-plugin/marketplace.json`、`.codebuddy-plugin/marketplace.json`。
- 插件：`plugins/geo-expert/.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`.codebuddy-plugin/plugin.json`、`CHANGELOG.md`、`skills/geo-workspace-init/SKILL.md`、`scripts/{workspace-init,workspace-validate,validate-plugin}.mjs`、`assets/workspace-template/{README.md,STATUS.md,workspace.json}`。
- 测试：`tests/workspace-init.test.mjs`、`tests/plugin-contract.test.mjs`、`tests/fixtures/workspace-valid/`（含 10 个目录的 `.gitkeep`）。

## 3. 首次失败与修复

| # | 失败 | 原始证据 | 修复 |
| --- | --- | --- | --- |
| 1 | `node --test` 首次运行 3 个测试文件全部 `ERR_MODULE_NOT_FOUND` | 解析到 `/Users/sujingjun/plugins/...` | 测试 import 路径 `../../plugins` 多一级，改为 `../plugins` |
| 2 | `validate-plugin.mjs` 报三个 Marketplace "source 路径不存在" | `./plugins/geo-expert` 被相对 Marketplace 文件目录解析 | 改为相对仓库根 `REPO_ROOT` 解析（符合 Spec 0001 §4） |
| 3 | 测试"validate 从子目录向上定位"断言失败 | `/var/...` vs `/private/var/...`（macOS 符号链接） | 断言改用 `fs.realpath` 比较 |
| 4 | `codex plugin add geo-expert` 退出码 1 | `Error: plugin requires --marketplace unless passed as <plugin>@<marketplace>` | 改用 `codex plugin add geo-expert@geo-cowork`，退出码 0 |
| 5 | `claude plugin marketplace add .` 退出码 1 | `Invalid marketplace source format` | 改用绝对路径 `/Users/sujingjun/geo-cowork`，成功（Claude 不接受裸 `.`） |

## 4. 本地验证（全部真实执行）

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `node --test` | 0 | 12/12 通过（幂等、不覆盖、身份稳定、模板替换、dry-run、身份冲突退出 3、缺失检测退出 1、向上定位、非法参数退出 2、插件契约×2） |
| `node plugins/geo-expert/scripts/validate-plugin.mjs` | 0 | `ok: true`，10 项受检 |
| `node .../workspace-init.mjs --workspace ./tmp/workspace-init-smoke --brand SmokeBrand` | 0 | 创建 13 项，`workspace_id: ws_vjl2a7033b97r1uzcu3iahgnvs` |
| 同命令重复执行 | 0 | `created: []`，13 项全部 `kept`，`workspace_id` 不变 |
| `node .../workspace-validate.mjs --workspace ./tmp/workspace-init-smoke` | 0 | `ok: true` |
| `node .../workspace-validate.mjs --workspace tests/fixtures/workspace-valid` | 0 | `ok: true` |

## 5. 真实宿主验证

### Claude Code 2.1.237

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `claude plugin validate ./plugins/geo-expert` | 0 | `✔ Validation passed` |
| `claude --plugin-dir ./plugins/geo-expert -p "/geo-expert:geo-workspace-init … --workspace ./tmp/claude-host-smoke --brand ClaudeSmoke" --allowedTools "Bash(node:*)"` | 0 | Skill 真实执行 init+validate；`workspace_id: ws_abxhv02bejuri47k1174k8lcpy`；`workspace-validate` 复核 `ok: true` |
| `claude plugin marketplace add /Users/sujingjun/geo-cowork` | 0 | `Successfully added marketplace: geo-cowork` |

### CodeBuddy 2.115.0（WorkBuddy.app 内嵌 CLI）

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `codebuddy plugin validate ./plugins/geo-expert` | 0 | `✔ Validation passed`，`"valid": true` |
| `codebuddy --plugin-dir ./plugins/geo-expert -p "/geo-expert:geo-workspace-init … --workspace ./tmp/codebuddy-host-smoke --brand CodeBuddySmoke" --allowedTools "Bash(node:*)"` | 0 | Skill 真实执行 init+validate；`workspace_id: ws_355leh45zr6dmabp2ckcelohem`；`ok: true` |
| `codebuddy plugin marketplace add .` | 0 | `Marketplace 'geo-cowork' added successfully` |

### Codex CLI 0.146.0

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `codex plugin marketplace add .` | 0 | `Added marketplace geo-cowork` |
| `codex plugin list` | 0 | `geo-expert@geo-cowork` 可见 |
| `codex plugin add geo-expert@geo-cowork` | 0 | 安装到 `~/.codex/plugins/cache/geo-cowork/geo-expert/0.1.0` |
| `codex exec --sandbox workspace-write "使用 geo-workspace-init skill … ./tmp/codex-host-smoke --brand CodexSmoke"` | 0 | Skill 真实触发，脚本**从安装缓存**执行 init+validate；`workspace_id: ws_ibaigq8z99irdxuwozzfzd3grs`；`ok: true`（期间一次并发校验时序导致临时 missing，重跑通过，未隐瞒） |

### 三宿主一致性

- `diff` 比对 `tmp/{claude,codebuddy,codex}-host-smoke` 的文件集合（排除 `workspace.json`）：**完全一致**；目录集合完全一致。
- 在 Claude 工作区放入用户文件 `queries/note.md` 后重复 init：`created: []`，用户文件内容原样保留。

## 6. 未验证项

1. ChatGPT/Codex 桌面端图形界面的安装展示与触发（本次验证到 Codex CLI 市场添加、安装、`codex exec` 真实 Skill 触发与文件对照为止）；
2. Claude/CodeBuddy **交互式**会话中的 `/reload-plugins` 与 `/plugin marketplace add .`（以 CLI 子命令与 `-p` 打印模式替代验证）；
3. 里程碑 2 及以后的 Query、知识、站点、舆情、答案等 Skill（本次范围外）；
4. Windows/Linux 宿主（全部验证在 macOS Darwin 25.5.0）。

## 7. 数据公开风险

- 三个宿主的 marketplace add 分别写入了 `~/.claude` 用户设置、`~/.codex` 配置与插件缓存、CodeBuddy 配置；均未包含 MyyShop 知识内容。
- `tmp/` 下三个宿主冒烟工作区与 `workspace-init-smoke` 未被 `.gitignore` 例外收录，不会被提交。
- 未读取、复制或公开任何 MyyShop Evidence；现有知识条目零改动。

## 8. 风险

- CodeBuddy CLI 位于 WorkBuddy.app 内嵌路径，应用升级可能改变该路径；README 中的 `codebuddy` 命令假定用户已配置 PATH 别名。
- Codex 以 `codex exec` 自然语言触发 Skill，后续宿主 UI 的显式触发方式以里程碑 2 实测为准。
- 三宿主 CLI 均为当前版本实测；升级后命令变化需重验。

## 9. 下一步

按 `docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md` 进入里程碑 2（Query 与知识），前提是 PRD/Spec 获得人类批准。

## 10. 声明

本次执行没有自动批准知识、没有自动发布、没有接入云端 `geo-agents`、没有任何 Git 写操作（未 commit、未 push、未创建 PR）；全部变更保留在工作树中，授权后由人类决定提交。
