---
title: 里程碑 1 加固与中国区 WorkBuddy 专家体系适配 Handoff
status: proposed
date: 2026-08-20
target_repository: https://github.com/sujingjun/geo-cowork
target_milestones: [1]
branch: main
baseline_head_at_draft: 0af4a16e33a998d14b45d499848664d5f42087ce
predecessor_record: docs/records/2026-08-20-plugin-initialization-acceptance.md
blocks_handoff: docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md
workbuddy_region: 中国区
workbuddy_version_observed: 5.3.14
workbuddy_creation_entry: 新建任务 + expert-manager
human_decisions:
  - 不再把 CodeBuddy CLI/CodeBuddy Code 作为产品宿主
  - WorkBuddy 专家和专家团统一通过 expert-manager 创建、更新和注册
  - WorkBuddy 任务按需选择专家、Skill、MCP 连接器、工作空间和权限
scope: 里程碑 1 工程加固、WorkBuddy 专家/专家团适配、MyyShop 工作区迁移和固定基线验收
---

# 里程碑 1 加固与中国区 WorkBuddy 专家体系适配 Handoff

## 1. 接手角色

你是 `sujingjun/geo-cowork` 的里程碑 1 加固负责人。

本次任务不是进入 Query 与知识实现，而是先把里程碑 1 收口为以下稳定基线：

```text
Codex 插件
+
Claude Code 插件
+
中国区 WorkBuddy 本地专家 / 专家团
+
共享 GEO Skills、确定性脚本和品牌工作区
```

WorkBuddy 的专家/专家团必须通过当前产品中的 `expert-manager` 创建入口完成，不得自行发明另一套 WorkBuddy 原生包生成器，也不得手工写入 WorkBuddy 未公开的数据库或缓存。

完成本 Handoff 后停止，由人类决定是否解除里程碑 2 阻塞。

## 2. 已确认的产品模型

### 2.1 WorkBuddy 专家体系

中国区 WorkBuddy 的产品语义固定为：

- **Skill**：提供可执行的工具能力和工作流；
- **专家**：以“人设 + 方法论 + 工具链”处理明确的单点专业任务；
- **专家团**：由团长拆解任务、分配成员、并行执行并整合交付；
- **MCP 连接器**：在独立授权下访问外部服务；
- **工作空间**：当前任务的本地上下文和文件操作范围；
- **权限**：当前任务的运行授权，不由专家身份自动获得。

专家本身不应被视为拥有系统权限。只有当前任务显式选择并授权 Skill、MCP 连接器和工作空间后，专家才可间接访问相关文件或外部服务。

### 2.2 已实物确认的操作入口

根据当前中国区 WorkBuddy v5.3.14 界面，创建和运行链路为：

```text
新建任务
→ 选择 expert-manager
→ 选择工作空间
→ 选择权限
→ 用自然语言要求创建或更新专家 / 专家团
```

普通任务运行时，输入框 `+` 菜单支持按任务选择：

```text
专家
Skill
连接器
工作空间
权限
```

因此，本项目不把 WorkBuddy 工作空间、MCP 或用户绝对路径写死在专家定义中；它们属于任务级绑定。

### 2.3 本次默认策略

- 里程碑 1 默认使用**单专家**执行实现与修复；
- 专家团只用于复杂验收、对抗性审查和多角色协作，不作为所有任务的默认入口；
- 默认权限使用 WorkBuddy 的**默认权限**，不得为了减少确认直接要求完全访问；
- 里程碑 1 默认不绑定 MCP 连接器；
- 只选择完成当前任务所需的 Skill；
- MyyShop 真实工作区必须在完成迁移和数据边界确认后才可选择。

## 3. 与旧方案相比的关键纠正

### 3.1 不再自行生成“WorkBuddy 原生专家包”

取消以下作为主方案的设计：

```text
自定义 Node 脚本直接生成 WorkBuddy 原生专家包
自定义脚本直接注册到 WorkBuddy
手工写 WorkBuddy 内部目录
自行猜测 WorkBuddy Expert/Team Schema
```

新的唯一正式路径是：

