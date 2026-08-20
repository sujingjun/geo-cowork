---
title: Spec 0001 — 插件包契约
status: proposed
created: 2026-08-20
updated: 2026-08-20
revision: 按用户指令移除 CodeBuddy 适配层；第三宿主改为 WorkBuddy（中国区），其包装契约待官方开发者契约发布后另行立 Spec
source: docs/architecture/2026-08-20-cross-host-plugin-architecture.md
scope: plugins/geo-expert 的目录结构、Manifest、Marketplace 与自检规则
---

# Spec 0001 — 插件包契约

## 1. 触发条件

本契约适用于：创建或修改 `plugins/geo-expert/` 内任何 Manifest、Skill、脚本、模板，以及仓库根两个 Marketplace 文件时。

## 2. 插件目录结构

```text
plugins/geo-expert/
├── .codex-plugin/plugin.json       # Codex Manifest
├── .claude-plugin/plugin.json      # Claude Code Manifest
├── README.md                       # 插件说明与安装方式
├── CHANGELOG.md                    # 插件版本记录
├── skills/<skill-name>/SKILL.md    # 技能（Frontmatter: name, description）
├── scripts/*.mjs                   # 确定性脚本（Node 20+，零依赖）
├── schemas/                        # 机器可读契约（里程碑 1 可为空，不提交空目录）
└── assets/workspace-template/      # 工作区模板
```

只有 `plugin.json` 放在各 `.*-plugin/` 目录内；Skills、Scripts、Assets 一律位于插件根目录。

## 3. Manifest 契约

### 3.1 共同字段

| 字段 | 约束 |
| --- | --- |
| `name` | 固定 `geo-expert`，kebab-case；两个 Manifest 一致，决定 Skill 命名空间 `/geo-expert:<skill>` |
| `version` | 语义化版本，两个 Manifest 一致 |
| `description` | 一句话说明，不含业务规则 |

### 3.2 Codex（`.codex-plugin/plugin.json`）

- 必需：`name`、`version`、`description`；
- 组件指针：`"skills": "./skills/"`；
- 可含 `interface`（`displayName`、`shortDescription`、`category` 等展示字段）；
- 本阶段禁止出现 `mcpServers`、`apps`、`hooks` 字段。

### 3.3 Claude Code（`.claude-plugin/plugin.json`)

- 必需：`name`；`description`、`version`、`author` 按官方 Schema 可选但本仓固定提供；
- Skills 由 `skills/<name>/SKILL.md` 默认位置发现，无需指针字段。

### 3.4 WorkBuddy（中国区，待契约）

- 不提供 WorkBuddy Manifest：中国区官方文档（workbuddy.cn 专家中心/技能市场）截至 2026-08-20 未发布开发者契约（无 manifest、文件格式、导入协议或 CLI 验证命令）；
- 过渡期使用方式见仓库根 `README.md`：在 WorkBuddy「我的专家/创建技能」中以自然语言指向本插件 Skills 与本地工作区；
- 官方发布开发者契约后，按 `docs/workflow.md` 新立 Spec 并恢复仓库级包装，不得在契约发布前虚构格式。

### 3.5 单一事实来源

Manifest 只含宿主元数据与组件路径。出现以下任一情况即为违规：Manifest 内出现 Query 分类、知识状态机、Finding 规则、GEO 评分、内容优化规则、审批门禁或输出格式定义。

## 4. Marketplace 契约

### 4.1 Codex：`.agents/plugins/marketplace.json`

```json
{
  "name": "geo-cowork",
  "interface": { "displayName": "geo-cowork" },
  "plugins": [
    {
      "name": "geo-expert",
      "source": { "source": "local", "path": "./plugins/geo-expert" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

### 4.2 Claude Code：`.claude-plugin/marketplace.json`

```json
{
  "name": "geo-cowork",
  "owner": { "name": "geo-cowork" },
  "plugins": [
    {
      "name": "geo-expert",
      "source": "./plugins/geo-expert",
      "description": "本地优先的企业品牌 GEO 专家"
    }
  ]
}
```

### 4.3 WorkBuddy（中国区，待契约）

不提供 WorkBuddy Marketplace 文件，原因与恢复条件同 §3.4。

## 5. SKILL.md 契约

- Frontmatter 只使用已适配宿主（Codex、Claude Code）的最小交集：`name`（kebab-case，与目录名一致）、`description`；WorkBuddy 契约发布后按其要求另行扩展；
- 正文必须包含：触发场景、输入、开工前必读、步骤、输出、可做事项、禁止事项、失败与停止条件、验收方式、示例；
- Skill 通过 `--workspace` 或向上查找定位工作区，不得假设开发仓库结构。

## 6. 错误与异常

| 场景 | 行为 |
| --- | --- |
| Manifest JSON 解析失败 | `validate-plugin.mjs` 非零退出，指出文件与错误 |
| 两个 Manifest `name`/`version` 不一致 | `validate-plugin.mjs` 非零退出 |
| SKILL.md 缺少 `name`/`description` 或与目录名不符 | `validate-plugin.mjs` 非零退出 |
| Marketplace 指向不存在的插件路径 | `validate-plugin.mjs` 非零退出 |

## 7. 非功能要求

- `scripts/validate-plugin.mjs` 在仓库根以 `node plugins/geo-expert/scripts/validate-plugin.mjs` 运行，退出码 0 表示合规；
- 校验不依赖网络与宿主 CLI；宿主官方校验（`claude plugin validate`、Codex 市场添加）作为补充层。
