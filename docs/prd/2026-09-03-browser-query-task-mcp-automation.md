---
title: Browser Query Task MCP 自动化 PRD
status: approved
created: 2026-09-03
updated: 2026-09-03
source:
  - docs/requirements/2026-09-03-browser-query-task-mcp-automation.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/adr/0002-browser-server-streamable-http-mcp-boundary.md
  - "2026-09-03 grill-with-docs 已确认的五项实现路径决定"
  - "2026-09-03 Owner 明确批准 PRD、Spec 0013 和 Plan，并授权开始本地实现"
scope: GEO 负责人从 active Cycle 发起浏览器 Query Task、人工登录接管、结果获取与 Cowork 物化的用户旅程和业务验收
---

# Browser Query Task MCP 自动化 PRD

## 1. 用户与价值

核心用户是启动 GEO Cycle 并审阅消费者平台结果的 GEO 负责人。用户不应手工搬运 Query Set，也不应在扩展与 Cowork 两边维护同一任务状态；浏览器产品负责可靠执行和保存原始结果，Cowork 负责把这些结果纳入项目现有的 M5 审计对象。

## 2. 用户旅程

1. 用户在 Cowork 完成 Query Portfolio 人工批准和 Query Set 冻结，创建并启动 GEO Cycle。
2. 若选择人工采集，沿用 M5 manual 路径；若选择浏览器任务，Cowork 调用 Browser MCP Server 注册该 Cycle 的精确 Query Set、Query 列表、平台入口与许可 Profile。
3. 用户在 Assistant Panel 新建 Browser Query Task，选择已注册的 active Cycle 与目标平台；Browser Server 冻结 task input，Extension Client 取得第一条 pending Query。
4. Extension Client 打开目标平台的新对话入口并检查最小登录状态。未登录或出现登录挑战时，任务显示 `waiting_human`，保留 Query 和 attempt，不读取任何凭据。
5. 人工登录后点击继续。对于 `manual_assist`，用户提交并确认完整结果；对于已获 `allowed` 的 DOM automation，扩展输入并提交 Query、等待 streaming/busy 结束和内容稳定。
6. 每条 Query 使用新的对话上下文。扩展保存回答区域完整 HTML、可见文本、Citation occurrence、结果 URL、selector/detector 版本与 outcome；不把同一回答复用为另一个 Query 或 slot。
7. Browser Server create-only 保存 Query Capture。Browser Server Agent 依据冻结的 extraction profile 生成结构化 Extraction Result；若模型不可用或 Schema 不合格，raw 仍保留，结果进入可重试的 extraction failure，而不是重新提交平台 Query。
8. Capture 与 Extraction Result 进入 pending queue。Cowork 在 Cycle 同步/恢复步骤调用 MCP Tools 拉取、可靠接收并 acknowledgement。
9. Cowork 校验版本和 provenance，materialize canonical Answer Sample/Citation Observation 等 M5 对象；业务 Review、Source 分类和下游结论继续遵守既有人工门。
10. 全部 Query 达到终态后 Browser Server 形成 Task Summary；失败、challenge、取消和未知提交状态原样保留，不用成功样本覆盖。

## 3. 业务规则

- **所有权**：Cowork 拥有 GEO Cycle 与 canonical M5 对象；浏览器产品拥有 Browser Query Task、Query Attempt、raw capture、Extraction Result 与 pending delivery。
- **输入冻结**：Cycle ref/version、Query Set ref/version/hash、Query ref/version/text、平台 Profile 与许可状态在任务创建时冻结；任一漂移都新建任务或明确 supersede，不静默改正在跑任务。
- **对话独立**：遵守 Spec 0006 的 `conversation_state:new`；无法确认新对话时记录 `unknown`，comparability 至多为 `partial`。
- **登录接管**：`waiting_human` 不等于失败；人工登录后恢复同一 attempt，但若提交状态未知则必须人工判定，不自动重试。
- **自动化许可**：登录状态不构成 DOM automation 许可；只有 adapter `allowed`、精确 host permission 与授权 Profile 同时满足时才执行自动输入和提取。
- **双层结果**：Query Capture 是原始事实，Extraction Result 是带 provenance 的机器提取；后者不能覆盖前者，也不能冒充 Cowork canonical 对象。
- **交付语义**：Cowork acknowledgement 只表示已可靠接收 raw/extraction；不表示 Review 已通过、Cycle 已完成或业务结果成立。
- **MCP 方向**：Cowork 调用 Browser MCP Server。Server 将结果置为 pending，但不假定通知可以启动一个新的 Codex turn。

## 4. 业务验收

| 编号 | 场景 | 通过条件 |
| --- | --- | --- |
| BA-01 | Cycle 输入注册 | Cowork 通过 MCP 注册 active Cycle 的 frozen Query Set；重复同字节返回 kept，不同字节冲突 |
| BA-02 | 扩展建任务 | Assistant Panel 可选择已注册 Cycle/平台并创建任务，显示 Query 总数与冻结版本 |
| BA-03 | 未登录 | 扩展进入 waiting_human，人工登录后继续且未重复提交 |
| BA-04 | 独立 Query | 每条 Query 使用新对话；无法证明时显式 unknown，不伪称可比 |
| BA-05 | 自动采集 | 仅 allowed fixture 自动输入、等待稳定并保存完整回答 HTML、文本、Citation 和 URL |
| BA-06 | Manual Assist | manual_only 平台保留人工提交，产出与自动路径相同的 Query Capture 合同 |
| BA-07 | Agent 提取 | Fake Model 生成符合 Schema 的 Extraction Result；记录模型/Prompt/Schema 版本和 raw checksum |
| BA-08 | 故障恢复 | 扩展、Server 或 Agent 在各步骤中断后恢复，不覆盖历史、不重复外部提交 |
| BA-09 | Cowork 获取 | Codex 中的 Cowork 可列出、读取、确认 pending result；重复确认幂等 |
| BA-10 | canonical 边界 | 只有 Cowork 物化 M5 对象；Browser Server 不写 Workspace、不产生业务结论 |
| BA-11 | 插件注册 | 安装 geo-expert 后 Codex Host 可发现 Browser MCP Server 的允许 Tool |
| BA-12 | 无真实影响 | E2E 只使用 loopback fixture 与 Fake Model，无真实平台、账号、付费调用、发布或部署 |

## 5. 完成边界

本 PRD 的工程完成只证明同机浏览器任务、Server Agent、Streamable HTTP MCP 与 Cowork 物化 seam 可运行。它不证明任何真实消费者平台允许 DOM automation，不证明真实 Baseline/Retest、GEO 提升或业务效果。
