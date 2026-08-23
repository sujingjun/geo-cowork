---
name: geo-query
description: 在本地 GEO 工作区登记候选 Query、组装 draft Query Set，并校验 formal/frozen 的人工批准与版本锁定条件。
---

# geo-query

## 触发场景

- 把研究问题登记为可追溯的候选 Query；
- 为一个 Perception Goal 准备 draft Query Set；
- 检查 formal Query、frozen Query Set、重复问题和版本锁定。

## 输入

工作区路径、Goal ID、Query 文本/语言/意图/优先级、Source refs；组装集合时还需要含稳定 ID、版本和输出路径的 JSON plan。

## 开工前必读

读取工作区 `README.md`、`STATUS.md`、`workspace.json`，以及 Spec 0003、Spec 0004。若当前宿主不在开发仓库，不得猜测 `../../workspaces`；必须使用明确的工作区路径。

## 步骤

1. 检查 Goal 与 Source refs 是否存在，创建状态固定为 `candidate` 的 Query；不得自行写入 `approval`。
2. 用对象校验确认 stable ID、Frontmatter 和 refs。
3. 需要集合时运行：

   ```bash
   node <plugin-root>/scripts/knowledge-query.mjs assemble-query-set --workspace <path> --plan <plan.json>
   ```

4. 运行 `knowledge-query.mjs validate`；只有人类明确批准并补全批准证明后，才可把 Query 改为 `formal`、Query Set 改为 `frozen`。
5. 重建 index，并把本次操作写入独立 Run。

## 输出

候选 Query、draft Query Set、可重建 index、Run 与结构化 errors/warnings。

## 可做事项

- 创建 candidate/draft 对象；
- 检测重复 Query、broken ref、version drift；
- 给出需要人工决定的准确对象和字段。

## 禁止事项

- 不代替人类批准 Goal、Query 或 Query Set；
- 不把候选集合描述为正式基线；
- 不采集平台答案、不进入 M4 诊断、不执行 Git 写操作。

## 失败与停止条件

Goal/Source 不存在、同一 Goal 下 Query 重复、版本漂移或缺少批准证明时停止；保留 candidate/draft，不猜测修复。

## 验收方式

`workspace-validate.mjs --objects` 与 `build-index.mjs --check` 退出码为 0；如需 frozen，必须同时存在人类批准证明、精确版本与内容哈希。

## 示例

```bash
node <plugin-root>/scripts/knowledge-query.mjs validate --workspace ./brand-workspace
node <plugin-root>/scripts/build-index.mjs --workspace ./brand-workspace --check
```
