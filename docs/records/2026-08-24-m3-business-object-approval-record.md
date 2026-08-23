---
title: M3 MyyShop 业务对象全量批准记录
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 7de1e7b0cc475bd9ae967386598d09adaf2f4949
source:
  - 当前用户指令：业务对象全部批准
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m3-business-objects-approved.md
scope: MyyShop M3 业务对象人工批准、内部 Knowledge Release v1 与 Query Set 冻结
---

# M3 MyyShop 业务对象全量批准记录

## 1. 决定与结论

2026-08-24，MyyShop Owner 在当前会话明确指令“业务对象全部批准”。本次把该指令作为可追溯人工决定，应用到 M3 Record 中等待人工门的全部业务对象；统一 decision ref：

```text
workspace://cycles/preparation/decisions/2026-08-24-m3-business-objects-approved.md
```

批准后，`Q-MYYSHOP-WHAT-IS-001` 的关系 trace 为 `lifecycle_ready:true` 且 `gates:[]`。这证明本地 M3 业务对象状态闭包满足 M4 的知识/Query 输入门，不代表 M4 SDD 已批准、真实诊断已运行，或任何外部资产已发布。

## 2. 状态与版本映射

所有发生状态或 approval 变化的对象从 `1.0.0` 提升为 `1.0.1`；Source 保持 `1.0.0`，历史 Run 保留其原输入版本。

| 对象 | 变更前 | 变更后 | approval/说明 |
| --- | --- | --- | --- |
| `GOAL-MYYSHOP-DEFINITION-001` | candidate 1.0.0 | approved 1.0.1 | 已记录 Owner approval；尚未自动进入 active Cycle |
| `Q-MYYSHOP-WHAT-IS-001` | candidate 1.0.0 | formal 1.0.1 | 从 `queries/candidates/` 移入 `queries/formal/` |
| `QS-MYYSHOP-DEFINITION-001` | draft 1.0.0 | frozen 1.0.1 | pin Query 1.0.1；freeze hash `8a12a16bd2bc4d3e5a4934cd8be17dba28e2cbc57f3d29d0f1d7032dcfd7fe3f` |
| `EVD-MYYSHOP-LEGACY-DEFINITION-001` | candidate 1.0.0 | approved 1.0.1 | Evidence 类别仍为 `legacy_draft` |
| `DOC-MYYSHOP-WHAT-IS-001` | draft 1.0.0 | approved 1.0.1 | Scope 与未决补证事项保留 |
| `CLM-MYYSHOP-AUDIENCE-001` | candidate 1.0.0 | published 1.0.1 | 进入内部 KR；first-party warning 保留 |
| `CLM-MYYSHOP-LIFECYCLE-SERVICE-001` | candidate 1.0.0 | published 1.0.1 | 进入内部 KR；first-party/data-or-case warnings 保留 |
| `ANS-MYYSHOP-WHAT-IS-001` | candidate 1.0.0 | published 1.0.1 | limitations 与 forbidden statements 保留 |
| `KR-MYYSHOP-DEFINITION-001` | draft/incomplete 1.0.0 | published/ready 1.0.1 | `release_version: 1.0.0`；仅为本地正式知识包 |
| `EPL-MYYSHOP-DEFINITION-001` | draft 1.0.0 | active 1.0.1 | 该类型没有 approval 字段；active 表示 Owner 接受补证计划 |

两个 Source 保持 `active`；`RUN-MYYSHOP-M3-DEFINITION-001` 保持 `completed/not_evaluated`，继续作为批准前 candidate slice 的历史技术 Run。

## 3. Evidence Sufficiency 决策边界

批准不等于伪造证据。权威产品方案规定 Evidence Sufficiency 是建议，最终由人决定是否采用；因此本次同时做了两件事：

1. Owner 的明确决定允许对象进入内部 Knowledge Release；
2. 系统继续返回两条 `EVIDENCE_INSUFFICIENT` warning，不把产品方案或 legacy 草稿改标成不存在的 `first_party/data/case` Evidence。

validator 已移除“缺建议证据即硬阻断 published Release”的错误逻辑，并增加合成回归：具备完整人类 approval 的发布链可通过，同时保留不足 warning。Claim Scope、Answer limitations、五条禁止/风险表述仍然生效。

## 4. 时间校正

候选对象原 `created_at/captured_at` 使用了晚于实际文件创建时间的占位时间。批准落盘前以本地文件 birth time 校正为 2026-08-24 01:11—01:21（Asia/Shanghai），approval/updated 时间为 `2026-08-24T06:46:23+08:00`。该校正修复审计时间顺序，不改变业务陈述、快照字节或证据类别。

## 5. 实际验证

| 命令 | 结果 |
| --- | --- |
| `npm run test:m3-knowledge-query` | 10/10 通过；含 approved published 链保留 insufficiency warning |
| `npm run test:m2-contract` | 25/25 通过 |
| `npm test` | 47/47 通过 |
| `npm run validate:plugin` | `ok:true`，38 项通过 |
| `workspace-validate --objects` | `ok:true`，无 object errors |
| `knowledge-query validate` | errors 为空；仅两条预期 `EVIDENCE_INSUFFICIENT` |
| `knowledge-query trace --query Q-MYYSHOP-WHAT-IS-001` | `lifecycle_ready:true`，`gates:[]`，关系闭包完整 |
| `build-index` 连续两次 | 均为 13 canonical、120 legacy、15 indexes；聚合 SHA 均为 `14948dfd817b5573e9540573f6af33c3f41e11d6c5554377ecc31ab7cf2b08b4` |
| legacy current/HEAD | 120 条，路径+NUL+原始字节聚合均为 `fb9d551a78812b74e2a1747d57a2563deb4067bfd24225ade38aa5ae2cb1ecae`；diff exit 0 |
| `git diff --check` / 语法 / JSON /文档链接 | 通过 |

## 6. Git 与发布边界

批准开始前检测到用户已将前序 M2/M3 工作提交并推送为 `7de1e7b`（`main == origin/main`，提交说明 `feat: m2，m3里程碑`）。本次只在该基线上形成新的本地未提交批准变更；Agent 未执行 commit、push、PR、merge 或远端修改。

`knowledge_release:published`、Claim/Answer `published` 只表示进入本地正式知识包，不代表 About、Homepage、FAQ、Schema、llms、媒体、插件或生产环境已发布。真实平台采集、M4 实现、外部发布、部署与业务效果仍各自需要独立授权和 Record。
