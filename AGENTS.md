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

## 飞书知识库镜像（MyyShop GEO）

本仓在飞书维护一套面向业务阅读的 **MyyShop GEO 知识库镜像**，用于共享知识条目、模版、阶段性治理建议、内容/证据缺口持续报告与业务确认记录。

- **位置**：知识库分组节点 `MyyShop GEO知识库`，URL <https://sjfx.feishu.cn/wiki/U1dqwTq6oiTkGkkUPuScw2mjnIg>（`space_id=7070727875250421762`，根 `node_token=U1dqwTq6oiTkGkkUPuScw2mjnIg`）。
- **操作身份**：lark-cli profile `dh-docs`（应用 `cli_a8c15e8aadb9d00b`「飞书博客」），一律 `--as bot`；该应用已被加为上述知识空间成员。文档归应用所有，便于自动化持续维护。
- **事实源边界**：本地仓库是唯一事实源，飞书为只读镜像/导航。任何结论与修改先在仓库完成并核验，再同步到飞书；禁止以飞书内容反向覆盖仓库。镜像页须标注对应仓库路径。
- **文档与源映射**（仓库 → 飞书子文档）：
  - 知识库总览与宪法 ← `workspaces/myyshop/knowledge/README.md`
  - 知识条目 02–10（9 个分类文档，合并该分类全部条目，不逐条建 doc）← `knowledge/<分类>/`
  - 模版 ← `knowledge/01-templates/`
  - 阶段性治理建议（站内/站外）← `knowledge/00-governance/`、`findings/`、`cycles/m5/`、`workspaces/myyshop/STATUS.md` 综合
  - 内容缺口与证据缺口持续报告 ← `workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md`
  - 业务确认文档 ← `workspaces/myyshop/cycles/preparation/decisions/`
- **同步触发**：上述仓库源文件发生批准的变更后，由 Agent 重新生成对应飞书镜像并更新；分类条目文档由 `tmp/feishu-build/gen-categories.mjs` 一类脚本批量生成，缺口报告仅做相对链接转写。
- **授权边界**：创建/更新飞书文档属对外可见写入，按 `docs/workflow.md` 授权规则需当次明确授权；不在飞书侧做审批、不写入任何凭据或账号标识。
