---
title: geo-cowork 本地 GEO 专家插件重新定基线方案
status: proposed
date: 2026-08-20
repository: https://github.com/sujingjun/geo-cowork
cloud_repository: https://github.com/weiyan2026/geo-agents
scope: local-first GEO expert plugin and local brand workspaces
---

# geo-cowork 本地 GEO 专家插件重新定基线方案

## 1. 决策

本项目正式采用双仓分工：

| 仓库 | 唯一责任 | 当前阶段 |
| --- | --- | --- |
| `sujingjun/geo-cowork` | 本地 GEO 专家插件、跨宿主兼容、品牌工作区、Markdown 交付物和真实业务验证 | 当前唯一开发主线 |
| `weiyan2026/geo-agents` | 云端控制面、持久化运行、调度、权限、监控、多人协作和生产集成 | 暂停新增主线，等待本地流程验证 |

两个仓库当前不建立运行时依赖，不使用 Git Submodule 作为产品依赖，不要求本地插件连接 `geo-agents` API，也不把 MCP 作为前置条件。

当前正式目标是：

> 在 Codex、Claude Code、CodeBuddy/WorkBuddy 中，以同一套 GEO Skills 和本地文件工作区，跑通品牌 GEO 从问题集合、知识库、站内外审计、舆情、生成式平台答案测试、竞品差距、优化提案、人工执行、发布复验到周期复盘的完整闭环。

长期状态和业务交付物以 Markdown、JSONL、JSON、HTML 快照和截图等本地文件为准。聊天记录、模型记忆和插件缓存不是项目事实来源。

## 2. 当前仓库基线

仓库已经具备：

1. `AGENTS.md` 和 `docs/workflow.md` 定义的 SDD 协作规则；
2. `docs/` 文档导航与 Wiki 入口；
3. `workspaces/myyshop/knowledge/` 的 MyyShop 品牌知识库；
4. 品牌身份、定位、用户生命周期、产品服务、商业规则、信任安全、权威证据、品牌语言和 Query 答案卡等目录；
5. Query、Knowledge Entry、Claim、Evidence、Scope、Canonical Page、Distribution Asset 和 Answer Test 等业务对象。

需要首先解决的冲突：

- 当前 `AGENTS.md` 仍把仓库描述为 SDD 控制面；
- 文档声称只有 `docs/` 是 tracked 内容；
- 实际仓库已经跟踪 `workspaces/`，`.gitignore` 也允许 `plugins/`；
- 插件产品、跨宿主清单、工作区初始化、校验和一致性测试尚未形成。

因此，第一个里程碑不是增加 GEO 功能，而是冻结仓库定位和插件包装标准。

## 3. 最终产品目标

`geo-cowork` 是面向企业品牌的本地优先 GEO 专家插件。

它负责：

```text
理解品牌
→ 建立真实问题集合
→ 检查知识与证据
→ 审计站点和分发资产
→ 收集站外观察和舆情
→ 测试生成式平台答案
→ 对比竞品和来源差距
→ 生成优化策略和内容提案
→ 辅助人类执行
→ 发布后复验
→ 形成下一 GEO 周期
```

它不是云端 SaaS、远程 MCP 服务、多 Agent 展示平台、自动发文工具、自动社区运营工具，也不是只输出 GEO 分数的审计脚本。

达到 `v1.0.0` 时必须满足：

- Codex、Claude Code、CodeBuddy/WorkBuddy 可安装同一仓库中的插件；
- 三个平台读取同一个品牌工作区；
- 相同输入产生语义一致的结构化交付物；
- 所有关键结论能追溯到 Query、知识、Evidence、网页、平台答案或外部观察；
- 模型输出不会自动升级为 Evidence；
- Agent 不会自动批准知识、发布内容、发社区帖子或写 CRM；
- 至少完成两个真实 MyyShop GEO 周期；
- 至少完成一次发布前基线、一次 Day 14 和一次 Day 30 复验；
- 另一个 Agent 无需原聊天记录即可从本地文件继续工作；
- 最终只向 `geo-agents` 输出经过真实验证的云端能力需求。

