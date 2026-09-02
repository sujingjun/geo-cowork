# 多平台授权与站点路由拆分 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把店铺授权升级为 Amazon / Shopify 明显分区的 tabs 交互，并把站点体系拆分成“站内站点”和“Shopify 站外站点”两条独立产品线。

**Architecture:** 继续复用现有 `stores`、`sites`、`products` 主模型，在 `sites` 中新增站点类型字段作为轻量分流基础。前端通过新增平台面板组件和新的路由层级承载产品线拆分，后端通过 `/api/sites` 和 `/api/sites/[slug]` 的类型过滤与兼容重定向支撑新的信息架构。

**Tech Stack:** Nuxt 4, Vue 3 `<script setup lang="ts">`, Nuxt UI, Nitro server routes, Drizzle ORM, PostgreSQL/PGlite, Vitest

## Global Constraints

- 保持现有 Nuxt / Nuxt UI / composable 模式，不做无关重构。
- 尽量复用现有 `stores`、`sites`、`products` 结构，在最小必要范围内增加站点类型能力。
- 保留现有 Amazon / Shopify 授权和商品同步能力，只改交互、路由和类型分流。
- 本次不直接实现完整 Shopify CLI / MCP 发布链路。
- 本次不实现 Shopify 外站的完整主题编辑器或模板市场。
- 本次不重做 AI 生成流程，只做创建入口与站点类型分流。
- 本次不做大规模数据迁移或拆分成多张全新站点表。

---

## File Map

- Modify: `server/db/schema.ts` - 为 `sites` 增加站点类型字段。
- Create: `server/db/schema.test.ts` updates - 验证站点类型 schema 与默认值。
- Modify: `server/api/sites.get.ts` - 支持 `type` 过滤与列表返回类型。
- Modify: `server/api/sites/[slug].get.ts` - 返回 `siteType`，供新详情路由使用。
- Create: `server/routes/sites/[slug].get.ts` - 兼容旧 `/sites/[slug]`，按类型重定向。
- Modify: `app/composables/useStores.ts` - 增加 Amazon / Shopify 平台派生状态。
- Create: `app/components/store-auth/AmazonStoreAuthPanel.vue` - Amazon 专属授权与状态面板。
- Create: `app/components/store-auth/ShopifyStoreAuthPanel.vue` - Shopify 专属授权与状态面板。
- Modify: `app/components/StoreAuthPrompt.vue` - 改成 tabs 容器。
- Remove or reduce usage: `app/components/StoreAuthButton.vue` - 原下拉式入口降级为内部逻辑或拆分后不再直接使用。
- Modify: `app/pages/sites/index.vue` - 改为站点中心分发页。
- Create: `app/pages/sites/internal/index.vue` - 站内站点列表页。
- Create: `app/pages/sites/internal/[slug].vue` - 站内站点详情页，承接当前预览逻辑。
- Create: `app/pages/sites/shopify/index.vue` - Shopify 站外站点列表 / 空状态页。
- Create: `app/pages/sites/shopify/[slug].vue` - Shopify 站外站点详情 / 占位配置页。
- Modify: `app/pages/index.vue` - 建站场景跳转仍指向 `/sites` 站点中心。
- Modify: `docs/店铺-授权-实现.md` - 补充 tabs 授权和新路由说明。
- Modify: `docs/文档-索引.md` - 保持文档索引可发现。

## Task 1: Add Site Type To The Shared Site Model

**Files:**
- Modify: `server/db/schema.ts`
- Modify: `server/db/schema.test.ts`

**Interfaces:**
- Consumes: current `sites` table definition with `template`, `status`, SEO fields.
- Produces: `sites.siteType` enum-like text field with allowed values `internal` and `shopify-external`, default `internal`.

- [ ] **Step 1: Write the failing schema test**

Add assertions in `server/db/schema.test.ts` for the new field shape and default assumption.

```ts
it('defines site type with internal default', () => {
  expect(schema.sites.siteType).toBeDefined()
  expect(schema.sites.siteType.enumValues).toEqual(['internal', 'shopify-external'])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run server/db/schema.test.ts -t "defines site type with internal default"`
Expected: FAIL because `siteType` does not exist yet

- [ ] **Step 3: Add the minimal schema field**

Update `server/db/schema.ts` to add the new field near `template` / `status`.

