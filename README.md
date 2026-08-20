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

## 工作区

品牌工作区是项目事实中心，位于插件目录之外的任意路径。初始化：

```bash
node plugins/geo-expert/scripts/workspace-init.mjs --workspace ./workspaces/<brand> --brand <BrandName>
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace ./workspaces/<brand>
```

初始化幂等，已有文件默认不覆盖，`workspace.json` 中的 `workspace_id` 稳定不变。契约详见 `docs/specs/0002-workspace-contract.md`。仓库内 `workspaces/myyshop/` 是 MyyShop 品牌的真实工作区实例。

## 开发与验证

```bash
node --test                                              # 单元测试（node:test，零依赖）
node plugins/geo-expert/scripts/validate-plugin.mjs      # 插件包契约自检
```

要求 Node.js 20+。协作规则见 `AGENTS.md` 与 `docs/workflow.md`；文档导航见 `docs/README.md`。

## 边界

本仓库不做：云端 SaaS、MCP 服务、数据库、自动发布、自动审批、CRM 写入、社区运营、浏览器采集。未经当次明确授权，任何 Agent 不 commit、不 push、不创建 PR。
