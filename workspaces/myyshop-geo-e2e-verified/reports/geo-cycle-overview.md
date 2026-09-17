# GEO 演练报告

本工作区为 synthetic/test_only。提取与语义处理使用真实 DeepSeek；发布仅发生在隔离本地演练环境。本文证明工程行为，不代表真实品牌事实或业务提升。

## 1. 知识维护

[Knowledge index](../knowledge/README.md)
- 02-brand-identity / Definition: supported input
- 02-brand-identity / Legacy identity: supported input
- 03-positioning-strategy / Positioning: supported input
- 03-positioning-strategy / Non-goals: supported input
- 04-audience-lifecycle / Eligibility: supported input
- 04-audience-lifecycle / Onboarding: supported input
- 05-products-services / Supported capability: supported input
- 05-products-services / Capability boundary: supported input
- 06-commercial-rules / Fees: supported input
- 06-commercial-rules / Refunds: supported input
- 07-trust-safety / Privacy: supported input
- 07-trust-safety / Risk boundaries: supported input
- 08-proof-authority / Case study: supported input
- 08-proof-authority / Unproven growth: evidence missing
- 09-voice-messaging / Preferred wording: supported input
- 09-voice-messaging / Expired wording: superseded
- 10-query-answer-cards / Definition answer: supported input
- 10-query-answer-cards / Comparison dimensions: supported input

Detected raw-input changes: 0. Frozen canonical inputs remain unchanged.

## 2. 周期与候选问题

### Cycle 1: review_decided
- Status: completed; completion: full
- Frozen set: [Frozen rehearsal questions](../queries/sets/qs-geo-e2e-c1.md)
- [Does the MyyShop rehearsal guarantee income or AI placement, and how are report data and privacy handled?](../queries/candidates/q-does-the-myyshop-rehearsal-guarantee-en-f889.md) — Does the MyyShop rehearsal guarantee income or AI placement, and how are report data and privacy handled?
- [How can I compare the MyyShop rehearsal service with other creator campaign services?](../queries/candidates/q-how-can-i-compare-the-en-b48d.md) — How can I compare the MyyShop rehearsal service with other creator campaign services?
- [What are the MyyShop rehearsal fees, trial length, cancellation and refund rules?](../queries/candidates/q-what-are-the-myyshop-rehearsal-en-3bc4.md) — What are the MyyShop rehearsal fees, trial length, cancellation and refund rules?
- [What capabilities does the MyyShop rehearsal support, and what automation or fulfillment is unavailable?](../queries/candidates/q-what-capabilities-does-the-myyshop-en-2de3.md) — What capabilities does the MyyShop rehearsal support, and what automation or fulfillment is unavailable?
- [What is the MyyShop rehearsal service, and who is it designed for?](../queries/candidates/q-what-is-the-myyshop-rehearsal-en-2b21.md) — What is the MyyShop rehearsal service, and who is it designed for?
- [Who is eligible to use the MyyShop rehearsal, and what onboarding steps apply?](../queries/candidates/q-who-is-eligible-to-use-en-1531.md) — Who is eligible to use the MyyShop rehearsal, and what onboarding steps apply?
- Baseline slots: 60; retest slots: 60

