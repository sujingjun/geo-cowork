# 文档导航

## 2026-10-17 OneGlanse MCP 对接规划

[开发计划](plans/2026-10-17-oneglanse-mcp-integration-plan.md)（implemented）按双方职责实现首版接口：OneGlanse 维护 MCP 授权/9 Tools，cowork 更新现有 Skill 并完整接收答案与引用。[任务与范围](tasks/2026-10-17-oneglanse-mcp-integration.md)、[联调记录](records/2026-10-17-oneglanse-mcp-integration-record.md)记录 MyyShop 单 Query/Gemini 的真实链路与 hash；[GEO 候选观察](records/2026-10-17-oneglanse-geo-observation.md)保持业务证据边界。当前采集 Agent 与 MCP 均以 `dhnb/oneglanse` 为准；[整体流程试跑与能力缺口](records/2026-10-17-myyshop-geo-full-flow-audit.md)确认单 Query 回传和实际 DeepSeek 候选诊断成功，但正式接续、知识批准、采集证据与测量条件尚未闭合。当前 OneGlanse 默认模型调用连接失败，正式 Cycle 仍暂停。[边界与清理记录](records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)和[首次源码核验](records/2026-10-17-oneglanse-mcp-planning-record.md)保留历史依据。

## 2026-09-20 正式真实双周期

当前执行入口：[Spec 0015](specs/0015-authorized-real-two-cycle.md)、[Plan](plans/2026-09-20-authorized-real-two-cycle-plan.md)、[Task](tasks/2026-09-20-authorized-real-two-cycle.md)、[主 Agent 验收 Record](records/2026-09-20-authorized-real-two-cycle-record.md)、[操作手册](runbooks/authorized-real-two-cycle.md)。工程实现和真实业务周期分别验收；Owner当前要求仅工程复验收尾，真实执行与heartbeat已暂停，知识批准为defer。


本页只负责导航当前权威入口、现有目录和迁移说明；流程、文档分类、状态与交接规则以 [`docs/workflow.md`](workflow.md) 为唯一细节来源，本页不复制或改变其规则。

## 权威入口

| 入口 | 位置 | 说明 |
| --- | --- | --- |
| 仓级规则 | [`../AGENTS.md`](../AGENTS.md) | 本地 GEO 专家插件仓库定位、边界与规则指向 |
| 产品说明 | [`../README.md`](../README.md) | 产品定位、三宿主安装、工作区与边界 |
| 工作流规范 | [`workflow.md`](workflow.md) | SDD 人机协同工作流：研发链路、文档职责、状态、授权边界与完成定义 |
| 领域上下文 | [`../CONTEXT-MAP.md`](../CONTEXT-MAP.md) | GEO Lifecycle 与 Browser Product 的术语、职责和边界映射 |
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
| M6—M8 测试商户总 Lead Handoff | [`handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md`](handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md) | `proposed`；独立测试商户工程闭环、总 Lead 委派、Spec 人工门和真实 MyyShop 隔离控制面 |
| 账号与数据准备 Runbook | [`runbooks/geo-cowork-account-data-readiness.md`](runbooks/geo-cowork-account-data-readiness.md) | `proposed`；测试商户、真实 MyyShop 内测、M5/M6/M8 的最小账号权限、数据包、安全和授权 Checklist |
| GA4/GSC 只读接入 Runbook | [`runbooks/ga4-gsc-readonly-analytics.md`](runbooks/ga4-gsc-readonly-analytics.md) | `implemented`；OAuth/ADC、exact plan、dry-run、真实 smoke、临时数据与撤销 |

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
| 启动 Handoff | [`handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`](handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md) | verified；历史启动输入已执行；该任务原本不授权真实诊断，后续公开采集由独立 Decision/Plan/Record 授权 |
| Requirement / PRD / Architecture | [`requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md`](requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md) / [`prd/2026-08-24-m4-diagnosis-site-asset-proposal.md`](prd/2026-08-24-m4-diagnosis-site-asset-proposal.md) / [`architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md`](architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md) | approved；本地工程、后续公开只读执行、人工采用、发布与效果门保持分离 |
| Spec / 原 Plan / 原 Task | [`specs/0005-diagnosis-site-asset-proposal.md`](specs/0005-diagnosis-site-asset-proposal.md) / [`plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md`](plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md) / [`tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md`](tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md) | approved / approved / verified；仅证明原离线实施范围 |
| Acceptance Record | [`records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md`](records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md) | verified；仅限源码、脱敏 Fixture、只读 Workspace 兼容与派生 index |
| 公开采集 Plan / Task | [`plans/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-plan.md`](plans/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-plan.md) / [`tasks/2026-08-24-m2-m4-optimization-and-myyshop-real-collection.md`](tasks/2026-08-24-m2-m4-optimization-and-myyshop-real-collection.md) | approved / verified；只覆盖 11 个精确公开 URL 与直接相关优化 |
| 公开采集与优化 Record | [`records/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-record.md`](records/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-record.md) | verified；11/11 快照、五页 Site Run、11 份 candidate 一方 Evidence；GA4/GSC/消费者平台/外部写入仍未授权 |
| 整体优化 Handoff | [`handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`](handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md) | proposed；记录已完成的直接优化、五层信源模型与 M5 P0；下一任务独立判断进入门 |

