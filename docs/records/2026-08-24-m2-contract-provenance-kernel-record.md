---
title: M2 Contract & Provenance Kernel 验收记录
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/tasks/2026-08-23-m2-contract-provenance-kernel.md
scope: M2 本地 Markdown Object、indexes/refs、Run/artifact、legacy adapter 与 MyyShop 兼容迁移
---

# M2 Contract & Provenance Kernel 验收记录

## 1. 验收结论

M2 在本地源码与 MyyShop Workspace 范围内通过验收：公共 Markdown Object Contract、Schema 校验、安全路径、Evidence checksum、可重建 index、refs、Run lifecycle/supersede、不可覆盖 artifact、legacy ops-geo 迁移和 120 条 legacy knowledge 兼容索引均有实际测试或实例命令证据。

本 Record 的 `verified` 只表示下列本地机器门通过。Spec 0003 仍为 `proposed`，本记录不替 Owner 批准 Spec；也不表示 M3 完成、品牌事实批准、Knowledge Release 发布、宿主安装缓存可运行、业务效果、对外发布或部署。

## 2. 授权与边界

- 初始 Handoff 要求建完 M2 SDD 后停在批准门；2026-08-24 用户明确要求完成 M2/M3，授权了本地实现。随后用户把本会话边界调整为“先验收 M2，再移交 M3”。
- 当前用户指令没有授权 commit、push、PR、插件市场发布、外部系统写入或真实平台采集；本次均未执行。
- M3 文档、Schema、语义模块和 Skills 已形成在制文件，但未纳入本 Record 的里程碑完成结论。

## 3. 基线与变更范围

开工事实：

- 分支：`main`
- HEAD：`4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd`
- 远端关系：`main...origin/main`
- 工作树：开工时干净；验收时为当前任务产生的未提交修改

M2 实现包括：

1. `schemas/common-object.schema.json` 与 `m2-record-types.schema.json`；
2. `scripts/lib/object-contract.mjs`、`workspace-paths.mjs`、`index-builder.mjs`、`run-store.mjs`、`legacy-ops-geo.mjs`；
3. `build-index.mjs`、`run-lifecycle.mjs`、`legacy-ops-geo-import.mjs` 和 `workspace-validate --objects`；
4. Query/Claim/Source/Evidence/Finding/Asset/Run/Cycle 八类 M2 模板；
5. MyyShop 根身份、必需目录和派生 indexes；
6. 合成 Fixture 与 M2 正常、异常、边界、并发、恢复和 CLI 测试。

依赖严格锁定为 `gray-matter@4.0.3` 与 `ajv@8.20.0`。前者的官方仓库标明 MIT 并提供 Frontmatter parse/stringify；Ajv 官方指南说明其编译 JSON Schema 为校验函数，官方仓库与许可证为 MIT：

- <https://github.com/jonschlinkert/gray-matter>
- <https://ajv.js.org/guide/getting-started>
- <https://github.com/ajv-validator/ajv/blob/master/LICENSE>

## 4. 测试先行与失败修复记录

实现前首次运行新增测试时，6 个测试文件全部因核心模块不存在而以 `ERR_MODULE_NOT_FOUND` 失败，证明测试先于实现落地。后续真实失败及修复：

| 失败 | 原因 | 修复 |
| --- | --- | --- |
| Ajv `MissingRefError` | 合并类型 Schema 后公共 `$ref` 基址错误 | 将公共 defs 纳入每个编译 Schema，并本地化 refs |
| Ajv `strictTypes` | `$ref` 旁的 `minItems` 未声明 array type | Evidence `source_refs` 显式声明 array |
| gray-matter `Undefined` | Fixture 用 `undefined` 删除可选字段 | 序列化前递归移除 undefined |
| Run resume 失败 | 测试从 pending 直接进入 blocked，与状态机不符 | 先转 running；实现恢复保持 Spec 状态机 |
| supersede 崩溃窗口 | 新 Run 已落盘、旧 Run 未更新时可能冲突 | 重试先校验已存在新 Run 的 fingerprint/supersedes_ref，再收敛旧 Run |
| 并发初始化 ID 不一致 | 竞争失败者继续返回本进程候选 ID | `workspace.json` 先 create-only，失败者读取实际身份 |
| legacy Fixture checksum 不同 | 快照多了一个换行 | 修正合成 Fixture 字节，并保留真实 checksum 校验 |
| import 跨时间不幂等 | 默认 `now` 会改变对象字节 | 使用输入 snapshot/date 的稳定时间；写前全量冲突预检 |

## 5. 实际验证

