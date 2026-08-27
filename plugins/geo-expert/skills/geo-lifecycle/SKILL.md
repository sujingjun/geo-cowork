---
name: geo-lifecycle
description: 编排测试商户 GEO Cycle 的输入冻结、阶段门、并发恢复、人工 Review 与 snapshot trace；不连接真实系统或替代人工决定。
---

# geo-lifecycle

## 触发场景

- 创建独立 `test_only` 测试商户并冻结 Cycle 输入；
- 按 Spec 0007 推进 Baseline、诊断、采用、Publication、双 Retest、Analytics 与 Review；
- 恢复 orphan transition、检查 active drift 或重建 completed trace。

## 输入

测试 Workspace、显式 plan、稳定对象 ID/path/version/bytes SHA、人工 fixture decision，以及当前 Cycle ID。每个 `advance` plan 必须携带已经存在的 canonical `gate_objects` descriptors。

## 开工前必读

读取 Spec 0003—0007、当前 Task/Record/Handoff、Workspace 根身份、frozen CIS 和当前 Cycle。先运行：

```bash
node <plugin-root>/scripts/geo-lifecycle.mjs validate --workspace <workspace>
```

## 步骤

1. `prepare-test-merchant` 一次性创建 `.invalid`、fictitious、synthetic/test-only 身份与 TMT。
2. 注入已批准的 synthetic M2—M5 seed 后，`create-cycle` 创建 freeze CIS 与 Cycle。
3. 每阶段先物化合法 canonical gate，再以 descriptor 的 ID/type/status/version/path/SHA 调用 `advance`。
4. Analytics 后使用 `assemble-review` 创建 waiting CRV；人类决定必须使用新 CRV ID。
5. 使用 `trace` 从 snapshot copies 重建历史并报告 drift、缺边和真实边界。

## 输出

Test Merchant、CIS、CTR、Cycle、CRV、阶段摘要、trace、errors/warnings、下一 gate 与 `real_myyshop_impact:false` 的测试范围声明。

## 可做事项

- 调用确定性本地 core；
- 使用脱敏 fixture、create-only artifact、exclusive lock 与 CAS；
- 保留失败、orphan、supersede 和人工门记录。

## 禁止事项

- 不从 ID 猜测或创建 M4/M5 gate；
- 不绕过 Publication、Retest、Analytics 或 Review；
- 不写真实 `workspaces/myyshop`，不联网，不访问账号或凭据；
- 不把 synthetic completed 表述为真实 Cycle、业务效果或 v1 Release。

## 失败与停止条件

身份/Scope/refs/checksum/版本漂移、gate 不完整、lease active、stale 未恢复、CAS mismatch、污染或人工决定缺失时立即停止。旧对象与 artifacts 不删除、不覆盖。

## 验收方式

M6 core/CLI/E2E 测试通过；同 plan 幂等；非法顺序、缺门、并发、恢复和污染负例失败；MyyShop 只读摘要前后不变。

## 示例

```bash
node <plugin-root>/scripts/geo-lifecycle.mjs create-cycle --workspace <workspace> --plan <plan.json>
node <plugin-root>/scripts/geo-lifecycle.mjs trace --workspace <workspace> --cycle CYC-EXAMPLE-001
```
