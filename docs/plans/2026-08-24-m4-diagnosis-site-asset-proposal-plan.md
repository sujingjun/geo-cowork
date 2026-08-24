---
title: M4 Diagnosis, Site & Asset Proposal 实施计划
status: approved
created: 2026-08-24
source:
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权"
scope: M4 离线工程纵切、合成验收、真实执行门、M2/M3 观察与整体优化交接
---

# M4 Diagnosis, Site & Asset Proposal 实施计划

## 1. 前置与现状

### 1.1 基线

- 工作目录：`/Users/sujingjun/geo-cowork`
- 分支/基线：`main @ d1b2b6ce043664c8b3d97a14711605059794810e`
- 基线性质：Owner 明确确认的人工提交；完整承接原 M3 业务批准冻结内容
- 当前允许：本地 SDD、脱敏 Fixture、代码、测试、Record、Handoff
- 当前未允许：真实站点/账号/API/企业数据采集、外部写入、付费模型、发布、部署、commit、push、PR

### 1.2 可复用实现

- `object-contract.mjs`：M2/M3 Schema merge、Frontmatter、secret、snapshot checksum；
- `index-builder.mjs`：refs/type/version、稳定 indexes 与原子写；
- `run-store.mjs`：Run create/resume/supersede、不可覆盖 artifacts；
- `legacy-ops-geo.mjs`：snapshot manifest、SHA、observed/unverifiable、legacy score non-comparable；
- `knowledge-query.mjs` / `knowledge-trace.mjs`：M3 profile、approval/version/readiness/trace；
- M3 已批准的 MyyShop Goal/Query Set/KR 只作为契约输入候选，不在未授权情况下运行真实诊断。

### 1.3 差距

缺少 M4 Schema/profile、三类 Gap 前置、站点 detector、研究输入契约、Proposal/Adoption/Publication、Technical Retest、五个 Skills、专项测试与 M4 Record。

## 2. 实施原则

1. 先批准 SDD，再写失败测试，再实现最小行为。
2. 当前工程验收只使用 `.invalid`/本地脱敏 Fixture，不执行真实网络访问。
3. 复用 M2 Finding/Asset/Evidence 和 M3 Evidence Plan，不新建综合评分或重复 provenance 内核。
4. 新对象只为分离 Proposal、Adoption 和 Publication；Technical Retest 继续使用 Run + 新 Evidence/Finding。
5. Tool 只校验、确定性检测和物化显式 plan；不在代码中隐藏语义规则或调用模型。
6. M2/M3 不合理项记录后交给整体优化 Handoff；不做与 M4 无直接关系的重构。

## 3. 纵切

### Slice A — M4 Schema、profile、refs 与 templates

- 新增 `m4-record-types.schema.json`，注册 `asset_proposal/adoption_record/asset_publication`，扩展 Finding/Asset/Evidence Plan/Run。
- `object-contract.mjs` 只做最小 Schema 注册；M4 扩展必填与跨对象规则由 `diagnosis-profile.mjs` 负责，避免反向破坏 M2/M3 最小对象。
- `index-builder.mjs` 增加三类 index、M4 refs 和 version refs。
- 先写失败测试：未知字段、空 refs、类型/版本错误、Gap 状态、自动采用/发布、人类证明。

验证方式：`node --test tests/m4-diagnosis.test.mjs --test-name-pattern='Schema|profile|refs|approval'`。

### Slice B — `geo-site` 确定性诊断

- `site-audit.mjs` 读取显式本地 manifest，校验 snapshot path/SHA/collector。
- 实现 HTTP、canonical、robots、sitemap、Schema syntax、title、meta、heading、crawlability detectors；每项有稳定 code/version。
- detector pass 只进入 Run summary；fail/blocked/unverifiable 生成 Evidence/Finding。
- 复用 `legacy-ops-geo.mjs` 已验证的 snapshot、SHA、item state 与 create-only 语义；若需共享函数，只做最小提取并保持 M2 测试通过。

验证方式：专项测试覆盖每个 detector 的 pass/fail/blocked/unverifiable、checksum、相同输入确定性和不联网断言。

