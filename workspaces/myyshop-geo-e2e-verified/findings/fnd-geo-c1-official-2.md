---
id: FND-GEO-C1-OFFICIAL-2
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: 'The asset does not describe supported workflow (discovery, application, aggregate reports), onboarding, privacy handling, fees/trial/cancellation/refund, automation limits, non-goals, or comparison criteria that current knowledge supplies for these queries.'
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
  - CLM-GEO-E2E-CAMPAIGNS
  - CLM-GEO-E2E-ONBOARDING
  - CLM-GEO-E2E-PRIVACY
  - CLM-GEO-E2E-AUTOMATION
  - CLM-GEO-E2E-NON-GOALS
  - CLM-GEO-E2E-FEES
  - CLM-GEO-E2E-REFUND
  - CLM-GEO-E2E-COMPARISON
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
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-CONTENT
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
    - EVD-GEO-SITE-C1-BASE-OFFICIAL-CONTENT
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'The asset does not describe supported workflow (discovery, application, aggregate reports), onboarding, privacy handling, fees/trial/cancellation/refund, automation limits, non-goals, or comparison criteria that current knowledge supplies for these queries.'
extensions:
  geo.semantic_analysis:
    quote: Campaign opportunities.
    next_action: Request an update to the official external page adding the approved operational and limitation details; no publish authority claimed.
    model_call: MODEL-9777c6d2-9172-4651-aa23-ed40b5d97168
    raw_report: findings/reports/C1-official.json
---
# content_gap

The asset does not describe supported workflow (discovery, application, aggregate reports), onboarding, privacy handling, fees/trial/cancellation/refund, automation limits, non-goals, or comparison criteria that current knowledge supplies for these queries.

Quote: Campaign opportunities.

Next action: Request an update to the official external page adding the approved operational and limitation details; no publish authority claimed.
