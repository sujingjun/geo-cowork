---
name: geo-diagnosis-cycle
description: 编排已批准知识输入到 M4 诊断、Gap、Asset Proposal、人工采用、发布证明与技术复测；适用于需要明确阶段门和 Run 交接的本地 GEO 诊断任务。
---

# geo-diagnosis-cycle

## 触发场景

- 从 approved Goal、frozen Query Set 和 published Knowledge Release 启动 M4；
- 汇总站点、研究、Gap 与 Proposal Run，并呈现人工门。

## 输入

工作区、Goal/Query Set/Knowledge Release/Asset 精确版本，以及当前允许的采集目标、Tool、数据和写入范围。没有真实采集授权时只使用 `.invalid` 或工作区内合成 snapshot。

## 开工前必读

读取工作区根文件、目标对象、最近 Record/Handoff、Spec 0003—0005。先核对 `diagnosis.mjs validate`；输入版本或授权范围不清时停止受影响阶段。

## 步骤

1. 锁定精确版本和 Run input fingerprint。
2. 根据输入调用 `geo-site`、`geo-reputation` 或 `geo-competitor`；不要复制其专业规则。
3. 将技术 Finding 与等待人工确认的语义 Gap 分开展示。
4. 需要完整建议稿时调用 `geo-content`。
5. 分别检查 Adoption、Publication 和 Technical Retest gate；没有对应证明就停在当前阶段。
6. 更新 Run、Record 和未验证边界。

## 输出

各专业 Run 引用、Finding/Evidence/Asset/Proposal trace、当前 gate、失败原因、下一步和授权边界。

## 可做事项

- 编排确定性本地命令；
- 汇总阶段状态和证据关系；
- 请求人工确认 Gap、采用或发布证明。

## 禁止事项

- 不自动批准 Gap、Adoption 或 Publication；
- 不把 Technical Retest 当消费者平台或业务效果；
- 不因 M4 开发批准而访问真实站点、账号或第三方 API。

## 失败与停止条件

版本漂移、关系缺失、manifest checksum 错误、权限扩大或人工门缺失时停止，不覆盖旧对象或 Run artifact。

## 验收方式

`diagnosis.mjs validate` 无 error；每个输出可追溯精确输入；阶段 gate 与实际证据一致；未授权真实执行明确列为未验证。

## 示例

```bash
node <plugin-root>/scripts/diagnosis.mjs validate --workspace <workspace>
node <plugin-root>/scripts/diagnosis.mjs trace --workspace <workspace> --proposal PRP-BRAND-001
```