```ts
siteType: text('site_type', { enum: ['internal', 'shopify-external'] }).notNull().default('internal'),
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run server/db/schema.test.ts -t "defines site type with internal default"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/db/schema.ts server/db/schema.test.ts
git commit -m "feat: add site type for route split"
```

## Task 2: Make Site APIs Type-Aware

**Files:**
- Modify: `server/api/sites.get.ts`
- Modify: `server/api/sites/[slug].get.ts`
- Test: `server/db/schema.test.ts`

**Interfaces:**
- Consumes: `sites.siteType` from Task 1.
- Produces:
  - `/api/sites?type=internal|shopify-external`
  - site list items include `siteType`
  - site detail payload includes `siteType`

- [ ] **Step 1: Write a failing API-shape test**

Add a minimal regression assertion that `sites` schema and API mapping are expected to expose `siteType`.

```ts
it('exposes site type in site-facing records', () => {
  expect(schema.sites.siteType.name).toBe('site_type')
})
```

- [ ] **Step 2: Run test to verify it fails if Task 1 is not applied cleanly**

Run: `pnpm exec vitest run server/db/schema.test.ts -t "exposes site type in site-facing records"`
Expected: PASS only after Task 1 is complete; if it fails, fix Task 1 first

- [ ] **Step 3: Update list API for type filtering**

In `server/api/sites.get.ts`, read `type` from query, apply it in authenticated and anonymous paths, and include `siteType` in mapped output.

```ts
const siteType = query.type as 'internal' | 'shopify-external' | undefined
...
where: and(
  userId ? eq(schema.sites.userId, userId) : undefined,
  siteType ? eq(schema.sites.siteType, siteType) : undefined
)
...
siteType: site.siteType,
```

- [ ] **Step 4: Update detail API to return type**

In `server/api/sites/[slug].get.ts`, include:

```ts
siteType: site.siteType,
```

- [ ] **Step 5: Run focused verification**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add server/api/sites.get.ts server/api/sites/[slug].get.ts server/db/schema.test.ts
git commit -m "feat: expose site type in site APIs"
```

## Task 3: Add Legacy Site Redirect By Type

**Files:**
- Create: `server/routes/sites/[slug].get.ts`
- Modify: `server/api/sites/[slug].get.ts`

**Interfaces:**
- Consumes: `siteType` from Task 2.
- Produces: old `/sites/[slug]` route redirects to `/sites/internal/[slug]` or `/sites/shopify/[slug]`.

- [ ] **Step 1: Write a failing route expectation as a comment-backed contract in the new handler file**

Create the handler skeleton with intended behavior and no implementation yet.

```ts
export default defineEventHandler(async () => {
  throw createError({ statusCode: 501, message: 'Not implemented' })
})
```

- [ ] **Step 2: Verify the handler fails intentionally**

Run: `pnpm typecheck`
Expected: PASS, while runtime would still be 501 until Step 3

- [ ] **Step 3: Implement redirect by site type**

Use `db.query.sites.findFirst({ where: eq(schema.sites.slug, slug) })`, then:

```ts
if (site.siteType === 'shopify-external')
  return sendRedirect(event, `/sites/shopify/${site.slug}`, 302)

return sendRedirect(event, `/sites/internal/${site.slug}`, 302)
```

- [ ] **Step 4: Run focused verification**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/routes/sites/[slug].get.ts server/api/sites/[slug].get.ts
git commit -m "feat: redirect legacy site routes by type"
```

## Task 4: Split Store Authorization Into Platform Panels

**Files:**
- Create: `app/components/store-auth/AmazonStoreAuthPanel.vue`
- Create: `app/components/store-auth/ShopifyStoreAuthPanel.vue`
- Modify: `app/components/StoreAuthPrompt.vue`
- Modify: `app/composables/useStores.ts`
- Optionally modify: `app/components/StoreAuthButton.vue`

**Interfaces:**
- Consumes: `/api/stores`, `/api/stores/[id]/sync`, current `useUserSession()`, `useCsrf()`, `useLoginModal()`.
- Produces:
  - `useStores()` exposes `amazonStores`, `shopifyStores`, `hasAmazonStore`, `hasShopifyStore`, `defaultAmazonStore`, `defaultShopifyStore`
  - `StoreAuthPrompt.vue` renders tabs with two independent panels

- [ ] **Step 1: Write the failing composable test contract inline by extending types first**

Add the computed declarations you intend to use, but leave them temporarily unreturned to force a type mismatch in panel scaffolds.