| 命令 | 退出码 | 实际结果 |
| --- | ---: | --- |
| `npm run test:m2-contract` | 0 | 25 tests 全部通过；含 CLI、contract/checksum/secret/symlink、M2/M3 字段隔离、duplicate/broken/type/version refs、失败原子性、并发 index、Run/artifact/supersede、并发身份、legacy import |
| `npm test` | 0 | 42 tests 全部通过；M0/M1 回归与 5 个在制 M3 合成测试同时通过 |
| `npm run validate:plugin` | 0 | `ok: true`，28 个 Manifest/Skill/Marketplace/模板/Schema/脚本/依赖检查项通过 |
| `node .../workspace-validate.mjs --workspace workspaces/myyshop --objects` | 0 | `ok: true`；missing/errors/object_errors/warnings 均为空 |
| `node .../build-index.mjs --workspace workspaces/myyshop`（连续两次） | 0/0 | 两次均 `object_count: 0`、`legacy_count: 120`；15 个 index 完整写出 |
| `shasum -a 256 workspaces/myyshop/indexes/*.json \| shasum -a 256`（两次） | 0/0 | 两次聚合值均为 `fe231c3793ae741ae89cf853ffb3f5820eb9cbaf44d3ca187dc930e4638df477` |
| legacy 120 文件 current/HEAD 聚合比较 | 0 | current 与 HEAD 均为 `26a2a2653cdabb4bd75d54c41e775aa7253d8806c91a95ad9e4c605ebb46675f`；`git diff --quiet` 为 0 |
| `npm ls --depth=0` | 0 | 只有 `ajv@8.20.0`、`gray-matter@4.0.3` |
| `npm audit --omit=dev` | 0 | `found 0 vulnerabilities` |
| `node --check`（scripts/tests 全部 `.mjs`）与 24 个范围内 JSON parse | 0 | 语法与 JSON 解析通过；最大实现文件 423 行，未触发 500 行拆分线 |
| `git diff --check` | 0 | 无 whitespace error |

运行环境：Node `v22.14.0`、npm `10.9.2`；仓库要求 Node `>=20`。

## 6. Spec 行为映射

| 行为 | 证据 |
| --- | --- |
| 公共字段、类型、ID/status/version/time | `m2-object-contract.test.mjs` |
| Evidence Source、snapshot checksum | `m2-object-contract.test.mjs` |
| 路径、symlink、secret 不回显 | `m2-object-contract.test.mjs`、`m2-security-concurrency.test.mjs` |
| indexes 可删重建、字节稳定、不改 Markdown | `m2-index-ref.test.mjs`、MyyShop 连续构建 hash |
| duplicate/broken/type/version ref | `m2-index-ref.test.mjs` |
| 失败不改旧 index、并发最终 JSON 完整 | `m2-index-ref.test.mjs` |
| Run status/business result 分离 | `m2-run-lifecycle.test.mjs` |
| artifact create-only 与路径 containment | `m2-run-lifecycle.test.mjs`、`m2-security-concurrency.test.mjs` |
| input fingerprint、resume、supersede、崩溃窗口 | `m2-run-lifecycle.test.mjs` |
| legacy Source/Evidence/Finding、无证据降级、分数不可比、冲突/幂等 | `m2-ops-geo-migration.test.mjs` |
| CLI 不依赖调用 cwd | `m2-cli.test.mjs` |
| MyyShop 120 legacy 不改写 | Workspace validator、legacy index 和 current/HEAD 聚合 hash |

## 7. Project Lead 独立复核

- Markdown 仍是权威内容；index builder 只读 Markdown 后原子写 JSON，没有 JSON→Markdown 路径。
- canonical 与 legacy 明确分流；legacy `knowledge_entry` 不参加 refs 闭包，也未被批量改写。
- M2 最小 Query/Claim 不被 M3 扩展字段反向强制；M3 必需字段由独立 M3 validator 负责。
- Run `completed` 与 `business_result` 是独立字段；测试覆盖 `completed + fail`。
- Source 与 Evidence 分开；legacy `geo_score` 只在 summary 保留为 `legacy-unknown/comparable:false`。
- 两份 Manifest 不包含 GEO 业务状态机；M2 规则集中在 Schema/Spec/确定性代码。
- 所有正式写入使用工作区相对路径、symlink 检查、create-only 或同目录原子 rename；未提供删除/覆盖 artifact 命令。

## 8. 未验证与后续门禁

1. `ops-geo` v2 只有上游计划、没有实现；本次只证明本仓脱敏 legacy adapter，不声称兼容未来实现。
2. 未做 1,000 对象性能基准、故障注入到每条系统调用或多机并发；不能外推生产容量/可用性。
3. 未在 Codex/Claude 插件安装缓存重新安装 npm 依赖并执行宿主 Smoke；M2 结论限定源码 checkout。
4. 没有真实 MyyShop canonical Source/Evidence/Query/Claim；`object_count: 0` 是 M2 兼容迁移的预期结果，不是知识完备。
5. M3 在制内容必须由后续会话重新核验，不能凭本 Record 提升为 `verified`。
6. Owner 批准、业务验证、发布和部署均未发生。

## 9. Git 与交付状态

未执行 commit、push、PR、插件发布或部署。当前所有修改保留在 `/Users/sujingjun/geo-cowork` 的 `main` 工作树，供用户审查和后续会话在同一 checkout 接续。
