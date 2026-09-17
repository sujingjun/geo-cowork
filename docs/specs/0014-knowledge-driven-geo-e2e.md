# Spec 0014 — 知识驱动 GEO 全流程

- 状态：approved
- 创建/更新：2026-09-16
- 来源：Owner 本次明确要求实施的修订计划；[Plan](../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md)
- 范围：本地产品基础设施和具名真实输入验证；补充 M3–M7 与 Spec 0013。

## 合同

1. 模型选择为调用参数 > 环境选择 > deepseek；模型 ID 是不透明字符串。两 provider 使用各自 key/base URL/model，配置缺失或调用失败返回具名错误，禁止 Fake 和隐式 provider fallback。raw、provider/model、prompt/hash、实际调用时间和 usage 可追溯；凭据不落业务工件。
2. Browser Extractor 只输出正文、结构、拒答/完整性、引用及中性告警。正文和引用必须回指原始输入。Ref、版本、hash 和 provenance 由工具生成，模型不得产生业务批准。真实调用取代 Spec 0013 中的 Fake 测试条款。
3. Query 来源分别为人工导入、GSC 和知识生成，保留原输入 checksum、批次、窗口和知识版本；同一 Query 合并来源，不伪造需求指标。GSC 查询支持 pagination、final 数据和 PT 日期；空值、权限错误、部分结果分开表示。
4. 工程采集以 Run/Query 为绑定，不依赖真实 Cycle；正式采样另校验冻结矩阵。MCP 提交先持久化意图，提交未知不重发。三个指定平台各一次，相邻提交至少 120 秒；同一 raw 可以重试模型提取。
5. Owner 入口 start/continue/inbox/apply-feedback/report 调用已有 canonical 能力。审核材料 pin ID/version/hash，反馈单独持久化；模型不自动代表 Owner 决定。successor 不覆盖旧批准。
6. Lifecycle 先无写入 preflight，再 lease/CAS/输入复核，随后写 snapshot/intent 并恢复。完整 Query/platform/slot/profile/purpose/window 与 scope/Goal 归属是 gate 条件。Source 维护不得污染活跃冻结输入。
7. 双周期禁止预置分析、Gap、Publication 或 Review gate；实际生成建议、接收独立测试反馈、发布到隔离模拟站点并读回，再执行两个目的不同的复测。第二周期来自上一 Review 和独立选择。

技术验收、真实采集验收、正式业务周期与业务效果独立记录。旧过程文档保留追溯但不能重新阻断当前已明确的工程范围。

## Owner 运行中调整（2026-09-16）

自定义网关 llm.dhcoder.net 需要公司网络，本次只保留 OpenAI-compatible 配置与切换能力，不要求真实验证；三平台和演练实际提取均使用 DeepSeek。此前连接失败保留为环境证据，不以 Fake 代替。
