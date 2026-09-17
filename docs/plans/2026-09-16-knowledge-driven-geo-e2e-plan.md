# 知识驱动 GEO 全流程实施计划

- 状态：approved
- 创建/更新：2026-09-16
- 来源：Owner 本次 `PLEASE IMPLEMENT THIS PLAN` 指令；[handoff](../handoff/2026-09-15-knowledge-driven-geo-e2e-infrastructure-handoff.md)
- 范围：真实模型、多来源 Query、三次真实 Playwright MCP 采集、知识驱动双周期；当前任务不含 Git 提交或外部发布。

## 当前决定

Owner 当前明确指令优先于历史流程。本任务默认 DeepSeek，支持根 `.env` 的 OpenAI-compatible 自定义模型；所有运行提取器的测试和旅程使用真实模型。纯状态和数据合同测试不需要调用提取器。旧 Fake 要求和审批串行等待不适用于本任务。真实登录、服务权限、知识事实和发布决定仍由真实主体提供。

Query 支持人工文本/TXT/CSV/JSON、真实 GSC 查询词和 Goal + 知识版本 + 需求线索生成，统一进入现有 Portfolio，保留多来源。默认 GSC 窗口为 PT 日期执行日前三天结束的连续 28 天，final/web/query。

MCP 固定 0.0.81；ChatGPT、Gemini、Perplexity 各一次独立会话，串行提交间隔至少 120 秒，问题 `What is MyyShop?`，按 Owner 后续调整，三次提取均用 DeepSeek；兼容 provider 保留切换能力。三次为工程验证，不要求正式真实 Cycle，不计为双槽 Baseline。

两周期从原始业务输入开始，禁止预置下游 gate 工件。每周期六问题、五平台、两槽、Baseline/Retest，共 120 逻辑槽；原始外部模拟输入保持 test_only，提取使用真实模型。采用与复盘反馈 exact-pin，Cycle 2 使用独立选择及新冻结输入。

## 实施与退出门

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| P0 | 当前合同、归档及基线 | 当前导航准确，无旧流程阻断 |
| P1 | 根 env、真实双 provider、提取 | DeepSeek 真实成功；兼容 provider 配置切换通过，无 Fake 路径 |
| P2 | 知识与三来源 Query | 生成与导入可追溯，真实 GSC 结果如实记录 |
| P3 | MCP 封装、恢复、低频验证 | 三平台各一次成功，完整 raw/提取/调用证据 |
| P4 | 首周期、人工反馈、发布读回与双复测 | 公开入口实际生成下游对象并可续跑 |
| P5 | 完整矩阵及 Cycle 2 | 两轮独立决定及可追溯冻结输入 |
| P6 | 回归、构建、导航、交付 | 具名检查和证据范围完整 |

相关：[Spec](../specs/0014-knowledge-driven-geo-e2e.md)、[Tasks](../tasks/2026-09-16-knowledge-driven-geo-e2e.md)、[Record](../records/2026-09-16-knowledge-driven-geo-e2e-record.md)。

## Owner 运行中调整（2026-09-16）

自定义网关 llm.dhcoder.net 需要公司网络，本次只保留 OpenAI-compatible 配置与切换能力，不要求真实验证；三平台和演练实际提取均使用 DeepSeek。此前连接失败保留为环境证据，不以 Fake 代替。

产品依据：[PRD](../prd/2026-09-16-knowledge-driven-geo-e2e.md)。
