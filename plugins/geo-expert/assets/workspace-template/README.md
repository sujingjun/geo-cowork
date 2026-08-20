# {{BRAND}} GEO 品牌工作区

> 本工作区是 {{BRAND}} 品牌 GEO 工作的项目事实中心。所有长期状态和业务交付物以本目录内的 Markdown、JSONL、JSON、HTML 快照和截图为准；聊天记录和模型记忆不是事实来源。

## 范围

- 品牌：{{BRAND}}
- 工作区身份：见 `workspace.json`
- 当前阶段与下一动作：见 `STATUS.md`

## 目录

| 目录 | 内容 |
| --- | --- |
| `queries/` | 问题候选、正式集合、聚类和覆盖 |
| `knowledge/` | 知识、Evidence、答案卡和冲突 |
| `site/` | 资产、快照、审计和候选变更 |
| `reputation/` | 外部观察、主题和事实错误 |
| `answers/` | 固定 Query Set、原始答案和人工 Review |
| `competitors/` | 竞品、来源和内容差距 |
| `strategy/` | 诊断、优化、内容和实验计划 |
| `execution/` | 人工执行、发布和复验记录 |
| `runs/` | 每次 Agent 运行 |
| `cycles/` | 每个 GEO 运营周期 |

## 使用方式

1. Agent 开工时读取本文件、`STATUS.md` 和最近一次 `runs/` 记录；
2. 通过 geo-expert 插件的 Skills 执行 GEO 流程；
3. 结束时更新 `STATUS.md`、本次 `runs/` 记录和相关业务工件。

## 边界

- 工作区内容均为草稿与记录；知识批准、内容发布、CRM 写入必须人类执行；
- 外部观察和模型输出不得直接升级为企业 Evidence；
- 未经当次明确授权，Agent 不 commit、不 push、不创建 PR。
