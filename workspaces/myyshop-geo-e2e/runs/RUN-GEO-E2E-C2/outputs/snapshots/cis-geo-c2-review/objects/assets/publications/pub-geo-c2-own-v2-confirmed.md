---
id: PUB-GEO-C2-OWN-V2-CONFIRMED
record_type: asset_publication
status: confirmed
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: Awaiting simulated publication attestation
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
proposal_ref: PRP-GEO-C2-OWN
adoption_ref: ADR-GEO-C2-OWN-DECIDED
asset_ref: AST-GEO-E2E-C2-OWN
published_item_ids:
  - REC-GEO-C2-OWN
published_locator: 'https://brand.geo-e2e.invalid/about'
content_sha256: 9706abeb6fe57bac3842cef8e1eee4d7bf6c57641cc598c80ec6f8421f362f8b
published_at: '2026-10-02T00:00:00.000Z'
extensions:
  geo.publication_proof:
    path: assets/published/C2/own-readback.json
    sha256: 431e65bb0cd2b3723be29a1305d47b8c32abf948b78189464d9d31c852a2e83f
    transport_kind: loopback_http_fixture
    read_at: '2026-09-15T19:22:56.511Z'
    http_status: 200
  geo.feedback:
    predecessor:
      ref: PUB-GEO-C2-OWN-V2
      version: 1.0.0
    package_sha256: 8a873d233a0126127a3b15aa3160c726110d69dabc3b37d960c99a8040fced87
approval:
  approved_by: Independent fixture human (test_only)
  approved_at: '2026-10-02T00:05:00Z'
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-PUBLICATION-V2.json'
---
# Awaiting simulated publication attestation
