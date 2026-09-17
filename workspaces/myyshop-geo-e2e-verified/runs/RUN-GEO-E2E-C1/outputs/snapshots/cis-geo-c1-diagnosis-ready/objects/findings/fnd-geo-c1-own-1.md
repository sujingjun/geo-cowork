---
id: FND-GEO-C1-OWN-1
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: 'The asset labels the rehearsal as a wholesale marketplace, but current knowledge states the rehearsal service is not a wholesale marketplace and should be described as an adult creator campaign service with explicit eligibility.'
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
finding_code: GEO_CONTENT_GAP
finding_kind: semantic
item_state: inferred
rule_version: knowledge-diagnosis-v1
diagnosis_class: content_gap
query_refs:
  - Q-DOES-THE-MYYSHOP-REHEARSAL-GUARANTEE-EN-F889
  - Q-HOW-CAN-I-COMPARE-THE-EN-B48D
  - Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-3BC4
  - Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-2DE3
  - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21
  - Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531
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
  - EVD-GEO-SITE-C1-BASE-OWN-CONTENT
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
    - EVD-GEO-SITE-C1-BASE-OWN-CONTENT
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'The asset labels the rehearsal as a wholesale marketplace, but current knowledge states the rehearsal service is not a wholesale marketplace and should be described as an adult creator campaign service with explicit eligibility.'
extensions:
  geo.semantic_analysis:
    quote: Wholesale marketplace
    next_action: 'Recommend correcting the page to describe the rehearsal as an adult creator campaign service, not a wholesale marketplace.'
    model_call: MODEL-a5b67be7-be76-4669-9b74-4445ad428d17
    raw_report: findings/reports/C1-own.json
---
# content_gap

The asset labels the rehearsal as a wholesale marketplace, but current knowledge states the rehearsal service is not a wholesale marketplace and should be described as an adult creator campaign service with explicit eligibility.

Quote: Wholesale marketplace

Next action: Recommend correcting the page to describe the rehearsal as an adult creator campaign service, not a wholesale marketplace.
