---
title: Knowledge-Independent GEO Lifecycle Readiness 最终工程验收记录
status: verified
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/requirements/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/prd/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/plans/2026-09-02-knowledge-independent-lifecycle-readiness-plan.md
  - docs/tasks/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/records/2026-09-02-m7-cycle1-cycle2-independent-qa-record.md
  - docs/records/2026-09-02-m8-cross-host-conformance-record.md
  - docs/records/2026-09-02-myyshop-real-cycle-readiness-report.md
  - docs/records/2026-09-02-ga4-gsc-observation-materialization-record.md
scope: 真实品牌知识库缺席下的本地工程验收、真实 Cycle 启动就绪入口与 MyyShop Analytics Observation 适配；不含发布部署
workdir: /Users/sujingjun/geo-cowork
baseline: 初始 HEAD/origin 9b0a2c5；主体实现已本地提交为 main HEAD 9ffff86；本次真实 Analytics 产物与 Record 更新仍 dirty、未提交；未 push/PR
---

# Knowledge-Independent GEO Lifecycle Readiness 最终工程验收记录

## 1. 当前结论

代码、Schema、Workspace、Query Portfolio、Readiness、synthetic 双 Cycle、独立 M7 QA、服务端业务文件 adapter 与 M8 required conformance 已实现并通过当前稳定工作树验证。最终 `npm test` 为 333/333 pass。

用户完成企业 SSO 与 Google OAuth 后，ADC token refresh、exact-plan dry-run 和真实 GA4/GSC `collect-observe` 均通过。GA4/GSC 各返回 7 行、0 warning；create-only 形成两个 recorded ANO、一个非因果 BSIG、一个无 approval 的 candidate EVD、两个 Source 与 completed Run。当前 Record 在声明的 knowledge-independent engineering 范围内提升为 `verified`。

本状态不影响 Knowledge-Independent 工程能力：真实 MyyShop Readiness 已只读执行并如实返回 real KBASE 缺席、`real_cycle_start_ready:false`、`formal_cycle_created:false`、`content_gap_inferred:false`。

## 2. 交付

- 单一 `MER-MYYSHOP-001`；真实与 development-test Workspace 使用相同线上 locator 和 GA4/GSC 非凭据配置。
- 新 `workspaces/myyshop-development-test` 与 `KBASE-MYYSHOP-DEVTEST-001`；test-only 知识闭包完整，绝不自动转正。
- 显式 `knowledge_base_ref` 进入 test scope、Cycle/CIS 与 Cycle 2 freeze；旧 `test_merchant` record/CLI/module/template/fixture path 删除。
- Query Portfolio 迁移并重验；原 Record NUL 修复为 UTF-8 文本。
- `geo-readiness report` 只读区分工程与真实启动就绪。
- GA4/GSC `collect-observe`、JSON/CSV `ingest-business-file`、真实 ANO/非因果 BSIG/candidate EVD materializer。
- M8 `geo-conformance` required tier 与 WorkBuddy native boundary。
- 独立 M7 QA Record、M8 Record、Readiness Report 与真实启动 Runbook。

## 3. 实际验证

| 命令 | exit | 结果 |
| --- | ---: | --- |
| `git fetch --prune` + HEAD/origin 检查 | 0 | `9b0a2c5`；0 ahead / 0 behind |
| `npm run test:query-portfolio` | 0 | 21/21 |
| `npm run test:analytics-readonly` | 0 | 15/15；含合并 collect-observe seam |
| `node --test tests/analytics-observation-inputs.test.mjs tests/business-file-materializer.test.mjs` | 0 | 5/5 |
| 真实 `collect-observe --confirm-readonly` | 0 | GA4/GSC 各一请求、各 7 行、0 warning；raw SHA `41dcaf47d8d53b8e4faf270c35ae424bffe0911e4737c4fc80c16c48dd81a3f0` |
| `npm run test:m6-cycle`（独立 QA） | 0 | 113/113 |
| `npm run test:m7-strategy`（独立 QA） | 0 | 57/57 |
| 显式 Cycle 1/2 E2E（独立 QA） | 0 | 9/9 |
| `npm run test:m8-conformance` | 0 | 5/5 |
| 实际 `conformance:m8` | 0 | required 5/5；统一 digest；optional 3 项 not_executed |
| `npm test` 最终稳定重跑 | 0 | 333/333；含 real-KBASE switch 后同一 `create-cycle` 启动 authorized-real fixture |
| 两 Workspace `workspace-validate --objects` | 0 | 均 0 error / 0 warning |
| MyyShop M3 validate | 0 | 只有两条既有 `EVIDENCE_INSUFFICIENT` warning |
| MyyShop Query Portfolio validate | 0 | 两条既有 Evidence warning + 三条 advisory coverage warning |
| `npm run validate:plugin` | 0 | 新 Schema/Tool/Skill/template 全部纳入 |
| `npm run check:docs` | 0 | 125 files / 196 links；Analytics Materialization Record 纳入末次复验 |
| `git diff --check` | 0 | 无 whitespace error |

