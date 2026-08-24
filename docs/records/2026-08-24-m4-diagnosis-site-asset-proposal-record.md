---
title: M4 Diagnosis, Site & Asset Proposal 验收记录
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ d1b2b6ce043664c8b3d97a14711605059794810e
source:
  - docs/requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md
  - docs/tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权；完成后制定 M2–M4 整体优化 Handoff"
scope: M4 本地离线 Schema、profile、Tool、Skills、脱敏 Fixture、回归、Workspace 派生索引与整体优化交接
---

# M4 Diagnosis, Site & Asset Proposal 验收记录

## 1. 验收结论

M4 本地离线工程范围已验证：六份 SDD 已获 Owner 批准；M4 Schema/profile、五个 Skills、`diagnosis.mjs`、Site/Research manifest、九项确定性 detector、三类 Gap 前置、Asset Proposal、draft Adoption/Publication、Proposal trace 与 Technical Retest 已实现；脱敏 `.invalid` Fixture 覆盖正常、非法、边界、幂等、并发、冲突、中断恢复和完整阶段链。

本 Record 的 `verified` 只覆盖当前工作树源码、脱敏 Fixture、现有 MyyShop 工作区的只读兼容校验与派生 indexes。它不表示已经采集 MyyShop 真实站点、账号、社区、竞品、生成式平台、GA4 或 GSC，也不表示存在真实 Gap、Proposal、Adoption、Publication、Technical Retest、消费者平台改善或业务效果。

真实 MyyShop 采集在本任务中始终未获授权且未执行；未调用浏览器、付费模型或第三方 API，未写外部系统，未发布新插件版本，未执行 commit、push、PR、merge、部署或发布。

## 2. 基线、工作树与授权

- 工作目录：`/Users/sujingjun/geo-cowork`
- 分支与 HEAD：`main @ d1b2b6ce043664c8b3d97a14711605059794810e`
- 远端关系：`main...origin/main [ahead 1]`
- 开工状态：工作树已有用户保留的 M3 收口改动和 M4 SDD 草案；本任务没有覆盖、清理或提交这些改动
- 收口状态：M4 实现、测试、Record、Handoff 与三个可重建 index 仍在本地脏工作树
- Runtime：Node `v22.14.0`，npm `10.9.2`
- 依赖：`ajv@8.20.0`、`gray-matter@4.0.3`；没有新增 Runtime 依赖

Owner 的批准只开放 M4 本地离线实现和本 Record/Handoff。真实采集、业务决定、外部写入、插件发布、Git 远端动作与部署仍各自需要当次明确授权。

## 3. 实际变更

### 3.1 对象契约与索引

- 新增 `m4-record-types.schema.json`，注册 `asset_proposal`、`adoption_record`、`asset_publication`，并为 Finding、Asset、Evidence、Evidence Plan、Run 增加 M4 可选扩展。
- `object-contract.mjs` 最小注册 M4 Schema；历史 M2/M3 最小对象不被反向要求 M4 字段。
- `diagnosis-profile.mjs` 校验三类 Gap、Evidence 证明范围、Asset/KR 精确关系、Proposal、Adoption、Publication、Retest 与人工门。
- `index-builder.mjs` 增加三类 index、M4 refs 与 version refs；MyyShop 只新增三个空派生 index，不创建任何真实 M4 业务对象。

### 3.2 确定性 Tool

- `site-audit.mjs` 只读取显式、带 SHA 的本地 manifest；九项 detector 分别返回稳定 code/version 和 `pass/fail/blocked/unverifiable`，不联网、不输出综合 GEO 分。
- Site Evidence 按 detector 选择对应 snapshot 和 `proof_scope`；Site Run 保存完整九项结果、规则版本与 manifest 指纹。某项缺少自身 snapshot 时只记录 `unverifiable/collection_failure`，不借用其他快照证明该项结论。
- robots 使用通用组的最长匹配规则，同长度时 `Allow` 优先；sitemap 先检查基本可解析结构再核对 `<loc>`；HTTP header 名按大小写不敏感处理。
- `research-input.mjs` 分离访问状态、原文状态、支持类别、独立支持、反证、置信度与 Evidence proof scope；阻断页不能标成已取得目标原文。
- `asset-proposal.mjs` 只物化 Host 显式给出的完整 body/items；使用 create-only 与按唯一键排序的短时互斥处理并发，锁后重新加载实际对象决定 `kept` 或冲突。
- `prepare-adoption` 与 `prepare-publication` 只创建 draft template；`technical-retest` 新建 Evidence/Finding/Run，不改旧 Finding。

### 3.3 插件包装与文档

- 新增 `geo-diagnosis-cycle`、`geo-site`、`geo-reputation`、`geo-competitor`、`geo-content` 五个 Skill。
- 新增 Proposal、Adoption、Publication 三个模板与 `diagnosis.mjs` CLI。
- 更新插件自检、README、CHANGELOG、package scripts 与文档导航；插件 Manifest 仍为 `0.3.0`，本次是未发布源码变更。

## 4. 失败测试与修复轨迹