```text
仓库存放可审查的专家源定义和创建说明
→ WorkBuddy 任务选择 expert-manager
→ expert-manager 创建、校验、更新和注册本地专家/专家团
→ 在“我的专家”中确认
→ 新任务按需选择专家、Skill、连接器、工作空间和权限
```

### 3.2 仓库保存“源定义”，WorkBuddy 保存“部署实例”

仓库中的专家源定义是可版本化、可代码审查的意图来源；WorkBuddy 中由 `expert-manager` 生成并注册的专家/专家团是本地部署实例。

不得让 WorkBuddy 聊天记录或某次生成后的不可追溯配置反向成为 GEO 业务规则单一事实来源。

### 3.3 不再把 WorkBuddy 当作第三份插件 Manifest

目标架构不是“三 Manifest、三 Marketplace”，而是：

```text
Codex Manifest + Marketplace
Claude Code Manifest + Marketplace
WorkBuddy expert-manager 创建流 + 专家/专家团部署实例
                      │
                      ▼
          共享 Skills / Scripts / Schemas / Assets
                      │
                      ▼
                  品牌工作区
```

### 3.4 CodeBuddy 退出需分两步

产品目标立即停止使用 CodeBuddy CLI 和 CodeBuddy Code 验收。

但不得在确认 WorkBuddy `expert-manager` 的真实生成与注册机制前，盲目删除所有可能被 WorkBuddy 兼容层使用的文件。正确顺序是：

```text
先完成 WorkBuddy 真实创建与运行
→ 确认现有 .codebuddy-plugin 是否完全无依赖
→ 再删除或迁移 CodeBuddy 遗留适配
```

历史 Record 中的 CodeBuddy 命令和结果保留为历史事实，但不再代表当前产品支持矩阵。

## 4. 当前基线与阻塞

### 4.1 Git 基线

起草时远端基线为：

```text
main @ 0af4a16e33a998d14b45d499848664d5f42087ce
```

开工后必须实际执行：

```bash
git branch --show-current
git rev-parse HEAD
git status --short
git log -1 --oneline
```

若 HEAD 已变化，以实际值为准，并写入新 Record。

### 4.2 SDD 状态冲突

当前里程碑 0—1 的 PRD、Architecture、Spec 0001、Spec 0002 和 Plan 仍为 `proposed`，但 Task 与 Record 已标记为 `verified`。

Agent 不得自行批准。应记录冲突、修订受本次 WorkBuddy 决策影响的工件，并在最终回报中列出需人类批准的文档。

### 4.3 里程碑 1 工程缺口

至少处理：

1. 并发初始化可能返回未实际落盘的 `workspace_id`；
2. 不同品牌并发初始化可能造成跨文件混合；
3. `--workspace`、`--brand` 后缺值未稳定作为非法参数处理；
4. `validate-plugin.mjs` 未完整检查 Skill Frontmatter 和正文必需章节；
5. 缺少不合规 Manifest、Marketplace、Skill 的负向 Fixture；
6. README 的 Codex 安装命令和插件校验命令存在错误；
7. 旧验收未绑定当前固定 commit；
8. MyyShop 根目录尚未成为标准工作区。

## 5. 本次唯一目标

完成以下工作后停止：

```text
里程碑 1 代码与契约加固
+
WorkBuddy expert-manager 实际契约发现
+
WorkBuddy 单专家和专家团本地创建
+
共享 Skill 在 WorkBuddy 中安装/选择/运行
+
MyyShop 标准工作区迁移
+
Codex、Claude Code、WorkBuddy 固定基线验收
+
CodeBuddy 产品适配退出
```

本次不实现：

- `geo-query-portfolio`；
- `geo-knowledge-audit`；
- 站点、舆情、答案、竞品和云端能力；
- 自动批准、自动发布、CRM 写入；
- 未经授权读取或外发 MyyShop 内部 Evidence；
- 为了展示专家能力提前绑定不必要 MCP。

## 6. 开工前必读

