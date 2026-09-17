# 知识驱动 GEO 操作手册

- 状态：implemented
- 更新：2026-09-16
- 来源：[Plan](../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md)、[Spec](../specs/0014-knowledge-driven-geo-e2e.md)
- 范围：当前仓库的隔离演练、真实模型、Query 输入和三平台工程采集。

## 环境

使用 Node >=22.14.0，根目录执行 `npm ci`。Browser 子项目按自身 pnpm lock 安装。根 `.env` 保存 DEEPSEEK_API_KEY/BASE_URL/MODEL 和 OPENAI_API_KEY/BASE_URL/MODEL；不要将值写入工件。`GEO_ENV_FILE` 可显式指定配置文件，已有进程变量优先。

默认 DeepSeek；`--provider openai-compatible --model <完整模型名>` 可切换。公司网关当前不要求真实验证。提取不使用 Fake；DeepSeek 字段提取使用官方 non-thinking 模式，语义任务使用 low thinking，并记录实际请求选项和用量。[DeepSeek 模式说明](https://api-docs.deepseek.com/guides/thinking_mode/)

`npm run dev:browser-query` 是 checkout 开发启动入口，向 Browser Server 传递根环境。不得将业务工作区放进插件缓存。

## Owner 日常入口

```bash
node plugins/geo-expert/scripts/geo-lifecycle.mjs start --workspace workspaces/myyshop-geo-e2e
node plugins/geo-expert/scripts/geo-lifecycle.mjs inbox --workspace workspaces/myyshop-geo-e2e
node plugins/geo-expert/scripts/geo-lifecycle.mjs apply-feedback --workspace workspaces/myyshop-geo-e2e --file <feedback.md>
node plugins/geo-expert/scripts/geo-lifecycle.mjs continue --workspace workspaces/myyshop-geo-e2e
node plugins/geo-expert/scripts/geo-lifecycle.mjs report --workspace workspaces/myyshop-geo-e2e
```

`start` 默认使用九类模拟原始知识、页面和业务输入。Agent 可以通过 `--input` 转入同合同的业务输入；Owner 维护的演练 Markdown 可通过 `--input-dir <knowledge-directory> --goal-text <goal>` 导入新隔离工作区，原文及 hash 保留。Owner 阅读 Markdown 审核包并给出决定，Agent 原样保存反馈并调用工具；包 ID/hash 由工具提供，不由 Owner 拼写。反馈使用“包、校验、决定、决定人、时间、说明”字段；修改建议另外提供“对象”（资产网址）与“修改内容”。修改产生新 Proposal 和新审核包，不自动采用。

`report` 输出 `reports/geo-cycle-overview.md` 和知识变更影响报告。原始知识变化不静默替换活跃周期已冻结内容。活动 writer 返回 WORKSPACE_BUSY；已证明退出的进程锁可在下一次命令自动恢复，不能强抢活跃进程。

## 自动演练

```bash
npm run demo:geo-e2e -- --workspace workspaces/myyshop-geo-e2e-verified
```

驱动器只调用公开生命周期入口，并在审核包生成后读取独立 fixture 反馈。它不注入 Findings、Publication、Review 或 gate fixture。所有模拟反馈标注 fixture human/test_only，不能用于真实工作区或冒充真实业务批准。

## Query 与真实采集

```bash
npm run query:portfolio -- import --workspace <workspace> --goal <goal-id> --file <queries.csv>
npm run query:portfolio -- collect-gsc --workspace workspaces/myyshop --goal GOAL-MYYSHOP-DEFINITION-001
npm run query:portfolio -- generate --workspace <workspace> --goal <goal-id> --knowledge <relative-paths> --clues <optional-input.json>
npm run collect:playwright -- collect-playwright --platform chatgpt --output <run-dir>
npm run collect:playwright -- resume-collection --platform chatgpt --output <run-dir>
```

GSC 保留 PT 日期、分页、原始指标和 API 覆盖限制，未提供语言时为 unknown。`invalid_grant/invalid_rapt` 表示 Google 需要重新认证，不能把它记录为零数据。

Playwright MCP 固定 0.0.81，Chrome 使用官方 Playwright Extension。当前工程 Run 为三个指定平台各一次，至少间隔 120 秒。提交未知时不重新发送，采集已落盘后只恢复提取。已完成 Run 的 resume 不重复调用模型或平台。各平台实际条件、原文、引用、hash 和调用记录单独保存；不伪装为正式 Baseline。

## 验证与恢复

根测试、Browser 专项、typecheck、lint、build、docs/plugin/workspace 校验分别记录。build 必须自行 exit 0；本地 PGlite migration 在 dev 启动执行，打包不打开本地数据库。失败保留原始输入和诊断，再从首个未完成工件继续。

业务工件、原始证明、模型分析与决定按快照保存。重复 basename 的附件使用来源路径 hash 区分；Source queue/classification 维护不改变业务冻结输入。scope、归属、版本和内容变化仍须被拒绝。
