# GEO 能力与验收边界

- 状态：verified
- 更新：2026-09-16
- 工作目录：`/Users/sujingjun/geo-cowork`
- 基线：`main@dd7cc2187c962c84b45f46dd744e0fa9822a06b4`，本次变更尚未提交。
- 来源：[实施 Record](2026-09-16-knowledge-driven-geo-e2e-record.md)、[Task](../tasks/2026-09-16-knowledge-driven-geo-e2e.md)
- 范围：本次实际检查，不代替真实业务批准或发布。

| 能力 | 实现/验证范围 | 实际证据与限制 |
| --- | --- | --- |
| DeepSeek | 真实字段提取与语义处理 | 根 `.env`，真实 HTTP 响应、usage、原文/引用校验；无 Fake 提取模式 |
| OpenAI-compatible | 配置、完整模型名、切换及缓存隔离 | Owner 已说明需公司网络并免除真实验证；不声称连通 |
| 人工 Query | TXT/CSV/JSON、来源合并、幂等 | 保留原输入、Source、候选与批次；正式冻结对象不原地改写 |
| GSC Query | 当前只读实测 | 718 行、714 个候选、语言 unknown；API 返回范围不保证穷尽 |
| 知识生成 Query | 真实模型、知识版本和线索溯源 | 九类演练知识生成六个英文候选，Owner 决定后冻结 |
| ChatGPT MCP | 一次真实采集与 DeepSeek 提取 | 2239 字符，10 个链接位置；临时聊天记忆/自定义指令条件未另行控制 |
| Gemini MCP | 一次真实采集与 DeepSeek 提取 | 1268 字符，未发现引用链接；保持 0，不补造 |
| Perplexity MCP | 一次真实采集与 DeepSeek 提取 | 1790 字符；同一 DOM 补出 4 个引用位置、3 个 URL；折叠来源组未展开 |
| Browser Server | 真实模型专项、类型、构建 | pending/ack、原始数据、provider 缓存隔离及失败恢复；不将旧 fixture 验收冒充真实平台 |
| 双周期 | 隔离业务演练 | 业务输入、独立模拟反馈、实际本地发布读回、双复测、Analytics 和 Review；最终工作区两轮均 review_decided/full，240 槽、trace_ready=true；零待处理审核 |
| 并发与不可变性 | 自动测试及实际恢复 | writer/lease/CAS、旧审核包与原文保护、Source queue 非干扰、附件 hash 和同名附件隔离 |
| 当前宿主 | Codex 中实际调用公开 CLI | 本次执行记录；不是新插件发布或全宿主认证 |
| WorkBuddy | 文档事实已更新 | 官方合同已存在；本次不声称已做原生适配/导入/调用验证 |
| 真实业务效果 | 未执行 | 没有真实 CMS 发布、正式真实双周期或因果提升结论 |

## 最终交付

- [双周期报告](../../workspaces/myyshop-geo-e2e-verified/reports/geo-cycle-overview.md)
- [矩阵与血缘验收](../../workspaces/myyshop-geo-e2e-verified/reports/engineering-acceptance.json)
- [Owner 操作手册](../runbooks/knowledge-driven-geo-operations.md)

根测试 365/365、Browser 26/26、真实语义对照 5/5；typecheck、build（正常 exit 0）、格式、文档、插件、工作区及索引校验通过。lint 为 0 errors / 57 个既有 warnings。
