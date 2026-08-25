---
title: M5 Consumer Answer Testing 与持续信源体系实施计划
status: proposed
created: 2026-08-24
updated: 2026-08-25
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md
  - "2026-08-25 当前用户指令：持续维护信源体系，不做冷启动导入；M5 完整设计 Playwright 与真实采集"
scope: M5 离线合同/Fixture/恢复/指标、持续 Source registry、Playwright base、逐平台真实 collector 与 Baseline/Retest
---

# M5 Consumer Answer Testing 与持续信源体系实施计划

## 1. 进入门结论与当前基线

独立 Review 的结论是：通过 M5 **规划门**，不通过 M5 **实现门**或**真实采集门**。本 Plan 因而只冻结实施顺序、合同、验证与授权边界，状态保持 `proposed`。

当前可继承事实：

- 评审 checkout：`/Users/sujingjun/.codex/worktrees/m2-m4-m5-review-20260824/geo-cowork`
- 基线：detached `0039abb922e533c725e178e8fc279c99dcbf393e`
- 本地主工作区：`/Users/sujingjun/geo-cowork` 的 `main` 指向同一 HEAD；评审开始时 clean
- 本地 `origin/main` 跟踪引用：`7de1e7b0cc475bd9ae967386598d09adaf2f4949`；未联网 fetch，不能声称远端当前状态
- M2/M3/M4 专项 25/10/27、全量 75、插件 60、文档 61/112、Workspace/Knowledge/Diagnosis/trace/index/legacy 门已在本次 Review 与 2026-08-25 设计修订后重跑通过
- M3 保留两条 Evidence warning；M4 保留 11 条独立支持 warning、7 条当前站点 Finding 和 3 条历史 detector Finding
- 没有 M4 Proposal/Adoption/Publication/Technical Retest，没有消费者平台 Sample

## 2. 目标与成功标准

### 2.1 目标

完整设计并分段实现 Spec 0006 的 M5 canonical 对象、不可变 raw/sample/review 边界、三次采样协议、由真实 Citation Observation 驱动的持续 Source registry、五项指标、comparability、长任务恢复、Playwright collector base、五个消费者平台 adapter、人工 fallback 与真实 Baseline/Retest。当前文档任务只冻结该设计与实施顺序；依赖、代码和真实运行仍分别过门。

### 2.2 当前计划成功标准

1. 六份 M5 SDD/Task 完整且状态均为 `proposed`；
2. P0-01、P0-03、P0-04、P0-05 的最小合同和验证门已在 Spec 0006 冻结；
3. P0-02 的逐平台授权/隐私矩阵成为真实运行硬门；
4. P0-06 的 Baseline 与 post-change Retest 前置关系明确；
5. 五层信源、Source identity/lifecycle、分析链和五项指标有确定性定义，且唯一候选发现入口为真实 Citation Observation；
6. Playwright base、五个平台 adapter、人工 fallback、真实 `collect` 入口与逐平台验收门设计完整；
7. 不安装 Playwright、不下载浏览器、不实现代码、不访问真实平台，不建立外部榜单导入路径。

## 3. 实施顺序

### Slice A — SDD 人工批准门

Owner 审阅 Requirement、PRD、Architecture、Spec 0006、Plan 和 Task。若对象边界、指标公式、revision 策略、隐私或 Playwright 门需要改变，先更新上游工件；未批准时不得开始代码。

验证：六份工件链接、状态、冲突和待决定项人工审查；批准决定使用独立 Record/decision ref。

### Slice B — M5 Schema、profile 与 index 注册

在获批后，先写红测再注册七类新对象及 refs/version refs/index，并为现有 Source 增加只对 M5 新对象生效的可选 profile。M5 profile validator 不能反向要求 M2–M4 历史 Source 或其他对象补字段。

重点验证：Profile fingerprint、new-ID revision、Query/Set/KR 精确版本、三 slot、outcome、artifact checksum、Source identity/ref、Source Classification 主/副标签、Review/Rubric pin、Aggregation 输入闭包。

