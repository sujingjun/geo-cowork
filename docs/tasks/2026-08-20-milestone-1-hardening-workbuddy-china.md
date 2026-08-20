---
title: 里程碑 1 加固与中国区 WorkBuddy 专家体系适配
status: verified
created: 2026-08-20
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 0af4a16（开工时工作树干净）
source: 用户当次指令「执行里程碑 1 加固与中国区 WorkBuddy 专家体系适配 Handoff」
predecessor: docs/records/2026-08-20-plugin-initialization-acceptance.md
related:
  - docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md §5.3、§13
  - docs/specs/0001-plugin-package-contract.md
scope: 里程碑 1 遗留风险加固与 CodeBuddy/WorkBuddy（中国区宿主）适配复核
---

# 里程碑 1 加固与中国区 WorkBuddy 专家体系适配

## 任务编号

T-2026-08-20-M1-HARDEN

## 对应上游工件

- 来源：用户当次明确指令（workflow.md §2 冲突顺序第一优先级）；
- 参照：重新定基线方案 §5.3（CodeBuddy/WorkBuddy 适配）、§13（首批验证）、里程碑 0-1 Acceptance Record §8 风险清单；
- 本任务不新增 PRD/Spec：属于已验收里程碑 1 的加固与复核，不改变 Spec 0001/0002 已验证行为。

## 任务目标

1. 消除或缓解里程碑 0-1 验收 Record 中的遗留风险：
   - CodeBuddy CLI 位于 WorkBuddy.app 内嵌路径、应用升级可能改变路径、README 假定用户已配置 PATH 别名；
   - 宿主交互命令（`/reload-plugins`、会话内 `/plugin marketplace add`）未真实验证。
2. 对照 WorkBuddy 官方中文插件文档（2026-08-20 抓取）复核三处契约：Manifest 字段、marketplace.json 字段、技能命名空间与调用形式。
3. 在当前宿主版本（Claude 2.1.237、Codex 0.146.0、CodeBuddy 2.115.0）重跑全套本地与三宿主真实验证，确认里程碑 1 行为未漂移。

## 成功标准

- 仓库根 README 的 CodeBuddy/WorkBuddy 安装章节包含：内嵌 CLI 真实路径定位方法、PATH 别名配置示例、应用升级路径漂移提示、市场与缓存要点；
- 官方中文规范复核结论（含不一致项）写入 Record；
- `node --test`、`validate-plugin.mjs`、`workspace-init/validate` 幂等复验全部通过；
- `claude plugin validate`、`codebuddy plugin validate` 通过；Codex 市场与已安装插件可见；
- 交互式未验证项：尽力以非交互模式补验，无法补验的如实保留为未验证项；
- 不修改 Spec 0001/0002 已验证行为，不批量改写 MyyShop 知识条目。

## 范围外事项

- 里程碑 2（Query 与知识）的任何实现；
- 新增 Skill、脚本或目录结构变更；
- Windows/Linux 宿主验证；
- ChatGPT/Codex 桌面端图形界面验证；
- 虚构 marketplace owner email（当前无公开联系方式，真实 validate 已通过，遵循不虚构数据原则）。

## 前置依赖

- 里程碑 0-1 已验收（HEAD `0af4a16`）；
- 本机存在 WorkBuddy.app 与三宿主 CLI。

## 目标文件

- `README.md`（CodeBuddy/WorkBuddy 安装章节加固）
- `docs/tasks/`、`docs/records/`、`docs/handoff/`、`docs/README.md`、`CHANGELOG.md`（本任务工件与导航）

## 测试要求

- 复用既有 12 项 `node:test` 与 validate-plugin 自检，不新增行为即不新增测试；
- README 新增内容为文档，无代码行为变更。

## 验证命令

```bash
node --test
node plugins/geo-expert/scripts/validate-plugin.mjs
node plugins/geo-expert/scripts/workspace-init.mjs --workspace ./tmp/m1-hardening-smoke --brand M1Hardening
node plugins/geo-expert/scripts/workspace-init.mjs --workspace ./tmp/m1-hardening-smoke --brand M1Hardening  # 幂等复跑
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace ./tmp/m1-hardening-smoke
claude plugin validate ./plugins/geo-expert
/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/cli/bin/codebuddy plugin validate ./plugins/geo-expert
codex plugin list
```

## 风险

- 交互式命令在非交互（`-p`）模式下的行为可能与交互会话不同，补验结论须注明模式差异；
- WorkBuddy 官方文档内容可能随时间变化，复核结论仅对 2026-08-20 抓取版本负责；
- README 中 alias 写法依赖 macOS 默认 zsh，其他 shell 需用户自行调整。

## 当前状态

verified（验证结果见 docs/records/2026-08-20-milestone-1-hardening-record.md；交互式宿主命令的补验受环境限制，保留为未验证项待人工执行）

## 涉及 Session 与 Handoff

- 本 Session：T-2026-08-20-M1-HARDEN 全程；
- 出口 Handoff：docs/handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md。
