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
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
proposal_ref: PRP-GEO-C2-OWN
adoption_ref: ADR-GEO-C2-OWN-DECIDED
asset_ref: AST-GEO-E2E-C2-OWN
published_item_ids:
  - REC-GEO-C2-OWN
published_locator: 'https://brand.geo-e2e.invalid/faq'
content_sha256: 8ced087cfe6244a1ce1293c9383920112204d2a96f108384a6a1f5ddc59b7ec1
published_at: '2026-10-02T00:00:00.000Z'
extensions:
  geo.publication_proof:
    path: assets/published/C2/own-readback.json
    sha256: 30a87f2f9c7a78844b72631a324e6e91b3c388f20fadef54257d85029d9b9649
    transport_kind: loopback_http_fixture
    read_at: '2026-09-15T20:44:53.613Z'
    http_status: 200
  geo.feedback:
    predecessor:
      ref: PUB-GEO-C2-OWN-V2
      version: 1.0.0
    package_sha256: 8cc78615ef149dd118a79e62e8b8c3421b3d40b82b474d3da3099c2383e76f2c
approval:
  approved_by: Independent fixture human (test_only)
  approved_at: '2026-10-02T00:05:00.000Z'
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-PUBLICATION-V2.json'
---
# Awaiting simulated publication attestation
