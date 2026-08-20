---
title: 移除 CodeBuddy 适配，第三宿主切换为 WorkBuddy（中国区）专家体系
status: verified
created: 2026-08-20
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 0af4a16（本任务变更未 commit）
source: 用户当次指令「移除CodeBuddy适配，只保留workbuddy。而且中国区官方文档地址是这个：https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Expert-Center。调整方案和文档」
predecessor: docs/records/2026-08-20-milestone-1-hardening-record.md
related:
  - docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md §5、§16
  - docs/specs/0001-plugin-package-contract.md
scope: 删除 CodeBuddy CLI 插件适配层；第三宿主改为 WorkBuddy（中国区）专家体系并如实记录其契约缺失
---

# 移除 CodeBuddy 适配，第三宿主切换为 WorkBuddy（中国区）专家体系

## 任务编号

T-2026-08-20-WORKBUDDY-PIVOT

## 对应上游工件

- 来源：用户当次明确指令（workflow.md §2 冲突顺序第一优先级）；
- 涉及修订：Spec 0001（`proposed`，随本任务修订后仍为 `proposed`）、重新定基线方案 §5/§6/§13/§16（`proposed`）。

## 背景与依据

用户确认中国区官方文档为 workbuddy.cn「专家中心」体系。经抓取官方文档（2026-08-20）核实：

- WorkBuddy 是腾讯云代码助手 CodeBuddy 旗下产品，其专家体系由「专家中心」（官方专家/专家团）与「我的专家」（自定义专家）构成；专家 = 人设 + 方法论 + 工具链；
- 技能市场支持上传本地技能包，但官方文档**未发布开发者契约**：无 manifest/文件格式/目录结构规范、无 CLI 验证命令、无导入/分发协议，也未提及与 Claude Code 或 CodeBuddy CLI 插件规范的兼容性；
- 因此 WorkBuddy 适配当前**无法以仓库级插件包装实现**，只能通过产品内「我的专家/创建技能」人工配置。

## 任务目标

1. 移除 CodeBuddy CLI 插件适配层：`.codebuddy-plugin/plugin.json`、`.codebuddy-plugin/marketplace.json`、`.gitignore` 例外、validate-plugin 检查项、AGENTS.md tracked 清单；
2. 第三宿主定位改为 WorkBuddy（中国区）专家体系：更新根 README、插件 README、Spec 0001、重新定基线方案；官方文档地址统一为 workbuddy.cn；
3. 如实标注 WorkBuddy 包装契约「待官方发布」，不虚构 manifest 或导入格式；
4. 变更后重跑本地与双宿主（Codex、Claude Code）验证；
5. 插件版本 0.1.0 -> 0.2.0（包结构变更）。

## 成功标准

- 仓库中不再存在 `.codebuddy-plugin/` 相关文件与引用（历史 Record 中的事实记录除外）；
- 根 README、AGENTS.md、Spec 0001、重新定基线方案、docs/README.md、CHANGELOG 与新结构一致；
- `node --test`、`validate-plugin.mjs` 全部通过；`claude plugin validate` 通过；Codex 市场与插件可见；
- WorkBuddy 适配状态在文档中如实表述为「待官方开发者契约」，并给出 workbuddy.cn 官方文档链接。

## 范围外事项

- 不为 WorkBuddy 虚构或预置任何 manifest/目录格式；
- 不删除历史 Record 中已记录的 CodeBuddy 验证事实；
- 不改动 Codex 与 Claude Code 适配的行为契约（仅版本号升级）；
- 里程碑 2 实现。

## 前置依赖

- 里程碑 0-1 已完成（HEAD `0af4a16`）。

## 目标文件

- 删除：`plugins/geo-expert/.codebuddy-plugin/plugin.json`、`.codebuddy-plugin/marketplace.json`
- 修改：`.gitignore`、`AGENTS.md`、根 `README.md`、`plugins/geo-expert/README.md`、`plugins/geo-expert/.codex-plugin/plugin.json`、`plugins/geo-expert/.claude-plugin/plugin.json`、`plugins/geo-expert/scripts/validate-plugin.mjs`、`docs/specs/0001-plugin-package-contract.md`、`docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`、`docs/README.md`、根 `CHANGELOG.md`、`plugins/geo-expert/CHANGELOG.md`
- 新建：本 Task、`docs/records/2026-08-20-workbuddy-pivot-record.md`
- 更新：`docs/handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md`

## 测试要求

- 复用既有测试；`plugin-contract.test.mjs` 为通用断言，无需修改即应通过；
- 删除后 `validate-plugin.mjs` 的受检项应为 8 项（2 Manifest + 2 Marketplace + 1 SKILL.md + 3 模板）。

## 验证命令

```bash
node --test
node plugins/geo-expert/scripts/validate-plugin.mjs
claude plugin validate ./plugins/geo-expert
codex plugin list
```

## 风险

- Codex 本地市场指向仓库路径，删除 `.codebuddy-plugin/` 后需实测 Codex 仍能识别插件；
- 用户 CodeBuddy 配置中残留此前添加的 `geo-cowork` 市场注册（写入用户级配置），需尝试移除，失败则如实记录；
- WorkBuddy 官方未来发布开发者契约后，需重新立 Spec 并恢复第三宿主包装。

## 当前状态

verified（验证结果见 docs/records/2026-08-20-workbuddy-pivot-record.md）

## 涉及 Session 与 Handoff

- 本 Session：T-2026-08-20-WORKBUDDY-PIVOT 全程；
- 出口 Handoff：docs/handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md（内容随本任务更新）。
