import { chatgptAdapter } from './chatgpt.mjs';
import { claudeAdapter } from './claude.mjs';
import { geminiAdapter } from './gemini.mjs';
import { googleAiAdapter } from './google-ai.mjs';
import { perplexityAdapter } from './perplexity.mjs';

const ADAPTERS = new Map([
  chatgptAdapter,
  claudeAdapter,
  geminiAdapter,
  googleAiAdapter,
  perplexityAdapter,
].map((adapter) => [adapter.platform, adapter]));

export const PLATFORM_IDS = Object.freeze([...ADAPTERS.keys()].sort());

export class PlatformAdapterError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PlatformAdapterError';
    this.code = code;
    Object.assign(this, details);
  }
}

function validateAdapter(adapter) {
  const required = [
    'id', 'platform', 'version', 'product_entries', 'selector_version',
    'terminal_detector_version', 'allowed_artifacts', 'automation',
    'manual_fallback', 'stop_conditions',
  ];
  const missing = required.filter((field) => adapter[field] === undefined);
  if (missing.length > 0 || adapter.product_entries.length === 0
      || !['allowed', 'terms_blocked', 'manual_only'].includes(adapter.automation.status)) {
    throw new PlatformAdapterError('PLATFORM_ADAPTER_INVALID', '平台 adapter 合同不完整', {
      platform: adapter.platform,
      missing,
    });
  }
  return adapter;
}

export function getPlatformAdapter(platform) {
  const adapter = ADAPTERS.get(platform);
  if (!adapter) {
    throw new PlatformAdapterError('PLATFORM_ADAPTER_NOT_FOUND', '未注册的平台 adapter', {
      platform,
    });
  }
  return validateAdapter(adapter);
}

export function assertPlatformAutomationAllowed(adapter) {
  validateAdapter(adapter);
  if (adapter.automation.status !== 'allowed') {
    throw new PlatformAdapterError('PLATFORM_TERMS_BLOCKED', adapter.automation.reason, {
      platform: adapter.platform,
      automation_status: adapter.automation.status,
      policy_url: adapter.automation.policy_url,
      manual_fallback_allowed: adapter.manual_fallback.allowed,
    });
  }
  return adapter;
}

export function assertPlatformManualAllowed(adapter, { manualSourceKind } = {}) {
  validateAdapter(adapter);
  const allowedKinds = adapter.manual_fallback.allowed_source_kinds;
  if (!adapter.manual_fallback.allowed
      || (Array.isArray(allowedKinds) && !allowedKinds.includes(manualSourceKind))) {
    throw new PlatformAdapterError(
      'PLATFORM_MANUAL_COLLECTION_BLOCKED',
      '平台 manual collection 未获允许',
      {
        platform: adapter.platform,
        policy_url: adapter.automation.policy_url,
        manual_mode: adapter.manual_fallback.mode ?? 'owner_manual',
        requirements: adapter.manual_fallback.requirements,
      },
    );
  }
  return adapter;
}
