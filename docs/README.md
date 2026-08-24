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

### 里程碑 1 加固与中国区 WorkBuddy 适配（2026-08-20）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| 任务清单 | [`tasks/2026-08-20-milestone-1-hardening-workbuddy-china.md`](tasks/2026-08-20-milestone-1-hardening-workbuddy-china.md) | verified（其中 README CodeBuddy 加固已被下一任务移除，验证事实保留为历史） |
| 验收记录 | [`records/2026-08-20-milestone-1-hardening-record.md`](records/2026-08-20-milestone-1-hardening-record.md) | verified（WorkBuddy workbuddy.ai 规范复核、三宿主复验；交互式命令待人工补验） |

### 移除 CodeBuddy 适配、切换 WorkBuddy 中国区（2026-08-20）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| 任务清单 | [`tasks/2026-08-20-workbuddy-pivot.md`](tasks/2026-08-20-workbuddy-pivot.md) | verified |
| 验收记录 | [`records/2026-08-20-workbuddy-pivot-record.md`](records/2026-08-20-workbuddy-pivot-record.md) | verified（两 Manifest/两 Marketplace、插件 0.2.0、workbuddy.cn 契约核实；WorkBuddy 适配待官方契约） |

## 当前批准产品基线与交接

| 工件 | 位置 | 状态与用途 |
| --- | --- | --- |
| 最终产品方案 | [`plans/2026-08-23-geo-cowork-final-product-plan.md`](plans/2026-08-23-geo-cowork-final-product-plan.md) | `approved`；M2—M8 当前 Owner 批准产品基线，覆盖知识治理、Gap 模型、真实消费者平台测试、GEO Cycle、Agent/Skill/Tool 与开源吸收方案 |
| M2 启动 Handoff | [`handoff/2026-08-23-m2-contract-provenance-kernel-handoff.md`](handoff/2026-08-23-m2-contract-provenance-kernel-handoff.md) | `approved` 历史执行输入；实际结果见 M2 Record |

## M2 Contract & Provenance Kernel（本地开发验收完成）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| Gap Review | [`records/2026-08-23-m2-contract-provenance-gap-review.md`](records/2026-08-23-m2-contract-provenance-gap-review.md) | verified |
| Requirement | [`requirements/2026-08-23-m2-contract-provenance-kernel.md`](requirements/2026-08-23-m2-contract-provenance-kernel.md) | proposed |
| PRD | [`prd/2026-08-23-m2-contract-provenance-kernel.md`](prd/2026-08-23-m2-contract-provenance-kernel.md) | proposed |
| Architecture | [`architecture/2026-08-23-contract-provenance-kernel-architecture.md`](architecture/2026-08-23-contract-provenance-kernel-architecture.md) | proposed |
| Spec 0003 | [`specs/0003-contract-provenance-kernel.md`](specs/0003-contract-provenance-kernel.md) | proposed；不得由本地测试自行批准 |
| Plan / Task | [`plans/2026-08-23-m2-contract-provenance-kernel-plan.md`](plans/2026-08-23-m2-contract-provenance-kernel-plan.md) / [`tasks/2026-08-23-m2-contract-provenance-kernel.md`](tasks/2026-08-23-m2-contract-provenance-kernel.md) | proposed / verified |
| Acceptance Record | [`records/2026-08-24-m2-contract-provenance-kernel-record.md`](records/2026-08-24-m2-contract-provenance-kernel-record.md) | verified；仅限本地源码与 Workspace |

## M3 Knowledge & Query Operating System（本地工程与候选切片验收完成）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| Requirement / PRD / Architecture | [`requirements/2026-08-24-m3-knowledge-query-operating-system.md`](requirements/2026-08-24-m3-knowledge-query-operating-system.md) / [`prd/2026-08-24-m3-knowledge-query-operating-system.md`](prd/2026-08-24-m3-knowledge-query-operating-system.md) / [`architecture/2026-08-24-knowledge-query-operating-system-architecture.md`](architecture/2026-08-24-knowledge-query-operating-system-architecture.md) | proposed；不得由本地验收自行批准 |
| Spec / Plan / Task | [`specs/0004-knowledge-query-operating-system.md`](specs/0004-knowledge-query-operating-system.md) / [`plans/2026-08-24-m3-knowledge-query-operating-system-plan.md`](plans/2026-08-24-m3-knowledge-query-operating-system-plan.md) / [`tasks/2026-08-24-m3-knowledge-query-operating-system.md`](tasks/2026-08-24-m3-knowledge-query-operating-system.md) | proposed / proposed / verified |
| Acceptance Record | [`records/2026-08-24-m3-knowledge-query-operating-system-record.md`](records/2026-08-24-m3-knowledge-query-operating-system-record.md) | verified；仅限本地工程与 MyyShop candidate/draft slice |
| 业务对象批准 Record | [`records/2026-08-24-m3-business-object-approval-record.md`](records/2026-08-24-m3-business-object-approval-record.md) | verified；Owner 已批准 M3 对象，formal Query、frozen Query Set、内部 published KR v1 成立；Evidence warnings 保留 |
| 已执行 Handoff | [`handoff/2026-08-24-m3-knowledge-query-operating-system-handoff.md`](handoff/2026-08-24-m3-knowledge-query-operating-system-handoff.md) | verified；历史创建请求误传模型标签后按 Owner fallback 在原会话收口，正确配置为 `gpt-5.6-sol / max` |

