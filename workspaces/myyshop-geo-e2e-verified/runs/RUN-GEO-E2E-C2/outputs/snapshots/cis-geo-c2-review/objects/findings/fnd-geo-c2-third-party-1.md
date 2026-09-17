---
id: FND-GEO-C2-THIRD-PARTY-1
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: 'The third-party page uses outdated wholesale positioning and signals unchecked details. Current knowledge states the rehearsal service is not a wholesale marketplace and instead connects adult creators with simulated brand campaigns, described as an adult creator campaign service with explicit eligibility and no income guarantee.'
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
  - Q-HOW-SHOULD-AN-ELIGIBLE-CREATOR-EN-D279
  - Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
  - Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-747A
  - Q-WHAT-EVIDENCE-LIMITS-PRIVACY-BOUNDARIES-EN-AB42
  - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
  - Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
claim_refs:
  - CLM-GEO-E2E-LEGACY
  - CLM-GEO-E2E-IDENTITY
  - CLM-GEO-E2E-ANSWER-DEFINITION
  - CLM-GEO-E2E-POSITIONING
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
  - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-CANONICAL
  - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-CRAWLABILITY
  - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-SCHEMA-SYNTAX
  - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-CONTENT
asset_refs:
  - AST-GEO-E2E-C2-THIRD-PARTY
source_refs:
  - SRC-GEO-SITE-C2-THIRD-PARTY
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
    - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-CANONICAL
    - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-CRAWLABILITY
    - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
    - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-SCHEMA-SYNTAX
    - EVD-GEO-SITE-C2-BASE-THIRD-PARTY-CONTENT
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'The third-party page uses outdated wholesale positioning and signals unchecked details. Current knowledge states the rehearsal service is not a wholesale marketplace and instead connects adult creators with simulated brand campaigns, described as an adult creator campaign service with explicit eligibility and no income guarantee.'
extensions:
  geo.semantic_analysis:
    quote: Possibly a wholesale provider; details have not been checked.
    next_action: Issue a correction request to the third-party publisher to align the page with the approved rehearsal definition; do not claim authority to publish or approve the correction.
    model_call: MODEL-556a99f8-900b-4cb7-81ee-d3cae357eb20
    raw_report: findings/reports/C2-third-party.json
---
# content_gap

The third-party page uses outdated wholesale positioning and signals unchecked details. Current knowledge states the rehearsal service is not a wholesale marketplace and instead connects adult creators with simulated brand campaigns, described as an adult creator campaign service with explicit eligibility and no income guarantee.

Quote: Possibly a wholesale provider; details have not been checked.

Next action: Issue a correction request to the third-party publisher to align the page with the approved rehearsal definition; do not claim authority to publish or approve the correction.
