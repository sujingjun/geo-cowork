import type { BrowserPlatformAdapterRegistry } from '../../../shared/types/browser-query'

export const browserAdapterRegistry: BrowserPlatformAdapterRegistry = Object.freeze({
  fixture: {
    id: 'fixture-browser-query-adapter',
    version: '2.0.0',
    policyStatus: 'allowed',
    exactEntryUrls: ['http://127.0.0.1:9321/task'],
    resultUrlOrigins: ['http://127.0.0.1:9321'],
    selectorVersion: 'fixture-selectors-v2',
    terminalDetectorVersion: 'fixture-terminal-v2',
    selectors: {
      input: '#prompt',
      submit: '#submit',
      answer: '.answer',
      citation: '.answer a[href]',
      busy: '[aria-busy="true"]',
      loggedIn: '[data-login-state="logged-in"]',
      loggedOut: '[data-login-state="logged-out"]',
      timeoutMs: 30_000,
      stableMs: 500
    }
  },
  chatgpt: {
    id: 'chatgpt-consumer-guard',
    version: '1.0.0',
    policyStatus: 'manual_only',
    exactEntryUrls: ['https://chatgpt.com/'],
    resultUrlOrigins: ['https://chatgpt.com'],
    selectorVersion: 'disabled-by-policy-v1',
    terminalDetectorVersion: 'manual-evidence-v1'
  },
  gemini: {
    id: 'gemini-consumer-guard',
    version: '1.0.0',
    policyStatus: 'manual_only',
    exactEntryUrls: ['https://gemini.google.com/app'],
    resultUrlOrigins: ['https://gemini.google.com', 'https://share.gemini.google'],
    selectorVersion: 'disabled-without-explicit-ui-automation-permission-v1',
    terminalDetectorVersion: 'manual-evidence-v1'
  },
  perplexity: {
    id: 'perplexity-consumer-guard',
    version: '1.0.0',
    policyStatus: 'manual_only',
    exactEntryUrls: ['https://www.perplexity.ai/'],
    resultUrlOrigins: ['https://www.perplexity.ai'],
    selectorVersion: 'disabled-by-policy-v1',
    terminalDetectorVersion: 'manual-evidence-v1'
  },
  google_ai: {
    id: 'google-ai-consumer-guard',
    version: '1.0.0',
    policyStatus: 'manual_only',
    exactEntryUrls: ['https://www.google.com/search'],
    resultUrlOrigins: ['https://share.google', 'https://www.google.com'],
    selectorVersion: 'disabled-by-robots-v1',
    terminalDetectorVersion: 'manual-evidence-v1'
  },
  claude: {
    id: 'claude-consumer-guard',
    version: '1.0.0',
    policyStatus: 'manual_only',
    exactEntryUrls: ['https://claude.ai/new'],
    resultUrlOrigins: ['https://claude.ai'],
    selectorVersion: 'disabled-by-policy-v1',
    terminalDetectorVersion: 'manual-evidence-v1'
  }
})