## M5 Consumer Answer Testing / 持续信源体系（五平台正式英文两槽 Baseline 已验证）

| 类别 | 工件 | 状态 |
| --- | --- | --- |
| 独立 Review Record | [`records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md`](records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md) | verified；历史规划门结论，后续 Owner 已另行批准离线实现 |
| Requirement / PRD / Architecture | [`requirements/2026-08-24-m5-consumer-answer-testing.md`](requirements/2026-08-24-m5-consumer-answer-testing.md) / [`prd/2026-08-24-m5-consumer-answer-testing.md`](prd/2026-08-24-m5-consumer-answer-testing.md) / [`architecture/2026-08-24-consumer-answer-testing-architecture.md`](architecture/2026-08-24-consumer-answer-testing-architecture.md) | approved；授权 T02—T08 与五平台账号/隐私范围，真实执行仍受 Terms/robots 限制 |
| Spec 0006 / Plan / Task | [`specs/0006-consumer-answer-testing.md`](specs/0006-consumer-answer-testing.md) / [`plans/2026-08-24-m5-consumer-answer-testing-plan.md`](plans/2026-08-24-m5-consumer-answer-testing-plan.md) / [`tasks/2026-08-24-m5-consumer-answer-testing.md`](tasks/2026-08-24-m5-consumer-answer-testing.md) | approved / approved / implemented；五平台正式英文两槽 Baseline verified；人工 Review 与 Retest 仍是阶段门，100 Source 仅为非阻塞批处理触发器 |
| M5 信源/采集设计修订 Record | [`records/2026-08-25-m5-source-system-and-collector-design-record.md`](records/2026-08-25-m5-source-system-and-collector-design-record.md) | verified；记录无冷启动导入、Playwright/真实采集设计和本地验证；不是实现批准 |
| M5 离线工程 Record | [`records/2026-08-25-m5-offline-consumer-answer-testing-record.md`](records/2026-08-25-m5-offline-consumer-answer-testing-record.md) | verified；七类对象、recorded Fixture、恢复、Source/Review/聚合与回归；不是真实 Baseline |
| M5 Playwright / 平台条款门 Record | [`records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md`](records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md) | T08 verified；T09 guard engineering 通过但真实 Smoke blocked；未访问账号或 UI |
| ChatGPT 人工 Smoke Record | [`records/2026-08-25-m5-chatgpt-manual-smoke-record.md`](records/2026-08-25-m5-chatgpt-manual-smoke-record.md) | 1 个 Temporary Chat exploratory/manual Sample、3 Citation；不是 Baseline，Classification 待复核 |
| Gemini 人工 Smoke Record | [`records/2026-08-25-m5-gemini-manual-smoke-record.md`](records/2026-08-25-m5-gemini-manual-smoke-record.md) | 1 个 exploratory/manual Sample、0 Citation；后续移除 permission ref 硬门 |
| Google AI 人工共享 Smoke Record | [`records/2026-08-26-m5-google-ai-manual-share-smoke-record.md`](records/2026-08-26-m5-google-ai-manual-share-smoke-record.md) | 1 个 exploratory/manual Sample、9 Citation/Source/候选 Classification；不是 Baseline |
| Claude CN/US 人工共享 Smoke Record | [`records/2026-08-26-m5-claude-manual-share-smoke-record.md`](records/2026-08-26-m5-claude-manual-share-smoke-record.md) | CN/US 各 1 个成功 exploratory Sample；只记采集基线差异，不作 IP 对比 |
| Perplexity 用户导出 Markdown Smoke Record | [`records/2026-08-26-m5-perplexity-user-export-smoke-record.md`](records/2026-08-26-m5-perplexity-user-export-smoke-record.md) | 1 个 user-supplied-export/manual Sample、5 Citation；页面与自动化仍 blocked |
| M5 两槽英文 Baseline 第 1 槽 Record | [`records/2026-08-26-m5-two-slot-english-baseline-slot1-record.md`](records/2026-08-26-m5-two-slot-english-baseline-slot1-record.md) | verified；五平台各 1 个正式英文 slot、52 个新 Citation、33/100 唯一 Source、5 个 candidate Review；Run 均 waiting_human 1/2 |
| M5 两槽英文 Baseline Record | [`records/2026-08-26-m5-two-slot-english-baseline-record.md`](records/2026-08-26-m5-two-slot-english-baseline-record.md) | verified；五平台均 2/2、10 candidate Review、5 computed Aggregation、40/100 Source；人工 Review/Retest 仍是阶段门，分类为非阻塞维护项且其 M5/v1 地位待新 PRD 明确 |
| M5 两槽继续执行 Handoff | [`handoff/2026-08-26-m5-two-slot-baseline-continuation-handoff.md`](handoff/2026-08-26-m5-two-slot-baseline-continuation-handoff.md) | verified；第 2 槽任务已执行，当前出口转为人工 Review、60 个 Source 与 M3/M4 后续门 |
| M5 Baseline 收口与知识优化 Handoff | [`handoff/2026-08-26-m5-baseline-closeout-and-knowledge-optimization-handoff.md`](handoff/2026-08-26-m5-baseline-closeout-and-knowledge-optimization-handoff.md) | `proposed` 历史顺序；当前拟议顺序见 2026-09-04 阻塞收口 Plan，旧 Handoff 不授权执行 |
| 平台许可需求池条目 | [`requirements/2026-08-25-platform-automation-permission-backlog.md`](requirements/2026-08-25-platform-automation-permission-backlog.md) | proposed / 待规划；是否启动规范仅由 Owner 决定 |

