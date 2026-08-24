---
title: M2–M4 整体优化与 M5 进入门 Handoff
status: proposed
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ d1b2b6ce043664c8b3d97a14711605059794810e
source:
  - docs/records/2026-08-24-m2-contract-provenance-kernel-record.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
  - docs/records/2026-08-24-m3-business-object-approval-record.md
  - docs/records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - "2026-08-24 当前用户指令：M4 完成后制定 M2–M4 里程碑整体优化 Handoff；优化点视为进入 M5 的阻塞点"
scope: M2–M4 已验证事实、整体优化候选、M5 离线设计门与真实消费者平台采集门
---

# M2–M4 整体优化与 M5 进入门 Handoff

## 1. 交接结论

M2–M4 的本地工程链已在当前工作树通过各自 Record 所列门禁。M4 新增的本地离线能力可以从 approved M3 输入运行到 Site/Research Evidence、Finding/Gap、单 Asset Proposal、draft Adoption/Publication 和 Technical Retest；合成全链不等于 MyyShop 真实诊断或真实发布。

本 Handoff 识别出进入 M5 前必须先定稿的 P0 事项，也列出可以随 M5 实施的 P1 和非阻塞 P2。它不是整体重构批准，不是 M5 SDD 批准，更不是任何真实平台采集授权。

结论分两层：

1. M5 Requirement/PRD/Architecture/Spec/Plan/Task 的离线起草可以在新的明确任务中开始；当前用户指令没有批准该工作。
2. M5 代码实现和真实消费者 UI 采集不得直接开始。P0 合同、依赖、权限、隐私、恢复和可比性门尚未批准；ChatGPT、Gemini、Perplexity、Google AIO、Claude 等真实入口也没有采集授权。

## 2. 当前可继承的稳定事实

- checkout：`/Users/sujingjun/geo-cowork`
- branch/HEAD：`main @ d1b2b6ce043664c8b3d97a14711605059794810e`
- remote：`main...origin/main [ahead 1]`
- 工作树：包含未提交 M4 SDD、实现、测试、Record/Handoff 和三个空 M4 派生 index；不得清理或覆盖
- M2：25/25 tests；对象、refs/index、Run lifecycle、artifact、安全与 legacy 兼容通过
- M3：10/10 tests；Owner 已批准业务对象；Query Set frozen、内部 KR published/ready；两条 Evidence warning 保留
- M4：20/20 tests；本地离线 Schema/profile/Site/Research/Proposal/人工门/Retest 通过
- 全量：67 tests、插件 54 项、MyyShop Workspace/object/trace、18 indexes 双构建、legacy 120 current/HEAD 均通过
- 插件版本：Manifest 仍为 `0.3.0`；没有 release、commit、push、PR 或部署

权威 M4 结果见 [`../records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md`](../records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md)。后续不得只凭本 Handoff 摘要跳过 Record、当前文件与运行时核验。

## 3. P0：进入 M5 实现前必须定稿

### P0-01 — M5 对象与采集合同

当前产品方案已经描述 Collector Profile 和 Answer Sample Evidence，但仓库尚无 M5 canonical SDD、Schema 或 Tool 合同。至少要先冻结：

- Collector Profile：平台、消费者入口、地区、语言、登录状态、会话状态、联网搜索状态、可见模型/模式、Query 模板版本、采样数、时间窗、设备/浏览器及 `unknown` 规则；
- Answer Sample Evidence：完整回答、Citation URL 与位置、截图、profile version、采集时间、成功/拒答/超时/无结果、人工/浏览器自动化、DOM/HTML/导出可用性；
- raw sample、review、rubric、aggregation、comparability 的对象边界和 version refs；
- 正式消费者 UI 与 API/探索性样本的强制隔离；
- 每个平台 × 每条 Query × 3 次独立样本的 stable ID、排序和失败保留规则。

这是 M5 代码实现的设计阻塞点。没有这些合同，先写 collector 会把平台细节、事实 Evidence 和评审结果混在一起。

### P0-02 — 真实采集授权、隐私与保留策略

真实 M5 采集前必须由 Owner 逐项批准：

- 具体平台和消费者产品入口；
- 账号、登录态、地区、语言、设备和网络范围；
- 是否允许浏览器自动化，人工 fallback 如何留痕；
- 页面回答、Citation、截图、DOM/HTML、账号可见信息的采集与最小化范围；
- snapshot 保留期限、脱敏规则、访问控制和删除责任；
- timeout、challenge、封禁、验证码和平台条款触发后的停止条件；
- 允许读取与允许写入的边界，默认外部写入为否。

这是所有真实平台运行的硬阻塞点。M4 开发批准和内部 Knowledge Release 都不能推导出该授权。

