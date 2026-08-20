# geo-cowork

本地优先的企业品牌 GEO（Generative Engine Optimization）专家插件与品牌工作区仓库。

## 产品定位

`geo-cowork` 让企业品牌在 Codex、Claude Code、CodeBuddy/WorkBuddy 三个宿主中，用同一套 GEO Skills 和本地文件工作区，跑通品牌 GEO 闭环：

```text
Query → Knowledge → Site → Reputation → Answers
→ Competitors → Strategy → Execution → Verification → Cycle
```

所有长期状态和业务交付物以本地 Markdown、JSONL、JSON、HTML 快照和截图为准；聊天记录、模型记忆和插件缓存不是事实来源。

与云端系统 [`weiyan2026/geo-agents`](https://github.com/weiyan2026/geo-agents) 的边界：两者当前无运行时依赖；云端负责未来的多租户、调度与生产集成，本地流程验证完成前不建立连接。详见 `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`。

## 安装

本仓库即三个宿主的本地插件 Marketplace，插件为 `plugins/geo-expert`。

### Claude Code

```bash
claude plugin validate ./plugins/geo-expert
claude --plugin-dir ./plugins/geo-expert
```

会话中触发：`/geo-expert:geo-workspace-init`

### CodeBuddy / WorkBuddy

```bash
codebuddy plugin validate ./plugins/geo-expert
codebuddy --plugin-dir ./plugins/geo-expert
```

会话中添加本地市场：`/plugin marketplace add .`，随后 `/geo-expert:geo-workspace-init`。

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
