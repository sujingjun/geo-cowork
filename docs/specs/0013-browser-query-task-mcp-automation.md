---
title: Spec 0013 — Browser Query Task MCP Automation
status: approved
created: 2026-09-03
updated: 2026-09-03
source:
  - docs/prd/2026-09-03-browser-query-task-mcp-automation.md
  - docs/architecture/2026-09-03-browser-query-task-mcp-automation-architecture.md
  - docs/adr/0002-browser-server-streamable-http-mcp-boundary.md
  - docs/specs/0001-plugin-package-contract.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0006-consumer-answer-testing.md
  - https://developers.openai.com/codex/mcp
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
  - "2026-09-03 Owner 明确批准 PRD、Spec 0013 和 Plan，并授权开始本地实现"
scope: Cycle Query Input、Browser Query Task、Query Capture、Extraction Result、pending delivery、Streamable HTTP MCP Tool 与插件注册合同
---

# Spec 0013 — Browser Query Task MCP Automation

## 1. 继承、覆盖与适用范围

本 Spec 继承：

- Spec 0003/0004 的 stable ID、精确 version ref、content hash、create-only 与 Query/Query Set 合同；
- Spec 0006 的 Collector Profile、`conversation_state:new`、sample outcome、Citation raw、隐私最小化、人工门与自动化许可边界；
- Spec 0012 的 Merchant、knowledge base 与 execution scope 边界。

本 Spec 一经 Owner 批准，明确覆盖 Spec 0001 §3.2 和历史 rebaseline plan §5.1 中“本阶段不创建 `.mcp.json` 或 MCP Server”的限制，仅允许 `plugins/geo-expert/.mcp.json` 注册本 Spec 的 Browser MCP Server。三份 Manifest 仍不得复制业务规则；`apps`、`hooks` 继续不在本范围。

适用模块：Browser Server 的 MCP/input/task/result/extraction 模块，Chrome Extension 的任务 UI/runner/checkpoint，geo-expert 的 MCP 注册与 Cowork result materializer，以及对应 fixtures/tests/docs。

## 2. ID 与 Schema 版本

| 对象 | ID | `schema_version` |
| --- | --- | --- |
| Cycle Query Input | `CQI-<stable>` | `geo-cycle-query-input-v1` |
| Browser Query Task | `BQT-<stable>` | `geo-browser-query-task-v2` |
| Query Attempt | `<query-hash>/attempt-<n>` | `geo-browser-query-attempt-v2` |
| Query Capture | `BQC-<stable>` | `geo-browser-query-capture-v2` |
| Extraction Result | `BQX-<stable>` | `geo-browser-extraction-result-v1` |
| Pending Query Result | `BQR-<stable>` | `geo-browser-pending-result-v1` |
| Task Summary | `BQTS-<stable>` | `geo-browser-task-summary-v1` |

所有 stable ID 的输入使用 UTF-8 byte-order 排序后的 canonical JSON，并以 SHA-256 派生；同 ID 不同 canonical bytes 必须 `OBJECT_CONFLICT`。

## 3. Cycle Query Input

`register_cycle_query_input` 的 input 必须满足：

```json
{
  "schema_version": "geo-cycle-query-input-v1",
  "request_id": "REQ-...",
  "cycle": { "ref": "CYC-...", "version": "...", "status": "active" },
  "query_set": { "ref": "QS-...", "version": "...", "content_sha256": "<64hex>" },
  "queries": [
    { "ref": "Q-...", "version": "...", "query_text": "...", "language": "en-US", "ordinal": 1 }
  ],
  "platform": {
    "id": "chatgpt",
    "entry_url": "https://...",
    "execution_mode": "manual_assist",
    "policy_status": "manual_only",
    "profile_ref": "...",
    "profile_version": "...",
    "authorization_ref": "workspace://...",
    "authorization_sha256": "<64hex>"
  },
  "registered_at": "RFC3339"
}
```

规则：

