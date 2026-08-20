# 文档导航

本页只负责导航当前权威入口、现有目录和迁移说明；流程、文档分类、状态与交接规则以 [`docs/workflow.md`](workflow.md) 为唯一细节来源，本页不复制或改变其规则。

## 权威入口

| 入口 | 位置 | 说明 |
| --- | --- | --- |
| 仓级规则 | [`../AGENTS.md`](../AGENTS.md) | 本地 GEO 专家插件仓库定位、边界与规则指向 |
| 产品说明 | [`../README.md`](../README.md) | 产品定位、三宿主安装、工作区与边界 |
| 工作流规范 | [`workflow.md`](workflow.md) | SDD 人机协同工作流：研发链路、文档职责、状态、授权边界与完成定义 |
| 知识库导航 | [`wiki/index.md`](wiki/index.md) | 可追溯导航摘要入口，源码与工作区状态优先 |

## 本地 GEO 专家 canonical 工件（里程碑 0—1）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| 原始需求 | [`requirements/2026-08-20-local-geo-expert-plugin.md`](requirements/2026-08-20-local-geo-expert-plugin.md) | proposed |
| PRD | [`prd/2026-08-20-local-geo-expert-plugin.md`](prd/2026-08-20-local-geo-expert-plugin.md) | proposed |
| 架构设计 | [`architecture/2026-08-20-cross-host-plugin-architecture.md`](architecture/2026-08-20-cross-host-plugin-architecture.md) | proposed |
| Spec 0001 插件包契约 | [`specs/0001-plugin-package-contract.md`](specs/0001-plugin-package-contract.md) | proposed |
| Spec 0002 工作区契约 | [`specs/0002-workspace-contract.md`](specs/0002-workspace-contract.md) | proposed |
| 实施计划 | [`plans/2026-08-20-plugin-initialization-plan.md`](plans/2026-08-20-plugin-initialization-plan.md) | proposed |
| 任务清单 | [`tasks/2026-08-20-plugin-initialization.md`](tasks/2026-08-20-plugin-initialization.md) | verified |
| 验收记录 | [`records/2026-08-20-plugin-initialization-acceptance.md`](records/2026-08-20-plugin-initialization-acceptance.md) | verified（三宿主真实验证通过） |

## 提案与交接

| 工件 | 位置 | 状态与用途 |
| --- | --- | --- |
| 本地 GEO 专家插件重新定基线方案 | [`plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`](plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md) | `proposed`；双仓分工、三宿主插件规范、里程碑 0—8 |
| 插件初始化 Handoff | [`handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md`](handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md) | 本次执行基线；里程碑 0—1 |
| 里程碑 2 Handoff | [`handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`](handoff/2026-08-20-query-and-knowledge-milestone-handoff.md) | 里程碑 0—1 验收后生效；Query 与知识 |

以上提案进入实现前，仍须按 `docs/workflow.md` 补齐并批准 Requirement、PRD、Architecture、Spec、Plan 和 Task。Handoff 不能自行提升提案状态。

## 现有目录

| 目录 | 内容 |
| --- | --- |
| [`requirements/`](requirements/2026-08-20-local-geo-expert-plugin.md) | 原始诉求、约束与待确认假设 |
| [`prd/`](prd/2026-08-20-local-geo-expert-plugin.md) | 用户、场景、业务规则与业务验收 |
| [`architecture/`](architecture/2026-08-20-cross-host-plugin-architecture.md) | 目标形态、模块关系与待批准架构决策 |
| [`specs/`](specs/0001-plugin-package-contract.md) | 插件包与工作区系统契约 |
| [`plans/`](plans/2026-08-20-plugin-initialization-plan.md) | 实施顺序、技术方案、测试和停止条件 |
| [`tasks/`](tasks/2026-08-20-plugin-initialization.md) | 可独立执行、验证和交接的最小工作单元 |
| [`records/`](records/2026-08-20-plugin-initialization-acceptance.md) | 实际命令、结果、失败、修复与未验证项 |
| [`wiki/`](wiki/index.md) | 项目知识库导航摘要 |
| [`handoff/`](handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md) | 跨 Session 或跨 Agent 的继承基线、第一动作和停止条件 |

其余文档类别（原型、Runbook、Release、复盘和经验）的目录契约与建档规则见 `docs/workflow.md` 第 2 章；各类目录在首次出现 canonical 文档时创建并加入本导航。
