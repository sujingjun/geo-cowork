---
title: M2–M4 完善度与 M5 进入门独立评审记录
status: verified
created: 2026-08-24
updated: 2026-08-25
working_directory: /Users/sujingjun/.codex/worktrees/m2-m4-m5-review-20260824/geo-cowork
baseline: detached HEAD @ 0039abb922e533c725e178e8fc279c99dcbf393e
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/workflow.md
  - docs/requirements/2026-08-23-m2-contract-provenance-kernel.md
  - docs/prd/2026-08-23-m2-contract-provenance-kernel.md
  - docs/architecture/2026-08-23-contract-provenance-kernel-architecture.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/plans/2026-08-23-m2-contract-provenance-kernel-plan.md
  - docs/tasks/2026-08-23-m2-contract-provenance-kernel.md
  - docs/records/2026-08-24-m2-contract-provenance-kernel-record.md
  - docs/requirements/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/prd/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/architecture/2026-08-24-knowledge-query-operating-system-architecture.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/plans/2026-08-24-m3-knowledge-query-operating-system-plan.md
  - docs/tasks/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
  - docs/records/2026-08-24-m3-business-object-approval-record.md
  - docs/requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md
  - docs/tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md
  - docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md
  - docs/plans/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-plan.md
  - docs/tasks/2026-08-24-m2-m4-optimization-and-myyshop-real-collection.md
  - docs/records/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-record.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-site-detector-correction.md
  - "2026-08-24 当前用户指令：独立评审 M2–M4；PASS 时只起草 proposed M5 工件，不实现或真实采集"
  - "2026-08-25 当前用户指令：持续维护信源体系，不做冷启动导入；M5 完整设计 Playwright 与真实采集"
scope: M2–M4 当前本地完善度、M5 规划/实现/真实采集进入门、P0-01 至 P0-06、持续信源与 Playwright/真实 collector 合同
---

# M2–M4 完善度与 M5 进入门独立评审记录

## 1. 结论

**进入门结论：PASS 进入 M5 规划门；FAIL 进入 M5 实现门；FAIL 进入 M5 真实采集门。**

本次 PASS 只说明 M2–M4 已有事实足以起草 M5 Requirement、PRD、Architecture、Spec 0006、Plan 与 Task，并且 Handoff 的 P0 能在 M5 proposed 合同和分段计划中得到无歧义处理。它不是 M5 SDD 批准，不授权代码、Fixture 实现、Playwright package、浏览器下载、消费者平台访问、人工 fallback 或真实 Baseline。

M2、M3、M4 的工程门均为 PASS；M3 另有独立的业务对象批准，M4 另有 11 个精确公开 URL 的真实只读执行。三者都没有形成外部内容发布、插件 release、部署或生产效果证据。M4 的 candidate Evidence、Finding、Gap、Proposal、Adoption、Publication 与 Technical Retest 继续受各自人工门约束。

## 2. 评审方法、基线与成功标准

### 2.1 独立性与基线

- 在新建隔离工作树 `/Users/sujingjun/.codex/worktrees/m2-m4-m5-review-20260824/geo-cowork` 评审，未修改既有 `/Users/sujingjun/.codex/worktrees/b496/geo-cowork` 脏工作树。
- 评审基线为 detached `0039abb922e533c725e178e8fc279c99dcbf393e`；主 checkout `/Users/sujingjun/geo-cowork` 的 `main` 在评审开始时指向同一 HEAD 且 clean。
- 本地 tracking ref 为 `origin/main @ 7de1e7b0cc475bd9ae967386598d09adaf2f4949`，基线显示相对它 ahead 4；本轮没有联网 fetch，因此不声称远端当前状态。
- 仅用锁文件已有依赖执行 `npm ci --offline --ignore-scripts`；未安装 Playwright，未运行浏览器下载脚本。
- Handoff 与旧 Record 只作为待核输入；结论来自当前 SDD、源码、Workspace 对象、raw/metadata/checksum 和本轮重跑。

### 2.2 成功标准

1. M2/M3/M4 的 Requirement、PRD、Architecture、Spec、Plan、Task、Record 与批准边界能彼此对应；
2. 当前源码和专项/全量/插件/Workspace/Knowledge/Diagnosis/trace/index/legacy/docs 门可复验；
3. 11 个公开 snapshot 的 raw、metadata、summary、checksum 和授权范围一致；
4. 工程 verified、业务人工批准、真实执行、外部发布与部署分别判定；
5. P0-01 至 P0-06 没有被 P1 重构偏好混淆；
6. M5 proposed 合同覆盖五层信源、完整分析链、五项分组指标和采集/恢复/隐私门。