1. Cycle 必须为 `active`；Query Set 必须为 `frozen` 且已经由 Cycle input snapshot 精确绑定。该事实由 Cowork 在发送前验证，Browser Server 仍校验形状、hash 和内部一致性，不假装能读取 Workspace 复核。
2. Query ref 唯一、ordinal 从 1 连续、文本非空；顺序与 frozen Query Set 一致。
3. `entry_url` 必须为 adapter exact allowlist origin；URL 不含 credential。
4. `execution_mode=dom_automation` 仅允许 `policy_status=allowed`；`manual_only` 只能使用 `manual_assist`。
5. `authorization_ref` 只保存引用与 checksum，不传授权文件内容、账号 ID 或 secret。
6. 写入 create-only。同 request/input fingerprint 重放返回 `{action:"kept"}`；同 ID 不同 fingerprint 返回 `CYCLE_QUERY_INPUT_CONFLICT`。

## 4. Browser Query Task

### 4.1 创建

Task 只能由 Browser Extension Client 经 Browser Server 产品接口创建；MCP `register_cycle_query_input` 不创建 Task。创建时引用一个未关闭的 CQI，冻结其 fingerprint、选定 platform 和全部 Query；Cowork 不能通过 MCP 改写 Task 内逐条状态。

Server 是 task durable authority，Extension checkpoint 是页面执行恢复数据。Task 状态：

```text
pending → running → waiting_human → running → completed
                  ├──────────────→ blocked
                  ├──────────────→ failed
                  └──────────────→ cancelled
```

`waiting_human` 可由 `login_required | challenge | submission_unknown | result_confirmation` 触发。`failed(system_failure)` 可建立新 attempt 重试；平台 outcome `timeout | no_result | refused | cancelled | challenge` 原样保留，不用成功覆盖历史。

### 4.2 Query Attempt

每个 Query 依 ordinal 串行执行，单 Task 同时最多一个 active attempt。attempt 至少包含：query ref/version/text hash、platform/profile、conversation proof、selector/detector version、stage、outcome、started/submitted/captured timestamps、failure diagnostics 与 revision。

执行阶段：

```text
pending
→ opening_platform
→ checking_login
→ waiting_human | ready
→ submitted
→ waiting_response
→ captured
→ extraction_pending
→ result_pending
→ acknowledged
```

从 `submitted` 开始若发生无法判定的断连/脚本错误，必须进入 `submission_unknown`，禁止自动创建新 attempt 或再次点击 submit。

### 4.3 新对话

每条正式 Query 必须由 adapter 执行 `open_new_conversation` 并生成可审核 proof。若只能确认页面入口而不能确认 conversation state，写 `unknown`；不得写 `new`。同一平台 conversation/result URL 不能同时支持两个 formal slot。

## 5. 登录与 DOM Automation

- 登录判断只使用 adapter 的版本化最小 DOM detector；不得读取 cookie、local/session storage、账号邮箱或用户 ID。
- 未登录进入 `waiting_human(login_required)`；人工完成登录后必须显式点击继续，系统重新运行 detector。
- selector 由 Browser Server adapter registry 提供，Extension Client 只执行已签名/版本化 platform adapter，不接受页面或 Cowork 提供任意 selector。
- 输入须触发平台所需 input/change 事件；submit 前确认按钮存在且可用；一次 attempt 只点击一次。
- 完成条件为：出现新回答节点、visible text 非空、busy detector 消失且内容连续稳定达到 `stable_ms`；timeout 形成平台 outcome。
- Query Capture 保存 answer root 的原始 `outerHTML`、`innerText`、Citation occurrence、result URL 和 detector diagnostics。不得保存全页 DOM、sidebar/history/account UI。
- 当前五个真实平台 adapter 状态继续为 `manual_only`；本 Spec 的 DOM Automation 正向 E2E 只使用 loopback fixture。状态提升另行批准。

## 6. Query Capture 与 Raw Artifact

Capture 必填：

```text
capture_id / task_id / attempt_id
cycle ref+version
query_set ref+version+content_sha256
query ref+version+query_text_sha256
platform/profile/collection_mode/conversation_state
outcome/result_url/captured_at
answer_text
answer_html_artifact {artifact_id, media_type, byte_length, sha256}
citations[] {ordinal, href_raw, href_normalized, title, anchor_or_context}
selector_version / terminal_detector_version
capture_payload_sha256
```