## 4. 与 geo-agents 的边界

### 4.1 geo-cowork 拥有

- Codex、Claude Code、CodeBuddy/WorkBuddy 插件清单；
- 共享 GEO Skills、References、Schemas、Templates 和确定性脚本；
- 工作区模板和文件契约；
- MyyShop 本地工作区；
- Query、知识、Evidence 索引；
- 站点快照、审计和候选变更；
- 舆情与外部观察；
- 生成式平台答案原始记录与 Review；
- 竞品差距、优化提案、执行记录和周期结果；
- 跨宿主兼容测试和本地插件发布记录。

### 4.2 geo-agents 将来拥有

- 多租户、云端身份和权限；
- 长任务、调度、数据库和对象存储；
- 生产级 Collector 和云端答案采集；
- 团队审批流、运行监控和告警；
- CMS、Analytics、CRM 等生产连接器；
- 大规模趋势计算和企业运营控制台。

### 4.3 唯一允许的交接

本地项目未来可向云端项目输出：

```text
Workspace Contract
Skill Contract
Finding Taxonomy
Collector Profile
Run Contract
Cycle Contract
真实业务验证记录
云端化需求清单
```

禁止本地 Skill 导入 `geo-agents` 源码包、强制启动云端服务、复制维护两套业务规则，或在本地流程验证前提前固化云端 API。

## 5. 三宿主插件规范

本仓采用“一个共享能力内核，三个官方宿主适配层”。

### 5.1 Codex

遵从 OpenAI 官方插件包装规范：

```text
plugins/geo-expert/.codex-plugin/plugin.json
plugins/geo-expert/skills/<skill-name>/SKILL.md
.agents/plugins/marketplace.json
```

本阶段不创建 `.app.json`、`.mcp.json` 或 MCP Server。Codex 验收采用仓库确定性校验、添加本地 Marketplace、在支持插件的 ChatGPT/Codex 宿主中实际安装并运行 Skill。不得虚构 `codex plugin validate` 命令。

### 5.2 Claude Code

遵从 Anthropic 官方插件规范：

```text
plugins/geo-expert/.claude-plugin/plugin.json
plugins/geo-expert/skills/<skill-name>/SKILL.md
.claude-plugin/marketplace.json
```

本地开发和验证使用：

```bash
claude plugin validate ./plugins/geo-expert
claude --plugin-dir ./plugins/geo-expert
```

Skill 使用 `/geo-expert:<skill-name>` 命名空间。只有 `plugin.json` 放在 `.claude-plugin/` 中，Skills、Scripts 和 Assets 位于插件根目录。

### 5.3 CodeBuddy/WorkBuddy

WorkBuddy 官方文档中的插件产品名称为 CodeBuddy Code。本仓显式提供：

```text
plugins/geo-expert/.codebuddy-plugin/plugin.json
plugins/geo-expert/skills/<skill-name>/SKILL.md
.codebuddy-plugin/marketplace.json
```

本地开发和验证使用：

```bash
codebuddy plugin validate ./plugins/geo-expert
codebuddy --plugin-dir ./plugins/geo-expert
```

本地市场通过 CodeBuddy 交互命令添加：

```text
/plugin marketplace add .
```

CodeBuddy 优先识别 `.codebuddy-plugin/`，同时兼容 `.workbuddy-plugin/` 和 `.claude-plugin/`。本项目仍显式维护 CodeBuddy Manifest，避免依赖隐式兼容。

### 5.4 单一事实来源

三个 Manifest 只保存宿主元数据，不保存 GEO 业务规则。权威关系固定为：

