---
name: geo-competitor
description: 整理已授权或合成的竞品材料及独立支持、反证和置信度，用于等待人工确认的对比观察；不自动宣称竞品优势或 Product Gap。
---

# geo-competitor

## 触发场景

- 登记竞品自述、第三方对比或用户决策因素 Evidence；
- 检查 Product Gap 是否具备用户需求与品牌能力两侧证据。

## 输入

工作区、research manifest、输出 plan、目标 Query/Claim/Asset 和当前采集授权。竞品自述必须标为 `competitor`，生成式回答标为 `platform_observation`。

## 开工前必读

读取目标 Source/Evidence/Claim/Asset、反证与 Spec 0005 §3.4/§10。Product Gap 后续只允许进入人工触发的 M7 战略分支。

## 步骤

1. 核验 locator、访问结果、原文 snapshot 和 checksum。
2. 分开竞品自述、独立第三方、用户表达和平台观察。
3. 使用 `research-ingest` 物化 Evidence；把反证和 unresolved conflicts 原样保留。
4. 只有用户需求 Evidence 与 MyyShop 能力缺口 Evidence 同时存在时，才提出 `waiting_human` Product Gap。
5. 把人工决定和 M7 是否启动作为后续 gate。

## 输出

竞品研究 Evidence、支持/反证关系、confidence、可选 waiting-human Finding 与 Run。

## 可做事项

- 组织显式输入并检查两侧证据；
- 指出证据不足和来源偏差；
- 提出人工研究问题。

## 禁止事项

- 不自动得出竞品优势、推荐理由或产品需求；
- 不把单条 Query、搜索摘要、竞品自述或单次平台回答单独作为 Product Gap；
- 不自动联系竞品、媒体或用户。

## 失败与停止条件

缺原文、缺独立支持、只有平台 Observation、范围未授权或反证未处理时停止结论升级。

## 验收方式

Source 类型与 Evidence proof scope 准确；Product Gap 正反例可复验；任何确认仍有人工 approval。

## 示例

```bash
node <plugin-root>/scripts/diagnosis.mjs research-ingest --workspace ./brand --manifest ./competitor.json --plan ./competitor-plan.json
```
