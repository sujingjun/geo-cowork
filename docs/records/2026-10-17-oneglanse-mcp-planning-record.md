# OneGlanse MCP 对接规划核验记录

本页记录首次源码梳理。用户随后明确首版不改 OneGlanse 能力，开发范围已按[最新计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)收紧；原始保真、任务系统等改造不再是首版要求。工作区清理、AGENTS 同步和实际运行实例差异见[后续记录](2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)。以下首次核验事实保留。

- 状态：verified（仅源码梳理、开发计划与文档检查；不代表对接实现或运行验收）
- 创建/更新：2026-10-17
- 来源：用户提出 OneGlanse 采集 + cowork Query/分析的 MCP/Skill 对接，并明确本次先生成开发计划。
- 关联：[开发计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)、[Spec 0013](../specs/0013-browser-query-task-mcp-automation.md)、[Spec 0014](../specs/0014-knowledge-driven-geo-e2e.md)、[Spec 0015](../specs/0015-authorized-real-two-cycle.md)。本次未建立实现 Task 或新 Spec。
- 工作目录：`/Users/sujingjun/geo-cowork`；只读核验 `/Users/sujingjun/dhnb/oneglanse`。
- 基线/分支：geo-cowork `main@eb8512a3db29e2d9f848c9db41ef607f504536c0`；OneGlanse `main@b2c6e730b6818e64a4cef8b73c6605911c890626`。核验开始时两仓 tracked 工作区均干净。
- 任务范围：核验已有实现与差距，形成 proposed 开发计划，更新导航；不实现采集或 MCP 功能。

## 1. 核验结论

对接方向可行，已有 provider、队列和 cowork 结果接收逻辑可复用。当前缺少 OneGlanse 业务 MCP、精确外部任务合同、可恢复的提交账本、完整原始答案与引用的交付，以及对应 cowork adapter；不能通过添加 MCP 配置和 Skill 文案直接完成。

重点差距已写入计划：正文清理会丢失引用标记，来源被规范化/过滤/去重，部分提取失败表现为空数组，prompt 异常重试可能重新提交，持久化失败不严格阻止进度完成，Worker 默认附带分析模型调用。所有结论均是当前源码核验，不是本轮线上复现。

## 2. 源码依据

### geo-cowork

- [Query 输入与生成](../../plugins/geo-expert/scripts/lib/query-inputs.mjs)：`generateKnowledgeQueries`、`ingestQueryInputs`。
- [Browser 结果接收](../../plugins/geo-expert/scripts/lib/browser-query-result.mjs)：分块、SHA-256、create-only、ack 与 fixture materializer 限制。
- [正式采样](../../plugins/geo-expert/scripts/lib/real-sampling.mjs)：冻结绑定、Citation occurrence、真实提取、Playwright collector 标记。
- [正式槽约束](../../plugins/geo-expert/scripts/lib/real-cycle-contract.mjs)：独立会话、观察窗口与终态。
- [提交恢复](../../plugins/geo-expert/scripts/lib/capture-run.mjs)、[平台采集方法](../../plugins/geo-expert/scripts/lib/playwright-collector.mjs)：先记意图、未知不重发、三自动两人工。
- [MCP 配置校验](../../plugins/geo-expert/scripts/lib/plugin-mcp-config.mjs)与[测试](../../tests/plugin-mcp-config.test.mjs)：当前只允许已有 server 配置。
- [MyyShop 状态](../../workspaces/myyshop/STATUS.md)和[执行计划](../../workspaces/myyshop/cycles/preparation/real-cycle-plan.json)：真实业务暂停仍有效。

### OneGlanse

以下路径相对 `/Users/sujingjun/dhnb/oneglanse`，对应本记录的 Git 基线；不建立跨仓运行时依赖。

