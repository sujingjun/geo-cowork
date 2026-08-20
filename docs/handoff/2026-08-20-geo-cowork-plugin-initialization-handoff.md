---
title: geo-cowork 本地 GEO 专家插件初始化 Handoff
status: proposed
date: 2026-08-20
target_repository: https://github.com/sujingjun/geo-cowork
target_milestones: [0, 1]
---

# geo-cowork 本地 GEO 专家插件初始化 Handoff

## 1. 接手角色

你是 `geo-cowork` 本地 GEO 专家插件的初始化负责人。

你负责把当前 SDD 规则和 MyyShop 知识库雏形转换为一个可被 Codex、Claude Code、CodeBuddy/WorkBuddy 安装和运行的本地插件项目。

你不负责建设云端 `geo-agents`。

## 2. 项目最终目标

建设一套本地优先的企业品牌 GEO 专家插件：

```text
Codex
Claude Code
CodeBuddy/WorkBuddy
        │
        ▼
同一套 GEO Skills
        │
        ▼
本地品牌工作区
        │
        ▼
Query → Knowledge → Site → Reputation → Answers
→ Competitors → Strategy → Execution → Verification → Cycle
```

所有长期状态和业务交付物保存在 Markdown、JSONL、JSON、HTML 快照和截图等本地文件中。

## 3. 开工前必读

按顺序读取：

1. `AGENTS.md`
2. `docs/workflow.md`
3. `docs/README.md`
4. `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`
5. `workspaces/myyshop/knowledge/README.md`
6. Codex 官方插件规范：`https://developers.openai.com/plugins/build/plugins`
7. Claude Code 官方插件规范：`https://code.claude.com/docs/en/plugins`
8. CodeBuddy/WorkBuddy 官方插件规范：`https://www.workbuddy.ai/docs/zh/cli/plugins`

必须回到当前工作树核验，不能用本 Handoff 代替源码、文件和实际 CLI 结果。

## 4. 当前已知状态

当前仓库已经存在：

- SDD 工作流；
- Docs 导航；
- MyyShop 工作区；
- MyyShop 品牌知识库；
- Query、Claim、Evidence、Scope 和 Answer Test 等知识治理定义。

当前冲突：

- `AGENTS.md` 仍把仓库定义为 SDD 控制面；
- 文档声称只有 `docs/` 被跟踪；
- 实际已经跟踪 `workspaces/`，并允许 `plugins/`；
- 三宿主 Manifest 和 Marketplace 尚未形成；
- 工作区初始化、校验和跨宿主测试尚未形成。

## 5. 本次唯一目标

只完成里程碑 0 和里程碑 1：

```text
仓库重新定基线
+
三宿主插件骨架
+
geo-workspace-init
+
本地与真实宿主验证
```

完成后停止，不自动进入 Query、知识、站点或答案测试里程碑。

## 6. 成功标准

### 6.1 仓库

- `AGENTS.md` 与实际目标一致；
- 根 `README.md` 能说明产品、安装、工作区和边界；
- `docs/README.md` 能导航本地 GEO 专家 canonical 工件；
- 与 `geo-agents` 的边界明确；
- 现有 MyyShop 知识条目未被批量改写。

### 6.2 插件

存在：

```text
plugins/geo-expert/.codex-plugin/plugin.json
plugins/geo-expert/.claude-plugin/plugin.json
plugins/geo-expert/.codebuddy-plugin/plugin.json
plugins/geo-expert/skills/geo-workspace-init/SKILL.md
```

存在：

```text
.agents/plugins/marketplace.json
.claude-plugin/marketplace.json
.codebuddy-plugin/marketplace.json
```

三个 Manifest 只描述插件身份和组件路径，不复制业务规则。

### 6.3 工作区

- 工作区模板可用；
- 初始化幂等；
- 已有文件默认不覆盖；
- 输出根 README、STATUS 和稳定 workspace identity；
- 插件通过当前项目或显式 `--workspace` 定位工作区；
- 不使用 `../../workspaces` 依赖开发仓库结构；
- 不把业务文件写入插件安装缓存。

### 6.4 验证

- Node 测试通过；
- Claude `plugin validate` 通过；
- Claude `--plugin-dir` 能运行 `/geo-expert:geo-workspace-init`；
- CodeBuddy `plugin validate` 通过；
- CodeBuddy `--plugin-dir` 能运行 `/geo-expert:geo-workspace-init`；
- Codex 本地 Marketplace 可添加，并完成真实安装和 Skill Smoke Test；
- 三宿主对同一空目录生成相同的必需文件集合；
- 重复初始化不覆盖已有文件。

## 7. 本次应创建的 canonical 工件

按 `docs/workflow.md` 建立：

```text
docs/requirements/2026-08-20-local-geo-expert-plugin.md
docs/prd/2026-08-20-local-geo-expert-plugin.md
docs/architecture/2026-08-20-cross-host-plugin-architecture.md
docs/specs/0001-plugin-package-contract.md
docs/specs/0002-workspace-contract.md
docs/plans/2026-08-20-plugin-initialization-plan.md
docs/tasks/2026-08-20-plugin-initialization.md
docs/records/2026-08-20-plugin-initialization-acceptance.md
docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md
```

文件名如需按仓库规则调整，应保持语义稳定并同步 `docs/README.md`。

