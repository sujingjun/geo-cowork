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

当前产品与里程碑基线见 `docs/plans/2026-08-23-geo-cowork-final-product-plan.md`。0.3.0 已完成 M2 内核与 M3 本地工程/candidate slice 验收；这不表示 MyyShop 业务对象已批准、Query Set 已冻结或 Knowledge Release 已发布。

## 结构

```text
.codex-plugin/plugin.json     Codex Manifest
.claude-plugin/plugin.json    Claude Code Manifest
skills/                       共享 GEO Skills（已适配宿主的单一事实来源）
schemas/                      Markdown Object JSON Schema
scripts/                      确定性脚本（Node 20+；依赖见仓库根 package-lock.json）
assets/object-templates/      M2/M3 对象模板
assets/workspace-template/    工作区模板
```

## 安装与验证

见仓库根 `README.md`。插件包契约见 `docs/specs/0001-plugin-package-contract.md`，工作区契约见 `docs/specs/0002-workspace-contract.md`。

```bash
npm install --ignore-scripts
npm run test:m2-contract
npm run test:m3-knowledge-query
npm run validate:plugin
```

## 边界

- 工作区位于插件目录之外；插件不向安装目录或宿主缓存写业务文件；
- 不自动批准知识、不自动发布、不写 CRM、不连接云端 geo-agents；
- M2/M3 验收只覆盖本地源码与 Workspace；安装缓存中的依赖安装、跨宿主复验、业务批准与发布不在本次验收范围。
