# M2 Contract & Provenance Kernel Handoff

- 状态：approved
- 日期：2026-08-23
- 来源：[`docs/plans/2026-08-23-geo-cowork-final-product-plan.md`](../plans/2026-08-23-geo-cowork-final-product-plan.md)
- 适用范围：`sujingjun/geo-cowork` 里程碑 M2 初始化设计与实施前准备
- 执行主体：下一位实现 Agent
- Owner：David
- 当前授权：完成现状差异审查，并建立 M2 的 Requirement / PRD / Architecture / Spec / Plan / Task；**未授权跳过批准门直接实施 M3，也不得自行扩大到平台采集、GA4、GSC 或战略发现**
- 执行结果（2026-08-24）：后续用户指令授权并完成了 M2 本地实现与验收；证据见 [`2026-08-24-m2-contract-provenance-kernel-record.md`](../records/2026-08-24-m2-contract-provenance-kernel-record.md)。M3 接续以 [`2026-08-24-m3-knowledge-query-operating-system-handoff.md`](2026-08-24-m3-knowledge-query-operating-system-handoff.md) 为准。

---

## 1. 本次唯一目标

将已经批准的最终产品方案落成一个可实施、可测试、可交接的 **M2 Contract & Provenance Kernel**。

M2 只解决后续所有 GEO 能力共同依赖的本地事实与运行契约：

```text
Markdown Object Contract
+ stable IDs / refs
+ Markdown → rebuildable indexes
+ Source / Evidence / Finding / Asset 基础模型
+ Run / Cycle 基础模型
+ immutable run artifacts
+ supersede 语义
+ ops-geo Evidence Manifest 迁移契约
```

M2 不做 Query 研究业务能力，不做 Knowledge Release 业务流程，不做 Playwright 五平台采集，不做 GA4/GSC，不做最终内容建议，更不建设达人共创产品。

---

## 2. 开工前必须读取

按以下顺序读取，不能只看 Handoff：

1. `AGENTS.md`
2. `docs/workflow.md`
3. `docs/README.md`
4. `docs/plans/2026-08-23-geo-cowork-final-product-plan.md`
5. `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`
6. `docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`
7. `docs/records/` 中最近的 M0/M1 验收记录
8. `plugins/geo-expert/` 当前 Skills / Scripts / Schemas
9. `workspaces/myyshop/` 当前工作区与现有 120 条知识内容
10. `sujingjun/ops-geo` 当前可复用 Evidence / Audit 契约（只读研究，不直接复制第二套业务规则）

源码与当前工作区事实优先于历史 Handoff；发现历史计划与最终产品方案冲突时，以 2026-08-23 最终产品方案为当前 Owner 已批准基线，并在 Record 中列出冲突与迁移处理。

---

## 3. 第一动作：做差异审查，不直接写实现

建立：

`docs/records/2026-08-23-m2-contract-provenance-gap-review.md`

至少回答：

### 3.1 当前已有能力

逐项核验真实源码和工作区：

- 当前 Markdown Frontmatter 约定；
- `workspace.json` 与 workspace validator；
- 当前 `build-index` 是否存在、覆盖什么；
- 当前 Query / Knowledge / Finding / Run 对象实际形态；
- 当前插件 Scripts 的输入输出；
- 当前测试 Fixture；
- `ops-geo` 已有哪些 Evidence Manifest、SHA、Finding、规则版本和历史 raw fixture 能复用。

### 3.2 最终方案新增的差距

明确哪些尚不存在：

- 公共 Markdown Object Contract；
- `Source` 与 `Evidence` 分离；
- stable object ID / version / refs；
- `indexes/*.json` 纯派生语义；
- duplicate ID / broken ref validation；
- Run status 与业务结果分离；
- immutable Run artifacts；
- input changed → old Run `superseded`；
- Cycle core version references；
- ops-geo legacy evidence migration adapter。

### 3.3 冲突清单

特别检查：

- 旧 M2 Handoff 是否直接进入 Query/Knowledge，而跳过 Contract Kernel；
- 现有目录是否与最终 Workspace Directory Model 冲突；
- 是否存在 JSON-first 或多事实源实现倾向；
- 是否存在综合 GEO score 被当作新契约；
- 是否存在 Agent/Skill 自己维护业务规则的重复事实源。

