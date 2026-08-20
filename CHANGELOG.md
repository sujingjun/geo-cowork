# geo-cowork 变更记录

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