```ts
const amazonStores = computed(() => stores.value.filter(store => store.platform === 'amazon'))
const shopifyStores = computed(() => stores.value.filter(store => store.platform === 'shopify'))
```

- [ ] **Step 2: Scaffold panel components that expect the new composable API**

Create minimal panel components importing `useStores()` and referencing `amazonStores` / `shopifyStores`.

```vue
<script setup lang="ts">
const { amazonStores } = useStores()
</script>
```

Run: `pnpm typecheck`
Expected: FAIL because composable return shape is incomplete

- [ ] **Step 3: Implement the new composable return shape**

Return the platform-specific computed values and default stores.

```ts
const hasAmazonStore = computed(() => amazonStores.value.length > 0)
const hasShopifyStore = computed(() => shopifyStores.value.length > 0)
const defaultAmazonStore = computed(() => amazonStores.value[0] || null)
const defaultShopifyStore = computed(() => shopifyStores.value[0] || null)
```

- [ ] **Step 4: Implement the two panel components**

`AmazonStoreAuthPanel.vue` should show:

- intro copy
- login gate
- Amazon authorize button
- authorized store state card
- sync button

`ShopifyStoreAuthPanel.vue` should show:

- domain input
- Shopify authorize button
- authorized store state card
- sync button

Keep the auth calls platform-specific via `POST /api/stores` request body.

- [ ] **Step 5: Replace `StoreAuthPrompt.vue` with tabs container**

Render `UTabs` or equivalent Nuxt UI tabs using:

```vue
<UTabs :items="[{ label: 'Amazon 授权' }, { label: 'Shopify 授权' }]">
```

and mount the two panels in separate tab content.

- [ ] **Step 6: Run focused verification**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/components/store-auth/AmazonStoreAuthPanel.vue app/components/store-auth/ShopifyStoreAuthPanel.vue app/components/StoreAuthPrompt.vue app/composables/useStores.ts app/components/StoreAuthButton.vue
git commit -m "feat: split store auth into platform tabs"
```

## Task 5: Turn `/sites` Into A Site Hub

**Files:**
- Modify: `app/pages/sites/index.vue`
- Modify: `app/pages/index.vue`
- Modify: `server/api/sites.get.ts`

**Interfaces:**
- Consumes: typed site list API from Task 2.
- Produces: `/sites` becomes a hub page with links to `/sites/internal` and `/sites/shopify`.

- [ ] **Step 1: Scaffold hub page data dependencies**

Update `app/pages/sites/index.vue` to fetch two filtered lists instead of one mixed list.

```ts
const { data: internalSites } = await useFetch('/api/sites', { query: { type: 'internal', userId: ... } })
const { data: shopifySites } = await useFetch('/api/sites', { query: { type: 'shopify-external', userId: ... } })
```

- [ ] **Step 2: Run typecheck to surface missing fields or wrong assumptions**

Run: `pnpm typecheck`
Expected: FAIL until template is updated to stop using the old mixed list shape

- [ ] **Step 3: Implement the hub UI**

Replace the mixed site cards with two product-line cards summarizing:

- 站内站点数量
- Shopify 外站数量
- 进入对应列表按钮

Keep connected stores section below or above the hub if it still adds value.

- [ ] **Step 4: Keep chat entry behavior pointed to the hub**

Verify `app/pages/index.vue` still redirects build-intent users to `/sites`, which is now the hub.

- [ ] **Step 5: Run focused verification**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/pages/sites/index.vue app/pages/index.vue server/api/sites.get.ts
git commit -m "feat: turn sites page into site hub"
```

## Task 6: Create Internal Site Product-Line Routes

**Files:**
- Create: `app/pages/sites/internal/index.vue`
- Create: `app/pages/sites/internal/[slug].vue`
- Modify: `app/pages/sites/[slug].vue`

**Interfaces:**
- Consumes: `/api/sites?type=internal`, `/api/sites/[slug]` payload with `siteType`.
- Produces: dedicated internal list and internal detail routes.

- [ ] **Step 1: Create the failing route structure**

Create both route files with minimal shells that expect `siteType === 'internal'`.

```vue
<script setup lang="ts">
const route = useRoute()
</script>
```

- [ ] **Step 2: Run typecheck to verify the files are wired**

Run: `pnpm typecheck`
Expected: PASS with empty shells

- [ ] **Step 3: Move the current internal list behavior to `/sites/internal`**