原始 HTML artifact create-only 保存，MCP metadata 不内联其正文。任何脚本、event handler 或 HTML 都按不可信文本处理；UI 禁止直接 `innerHTML` 渲染。重复保存相同 bytes 返回 `kept`，不同 bytes 返回 `RAW_ARTIFACT_CONFLICT`。

## 7. Extraction Result

Browser Server Agent 输入固定为 Query metadata、answer text、Citation raw、raw HTML 的安全解析文本和 capture checksum。输出 Schema 至少包含：

```text
extraction_id / capture_id / raw_sha256
answer {text, html_structure_summary, refusal, completeness}
citations[] {occurrence_ordinal, url, title, context}
platform_annotations[]
warnings[]
provenance {
  provider, model, prompt_version, prompt_sha256,
  schema_version, started_at, completed_at
}
output_sha256
```

模型输出必须经 Schema 验证；禁止模型生成或更改 ref/version/checksum/provenance。失败保存 `extraction_failed` diagnostics，可从同一 raw artifact 新建 extraction attempt；不得重跑 Query。当前知识驱动专题按 Spec 0014 与 Owner 明确指令使用真实模型；提取器测试不再使用 Fake。其他任务仍按其实际授权范围调用模型。

Extraction Result 不得包含 Claim support、Answer Review、Source Type、Aggregation、Evidence、Finding、建议或业务效果。

## 8. Pending Result 与 Acknowledgement

Capture 和至少一个 Schema-valid Extraction Result 闭合后创建 Pending Query Result。状态仅为：

```text
pending → acknowledged
```

`list_pending_query_results` 与 `get_query_result` 可被重复调用且不改变状态。Cowork 本地可靠保存 raw/extraction 后调用 `acknowledge_query_result`：

```json
{
  "result_id": "BQR-...",
  "capture_sha256": "<64hex>",
  "extraction_sha256": "<64hex>",
  "receiver_fingerprint": "<64hex>",
  "received_at": "RFC3339"
}
```

同 fingerprint 重放返回 `kept`；checksum 或 fingerprint 不同返回 `RESULT_ACK_CONFLICT`。Ack 不表示 canonical M5 materialization、Review 或 Cycle 完成。

## 9. MCP Tool 合同

Browser MCP Server 使用同机 Streamable HTTP `/mcp`，目标协议 `2026-07-28`，并兼容 Codex 所需的 2025-era stateless调用。Tool 使用 JSON Schema 2020-12；所有返回包含 `schema_version`、`ok`、稳定 code/action 和结构化内容。

### 9.1 写 Tool

- `register_cycle_query_input(input)`：按 §3 校验和 create-only 写入。
- `acknowledge_query_result(input)`：按 §8 校验并幂等确认。

两者必须声明为有写影响；Codex Host approval policy 不得被 Server 绕过。

### 9.2 读 Tool

- `get_cycle_query_input({input_id})`：返回 metadata/fingerprint，不返回授权正文。
- `list_browser_query_tasks({cycle_ref, cursor?, limit?})`：返回 task summary metadata；`limit` 为 1..100。
- `get_browser_query_task_summary({task_id})`：返回 Query/attempt 终态、pending/ack 计数、waiting reason。
- `list_pending_query_results({cycle_ref?, task_id?, cursor?, limit?})`：只返回 ID、refs、outcome、checksums、size 与 timestamps。
- `get_query_result({result_id})`：返回 Capture metadata、Citation raw 与 Extraction Result，不内联 answer HTML。
- `get_query_result_artifact({result_id, artifact_id, offset, max_bytes})`：返回 base64 或 UTF-8 chunk、实际 offset、next offset、total bytes、完整 artifact sha256；`max_bytes` 上限 262144。

分页顺序固定为 `(created_at UTF-8, result_id UTF-8)`；cursor 不含 secret。不存在返回 `RESULT_NOT_FOUND`，越界返回 `ARTIFACT_RANGE_INVALID`。

### 9.3 Server instructions

