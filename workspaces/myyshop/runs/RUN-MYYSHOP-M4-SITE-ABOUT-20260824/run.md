---
id: RUN-MYYSHOP-M4-SITE-ABOUT-20260824
record_type: run
status: completed
version: 1.0.0
created_at: '2026-08-24T20:32:46+08:00'
updated_at: '2026-08-24T20:32:46+08:00'
title: geo-site audit
skill: geo-site
skill_version: 1.0.0
input_refs:
  - AST-MYYSHOP-ABOUT-001
  - CLM-MYYSHOP-AUDIENCE-001
  - CLM-MYYSHOP-LIFECYCLE-SERVICE-001
  - GOAL-MYYSHOP-DEFINITION-001
  - KR-MYYSHOP-DEFINITION-001
  - QS-MYYSHOP-DEFINITION-001
  - SRC-MYYSHOP-WEB-ABOUT-001
input_versions:
  AST-MYYSHOP-ABOUT-001: 1.0.0
  CLM-MYYSHOP-AUDIENCE-001: 1.0.1
  CLM-MYYSHOP-LIFECYCLE-SERVICE-001: 1.0.1
  GOAL-MYYSHOP-DEFINITION-001: 1.0.1
  KR-MYYSHOP-DEFINITION-001: 1.0.1
  QS-MYYSHOP-DEFINITION-001: 1.0.1
  SRC-MYYSHOP-WEB-ABOUT-001: 1.0.0
input_fingerprint: 1871c98da82ca2021a01eed9b5f5541eeb79ebcc578c9703008756e9aad0e257
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
  - FND-MYYSHOP-SITE-ABOUT-20260824-CANONICAL
  - FND-MYYSHOP-SITE-ABOUT-20260824-CRAWLABILITY
  - FND-MYYSHOP-SITE-ABOUT-20260824-HEADING-PRESENT
evidence_refs:
  - EVD-MYYSHOP-SITE-ABOUT-20260824-CANONICAL
  - EVD-MYYSHOP-SITE-ABOUT-20260824-CRAWLABILITY
  - EVD-MYYSHOP-SITE-ABOUT-20260824-HEADING-PRESENT
asset_refs:
  - AST-MYYSHOP-ABOUT-001
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
manifest_fingerprint: 18356353bb4175e8da56416191a7808d4b2fb3119dd264e2fc252765eb21e967
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
    state: fail
    rule_version: m4-site-detectors-v1.0.2
    message: heading 缺失或为空
  - code: CRAWLABILITY
    state: fail
    rule_version: m4-site-detectors-v1.0.2
    message: 至少一个确定性 crawlability 条件失败
---
# Run RUN-MYYSHOP-M4-SITE-ABOUT-20260824
