# OneGlanse 与 GEO cowork 首版对接开发计划

- 状态：implemented
- 创建/更新：2026-10-17
- 来源：用户明确插件生成 Query、OneGlanse 采集答案与引用；随后限定“第一版不变更能力”，OneGlanse 负责 MCP Server 授权、Tools 和能力接口，cowork 通过 Skill/MCP 对接；两侧已分别有 MyyShop 工作区。
- 关联：[本轮边界与清理记录](../records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)、[初次源码核验](../records/2026-10-17-oneglanse-mcp-planning-record.md)、[项目协作规则](../../AGENTS.md)、[Spec 0013](../specs/0013-browser-query-task-mcp-automation.md)、[Spec 0015](../specs/0015-authorized-real-two-cycle.md)。
- 适用范围：现有 OneGlanse 能力的 MCP 封装，以及 cowork Skill 调用、结果接收和 GEO 分析的开发规划。
- 当前执行范围：2026-10-17 用户明确要求按本简洁计划开发并跑通 MyyShop 一个 Query；授权两仓本地实现、指定单 Query/Gemini 工程联调及原生自动分析、验证与本地文档同步。正式 Cycle、知识批准、远端发布与飞书镜像不在本次范围。

## 当前实施状态

用户于 2026-10-17 明确要求开始开发。现已完成 OneGlanse stdio 授权与 9 个 Tools、cowork 三个既有 Skill 和薄接收入口，并跑通 MyyShop 单 Query/Gemini 的保存、运行、状态、完整回传与本地候选分析。见[任务](../tasks/2026-10-17-oneglanse-mcp-integration.md)、[验证记录](../records/2026-10-17-oneglanse-mcp-integration-record.md)。

后续已按用户要求以 `/Users/sujingjun/dhnb/oneglanse` 同时运行采集 Agent 和 MCP，完成一次新的 Query：1 条回答、0 条存储 Source、1,151 字节，存储与接收 SHA-256 一致。当前仓库分析凭据已配置，但默认模型调用返回 Connection error；cowork 的实际 DeepSeek 候选诊断成功。见[完整流程试跑与能力缺口](../records/2026-10-17-myyshop-geo-full-flow-audit.md)。正式 Cycle 继续暂停，OneGlanse intake 到正式 Sample/Review/Cycle 的接续尚未实现；单 Query 接入不代表整体闭环。

## 1. 首版目标

**cowork 生成 Query → Skill 调用 OneGlanse MCP → OneGlanse 按现有流程采集 → MCP 返回已保存答案和引用 → cowork 保存结果并进行 GEO 分析。**

首版增加连接授权和接口，不改造 OneGlanse 的平台采集、正文处理、引用处理、内部重试、存储、调度或默认分析。先让双方各自已有能力能够稳定协作，实际缺口另行形成后续需求。

“完整回传”指 OneGlanse 已保存的 `response` 全文及 `sources` 全部现有字段无遗漏、无二次摘要、无传输截断。它不代表平台页面原始 DOM、全部引用出现次数或 UI 来源覆盖已获得验证。接口未提供的信息保持 unknown/unsupported，不由 cowork 猜测补齐。

## 2. 各自实现边界

| 责任 | cowork 项目 | OneGlanse 项目 |
| --- | --- | --- |
| 品牌与 Query | 知识、Goal、Query 生成/来源、Query Set、业务采样规则 | 复用已有 workspace 和 prompt 管理能力 |
| 调用编排 | 在现有 Skill 中组织读取能力、保存 Query、启动、查状态、接收、分析 | 提供可调用且有明确副作用的 Tools |
| MCP | 按公开合同调用；必要时用最薄的通用调用/落盘辅助代码 | MCP Server、身份授权、workspace/资源范围、schema、分页、错误和版本 |
| 执行 | 不操作 OneGlanse 浏览器、Cookie、数据库、队列或内部函数 | 原有 Agent、provider、队列、采集与分析流程继续归本项目 |
| 结果 | 保存原始返回值和接收 hash，维护 Query 映射与 GEO 来源，继续本地分析 | 返回现有答案、引用、原生 ID、状态和可提供的上下文 |
| 验收 | Skill 调用正确、接收完整、GEO 结论不越过证据 | 授权有效、Tool 与原生操作一致、结果无额外丢失 |

OneGlanse 不需要维护第二套 GEO Skill；cowork 优先扩展 `geo-query-portfolio`、`geo-answer-cycle` 和 `geo-answer`。只有确有协议/大内容读取复用时才提取小型辅助代码，不提前建立通用 collector 框架、任务引擎、批量同步平台或额外编排器。

两仓不互相 import 本地源码。OneGlanse 的数据库结构和浏览器实现不是 cowork 的接口。GEO canonical 对象归 cowork 工作区；MCP Tools 不直接创建或批准 Claim、Review、Publication 等 GEO 对象。

## 3. 两个 MyyShop 工作区

