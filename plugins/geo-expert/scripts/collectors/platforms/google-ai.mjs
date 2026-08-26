export const googleAiAdapter = Object.freeze({
  id: 'google-ai-consumer-guard',
  platform: 'google_ai',
  version: 'm5-google-ai-guard-v1',
  product_entries: ['https://www.google.com/search'],
  selector_version: 'disabled-by-robots-v1',
  terminal_detector_version: 'manual-evidence-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'screenshot', 'collector_log'],
  automation: {
    status: 'terms_blocked',
    reason: 'Google Terms require following machine-readable instructions; google.com/robots.txt disallows /search for generic user agents.',
    policy_url: 'https://www.google.com/robots.txt',
    checked_at: '2026-08-25',
  },
  manual_fallback: {
    allowed: false,
    requirements: ['Platform Terms and robots guard must be resolved before collection'],
  },
  stop_conditions: ['challenge', 'account_warning', 'ai_mode_unavailable', 'terms_change'],
});
