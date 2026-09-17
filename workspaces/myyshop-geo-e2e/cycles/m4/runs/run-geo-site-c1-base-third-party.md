---
id: RUN-GEO-SITE-C1-BASE-THIRD-PARTY
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
record_type: run
status: completed
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: geo-site audit
skill: geo-site
skill_version: 1.0.0
input_refs:
  - AST-GEO-E2E-C1-THIRD-PARTY
  - GOAL-GEO-E2E-C1
  - KR-GEO-E2E-C1
  - QS-GEO-E2E-C1
  - SRC-GEO-SITE-C1-THIRD-PARTY
input_versions:
  AST-GEO-E2E-C1-THIRD-PARTY: 1.0.0
  GOAL-GEO-E2E-C1: 1.0.0
  KR-GEO-E2E-C1: 1.0.0
  QS-GEO-E2E-C1: 1.0.0
  SRC-GEO-SITE-C1-THIRD-PARTY: 1.0.0
input_fingerprint: 72f810d653b6bda488898133a4a5cf11f8b3fd98b5c68781553a49c5c62918a4
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
  - FND-GEO-SITE-C1-BASE-THIRD-PARTY-CANONICAL
  - FND-GEO-SITE-C1-BASE-THIRD-PARTY-CRAWLABILITY
  - FND-GEO-SITE-C1-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
  - FND-GEO-SITE-C1-BASE-THIRD-PARTY-SCHEMA-SYNTAX
evidence_refs:
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CANONICAL
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CRAWLABILITY
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
  - EVD-GEO-SITE-C1-BASE-THIRD-PARTY-SCHEMA-SYNTAX
asset_refs:
  - AST-GEO-E2E-C1-THIRD-PARTY
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
manifest_fingerprint: edd01d1f872b02f07f360799dbcccb1fdda9d754822e380d514cc1d86e1db590
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
# Run RUN-GEO-SITE-C1-BASE-THIRD-PARTY
