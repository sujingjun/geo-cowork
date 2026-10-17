# geo-expert

本地优先的企业品牌 GEO（Generative Engine Optimization）专家插件，为 Codex 与 Claude Code 提供插件包装；中国区 WorkBuddy 宿主待官方发布专家/技能开发者契约后再行适配（见仓库根 `README.md`）。

## 能力

| Skill | 责任 |
| --- | --- |
| `geo-workspace-init` | 幂等初始化、检查品牌工作区结构（里程碑 1） |
| `geo-query` | Query 与 Query Set 候选准备（M3 本地工程已验收） |
| `geo-knowledge` | Claim、Answer Card 与 Knowledge Release 候选准备（M3 本地工程已验收） |
| `geo-evidence` | Source、Evidence、Evidence Plan 与 legacy import（M3 本地工程已验收） |
| `geo-knowledge-cycle` | M3 编排、关系 trace 与人工生命周期门禁（M3 本地工程已验收） |
| `geo-diagnosis-cycle` | M4 诊断编排、阶段 gate 与 Run 交接 |
| `geo-site` | 本地 snapshot 的九项确定性站点检查与 Technical Retest |
| `geo-reputation` | 声誉研究输入、原文/阻断、独立支持、反证与置信度 |
| `geo-competitor` | 竞品研究输入与 Product Gap 人工前置 |
| `geo-content` | 单 Asset 完整 Proposal、multi-goal 合并与风险段落 |
| `geo-answer-cycle` | M5 Profile、两次独立样本、Citation-driven Source 归档、100 Source 批量分类、Review 与聚合编排 |
| `geo-answer` | Citation/Source 分类、Claim 支撑、答案 rubric 与五项指标复核 |
| `geo-lifecycle` | M6 测试商户、Cycle 冻结/阶段门、恢复、Review 与 trace |
| `geo-analytics` | M6 fixture Observation、Business Signal 与 candidate Evidence 分离 |

真实 GA4/GSC 读取不放入上述 fixture Skill。经精确 Workspace 授权后，使用独立 `geo-analytics-readonly.mjs` CLI 做固定资源、固定字段、临时产物的最小只读读取；它不创建真实 Observation、Evidence、Claim 或因果结论。

当前产品与里程碑基线见 `docs/plans/2026-08-23-geo-cowork-final-product-plan.md`。0.3.0 是当前已登记插件版本；其后的 M4—M8 与 Spec 0013 Browser MCP 源码仍属于本地未发布实现。M5 已验证 `.invalid` 两槽 Fixture、不可变 raw/Review、持续 Source registry、100 Source 批量分类门、恢复、确定性聚合和 loopback Browser Task/MCP；五个真实平台 adapter 继续为 `manual_only`。Owner 提供的 exact result URL 已完成五个平台两个正式英文 manual slot，但 10 个 Answer Review、100 Source 分类与 post-change Retest 仍各有独立门。M6 当前只实现 synthetic/test_only 开发知识库的本地 Cycle/Analytics 工程，不代表真实 MyyShop Publication、Analytics 或业务效果。M3 内部 `published` 也不表示任何外部内容、插件版本或生产环境已经发布。

## 结构

```text
.mcp.json                    Codex Browser MCP Server 连接配置（不含 token）
.codex-plugin/plugin.json     Codex Manifest
.claude-plugin/plugin.json    Claude Code Manifest
skills/                       共享 GEO Skills（已适配宿主的单一事实来源）
schemas/                      Markdown Object JSON Schema
scripts/                      确定性脚本（Node 20+；依赖见仓库根 package-lock.json）
assets/object-templates/      M2—M6 对象模板
assets/workspace-template/    工作区模板
```

## Browser MCP

Spec 0013 允许本插件通过 `.mcp.json` 注册单一 `geo-browser` Streamable HTTP Server：`http://127.0.0.1:4319/mcp`。插件不负责启动 Server；先在 `plugins/geo-browser-extension` 启动 Browser Server，并把同一个本地高熵值设置为 `GEO_BROWSER_MCP_TOKEN`。不得把 token 写入仓库。

Browser MCP 只暴露：CQI 注册/读取、Browser Task 摘要、pending result 列表/读取、raw artifact 分块读取与 acknowledgement。Browser Task 逐步状态只能由 Extension 产品 API 推进。Cowork 收到结果后可用 `browser-query-result.mjs verify` 校验本地 intake，再进入 M5 materialization；ack 不代表业务批准。

## 安装与验证

见仓库根 `README.md`。插件包契约见 `docs/specs/0001-plugin-package-contract.md`，工作区契约见 `docs/specs/0002-workspace-contract.md`。

```bash
npm install --ignore-scripts
npm run test:m2-contract
npm run test:m3-knowledge-query
npm run test:m4-diagnosis
npm run test:m5-answer
npm run test:m6-cycle
npm run test:analytics-readonly
node --test tests/browser-query-result.test.mjs tests/plugin-mcp-config.test.mjs
npm run smoke:m5-playwright
npm run check:docs
npm run validate:plugin
node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/answer-cycle.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/geo-lifecycle.mjs validate --workspace <test-workspace>
node plugins/geo-expert/scripts/geo-lifecycle.mjs trace --workspace <test-workspace> --cycle <CYC-ID>
npm run analytics:readonly -- dry-run --workspace workspaces/myyshop --plan <approved-plan.json>
node plugins/geo-expert/scripts/browser-query-result.mjs verify --workspace <workspace> --manifest <workspace-relative-manifest.json>
```

## 边界

- 工作区位于插件目录之外；插件不向安装目录或宿主缓存写业务文件；
- 除 Spec 0013 明确允许的同机 Browser MCP 外，不提供云端 MCP/SaaS；不自动批准知识、不自动发布、不写 CRM、不连接云端 geo-agents；
- M2—M4 工程验收与真实执行证据分别建档；MyyShop 业务批准由 Owner 的独立决定记录证明。公开 collector 不自动发现 URL、不登录、不携带 cookie，并与只读 Site/Research manifest 分离；Proposal、Adoption、Publication 与 Technical Retest 也不互相等同。安装缓存依赖、账号/Analytics/消费者平台采集、跨宿主复验、外部发布与部署仍不在本次验收范围。

## 可选 OneGlanse MCP

OneGlanse 的 Server、授权、Tools 和原生 Agent 由其项目运行；本插件通过公开 stdio 合同调用，不导入对方源码。参见 [geo-answer-cycle 对接说明](skills/geo-answer-cycle/references/oneglanse.md)，使用 `scripts/oneglanse.mjs` 保存 Query 映射、运行、查状态、完整接收和离线候选分析。

连接配置保存在用户本地，默认 `.mcp.json` 不新增必需 Server。业务返回值保存在显式工作区 `runs/<run>/oneglanse-intake/`；Source 列表不替代原始引用 occurrence，工程结果不自动成为正式 Baseline。
