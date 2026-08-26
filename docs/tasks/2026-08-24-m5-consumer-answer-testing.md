---
title: M5 Consumer Answer Testing 与持续信源体系任务清单
status: implemented
created: 2026-08-24
updated: 2026-08-25
source:
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/records/2026-08-25-m5-offline-consumer-answer-testing-record.md
  - docs/records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md
  - docs/records/2026-08-25-m5-chatgpt-manual-smoke-record.md
  - docs/records/2026-08-25-m5-gemini-manual-smoke-record.md
  - "2026-08-25 当前用户指令：持续维护信源体系，不做冷启动导入；M5 完整设计 Playwright 与真实采集"
  - "2026-08-25 当前用户指令：批准 M5 里程碑方案设计，并实施计划，完成目标"
  - "2026-08-25 当前用户指令：Playwright 使用最新版并全局安装；五个平台统一授权 Owner Google 登录身份，按真实用户隐私，本地 artifact 保留 1 年"
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-25-m5-playwright-and-consumer-platform-authorized.md
  - "2026-08-25 当前用户指令：后续平台转为平台书面自动采集"
  - "2026-08-25 当前用户指令：去除 Adapter written_permission_ref 限制；平台许可改为全部里程碑完成后的上线前待办"
  - "2026-08-26 当前用户指令：继续 Owner 手工操作/复制的 manual exploratory 采样；开发阶段先跑通对应真实 UI adapter"
  - docs/requirements/2026-08-25-platform-automation-permission-backlog.md
scope: M5 SDD 批准门、离线对象/恢复/指标、持续 Source registry、Playwright/平台 collector 与真实 Baseline 分段任务
---

# M5 Consumer Answer Testing 与持续信源体系任务清单

> 当前整份 Task 已获 Owner 批准；T02—T08 获实现授权。五个平台账号与隐私范围已授权，但平台 Terms/robots 仍优先约束真实执行；T09 真实 Smoke 与 T10 Baseline 未通过。

## M5-T01 SDD 人工审阅与批准

- 对应：M5 Requirement、PRD、Architecture、Spec 0006、Plan
- 任务目标：确认对象边界、revision、五层信源、指标、comparability、隐私和依赖门
- 成功标准：Owner 对六份工件给出可追溯批准或修改决定
- 范围外：代码、安装、真实平台
- 前置依赖：M2–M4 独立 Review PASS（仅规划门）
- 目标文件：六份 M5 SDD/Task 与批准 decision/Record
- 测试要求：链接、状态、冲突、授权矩阵人工核对
- 验证命令：`npm run check:docs`、`git diff --check`
- 风险：把 Review PASS 当 Spec approval
- 当前状态：verified

## M5-T02 Schema、Profile 与 index

- 对应：Spec 0006 §2—§4、§13
- 任务目标：注册七类新对象、现有 Source 的 M5 可选 profile 和 M5 index/refs
- 成功标准：正常、非法、空字段、status、refs/version/checksum/Profile fingerprint/三 slot/Source identity 全部红绿
- 范围外：Collector、Playwright、真实样本
- 前置依赖：M5-T01 approved + 离线实现授权
- 目标文件：M5 Schema、profile、模板、index/object 最小注册、测试
- 测试要求：不反向破坏 M2–M4；registry 多表变更以现有 index 字节等价回归约束
- 验证命令：`node --test tests/m5-schema-profile.test.mjs`
- 风险：把 P1 registry 重构扩大为前置工程
- 当前状态：verified

## M5-T03 不可变 raw、Sample 与隐私门

- 对应：Spec 0006 §5、§13
- 任务目标：用录制 Fixture 建立 create-only raw → Sample 纵切
- 成功标准：七类 outcome、artifact checksum/availability、半成品恢复、禁止字段和旧字节不变通过
- 范围外：浏览器与真实账号
- 前置依赖：M5-T02
- 目标文件：sample materializer、Fixture、专项测试
- 测试要求：answer_text/log/screenshot/DOM 分支、PII/credential 拒绝、重复/冲突
- 验证命令：`node --test tests/m5-sample-artifacts.test.mjs`
- 风险：为满足 artifact 完整性保存账号信息
- 当前状态：verified

## M5-T04 长任务 Run、lease 与恢复

- 对应：Spec 0006 §4、§12
- 任务目标：实现 slot checkpoint、lease、stale recovery、取消和 supersede
- 成功标准：逐 step 故障注入、双进程、未知提交状态、raw/metadata 半成品和 input drift 收敛
- 范围外：分布式队列、数据库、真实平台
- 前置依赖：M5-T02、M5-T03
- 目标文件：answer-run、Run profile、故障测试
- 测试要求：不得用“最终有文件”代替不重复外部动作证明
- 验证命令：`node --test tests/m5-run-recovery.test.mjs`
- 风险：M2 manifest 更新无 CAS 导致并发丢 step；必须先以红测确定最小修复
- 当前状态：verified

## M5-T05 Citation、持续 Source registry、五层分类与 Claim 支撑

- 对应：Spec 0006 §6—§8
- 任务目标：形成 Query→Platform→Intent→Domain→Source Identity→Source Type→Claim Supported 链，且由真实 Citation 持续发现/维护 Source
- 成功标准：URL/domain、重复引用、Citation/Source 双向 ref 预分配/闭包/半成品恢复、Source 匹配/创建、host/publisher/channel/page identity、new/returning 派生、五层主/副标签、party relation、support verdict 与人工门通过
- 范围外：外部榜单/静态域名表/历史排名导入、自动业务批准
- 前置依赖：M5-T03
- 目标文件：citation-analysis、classification/support materializer、测试
- 测试要求：无效 URL、平台托管来源、host 不等于生产主体/类型、官方多媒体、低置信度、Scope 不匹配、无 Citation 候选与外部榜单 import 显式失败
- 验证命令：`node --test tests/m5-citation-classification.test.mjs`
- 风险：把 Source Type 等同于 Claim 支撑
- 当前状态：verified