| 路径 | 核验内容 |
| --- | --- |
| `AGENTS.md`、`ARCHITECTURE.md`、`.mcp.json` | Services/Agent/Web 边界；CodeGraph 为现有 MCP 配置 |
| `packages/services/src/agent/jobs.ts`、`queue.ts` | workspace prompts 提交、随机 group ID、队列删除策略 |
| `packages/types/src/types/agent.ts`、`sources.ts` | 当前答案/来源字段、五个平台 ID |
| `apps/agent/src/api.ts` | health/auth upload 路由，不是采集 MCP |
| `apps/agent/src/core/prompt-runner/executePrompt.ts`、`retryPolicy.ts`、`core/steps/askPrompt.ts` | 提交、提取、三次重试与多提交策略 |
| `apps/agent/src/lib/browser/domOps.ts`、`lib/input/markdown/converter.ts` | 原始答案区域读取能力与展示清理 |
| `apps/agent/src/lib/input/response/waitForFinish.ts`、`core/steps/extractSources.ts` | 强制稳定退出和部分来源失败变空数组 |
| `apps/agent/src/lib/extraction/sourceUtils.ts`、`core/providers/perplexity/lib/extractSources.ts` | URL 清理、域过滤与去重 |
| `apps/agent/src/worker/jobHandler.ts`、`analysis.ts`、`executionGate.ts` | 保存失败处理、自动分析与单进程串行 |
| `packages/services/src/prompt/storePromptResponses.ts`、`fetchPromptResponsesForWorkspace.ts`、`packages/db/clickhouse-init/schema.sql` | 当前结果写入、workspace 级读取与字段范围 |
| `apps/web/src/server/api/routers/agent/agent.ts`、`_shared/submitAgentRun.ts` | Web 调用到 Services 的路径 |
| `.github/workflows/build.yml` | 现有 PR Gate 检查范围 |

## 3. 实际操作与结果

- 两仓运行 `git status --short`、`git branch --show-current`、`git rev-parse`，确认基线；没有建立分支或提交。
- 按 Wiki → canonical → 源码顺序读取 cowork 文档；使用 `rg`、`cat`、`sed` 定位和核验定义、调用点及相关测试。
- OneGlanse 起初不存在 `.codegraph/`。按该仓 AGENTS 指令运行 `pnpm codegraph:init`，退出码 0，索引 368 文件、3534 节点和 8310 边；仅生成本地忽略的索引，后续 Git status 仍干净。
- 运行 `CODEGRAPH_TELEMETRY=0 pnpm exec codegraph query 'submitAgentJobGroup'`、`callers submitAgentJobGroup`、`callees executePrompt`，均退出码 0；再读取实际文件确认调用与数据流。
- 核对当前安装的 MCP SDK：版本 1.30.0，`LATEST_PROTOCOL_VERSION=2025-11-25`。读取官方 2025-11-25 Tools/transports 和 2026-07-28 HTTP/stdio/Tools 文档，确定将兼容性纳入计划。
- 个别导航命令命中不存在的 `.codegraph/`、`packages/utils/tests` 或 `.agents/plugin.json`；已改用实际路径/现有 `tests` 和 `validate-plugin.mjs` 定位。它们是检索路径修正，不是业务测试失败。

文档与范围检查结果：

| 检查 | 实际结果 |
| --- | --- |
| `npm run check:docs` | 退出码 0；162 份 Markdown、319 条本地链接，0 错误 |
| `git diff --check` | 退出码 0；无 diff 空白错误 |
| Node + gray-matter 定向检查 | 退出码 0；两个变更 Wiki 的必需 Frontmatter 和全部 source 路径存在；三个新文档无行尾空白，代码围栏闭合 |
| 变更范围核验 | geo-cowork 仅五个文档新增/修改；OneGlanse `git status --short` 仍为空 |

本次没有运行行为测试、构建或采集联调；Mermaid 已检查文字关系与围栏，未做实际渲染验收。

## 4. 本次变更

1. 新建 proposed 开发计划，明确责任、Tool 草案、完整性、恢复、实施阶段与验收。
2. 新建本记录与 OneGlanse Wiki 导航。
3. 更新 `docs/README.md`、`docs/wiki/index.md` 的入口。

没有修改两仓运行时代码、Skill、MCP 配置、数据库、业务工作区或现有批准 Spec。

## 5. 未验证与后续

用户已说明 OneGlanse 本地跑通；本轮没有重新采集、调用真实模型或读取采集数据库，因此不追加新的运行成功证明。新增 MCP 协议互通、完整性、重启恢复、跨仓接收、宿主安装与真实平台联调均属于后续开发验收。

本次不恢复 MyyShop 真实业务周期，不写飞书，不执行 commit/push/PR/部署。下一步是基于开发计划确定增量合同，再进入实现；开发计划保持 proposed。
