---
title: GA4/GSC 真实只读分析接入实施计划
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/specs/0010-ga4-gsc-readonly-analytics.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized-v2.md
  - 2026-09-01 当前用户明确指令：完成基建，执行真实读取冒烟测试
scope: Spec 0010 的最小代码、测试、认证向导、真实 smoke 与 Record
---

# GA4/GSC 真实只读分析接入实施计划

## 1. 现状与差距

现有 `geo-analytics.mjs` 仅支持 fixture 且强制断网；`.env.example` 已登记资源候选，但无真实 adapter、ADC 检查、计划 validator、归一化器或 live Record。

## 2. 实施顺序

1. 冻结授权决定和 exact plan，校验其 checksum。
2. TDD 建立 plan → exact request → normalized result 纵切。
3. TDD 建立 CLI 双开关、ADC、host/output 与 create-only 纵切。
4. 生成只处理人类 Google 控制台/OAuth 步骤的交互向导；代码安装与测试由 Agent 执行。
5. 专项绿后运行全量回归、插件、Workspace 只读与文档检查。
6. 完成 OAuth/ADC 后执行一次真实 GA4 和 GSC smoke。
7. 删除本次临时业务响应，Record 仅保留状态、row count、checksum 和限制。

## 3. 目标文件

- `plugins/geo-expert/scripts/geo-analytics-readonly.mjs`
- `plugins/geo-expert/scripts/lib/analytics-readonly.mjs`
- `plugins/geo-expert/scripts/setup-google-analytics-readonly.sh`
- `tests/analytics-readonly.test.mjs`
- `tests/analytics-readonly-cli.test.mjs`
- `docs/runbooks/ga4-gsc-readonly-analytics.md`
- `docs/records/2026-09-01-ga4-gsc-readonly-analytics-record.md`

## 4. 风险与停止条件

- 任一 scope/资源/字段扩大、需要写权限、出现 PII/credential、API 计费确认、权限不足需升级、意外高基数响应、真实 Workspace 写入或回归失败时停止。
- OAuth/MFA 必须由用户完成；Agent 不读取或记录凭据内容。
- commit、push、PR、部署、发布不在本计划授权内。

## 5. 验收命令

```bash
node --test tests/analytics-readonly*.test.mjs
npm test
npm run validate:plugin
npm run check:docs
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
```