## M5-T06 Review、聚合与 comparability

- 对应：Spec 0006 §9—§11
- 任务目标：同 raw 多 Rubric Review，并计算五项指标
- 成功标准：手算 Fixture 的分子/分母/排序/coverage/zero denominator/volatility 与 true/partial/false 全部通过
- 范围外：统一 GEO 分、因果结论、M6 指标
- 前置依赖：M5-T05
- 目标文件：answer-review、answer-aggregation、rubric Fixture、测试
- 测试要求：外部榜单无 import 入口且显式被拒绝；探索字段不进核心；Source/Classification/Review input drift 失败
- 验证命令：`node --test tests/m5-review-aggregation.test.mjs`
- 风险：公式含糊导致跨窗不可复验
- 当前状态：verified

## M5-T07 recorded Fixture Collector seam 与离线验收

- 对应：Plan Slice G；Spec 0006 §14—§16
- 任务目标：在无 Playwright、无网络下跑通三 slot 全链
- 成功标准：CLI 跨 cwd、no-network、Source 链闭包、全部 M5 + M2–M4 回归和 index/legacy 稳定性通过
- 范围外：Playwright package、browser binary、平台 adapter
- 前置依赖：M5-T02—T06
- 目标文件：answer-cycle CLI、geo-answer Skills、recorded adapter、离线 Record
- 测试要求：全量门与授权矩阵复核
- 验证命令：Plan §7 全部离线命令
- 风险：Fixture 被误写成真实 Baseline
- 当前状态：verified

## M5-T08 Playwright 依赖与 base collector 实现

- 对应：Spec 0006 §13.2—§13.3；Plan Slice H
- 任务目标：先冻结 exact package/version、安装/下载/缓存/宿主范围，再实现 Spec 已冻结的 Playwright base 合同
- 成功标准：依赖决定与 package/browser 两次授权分别可追溯；每 attempt 隔离 context、allowlist、Profile 校验、版本化 selector/终态、artifact 最小化、checksum、关闭与 fail-loud 通过
- 范围外：具体平台登录和正式 Baseline
- 前置依赖：M5-T07 verified、Owner 单独批准
- 目标文件：dependency decision、package/lock（获批后）、base collector、专项 Record
- 测试要求：no silent browser download、不复用会话、不改 Query、无外部写入、选择器/终态漂移 fail loud、隐私最小化
- 验证命令：由获批依赖决定记录，不在当前 Plan 猜写版本命令
- 风险：安装动作隐式下载大体积 binary 或扩大宿主范围
- 当前状态：verified（全局 `playwright@1.62.1`、复用兼容 `chromium-1234`、base/allowlist/context/runtime loopback Smoke 通过；未下载新 binary）

## M5-T09 平台 adapter 与逐平台 Smoke

- 对应：Plan Slice I；Spec 0006 §3—§5、§13.4、§14
- 任务目标：逐个平台实现获授权消费者入口、真实 `collect` 与 manual fallback
- 成功标准：ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews、Claude 各有独立 authorization、Profile、入口 allowlist、selector/detector 版本、Citation 提取、artifact/禁止动作/停止条件与 Smoke Record
- 范围外：跨平台自动继承授权、API 正式样本
- 前置依赖：M5-T08；对应平台单独授权
- 目标文件：逐平台 adapter/测试/Record
- 测试要求：一个平台受阻不伪装全平台完成；不得用 API、搜索摘要或其他平台补数；manual 必须保留完整回答/Citation 并降低 comparability
- 验证命令：逐平台批准后在对应 Task 冻结
- 风险：UI/地区/模型漂移造成假 comparability
- 当前状态：implemented（ChatGPT/Gemini/Google AI manual Smoke、Claude CN/US baseline records 与 Perplexity user-supplied-export/manual Smoke verified；Perplexity 页面 manual 和 browser automation blocked；全平台正式 Smoke 未完成）

## M5-T10 真实 Baseline 与未来 Retest

- 对应：Plan Slice J/K；Spec 0006 §5.3、§10—§13
- 任务目标：在全部前置满足后形成正式 Baseline；Publication 后另建 Retest
- 成功标准：每 Query×Platform 三次独立、失败保留、raw/review/aggregation 可追溯；Retest 前置不混淆
- 范围外：GA4/GSC、因果与 Cycle 业务结论
- 前置依赖：M5-T09；逐平台授权；Retest 另需 M4 Publication/Technical Retest
- 目标文件：真实 Workspace objects、Run artifacts、Baseline/Retest Records
- 测试要求：Profile/comparability/隐私/保留期人工复核
- 验证命令：每个平台 Task 单独记录实际命令，不能预写成功
- 风险：失败样本被替换、Baseline 冒充 post-change Retest
- 当前状态：blocked（真实 Baseline 前置未满足；Retest 另缺 M4 confirmed Publication 与 Technical Retest）

## 收口条件

T02—T08 已收口；整份 Task 因 T09 真实 Smoke 与 T10 Baseline/Retest 未完成而保持 `implemented`，不提升为整体 `verified`。Owner 账号授权不能覆盖平台 Terms/robots；本次也不 commit、push、PR、下载新 browser、发布或部署。