## Browser Query Task MCP 自动化（已批准，本地已实现）

| 类别 | 工件 | 状态与用途 |
| --- | --- | --- |
| Requirement / PRD | [`requirements/2026-09-03-browser-query-task-mcp-automation.md`](requirements/2026-09-03-browser-query-task-mcp-automation.md) / [`prd/2026-09-03-browser-query-task-mcp-automation.md`](prd/2026-09-03-browser-query-task-mcp-automation.md) | Requirement `proposed` / PRD `approved`；Cycle 输入、扩展任务、登录接管、结果提取与 Cowork 物化旅程 |
| Architecture / ADR | [`architecture/2026-09-03-browser-query-task-mcp-automation-architecture.md`](architecture/2026-09-03-browser-query-task-mcp-automation-architecture.md) / [`adr/0002-browser-server-streamable-http-mcp-boundary.md`](adr/0002-browser-server-streamable-http-mcp-boundary.md) | `proposed` / 已确认决策；同机 Browser MCP Server、Codex Host Client、pending pull 边界 |
| Spec 0013 | [`specs/0013-browser-query-task-mcp-automation.md`](specs/0013-browser-query-task-mcp-automation.md) | `approved`；MCP Tool、task/capture/extraction/ack、插件 `.mcp.json` 合同 |
| Plan / Task | [`plans/2026-09-03-browser-query-task-mcp-automation-plan.md`](plans/2026-09-03-browser-query-task-mcp-automation-plan.md) / [`tasks/2026-09-03-browser-query-task-mcp-automation.md`](tasks/2026-09-03-browser-query-task-mcp-automation.md) | Plan `approved` / Task `implemented`；Browser 专项与真实 Chrome for Testing fixture 已通过，全仓门仍有独立失败 |
| 通信研究 Record | [`records/2026-09-03-browser-cowork-communication-research-record.md`](records/2026-09-03-browser-cowork-communication-research-record.md) | `verified`；官方 MCP/Codex/Chrome 能力与 Owner 最终角色决定 |
| 实施 Record | [`records/2026-09-03-browser-query-task-mcp-automation-record.md`](records/2026-09-03-browser-query-task-mcp-automation-record.md) | `implemented`；记录红绿测试、真实 loopback UI/MCP/Cowork 闭环、全仓失败与未授权边界 |

