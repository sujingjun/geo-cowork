# geo-cowork 变更记录

## 2026-08-24 - M3 Knowledge & Query Operating System

- 新增 M3 Schema、Document/Claim/Evidence/Answer Card/Knowledge Release/Query Set/Evidence Plan/Goal 契约与四个 Knowledge/Query Skills；
- 新增 create-only propose/assemble、M3 profile、证据充分性建议、发布闭包、关系 trace 与显式 lifecycle gates；
- 建立 MyyShop “是什么” 的 13 对象关系链、补证计划、技术 Run 与可重建 indexes，保留五条产品风险；
- Owner 后续批准全部 M3 业务对象：Query Set 已冻结，本地 Knowledge Release 已 `published/ready`，trace 为 `lifecycle_ready:true`；两条证据不足 warning 与外部发布边界继续保留；
- 本地 10 项 M3 专项与全量 47 tests 通过；没有真实 M4 诊断、外部发布或部署。

## 2026-08-24 - M2 Contract & Provenance Kernel

- 建立 Markdown Object Contract、稳定 ID/version/refs、可重建 indexes 与 legacy knowledge 兼容索引；
- 建立 Run lifecycle、input supersede、不可覆盖 raw/output artifact 与安全路径边界；
- 独立实现脱敏 ops-geo legacy audit 迁移语义，不复制无许可证上游代码或真实数据；
- MyyShop 补齐 Workspace 根身份与 M2 派生 indexes，120 条 legacy knowledge 原文不改；
- M3 在制检查点后已由同一会话按 Owner fallback 收口；M2 本条目的历史验收范围不因此扩大。

## 2026-08-20 - 移除 CodeBuddy 适配，切换 WorkBuddy（中国区）专家体系

- 删除 `.codebuddy-plugin/plugin.json` 与仓库根 `.codebuddy-plugin/marketplace.json`；插件版本升至 0.2.0（两 Manifest、两 Marketplace）；
- 第三宿主定位改为 WorkBuddy（中国区）专家体系：官方文档（workbuddy.cn）未发布开发者契约，暂不提供插件包装，过渡期经「我的专家/创建技能」人工配置；
- 同步修订 Spec 0001、重新定基线方案、架构文档、PRD、根 README 与两份 Handoff；
- 变更后验证：`node --test` 12/12、`validate-plugin` 8 项、Claude `plugin validate` ✔、Codex 重装 0.2.0 enabled ✔；用户 CodeBuddy 配置的市场注册已移除。

## 2026-08-20 - 里程碑 1 加固与中国区 WorkBuddy 适配

- 根 `README.md` CodeBuddy/WorkBuddy 章节加固：内嵌 CLI 定位与 alias 配置、应用升级路径漂移提示、`/reload-plugins` 与市场/缓存要点；
- 复核 WorkBuddy 官方中文插件文档（2026-08-20）：Manifest 与技能命名空间兼容确认，owner 缺 `email` 记为已知偏差；
- 三宿主全量复验通过（Claude 2.1.237、CodeBuddy 2.115.0、Codex 0.146.0）；交互式 `/reload-plugins` 等宿主命令确认需人工在交互会话补验；
- 新增本阶段 Task、Record 与出口 Handoff；插件代码零行为变更。

## 2026-08-20 — 里程碑 0—1（仓库重新定基线 + 三宿主插件骨架）

- 仓库定位从"SDD 控制面"修正为本地优先 GEO 专家插件仓库；
- 新增根 `README.md`、`package.json`、三个 Marketplace；
- 新增 `plugins/geo-expert`：三宿主 Manifest、`geo-workspace-init` Skill、工作区模板、初始化/校验/插件自检脚本；
- 新增 `tests/`（`node:test`）与 `tests/fixtures/workspace-valid/`；
- 新增里程碑 0—1 的 Requirement、PRD、Architecture、Spec 0001/0002、Plan、Task、Acceptance Record 与里程碑 2 Handoff。