### Cycle 2: review_decided
- Status: completed; completion: full
- Frozen set: [Frozen rehearsal questions](../queries/sets/qs-geo-e2e-c2.md)
- [How should an eligible creator compare the MyyShop rehearsal with other creator campaign services by eligibility, workflow, fees, evidence, and limitations?](../queries/candidates/q-how-should-an-eligible-creator-en-d279.md) — How should an eligible creator compare the MyyShop rehearsal with other creator campaign services by eligibility, workflow, fees, evidence, and limitations?
- [What are the MyyShop rehearsal fees, trial terms, and cancellation or refund rules?](../queries/candidates/q-what-are-the-myyshop-rehearsal-en-57d1.md) — What are the MyyShop rehearsal fees, trial terms, and cancellation or refund rules?
- [What capabilities does the MyyShop rehearsal support, including campaign discovery, applications, reports, and automatic acceptance limits?](../queries/candidates/q-what-capabilities-does-the-myyshop-en-747a.md) — What capabilities does the MyyShop rehearsal support, including campaign discovery, applications, reports, and automatic acceptance limits?
- [What evidence limits, privacy boundaries, and income or AI placement guarantees apply to the MyyShop rehearsal?](../queries/candidates/q-what-evidence-limits-privacy-boundaries-en-ab42.md) — What evidence limits, privacy boundaries, and income or AI placement guarantees apply to the MyyShop rehearsal?
- [What is the MyyShop rehearsal service as defined in the synthetic test knowledge base?](../queries/candidates/q-what-is-the-myyshop-rehearsal-en-b7a5.md) — What is the MyyShop rehearsal service as defined in the synthetic test knowledge base?
- [Who is eligible to join the MyyShop rehearsal as a creator, and what onboarding requirements apply?](../queries/candidates/q-who-is-eligible-to-join-en-8e8a.md) — Who is eligible to join the MyyShop rehearsal as a creator, and what onboarding requirements apply?
- Baseline slots: 60; retest slots: 60

## 3. 答案观察与分析

- [Answer Aggregation AGG-GEO-C1-AFTER-Q1-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-after-q1-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q1-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-after-q1-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q1-GEMINI](../cycles/m5/aggregations/agg-geo-c1-after-q1-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q1-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-after-q1-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q1-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-after-q1-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q2-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-after-q2-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q2-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-after-q2-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q2-GEMINI](../cycles/m5/aggregations/agg-geo-c1-after-q2-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q2-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-after-q2-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q2-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-after-q2-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q3-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-after-q3-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q3-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-after-q3-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q3-GEMINI](../cycles/m5/aggregations/agg-geo-c1-after-q3-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q3-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-after-q3-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q3-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-after-q3-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q4-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-after-q4-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q4-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-after-q4-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q4-GEMINI](../cycles/m5/aggregations/agg-geo-c1-after-q4-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q4-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-after-q4-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q4-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-after-q4-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q5-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-after-q5-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q5-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-after-q5-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q5-GEMINI](../cycles/m5/aggregations/agg-geo-c1-after-q5-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q5-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-after-q5-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q5-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-after-q5-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q6-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-after-q6-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q6-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-after-q6-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q6-GEMINI](../cycles/m5/aggregations/agg-geo-c1-after-q6-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q6-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-after-q6-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-AFTER-Q6-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-after-q6-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q1-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-base-q1-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q1-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-base-q1-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q1-GEMINI](../cycles/m5/aggregations/agg-geo-c1-base-q1-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q1-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-base-q1-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q1-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-base-q1-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q2-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-base-q2-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q2-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-base-q2-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q2-GEMINI](../cycles/m5/aggregations/agg-geo-c1-base-q2-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q2-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-base-q2-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q2-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-base-q2-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q3-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-base-q3-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q3-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-base-q3-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q3-GEMINI](../cycles/m5/aggregations/agg-geo-c1-base-q3-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q3-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-base-q3-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q3-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-base-q3-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q4-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-base-q4-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q4-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-base-q4-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q4-GEMINI](../cycles/m5/aggregations/agg-geo-c1-base-q4-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q4-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-base-q4-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q4-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-base-q4-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q5-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-base-q5-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q5-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-base-q5-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q5-GEMINI](../cycles/m5/aggregations/agg-geo-c1-base-q5-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q5-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-base-q5-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q5-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-base-q5-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q6-CHATGPT](../cycles/m5/aggregations/agg-geo-c1-base-q6-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q6-CLAUDE](../cycles/m5/aggregations/agg-geo-c1-base-q6-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q6-GEMINI](../cycles/m5/aggregations/agg-geo-c1-base-q6-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q6-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c1-base-q6-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C1-BASE-Q6-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c1-base-q6-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q1-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-after-q1-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q1-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-after-q1-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q1-GEMINI](../cycles/m5/aggregations/agg-geo-c2-after-q1-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q1-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-after-q1-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q1-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-after-q1-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q2-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-after-q2-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q2-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-after-q2-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q2-GEMINI](../cycles/m5/aggregations/agg-geo-c2-after-q2-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q2-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-after-q2-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q2-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-after-q2-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q3-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-after-q3-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q3-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-after-q3-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q3-GEMINI](../cycles/m5/aggregations/agg-geo-c2-after-q3-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q3-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-after-q3-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q3-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-after-q3-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q4-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-after-q4-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q4-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-after-q4-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q4-GEMINI](../cycles/m5/aggregations/agg-geo-c2-after-q4-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q4-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-after-q4-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q4-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-after-q4-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q5-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-after-q5-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q5-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-after-q5-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q5-GEMINI](../cycles/m5/aggregations/agg-geo-c2-after-q5-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q5-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-after-q5-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q5-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-after-q5-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q6-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-after-q6-chatgpt.md) — chatgpt, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q6-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-after-q6-claude.md) — claude, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q6-GEMINI](../cycles/m5/aggregations/agg-geo-c2-after-q6-gemini.md) — gemini, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q6-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-after-q6-google-ai.md) — google_ai, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-AFTER-Q6-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-after-q6-perplexity.md) — perplexity, post_change_retest, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q1-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-base-q1-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q1-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-base-q1-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q1-GEMINI](../cycles/m5/aggregations/agg-geo-c2-base-q1-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q1-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-base-q1-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q1-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-base-q1-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q2-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-base-q2-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q2-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-base-q2-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q2-GEMINI](../cycles/m5/aggregations/agg-geo-c2-base-q2-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q2-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-base-q2-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q2-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-base-q2-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q3-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-base-q3-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q3-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-base-q3-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q3-GEMINI](../cycles/m5/aggregations/agg-geo-c2-base-q3-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q3-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-base-q3-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q3-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-base-q3-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q4-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-base-q4-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q4-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-base-q4-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q4-GEMINI](../cycles/m5/aggregations/agg-geo-c2-base-q4-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q4-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-base-q4-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q4-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-base-q4-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q5-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-base-q5-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q5-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-base-q5-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q5-GEMINI](../cycles/m5/aggregations/agg-geo-c2-base-q5-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q5-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-base-q5-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q5-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-base-q5-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q6-CHATGPT](../cycles/m5/aggregations/agg-geo-c2-base-q6-chatgpt.md) — chatgpt, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q6-CLAUDE](../cycles/m5/aggregations/agg-geo-c2-base-q6-claude.md) — claude, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q6-GEMINI](../cycles/m5/aggregations/agg-geo-c2-base-q6-gemini.md) — gemini, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q6-GOOGLE-AI](../cycles/m5/aggregations/agg-geo-c2-base-q6-google-ai.md) — google_ai, baseline, 2 slots; raw and reviewed lineage are pinned.
- [Answer Aggregation AGG-GEO-C2-BASE-Q6-PERPLEXITY](../cycles/m5/aggregations/agg-geo-c2-base-q6-perplexity.md) — perplexity, baseline, 2 slots; raw and reviewed lineage are pinned.

