# M6 测试商户 Fixture

本目录只包含 `synthetic/test_only` 的离线测试输入，不代表真实 MyyShop 商户、账号、Publication、Analytics 或业务效果。

- `workspace.json`：独立虚构测试身份；locator 固定使用 `.invalid`。
- `contracts/`：冻结的测量、Signal 与敏感数据策略。
- `analytics/`：不含个人信息或凭据的合成聚合观测。

Fixture 不得复制到 `workspaces/myyshop/`，也不得进入真实指标分母。
