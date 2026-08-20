---
title: 里程碑 1 加固与中国区 WorkBuddy 专家体系适配验收记录
status: verified
created: 2026-08-20
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 0af4a16（开工时工作树干净，本任务变更未 commit）
task: docs/tasks/2026-08-20-milestone-1-hardening-workbuddy-china.md
related:
  - docs/records/2026-08-20-plugin-initialization-acceptance.md
  - docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md §5.3
scope: README CodeBuddy/WorkBuddy 适配加固、WorkBuddy 官方中文规范复核、三宿主全量复验
---

# 里程碑 1 加固与中国区 WorkBuddy 专家体系适配验收记录

## 1. 基线与工作树初始状态

- 分支 `main`，HEAD `0af4a16 feat: 里程碑 0-1 仓库重新定基线与三宿主插件骨架`，开工时 `git status --short` 干净。
- 宿主环境：Node v22.14.0；Claude Code 2.1.237（`~/.local/bin/claude`）；Codex CLI 0.146.0（`~/.local/bin/codex`）；CodeBuddy CLI 2.115.0（WorkBuddy.app 内嵌 `/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/cli/bin/codebuddy`，PATH 中无独立命令）。
- 本任务不修改任何代码行为：插件 Manifest、Marketplace、Skill、脚本与测试零改动。

## 2. 实际变更

### 修改

- `README.md`：CodeBuddy/WorkBuddy 安装章节新增「定位 CodeBuddy CLI」小节（内嵌路径实测值、`find` 定位方法、zsh alias 配置示例、应用升级路径漂移提示）与「CodeBuddy 插件要点」小节（技能命名空间来源、`/reload-plugins` 热重载、官方市场名 `codebuddy-plugins-official`、缓存目录 `~/.codebuddy/plugins/cache`）。

### 新建

- `docs/tasks/2026-08-20-milestone-1-hardening-workbuddy-china.md`（本任务）；
- 本 Record；
- `docs/handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md`（出口 Handoff）。

### 同步更新

- `docs/README.md`（导航本任务工件）、根 `CHANGELOG.md`。

## 3. WorkBuddy 官方中文规范复核结论（2026-08-20 抓取）

对照 `https://www.workbuddy.ai/docs/zh/cli/plugins` 与 `.../cli/plugin-marketplaces`：

1. **Manifest 兼容**：`.codebuddy-plugin/plugin.json` 必需 `name`、`description`、`version`，只有 `plugin.json` 放在该目录、其余组件在插件根——现有插件结构完全符合，`codebuddy plugin validate` 实测通过。
2. **技能命名空间**：取自 plugin.json 的 `name` 字段（`geo-expert`），与现行 `/geo-expert:geo-workspace-init` 调用形式一致。
3. **marketplace.json**：文档要求 owner 含 `name`、`email`；本仓 owner 仅有 `name`。无公开联系方式可用，按不虚构数据原则未添加占位 email；真实 `validate` 与 `marketplace add` 均通过，记为已知偏差。
4. **文档未提及** `.workbuddy-plugin/` 或 `.claude-plugin/` 隐式兼容；重新定基线方案 §5.3 中「CodeBuddy 兼容 `.workbuddy-plugin/` 和 `.claude-plugin/`」的说法未获当前文档证实。本仓显式维护 `.codebuddy-plugin/` Manifest 的既有决策不受影响，且被本次实测再次验证。
5. **中国区环境**：文档由腾讯云 COS（myqcloud.com）托管；未列 npm 镜像、特殊登录或 ICP 要求；CLI 包为 `npm install -g @tencent-ai/codebuddy-code`。本地 Marketplace（directory 类型）添加不依赖外网，与本地优先设计一致。
6. 文档另载：`--plugin-dir` 本地插件在会话中优先于同名市场插件；`/reload-plugins` 热重载；托管设置经 `.codebuddy/settings.json` 的 `extraKnownMarketplaces` 分发。已将面向用户的部分写入 README。

