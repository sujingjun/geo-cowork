---
title: Consumer Answer Testing 与持续信源体系架构
status: approved
created: 2026-08-24
updated: 2026-08-25
source:
  - docs/prd/2026-08-24-m5-consumer-answer-testing.md
  - docs/architecture/2026-08-23-contract-provenance-kernel-architecture.md
  - docs/architecture/2026-08-24-knowledge-query-operating-system-architecture.md
  - docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md
  - "2026-08-25 当前用户指令：持续维护信源体系，不做冷启动导入；完整设计 Playwright 与真实采集"
  - "2026-08-25 当前用户指令：批准 M5 里程碑方案设计，并实施计划，完成目标"
  - "2026-08-25 当前用户指令：Playwright 使用最新版并全局安装；五个平台统一授权 Owner Google 登录身份，按真实用户隐私，本地 artifact 保留 1 年"
scope: M5 Profile、Playwright/真实采集、不可变 raw、持续 Source registry、Citation/Review、聚合与平台边界
---

# Consumer Answer Testing 与持续信源体系架构

## 1. 目标形态

```text
Host Agent Loop
      │
      └── geo-answer-cycle（编排、授权检查与人工停门）
              │
              ├── Collector Profile registry
              ├── Sample plan + long-running Run coordinator
              ├── Consumer UI collector seam
              │      ├── recorded/local fixture adapter
              │      ├── Playwright base（设计冻结；安装另设依赖门）
              │      └── platform adapters（逐平台授权后）
              ├── Citation normalization + Source identity matching
              ├── persistent Source registry + candidate classifications
              ├── Answer/Claim support review
              └── deterministic aggregation
                      │
                      ▼
Markdown Workspace（canonical metadata）
      ├── Collector Profile
      ├── Answer Sample
      ├── Citation Observation
      ├── Source（复用 M2 registry）
      ├── Source Classification
      ├── Claim Support Review
      ├── Answer Review
      ├── Answer Aggregation
      └── runs/<run-id>/raw|outputs（immutable bytes）
```

Host 负责采样目标、语义 Review 和人工门；Collector 只操作获授权的消费者入口；确定性 Tool 负责状态、checksum、域名/Source identity 规范化和指标；Workspace 负责长期可追溯事实。M5 不新建 Agent Runtime、数据库、队列或外部榜单导入子系统。

## 2. 对象职责

| 对象 | 职责 | 不得替代 |
| --- | --- | --- |
| Collector Profile | 冻结平台上下文与采样条件 | 账号凭据、运行授权或答案 |
| Answer Sample | 记录一个 sample slot 的终态及 raw artifact checksums | Review、聚合或事实批准 |
| Citation Observation | 保存一次引用出现位置、URL、规范化域名和 `source_ref` | 来源类别或 Claim 支撑结论 |
| Source（既有） | 持久化由真实 Citation 首次发现的域名/发布者/频道/页面身份 | 权威等级、Classification 或 Claim 支撑 |
| Source Classification | 保存绑定 Source 的五层主/副标签、依据与 revision | Citation raw、Source identity 或 Claim Support Review |
| Claim Support Review | 判断某 Citation 是否支持某 Claim | Source Type 或 Answer 总体 Review |
| Answer Review | 按 rubric 评估一个 Sample | raw、平台采集事实或业务批准 |
| Answer Aggregation | 锁定输入版本并计算跨样本指标 | raw、Review 或统一 GEO 分 |
| Run | 编排 sample slots、checkpoint、lease、恢复和 supersede | 平台业务结果或 Sample 终态 |

## 3. 数据流与写入模型

```text
approved M3 inputs + authorized Collector Profile
  → fixed three-slot sample plan
  → consumer UI attempt
  → create-only raw artifacts
  → immutable Answer Sample
  → Citation Observations
  → match/create Source identity
  → Source Classifications + Claim Support Reviews
  → Answer Reviews
  → version-pinned Answer Aggregation
```

写入顺序以 raw 为第一事实：先写 create-only bytes 和 checksum，再写 Sample metadata；后续对象只引用，不回写 raw。进程在两步之间中断时，恢复逻辑验证已存在 bytes 后补齐 metadata；内容不一致立即冲突。

新 Citation 与首次发现 Source 有双向 ref，因此使用单个 materialization plan 预分配 CIT/SRC ID、预生成 bytes/checksum 并在内存中校验闭包，再在同一 lease 下 create-only 写入。这是逻辑事务，不声称文件系统多文件原子性；中断后仅可按原 plan 与 checksum 补齐，两个对象未闭合前 Run step 不完成。

## 4. 不可变 revision 策略

M5 不要求先重写 M2 的“一个 stable ID 一个当前版本”解析方式，采用最小可验证策略：

1. 每个采集尝试使用新的 Answer Sample ID；raw bytes 永不原地改版。
2. Profile、Classification、Claim Support Review、Answer Review 和 Aggregation 的实质变化创建新 ID，并用 `supersedes_ref` 关联旧对象；旧对象继续留在 graph。
3. 对象内部仍有 `version`，但跨时间比较只认精确对象 ID、version 与 checksum，不依赖 Git 找回旧内容。
4. Git 负责仓库变更历史；Run artifact 负责原始字节；canonical Markdown 负责当前可查询的审计关系，三者职责不混用。

## 5. Collector 与平台 adapter

### 5.1 Collector seam

Collector 输入是 Profile、Query/version、sample ordinal、artifact plan 和授权决定；输出只包含终态、raw artifact descriptors、Citation 原始位置和结构化 diagnostics。Collector 不做 Source identity 决策、Source 分类、Claim 支撑或聚合。

