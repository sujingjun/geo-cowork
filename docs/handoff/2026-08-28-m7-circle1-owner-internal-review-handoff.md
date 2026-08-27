---
title: M7 / Circle 1 Owner 人工内测接管交接
status: verified
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/records/2026-08-28-owner-m7-circle1-scope-amendment.md
  - docs/records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md
  - docs/runbooks/m6-test-merchant-internal-review.md
  - docs/records/2026-08-28-m7-circle1-final-qa-record.md
scope: synthetic/test_only Circle 1 稳定验收与 Owner 人工接管；后续 Strategy/Circle 2/M8 全部 deferred
---

# M7 / Circle 1 Owner 人工内测接管交接

## 1. 当前目标

本 Handoff 已在稳定 Circle 1 重验与全新 gpt-5.6-sol max 独立 QA 后改为 `verified`。当前验收对象是测试商户 Circle 1，不是原最终产品计划中的 Strategy Branch、Circle 2 或 Cross-host Conformance。

工程证据：M6 113/113、final adversarial 19/19、plugin/docs/MyyShop 只读 checks、生成 Workspace validate/index/answer/trace 全部 exit 0；QA 首尾仓库与 Review Workspace manifests 完全一致。详情见独立 QA Record。

## 2. Owner 运行入口

在 checkout 根选择一个尚不存在的新路径：

```bash
node tests/manual/m6-internal-review.mjs \
  --workspace workspaces/m7-circle1-owner-review
```

随后执行：

```bash
node plugins/geo-expert/scripts/workspace-validate.mjs \
  --workspace workspaces/m7-circle1-owner-review --objects

GEO_M6_NETWORK_DISABLED=1 node plugins/geo-expert/scripts/geo-lifecycle.mjs trace \
  --workspace workspaces/m7-circle1-owner-review \
  --cycle CYC-M6-TEST-001
```

详细人工检查项见 `docs/runbooks/m6-test-merchant-internal-review.md`。

## 3. 接管门

Owner 应记录每个对象/步骤的判断、看到的脱敏内容、期望行为与严重度，并明确回复：

- Circle 1 通过，允许重新定基线并启动后续 M8；
- Circle 1 有条件通过，先修复指定问题；
- Circle 1 不通过，停止后续里程碑。

账号就绪、登录状态或本机宿主配置不等于真实访问授权。

## 4. 明确 deferred

- Strategy Discovery/STA/DDM/STO；
- GCB/GCD/GSEL 与 Circle 2；
- Cross-host Conformance；
- 真实 MyyShop 与任何真实账号/数据；
- Git 远端、发布与部署。

范围调整前的后续代码/测试现场保留但不属于本 Handoff 的 verified 范围。
