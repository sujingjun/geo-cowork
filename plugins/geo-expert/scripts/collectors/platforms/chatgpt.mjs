export const chatgptAdapter = Object.freeze({
  id: 'chatgpt-consumer-guard',
  platform: 'chatgpt',
  version: 'm5-chatgpt-guard-v1',
  product_entries: ['https://chatgpt.com/'],
  selector_version: 'disabled-by-policy-v1',
  terminal_detector_version: 'manual-evidence-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'screenshot', 'collector_log'],
  automation: {
    status: 'terms_blocked',
    reason: 'OpenAI consumer Terms prohibit automatically or programmatically extracting data or Output.',
    policy_url: 'https://openai.com/policies/terms-of-use/',
    checked_at: '2026-08-25',
  },
  manual_fallback: {
    allowed: true,
    requirements: ['Owner-controlled browser', 'Temporary Chat preferred', 'complete answer and Citation raw'],
  },
  stop_conditions: ['challenge', 'account_warning', 'terms_change', 'privacy_minimization_failed'],
});