前 512 字符内必须说明：先注册 CQI；Task 在扩展创建；结果用 list → get → artifact chunks → 本地保存 → ack；Ack 不是业务批准；禁止通过 Tool 提升平台自动化许可。

## 10. MCP 注册与安全

`plugins/geo-expert/.mcp.json` 允许：

```json
{
  "mcpServers": {
    "geo-browser": {
      "type": "http",
      "url": "http://127.0.0.1:<fixed-port>/mcp",
      "bearer_token_env_var": "GEO_BROWSER_MCP_TOKEN"
    }
  }
}
```

示例不得写真实 token。Server 必须绑定 `127.0.0.1`、校验 Host/Origin、恒定时间比较 bearer token、限制请求体/工具输出、redact error。无 token、错误 Host/Origin、非 MCP endpoint、未知 Tool 均 fail closed。

插件 validator 必须校验 `.mcp.json` 只含一个 `geo-browser` Server、type/url/token env var 名称正确，且拒绝明文 token、非 loopback URL、额外业务规则或未知顶层能力。

## 11. Cowork Materialization

Cowork 同步步骤：

```text
list pending
→ get metadata/extraction
→ 分块读取 raw 并校验完整 SHA-256
→ 校验 Cycle/Query Set/Query exact versions
→ create-only 保存 Browser intake bundle
→ acknowledgement
→ 调用既有 M5 materializer 形成 Answer Sample/Citation Observation
→ 后续 Review/Source/Aggregation 独立推进
```

若 canonical 输入冲突、版本漂移或 raw checksum 不闭合，不发送 Ack；返回稳定 diagnostics 并保留 Browser pending。若 Ack 已完成而后续 M5 物化失败，从 Cowork 本地 intake bundle 重试。

## 12. 测试合同

必须覆盖：

1. MCP modern/legacy Streamable HTTP 协议探测、Tool list/call、认证、Host/Origin 与关闭行为；
2. CQI valid/duplicate/conflict、Cycle/Query Set/Query hash 和 policy mode 矩阵；
3. Assistant Panel 建任务、未登录暂停/继续、新对话、单 submit、回答稳定、完整 answer outerHTML 与 Citation；
4. 各阶段 crash/restart、Service Worker 休眠、Server revision 冲突、submitted unknown、不重复提交；
5. raw create-only、Agent Fake 成功/Schema 失败/重试、provenance/checksum；
6. pending list/get/artifact chunk/ack 幂等和冲突；
7. Cowork 接收后 M5 fixture materialization，Browser Server 不写 Workspace；
8. plugin `.mcp.json` 安装/发现、Tool allowlist 与 validation；
9. 全量仓库回归、文档链接、真实 `workspaces/myyshop` 字节不变；
10. no-real-network/no-real-model 断言。

## 13. 错误码

```text
MCP_UNAUTHORIZED
MCP_HOST_NOT_ALLOWED
MCP_ORIGIN_NOT_ALLOWED
MCP_PROTOCOL_UNSUPPORTED
CYCLE_QUERY_INPUT_INVALID
CYCLE_QUERY_INPUT_CONFLICT
QUERY_SET_VERSION_DRIFT
QUERY_INPUT_DRIFT
PLATFORM_ADAPTER_NOT_FOUND
PLATFORM_ALLOWLIST_VIOLATION
PLATFORM_TERMS_BLOCKED
LOGIN_REQUIRED
PLATFORM_CHALLENGE
SUBMISSION_UNKNOWN
QUERY_TASK_TRANSITION_INVALID
RAW_ARTIFACT_CONFLICT
EXTRACTION_SCHEMA_INVALID
EXTRACTION_MODEL_FAILED
RESULT_NOT_FOUND
ARTIFACT_RANGE_INVALID
RESULT_ACK_CONFLICT
CANONICAL_MATERIALIZATION_CONFLICT
```

## 14. 非目标

不在本 Spec 中部署 Browser Server、发布插件、上架 Chrome Web Store、执行真实平台 DOM automation、调用真实模型、自动唤醒 Codex、自动批准 Query/Claim/Evidence/Review、修改 M5 指标公式或宣称业务效果。
