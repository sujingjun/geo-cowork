---
title: M4 Diagnosis, Site & Asset Proposal Handoff
status: verified
created: 2026-08-24
updated: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ d1b2b6ce043664c8b3d97a14711605059794810e (Owner-confirmed human commit)
source:
  - "当前用户指令：同意以人工提交 d1b2b6c 作为 M4 基线"
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权"
  - docs/requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md
  - docs/tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
  - docs/records/2026-08-24-m3-business-object-approval-record.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
scope: M4 SDD 启动、诊断/站点/资产建议提案边界与真实业务输入门
---

# M4 Diagnosis, Site & Asset Proposal Handoff

> 执行状态：本启动 Handoff 已完成。M4 本地离线工程的实际结果见 [`../records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md`](../records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md)；后续只从 [`2026-08-24-m2-m4-integrated-optimization-handoff.md`](2026-08-24-m2-m4-integrated-optimization-handoff.md) 评审整体优化与 M5 进入门。真实 MyyShop 采集仍未授权。

## 1. 唯一目标

在 M2/M3 已验证的本地工程基线上，为 M4 建立 Requirement、PRD、Architecture、Spec 0005、Plan 与 Task，经人类批准后再实现“诊断 → Content/Evidence/Product Gap → Own/External Asset 建议稿”的最窄纵切。Handoff 本身不是 M4 批准，不包含任何预制 Finding、Gap、Asset、业务结论或发布决定。

## 2. 新会话与同环境硬门

Owner 已于 2026-08-24 纠正：精确配置是模型 `gpt-5.6-sol`、推理强度 `max`（合称 `gpt-5.6-sol / max`）及标准速度。此前的新任务创建请求误将模型/推理组合写为 `gpt-5.5-sol-max`，因此任务接口返回参数校验失败且未产生新任务；该失败只记录笔误请求未创建任务，不表示正确配置不可用。只有系统实际确认满足正确配置的新会话，或 Owner 另行修改硬门，才可继续。不得由 Agent 自选替代模型。下一次若再次移交新任务：

- 必须由系统实际确认模型 `gpt-5.6-sol`、推理强度 `max` 与标准速度，不接受近似、别名推断或静默降级；
- 必须打开 `/Users/sujingjun/geo-cowork` 当前 `main` 工作树，不新建 worktree、不切换 checkout；
- 必须看到 Owner 确认的人工提交 HEAD `d1b2b6ce043664c8b3d97a14711605059794810e`，并保留其后的全部未提交 M4 文档与实现变更；
- 先执行只读预检，任一项不一致即停止写入并向 Owner 报告。

本任务已由系统会话元数据确认模型 `gpt-5.6-sol`、推理强度 `max`，Owner 已明确同意以人工提交 `d1b2b6c` 更新基线；模型/推理与 Git 基线硬门通过。M3 业务输入门已通过，但不解除 M4 SDD 批准与真实采集授权门；Handoff 交付完成不等于 M4 已获实现或真实执行批准。

建议只读预检：

```bash
pwd
git branch --show-current
git rev-parse HEAD
git status --short --branch
node --version
npm --version
npm ls --depth=0
npm run test:m2-contract
npm run test:m3-knowledge-query
```

`d1b2b6c` 已把原 M3 业务批准脏工作树提交为一个人工提交。为了证明基线更新没有丢失旧冻结内容，本任务只读重建了提交前状态：

```bash
git merge-base --is-ancestor \
  7de1e7b0cc475bd9ae967386598d09adaf2f4949 \
  d1b2b6ce043664c8b3d97a14711605059794810e
git diff-tree --no-commit-id --name-only -r -M \
  d1b2b6ce043664c8b3d97a14711605059794810e
```

