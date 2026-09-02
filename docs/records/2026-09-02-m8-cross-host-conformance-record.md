---
title: M8 Cross-host Conformance 工程验收记录
status: verified
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/tasks/2026-09-02-knowledge-independent-lifecycle-readiness.md
scope: Codex/Claude packaging+shared Tool 与 WorkBuddy 中国区 test-only semantic fixture；不含 native interactive
workdir: /Users/sujingjun/geo-cowork
baseline: main HEAD 9b0a2c5b45868dc5b71e076e2a876c02dbca7e6b；origin/main 同 SHA；当前工作区含本 Task 未提交修改
---

# M8 Cross-host Conformance 工程验收记录

## 1. 结论

M8 required executions 五项全部通过，normalized digest 为 `5362a087165823f44b14310c9458d1acff4bf7bc1c6bf590e07dc9b5a8e84ade`：

- Codex `packaging_static`、`direct_shared_tool`；
- Claude Code `packaging_static`、`direct_shared_tool`；
- WorkBuddy 中国区 `test_only_semantic_fixture`。

Codex/Claude `native_interactive` 与 WorkBuddy `manual_configuration_check` 均为 `not_executed`。WorkBuddy 固定 `native_adapter_present:false`、`native_host_verified:false`、`packaging_contract_available:false`、`native_packaging_conformance_applicable:false`。

## 2. 实际命令

| 命令 | exit | 结果 |
| --- | ---: | --- |
| `npm run test:m8-conformance` | 0 | 5/5；一致、mismatch、unsupported、伪造 native boundary、PII 与实际 packaging/shared Tool |
| `npm run conformance:m8 -- run --workspace workspaces/myyshop-development-test --profile workspaces/myyshop-development-test/execution/conformance/profile.json` | 0 | required 5/5；统一 digest；optional 3 项未执行 |
| `npm run validate:plugin` | 0 | M8 Schema、CLI、lib 与模板纳入插件自检 |

## 3. 边界

本 Record 只证明仓库包装、同一 shared Tool 的确定性输出与 WorkBuddy test-only 语义边界。它不证明 Codex/Claude native UI、WorkBuddy 插件包装、真实宿主交互、发布、部署、真实 Cycle 或业务效果。
