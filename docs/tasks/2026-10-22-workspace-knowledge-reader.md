# Workspace 知识库阅读器任务

- 状态：verified（本地阅读器及关联验证完成）。
- 创建/更新：2026-10-22。
- 来源/范围：[已批准计划](../plans/2026-10-22-workspace-knowledge-reader-plan.md)；本地阅读器、测试与文档。
- 执行依据：本次用户明确要求实施计划，不另建立重复 PRD/Spec；计划中的行为和接口是验收依据。
- 验证记录：[Record](../records/2026-10-22-workspace-knowledge-reader-record.md)。

| 编号 | 目标与成功标准 | 前置依赖 | 目标文件/检查 | 状态 |
| --- | --- | --- | --- | --- |
| READER-1 | 显式绑定工作区，源目录和缓存分离，清理模板及 AI 入口 | 已批准计划、原模板 | 应用配置、启动脚本、依赖；非法启动检查 | verified |
| READER-2 | 知识、对照和引用投影正确，只允许读取已登记文件 | READER-1 | 应用 lib、Content 配置、只读 API；`npm run test:knowledge` | verified |
| READER-3 | 目录、正文、搜索、语言切换、复制、证据查看及窄屏可操作 | READER-2 | 应用 app；lint、typecheck、真实浏览器 | verified |
| READER-4 | 增删改与过期刷新、构建快照、工作区隔离和 MyyShop 不变校验 | READER-3 | 开发模块、构建、文档；build、临时工作区运行及 hash 核对 | verified |

范围外：外部发布、在线写入、审批、完整 GEO 流程、commit/push。主要风险为链接转换、跨文件派生状态及缓存一致性。验证结果及范围以 Record 为准；应用 README、仓库导航与 Wiki 已同步。
