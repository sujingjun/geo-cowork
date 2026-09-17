---
id: FND-GEO-C2-OFFICIAL-1
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: Current supported knowledge defines the service as an adult creator campaign service (CLM-GEO-E2E-IDENTITY). The quoted wholesale-marketplace negation is legacy positioning (CLM-GEO-E2E-LEGACY) and is an outdated content mismatch.
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
  - Q-HOW-SHOULD-I-COMPARE-THE-EN-5087
  - Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-2CC4
  - Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
  - Q-WHAT-DOES-THE-MYYSHOP-REHEARSAL-EN-0B93
  - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-1724
  - Q-WHO-IS-ELIGIBLE-TO-PARTICIPATE-EN-B8C2
claim_refs:
  - CLM-GEO-E2E-LEGACY
  - CLM-GEO-E2E-IDENTITY
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
  - EVD-GEO-SITE-C2-BASE-OFFICIAL-CONTENT
asset_refs:
  - AST-GEO-E2E-C2-OFFICIAL
source_refs:
  - SRC-GEO-SITE-C2-OFFICIAL
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
    - EVD-GEO-SITE-C2-BASE-OFFICIAL-CONTENT
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: Current supported knowledge defines the service as an adult creator campaign service (CLM-GEO-E2E-IDENTITY). The quoted wholesale-marketplace negation is legacy positioning (CLM-GEO-E2E-LEGACY) and is an outdated content mismatch.
extensions:
  geo.semantic_analysis:
    quote: The rehearsal service is not a wholesale marketplace.
    next_action: Submit a correction request to the asset owner to remove or replace the outdated wholesale positioning; do not publish changes directly.
    model_call: MODEL-ed2e7dd6-c8b2-42ac-9712-ee90ff44b8fd
    raw_report: findings/reports/C2-official.json
---
# content_gap

Current supported knowledge defines the service as an adult creator campaign service (CLM-GEO-E2E-IDENTITY). The quoted wholesale-marketplace negation is legacy positioning (CLM-GEO-E2E-LEGACY) and is an outdated content mismatch.

Quote: The rehearsal service is not a wholesale marketplace.

Next action: Submit a correction request to the asset owner to remove or replace the outdated wholesale positioning; do not publish changes directly.
