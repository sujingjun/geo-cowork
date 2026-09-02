## ADDED Requirements

### Requirement: Shopify products can generate external showcase sites
The workspace plan SHALL allow Shopify-sourced products to be selected by AI tooling and used to generate external showcase sites with the existing site generation workflow.

#### Scenario: AI selects Shopify products for generation
- **GIVEN** a user has synchronized Shopify products
- **WHEN** the AI workflow fetches products for site generation
- **THEN** the system SHALL be able to return Shopify-backed products with enough platform context for the user or model to choose them safely

#### Scenario: Generate site from Shopify products
- **GIVEN** a user selects valid Shopify product IDs belonging to their account
- **WHEN** the generate-site workflow creates a site
- **THEN** the system SHALL create a site and associate the selected Shopify products without requiring Amazon-specific fields

#### Scenario: Prevent mixed unauthorized product selection
- **GIVEN** a site generation request includes product IDs outside the current user's authorized stores
- **WHEN** the server validates the request
- **THEN** the system SHALL reject the request and SHALL NOT create the site

## MODIFIED Requirements

### Requirement: Multi-platform store management
The workspace plan SHALL present store management and site entry flows as multi-platform experiences that identify the store platform and avoid assuming every authorized store is Amazon.

#### Scenario: Display platform-aware store status
- **GIVEN** a user has one or more authorized stores
- **WHEN** the frontend loads store status for site creation or management
- **THEN** the UI SHALL expose each store's platform and enough metadata for the user to understand which store will be used
