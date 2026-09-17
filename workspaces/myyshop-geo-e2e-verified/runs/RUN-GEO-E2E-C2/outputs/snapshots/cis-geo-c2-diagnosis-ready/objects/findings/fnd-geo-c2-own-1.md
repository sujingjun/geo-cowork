---
id: FND-GEO-C2-OWN-1
record_type: finding
status: waiting_human
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: 'The asset is titled as an eligibility and evidence FAQ, and the supplied knowledge defines supported eligibility, onboarding, evidence-boundary, privacy, guarantee, and positioning content. The page body defers details instead of presenting those supported answers, so it does not answer the FAQ purpose.'
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
  - CLM-GEO-E2E-ANSWER-DEFINITION
  - CLM-GEO-E2E-ELIGIBILITY
  - CLM-GEO-E2E-ONBOARDING
  - CLM-GEO-E2E-GUARANTEES
  - CLM-GEO-E2E-PRIVACY
  - CLM-GEO-E2E-CASE
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
  - EVD-GEO-SITE-C2-BASE-OWN-CANONICAL
  - EVD-GEO-SITE-C2-BASE-OWN-CRAWLABILITY
  - EVD-GEO-SITE-C2-BASE-OWN-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C2-BASE-OWN-SCHEMA-SYNTAX
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
    - EVD-GEO-SITE-C2-BASE-OWN-CANONICAL
    - EVD-GEO-SITE-C2-BASE-OWN-CRAWLABILITY
    - EVD-GEO-SITE-C2-BASE-OWN-META-DESCRIPTION-PRESENT
    - EVD-GEO-SITE-C2-BASE-OWN-SCHEMA-SYNTAX
    - EVD-GEO-SITE-C2-BASE-OWN-CONTENT
  counter_evidence_refs: []
  unresolved_conflicts: []
  rationale: 'The asset is titled as an eligibility and evidence FAQ, and the supplied knowledge defines supported eligibility, onboarding, evidence-boundary, privacy, guarantee, and positioning content. The page body defers details instead of presenting those supported answers, so it does not answer the FAQ purpose.'
extensions:
  geo.semantic_analysis:
    quote: Details will be supplied after the new Goal review.
    next_action: Replace the placeholder with concise FAQ content drawn only from the cited claims; do not add unproven growth or guaranteed-income wording.
    model_call: MODEL-2b50b4a2-6e56-4128-891c-b4e305ed16a9
    raw_report: findings/reports/C2-own.json
---
# content_gap

The asset is titled as an eligibility and evidence FAQ, and the supplied knowledge defines supported eligibility, onboarding, evidence-boundary, privacy, guarantee, and positioning content. The page body defers details instead of presenting those supported answers, so it does not answer the FAQ purpose.

Quote: Details will be supplied after the new Goal review.

Next action: Replace the placeholder with concise FAQ content drawn only from the cited claims; do not add unproven growth or guaranteed-income wording.
