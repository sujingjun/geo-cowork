# 文档导航

本页只负责导航当前权威入口、现有目录和迁移说明；流程、文档分类、状态与交接规则以 [`docs/workflow.md`](workflow.md) 为唯一细节来源，本页不复制或改变其规则。

## 权威入口

| 入口 | 位置 | 说明 |
| --- | --- | --- |
| 仓级规则 | [`../AGENTS.md`](../AGENTS.md) | 仓库定位、控制面边界与规则指向 |
| 工作流规范 | [`workflow.md`](workflow.md) | SDD 人机协同工作流：研发链路、文档职责、状态、授权边界与完成定义 |
| 知识库导航 | [`wiki/index.md`](wiki/index.md) | 可追溯导航摘要入口，源码与工作区状态优先 |

## 当前提案与执行入口

| 工件 | 位置 | 状态与用途 |
| --- | --- | --- |
| 本地 GEO 专家插件重新定基线方案 | [`plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`](plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md) | `proposed`；明确 `geo-cowork` 本地插件与 `geo-agents` 云端系统分仓，定义三宿主插件规范、工作区和里程碑 0—8 |
| 插件初始化 Handoff | [`handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md`](handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md) | `proposed`；交给后续 Agent，只实施仓库重新定基线与三宿主插件骨架，完成后停止 |

以上提案进入实现前，仍须按 `docs/workflow.md` 补齐并批准 Requirement、PRD、Architecture、Spec、Plan 和 Task。Handoff 不能自行提升提案状态。

## 现有目录

| 目录 | 内容 |
| --- | --- |
| [`wiki/`](wiki/index.md) | 项目知识库导航摘要 |
| [`plans/`](plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md) | 实施顺序、技术方案、测试和停止条件 |
| [`handoff/`](handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md) | 跨 Session 或跨 Agent 的继承基线、第一动作和停止条件 |

其余文档类别（架构、需求、PRD、原型、Spec、Task、Record、Runbook、Release、复盘和经验）的目录契约与建档规则见 `docs/workflow.md` 第 2 章；各类目录在首次出现 canonical 文档时创建并加入本导航。
