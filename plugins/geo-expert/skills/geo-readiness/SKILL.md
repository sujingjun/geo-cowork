---
name: geo-readiness
description: 对显式 Merchant、knowledge_base_ref 与 Goal 做只读 GEO Lifecycle Readiness 检查；不创建 Cycle、Gap、批准或 Publication。
---

# geo-readiness

## 触发场景

真实 Cycle 启动前检查，或在真实品牌知识库缺席时确认 development-test 工程输入。

## 输入

Workspace 路径、显式 KBASE ID 与 Goal ID。

## 开工前必读

读取 Spec 0012、Workspace identity、目标 KBASE、Goal/Query Set 和知识闭包。

## 步骤

执行：

```bash
node <plugin-root>/scripts/geo-readiness.mjs report --workspace <path> --knowledge-base <KBASE-ID> --goal <GOAL-ID>
```

核对逐门结果与 refs；缺门时停止，不创建 Cycle。

## 输出

报告分开 `engineering_ready` 与 `real_cycle_start_ready`，固定 `formal_cycle_created:false`。

## 可做事项

只读解析身份、KBASE、Goal、Query Set、知识闭包和非凭据 Analytics 配置。

## 禁止事项

不得创建或批准任何业务对象，也不得把测试知识库当真实品牌知识库。

## 失败与停止条件

知识输入缺失只返回 `KNOWLEDGE_INPUT_ABSENT` 和 `content_gap_inferred:false`；身份、ref 或版本漂移时 fail loud。

## 验收方式

运行 `tests/lifecycle-readiness.test.mjs`，并比较报告前后 Workspace 文件集合。

## 示例

```bash
node <plugin-root>/scripts/geo-readiness.mjs report --workspace ./workspaces/brand --knowledge-base KBASE-BRAND-001 --goal GOAL-BRAND-001
```
