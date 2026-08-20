---
title: 跨宿主插件架构
status: proposed
created: 2026-08-20
source: docs/prd/2026-08-20-local-geo-expert-plugin.md; docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md
scope: geo-cowork 插件包装、工作区契约与宿主适配层
---

# 跨宿主插件架构

## 1. 目标形态

```text
┌─────────────────────────────────────────────────┐
│ 宿主适配层（只含身份元数据，无业务规则）           │
│  .codex-plugin/plugin.json                      │
│  .claude-plugin/plugin.json                     │
│  .codebuddy-plugin/plugin.json                  │
├─────────────────────────────────────────────────┤
│ 共享能力内核（GEO 能力单一事实来源）              │
│  skills/<skill>/SKILL.md   行为契约与编排        │
│  scripts/*.mjs             确定性执行（零依赖）   │
│  schemas/                  机器可读契约（预留）   │
│  assets/workspace-template/ 工作区模板           │
├─────────────────────────────────────────────────┤
│ 品牌工作区（项目事实中心，插件之外）              │
│  README.md STATUS.md workspace.json queries/ …  │
└─────────────────────────────────────────────────┘
```

三个宿主读取同一套 Skills 与脚本，对同一个工作区产生一致结果。Marketplace（`.agents/plugins/`、`.claude-plugin/`、`.codebuddy-plugin/` 下的 `marketplace.json`）只解决"宿主如何发现插件"，不承载能力定义。

## 2. 模块关系

| 模块 | 职责 | 不得做 |
| --- | --- | --- |
| Manifest ×3 | 插件名称、版本、描述、组件路径 | 保存 Query 分类、状态机、Finding 规则、评分或输出格式 |
| Marketplace ×3 | 市场名称、插件来源路径、安装策略 | 复制插件内容或业务规则 |
| SKILL.md | 触发场景、输入、步骤、输出、权限边界、停止条件 | 绕过脚本直接手写工作区结构 |
| scripts/*.mjs | 幂等初始化、结构校验、插件包自检 | 依赖 cwd、引用插件根外文件、写插件缓存 |
| assets/workspace-template/ | README/STATUS/workspace.json 模板 | 存放真实品牌数据 |
| workspaces/（仓库内） | MyyShop 真实工作区 | 被脚本以相对路径引用 |

## 3. 关键架构决策（待批准）

### AD-1 一个插件目录承载三个 Manifest

`plugins/geo-expert/` 同时包含 `.codex-plugin/`、`.claude-plugin/`、`.codebuddy-plugin/` 三个子目录。三宿主各自只读取自己的 Manifest，互不干扰。替代方案（三个插件目录）会复制 Skills，违反红线 4。

### AD-2 业务行为下沉到确定性脚本

工作区初始化与校验由 `scripts/workspace-init.mjs`、`scripts/workspace-validate.mjs` 完成；Skill 只负责定位工作区、调用脚本、解释结果。这保证三宿主行为一致且可脱离宿主用 `node --test` 验证。

### AD-3 工作区定位两段式

脚本优先使用显式 `--workspace <path>`；缺省时从当前目录向上查找 `workspace.json` 定位工作区根。禁止 `../../workspaces` 之类的开发仓库相对路径，使插件在任意检出位置都能运行。

### AD-4 幂等与保护

初始化对每类文件采用"不存在才写入"策略；`workspace.json` 已存在时校验其必需字段并保留 `workspace_id`、`created_at` 不变。不提供任何删除或覆盖已有业务文件的模式。

### AD-5 与 geo-agents 的边界

本仓不导入 `geo-agents` 源码、不启动云端服务、不以 MCP 为前置条件。未来唯一交接物是契约文档与验证记录（见重新定基线方案 §4.3）。

## 4. 数据流

```text
用户触发 /geo-expert:geo-workspace-init
  → Skill 解析 --workspace（或向上查找）
  → 调用 scripts/workspace-init.mjs
  → 模板复制（缺省不覆盖）+ workspace.json 身份生成/保留
  → 调用 scripts/workspace-validate.mjs
  → 输出创建/保留清单与校验结论
  → 用户（或 Agent）更新 STATUS.md 记录本次动作
```

## 5. 非功能要求

- Node.js 20+，ESM `.mjs`，零运行时依赖；
- 所有脚本可在任意 cwd 下以绝对/相对路径运行；
- 单工作区初始化 < 1s（本地文件操作量级）；
- 无网络访问、无外部进程、无 Git 写操作。
