# Workspace 知识库阅读器

基于 Nuxt Docs Template 的本地只读应用。启动时选择一个业务 workspace，直接读取其知识与引用证据；不会更新业务文件。

## 环境与启动

需要 Node.js 22.18+、pnpm 12.14.0。安装应用依赖：

```bash
pnpm --dir workspaces/knowledge-preveiw-docs install --frozen-lockfile
```

在 geo-cowork 仓库根执行：

```bash
npm run dev:knowledge -- --workspace ./workspaces/myyshop
```

`--workspace` 必填，按调用目录解析，也接受绝对路径；目标必须含有效 `workspace.json` 和真实 `knowledge/` 目录。可追加 `--port 3107`。默认只监听 `127.0.0.1`，一次展示一个工作区。

## 内容与更新

- `/` 跳转 `/en`；英文源文件映射至 `/en/...`，中文对照映射至 `/zh-CN/...`。
- `README.md` 和 `_index.md` 映射为对应层级首页。业务 ID、状态和版本按原文展示；未知不推定为批准。
- 所有知识 Markdown 可阅读；来源只包含知识正文引用的 `evidence/sources/` Markdown，以及其引用的 TXT/JSON/CSV 快照。知识目录中被引用的 TXT/JSON/CSV 同样可查看。
- 中文采用原有对应路径及 Source file、Knowledge ID、Source version、Source SHA-256 校验；过期提示不改写原文件的历史同步记录。没有对照文件时禁用切换。
- 搜索覆盖当前语言的知识标题、正文和条目 ID，来源与附件不进入知识搜索。
- 开发模式下修改、新增、删除内容会重建内容及关联索引，浏览器自动刷新。首次编译及重建期间需等待本地服务就绪。
- `GET /api/knowledge/file?path=<workspace-relative-path>` 返回登记文件完整原文；拒绝未登记、越界、隐藏路径和符号链接。JSON/CSV/TXT 作为纯文本展示，HTML 快照不渲染。
- 跨出阅读范围的流程文件显示原路径及提示；不提供工作区任意文件访问、在线编辑或审批。

## 构建与本地检查

```bash
npm run build:knowledge -- --workspace ./workspaces/myyshop
NITRO_HOST=127.0.0.1 NITRO_PORT=3107 node workspaces/knowledge-preveiw-docs/.output/server/index.mjs
```

构建产物包含当次内容和引用文件的一致快照，不依赖原工作区继续存在。源内容更新后需重新构建。产物含内部知识，不代表允许公开发布。

```bash
npm run test:knowledge
# 先停止本应用开发服务；使用临时工作区、已安装 Chrome 和仓库 Playwright 依赖
npm run test:knowledge:runtime
pnpm --dir workspaces/knowledge-preveiw-docs lint
GEO_KNOWLEDGE_WORKSPACE="$PWD/workspaces/myyshop" pnpm --dir workspaces/knowledge-preveiw-docs typecheck
```

开发服务、类型生成和构建使用同一个应用构建目录，应顺序运行。缓存按工作区身份、实际目录、内容及投影版本隔离，位于应用 `.data/`，不写入业务工作区。

该目录是共用应用，不是品牌 workspace。业务对象、证据和批准以选定工作区为准。本应用不调用模型、OneGlanse、MCP 或飞书。

开发与验收见[实施计划](../../docs/plans/2026-10-22-workspace-knowledge-reader-plan.md)、[任务](../../docs/tasks/2026-10-22-workspace-knowledge-reader.md)、[记录](../../docs/records/2026-10-22-workspace-knowledge-reader-record.md)。

运行验收会重新构建应用产物；完成后请为实际工作区重新执行 `build:knowledge`。