退出条件：Gap Review 写完，所有结论有真实文件路径或代码证据，不使用“应该有”“大概存在”等表述。

---

## 4. 必须建立的 canonical SDD 工件

Gap Review 后创建以下文档，命名可按仓库规范微调，但职责不得混合：

### Requirement

`docs/requirements/2026-08-23-m2-contract-provenance-kernel.md`

重点写：为什么当前 M2 不能直接进入 Query/Knowledge、需要解决哪些可复现性与证据追溯问题、用户/Agent 需要完成哪些可验证动作、明确非目标。

### PRD

`docs/prd/2026-08-23-m2-contract-provenance-kernel.md`

只描述产品行为：

- 人类如何创建/修改 Markdown 对象；
- Agent 如何读取对象；
- index 如何作为只读派生；
- broken ref 如何呈现；
- Run 中断/恢复/失效如何被用户理解；
- 历史 Run 为什么不可覆盖；
- ops-geo 历史审计如何进入统一证据链。

PRD 不写类名、函数名、npm 包和文件内部实现。

### Architecture

`docs/architecture/2026-08-23-contract-provenance-kernel-architecture.md`

冻结：

```text
Host Agent Loop
→ Skills
→ Deterministic Tools
→ Markdown Workspace (authoritative)
→ rebuildable indexes (derived)
```

明确 Node.js 是业务内核，Python 只允许作为受控 Tool；不得把 DeepSeek Harness / LangGraph / 数据库引入 M2。

### Spec

建议新建：

`docs/specs/0003-contract-provenance-kernel.md`

必须精确到：

- 公共 Frontmatter 最小字段；
- type-specific extension 机制；
- stable ID 格式约束；
- object version；
- refs 的解析与允许类型；
- indexes 的 JSON 结构；
- index rebuild/idempotency；
- duplicate ID / broken ref / invalid frontmatter 错误语义；
- Run status；
- Run business result 独立字段；
- immutable artifact 规则；
- supersede 条件；
- Source/Evidence/Finding/Asset/Run/Cycle 最小结构；
- Evidence snapshot checksum / locator / source ref；
- ops-geo import/migration 输入输出；
- 安全：路径穿越、父目录读取、secret/PII、symlink、覆盖已有文件；
- 并发/幂等：重复构建 index、重复导入、重复 supersede；
- 非目标与未来扩展点。

### Plan

`docs/plans/2026-08-23-m2-contract-provenance-kernel-plan.md`

必须按可演示纵切组织，不按“先建 20 个 Schema”组织。

推荐切片：

```text
Slice A
Markdown parser + common contract + valid/invalid fixture

Slice B
index builder + refs validator + duplicate/broken-ref diagnostics

Slice C
Run contract + immutable artifacts + supersede

Slice D
ops-geo Evidence Manifest adapter + MyyShop legacy fixture migration
```

### Task

`docs/tasks/2026-08-23-m2-contract-provenance-kernel.md`

每个任务包含成功标准、目标文件、测试、验证命令、非目标、风险和当前状态。

---

## 5. M2 设计冻结项

除非真实源码证明不可行，否则以下为 Owner 已批准方向，不要重新发散：

1. **Markdown-first**：Markdown 是业务事实权威；JSON index 永远可重建、不可反向覆盖 Markdown。
2. **公共基础 + 类型扩展**：所有 Markdown 对象至少包含 `id / record_type / status / version / created_at / updated_at`。
3. **稳定业务对象 + 不可覆盖历史 Run**：Query / Claim / Evidence / Finding / Asset 等有稳定 ID；Run 原始工件不可改写。
4. **Run 状态与业务结论分离**：`completed` 只表示执行完成，不表示 GEO 结果通过。
5. **恢复时关键输入变化**：旧 Run 标记 `superseded`，创建新 Run，不继续混用新旧输入。
6. **Source 与 Evidence 分开**：第一版先轻量记录，不设计来源综合可信度分数。
7. **无 GEO 总分**：ops-geo 的历史综合分只允许作为 legacy observation，不成为 M2 权威指标。
8. **Node 主体 + Python Tool**：不在 Python Tool 内维护 Claim/Finding/Run 等业务规则。
9. **不造新 Agent Runtime**：宿主负责 Agent loop；M2 只做本地业务契约与工具。
10. **现有 120 条知识不批量重写**：通过兼容索引/迁移逐步纳入。

