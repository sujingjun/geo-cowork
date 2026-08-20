---
name: geo-workspace-init
description: 幂等初始化并校验本地 GEO 品牌工作区，生成 README、STATUS、稳定 workspace.json 身份和标准目录结构。用于新品牌工作区创建、已有工作区结构检查与修复确认。
---

# geo-workspace-init

## 触发场景

- 为一个品牌创建新的本地 GEO 工作区；
- 检查已有工作区是否符合工作区契约（Spec 0002）；
- 在 GEO 流程开工前确认工作区结构完整。

## 输入

| 输入 | 说明 |
| --- | --- |
| `--workspace <path>` | 目标工作区路径；缺省为当前目录（init）或从当前目录向上查找 `workspace.json`（validate） |
| `--brand <name>` | 品牌名；缺省为工作区目录名 |
| `--dry-run` | 只打印将创建的内容，不写文件 |

## 开工前必读

1. 工作区目标的 `README.md`、`STATUS.md`、`workspace.json`（若已存在）；
2. 仓级规则（仓库 `AGENTS.md`，若当前在 geo-cowork 仓库内）；
3. 已有工作区内容一律视为用户资产，不得删除或覆盖。

## 步骤

1. 确定工作区路径：优先使用用户给定的 `--workspace`；否则使用当前项目目录。禁止通过 `../../workspaces` 之类的相对路径猜测开发仓库结构。
2. 执行初始化（插件根内脚本，路径以本插件实际安装位置为准）：

   ```bash
   node <plugin-root>/scripts/workspace-init.mjs --workspace <path> --brand <BrandName>
   ```

3. 执行校验：

   ```bash
   node <plugin-root>/scripts/workspace-validate.mjs --workspace <path>
   ```

4. 向用户汇报：创建了哪些文件、保留了哪些已有文件、`workspace_id`、校验结论。

## 输出

- init 输出 JSON：`{ workspace, created, kept, workspace_id }`；
- validate 输出 JSON：`{ workspace, ok, missing, errors }`；
- 工作区文件：`README.md`、`STATUS.md`、`workspace.json` 及 queries、knowledge、site、reputation、answers、competitors、strategy、execution、runs、cycles 目录。

## 可做事项

- 创建缺失的必需文件与目录；
- 保留并汇报已有文件（计入 `kept`）；
- 对结构不完整的工作区报告缺失项（`missing`）；
- 建议用户下一步（补充品牌信息、进入 GEO 里程碑）。

## 禁止事项

- 不覆盖、不删除、不移动已有文件；
- 不修改已存在 `workspace.json` 的 `workspace_id`、`created_at`；
- 不把任何业务文件写入插件安装目录或宿主插件缓存；
- 不执行网络请求、Git 写操作或子进程写操作；
- 不把初始化完成表述为"知识已批准"或"GEO 流程已完成"。

## 失败与停止条件

- `workspace.json` 已存在但无法解析或缺少必需字段（退出码 3）：停止，请用户人工处理身份文件，不得擅自重建；
- 参数非法或找不到工作区（退出码 2）：停止并向用户说明用法；
- validate 报告缺失项：只报告，是否修复由用户决定（可再次运行 init 补齐缺失文件，已有文件仍不覆盖）。

## 验收方式

- init 退出码 0，且重复执行后 `created` 为空、全部进入 `kept`，已有文件字节级不变；
- validate 对完整工作区退出码 0、`ok: true`；
- 缺失场景下 validate 退出码 1 并列出 `missing`。

## 示例

```bash
# 新工作区
node <plugin-root>/scripts/workspace-init.mjs --workspace ./workspaces/acme --brand Acme

# 校验（也可在工作区内省略 --workspace）
node <plugin-root>/scripts/workspace-validate.mjs --workspace ./workspaces/acme

# 预演，不写文件
node <plugin-root>/scripts/workspace-init.mjs --workspace ./workspaces/acme --dry-run
```
