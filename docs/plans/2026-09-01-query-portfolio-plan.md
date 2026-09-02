---
title: Query Portfolio 流水线实施计划
status: approved
created: 2026-09-01
updated: 2026-09-02
source:
  - docs/specs/0011-query-portfolio.md
  - docs/prd/2026-09-01-query-portfolio.md
  - docs/architecture/2026-09-01-query-portfolio-architecture.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
scope: Query Portfolio CLI、规则库、fixture、测试、Skill 与文档的实施顺序与验收门
---

# Query Portfolio 流水线实施计划

## 1. 现状与差距

| 当前事实 | 差距 | 处理 |
| --- | --- | --- |
| Query 对象只能手工编写 Markdown；M3 CLI 仅有 propose/assemble-release/assemble-query-set/validate | 无候选生成入口 | 新增 `query-portfolio.mjs intake` |
| 去重只在 validate 报 `DUPLICATE_QUERY` | intake 不防重、不合并跨来源、不报告既有重复 | intake 全量预检（同源失败/跨源合并/既有跳过） |
| 无聚类、意图规则与覆盖视图 | 批准与冻结前无组合视图 | 版本化规则 + `report` 内容键工件 |
| 冻结前无就绪检查 | 人工直接编辑对象，剩余门不透明 | `prefreeze` gates + `content_sha256` 预览 |
| M6 test-only KBASE 的 Query Set 由 fixture 直接预置 | portfolio 未被证明可产出 Cycle 冻结输入 | 知识库缺席 KBASE E2E + 双路写入 |

## 2. 实施顺序（TDD）

1. **红测先行**：`tests/query-portfolio.test.mjs` 覆盖 §2 规则（归一化/意图/优先级/聚类/ID）、intake 预检矩阵、assemble/prefreeze/validate 合同；先因模块缺失失败。
2. **规则库**：`lib/query-portfolio.mjs` 实现规则纯函数与对象生成（含 `extensions["geo.qp_intake"]`）。
3. **intake / assemble**：双路写入 helper（`workspace.json` 识别 + `preflightTestKnowledgeWrite` 测试路径）、create-only 幂等、stdout 合同。
4. **report / prefreeze / validate**：内容键工件、gates 与 warnings、三层 validate 合并。
5. **CLI**：`scripts/query-portfolio.mjs`（参数解析、错误输出、退出码），`tests/query-portfolio-cli.test.mjs`。
6. **E2E**：`tests/helpers/query-portfolio-fixtures.mjs`（online Merchant + test-only KBASE + source + goal，零业务知识对象）+ `tests/fixtures/query-portfolio/`（intake 计划）+ `tests/query-portfolio-e2e.test.mjs`（Spec 0011 §6 全旅程，含幂等重跑与确定性重算）。
7. **Skill 与文档**：`skills/geo-query-portfolio/SKILL.md`（含人工门与 Run 记录约定）、`package.json` 增加 `test:query-portfolio`、根 `README.md` 开发命令、`docs/README.md` 导航、`CHANGELOG.md` 条目、Record 收口。

## 3. 目标文件

新增：

- `plugins/geo-expert/scripts/query-portfolio.mjs`
- `plugins/geo-expert/scripts/lib/query-portfolio.mjs`
- `plugins/geo-expert/skills/geo-query-portfolio/SKILL.md`
- `tests/query-portfolio.test.mjs`、`tests/query-portfolio-cli.test.mjs`、`tests/query-portfolio-e2e.test.mjs`
- `tests/helpers/query-portfolio-fixtures.mjs`、`tests/fixtures/query-portfolio/README.md`、`tests/fixtures/query-portfolio/plans/intake-basic.json`
- `docs/records/2026-09-01-query-portfolio-record.md`

修改（仅追加，不改语义）：

- `package.json`（test script）、根 `README.md`、`docs/README.md`、`CHANGELOG.md`

不修改：既有 Schema、`lib/` 既有模块、`knowledge-query.mjs`、真实 `workspaces/myyshop`。

## 4. 风险与停止条件

- 双路写入在测试路径产生 M6 profile 兼容问题 → 只放宽 portfolio 自身实现，不改 M6 校验；无法满足则停止并回写 Spec 缺口。
- 规则阈值或停用词调整 → 必须以新规则版本表达，不得原地改语义。
- 全量回归任一失败、真实 MyyShop 只读检查失败、`git status` 显示 `workspaces/myyshop` 变化 → 停止修复。
- commit、push、PR、部署、发布不在本计划授权内。

## 5. 验收命令

```bash
node --test tests/query-portfolio*.test.mjs
npm test
npm run validate:plugin
npm run check:docs
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
git status --porcelain workspaces/myyshop   # 必须为空
git diff --check
```
