---
title: M2 Contract & Provenance Kernel 原始需求
status: proposed
created: 2026-08-24
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/handoff/2026-08-23-m2-contract-provenance-kernel-handoff.md
  - docs/records/2026-08-23-m2-contract-provenance-gap-review.md
scope: geo-cowork 里程碑 M2 本地事实与运行契约
---

# M2 Contract & Provenance Kernel 原始需求

## 1. 业务诉求

MyyShop 的后续 Query、知识、站点、答案测试与 GEO Cycle 必须共享一套可跨宿主、跨 Session 重建的本地事实契约。人类需要能直接读写 Markdown，Agent 与 Tool 需要稳定 ID、版本、refs、索引、证据来源和历史 Run，且不能把派生 JSON、聊天记录或模型输出变成第二事实源。

## 2. 当前问题

1. 现有 120 条知识有自有 Frontmatter，但没有公共时间字段、独立 Query/Claim/Evidence 或机器 refs。
2. 手工清单已出现 139/140/141 三种文件总数，不能作为可靠索引。
3. Source 与 Evidence 混合，历史审计 Finding 没有精确 Evidence refs。
4. Run 没有状态机、关键输入版本、不可覆盖工件或 supersede 行为。
5. 当前路径校验会跟随 symlink，也没有父目录逃逸和 secret marker 门禁。
6. ops-geo v2 契约尚未实现，legacy score 和旧 Finding 不能被直接提升为新事实。

## 3. 用户与 Agent 必须完成的动作

- 人类可创建、查看和修改符合公共契约的 Markdown 对象。
- Agent 可读取对象和只读派生 index，但不能让 index 反向覆盖 Markdown。
- Tool 可构建确定性 index，并明确报告 invalid frontmatter、duplicate ID、broken ref 与错误 ref 类型。
- Tool 可创建 Run、写入不可覆盖的 raw/output artifact、在输入不变时恢复，在关键输入变化时保留并 supersede 旧 Run。
- Tool 可把脱敏 legacy audit 确定性迁成 Source/Evidence/Finding；无法定位到 snapshot 的 Finding 必须降级。
- 另一个 Agent 不依赖原聊天即可从 Workspace、indexes 与 Run history 继续。

## 4. 成功标准

1. 合法 Markdown 通过公共与类型 Schema；非法字段、ID、状态、版本和时间明确失败。
2. duplicate ID、broken ref、错误 ref 类型均返回包含对象路径和 ref 的脱敏诊断。
3. 删除 indexes 后可重建；连续两次构建字节一致；构建不修改 Markdown。
4. Run raw/output artifact 二次写失败；`completed` 与业务结果独立。
5. 输入版本不变允许恢复；关键输入改变时旧 Run 变为 `superseded` 并新建 Run。
6. path traversal、父目录逃逸、symlink escape 和 secret marker 失败。
7. legacy audit 输入不被修改，legacy score 永远 `comparable: false`，不生成效果结论。
8. 120 条 legacy knowledge 进入兼容索引，原文件字节不变。

## 5. 约束

- Markdown authoritative；JSON indexes 纯派生。
- Node.js 20+、ESM、`node:test`；只引入批准基线点名的 `gray-matter` 与 Ajv。
- 不批量改写或移动 120 条 legacy knowledge。
- 不复制 ops-geo 无许可证代码或真实 raw 数据。
- 不读取真实企业数据，不调用真实模型或外部 API。
- 未经明确授权不 commit、push、创建 PR、发布或部署。

## 6. 非目标

- Query 研究和 Knowledge Release 业务闭环；
- Content/Evidence/Product Gap 诊断；
- Playwright、消费者平台采集、GA4、GSC；
- 数据库、LangChain/LangGraph、MCP 或云端控制面；
- GEO 总分、Source Trust Score 或自动业务批准。

## 7. 待确认事项

- 本文、M2 PRD/Spec/Plan 由 Agent 建立后保持 `proposed`；Owner 批准状态不由实现或测试替代。
- ops-geo 未来若真正实现 v2 contract，需要单独做版本映射与兼容复验。

