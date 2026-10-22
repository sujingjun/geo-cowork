# Workspace 知识库 Docs 关联与改造计划

- 状态：approved（用户明确要求实施本计划）。
- 创建/更新：2026-10-22。
- 来源：本次用户确认的 Workspace 知识库 Docs 关联与改造计划；[工作流](../workflow.md)。
- 适用范围：共用本地 Docs 应用及配套测试、文档；MyyShop 只读验收。
- 关联：[任务](../tasks/2026-10-22-workspace-knowledge-reader.md)、[记录](../records/2026-10-22-workspace-knowledge-reader-record.md)、[应用说明](../../workspaces/knowledge-preveiw-docs/README.md)。

## 目标和确认范围

沿用 Nuxt 4、Nuxt Content 3、Nuxt UI 4 及 `workspaces/knowledge-preveiw-docs` 目录。一次启动绑定一个 workspace，默认英文主版，支持同一条目的中文对照。展示知识、治理、模板及正文引用的来源记录和 TXT/JSON/CSV 材料。

不包含在线编辑、审批、多工作区页面切换、MCP、llms 输出、外部发布、模型调用或 GEO 工作台。知识文件是唯一内容源；读取不改变任何业务对象、证据、批准或索引。

## 行为与接口

- 根命令 `dev:knowledge`、`build:knowledge` 接收必填 `--workspace`，相对调用目录解析，校验身份和知识目录。
- Nuxt Content 从外部 `cwd` 读取允许的 Markdown。`/` 转 `/en`；中文位于 `/zh-CN`；README 和 _index 为所在层级首页，其他文件保留分类路径并去除扩展名。
- 读取投影保留 sourcePath、locale、recordId、状态、版本、负责人、复核日期及对照关联；业务 ID 不占用 Content id。中文不新增业务 Frontmatter。
- 对照关联按路径和现有来源字段判断；版本、SHA-256、ID、源路径不匹配提示过期，缺失禁用切换，不生成翻译。
- Markdown 链接、引用式链接和锚点转为站内目标；外部网址保留。超出范围的流程文档保留原路径和范围提示。
- `GET /api/knowledge/file?path=…` 返回已登记文件原文，限制实际路径、符号链接及文件类型；无写接口，不执行快照脚本。
- 搜索限当前语言的知识标题、正文及 KB ID；来源附件不混入。页头状态不将 draft 或来源 active 解读为业务批准。
- 开发变更重建跨文件关联与索引；缓存按 workspace 和版本隔离。生产构建保存一致快照，更新需重新构建。

## 顺序与验收

1. 启动配置、移除模板示例及 AI 入口。
2. 内容、路径、元数据、对照与引用适配，确定性临时工作区测试。
3. 三栏文档布局、当前语言搜索、原文复制、移动端目录与异常页。
4. 更新联动、构建快照、MyyShop 只读验收及文档收口。

检查覆盖 120 个逻辑条目及两版、完整引用链、过期和缺失对照、增删改刷新、工作区隔离、路径越界、快照一致性、桌面和窄屏交互。执行适配测试、lint、typecheck、build 和文档链接检查；只记录实际结果。测试使用自动清理的临时目录，MyyShop 读取前后校验业务文件 hash。
