# geo-cowork

本地优先的企业品牌 GEO（Generative Engine Optimization）专家插件与品牌工作区仓库。

## 产品定位

`geo-cowork` 让企业品牌在 Codex、Claude Code 两个已适配宿主中，用同一套 GEO Skills 和本地文件工作区，跑通品牌 GEO 闭环；中国区 WorkBuddy 宿主待其官方发布专家/技能开发者契约后再行适配：

```text
Query → Knowledge → Site → Reputation → Answers
→ Competitors → Strategy → Execution → Verification → Cycle
```

所有长期状态和业务交付物以本地 Markdown、JSONL、JSON、HTML 快照和截图为准；聊天记录、模型记忆和插件缓存不是事实来源。

与云端系统 [`weiyan2026/geo-agents`](https://github.com/weiyan2026/geo-agents) 的边界：两者当前无运行时依赖；云端负责未来的多租户、调度与生产集成，本地流程验证完成前不建立连接。详见 `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`。

## 安装

本仓库即 Codex 与 Claude Code 的本地插件 Marketplace（WorkBuddy 待官方开发者契约，见下），插件为 `plugins/geo-expert`。

### Claude Code

```bash
claude plugin validate ./plugins/geo-expert
claude --plugin-dir ./plugins/geo-expert
```

会话中触发：`/geo-expert:geo-workspace-init`

### WorkBuddy（中国区，待适配）

WorkBuddy 是腾讯云代码助手 CodeBuddy 旗下的 AI 任务执行型产品，其专家体系由「专家中心」（官方专家/专家团）与「我的专家」（自定义专家）构成，专家 = 人设 + 方法论 + 工具链。

截至 2026-08-20，WorkBuddy 中国区官方文档未发布开发者契约（无插件/专家的 manifest、文件格式、导入协议或 CLI 验证命令），因此本仓库**不提供 WorkBuddy 插件包装**。过渡期的使用方式：

- 在 WorkBuddy「我的专家」或「创建技能」中，以自然语言把 GEO 专家的人设与方法论指向本仓库的 `skills/*/SKILL.md` 与本地品牌工作区；
- 工作区文件（Markdown/JSONL/JSON）由 WorkBuddy 在授权下直接读写，与插件机制无关；
- 待官方发布开发者契约后，本仓将按 `docs/workflow.md` 新立 Spec 恢复仓库级适配。

官方文档：<https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Expert-Center>

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

初始化幂等，已有文件默认不覆盖，`workspace.json` 中的 `workspace_id` 稳定不变。契约详见 `docs/specs/0002-workspace-contract.md`。仓库内 `workspaces/myyshop/` 是 MyyShop 真实工作区；`workspaces/myyshop-development-test/` 是同一线上 Merchant 在 0→1 开发期使用的隔离 `test_only` 品牌知识库，不是第二商户，也不得自动转正。

## 开发与验证

```bash
npm install --ignore-scripts                             # 安装锁定的本地运行依赖
npm test                                                 # 全量 node:test
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
node plugins/geo-expert/scripts/geo-lifecycle.mjs validate --workspace workspaces/myyshop-development-test
node plugins/geo-expert/scripts/geo-readiness.mjs report --workspace workspaces/myyshop-development-test --knowledge-base KBASE-MYYSHOP-DEVTEST-001 --goal GOAL-M6-TEST-001
node plugins/geo-expert/scripts/geo-conformance.mjs run --workspace workspaces/myyshop-development-test --profile workspaces/myyshop-development-test/execution/conformance/profile.json
```

真实公开 HTTP snapshot 必须另有逐项授权并使用显式 plan；采集和 M4 输入桥接命令为：

```bash
npm run collect:m4-public -- --workspace <workspace> --plan <collection-plan.json>
npm run prepare:m4-public-inputs -- --workspace <workspace> --summary <workspace-relative-summary> --mapping <input-map.json>
```

要求 Node.js 20+。协作规则见 `AGENTS.md` 与 `docs/workflow.md`；文档导航见 `docs/README.md`。

真实 GA4/GSC Observation 在精确当次授权下使用 `geo-analytics-readonly.mjs collect-observe`；服务端业务文件只接受 Workspace 内的聚合 JSON/CSV，并使用 `geo-analytics.mjs ingest-business-file`。两条入口都固定非因果，Evidence 只创建 `candidate`。

## 边界

本仓库不做：云端 SaaS、通用/远端 MCP、自动发布、自动审批、CRM 写入、社区运营或无条款许可的消费者 UI 自动采集。唯一 MCP 例外是 Spec 0013 批准的同机 Browser Server，用于冻结 Cycle 输入与可靠交付浏览器结果；其本地数据库、raw capture 和 acknowledgement 不构成 canonical M5 结论。M4 Site/Research 诊断仍只读取显式本地 manifest/snapshot；五个平台 adapter 统一为 `manual_only`，登录状态不能解除自动化门。Owner 可提供 exact result URL 进入受限 manual Sample；这不授权 Agent 自动提交真实平台 Query、读取账号存储或扩大浏览范围。未经当次明确授权，任何 Agent 不 commit、不 push、不创建 PR。
