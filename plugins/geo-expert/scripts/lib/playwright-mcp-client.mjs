import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createRequire } from 'node:module';
import path from 'node:path';
import { mkdir, appendFile } from 'node:fs/promises';
import { modelHash } from './model-client.mjs';

export async function connectPlaywrightMcp({
  outputDir,
  extension = true,
} = {}) {
  const require = createRequire(import.meta.url);
  const manifestPath = require.resolve('@playwright/mcp/package.json');
  const manifest = require(manifestPath);
  if (manifest.version !== '0.0.81')
    throw Object.assign(new Error('Playwright MCP version mismatch'), {
      code: 'MCP_VERSION_MISMATCH',
    });
  await mkdir(outputDir, { recursive: true });
  const env = Object.fromEntries(
    ['PATH', 'HOME', 'TMPDIR', 'PLAYWRIGHT_MCP_EXTENSION_TOKEN']
      .filter((k) => process.env[k])
      .map((k) => [k, process.env[k]]),
  );
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [
      path.join(path.dirname(manifestPath), 'cli.js'),
      ...(extension ? ['--extension'] : ['--browser', 'chrome']),
      '--output-dir',
      path.resolve(outputDir),
    ],
    env,
    stderr: 'pipe',
  });
  const client = new Client({ name: 'geo-cowork-collector', version: '1.0.0' });
  await client.connect(transport);
  let sequence = 0;
  async function call(name, args = {}, timeout = 60000) {
    const started_at = new Date().toISOString();
    const sequence_no = ++sequence;
    const result = await client.callTool({ name, arguments: args }, undefined, {
      timeout,
    });
    await appendFile(
      path.join(outputDir, 'mcp-calls.jsonl'),
      `${JSON.stringify({
        sequence_no,
        name,
        arguments: args,
        started_at,
        completed_at: new Date().toISOString(),
        result_sha256: modelHash(result),
        result,
      })}\n`,
      { mode: 0o600 },
    );
    return result;
  }
  return { client, call, close: () => client.close() };
}