| 系统 | 已核对身份 | 用途 |
| --- | --- | --- |
| cowork | `workspaces/myyshop`；`workspace_id=ws_myyshop2026082400000000000`；`merchant_ref=MER-MYYSHOP-001` | 本地知识、Query、结果接收和 GEO 业务对象 |
| OneGlanse | 名称 `MyyShop`，slug `myyshop`，域名 `www.myyshop.com`；`id=workspace_abeabd53-ba17-4fae-b3c8-c2001f208a4e` | 现有平台连接、prompts、运行与回答 |

OneGlanse 身份已通过本地 PostgreSQL 的只读元数据查询确认，未创建/修改 workspace，也未读取答案或账号信息。两个工作区名称相同，但目录、主键、登录态、数据和权限各自独立；实施时以本地连接配置保存 ID 映射，并由 MCP Server 校验，不使用名称自动选取任意同名工作区。

用户已明确采集和 MCP 均以 `/Users/sujingjun/dhnb/oneglanse` 为准；当前分支 `feat/mcp-stdio`、基线 `b2c6e73`，本次 Agent/Services 源码快照为 `b2c6e73+source-e252c1b710a3`。Agent、MCP、构建、Python 和 auth root 均来自该目录。用户另行授权的已有登录凭证只作一次性导入。首次联调使用另一 checkout 的过程仅保留在历史 Record，不作为当前采集实现或运行基线。OneGlanse 发布启动/版本合同，cowork 不导入开发路径下的内部源码。

cowork 当前 `knowledge_base_ref:null`，真实业务执行仍暂停。连接现有 OneGlanse MyyShop 不会自动创建真实 KBASE、恢复正式 Cycle 或改变批准状态。

## 4. OneGlanse 交付：MCP Server、授权、Tools

### 4.1 接入与授权

本地首版建议使用 stdio，连接已经运行的 OneGlanse 应用服务；浏览器任务仍在原有 Agent 中执行。Server 进程入口、SDK 版本和运行配置由 OneGlanse 项目维护，cowork 按发布的启动合同配置，不在插件安装目录保存业务数据。

- Server 使用已配置且可撤销的调用身份，只允许访问授权 workspace；本地 stdio 的进程信任和应用 workspace 授权分别校验，不假设“同机即全部可访问”。
- 每个 Tool 校验其 workspace、job、prompt 和 response 归属，不能仅凭调用方传入的 `user_id` 或资源 ID 放行。
- 区分只读、prompt 写入、运行和停止权限。Tools 说明原生副作用，包括现有运行可能自动调用分析模型；已有有效范围授权可持续使用，不在每次轮询时重新确认。
- 凭据保留在 OneGlanse 本地配置/环境中，Tools、Skill、日志和文档不返回 Cookie、token 或账号信息。stdio 的 stdout 只输出协议内容。
- 首版不要求远程 HTTP、完整多租户 OAuth 或跨设备部署。若未来需要，作为明确的后续范围设计。

### 4.2 能力与 Tool 合同

以下为双方需要的能力分组。当前实现合同为 `1.0.0`；Tools 是 `oneglanse_capabilities`、`oneglanse_workspace_read`、`oneglanse_prompts_read/save`、`oneglanse_run_start/status/stop`、`oneglanse_responses_list`、`oneglanse_response_read`，具体 schema 与启动合同由 OneGlanse 的 `docs/mcp-integration.md` 维护；只封装现有操作。

| 能力接口 | 必要行为 | 首版边界 |
| --- | --- | --- |
| capabilities | 返回版本、支持平台、当前授权范围、可调用操作、结果字段及限制 | 支持/就绪/允许执行分别说明；已有五个平台不等于本次批准全部运行 |
| workspace.read | 返回被授权 MyyShop 的稳定 ID、平台配置和可运行状态 | 不新增/删除 workspace，不返回其他租户信息 |
| prompts.read/save | 读取与保存现有 prompts，回传真实 prompt ID 与服务接受的文本 | 公开原生 trim/去重/替换语义；不得将覆盖式保存伪装成追加 |
| run.start | 按当前 OneGlanse workspace 的 prompt/provider 配置启动原生运行 | 回传原生 job ID；不承诺现有服务未具备的按 slot 精确执行、exactly-once 或独立新会话 |
| run.status | 查询原生运行状态和错误 | Redis 状态过期或运行关系缺失时返回 unknown/unavailable，不自动重启 |
| responses.read | 按允许的 workspace、prompt、provider、时间和 response ID 查询现有答案与来源 | 返回全部 `response`/`sources`；分页或内容分块不得静默截断；不能假装现有数据包含原始 DOM |
| run.stop | 封装当前 provider-run 停止能力 | 按实际停止粒度处理，保留已有结果；不扩展为新的全局取消状态机 |

接口需要显式输入输出 schema、稳定错误码及读写副作用说明。响应使用 `structuredContent`；较大结果使用明确分页或按原生 response ID 分块读取，接收侧能判断何时读完。无需新建原始 artifact 仓库或 delivery/ack 子系统；只在传输确实需要时提供分块能力。

现有 `storePromptsForWorkspace` 按传入集合保存，并删除未包含的 prompt。cowork 写入前先读取完整集合，合并待添加 Query，核对删除项和配置变化；OneGlanse 接口层需保护授权写范围及并发冲突。首版不自动清空已有 prompts、不改 schedule，也不开发双向同步。

