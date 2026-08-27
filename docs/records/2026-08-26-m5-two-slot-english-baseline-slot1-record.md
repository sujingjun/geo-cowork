---
title: M5 两次英文人工 Baseline 第 1 槽与 100 Source 归档门记录
status: verified
created: 2026-08-26
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ fda58516c455289175652e35a56ff811e862a3b5
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md
  - workspaces/myyshop/cycles/m5/intake/2026-08-26-en-baseline-slot-1.json
  - workspaces/myyshop/cycles/m5/intake/2026-08-26-en-baseline-slot-1-reviews.json
scope: M5 两槽协议、英文主线/中文辅助语义合同、Source 归档/100 条分类门、五平台第 1 槽与 candidate Answer Review
---

# M5 两次英文人工 Baseline 第 1 槽与 100 Source 归档门记录

## 1. 结论

本 Record 的声明范围已验证：M5 正式采样从每平台三个 slot 修订为两个；英文 `en-US` 为首期主线，中文可选且绑定同一语义合同但分别聚合；M5 Citation Source 在唯一 Source 达到 100 个前统一归档未分类；五个平台均已登记第 1 个正式英文 `baseline/manual` Sample，并预分配第 2 槽。

M5 整体仍未完成。ChatGPT、Gemini、Google AI、Perplexity、Claude 五个 Run 当前均为 `waiting_human`，每个 Run 是 `1/2`；没有 Answer Aggregation。第 2 个独立英文结果必须由 Owner 另行人工采集，不能由 Agent 自动提交 Query，也不能复制第 1 槽。

## 2. Owner 当前定位与知识边界

Owner 已冻结当前定位及中英语义等价文本，核心是：MyyShop 是面向全球内容创作者的达人服务平台，正从以达人商业化为主，扩展到达人加入、成长、活跃与商业化的更完整服务体系；品牌合作机会、MyyFinds、达人侧工具与服务可作为当前能力类别，但具体状态与规则以官方页面和最新业务确认信息为准；AI 辅助分析/推荐/匹配、课程、数字代言人和达人协作增长属于探索或规划，不代表全部上线，也不保证结果。

该文本是 M5 Answer Review 的当前语义合同。Owner 同时明确最新完整业务知识库尚未建立，因此本轮不改写 M3 Knowledge Release、不把平台回答变成 Claim Evidence，也不把 `core_fact_accuracy` 评为最终 `pass/fail`。

## 3. 实际实现

- M5 当前常量：正式样本数 `2`、Source 批量分类阈值 `100`、主语言 `en-US`。
- 新增 manual baseline v2：预分配 ordinal `1/2`；第 1 槽完成后 Run 稳定进入 `waiting_human` 并清除已释放 lease；相同输入重跑字节等价，不重开 Run。
- 新增 `classification_queue`：`archived_unclassified | batch_ready | classified`。
- 新增 Source 批处理：统计 M5 Citation 引用的唯一 `source_ref`，把既有 candidate Classification 转为 `superseded` 历史；达到 100 后只报告 `batch_ready`，不在采集路径自动分类。
- 新增 `collect-manual-batch` 与 `review-manual-batch`；五个平台 exact result URL 只读提取后的脱敏正文和 Citation 由 create-only Run artifact 保存。
- 自动化 adapter 的 `terms_blocked/manual_only` 保持；本轮只允许 Owner 提供的 exact result URL，不授权自动提交 Query。

## 4. 五个平台第 1 槽

| platform | Sample | Citation | Review 当前定位 | Run |
| --- | --- | ---: | --- | --- |
| ChatGPT | `SMP-MYYSHOP-CHATGPT-EN-BASELINE-S1-20260826` | 24 | `partial` | `waiting_human`，1/2 |
| Gemini | `SMP-MYYSHOP-GEMINI-EN-BASELINE-S1-20260826` | 11 | `fail` | `waiting_human`，1/2 |
| Google AI | `SMP-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-20260826` | 7 | `partial` | `waiting_human`，1/2 |
| Perplexity | `SMP-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-20260826` | 6 | `partial` | `waiting_human`，1/2 |
| Claude | `SMP-MYYSHOP-CLAUDE-EN-BASELINE-S1-20260826` | 4 | `partial` | `waiting_human`，1/2 |