## 8. 实施顺序

1. 核验 `git status --short`、当前分支和 HEAD；
2. 阅读全部必读文件；
3. 记录仓库定位冲突；
4. 起草 Requirement 和 PRD；
5. 起草 Architecture、Plugin Contract Spec 和 Workspace Contract Spec；
6. 起草 Plan 和 Task；
7. 先建立结构与验证失败测试；
8. 修改 `AGENTS.md` 和根 README；
9. 创建三个 Marketplace；
10. 创建 `plugins/geo-expert` 和三个最小 Manifest；
11. 创建共享 `geo-workspace-init` Skill；
12. 创建工作区模板、初始化和校验脚本；
13. 创建 Fixture 和测试；
14. 运行本地验证；
15. 运行 Claude Code 真实验证；
16. 运行 CodeBuddy/WorkBuddy 真实验证；
17. 运行 Codex Marketplace、安装和 Skill 真实验证；
18. 写 Acceptance Record；
19. 写下一 Handoff；
20. 停止。

## 9. 技术限制

- Node.js 20+；
- 首版使用 ESM `.mjs` 和 `node:test`；
- 尽量零运行时依赖；
- 不引入服务进程、数据库、NestJS、LangChain、LangGraph 或 MCP；
- 不引入浏览器自动化；
- 不创建 Hooks、自定义 Agent 或后台 Monitor；
- 不写工作区外文件；
- 不写插件缓存；
- 不自动安装外部依赖；
- 不自动执行 Git 写操作。

## 10. 验证命令

本地：

```bash
node --test
node plugins/geo-expert/scripts/validate-plugin.mjs
node plugins/geo-expert/scripts/workspace-init.mjs --workspace ./tmp/workspace-init-smoke
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace ./tmp/workspace-init-smoke
```

Claude Code：

```bash
claude plugin validate ./plugins/geo-expert
claude --plugin-dir ./plugins/geo-expert
```

交互验证：

```text
/geo-expert:geo-workspace-init
```

CodeBuddy/WorkBuddy：

```bash
codebuddy plugin validate ./plugins/geo-expert
codebuddy --plugin-dir ./plugins/geo-expert
```

在 CodeBuddy 会话中添加本地市场并重新加载：

```text
/plugin marketplace add .
/reload-plugins
/geo-expert:geo-workspace-init
```

Codex：

```bash
codex plugin marketplace add .
```

随后在支持本地插件安装的 ChatGPT/Codex 宿主中添加 `geo-cowork` 市场、安装 `geo-expert`、触发 `geo-workspace-init` 并对照 Fixture 检查文件。不得声称通过不存在的 `codex plugin validate` 命令完成验证。

## 11. 停止条件

遇到以下情况立即停止并写入 Record：

- 官方插件 Schema 与方案冲突；
- 需要新增 MCP 或访问云端 `geo-agents`；
- 需要公开内部 MyyShop Evidence；
- 需要删除或移动现有知识条目；
- 需要自动批准知识、自动发布或写 CRM；
- 需要 commit、push 或 PR，但没有当次明确授权；
- 三宿主无法共同使用某个核心 Skill 契约；
- 插件必须引用自身目录外文件才能运行；
- 真实 Codex、Claude 或 CodeBuddy 宿主不可用，无法完成声明的运行验证。

不能用 Fixture 或静态校验冒充真实宿主验证。

## 12. 完成回报格式

最终回报必须包含：

1. 实际分支和 HEAD；
2. 工作树初始状态；
3. 修改文件清单；
4. 新建 canonical 工件；
5. 三个 Manifest 和三个 Marketplace；
6. Skill、脚本和 Fixture；
7. 首次失败证据和修复过程；
8. 所有验证命令和结果；
9. Claude、CodeBuddy、Codex 的真实验证结果；
10. 未验证项和数据公开风险；
11. 剩余风险；
12. 下一 Handoff 路径；
13. 明确声明没有自动批准、发布、云端接入或未经授权的 Git 写操作。

## 13. 直接启动提示

```text
你正在初始化 sujingjun/geo-cowork。

项目已决定：
1. geo-cowork 是本地 GEO 专家插件独立仓库；
2. weiyan2026/geo-agents 是未来云端系统，两者当前没有运行时依赖；
3. 先在 Codex、Claude Code、CodeBuddy/WorkBuddy 中跑通本地 GEO 流程；
4. 所有业务状态和交付物以本地 Markdown、JSONL、JSON、HTML 快照和截图为准；
5. 当前只实施里程碑 0 和 1。

先读取 AGENTS.md、docs/workflow.md、本 Handoff、重新定基线方案和 MyyShop 知识库 README。

然后核验仓库，建立 Requirement、PRD、Architecture、Spec、Plan 和 Task；修正仓库定位；创建三个官方插件 Manifest 和三个 Marketplace；实现共享 geo-workspace-init Skill、工作区模板和零依赖 Node 校验；完成 Codex、Claude Code、CodeBuddy/WorkBuddy 的真实 Smoke Test；写 Acceptance Record 和下一 Handoff；完成后停止。

不要建设 MCP、云端 Agent、数据库、自动发布、CRM 写入或浏览器采集。未经明确授权，不 commit、不 push、不创建 PR。
```
