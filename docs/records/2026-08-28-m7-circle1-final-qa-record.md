---
title: M7 / Circle 1 稳定快照独立最终 QA 记录
status: verified
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/records/2026-08-28-owner-m7-circle1-scope-amendment.md
  - docs/records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md
  - docs/handoff/2026-08-28-m7-circle1-owner-internal-review-handoff.md
  - docs/runbooks/m6-test-merchant-internal-review.md
  - 2026-08-28 全新 gpt-5.6-sol max 独立只读 final red-team QA
scope: synthetic/test_only Circle 1 工程与人工接管包；Strategy/Circle 2/M8/真实系统全部 deferred
workdir: /Users/sujingjun/.codex/worktrees/4910/geo-cowork
baseline: detached HEAD a5d8365cb124893e2a79154e27d84c7b73ffc58b; local HEAD...origin/main 0/0; no fetch
---

# M7 / Circle 1 稳定快照独立最终 QA 记录

## 1. 结论

限定 Owner 最新 Circle 1 范围：`P0=0、P1=0、P2=0`。可把 M7 / Circle 1 Owner 人工内测接管 Handoff 改为 `verified`。

`verified` 只表示 `synthetic/test_only` Circle 1 工程与人工接管包已验证；不表示 Owner 人工产品体验通过，也不授权后续 M8。

## 2. Git 与稳定快照

- Checkout：`/Users/sujingjun/.codex/worktrees/4910/geo-cowork`
- Branch：detached HEAD
- HEAD：`a5d8365cb124893e2a79154e27d84c7b73ffc58b`
- 本地 `origin/main`：同一提交；`HEAD...origin/main = 0/0`
- 未 fetch、未联网；QA 未修改仓库或稳定 Review Workspace
- QA 首尾状态一致：16 个 tracked changes、134 个 nonignored untracked files
- 仓库 manifest：971 files / 4,290,708 bytes / `63a56e5653452baee485e2a48c24ace21cb137d14626294af41ed94105fa75fa`；首尾一致
- Review Workspace manifest：178 files / 257,735 bytes / `e8e528816fec2a2101f0664e87e99565e27f462ab1cefd6b51f7e1f7137e1f1c`；首尾一致

manifest 覆盖排序后的路径、文件类型、长度与原始 bytes。QA 后仅补本 Record、更新 Handoff/导航等验收文档；未改 Circle 1 runtime/tests，文档检查另行重跑。

## 3. 实际命令与 exit

| 命令 | exit | 结果 |
| --- | ---: | --- |
| `npm run test:m6-cycle` | 0 | 113/113 pass |
| `node --test tests/m6-final-*.test.mjs` | 0 | 19/19 pass |
| `npm run validate:plugin` | 0 | `ok:true` |
| `npm run check:docs` | 0 | 96 files / 166 links |
| MyyShop `workspace-validate --objects` | 0 | 零错误 |
| MyyShop `build-index --check` | 0 | 328 objects / 120 legacy / `written:[]` |
| MyyShop `answer-cycle validate` | 0 | 零错误；11 个历史 Profile warning 与 40/100 Source deferred warning 保留 |
| `git diff --check` | 0 | 无错误 |
| Review Workspace `workspace-validate --objects` | 0 | 零错误 |
| Review Workspace `build-index --check` | 0 | 60 objects / `written:[]` |
| Review Workspace `answer-cycle validate` | 0 | 零错误、零 warning |
| `GEO_M6_NETWORK_DISABLED=1 ... geo-lifecycle trace` | 0 | completed/full、synthetic、no-real-impact、九门完整有序 |

九门顺序：

```text
baseline_recorded
→ diagnosis_ready
→ adoption_decided
→ publication_confirmed
→ technical_retest_completed
→ answer_retest_completed
→ analytics_recorded
→ review_waiting_human
→ review_decided
```

## 4. 对抗结果

- 人工生成器对已存在目标：exit 1，`TARGET_EXISTS`；零覆盖。
- 对真实 `workspaces/myyshop`：exit 1，`REAL_WORKSPACE_WRITE_FORBIDDEN`；零写。
- 未设置网络禁用变量：exit 1，`NETWORK_GUARD_REQUIRED`。
- Circle 1 两个入口的静态依赖图不含 deferred Strategy/Cycle 2 模块；相关模块只由 deferred 子命令动态导入。
- 临时副本移走两个 Cycle 2 模块后，Circle 1 trace 仍 exit 0；首次探针因 QA 副本缺本地 `gray-matter` 而失败，补入同版本本地依赖并使用 macOS canonical `/private/tmp` 后通过，判定为 QA harness 设置问题，不是产品失败。
- 178 个 Review Workspace 文件未发现疑似凭证值、IPv4、真实 MyyShop URL/ID 或非 `.invalid` 外部主机；`fixture-user@example.invalid` 是显式 synthetic 负例。
- secret/phone/IP、PII policy 漂移、真实 URL/ID 污染 final tests 均实际通过。

## 5. 明确 deferred / 未验证

- Strategy Discovery、STA/DDM/STO；
- GCB/GCD/GSEL、Circle 2；
- M8 Cross-host Conformance；
- 真实 MyyShop 业务执行；
- GA4/GSC/CRM/CMS、消费者平台或其他外部系统；
- Owner 人工产品体验结论；
- commit、push、PR、merge、部署、发布与业务效果。

`validate:plugin` 对 deferred 文件只证明包装/注册未破坏，不证明其功能已验证。
