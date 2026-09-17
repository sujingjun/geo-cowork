#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadModelEnvironment,
  resolveModelConfig,
} from './lib/model-client.mjs';
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const args = process.argv.slice(2);
await loadModelEnvironment(process.env.GEO_ENV_FILE ?? path.join(root, '.env'));
for (const key of ['provider', 'model']) {
  const i = args.indexOf(`--${key}`);
  if (i >= 0)
    process.env[key === 'provider' ? 'GEO_MODEL_PROVIDER' : 'GEO_MODEL_NAME'] =
      args[i + 1];
}
const config = resolveModelConfig({
  provider: process.env.GEO_MODEL_PROVIDER,
  model: process.env.GEO_MODEL_NAME,
});
process.env.GEO_MODEL_PROVIDER = config.provider;
process.env.GEO_MODEL_NAME = config.model;
process.env.GEO_MODEL_AUDIT_DIR ??= path.join(root, 'tmp/geo-e2e/model-calls');
if (args[0] !== 'browser')
  throw new Error(
    'Use geo-runtime browser [--provider deepseek|openai-compatible] [--model opaque-model-id]',
  );
const cwd = path.join(root, 'plugins/geo-browser-extension');
const child = spawn(
  process.execPath,
  [
    path.join(cwd, 'node_modules/nuxt/bin/nuxt.mjs'),
    'dev',
    '--host',
    '127.0.0.1',
    '--port',
    '4319',
  ],
  { cwd, env: process.env, stdio: 'inherit' },
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => child.kill(signal));
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
