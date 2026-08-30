# MyyShop GEO 品牌工作区

本目录是 MyyShop 本地 GEO 工作的事实中心。Markdown 业务对象是权威内容；`indexes/` 仅为可删除重建的导航派生物。

## 当前范围

- M2 为现有 120 条 legacy knowledge 建立兼容索引，不改写原文，也不把它们自动转换成已批准 Claim 或 Evidence。
- M3 已建立 “MyyShop 是什么” 的最窄关系链、补证计划与技术 Run；Owner 已批准全部 M3 业务对象，Query 为 `formal`、Query Set 为 `frozen`、Knowledge Release 为 `published/ready`，关系 trace 为 `lifecycle_ready:true`。
- 两条 `EVIDENCE_INSUFFICIENT` warning、Claim Scope、Answer limitations 与禁止表述继续有效；这里的 `published` 只表示进入本地正式知识包，不表示任何官网、媒体、插件或生产环境已经发布。

## 目录

| 目录 | 内容 |
| --- | --- |
| `knowledge/` | 既有 legacy knowledge；未来 Document、Claim、Answer Card、Knowledge Release |
| `queries/` | Query candidates、formal Query 与 Query Set |
| `evidence/` | Source、Evidence、snapshot 与 Evidence Plan |
| `assets/` | Own/External Asset registry |
| `indexes/` | 由 Markdown 重建的只读 JSON indexes |
| `runs/` | Run 元数据与不可覆盖 raw/output artifacts |
| `cycles/` | GEO Cycle 对象与阶段记录 |
| `strategy/` | 品牌策略、内容与证据缺口、面向业务的品牌知识资料包 |
| 其余业务目录 | 站点、舆情、答案测试、竞品和执行的后续里程碑工件 |

## 业务内容入口

- [`strategy/business-brand-knowledge-v1/`](strategy/business-brand-knowledge-v1/)：面向品牌、产品、运营、法务、财务、数据、内容和公关同事的品牌知识建设资料包。
- 资料包包含 120 条知识清单（94 条源事实、26 条派生标准答案）、31 页官网页地图、12 个 PR 主题、旗舰稿、Circle 1 准备门和 CSV 清单。
- 资料包状态为 `proposed`；其中的填写示例不代表已确认事实，也不替代业务、法务、财务、数据或管理层审批。
- Markdown/CSV 是资料包主版本；Excel/Word 仅为派生协作快照，文件名与校验值记录在资料包内，不作为仓库事实源。

## 开工规则

先读本文件、`STATUS.md`、`workspace.json` 和当前 Handoff；运行对象校验和 index check 后再修改。后续对象状态变化仍需新的可追溯人类决定；未经当次明确授权，不执行 Git 写操作、真实采集、外部发布或部署。
