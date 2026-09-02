export const geminiAdapter = Object.freeze({
  id: 'gemini-consumer-guard',
  platform: 'gemini',
  version: 'm5-gemini-guard-v2',
  product_entries: ['https://gemini.google.com/app'],
  selector_version: 'disabled-without-explicit-ui-automation-permission-v1',
  terminal_detector_version: 'manual-evidence-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'screenshot', 'collector_log'],
  automation: {
    status: 'manual_only',
    reason: 'No official consumer UI automation permission was established; protect the Owner Google account. Query testing runs through the GEO Browser Extension manual assist.',
    policy_url: 'https://policies.google.com/terms',
    checked_at: '2026-08-25',
  },
  manual_fallback: {
    allowed: true,
    mode: 'extension_manual_assist',
    result_url_origins: ['https://gemini.google.com', 'https://share.gemini.google'],
    requirements: [
      'Owner-controlled browser via GEO Browser Extension manual assist',
      'no Connected Apps',
      'complete answer and Citation raw',
    ],
  },
  stop_conditions: ['challenge', 'account_warning', 'region_unavailable', 'privacy_minimization_failed'],
});