### Slice C — 不可变 raw 与 Sample materialize

实现本地录制 Fixture → create-only raw artifacts → Answer Sample 的最小纵切。先不引入 Playwright；Fixture 使用 `.invalid` locator、本地答案文本、脱敏截图占位和显式 Citation。

重点验证：成功/拒答/超时/无结果/challenge/取消/system failure，raw/metadata 半成品、同字节恢复、不同字节冲突、隐私禁止字段和 artifact `unavailable`。

### Slice D — 长任务 Run、lease 与故障恢复

在 M2 Run 上实现 Spec 0006 的 sample slots、steps、lease/heartbeat/expiry、未知提交状态停门、取消和 supersede。所有测试只使用本地 Fake/recorded collector。

重点验证：每个 step 后故障注入、双进程竞争、stale lease、`query_submitted` 后中断、raw 已写/metadata 未写、输入漂移和重复恢复不重复外部动作。

### Slice E — Citation、持续 Source registry、五层分类与 Claim Support

实现 URL/domain 规范化、Citation occurrence 保存、sample+URL 聚合去重，以及 Citation 驱动的 Source 匹配/创建、候选 Classification 和 Claim Support Review。只有获授权真实 Run 的 Citation 可创建候选 Source；不实现综合榜、静态域名表或历史排名 import。

重点验证：IDN/default port/fragment/`www.`、无效 URL、同 URL 重复、同域不同 URL、Citation/Source 双向 ref 预分配、闭包校验与半成品恢复、domain/publisher/channel/page identity、host 不等于生产主体或类型、new/returning 派生、无观测候选拒绝、五层多标签+唯一主标签、first/third/unknown、低置信度与人工门。

### Slice F — Answer Review 与确定性聚合

实现 rubric checksum、同 raw 多 Review、分析链闭包和五项指标。构造手算 Fixture 覆盖每个分子、分母、排序、zero denominator、coverage、comparability 和跨窗 volatility。

重点验证：外部榜单导入显式失败；探索字段不进正式回归；Source/Classification 或 Review drift 阻止聚合；`unknown` 不成为 comparability 通配符。

### Slice G — Collector seam 与 no-network adapter

建立 `recorded_fixture` adapter 和平台 adapter 接口；验证 adapter 只输出 Sample/Citation raw 合同，不做 Source Classification/Claim Support/Review/聚合。no-network 测试必须证明离线全链不会调用真实 fetch/browser。

### Slice H — Playwright 依赖决策与 base collector（单独批准后）

本 Plan 与 Spec 0006 已冻结 base collector 的输入/输出、每 attempt 隔离 context、allowlist、版本化 selector/终态、artifact 最小化、禁止写入和失败语义。实施前另建依赖决定 Record，冻结 exact package/version、license、Node 支持、lockfile 影响、浏览器下载/缓存/清理、macOS/CI/宿主验收范围。package 写入与 browser binary 下载分别取得当次授权后，才允许实施。

当前 Plan 不选择或安装具体 Playwright 版本；这是为了遵守当前无网络/无安装授权，不能以未核验版本制造假冻结。进入本 Slice 前 exact version 必须被 Owner 批准并写入决定。

### Slice I — 平台 adapter 与人工 fallback（逐平台批准后）

ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews、Claude 分别建立 adapter Task，不共享授权。每个 adapter 按 Spec 0006 实现入口 allowlist、可支持 Profile 状态、selector/detector 版本、Citation 提取、artifact 范围、禁止动作和停止条件。每个平台先用获授权的测试账号/入口做最小 Smoke，再验证选择器失败、终态、截图/DOM 最小化和 manual fallback；一个平台受阻不改变其他平台结果。

### Slice J — 真实 Baseline（独立 Record）

只在对应平台授权、隐私策略、Profile、依赖和 adapter 验收通过后运行。每个平台 × Query 三个独立 Sample；失败原样保留。完成后建立真实 Baseline Record，不称为 post-change Retest。