1. `AGENTS.md`
2. `docs/workflow.md`
3. `docs/records/2026-08-20-plugin-initialization-acceptance.md`
4. 本 Handoff
5. `docs/specs/0001-plugin-package-contract.md`
6. `docs/specs/0002-workspace-contract.md`
7. `docs/architecture/2026-08-20-cross-host-plugin-architecture.md`
8. `docs/plans/2026-08-20-plugin-initialization-plan.md`
9. `docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md`
10. `workspaces/myyshop/knowledge/README.md`
11. 中国区 WorkBuddy 官方文档：专家、技能、连接器、新建任务栏、插件和更新日志。

必须回到当前源码和 WorkBuddy v5.3.14 实际界面核验，不能用本文代替运行事实。

## 7. 应建立或修订的 canonical 工件

### 7.1 新建

```text
docs/requirements/2026-08-20-workbuddy-expert-manager-adapter.md
docs/prd/2026-08-20-workbuddy-expert-manager-adapter.md
docs/architecture/2026-08-20-workbuddy-expert-manager-architecture.md
docs/specs/0003-workbuddy-expert-manager-contract.md
docs/plans/2026-08-20-milestone-1-hardening-workbuddy-plan.md
docs/tasks/2026-08-20-milestone-1-hardening-workbuddy.md
docs/records/2026-08-20-workbuddy-expert-manager-discovery.md
docs/records/2026-08-20-milestone-1-hardening-workbuddy-acceptance.md
```

### 7.2 修订

至少核对：

```text
AGENTS.md
README.md
CHANGELOG.md
docs/README.md
docs/architecture/2026-08-20-cross-host-plugin-architecture.md
docs/specs/0001-plugin-package-contract.md
docs/specs/0002-workspace-contract.md
docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md
docs/plans/2026-08-20-plugin-initialization-plan.md
docs/tasks/2026-08-20-plugin-initialization.md
docs/records/2026-08-20-plugin-initialization-acceptance.md
docs/handoff/2026-08-20-query-and-knowledge-milestone-handoff.md
plugins/geo-expert/README.md
plugins/geo-expert/CHANGELOG.md
```

历史 Record 不改写原始命令和结果，只追加产品目标变化、弃用说明和新 Record 链接。

## 8. 仓库目标结构

建议新增：

```text
plugins/geo-expert/workbuddy/
├── README.md
├── expert-source/
│   └── geo-milestone-1-hardening-expert.md
├── team-source/
│   └── geo-milestone-1-hardening-team.md
├── bindings/
│   ├── milestone-1-local.yaml
│   └── milestone-1-acceptance.yaml
├── prompts/
│   ├── create-or-update-expert.md
│   ├── create-or-update-team.md
│   └── run-acceptance.md
└── acceptance/
    └── README.md
```

其中：

- `expert-source/`：专家的人设、方法论、边界、输出契约；
- `team-source/`：团长、成员、分工、并行和汇总规则；
- `bindings/`：应选择的 Skill、可选 MCP、工作空间和权限策略；
- `prompts/`：交给 `expert-manager` 和验收任务的确定性输入；
- `acceptance/`：需要采集的证据说明，不存账户凭据。

不得在源定义中复制 `geo-workspace-init/SKILL.md` 的业务步骤，只能引用它。

## 9. Spec 0003 最低契约

Spec 0003 至少定义以下对象。

### 9.1 Expert Source

```yaml
schema_version: 1.0.0
kind: workbuddy_expert_source
id: geo-milestone-1-hardening-expert
display_name: GEO 里程碑 1 加固工程师
version: 0.1.0
objective: 收口里程碑 1，不进入 Query 与知识实现
role: 企业品牌 GEO 插件与工作区架构工程师
methodology_refs:
  - docs/workflow.md
  - docs/specs/0001-plugin-package-contract.md
  - docs/specs/0002-workspace-contract.md
required_skills:
  - geo-workspace-init
optional_connectors: []
workspace_policy: task_selected_explicitly
permission_policy: default
output_contract:
  - update_status
  - write_run_record
  - write_acceptance_record
stop_conditions:
  - approval_required
  - unauthorized_data
  - git_write_not_authorized
```

### 9.2 Team Source

至少定义：

- 团长 ID；
- 成员 ID 和职责；
- 哪些任务可并行；
- 哪些文件只能由团长最终写入；
- 成员失败、拒绝、超时如何披露；
- 最终交付结构；
- Skill、MCP、工作空间和权限策略。

