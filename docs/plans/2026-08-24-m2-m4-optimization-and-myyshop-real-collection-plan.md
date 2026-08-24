---
title: M2–M4 优化与 MyyShop 公开站点真实采集实施计划
status: approved
created: 2026-08-24
source:
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md
  - "2026-08-24 当前用户指令：确认首批 allowlist、默认采集参数、raw 保留期限和人工 reviewer；完善 .env.example；执行 M2–M4 优化 Handoff 与真实采集"
scope: M2–M4 直接相关优化、MyyShop 首批公开端点快照、M4 Site/Research Run 与可审计 Record
---

# M2–M4 优化与 MyyShop 公开站点真实采集实施计划

## 1. 目标与成功标准

本轮把已经完成的 M2–M4 离线能力用于首次获授权的 MyyShop 公开站点采集，并只实施整体优化 Handoff 中直接支撑本轮安全、恢复和审计的最小改动。

成功标准：

1. 真实采集授权、allowlist、默认参数、保留期、reviewer 和禁止项有持久决定记录；
2. 公开 HTTP collector 先有失败测试，再满足同源 allowlist、限速、超时、重试、重定向、容量、脱敏、create-only 与恢复约束；
3. `.env.example` 只保留非秘密默认值、待确认标识符和凭据路径占位，并注明官方获取地址；
4. 11 个获授权端点各自生成 raw snapshot、metadata、SHA-256 和 collection manifest；
5. 五个 HTML 落地页进入 M4 Site Run；公开原文端点进入 Research Evidence，Source、Asset、Evidence、Finding 与 Run 可追溯；
6. 不因可访问或 detector 通过自动批准 Evidence、确认 Gap、采用 Proposal、确认 Publication 或声称平台/业务效果；
7. M2、M3、M4 专项与全量门通过，实际命令、失败、修复、未验证边界写入新 Record。

## 2. 基线与授权

- 工作目录：`/Users/sujingjun/geo-cowork`
- 开工基线：`main @ bd82473dd110ae8530159e3dc88812cfdd343df7`
- 远端关系：`main...origin/main [ahead 3]`
- 开工工作树：clean
- 真实采集授权：仅限决定记录列出的 MyyShop 公开、无需登录、只读 GET 端点；默认不外扩 sitemap URL。
- reviewer：`MyyShop Owner` 角色；其角色登记不等于本轮自动做出 Evidence、Gap、Proposal、Publication 或发布决定。

## 3. 范围

### 3.1 本轮实施

- 固化授权决定和执行 Task/Record；
- 安全、可恢复的公开站点 snapshot collector；
- `.env.example` 环境契约；
- MyyShop Source、Asset、Site/Research 输入计划；
- 获授权端点的真实快照与 M4 只读诊断；
- Handoff 中直接支撑真实采集的恢复、审计和文档可复验优化；
- 全量回归与新的 M2–M4 优化/真实采集 Record。

### 3.2 范围外

- GA4/GSC 账号数据读取：仅准备环境变量；缺少 GA4 numeric Property ID、GSC 精确 property URI 和只读认证时保持 blocked；
- 登录区、个人数据、cookie、表单提交、后台、密码重置、支付和任何非 allowlist URL；
- ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews 或其他消费者平台真实采样；
- CMS/社区/第三方平台外部写入、Adoption、Publication、Technical Retest；
- M5 P0 设计与实现、M6 业务观察、M7 战略执行；
- commit、push、PR、merge、release、deploy。

## 4. 采集纵切

### Slice A — 授权与环境契约

- 建立授权决定、Plan、Task；
- 修正 `.env.example` 中 GA4 Measurement ID 与 numeric Property ID 的混淆；
- 记录公开采集默认值、GA4/GSC 待确认项、凭据仅使用本地路径且禁止提交。

验证：文档链接检查、环境变量静态检查、secret 检索、`git diff --check`。

### Slice B — collector 红测与最小实现

- 失败测试覆盖：成功快照、非 allowlist、跨源重定向、响应过大、超时重试、敏感 header 不落盘、相同输入恢复、部分文件冲突；
- CLI 读取显式 JSON plan，按顺序 GET，输出 raw body、脱敏 metadata 和确定性 summary；
- 只允许 `https://www.myyshop.com` 精确 origin 与显式路径，禁止凭据和 cookie。

验证：`node --test tests/m4-public-site-collector.test.mjs`。

### Slice C — canonical Source/Asset 与 collection plan

- 每个精确端点单独登记 Source，避免 Research Evidence locator 丢失页面粒度；
- 五个 HTML 落地页登记 Asset，并绑定当前精确 Goal、Query、Claim、Knowledge Release；
- `robots.txt`、`llms*.txt`、sitemap 作为 Research 或 detector 辅助快照，不套用 HTML title/meta/heading 结论。

验证：Workspace/profile/index 校验和精确 ref trace。

### Slice D — 真实快照与 M4 Run

- 执行首批 11 个 URL；生成 response body、metadata、SHA-256、captured_at、collector/version；
- 五个 HTML 页面分别运行 Site audit；`pages.xml` 用于页面 sitemap 检查，robots 的命名 AI agent 规则只作为人工可审阅原文，不扩展当前通用组 detector 语义；
- 通过 Research ingest 登记第一方公开原文 Evidence；访问成功不等于业务批准或充分支持。

验证：snapshot checksum、manifest fingerprint、M4 profile、Run 状态和 create-only 重跑。

### Slice E — Handoff 优化与收口

- 实施本轮证明必要的恢复/审计优化；
- 对声明式 registry、profile helper、fixture helper、完整授权类型等较大重构，只在有等价失败测试和本轮直接收益时实施，否则保留为后续独立 Task；
- 不执行 Handoff 中属于 M5 的平台 sample/review/profile/revision/recovery 设计。

验证：M2/M3/M4 专项、`npm test`、插件/Workspace/Knowledge/Diagnosis/index、链接、secret、Git 检查。

## 5. 数据与恢复规则

- raw 保留期：90 天；本轮只记录到期策略，不在未单独确认删除目标前自动删除历史数据；
- raw 路径：本次 Run 内 create-only；metadata 不保存 request/response cookie、Authorization、API key 或完整环境；
- 相同计划、相同 URL 与相同内容可恢复为 kept；缺失一半、hash/config 不一致必须显式冲突；
- indexes 是可重建派生物，Markdown 对象和 raw snapshot/metadata 是事实源；
- 网络或单端点失败不得让其他成功端点伪装为全批次完成，summary 必须逐项记录。

## 6. 验收命令

```bash
node --test tests/m4-public-site-collector.test.mjs
npm run test:m2-contract
npm run test:m3-knowledge-query
npm run test:m4-diagnosis
npm test
npm run validate:plugin
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/knowledge-query.mjs trace --workspace workspaces/myyshop --query Q-MYYSHOP-WHAT-IS-001
node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop
git diff --check
```

另行核对 collector 重跑、snapshot SHA、环境变量不含 secret、Markdown 链接、branch/HEAD/dirty/remote 和所有未授权边界。

## 7. 停止条件

- 目标离开 allowlist、需要登录/cookie/验证码/表单或跨源重定向；
- 响应超过 5 MiB、重试仍超时、证书/来源身份异常或 robots/条款出现需要人类决定的冲突；
- 需要 GA4/GSC 账号权限、消费者平台采样、外部写入或 M5 行为；
- Spec 语义缺口会改变既有 M2–M4 canonical 对象或业务状态；
- 需要删除 raw、提交 Git 或操作远端。

