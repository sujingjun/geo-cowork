---
title: M2 Contract & Provenance Kernel PRD
status: proposed
created: 2026-08-24
source: docs/requirements/2026-08-23-m2-contract-provenance-kernel.md
scope: M2 面向人类与协作 Agent 的产品行为、业务规则和验收
---

# M2 Contract & Provenance Kernel PRD

## 1. 为什么做

GEO 工作跨越多次运行、多人审核和多个宿主。若对象只存在于聊天、手工表格或不可重建 JSON 中，后续 Agent 无法确认某个结论来自什么、使用了哪个版本，也无法安全恢复中断任务。M2 先建立共同事实与运行底座，再进入 Query 和知识业务。

## 2. 为谁做

- MyyShop 研发负责人：直接审阅 Markdown、诊断错误、保留历史运行并决定后续批准。
- GEO 主专家与专业 Skill：读取同一对象与 refs，不在 Prompt 内复制规则。
- 确定性 Tool：校验、构建索引、写 Run 工件和执行 legacy migration。
- 后续接手 Agent：无需原聊天即可恢复上下文。

## 3. 用户流程

### 3.1 创建与修改对象

1. 人类或经授权 Agent 在 Workspace 写 Markdown 对象。
2. validator 检查公共字段、类型字段、stable ID、版本、状态和 refs。
3. 任何错误均定位到对象路径与字段；索引不更新。
4. 全量合法后重建只读 indexes。

### 3.2 使用索引

用户与 Agent 可删除全部 indexes 并从 Markdown 重建。indexes 只用于机器读取、导航和关系检查；任何 index 修改都不能覆盖 Markdown，下一次 rebuild 会丢弃手工 index 改动。

### 3.3 理解 broken ref

broken ref 必须展示：来源对象路径、字段、目标 ID 和错误类型。诊断不得回显文件正文、secret 或 PII。用户修复 Markdown 后重新构建；Tool 不猜测替代目标。

### 3.4 中断、恢复与失效

- Run 状态说明执行进度，不说明 GEO 业务结果。
- 输入版本未变时，用户可恢复同一 Run。
- 关键输入版本已变时，旧 Run 保留并标记 `superseded`，新 Run 使用新输入；不能把新旧输入混在同一历史中。
- `raw/` 和 `outputs/` 下已写文件不能覆盖；生命周期元数据可按合法状态更新。

### 3.5 legacy audit 迁移

用户提供脱敏 legacy audit 和可选 snapshot 映射。Tool 保存输入校验和，生成稳定 Source/Evidence/Finding refs；找不到精确 snapshot 的旧 Finding 标记 `unverifiable`。旧总分只作为不可比较历史元数据，不成为 GEO 结论。

## 4. 产品规则

1. 所有 canonical Markdown 对象共享 `id/record_type/status/version/created_at/updated_at`。
2. Query、Claim、Source、Evidence、Finding、Asset、Run、Cycle 使用稳定业务 ID。
3. Source 表示来源主体或渠道；Evidence 表示从 Source 取得的可定位证据。
4. Evidence stale 只提示复核，不自动改变 Claim 或发布状态。
5. Run `completed` 只表示执行结束，业务结果必须独立记录。
6. 历史 Run raw/output 不覆盖；派生 index 可安全重建。
7. 现有 120 条 knowledge_entry 只做兼容索引，不被自动升级为 Claim。
8. Agent 不自动批准对象，不自动发布，不声称业务效果。

## 5. 业务验收

- 用户能从一个合法 Fixture 构建 indexes，并在删除后得到相同字节。
- 用户能从 duplicate ID、broken ref、非法 Frontmatter 得到可行动且脱敏的错误。
- 用户能看到 Run status 与 business result 的独立值。
- 用户不能覆盖旧 Run artifact。
- 用户能验证输入版本改变会保留旧 Run并新建 Run。
- 用户能看到 legacy Finding 的 `unverifiable` 降级与 `comparable: false` 总分元数据。
- MyyShop 120 条 legacy 内容不改写且可由兼容 index 导航。

## 6. 非目标

- 不决定 Query 是否 formal、Claim 是否 approved、Knowledge Release 是否发布；
- 不做语义研究、站点审计、资产建议、平台答案采集或 Analytics；
- 不建立综合 GEO 分、复杂 Source Trust Score 或自动效果归因；
- 不建设新 Agent Runtime、数据库或云端服务。

## 7. 待人工决定

M2 PRD/Spec 的批准、真实企业 Evidence 的读取、业务对象的批准和任何发布行为都需要 Owner 单独授权。本地测试通过不替代这些门。

