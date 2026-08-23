---
title: Contract & Provenance Kernel 架构
status: proposed
created: 2026-08-24
source:
  - docs/prd/2026-08-23-m2-contract-provenance-kernel.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
scope: M2 Markdown 事实、派生索引、Run 历史与 legacy adapter
---

# Contract & Provenance Kernel 架构

## 1. 目标形态

```text
Codex / Claude Code / WorkBuddy（待官方契约）
                    │
                    ▼
             Host Agent Loop
                    │
                    ▼
                  Skills
                    │
                    ▼
       Deterministic Node.js Tools
          ├── Object parser + Ajv
          ├── refs / index builder
          ├── Run lifecycle + artifacts
          └── legacy audit adapter
                    │
                    ▼
      Markdown Workspace（authoritative）
                    │
                    └── indexes/*.json（derived）
```

Host 负责 Agent loop；`geo-cowork` 负责 GEO 领域契约；Tool 负责确定性执行；Workspace 负责持久业务事实。M2 不新增 Agent Runtime。

## 2. 模块职责

| 模块 | 职责 | 不得做 |
| --- | --- | --- |
| `schemas/` | 公共与类型 JSON Schema | 保存业务实例或批准结论 |
| `scripts/lib/workspace-paths.mjs` | containment、symlink、安全发现与独占写 | 解析业务状态或访问网络 |
| `scripts/lib/object-contract.mjs` | gray-matter parse、Ajv、ID/status/refs 元数据 | 写 Workspace 或猜测修复 |
| `scripts/lib/index-builder.mjs` | 全量诊断、refs 闭包、确定性 indexes | 反向修改 Markdown |
| `scripts/lib/run-store.mjs` | Run manifest、输入 fingerprint、artifact、supersede | 解释 GEO 业务结果 |
| `scripts/lib/legacy-ops-geo.mjs` | 独立重实现 legacy 输入迁移 | 复制上游代码、评分或真实 raw |
| CLI scripts | 参数校验、调用公开模块、结构化输出与退出码 | 隐藏失败或泄漏输入正文 |
| Skills | 定位 Workspace、编排工具、解释人工门 | 复制 Schema、状态机或自动批准 |

## 3. 数据分层

```text
业务事实层：canonical Markdown objects
历史原始层：runs/<run-id>/raw 与 outputs（create-only）
机器派生层：indexes/*.json（可删、可重建）
兼容层：legacy knowledge index、legacy audit migration summary
```

`workspace.json` 只保存工作区身份和 contract version，不承载业务对象。legacy compatibility index 不把旧 `knowledge_entry` 静默变成 Claim。

## 4. 写入模型

### 4.1 canonical 业务对象

人类或上层 Skill 写 Markdown，确定性工具负责校验。除 Run lifecycle 和迁移器明确输出外，M2 不提供自动改写已有 canonical 对象的通用接口。

### 4.2 index

builder 先在内存完成解析、Schema、duplicate 和 refs 全量校验，再把已排序 JSON 写到同目录临时文件并原子替换。失败时不更新任何正式 index。index 不含当前时间，以保证相同输入字节一致。

### 4.3 Run

`run.md` 是可按状态机更新的 manifest；`raw/` 与 `outputs/` 是不可变 artifact 区。关键输入由 `{ref, version}` 排序后计算 SHA-256 fingerprint。变更输入时先幂等创建新 Run，再把旧 Run 原子更新为 `superseded`；进程中断后重复调用可收敛。

### 4.4 legacy migration

迁移器只读输入，以显式 namespace 生成稳定 ID，写入新的 canonical 目标或返回现有相同内容。不同内容撞到已有 ID 时失败，不覆盖。真实上游无许可证，所有实现和 fixture 在本仓独立创建。

## 5. 安全边界

- 显式 Workspace 可位于任意本地目录；进入 Workspace 后所有对象 path、snapshot path 和 artifact path 必须是安全相对路径。
- walker 使用 `lstat` 拒绝 canonical root、子目录或文件中的 symlink，不跟随到 Workspace 外。
- 禁止绝对路径、反斜杠、空段与 `..` 段；`realpath`/父目录 containment 双重检查。
- secret marker 诊断只报告路径和行号，不回显命中值。
- 不读取 `.env`、用户目录、父目录或未显式提供的真实数据；不访问网络。

## 6. 并发与恢复

- Workspace 身份先以 `wx` 建立，竞争失败者重新读取已落盘身份，不能返回本进程未落盘 ID。
- index 构建结果由稳定排序保证相同；原子 rename 避免半文件。
- artifact 使用 `wx`；并发二次写均失败且旧字节不变。
- import 和 supersede 以稳定 ID 与内容等价实现幂等；冲突不覆盖。

## 7. 依赖边界

- `gray-matter`：只负责 Frontmatter parse/stringify。
- Ajv：只负责 JSON Schema validation；类型关系、路径 containment 和跨对象 refs 由本仓代码检查。
- 不引入 `ajv-formats`；RFC 3339、SHA-256、SemVer 和 ID 由 Schema pattern 冻结。
- 不引入 Playwright、Crawlee、Python runtime、LangChain/LangGraph、数据库或云服务。

## 8. 演进点

M3 可在同一公共契约上注册 Document、Answer Card、Knowledge Release、Query Set、Evidence Plan 和 Perception Goal；M4 复用 Finding/Asset/Evidence，不改变 M2 的 Markdown authoritative、index derived、artifact immutable 原则。