---

## 6. 开源吸收边界

M2 可以直接评估/引入：

- `gray-matter`：Markdown Frontmatter；
- `ajv`：JSON Schema / tool IO 校验。

M2 只做设计适配，不提前引入：

- Playwright；
- Crawlee；
- GA4 MCP；
- GSC MCP；
- promptfoo；
- DeepSeek Harness Runtime；
- LangChain / LangGraph；
- PostgreSQL / Redis / Qdrant / Neo4j。

`ops-geo` 只能吸收 Evidence Manifest / SHA / provenance / rule version / legacy fixture 思想或代码；不得复制出第二套 Finding taxonomy 或 GEO 评分规则。

---

## 7. 预期测试与机器门

Spec / Plan 必须至少规划以下测试：

```text
valid markdown object → pass
missing common frontmatter → fail
unknown record_type → fail or explicit extensibility rule
duplicate stable id → fail
broken ref → fail with source path + ref
index delete → rebuild byte/semantic equivalent
rebuild twice → idempotent
index cannot mutate markdown
path traversal → fail
parent workspace escape → fail
symlink escape → fail or explicit policy
secret marker scan → fail
run artifact overwrite → fail
resume unchanged input → allowed
resume changed key input → old run superseded + new run
ops-geo legacy fixture → deterministic migrated evidence/finding refs
legacy score → retained as non-comparable metadata only
```

现有仓机器门至少继承：

```bash
npm test
npm run validate:plugin
```

并在 Plan 中定义新的 M2 专项命令，例如：

```bash
npm run test:m2-contract
node plugins/geo-expert/scripts/build-index.mjs --workspace tests/fixtures/...
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace tests/fixtures/...
```

具体脚本名由 Spec/Plan 冻结，不能先写代码后倒推契约。

---

## 8. 停止条件

完成 Requirement / PRD / Architecture / Spec / Plan / Task 后停止，提交 Owner 审核。

以下情况必须停止并说明，不要自行决策：

- 需要改变最终产品方案中的 Markdown-first 原则；
- 需要引入数据库作为 M2 权威事实源；
- 需要让 JSON index 成为可写事实源；
- 需要批量改写现有 120 条 MyyShop 知识；
- 需要新增云端服务或强制 MCP；
- 需要把 Python audit tool 变成第二业务内核；
- 现有 Spec 与最终产品方案出现实质不可兼容冲突；
- 需要改变 Claim/Evidence/GEO Cycle 已批准产品语义。

**未获得 Owner 对 M2 Spec/Plan 的后续批准前，不进入代码实现。**

---

## 9. Agent 可直接使用的启动指令

```text
你现在接手 sujingjun/geo-cowork 的下一阶段工作。

目标不是继续旧的“Query 与知识 M2”，而是按照 Owner 2026-08-23 已批准的最终产品方案，先建立新的 M2 Contract & Provenance Kernel。

严格执行：
1. 从最新 main 开始，读取 AGENTS.md、docs/workflow.md、docs/README.md、最终产品方案和最近 Handoff/Record；
2. 先对当前源码、workspaces/myyshop 和 ops-geo 做事实型差异审查，写 Gap Review Record；
3. 基于差距建立 M2 Requirement、PRD、Architecture、Spec、Plan、Task；
4. M2 设计必须坚持 Markdown authoritative / rebuildable JSON indexes / stable IDs / refs / immutable Run artifacts / supersede / Source-Evidence 分离；
5. 不引入数据库、LangGraph、DeepSeek Harness Runtime，不进入 Playwright/GA4/GSC，不批量重写现有知识；
6. 把 gray-matter、Ajv 作为 M2 可直接复用候选，把 ops-geo 只作为 Evidence/provenance adapter 来源；
7. 为每个行为建立验收项与测试映射，尤其覆盖 duplicate ID、broken refs、index rebuild、path traversal、run overwrite、supersede、legacy audit migration；
8. 完成所有 SDD 工件后停止，不自行批准 Spec，不进入代码实现；
9. 输出：差异结论、所有新文档路径、关键冻结决策、风险/冲突、建议的 M2 实施批次和需要 Owner 批准的事项。

当前最高优先级是“把事实和运行契约做对”，不是增加更多 GEO Skills 或 Agent。
```