- `7de1e7b` 是 `d1b2b6c` 的祖先，命令退出码为 `0`；
- 提交差异为 `40` 个 rename-aware 路径项；
- 按旧 Handoff 的 Git 状态、tracked 删除与逐文件 untracked 规则重建，仍得到 `40` 条与聚合 SHA `79c5d5a90f7cef26efd794cb926e2b9e876cd52e0e57ab51d43df4e2a3f4aaac`；
- `package-lock.json` SHA 仍为 `8b94eb852ca87fb388da6c7ff1ab7dcd7bbc0dd89880491b99fb57b71547eac8`；
- MyyShop index aggregate 与 legacy current/HEAD aggregate 继续以 M3 业务对象批准 Record 为准，M4 验收时重新核验。

## 3. 已验证、可继承的本地事实

以 M3 工程 Record 与后续业务对象批准 Record 为准：

- M2 专项 25 tests、M3 专项 10 tests、全量 47 tests 通过；
- 插件自检 38 项通过；MyyShop object validator 通过；
- 13 个 canonical 对象与 120 个 legacy entries 可重建为 15 个确定性 indexes；
- `Q-MYYSHOP-WHAT-IS-001` 的关系 trace 可到 Goal/Set/Answer/Claims/Evidence/Sources/Document/Release；
- Owner 已批准全部 M3 业务对象，trace 返回 `lifecycle_ready:true` 与 `gates:[]`；
- 两条 Claim 的 Evidence Sufficiency 仍不足，validator 保留两条 warning；Owner 的内部采用决定没有改写证据类别；
- 120 条 legacy knowledge 与 HEAD 原始字节一致；
- 前序 M2/M3 已由用户提交并推送为 `7de1e7b`；M3 业务批准变更随后由用户人工提交为 `d1b2b6c`，当前 `main` 比 `origin/main` 超前 1 个提交。Agent 没有执行 commit、push、PR、真实采集、外部发布或部署。

## 4. M3 业务输入、M4 环境与 SDD 批准门已通过

下列对象已经形成可追溯的 M3 业务输入闭包：

| 对象 | 当前状态 | 继续保留的边界 |
| --- | --- | --- |
| `GOAL-MYYSHOP-DEFINITION-001` | approved 1.0.1 | 尚未启动 active Cycle；M4 SDD 与真实执行另设门 |
| `Q-MYYSHOP-WHAT-IS-001` | formal 1.0.1 | 文本或语义变化必须新版本并重冻 Query Set |
| `QS-MYYSHOP-DEFINITION-001` | frozen 1.0.1 | pin Query 1.0.1；内容哈希和 freeze metadata 已记录 |
| `EVD-MYYSHOP-LEGACY-DEFINITION-001` | approved 1.0.1 | 仍为 `legacy_draft`；不足以伪装 first-party/data/case Evidence |
| `DOC-MYYSHOP-WHAT-IS-001` | approved 1.0.1 | Scope 与未决补证事项继续有效 |
| 两个 `CLM-*` | published 1.0.1 / insufficient | 仅进入内部 KR；两条证据不足 warning 保留 |
| `ANS-MYYSHOP-WHAT-IS-001` | published 1.0.1 | limitations 与 forbidden statements 继续有效 |
| `KR-MYYSHOP-DEFINITION-001` | published/ready 1.0.1 | `release_version:1.0.0`；不是外部发布证明 |
| `EPL-MYYSHOP-DEFINITION-001` | active 1.0.1 | 只表示补证计划已接受，不表示材料已提供 |

approved Goal、formal Query、frozen Query Set 与 published Knowledge Release 的一致版本已经成立，因此 M3 业务输入门通过；第 2 节模型/推理与 Git 基线门也已通过。Owner 已于 2026-08-24 批准第 5 节 SDD 工件进入本地离线实现。真实 M4 诊断仍须对具体站点、账号、API 与外部写入取得当次授权；Agent 不得把 SDD 批准扩张为真实采集授权。

## 5. M4 SDD 已批准进入本地离线实现

第一执行阶段已建立并请求批准：

1. `docs/requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md`
2. `docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md`
3. `docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md`
4. `docs/specs/0005-diagnosis-site-asset-proposal.md`
5. `docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md`
6. `docs/tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md`

