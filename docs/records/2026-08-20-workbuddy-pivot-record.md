---
title: 移除 CodeBuddy 适配、切换 WorkBuddy（中国区）验收记录
status: verified
created: 2026-08-20
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 0af4a16（本任务变更未 commit）
task: docs/tasks/2026-08-20-workbuddy-pivot.md
predecessor: docs/records/2026-08-20-milestone-1-hardening-record.md
related:
  - docs/specs/0001-plugin-package-contract.md（随本任务修订）
  - docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md §5.3（随本任务修订）
scope: 删除 CodeBuddy 适配层、第三宿主定位改为 WorkBuddy（中国区）专家体系、变更后验证
---

# 移除 CodeBuddy 适配、切换 WorkBuddy（中国区）验收记录

## 1. 基线与指令来源

- 分支 `main`，HEAD `0af4a16`，开工时工作树含上一任务（里程碑 1 加固）的未提交变更。
- 用户当次指令：「移除CodeBuddy适配，只保留workbuddy。而且中国区官方文档地址是这个：https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Expert-Center。调整方案和文档」。
- 宿主环境：Node v22.14.0；Claude Code 2.1.237；Codex CLI 0.146.0；CodeBuddy CLI 2.115.0（WorkBuddy.app 内嵌，仅用于清理用户配置）。

## 2. 官方文档核实（2026-08-20 抓取 workbuddy.cn）

抓取了专家中心、技能市场（Skills-Market）、实践八（创建自定义 Skills）三个页面：

1. WorkBuddy 是腾讯云代码助手 CodeBuddy 旗下 AI 任务执行型产品；专家体系 = 专家中心（官方专家/专家团）+ 我的专家（自定义专家）；专家 = 人设 + 方法论 + 工具链；
2. 技能市场支持上传本地技能包与自然语言创建技能，但**未发布开发者契约**：无 manifest、文件格式、目录结构、导入协议、CLI 验证命令，也未提及与 Claude Code / CodeBuddy CLI 插件规范的兼容性；
3. 结论：WorkBuddy 当前无法仓库级插件包装；过渡期只能经「我的专家/创建技能」人工配置。该结论已写入重新定基线方案 §5.3 与根 README。

## 3. 实际变更

### 删除

- `plugins/geo-expert/.codebuddy-plugin/plugin.json`（连同空目录）
- `.codebuddy-plugin/marketplace.json`（连同空目录）

### 修改

- `plugins/geo-expert/scripts/validate-plugin.mjs`：MANIFESTS/MARKETPLACES 清单移除 CodeBuddy 项，措辞「三个 Manifest」改「各 Manifest」；
- `.gitignore`：移除 `!/.codebuddy-plugin/` 例外；
- `AGENTS.md`：tracked 清单改为两个 Marketplace 目录；
- 根 `README.md`：产品定位改为「Codex、Claude Code 两个已适配宿主 + WorkBuddy 待契约」；原「CodeBuddy / WorkBuddy」安装章节（含上一任务新增的 CLI 定位/alias/市场要点）整体替换为「WorkBuddy（中国区，待适配）」章节，含官方文档链接与过渡期用法；
- `plugins/geo-expert/README.md`：结构说明改为两 Manifest；
- `plugins/geo-expert/.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`：版本 0.1.0 -> 0.2.0；
- `plugins/geo-expert/CHANGELOG.md`：新增 0.2.0 条目；
- `docs/specs/0001-plugin-package-contract.md`：§1/§2/§3.1/§3.4/§4.3/§5/§6/§7 同步为两 Manifest、两 Marketplace；§3.4/§4.3 改为「WorkBuddy（中国区，待契约）」；frontmatter 增加 revision；
- `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`：§1 愿景、§3 v1.0 标准、§4.1、§5 标题与 §5.3/§5.4、§6 目录树、§8 Frontmatter 说明、§11 里程碑表、§12 第 10 步加历史注记、§13 验证命令、§16 官方规范链接（workbuddy.ai 三条替换为 workbuddy.cn 三条）；frontmatter 增加 revision；
- `docs/architecture/2026-08-20-cross-host-plugin-architecture.md`：架构图、模块表（Manifest ×2 / Marketplace ×2）、AD-1、AD-2 措辞同步；frontmatter 增加 revision；
- `docs/prd/2026-08-20-local-geo-expert-plugin.md`：最小可用形态与用户定义改为两宿主 + WorkBuddy 待契约；待确认问题替换为 WorkBuddy 契约问题；
- `docs/requirements/2026-08-20-local-geo-expert-plugin.md`：frontmatter 增加 revision（CodeBuddy 条目保留为历史原始记录）；
- `docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`：基线补充本次切换说明；里程碑 2 宿主验证范围改为 Codex 与 Claude Code；
- `docs/handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md`：整体更新为本次切换后的方向（supersedes_note 保留原身份说明）；
- `docs/README.md`、根 `CHANGELOG.md`：导航与变更记录同步。

