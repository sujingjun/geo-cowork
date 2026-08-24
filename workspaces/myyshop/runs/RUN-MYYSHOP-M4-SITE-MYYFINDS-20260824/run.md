---
id: RUN-MYYSHOP-M4-SITE-MYYFINDS-20260824
record_type: run
status: completed
version: 1.0.0
created_at: '2026-08-24T20:32:46+08:00'
updated_at: '2026-08-24T20:32:46+08:00'
title: geo-site audit
skill: geo-site
skill_version: 1.0.0
input_refs:
  - AST-MYYSHOP-MYYFINDS-001
  - CLM-MYYSHOP-AUDIENCE-001
  - CLM-MYYSHOP-LIFECYCLE-SERVICE-001
  - GOAL-MYYSHOP-DEFINITION-001
  - KR-MYYSHOP-DEFINITION-001
  - QS-MYYSHOP-DEFINITION-001
  - SRC-MYYSHOP-WEB-MYYFINDS-001
input_versions:
  AST-MYYSHOP-MYYFINDS-001: 1.0.0
  CLM-MYYSHOP-AUDIENCE-001: 1.0.1
  CLM-MYYSHOP-LIFECYCLE-SERVICE-001: 1.0.1
  GOAL-MYYSHOP-DEFINITION-001: 1.0.1
  KR-MYYSHOP-DEFINITION-001: 1.0.1
  QS-MYYSHOP-DEFINITION-001: 1.0.1
  SRC-MYYSHOP-WEB-MYYFINDS-001: 1.0.0
input_fingerprint: c962c2bdefedacea98b869b7032a12aa2b14c58484d80b11b13947d766b39e2f
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
  - AST-MYYSHOP-MYYFINDS-001
failure_reason: null
goal_refs:
  - GOAL-MYYSHOP-DEFINITION-001
query_set_versions:
  - ref: QS-MYYSHOP-DEFINITION-001
    version: 1.0.1
knowledge_release_versions:
  - ref: KR-MYYSHOP-DEFINITION-001
    version: 1.0.1
publication_refs: []
retest_of_refs: []
development_fixture: false
manifest_fingerprint: be2a2876eb5e9324b5c11b0b23340b282d91bc58cccd6f8db4aaeb0958e48477
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
# Run RUN-MYYSHOP-M4-SITE-MYYFINDS-20260824
