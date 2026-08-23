---
title: M3 Knowledge & Query Operating System Handoff
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd with uncommitted M2 and M3 in-progress changes
source:
  - docs/records/2026-08-24-m2-contract-provenance-kernel-record.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/tasks/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
scope: 新会话环境硬门的实际失败、当前会话 fallback、M3 收口与 M4 Handoff
---

# M3 Knowledge & Query Operating System Handoff

> 本 Handoff 已执行并收口。新任务因精确模型/推理组合无法通过任务接口校验而未创建；按 Owner 预设 fallback，由原会话完成 M3。当前事实以 M3 Record 为准，下一入口是 `docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`。

## 1. 历史唯一目标（已完成）

在已验收 M2 内核上完成 M3 的工程闭环与 MyyShop candidate/draft slice，建立可复现 M3 Acceptance Record，并生成 M4 Diagnosis, Site & Asset Proposal Handoff。不得在 M3 内实现 M4。

## 2. 新会话模型与环境硬门

Owner 指定新会话必须使用 `gpt-5.5-sol-max`、标准速度，并与当前会话使用同一环境。创建后第一回合只能做只读预检，不能修改文件：

```bash
pwd
git branch --show-current
git rev-parse HEAD
git status --short --branch
node --version
npm --version
npm ls --depth=0
shasum -a 256 package-lock.json
npm run test:m2-contract
```

通过条件：

- 系统实际确认模型配置恰为 Owner 指定值，不接受近似模型、别名推断或静默降级；
- 工作目录必须是 `/Users/sujingjun/geo-cowork`，不能是新 worktree 或干净 checkout；
- 分支 `main`、HEAD `4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd`，并可见本 Handoff 与全部未提交在制文件；
- Node/npm、两项锁定依赖、package-lock hash 与当前会话一致；
- M2 专项测试通过。

任一项不一致，立即停止新会话，不做修复、不写文件；把结果返回当前会话，由当前会话继续完成 M3。

## 3. 已完成并可依赖的 M2

以 `docs/records/2026-08-24-m2-contract-provenance-kernel-record.md` 为验证证据：

- M2 专项 25 tests 通过；
- 全量回归在该 Record 记录的检查点通过；
- MyyShop `--objects` 通过，legacy index 为 120，canonical object 为 0；
- 120 条 legacy knowledge 与 HEAD 聚合 SHA 相同；
- 未 commit/push/PR/发布/部署。

M2 Spec 0003 仍为 `proposed`；本地验证不替 Owner 批准。

## 4. 移交时的 M3 在制事实（历史快照）

下列内容描述本 Handoff 创建时的状态；后续已形成 M3 Record，不能再把本节当当前事实：

- M3 Requirement、PRD、Architecture、Spec 0004、Plan、Task；
- `schemas/m3-record-types.schema.json`；
- `scripts/lib/knowledge-query.mjs` 与 CLI；
- Document、Answer Card、Knowledge Release、Query Set、Evidence Plan、Perception Goal 模板；
- `geo-knowledge-cycle`、`geo-query`、`geo-knowledge`、`geo-evidence` 四个 Skills；
- `tests/m3-knowledge-query.test.mjs`，当前合成检查点 5 tests 通过。

在制实现只证明合成批准链的机器行为；MyyShop 真实工作区仍没有 canonical M3 对象，也没有人类 approval。

## 5. 第一动作：重新审查，不直接续写

1. 完整读取 `AGENTS.md`、`docs/workflow.md`、最终产品方案、M2 Record、本 Handoff、M3 Spec/Plan/Task。
2. 对 M3 在制 diff 做 read-only 审查，逐项核验 Schema、refs、状态机、approval、create-only、trace 与 tests；不要相信本 Handoff 的概括代替源码。
3. 先运行现有 M3 专项测试，记录实际 test 数和失败；发现 Spec/实现冲突时停在受影响切片，先修文档/测试再实现，但不得自行把 Spec 标为 approved。

## 6. 必须完成的 M3 任务

### 6.1 机器契约收口

- 补足 plan duplicate/path/ID、目标冲突、无半成品、trace incomplete、非法状态/approval/readiness/version/hash 等边界测试；
- 审查 M2/M3 Schema 合并是否让 M2 对象意外强制携带 M3 字段；如有实质冲突，记录并请求 Owner 决策，不静默改语义；
- validator 只给充分性建议，不自动写 status、approval 或 Release。

### 6.2 MyyShop candidate/draft slice

建立最窄 “What is MyyShop” 链：candidate Goal/Query、repo Source、reviewed 或 candidate Evidence、draft Document、candidate Claim/Answer Card、draft Query Set/Knowledge Release、draft Evidence Plan、独立 Run。必须：

- 不把最终产品方案自动当成已批准品牌事实；
- 不写真实 `approval`，不使用合成 Fixture 的审批人；
- 不改 120 条 legacy knowledge；
- Set/Release 保持 draft，Run `completed` 与 `business_result:not_evaluated` 分开；
- trace 能到 Source/Evidence/Document；如候选状态导致正式发布门未通过，要以明确 warning/gate 记录，不伪造通过。

### 6.3 Project Lead 验收

实际执行并记录：

```bash
npm run test:m3-knowledge-query
npm test
npm run validate:plugin
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/knowledge-query.mjs trace --workspace workspaces/myyshop --query Q-MYYSHOP-WHAT-IS-001
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop
git diff --check
```

连续两次 index hash 必须一致，legacy count/聚合 SHA 仍为 120/不变。建立 `docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md`，明确机器验证与人类业务门的区别。

## 7. M4 Handoff 要求

M3 收口后创建 `docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`，至少列明：

- M3 已验证的代码、对象、版本和 trace；
- MyyShop 哪些对象仍为 candidate/draft，缺哪些 Owner approval；
- 只有 approved Goal、formal/frozen Query Set、published Knowledge Release 具备真实 M4 诊断输入资格；
- M4 的 Requirement/PRD/Spec/Plan/Task 尚需按工作流建立和批准；
- 不在 Handoff 中预制 Finding、Asset、Gap、建议稿、发布或业务结论。

## 8. 停止条件与授权

- 需要把 MyyShop 业务事实、Goal、Document、Query、Claim、Answer Card、Query Set 或 Knowledge Release 提升到人工状态时停止并请求 Owner 明确决定；
- 不得把 candidate slice 或合成 Fixture 当作真实 KR v1 发布；
- 不得实施 M4、采集真实平台、访问 GA4/GSC、写外部系统；
- 不得 commit、push、PR、发布或部署，除非当次另有明确授权；
- 保留当前脏工作树和所有用户/前序会话修改，不做 reset/checkout/清理。

## 9. 实际执行结果

- 新任务创建失败信息：`create_thread could not validate reasoning effort "max" for model "gpt-5.5-sol-max"`；未创建任务、未接受近似模型、未进入环境写入。
- 当前会话 fallback 完成 M3 Schema/Tool/Skills、10 项专项测试、MyyShop 13 个 candidate/draft canonical 对象、完整关系 trace 与 `lifecycle_ready:false` gates。
- 实际命令、hash、warnings、限制与 Git 状态见 [`../records/2026-08-24-m3-knowledge-query-operating-system-record.md`](../records/2026-08-24-m3-knowledge-query-operating-system-record.md)。
- 后续只从 [`2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`](2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md) 进入 M4；本 Handoff 不再是接续入口。
