# geo-expert

本地优先的企业品牌 GEO（Generative Engine Optimization）专家插件，为 Codex 与 Claude Code 提供插件包装；中国区 WorkBuddy 宿主待官方发布专家/技能开发者契约后再行适配（见仓库根 `README.md`）。

## 能力

| Skill | 责任 |
| --- | --- |
| `geo-workspace-init` | 幂等初始化、检查品牌工作区结构（里程碑 1） |

后续里程碑（Query、知识、站点、舆情、答案、竞品、策略、执行、周期）按 `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md` 推进。

## 结构

```text
.codex-plugin/plugin.json     Codex Manifest
.claude-plugin/plugin.json    Claude Code Manifest
skills/                       共享 GEO Skills（已适配宿主的单一事实来源）
scripts/                      确定性脚本（Node 20+，零依赖）
assets/workspace-template/    工作区模板
```

## 安装与验证

见仓库根 `README.md`。插件包契约见 `docs/specs/0001-plugin-package-contract.md`，工作区契约见 `docs/specs/0002-workspace-contract.md`。

```bash
node scripts/validate-plugin.mjs            # 插件包自检（在仓库根运行）
```

## 边界

- 工作区位于插件目录之外；插件不向安装目录或宿主缓存写业务文件；
- 不自动批准知识、不自动发布、不写 CRM、不连接云端 geo-agents。