## Knowledge-Independent GEO Lifecycle Readiness（当前批准基线）

| 类别 | 工件 | 状态与用途 |
| --- | --- | --- |
| Requirement / PRD | [`requirements/2026-09-02-knowledge-independent-lifecycle-readiness.md`](requirements/2026-09-02-knowledge-independent-lifecycle-readiness.md) / [`prd/2026-09-02-knowledge-independent-lifecycle-readiness.md`](prd/2026-09-02-knowledge-independent-lifecycle-readiness.md) | `approved`；唯一 MyyShop Merchant、development-test KBASE、真实数据 Observation 与禁止项 |
| ADR / Spec 0012 | [`adr/0001-one-merchant-development-test-knowledge-base.md`](adr/0001-one-merchant-development-test-knowledge-base.md) / [`specs/0012-knowledge-independent-lifecycle-readiness.md`](specs/0012-knowledge-independent-lifecycle-readiness.md) | 已确认决策 / `approved`；替代旧 `test_merchant` 身份边界，定义显式 `knowledge_base_ref`、Readiness、Analytics 与 M8 |
| Plan / Task | [`plans/2026-09-02-knowledge-independent-lifecycle-readiness-plan.md`](plans/2026-09-02-knowledge-independent-lifecycle-readiness-plan.md) / [`tasks/2026-09-02-knowledge-independent-lifecycle-readiness.md`](tasks/2026-09-02-knowledge-independent-lifecycle-readiness.md) | `approved`；T01—T08 实施与验收链 |
| Readiness Report | [`records/2026-09-02-myyshop-real-cycle-readiness-report.md`](records/2026-09-02-myyshop-real-cycle-readiness-report.md) | `verified`；test KBASE engineering ready；真实 KBASE absent/not ready；不创建 Cycle、不推断 Content Gap |
| M7 独立 QA | [`records/2026-09-02-m7-cycle1-cycle2-independent-qa-record.md`](records/2026-09-02-m7-cycle1-cycle2-independent-qa-record.md) | `verified`；仅 synthetic_test/test_only 双 Cycle，M6 113/113、M7 57/57、P0/P1 为 0/0 |
| M8 Record | [`records/2026-09-02-m8-cross-host-conformance-record.md`](records/2026-09-02-m8-cross-host-conformance-record.md) | `verified`；required 5/5，native/manual optional 均 not_executed |
| 真实启动 Runbook | [`runbooks/myyshop-real-cycle-start.md`](runbooks/myyshop-real-cycle-start.md) | `implemented`；Goal-scoped real KBASE 闭包、显式切换、Analytics 与停止条件 |
| Analytics Observation Record | [`records/2026-09-02-ga4-gsc-observation-materialization-record.md`](records/2026-09-02-ga4-gsc-observation-materialization-record.md) | `verified`；真实 GA4/GSC 各 7 行，2 ANO、non-causal BSIG、candidate EVD，无自动批准 |
| 最终工程 Record | [`records/2026-09-02-knowledge-independent-lifecycle-readiness-record.md`](records/2026-09-02-knowledge-independent-lifecycle-readiness-record.md) | `verified`；knowledge-independent 工程、真实 Analytics Observation 与全部声明范围已收口 |

## 真实 GEO Cycle 阻塞收口（当前下一计划）

