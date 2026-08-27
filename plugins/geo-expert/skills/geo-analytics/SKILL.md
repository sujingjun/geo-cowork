---
name: geo-analytics
description: 在测试商户内校验脱敏 Analytics fixture、登记 Observation、计算非因果 Business Signal，并按人工决定物化 candidate Evidence。
---

# geo-analytics

## 触发场景

- 用本地 fixture 验证 GA4/GSC/业务文件未来 read-only seam；
- 登记 `analytics_observation`、计算 `business_signal`；
- 在事实 Owner 决定后把合格 Observation 独立物化为 candidate Evidence。

## 输入

测试 Workspace、fixture input、pinned measurement contract、signal rule、sensitive-data policy、Cycle/Goal/Run refs、Observation versions 和显式 Evidence materialization plan。

## 开工前必读

读取 Spec 0007、账号与数据 Runbook、当前 Cycle freeze CIS 和数据授权边界。测试阶段只接受 Workspace-local、聚合、脱敏 JSON。

## 步骤

1. `ingest-fixture` 在写 raw 前执行字段、类型、大小、secret/PII、policy pin 与 metric allowlist 校验。
2. `compute-signals` 校验全部 Observation 状态、Scope、Goal/Cycle、time window 与 raw checksum。
3. 明确 denominator，保留 signal/no-signal/insufficient/negative/unavailable。
4. 仅在独立人工决定、Source/Claim/Observation closure 完整时调用 `materialize-evidence`。
5. 把 ANO、BSIG、EVD 分离交给 lifecycle gate，不推断因果。

## 输出

Create-only raw、ANO、BSIG 或 candidate EVD，以及 metric quality、warning、checksum、版本和 `causal_claim:false`。

## 可做事项

- 读取本地 synthetic fixture；
- 计算确定性 Signal；
- 对不完整、零分母、负向或不可用数据如实记录；
- 创建等待后续人工审核的 candidate Evidence。

## 禁止事项

- 不连接真实 GA4/GSC/CRM/server logs；
- 不读取或保存 Token、Cookie、账号、`.env` 或 PII；
- 不把 ANO/BSIG直接放入 Claim Evidence；
- 不自动批准 Evidence，不宣称内容变更造成访问或注册。

## 失败与停止条件

Policy/measurement/rule 未 pin、未知 metric、secret/PII、raw drift、Observation superseded/cross-Goal、Source/Claim/Owner closure 缺失或 create-only 冲突时停止，写前失败保持零新增。

## 验收方式

Analytics 正常与对抗测试通过；所有 Signal/denominator 状态可复算；旧 raw/ANO/BSIG 字节不变；真实 MyyShop 与外部系统未访问。

## 示例

```bash
node <plugin-root>/scripts/geo-analytics.mjs ingest-fixture --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/geo-analytics.mjs compute-signals --workspace <workspace> --plan <plan.json>
```
