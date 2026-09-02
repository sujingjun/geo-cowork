## Context

当前仓库已实现 Amazon OAuth、商品同步、AI 对话取商品与站点生成，但多处代码仍默认“用户只有一个 Amazon 店铺”。数据库 schema 已允许 `stores.platform = 'shopify'` 与更通用的商品字段，因此 Shopify 接入的关键不在表结构补零，而在于把授权、同步、选店和生成链路从 Amazon 特化改成可扩展的多平台流程。

## Goals / Non-Goals

**Goals:**
- 让 Shopify 店铺能够完成授权、落库、商品同步与站点生成闭环。
- 复用现有 `stores`、`products`、`sites` 数据模型，避免新增平行表。
- 把前端和 AI 工具中的单平台假设收敛为“按店铺平台分流”。

**Non-Goals:**
- Creating repo-local implementation artifacts before an affected area is selected.
- 在本期实现订单同步、库存回写、结账托管或 Shopify 嵌入式后台。

## Decisions

### Decision: 继续使用统一 stores/products/sites 模型承载 Shopify 数据

Shopify 接入沿用现有 `stores` 与 `products` 通用结构，通过 `platform` 区分来源，并将 Shopify 字段映射到 `externalProductId`、`platformHandle`、`productUrl`、`vendor`、`productType`、`tags`、`variants`、`rawData` 等列。

Alternative considered: 为 Shopify 新增独立表。未选用，因为会复制现有建站与 AI 工具链逻辑，增加多平台聚合成本。

### Decision: 授权与同步采用平台分流、对外接口尽量保持统一

前端继续从店铺列表和同步入口发起操作，但服务端按 `platform` 分流到 Amazon 或 Shopify 实现。这样可以保留统一的 UI 操作心智，同时避免把 Shopify 流程强行塞进 Amazon 工具模块。

Alternative considered: 完全独立的 Shopify 页面与 API。未选用，因为会放大重复实现，并让多平台体验割裂。

### Decision: 站点生成仍使用现有 generate_site 能力，但必须校验商品归属店铺

生成站点时应允许 Shopify 商品参与，但要在服务端验证所选商品归属于当前用户的 Shopify 店铺，并在 AI 取商品时提供平台/店铺上下文，避免跨店铺混选。

Alternative considered: 先只做同步，不接入站点生成。未选用，因为用户请求的核心价值是“授权 + 拉商品 + 生成 Shopify 站外站点”的完整链路。

## Risks / Trade-offs

- Shopify OAuth 与 token 生命周期细节不同于 Amazon -> 通过独立 server utils 封装并补充回调校验。
- 现有 `useStores()` 与页面逻辑默认“只要有店铺即可” -> 需要在 UI 中显式展示平台与默认操作对象，避免误操作。
- 现有同步代码直接调用 Amazon 实现 -> 需要抽出平台路由层，否则 Shopify 会继续复制粘贴。
- 生成站点默认商品 URL 偏 Amazon 语义 -> 需要统一 product URL 生成规则并在渲染层避免平台假设。

## Coordination Notes

- Affected areas: `server/api/stores*`、`server/routes/auth/*`、`server/utils/*`、`shared/utils/tools/*`、`app/composables/useStores.ts`、`app/pages/sites/index.vue`、相关文档与测试。
- Open handoffs: Shopify 应用配置、scope 清单、回调域名策略需要在实施前确定；测试环境需有可用开发店铺。
- Implementation entry criteria: 已确认 Shopify OAuth 配置项、商品读取 API 版本、首期支持的店铺并存策略，以及手工验收账号。

## Open Questions

- 首期是否允许一个用户同时连接 Amazon 与 Shopify，并在 AI 对话里选择数据来源？
- Shopify 商品同步是首期全量拉取，还是先支持 limit/分页下的受控同步？
- 站点生成后的商品跳转链接是否需要优先落到 Shopify 店铺产品页，还是允许自定义站外落地页？
