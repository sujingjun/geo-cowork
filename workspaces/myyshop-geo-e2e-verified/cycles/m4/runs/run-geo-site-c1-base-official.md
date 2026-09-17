---
id: RUN-GEO-SITE-C1-BASE-OFFICIAL
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
record_type: run
status: completed
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: geo-site audit
skill: geo-site
skill_version: 1.0.0
input_refs:
  - AST-GEO-E2E-C1-OFFICIAL
  - GOAL-GEO-E2E-C1
  - KR-GEO-E2E-C1
  - QS-GEO-E2E-C1
  - SRC-GEO-SITE-C1-OFFICIAL
input_versions:
  AST-GEO-E2E-C1-OFFICIAL: 1.0.0
  GOAL-GEO-E2E-C1: 1.0.0
  KR-GEO-E2E-C1: 1.0.0
  QS-GEO-E2E-C1: 1.0.0
  SRC-GEO-SITE-C1-OFFICIAL: 1.0.0
input_fingerprint: 8e9627b4b062baf8e8ac8d4a59d0e0f36cbcf848e1836e584757642ead5b38bd
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
next_action: review Findings and human gates
finding_refs:
  - FND-GEO-SITE-C1-BASE-OFFICIAL-CANONICAL
  - FND-GEO-SITE-C1-BASE-OFFICIAL-CRAWLABILITY
  - FND-GEO-SITE-C1-BASE-OFFICIAL-META-DESCRIPTION-PRESENT
  - FND-GEO-SITE-C1-BASE-OFFICIAL-SCHEMA-SYNTAX
evidence_refs:
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-CANONICAL
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-CRAWLABILITY
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C1-BASE-OFFICIAL-SCHEMA-SYNTAX
asset_refs:
  - AST-GEO-E2E-C1-OFFICIAL
failure_reason: null
goal_refs:
  - GOAL-GEO-E2E-C1
query_set_versions:
  - ref: QS-GEO-E2E-C1
    version: 1.0.0
knowledge_release_versions:
  - ref: KR-GEO-E2E-C1
    version: 1.0.0
publication_refs: []
retest_of_refs: []
development_fixture: true
manifest_fingerprint: 9788322835c0b0c5fc0ead23fc51012ad17c18439a6309b6df41f8567078b288
detector_results:
  - code: HTTP_STATUS
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: HTTP 状态符合显式期望
  - code: CANONICAL
    state: fail
    rule_version: m4-site-detectors-v1.0.2
    message: canonical 缺失、非法或与显式目标不一致
  - code: ROBOTS
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: robots 未声明阻断目标路径
  - code: SITEMAP
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: sitemap 包含显式目标
  - code: SCHEMA_SYNTAX
    state: fail
    rule_version: m4-site-detectors-v1.0.2
    message: 未发现 JSON-LD
  - code: TITLE_PRESENT
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: title 非空
  - code: META_DESCRIPTION_PRESENT
    state: fail
    rule_version: m4-site-detectors-v1.0.2
    message: meta description 缺失或为空
  - code: HEADING_PRESENT
    state: pass
    rule_version: m4-site-detectors-v1.0.2
    message: heading 非空
  - code: CRAWLABILITY
    state: fail
    rule_version: m4-site-detectors-v1.0.2
    message: 至少一个确定性 crawlability 条件失败
---
# Run RUN-GEO-SITE-C1-BASE-OFFICIAL
