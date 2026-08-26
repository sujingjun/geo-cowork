---
title: M5 Consumer Answer Testing 本地离线工程验收记录
status: verified
created: 2026-08-25
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ bef8c8b2afcd6f6862f942208b1ec97d39a0b567
source:
  - docs/requirements/2026-08-24-m5-consumer-answer-testing.md
  - docs/prd/2026-08-24-m5-consumer-answer-testing.md
  - docs/architecture/2026-08-24-consumer-answer-testing-architecture.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/tasks/2026-08-24-m5-consumer-answer-testing.md
  - "2026-08-25 当前用户指令：批准 M5 里程碑方案设计，并实施计划，完成目标"
scope: M5 T01—T07 SDD 批准、七类对象、recorded Fixture、Run 恢复、持续 Source、Review/聚合、CLI/Skills 与离线回归
---

# M5 Consumer Answer Testing 本地离线工程验收记录

## 1. 结论

Owner 已明确批准 M5 Requirement、PRD、Architecture、Spec 0006、Plan 与 Task，并授权 T02—T07 本地离线实现。当前实现已跑通：frozen Collector Profile → 三个独立 Sample slot → create-only raw → Citation/Source 双向闭包 → Source Classification → Claim Support → Answer Review → 五项指标 Aggregation。

本 Record 只覆盖 `.invalid` 与工作区内虚构录制 Fixture。它不是 ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews 或 Claude 的真实 Sample/Baseline，不证明 M4 Publication、M6 业务效果、插件发布或部署。

## 2. 成功标准与范围

本轮成功标准：

1. 六份 M5 工件得到可追溯 Owner 批准；
2. 七类 M5 对象、现有 Source 的可选 M5 profile、refs/version refs 与七类 index 可验证；
3. success/refusal/timeout/no_result/challenge/cancelled/system_failure 均可保留，只有 system failure 使用递增 attempt 重试；
4. raw create-only、同字节恢复、不同字节冲突、隐私禁止字段与同 raw 多 rubric Review 可复验；
5. lease、stale takeover、双 owner、未知提交状态停门和 Citation/Source 半成品恢复收敛；
6. 五层 Source Classification 与 Claim Support 独立，外部榜单 import 显式禁止；
7. Top Citation Domains、Citation Share、Source Diversity、First-party vs Third-party Ratio、Source Volatility、zero denominator 与 comparability 有手算测试；
8. CLI 可从非仓库 cwd 执行 no-network recorded Fixture 全链，M2—M4 与 Workspace/index/legacy 回归不退化。

范围外：Playwright package、browser binary、五个平台 adapter/账号/真实采样、M4 业务对象补写、GA4/GSC、外部写入、commit、push、PR、release 与 deploy。

## 3. 实际实现

- 新增 `m5-record-types.schema.json`，注册 Collector Profile、Answer Sample、Citation Observation、Source Classification、Claim Support Review、Answer Review、Answer Aggregation；M2 Source 与 Run 只增加可选 M5 profile，不反向要求历史对象补字段。
- 扩展 object/index registry，新增七类可重建 index、精确 ref/version 校验及 Source discovery/Citation 双向关系。
- 新增 Profile fingerprint、slot key、artifact manifest checksum、Sample outcome/privacy/retry 校验。
- 新增 Run sample steps、原子 lease 目录、stale takeover、step proof 与 `query_submitted` 后未知终态的 `waiting_human` 停门。
- 新增 URL/IDN/default-port/fragment 规范化、Citation/Source create-only 逻辑事务、Source identity、五层分类与 Claim Support materializer。
- 新增 rubric checksum、同 raw 多 Review、五项确定性指标、comparability 与 Source lifecycle 计数。
- 新增 `answer-cycle.mjs` 的 `validate/plan/collect-fixture/review/aggregate/normalize-citations/resume`；未授权 `collect` 固定返回 `PLAYWRIGHT_GATE_NOT_APPROVED`，没有榜单 import command。
- 新增七类对象模板、`geo-answer-cycle`、`geo-answer` 与虚构录制 Fixture；插件 Manifest 版本保持 `0.3.0`，没有发布。

## 4. 首次失败与修复

1. 初始红测为 6 个测试文件全部因 M5 模块不存在而失败；随后按 T02—T07 最小纵切实现。
2. 首次专项运行在 Ajv `strictRequired` 编译 conditional approval 时失败；保留 strict schema，仅关闭编译期 `strictRequired` 静态提示，实际 `frozen` approval 条件仍由 Schema 与 profile validator 强制。
3. 首次插件自检发现 YAML 将 64 位全零 checksum 解析为数字；模板对 hash 字段显式加引号后通过。
4. `skill-creator` 的 `quick_validate.py` 在当前 Python 环境因缺少 PyYAML 无法启动；未擅自安装依赖。仓库 `validate-plugin.mjs` 已读取两份新 Skill 的 frontmatter、名称、必需小节和全部插件工件，最终结果在 §5 记录。

