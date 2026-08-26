---
title: M5 Playwright Runtime 与消费者平台条款门验收记录
status: verified
created: 2026-08-25
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ bef8c8b2afcd6f6862f942208b1ec97d39a0b567
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
  - docs/records/2026-08-25-m5-offline-consumer-answer-testing-record.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-25-m5-playwright-and-consumer-platform-authorized.md
  - "2026-08-25 当前用户指令：Playwright 使用最新版并全局安装；五个平台统一授权 Owner Google 登录身份，按真实用户隐私，本地 artifact 保留 1 年"
scope: M5 T08 全局 Playwright/runtime/base、T09 五平台 guard adapter、账号隐私决定与真实 Smoke 停止结论
---

# M5 Playwright Runtime 与消费者平台条款门验收记录

> 后续 Owner 已完成 ChatGPT 单次人工 exploratory Smoke；见 [`2026-08-25-m5-chatgpt-manual-smoke-record.md`](2026-08-25-m5-chatgpt-manual-smoke-record.md)。本 Record 的 T08 与 guard 结论保持不变。
>
> Gemini 后续也完成单次无 Citation manual Smoke；此后 Owner 将所有后续平台切换为书面自动采集 permission ref 硬门。见 [`2026-08-25-m5-gemini-manual-smoke-record.md`](2026-08-25-m5-gemini-manual-smoke-record.md)。
>
> Owner 随后移除 permission ref 运行时硬门，并把平台许可放入 Requirements 需求池，状态“待规划”、由 Owner 决定是否启动规范；本 Record 的平台 Terms guard 结论不变。

## 1. 结论

- **T08 PASS（仅本机技术范围）**：实时解析 npm/GitHub `latest` 为 `playwright@1.62.1`；全局安装、exact version gate、Node/许可证检查、复用现有 Chrome for Testing、每 attempt 新 context、无 storageState、allowlist、资源关闭和 loopback base Smoke 均通过。
- **T09 guard engineering PASS，真实平台 Smoke BLOCKED**：五个平台分别有 guard adapter、入口、版本、artifact、manual fallback 与停止合同，并在任何 browser launch 前返回 `PLATFORM_TERMS_BLOCKED`。没有打开消费者平台、没有登录、没有提交 Query、没有读取或提取 Output。
- Owner 的账号授权、隐私决定和本地 365 天保留已经落盘，但不能覆盖平台 Terms、robots、challenge 或账号安全控制。T09 因而保持 `blocked`，不能提升为 `verified`；T10 仍没有真实 Sample/Baseline。

## 2. Playwright 精确依赖与浏览器决定

| 项目 | 实际结果 |
| --- | --- |
| npm `latest` | `1.62.1` |
| GitHub Latest | `v1.62.1` |
| package / license | `playwright@1.62.1` / Apache-2.0 |
| Node requirement / actual | `>=20` / `v22.14.0` |
| 安装方式 | `npm install -g playwright@1.62.1`；成功，新增 2 个全局 package |
| CLI | 当前用户全局 `playwright`，`playwright --version` 为 `1.62.1` |
| 仓库影响 | `package.json` 只新增 Smoke script；dependencies 与 lockfile 不增加 Playwright |
| browser binary | 复用既有 Chrome for Testing `chromium-1234`；`playwright@1.62.1` 实际 launch 成功 |
| 新 browser 下载 | 未执行 |
| browser cache / 磁盘 | cache 约 1.1 GiB；安装前曾观察到只余约 4.3 GiB，最终复核约 8.8 GiB/98% 使用；本轮始终未下载新 browser |
| 当前宿主 | 仅本机 macOS；CI 与其他宿主未验证 |

官方依据：

- Playwright Releases：<https://github.com/microsoft/playwright/releases>
- Playwright browser 安装/缓存：<https://playwright.dev/docs/browsers>

## 3. 五个平台条款与执行矩阵

| platform | adapter 状态 | 依据与当前结论 | 实际账号/UI Smoke |
| --- | --- | --- | --- |
| ChatGPT | `terms_blocked` | OpenAI consumer Terms 禁止自动/程序化提取数据或 Output | 未执行 |
| Gemini | `manual_only` | 未取得官方消费者 UI 自动采集许可；不对 Owner Google 账号作推断性冒险 | 未执行 |
| Perplexity | `terms_blocked` | consumer Terms 禁止 bot/scraper/自动采集，也禁止为同一目的进行手工采集流程 | 未执行 |
| Google AI Mode / AI Overviews | `terms_blocked` | Google Terms 要求遵守机器可读规则；`google.com/robots.txt` 对通用 user-agent 禁止 `/search` | 未执行 |
| Claude | `terms_blocked` | Anthropic Consumer Terms 禁止非 API 的自动/非人类访问，并禁止 crawl/scrape | 未执行 |

官方依据：

- OpenAI Terms：<https://openai.com/policies/terms-of-use/>
- Anthropic Consumer Terms：<https://www.anthropic.com/legal/consumer-terms>
- Perplexity Terms：<https://www.perplexity.ai/hub/legal/terms-of-service>
- Google Terms：<https://policies.google.com/terms>
- Google robots：<https://www.google.com/robots.txt>

这是条款遵从的工程停止结论，不是法律意见。若平台后续提供书面许可、官方 export 或受支持 API，需要建立新的 SDD/授权范围；v1 正式样本仍不能用 API 冒充消费者 UI。

## 4. 账号、隐私与保留

