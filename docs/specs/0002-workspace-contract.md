---
title: Spec 0002 — 工作区契约
status: proposed
created: 2026-08-20
source: docs/architecture/2026-08-20-cross-host-plugin-architecture.md
scope: 品牌工作区的结构、身份、初始化与校验规则
---

# Spec 0002 — 工作区契约

## 1. 触发条件

本契约适用于：`geo-workspace-init` Skill、`scripts/workspace-init.mjs`、`scripts/workspace-validate.mjs` 及任何创建或检查品牌工作区的行为。

## 2. 工作区定义

工作区是项目事实中心，位于插件安装目录之外的任意本地路径。一个工作区服务一个品牌。仓库内 `workspaces/myyshop/` 是 MyyShop 品牌的真实工作区实例，本契约不依赖其存在。

## 3. 必需结构

初始化完成后，工作区根必须存在以下文件与目录（必需集合）：

```text
README.md        品牌与范围说明（人类可读入口）
STATUS.md        当前阶段、阻塞、下一动作
workspace.json   稳定机器身份与 Schema 版本
queries/         问题候选、正式集合、聚类和覆盖
knowledge/       知识、Evidence、答案卡和冲突
site/            资产、快照、审计和候选变更
reputation/      外部观察、主题和事实错误
answers/         固定 Query Set、原始答案和人工 Review
competitors/     竞品、来源和内容差距
strategy/        诊断、优化、内容和实验计划
execution/       人工执行、发布和复验记录
runs/            每次 Agent 运行
cycles/          每个 GEO 运营周期
```

`brand/` 目录在里程碑 2 引入，不属于里程碑 1 必需集合。

## 4. workspace.json Schema

```json
{
  "schema_version": "1.0.0",
  "workspace_id": "ws_<26 位小写字母数字>",
  "brand": "<品牌名，初始化时由 --brand 传入，缺省为目录名>",
  "created_at": "<RFC 3339 UTC 时间戳>",
  "created_by": "geo-workspace-init/<插件版本>"
}
```

- `workspace_id` 在首次初始化生成，之后任何初始化、校验不得改变；
- `created_at`、`created_by` 同样只写一次；
- 未知额外字段必须被保留（前向兼容）；
- `schema_version` 是本契约的机器版本，破坏性变更时递增 major。

## 5. 初始化行为（workspace-init.mjs）

### 5.1 输入

| 参数 | 约束 |
| --- | --- |
| `--workspace <path>` | 目标工作区路径；缺省为当前目录 |
| `--brand <name>` | 品牌名；缺省为工作区目录名 |
| `--dry-run` | 只打印将执行的创建动作，不写文件 |

### 5.2 规则

1. 目标目录不存在时递归创建；
2. 每个必需文件：不存在则从 `assets/workspace-template/` 对应模板复制并做 `{{BRAND}}`、`{{WORKSPACE_ID}}`、`{{CREATED_AT}}` 占位替换；已存在则原样保留并计入 `kept`；
3. 每个必需目录：不存在则创建；目录内不预置任何文件（不提交空目录原则只约束仓库，不约束用户工作区）；
4. `workspace.json` 已存在但缺少必需字段时报错退出（不擅自修补身份）；
5. 不写工作区外任何文件；不执行网络、Git 或子进程写操作。

### 5.3 输出

退出码 0，stdout 为 JSON：

```json
{
  "workspace": "<绝对路径>",
  "created": ["README.md", "queries/"],
  "kept": ["STATUS.md"],
  "workspace_id": "ws_..."
}
```

非法参数退出码 2；身份文件冲突退出码 3。

## 6. 校验行为（workspace-validate.mjs）

### 6.1 输入

`--workspace <path>`；缺省时从当前目录向上查找含 `workspace.json` 的目录，找不到则报错。

### 6.2 规则

逐项检查必需集合与 `workspace.json` 的必需字段及 `workspace_id` 格式。输出 JSON：

```json
{
  "workspace": "<绝对路径>",
  "ok": true,
  "missing": [],
  "errors": []
}
```

存在缺失或错误时 `ok: false`，退出码 1；参数非法退出码 2。

## 7. 幂等与并发

- 同一目录重复初始化：第二次及以后 `created` 为空、全部进入 `kept`，文件内容字节级不变；
- 两个进程同时初始化同一目录：文件写入采用"不存在才创建"（`wx` 旗标语义），后到者把已存在文件计入 `kept`，不得报错或截断。

## 8. 三宿主一致性

任一宿主执行 `geo-workspace-init` 必须落到同一 `workspace-init.mjs`。对同一空目录，三宿主产生的必需文件集合（相对路径排序后）逐字节一致；`workspace.json` 中仅 `workspace_id`、`created_at` 允许不同。

## 9. 安全与权限

- 脚本不读取工作区外文件（模板除外，模板位于插件根内）；
- 不泄漏环境变量、Token、Cookie、PII 到输出；
- Agent 通过本 Skill 创建的一切内容均为工作区草稿，不构成知识批准或发布。
