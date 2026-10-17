#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { connectOneGlanse } from './lib/oneglanse-mcp-client.mjs';
import {
  prepareOneGlanse,
  startOneGlanse,
  statusOneGlanse,
  receiveOneGlanse,
  analyzeOneGlanse,
} from './lib/oneglanse-intake.mjs';

const commands = {
  prepare: prepareOneGlanse,
  start: startOneGlanse,
  status: statusOneGlanse,
  receive: receiveOneGlanse,
  analyze: analyzeOneGlanse,
};
let connection;
try {
  const [command, ...rest] = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (
      !['--workspace', '--plan', '--connection'].includes(rest[i]) ||
      !rest[i + 1]
    )
      throw new Error(
        'Expected --workspace, --plan and (for MCP calls) --connection',
      );
    args[rest[i].slice(2)] = rest[i + 1];
  }
  if (!commands[command] || !args.workspace || !args.plan)
    throw new Error(
      'Usage: oneglanse.mjs <prepare|start|status|receive|analyze> --workspace <path> --plan <json> [--connection <json>]',
    );
  const plan = JSON.parse(await readFile(path.resolve(args.plan), 'utf8'));
  if (command !== 'analyze') {
    if (!args.connection) throw new Error('--connection is required');
    connection = await connectOneGlanse(path.resolve(args.connection));
  }
  const output = await commands[command]({
    workspace: path.resolve(args.workspace),
    plan,
    call: connection?.call,
  });
  console.log(JSON.stringify(output, null, 2));
} catch (error) {
  console.error(
    JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
    }),
  );
  process.exitCode = 1;
} finally {
  await connection?.close();
}
