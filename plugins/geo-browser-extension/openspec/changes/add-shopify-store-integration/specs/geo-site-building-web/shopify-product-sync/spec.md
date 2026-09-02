## ADDED Requirements

### Requirement: Shopify product synchronization
The workspace plan SHALL support synchronizing Shopify products into the existing shared `products` model without creating a platform-specific product table.

#### Scenario: Sync Shopify products into shared catalog
- **GIVEN** an authenticated user owns an authorized Shopify store
- **WHEN** the user triggers product sync for that store
- **THEN** the system SHALL fetch Shopify products and upsert normalized product records using `externalProductId`, `platformHandle`, `productUrl`, `vendor`, `productType`, `tags`, `variants`, and `rawData` as applicable

#### Scenario: Preserve store ownership on sync
- **GIVEN** a user attempts to sync a store they do not own
- **WHEN** the sync endpoint validates the request
- **THEN** the system SHALL reject the request and SHALL NOT read or write product data for that store

#### Scenario: Record platform-aware product URLs
- **GIVEN** a Shopify product has a public product handle
- **WHEN** the product is normalized into the shared catalog
- **THEN** the stored `productUrl` SHALL point to the Shopify product page for that store instead of an Amazon URL pattern