离线实现先使用本地录制 Fixture adapter。Playwright base 的接口和运行模型在本架构中完整冻结；只有 package/version、安装方式和浏览器下载获得单独批准后才加入依赖并执行。平台 adapter 再按入口逐个批准。API 不实现正式 Sample adapter。

Playwright base 为每个 sample attempt 创建独立 browser context，不复用对话状态；从 Collector Profile 设置 locale、viewport 和允许控制的上下文参数。base 只提供获授权入口导航、版本化 selector 调用、终态等待、答案/Citation 区域提取、截图/DOM/HTML 最小化、artifact checksum、timeout/challenge/cancel diagnostics 和 context 关闭。它不自由浏览、不修改 Query、不跨入口、不执行外部写入，也不让 LLM 决定点击与终态。

### 5.2 平台差异

ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews、Claude 各自拥有独立 adapter。adapter 只声明允许入口、登录/搜索/模式可见状态、版本化 selector、提交动作、终态 detector、Citation 提取和平台诊断；平台名称、状态和三次采样语义由 Spec 0006 共享。选择器失效必须 fail loud，不能退化为 API、搜索摘要或另一个平台。

人工 fallback 只在平台授权明确允许时使用，仍输出同一 Sample/raw/Citation 合同并记录操作角色、步骤和 `collection_method:manual`；不得手工概述替代完整回答。自动与人工方式不同时 comparability 最高为 `partial`。

## 6. 长任务与恢复

Run coordinator 为每个 sample slot 保存：

```text
profile_validated
→ authorization_checked
→ session_prepared
→ query_submitted
→ terminal_state_observed
→ raw_artifacts_written
→ sample_metadata_written
→ citation_source_plan_frozen
→ citations_and_sources_materialized
→ candidate_classifications_materialized
```

- lease 使用固定 scope key、owner、heartbeat 与 expiry；过期后才允许恢复者接管。
- 任何可能重复提交 Query 的恢复必须停在人工确认或创建新 attempt，不凭“文件存在”猜测平台动作未发生。
- 每个 step 的完成证明包含 artifact checksum 或 canonical ref。
- Citation/Source 双向 ref 的任一半成品都由冻结 materialization plan 补齐；无 plan、ID/checksum 漂移或已存 bytes 冲突时失败而不重生。
- 取消保留全部已写 artifact 和 slot 状态；不删除历史。
- 输入 fingerprint 覆盖 Query/Profile/模板/collector/tool policy/schema 版本；变化时 supersede 旧 Run。

## 7. 持续信源体系

Citation URL 先规范化为：协议与 hostname 小写、国际域名 ASCII 化、默认端口移除、fragment 删除、路径和 query 保留；`citation_domain` 使用去除单个前导 `www.` 的完整 hostname，不依赖未经固定版本的公共后缀推断。

每次引用出现创建 Citation Observation；聚合以 `(sample_ref, normalized_url)` 去重。Citation 必须匹配一个既有 Source，或以首次 Citation 为 provenance 创建 Source。identity key 区分域名、宿主平台、发布者/频道和具体页面；YouTube、Reddit、LinkedIn 等宿主域名不能自动决定发布者或 Source Type。

新 Source 同时创建 candidate Source Classification；后续 Observation 继续引用相同 identity，分类变化创建新 ID + `supersedes_ref`。Source Classification 按当前页面/生产主体/内容角色选择一个主类型和零到多个副标签；Claim Support Review 以 `supported | partially_supported | not_supported | unverifiable` 记录结论、引用片段和理由。

first seen、last seen、出现平台、Query Cluster、时间窗和 observation count 全部由不可变 Citation 派生。`Source.status` 只控制 registry 生命周期，不表达权威、Evidence 批准或 Claim 支撑。外部综合榜、静态域名表和历史排名没有导入 adapter、Schema 或 candidate materializer。

## 8. 聚合与可比性

Aggregation 输入固定为 Query refs、Profile refs、Sample refs、Citation refs、Source refs、Classification refs、Claim Support Review refs、Answer Review refs 与 rubric checksum。聚合器只计算 Spec 0006 冻结公式，并输出新出现、重复出现、candidate/reviewed/unresolved Source 维护信息；不存在外部榜单输入。

比较器先做字段级 diff，再输出 `true/partial/false` 和 notes。关键 `unknown` 只允许 `partial`；入口、地区、语言、登录/搜索状态、Query/模板、正式协议或样本集合的硬差异直接为 `false`。

## 9. 隐私与安全

- Profile 只保存状态枚举，不保存账号标识或凭据。
- Collector 不持久化 cookie、Authorization、local/session storage、密码或环境变量。
- 截图和 DOM 默认裁剪到答案与 Citation 区域；账号 chrome 无法可靠去除时不保存该 artifact。
- 每个真实平台授权决定必须冻结 artifact 类型、保留期、访问角色和删除责任；缺失时 Run blocked。
- 外部写入始终为否；M5 只读采样不包含消息、点赞、评论、表单或设置修改。

## 10. M4 与 M6 边界

M5 Baseline 可在独立采集授权后开始，不要求 M4 已发布。`post_change_retest` 必须引用 confirmed M4 Publication 和对应 Technical Retest Run；M5 只观察消费者回答变化。GA4/GSC、流量、注册和 Cycle 结论属于 M6，不进入 M5 聚合。

## 11. 当前授权边界

本架构已由 Owner 批准，并授权 T02—T08、本机全局 `playwright@1.62.1`、五个平台 Owner-controlled Google 登录角色、隐私最小化和本地 artifact 365 天保留。浏览器策略为复用已兼容的本机 Chrome for Testing 缓存，不下载新 binary。平台 adapter 必须先执行 Terms/robots gate；当前五个平台自动执行均未获条款许可。外部写入、commit、push、PR 或发布仍未授权。