### 9.3 Binding Profile

绑定必须区分：

```text
创建阶段绑定
运行阶段绑定
验收阶段绑定
真实 MyyShop 绑定
```

不得提交用户机器绝对路径、账户 ID、Session ID、Token、Cookie 或 MCP 密钥。

## 10. expert-manager 契约发现任务

这是 WorkBuddy 适配的第一项实际任务，不能跳过。

在中国区 WorkBuddy v5.3.14 中创建一个脱敏测试专家，记录：

1. `expert-manager` 的实际版本或来源标识；
2. 创建专家和创建专家团的提示交互；
3. 它生成或修改的本地路径和文件；
4. 专家 ID、显示名称和版本字段；
5. 创建、校验、注册和更新的实际行为；
6. 重复创建是更新、报冲突还是生成重复专家；
7. 是否支持导出、打包、导入或分享；
8. Skill 是创建时固化，还是运行任务时附加；
9. MCP 连接器是创建时固化，还是运行任务时附加；
10. 工作空间是否只属于任务级上下文；
11. 专家团如何选择已有专家、创建新成员和指定团长；
12. 生成物中是否包含账户、Session、绝对路径或其他不可提交字段。

将实际结果写入：

```text
docs/records/2026-08-20-workbuddy-expert-manager-discovery.md
```

若真实行为与 Spec 0003 草案冲突，停止适配，先修订 Spec 并请求人类批准。

## 11. WorkBuddy 创建与运行流程

### 11.1 创建单专家

1. 打开“新建任务”；
2. 选择 `geo-cowork` 仓库作为工作空间；
3. 使用默认权限；
4. 在输入框选择 `expert-manager`；
5. 提交 `prompts/create-or-update-expert.md`；
6. 要求 `expert-manager` 读取 `expert-source/` 和 `bindings/`；
7. 创建前输出计划和拟写入位置；
8. 创建、校验并注册；
9. 在“专家·技能·连接器 → 我的专家”确认专家存在；
10. 记录专家 ID、版本、创建结果和截图。

### 11.2 创建专家团

1. 新建独立任务并选择 `expert-manager`；
2. 提交 `prompts/create-or-update-team.md`；
3. 明确团长、成员、职责和协作规则；
4. 优先复用本次已创建并验收的本地专家；
5. 创建或更新专家团；
6. 在“我的专家”确认团长和成员；
7. 记录专家团 ID、成员映射、版本和截图。

### 11.3 运行单专家

1. 新建任务；
2. 通过 `+ → 专家` 选择本地专家；
3. 通过 `+ → 技能` 选择 `geo-workspace-init`；
4. 里程碑 1 不选择 MCP 连接器；
5. 选择脱敏临时工作空间；
6. 使用默认权限；
7. 提交验收任务；
8. 用独立脚本复核工作区结果。

### 11.4 运行专家团

1. 新建任务并选择本地专家团；
2. 选择所需 Skill；
3. 不选择非必要 MCP；
4. 选择脱敏验收工作空间；
5. 使用默认权限；
6. 提交一个必须拆解的复合任务；
7. 检查团长是否分工、成员是否执行、失败是否披露、最终结果是否统一；
8. 专家团只汇总事实，不能把成员陈述直接当作已验证结果。

## 12. 里程碑 1 专家定义

### 12.1 单专家

建议名称：`GEO 里程碑 1 加固工程师`

职责：

- 修订里程碑 1 Requirement、PRD、Spec、Plan、Task；
- 修复工作区并发、参数和校验器缺陷；
- 验证共享 Skill；
- 执行 MyyShop 安全迁移；
- 写 Record 和下一 Handoff；
- 不进入 Query、Knowledge、Site 等后续阶段。

### 12.2 专家团

建议名称：`GEO 里程碑 1 加固验收团`

| 角色 | 职责 |
| --- | --- |
| GEO 加固交付团长 | 拆解任务、控制范围、串行化共享文件修改、最终验收 |
| 工作区契约工程师 | 并发、幂等、参数、迁移与哈希保护 |
| 插件与 Skill 契约审查员 | Codex/Claude Manifest、Skill 契约和负向 Fixture |
| WorkBuddy 集成验收员 | expert-manager、专家/专家团、Skill/连接器/工作空间/权限绑定 |
| 数据边界审查员 | MyyShop 数据、MCP、外发和日志脱敏检查 |