## 4. 首次失败与修复

- 新模块测试最初因文件不存在 3/3 failed；实现最小模块后 7/7 pass。
- 首轮完整回归 326/328：三个模板缺 `knowledge_base_ref/execution_scope` 导致两项 Plugin 测试失败；补齐后 Plugin pass，当时全量 332/332。
- 新增 real-KBASE 启动纵切后一次全量为 332/333：空 Workspace `validate` 被错误改成抛异常；恢复结构化 errors 合同后最终全量 333/333。
- M7 独立 QA 首次 Plugin 校验因两个新 Skill 缺标准正文小节失败；集成侧补齐后由 QA 独立复跑通过，M7 runtime 未修改以掩盖结果。
- 真实 `collect-observe` 首次在 token 获取前因 ADC 需要重新认证而停止；默认 client 回调悬挂后被取消，随后使用既有仓库外 Desktop OAuth client，由用户亲自完成 SSO/OAuth。token 只做 stdout 丢弃的 refresh check。
- 首轮成功物化后发现 raw 沿用采集阶段的 `persisted_to_workspace:false`，与实际持久化事实冲突。精确删除仅本轮未提交错误 bundle，修复并补测试后重新真实采集；当前 raw 为 `persisted_to_workspace:true`，错误 bundle 不再存在。

## 5. 删除与可恢复性

按 Owner 明确授权删除旧 `test_merchant` runtime surface：

- `plugins/geo-expert/scripts/lib/m6-test-merchant.mjs`；
- `plugins/geo-expert/assets/object-templates/test-merchant.md`；
- `tests/fixtures/m6-test-merchant/`；
- `tests/m6-test-merchant-isolation.test.mjs`。

它们仍可从 Git 历史恢复；历史 Spec/Record/Handoff 未删除。新实现与测试已迁移到 workspace-scope / Merchant / KBASE。

## 6. 未验证与外部门

- 真实 GA4/GSC Observation materialization 已完成，但只覆盖批准资源、字段与 2026-08-23—2026-08-29 窗口；不证明数据完整或业务效果。
- 当前没有获授权的服务端聚合业务文件；adapter 只完成 fixture/负例验证，没有生成真实业务 Observation。
- 真实品牌 KBASE 和 Goal-scoped 知识切片尚未提供；120 条 legacy knowledge 不是自动前置门，也未被自动认定为真实知识库。
- 未批准任何真实 Query、Claim、Evidence、Adoption、Publication 或 Cycle Review；新 Analytics Evidence 设计固定 candidate。
- 未执行消费者 UI 自动化、Codex/Claude native interactive、WorkBuddy manual/native、外部 Publication、push、PR、部署、发布或业务效果验证；主体实现已有本地 commit `9ffff86`，本次真实 Analytics 收口尚未另行提交。

## 7. 下一动作

1. 由事实 Owner 审阅 `EVD-MYYSHOP-ANALYTICS-20260902`；系统不得自动批准或绑定 Claim。
2. 真实品牌知识切片到位后按 Runbook 切换 `knowledge_base_ref`，Readiness 通过前不创建 MyyShop 正式 Cycle。
3. 后续新的时间窗或资源必须建立新的授权、plan、对象 ID 与 Record，不能覆盖本次结果。
