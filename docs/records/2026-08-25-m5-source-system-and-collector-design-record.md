---
title: M5 持续信源与 Playwright/真实采集设计修订记录
status: verified
created: 2026-08-25
working_directory: /Users/sujingjun/.codex/worktrees/m2-m4-m5-review-20260824/geo-cowork
baseline: detached HEAD @ 0039abb922e533c725e178e8fc279c99dcbf393e
target_branch: main
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md
  - docs/requirements/2026-08-24-m5-consumer-answer-testing.md
  - docs/prd/2026-08-24-m5-consumer-answer-testing.md
  - docs/architecture/2026-08-24-consumer-answer-testing-architecture.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
  - "2026-08-25 Owner 指令：持续维护信源体系，不需要冷启动导入"
  - "2026-08-25 Owner 指令：按最终产品方案，M5 需要设计 Playwright 和真实采集"
  - "2026-08-25 Owner 授权：提交 M5 里程碑文档并本地合入 main"
scope: M5 持续 Source registry、五层信源、Playwright base、逐平台真实 collector、验证与 Git 边界
---

# M5 持续信源与 Playwright/真实采集设计修订记录

## 1. 结论

本轮将 M5 收口为两条必须同时成立的产品主线：

1. 以真实消费者平台 Citation Observation 持续发现、匹配、分类和复核 Source；
2. 完整设计 Playwright collector base、ChatGPT/Gemini/Perplexity/Google AI Mode/AI Overviews/Claude 逐平台 adapter、人工 fallback 和真实 Baseline/Retest。

M5 不建立外部综合榜、静态域名表或历史排名的冷启动 import Schema、CLI、adapter、materializer 或候选生成路径。本轮只修订、验证和提交文档；未实现 M5 代码，未增加 Playwright package，未下载浏览器，未访问任何消费者平台，未 push、release 或 deploy。

## 2. 冻结的产品合同

| 领域 | 本轮冻结内容 | 当前状态 |
| --- | --- | --- |
| Source 发现 | 唯一入口是当前 Workspace 内获授权真实 Run 的 Citation Observation | proposed 设计，未实现 |
| Source identity | 复用 M2 `source`/`SRC-`；区分 domain/publisher/channel/page，host 不等于生产主体或类型 | proposed 设计，未实现 |
| 五层角色 | 官方事实源、制度权威源、独立专业源、社区经验源、内容传播源；party relation 独立 | proposed 设计，未人工分类真实 Source |
| 分析链 | Query → Platform → Intent → Citation Domain → Source Identity → Source Type → Claim Supported | proposed 设计，未产生 M5 对象 |
| 信源指标 | 按行业、平台、Query Cluster、时间窗计算 Top Citation Domains、Citation Share、Source Diversity、First-party vs Third-party Ratio、Source Volatility | proposed 公式，未实现 |
| Playwright base | 每 attempt 隔离 context、allowlist、Profile 校验、版本化 selector/终态、答案/Citation 区域最小化、checksum、显式失败与关闭 | proposed 设计，未安装/实现 |
| 平台 adapter | 五个平台独立 allowlist、Profile 支持、selector/detector、Citation 提取、artifact、禁止动作、停止条件和 Smoke | proposed 设计，逐平台未授权 |
| 真实入口 | `answer-cycle.mjs collect --platform <platform>` 只接受已注册 adapter，不接受通用 URL | proposed 设计，当前不可执行 |
| 外部榜单 | 无 import 对象/命令/路径；不得进入 registry、分类、聚合或指标 | 明确禁止 |

## 3. 文档变更

- 对已批准最终产品方案增补 2026-08-25 Owner 决定，不改变 M2–M4 已有边界。
- 同步修订 M5 Requirement、PRD、Architecture、Spec 0006、Plan 与 Task；六份文档仍保持 `proposed`，因为文档提交/合并授权不等于后续实现批准。
- 更新 M2–M4 独立 Review 的 P0-01/P0-05 和信源合同评审结论，保留其原始工程验证与 Git 边界记录。
- 更新 `docs/README.md`、Wiki 导航和 MyyShop `STATUS.md`。

## 4. 验证记录

所有命令均在 `working_directory` 指定的隔离工作树执行，未调用真实网络采集、浏览器或消费者平台。

| 命令/检查 | 结果 |
| --- | --- |
| `npm run test:m2-contract` | 25/25 通过 |
| `npm run test:m3-knowledge-query` | 10/10 通过 |
| `npm run test:m4-diagnosis` | 27/27 通过 |
| `npm test` | 75/75 通过，71 个顶层 subtest，0 fail/skip/cancel |
| `npm run validate:plugin` | `ok:true`，60 个检查路径 |
| `npm run check:docs` | 61 个 Markdown、112 个本地链接、0 errors |
| `workspace-validate.mjs --workspace workspaces/myyshop --objects` | `ok:true`，missing/errors/object_errors/warnings 均为空 |
| `knowledge-query.mjs validate` | errors 为空；仅 2 条既有 `EVIDENCE_INSUFFICIENT` |
| `knowledge-query.mjs trace --query Q-MYYSHOP-WHAT-IS-001` | `lifecycle_ready:true`，`gates:[]` |
| `diagnosis.mjs validate` | errors 为空；仅 11 条既有 `INDEPENDENT_SUPPORT_MISSING` |
| `build-index.mjs` 连续两次 | 每次 69 canonical、120 legacy、18 indexes、0 warnings；前/第一次/第二次 index 聚合 hash 均为 `d2cdbc7c03904a6aaa6233a4b5bd750e3684add28b55fa0bf69796aaea036948` |
| Workspace Markdown 前后聚合 | 均为 `a981b9fa4aec3b79fba6dba6720ca0e8ed36dc36a5210aa2b389fb55fb002a5b`；index 双构建未改 canonical Markdown |
| legacy current 与 `HEAD` | 120/120，路径或 `content_sha256` mismatch 为 0，`knowledge/` 无 diff |
| 本地 collection verifier | 11/11 raw/metadata/summary 的 SHA、bytes、plan/target fingerprint 一致；状态均 200，0 redirect，0 expectation failure，0 禁止 metadata key，`fetch_calls:0` |
| `git diff --check` | 通过 |

本地 collection summary SHA-256 为 `128f2c407f2d93f21a5f526bb38e72991737eb1481b61d12b5f1a6e2fe740ef2`，plan fingerprint 为 `0b813aa643e74272302f7d0702c2185332ebf83121f2e65c9d3577951e8c103e`。该验证只复核既有本地 MyyShop 公开 snapshot，不是 M5 消费者平台采集。

## 5. 授权与 Git 边界

Owner 本轮明确授权 M5 里程碑文档 commit 并本地合入仓库 `main`；仓库没有将 `master` 作为当前主分支。本授权不包括 push、PR、release、deploy、M5 代码实现、Playwright/browser 安装或真实平台采集。本 Record 与全部文档将在同一隔离分支提交；最终 commit 可由 `git log -- docs/records/2026-08-25-m5-source-system-and-collector-design-record.md` 复核。

## 6. 未完成边界

- M5 SDD 未获独立实现批准；未执行 Task T02 及以后任何子任务。
- exact Playwright package/version、license、lockfile、browser 下载/缓存/清理与验收宿主尚未决定。
- 五个消费者平台的入口、账号/登录态、artifact/隐私/保留期、自动化/人工方式和停止条件均未授权。
- 当前没有 M5 Run、Answer Sample、Citation Observation、Source candidate、Classification、Claim Support Review、Aggregation、Baseline 或 Retest。