你提供的现有“品牌 GEO 可见度诊断师”属于业务诊断角色，不作为里程碑 1 工程加固默认成员。进入里程碑 2 后，可在完成定义和数据边界审查后纳入 Query/Knowledge 专家团。

## 13. Skill、MCP、工作空间和权限策略

### 13.1 Skill

WorkBuddy 官方支持导入本地 Skill 包，也支持在任务中选择已安装 Skill。

本次应先实测：

```text
plugins/geo-expert/skills/geo-workspace-init/
```

能否作为本地 Skill 直接安装和选择。

- 若直接兼容：继续共享同一 `SKILL.md`；
- 若需要 WorkBuddy 包装层：只建立薄适配，不复制业务规则；
- 若无法安全复用：停止并记录宿主契约冲突。

### 13.2 MCP 连接器

里程碑 1 的 Expert Source 和 Team Source 默认：

```yaml
optional_connectors: []
```

只有具体任务确实需要外部系统，且获得人类授权时，才可在任务中选择连接器。连接器必须独立授权，不得把凭据写入仓库、专家源定义或运行记录。

### 13.3 工作空间

工作空间必须在每个任务中显式选择：

- 创建专家：选择 `geo-cowork` 仓库；
- 合成验收：选择临时脱敏目录；
- 代码修复：选择仓库工作树；
- MyyShop 迁移：只在完成哈希快照和明确授权后选择 `workspaces/myyshop`。

专家定义中只写定位规则，不写用户机器绝对路径。

### 13.4 权限

本次全部验收使用默认权限。

涉及以下动作必须停下来请求确认：

- 工作空间外写入；
- 删除或覆盖文件；
- 执行 Git 写操作；
- 安装外部依赖；
- 启用或调用 MCP；
- 读取 MyyShop 内部 Evidence；
- 写入 WorkBuddy 未公开路径。

## 14. CodeBuddy 遗留迁移

完成 WorkBuddy 真实验收后，执行：

1. 停止文档中使用 `CodeBuddy/WorkBuddy` 合并表述；
2. 删除 CodeBuddy CLI 命令和当前验收门；
3. 检查 `.codebuddy-plugin/` 是否被 WorkBuddy expert-manager 或 Skill 兼容层实际依赖；
4. 若无依赖，删除：

```text
.codebuddy-plugin/marketplace.json
plugins/geo-expert/.codebuddy-plugin/plugin.json
```

5. 若 WorkBuddy 仍使用其中某类兼容文件，不得沿用“CodeBuddy 宿主”语义，应按实际用途重新命名和建档；
6. 更新 `validate-plugin.mjs`：校验 Codex、Claude 和 WorkBuddy Source Contract，而不是强制三个 Manifest；
7. 使用以下命令检查遗留：

```bash
rg -n "CodeBuddy|codebuddy|\\.codebuddy|三 Manifest|三 Marketplace|CodeBuddy/WorkBuddy" .
```

历史 Record 和迁移说明允许保留旧词，当前产品文档和验收不得继续将 CodeBuddy 列为目标宿主。

## 15. 代码加固要求

### 15.1 工作区并发一致性

先修 Spec，再修实现。至少验证：

- 多进程并发初始化同一空目录；
- 所有成功调用返回实际落盘的同一 `workspace_id`；
- README、STATUS、workspace.json 不跨调用混合；
- 同品牌并发幂等；
- 不同品牌并发明确冲突或按 Spec 固定规则处理；
- 不截断、不覆盖用户文件。

### 15.2 参数边界

以下场景必须有稳定退出码和 JSON 错误：

```text
--workspace 后无值
--brand 后无值
未知参数
不存在或不可写工作区
损坏的 workspace.json
```

### 15.3 Skill 与适配契约校验

校验器至少检查：

- Codex、Claude Manifest 名称和版本一致；
- 不存在禁止字段；
- Skill Frontmatter 只包含允许字段；
- Skill 正文包含必需章节；
- WorkBuddy Expert Source 和 Team Source 满足 Spec 0003；
- Source 引用的 Skill 存在；
- 团长和成员 ID 唯一；
- 不包含账户、Session、绝对用户路径、密钥或内部 Evidence；
- 错误 Fixture 会被拒绝。

