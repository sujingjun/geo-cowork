---
title: M4 Diagnosis, Site & Asset Proposal 任务清单
status: verified
created: 2026-08-24
source:
  - docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md
  - docs/records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权"
scope: M4 SDD、Schema/Tool/Skills、合成全链、验收、M2/M3 观察与整体优化 Handoff
---

# M4 Diagnosis, Site & Asset Proposal 任务清单

## M4-T01 SDD 建立与批准门

- 对应：Requirement、PRD、Architecture、Spec 0005、Plan
- 目标：冻结 M4 离线工程纵切、真实执行门和建议/采用/发布/复测分层
- 成功标准：六份工件职责分离、交叉链接一致；Owner 批准证据与真实采集禁区明确
- 范围外：自行批准、代码实现、真实采集
- 前置依赖：最终产品方案、M3 业务对象批准 Record、M4 Handoff
- 目标文件：六份 M4 canonical SDD 工件、M4 Handoff、文档导航
- 测试要求：Frontmatter、链接、状态、命名与 `git diff --check`
- 验证命令：`git diff --check` 与文档链接检查
- 风险：把 Handoff 或当前实现请求误写成 Spec 批准
- 状态：verified
- Session/Handoff：当前 `/goal`；`docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`

## M4-T02 M4 Schema、profile、refs 与 indexes

- 对应：Spec 0005 §2—§8、§13—§16；Plan Slice A
- 目标：注册 Proposal/Adoption/Publication 并实现 Finding/Asset/Evidence Plan/Run 的 M4 profile
- 成功标准：正常、非法、空集合、未知字段、status、approval、refs/type/version/path/checksum 均可复验；M2/M3 历史对象不被反向强制
- 范围外：site detector、语义提案、真实对象
- 前置依赖：M4-T01 approved
- 目标文件：M4 Schema、`diagnosis-profile.mjs`、object/index 最小注册、templates、tests
- 测试要求：profile 与 generic parser 分层、三类新 index 可删除重建、非法目标写入前失败
- 验证命令：`npm run test:m4-diagnosis`
- 风险：Schema merge 让 M2/M3 最小对象误要求 M4 字段，或 M4 profile 漏检必填
- 状态：verified
- Session/Handoff：当前 `/goal`

## M4-T03 `geo-site` 与确定性 detector

- 对应：Spec 0005 §9、§11、§12；Plan Slice B
- 目标：从本地 checksum manifest 生成确定性 site summary、Evidence 和 Findings
- 成功标准：HTTP/canonical/robots/sitemap/Schema/title/meta/heading/crawlability 的 pass/fail/blocked/unverifiable 齐全；相同输入确定性；不联网、不输出综合分
- 范围外：Playwright/Crawlee/Unlighthouse、真实 MyyShop 采集
- 前置依赖：M4-T02
- 目标文件：`site-audit.mjs`、CLI、`geo-site/SKILL.md`、Fixture、tests
- 测试要求：snapshot/SHA/Scope、detector version、no-network、跨 cwd、old bytes 不变
- 验证命令：`npm run test:m4-diagnosis -- --test-name-pattern=site`
- 风险：把 blocked response 当目标正文，或把 crawlability 说成平台必然抓取
- 状态：verified
- Session/Handoff：当前 `/goal`

## M4-T04 研究输入、反证与 Gap Profile

- 对应：Spec 0005 §3、§10；Plan Slice C
- 目标：分开 Source access、原文、Evidence、独立支持、反证和 confidence，并校验三类 Gap
- 成功标准：403/login/challenge/timeout/无原文/缺独立支持分别保留；Content/Evidence/Product Gap 正反例和人工门通过
- 范围外：联网研究、社区运营、竞品定论、M7 战略执行
- 前置依赖：M4-T02
- 目标文件：`research-input.mjs`、`geo-reputation/SKILL.md`、`geo-competitor/SKILL.md`、tests
- 测试要求：Observation-only Product Gap 失败、Evidence insufficiency 不成为 Content Gap、反证/冲突保留
- 验证命令：`npm run test:m4-diagnosis -- --test-name-pattern='research|gap'`
- 风险：把来源格式完整误当内容可信或独立支持
- 状态：verified
- Session/Handoff：当前 `/goal`

## M4-T05 Asset Proposal 与 multi-goal merge

