import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  validateGeoBrowserMcpConfig,
} from '../plugins/geo-expert/scripts/lib/plugin-mcp-config.mjs';

function validConfig() {
  return {
    mcpServers: {
      'geo-browser': {
        type: 'http',
        url: 'http://127.0.0.1:4319/mcp',
        bearer_token_env_var: 'GEO_BROWSER_MCP_TOKEN',
      },
    },
  };
}

test('geo-browser plugin MCP config accepts only the fixed loopback Server contract', () => {
  assert.deepEqual(validateGeoBrowserMcpConfig(validConfig()), validConfig());
  for (const invalid of [
    { ...validConfig(), token: 'plaintext' },
    { mcpServers: { 'geo-browser': { ...validConfig().mcpServers['geo-browser'], url: 'https://example.com/mcp' } } },
    { mcpServers: { ...validConfig().mcpServers, extra: { type: 'http', url: 'http://127.0.0.1:9999/mcp' } } },
    { mcpServers: { 'geo-browser': { ...validConfig().mcpServers['geo-browser'], bearer_token: 'plaintext' } } },
    { mcpServers: { 'geo-browser': { ...validConfig().mcpServers['geo-browser'], business_rules: ['approve'] } } },
  ]) {
    assert.throws(
      () => validateGeoBrowserMcpConfig(invalid),
      error => error.code === 'PLUGIN_MCP_CONFIG_INVALID',
    );
  }
});