## 5. 实际验证

| 命令/检查 | 实际结果 |
| --- | --- |
| `npm run test:m2-contract` | 25/25 通过 |
| `npm run test:m3-knowledge-query` | 10/10 通过 |
| `npm run test:m4-diagnosis` | 27/27 通过 |
| `npm run test:m5-answer` | 20/20 通过；覆盖七类终态、retry、lease/heartbeat/stale、半成品恢复、Source 复用、同 raw 多 Review、五项指标、zero denominator、comparability 与 CLI |
| `npm test` | 95/95 通过，91 个顶层 subtest，0 fail/skip/cancel |
| `npm run validate:plugin` | `ok:true`，79 个检查路径；含 2 个 M5 Skill、7 个模板、M5 Schema/CLI/库 |
| `npm run check:docs` | 62 个 Markdown、114 个本地链接、0 errors |
| `workspace-validate.mjs --workspace workspaces/myyshop --objects` | `ok:true`；missing/errors/object_errors/warnings 均为空 |
| `knowledge-query.mjs validate` | errors 为空；仅保留 2 条既有 `EVIDENCE_INSUFFICIENT` |
| `knowledge-query.mjs trace --query Q-MYYSHOP-WHAT-IS-001` | `lifecycle_ready:true`，`gates:[]` |
| `diagnosis.mjs validate` | errors 为空；仅保留 11 条既有 `INDEPENDENT_SUPPORT_MISSING` |
| `answer-cycle.mjs validate` | errors/warnings 均为空；MyyShop 没有 M5 业务对象 |
| `buildIndexes` 连续两次 | 每次 69 canonical、120 legacy、25 indexes、0 warnings；第一次与第二次 index 聚合 hash 均为 `b054705636701ed578d8a0452f2099379939232544258b4c49a8e6313eb94993` |
| Workspace canonical Markdown 前后聚合 | 215 个文件，前后均为 `9f9de6dfda1c7fb22573da4862ae2008a02d4bd8270ee2eb2b8b9dc533d6497b`；index 构建未改 canonical Markdown |
| M5 Workspace/index 边界 | 7 个 M5 indexes 均为空；M5 canonical/consumer-citation Source 数为 0 |
| legacy `knowledge/` 与 `HEAD` | `git diff --exit-code` 为 0；build graph 仍为 120 条 legacy |
| `npm audit --omit=dev` | 0 vulnerabilities |
| 新增 M5 脚本 `node --check` | 全部通过 |
| `git diff --check` | 通过 |

上述命令均未访问消费者平台、未运行 Playwright/browser，也未生成 MyyShop M5 Sample。`package.json` 与 lockfile 中不存在 Playwright 依赖。

## 6. 未完成边界

- T08 blocked：exact Playwright package/version、license、Node 支持、lockfile、browser 下载/缓存/清理与验收宿主未决定，也没有当次安装授权。
- T09 blocked：五个平台均没有逐平台入口、账号/登录态、artifact、隐私、保留期、访问角色、删除责任、停止条件与 Smoke 授权。
- T10 blocked：没有真实 Baseline；post-change Retest 另缺 confirmed M4 Publication 与对应 Technical Retest。
- MyyShop 工作区没有 M5 Run/Sample/Citation/Source candidate/Classification/Review/Aggregation；本轮只会新增空的派生 M5 indexes。
- 未执行 commit、push、PR、release、deploy 或任何外部写入。

## 7. Git 与交付边界

- checkout：`/Users/sujingjun/geo-cowork`
- branch/HEAD：`main @ bef8c8b2afcd6f6862f942208b1ec97d39a0b567`
- 本地 tracking 状态：`main...origin/main [ahead 5]`，左右计数 `0 5`；本轮未联网 fetch，不声称远端服务端已重新核对
- 工作树：dirty，共 57 个 tracked/untracked path；全部属于本轮 M5 SDD 状态、源码、测试、Record、导航、MyyShop `STATUS.md` 与 7 个空派生 index，没有用户原有脏改动被覆盖
- 当前用户指令未授权 commit、push 或 PR，因此所有本轮实现保持未提交

## 8. 后续 T08/T09 决定

Owner 后续批准全局最新版 Playwright 与五平台账号/隐私范围；T08 本机 runtime/base 已验证，T09 真实 Smoke 被平台 Terms/robots 阻塞。后续结果见 [`2026-08-25-m5-playwright-runtime-and-platform-guard-record.md`](2026-08-25-m5-playwright-runtime-and-platform-guard-record.md)。本 Record 的 T02—T07 离线验收事实保持不变。
