# OneGlanse MCP：单 Query 工程链路

仅在使用 OneGlanse 采集时读取。MCP Server、账号身份和资源权限由 OneGlanse 维护；本插件只调用它发布的 stdio 启动合同和 Tools。默认插件 `.mcp.json` 不自动启动 OneGlanse，未配置时旧入口继续可用。

## 准备输入

- 品牌工作区 `workspace.json` 的稳定 ID，以及独立的 OneGlanse workspace ID。
- 已存在的 Query 文件、ref、version 与选用的 `query_text` 或 `normalized_text`。原文、发送文本和服务接受文本分别保存，不能静默改写。
- 用户对一个 Query、一个 provider 和原生自动分析副作用的授权。授权本次工程运行不等于恢复正式 Cycle。
- 用户本地的 stdio 连接配置；只保存可执行命令、参数和可选 cwd。服务凭据由 OneGlanse 的私有环境/授权文件加载，不写 Skill、业务产物或插件缓存。

连接配置形状：

```json
{
  "type": "stdio",
  "command": "node",
  "args": ["--env-file=<oneglanse-private-env>", "<oneglanse-published-entrypoint>"],
  "cwd": "<oneglanse-installation>"
}
```

运行计划使用 `schema_version:oneglanse-run-plan-v1`，包含 `run_id`、两侧 workspace ID、`provider`、`query:{path,ref,version,field}`、`authorization:{scope:"single-query-engineering",reference,automatic_analysis:true}`。实例 ID 和部署路径保存在目标工作区计划或用户本地连接配置，不写入通用 Skill。

## 调用与完成判据

1. `oneglanse_capabilities` → `oneglanse_workspace_read` → `oneglanse_prompts_read`。核对 `contract_version:1.0.0`、scope、全部有效 prompts 和 ready providers。支持平台、登录态就绪和本次允许运行是三件事。ready 仅指原生存储会话检查；Agent 须先由 OneGlanse 运行，不能在提交后才启动会清理旧队列的 Agent。
2. 合并完整 prompt 集合再调用 `oneglanse_prompts_save`，携带当前 `expected_revision`。原生保存会 trim、去重和替换；MCP 首版拒绝删除，旧 ID/文本必须保留。版本冲突重新读取；不通过清空 prompts 或修改 schedule 达成单 Query。
3. 有效范围必须恰好为选中的一个 Query/provider。若不匹配，明确说明应在 OneGlanse 调整的配置，不把局部参数解释为仅运行该 Query。
4. 调用前先落盘启动意图，再携带当前 `expected_scope_revision` 调用 `oneglanse_run_start`，保存 job ID 和签名 receipt。`start-intent` 存在但没有持久结果时保持 `SUBMISSION_UNKNOWN`，不得自动重发；OneGlanse 内部重试仍按原行为执行。
5. 使用 receipt 调用 `oneglanse_run_status`。`unavailable` 表示原生状态缺失或已过期，不能当作运行未开始。`completed` 仍需检查各 provider 的状态和结果数量；它也不证明默认模型分析成功；原生自动分析可能覆盖该工作区的历史回答。
6. 原生状态仍在运行时不冻结结果时间窗；状态已过期时保留 unavailable 与候选关联。`oneglanse_responses_list` 按 prompt/provider/UTC 窗口分页，再通过 `oneglanse_response_read` 分块读取 UTF-8 JSON。校验 ID、offset、总字节数、SHA-256 和终止标记，完整保留答案与每个 Source 的所有字段。
7. 原始响应、接收凭据和 Query 映射保存在 `runs/<run>/oneglanse-intake/`。按原生 response ID 幂等接收；相同 ID 内容变化时报冲突。只按 workspace/prompt/provider/time 建立候选关联，不声称精确 job/slot 绑定。
8. 从本地接收文件运行候选分析，失败从本地恢复，不重新采集。原始 DOM、引用 occurrence、新会话、实际模型版本、Profile/slot 和实际提交时间缺口保持未知。

可使用薄辅助入口执行上述步骤：

```bash
node <plugin-root>/scripts/oneglanse.mjs prepare --workspace <workspace> --plan <plan.json> --connection <private-connection.json>
node <plugin-root>/scripts/oneglanse.mjs start --workspace <workspace> --plan <plan.json> --connection <private-connection.json>
node <plugin-root>/scripts/oneglanse.mjs status --workspace <workspace> --plan <plan.json> --connection <private-connection.json>
node <plugin-root>/scripts/oneglanse.mjs receive --workspace <workspace> --plan <plan.json> --connection <private-connection.json>
node <plugin-root>/scripts/oneglanse.mjs analyze --workspace <workspace> --plan <plan.json>
```

`analyze` 校验接收 hash，复用 GEO URL 规范化，输出品牌提及、来源列表/不同 URL/域名与缺失证据。`geo-answer` 继续阅读原文形成候选判断；这不会创建正式 Sample、Citation occurrence、Claim Support、人工 Review 批准或恢复正式 Cycle。
