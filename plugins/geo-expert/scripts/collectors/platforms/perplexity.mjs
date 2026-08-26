export const perplexityAdapter = Object.freeze({
  id: 'perplexity-consumer-guard',
  platform: 'perplexity',
  version: 'm5-perplexity-user-export-v1',
  product_entries: ['https://www.perplexity.ai/'],
  selector_version: 'disabled-by-policy-v1',
  terminal_detector_version: 'manual-export-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'collector_log'],
  automation: {
    status: 'terms_blocked',
    reason: 'Perplexity consumer Terms prohibit bot/scraper/automatic collection and a manual process for the same purpose.',
    policy_url: 'https://www.perplexity.ai/hub/legal/terms-of-service',
    checked_at: '2026-08-26',
  },
  manual_fallback: {
    allowed: true,
    mode: 'user_supplied_export_only',
    requirements: [
      'Owner supplies a platform-exported local artifact',
      'artifact filename and checksum are frozen before ingestion',
      'no Perplexity page access, browser extraction or manual copy by the Agent',
    ],
  },
  stop_conditions: ['terms_blocked', 'source_not_user_supplied_export', 'privacy_minimization_failed'],
});
