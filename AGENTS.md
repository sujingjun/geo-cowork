# AGENTS.md — geo-cowork

## 仓库定位

本仓是geo SDD 协同工作的控制面仓库：维护统一工作流规范、文档体系与知识库导航。

- `docs/` 是本仓唯一 tracked 内容目录，文档导航入口见 [`docs/README.md`](docs/README.md)。
- `plugins/` 为本地项目检出目录（如 geo-expert），已被 `.gitignore` 排除；项目代码、实现事实与验证证据以各项目仓库为准，本仓不复制维护。

## 权威来源与冲突顺序

- 本仓 SDD 流程、文档分类、状态定义、交接规则与授权边界，以 [`docs/workflow.md`](docs/workflow.md) 为唯一细节来源。
- 发生冲突时的处理顺序见 `docs/workflow.md` 第 2 章「知识库-first + 源码验证」：当前用户明确指令优先，其后为本文件。

## Agent 工作约束

- 开始任何实现类任务前，先阅读本文件与 `docs/workflow.md`，并按其第 8 章明确目标、成功标准、范围外事项与授权限制。
- 知识库（`docs/wiki/`）只作导航与关系发现；给出结论或修改前必须回到实际工作区核验，规则见 `docs/workflow.md` 第 2 章。
- 状态使用、批准权限与授权边界（含 commit、push、创建 PR 需当次明确授权）见 `docs/workflow.md` 第 3、16 章。
- 文档命名、元数据与 Wiki Frontmatter 要求见 `docs/workflow.md` 第 2 章「建档、命名与迁移规则」。
