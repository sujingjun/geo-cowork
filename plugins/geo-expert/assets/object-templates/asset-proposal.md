---
id: PRP-EXAMPLE-001
record_type: asset_proposal
status: draft
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
title: Asset Proposal 示例
asset_ref: AST-EXAMPLE-001
goal_refs: [GOAL-EXAMPLE-001]
query_refs: [Q-EXAMPLE-001]
finding_refs: [FND-EXAMPLE-001]
knowledge_release_versions:
  - ref: KR-EXAMPLE-001
    version: 1.0.0
claim_versions:
  - ref: CLM-EXAMPLE-001
    version: 1.0.0
evidence_refs: [EVD-EXAMPLE-001]
body_sha256: 7d090d4eca1406c46ee39ed6c137d23f9dc416ae3c15fcc2878d9e4c4dbd4186
recommendation_items:
  - item_id: REC-EXAMPLE-001
    section: Asset Proposal 模板
    action: 待填写完整建议
    claim_refs: [CLM-EXAMPLE-001]
    evidence_refs: [EVD-EXAMPLE-001]
    finding_refs: [FND-EXAMPLE-001]
    risk:
      level: high
      type: unapproved_claim
      reason: 示例 Claim 尚未验证
      suggested_weakening: 仅描述已取得 Evidence 的范围
---
# Asset Proposal 模板

完整建议稿待填写。
