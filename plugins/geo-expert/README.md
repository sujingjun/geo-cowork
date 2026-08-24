# geo-expert

本地优先的企业品牌 GEO（Generative Engine Optimization）专家插件，为 Codex 与 Claude Code 提供插件包装；中国区 WorkBuddy 宿主待官方发布专家/技能开发者契约后再行适配（见仓库根 `README.md`）。

## 能力

| Skill | 责任 |
| --- | --- |
| `geo-workspace-init` | 幂等初始化、检查品牌工作区结构（里程碑 1） |
| `geo-query` | Query 与 Query Set 候选准备（M3 本地工程已验收） |
| `geo-knowledge` | Claim、Answer Card 与 Knowledge Release 候选准备（M3 本地工程已验收） |
| `geo-evidence` | Source、Evidence、Evidence Plan 与 legacy import（M3 本地工程已验收） |
| `geo-knowledge-cycle` | M3 编排、关系 trace 与人工生命周期门禁（M3 本地工程已验收） |
| `geo-diagnosis-cycle` | M4 诊断编排、阶段 gate 与 Run 交接 |
| `geo-site` | 本地 snapshot 的九项确定性站点检查与 Technical Retest |
| `geo-reputation` | 声誉研究输入、原文/阻断、独立支持、反证与置信度 |
| `geo-competitor` | 竞品研究输入与 Product Gap 人工前置 |
| `geo-content` | 单 Asset 完整 Proposal、multi-goal 合并与风险段落 |

当前产品与里程碑基线见 `docs/plans/2026-08-23-geo-cowork-final-product-plan.md`。0.3.0 是当前已登记插件版本；其后的 M4 在本地源码中实现 Schema/profile、Site/Research、显式公开 HTTP snapshot、Asset Proposal、Adoption/Publication template 与 Retest，尚未发布新插件版本。MyyShop Owner 于 2026-08-24 单独批准 11 个官网公开端点的首批只读采集；账号、GA4/GSC、消费者平台、外部写入与发布仍未授权。M3 内部 `published` 也不表示任何外部内容、插件版本或生产环境已经发布。

## 结构

```text
.codex-plugin/plugin.json     Codex Manifest
.claude-plugin/plugin.json    Claude Code Manifest
skills/                       共享 GEO Skills（已适配宿主的单一事实来源）
schemas/                      Markdown Object JSON Schema
scripts/                      确定性脚本（Node 20+；依赖见仓库根 package-lock.json）
assets/object-templates/      M2—M4 对象模板
assets/workspace-template/    工作区模板
```

## 安装与验证

见仓库根 `README.md`。插件包契约见 `docs/specs/0001-plugin-package-contract.md`，工作区契约见 `docs/specs/0002-workspace-contract.md`。

```bash
npm install --ignore-scripts
npm run test:m2-contract
npm run test:m3-knowledge-query
npm run test:m4-diagnosis
npm run check:docs
npm run validate:plugin
node plugins/geo-expert/scripts/diagnosis.mjs validate --workspace workspaces/myyshop
```

## 边界

- 工作区位于插件目录之外；插件不向安装目录或宿主缓存写业务文件；
- 不自动批准知识、不自动发布、不写 CRM、不连接云端 geo-agents；
- M2—M4 工程验收与真实执行证据分别建档；MyyShop 业务批准由 Owner 的独立决定记录证明。公开 collector 不自动发现 URL、不登录、不携带 cookie，并与只读 Site/Research manifest 分离；Proposal、Adoption、Publication 与 Technical Retest 也不互相等同。安装缓存依赖、账号/Analytics/消费者平台采集、跨宿主复验、外部发布与部署仍不在本次验收范围。
