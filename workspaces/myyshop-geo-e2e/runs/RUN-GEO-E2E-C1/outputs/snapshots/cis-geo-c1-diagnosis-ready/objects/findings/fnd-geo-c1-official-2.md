---
id: FND-GEO-C1-OFFICIAL-2
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: 'The asset''s only service phrase does not describe supported campaign discovery, application, aggregate performance reporting, onboarding, fees, refund terms, or the unavailable automatic campaign acceptance.'
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
finding_code: GEO_CONTENT_GAP
finding_kind: semantic
item_state: inferred
rule_version: knowledge-diagnosis-v1
diagnosis_class: content_gap
query_refs:
  - Q-HOW-CAN-CREATORS-COMPARE-REHEARSAL-EN-23C2
  - Q-WHAT-ARE-THE-FEES-TRIAL-EN-BEC0
  - Q-WHAT-CAPABILITIES-DOES-THE-REHEARSAL-EN-A732
  - Q-WHAT-IS-THE-REHEARSAL-SERVICE-EN-B466
  - Q-WHAT-PRIVACY-AND-GUARANTEE-LIMITATIONS-EN-7E60
  - Q-WHO-IS-ELIGIBLE-FOR-THE-EN-754E
claim_refs:
  - CLM-GEO-E2E-CAMPAIGNS
  - CLM-GEO-E2E-ONBOARDING
  - CLM-GEO-E2E-FEES
  - CLM-GEO-E2E-REFUND
  - CLM-GEO-E2E-AUTOMATION
evidence_refs:
  - EVD-GEO-E2E-ANSWER-DEFINITION
  - EVD-GEO-E2E-AUTOMATION
  - EVD-GEO-E2E-CAMPAIGNS
  - EVD-GEO-E2E-CASE
  - EVD-GEO-E2E-COMPARISON
  - EVD-GEO-E2E-ELIGIBILITY
  - EVD-GEO-E2E-FEES
  - EVD-GEO-E2E-GUARANTEES
  - EVD-GEO-E2E-IDENTITY
  - EVD-GEO-E2E-LEGACY
  - EVD-GEO-E2E-NON-GOALS
  - EVD-GEO-E2E-ONBOARDING
  - EVD-GEO-E2E-POSITIONING
  - EVD-GEO-E2E-PRIVACY
  - EVD-GEO-E2E-REFUND
  - EVD-GEO-E2E-VOICE
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-CANONICAL
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-CRAWLABILITY
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-SCHEMA-SYNTAX
asset_refs:
  - AST-GEO-E2E-C1-OFFICIAL
source_refs:
  - SRC-GEO-SITE-C1-OFFICIAL
gap_basis:
  supporting_evidence_refs:
    - EVD-GEO-E2E-ANSWER-DEFINITION
    - EVD-GEO-E2E-AUTOMATION
    - EVD-GEO-E2E-CAMPAIGNS
    - EVD-GEO-E2E-CASE
    - EVD-GEO-E2E-COMPARISON
    - EVD-GEO-E2E-ELIGIBILITY
    - EVD-GEO-E2E-FEES
    - EVD-GEO-E2E-GUARANTEES
    - EVD-GEO-E2E-IDENTITY
    - EVD-GEO-E2E-LEGACY
    - EVD-GEO-E2E-NON-GOALS
    - EVD-GEO-E2E-ONBOARDING
    - EVD-GEO-E2E-POSITIONING
    - EVD-GEO-E2E-PRIVACY
    - EVD-GEO-E2E-REFUND
    - EVD-GEO-E2E-VOICE
    - EVD-GEO-SITE-C1-BASE-OFFICIAL-CANONICAL
    - EVD-GEO-SITE-C1-BASE-OFFICIAL-CRAWLABILITY
    - EVD-GEO-SITE-C1-BASE-OFFICIAL-META-DESCRIPTION-PRESENT
    - EVD-GEO-SITE-C1-BASE-OFFICIAL-SCHEMA-SYNTAX
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'The asset''s only service phrase does not describe supported campaign discovery, application, aggregate performance reporting, onboarding, fees, refund terms, or the unavailable automatic campaign acceptance.'
extensions:
  geo.semantic_analysis:
    quote: Campaign opportunities.
    next_action: 'Request the asset owner update the official external page to add the supported workflow, onboarding, fee/refund terms, and automation limitation.'
    model_call: MODEL-642282f3-3d47-4bf4-829a-75f56417f0ba
    raw_report: findings/reports/C1-official.json
---
# content_gap

The asset's only service phrase does not describe supported campaign discovery, application, aggregate performance reporting, onboarding, fees, refund terms, or the unavailable automatic campaign acceptance.

Quote: Campaign opportunities.

Next action: Request the asset owner update the official external page to add the supported workflow, onboarding, fee/refund terms, and automation limitation.
