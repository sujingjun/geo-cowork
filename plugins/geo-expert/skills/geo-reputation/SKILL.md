---
name: geo-reputation
description: 整理已授权或合成的声誉研究 manifest，分开记录 Source 可访问性、原文、独立支持、反证和置信度；不自动发帖或形成业务定论。
---

# geo-reputation

## 触发场景

- 把已有社区、媒体、用户或平台观察 snapshot 登记为 Evidence；
- 为 Content/Evidence/Product Gap 准备支持与反证。

## 输入

工作区、research manifest、显式输出 plan 和授权范围。每个 observation 必须给出 access state、original content state、snapshot/SHA、support kind、独立支持、反证与 confidence reason。

## 开工前必读

读取相关 Source、Claim、Evidence、Asset 与 Spec 0005 §10。确认当前任务是否允许真实 Source 访问；未授权时只处理本地合成输入。

## 步骤

1. 核验每个 Source 与 snapshot checksum。
2. 分开保留 blocked、原文缺失、独立支持不足和低 confidence。
3. 运行：

   ```bash
   node <plugin-root>/scripts/diagnosis.mjs research-ingest --workspace <path> --manifest <manifest.json> --plan <plan.json>
   ```

4. 语义 Finding 只能由显式 Host plan 物化为 `waiting_human`。
5. 展示支持 Evidence、反证、冲突和未验证范围。

## 输出

Source-linked Evidence、可选 waiting-human Finding、Run 和分项 warnings。

## 可做事项

- 物化已取得的本地原文或阻断日志；
- 区分用户、独立第三方、第一方和平台观察；
- 提出需要人工判断的研究线索。

## 禁止事项

- 不自动搜索、发帖、评论、联系媒体或写入社区；
- 不把登录墙、摘要、单次平台回答或热度当可信业务事实；
- 不自动确认 Product Gap。

## 失败与停止条件

授权、Source、原文范围、checksum 或支持关系不清时停止；不得用推测填补缺失原文。

## 验收方式

四个维度可分别读取；blocked Evidence 只证明采集失败；warning 不被静默消失；语义输出保持人工门。

## 示例

```bash
node <plugin-root>/scripts/diagnosis.mjs research-ingest --workspace ./brand --manifest ./research.json --plan ./research-plan.json
```
