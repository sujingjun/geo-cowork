## 1. Workspace Planning

- [x] 1.1 确认 Shopify 首期范围：单店/多店、是否允许与 Amazon 并存、用户默认店铺选择规则。
- [x] 1.2 确认 Shopify OAuth 所需配置项、scope、回调 URL 与开发店铺验收账号。
- [x] 1.3 对齐共享数据映射：`stores`、`products`、`sites` 字段如何承载 Shopify 数据且不新增平行表。

## 2. Server Authorization Flow

- [x] 2.1 在 `server/utils/` 规划 Shopify OAuth 工具模块边界，拆分发起授权、回调校验、token 交换与店铺信息读取职责。
- [x] 2.2 在 `server/api/stores` 与 `server/routes/auth` 规划平台分流入口，避免继续把 Amazon 逻辑写死为唯一实现。
- [x] 2.3 明确 Shopify 授权失败、state 校验失败、重复授权与未登录场景的 4xx 行为。

## 3. Product Sync

- [x] 3.1 规划 Shopify 商品读取接口、分页/limit 策略与首期同步范围。
- [x] 3.2 规划 Shopify 商品到共享 `products` 模型的字段映射和 upsert 主键策略。
- [x] 3.3 规划平台感知的商品 URL、变体、标签与原始数据保存规则。

## 4. AI And Site Generation

- [x] 4.1 规划 `get_products` 和 `generate_site` 在多平台店铺下的输入上下文与归属校验。
- [x] 4.2 明确站点生成时如何避免 Amazon 专属字段假设，并保证 Shopify 商品可直接生成预览站点。
- [x] 4.3 规划用户在 AI 对话或站点入口中识别当前数据来源店铺的平台提示。

## 5. Frontend And UX

- [x] 5.1 规划 `useStores()` 和站点入口页的多平台展示方式，包括平台标识、默认店铺和授权提示。
- [x] 5.2 规划 Shopify 授权成功后的回跳、同步入口、空状态与错误提示。
- [x] 5.3 规划多平台并存时的交互文案，避免“连接亚马逊店铺”这类单平台措辞残留。

## 6. Verification

- [x] 6.1 为 Shopify OAuth、回调、商品同步、站点生成分别定义最小可执行验收路径。
- [x] 6.2 规划单测/集成测试覆盖：授权状态校验、字段映射、平台分流、权限拒绝与生成成功路径。
- [x] 6.3 记录需要补充的文档：环境变量、回调配置、手工验收步骤与故障排查。