## M4 Diagnosis, Site & Asset Proposal（本地离线工程验收完成）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| 启动 Handoff | [`handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`](handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md) | verified；历史启动输入已执行，真实诊断仍未授权 |
| Requirement / PRD / Architecture | [`requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md`](requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md) / [`prd/2026-08-24-m4-diagnosis-site-asset-proposal.md`](prd/2026-08-24-m4-diagnosis-site-asset-proposal.md) / [`architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md`](architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md) | approved；仅开放本地离线工程，真实执行、人工采用、发布与效果门分离 |
| Spec / Plan / Task | [`specs/0005-diagnosis-site-asset-proposal.md`](specs/0005-diagnosis-site-asset-proposal.md) / [`plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md`](plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md) / [`tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md`](tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md) | approved / approved / verified；真实 MyyShop 采集不在授权内 |
| Acceptance Record | [`records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md`](records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md) | verified；仅限源码、脱敏 Fixture、只读 Workspace 兼容与派生 index |
| 整体优化 Handoff | [`handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`](handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md) | proposed；列出 M5 P0 阻塞点，不代表优化、M5 或真实采集获批 |

## 历史提案与交接

| 工件 | 位置 | 状态与用途 |
| --- | --- | --- |
| 本地 GEO 专家插件重新定基线方案 | [`plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`](plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md) | `proposed`；历史双仓分工、宿主插件规范和原 M0—M8 规划；与 2026-08-23 最终产品方案冲突部分以后者为准 |
| 插件初始化 Handoff | [`handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md`](handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md) | 历史执行基线；里程碑 0—1 |
| CodeBuddy 移除与 WorkBuddy 切换 Handoff | [`handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md`](handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md) | 历史 WorkBuddy 契约跟踪与 M1 收口基线 |
| 原“Query 与知识” M2 Handoff | [`handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`](handoff/2026-08-20-query-and-knowledge-milestone-handoff.md) | 已被 2026-08-23 产品基线重排；保留历史，不再作为当前 M2 启动指令 |

M2–M4 的本地实现与验证已有各自 Record；下一任务只从整体优化 Handoff 评审。Record/Handoff 都不能自行提升 PRD、Spec、业务批准、真实采集、发布或部署状态。

## 现有目录

| 目录 | 内容 |
| --- | --- |
| [`requirements/`](requirements/2026-08-20-local-geo-expert-plugin.md) | 原始诉求、约束与待确认假设 |
| [`prd/`](prd/2026-08-20-local-geo-expert-plugin.md) | 用户、场景、业务规则与业务验收 |
| [`architecture/`](architecture/2026-08-20-cross-host-plugin-architecture.md) | 目标形态、模块关系与待批准架构决策 |
| [`specs/`](specs/0001-plugin-package-contract.md) | 插件包与工作区系统契约 |
| [`plans/`](plans/2026-08-23-geo-cowork-final-product-plan.md) | 产品方案、实施顺序、技术方案、测试和停止条件 |
| [`tasks/`](tasks/2026-08-20-plugin-initialization.md) | 可独立执行、验证和交接的最小工作单元 |
| [`records/`](records/2026-08-20-plugin-initialization-acceptance.md) | 实际命令、结果、失败、修复与未验证项 |
| [`wiki/`](wiki/index.md) | 项目知识库导航摘要 |
| [`handoff/`](handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md) | 跨 Session 或跨 Agent 的继承基线、第一动作和停止条件 |

其余文档类别（原型、Runbook、Release、复盘和经验）的目录契约与建档规则见 `docs/workflow.md` 第 2 章；各类目录在首次出现 canonical 文档时创建并加入本导航。
