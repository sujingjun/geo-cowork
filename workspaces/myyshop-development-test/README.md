# MyyShop Development Test GEO Workspace

本 Workspace 是 MyyShop 0→1 开发期的隔离 `test_only` 品牌知识库。它与真实 `workspaces/myyshop` 使用同一线上 Merchant identity `MER-MYYSHOP-001` 及相同非凭据 GA4/GSC 资源配置，但所有知识、批准、Cycle 与结果只具 synthetic/test-only 证明角色。

## 固定边界

- KBASE：`KBASE-MYYSHOP-DEVTEST-001`；
- Merchant locator：`https://www.myyshop.com/`；
- GA4 Property：`356373250`；GSC URL-prefix：`https://www.myyshop.com/`；
- test-only Claim/Evidence/approval 不能转正、复制或混入真实品牌知识库；
- `.invalid` 仅用于合成 Source/Asset/consumer fixture，不代表第二个商户；
- 不执行真实消费者平台 UI 自动化，不创建真实 Publication 或业务效果。

## 工程入口

```bash
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop-development-test --objects
node plugins/geo-expert/scripts/geo-readiness.mjs report --workspace workspaces/myyshop-development-test --knowledge-base KBASE-MYYSHOP-DEVTEST-001 --goal GOAL-M6-TEST-001
npm run conformance:m8 -- run --workspace workspaces/myyshop-development-test --profile workspaces/myyshop-development-test/execution/conformance/profile.json
```

synthetic Cycle 1/2 的完整九门与故障恢复由 `npm run test:m6-cycle`、`npm run test:m7-strategy` 复验。真实知识切片到位后的启动步骤见 `docs/runbooks/myyshop-real-cycle-start.md`。
