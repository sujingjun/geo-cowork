---
title: Diagnosis, Site & Asset Proposal 架构
status: approved
created: 2026-08-24
source:
  - docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/architecture/2026-08-24-knowledge-query-operating-system-architecture.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权"
scope: M4 Skills、确定性诊断 Tool、研究输入、Gap、Asset Proposal、Adoption、Publication 与 Technical Retest
---

# Diagnosis, Site & Asset Proposal 架构

## 1. 目标形态

```text
Host Agent Loop
      │
      ├── geo-diagnosis-cycle（编排与停门）
      ├── geo-site（确定性技术检查）
      ├── geo-reputation（研究输入与反证）
      ├── geo-competitor（研究输入与反证）
      └── geo-content（完整建议稿）
              │
              ▼
       diagnosis.mjs CLI
              │
              ├── diagnosis-profile.mjs
              ├── site-audit.mjs
              ├── research-input.mjs
              └── asset-proposal.mjs
                      │
                      ▼
       M2/M3 object/index/Run kernel
                      │
                      ▼
Markdown Workspace（authoritative）
      ├── Source / Evidence / Finding / Asset
      ├── Evidence Plan
      ├── Asset Proposal / Adoption / Publication
      ├── Run raw / outputs
      └── indexes（derived）
```

Host 继续拥有 Agent loop 和语义提案；M4 Tool 拥有确定性检查、profile validation、create-only 物化与 trace；Workspace 保存长期业务事实。M4 不引入新的 Agent Runtime、数据库、队列或网络抓取框架。

## 2. 组件职责

| 组件 | 责任 | 禁止 |
| --- | --- | --- |
| `geo-diagnosis-cycle` | 锁定 Goal/Set/KR/Asset 输入，安排专业 Skill，呈现授权与人工门，汇总 Run | 复制专业规则、自动确认 Gap/采用/发布 |
| `geo-site` | 读取本地 manifest，执行 HTTP/canonical/robots/sitemap/Schema/title/meta/heading/crawlability 检查与复测 | 默认联网、综合 GEO 分、推断 AI crawler 因果 |
| `geo-reputation` | 整理 Source 可访问性、原文、Evidence、独立支持、反证和置信度 | 自动发帖、评论、把热度当可信度 |
| `geo-competitor` | 整理竞品材料与独立支持，提出等待人工确认的语义观察 | 自动宣称竞品优势、推荐理由或 Product Gap |
| `geo-content` | 基于显式 M3/M4 refs 形成 Asset 级完整文本与建议项 | 补造事实、自动采用、发布或修改外部系统 |
| `diagnosis-profile.mjs` | M4 profile、状态/refs/版本/Gap/人工证明校验与 trace | 语义判断或网络访问 |
| `site-audit.mjs` | 解析 snapshot manifest，运行版本化 detector，输出确定性结果 | 读取未声明文件或写业务批准 |
| `research-input.mjs` | 校验研究 manifest 与 Evidence 范围，保留 blocked/unverifiable | 自动提升 Source 可信度或结论状态 |
| `asset-proposal.mjs` | 单 Asset 合并、建议项完整性、body checksum、Adoption template 与 Retest 前置 | 调用模型、创建 decided/confirmed 人工状态 |
| M2/M3 kernel | parser、Schema merge、refs、index、Run、artifact、安全、M3 lifecycle | 保存 M4 业务规则的第二份实现 |

## 3. 数据职责与最小扩展

M4 不新建独立 Gap 对象：Gap 是带 `diagnosis_class` 与 `gap_basis` 的 Finding，继续继承 M2 `item_state`、Evidence refs 和状态。这样可以保留技术/语义 Finding 的共同 provenance，同时由 M4 profile 明确三类 Gap 的额外规则。

M4 扩展：

- `finding`：诊断类别、Source refs、支持/反证/冲突、retest 关系；
- `asset`：Asset 角色、控制范围、Goal/Query/KR/Claim 版本关系；
- `evidence_plan`：对应 Finding、部署目标 Asset；
- `run`：Goal、Query Set、Knowledge Release、Publication 与 retest 输入；
- 新增 `asset_proposal`：完整建议稿与稳定建议项；
- 新增 `adoption_record`：逐项人工采用；
- 新增 `asset_publication`：实际发布的人类证明。

