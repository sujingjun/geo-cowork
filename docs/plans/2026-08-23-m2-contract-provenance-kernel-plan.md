---
title: M2 Contract & Provenance Kernel 实施计划
status: proposed
created: 2026-08-24
source:
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/records/2026-08-23-m2-contract-provenance-gap-review.md
scope: M2 四个可演示纵切、测试、迁移、验收与回滚
---

# M2 Contract & Provenance Kernel 实施计划

## 1. 当前现状与目标差距

现有三个脚本只完成 M0/M1 插件和根工作区行为；MyyShop 工作区只有 120 条 legacy knowledge，没有 canonical object/index/Run。M2 需在不改写 legacy 内容、不更换技术栈的前提下建立公共内核。

## 2. 技术方案

- 使用 `gray-matter` parse/stringify Frontmatter，Ajv 编译公共与类型 JSON Schema。
- 安全 walker 统一处理 Workspace containment、symlink、Markdown 发现和 create-only 写入。
- index builder 在内存完成全量验证后原子写出稳定 JSON。
- Run store 分离可更新 `run.md` 与 create-only `raw/outputs`。
- legacy adapter 独立重实现已经批准的迁移语义，只使用脱敏合成 Fixture。
- `workspace-init` 向后兼容增加 `evidence/assets/indexes`，并修复并发身份竞态；不删除旧目录。

## 3. 纵切与验证

### Slice A — parser、公共契约与安全 Fixture

目标文件：

- `package.json`、`package-lock.json`
- `plugins/geo-expert/schemas/common-object.schema.json`
- `plugins/geo-expert/schemas/m2-record-types.schema.json`
- `plugins/geo-expert/scripts/lib/workspace-paths.mjs`
- `plugins/geo-expert/scripts/lib/object-contract.mjs`
- `plugins/geo-expert/assets/object-templates/{query,claim,source,evidence,finding,asset,run,cycle}.md`
- `tests/m2-object-contract.test.mjs`

验证：合法对象通过；缺公共字段、unknown type、非法 ID/version/time/status、snapshot checksum、path/symlink/secret 明确失败。

### Slice B — index、refs 与 legacy knowledge

目标文件：

- `plugins/geo-expert/scripts/lib/index-builder.mjs`
- `plugins/geo-expert/scripts/build-index.mjs`
- `plugins/geo-expert/scripts/workspace-validate.mjs`
- `tests/m2-index-ref.test.mjs`

验证：duplicate/broken/type/version ref；delete/rebuild；连续两次字节一致；Markdown hash 不变；失败无半 index；120 条 legacy compatibility index。

### Slice C — Run、artifact 与 supersede

目标文件：

- `plugins/geo-expert/scripts/lib/run-store.mjs`
- `plugins/geo-expert/scripts/run-lifecycle.mjs`
- `plugins/geo-expert/scripts/workspace-init.mjs`
- `tests/m2-run-lifecycle.test.mjs`
- `tests/m2-security-concurrency.test.mjs`

验证：状态机；status/business result 分离；artifact overwrite；unchanged resume；changed input supersede/new Run；重复调用；并发 workspace identity 与 index build。

### Slice D — ops-geo legacy adapter 与 MyyShop 兼容迁移

目标文件：

- `plugins/geo-expert/scripts/lib/legacy-ops-geo.mjs`
- `plugins/geo-expert/scripts/legacy-ops-geo-import.mjs`
- `tests/fixtures/m2-contract/ops-geo-legacy-synthetic.json`
- `tests/m2-ops-geo-migration.test.mjs`

验证：输入 SHA；deterministic refs；snapshot 引用；无 Evidence 的 Finding 降级；legacy score `comparable:false`；重复 import 幂等；输入不变。

## 4. Workspace 迁移

1. 向工作区模板和必需目录增加 `evidence/`、`assets/`、`indexes/`，保留全部 M1 目录。
2. 为 `workspaces/myyshop/` 新建根 `README.md/STATUS.md/workspace.json` 与新 canonical 目录，不移动现有 `knowledge/02-*` 至 `10-*`。
3. M2 只构建 legacy compatibility index；M3 再添加窄范围 canonical Document/Claim/Query/Release。
4. 迁移前后计算 120 条 legacy 文件聚合 SHA，Record 中记录相等。

## 5. 测试策略

| 层级 | 内容 | 命令 |
| --- | --- | --- |
| M2 单元/集成 | contract、refs、index、Run、安全、legacy migration | `npm run test:m2-contract` |
| 全量回归 | M0/M1 + M2 | `npm test` |
| 静态治理 | Manifest、Skills、模板 | `npm run validate:plugin` |
| 实例校验 | MyyShop 根结构、objects、indexes | `workspace-validate.mjs --workspace workspaces/myyshop --objects` |
| 确定性 | rebuild 和 Git diff | `build-index.mjs ...` 两次、`git diff --check` |

首次失败、修复与实际测试数只写入 Acceptance Record，不在 Plan 预写结果。

## 6. 监控、发布与回滚

M2 是本地文件能力，不部署服务。CLI 通过稳定 error code 和 JSON diagnostics 暴露失败。所有 canonical 新文件 create-only；index 可删除重建；Run artifact 不提供覆盖或删除命令。

未经授权不 commit、push、PR、发布。工作树回滚由人类基于 Git diff 决定；本任务不执行破坏性清理。legacy 原文件不修改，因此无需数据回滚。

## 7. 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| 新 Schema 误把 120 条 legacy 当 canonical | 显式 `knowledge_entry` compatibility adapter 与排除根 |
| symlink/路径逃逸 | 独立安全 walker，所有写入共用 containment |
| index 并发留下半文件 | 全量内存校验、同目录临时文件、原子 rename |
| supersede 中途崩溃 | stable new ID、重复调用收敛 |
| 上游 ops-geo v2 不存在且无 License | 独立实现、合成 Fixture、Record 保留未验证边界 |
| 依赖扩大 | 只加入最终方案点名的 gray-matter、Ajv |

## 8. 验收门

- Spec 0003 的正常、非法、边界、重复、并发、安全与恢复测试全部通过。
- 全量 `npm test`、`npm run validate:plugin`、MyyShop `--objects` 校验、两次 index build、`git diff --check` 通过。
- 120 条 legacy knowledge 聚合 SHA 不变，compatibility index 数量为 120。
- Record 明确区分本地开发验证、Owner 批准、真实业务验证、发布与部署。

## 9. 授权解释

2026-08-24 用户先授权本地完成 M2/M3，随后把当前会话边界调整为“验收 M2 后移交新会话完成 M3 与 M4 Handoff”。因此本 Plan 的 M2 实现与验证有明确授权；M3 在制内容不计入本次验收。上述指令没有授权 Agent 将新 PRD/Spec 标记为 `approved`，也没有授权外部系统、Git 写操作或发布。
