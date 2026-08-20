# AGENTS.md — geo-cowork

## 仓库定位

本仓是**本地优先的企业品牌 GEO 专家插件**仓库：维护跨宿主插件（`plugins/geo-expert`）、品牌工作区（`workspaces/`）、SDD 工作流与文档体系（`docs/`）。

- 产品说明、安装与边界见根 [`README.md`](README.md)；文档导航入口见 [`docs/README.md`](docs/README.md)。
- tracked 内容包括：`docs/`、`plugins/`、`workspaces/`、`tests/`、根 `README.md`、`AGENTS.md`、`CHANGELOG.md`、`package.json`、`.gitignore` 及两个 Marketplace 目录（`.agents/`、`.claude-plugin/`）。
- 与云端系统 `weiyan2026/geo-agents` 当前**无运行时依赖**；双仓分工与交接条件见 `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`。

## 权威来源与冲突顺序

- 本仓 SDD 流程、文档分类、状态定义、交接规则与授权边界，以 [`docs/workflow.md`](docs/workflow.md) 为唯一细节来源。
- 插件包装契约见 `docs/specs/0001-plugin-package-contract.md`；工作区契约见 `docs/specs/0002-workspace-contract.md`。
- 发生冲突时的处理顺序见 `docs/workflow.md` 第 2 章「知识库-first + 源码验证」：当前用户明确指令优先，其后为本文件。

## Agent 工作约束

- 开始任何实现类任务前，先阅读本文件与 `docs/workflow.md`，并按其第 8 章明确目标、成功标准、范围外事项与授权限制。
- 知识库（`docs/wiki/`）只作导航与关系发现；给出结论或修改前必须回到实际工作区核验，规则见 `docs/workflow.md` 第 2 章。
- 状态使用、批准权限与授权边界（含 commit、push、创建 PR 需当次明确授权）见 `docs/workflow.md` 第 3、16 章。
- 文档命名、元数据与 Wiki Frontmatter 要求见 `docs/workflow.md` 第 2 章「建档、命名与迁移规则」。
- 插件与脚本红线：不把业务文件写入插件安装缓存；不通过 `../../workspaces` 依赖开发仓库结构；三个 Manifest 不复制 GEO 业务规则；完整红线见重新定基线方案第 14 章。