### Slice K — post-change Retest（未来）

只有 M4 confirmed Publication 和对应 Technical Retest Run 存在时，才建立 `post_change_retest` plan。M5 只比较答案/Citation；业务观察仍交 M6。

## 4. 目标文件（未来实现范围）

### 4.1 Schema、Tool 与模板

- `plugins/geo-expert/schemas/m5-record-types.schema.json`
- `plugins/geo-expert/scripts/lib/answer-profile.mjs`
- `plugins/geo-expert/scripts/lib/answer-run.mjs`
- `plugins/geo-expert/scripts/lib/answer-sample.mjs`
- `plugins/geo-expert/scripts/lib/source-registry.mjs`
- `plugins/geo-expert/scripts/lib/citation-analysis.mjs`
- `plugins/geo-expert/scripts/lib/answer-review.mjs`
- `plugins/geo-expert/scripts/lib/answer-aggregation.mjs`
- `plugins/geo-expert/scripts/answer-cycle.mjs`
- `plugins/geo-expert/assets/object-templates/` 下七类 M5 模板
- `plugins/geo-expert/skills/geo-answer-cycle/SKILL.md`
- `plugins/geo-expert/skills/geo-answer/SKILL.md`
- `plugins/geo-expert/scripts/collectors/playwright-base.mjs`
- `plugins/geo-expert/scripts/collectors/platforms/` 下逐平台 adapter

只有 Slice H 获批后才增加 Playwright package 和 collector base；平台 adapters 在 Slice I 分别落文件。不得提前创建空壳 adapter 来暗示平台支持。

### 4.2 测试与 Fixture

- `tests/m5-schema-profile.test.mjs`
- `tests/m5-sample-artifacts.test.mjs`
- `tests/m5-run-recovery.test.mjs`
- `tests/m5-citation-classification.test.mjs`
- `tests/m5-review-aggregation.test.mjs`
- `tests/m5-cli.test.mjs`
- `tests/fixtures/m5-answer-testing/`（只含虚构品牌、`.invalid` 与脱敏录制数据）

## 5. 五层信源与指标冻结

实施不得改变 Spec 0006 的以下核心决定：

- 五层主类型：官方事实源、制度权威源、独立专业源、社区经验源、内容传播源；
- 多标签但唯一主标签，party relation 独立；
- 分析链：Query → Platform → Intent → Citation Domain → Source Identity → Source Type → Claim Supported；
- Citation raw occurrence 全保留，指标按 sample+normalized URL 去重；
- Source 候选只能由获授权真实 Citation Observation 创建；host 不等于发布者或 Source Type，`active` 不等于权威/已审核；
- 指标按 industry/platform/query cluster/time window 计算；
- Top Citation Domains、Citation Share、Source Diversity、First-party vs Third-party Ratio、Source Volatility 使用 Spec 公式；
- 外部榜单/静态域名表/历史排名不存在 import Schema、CLI、adapter 或候选生成路径。

任何公式变化必须先修改 Spec、补手算红测并重新批准，不能藏在实现常量里。

## 6. 授权与隐私矩阵

