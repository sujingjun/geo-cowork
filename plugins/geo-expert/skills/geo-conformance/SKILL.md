---
name: geo-conformance
description: 执行 M8 Codex/Claude packaging 与 shared Tool、WorkBuddy 中国区 test-only semantic fixture 的确定性 conformance；保留 native/optional 边界。
---

# geo-conformance

## 触发场景

M8 required host tiers 的工程一致性与 fail-loud 验收。

## 输入

development-test Workspace 与 frozen conformance profile JSON。

## 开工前必读

读取 Spec 0009、Spec 0012、Workspace identity、KBASE 与 profile。

## 步骤

执行：

```bash
node <plugin-root>/scripts/geo-conformance.mjs run --workspace <path> --profile <profile.json>
```

检查 required executions、统一 digest、host boundary 与 optional 状态。

## 输出

逐 execution 结果、统一 normalized digest、optional runs 与 limitations。

## 可做事项

检查 Codex/Claude packaging、直接运行 shared Tool，并校验 WorkBuddy test-only semantic fixture。

## 禁止事项

不得创建 WorkBuddy Manifest、不得把 semantic fixture 表述为真实宿主验收，不得读取凭据。

## 失败与停止条件

required execution 缺失、不支持、输出 digest 不一致或出现敏感数据时 fail loud。

## 验收方式

运行 `npm run test:m8-conformance` 与一次实际 `conformance:m8`；Codex/Claude native interactive 与 WorkBuddy manual configuration 默认 `not_executed`。

## 示例

```bash
node <plugin-root>/scripts/geo-conformance.mjs run --workspace ./workspaces/brand-development-test --profile ./profile.json
```