| 类别 | 工件 | 状态与用途 |
| --- | --- | --- |
| 领域词汇 | [`../CONTEXT.md`](../CONTEXT.md) / [`../CONTEXT-MAP.md`](../CONTEXT-MAP.md) | 已记录 GEO Cycle、Cycle Blocker、Citation 非阻塞、Agent 主导/Owner 门禁与 M8/v1 边界 |
| PRD | [`prd/2026-09-04-authorized-real-geo-cycle.md`](prd/2026-09-04-authorized-real-geo-cycle.md) | `proposed`；定义真实双 Cycle 产品旅程、业务门与 D1–D4 待批准选择，不授权 Spec 或实现 |
| Plan / Task | [`plans/2026-09-04-real-cycle-blocker-closure-plan.md`](plans/2026-09-04-real-cycle-blocker-closure-plan.md) / [`tasks/2026-09-04-real-cycle-blocker-closure.md`](tasks/2026-09-04-real-cycle-blocker-closure.md) | `proposed / proposed`；从 authorized-real PRD/Spec 0014、工程基线、英文 real KBASE 到两个真实 Cycle 与 M8/v1；未授权实现或外部动作 |
| Planning Record | [`records/2026-09-04-real-cycle-blocker-closure-planning-record.md`](records/2026-09-04-real-cycle-blocker-closure-planning-record.md) | `verified`；只验证访谈决定、阻塞审计、文档检查和独立评审，不批准 Plan/Spec 或实现 |

## 历史 M6—M8 测试商户系统工程基线

以下工件保留原批准与验证历史；其中 `test_merchant/TMT/.invalid Workspace identity` 已被 Spec 0012 的“唯一 Merchant + development-test KBASE”替代，不能再作为当前实现入口。

| 类别 | 工件 | 状态与用途 |
| --- | --- | --- |
| Requirement | [`requirements/2026-08-27-m6-m8-test-merchant-engineering-closure.md`](requirements/2026-08-27-m6-m8-test-merchant-engineering-closure.md) | `approved`；原始诉求、测试/真实隔离与三道完成门 |
| PRD | [`prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md`](prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md) | `approved`；测试商户双周期产品体验与业务验收 |
| Architecture | [`architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md`](architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md) | `approved`；M6—M8 模块、隔离、数据流与兼容决策 |
| Spec 0007 | [`specs/0007-cycle-analytics-test-merchant.md`](specs/0007-cycle-analytics-test-merchant.md) | `approved`；Test Merchant、Cycle/Analytics/Business Signal/Review 合同 |
| Spec 0008 | [`specs/0008-strategy-discovery-cycle-two.md`](specs/0008-strategy-discovery-cycle-two.md) | `approved`；人工 invocation、strategy eligibility、GCD/GSEL 与 Cycle 2 |
| Spec 0009 | [`specs/0009-cross-host-conformance-engineering-release.md`](specs/0009-cross-host-conformance-engineering-release.md) | `approved`；宿主边界、fail-loud conformance、session recovery 与 ERC |
| Plan / Task | [`plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md`](plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md) / [`tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md`](tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md) | `approved / approved`；已批准实施顺序、任务依赖与独立 QA 门 |
| SDD 准备 Record | [`records/2026-08-27-m6-m8-test-merchant-sdd-record.md`](records/2026-08-27-m6-m8-test-merchant-sdd-record.md) | `verified`；历史 SDD 准备与文档检查，不替代后续 Owner 批准 |
| SDD 批准 Record | [`records/2026-08-27-m6-m8-sdd-approval-record.md`](records/2026-08-27-m6-m8-sdd-approval-record.md) | `verified`；记录 Owner 明确批准、Spec 0003/0004 继承基线与未授权边界 |
| M5→M6 兼容性 Review Record | [`records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md`](records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md) | `verified`；两槽正式协议、历史 `sampling_count:3` parse 与 lease revision 的窄技术兼容决策；不是业务批准 |
| M7 DDM 状态机 Review Record | [`records/2026-08-27-m7-decision-dimension-state-machine-review.md`](records/2026-08-27-m7-decision-dimension-state-machine-review.md) | `verified`；Owner 委派的 test-merchant engineering 独立技术决策，不是 MyyShop 业务批准 |
| M7 Review 候选生成合同 Review Record | [`records/2026-08-28-m7-review-candidate-generation-contract-review.md`](records/2026-08-28-m7-review-candidate-generation-contract-review.md) | `verified`；明确 rationale/limitations 只由 Run outputs 中版本化规则派生，不扩大 CRV 或真实授权 |
| M8 Conformance 合同闭包 Review Record | [`records/2026-08-27-m8-conformance-contract-closure-review.md`](records/2026-08-27-m8-conformance-contract-closure-review.md) | `verified`；Owner 委派的 CFP/Repository/Tool closure 技术决策，不是真实宿主或发布批准 |
| Approval Handoff | [`handoff/2026-08-27-m6-m8-test-merchant-sdd-approval-handoff.md`](handoff/2026-08-27-m6-m8-test-merchant-sdd-approval-handoff.md) | `verified`；T01 已完成，后续从 T02 按批准 Plan 推进 |
| M6 Cycle 1 Record | [`records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md`](records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md) | `verified`；仅 synthetic/test_only Cycle 1 工程、113 tests 与独立 final QA |
| Owner M7 / Circle 1 范围调整 Record | [`records/2026-08-28-owner-m7-circle1-scope-amendment.md`](records/2026-08-28-owner-m7-circle1-scope-amendment.md) | `verified`；当前终点收缩为 Circle 1 人工接管，Strategy/Circle 2/M8 deferred |
| M7 / Circle 1 独立 Final QA Record | [`records/2026-08-28-m7-circle1-final-qa-record.md`](records/2026-08-28-m7-circle1-final-qa-record.md) | `verified`；113/113、19/19、稳定 Workspace 与双 manifest 首尾一致，P0/P1/P2 为 0/0/0 |
| M6 → M7 Handoff | [`handoff/2026-08-28-m6-to-m7-test-merchant-handoff.md`](handoff/2026-08-28-m6-to-m7-test-merchant-handoff.md) | `proposed`；M7 红测、ownership、Cycle 2 输入与停止条件 |
| M6 人工内测 Runbook | [`runbooks/m6-test-merchant-internal-review.md`](runbooks/m6-test-merchant-internal-review.md) | `proposed`；生成独立 Review Workspace、人工对象链与产品方向检查 |
| M6 人工内测暂停 Handoff | [`handoff/2026-08-28-m6-owner-internal-review-pause-handoff.md`](handoff/2026-08-28-m6-owner-internal-review-pause-handoff.md) | `verified`；Owner 最新范围调整后暂停门重新生效，保留为历史与人工内测入口 |
| M7 / Circle 1 Owner 接管 Handoff | [`handoff/2026-08-28-m7-circle1-owner-internal-review-handoff.md`](handoff/2026-08-28-m7-circle1-owner-internal-review-handoff.md) | `verified`；Circle 1 工程与人工接管就绪，后续能力 deferred |

