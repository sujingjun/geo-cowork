---
title: M2 Contract & Provenance Kernel 任务清单
status: verified
created: 2026-08-24
source: docs/plans/2026-08-23-m2-contract-provenance-kernel-plan.md
scope: M2 SDD、四个实现纵切、MyyShop 兼容迁移与验收
---

# M2 Contract & Provenance Kernel 任务清单

## M2-T01 差异审查与契约冻结

- 对应：Requirement、PRD、Architecture、Spec 0003、Plan
- 目标：以真实源码和 Workspace 冻结 M2 行为，列出旧计划冲突
- 成功标准：Gap Review 有路径、命令、退出码；六类 SDD 工件职责分离
- 范围外：代码实现、Owner 批准
- 前置依赖：最终产品方案与 M2 Handoff
- 目标文件：`docs/records/2026-08-23-m2-contract-provenance-gap-review.md` 及 M2 canonical 文档
- 测试要求：文档链接与元数据可导航
- 验证命令：`rg` 路径核验、`git diff --check`
- 风险：把旧 Handoff 或 hand-maintained manifest 当当前事实
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Handoff

## M2-T02 Object Contract 与安全读取

- 对应：Spec 0003 §2—§3、§8；Plan Slice A
- 目标：实现 gray-matter + Ajv 公共和类型契约
- 成功标准：八类对象正常通过，非法公共/类型字段与安全输入明确失败
- 范围外：M3 Knowledge Release 业务状态转移
- 前置依赖：M2-T01
- 目标文件：`package*.json`、`schemas/`、`scripts/lib/{workspace-paths,object-contract}.mjs`、对象模板
- 测试要求：正常、缺字段、unknown type、非法 ID/status/time、checksum、path/symlink/secret
- 验证命令：`node --test tests/m2-object-contract.test.mjs`
- 风险：YAML 日期类型、错误输出泄密
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Acceptance Record

## M2-T03 indexes、refs 与 legacy compatibility

- 对应：Spec 0003 §4—§5；Plan Slice B
- 目标：确定性构建 indexes 并校验跨对象关系
- 成功标准：duplicate/broken/type/version ref 失败；rebuild 字节一致；120 条 legacy 可导航且原文不变
- 范围外：把 legacy knowledge 自动转 Claim
- 前置依赖：M2-T02
- 目标文件：`scripts/lib/index-builder.mjs`、`scripts/build-index.mjs`、validator、index Fixture
- 测试要求：删除重建、重复/并发、失败原子性、Markdown hash
- 验证命令：`node --test tests/m2-index-ref.test.mjs`
- 风险：扫描模板或手工治理文件造成假 duplicate
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Acceptance Record

## M2-T04 Run lifecycle、artifact 与并发身份

- 对应：Spec 0003 §6、§9；Plan Slice C
- 目标：实现可恢复 Run 与不可覆盖 artifact，并修复 workspace ID 并发竞态
- 成功标准：合法状态、invalid transition、artifact overwrite、resume/supersede、重复调用和并发身份通过
- 范围外：新 Agent Runtime、任务调度器
- 前置依赖：M2-T02
- 目标文件：`scripts/lib/run-store.mjs`、`scripts/run-lifecycle.mjs`、`workspace-init.mjs`、相关测试
- 测试要求：正常、失败、重试、并发、进程中断可收敛语义
- 验证命令：`node --test tests/m2-run-lifecycle.test.mjs tests/m2-security-concurrency.test.mjs`
- 风险：新 Run 与旧 Run 更新之间的部分状态
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Acceptance Record

## M2-T05 ops-geo legacy adapter

- 对应：Spec 0003 §7；Plan Slice D
- 目标：独立实现脱敏 legacy audit 到 Source/Evidence/Finding 的确定性迁移
- 成功标准：输入 SHA、stable refs、无 Evidence 降级、legacy score 不可比、重复导入幂等
- 范围外：复制上游代码/数据、GEO 总分、Finding 业务效果
- 前置依赖：M2-T02、M2-T03
- 目标文件：`scripts/lib/legacy-ops-geo.mjs`、CLI、合成 Fixture、测试
- 测试要求：输入不变、checksum、缺 ref、冲突、重复调用
- 验证命令：`node --test tests/m2-ops-geo-migration.test.mjs`
- 风险：把未实现的上游 v2 计划误报为兼容事实
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Acceptance Record

## M2-T06 MyyShop 兼容迁移与验收

- 对应：Plan §4、§8
- 目标：把 MyyShop 补成工作区实例并建立 M2/legacy indexes，不改 120 条原文
- 成功标准：根结构和 `--objects` 通过；legacy count 120；聚合 SHA 相同
- 范围外：批量改写、业务批准、真实外部数据
- 前置依赖：M2-T03、M2-T05
- 目标文件：`workspaces/myyshop/{README.md,STATUS.md,workspace.json,indexes/}`、M2 Acceptance Record
- 测试要求：全量回归、plugin validate、两次 rebuild、diff check
- 验证命令：见 Plan §5、§8
- 风险：派生 index 被误当权威事实
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Acceptance Record

## M2-T07 项目 Lead 独立验收

- 对应：工作流 §10、§11、§17
- 目标：从源码、tests、实际 commands 和 Git diff 独立复核 M2
- 成功标准：每项 Spec 行为均映射测试/证据；Record 列出首次失败、未验证项和授权边界
- 范围外：自行批准 Spec、commit/push/PR/发布
- 前置依赖：M2-T02—T06
- 目标文件：`docs/records/2026-08-24-m2-contract-provenance-kernel-record.md`
- 测试要求：全量机器门与定向审查
- 验证命令：见最终 Record
- 风险：测试通过被错误表述为业务或生产验证
- 状态：verified
- Session/Handoff：当前 `/goal`；M2 Acceptance Record