## 16. MyyShop 工作区迁移

按以下顺序执行：

```text
迁移前 knowledge 文件清单、大小和 SHA-256
→ 初始化 MyyShop 工作区根文件和缺失目录
→ workspace-validate
→ 迁移后 knowledge 文件清单、大小和 SHA-256
→ 差异必须为空
```

只允许新增根文件和缺失目录。不得批量改写、改名、格式化或迁移 120 条知识条目。

真实 MyyShop 内容不得作为 WorkBuddy 专家创建的示例材料，也不得用于跨宿主合成 Fixture。

## 17. 测试与真实验收

### 17.1 自动化测试

至少增加：

- 多进程并发初始化；
- 不同品牌并发冲突；
- 缺失参数值；
- Skill Frontmatter 额外字段负向测试；
- Skill 缺章节负向测试；
- WorkBuddy Expert Source 合法/非法 Fixture；
- WorkBuddy Team Source 合法/非法 Fixture；
- MyyShop 迁移前后知识哈希不变检查。

### 17.2 Codex

- Marketplace 添加；
- 使用完整插件标识安装；
- 从安装缓存真实触发 `geo-workspace-init`；
- 独立运行工作区校验。

### 17.3 Claude Code

- `plugin validate`；
- `--plugin-dir` 真实触发 Skill；
- 独立运行工作区校验。

### 17.4 WorkBuddy 单专家

必须记录：

- WorkBuddy 版本；
- `expert-manager` 选择状态；
- 创建提示；
- 专家 ID、显示名称和版本；
- “我的专家”可见截图；
- 运行任务中已选择的专家、Skill、连接器、工作空间和权限；
- 实际产物；
- 独立校验结果；
- 失败和重试。

### 17.5 WorkBuddy 专家团

必须验证：

- 团长和成员映射正确；
- 团长实际拆解任务；
- 成员实际执行；
- 成员失败、拒绝或超时没有被隐藏；
- 最终结果由团长统一整合；
- 专家团没有无意义重复读取或多人同时修改同一文件；
- 积分消耗与单专家相比被记录，但不将消耗大小作为功能成功标准。

### 17.6 一致性对象

最终一致性矩阵为：

```text
Codex 插件
Claude Code 插件
WorkBuddy 单专家
WorkBuddy 专家团
```

比较：

- 工作区文件集合；
- workspace.json Schema；
- 已有文件保护；
- 错误和停止条件；
- 结果语义；
- WorkBuddy 任务级绑定记录。

不要求 UI、对话措辞或内部编排完全一致。

## 18. 执行顺序

1. 核验 Git、HEAD、工作树和当前 WorkBuddy 版本；
2. 读取必读文档；
3. 建立 Requirement、PRD、Architecture、Spec 0003、Plan 和 Task；
4. 用脱敏测试专家执行 `expert-manager` 契约发现；
5. 冻结 Expert Source、Team Source 和 Binding Profile；
6. 实测 `geo-workspace-init` Skill 在 WorkBuddy 的安装和选择；
7. 创建并验收单专家；
8. 创建并验收专家团；
9. 修复里程碑 1 并发、参数和校验器问题；
10. 完成本地自动化测试；
11. 安全迁移 MyyShop 工作区；
12. 固定 commit 基线执行 Codex、Claude、WorkBuddy 全量验收；
13. 确认 WorkBuddy 无依赖后退出 CodeBuddy 遗留适配；
14. 重跑全量检查；
15. 写 Discovery Record、Acceptance Record 和下一 Handoff；
16. 停止，等待人类阶段门决定。

## 19. 完成定义

全部满足后，里程碑 1 才可在新产品范围内标记为 `verified`：

