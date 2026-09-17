---
id: Q-DONNER-DES-V-TEMENTS-EN-09BA
record_type: query
status: candidate
version: 1.0.0
created_at: '2026-09-15T17:24:50.468Z'
updated_at: '2026-09-15T17:24:50.468Z'
title: donner des vêtements
query_text: donner des vêtements
language: en-US
normalized_text: donner des vêtements
intent: other
priority: P1
goal_refs:
  - GOAL-MYYSHOP-DEFINITION-001
discovery_source_refs:
  - SRC-QINPUT-6DBFF8510845433DC400
extensions:
  geo.qp_intake:
    rules:
      normalize: qp-normalize-v1
      intent: qp-intent-v1
      priority: qp-priority-v1
      cluster: qp-cluster-v1
      id: qp-id-v1
    sources:
      - ref: SRC-QINPUT-6DBFF8510845433DC400
        source_class: gsc_search_query
        observed_at: '2026-09-15T17:24:50.468Z'
---
# donner des vêtements
