# Context Map

## Contexts

- [GEO Lifecycle](./CONTEXT.md) — 定义 GEO Cycle、真实知识、门禁、Observation、Retest、Review 与 v1 完成边界。
- [GEO Browser Extension](./plugins/geo-browser-extension/CONTEXT.md) — 定义 Browser Query Task、页面执行、Capture、Extraction 与结果交付边界。

## Relationships

- **GEO Lifecycle → GEO Browser Extension**：Cowork 创建 GEO Cycle、冻结 Query Set，并向 Browser Server 注册版本化 Cycle Query Input。
- **GEO Browser Extension → GEO Lifecycle**：Browser Product 持有 Browser Query Task、Query Capture、Extraction Result 与 Pending Query Result；Cowork 校验绑定和 checksum 后物化 M5 对象。
- **共同门禁**：登录状态不授予平台自动化权限；Citation Observation 只记录，不自动成为 Evidence、Claim Support 或 Cycle Blocker。
