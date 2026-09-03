class PluginMcpConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PluginMcpConfigError';
    this.code = 'PLUGIN_MCP_CONFIG_INVALID';
  }
}

function fail(message) {
  throw new PluginMcpConfigError(message);
}

function exactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} 必须是 object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.join('\0') !== wanted.join('\0')) {
    fail(`${label} 字段必须严格为 ${wanted.join(', ')}`);
  }
}

export function validateGeoBrowserMcpConfig(config) {
  exactKeys(config, ['mcpServers'], '.mcp.json');
  exactKeys(config.mcpServers, ['geo-browser'], 'mcpServers');
  const server = config.mcpServers['geo-browser'];
  exactKeys(server, ['type', 'url', 'bearer_token_env_var'], 'mcpServers.geo-browser');
  if (server.type !== 'http') fail('geo-browser type 必须为 http');
  if (server.url !== 'http://127.0.0.1:4319/mcp') {
    fail('geo-browser URL 必须是固定 loopback /mcp endpoint');
  }
  if (server.bearer_token_env_var !== 'GEO_BROWSER_MCP_TOKEN') {
    fail('geo-browser bearer token 只能引用 GEO_BROWSER_MCP_TOKEN');
  }
  return config;
}

export { PluginMcpConfigError };
