---
id: RUN-GEO-SITE-C2-AFTER-OWN
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
record_type: run
status: completed
version: 1.0.0
created_at: '2026-10-03T00:00:00.000Z'
updated_at: '2026-10-03T00:00:00.000Z'
title: geo-site Technical Retest
skill: geo-site-technical-retest
skill_version: 1.0.0
input_refs:
  - AST-GEO-E2E-C2-OWN
  - FND-GEO-SITE-C2-BASE-OWN-CANONICAL
  - FND-GEO-SITE-C2-BASE-OWN-CRAWLABILITY
  - FND-GEO-SITE-C2-BASE-OWN-META-DESCRIPTION-PRESENT
  - FND-GEO-SITE-C2-BASE-OWN-SCHEMA-SYNTAX
  - GOAL-GEO-E2E-C2
  - KR-GEO-E2E-C2
  - PUB-GEO-C2-OWN-V2-CONFIRMED
  - QS-GEO-E2E-C2
  - SRC-GEO-SITE-C2-OWN
input_versions:
  AST-GEO-E2E-C2-OWN: 1.0.0
  FND-GEO-SITE-C2-BASE-OWN-CANONICAL: 1.0.0
  FND-GEO-SITE-C2-BASE-OWN-CRAWLABILITY: 1.0.0
  FND-GEO-SITE-C2-BASE-OWN-META-DESCRIPTION-PRESENT: 1.0.0
  FND-GEO-SITE-C2-BASE-OWN-SCHEMA-SYNTAX: 1.0.0
  GOAL-GEO-E2E-C2: 1.0.0
  KR-GEO-E2E-C2: 1.0.0
  PUB-GEO-C2-OWN-V2-CONFIRMED: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
  SRC-GEO-SITE-C2-OWN: 1.0.0
input_fingerprint: 7777d63d3d8e827f27cc2da0df0b3ffbfd396ae914b256e4c884e45b0bd9a7ef
completed_steps:
  - HTTP_STATUS
  - CANONICAL
  - ROBOTS
  - SITEMAP
  - SCHEMA_SYNTAX
  - TITLE_PRESENT
  - META_DESCRIPTION_PRESENT
  - HEADING_PRESENT
  - CRAWLABILITY
output_artifacts: []
business_result: not_evaluated
next_action: review technical retest only
finding_refs:
  - FND-GEO-SITE-C2-AFTER-OWN-CANONICAL
  - FND-GEO-SITE-C2-AFTER-OWN-CRAWLABILITY
  - FND-GEO-SITE-C2-AFTER-OWN-META-DESCRIPTION-PRESENT
  - FND-GEO-SITE-C2-AFTER-OWN-SCHEMA-SYNTAX
evidence_refs:
  - EVD-GEO-SITE-C2-AFTER-OWN-CANONICAL
  - EVD-GEO-SITE-C2-AFTER-OWN-CRAWLABILITY
  - EVD-GEO-SITE-C2-AFTER-OWN-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C2-AFTER-OWN-SCHEMA-SYNTAX
asset_refs:
  - AST-GEO-E2E-C2-OWN
failure_reason: null
goal_refs:
  - GOAL-GEO-E2E-C2
query_set_versions:
  - ref: QS-GEO-E2E-C2
    version: 1.0.0
knowledge_release_versions:
  - ref: KR-GEO-E2E-C2
    version: 1.0.0
publication_refs:
  - PUB-GEO-C2-OWN-V2-CONFIRMED
retest_of_refs:
  - FND-GEO-SITE-C2-BASE-OWN-CANONICAL
  - FND-GEO-SITE-C2-BASE-OWN-CRAWLABILITY
  - FND-GEO-SITE-C2-BASE-OWN-META-DESCRIPTION-PRESENT
  - FND-GEO-SITE-C2-BASE-OWN-SCHEMA-SYNTAX
development_fixture: true
manifest_fingerprint: f0e31329768b42fb676667e714e53fe9aca4d1f9f38c23d028c685e5e432266a
detector_results:
  - code: HTTP_STATUS
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: HTTP 状态符合显式期望
  - code: CANONICAL
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: canonical 与显式目标一致
  - code: ROBOTS
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: robots 未声明阻断目标路径
  - code: SITEMAP
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: sitemap 包含显式目标
  - code: SCHEMA_SYNTAX
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: JSON-LD 语法可解析
  - code: TITLE_PRESENT
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: title 非空
  - code: META_DESCRIPTION_PRESENT
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: meta description 非空
  - code: HEADING_PRESENT
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: heading 非空
  - code: CRAWLABILITY
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: HTTP、robots、noindex 与 canonical 条件通过
---
# Run RUN-GEO-SITE-C2-AFTER-OWN
