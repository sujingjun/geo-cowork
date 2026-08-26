---
title: M5 Perplexity 用户导出 Markdown 人工 Smoke 记录
status: verified
created: 2026-08-26
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 38a7b583c514696307d627e8d3296c27505af43b
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-perplexity-user-export-authorized.md
  - "/Users/sujingjun/Downloads/What MyyShop is.md"
  - "2026-08-26 当前用户指令：这个是 Perplexity 结果导出 md"
  - "2026-08-26 当前用户指令：结果写入，Perplexity 为 manual 人工采集，写入 M5 Sample"
scope: 用户提供的 Perplexity 平台导出 Markdown、受限 manual ingestion、exploratory Sample 与 Citation/Source 候选闭包
---

# M5 Perplexity 用户导出 Markdown 人工 Smoke 记录

## 1. 结论

Owner 提供本地文件 `/Users/sujingjun/Downloads/What MyyShop is.md`，并明确它是 Perplexity 结果导出 Markdown，要求以 `manual` 人工采集写入 M5 Sample。Agent 只读取本地文件，没有打开 Perplexity 结果页，没有控制 Chrome，也没有从 Perplexity 页面复制内容。

本次增加 `user_supplied_export_only` manual 门：只有同时冻结 `kind: user_supplied_export`、安全文件名和 SHA-256 的本地导出文件可以进入 Perplexity manual materializer；普通 Perplexity 页面 manual 与全部 browser automation 继续在写入前失败。

导出形成 1 个成功 `exploratory/manual` Sample、5 个 Citation、5 个唯一 Source 引用、3 个新 Source 和 5 个待复核 candidate Classification。没有创建 Claim Support Review、Answer Review 或 Aggregation，不与其他平台结果对比，也不构成正式三次采样 Baseline。

## 2. Profile 与对象

| 字段 | 实际值 |
| --- | --- |
| Query | `Q-MYYSHOP-WHAT-MYYSHOP-IS-001`；`What MyyShop is`；`en-US` |
| Query Set | `QS-MYYSHOP-PERPLEXITY-EXPORT-EN-001`；`frozen` |
| Profile | `CPF-MYYSHOP-PERPLEXITY-USER-EXPORT-20260826` |
| Run | `RUN-MYYSHOP-M5-PERPLEXITY-USER-EXPORT-20260826` |
| Sample | `SMP-MYYSHOP-PERPLEXITY-USER-EXPORT-20260826` |
| platform | `perplexity` |
| method / purpose | `manual` / `exploratory` |
| manual source | `user_supplied_export` |
| filename | `What MyyShop is.md` |
| captured_at | `2026-08-26T14:22:01+08:00`；使用导出文件本地创建/修改时间 |
| Citation / unique Source / new Source | `5 / 5 / 3` |
| candidate Classification | `5` |
| Claim Support / Review / Aggregation | `0 / 0 / 0` |

## 3. Citation Observation

导出正文列出以下 5 个 Citation：

1. MyyShop 首页 <https://www.myyshop.com/>；
2. WordPress 评测 <https://stufftotalk.wordpress.com/2025/11/30/everything-you-need-to-know-about-myyshop-review/>；
3. Apple App Store <https://apps.apple.com/us/app/myyshop/id6449818392>；
4. Reddit UGCcreators 讨论 <https://www.reddit.com/r/UGCcreators/comments/1ql5hi1/myyshop_is_it_legit/>；
5. MyyShop 注册页 <https://www.myyshop.com/register>。

回答把 MyyShop 描述为 AI 驱动的 creator-marketing 平台，并列出品牌 Brief 内容创作、社交推广、联盟佣金、产品测试/评测和 App Store 应用等内容，同时提示付款、运费、披露、使用权和预付款风险。这些内容只作为 Perplexity Answer Observation 保存；没有逐页核验 Citation，也没有提升为 MyyShop 事实或 Claim 支撑。

## 4. Raw 与隐私

| 工件 | 路径与 SHA-256 |
| --- | --- |
| Owner 导出原文件 | `/Users/sujingjun/Downloads/What MyyShop is.md`；`858cd949217e1704ebf4662f8a9de281ee3c8e48d34d3deceaaa4bb35ee051f2` |
| answer raw | `runs/RUN-MYYSHOP-M5-PERPLEXITY-USER-EXPORT-20260826/raw/slot-1/answer.md`；`858cd949217e1704ebf4662f8a9de281ee3c8e48d34d3deceaaa4bb35ee051f2` |
| collector log | `runs/RUN-MYYSHOP-M5-PERPLEXITY-USER-EXPORT-20260826/raw/slot-1/collector-log.json`；`ccacddc4bd45db5a5b7c82b1a7e295bd5c71c5288acbe27e61b3cc7e9d0ecbc2` |
| manual plan | `runs/RUN-MYYSHOP-M5-PERPLEXITY-USER-EXPORT-20260826/inputs/manual-sample-plan.json`；`671cf732de73b8633797087bd143a0cd728d64258468998035e78a103ff5627e` |

原导出文件与 answer raw 字节哈希一致。没有保存账号名称、邮箱、密码、cookie、Authorization、access token、截图、DOM/HTML 或浏览历史；邮箱形态扫描为 0 命中。

## 5. 验证结果

| 检查 | 结果 |
| --- | --- |
| Perplexity export-only 红绿测试 | 普通 manual 拒绝；`user_supplied_export` 允许 |
| `workspace-validate --objects` | `ok: true`，无 object error |
| `knowledge-query validate` | errors 为空；既有 2 条 `EVIDENCE_INSUFFICIENT` warning 保留 |
| `answer-cycle validate` | errors 为空；Profile 未知字段与 5 个候选分类为预期 warning |
| `npm run test:m5-answer` | 33/33 通过 |
| `npm test` | 108/108 通过，104 个顶层 subtest，0 fail/skip/cancel |
| `npm run validate:plugin` | `ok: true` |
| `npm run check:docs` | 69 个 Markdown、132 个本地链接、0 errors |
| index 双构建 | 163 canonical、120 legacy、25 indexes、0 warnings；两次 hash 均为 `6b8a8ead17f53050989bb38f034fb3584a9fd40932f54bf8af5358f4e3b895fd` |
| Workspace Markdown 前后 | 319 个文件，前后 hash 均为 `5c9a836d0653422204fe68d54fde96255226c93dff02d4949c0d4d636306ebee` |

## 6. 完成与未完成边界

- Perplexity 用户导出文件 manual ingestion 已跑通；这不放开 Perplexity 页面访问或自动化。
- Sample 只有 1 个 exploratory slot，不进入正式 Baseline 或 Aggregation。
- 5 个 Classification 都是待逐页复核候选，不能直接确认来源类型、主体关系或 Claim 支撑。
- 未执行 commit、push、PR、release 或 deploy。

## 7. Git 边界

- checkout：`/Users/sujingjun/geo-cowork`
- branch/基线 HEAD：`main @ 38a7b583c514696307d627e8d3296c27505af43b`
- 基线与 `origin/main` 一致；本轮未 fetch
- 工作树：dirty，包含本轮五平台 manual 工件、受限 adapter、Record 与派生 index
- 未执行 commit、push、PR、release 或 deploy