```text
skills/**/SKILL.md
+ skills/**/references/
+ scripts/
+ schemas/
+ assets/
= GEO 能力单一事实来源

.codex-plugin/plugin.json
.claude-plugin/plugin.json
.codebuddy-plugin/plugin.json
= 宿主适配层
```

不得分别维护 Query 分类、知识状态机、Finding 规则、GEO 评分、内容优化、审批门禁或输出格式。

## 6. 目标目录

```text
geo-cowork/
├── AGENTS.md
├── README.md
├── CHANGELOG.md
├── package.json
├── .agents/plugins/marketplace.json
├── .claude-plugin/marketplace.json
├── .codebuddy-plugin/marketplace.json
├── plugins/
│   └── geo-expert/
│       ├── .codex-plugin/plugin.json
│       ├── .claude-plugin/plugin.json
│       ├── .codebuddy-plugin/plugin.json
│       ├── README.md
│       ├── CHANGELOG.md
│       ├── skills/
│       ├── scripts/
│       ├── schemas/
│       └── assets/workspace-template/
├── docs/
├── tests/
└── workspaces/
    └── myyshop/
        ├── README.md
        ├── STATUS.md
        ├── workspace.json
        ├── brand/
        ├── queries/
        ├── knowledge/
        ├── site/
        ├── reputation/
        ├── answers/
        ├── competitors/
        ├── strategy/
        ├── execution/
        ├── runs/
        └── cycles/
```

不提交空目录。现有 `workspaces/myyshop/knowledge/` 原样继承，不做无价值批量改名。

## 7. 工作区原则

工作区是项目事实中心。每个品牌至少包含：

```text
README.md       当前品牌和范围
STATUS.md       最新阶段、阻塞和下一动作
workspace.json  稳定机器身份和 Schema 版本
queries/        问题候选、正式集合、聚类和覆盖
knowledge/      知识、Evidence、答案卡和冲突
site/           资产、快照、审计和候选变更
reputation/     外部观察、主题和事实错误
answers/        固定 Query Set、原始答案和人工 Review
competitors/    竞品、来源和内容差距
strategy/       诊断、优化、内容和实验计划
execution/      人工执行、发布和复验记录
runs/           每次 Agent 运行
cycles/         每个 GEO 运营周期
```

Agent 开工时读取仓级规则、工作区 README、STATUS、最近一次 Run、当前 Query Set 和 Knowledge Index；结束时更新 STATUS、本次 Run、相关业务工件和 Change Log。

插件安装缓存不是工作区。插件不得把企业知识、答案、截图、审批状态和运行历史写入安装目录，也不得通过 `../../workspaces` 引用开发仓库外部文件。所有脚本接受显式 `--workspace` 或从当前项目根定位工作区。

## 8. 共享 Skills

首批能力：

| Skill | 责任 |
| --- | --- |
| `geo-lifecycle` | 完整 GEO 周期入口和文件编排 |
| `geo-workspace-init` | 幂等初始化、检查和修复工作区结构 |
| `geo-query-portfolio` | Query 候选、正式集合、聚类、优先级和覆盖 |
| `geo-knowledge-audit` | Claim、Evidence、Owner、Scope、有效期和冲突检查 |
| `geo-site-audit` | 页面、Meta、Schema、canonical、sitemap、robots、crawler、渲染和定位一致性 |
| `geo-reputation-research` | Reddit、YouTube、媒体、评测、社交和合作伙伴等外部观察 |
| `geo-answer-test` | 固定 Query Set、多平台答案、引用、采集条件和人工 Review |
| `geo-competitor-gap` | Query、Answer、Source、Content、Positioning 和 Trust Gap |
| `geo-optimization-plan` | 把 Finding 转为可追溯候选改变和内容 Brief |
| `geo-cycle-review` | Baseline、Day 14、Day 30 和周期差异复盘 |

`geo-lifecycle` 只编排，不复制专项规则。

