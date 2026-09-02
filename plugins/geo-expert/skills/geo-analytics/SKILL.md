---
name: geo-analytics
description: 在 development-test KBASE 校验 Analytics fixture，或在当次授权下读取线上 Merchant 的 GA4/GSC/聚合业务文件，登记 Observation、计算非因果 Business Signal 并生成 candidate Evidence。
---

# geo-analytics

## 触发场景

- 用本地 fixture 验证 Analytics seam；
- 在当次精确授权下执行 GA4/GSC `collect-observe` 或聚合业务文件 `ingest-business-file`；
- 登记 `analytics_observation`、计算 `business_signal`；
- 在事实 Owner 决定后把合格 Observation 独立物化为 candidate Evidence。

## 输入

development-test 或 online Workspace、显式 Merchant/执行范围、fixture 或已授权聚合输入、pinned measurement contract、signal rule、sensitive-data policy、Observation versions 和 materialization plan。

## 开工前必读

读取 Spec 0007、Spec 0010、Spec 0012、账号与数据 Runbook、当前授权决定和数据边界。业务文件只接受 Workspace-local、聚合、脱敏 JSON/CSV。

## 步骤

1. `ingest-fixture` 在写 raw 前执行字段、类型、大小、secret/PII、policy pin 与 metric allowlist 校验。
2. `compute-signals` 校验全部 Observation 状态、Scope、Goal/Cycle、time window 与 raw checksum。
3. 明确 denominator，保留 signal/no-signal/insufficient/negative/unavailable。
4. 仅在独立人工决定、Source/Claim/Observation closure 完整时调用 `materialize-evidence`。
5. 把 ANO、BSIG、EVD 分离交给 lifecycle gate，不推断因果。
6. 真实 GA4/GSC 使用 `collect-observe` 单次执行；业务文件使用 `ingest-business-file`，两者均只创建 candidate Evidence。

## 输出

Create-only raw、ANO、BSIG 或 candidate EVD，以及 metric quality、warning、checksum、版本和 `causal_claim:false`。

## 可做事项

- 读取本地 synthetic fixture，或在双确认和有效授权下读取精确 GA4/GSC 资源；
- 计算确定性 Signal；
- 对不完整、零分母、负向或不可用数据如实记录；
- 创建等待后续人工审核的 candidate Evidence。

## 禁止事项

- 不扩大真实 GA4/GSC/业务文件的商户、资源、字段、时间窗或 scope；
- 不读取或保存 Token、Cookie、账号、`.env` 或 PII；
- 不把 ANO/BSIG直接放入 Claim Evidence；
- 不自动批准 Evidence，不宣称内容变更造成访问或注册。

## 失败与停止条件

Policy/measurement/rule 未 pin、未知 metric、secret/PII、raw drift、Observation superseded/cross-Goal、Source/Claim/Owner closure 缺失或 create-only 冲突时停止，写前失败保持零新增。

## 验收方式

Analytics 正常与对抗测试通过；所有 Signal/denominator 状态可复算；旧 raw/ANO/BSIG 字节不变；真实读取只以对应 Record 的命令和结果为准。

## 示例

```bash
node <plugin-root>/scripts/geo-analytics.mjs ingest-fixture --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/geo-analytics.mjs compute-signals --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/geo-analytics.mjs ingest-business-file --workspace <workspace> --plan <plan.json>
```