### Slice C — 研究输入与语义边界

- `research-input.mjs` 校验 access/original content/support/confidence/counterevidence 分离。
- accessible snapshot 可成为原文 Evidence；blocked/challenge/log Evidence 只证明访问失败。
- Content/Evidence/Product Gap 的正例、反例和等待人工状态由 profile validator 检查。
- 新增 `geo-reputation`、`geo-competitor`；Skill 只整理已授权/合成输入，不自动形成竞品优势或外部动作。

验证方式：登录/403/challenge/timeout/无原文/缺独立支持/低置信度分别测试；Product Gap 对平台 Observation-only 输入明确失败。

### Slice D — Asset Proposal 与 multi-goal merge

- `asset-proposal.mjs` 校验完整 body、body SHA、建议项 refs、risk 和目标 Asset。
- `propose-assets` 对同一 Asset 聚合多个 Goal 的显式建议项；排序稳定，重复字节幂等，文本/事实冲突写入前失败。
- 新增 `geo-content`；它生成 Host plan，不把事实生成规则复制到 Manifest 或 Tool。
- 同一 About fixture 的多 Goal 输入只产生一个 Proposal；每个 item 保留独立 trace。

验证方式：body checksum、missing section、risk、single Asset merge、duplicate/conflict/no-partial 与跨 cwd 确定性。

### Slice E — Adoption、Publication 与 Technical Retest

- `prepare-adoption` 只生成全部 `pending` 的 draft；任何自动决定失败。
- Publication Tool 只生成 draft template；confirmed/withdrawn 只能来自人类编辑和 approval 校验。
- `technical-retest` 要求 confirmed Publication；Fixture 仅在 `development_fixture:true` + `.invalid`/local locator 下例外。
- Retest 新建 Evidence/Finding/Run，旧 Finding/Proposal/Adoption/Publication 字节不变。

验证方式：auto-adoption/publication 拒绝、publication 前置、resolved/persistent、input drift、旧对象 SHA 不变和故障重试。

### Slice F — `geo-diagnosis-cycle`、CLI 与插件包装

- 新增 `diagnosis.mjs` CLI 和 `geo-diagnosis-cycle`/`geo-site` Skills。
- 五个 M4 Skills 均写清输入、必读、步骤、输出、人工门、禁止项、失败/停止和验收；编排 Skill 不复制专业规则。
- 更新插件 README/CHANGELOG、根文档导航、package script 和 plugin validator expectations。

验证方式：`npm run validate:plugin`、CLI 从非仓库 cwd 执行、静态检查不含 `../../workspaces`、真实 URL 或 secret。

### Slice G — 合成全链、Project Lead 验收与交接

- 合成 Workspace 跑通 approved M3 input → site/research Evidence → Findings/Gap → one Asset Proposal → draft Adoption → synthetic human fixtures → Publication → Retest。
- Fixture 人类证明使用虚构身份、`.invalid` locator 和 `development_fixture:true`，绝不作为 MyyShop 事实。
- 建立 M4 Record，记录首次失败、修复、实际命令、M2/M3 观察与未验证项。
- 建立 `docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`，交接 M2–M4 整体优化；另行说明真实 MyyShop 执行仍待授权。

验证方式：执行 §6 全部命令并核对实际输出、Git 状态和冻结 hash。

## 4. 目标文件

### 4.1 Schema、Tool 与测试

- `plugins/geo-expert/schemas/m4-record-types.schema.json`
- `plugins/geo-expert/scripts/lib/diagnosis-profile.mjs`
- `plugins/geo-expert/scripts/lib/site-audit.mjs`
- `plugins/geo-expert/scripts/lib/research-input.mjs`
- `plugins/geo-expert/scripts/lib/asset-proposal.mjs`
- `plugins/geo-expert/scripts/diagnosis.mjs`
- `plugins/geo-expert/assets/object-templates/{asset-proposal,adoption-record,asset-publication}.md`
- `plugins/geo-expert/skills/{geo-diagnosis-cycle,geo-site,geo-reputation,geo-competitor,geo-content}/SKILL.md`
- `tests/m4-diagnosis.test.mjs`
- `tests/fixtures/m4-diagnosis/`
- `package.json`

