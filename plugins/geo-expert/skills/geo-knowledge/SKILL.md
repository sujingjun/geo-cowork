---
name: geo-knowledge
description: 从已获人工批准的 Document 提议 candidate Claim 与 Answer Card，组装 draft Knowledge Release，并校验版本与证据闭包。
---

# geo-knowledge

## 触发场景

- 把完整品牌文档拆成原子 Claim；
- 为 Query 准备可追溯 Answer Card；
- 准备 draft Knowledge Release 或校验已有人类决定的发布对象。

## 输入

工作区路径、approved Document ID，以及包含 Claim/Answer Card 稳定 ID、refs、版本和输出路径的 plan；组装 Release 时另需 release plan。

## 开工前必读

读取工作区根文件、目标 Document、相关 Source/Evidence/Query 与 Spec 0003、Spec 0004。Document 不是 `approved` 时不得物化知识对象。

## 步骤

1. 核验 Document 的人工批准证明及所有 Evidence/Query refs。
2. 运行提议命令，输出只能是 `candidate`：

   ```bash
   node <plugin-root>/scripts/knowledge-query.mjs propose --workspace <path> --plan <plan.json>
   ```

3. 检查风险类型和证据充分性 warning；不足时交给 `geo-evidence` 准备 Evidence Plan。
4. 需要发布包草案时运行 `assemble-release`；输出固定为 `draft/incomplete`。
5. 人类另行审查、批准并修改状态后，运行 validate、trace 和 index check。

## 输出

candidate Claim、candidate Answer Card、draft Knowledge Release、关系 trace、`lifecycle_ready/gates` 和确定性校验诊断。

## 可做事项

- 从 approved Document 创建候选对象；
- 校验 Query→Answer Card→Claim→Evidence→Source 与 Claim→Document；
- 说明证据缺口和发布未就绪原因。

## 禁止事项

- 不批准 Claim/Answer Card，不发布 Knowledge Release；
- 不把 `published` 解释为网站或外部平台已发布；
- 不修改 legacy knowledge，不把产品计划自动升级为品牌事实。

## 失败与停止条件

Document 未批准、refs 缺失、版本漂移、目标文件内容冲突或 trace 不完整时停止，不覆盖已有对象。

## 验收方式

candidate/draft 阶段允许充分性 warning，关系完整时仍必须显示 `lifecycle_ready:false`；正式发布链必须有完整人工批准证明、精确版本、`readiness: ready`、完整 trace 且 `lifecycle_ready:true`。

## 示例

```bash
node <plugin-root>/scripts/knowledge-query.mjs propose --workspace ./brand-workspace --plan ./proposal.json
node <plugin-root>/scripts/knowledge-query.mjs trace --workspace ./brand-workspace --query Q-BRAND-001
```
