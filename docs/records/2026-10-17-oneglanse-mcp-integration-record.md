# OneGlanse MCP 单 Query 联调记录

- 状态：verified（本地 MCP 采集/完整接收/cowork 候选分析范围）；OneGlanse 默认模型分析未通过。
- 创建/更新：2026-10-17
- 来源：用户明确要求按简洁版计划开发，先跑通 MyyShop 一个 Query，验证并同步文档。
- 关联：[任务](../tasks/2026-10-17-oneglanse-mcp-integration.md)、[计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)、[GEO 候选观察](2026-10-17-oneglanse-geo-observation.md)、[历史规划](2026-10-17-oneglanse-mcp-planning-record.md)。
- 工作目录与基线：cowork `/Users/sujingjun/geo-cowork`，`main@eb8512a`；OneGlanse `/Users/sujingjun/dhnb/oneglanse`，`feat/mcp-stdio@b2c6e73`。均未提交。
- 任务范围：两仓本地开发、一个 Query/Gemini 的原生工程运行及自动分析副作用、完整结果回传和本地文档。正式 Cycle、知识批准、飞书、远端部署与 Git 发送不在范围。

## 1. 责任边界与实现

OneGlanse 新增 `apps/mcp`，负责 stdio Server、可撤销 grant、当前 workspace membership、读写/运行/停止权限、资源归属、能力声明、输入输出 schema、错误码、分页和分块。应用操作在 `packages/services/src/mcp.ts`。Server 不把输入中的 user ID 当身份；job receipt 绑定 grant/workspace/job/provider，状态过期返回 unavailable。

原生 prompt 保存新增共享锁与可选 expected revision/no-deletion 检查，继续原来的 trim/去重/替换语义。run 使用原生工作区范围；提交时再次核对 revision，MCP 调用等待原有 enqueue 完成，防止短进程退出丢失交接。Agent 的采集、正文/来源处理、重试、默认分析、调度和存储 schema 没有改造。

cowork 更新 `geo-query-portfolio`、`geo-answer-cycle`、`geo-answer`，新增薄 stdio 客户端与 `oneglanse.mjs` 的 prepare/start/status/receive/analyze 入口。配置通过 OneGlanse 发布的进程入口启动服务，无跨仓源码 import，也不访问其数据库、队列或浏览器。业务数据只写品牌工作区；默认 `.mcp.json` 和旧 Browser/Playwright 运行入口保持原状。

已有工作区清理及文档改动被保留，未恢复 12,497 个此前已删除的文件。OneGlanse 运行 checkout 为 `github/oneglanse@92640e2+local-78409ddf2ef0`，使用既有构建；它与此次开发 checkout 不同，其既有源码改动未被覆盖。

## 2. 真实链路证据

[运行计划](../../workspaces/myyshop/execution/oneglanse-single-query-plan.json)固定了两侧 workspace ID、Query 来源版本、Gemini 及本次工程授权。原始 Query 为 `What is MyyShop?`，明确选用 `normalized_text=what is myyshop`，没有静默改写正式对象。

| 项目 | 实际结果 |
| --- | --- |
| cowork workspace | `ws_myyshop2026082400000000000` |
| OneGlanse workspace | `workspace_abeabd53-ba17-4fae-b3c8-c2001f208a4e` |
| 原生 prompt | `f66bf31d-bf94-4cfb-901e-fb2f4654e824`；保存前后 ID/文本相同，无删除项 |
| 有效范围 | 1 prompt × Gemini；未改 enabled providers、selected prompts 或 schedule |
| 原生 job | `a54b8107-7049-41bb-9670-0b7bc5a88bdd`；仅发起一次 |
| 原生状态 | `completed`，Gemini completed，expected=1、actual=1 |
| response | `503b9927-2727-4f65-a699-50d49aad512a` |
| 接收完整性 | 5,053 bytes；SHA-256 `c99edfa62d5feee8b4ec0f3fe806a019b35cdb9313c5a25843d4152f255b882e` |
| Source | 6 条完整记录、4 个不同 URL；保留 title/cited_text/url/domain/favicon |
| 独立核对 | OneGlanse 服务侧直接读已保存行的序列化 hash/长度与 MCP 接收值相同 |
| 幂等与恢复 | 重复 receive 不改原字节；再次 start 返回 `reused:true`、同一 job；本地 analyze 可重复且不联网 |

证据入口：[prepared](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/prepared.json)、[received](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/received.json)、[analysis](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/analysis.json)。status 子目录保存 running 与 completed 原生快照。原生采集约发生于北京时间 14:38:18–14:38:53。

真实运行前检查所有 provider 队列均无 waiting/active/delayed 任务，随后启动既有 Agent。验收后已 graceful stop，退出码 0；没有清空业务数据库、覆盖 provider 会话或额外启动其他平台。

