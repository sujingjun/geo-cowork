# geo-cowork

本地优先的企业品牌 GEO（Generative Engine Optimization）专家插件与品牌工作区仓库。

## 产品定位

`geo-cowork` 让企业品牌在 Codex、Claude Code 两个已适配宿主中，用同一套 GEO Skills 和本地文件工作区，跑通品牌 GEO 闭环；中国区 WorkBuddy 官方专家契约已发布，本仓原生适配与验收另行安排：

```text
Query → Knowledge → Site → Reputation → Answers
→ Competitors → Strategy → Execution → Verification → Cycle
```

所有长期状态和业务交付物以本地 Markdown、JSONL、JSON、HTML 快照和截图为准；聊天记录、模型记忆和插件缓存不是事实来源。

与云端系统 [`weiyan2026/geo-agents`](https://github.com/weiyan2026/geo-agents) 的边界：两者当前无运行时依赖；云端负责未来的多租户、调度与生产集成，本地流程验证完成前不建立连接。详见 `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`。

## 安装

本仓库即 Codex 与 Claude Code 的本地插件 Marketplace（WorkBuddy 原生适配见下），插件为 `plugins/geo-expert`。

### Claude Code

```bash
claude plugin validate ./plugins/geo-expert
claude --plugin-dir ./plugins/geo-expert
```

会话中触发：`/geo-expert:geo-workspace-init`

### WorkBuddy（中国区，待单独适配与验收）

WorkBuddy 是腾讯云代码助手 CodeBuddy 旗下的 AI 任务执行型产品，其专家体系由「专家中心」（官方专家/专家团）与「我的专家」（自定义专家）构成，专家 = 人设 + 方法论 + 工具链。

WorkBuddy 官方已发布专家包、Agent、Skills 和 MCP 依赖合同。本仓目前尚未完成其原生包装、导入和交互验证。过渡期的使用方式：

- 在 WorkBuddy「我的专家」或「创建技能」中，以自然语言把 GEO 专家的人设与方法论指向本仓库的 `skills/*/SKILL.md` 与本地品牌工作区；
- 工作区文件（Markdown/JSONL/JSON）由 WorkBuddy 在授权下直接读写，与插件机制无关；
- 待官方发布开发者契约后，本仓将按 `docs/workflow.md` 新立 Spec 恢复仓库级适配。

官方文档：<https://open.workbuddy.cn/docs/expert>

### Codex

```bash
codex plugin marketplace add .
codex plugin add geo-expert
```

在支持插件的 Codex/ChatGPT 宿主中触发 `geo-workspace-init`。

Spec 0013 的 Browser MCP 是可选的同机能力。使用前先在 `plugins/geo-browser-extension` 启动绑定 `127.0.0.1:4319` 的 Browser Server，并在本地环境设置 `GEO_BROWSER_MCP_TOKEN`；插件 `.mcp.json` 只保存环境变量名，不保存 token 值。Browser Server 不由插件自动启动。

## 工作区

品牌工作区是项目事实中心，位于插件目录之外的任意路径。初始化：

```bash
node plugins/geo-expert/scripts/workspace-init.mjs --workspace ./workspaces/<brand> --brand <BrandName>
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace ./workspaces/<brand>
```

初始化幂等，已有文件默认不覆盖，`workspace.json` 中的 `workspace_id` 稳定不变。契约详见 `docs/specs/0002-workspace-contract.md`。当前 `workspaces/` 仅保留 MyyShop 真实工作区 `myyshop/`。确定性样例位于 `tests/fixtures/`，测试通过 helper 建立并清理临时工作区；历史演练目录已按[清理记录](docs/records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)移出。

OneGlanse 已有独立 MyyShop 工作区；双方通过 Skill/MCP 对接。首版封装 OneGlanse 现有能力，服务授权和 Tools 由 OneGlanse 维护，GEO 知识与分析由 cowork 维护，见[开发计划](docs/plans/2026-10-17-oneglanse-mcp-integration-plan.md)及[单 Query 联调记录](docs/records/2026-10-17-oneglanse-mcp-integration-record.md)。当前已验证 Gemini 的完整回传和 cowork 候选分析，当前仓库原生模型已配置凭据但调用连接失败，正式 Cycle 保持暂停。最新[整体试跑与能力缺口](docs/records/2026-10-17-myyshop-geo-full-flow-audit.md)明确其尚未形成正式业务闭环。

## 开发与验证

```bash
npm install --ignore-scripts                             # 安装锁定的本地运行依赖
npm test                                                 # 根 tests/*.test.mjs；Browser 子项目用各自命令
npm run test:m2-contract                                 # M2 专项测试
npm run test:m3-knowledge-query                          # M3 Knowledge/Query 专项测试
npm run test:m4-diagnosis                               # M4 Diagnosis/Site/Asset 专项测试
npm run test:m5-answer                                 # M5 Answer/Citation/Source/聚合专项测试
npm run test:m6-cycle                                 # M6 development-test KBASE Cycle/Analytics/恢复专项测试
npm run test:m7-strategy                             # M7 策略推理执行专项测试
npm run test:m8-conformance                         # M8 Cross-host Conformance 专项测试
npm run test:query-portfolio                          # Query Portfolio 流水线专项测试
npm run smoke:m5-playwright                            # 全局 Playwright + loopback base Smoke
npm run check:docs                                      # 仓库 Markdown 本地链接检查
npm run validate:plugin                                  # 插件包契约自检
node --test tests/browser-query-result.test.mjs tests/plugin-mcp-config.test.mjs
pnpm --dir plugins/geo-browser-extension test:browser-query
pnpm --dir plugins/geo-browser-extension test:extension
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/query-portfolio.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/answer-cycle.mjs validate --workspace workspaces/myyshop
node --test tests/lifecycle-readiness.test.mjs tests/m8-conformance.test.mjs
```

真实公开 HTTP snapshot 必须另有逐项授权并使用显式 plan；采集和 M4 输入桥接命令为：

```bash
npm run collect:m4-public -- --workspace <workspace> --plan <collection-plan.json>
npm run prepare:m4-public-inputs -- --workspace <workspace> --summary <workspace-relative-summary> --mapping <input-map.json>
```

要求 Node.js 20+。协作规则见 `AGENTS.md` 与 `docs/workflow.md`；文档导航见 `docs/README.md`。

真实 GA4/GSC Observation 在精确当次授权下使用 `geo-analytics-readonly.mjs collect-observe`；服务端业务文件只接受 Workspace 内的聚合 JSON/CSV，并使用 `geo-analytics.mjs ingest-business-file`。两条入口都固定非因果，Evidence 只创建 `candidate`。

## 边界

本仓库不做：云端 SaaS、通用/远端 MCP、自动发布、自动审批、CRM 写入、社区运营或无条款许可的消费者 UI 自动采集。当前 MCP 接入包括 Spec 0013 的同机 Browser Server 和 Spec 0014 的 Playwright MCP 工程采集；本地数据库、raw capture 和 acknowledgement 不构成 canonical M5 结论。既有五平台正式采样 adapter 保留 `manual_only`；本次明确授权的 ChatGPT、Gemini、Perplexity 单槽工程采集通过独立 Run 执行，不转为正式双槽 Baseline。M4 Site/Research 诊断读取显式 manifest/snapshot，演练页面仅在隔离本地环境发布和读回。登录状态本身不扩大采集范围。未经当次明确授权，任何 Agent 不 commit、不 push、不创建 PR。

## 知识驱动双周期（当前实现）

当前 [实施计划](docs/plans/2026-09-16-knowledge-driven-geo-e2e-plan.md) 与 [操作手册](docs/runbooks/knowledge-driven-geo-operations.md) 覆盖：真实 DeepSeek、可切换 OpenAI-compatible、人工/GSC/知识生成 Query、Playwright MCP 工程采集，以及可读审核包驱动的双周期。

```bash
npm run demo:geo-e2e -- --workspace <temporary-rehearsal-workspace>
```

这是显式 synthetic/test_only 原始输入与独立模拟反馈的演练，所有提取调用真实模型，执行前须有对应授权；临时路径不得指向 `workspaces/myyshop`。三平台真实采集和 GSC 输入另列工程证据，演练不代表真实发布或 GEO 效果。运行环境 Node >=22.14.0，配置使用根 `.env` 或显式 `GEO_ENV_FILE`。

## 本地知识库阅读

共用 [Docs 应用](workspaces/knowledge-preveiw-docs/README.md) 可展示选定 workspace 的知识库、中英文对照和引用材料：

```bash
npm run dev:knowledge -- --workspace ./workspaces/myyshop
```

首次使用先按应用说明安装依赖；默认仅本机访问，源文件保持只读。
