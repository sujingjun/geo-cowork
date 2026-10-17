import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFile } from 'node:fs/promises';

// The connection is operator-owned configuration, never a cross-repository import.
export async function connectOneGlanse(configPath) {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  if (
    config.type !== 'stdio' ||
    typeof config.command !== 'string' ||
    !Array.isArray(config.args) ||
    config.args.some((arg) => typeof arg !== 'string')
  ) {
    throw Object.assign(
      new Error('OneGlanse connection requires a stdio command and args'),
      { code: 'CONNECTION_INVALID' },
    );
  }
  const transport = new StdioClientTransport({
    command: config.command,
    args: config.args,
    cwd: config.cwd,
    env: Object.fromEntries(
      ['PATH', 'HOME', 'TMPDIR']
        .filter((key) => process.env[key])
        .map((key) => [key, process.env[key]]),
    ),
    stderr: 'pipe',
  });
  transport.stderr?.on('data', () => {});
  const client = new Client({ name: 'geo-cowork-oneglanse', version: '1.0.0' });
  try {
    await client.connect(transport);
  } catch (error) {
    await client.close();
    throw error;
  }
  return {
    async call(name, args) {
      const result = await client.callTool(
        { name, arguments: args },
        undefined,
        { timeout: 60000 },
      );
      if (result.isError) {
        const detail = result.structuredContent?.error;
        throw Object.assign(
          new Error(detail?.message ?? 'OneGlanse tool failed'),
          { code: detail?.code ?? 'ONEGLANSE_TOOL_FAILED' },
        );
      }
      if (!result.structuredContent)
        throw Object.assign(
          new Error('OneGlanse tool omitted structuredContent'),
          { code: 'MCP_CONTRACT_INVALID' },
        );
      return result.structuredContent;
    },
    close: () => client.close(),
  };
}