现有 `run` 会使用 workspace 配置，不能凭一个局部 Query 参数假装只运行它。Skill 在启动前读取并展示有效 prompt/provider 范围，只有该范围已获授权才调用；范围无法由现有配置表达时返回明确缺口。

### 4.3 首版结果

保留原生字段：`id`、`workspace_id`、`prompt_id`、`prompt`、`model_provider`、`prompt_run_at`、`created_at`、`response`、`sources`。每个 Source 保留现有 `title`、`cited_text`、`url`、`domain`、`favicon`。具体字段以 OneGlanse 已发布 schema 为准，缺失字段显式标明。

- `model` 当前可能只是 provider 名称，不能自动解释为实际模型版本。
- `sources:[]` 只表示现有结果没有来源条目，不能推断已经证明平台无引用。
- 现有来源已规范化/过滤/去重；cowork 不反推原始 occurrence 次数、marker 或正文位置，也不把 `cited_text` 当已读取的网页原文。
- job 与 response 的精确关系若未被原生数据保存，应声明不支持；不能只凭时间邻近声称强绑定到某个 slot。接收可按真实 response ID 去重并保留候选关联。
- MCP 和 cowork 不额外自动重发状态未知的 run；OneGlanse 原有内部重试保持现状，并在 capabilities 中说明。首版不承诺平台只收到一次 Query。
- OneGlanse 现有自动分析行为保持；cowork 的 GEO 分析独立进行，不直接把 OneGlanse 分析结果提升为知识事实或人工批准。

## 5. cowork 交付：Skill 工作流与接收

1. `geo-query-portfolio` 生成或读取已选 Query，保留原始文本、来源和版本。
2. `geo-answer-cycle` 查询 MCP capabilities 和已绑定 MyyShop，核对实际运行范围；按原生规则准备 prompts，保存服务接受的文本与 prompt ID 映射。
3. 在已有授权范围内启动原生运行，持久记录 request/原生 job ID 与 Query 的关联；MCP 超时先查状态，不直接再次启动。
4. 分页/分块读取完整 response 和 Source 字段，在 `workspaces/myyshop/runs/<run>/oneglanse-intake/` 保存接收数据、原生 ID、接口版本、查询条件和 SHA-256。
5. 继续已有 GEO 答案分析与来源归档。来源列表按 source-list 证据处理；需要原始引用出现记录的正式字段保持未满足，不制造 occurrence 证明。
6. 分析失败从本地已接收结果恢复。若正式采样所需的新会话、实际提交时间、Profile/slot 等证据不足，保留为工程/候选观察，明确缺口，不放宽现有 Spec 0015 来宣称正式 Baseline 完成。

首版无需改写旧 Browser/Playwright 入口。插件配置校验若需增加 OneGlanse 注册，只增加明确的可选配置与相关测试，未配置时原有功能继续可用。不同宿主的自动发现、安装与调用能力分别验收。

## 6. 开发顺序与验收

| 阶段 | 责任方 | 最小交付 | 验收 |
| --- | --- | --- | --- |
| 1. 接口合同 | OneGlanse 主责，cowork 对齐 | 当前部署版本、MCP 启动方式、授权和 workspace 范围、能力清单、输入输出样例 | 每项能对应现有服务；不足明确返回 unsupported；不要求先改采集实现 |
| 2. Server 封装 | OneGlanse | MCP 授权、Tools、scope、结果分页/分块、错误透传与必要调用记录 | 越权拒绝；原生操作与 Tool 一致；已有答案/引用完整返回；原采集/分析行为不变 |
| 3. Skill 对接 | cowork | 更新已有 Skill、MyyShop 映射、必要薄辅助代码、本地接收与来源记录 | 一个 Query 完成授权保存、运行、查状态、完整接收和 GEO 分析；未知证据不补造 |
| 4. 联调收口 | 双方分别提供证据 | 一个现有平台先闭环，再按实际授权扩展 | 长结果无截断、重复读取幂等、未知启动不重发、原生内部重试边界明确、失败可定位责任方 |

确定性检查使用脱敏 fixture 和自动清理的临时目录。本次授权 MyyShop 一个 Query、一个现有平台的工程运行及其原生自动分析；正式业务恢复和远端发布仍需各自授权。首个平台通过不能作为五平台或全宿主验收。

## 7. 从首版移出的内容

以下曾在初版草案中提出，按用户最新边界移出本次开发目标：清理前 DOM 持久化、引用 occurrence 全量保真、完成检测/提取算法修订、provider 重试策略改造、新持久任务账本和分布式执行器、独立 artifact/ack 交付系统、关闭 OneGlanse 默认分析的仅采集模式、将五个平台自动采集一并纳入正式 Cycle。

这些是已识别的能力差距或后续方向，不作为首版接入门槛。实现中若确需改变 OneGlanse 业务能力，先记录具体原因与影响，再按新的范围决定处理；cowork 不以绕过 MCP 或复制 OneGlanse 内部实现来补洞。