### 新建

- `docs/tasks/2026-08-20-workbuddy-pivot.md`（本任务）
- 本 Record

### 用户配置清理

- 执行 `codebuddy plugin marketplace remove geo-cowork`（WorkBuddy.app 内嵌 CLI）：`✔ Marketplace 'geo-cowork' removed successfully`，退出码 0。此前写入用户 CodeBuddy 配置的本地市场注册已清除。

### 与上一任务的关系

上一任务（里程碑 1 加固，`docs/tasks/2026-08-20-milestone-1-hardening-workbuddy-china.md`）中对根 README 的 CodeBuddy CLI 定位/alias/市场要点加固，已随本次 CodeBuddy 适配移除而删除；该任务与 Record 中的验证事实（含 CodeBuddy 宿主实测）保留为历史记录，不作改写。

## 4. 变更后验证（全部真实执行）

| 命令 | 退出码 | 结果 |
| --- | --- | --- |
| `node --test` | 0 | 12/12 通过 |
| `node plugins/geo-expert/scripts/validate-plugin.mjs` | 0 | `ok: true`，受检 8 项（2 Manifest + 2 Marketplace + 1 SKILL.md + 3 模板） |
| `claude plugin validate ./plugins/geo-expert` | 0 | `✔ Validation passed` |
| `codex plugin add geo-expert@geo-cowork`（重装） | 0 | 安装至 `~/.codex/plugins/cache/geo-cowork/geo-expert/0.2.0` |
| `codex plugin list` | 0 | `geo-expert@geo-cowork  installed, enabled  0.2.0` |
| `codebuddy plugin marketplace remove geo-cowork` | 0 | 移除成功（用户配置清理） |

## 5. 首次失败与修复

| # | 失败 | 修复 |
| --- | --- | --- |
| 1 | 多处 Edit 工具因原文使用长破折号「-」（U+2014）而非连字符匹配失败 | 改用精确字符/Python 脚本完成替换 |

## 6. 未验证项

1. WorkBuddy（中国区）宿主侧任何行为（无开发者契约，无从验证；过渡期人工配置路径未经真人试用）；
2. Claude 交互式会话中的 `/reload-plugins`（上一任务遗留，仍待人工执行）；
3. Windows/Linux 宿主（全部验证在 macOS Darwin 25.5.0）。

## 7. 风险

- WorkBuddy 官方文档后续发布开发者契约时，需新立 Spec 恢复适配（已在重新定基线方案 §5.3 与 Handoff 中列为停止条件）；
- workbuddy.cn 文档结论仅对 2026-08-20 抓取版本负责；
- Codex 缓存中曾存在 0.1.0 旧版本目录（`~/.codex/plugins/cache/geo-cowork/geo-expert/0.1.0`），已被 0.2.0 安装取代但未删除，属宿主缓存，不由本仓管理。

## 8. 下一步

按 `docs/handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md` 进入里程碑 2（宿主范围 Codex 与 Claude Code），前提是里程碑 2 的 Requirement/PRD/Spec 获人类批准；开工时快速核对 WorkBuddy 官方契约发布状态。

## 9. 声明

本次执行没有虚构 WorkBuddy 任何 manifest 或导入格式；没有自动批准知识、自动发布、接入云端 `geo-agents`；除清理本仓此前写入的用户级 CodeBuddy 市场注册外，没有修改用户宿主配置；没有任何 Git 写操作（未 commit、未 push、未创建 PR）；全部变更保留在工作树中，授权后由人类决定提交。
