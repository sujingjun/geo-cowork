---
name: geo-lifecycle
description: 用于启动、推进、恢复和复盘 GEO Cycle，包括显式授权的 online 真实周期与隔离 development-test 演练；不用于代替 Owner 事实、采用、发布或复盘决定。
---

# geo-lifecycle

## 正式真实周期（Spec 0015）

读取 Workspace identity 与当前 `cycles/preparation/real-cycle-plan.json`。`online/authorized_real` 自动进入真实编排，不能复制演练 seed 或 fixture feedback。运行 `preflight` 和 `inbox` 获取零写检查；`start` 准备知识审核包，知识批准和运行前置齐备后才冻结真实 Cycle。

```bash
node <plugin-root>/scripts/geo-lifecycle.mjs preflight --workspace <real-workspace>
node <plugin-root>/scripts/geo-lifecycle.mjs start --workspace <real-workspace>
node <plugin-root>/scripts/geo-lifecycle.mjs continue --workspace <real-workspace>
node <plugin-root>/scripts/geo-lifecycle.mjs receive-answer --workspace <real-workspace> --file <bound-capture.json>
node <plugin-root>/scripts/geo-lifecycle.mjs record-publication --workspace <real-workspace> --file <publication-receipt.json>
```

由 Agent 根据冻结槽位和 Owner 原始材料生成上述文件，Owner 不维护内部 ID/hash。五平台两槽、提交间隔、原文与引用、实际窗口均由工具校验；`submission_unknown` 不重新提交。真实模型提取不以 Fake 替代。人工反馈继续使用 `apply-feedback`，原始审核包不可改写。

`continue` 每次只执行一个可恢复动作；返回 `progress` 后可继续，节流等待后再执行；`waiting_human`、`waiting_window`、`needs_input` 分别指实际人工输入、尚未到期或具名缺口。仅补证建议不能发布。W1–W4 不能补造时间，第二轮必须来自真实已决定 Review 和独立 Goal/知识批准。

完成以 canonical required stages、完整矩阵、Trace 和 Owner Review 为准；工程测试或真实输入 smoke 均不代表两个真实周期完成。`report` 输出 `reports/real-cycle-overview.md`。深层合同与操作详见开发仓库 Spec 0015 和 `docs/runbooks/authorized-real-two-cycle.md`；安装后以当前用户工作区的执行计划和工具诊断为准。

## 当前知识驱动入口（Spec 0014）

Owner 维护知识正文、原始材料和可读反馈；Agent 通过以下入口生成内部 ID、计划与状态。当前专题的明确指令优先于历史过程文档。

```bash
node <plugin-root>/scripts/geo-lifecycle.mjs start --workspace <isolated-workspace>
node <plugin-root>/scripts/geo-lifecycle.mjs continue --workspace <isolated-workspace>
node <plugin-root>/scripts/geo-lifecycle.mjs inbox --workspace <isolated-workspace>
node <plugin-root>/scripts/geo-lifecycle.mjs apply-feedback --workspace <isolated-workspace> --file <owner-feedback.md>
node <plugin-root>/scripts/geo-lifecycle.mjs report --workspace <isolated-workspace>
```

默认 seed 是显式 synthetic/test_only 原始业务输入；可通过 `--input` 提供相同业务输入合同。运行产物必须写用户工作区，不能写安装缓存。真实提取默认 DeepSeek，配置从调用环境或显式 `GEO_ENV_FILE` 读取；OpenAI-compatible 支持配置切换，当前 Owner 已免除公司网络网关的真实验证。禁止用 Fake 替代模型成功结果。

新入口生成可读审核包；将 Owner 的原始明确决定输入 `apply-feedback`，由工具生成 reviewed/decided successor。演练驱动器可输入独立 `fixture_human` 反馈，但不能表述为真实 Owner 批准。原始输入生成所有下游工件，不调用预置 gate fixture 证明产品旅程。

`reports/geo-cycle-overview.md` 汇总知识、Query、答案、缺口、建议、反馈、双复测、Analytics 和两轮 Review。模型调用、模拟外部输入、真实采集和真实业务效果分别报告。

## 既有底层合同入口

以下底层接口保留，用于合同测试和诊断；Owner 不需要维护这些内部 plan。

## 触发场景

- 创建 MyyShop development-test Workspace 与 `test_only` 品牌知识库并冻结 Cycle 输入；
- 按 Spec 0007 推进 Baseline、诊断、采用、Publication、双 Retest、Analytics 与 Review；
- 恢复 orphan transition、检查 active drift 或重建 completed trace。

## 输入

development-test Workspace、显式 `knowledge_base_ref`、稳定对象 ID/path/version/bytes SHA、人工 fixture decision，以及当前 Cycle ID。每个 `advance` plan 必须携带已经存在的 canonical `gate_objects` descriptors。

## 开工前必读

读取 Spec 0003—0007、当前 Task/Record/Handoff、Workspace 根身份、frozen CIS 和当前 Cycle。先运行：

```bash
node <plugin-root>/scripts/geo-lifecycle.mjs validate --workspace <workspace>
```

## 步骤

1. `prepare-development-workspace` 一次性登记真实线上 Merchant identity 与隔离的 test-only KBASE；不创建第二商户。
2. 注入已批准的 synthetic M2—M5 seed 后，`create-cycle` 创建 freeze CIS 与 Cycle。
3. 每阶段先物化合法 canonical gate，再以 descriptor 的 ID/type/status/version/path/SHA 调用 `advance`。
4. Analytics 后使用 `assemble-review` 创建 waiting CRV；人类决定必须使用新 CRV ID。
5. 使用 `trace` 从 snapshot copies 重建历史并报告 drift、缺边和真实边界。

## 输出

Merchant/KBASE、CIS、CTR、Cycle、CRV、阶段摘要、trace、errors/warnings、下一 gate 与 `real_myyshop_impact:false` 的测试范围声明。

## 可做事项

- 调用确定性本地 core；
- 使用脱敏 fixture、create-only artifact、exclusive lock 与 CAS；
- 保留失败、orphan、supersede 和人工门记录。

## 禁止事项

- 不从 ID 猜测或创建 M4/M5 gate；
- 不绕过 Publication、Retest、Analytics 或 Review；
- synthetic Cycle 不写真实 `workspaces/myyshop`；模型请求使用明确配置的真实 provider，其他外部输入仍按具名任务范围操作；线上 GA4/GSC 走独立只读入口；
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
