---
id: RUN-GEO-SITE-C2-AFTER-OFFICIAL
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
record_type: run
status: completed
version: 1.0.0
created_at: '2026-10-03T00:00:00.000Z'
updated_at: '2026-10-03T00:00:00.000Z'
title: geo-site Technical Retest
skill: geo-site-technical-retest
skill_version: 1.0.0
input_refs:
  - AST-GEO-E2E-C2-OFFICIAL
  - GOAL-GEO-E2E-C2
  - KR-GEO-E2E-C2
  - PUB-GEO-C2-OFFICIAL-V2-CONFIRMED
  - QS-GEO-E2E-C2
  - SRC-GEO-SITE-C2-OFFICIAL
input_versions:
  AST-GEO-E2E-C2-OFFICIAL: 1.0.0
  GOAL-GEO-E2E-C2: 1.0.0
  KR-GEO-E2E-C2: 1.0.0
  PUB-GEO-C2-OFFICIAL-V2-CONFIRMED: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
  SRC-GEO-SITE-C2-OFFICIAL: 1.0.0
input_fingerprint: c50204b2a277c6e3befd0fd114bb685793bf4ec27536f842196a78150944b23c
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
finding_refs: []
evidence_refs: []
asset_refs:
  - AST-GEO-E2E-C2-OFFICIAL
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
  - PUB-GEO-C2-OFFICIAL-V2-CONFIRMED
retest_of_refs: []
development_fixture: true
manifest_fingerprint: 7a5362edc6459756f1d846e017ce471c1be7cc278e11107ae65834bc508fc15a
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
# Run RUN-GEO-SITE-C2-AFTER-OFFICIAL