这些工件已获 Owner 批准并标记为 `approved`，允许开始本地离线实现。它们把离线实现、真实 MyyShop 诊断、建议采用、实际发布、Technical Retest 与 M5/M6 效果观察分成独立门；真实 MyyShop 采集仍未授权。实现阶段还必须记录 M2/M3 不合理项，并在 M4 验收后建立 `docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`。

## 6. 建议的 M4 最窄纵切

### Slice A — Finding/Asset/Gap 契约

- 复用 M2 Finding/Asset/Evidence，不另造综合 GEO 分；
- 明确定义 Content Gap、Evidence Gap、Product Gap 的输入、反例、证据闭包和人工决策边界；
- 所有 observed Finding 必须有 Evidence，inferred/unverifiable/blocked 不得伪装成观察事实。

### Slice B — `geo-site` 确定性技术诊断

- 先用 `.invalid` 或本地 Fixture 覆盖 HTTP、canonical、robots、sitemap、Schema 语法、title/meta/heading presence 与 crawlability；
- 只复用本仓 `plugins/geo-expert/scripts/lib/legacy-ops-geo.mjs`、对应 M2 合成 Fixture/测试已经验证的 snapshot、manifest、SHA、item_state 与版本语义；上游 `ops-geo` v2 只有计划，不读取、复制或声称复用其未实现代码，也不继承综合总分；
- 若需要 Crawlee、Playwright 或外网采集，必须在 Spec 与授权门后引入。

### Slice C — `geo-reputation` / `geo-competitor` 研究输入

- Source 可访问性、原文、Evidence、独立支持和置信度分别记录；
- 登录、403、challenge、无原文均标为 blocked/unverifiable；
- 不自动社区发帖、评论、媒体联络或竞争对手结论。

### Slice D — Asset 级完整建议稿

- 同一批准 KR 派生 About、Homepage、FAQ、Organization Schema、llms 文件或 Answer Card 建议；
- Claim 未批准或 Evidence 不足时允许生成带风险段的建议稿，但不得用模型推测补事实；
- Adoption Record 以建议项记录 `accepted/modified/rejected`，人工采用与实际发布另设门。

## 7. 禁止静默扩张

未获得当次明确授权前，不得：

- 对 MyyShop 真实站点、GA4、GSC、消费者生成式平台或内部业务系统采集；
- 创建真实业务 Finding、Gap、Asset 定论或把候选内容写入外部系统；
- 调用付费模型/第三方 API、自动发布、CMS 写入、社区运营；
- 把 M3 产品方案 Source 当 approved business Evidence；
- 自行批准 M4 PRD/Spec、擅自变更已批准 MyyShop 对象或作出外部发布决定；
- commit、push、PR、merge、部署或发布。

## 8. 已知设计限制

- 当前 canonical graph 在一个 checkout 中只保留每个 stable ID 的一个当前版本；精确 pin 能阻止漂移，但不能同时解析同 ID 多 revision。若 M4 需要并行读取旧、新版本，先立单独 revision-history Spec/Task。
- Claim 历史状态顺序没有 append-only transition ledger；M3 validator 只能验证当前目标状态的前置。M4 不得把当前字段反推成完整审批历史。
- propose 的确定性冲突可预检；意外 I/O 不是跨文件事务，恢复依赖 create-only 幂等重试与 Run 记录。

## 9. M4 验收与出口

M4 Record 至少应分别证明：

- Schema/Tool 正常、非法、边界、路径、checksum、refs、幂等与故障恢复测试；
- 合成 Site/Asset/Gap Fixture 的确定性结果，不含虚假真实结论；
- 基于已批准 M3 输入开展真实诊断时，每条 Finding/Evidence/Asset trace 与对应采集授权；
- suggestion、Adoption、实际发布、Technical Retest 与业务观察仍为分离状态；
- M0—M3 全量回归、插件自检、Workspace/index 确定性和 legacy 不变。

本地离线工程已按 M4 Record 验收；出口改由 M2–M4 整体优化 Handoff 承接。不能凭代码测试声明建议已采用、页面已发布或 GEO 效果成立。