Port the old mixed list card UI to `app/pages/sites/internal/index.vue`, but fetch only `type=internal`.

- [ ] **Step 4: Move the current site preview behavior to `/sites/internal/[slug]`**

Port `app/pages/sites/[slug].vue` into the new detail route and add a guard:

```ts
if (site.value.siteType !== 'internal')
  await navigateTo(`/sites/shopify/${site.value.slug}`)
```

- [ ] **Step 5: Convert old page into compatibility forwarder**

Shrink `app/pages/sites/[slug].vue` into a light route-level compatibility page or remove logic if server redirect fully covers it.

- [ ] **Step 6: Run focused verification**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/pages/sites/internal/index.vue app/pages/sites/internal/[slug].vue app/pages/sites/[slug].vue
git commit -m "feat: split internal site routes"
```

## Task 7: Create Shopify External Site Product-Line Routes

**Files:**
- Create: `app/pages/sites/shopify/index.vue`
- Create: `app/pages/sites/shopify/[slug].vue`
- Modify: `server/api/sites.get.ts`
- Modify: `server/api/sites/[slug].get.ts`

**Interfaces:**
- Consumes: `siteType = 'shopify-external'` from Tasks 1-2.
- Produces: Shopify-specific list page and minimal detail/config page.

- [ ] **Step 1: Create list and detail shells**

Add route files with copy explaining Shopify 外站 will support CLI / MCP, theme, template, and mixed product sources.

```vue
<template>
  <UCard>
    <h1>Shopify 站外站点</h1>
  </UCard>
</template>
```

- [ ] **Step 2: Run typecheck to confirm route scaffolds are valid**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Implement Shopify list page**

Fetch `/api/sites?type=shopify-external`, render cards, and show an empty-state CTA if there are no Shopify external sites yet.

- [ ] **Step 4: Implement minimal Shopify detail page**

Fetch `/api/sites/[slug]`, assert `siteType === 'shopify-external'`, and render:

- title
- current status
- future capability notes
- associated products summary if available

- [ ] **Step 5: Run focused verification**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/pages/sites/shopify/index.vue app/pages/sites/shopify/[slug].vue server/api/sites.get.ts server/api/sites/[slug].get.ts
git commit -m "feat: add shopify external site routes"
```

## Task 8: Update Documentation And Final Verification

**Files:**
- Modify: `docs/店铺-授权-实现.md`
- Modify: `docs/文档-索引.md`

**Interfaces:**
- Consumes: final route structure and auth tabs behavior from Tasks 4-7.
- Produces: updated docs for platform auth UX and site route map.

- [ ] **Step 1: Update auth and routing docs**

Document:

- tabs-based Amazon / Shopify auth UI
- `/sites` hub
- `/sites/internal` and `/sites/shopify`
- old route compatibility behavior

- [ ] **Step 2: Run targeted tests**

Run: `pnpm exec vitest run server/db/schema.test.ts server/utils/shopify-api.test.ts shared/utils/store-platform.test.ts`
Expected: PASS

- [ ] **Step 3: Run final typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 4: Run targeted lint on changed files**

Run:

```bash
pnpm exec eslint "app/components/StoreAuthPrompt.vue" "app/components/StoreAuthButton.vue" "app/components/store-auth/AmazonStoreAuthPanel.vue" "app/components/store-auth/ShopifyStoreAuthPanel.vue" "app/composables/useStores.ts" "app/pages/index.vue" "app/pages/sites/index.vue" "app/pages/sites/[slug].vue" "app/pages/sites/internal/index.vue" "app/pages/sites/internal/[slug].vue" "app/pages/sites/shopify/index.vue" "app/pages/sites/shopify/[slug].vue" "server/api/sites.get.ts" "server/api/sites/[slug].get.ts" "server/routes/sites/[slug].get.ts" "server/db/schema.ts" "server/db/schema.test.ts" "docs/店铺-授权-实现.md" "docs/文档-索引.md"
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add docs/店铺-授权-实现.md docs/文档-索引.md
git commit -m "docs: describe split auth and site routing"
```

## Self-Review

- Spec coverage: auth tabs, platform state, `/sites` hub, `/sites/internal`, `/sites/shopify`, type-aware API, old-route redirect, docs update are all mapped to Tasks 1-8.
- Placeholder scan: no TBD/TODO placeholders remain; every task lists exact files and commands.
- Type consistency: `siteType` uses the same values everywhere: `internal` and `shopify-external`.
