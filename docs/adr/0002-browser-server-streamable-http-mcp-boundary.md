---
status: accepted
---

# 由 Browser Server 向 Cowork 暴露 Streamable HTTP MCP

Browser Extension Client 只连接同机 Browser Server Agent；Browser Server 作为 Streamable HTTP MCP Server 暴露浏览器任务与结果能力，Codex Host 管理 MCP Client，安装在 Codex 中的 `geo-expert` / Cowork Skill 调用这些 Tool。选择该方向而不是扩展直连 Cowork 或由 Cowork 充当 MCP Server，是因为 Browser Server 拥有浏览器侧 Agent 与任务结果，而 Codex 插件天然是外部 MCP Tool 的消费方。

Browser Server Agent 保存完整 Query Capture，只负责形成带模型、Prompt 与 Schema 版本的 Extraction Result，并将二者放入 durable pending queue；Cowork 主动拉取、确认接收，再执行项目语义分析与 canonical M5 物化。MCP Server 不负责自动唤醒 Cowork Agent，`Query Capture`、幂等、恢复和 acknowledgement 语义由应用合同定义。该决定覆盖早期“本阶段不创建 MCP Server”的约束，实施前必须同步更新插件 Spec 与校验规则。
