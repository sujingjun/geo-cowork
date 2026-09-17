# 知识驱动 GEO 全流程任务

- 状态：verified
- 创建/更新：2026-09-16
- 来源：[Plan](../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md)、[Spec 0014](../specs/0014-knowledge-driven-geo-e2e.md)
- 范围：P0–P6，本地实现及本次指定真实服务验证；不含 commit/push/部署。

每项使用 Plan 的目标、退出门与前置依赖，Record 记录实际命令和结果。

| ID | 状态 | 目标与依赖 | 目标模块 | 验证 |
| --- | --- | --- | --- | --- |
| P0 | verified | 当前目标及历史导航 | docs/workflow, specs, plans, tasks, wiki | check:docs |
| P1 | verified | 真实 provider 与提取 | geo-expert model client、Browser extractor | 真实 DeepSeek、兼容配置切换、Schema、typecheck |
| P2 | verified | 知识与来源；依赖 P1 | query-portfolio、GSC、知识生成 | 导入、去重、真实 GSC、生成 |
| P3 | verified | MCP；依赖 P1 | collector、MCP client、checkpoint | 三次低频真实采集 |
| P4 | verified | 首周期；依赖 P1/P2 | lifecycle、review、diagnosis | 公开入口、反馈及续跑 |
| P5 | verified | 矩阵与第二轮；依赖 P4 | product journey | 两周期/240槽、独立反馈 |
| P6 | verified | 收口；依赖以上 | tests、build、docs、reports | 全仓检查及能力矩阵 |

风险：真实服务可用性、登录接管、模型结构输出与历史合同接缝。失败只阻断依赖动作，保留真实证据。P0–P6 已按本次调整后的工程范围通过验证；公司网络兼容接口、正式真实周期与业务效果不在本次完成声明内。

## Owner 运行中调整（2026-09-16）

自定义网关 llm.dhcoder.net 需要公司网络，本次只保留 OpenAI-compatible 配置与切换能力，不要求真实验证；三平台和演练实际提取均使用 DeepSeek。此前连接失败保留为环境证据，不以 Fake 代替。