## GA4/GSC 真实只读分析接入

| 类别 | 工件 | 状态与用途 |
| --- | --- | --- |
| Requirement / PRD | [`requirements/2026-09-01-ga4-gsc-readonly-analytics.md`](requirements/2026-09-01-ga4-gsc-readonly-analytics.md) / [`prd/2026-09-01-ga4-gsc-readonly-analytics.md`](prd/2026-09-01-ga4-gsc-readonly-analytics.md) | `approved`；精确 Property、低维度聚合 smoke 与非目标 |
| Architecture / Spec 0010 | [`architecture/2026-09-01-ga4-gsc-readonly-analytics-architecture.md`](architecture/2026-09-01-ga4-gsc-readonly-analytics-architecture.md) / [`specs/0010-ga4-gsc-readonly-analytics.md`](specs/0010-ga4-gsc-readonly-analytics.md) | `approved`；独立真实读取入口、ADC、请求/响应与临时数据合同 |
| Plan / Task | [`plans/2026-09-01-ga4-gsc-readonly-analytics-plan.md`](plans/2026-09-01-ga4-gsc-readonly-analytics-plan.md) / [`tasks/2026-09-01-ga4-gsc-readonly-analytics.md`](tasks/2026-09-01-ga4-gsc-readonly-analytics.md) | `approved`；TDD、认证向导、回归、真实 smoke 与 Record |
| Runbook | [`runbooks/ga4-gsc-readonly-analytics.md`](runbooks/ga4-gsc-readonly-analytics.md) | `implemented`；setup、doctor、dry-run、smoke、故障与撤销 |
| Record | [`records/2026-09-01-ga4-gsc-readonly-analytics-record.md`](records/2026-09-01-ga4-gsc-readonly-analytics-record.md) | `verified`；认证、固定请求、7+7 行真实只读 smoke 与边界 |
| Observation Materialization Record | [`records/2026-09-02-ga4-gsc-observation-materialization-record.md`](records/2026-09-02-ga4-gsc-observation-materialization-record.md) | `verified`；真实只读结果进入 ANO/非因果 BSIG/candidate EVD，未修改 Claim |