### P0-03 — 长任务 Run、恢复与并发

M2 Run kernel 已证明同步本地任务的 create/resume/supersede 与 artifact 语义；M4 也证明多文件合法子集可用固定 ID 重试收敛。但浏览器采集会引入页面级 checkpoint、长超时、会话失效、stale lock、人工接管和进程重启。

M5 Spec 必须先定义：

- profile-aware Run 字段和每个样本的 completed step；
- raw artifact create-only 路径、checksum 与 resume 判定；
- 超时、拒答、无结果、challenge、人工取消和系统失败的独立状态；
- 进程中断、锁遗留、重复启动和输入变化 supersede 的恢复规则；
- 故障注入和跨进程并发测试，不用“最终有文件”代替收敛证明。

这是 M5 可靠采集的工程阻塞点。不得把 M4 的短同步 Run 直接外推为浏览器长任务已验证。

### P0-04 — 不可变样本、revision 与可比性

当前 checkout 对每个 stable ID 只解析一个 canonical 当前版本；M4 用新 ID 保留 Retest 历史。M5 还要求同一 raw sample 可在新 rubric 下重评，并比较不同时间窗、Collector Profile 与 Baseline/Retest。

M5 SDD 必须决定：

- raw sample 是否永久使用唯一 ID 和 immutable checksum；
- review/rubric/aggregation 是否使用独立对象与版本，不回写 raw；
- profile 更新后哪些样本仍可比较，哪些必须明确 `non_comparable`；
- 同 ID 多 revision 是否需要仓内解析，还是以新 ID + supersedes relation 解决；
- Git 历史、Run artifact 与 canonical Markdown 各自承担什么审计责任。

这是正式 Baseline/Retest 可比性的设计阻塞点，不要求先整体重写 M2；先由 M5 Spec 选择最小可验证方案。

### P0-05 — Playwright 与平台适配边界

最终产品方案把 Playwright 选为消费者 UI collector base，但当前 `package.json` 没有该依赖，也没有浏览器二进制、平台适配器或跨宿主运行证据。进入实现前需批准：

- 是否现在引入 Playwright、精确版本与 browser 安装策略；
- collector base 与各平台 adapter 的职责；
- 可控 browser context、截图/DOM 导出、人工 fallback 和不稳定 UI selector 策略；
- 不使用 API 代替正式 UI、不让 LLM 驱动浏览器决定采样语义；
- 本地 macOS、CI 和未来三宿主中哪些属于当前验收范围。

这是 M5 collector 实现阻塞点；本 Handoff 不授权安装依赖或下载浏览器。

### P0-06 — M4 真实发布与 M5 Retest 的关系

真实 MyyShop M4 采集未授权，因此没有真实 Asset Proposal、Adoption、Publication 或发布后 Technical Retest。该事实的影响必须精确区分：

- 不阻塞 M5 离线 SDD、合成 Fixture 或 collector base 设计；
- 真实 M5 Baseline 可在单独采集授权后独立开始，不应伪装为“发布后复测”；
- M5 post-change Retest、M6 Cycle 1 以及任何“内容改动导致平台回答变化”的结论，必须等待真实 M4 Publication 证明和独立 Retest 计划。

不得为了赶 M5 而补写虚假的 M4 发布状态。

## 4. P1：建议随 M5 实施处理

| 优化项 | 当前张力 | 建议门与测试 |
| --- | --- | --- |
| 声明式 Schema/index/ref registry | M2–M4 每个类型需在多个代码表登记，M5 新类型会继续扩张 | 先写 registry 输出与现有 18 indexes 字节等价测试，再决定是否重构 |
| profile 关系辅助函数 | M3/M4 分别校验 status、exact version、Asset/KR 闭包 | 只提取有两个以上真实调用点的纯函数，保持 M2/M3/M4 红绿回归 |
| Fixture 与验收辅助 | M4 测试已分文件但仍重复构造 M3-ready graph 和 Run plan | 在不隐藏业务断言的前提下提取 M5 专用 builder；不改生产语义 |
| 文档链接检查脚本 | 当前验收使用临时只读命令 | 若 M5 文档继续增加，再建立仓库级可复现脚本并纳入 `npm test` |
| 授权 scope 对象化 | 当前授权主要记录在 Task/Record/Handoff | 先由 M5 Spec 判断是否需要 canonical authorization record；不能由工具自行扩权 |

P1 不是当前已批准修改。任何影响 M2/M3 已批准语义的重构都要先建失败测试、影响说明和独立 Task。

## 5. P2：非阻塞工具链事项