范围外保持不变：不新增网络采集，不读取 GA4/GSC，不登录消费者平台，不批准 Evidence/Gap，不创建真实 Proposal/Adoption/Publication/Retest，不写外部系统，不 commit、push、PR、release 或 deploy。

## 3. M2–M4 完善度矩阵

| 里程碑 | SDD/治理状态 | 当前实现与本轮门 | 业务人工批准 | 真实执行 | 发布/部署 | 完善度判定 |
| --- | --- | --- | --- | --- | --- | --- |
| M2 Contract & Provenance Kernel | Requirement/PRD/Architecture/Spec 0003/Plan 为 `proposed`；Task/Record 为 `verified`；批准产品方案提供里程碑基线，但不能反向把这些文件改成 approved | Markdown-first 对象合同、refs/checksum、安全路径、18 个派生 index、Run create/resume/supersede/artifact、legacy adapter；25/25 专项与全量回归通过 | 不适用业务对象批准；`proposed` SDD 状态仍是治理边界 | 仅本地 Workspace/Fixture；`ops-geo` 是合成 adapter，未验证真实上游 runtime | 无 release/deploy | **工程 PASS；治理状态明确且不阻塞 M5 规划。** 不把 proposed 误报为 approved |
| M3 Knowledge & Query Operating System | Requirement/PRD/Architecture/Spec 0004/Plan 为 `proposed`；Task/工程 Record 为 `verified`；另有独立业务批准 Record | Query/Query Set/Document/Evidence/Claim/Answer Card/KR 生命周期、精确版本、trace 与 warning；10/10 专项通过；trace `lifecycle_ready:true`、`gates:[]` | Owner 已批准 M3 canonical 业务对象：formal Query、frozen Query Set、approved Document/Evidence、published Claims/Answer Card、内部 published/ready KR `1.0.1` | 业务对象状态已真实写入本地 Workspace；不是外部平台执行 | 内部 KR `published` 不等于内容/插件/生产发布；无 deploy | **工程与已记录业务批准 PASS。** 两条证据充分性 warning 必须保留 |
| M4 Diagnosis, Site & Asset Proposal | Requirement/PRD/Architecture/Spec 0005/原 Plan 为 `approved`；Task/工程 Record 为 `verified`；公开采集另有 approved Decision/Plan 与 verified Record | Schema/profile、Site/Research、三类 Gap 前置、Proposal/人工门/Retest、公开 collector/input bridge；27/27 专项通过 | 11 份新 Evidence 仍为 candidate；7 条当前技术 Finding 未被人工提升为 Gap；无 Proposal/Adoption/Publication/Retest | **有**：只覆盖获授权的 11 个 MyyShop 公开 URL；11 raw + 11 metadata + 1 summary，五页 Site Run 与一组 Research Run | 无真实内容发布、插件 release、deploy 或效果 | **离线工程与已授权公开读取 PASS。** 业务采用、发布和效果仍未发生，但不阻塞 M5 规划/Baseline 设计 |

### 3.1 M2 证据与剩余边界

- `object-contract.mjs`、`index-builder.mjs`、`run-store.mjs` 和专项测试共同证明 M2 合同；连续重建没有改写 canonical Markdown。
- 69 个当前 canonical 对象、120 条 legacy knowledge 和 18 个 index 的当前关系稳定；Markdown 是事实源，JSON 仍为可重建派生物。
- 剩余边界：M2 SDD 未获人工批准；没有真实 `ops-geo` 兼容运行；长浏览器任务的 lease/checkpoint 不属于 M2 已验证范围。

### 3.2 M3 证据与剩余边界

- 当前 formal Query 与 frozen Query Set 的版本均为 `1.0.1`，Query Set hash 为 `8a12a16bd2bc4d3e5a4934cd8be17dba28e2cbc57f3d29d0f1d7032dcfd7fe3f`。
- Knowledge validate 只有两条预期 `EVIDENCE_INSUFFICIENT`：Audience Claim 缺 `first_party`；Lifecycle Service Claim 缺 `first_party` 与 `data_or_case`。
- 本轮 11 条 M4 一方 Evidence 仍为 candidate，不能清除 M3 warning，也不能静默改版 Claim/KR。
- 剩余边界：M3 SDD 未获人工批准；内部 `published/ready` 只说明本地正式知识包；无消费者平台或外部发布证据。

### 3.3 M4 证据与剩余边界

