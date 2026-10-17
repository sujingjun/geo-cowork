# OneGlanse 单 Query 对接任务

- 状态：verified（仅下述单 Query 工程成功标准；原生默认模型分析仍缺凭据）
- 创建/更新：2026-10-17
- 来源：用户要求“按这个简洁版计划开始开发……先跑通 MyyShop 一个 Query 的完整链路，完成验证并同步文档”。
- 关联：[开发计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)、[验证记录](../records/2026-10-17-oneglanse-mcp-integration-record.md)。
- 适用范围：OneGlanse 授权/Tools、cowork Skill/MCP 接收、MyyShop 单 Query/Gemini 工程联调。正式 Cycle 与生产发布不在范围内。

| 阶段 | 责任与审阅问题 | 交付与验证 |
| --- | --- | --- |
| A | OneGlanse：调用身份/资源归属是否可靠，Tools 是否只封装原生行为？ | stdio Server、能力和 schema、撤销/作用域/版本检查、原生保存与运行保护、结果分页和字节分块、协议及服务测试。 |
| B | cowork：是否只调用公开 MCP，并完整保存来源和证据边界？ | 三个既有 Skill、薄 stdio/落盘辅助代码、真实 MyyShop 映射、Query provenance、未知启动不重发、接收 hash、候选分析、恢复/异常测试。 |
| C | 联调：一个现有平台的链路是否有真实证据？ | 一个 Query 的授权保存、原生 job、状态、答案与来源接收、存储 hash 独立比对、幂等重读、本地分析、文档同步。 |

成功标准：A/B 确定性检查通过；C 获得真实 response ID，完整保留原生答案与 Source 字段并校验 SHA-256；GEO 分析不补造正式采样条件。原生默认模型分析是否成功另记，不能用 collection completed 替代。

当前已完成上述单 Query 采集/传输/本地候选分析；OneGlanse 原生后台模型分析因运行环境没有分析模型凭据而失败。详见 Record 的验收和限制。未更改 Agent 采集算法、Cookie、provider 重试、调度配置或正式业务暂停状态；未执行 commit/push/PR、远端部署或飞书同步。
