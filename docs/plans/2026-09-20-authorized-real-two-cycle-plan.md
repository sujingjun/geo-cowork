# MyyShop 正式真实双周期实施计划

- 状态：approved
- 创建/更新：2026-09-20
- 来源：Owner 明确批准执行本计划，并要求可并行工作委派 GPT-6 Astra xhigh、主 Agent 最后验收。
- 关联：[Spec 0015](../specs/0015-authorized-real-two-cycle.md)、[Task](../tasks/2026-09-20-authorized-real-two-cycle.md)
- 适用范围：两个真实周期功能补齐、首轮准备与长期续跑。

## 实施顺序

1. 补真实 CLI、启动检查、知识审批、阶段锁/快照/恢复；保留旧演练和 smoke 合同。
2. 并行完善正式采样、真实诊断/发布与 Analytics；统一接口后由主 Agent 验收。
3. 准备真实首轮知识包，沿用既有批准，新增内容待 Owner 确认。当前首批资产为首页和 About。
4. Owner 知识决定后冻结真实输入，获取新五平台双槽 Baseline，输出可追溯诊断和建议。
5. 人工发布后读回确认、技术复测；W1–W4 分周复测、Analytics、Owner Review；真实结果选下一 Goal。
6. 每日10:00当前任务自动续跑；两个真实周期完成后停止。未确认事实、未发布内容和未到期窗口保持具体待办。

## 验收

主 Agent 执行全仓测试、格式、文档、插件、真实 Workspace 与 index 校验；新增专项覆盖真实入口零写、完整/缺槽矩阵、审核/引用/版本漂移、发布读回、Analytics 日界与缺数据、Cycle 2 选择及恢复。真实 DeepSeek 和 HTTPS 输入验证独立记录，不代替正式业务采样或发布。commit、push、部署、飞书同步不在当前授权内。