- 对应：Spec 0005 §4、§6、§11；Plan Slice D
- 目标：从显式 refs 和完整 body create-only 物化单 Asset Proposal
- 成功标准：body checksum、section/item、risk、refs 与唯一键可校验；多 Goal About 只产生一份；冲突前无半成品
- 范围外：Tool 调模型、自动生成事实、采用或发布
- 前置依赖：M4-T02、M4-T04
- 目标文件：`asset-proposal.mjs`、`geo-content/SKILL.md`、templates、tests
- 测试要求：重复同字节、ID/path/unique-key 冲突、文本冲突、风险弱化、跨 cwd 确定性
- 验证命令：`npm run test:m4-diagnosis -- --test-name-pattern='proposal|merge|risk'`
- 风险：合并过程吞掉 Goal 来源或用弱化措辞补造事实
- 状态：verified
- Session/Handoff：当前 `/goal`

## M4-T06 Adoption、Publication 与 Technical Retest

- 对应：Spec 0005 §7、§8、§12、§14—§15；Plan Slice E
- 目标：建立独立人工门并以 append-only 新 Evidence/Finding 完成复测
- 成功标准：Tool 只创建 draft template；自动 decided/confirmed 被拒绝；无 Publication 的真实 Retest 失败；Fixture resolved/persistent 可复验；历史字节不变
- 范围外：实际外部发布、M5/M6 效果判断
- 前置依赖：M4-T03、M4-T05
- 目标文件：`asset-proposal.mjs`、`diagnosis-profile.mjs`、CLI、templates、tests
- 测试要求：人类 approval、modified text、published item subset、publication前置、input drift、故障重试
- 验证命令：`npm run test:m4-diagnosis -- --test-name-pattern='adoption|publication|retest'`
- 风险：accepted 被误当 published，或 resolved 被误当业务改善
- 状态：verified
- Session/Handoff：当前 `/goal`

## M4-T07 编排 Skill、插件包装与合成全链

- 对应：Architecture §1—§8；Plan Slice F/G
- 目标：提供五个 M4 Skill、CLI 与 development fixture 端到端闭环
- 成功标准：Skill 契约完整且不复制 Schema；CLI 可从非仓库 cwd 执行；合成链完整，Fixture 与 MyyShop 事实严格分离
- 范围外：固定专业 Agent 团队、数据库/队列、真实网络与外部依赖
- 前置依赖：M4-T02—T06
- 目标文件：五个 `SKILL.md`、CLI、Fixture、README/CHANGELOG/package scripts
- 测试要求：plugin validator、CLI、development_fixture gate、无真实 URL/secret/`../../workspaces`
- 验证命令：`npm run validate:plugin && npm run test:m4-diagnosis`
- 风险：编排 Skill 复制专业规则或 Fixture approval 被误作业务决定
- 状态：verified
- Session/Handoff：当前 `/goal`

## M4-T08 Project Lead 验收、Record 与 M2–M4 整体优化 Handoff

- 对应：工作流 §10、§11、§14、§17；Plan §6—§9
- 目标：独立复核 M4、执行全量门、记录 M2/M3 观察并交接整体优化
- 成功标准：M4 Record 可复现全部实际命令/结果/首次失败/修复/未验证项；M0—M4、plugin、Workspace/index/legacy 门通过；整体优化 Handoff 包含所有观察与优先级
- 范围外：自行批准真实诊断、直接实施整体优化、commit/push/PR/发布/部署
- 前置依赖：M4-T02—T07
- 目标文件：M4 Record、`docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`、直接相关导航
- 测试要求：Plan §5—§6 全矩阵；人工核对授权与状态边界
- 验证命令：Plan §6 全部命令、hash、检索与 Git 状态检查
- 风险：窄测试被表述为整体完成，或优化 Handoff 被误作重构批准
- 状态：verified
- Session/Handoff：当前 `/goal`；完成后交给整体优化新任务

## 收口条件

M4 只有在 T01 获 Owner 批准、T02—T07 实现并验证、T08 Record 与整体优化 Handoff 完整后，才能在声明的离线工程范围标记 `verified`。真实 MyyShop 采集、语义 Gap、Adoption、Publication、Technical Retest、M5/M6 效果均按各自证据单独判断。