每个 `SKILL.md` 必须明确触发场景、输入、开工前必读文件、步骤、输出、可做事项、禁止事项、失败和停止条件、验收方式、示例及相关 References/Scripts。

共同 Frontmatter 使用三宿主均可理解的最小交集：

```yaml
---
name: geo-site-audit
description: 对品牌站点和分发资产执行可追溯的 GEO 审计，并输出本地 Markdown Findings 和候选修复。
---
```

## 9. 本地脚本和技术选型

首版采用 Node.js 20+、ESM `.mjs`、Node 内置 `node:test`、Markdown、JSON 和 JSONL，尽量零运行时依赖。

首批脚本：

```text
workspace-init.mjs
workspace-validate.mjs
validate-plugin.mjs
build-index.mjs
compare-runs.mjs
redact-check.mjs
conformance-report.mjs
```

所有脚本必须接受显式工作区路径、不依赖调用时当前目录、不引用插件根目录外文件、不写插件缓存、不读取未授权父目录、不泄漏 Token/Cookie/PII，且默认不覆盖已有文件。

本阶段不引入 NestJS、LangChain、LangGraph、PostgreSQL、Redis、Worker、Browser Farm、MCP 或云端 API。

## 10. 统一 Finding 与权限边界

所有专项 Skill 使用统一 Finding，至少包含：

```yaml
id: FIND-2026-0001
code: POSITIONING_LEGACY_RESIDUAL
severity: high
confidence: high
status: open
query_refs: [Q-001]
asset_refs: [SITE-ABOUT-001]
evidence_refs: [OBS-2026-003]
owner: Brand Owner
retest: post-release-day-14
```

正文包含结论、位置、复现、证据、业务影响、建议、不确定性、Owner、验收和复验规则。

Agent 可以创建 Query Candidate、外部观察、快照、Finding、原始答案、候选知识、候选变更、内容 Brief、优化计划、执行待办和复验报告。

Agent 不得把 Candidate Query 自动批准、把 Observation 升级为企业 Evidence、把 Draft Knowledge 自动批准、把草稿自动发布、把答案评估升级为业务验证、自动发社区内容、自动写 CRM 或自动同步云端。

## 11. 里程碑

| 里程碑 | 目标 | 主要结果 |
| --- | --- | --- |
| 0. 仓库重新定基线 | 修正仓库定位和两仓边界 | AGENTS、README、Requirement、PRD、Architecture、Spec、Plan、Task |
| 1. 三宿主插件骨架 | 三个平台识别同一个插件 | 三 Manifest、三 Marketplace、`geo-workspace-init`、模板和校验 |
| 2. Query 与知识 | 跑通 GEO 第 1、2 步 | Query Portfolio、Knowledge Audit、Evidence Gap |
| 3. 站点与舆情 | 跑通站内外诊断 | Asset Snapshot、Site Finding、External Observation |
| 4. 答案与竞品 | 建立真实平台基线 | Sample Matrix、Raw Answer、Review、Competitor Gap |
| 5. 策略与内容提案 | 把诊断转成候选行动 | GEO Diagnosis、Content Brief、Candidate Change |
| 6. 人工执行与复验 | 跑通发布前后闭环 | Baseline、Day 14、Day 30 |
| 7. 完整 GEO 周期 | 连续完成两个真实周期 | Cycle、趋势、成功与失败经验 |
| 8. 三宿主一致性与 v1.0 | 稳定发布本地插件 | Conformance、Security Review、v1.0 Release、云端需求导出 |

当前只授权后续 Agent 实施里程碑 0 和里程碑 1，完成后停止。

## 12. 里程碑 0、1 初始化动作

