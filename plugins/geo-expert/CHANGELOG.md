# geo-expert 变更记录

## 0.2.0 — 2026-08-20（移除 CodeBuddy 适配，切换 WorkBuddy 中国区定位）

- 移除 `.codebuddy-plugin/plugin.json` 与仓库根 `.codebuddy-plugin/marketplace.json`；
- 第三宿主定位改为 WorkBuddy（中国区）专家体系，其包装契约待官方发布（当前文档仅有用户级操作指南，无开发者契约）；
- `validate-plugin.mjs` 检查项同步收缩为两个 Manifest 与两个 Marketplace。

## 0.1.0 — 2026-08-20（里程碑 1：三宿主插件骨架）

- 新增 Codex / Claude Code / CodeBuddy 三个 Manifest；
- 新增 `geo-workspace-init` Skill；
- 新增工作区模板与 `workspace-init.mjs`、`workspace-validate.mjs`、`validate-plugin.mjs` 脚本（零运行时依赖）。
