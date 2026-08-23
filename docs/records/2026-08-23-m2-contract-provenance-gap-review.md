---
title: M2 Contract & Provenance Kernel 现状差异审查
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd
source:
  - docs/handoff/2026-08-23-m2-contract-provenance-kernel-handoff.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
scope: M2 开工前的本仓、MyyShop 工作区与 ops-geo 上游只读差异审查
---

# M2 Contract & Provenance Kernel 现状差异审查

## 1. 审查结论

当前仓库只有 M0/M1 的插件包装、工作区初始化和根结构校验，尚不存在 M2 的公共 Markdown Object Contract、机器 Schema、可重建索引、refs 校验、Run 生命周期、不可覆盖工件或 legacy audit adapter。

`workspaces/myyshop/` 目前只有 `knowledge/`，不是 `docs/specs/0002-workspace-contract.md` 所称的完整工作区实例。120 条实际知识条目是需要保留的 legacy 内容，不能通过批量补 Frontmatter 假装完成迁移。

## 2. 基线与实际命令

开工时：

- 分支：`main`
- HEAD：`4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd`
- 远端关系：`main...origin/main`
- 工作树：干净

实际执行：

| 命令 | 退出码 | 结果 |
| --- | ---: | --- |
| `npm test` | 0 | 12/12 通过；只覆盖 M0/M1 初始化、幂等、身份与插件包契约 |
| `npm run validate:plugin` | 0 | `ok: true`；检查 2 Manifest、1 Skill、2 Marketplace、3 模板 |
| `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop` | 1 | 缺 `queries/site/reputation/answers/competitors/strategy/execution/runs/cycles` 与根 `README.md/STATUS.md/workspace.json` |
| `rg -l '^record_type: knowledge_entry$' workspaces/myyshop/knowledge --glob '*.md' \| rg -v '/01-templates/' \| wc -l` | 0 | 120 个实际 legacy knowledge_entry |

首次直接统计得到 122；核验后确认其中 2 个位于 `knowledge/01-templates/`，不是业务条目。后续兼容索引必须显式排除治理文件、模板、README 和 `_index.md`。

## 3. 当前已有能力

### 3.1 插件与工作区基础

- `plugins/geo-expert/scripts/workspace-init.mjs`：创建稳定 `workspace_id`、根文件和旧十目录；已有文件使用 `wx`，顺序重复执行不覆盖。
- `plugins/geo-expert/scripts/workspace-validate.mjs`：只校验旧根目录和 `workspace.json` 字段；使用 `stat`，没有 symlink containment 检查。
- `plugins/geo-expert/scripts/validate-plugin.mjs`：校验宿主元数据、Skill Frontmatter、Marketplace 路径和三份模板。
- 两份 Manifest 只保存宿主元数据，没有复制 GEO 业务规则。

### 3.2 legacy MyyShop 知识

120 条实际条目共有：

```text
record_type / id / query_id / title / title_en / domain / entry_type
/ priority / status / version / owner / approver / canonical_target
/ last_reviewed / next_review
```

它们没有公共契约要求的 `created_at`、`updated_at`，Query 只是条目内的 `query_id` 与手工表格，不是独立对象。条目均为 `draft`，现有结构检查不代表事实、法务或业务批准。

现有 `_index.md`、`query-catalog.md`、`file-manifest.md` 是手工导航，不是机器派生索引。`file-manifest.md` 声称 139 个 Markdown，`validation-report.md` 声称 140 个，当前实际为 141 个，已经发生漂移。

### 3.3 Evidence 雏形

`knowledge/00-governance/source-register.md` 和 `01-templates/evidence-record-template.md` 含 Evidence ID、来源位置、Owner、日期和口径等雏形，但没有统一 Frontmatter，也把 Source 与 Evidence 合并在同一表中。

## 4. 明确缺失

以下能力和目标路径在基线均不存在：

- `plugins/geo-expert/schemas/`
- `plugins/geo-expert/scripts/build-index.mjs`
- 公共 Frontmatter parser 与 Ajv validator
- duplicate stable ID、broken ref、错误目标类型诊断
- `workspaces/myyshop/indexes/`
- 独立 Query、Claim、Source、Evidence、Finding、Asset、Run、Cycle
- Evidence snapshot checksum、locator 与 Source ref
- Run status 与 business result 分离
- `runs/<run-id>/raw`、`outputs` 不可覆盖规则
- 输入版本变化时 supersede old Run
- path traversal、父目录逃逸、symlink、secret marker 检查
- ops-geo legacy adapter 与脱敏 fixture

## 5. 冲突与处理

### 5.1 旧 M2 已被重排

`docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md` 直接进入 Query/Knowledge；当前批准方案已把 Contract & Provenance Kernel 设为 M2，旧文件只保留历史语义。

### 5.2 Workspace 目录模型

Spec 0002 与初始化脚本仍使用旧十目录；最终方案增加 `evidence/`、`assets/`、`indexes/`，并细分 `knowledge/`、`queries/`。处理方式是向后兼容地增加新目录和对象根，不删除旧目录，不批量移动 120 条知识。

### 5.3 Source、Evidence 与 stale

旧 `source-register.md` 把 Source/Evidence 混合并定义 A/B/C/D 来源可信等级，还规定 Evidence 失效会自动让 Claim 回退。当前批准方案要求 Source/Evidence 分离、不建立复杂 Trust Score，Evidence stale 只产生复核提示，不自动改变 Claim 或 Knowledge Release。

### 5.4 Claim `published`

旧知识库把 `published` 理解为站点发布并通过审计；当前批准方案中 Claim `published` 只表示进入正式 Knowledge Release，不等于官网、媒体或生产发布。

### 5.5 公共契约与 legacy 兼容

新的 canonical 对象必须满足六个公共字段；现有 120 条 `knowledge_entry` 进入只读 `legacy-knowledge.json` 兼容索引，不被静默转换为 Claim，也不参加 canonical refs 闭包。

### 5.6 JSON-first 与总分

当前源码没有 JSON-first 业务实现，`workspace.json` 只承载身份；Manifest 也没有业务规则。ops-geo 的 legacy `geo_score`、六维分和平台分不得成为新契约。

## 6. ops-geo 事实审查

Handoff 指定的 `/Users/sujingjun/ops-geo` 不存在；现存 checkout 是 `/Users/sujingjun/myyshop/geo-ops-agent`，其 `origin` 为 `git@github.com:sujingjun/ops-geo.git`，审查基线为 `main@bf15033cf12519040092d90b896e4d255582aded`，工作树干净。

当前 HEAD 仍是 legacy 审计工具：

- `geo-audits/myyshop.com/2026-07-04/audit_data.json` 有 `geo_score/scores/platforms/findings`，Finding 没有 ID、Evidence refs 或 rule version；
- v2 Evidence Manifest 与 migration 只存在于未勾选计划 `docs/plans/2026-07-27-geo-site-readiness-contract-v2.md`，目标脚本、Schema 和测试均不存在；
- 上游根目录没有 `LICENSE`、`COPYING` 或 `NOTICE`，不能复制代码或真实 fixture；
- 真实 raw 抓取、headers、正文和报告不得进入本仓测试。

M2 只能独立实现计划中与当前批准方案一致的最小语义：输入 SHA、snapshot path/checksum/source locator、collector/version、稳定 Evidence/Finding refs；没有精确 snapshot ref 的 legacy Finding 降级为 `unverifiable`；legacy score 仅保留为 `{ value, rubric_version: legacy-unknown, comparable: false }`。

## 7. 安全、并发与幂等风险

1. 当前 validator 使用 `stat` 跟随 symlink，不能复用于 canonical object walker。
2. 当前脚本没有工作区内相对路径 containment 校验。
3. `workspace-init` 的并发文档声明没有并发测试；两个进程各自生成 ID，后到者写 `workspace.json` 遇到 `EEXIST` 后仍可能返回未落盘的本进程 ID。
4. 当前没有 secret marker 定义和脱敏诊断规则。
5. Run 的 `run.md` 生命周期元数据与不可变 `raw/outputs` 边界尚未实现。

## 8. 迁移决策

- 使用 `gray-matter` 解析 Frontmatter，Ajv 执行机器 Schema；不自写 YAML parser。
- Node.js 仍是业务内核；不引入 Python 业务状态、数据库、LangGraph 或云服务。
- 新建 canonical 对象与只读 legacy compatibility index；不改写 120 条旧条目。
- index 不含生成时间，以相同输入保证字节级确定；写入前完成全量校验，不能留下半成品。
- Run 的 `run.md` 可按合法状态机更新；`raw/`、`outputs/` 文件一经创建不得覆盖。
- ops-geo adapter 使用本仓自建脱敏合成 fixture，不复制无许可证代码或真实业务数据。

## 9. 未验证项

- ops-geo v2 没有真实实现，因此只能验证本仓 adapter 对冻结合成输入的行为，不能宣称兼容未来上游实现。
- 本 Record 是修改前事实审查；实现后的命令与结果另写 M2 Acceptance Record。
- 未读取真实企业数据、未调用真实或付费模型、未调用第三方 API。

