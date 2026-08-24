---
name: geo-content
description: 基于显式 Goal/Query/Claim/Evidence/Finding/Asset 输入形成单一 Asset 的完整 Proposal 与建议项；适用于站内外建议稿，不负责自动采用或发布。
---

# geo-content

## 触发场景

- 为 About、Homepage、FAQ、Schema、llms、官方站外内容生成完整建议稿；
- 为伙伴/媒体生成 Brief/Pitch，或为社区场景生成研究记录与回复建议稿。

## 输入

目标 Asset、精确 Goal/Query/KR/Claim 版本、Finding/Evidence refs、完整 Markdown body、稳定 recommendation item 及每项 risk。

## 开工前必读

读取目标 Asset、M3 Knowledge Release、Claim/Evidence、M4 Finding 与 Spec 0005 §6—§8。先确认同一 Asset 是否已存在相同输入集合的有效 Proposal。

## 步骤

1. Host 基于允许表达范围准备一份完整 body 和全部建议项。
2. 多 Goal 共用 Asset 时先合并为单份 plan；无法确定性合并就停止。
3. Evidence 不足、stale、Scope 限制或冲突时填写风险原因与弱化表达。
4. 运行：

   ```bash
   node <plugin-root>/scripts/diagnosis.mjs propose-assets --workspace <path> --plan <plan.json>
   ```

5. 需要人工审查时只创建 draft Adoption；发布后另建 Publication 证明并 Technical Retest。

## 输出

单 Asset Proposal、稳定建议项、body checksum、trace，以及 draft Adoption/Publication template（按需）。

## 可做事项

- 形成完整正文、Brief、Pitch 或回复建议稿；
- 合并显式多 Goal 输入并保留逐项 provenance；
- 为不足证据提供弱化表达。

## 禁止事项

- Tool 不调用模型补事实；
- 不创建 decided Adoption 或 confirmed Publication；
- 不写 CMS、Git PR、媒体、社区或其他外部系统。

## 失败与停止条件

body/section/ref 缺失、版本漂移、同 Asset 唯一键冲突、风险未标注或文本无法确定性合并时停止，冲突前不写半成品。

## 验收方式

body hash 正确；每个 section 和 item 可追溯；同一 Asset/输入集合只有一份有效 Proposal；Adoption、Publication 与 Retest gate 分离。

## 示例

```bash
node <plugin-root>/scripts/diagnosis.mjs prepare-adoption --workspace ./brand --proposal PRP-BRAND-001 --id ADR-BRAND-001 --path assets/adoptions/brand.md
```
