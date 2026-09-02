## Why

当前系统已经具备 Amazon 店铺授权、商品同步与站点生成链路，但数据库与领域模型已经为 `shopify` 预留平台枚举，产品能力却尚未闭环。这导致 Shopify 商家无法复用现有 AI 对话与 GEO 建站能力，也让多平台电商接入路线停留在半成品状态。

本变更旨在补齐 Shopify 平台接入，使用户可以授权 Shopify 店铺、拉取商品，并将 Shopify 商品用于生成站外商品展示站点。这样可以把现有 AI 驱动建站能力从 Amazon 单平台扩展为多平台能力，为后续平台扩展和统一商品模型打下基础。

## What Changes

- 新增 Shopify 店铺授权流程，包括配置、发起授权、回调换取 token 与店铺落库。
- 新增 Shopify 商品同步链路，将商品映射到现有 `products` 通用表结构。
- 扩展站点生成与 AI 工具链，使 Shopify 商品可参与站外站点生成。
- 调整前端店铺管理与站点入口，使用户能够识别并操作 Shopify 店铺。
- 补充多平台约束、验收路径与回归验证要求。

## Affected Areas

- Known: `geo-site-building-web` 前端店铺管理、Nitro API、OAuth 回调、商品同步、AI tools、站点生成。
- Unresolved: Shopify 首期是否仅支持单店授权；是否允许与 Amazon 店铺并存后由用户显式选择默认店铺。

## Capabilities

### New Capabilities

- Shopify 店铺 OAuth 授权
- Shopify 商品同步与标准化映射
- Shopify 商品驱动的站外站点生成

### Modified Capabilities

- 多平台店铺管理与授权入口
- AI 取商品与生成站点的选店逻辑

## Impact

- Workspace planning: 需要把单平台假设改为多平台流程，并明确授权、同步、生成三段链路的共享约束。
- Linked repos or folders: 当前预计仅影响本仓库的 `app/`、`server/`、`shared/`、`docs/`。
- User-facing behavior: 用户可连接 Shopify 店铺、同步 Shopify 商品，并基于 Shopify 商品生成 Shopify 站外展示站点。

## Non-goals

- 本期不包含 Shopify 订单、库存回写、价格回写等 ERP/OMS 能力。
- 本期不包含 Shopify 主题嵌入、App Bridge 嵌入式后台或在线支付结账链路。
- 本期不要求重构全部 Amazon 代码为完整平台插件架构，只要求抽出完成 Shopify 接入所需的最小共性层。
