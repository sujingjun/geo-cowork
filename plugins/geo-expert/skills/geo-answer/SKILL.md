---
name: geo-answer
description: 复核 M5 Answer Sample 的 Citation、Source identity/五层角色、Claim 支撑与答案 rubric，并按固定公式解释聚合；不负责真实平台授权或浏览器操作。
---

# geo-answer

## 触发场景

- 复核一次 Answer Sample 的 Citation 与 Claim 支撑；
- 解释 Source 分类、五项指标、comparability 或人工待办。

## 输入

不可变 Sample/raw checksum、Citation Observation、Source identity、候选 Classification、Claim 精确版本、rubric 和待计算 Aggregation 输入。

## 开工前必读

读取 Spec 0006 §6—§11、目标 Sample/raw、相关 Source/Citation/Claim 和当前 rubric。来源类别与 Claim 支撑是两个独立判断。

## 步骤

1. 核对 Sample checksum、终态、Profile 与 Query/version。
2. 保留每次 Citation occurrence，并按规范化 URL 形成聚合单元。
3. 以具体页面、生产主体和内容形态复核 Source identity 与唯一主类型；host 不直接决定类型。
4. 对每个 Citation × Claim 单独给出支撑范围、结论、理由、置信度与人工门。
5. 创建新 Answer Review；rubric 变化时使用新 ID，不回写 raw 或旧 Review。
6. 只用锁定 refs 计算指标；不可计算时输出 `null` 与原因。

## 输出

Source Classification、Claim Support Review、Answer Review、Aggregation 或结构化阻塞/warning；不输出统一 GEO 总分。

## 可做事项

- 将低置信度、主体不明、冲突或关键结论送人工复核；
- 区分 first-party/third-party 与五层 Source Type；
- 解释分子、分母、coverage、comparability 和 volatility。

## 禁止事项

- 不从域名、平台 host 或 Source `active` 状态推导权威与 Claim supported；
- 不导入外部榜单、静态域名表或历史排名创建候选 Source；
- 不修改 Sample/raw，也不把探索字段升级成产品或业务结论。

## 失败与停止条件

sample checksum、ref/version、Source identity、分类、Claim Scope 或 rubric 发生漂移时停止聚合；无 Citation 时保留回答并输出零分母原因。

## 验收方式

分析链 `Query → Platform → Intent → Citation Domain → Source Identity → Source Type → Claim Supported` 完整；每个判断可追溯，旧字节不变，指标与手算 Fixture 一致。

## 示例

```bash
node <plugin-root>/scripts/answer-cycle.mjs review --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/answer-cycle.mjs normalize-citations --workspace <workspace> --sample SMP-EXAMPLE-001
```
