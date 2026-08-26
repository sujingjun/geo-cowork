export const perplexityAdapter = Object.freeze({
  id: 'perplexity-consumer-guard',
  platform: 'perplexity',
  version: 'm5-perplexity-guard-v1',
  product_entries: ['https://www.perplexity.ai/'],
  selector_version: 'disabled-by-policy-v1',
  terminal_detector_version: 'disabled-by-policy-v1',
  allowed_artifacts: ['collector_log'],
  automation: {
    status: 'terms_blocked',
    reason: 'Perplexity consumer Terms prohibit bot/scraper/automatic collection and a manual process for the same purpose.',
    policy_url: 'https://www.perplexity.ai/hub/legal/terms-of-service',
    checked_at: '2026-08-25',
  },
  manual_fallback: {
    allowed: false,
    requirements: ['Platform Terms guard must be resolved before collection'],
  },
  stop_conditions: ['terms_blocked'],
});
