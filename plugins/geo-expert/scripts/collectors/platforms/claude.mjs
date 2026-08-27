export const claudeAdapter = Object.freeze({
  id: 'claude-consumer-guard',
  platform: 'claude',
  version: 'm5-claude-manual-v1',
  product_entries: ['https://claude.ai/new'],
  selector_version: 'disabled-by-policy-v1',
  terminal_detector_version: 'manual-evidence-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'screenshot', 'collector_log'],
  automation: {
    status: 'terms_blocked',
    reason: 'Anthropic Consumer Terms prohibit automated or non-human access outside an Anthropic API Key and prohibit crawl/scrape.',
    policy_url: 'https://www.anthropic.com/legal/consumer-terms',
    checked_at: '2026-08-26',
  },
  manual_fallback: {
    allowed: true,
    result_url_origins: ['https://claude.ai'],
    requirements: [
      'Owner-controlled browser',
      'manual Query submission and copy',
      'complete answer and Citation raw',
      'no automated or non-human access',
    ],
  },
  stop_conditions: ['challenge', 'account_warning', 'terms_change', 'privacy_minimization_failed'],
});