### 4.2 文档与记录

- 本 M4 Requirement/PRD/Architecture/Spec/Plan/Task
- `docs/records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md`
- `docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`
- 直接相关的 README/CHANGELOG/wiki 导航

真实 MyyShop Finding、Asset Proposal、Adoption、Publication 和 Retest 对象不在当前未授权工程 slice 中创建。

## 5. 测试矩阵

| 分组 | 场景 |
| --- | --- |
| Schema/profile | 新类型、扩展字段、空数组、未知字段、status、approval、ID/path |
| refs/version | Query/Claim/Evidence/Asset/Goal/Set/KR/Proposal/Adoption/Publication 类型与精确版本 |
| Evidence | snapshot checksum、Scope、blocked/log 证明范围、stale/contradiction |
| Gap | Content/Evidence/Product 正例、Evidence insufficiency、Observation-only、反证与人工门 |
| site | 九类 detector pass/fail/blocked/unverifiable、无综合分、no network |
| research | access/original/support/confidence 分离、403/login/challenge/无原文 |
| Proposal | body SHA、完整 section、risk、single Asset merge、duplicate/conflict/no-partial |
| human gates | draft Adoption/Publication、auto decision forbidden、approval required |
| Retest | publication required、fixture exception、resolved/persistent、old bytes unchanged |
| Run/recovery | input fingerprint、resume/supersede、artifact、I/O 中断幂等收敛、并发 |
| 回归 | M0—M3 全量、plugin、Workspace/index、legacy 120、MyyShop M3 trace/warnings |

## 6. 验收命令

实施完成后实际执行并在 Record 中记录：

```bash
npm run test:m4-diagnosis
npm run test:m2-contract
npm run test:m3-knowledge-query
npm test
npm run validate:plugin
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/knowledge-query.mjs trace --workspace workspaces/myyshop --query Q-MYYSHOP-WHAT-IS-001
node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop
git diff --check
```

另行执行：

- 连续两次 build-index，比较全部 index 聚合 SHA；
- 核对 120 条 legacy current/HEAD 路径+NUL+原始字节聚合与 diff；
- 核对 M3 trace 仍为 `lifecycle_ready:true`，两条预期 Evidence warning 未被消失或伪造修复；
- 检索真实 URL、token/cookie/Authorization、`../../workspaces`、综合 GEO score 与未授权网络依赖；
- 核对 Git branch/HEAD/dirty paths，确认未 commit/push/PR/发布/部署。

## 7. 真实执行与发布门

本计划的工程验收不创建真实 MyyShop 诊断结论。进入真实执行前必须补充：

1. 具体 Goal/Set/KR/Asset 版本；
2. 目标 URL/账号/Source；
3. 允许的 collector、网络、凭据和数据范围；
4. snapshot 保留和脱敏规则；
5. 是否允许外部写入（默认否）；
6. 人工 reviewer/decision refs。

真实执行、Adoption、Publication、Technical Retest、M5 平台复测和 M6 业务观察分别建 Record，不互相继承授权。

## 8. M2/M3 观察规则

M4 Record 中每条观察使用：

```text
observation_id
source_file/test/command
observed_behavior
expected_or_tension
m4_impact
blocking: true|false
temporary_handling
suggested_optimization
unverified_scope
```

非阻塞项只进入整体优化 Handoff。阻塞项先补失败测试与影响说明，未经决定不改既有批准语义。

## 9. 回滚与停止条件

- 新对象与 artifacts create-only；indexes 可重建；Fixture 可从临时目录重建。
- 不删除、覆盖或批量改写 M2/M3 与 120 条 legacy 文件。
- Spec 缺口、M2/M3 语义冲突、真实数据需求、外部依赖或权限扩大时停止受影响 Slice 并请求决定。
- 不执行 commit、push、PR、发布、部署；回滚由 Owner 基于 Git diff 决定。
