export const perplexityAdapter = Object.freeze({
  id: 'perplexity-consumer-guard',
  platform: 'perplexity',
  version: 'm5-perplexity-manual-v2',
  product_entries: ['https://www.perplexity.ai/'],
  selector_version: 'disabled-by-policy-v1',
  terminal_detector_version: 'manual-evidence-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'collector_log'],
  automation: {
    status: 'manual_only',
    reason: 'Perplexity consumer Terms prohibit bot/scraper/automatic collection; Query testing runs through the GEO Browser Extension manual assist under Owner control.',
    policy_url: 'https://www.perplexity.ai/hub/legal/terms-of-service',
    checked_at: '2026-08-26',
  },
  manual_fallback: {
    allowed: true,
    mode: 'extension_manual_assist',
    allowed_source_kinds: ['user_supplied_export', 'user_supplied_result_url'],
    result_url_origins: ['https://www.perplexity.ai'],
    requirements: [
      'Owner-controlled browser via GEO Browser Extension manual assist',
      'complete answer and Citation raw',
      'a previously supplied export artifact or exact result URL keeps its checksum frozen before ingestion',
      'no automated Query submission or unrestricted browsing',
    ],
  },
  stop_conditions: ['challenge', 'account_warning', 'terms_change', 'privacy_minimization_failed'],
});
