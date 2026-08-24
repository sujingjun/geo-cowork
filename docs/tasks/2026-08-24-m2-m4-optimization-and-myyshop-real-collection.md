---
title: M2–M4 优化与 MyyShop 公开站点真实采集任务清单
status: verified
created: 2026-08-24
source:
  - docs/plans/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-plan.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - docs/records/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-record.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md
scope: 首批公开采集、M4 Site/Research 执行、直接相关 Handoff 优化与验收记录
---

# M2–M4 优化与 MyyShop 公开站点真实采集任务清单

## OPT-COL-T01 授权、Plan 与环境契约

- 对应：Spec 0005 §9、§10、§14；本轮 Plan Slice A
- 任务目标：冻结真实采集范围、参数、保留期、reviewer、禁止项和 GA4/GSC 待确认变量
- 成功标准：Decision/Plan/Task 可追溯；`.env.example` 注释清楚且不含 secret
- 范围外：实际读取 GA4/GSC、任何外部写入
- 前置依赖：Owner 当前明确指令
- 目标文件：Decision、Plan、Task、`.env.example`
- 测试要求：链接、命名、secret 和 whitespace 检查
- 验证命令：`git diff --check` 与文档链接/secret 检查
- 风险：把 Measurement ID 当作 Data API Property ID，或把 reviewer 角色当作业务批准
- 当前状态：verified
- Session/Handoff：当前任务；M2–M4 整体优化 Handoff

## OPT-COL-T02 公开 snapshot collector

- 对应：Spec 0005 §9、§11、§14；本轮 Plan Slice B
- 任务目标：实现显式 allowlist、限速、脱敏和可恢复的只读 HTTP collector
- 成功标准：正常、非法、重定向、容量、超时、重试、恢复、部分冲突和敏感 header 场景通过
- 范围外：浏览器渲染、登录、自动发现、第三方 API
- 前置依赖：T01
- 目标文件：collector library/CLI、专项测试、package script
- 测试要求：先红后绿；本地 HTTP fixture；不得依赖真实 MyyShop 才能测试
- 验证命令：`node --test tests/m4-public-site-collector.test.mjs`
- 风险：重定向越权、partial artifact、secret 落盘、重试放大流量
- 当前状态：verified
- Session/Handoff：当前任务

## OPT-COL-T03 MyyShop Source、Asset 与计划

- 对应：Spec 0003、0004、0005；本轮 Plan Slice C
- 任务目标：登记首批精确 Source/Asset 和显式 Collection/Site/Research plans
- 成功标准：每个 locator、目标对象版本、snapshot role 和预期检查可解析；不自动外扩 sitemap
- 范围外：Evidence approval、Gap 确认、Proposal/Adoption/Publication
- 前置依赖：T01、当前批准的 M3 对象版本
- 目标文件：MyyShop canonical Markdown 与 collection plan
- 测试要求：Workspace/profile/index/ref 校验
- 验证命令：Workspace、Knowledge、Diagnosis validate 与 trace
- 风险：一个 Source 复用多个 locator 导致证据粒度丢失，或文本资源被误套 HTML 检查
- 当前状态：verified
- Session/Handoff：当前任务

## OPT-COL-T04 真实公开采集与 M4 Site/Research Run

- 对应：Spec 0005 §9—§12、§14；本轮 Plan Slice D
- 任务目标：采集 11 个 allowlist 端点并运行首批真实 M4 只读诊断
- 成功标准：逐 URL raw/metadata/SHA 完整；五页 Site Run 与公开原文 Research Evidence 可追溯；失败逐项保留
- 范围外：人工业务批准、消费者平台采样、业务效果
- 前置依赖：T02、T03
- 目标文件：MyyShop Run raw/outputs、Evidence/Finding/Run objects
- 测试要求：checksum、manifest fingerprint、create-only 重跑、证据 Scope
- 验证命令：collector、site-audit、research-ingest、profile/index/trace
- 风险：线上内容漂移、命名 bot robots 语义被通用 detector 误判、成功访问被误述为充分证据
- 当前状态：verified
- Session/Handoff：当前任务

## OPT-COL-T05 直接相关 Handoff 优化与完整验收

- 对应：M2–M4 整体优化 Handoff；本轮 Plan Slice E
- 任务目标：收口本轮暴露的恢复/审计问题并建立可复现 Record
- 成功标准：必要优化有失败测试；M2–M4 与全量门通过；Record 记录实际事实和剩余 M5 阻塞点
- 范围外：无直接收益的整体重构、M5 P0、commit/push/PR/release/deploy
- 前置依赖：T02—T04
- 目标文件：直接相关实现/测试、Record、Handoff/STATUS/导航
- 测试要求：专项、全量、plugin、Workspace、Knowledge、Diagnosis、index、链接、secret、Git
- 验证命令：本轮 Plan §6 和 Record 中的附加检查
- 风险：把局部优化称为整个 Handoff 已实施，或把真实快照称为已批准业务结论
- 当前状态：verified
- Session/Handoff：当前任务；完成后更新现有整体优化 Handoff

## 收口条件

只有 T01—T05 的实际检查全部写入 Record 后，本 Task 才能在声明范围标记 `verified`。GA4/GSC、Evidence/Gap 人工决定、外部发布、Technical Retest、M5/M6/M7 和 Git/远端动作仍保留独立门禁。