Technical Retest 继续使用 Run + 新 Evidence + 新 Finding，不创建第四个“复测状态对象”。新 Finding 通过 `retest_of_ref` 指向旧 Finding，历史对象不覆盖。

## 4. 确定性站点数据流

```text
authorized collector 或 development fixture
  → immutable local snapshots
  → site manifest（path + SHA + collector/version）
  → manifest 全量预检
  → versioned detectors
  → Evidence + Finding + Run artifacts
  → derived indexes / trace
```

M4 工程实现不负责网络抓取。manifest 是 Collector 与 Tool 的稳定缝：以后引入 Playwright/Crawlee 时，只要输出同一契约即可，不把浏览器细节写入 GEO 业务内核。

检测器只报告实际可观察字段。blocked 页面 snapshot 可以证明 403/login/challenge，不能证明目标正文缺失；collector error snapshot 可以证明 timeout/unavailable，不能证明 URL 不存在。

## 5. 研究与 Gap 数据流

```text
Source observation manifest
  → access/original-content/checksum validation
  → Source + Evidence（或阻断 Evidence）
  → supporting / counter evidence sets
  → semantic Finding proposal
  → human confirm | dismiss
```

Source 可访问性、原文取得、独立支持和 confidence 是并列字段，不折叠成总分。Content/Evidence/Product Gap 由 M4 profile 根据 Claim、Evidence Sufficiency、Asset 与研究输入作前置校验；最终语义决定仍由人类完成。

## 6. Proposal、Adoption、Publication 与 Retest

```text
Findings + M3 exact versions + target Asset
  → Host 提供单份完整 draft 与 recommendation items
  → Tool 校验/合并并 create-only 写 Asset Proposal
  → Tool 创建全 pending Adoption template
  → Human 写 accepted/modified/rejected + approval
  → external human workflow 实际发布
  → Human 写 confirmed Publication attestation
  → geo-site Technical Retest
```

同一 Asset 和相同输入版本集合只允许一份有效 Proposal。多个 Goal 的建议项按稳定 item ID 和 section 排序；同一 section 的文本或事实冲突不由 Tool 猜测合并，而是在任何写入前返回冲突。

Publication attestation 只证明人类声明的 locator、内容 checksum、时间与发布项，不证明外部页面当前仍可访问。Technical Retest 必须重新采集 Evidence 才能判断技术状态。

## 7. 状态与授权门

| 门 | 通过证据 | 不自动推出 |
| --- | --- | --- |
| M4 SDD | Owner 明确批准 PRD/Spec | 真实采集授权 |
| development fixture | `.invalid`/本地 manifest + `development_fixture:true` | MyyShop 真实 Finding |
| real collection | 目标、账号、Tool、数据范围的当次授权 | 语义 Gap 确认 |
| semantic review | Finding 上的人类决定证明 | 建议采用 |
| adoption | 逐项决定与 approval | 实际发布 |
| publication | confirmed attestation | Technical Retest 或效果 |
| Technical Retest | 新 Evidence/Finding/Run | M5/M6 平台或业务改善 |

## 8. 幂等、故障与恢复

- manifest、plan 与全部目标路径先全量预检；确定性冲突在写入前失败。
- Source/Evidence/Finding/Proposal/Adoption template 使用稳定 ID、`wx` 与原子 rename；相同字节返回 `kept`，不同字节冲突。
- 多文件创建不是跨文件事务；意外 I/O 可能留下合法子集。Run 记录 completed steps，重试以 create-only `kept` 收敛。
- 输入版本或 fingerprint 变化时 supersede 旧 Run 并创建新 Run；不覆盖 raw、outputs 或旧 Finding。
- index 始终从 Markdown 重建，失败构建不替换旧 index。

## 9. M2/M3 观察与整体优化边界

M4 使用 M2/M3 时发现的问题写入 M4 Record 的独立观察表，不在相邻代码中顺手优化。只有直接阻塞 M4 且获得明确决定的问题才允许外科手术式修改，并必须保留失败测试与回归证据。

M4 完成后创建 M2–M4 整体优化 Handoff，交接观察、优先级、影响面、建议测试和授权门；Handoff 不自行批准重构，也不把 M4 通过解释为 M2/M3 已完成整体优化。
