# 知识驱动 GEO 全流程实施记录

- 状态：verified
- 创建/更新：2026-09-16
- 工作目录：`/Users/sujingjun/geo-cowork`
- 基线：`main@dd7cc2187c962c84b45f46dd744e0fa9822a06b4`
- 来源：[Task](../tasks/2026-09-16-knowledge-driven-geo-e2e.md)、[Plan](../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md)、[Spec](../specs/0014-knowledge-driven-geo-e2e.md)
- 范围：P0–P6 已在本次调整后的工程范围完成；真实业务周期、发布与效果未执行。

## 开始状态

工作区原有未跟踪文件为 2026-09-15 handoff，保留。当前任务明确授权真实模型、GSC 与三个指定平台的低频采集；未授权 Git 提交/远端发布。

同一会话规划阶段已执行：根测试 350/353，3 项依赖过期 Analytics 授权失败；Browser 专项 23/23；全量 Vitest 53 测试通过但误收 Node suite；lint 8 errors/57 warnings；typecheck、docs links、plugin validation 通过。此为实现前基线，不是本次修改后验收。

## Owner 运行中调整（2026-09-16）

自定义网关 llm.dhcoder.net 需要公司网络，本次只保留 OpenAI-compatible 配置与切换能力，不要求真实验证；三平台和演练实际提取均使用 DeepSeek。此前连接失败保留为环境证据，不以 Fake 代替。

## 已完成的真实输入验证

- DeepSeek 已通过真实提取、结构和原文/引用一致性校验；Browser 结果记录实际调用时间、usage 和模型信息。兼容 provider 保留切换，Owner 已明确无需公司网络真实验证。
- GSC 首次请求因 invalid_grant/invalid_rapt 失败，刷新原有 ADC 后成功读取 718 行，规范化后 714 个候选；查询词语言为 unknown。最初默认 en-US 的导入已保留原始版本并迁移，未改写既有正式 Query。
- 三次 Playwright MCP 采集均成功，实际提交：2026-09-15T17:27:03.136Z、17:31:38.746Z、17:37:53.494Z，间隔均超过 120 秒。每个平台只提交一次。
- ChatGPT：2239 字符、10 个引用；Gemini：1268 字符、0 个引用；Perplexity：1790 字符、1 个引用；三条均通过真实 DeepSeek 提取。
- 证据目录为工作目录下 tmp/geo-e2e/real-captures，summary.json、browser-conditions.json、mcp-calls.jsonl、各平台 capture/extractions 可复核；非必要整页侧边栏/账号/console 诊断已清除。ChatGPT 临时聊天的记忆/自定义指令未另行关闭，故这些是工程采集，不能外推为自然正式 Baseline。

## 修复与回归范围

修复 Analytics CLI 时间性测试（隔离测试时钟，真实 expiry 行为不放宽）、Vitest 误收 Node suite、8 项 lint errors、NuxtHub 构建期 PGlite client 不退出、provider 切换复用旧提取、真实提取 provenance 时间、write preflight/锁内漂移复验、orphan 恢复。补齐 Source 维护非干扰、审核 exact-pin/延期/修改后重审、实际发布读回与健康页面复测。

- 根回归目前 365/365 通过。
- 五个真实模型语义对照场景 5/5 通过。
- 文档/插件校验、真实 MyyShop Workspace 校验通过；新版完整 Browser suite/build 和最终新工作区双周期回归结果见下。

## 最终回归场景调整

新工作区首轮已完整通过。第二轮原样继承完整页面时，模型只形成不可控第三方建议；没有已采用的可控发布对象。系统未生成虚假 Publication，但驱动器原先会空转到次数上限，现改为明确返回需要 Owner 调整。

该次运行保留在 `tmp/geo-e2e/history/no-controlled-adoption`。原始演练输入增加第二轮待完善 FAQ 页面（仅原始 HTML/资产信息，不含 Finding、采用或发布结论），由独立 Goal 选择后交给相同入口分析。重新在 `workspaces/myyshop-geo-e2e-verified` 验证完整两轮。

Perplexity 补充：同一份保留 DOM 包含 `data-pplx-citation-url`，无需重新提问即可补齐 4 个引用位置、3 个来源 URL；已再次真实调用 DeepSeek 提取并保留两个版本。折叠来源组未展开，因此不声称 URL 覆盖穷尽。


## 最终验收（2026-09-16）

最终交付工作区为 `workspaces/myyshop-geo-e2e-verified`。两轮均通过公开 Lifecycle CLI 生成下游工件，状态为 `completed` / `review_decided` / `full`；每轮 Baseline 60 槽、Retest 60 槽，共 240 槽。所有槽均有真实 DeepSeek 调用与原文校验证明，两个 Cycle 的 trace_ready 均为 true，待处理审核为空。Cycle 2 使用 Cycle 1 Review、独立 Goal Selection 与新 Goal 决定和冻结输入。

| 检查 | 实际结果 |
| --- | --- |
| 根 `npm test` | 365 passed，0 failed，0 skipped |
| Browser `pnpm exec vitest run` | 8 files、26 tests passed，真实模型执行 |
| 五项真实语义质量对照 | 5/5 |
| Browser `pnpm typecheck` | exit 0 |
| Browser `pnpm lint` | 0 errors，57 个既有 warnings |
| Browser `pnpm build` | 构建完成并正常 exit 0 |
| `npm run format:check` / `git diff --check` | 通过 |
| docs / plugin validation | 通过 |
| Workspace `--objects` / index `--check` | 通过，1273 个 canonical 对象，无错误或警告 |
| `validate-knowledge-journey.mjs` | 两轮矩阵、全部阶段、血缘、提取审计与附件校验通过 |

复核入口（2026-10-17 更新：常驻演练目录已按用户要求移出，历史路径与结果保留；恢复见[清理记录](2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)）：

- 完整周期报告历史路径：`workspaces/myyshop-geo-e2e-verified/reports/geo-cycle-overview.md`
- 结构化验收结果历史路径：`workspaces/myyshop-geo-e2e-verified/reports/engineering-acceptance.json`
- 根测试日志历史路径：`workspaces/myyshop-geo-e2e-verified/reports/validation/geo-all-tests-final.log`
- [真实采集接收摘要](../../workspaces/myyshop/runs/RUN-GEO-MCP-20260916/outputs/real-captures/summary.json)
- [Owner 操作手册](../runbooks/knowledge-driven-geo-operations.md)

真实采集目录已逐字节校验归档到 `workspaces/myyshop/runs/RUN-GEO-MCP-20260916/outputs/real-captures`，包含原文、DOM、MCP 调用、模型审计、checkpoint 与引用补充；原执行目录保留。阶段测试日志同时保存在最终演练工作区的 `reports/validation/`。早期开发演练与无可控发布对象的失败运行保留，未混入本次成功验收。

本次没有 Git commit/push、远端部署、真实 CMS 发布或飞书同步。OpenAI-compatible 真实连通验证按 Owner 公司网络说明免除；WorkBuddy 原生验收独立保留。两个完成周期的业务输入与反馈均为明确标记的模拟数据，不能作为真实品牌知识或效果证明。
