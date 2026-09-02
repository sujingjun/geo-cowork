## ADDED Requirements

### Requirement: Shopify store authorization
The workspace plan SHALL support authorizing a Shopify store for an authenticated user and persisting the authorized store in the shared `stores` model with `platform = 'shopify'`.

#### Scenario: Start Shopify authorization
- **GIVEN** a signed-in user without an authorized Shopify store
- **WHEN** the user chooses to connect Shopify from the store management flow
- **THEN** the system returns a Shopify authorization URL and stores anti-forgery state needed for callback validation

#### Scenario: Complete Shopify callback
- **GIVEN** Shopify redirects back with a valid authorization code and matching state
- **WHEN** the callback handler exchanges the code for store access credentials
- **THEN** the system SHALL upsert a `stores` record for that user with Shopify identity, access token, shop domain, scopes, and platform metadata

#### Scenario: Reject invalid callback
- **GIVEN** Shopify redirects back with a missing or invalid state
- **WHEN** the callback handler validates the request
- **THEN** the system SHALL reject the callback with an authorization error and SHALL NOT create or update a store record