1. 核验 `main`、HEAD 和工作树；
2. 阅读 `AGENTS.md`、`docs/workflow.md`、本文和 MyyShop 知识库 README；
3. 建立仓库定位冲突 Record；
4. 新建本地 GEO 专家的 Requirement、PRD、Architecture、Plugin Contract Spec 和 Workspace Contract Spec；
5. 新建里程碑 0、1 的 Plan 和 Task；
6. 修正 `AGENTS.md`、根 README 和文档导航；
7. 创建三个 Manifest 和三个 Marketplace；
8. 创建共享 `geo-workspace-init` Skill；
9. 创建工作区模板、初始化脚本、校验脚本、Fixture 和测试；
10. 完成 Codex、Claude Code、CodeBuddy 的真实 Smoke Test；
11. 写 Acceptance Record 和下一 Handoff；
12. 停止，不自动进入里程碑 2。

## 13. 首批验证

```bash
git status --short
git branch --show-current
node --test
node plugins/geo-expert/scripts/validate-plugin.mjs
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace tests/fixtures/workspace-valid
```

Claude Code：

```bash
claude plugin validate ./plugins/geo-expert
claude --plugin-dir ./plugins/geo-expert
```

CodeBuddy/WorkBuddy：

```bash
codebuddy plugin validate ./plugins/geo-expert
codebuddy --plugin-dir ./plugins/geo-expert
```

CodeBuddy 本地市场在交互会话中使用：

```text
/plugin marketplace add .
```

Codex：

```bash
codex plugin marketplace add .
```

Codex 最终验收必须包含真实市场添加、插件安装、Skill 触发和 Fixture 文件检查。

## 14. 红线

1. 不把 `geo-cowork` 合回 `geo-agents`。
2. 不让本地插件依赖云端 API。
3. 当前阶段不以 MCP 作为必需能力。
4. 不为三个宿主复制三套 Skill。
5. 不把 Manifest 当业务规则位置。
6. 不把真实工作区写入插件安装缓存。
7. 不引用插件根目录外的资源。
8. 不自动批准知识、发布内容或写 CRM。
9. 不自动发 Reddit、媒体、评测或社交内容。
10. 不把外部观察或模型输出升级为企业 Evidence。
11. 不把一次答案测试表述为长期排名。
12. 不隐藏失败、Unknown、拒绝或超时。
13. 不批量重写现有知识条目。
14. 未获当次明确授权，不 commit、push 或创建 PR。
15. 不在本地业务闭环完成前启动云端新里程碑。

## 15. 云端交接条件

`geo-cowork v1.0.0` 完成后，只向 `geo-agents` 输出：

```text
workspace-contract-v1
query-contract-v1
knowledge-contract-v1
finding-taxonomy-v1
answer-sample-contract-v1
collector-profile-v1
run-contract-v1
cycle-contract-v1
two-real-cycle-records
cloud-readiness-assessment
```

由 `geo-agents` 独立决定哪些对象进入数据库、哪些脚本升级为服务、哪些 Collector 需要云端调度以及哪些权限需要企业控制面。本地项目不预先替云端做这些决定。

## 16. 官方规范

- Codex Plugin Packaging: https://developers.openai.com/plugins/build/plugins
- Claude Code Plugins: https://code.claude.com/docs/en/plugins
- Claude Code Plugin Marketplaces: https://code.claude.com/docs/en/plugin-marketplaces
- CodeBuddy/WorkBuddy 创建插件: https://www.workbuddy.ai/docs/zh/cli/plugins
- CodeBuddy/WorkBuddy 插件参考: https://www.workbuddy.ai/docs/zh/cli/plugins-reference
- CodeBuddy/WorkBuddy 插件市场: https://www.workbuddy.ai/docs/zh/cli/plugin-marketplaces

## 17. 决策摘要

本项目当前最重要的不是增加更多 Agent，而是建立：

```text
一个独立仓库
一个本地文件事实中心
一套共享 GEO Skills
三个官方插件适配层
一个真实 MyyShop 试点
两个完整 GEO 周期
一套可复验的本地业务闭环
```

只有这条链路被真实验证后，云端 `geo-agents` 才有足够依据继续建设。