- [`../../workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md`](../../workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md) 只授权一个 origin 下 11 个精确公开 URL；当前 raw 目录与输出 summary 没有扩展 sitemap 或登录范围。
- 11 个 raw 的 SHA-256 和 byte length 同时匹配各自 metadata；summary 的 11 个 item 与 metadata 字节语义一致；summary SHA-256 为 `128f2c407f2d93f21a5f526bb38e72991737eb1481b61d12b5f1a6e2fe740ef2`，plan fingerprint 为 `0b813aa643e74272302f7d0702c2185332ebf83121f2e65c9d3577951e8c103e`。
- 五页当前 Site 结果：For Creators、MyyFinds 为 9/9 pass；首页缺 canonical 且 crawlability fail；About 缺 canonical、heading 且 crawlability fail；Brand Deals 缺可接受 canonical 且 crawlability fail。
- 10 条 Finding 中，7 条属于当前 v1.0.2 站点事实，3 条是旧 detector 修复历史；不得把总数直接解释成 10 个当前问题。
- Diagnosis validate 的 11 条 `INDEPENDENT_SUPPORT_MISSING` 对应 11 份第一方 candidate Evidence，符合“第一方公开原文不等于独立验证”。
- 剩余边界：没有人工批准这些 Evidence，没有 confirmed Gap、真实 Proposal、Adoption、Publication、Technical Retest、GA4/GSC、消费者平台 Sample 或业务效果。

## 4. Handoff P0-01 至 P0-06 判定

| P0 | 判定 | 当前证据 | 对 M5 的门 |
| --- | --- | --- | --- |
| P0-01 M5 对象与采集合同 | **可在 M5 计划内解决** | proposed Spec 0006 已分离 Collector Profile、Answer Sample、Citation Observation、Source Classification、Claim Support Review、Answer Review、Answer Aggregation，复用 Source registry，并冻结三次采样、Source identity/lifecycle 与分析链；Source 候选只能来自真实 Citation | 规划 PASS；Spec 未批准前实现 FAIL |
| P0-02 真实采集授权、隐私与保留 | **可在 M5 计划内解决** | proposed Spec/Plan 已冻结逐平台授权字段、最小化、保留、访问、删除、停止条件和外部写入为否；当前矩阵所有消费者平台均未授权 | 规划 PASS；每个真实平台仍是独立硬阻塞，不能继承 M4 官网授权 |
| P0-03 长任务 Run、恢复与并发 | **可在 M5 计划内解决** | proposed Spec 定义 sample step、lease/heartbeat/expiry、stale 接管、未知提交状态 `waiting_human`、半成品恢复、故障注入和 input supersede | 规划 PASS；未实现和故障验证前 collector 实现 FAIL；无需先重写 M2 |
| P0-04 不可变样本、revision 与可比性 | **可在 M5 计划内解决** | 选择最小方案：raw/sample create-only；实质修订使用新 ID + `supersedes_ref`；Review/Aggregation 独立；comparability 为 `true/partial/false` 且 `unknown` 不作通配符 | 规划 PASS；Schema/profile/指标红绿测试未完成前实现 FAIL |
| P0-05 Playwright 与平台适配边界 | **可在 M5 计划内解决** | proposed Architecture/Spec/Plan 完整冻结 Fixture seam、Playwright base 输入/输出、隔离 context、allowlist、版本化 selector/终态、artifact 最小化、五个平台 adapter、真实 `collect` 和人工 fallback；package 安装和 browser binary 下载是两个独立门 | 设计 PASS；当前未核验 exact version 且明确不安装，因此浏览器实现/真实采集 FAIL |
| P0-06 M4 发布与 M5 Retest | **已满足** | 当前无 M4 Publication/Technical Retest；合同明确 Baseline 可独立授权开始，`post_change_retest` 必须引用 confirmed Publication 与对应 Technical Retest Run | 边界清晰；不阻塞 M5 规划或未来 Baseline，但硬阻塞 post-change Retest |

Handoff 的声明式 registry、profile helper、Fixture helper 属于 P1。它们没有阻断当前 M2–M4 回归或 M5 最小纵切，故**不构成 M5 规划硬阻塞**；若未来有真实重复/漂移证据，再以独立红测和 Task 处理。

## 5. M5 五层信源与指标合同评审

结论：**对规划门充分；对实现门尚未验证。** proposed 工件已经覆盖用户要求的最小语义，不需要静态综合域名榜来补合同。

