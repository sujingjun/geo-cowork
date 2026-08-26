---
title: M5 ChatGPT Temporary Chat 人工 Smoke 记录
status: verified
created: 2026-08-25
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ bef8c8b2afcd6f6862f942208b1ec97d39a0b567
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
  - docs/records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-25-m5-playwright-and-consumer-platform-authorized.md
  - "2026-08-25 当前用户指令：继续 T09，需要确认时等待用户操作"
scope: ChatGPT Temporary Chat、Owner 手工 Query/复制、exploratory manual Sample、Citation/Source/Classifications 与隐私边界
---

# M5 ChatGPT Temporary Chat 人工 Smoke 记录

> 后续 Gemini 也完成 1 个无 Citation manual exploratory Smoke；此后 Owner 将剩余平台切换为书面自动采集许可门。见 [`2026-08-25-m5-gemini-manual-smoke-record.md`](2026-08-25-m5-gemini-manual-smoke-record.md)。
>
> Owner 随后移除 adapter `written_permission_ref` 运行时硬门，并把平台许可改为 Requirements 需求池待规划条目；Terms/robots guard 保持。

## 1. 结论

ChatGPT 单次人工 Smoke 在第二次尝试中完成，并以 `purpose:exploratory`、`collection_method:manual` 落盘。Owner 在用户控制的 Chrome 中手工提交冻结 Query `MyyShop 是什么？`、等待回答并点击复制；Agent 只准备 Temporary Chat 页面、从本机系统剪贴板读取 Owner 已主动复制的结果，不通过 DOM、selector、脚本或浏览器存储提取平台 Output。

该结果证明 ChatGPT 人工 fallback 的最小链可执行，不证明 ChatGPT browser automation、三次独立采样、Baseline、Claim 支撑、事实正确性、平台趋势或业务效果。T09 整体仍因其他平台未完成而保持 blocked。

## 2. 首次异常与恢复

1. 第一次 Temporary Chat 在 Owner 提交后变成普通历史会话，回答区显示生成失败；该会话没有进入 Workspace Sample。
2. Agent 没有点击“重试”，也没有删除失败历史会话，因为重试是新的平台提交，删除是破坏性外部操作。
3. 重新创建全新 Temporary Chat，确认 URL 为 `https://chatgpt.com/?temporary-chat=true` 后再次交给 Owner。
4. 第二次回答成功；Owner 点击回答“复制”，系统剪贴板取得完整 Markdown 与 3 个 Citation URL。复制后再次只读确认仍处于 Temporary Chat URL。

## 3. Profile 与采集边界

| 字段 | 实际值 |
| --- | --- |
| Profile | `CPF-MYYSHOP-CHATGPT-MANUAL-SMOKE-20260825` |
| platform | `chatgpt` |
| product entry | `https://chatgpt.com/?temporary-chat=true` |
| language | `zh-CN` |
| login state | `logged_in`；不记录账号标识 |
| region / web search / model mode | `unknown` |
| conversation | `new` |
| method | `manual` |
| Sample | `SMP-MYYSHOP-CHATGPT-MANUAL-SMOKE-20260825` |
| Run | `RUN-MYYSHOP-M5-CHATGPT-MANUAL-SMOKE-20260825` |
| outcome | `success` |
| captured_at | `2026-08-25T18:01:06+08:00` |
| local retention | 365 天；到期只进入删除复核 |

账号邮箱、密码、cookie、token、local/session storage、完整截图、DOM/HTML、历史会话和无关 UI 均未保存。原始账号标识在仓库检索为 0 命中。

## 4. Raw 与对象链

