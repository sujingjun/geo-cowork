---
title: M5 五平台两槽英文 Baseline 验收记录
status: verified
created: 2026-08-26
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ fda58516c455289175652e35a56ff811e862a3b5
source:
  - docs/records/2026-08-26-m5-two-slot-english-baseline-slot1-record.md
  - workspaces/myyshop/cycles/m5/intake/2026-08-26-en-baseline-slot-2.json
  - workspaces/myyshop/cycles/m5/intake/2026-08-26-en-baseline-slot-2-reviews.json
  - workspaces/myyshop/cycles/m5/intake/2026-08-26-en-baseline-aggregations.json
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md
scope: 五平台正式英文 ordinal 1/2、candidate Answer Review、逐平台 Aggregation、Source 归档进度与 M5 剩余门
---

# M5 五平台两槽英文 Baseline 验收记录

## 1. 结论

ChatGPT、Gemini、Google AI、Perplexity、Claude 的正式英文两槽 Baseline 已在本 Record 范围 `verified`：每个平台均使用 `What is MyyShop?`，保留两个独立 `baseline/manual` Sample、完整脱敏回答、Citation/Source 关系、两个 checksum-pinned candidate Answer Review 和一个 computed Aggregation；五个 Run 均为 `completed`、2/2、无残留 lease。

M5 整份 Task 仍保持 `implemented`，不能整体标为 `verified`：10 个 Answer Review 尚待 Owner 人工确认；Source 为 40/100，批量 Classification/Claim Support 尚未触发；post-change Retest 另缺 M4 confirmed Publication 与 Technical Retest。当前 Baseline 也不证明平台认知已优化、外部内容已发布或业务指标改善。

## 2. 第 2 槽采集边界

Owner 提供五个平台 exact result URL。Agent 通过已连接 Chrome 只读结果正文和 Citation；未自动提交 Query、未访问 cookie/storage/密码、未保存账号标识/侧边栏历史/完整 DOM，也未操作点赞、分享、设置或外部写入。

Gemini 第 1 槽界面只显示 `Flash`，第 2 槽共享页显示 `3.6 Flash`。冻结 Profile 未被改写；第 2 槽 collector log 单独记录观察标签，Gemini comparability 保持 `partial`。Claude 第 2 槽显示 `App Store + 2`，但页面只暴露 App Store URL；另外两个隐藏 URL 记录为 unavailable，没有猜测或补造。

## 3. 两槽结果

| platform | raw Citation occurrence | 去重 Citation unit | Source | 当前定位 | comparability |
| --- | ---: | ---: | ---: | --- | --- |
| ChatGPT | 45 | 39 | 20 | 两槽 `partial` | `partial` |
| Gemini | 18 | 6 | 5 | 两槽 `fail` | `partial`；第 2 槽显示 `3.6 Flash` |
| Google AI | 23 | 14 | 7 | 两槽 `partial` | `partial` |
| Perplexity | 13 | 13 | 7 | 两槽 `partial` | `partial` |
| Claude | 6 | 5 | 3 | 两槽 `partial` | `partial`；2 个隐藏来源 unavailable |

五个平台均能识别 MyyShop 及 creator-facing 方向，但没有任何平台稳定表达 Owner 冻结的完整定位：从以达人商业化为主，扩展到达人加入、成长、活跃与商业化的更完整服务体系。ChatGPT/Perplexity偏向 creator marketing/monetization；Google AI加入具体资格、佣金和声誉陈述；Claude持续以历史 SaaS/dropshipping 开场；Gemini两个独立结果均以 social commerce、建站、供应链和 dropshipping 为中心，是最稳定的定位偏差。

所有事实准确度和 Citation 质量仍为 `partial`：最新完整业务知识库尚未建立，40 个 Source 尚未分类，Claim Support 为空。上述判断只说明与 Owner 当前语义合同的匹配程度。

## 4. Source 与聚合状态

- 当前 M5 Citation Observation：133；本轮第 2 槽新增 53。
- 当前 M5 observed unique Source：40/100，剩余 60。
- Workspace Source 总数：51；不得与 M5 observed unique Source 混用。
- 当前有效 Source Classification：0；27 个旧 candidate 全部为 `superseded` 历史。
- Answer Review：10 candidate，全部 `review_required:true`。
- Answer Aggregation：5 computed；每个 `expected/selected_sample_count:2`。
- Classification coverage：0；Source Type entropy、first/third-party ratio、Claim Support 保持 partial/null。
- 五个平台 comparability 均为 `partial`，不得汇总为统一 GEO 分或跨平台排名。

## 5. 首次失败与恢复

第一次批量写入在 Gemini 前返回 `PLATFORM_ALLOWLIST_VIOLATION`：新结果使用官方共享 origin `https://share.gemini.google`，adapter 只登记了 `https://gemini.google.com`。ChatGPT 第 2 槽已先按 create-only 完成。修复仅把 exact Gemini 共享 origin 加入 manual result allowlist，不扩大自动化 product entry；批次重入后 ChatGPT 返回 `kept`，其余四个平台完成，证明部分提交可恢复。

## 6. 实际验证

最终检查在本 Record、STATUS、Task/Plan 更新后执行：

| 检查 | 结果 |
| --- | --- |
| `npm run test:m5-answer` | 37/37 通过 |
| `npm test` | 112/112 通过，107 个顶层 subtest，0 fail/skip/cancel |
| `validate:plugin` | `ok:true`，92 个检查路径 |
| `check:docs` | 73 个 Markdown、136 个本地链接、0 errors |
| Workspace validate | `ok:true`，0 object error |
| Knowledge validate | 0 errors；既有 2 条 `EVIDENCE_INSUFFICIENT` 保留 |
| Answer validate | 0 errors；11 条 Profile unknown + `SOURCE_CLASSIFICATION_DEFERRED(40/100)` |
| 新 Baseline 敏感信息检查 | 账号邮箱、账号 chrome、credential marker 0 命中 |
| 重入 | collect/review/aggregate 五平台均 `kept`；Run/Aggregation 字节不变 |
| index 双构建 | 两次 hash 均为 `83a7331a5d3bf895bc7a3b4c79ab8a4e334e29b7197b3b82faed2a270aa0a611` |
| Workspace Markdown 前后 | build-index 前后 hash 均为 `1011e85763abcb0832cf7e39d0ba56bd55fccf746d500768df7cb4bf302ef548` |
| Playwright loopback | `ok:true`，`1.62.1`，`network:loopback_only` |
| `git diff --check` | 通过 |

## 7. Git 与未验证边界

- checkout：`/Users/sujingjun/geo-cowork`
- branch/HEAD：`main @ fda58516c455289175652e35a56ff811e862a3b5`
- `main == origin/main` 的提交基线未被修改；本轮工作树 dirty。
- 开工前用户已有 `workspaces/myyshop/knowledge/02-brand-identity/_index.md` 的独立修改，本任务未覆盖或清理。
- 未执行 commit、push、PR、release、deploy、外部发布、GA4/GSC 或自动消费者平台 Query。
- 未验证：Owner 对 10 个 Review 的人工结论、剩余 60 个 Source、100 Source 批量 Classification/Claim Support、最新 M3 Knowledge Release、M4 Publication/Retest 与 M6 业务效果。
