---
id: AGG-EXAMPLE-001
record_type: answer_aggregation
status: draft
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
title: Answer Aggregation 示例
purpose: baseline
industry: example
platform: chatgpt
query_cluster:
  id: QC-EXAMPLE-001
  label: 示例 Query Cluster
  query_versions:
    - ref: Q-EXAMPLE-001
      version: 1.0.0
time_window:
  id: TW-EXAMPLE-001
  starts_at: 2026-01-01T00:00:00Z
  ends_at: 2026-01-02T00:00:00Z
profile_versions:
  - ref: CPF-EXAMPLE-001
    version: 1.0.0
selected_sample_versions:
  - slot_key: "0000000000000000000000000000000000000000000000000000000000000000"
    ref: SMP-EXAMPLE-001
    version: 1.0.0
    raw_manifest_sha256: "0000000000000000000000000000000000000000000000000000000000000000"
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-EXAMPLE-001
    version: 1.0.0
    rubric_sha256: "0000000000000000000000000000000000000000000000000000000000000000"
comparability:
  result: partial
  field_differences: []
  notes: [示例 Profile 含 unknown]
metrics: {}
---
# Answer Aggregation 模板
