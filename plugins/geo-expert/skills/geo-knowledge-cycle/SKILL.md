---
name: geo-knowledge-cycle
description: 编排 M3 Goal、Query、Evidence、Document、Claim、Answer Card、Query Set 与 Knowledge Release 的本地准备和人工门禁。
---

# geo-knowledge-cycle

## 触发场景

- 从候选 Perception Goal 启动一个 M3 知识/查询准备周期；
- 汇总 `geo-query`、`geo-evidence`、`geo-knowledge` 的确定性输出；
- 为下一里程碑生成有明确门禁的交接。

## 输入

工作区路径、Cycle/Goal 范围、已授权来源、当前 Document/Query/Evidence 状态，以及需要的人类决策边界。

## 开工前必读

读取工作区根文件、最近 Run/Cycle、Spec 0003、Spec 0004 和当前 Handoff。若目标/范围含糊，先请求人类确认，不创建业务批准。

## 步骤

1. 运行结构与对象校验，记录当前对象版本和阻塞项。
2. 调用 `geo-query` 准备 candidate Query/draft Set；调用 `geo-evidence` 登记来源与缺口；只在 Document 已获人类批准时调用 `geo-knowledge` propose。
3. 每个专业步骤使用独立 Run；Run `completed` 与 `business_result` 分开记录。
4. 重建 index，执行 validate 与 trace，分别汇总 errors/warnings、关系 refs 和 `lifecycle_ready/gates`。
5. 若尚缺 Goal/Document/Query/Claim/Release 人工批准，交接状态保持准备完成但业务门未通过；不得进入真实 M4 诊断。

## 输出

M3 对象闭包、indexes、独立 Runs、验证结果、Owner 待办和下一里程碑 Handoff。

## 可做事项

- 编排本地确定性工具和候选对象；
- 汇总证据缺口、版本漂移、人工门；
- 在人工门已满足后声明“可进入 M4”，但不替代 M4 业务执行。

## 禁止事项

- 不自行批准、不发布、不部署；
- 不把测试 Fixture 的 approval 用于真实品牌；
- 不把 `completed`、index PASS 或结构 PASS 表述成业务效果；
- 不自动创建子 Agent 或外部任务，除非当次用户明确授权。

## 失败与停止条件

工作区身份/refs/checksum 不合法、存在 secret、关键人工门缺失或授权范围不清时停止在对应门前，保留可复验输出。

## 验收方式

`workspace-validate --objects`、知识 validate、关系 trace 与 index check 均无 error；warning/gate 有明确 Owner。candidate/draft trace 必须显示 `lifecycle_ready:false`；进入真实 M4 还必须具备 approved Goal、formal/frozen Query Set、published Knowledge Release 的真实人类决定。

## 示例

```bash
node <plugin-root>/scripts/workspace-validate.mjs --workspace ./brand-workspace --objects
node <plugin-root>/scripts/knowledge-query.mjs validate --workspace ./brand-workspace
node <plugin-root>/scripts/build-index.mjs --workspace ./brand-workspace
```
