#!/usr/bin/env node
import { createInterface } from 'node:readline';
import path from 'node:path';
import { connectPlaywrightMcp } from './lib/playwright-mcp-client.mjs';

const args = process.argv.slice(2);
const command = args[0];
const outputIndex = args.indexOf('--output');
const outputDir =
  outputIndex >= 0 ? args[outputIndex + 1] : 'tmp/geo-e2e/real-captures';
if (['collect-playwright', 'resume-collection'].includes(command)) {
  const option = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const { collectPlaywright } = await import('./lib/playwright-collector.mjs');
  try {
    const result = await collectPlaywright({
      outputDir,
      platform: option('platform'),
      provider: option('provider'),
      model: option('model'),
      resume: command === 'resume-collection',
    });
    console.log(JSON.stringify(result, null, 2));
    if (result.status === 'waiting_human') process.exitCode = 1;
  } catch (error) {
    console.error(
      JSON.stringify({
        error: error.code ?? 'COLLECTION_FAILED',
        message: error.message,
      }),
    );
    process.exitCode = 1;
  }
} else {
  const session = await connectPlaywrightMcp({
    outputDir: path.resolve(outputDir),
  });
  try {
    if (command === 'tools')
      console.log(JSON.stringify(await session.client.listTools()));
    else if (command === 'session') {
      console.log(
        JSON.stringify({
          ready: true,
          protocol: 'MCP',
          version: '0.0.81',
          outputDir,
        }),
      );
      for await (const line of createInterface({
        input: process.stdin,
        crlfDelay: Infinity,
      })) {
        if (line === 'close') break;
        try {
          const request = JSON.parse(line);
          const result = await session.call(
            request.name,
            request.arguments,
            request.timeout,
          );
          console.log(JSON.stringify({ id: request.id, result }));
        } catch (error) {
          console.log(
            JSON.stringify({
              error: error.code ?? 'MCP_CALL_FAILED',
              message: error.message,
            }),
          );
        }
      }
    } else throw new Error('Use tools or session');
  } finally {
    await session.close();
  }
}
