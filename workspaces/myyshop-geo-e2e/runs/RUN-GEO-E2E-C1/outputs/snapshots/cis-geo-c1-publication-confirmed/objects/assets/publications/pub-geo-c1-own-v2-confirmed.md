---
id: PUB-GEO-C1-OWN-V2-CONFIRMED
record_type: asset_publication
status: confirmed
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: Awaiting simulated publication attestation
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
proposal_ref: PRP-GEO-C1-OWN
adoption_ref: ADR-GEO-C1-OWN-DECIDED
asset_ref: AST-GEO-E2E-C1-OWN
published_item_ids:
  - REC-GEO-C1-OWN
published_locator: 'https://brand.geo-e2e.invalid/about'
content_sha256: 9706abeb6fe57bac3842cef8e1eee4d7bf6c57641cc598c80ec6f8421f362f8b
published_at: '2026-09-18T00:00:00.000Z'
extensions:
  geo.publication_proof:
    path: assets/published/C1/own-readback.json
    sha256: 8fb2f09573cde8c697dc043e29e9a8448c5a3223924826705f458910e9e0dde7
    transport_kind: loopback_http_fixture
    read_at: '2026-09-15T18:21:44.878Z'
    http_status: 200
  geo.feedback:
    predecessor:
      ref: PUB-GEO-C1-OWN-V2
      version: 1.0.0
    package_sha256: 650657852ffdefa74d31e9f4dcfa894e3a8a50818ff15d511d6b265aaab77106
approval:
  approved_by: Independent fixture human (test_only)
  approved_at: '2026-09-18T00:05:00Z'
  decision_ref: 'workspace://reviews/decisions/OWNER-C1-PUBLICATION-V2.json'
---
# Awaiting simulated publication attestation