## 4. 本地验证（全部真实执行）

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `node --test` | 0 | 12/12 通过 |
| `node plugins/geo-expert/scripts/validate-plugin.mjs` | 0 | `ok: true`，10 项受检 |
| `workspace-init.mjs --workspace ./tmp/m1-hardening-smoke --brand M1Hardening`（首次） | 0 | 创建 13 项，`workspace_id: ws_rcfpanjubnyz0vbi87radhlwog` |
| 同命令重复执行 | 0 | `created: []`，13 项全部 `kept`，`workspace_id` 不变 |
| `workspace-validate.mjs --workspace ./tmp/m1-hardening-smoke` | 0 | `ok: true`，`missing: []` |

## 5. 真实宿主验证

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `claude plugin validate ./plugins/geo-expert` | 0 | `✔ Validation passed` |
| CodeBuddy 内嵌 CLI `plugin validate ./plugins/geo-expert`（使用完整内嵌路径执行） | 0 | `✔ Validation passed`，`"valid": true` |
| `codex plugin list` | 0 | `geo-expert@geo-cowork  installed, enabled  0.1.0` |
| CodeBuddy `plugin marketplace add .`（重复添加） | 0 | `Marketplace 'geo-cowork' added successfully`（幂等） |

## 6. 交互式命令补验尝试（未成功，如实记录）

| 尝试 | 宿主实际响应 |
| --- | --- |
| `claude -p "/reload-plugins"` | `/reload-plugins isn't available in this environment.`（退出码 0，命令未执行） |
| CodeBuddy 内嵌 CLI `-p "/reload-plugins"` | 模型回复：该命令为宿主内置交互命令，「当前会话是非交互模式，我无法触发宿主级命令」 |
| CodeBuddy 内嵌 CLI `-p "/plugin marketplace list"` | 模型基于仓库文档作答，非宿主命令真实执行 |

结论：两个宿主均确认此类斜杠命令为交互会话专属，非交互 `-p` 模式无法触发。该未验证项无法由 Agent 在本环境收口，需人类在交互式会话中验证（见 §8）。

## 7. 首次失败与修复

本任务无代码行为变更，无失败修复。§6 的补验尝试属于预期外的宿主限制，按原样记录，未做任何绕过。

## 8. 未验证项

1. Claude/CodeBuddy **交互式**会话中的 `/reload-plugins` 与会话内 `/plugin marketplace add .`（§6：宿主确认非交互模式不可触发，需人工在交互会话中执行一次）；
2. ChatGPT/Codex 桌面端图形界面的安装展示与触发；
3. Windows/Linux 宿主（全部验证在 macOS Darwin 25.5.0）；
4. `.workbuddy-plugin/` / `.claude-plugin/` 目录的隐式兼容（当前官方中文文档未提及，本仓不依赖该兼容）；
5. WorkBuddy 官方文档在本记录之后的内容变化。

## 9. 风险

- WorkBuddy.app 升级可能改变内嵌 CLI 路径（本次已在 README 提供定位与别名方法缓解，但无法预防性消除）；
- marketplace owner 缺 `email` 为对官方文档建议的已知偏差；
- 三宿主 CLI 升级后命令形态可能变化，需按本 Record 复验。

## 10. 下一步

1. 人类在交互式 Claude/CodeBuddy 会话中各执行一次 `/reload-plugins`（及 CodeBuddy 会话内 `/plugin marketplace add .`），将结果补记至本 Record 或新 Record；
2. 按 `docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md` 进入里程碑 2（Query 与知识），前提是里程碑 2 的 Requirement/PRD/Spec 获人类批准。

## 11. 声明

本次执行没有修改插件 Manifest、Marketplace、Skill、脚本或测试的任何行为；没有自动批准知识、自动发布、接入云端 `geo-agents`；没有任何 Git 写操作（未 commit、未 push、未创建 PR）；全部变更保留在工作树中，授权后由人类决定提交。