| 要求 | proposed 合同 | 评审 |
| --- | --- | --- |
| 五层信源 | `official_fact`、`institutional_authority`、`independent_professional`、`community_experience`、`content_distribution`；允许副标签但只有一个主标签，另存 `party_relation` | 覆盖；按 Source identity、具体页面、生产主体和内容形态分类，host/domain 本身不能自动定类 |
| 分析链 | Query/version → Sample.platform + Query.intent → Citation domain → Source identity → Source Classification → Claim Support Review | 覆盖；任一必需边缺失返回 `ANALYSIS_CHAIN_INCOMPLETE`；无 Citation 回答仍进入状态计数 |
| 聚合切面 | industry、platform、query cluster、time window | 覆盖；Aggregation 固定精确 Query/Profile/Sample/Citation/Review refs |
| Top Citation Domains / Citation Share | Citation occurrence 全保留；聚合按 `(sample_ref, url_normalized)` 去重；count 降序、域名升序 | 覆盖；零分母为 `null + NO_CITATIONS` |
| Source Diversity | 已知主类型数、域名数、classification coverage、五类归一化熵 | 覆盖；未知分类不会被隐藏，coverage 不足标 partial |
| First-party vs Third-party Ratio | party relation 独立于五层类型；输出 first/third/unknown count/share/coverage 与 ratio | 覆盖；third-party 为零时 ratio 为 null，不写无穷大 |
| Source Volatility | 只比较同 industry/platform/query cluster 且 `comparable:true` 的相邻非重叠窗口；主公式为域名 share 的 total variation distance | 覆盖；无 Citation 或不可比时为 null + reason |
| 外部榜单/域名表 | 不定义 import Schema、CLI、adapter、materializer 或候选生成路径 | 覆盖；唯一 Source 候选发现入口是获授权真实 Run 的 Citation Observation |

仍需后续人工/实现验证的不是对象边界歧义，而是：Spec/Plan 批准、行业与 Query Cluster 的 MyyShop 实例值、Source identity/分类 rubric 与人工抽检、指标手算 Fixture、精确 Playwright package/version、浏览器缓存/宿主范围和逐平台隐私授权。它们因此阻塞实现或真实采集，不阻塞本次 proposed 计划成立。

## 6. 本轮实际命令与结果

所有命令均在评审隔离工作树执行；除派生 index 的可重建写入和本次 Markdown 工件外，没有业务对象写入。

| 命令/检查 | 结果 |
| --- | --- |
| `npm ci --offline --ignore-scripts` | 仅安装 lockfile 中 15 个现有 package，0 vulnerabilities；没有 lifecycle script、Playwright 或浏览器下载 |
| `npm run test:m2-contract` | 25/25 通过 |
| `npm run test:m3-knowledge-query` | 10/10 通过 |
| `npm run test:m4-diagnosis` | 27/27 通过 |
| `npm test` | 75/75 通过，71 个顶层 subtest；无失败、跳过或取消 |
| `npm run validate:plugin` | `ok:true`，60 个检查路径 |
| `npm run check:docs` | 起草前基线为 53 个 Markdown、92 个本地链接、0 errors；本次文档完成后再次通过，最终数量见 §8 |
| `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects` | `ok:true`；missing/errors/object_errors/warnings 为空 |
| `node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop` | errors 为空；仅两条预期 `EVIDENCE_INSUFFICIENT` |
| `node plugins/geo-expert/scripts/knowledge-query.mjs trace --workspace workspaces/myyshop --query Q-MYYSHOP-WHAT-IS-001` | `lifecycle_ready:true`、`gates:[]` |
| `node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop` | errors 为空；11 条预期 `INDEPENDENT_SUPPORT_MISSING` |
| `node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop` 连续两次 | 每次 69 canonical、120 legacy、18 indexes、warnings 为空；build 前/第一次/第二次 index 聚合 hash 均为 `9046d9a3589b44b4a6c28f20f4c656c14d250d0afe02868d7e252c9fd7712a15` |
| Workspace 全部 Markdown 前后聚合 | 均为 `88258ffebe3ac6a80eaf5f14c3f17e2f8e9207ec7ed69f26439fbdab4419f1d9`，证明最终 `STATUS.md` 落盘后两次 index 重建未改 Workspace Markdown |
| legacy current 与 `HEAD` 对比 | 各 120 条，聚合 hash 均为 `ddaab9c77a399ffcc3b3626e9308e7574469205cf5784c019540ec0c58ef65f8`，路径/字节 mismatch 为 0 |
| 本地只读 collection verifier | 11/11 raw SHA、bytes、status/media 与 metadata/summary 一致；无 redirect、禁止 metadata key 或 expectation failure |

collection verifier 读取：