| 动作 | 当前状态 | 进入条件 |
| --- | --- | --- |
| 本次 M5 proposed 文档 commit 与本地合入 `main` | 已授权 | 仅本文档任务，不推导实现批准 |
| M5 Schema/Tool/Fixture 代码 | 未授权 | 六份 SDD 获批 + 明确离线实现授权 |
| 使用本地录制 Fixture | 未授权实现；设计允许 | 离线实现授权，且 Fixture 无真实账号/个人数据 |
| 增加 Playwright package | 未授权 | exact package/version 决定 + 当次安装授权 |
| 下载浏览器 binary | 未授权 | 独立下载/缓存/清理/容量决定 + 当次授权 |
| ChatGPT 消费者 UI | 未授权 | 单独平台 decision，明确全部 Spec 0006 隐私字段 |
| Gemini 消费者 UI | 未授权 | 同上，不能继承 ChatGPT 授权 |
| Perplexity 消费者 UI | 未授权 | 同上 |
| Google AI Mode/AI Overviews | 未授权 | 同上，入口与地区分别冻结 |
| Claude 消费者 UI | 未授权 | 同上 |
| 人工 fallback | 未授权 | 对应平台授权明确允许，并记录操作人/采集方式 |
| API 正式采样 | 禁止 | v1 正式体系不允许；仅可另建探索范围 |
| 截图/DOM/HTML 保留 | 未授权 | 每平台 artifact 类型、保留期、访问角色、删除责任获批 |
| 外部写入 | 禁止 | 不属于 M5 只读采样 |
| GA4/GSC | 未授权/不属于 M5 | M6 独立决定 |
| 后续代码 commit、push、PR、release、deploy | 未授权 | 各自需当次明确授权；本次不 push |

## 7. 测试策略

| 层级 | 内容 |
| --- | --- |
| Schema/profile | 七类型、refs/version/checksum、Profile/slot/Review/Aggregation 门 |
| 单元 | URL/domain、Source identity/lifecycle、五层分类约束、外部榜单导入禁止、指标公式、comparability |
| 集成 | Run/artifact/lease/recovery、index/trace、同 raw 多 Review |
| 故障 | 每 step 中断、stale lock、双进程、取消、半成品、input drift |
| 端到端离线 | `.invalid` 录制 Fixture 三 slot 全链；no network/no browser |
| 回归 | M2 25、M3 10、M4 27、全量、插件、Workspace/Knowledge/Diagnosis、trace/index/legacy/docs |
| Playwright 合同 | 隔离 context、allowlist、selector drift、终态、artifact 最小化、adapter 隔离和 manual comparability |
| 真实 Smoke | 仅逐平台授权后；不能写入离线 Record |

未来离线验收命令至少包含：

```bash
npm run test:m5-answer
npm run test:m2-contract
npm run test:m3-knowledge-query
npm run test:m4-diagnosis
npm test
npm run validate:plugin
npm run check:docs
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/knowledge-query.mjs trace --workspace workspaces/myyshop --query Q-MYYSHOP-WHAT-IS-001
node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/answer-cycle.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop
git diff --check
```

另需双构建 index、legacy 120 current/HEAD、raw/Review checksum、不联网断言和 Git 边界。

## 8. 监控、停止与恢复

本地 Tool 以稳定 diagnostics、Run state、sample outcome、lease 和 completed steps 暴露进度。遇到以下情况停止受影响 Slice：

- Spec 对象边界或公式存在两种会改变历史可比性的解释；
- 需要安装未批准依赖或下载浏览器；
- 需要账号、验证码、代理、cookie 或真实平台访问；
- 账号信息无法从截图/DOM 安全去除；
- 平台入口、地区、模型/模式或搜索状态不可控，却准备声称 `comparable:true`；
- 想用 API、摘要、单次回答或手工概述代替正式样本，或想用外部榜单创建 Source 候选；
- 想把 Baseline 误标为 post-change Retest，或把 M5 Observation 当 M6 效果；
- 需要修改 M2–M4 已批准语义但没有独立失败测试和 Task；
- 需要外部写入、Git 远端动作、发布或部署。

## 9. 发布与回滚

M5 离线工程不部署服务。新 canonical 对象和 raw create-only；indexes 可重建；错误输入通过 supersede/new ID 纠正，不删除历史。插件版本、release notes、三宿主安装和真实平台支持只在后续独立发布任务处理。

## 10. 当前出口

将六份 M5 `proposed` 工件、最终产品方案增补与本次 Record 提交并本地合入 `main`。合入后等待 Owner 对 M5 SDD 和离线实现给出独立批准；在此之前不执行 Slice B 及以后代码、安装或采集动作。