共同判断：五个平台均识别了 MyyShop 实体；ChatGPT/Perplexity 更接近当前 creator-facing 方向，但仍收窄为 creator marketing/monetization；Google AI 混入社交电商、代发与具体资格/结算陈述；Gemini 仍以建站、供应链和 dropshipping 为中心；Claude 能识别定位演进，但回答主体仍由历史 SaaS/建站/代发叙事主导。

以上是相对 Owner 当前语义合同的 candidate Answer Review，不是对所有回答事实逐条定真。由于最新完整知识库和 Source 分类均未完成，五个平台 `core_fact_accuracy` 与 `citation_quality` 均保持 `partial`，Review 均为 `review_required:true`。

## 5. 当前对象状态

| 对象 | 当前数量/状态 |
| --- | --- |
| Answer Sample | 12 recorded；其中本轮新增 5 个正式英文第 1 槽 |
| Citation Observation | 80 observed；本轮新增 52 |
| M5 observed unique Source | 33 / 100，剩余 67 |
| Source Classification | 27 个历史对象全部 `superseded`；当前有效分类 0 |
| Answer Review | 5 candidate，全部需人工复核 |
| Answer Aggregation | 0 |
| M5 Run | 5 个 `waiting_human`，均完成 1/2 |

Workspace `sources.json` 总计 44 个 Source，其中 33 个被当前 M5 Citation 引用并进入分类队列。总 Source 数与 M5 observed unique Source 数不可混用。

## 6. 实际验证

| 检查 | 结果 |
| --- | --- |
| `npm run test:m5-answer` | 37/37 通过 |
| `npm test` | 112/112 通过，107 个顶层 subtest，0 fail/skip/cancel |
| `npm run validate:plugin` | `ok:true`，91 个检查路径；包含新增 M5 policy/batch library |
| `npm run check:docs` | 71 个 Markdown、134 个本地链接、0 errors |
| `workspace-validate --objects` | `ok:true`，0 object error |
| `knowledge-query validate` | 0 errors；既有 2 条 `EVIDENCE_INSUFFICIENT` 保留 |
| `answer-cycle validate` | 0 errors；11 条 Profile unknown warning + 1 条 `SOURCE_CLASSIFICATION_DEFERRED(33/100)` |
| `smoke:m5-playwright` | `ok:true`；`1.62.1`，`network:loopback_only` |
| 新 Baseline 路径敏感信息检查 | 账号邮箱/账号 chrome/credential marker 0 命中 |
| index 双构建 | 两次 hash 均为 `1ffd2cbfab07fcc264e6655554c9beab064ee6f2cc73daaecc84c4433739b95d` |
| Workspace Markdown 前后 | build-index 前后 hash 均为 `f218295e13f4ce7c54814f678b3426d45f653bd7b6180c8da825e39d6b90d79b` |
| `git diff --check` | 通过 |

首次完整检查发现新英文 Query 与既有单次 Claude Query 重复，`knowledge-query validate` 返回 `DUPLICATE_QUERY`。修复方式不是绕过校验，而是把原单次 Query/Query Set 标记为 `stale/superseded` 历史，保留新 M5 正式 Query/Query Set；随后复验为 0 errors。

## 7. Git 与未验证边界

- checkout：`/Users/sujingjun/geo-cowork`
- branch/HEAD：`main @ fda58516c455289175652e35a56ff811e862a3b5`
- 开工前工作树已有用户改动：`workspaces/myyshop/knowledge/02-brand-identity/_index.md` 将一个链接标题改为 `x`；本任务未修改、未清理该行。
- 本轮产生大量 create-only Sample/Citation/Run artifact、Source queue 元数据、派生 indexes、代码、测试、SDD、Record 与 Handoff；工作树保持 dirty。
- 未执行 commit、push、PR、release、deploy、M4 外部发布、GA4/GSC 或自动平台 Query。
- 未验证：五个平台第 2 槽、两槽 Aggregation、100 Source 分类任务、Claim Support、最新完整业务知识库、M4 Publication/Technical Retest、M6 业务效果。
