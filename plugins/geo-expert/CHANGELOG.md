# geo-expert 变更记录

## Unreleased — Browser Query Task MCP Automation

- 新增 `.mcp.json` 与 Codex Manifest `mcpServers` 指针，只注册 `http://127.0.0.1:4319/mcp` 和 `GEO_BROWSER_MCP_TOKEN` 环境变量名；
- 新增 CQI 注册、Browser Task 摘要、pending result、raw artifact 分块读取与 acknowledgement Tool 合同；
- 新增 `browser-query-result.mjs` 的 Cowork intake 校验与 synthetic M5 materialization seam；
- `geo-answer-cycle` 增加 Browser pending pull/ack 顺序，保留 M5 人工 Review、100 Source 分类和业务边界；
- 当前仍是本地未发布实现，不提升五个真实平台的 `manual_only` 状态，也不授权真实模型、部署或发布。

## Unreleased — M5 两槽人工 Baseline 与 Source 批量分类门

- 正式采样改为每平台两个独立英文 manual slot；中文可选辅助、同对象语义一致但分别聚合；
- 新增 `classification_queue`、33/100 Source 进度与阈值前 Classification/Claim Support deferred 语义；
- 新增 `collect-manual-batch`、`review-manual-batch`、Run 1/2 `waiting_human` 与重入幂等；
- 五平台第 1 槽与 candidate Review 已落盘；自动化 guard、外部发布和插件版本 0.3.0 保持不变。
- 五平台第 2 槽随后完成，新增 `aggregate-manual-batch`；每平台 2/2、computed Aggregation，分类依赖指标保持 partial/null。

## Unreleased — M4 Diagnosis, Site & Asset Proposal

- 新增五个 M4 Skill、M4 Schema/模板、`diagnosis.mjs` 与确定性 profile/trace；
- 新增本地 site/research manifest、九项 detector、Asset Proposal、draft Adoption/Publication 与 Technical Retest；
- 后续经单独授权新增显式同源 allowlist public collector、M4 input bridge 与文档链接检查；完成 MyyShop 11 个公开端点首批快照；
- sitemap detector 支持 processing instruction 与根节点后的生成器 comment，规则版本为 `m4-site-detectors-v1.0.2`；
- 不包含登录/账号、GA4/GSC、消费者平台、自动采用、自动发布或新插件版本发布；Manifest 保持 0.3.0。

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
