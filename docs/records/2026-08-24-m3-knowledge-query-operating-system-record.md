---
title: M3 Knowledge & Query Operating System 验收记录
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/tasks/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/records/2026-08-24-m2-contract-provenance-kernel-record.md
scope: M3 Schema、Tool、Skills、合成发布门、MyyShop candidate/draft slice 与本地项目 Lead 验收
---

# M3 Knowledge & Query Operating System 验收记录

## 1. 验收结论

M3 的本地工程门和 MyyShop 最窄候选闭环已通过：六类 M3 对象、Query/Claim/Evidence 扩展、四个 Skills、create-only propose/assemble、状态与批准前置校验、证据充分性建议、版本 pin、关系追溯与生命周期 gate 均有实际测试或 Workspace 实例证据。

本 Record 的 `verified` 仅覆盖本地源码、合成 Fixture 和 MyyShop `candidate/draft` 切片。Spec 0004 仍为 `proposed`；MyyShop 没有 `formal/approved/frozen/published` 对象，没有正式 Knowledge Release、真实 M4 诊断资格、外部发布、业务验证或部署。

## 2. 会话移交硬门的实际结果

Owner 要求 M2 验收后只在精确 `gpt-5.5-sol-max`、标准速度且环境一致的新会话继续；若不一致则留在当前会话完成。创建新任务时，任务接口返回：

```text
create_thread could not validate reasoning effort "max" for model "gpt-5.5-sol-max".
Use a model and reasoning combination listed in the tool description, or omit thinking.
```

因此没有新任务被创建，也没有发生近似模型或静默降级，无法进入新会话环境预检。按 Owner 明确的 fallback 条件，本会话继续完成 M3 与 M4 Handoff。

## 3. 基线、授权与变更范围

开工与收口事实：

- 工作目录：`/Users/sujingjun/geo-cowork`
- 分支：`main`
- HEAD：`4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd`
- 远端关系：`main...origin/main`
- 工作树：开工时干净；收口时保留本目标产生的未提交修改
- Node：`v22.14.0`；npm：`10.9.2`

当前授权只包含本地 SDD、实现、Fixture、MyyShop candidate/draft 对象、测试、Record 与 Handoff。未授权 commit、push、PR、真实平台采集、外部系统写入、业务批准、发布或部署；本次均未执行。

M3 实现范围：

1. `m3-record-types.schema.json` 与 M3-ready 对象模板；
2. `knowledge-query.mjs`、独立 `knowledge-trace.mjs` 与 CLI；
3. `geo-query`、`geo-knowledge`、`geo-evidence`、`geo-knowledge-cycle`；
4. 10 个 M3 合成正常、非法与边界测试；
5. MyyShop 13 个 canonical 对象、1 个受 checksum 保护的候选快照与 15 个派生 indexes；
6. M3 Record、文档导航与 M4 Handoff。

## 4. Project Lead 复核发现与修复

| 复核发现 | 修复与验证 |
| --- | --- |
| candidate/draft refs 齐全时，原 trace 容易被误读为可发布 | 拆出 `knowledge-trace.mjs`；trace 同时返回关系 refs、`lifecycle_ready` 与逐对象 `LIFECYCLE_NOT_READY` gate |
| plan 后部目标冲突可能在前部写入后才暴露 | 全量序列化与既有目标预检先于 create-only 写入；测试证明确定性冲突前无半成品 |
| 同一 stable ID 可尝试换路径写入 | 在写入前按 graph 校验 ID/path 身份并返回 `OBJECT_CONFLICT` |
| M2 最小 Query/Claim 可被 M3 assemble 误接收 | 保留 M2 parser 兼容性，同时给 M3 命令增加 profile 必填字段门 |
| published Release 未检查 draft Document 或 stale Source | 发布闭包增加 approved Document、approved Evidence、active Source 约束 |
| 记录的充分性可能与实际 approved Evidence 类别矛盾 | 新增 `EVIDENCE_SUFFICIENCY_DRIFT` warning；不自动改状态或字段 |
| 主语义文件逼近 500 行 | 将 trace 拆为单一职责模块；主文件最终 487 行，未越过仓库拆分线 |
| MyyShop 答案风险项不完整 | 候选 Answer Card 显式保留五条产品基线风险，仍不提升为业务批准 |

## 5. 实际验证

| 命令 | 退出码 | 实际结果 |
| --- | ---: | --- |
| `npm run test:m3-knowledge-query` | 0 | 10 tests 全部通过；覆盖 approved/non-approved Document、强制 candidate、幂等、duplicate/conflict/no-partial、stable ID/path、M3 profile、approval/freeze/readiness/version/hash、trace 与 warnings |
| `npm run test:m2-contract` | 0 | 25 tests 全部通过，M2 回归未破坏 |
| `npm test` | 0 | 47 tests 全部通过 |
| `npm run validate:plugin` | 0 | `ok:true`，38 个 Manifest、Skill、Marketplace、模板、Schema、脚本、运行库与依赖检查项通过 |
| `node .../workspace-validate.mjs --workspace workspaces/myyshop --objects` | 0 | `ok:true`；missing/errors/object_errors/warnings 均为空 |
| `node .../knowledge-query.mjs validate --workspace workspaces/myyshop` | 0 | errors 为空；仅两条预期 `EVIDENCE_INSUFFICIENT` warning |
| `node .../knowledge-query.mjs trace ... --query Q-MYYSHOP-WHAT-IS-001` | 0 | 关系链完整；`lifecycle_ready:false`，9 个待人工状态/approval/readiness gates |
| `node .../build-index.mjs --workspace workspaces/myyshop`（连续两次） | 0/0 | 两次均 `object_count:13`、`legacy_count:120`、15 个 index；聚合 SHA 均为 `fb0e043deb6641e8e0628a0634a59b664cd23783418f36565dccc90142ebf65e` |
| legacy 120 文件 current/HEAD 比较 | 0 | 以“路径 + NUL + 原始字节”聚合，两边均为 `fb9d551a78812b74e2a1747d57a2563deb4067bfd24225ade38aa5ae2cb1ecae`；`git diff --quiet` 为 0 |
| `npm ls --depth=0` / `npm audit --omit=dev` | 0/0 | 仅锁定的 Ajv/gray-matter；`found 0 vulnerabilities` |
| 全部范围 `.mjs` 的 `node --check`、JSON parse、`git diff --check` | 0 | 语法、JSON 与 whitespace 检查通过；实现文件均小于 500 行 |

