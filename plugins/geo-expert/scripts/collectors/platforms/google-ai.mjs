export const googleAiAdapter = Object.freeze({
  id: 'google-ai-consumer-guard',
  platform: 'google_ai',
  version: 'm5-google-ai-manual-v2',
  product_entries: ['https://www.google.com/search'],
  selector_version: 'disabled-by-robots-v1',
  terminal_detector_version: 'manual-evidence-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'screenshot', 'collector_log'],
  automation: {
    status: 'manual_only',
    reason: 'Google Terms require following machine-readable instructions; google.com/robots.txt disallows /search for generic user agents. Query testing runs through the GEO Browser Extension manual assist.',
    policy_url: 'https://www.google.com/robots.txt',
    checked_at: '2026-08-26',
  },
  manual_fallback: {
    allowed: true,
    mode: 'extension_manual_assist',
    result_url_origins: ['https://share.google', 'https://www.google.com'],
    requirements: [
      'Owner-controlled browser via GEO Browser Extension manual assist',
      'complete visible answer and Citation raw',
      'no automated /search access',
    ],
  },
  stop_conditions: ['challenge', 'account_warning', 'ai_mode_unavailable', 'terms_change'],
});
