---
title: 五平台 guard adapter 移除 terms_blocked 并统一由 GEO Browser Extension 完成记录
status: verified
created: 2026-09-02
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
  - docs/records/2026-09-02-geo-browser-query-task-slice-record.md
  - "2026-09-02 当前用户指令：五个平台 guard adapter 移除 terms_blocked 状态，统一调整成 geo chrome 插件完成"
  - "2026-09-02 当前用户确认：放开 Perplexity，五平台完全统一走扩展 manual_assist"
scope: 五个平台 guard adapter 合同、Browser Query Task 平台门、相关测试与现行文档
workspace: /Users/sujingjun/geo-cowork
branch: main
baseline: f14ef1a64e354a1c62e7ce0cf94504334acfed74
---

# 五平台 guard adapter 移除 terms_blocked 并统一由 GEO Browser Extension 完成记录

## 1. 结论

按 Owner 当次明确指令，五个平台 guard adapter（ChatGPT、Gemini、Perplexity、Google AI、Claude）的 `terms_blocked` 状态已移除：adapter 合同枚举收窄为 `allowed/manual_only`，五平台统一为 `manual_only`，且 `manual_fallback.mode` 统一冻结为 `extension_manual_assist`——五个平台的 Query 测试统一由 GEO Browser Extension（manual_assist）在 Owner-controlled 浏览器中完成。

自动化门不变：任何非 `allowed` 平台尝试 `dom_automation` 或 Playwright 采集，仍在浏览器启动前被 `PLATFORM_TERMS_BLOCKED` 阻止；adapter 变成 `allowed` 仍需平台方书面许可与 Workspace permission ref（2026-08-25 决策第 3 条继续有效）。

## 2. 成功标准与结果

| 成功标准 | 结果 |
| --- | --- |
| 五平台 adapter 不再有 `terms_blocked` 状态 | 已实现；合同枚举仅 `allowed/manual_only`，四平台由 `terms_blocked` 改为 `manual_only` |
| 五平台统一由 geo chrome 插件完成 | 已实现；五平台 `manual_fallback.mode` 统一 `extension_manual_assist`，Browser Query Task 合同强制该校验 |
| Perplexity 放开扩展 manual_assist | 已实现；`user_supplied_result` 限制移除，导出/结果 URL 导入通道保留 |
| 自动化仍被阻止 | 已实现；`assertPlatformAutomationAllowed` 对非 `allowed` 仍抛 `PLATFORM_TERMS_BLOCKED` |
| 全部测试通过 | 已实现；见第 4 章 |

## 3. 实际变更

- `plugins/geo-expert/scripts/collectors/platforms/{chatgpt,claude,google-ai,perplexity,gemini}.mjs`：`automation.status` 统一 `manual_only`；`manual_fallback.mode` 统一 `extension_manual_assist` 并更新 requirements；perplexity 移除 `user_supplied_result` 模式与 `terms_blocked` stop condition，保留 `allowed_source_kinds: ['user_supplied_export', 'user_supplied_result_url']`；五个 adapter version 升为 v2。
- `plugins/geo-expert/scripts/collectors/platforms/index.mjs`：`automation.status` 枚举移除 `terms_blocked`。
- `plugins/geo-expert/scripts/lib/browser-query-task-contract.mjs`：manual_assist 分支由「拒绝 `user_supplied_result` 模式」改为「强制 `extension_manual_assist` 模式」，正面冻结统一通道。
- 测试：`tests/m5-platform-adapters.test.mjs`（状态/mode 断言、五平台 manual 统一允许）、`tests/browser-query-task.test.mjs`（policy.status 期望 `manual_only`）、`plugins/geo-browser-extension/tests/bootstrap.test.mjs`（非 `allowed` 示例改用 `manual_only`）。
- 文档：根 `README.md`、`plugins/geo-browser-extension/README.md`、`docs/specs/0006-consumer-answer-testing.md` 第 17 章与 frontmatter（updated 2026-09-02，新增指令来源）、`CHANGELOG.md` 新条目。
- 历史 Record/Plan/决策文档未改写；本决定覆盖 `workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-perplexity-user-export-authorized.md` 中 Perplexity 禁止提交新 Query 的限制，以本次 Owner 指令为准。

## 4. 实际验证

| 命令 | 结果 |
| --- | --- |
| `node --test tests/m5-platform-adapters.test.mjs tests/m5-manual-sample.test.mjs tests/browser-query-task.test.mjs tests/m5-cli.test.mjs` | 23/23 通过 |
| `npm --prefix plugins/geo-browser-extension run test:extension` | 4/4 通过 |
| `npm test`（根全量） | 347/347 通过 |
| `npm run check:docs` | 196 个链接，0 error |
| `npm run validate:plugin` | 通过 |
| `git diff --check` | 通过 |

## 5. 授权与未验证边界

- 本次仅为本地 adapter 合同与文档变更；未访问任何真实消费者平台、未登录账号、未提交或采集任何 Query/Output。
- 未在用户 Chrome Profile 安装或可视化验收扩展；五平台真实 manual_assist Query 测试属于后续人工执行门。
- Perplexity consumer Terms 文本未重新核验；放开依据是 Owner 当次明确指令，不解释为平台条款已变化。
- 本 Record 随本次本地交付提交；未 push、PR、发布或部署。
