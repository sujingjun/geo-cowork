# geo-expert 变更记录

## Unreleased — M4 Diagnosis, Site & Asset Proposal

- 新增五个 M4 Skill、M4 Schema/模板、`diagnosis.mjs` 与确定性 profile/trace；
- 新增本地 site/research manifest、九项 detector、Asset Proposal、draft Adoption/Publication 与 Technical Retest；
- 不包含网络抓取、真实 MyyShop 采集、自动采用、自动发布或新插件版本发布；Manifest 保持 0.3.0。

## 0.3.0 — 2026-08-24（M2 Contract Kernel + M3 Knowledge/Query）

### M3 Knowledge & Query Operating System

- 新增 `geo-query`、`geo-knowledge`、`geo-evidence`、`geo-knowledge-cycle`；
- 新增 M3 对象 Schema/模板、Knowledge/Query CLI、M3 validator 与 lifecycle-aware trace；
- propose/assemble 只创建 candidate/draft，对自动批准、版本漂移、路径/ID 冲突与不完整发布闭包明确失败；
- 本地工程和 MyyShop 初始 candidate/draft slice 已验证；Owner 随后批准业务对象并形成本地正式 Knowledge Release，证据 warning 保留；不代表外部发布或部署。

### M2 Contract & Provenance Kernel

- 新增 Markdown Object Schema、gray-matter/Ajv 校验、安全路径与 Evidence checksum；
- 新增确定性 indexes/refs、Run lifecycle/supersede、不可覆盖 artifact；
- 新增脱敏 legacy ops-geo Source/Evidence/Finding 迁移器和合成 Fixture；
- 工作区模板增加 `evidence/`、`assets/`、`indexes/`，修复并发初始化身份竞态；
- M3 Skills 与语义实现随后在同一 0.3.0 工作树完成独立本地验收；本条目的 M2 验收结论仍保持历史范围。

## 0.2.0 — 2026-08-20（移除 CodeBuddy 适配，切换 WorkBuddy 中国区定位）

- 移除 `.codebuddy-plugin/plugin.json` 与仓库根 `.codebuddy-plugin/marketplace.json`；
- 第三宿主定位改为 WorkBuddy（中国区）专家体系，其包装契约待官方发布（当前文档仅有用户级操作指南，无开发者契约）；
- `validate-plugin.mjs` 检查项同步收缩为两个 Manifest 与两个 Marketplace。

## 0.1.0 — 2026-08-20（里程碑 1：三宿主插件骨架）

- 新增 Codex / Claude Code / CodeBuddy 三个 Manifest；
- 新增 `geo-workspace-init` Skill；
- 新增工作区模板与 `workspace-init.mjs`、`workspace-validate.mjs`、`validate-plugin.mjs` 脚本（零运行时依赖）。