| 对象/工件 | 结果 |
| --- | --- |
| answer raw | `runs/RUN-MYYSHOP-M5-CHATGPT-MANUAL-SMOKE-20260825/raw/slot-1/answer.md`；SHA-256 `09088a90279259e84a5075b84b8f6e2dc589c7bd71469cc7951442e270837c9b` |
| collector log | `runs/RUN-MYYSHOP-M5-CHATGPT-MANUAL-SMOKE-20260825/raw/slot-1/collector-log.json`；SHA-256 `f805baa3e4954fc8c2c26251fa0175e2c7894947b9b6bbc27a1735baf9258b5f` |
| Citation 1 | `CIT-MYYSHOP-CHATGPT-MANUAL-ABOUT-20260825` → 复用 `SRC-MYYSHOP-WEB-ABOUT-001` |
| Citation 2 | `CIT-MYYSHOP-CHATGPT-MANUAL-HOME-20260825` → 复用 `SRC-MYYSHOP-WEB-HOMEPAGE-001` |
| Citation 3 | `CIT-MYYSHOP-CHATGPT-MANUAL-LINKEDIN-20260825` → 新建 `SRC-MYYSHOP-LINKEDIN-COMPANY-001` |
| Classifications | 3 个 `candidate`；均 `low` + `review_required:true` |

三个 Citation 分别指向 MyyShop About、MyyShop 首页和 MyyShop LinkedIn company page。Source Classification 只描述候选角色；没有读取 Citation 页面正文，因此没有创建 Claim Support Review，也没有把 ChatGPT 的陈述改写成 Evidence 或 Claim。

## 5. 回答观察边界

raw 回答包含品牌/创作者营销定位、社交账号连接、Campaign、佣金、CPM、提现门槛和历史业务转向等陈述。当前只把它们视为平台回答 Observation：

- 不判断陈述真假或时效；
- 不用 Citation 类型代替 Claim 支撑；
- 不以一个平台的一次回答确认 Gap、采用或产品方向；
- 不进入正式 Aggregation；
- 不消除现有 Evidence Sufficiency 或 independent-support warning。

## 6. 实际验证

| 检查 | 结果 |
| --- | --- |
| manual import 专项 | 3/3 通过；正常、隐私前置失败、同字节恢复/不同字节冲突 |
| `npm run test:m5-answer` | 30/30 通过 |
| `npm test` | 105/105 通过，101 个顶层 subtest，0 fail/skip/cancel |
| `npm run validate:plugin` | `ok:true`，87 个检查路径；含 manual materializer |
| `npm run check:docs` | 64 个 Markdown、120 个本地链接、0 errors |
| `workspace-validate --objects` | `ok:true`，无 object error |
| `answer-cycle validate` | errors 为空；1 条 `PROFILE_FIELD_UNKNOWN`、3 条 `CLASSIFICATION_REVIEW_REQUIRED`，均为预期 |
| raw SHA | answer/log 与 Sample artifact descriptors 一致 |
| 敏感标识检索 | 账号标识、gmail、Authorization、cookie、access token 均无命中 |
| index 双构建 | 79 canonical、120 legacy、25 indexes、0 warnings；两次 hash 均为 `a8d1eece867faae545af402c5dc804ccd75b7f1ff48f7d12c254bd255cc194f3` |
| Workspace Markdown 前后 | 226 个文件，前后 hash 均为 `c2763dfc3f89abac2569fe6c6af8534779dc1bde153f93b46e3c027e14144b48` |

## 7. 未完成边界与下一步

- ChatGPT 只有 1 个 exploratory/manual Sample；正式 Baseline 仍需三个独立 slot，并且当前自动提取受 OpenAI consumer Terms 阻塞。
- 三个 Source Classification 待人工复核；Citation 页面 Claim 支撑范围未评审。
- 第一条失败历史会话仍在 ChatGPT 账号中；未获删除确认，因此不处理。
- Gemini 后续已完成 1 个无 Citation manual Smoke；Google AI、Claude、Perplexity 当前仍受 Terms/robots guard 阻塞。平台许可只保留为待规划需求池条目。
- 未执行 commit、push、PR、release 或 deploy。

## 8. Git 边界

- checkout：`/Users/sujingjun/geo-cowork`
- branch/HEAD：`main @ bef8c8b2afcd6f6862f942208b1ec97d39a0b567`
- 本地 tracking：`main...origin/main [ahead 5]`，左右计数 `0 5`；未 fetch
- 工作树：dirty，共 86 个 tracked/untracked path，包含前序 M5、T08/T09 guard、本次 manual Sample/Record 与派生 index
- 未执行 commit、push、PR、release 或 deploy
