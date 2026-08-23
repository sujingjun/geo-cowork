---
title: Knowledge & Query Operating System 架构
status: proposed
created: 2026-08-24
source:
  - docs/prd/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/architecture/2026-08-23-contract-provenance-kernel-architecture.md
scope: M3 Skills、确定性知识/Query Tool、Markdown 对象与派生关系
---

# Knowledge & Query Operating System 架构

## 1. 目标形态

```text
Host Agent Loop
      │
      ├── geo-knowledge-cycle（只编排与停门）
      ├── geo-query
      ├── geo-knowledge
      └── geo-evidence
              │
              ▼
       knowledge-query.mjs
       + M2 object/index kernel
              │
              ▼
Markdown Workspace（authoritative）
      ├── knowledge/documents
      ├── knowledge/claims
      ├── knowledge/answer-cards
      ├── knowledge/releases
      ├── queries/candidates|formal|sets
      ├── evidence/sources|records|plans
      └── indexes（derived）
```

## 2. 责任边界

| 组件 | 责任 | 禁止 |
| --- | --- | --- |
| `geo-knowledge-cycle` | 读取状态、安排四个专业 Skill、呈现人工门、汇总 Run | 复制专业规则或越过批准 |
| `geo-query` | candidate、去重建议、formal approval 检查、Query Set | 自动 formal 或静默改 frozen Set |
| `geo-knowledge` | Document、Claim、Answer Card、Knowledge Release | 用模型补事实或自动 approve/publish |
| `geo-evidence` | Source/Evidence、充分性建议、Evidence Plan | 采集未授权真实数据或复杂 Trust Score |
| `knowledge-query.mjs` / `knowledge-trace.mjs` | 物化明确计划、状态/版本/refs 校验、关系 trace 与 lifecycle gates | 执行语义研究或批准决策 |
| M2 kernel | parse、Schema、refs、index、Run、安全 | 保存 M3 业务状态机的第二份实现 |

## 3. 双层知识数据流

```text
approved Document
  └── candidate Claim proposals
        ├── Evidence refs + sufficiency suggestion
        └── candidate Answer Card

human review/approval
  └── draft Knowledge Release
        └── published Release（human attestation required）
```

提案计划是显式 JSON 输入，只描述要创建的 candidate 对象；Tool 不从自然语言自行推理 Claim。语义提取由 Host Agent 完成并留给人类审查，确定性 Tool 保证 IDs、refs、状态和不覆盖。

## 4. Query 数据流

```text
candidate Query
  → human approval attestation
  → formal Query
  → draft Query Set
  → human freeze attestation
  → frozen Query Set + exact versions/content hash
```

同一 Goal 中 normalized text + language 相同的 active Query 产生 duplicate diagnostic。frozen Set 不被原地编辑；新版本以新对象版本或新 Set supersede。

## 5. Readiness 与批准

机器可以校验 `ready/incomplete`、warnings 与 lifecycle gates，但 readiness 不是 status。approval attestation 只证明 Workspace 中记录了人类决定；Agent 不生成伪造 attestation。没有 attestation 的 `formal/approved/published/frozen` 对象校验失败。关系 trace 完整但生命周期未就绪时返回 `lifecycle_ready:false`，不把候选闭包伪装成发布闭包。

## 6. MyyShop 迁移策略

- 保留 120 条 legacy 文件；compatibility index 记录路径/hash/status。
- 新建一份窄 draft Document，只引用 `KB-IDENTITY-009`、`KB-ANSWER-001` 两个 legacy IDs 作为背景，不把其升级为已批准 Evidence。
- 最终产品方案与两个 legacy 草稿分别登记 Source，共享一个 checksum snapshot 和 candidate Evidence，仍不替代品牌事实负责人批准。
- 建立 candidate Claim/Answer Card/Query 与 draft KR/Set；不改 `/about-us`、Schema、llms 或外部系统。

## 7. M4 边界

M3 可输出 Evidence Plan，但不创建 Finding、Asset、Content/Evidence/Product Gap、建议稿、Adoption Record 或 Technical Retest。M4 Handoff 只能引用 approved/frozen/published 输入；draft MyyShop slice 是待 Owner 处理的明确前置门。