- [ ] WorkBuddy Requirement、PRD、Architecture、Spec、Plan、Task 已建立；
- [ ] Agent 未自行批准上游工件；
- [ ] `expert-manager` 的实际创建、更新、注册和本地生成行为已有 Record；
- [ ] 单专家通过 `expert-manager` 创建并在“我的专家”可见；
- [ ] 专家团通过 `expert-manager` 创建，团长与成员映射正确；
- [ ] WorkBuddy 任务可分别选择专家、Skill、连接器、工作空间和权限；
- [ ] `geo-workspace-init` 在 WorkBuddy 中可安装/选择并真实运行；
- [ ] 里程碑 1 WorkBuddy 验收没有启用非必要 MCP；
- [ ] 工作区并发、参数和校验器缺陷已修复；
- [ ] 新增并发与负向测试，`node --test` 全绿；
- [ ] Codex、Claude Code、WorkBuddy 均绑定同一固定源码基线完成真实验收；
- [ ] CodeBuddy 不再属于产品支持矩阵；
- [ ] MyyShop 已成为标准工作区，120 条知识文件字节级零改动；
- [ ] Acceptance Record 包含精确分支、HEAD、工作树、WorkBuddy 版本、选择项、截图和实际命令；
- [ ] 里程碑 2 Handoff 已按新宿主模型修订，但仍等待人类批准。

## 20. 停止条件

遇到以下情况立即停止受影响实现并记录：

- `expert-manager` 的真实行为与拟定 Spec 冲突；
- 需要猜测或逆向 WorkBuddy 未公开 Schema；
- 需要手工写 WorkBuddy 内部数据库、缓存或账户目录；
- WorkBuddy 无法安装或选择共享 `geo-workspace-init` Skill；
- WorkBuddy 创建专家时强制复制 GEO 业务规则；
- 需要启用未获授权的 MCP；
- 需要读取、上传或外发 MyyShop 内部 Evidence；
- 需要自动批准、发布、CRM 写入或云端接入；
- 需要修改已验证行为但没有更新 Spec；
- 需要 commit、push 或 PR 但没有当次明确授权；
- 三个目标宿主无法共享核心 Skill 语义；
- MyyShop 迁移改变任何既有知识文件字节。

## 21. 下一 Session 开场指令

```text
你正在继续 sujingjun/geo-cowork 的里程碑 1 加固与中国区 WorkBuddy 专家体系适配。

先核验分支、HEAD、git status 和 WorkBuddy 版本，再读 AGENTS.md、docs/workflow.md、
里程碑 0—1 Acceptance Record、本 Handoff、Spec 0001/0002 和 MyyShop 知识库 README。

本次 WorkBuddy 适配必须使用新建任务中的 expert-manager 入口。
先用脱敏测试专家发现 expert-manager 的真实创建、校验、注册、更新和本地生成契约，
写 Discovery Record；不要自行发明 WorkBuddy 原生 Expert/Team Schema，也不要写入未公开内部目录。

随后建立 WorkBuddy Requirement/PRD/Architecture/Spec 0003/Plan/Task；
冻结专家源定义、专家团源定义和任务级 Binding Profile；
实测共享 geo-workspace-init Skill 在 WorkBuddy 中的安装、选择和运行；
通过 expert-manager 创建单专家和专家团，并在新任务中分别选择专家、Skill、连接器、工作空间和默认权限完成验收。

里程碑 1 默认不启用 MCP。修复工作区并发、参数和 Skill 校验器缺陷；
安全迁移 MyyShop 工作区并证明 120 条知识文件哈希不变；
在固定 commit 上完成 Codex、Claude Code、WorkBuddy 单专家和专家团的真实验收。

确认 WorkBuddy 路径可用且无依赖后，再退出 CodeBuddy 当前适配。
未经明确授权不 commit、不 push、不创建 PR；完成后写 Acceptance Record 和下一 Handoff并停止，
不要进入 Query 或知识实现。
```

## 22. 官方参考

- 中国区 WorkBuddy：专家中心  
  `https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Expert-Center`
- 中国区 WorkBuddy：技能  
  `https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market`
- 中国区 WorkBuddy：连接器  
  `https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Connector`
- 中国区 WorkBuddy：新建任务栏  
  `https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Task-Bar`
- 中国区 WorkBuddy：插件  
  `https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Plug-In`
- 中国区 WorkBuddy：更新日志  
  `https://www.workbuddy.cn/docs/workbuddy/Changelog`