## 4. 内容、证据与产品缺口

- [The asset only states 'Campaign opportunities.' Current knowledge defines the rehearsal as an adult creator campaign service with explicit eligibility and no income or AI-placement guarantee; the page omits that required definition, eligibility, no-guarantee, and transparent-requirements positioning.](../findings/fnd-geo-c1-official-1.md) — content_gap; waiting_human. Request a correction from the page owner to add approved definition, eligibility, and no-guarantee language; do not publish directly as an authority.
- [The asset does not describe supported workflow (discovery, application, aggregate reports), onboarding, privacy handling, fees/trial/cancellation/refund, automation limits, non-goals, or comparison criteria that current knowledge supplies for these queries.](../findings/fnd-geo-c1-official-2.md) — content_gap; waiting_human. Request an update to the official external page adding the approved operational and limitation details; no publish authority claimed.
- [The supplied historical wording claims guaranteed income, but current knowledge states the rehearsal cannot guarantee income and prioritizes transparent requirements over guaranteed earnings.](../findings/fnd-geo-c1-official-3.md) — content_gap; waiting_human. Request correction of the historical guide to remove or replace guaranteed-income wording with approved no-guarantee language.
- [The proposed income-growth claim is unresolved and lacks approved supporting evidence, so it cannot be supported by current knowledge.](../findings/fnd-geo-c1-official-4.md) — evidence_gap; waiting_human. Obtain approved evidence or remove the proposed growth claim; if external, route a correction request to the owner.
- [The asset labels the rehearsal as a wholesale marketplace, but current knowledge states the rehearsal service is not a wholesale marketplace and should be described as an adult creator campaign service with explicit eligibility.](../findings/fnd-geo-c1-own-1.md) — content_gap; waiting_human. Recommend correcting the page to describe the rehearsal as an adult creator campaign service, not a wholesale marketplace.
- [The asset promises guaranteed income, but current knowledge states the rehearsal cannot guarantee income or placement and prioritizes transparent campaign requirements over guaranteed earnings.](../findings/fnd-geo-c1-own-2.md) — content_gap; waiting_human. Recommend removing the income guarantee and replacing it with a statement that the rehearsal cannot guarantee income or placement, plus clear eligibility or campaign requirements.
- [Current knowledge states the rehearsal is not a wholesale marketplace and is an adult creator campaign service, so the asset's wholesale positioning is outdated and contradicts supported knowledge.](../findings/fnd-geo-c1-third-party-1.md) — content_gap; waiting_human. Recommend a correction request to the third-party publisher to replace or remove the wholesale-provider wording; do not claim authority to publish.
- [Current knowledge says the rehearsal cannot guarantee income and prioritizes transparent campaign requirements over guaranteed earnings, so this historical guaranteed-income wording is superseded.](../findings/fnd-geo-c1-third-party-2.md) — content_gap; waiting_human. Recommend a correction request to update or remove guaranteed-income wording from the historical guide; do not claim authority to publish or approve the change.
- [The proposed growth claim lacks approved supporting evidence and conflicts with the no-income-guarantee knowledge, so it cannot be used without proof.](../findings/fnd-geo-c1-third-party-3.md) — evidence_gap; waiting_human. Obtain approved evidence or remove the claim; do not approve it.
- [The asset is titled as an eligibility and evidence FAQ, and the supplied knowledge defines supported eligibility, onboarding, evidence-boundary, privacy, guarantee, and positioning content. The page body defers details instead of presenting those supported answers, so it does not answer the FAQ purpose.](../findings/fnd-geo-c2-own-1.md) — content_gap; waiting_human. Replace the placeholder with concise FAQ content drawn only from the cited claims; do not add unproven growth or guaranteed-income wording.
- [The unresolved input identifies a proposed income-growth claim without approved evidence, while supplied knowledge states the rehearsal cannot guarantee income and prioritizes transparent campaign requirements over guaranteed earnings.](../findings/fnd-geo-c2-own-2.md) — evidence_gap; waiting_human. Keep the income-growth claim out of the asset unless approved evidence is supplied; do not approve the claim.
- [The third-party page uses outdated wholesale positioning and signals unchecked details. Current knowledge states the rehearsal service is not a wholesale marketplace and instead connects adult creators with simulated brand campaigns, described as an adult creator campaign service with explicit eligibility and no income guarantee.](../findings/fnd-geo-c2-third-party-1.md) — content_gap; waiting_human. Issue a correction request to the third-party publisher to align the page with the approved rehearsal definition; do not claim authority to publish or approve the correction.

- Evidence task: [Evidence acquisition task](../evidence/plans/epl-geo-c1-official-4.md); owner: Knowledge evidence Owner
- Evidence task: [Evidence acquisition task](../evidence/plans/epl-geo-c1-third-party-3.md); owner: Knowledge evidence Owner
- Evidence task: [Evidence acquisition task](../evidence/plans/epl-geo-c2-own-2.md); owner: Knowledge evidence Owner

## 5. 自有与外部资产建议

- [official evidence-backed proposal](../assets/proposals/prp-geo-c1-official.md) — official_external
- [own evidence-backed proposal](../assets/proposals/prp-geo-c1-own.md) — own
- [third-party evidence-backed proposal](../assets/proposals/prp-geo-c1-third-party.md) — media
- [own evidence-backed proposal](../assets/proposals/prp-geo-c2-own.md) — own
- [third-party evidence-backed proposal](../assets/proposals/prp-geo-c2-third-party.md) — media

## 6. 采用与发布反馈

- [Adoption for PRP-GEO-C1-OFFICIAL](../assets/adoptions/adr-geo-c1-official.md) — draft
- [Adoption for PRP-GEO-C1-OFFICIAL](../assets/adoptions/adr-geo-c1-official-decided.md) — decided
- [Adoption for PRP-GEO-C1-OWN](../assets/adoptions/adr-geo-c1-own.md) — draft
- [Adoption for PRP-GEO-C1-OWN](../assets/adoptions/adr-geo-c1-own-decided.md) — decided
- [Adoption for PRP-GEO-C1-THIRD-PARTY](../assets/adoptions/adr-geo-c1-third-party.md) — draft
- [Adoption for PRP-GEO-C1-THIRD-PARTY](../assets/adoptions/adr-geo-c1-third-party-decided.md) — decided
- [Adoption for PRP-GEO-C2-OWN](../assets/adoptions/adr-geo-c2-own.md) — draft
- [Adoption for PRP-GEO-C2-OWN](../assets/adoptions/adr-geo-c2-own-decided.md) — decided
- [Adoption for PRP-GEO-C2-THIRD-PARTY](../assets/adoptions/adr-geo-c2-third-party.md) — draft
- [Adoption for PRP-GEO-C2-THIRD-PARTY](../assets/adoptions/adr-geo-c2-third-party-decided.md) — decided
- [Awaiting simulated publication attestation](../assets/publications/pub-geo-c1-official-v2.md) — draft
- [Awaiting simulated publication attestation](../assets/publications/pub-geo-c1-official-v2-confirmed.md) — confirmed
- [Awaiting simulated publication attestation](../assets/publications/pub-geo-c1-own-v2.md) — draft
- [Awaiting simulated publication attestation](../assets/publications/pub-geo-c1-own-v2-confirmed.md) — confirmed
- [Awaiting simulated publication attestation](../assets/publications/pub-geo-c2-own-v2.md) — draft
- [Awaiting simulated publication attestation](../assets/publications/pub-geo-c2-own-v2-confirmed.md) — confirmed

## 7. 技术与平台复测

- [geo-site Technical Retest](../cycles/m4/runs/run-geo-site-c1-after-official.md) — 9 passed checks; remaining results retained.
- [geo-site Technical Retest](../cycles/m4/runs/run-geo-site-c1-after-own.md) — 9 passed checks; remaining results retained.
- [geo-site Technical Retest](../cycles/m4/runs/run-geo-site-c2-after-own.md) — 9 passed checks; remaining results retained.

## 8. Analytics 与业务观察

- [Synthetic Business Signal](../cycles/m6/analytics/bsig-geo-c1.md) — no_signal; value 0; non-causal.
- [Synthetic Business Signal](../cycles/m6/analytics/bsig-geo-c2.md) — no_signal; value 0; non-causal.

## 9. 周期复盘与下一目标

- [Synthetic Cycle Review](../cycles/m6/reviews/crv-geo-c1-decided.md) — decided
- [Synthetic Cycle Review](../cycles/m6/reviews/crv-geo-c1-waiting.md) — waiting_human
- [Synthetic Cycle Review](../cycles/m6/reviews/crv-geo-c2-decided.md) — decided
- [Synthetic Cycle Review](../cycles/m6/reviews/crv-geo-c2-waiting.md) — waiting_human
- [Synthetic cycle goal candidate](../cycles/m7/candidates/gcd-0183096edf1f038092e4e492.md) — candidate
- [Synthetic Cycle Goal Selection](../cycles/m7/selections/gsel-3f302fc0e6aa39a5d985ec3a.md) — draft
- [Synthetic Cycle Goal Selection](../cycles/m7/selections/gsel-a18d06e7678118fd783fd185.md) — decided

## 待审核事项

当前没有未回复的审核包。
