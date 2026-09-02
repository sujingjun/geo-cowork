---
id: CPF-M6-TEST-001
record_type: collector_profile
status: frozen
version: 1.0.0
created_at: '2026-08-27T00:00:00Z'
updated_at: '2026-08-27T00:00:00Z'
title: Synthetic collector profile
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_myyshopdevtest000000000000
  knowledge_base_ref: KBASE-MYYSHOP-DEVTEST-001
platform: chatgpt
product_entry: 'https://consumer.dev-knowledge.invalid/chat'
region: US
language: en-US
login_state: logged_out
conversation_state: new
web_search_state: 'on'
model_mode: recorded-fixture
query_template_version: 1.0.0
sampling_count: 2
time_window:
  id: TW-M6-TEST-001
  starts_at: '2026-08-01T00:00:00Z'
  ends_at: '2026-08-08T00:00:00Z'
device:
  class: desktop
  os: fixture-os
  browser: fixture-browser
  viewport: 1280x720
collection_method: recorded_fixture
approval:
  approved_by: Fixture Human Reviewer
  approved_at: '2026-08-27T00:00:00Z'
  decision_ref: 'fixture://approval/m6-test-only-001'
profile_fingerprint: 9eadcf95690e5a64798e9dd33369e24c9f5b292bfd94fa7f92c53f31fcd32a47
---
# M6 synthetic fixture