- 授权身份只记录为 `Owner-controlled Google login`；用户提供的原始账号标识已脱敏为 `[REDACTED_ACCOUNT_IDENTIFIER]`，未写入代码、测试、Profile、Run、日志或 artifact。
- Agent 未读取密码、cookie、token、local/session storage、浏览器 Profile、登录状态、地区、订阅或模型模式。
- 允许的本地真实 artifact 仅限完整 answer text、Citation raw、答案/Citation 区域裁剪截图和脱敏 collector log；完整页面截图与完整 DOM/HTML 默认 unavailable。
- 本地保留期为 captured_at 起 365 天；平台侧保留服从供应商政策。到期只进入删除复核，实际删除仍需精确路径与当次破坏性操作授权。
- OpenAI 官方说明 Temporary Chat 不进入历史、不创建 memory，安全目的副本最多保留 30 天；这不改变本地 365 天决定。

## 5. 实际实现

- 新增全局 runtime resolver：通过 `npm root -g` 动态解析，不在仓库硬编码用户目录；exact version 不匹配返回 `PLAYWRIGHT_RUNTIME_MISMATCH`。
- 新增 `playwright-base.mjs`：authorization/adapter 双 allowlist、每 attempt 新 context、无 storageState、请求 origin gate、固定 Query、终态 timeout、最小结构化输出和 finally 关闭。
- `runtime-smoke` 启动本机 Chrome for Testing，只访问 `127.0.0.1` loopback fixture，实际走 base 的导航、提交、终态、answer/Citation 提取；不访问互联网。
- 新增 ChatGPT、Gemini、Perplexity、Google AI、Claude 五个独立 guard adapter；没有通用 URL fallback，没有真实 selector 冒充支持。
- `collect`/`platform-smoke` 先执行 adapter Terms gate；五个平台均在 global Playwright resolve/launch 前 fail-loud。

## 6. 首次失败与修复

1. 新红测首先因 `collectors/playwright-base.mjs` 与五平台 adapter 不存在而失败；旧 CLI 仍返回 `PLAYWRIGHT_GATE_NOT_APPROVED`。
2. 首次实现后，fixture adapter 缺少 packaging fields、Perplexity 仅允许 collector log 而测试错误要求 answer artifact；补齐 fixture contract，并让测试按 manual fallback 可用性区分 artifact。
3. CLI `collect` 改为优先解析平台注册 guard，当前五平台统一返回 `PLATFORM_TERMS_BLOCKED`，不再把依赖门误报为主要阻塞。

## 7. 实际验证

| 命令/检查 | 实际结果 |
| --- | --- |
| `npm run test:m2-contract` | 25/25 通过 |
| `npm run test:m3-knowledge-query` | 10/10 通过 |
| `npm run test:m4-diagnosis` | 27/27 通过 |
| `npm run test:m5-answer` | 27/27 通过；新增 exact runtime、context isolation、allowlist、artifact scope 与五平台条款门测试 |
| `npm test` | 102/102 通过，98 个顶层 subtest，0 fail/skip/cancel |
| `npm run smoke:m5-playwright` | `ok:true`、version `1.62.1`、`base_outcome:success`、`citation_count:1`、`network:loopback_only` |
| 五平台 `platform-smoke` | ChatGPT/Gemini/Perplexity/Google AI/Claude 均 exit 1 + `PLATFORM_TERMS_BLOCKED`；批量断言命令 exit 0 |
| `npm run validate:plugin` | `ok:true`，86 个检查路径；包含 base 与 6 个 platform/registry 模块 |
| `npm run check:docs` | 63 个 Markdown、117 个本地链接、0 errors |
| `workspace-validate --objects` / `answer-cycle validate` | 均无 error/warning；MyyShop 没有 M5 Sample |
| `knowledge-query validate/trace` | 仅保留 2 条既有 `EVIDENCE_INSUFFICIENT`；trace `lifecycle_ready:true`、`gates:[]` |
| `diagnosis validate` | errors 为空；保留 11 条既有 `INDEPENDENT_SUPPORT_MISSING` |
| index 双构建 | 每次 69 canonical、120 legacy、25 indexes、0 warnings；两次 hash 均为 `b054705636701ed578d8a0452f2099379939232544258b4c49a8e6313eb94993` |
| Workspace Markdown 前后聚合 | 216 个文件，前后均为 `001bf3733cc61b2061c503bc18457581b0798bd0bd6124d128c25f72f918e1dd` |
| `npm audit --omit=dev` | 0 vulnerabilities |
| collector `node --check` / `git diff --check` | 全部通过 |
| 原始账号标识检索 | 工作区无命中；只保留 `[REDACTED_ACCOUNT_IDENTIFIER]` |

## 8. 未完成边界

- T09 没有真实登录态、UI selector、终态 detector、answer/Citation artifact 或平台 Smoke Record；guard adapter 不是平台自动采集支持。
- 没有人工 fallback artifact；若 Owner 后续按条款允许的平台人工操作，必须使用用户控制浏览器并单独记录完整操作与 raw。
- Perplexity 当前不允许用同目的人工流程补采。
- Gemini 自动化许可仍未确定；`manual_only` 不是“默认允许自动化”。
- 没有新 browser binary 下载、CI/其他宿主验证、真实 Baseline、post-change Retest、commit、push、PR、release 或 deploy。

## 9. Git 与外部状态边界

- checkout：`/Users/sujingjun/geo-cowork`
- branch/HEAD：`main @ bef8c8b2afcd6f6862f942208b1ec97d39a0b567`
- 本地 tracking：`main...origin/main [ahead 5]`，左右计数 `0 5`；本轮未 fetch，不声称远端服务端状态已刷新
- 工作树：dirty，共 68 个 tracked/untracked path；包含前序 M5 T02—T07 与本轮 T08/T09 guard、Decision、Record、测试和派生 index
- 外部变化：当前用户全局 npm 环境新增 `playwright@1.62.1`；没有新 browser binary、平台账号数据或外部业务写入
- 未执行 commit、push、PR、release 或 deploy