## 6. MyyShop candidate/draft 实例

| 对象 | 状态 | 业务边界 |
| --- | --- | --- |
| `GOAL-MYYSHOP-DEFINITION-001` | candidate | 感知目标待 Owner 批准 |
| `Q-MYYSHOP-WHAT-IS-001` | candidate | 未成为 formal Query |
| `SRC-MYYSHOP-FINAL-PRODUCT-PLAN-001` | active | 指向 approved 产品基线；不等于业务事实 approval |
| `SRC-MYYSHOP-LEGACY-KNOWLEDGE-001` | active | 只登记两个 legacy draft 位置 |
| `EVD-MYYSHOP-LEGACY-DEFINITION-001` | candidate | snapshot checksum 有效；没有 approval |
| `DOC-MYYSHOP-WHAT-IS-001` | draft | 候选事实文档，范围与未决事项明确 |
| `CLM-MYYSHOP-AUDIENCE-001` | candidate/insufficient | 缺 approved first-party Evidence |
| `CLM-MYYSHOP-LIFECYCLE-SERVICE-001` | candidate/insufficient | 缺 approved first-party 与 data/case Evidence |
| `ANS-MYYSHOP-WHAT-IS-001` | candidate | 包含直接答案、限制与五条风险边界 |
| `QS-MYYSHOP-DEFINITION-001` | draft | 未 frozen，无 approval/freeze metadata |
| `KR-MYYSHOP-DEFINITION-001` | draft/incomplete | 不是 Knowledge Release 发布证明 |
| `EPL-MYYSHOP-DEFINITION-001` | draft | 只描述补证要求，不表示材料已提供 |
| `RUN-MYYSHOP-M3-DEFINITION-001` | completed/not_evaluated | 技术步骤完成与业务结果分开 |

追溯结果可达 Goal、Query Set、Answer Card、两个 Claim、Evidence、两个 Source、Document 和 draft Release。关系完整不等于生命周期就绪；9 个 gate 明确指出 Query、Goal、Set、Answer、Claims、Evidence、Document、Release 尚未满足人工门。

## 7. Spec 行为映射

| 行为 | 证据 |
| --- | --- |
| M3 新对象 Schema 与非空集合 | `m3-knowledge-query.test.mjs`、插件模板校验 |
| approved Document → candidate Claim/Answer | M3 正常与 non-approved 测试 |
| 不自动 formal/frozen/published | assemble 与 lifecycle gate 测试 |
| create-only、幂等、冲突前预检 | duplicate/path/stable ID/no-partial 测试 |
| 精确 version pin 与 frozen content hash | published 合成链与 drift 测试 |
| approval、Goal、Release 闭包 | 非法 formal/frozen/published 测试 |
| stale/sufficiency/drift warning 不改状态 | warning 测试与只读 validator |
| M2/M3 profile 隔离 | M2 最小对象回归与 M3 profile 拒绝测试 |
| 关系 trace 与发布生命周期 gate 分离 | 合成 ready trace 与 MyyShop candidate trace |
| legacy 120 不改写 | current/HEAD 聚合、diff 与 compatibility index |

## 8. 已知限制与后续门

1. v1 在当前 checkout 内只允许每个 stable ID 有一个 canonical 当前版本；version pin 会在内容版本漂移时失败，历史字节由 Git 与不可覆盖 Run 工件保存。本里程碑没有实现同一 checkout 内多 revision 并存解析；若 M4 后需要并行读取旧、新版本，必须先立新 Spec/Task。
2. Claim 生命周期顺序是治理规则；M3 没有自动 promote 命令，也没有 append-only 人工状态转换账本。validator 校验目标状态的 approval/Release/证据前置，不能凭单个当前文件证明完整历史路径。
3. 多文件 propose 对可预见校验和既有目标冲突先全量预检；意外 I/O/进程故障仍可能留下已合法创建的 candidate 子集，重试将 `kept` 已有同字节对象并继续。它不是跨文件数据库事务。
4. 两条真实 Claim 均证据不足；产品方案与 legacy 草稿不能替代事实 Owner 的逐对象批准。
5. 未执行真实站点、舆情、竞品、平台答案、GA4/GSC 或业务数据采集；这些属于后续授权门。
6. 未执行宿主安装缓存复验、commit、push、PR、发布或部署。

## 9. Git 与交付状态

所有结果保留在 `/Users/sujingjun/geo-cowork` 的 `main` 脏工作树；未执行任何 Git 写入远端或不可逆清理。下一里程碑只以 `docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md` 为交接入口，并仍受上述人工门限制。