## 3. 实际命令与检查

| 检查 | 实际结果 |
| --- | --- |
| OneGlanse `pnpm exec turbo build --filter=@oneglanse/mcp...` | 退出码 0；6 个依赖包构建通过 |
| OneGlanse `pnpm --filter @oneglanse/mcp test` | 退出码 0；8/8，覆盖授权、scope、receipt、未知提交、长 Unicode 内容和全部来源字段 |
| OneGlanse Services 指定两个 MCP 测试文件 | 退出码 0；7/7，覆盖保存冲突、并发模拟、原生语义、run revision 与 enqueue 等待 |
| OneGlanse MCP/Services typecheck、MCP lint | 退出码 0 |
| OneGlanse `pnpm deadcode` | 退出码 0；保留既有 4 条冗余配置提示 |
| cowork `npm run test:oneglanse` | 退出码 0；6/6，覆盖完整接收、未知启动不重发、范围漂移、截断/hash、分页、路径隔离及离线恢复 |
| cowork `npm test`（修复后） | 退出码 0；448/448、0 skipped |
| 文档/插件/格式 | `npm run check:docs` 166 文档、353 本地链接，0 error；`validate:plugin`、`format:check` 均退出码 0 |
| MyyShop 工作区/索引 | `workspace-validate.mjs --objects` 无缺失/错误/warning；`build-index.mjs --check` 1052 objects、120 legacy，0 warning、无写入 |
| 两仓 diff/范围 | `git diff --check` 均退出码 0；OneGlanse `apps/agent` 无本次 diff，旧运行 checkout 的改动集合保持不变 |
| 真实 MCP 负向调用 | 非授权 workspace→FORBIDDEN；过期 prompt revision→PROMPT_CONFLICT；错误 run revision→RUN_SCOPE_CHANGED；伪造 receipt→RESOURCE_FORBIDDEN；没有额外提交 |
| `oneglanse.mjs prepare/start/status/receive/analyze` | 各退出码 0；均使用实际 stdio MCP，analyze 为纯本地 |

真实长回答不是本次采样的特征，分块多字节完整性由确定性长样本验证；不能把 fixture 的大内容验证表述为本次平台回答很长。首轮测试 helper 类型检查失败后已修正为 typed mocks 和 MCP 结果 schema parse；死代码检查发现的无用导出已移除。

根 `npm test` 首次为 453 passed / 17 failed：16 个是 Node 直接发现 Browser 子项目的 TypeScript 测试、无法解析其扩展名省略导入；1 个是已有 manual-assist fixture 的授权于 2026-10-02 到期。修复为根入口只运行 `tests/*.test.mjs`，Browser 子项目继续使用自己的 Vitest 命令；为 manual-assist 与授权漂移测试传入 fixture 内的固定时钟。没有放宽真实授权到期检查。工作区检查曾误用不存在的 `workspace.mjs`，随后使用实际 `workspace-validate.mjs --workspace workspaces/myyshop --objects` 通过。

## 4. GEO 观察与未通过项

本地分析与[候选判断](2026-10-17-oneglanse-geo-observation.md)已完成：答案有品牌提及，同时包含创作者服务及历史 dropshipping 表述。引用页未抓取，因此不评判网页原文支撑、source type 或 Claim accuracy，不新增正式 M5 对象。

**OneGlanse 原生后台模型分析失败**：该 Agent 环境未配置 OpenAI/Anthropic 分析密钥，使用默认 `openai/gpt-4.1/responses`；原生逻辑尝试了新回答和历史回答的 workspace-wide 分析。没有更换模型、补入其他项目凭据、关闭自动分析或重跑 Query。原生 collection completed 不证明默认模型分析成功。这一独立依赖仍由 OneGlanse 运行配置负责，后续可针对已保存答案恢复分析。

## 5. 验收边界

已验证的是一个 Gemini Query 的授权保存、原生运行、状态、完整回传和 cowork 候选分析。未知的 actual model version、独立新会话、原始 DOM、citation occurrence、实际提交时间、Profile/slot 和精确 job-response 绑定保持未知。单 Query 不等于正式双槽 Baseline、五平台验收、知识批准或 GEO 效果。

MyyShop 仍为 `knowledge_base_ref:null`，正式计划 `execution_paused:true`。没有执行其他平台、正式 Cycle、远端部署、飞书、commit/push/PR。宿主原生自动发现/安装、远程传输、生产镜像和 OneGlanse 模型分析成功尚未验证。

本次只增加实际需要的接口和接收代码；未建立新采集框架、第二套任务引擎或 artifact/ack 系统。后续优先解决 OneGlanse 运行环境的分析凭据；如需正式采样证据或其他平台，再以实际缺口单独决定范围。
