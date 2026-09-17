---
id: FND-GEO-C1-THIRD-PARTY-2
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: 'Supported knowledge states eligibility is adult creators in the simulated US region and onboarding requires a profile plus accepting individual campaign requirements, with no income guarantee. The asset omits eligibility, onboarding, and guarantee limits.'
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
  - CLM-GEO-E2E-ELIGIBILITY
  - CLM-GEO-E2E-ONBOARDING
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
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CANONICAL
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CRAWLABILITY
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-SCHEMA-SYNTAX
asset_refs:
  - AST-GEO-E2E-C1-THIRD-PARTY
source_refs:
  - SRC-GEO-SITE-C1-THIRD-PARTY
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
    - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CANONICAL
    - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CRAWLABILITY
    - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
    - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-SCHEMA-SYNTAX
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'Supported knowledge states eligibility is adult creators in the simulated US region and onboarding requires a profile plus accepting individual campaign requirements, with no income guarantee. The asset omits eligibility, onboarding, and guarantee limits.'
extensions:
  geo.semantic_analysis:
    quote: details have not been checked.
    next_action: 'Recommend a correction request to add supported eligibility, onboarding, and no-income-guarantee details; do not publish changes directly.'
    model_call: MODEL-f6460838-c0f4-4476-a7a5-b55b445ab43a
    raw_report: findings/reports/C1-third-party.json
---
# content_gap

Supported knowledge states eligibility is adult creators in the simulated US region and onboarding requires a profile plus accepting individual campaign requirements, with no income guarantee. The asset omits eligibility, onboarding, and guarantee limits.

Quote: details have not been checked.

Next action: Recommend a correction request to add supported eligibility, onboarding, and no-income-guarantee details; do not publish changes directly.
