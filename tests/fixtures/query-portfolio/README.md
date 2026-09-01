# Query Portfolio 测试 Fixture

本目录只包含 `synthetic/test_only` 的离线测试输入，不代表真实 MyyShop 商户、Query 观察、批准或业务效果。

- `plans/intake-basic.json`：知识库缺席 E2E 使用的基础 intake 计划；引用测试商户 fixture workspace 内的合成 Source（`SRC-QP-TEST-001`）与 Perception Goal（`GOAL-QP-TEST-001`）。
- workspace 身份、`test_merchant`、Source 与 Goal 对象由 `tests/helpers/query-portfolio-fixtures.mjs` 在临时目录中创建，全部使用 `.invalid` locator 与 `fixture://` 批准。

Fixture 不得复制到 `workspaces/myyshop/`。
