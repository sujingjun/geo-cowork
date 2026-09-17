---
id: FND-GEO-C1-OWN-1
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: 'The asset heading positions the service as a wholesale marketplace, but supplied knowledge states the rehearsal is not a wholesale marketplace and defines it as an adult creator campaign service connecting creators with simulated brand campaigns.'
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
  - CLM-GEO-E2E-LEGACY
  - CLM-GEO-E2E-IDENTITY
  - CLM-GEO-E2E-ANSWER-DEFINITION
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
  - EVD-GEO-SITE-C1-BASE-OWN-CANONICAL
  - EVD-GEO-SITE-C1-BASE-OWN-CRAWLABILITY
  - EVD-GEO-SITE-C1-BASE-OWN-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C1-BASE-OWN-SCHEMA-SYNTAX
asset_refs:
  - AST-GEO-E2E-C1-OWN
source_refs:
  - SRC-GEO-SITE-C1-OWN
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
    - EVD-GEO-SITE-C1-BASE-OWN-CANONICAL
    - EVD-GEO-SITE-C1-BASE-OWN-CRAWLABILITY
    - EVD-GEO-SITE-C1-BASE-OWN-META-DESCRIPTION-PRESENT
    - EVD-GEO-SITE-C1-BASE-OWN-SCHEMA-SYNTAX
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'The asset heading positions the service as a wholesale marketplace, but supplied knowledge states the rehearsal is not a wholesale marketplace and defines it as an adult creator campaign service connecting creators with simulated brand campaigns.'
extensions:
  geo.semantic_analysis:
    quote: Wholesale marketplace
    next_action: 'Revise the page heading and copy to describe the rehearsal as an adult creator campaign service, remove wholesale marketplace positioning, and make eligibility explicit.'
    model_call: MODEL-7d0f67da-b9e2-4cc2-93a0-e0a8536ab1fb
    raw_report: findings/reports/C1-own.json
---
# content_gap

The asset heading positions the service as a wholesale marketplace, but supplied knowledge states the rehearsal is not a wholesale marketplace and defines it as an adult creator campaign service connecting creators with simulated brand campaigns.

Quote: Wholesale marketplace

Next action: Revise the page heading and copy to describe the rehearsal as an adult creator campaign service, remove wholesale marketplace positioning, and make eligibility explicit.