```text
workspaces/myyshop/runs/RUN-MYYSHOP-M4-PUBLIC-COLLECTION-20260824/raw/public-site/
workspaces/myyshop/runs/RUN-MYYSHOP-M4-PUBLIC-COLLECTION-20260824/outputs/public-site-collection.json
workspaces/myyshop/runs/RUN-MYYSHOP-M4-PUBLIC-COLLECTION-20260824/inputs/public-site-collection-plan.json
```

本轮没有执行 `collect:m4-public`、任何浏览器命令、网络 URL、GA4/GSC 或消费者平台命令。

## 7. 条件式 M5 proposed 工件

依据 PASS 规划门，已起草且保持 `proposed`：

1. [`../requirements/2026-08-24-m5-consumer-answer-testing.md`](../requirements/2026-08-24-m5-consumer-answer-testing.md)
2. [`../prd/2026-08-24-m5-consumer-answer-testing.md`](../prd/2026-08-24-m5-consumer-answer-testing.md)
3. [`../architecture/2026-08-24-consumer-answer-testing-architecture.md`](../architecture/2026-08-24-consumer-answer-testing-architecture.md)
4. [`../specs/0006-consumer-answer-testing.md`](../specs/0006-consumer-answer-testing.md)
5. [`../plans/2026-08-24-m5-consumer-answer-testing-plan.md`](../plans/2026-08-24-m5-consumer-answer-testing-plan.md)
6. [`../tasks/2026-08-24-m5-consumer-answer-testing.md`](../tasks/2026-08-24-m5-consumer-answer-testing.md)

这些文件冻结合同和后续分段门，不创建 M5 Schema、Tool、Skill、Run、Sample 或真实 Workspace 对象。

## 8. 最终复核与 Git 边界

本轮文档全部落盘后的复核结果：

- M2/M3/M4 专项仍为 25/10/27，全量仍为 75/75，插件 validator 仍为 `ok:true`、60 个路径；
- `npm run check:docs` 为 60 个 Markdown、109 个本地链接、0 errors；独立 doc-links test 为 1/1；
- Workspace validate 仍为 `ok:true`；Knowledge 仍只保留 2 条预期 warning；Diagnosis 仍只保留 11 条预期 warning；trace 仍为 `lifecycle_ready:true`、`gates:[]`；
- 最终 index build 前/第一次/第二次 hash 均为 `9046d9a3589b44b4a6c28f20f4c656c14d250d0afe02868d7e252c9fd7712a15`；Workspace Markdown 前后 hash 均为 `88258ffebe3ac6a80eaf5f14c3f17e2f8e9207ec7ed69f26439fbdab4419f1d9`；
- legacy current/HEAD 仍为 120/120、相同 hash、0 mismatch；collection verifier 仍为 11/11、0 mismatch；
- `git diff --check` 通过。

交付工作树保持 detached `0039abb922e533c725e178e8fc279c99dcbf393e`，不 commit；Git 状态为 3 个已跟踪 Markdown 修改和 7 个新增 Markdown，均限于本 Review、六份 proposed M5 工件、导航与 MyyShop `STATUS.md`。未执行 push、PR、release、deploy 或外部写入。

## 9. 后续人工决定

1. 审阅六份 M5 proposed 工件；如需修改对象边界或指标公式，先改上游 Requirement/PRD/Spec，再决定是否批准。
2. 只有 SDD 获批且另有离线实现授权，才可执行 Task T02 及以后；Review PASS 不能替代批准。
3. Playwright package/version 与浏览器 binary 各自建立决定；当前没有默认选择。
4. 每个平台单独批准入口、账号/登录态、自动化/人工方式、artifact、隐私、保留和停止条件；缺任一项保持 blocked。
5. M4 Evidence/Gap/Proposal/Adoption/Publication/Technical Retest 仍走独立人工链；不得为 M5 补写业务事实。

## 10. 2026-08-25 M5 设计修订附记

Owner 在本评审完成后进一步明确：持续信源体系不做冷启动榜单导入，M5 必须完整设计 Playwright 与真实消费者平台采集。六份 proposed M5 工件和已批准最终产品方案已按该决定同步，修订与复验证据见 [`2026-08-25-m5-source-system-and-collector-design-record.md`](2026-08-25-m5-source-system-and-collector-design-record.md)。

本 Record §8 的“不 commit”是 2026-08-24 独立评审当时的实际 Git 边界；之后 Owner 另行授权本轮文档 commit 与本地合入 `main`。该后续授权不改变原评审的门结论：M5 规划/设计门 PASS，实现门和真实采集门仍 FAIL。