| 阶段 | 首次实际失败 | 最小修复 |
| --- | --- | --- |
| M4 开工红测 | 三个测试文件因 `asset-proposal.mjs`、`diagnosis-profile.mjs`、`site-audit.mjs` 不存在而 `ERR_MODULE_NOT_FOUND` | 先建立最小模块边界，再逐条实现 Schema/profile/Tool |
| 初始纵切 | trace 括号语法、Fixture `finding_code`、stable ID 下划线、Proposal body checksum 与 Site Evidence ID 先后失败 | 逐项修正语法、Fixture 合同、ID、gray-matter body hash 与 Evidence profile；没有降低断言 |
| 并发与 detector 加强 | 15 场景中 2 项失败：同一 Proposal 唯一键并发写出两份；robots 忽略 `Allow` 最长匹配 | 增加按唯一键互斥并在锁内重读 graph；实现 robots 分组与最长匹配 |
| 关系与证据范围加强 | 17 场景中 4 项失败：跨 Asset/KR Content Gap、Publication 三方错配、坏 sitemap、blocked 原文被接受 | 增加 M4 profile 关系闭包、Evidence scope、sitemap 结构和 research 状态约束 |
| 回归中发现 profile 触发过宽 | Site Evidence 的 `proof_scope` 被误当 Research profile 标记，导致 CLI 与 profile 测试失败 | Research profile 改由 research 专属字段触发；Site/Research Evidence profile 保持分层 |
| provenance 复核 | captured 页面缺少 robots/sitemap detector snapshot 时，Evidence 仍继承整体 `captured` | collection state 改由单项 detector 结果决定；写入前校验 Evidence/Finding/Run，Run 固化完整结果与 manifest 指纹 |

最终 M4 专项为 20/20，通过的断言保留了上述所有回归场景。

## 5. 实际验证结果

| 命令 | 退出码 | 实际结果 |
| --- | ---: | --- |
| `npm run test:m4-diagnosis` | 0 | 20/20 通过；含九项 detector 矩阵、detector 独立 snapshot/Run 指纹、三类 Gap、Evidence scope、并发唯一键、幂等/冲突/中断恢复、合成全链与 resolved/persistent Retest |
| `npm run test:m2-contract` | 0 | 25/25 通过；M2 parser/index/Run/security/concurrency 回归未破坏 |
| `npm run test:m3-knowledge-query` | 0 | 10/10 通过；M3 lifecycle、版本、批准、trace 与 warning 回归未破坏 |
| `npm test` | 0 | 67 tests 全部通过，63 个顶层 subtest；无失败、跳过或取消 |
| `npm run validate:plugin` | 0 | `ok:true`，54 个 Manifest、Skill、模板、Schema、CLI、运行库与依赖检查路径通过 |
| `workspace-validate --objects` | 0 | MyyShop `ok:true`；missing/errors/object_errors/warnings 均为空 |
| `knowledge-query validate` | 0 | errors 为空；仅保留两条既有 `EVIDENCE_INSUFFICIENT` warning |
| `knowledge-query trace --query Q-MYYSHOP-WHAT-IS-001` | 0 | `lifecycle_ready:true`、`gates:[]`；M3 关系闭包保持完整 |
| `diagnosis.mjs validate --workspace workspaces/myyshop` | 0 | errors/warnings 均为空；没有真实 M4 对象被偷偷创建 |
| `build-index` 连续两次 | 0/0 | 两次均为 13 canonical、120 legacy、18 indexes；聚合 SHA 均为 `bcd9cc886fffe64def28748b0e92c5dec0823b7af69e4bd0d5eb2dd6d73a40ed` |
| legacy current/HEAD | 0 | 120 条；“路径 + NUL + 原始字节”聚合均为 `fb9d551a78812b74e2a1747d57a2563deb4067bfd24225ade38aa5ae2cb1ecae`；`git diff --quiet` 为 0 |
| `npm ls --depth=0` / `npm audit --omit=dev` | 0/0 | 仅两个锁定依赖；`found 0 vulnerabilities` |
| 全部范围 `.mjs` 的 `node --check`、JSON parse、文档链接与 `git diff --check` | 0 | 语法、JSON、链接与 whitespace 通过；新增实现/测试文件均低于 500 行 |

Skill Creator 随附的 `quick_validate.py` 也实际尝试执行，但系统 Python 与工作区 bundled Python 都在脚本启动时因缺少 PyYAML 报 `ModuleNotFoundError: No module named 'yaml'`。本任务没有擅自安装依赖；仓库自己的插件校验器已经对五个 Skill 的结构和全部运行文件通过 54 项检查。该环境缺口不改变产品验收结论，但进入后续工具链优化清单。

## 6. Spec 行为映射

