---
id: RUN-GEO-SITE-C2-BASE-OWN
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
record_type: run
status: completed
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: geo-site audit
skill: geo-site
skill_version: 1.0.0
input_refs:
  - AST-GEO-E2E-C2-OWN
  - GOAL-GEO-E2E-C2
  - KR-GEO-E2E-C2
  - QS-GEO-E2E-C2
  - SRC-GEO-SITE-C2-OWN
input_versions:
  AST-GEO-E2E-C2-OWN: 1.0.0
  GOAL-GEO-E2E-C2: 1.0.0
  KR-GEO-E2E-C2: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
  SRC-GEO-SITE-C2-OWN: 1.0.0
input_fingerprint: efc8ff97e78aa339c3628dc29e780306744e55ec44b39e4e543306f2582100a9
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
finding_refs: []
evidence_refs: []
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
publication_refs: []
retest_of_refs: []
development_fixture: true
manifest_fingerprint: 235ead72461d28b51cce2e267f3f92106c1ffa56c220e32c5198893452cdc5da
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
# Run RUN-GEO-SITE-C2-BASE-OWN