1. Skill Creator 的 `quick_validate.py` 在当前 Python 环境缺少 PyYAML，启动即失败；仓库插件 validator 已通过 54 项。后续可在独立开发工具任务中固定依赖或提供无 PyYAML fallback。
2. 文档导航与 index registry 目前人工维护；在实际漂移前不引入生成器。
3. M4 detectors 使用最小本地解析器，满足当前明示合同；多页抓取、完整 HTML/XML 解析、Crawlee 和 Unlighthouse 只有出现真实授权需求后再评估。

## 6. 不应被“优化”掉的边界

- Markdown 继续是事实源；JSON indexes 只读、可删除重建。
- Raw Evidence、Finding/Gap、Proposal、Adoption、Publication、Technical Retest、Answer Review 和业务效果继续分层。
- `blocked/unverifiable` 继续只证明采集状态；timeout/refusal/no-result 不静默丢弃。
- 两条 MyyShop `EVIDENCE_INSUFFICIENT` warning 必须保留，除非有新的、真实且获批 Evidence。
- 内部 `knowledge_release:published` 不等于外部内容、插件或生产发布。
- 不引入综合 GEO 分，不用 API 样本冒充正式消费者 UI，不从少量回答推导因果或产品战略。

## 7. 建议的下一任务顺序

### 阶段 A — 只做决策与 SDD

1. 读取本 Handoff、M4 Record、最终产品方案 §7 与 §19。
2. 建立 M5 Requirement、PRD、Architecture、Spec 0006、Plan、Task，逐项解决 P0-01 至 P0-06。
3. 明确离线 Fixture、依赖安装、真实采集、账号/隐私、外部写入、Git 和发布的独立授权矩阵。
4. Owner 批准前停止实现。

### 阶段 B — 经批准后的离线实现

1. 先写 Collector Profile、Answer Sample、raw/review 分离、3-run aggregation、comparability 与 Run recovery 的红测。
2. 只使用 `.invalid`/本地录制 Fixture 建立 collector seam；不登录真实平台。
3. 运行 M2–M4 全量回归、插件自检、index/legacy 稳定性和新的 M5 故障恢复矩阵。
4. 建立 M5 离线 Record；仍不把它当真实 Baseline。

### 阶段 C — 单独授权后的真实 Baseline

按平台逐个批准和执行；每次保留完整 profile、raw answer、Citation、截图、状态与三次独立样本。任何平台受阻都记录实际失败，不用其他平台或 API 补造。

## 8. 下一任务开场模板

```text
在 /Users/sujingjun/geo-cowork 当前 main 工作树继续；先只读核对 HEAD、remote、dirty paths、M4 Record 与本 Handoff，不清理现有修改。

本次只建立并评审 M5 Requirement、PRD、Architecture、Spec 0006、Plan 和 Task，必须逐项定稿 Collector Profile、Answer Sample/raw/review、三次采样、comparability、Run recovery、Playwright 依赖与授权/隐私门。

未经 Owner 对 M5 SDD 和具体权限另行批准：不安装 Playwright、不下载浏览器、不登录或采集 ChatGPT/Gemini/Perplexity/Google AIO/Claude，不访问真实 MyyShop 数据，不写外部系统，不 commit/push/PR/发布/部署。
```

## 9. 停止条件

遇到以下任一情况必须停止受影响阶段并请求决定：

- P0 合同存在两种会改变对象边界或采样可比性的方案；
- 需要安装依赖、下载浏览器、使用账号、验证码、代理或真实网络；
- snapshot 可能包含个人信息、账号信息或受限内容而保留/脱敏规则未定；
- 平台 UI、地区、模型或搜索状态不可控，却准备声称样本可比较；
- 想用 API、搜索摘要、单次回答或手工转述替代正式消费者 UI 样本；
- 想把 M4 Fixture、内部 KR 或 M3 warnings 解释成真实发布或效果；
- 需要修改 M2/M3 已批准语义但没有独立失败测试和 Task；
- 需要 commit、push、PR、外部写入、发布或部署而无当次授权。

## 10. 当前授权矩阵

| 动作 | 当前状态 |
| --- | --- |
| 本 Handoff 的本地建档与导航 | 已在 M4 任务范围内完成 |
| M2–M4 整体优化实现 | 未批准 |
| M5 SDD 起草 | 未批准，等待新任务 |
| M5 离线代码与 Playwright 安装 | 未批准 |
| MyyShop 真实 M4 采集/Adoption/Publication/Retest | 未批准 |
| 真实消费者平台登录与采样 | 未批准 |
| 外部写入、commit、push、PR、发布、部署 | 未批准 |

因此当前正确出口是把本 Handoff 交给 Owner 评审，而不是自动进入 M5 实现。