| Spec 0005 行为 | 当前证据 |
| --- | --- |
| M4 类型、状态、未知字段、空集合与 M2/M3 隔离 | Schema/profile 测试与 25/10 项回归 |
| Finding 可追溯 Query/Claim/Evidence/Asset | index refs、profile 关系闭包与合成全链 |
| Content/Evidence/Product Gap 正反例和人工门 | profile 测试；Evidence 不足不能成为 Content Gap；Observation-only 不能成为 Product Gap |
| 九项站点检查和无网络 | detector pass/fail/blocked/unverifiable 矩阵、独立 snapshot/proof scope、完整 Run 指纹与 `fetch` 禁止断言 |
| Research access/original/support/confidence 分离 | research 正反例、warnings 与 proof scope 断言 |
| Proposal body/items/risk/multi-goal/唯一键 | body hash、section、risk、单 Asset、多 Goal、幂等、冲突与并发测试 |
| Adoption/Publication 分离人工门 | Tool 自动决定拒绝、draft template 与人工 Fixture profile 测试 |
| Technical Retest append-only | Publication 前置、Fixture 例外、resolved/persistent、旧字节不变测试 |
| 中断与恢复 | M4 合法子集重试收敛；M2 Run resume/supersede/故障窗口回归 |
| indexes/trace/legacy | 18 indexes 双构建稳定、Proposal 完整 trace、legacy 120 current/HEAD 一致 |

## 7. M2/M3 实施观察

| 观察 ID | 来源与实际行为 | 预期张力与 M4 影响 | 阻塞 | 当前处理 | 建议优化与未验证范围 |
| --- | --- | --- | --- | --- | --- |
| `OBS-M4-001` | `object-contract.mjs` 与 `index-builder.mjs` 以代码表登记每个里程碑的 Schema、index、refs 和 version refs | M4 只做了外科手术式注册，没有阻塞；继续增加 M5 类型时容易出现多表漂移 | M4 否；M5 设计否 | M4 tests + plugin validator 锁定现有登记 | 评估单一声明式 registry；尚未证明收益足以在 M4 重构 |
| `OBS-M4-002` | M2 `run-store.mjs` 支持 resume/supersede/artifact，但 M4 同步 Tool 直接物化 profile-aware completed Run；多文件创建仍非事务 | M4 Fixture 可由 create-only 重试收敛且继承 M2 Run 回归；长时间浏览器采集需要 checkpoint、失败状态与 restart | M4 否；M5 是 | M4 记录 `completed_steps`，测试合法子集恢复；未修改 M2 kernel | M5 前设计 profile-aware Run/collector recovery；真实崩溃与跨进程 restart 尚未验证 |
| `OBS-M4-003` | 当前 checkout 每个 stable ID 只有一个 canonical 当前版本；精确 ref 会拒绝漂移，但不能同时解析同 ID 多 revision | M4 用新 ID 保存 Retest，不覆盖旧 Finding；M5 Baseline/Retest 与同一 raw sample 重评需要更明确的 immutable revision 策略 | M4 否；M5 是 | M4 使用 append-only 新 ID、SHA 与 Git 历史 | M5 SDD 先决定 sample/review/profile 版本与 revision 读取方式；尚未实现 |
| `OBS-M4-004` | M3 两个 published Claim 仍返回 Evidence Sufficiency warning | M4 正确阻止它们被无风险当作 Content Gap 输入；不阻塞离线 Tool，但限制真实建议与 M5 rubric 可声明范围 | M4 否；M5 业务结论受限 | warnings 保留，风险/弱化字段强制 | 后续补证必须另获真实 Source/Evidence 授权；当前没有 first-party/data/case 新证据 |
| `OBS-M4-005` | M3/M4 多文件 create-only 可预检确定性冲突，但意外 I/O 只保证合法子集和重试收敛 | M4 同步 Fixture 已验证；M5 多平台、多样本任务的补偿面更大 | M4 否；M5 是 | 不伪装跨文件事务；保留 completed steps 与固定 ID | M5 需要故障注入、stale lock、timeout、取消与补偿合同；真实长任务未验证 |

这些观察已交接到 [`../handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`](../handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md)。Handoff 不是重构或 M5 实现批准。

## 8. 未验证与禁止外推

1. 没有读取 MyyShop 真实站点或任何真实外部平台；没有真实 Source snapshot、Finding、Gap 或 Asset Proposal。
2. 没有真实人类 Adoption、外部 Publication 或发布后的 Technical Retest；合成 approval 只存在于临时 Fixture。
3. 没有安装或运行 Playwright/Crawlee/Unlighthouse，没有消费者产品 UI 样本。
4. 没有执行 M5 三次采样、M6 GA4/GSC 或真实 Cycle；不能声称 GEO、流量、注册或品牌认知改善。
5. 没有验证插件安装缓存与三宿主运行，也没有发布高于 `0.3.0` 的版本。
6. 没有 commit、push、PR、merge、部署或发布；所有交付仍需 Owner 审阅工作树 diff。

## 9. Git 与交付状态

本地工程结果保留在 `/Users/sujingjun/geo-cowork` 的 `main` 脏工作树，HEAD 仍为 `d1b2b6ce043664c8b3d97a14711605059794810e`，相对 `origin/main` 超前 1 个用户人工提交。三个新增 MyyShop M4 index 是由 Markdown 重建的空派生索引；120 条 legacy 与 13 个 canonical 对象没有被本任务改写。

下一步只能从 M2–M4 整体优化 Handoff 开始评审。是否先做 P0 优化、是否建立 M5 SDD、是否安装浏览器依赖、是否访问任何真实平台，均等待新的明确决定。