## Query Portfolio 流水线（本地工程验收完成）

| 类别 | 工件 | 状态与用途 |
| --- | --- | --- |
| Requirement / PRD | [`requirements/2026-09-01-query-portfolio.md`](requirements/2026-09-01-query-portfolio.md) / [`prd/2026-09-01-query-portfolio.md`](prd/2026-09-01-query-portfolio.md) | `approved`；候选生成、去重、聚类、优先级、人工批准与 Query Set 冻结的问题、目标与非目标 |
| Architecture / Spec 0011 | [`architecture/2026-09-01-query-portfolio-architecture.md`](architecture/2026-09-01-query-portfolio-architecture.md) / [`specs/0011-query-portfolio.md`](specs/0011-query-portfolio.md) | `approved`；确定性规则版本、intake/report/assemble/prefreeze/validate 工具合同与双路径写入 |
| Plan / Task | [`plans/2026-09-01-query-portfolio-plan.md`](plans/2026-09-01-query-portfolio-plan.md) / [`tasks/2026-09-01-query-portfolio.md`](tasks/2026-09-01-query-portfolio.md) | `approved` / `verified`；T01—T05 与验收命令 |
| Record | [`records/2026-09-01-query-portfolio-record.md`](records/2026-09-01-query-portfolio-record.md) | `verified`；321/321 测试、知识库缺席 fixture 全旅程、真实 myyshop 工作区只读兼容；未 commit/push |

## 历史提案与交接

| 工件 | 位置 | 状态与用途 |
| --- | --- | --- |
| 本地 GEO 专家插件重新定基线方案 | [`plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`](plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md) | `proposed`；历史双仓分工、宿主插件规范和原 M0—M8 规划；与 2026-08-23 最终产品方案冲突部分以后者为准 |
| 插件初始化 Handoff | [`handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md`](handoff/2026-08-20-geo-cowork-plugin-initialization-handoff.md) | 历史执行基线；里程碑 0—1 |
| CodeBuddy 移除与 WorkBuddy 切换 Handoff | [`handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md`](handoff/2026-08-20-milestone-1-hardening-workbuddy-china-handoff.md) | 历史 WorkBuddy 契约跟踪与 M1 收口基线 |
| 原“Query 与知识” M2 Handoff | [`handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`](handoff/2026-08-20-query-and-knowledge-milestone-handoff.md) | 已被 2026-08-23 产品基线重排；保留历史，不再作为当前 M2 启动指令 |

Owner 已批准 M5 两槽英文主线、中文可选辅助和同对象语义合同；100 Source 只作为批量分类触发器，不阻塞真实 Cycle，是否仍为独立 M5/v1 交付门由 authorized-real PRD 明确。历史 exploratory Sample 全部保留；ChatGPT、Gemini、Google AI、Perplexity、Claude 已各完成两个正式英文 manual slot、两个 candidate Review 和一个 computed Aggregation。当前 40/100 个唯一 Source 统一归档未分类；上述 Record 不能替代 Review 人工确认、外部发布或业务效果证据。

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
| [`runbooks/`](runbooks/geo-cowork-account-data-readiness.md) | 账号、数据、运行、恢复和发布前操作清单 |
| [`wiki/`](wiki/index.md) | 项目知识库导航摘要 |
| [`handoff/`](handoff/2026-08-27-m6-m8-test-merchant-sdd-approval-handoff.md) | 跨 Session 或跨 Agent 的继承基线、第一动作和停止条件 |

其余文档类别（原型、Runbook、Release、复盘和经验）的目录契约与建档规则见 `docs/workflow.md` 第 2 章；各类目录在首次出现 canonical 文档时创建并加入本导航。

## 2026-09-16 历史工程验收入口

[知识驱动 GEO 全流程计划](plans/2026-09-16-knowledge-driven-geo-e2e-plan.md) 是当前 Owner 已要求实施的任务；旧真实周期 roadmap 已归档。自定义模型只保留切换配置，本次真实提取使用 DeepSeek。

最终工程验收已完成：两个演练周期共 240 个真实模型提取槽，三个真实平台各一次采集，GSC 718 行。见 [实施记录](records/2026-09-16-knowledge-driven-geo-e2e-record.md) 与 [能力边界](records/2026-09-16-geo-capability-matrix.md)。
