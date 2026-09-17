---
id: FND-GEO-C2-OWN-1
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: The supplied unresolved proof-authority input states the proposed income-growth claim lacks approved evidence and conflicts with current no-income-guarantee and transparent-requirements positioning.
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
finding_code: GEO_EVIDENCE_GAP
finding_kind: semantic
item_state: inferred
rule_version: knowledge-diagnosis-v1
diagnosis_class: evidence_gap
query_refs:
  - Q-HOW-SHOULD-I-COMPARE-THE-EN-5087
  - Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-2CC4
  - Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
  - Q-WHAT-DOES-THE-MYYSHOP-REHEARSAL-EN-0B93
  - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-1724
  - Q-WHO-IS-ELIGIBLE-TO-PARTICIPATE-EN-B8C2
claim_refs:
  - CLM-GEO-E2E-GUARANTEES
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
  - EVD-GEO-SITE-C2-BASE-OWN-CONTENT
asset_refs:
  - AST-GEO-E2E-C2-OWN
source_refs:
  - SRC-GEO-SITE-C2-OWN
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
    - EVD-GEO-SITE-C2-BASE-OWN-CONTENT
  counter_evidence_refs: []
  unresolved_conflicts:
    - The supplied unresolved proof-authority input states the proposed income-growth claim lacks approved evidence and conflicts with current no-income-guarantee and transparent-requirements positioning.
  rationale: The supplied unresolved proof-authority input states the proposed income-growth claim lacks approved evidence and conflicts with current no-income-guarantee and transparent-requirements positioning.
extensions:
  geo.semantic_analysis:
    quote: A proposed 80 percent income growth claim has no approved supporting evidence.
    next_action: Keep the 80 percent income-growth claim out of the asset until approved supporting evidence is supplied; otherwise remove it.
    model_call: MODEL-52bb9440-eb31-448d-8c1d-2a690c55b57e
    raw_report: findings/reports/C2-own.json
---
# evidence_gap

The supplied unresolved proof-authority input states the proposed income-growth claim lacks approved evidence and conflicts with current no-income-guarantee and transparent-requirements positioning.

Quote: A proposed 80 percent income growth claim has no approved supporting evidence.

Next action: Keep the 80 percent income-growth claim out of the asset until approved supporting evidence is supplied; otherwise remove it.
