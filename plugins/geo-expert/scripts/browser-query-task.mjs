#!/usr/bin/env node
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  completeBrowserQuery,
  failBrowserQuery,
  markBrowserQueryUncertain,
  openBrowserQueryTask,
  recoverBrowserQueryTask,
  retryBrowserQuery,
  startBrowserQuery,
} from './lib/browser-query-task.mjs';

const MAX_BODY_BYTES = 3 * 1024 * 1024;

function invalid(message) {
  const error = new Error(message);
  error.code = 'INVALID_ARGUMENT';
  return error;
}

export function parseBrowserQueryTaskArgs(argv) {
  const [command, ...rest] = argv;
  if (command !== 'serve') throw invalid('仅支持 serve command');
  const args = { command };
  const allowed = new Set(['workspace', 'plan', 'host', 'port', 'token']);
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!flag.startsWith('--') || !allowed.has(flag.slice(2))) throw invalid(`未知参数: ${flag}`);
    const value = rest[++index];
    if (!value || value.startsWith('--')) throw invalid(`参数缺值: ${flag}`);
    args[flag.slice(2)] = value;
  }
  if (!args.workspace || !args.plan) throw invalid('缺少 --workspace 或 --plan');
  args.host = args.host ?? '127.0.0.1';
  if (args.host !== '127.0.0.1') throw invalid('服务只允许绑定 127.0.0.1');
  args.port = Number(args.port ?? 4319);
  if (!Number.isInteger(args.port) || args.port < 1024 || args.port > 65_535) {
    throw invalid('--port 必须是 1024..65535 的整数');
  }
  return args;
}

function allowedOrigin(origin) {
  return !origin || origin.startsWith('chrome-extension://');
}

function setCors(response, origin) {
  if (origin?.startsWith('chrome-extension://')) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Cache-Control', 'no-store');
}

function sendJson(response, status, value) {
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': bytes.length,
  });
  response.end(bytes);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw invalid('请求体超过 3 MiB');
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw invalid('请求体不是合法 JSON');
  }
}

function statusFor(error) {
  if (['COLLECTION_AUTHORIZATION_REQUIRED', 'PLATFORM_TERMS_BLOCKED'].includes(error.code)) return 403;
  if (String(error.code).includes('CONFLICT') || String(error.code).includes('LEASE')
      || error.code === 'QUERY_TASK_TRANSITION_INVALID') return 409;
  return 400;
}

export function createBrowserQueryTaskServer({ workspace, plan, token, now = () => new Date().toISOString() }) {
  if (!token || token.length < 16) throw invalid('本地 session token 至少 16 个字符');
  let operationQueue = Promise.resolve();
  function serialized(operation) {
    const next = operationQueue.then(operation, operation);
    operationQueue = next.catch(() => undefined);
    return next;
  }
  return createServer(async (request, response) => {
    const origin = request.headers.origin;
    setCors(response, origin);
    if (!allowedOrigin(origin)) {
      sendJson(response, 403, { error: 'ORIGIN_NOT_ALLOWED', message: '仅允许 Chrome extension origin' });
      return;
    }
    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.url === '/health' && request.method === 'GET') {
      sendJson(response, 200, { ok: true, service: 'geo-browser-query-task' });
      return;
    }
    if (request.headers.authorization !== `Bearer ${token}`) {
      sendJson(response, 401, { error: 'UNAUTHORIZED', message: '本地 session token 无效' });
      return;
    }
    try {
      if (request.url === '/api/task' && request.method === 'GET') {
        sendJson(response, 200, await serialized(() => openBrowserQueryTask({
          workspace,
          plan,
          now: now(),
        })));
        return;
      }
      const body = await readJsonBody(request);
      if (request.url === '/api/task/start' && request.method === 'POST') {
        sendJson(response, 200, await serialized(() => startBrowserQuery({
          workspace,
          plan,
          queryRef: body.query_ref,
          now: now(),
        })));
        return;
      }
      if (request.url === '/api/task/complete' && request.method === 'POST') {
        sendJson(response, 200, await serialized(() => completeBrowserQuery({
          workspace,
          plan,
          queryRef: body.query_ref,
          answerText: body.answer_text,
          citations: body.citations,
          resultUrl: body.result_url,
          outcome: body.outcome,
          now: now(),
        })));
        return;
      }
      if (request.url === '/api/task/fail' && request.method === 'POST') {
        sendJson(response, 200, await serialized(() => failBrowserQuery({
          workspace,
          plan,
          queryRef: body.query_ref,
          reason: body.failure_reason,
          outcome: body.outcome,
          now: now(),
        })));
        return;
      }
      if (request.url === '/api/task/uncertain' && request.method === 'POST') {
        sendJson(response, 200, await serialized(() => markBrowserQueryUncertain({
          workspace,
          plan,
          queryRef: body.query_ref,
          reason: body.reason,
          now: now(),
        })));
        return;
      }
      if (request.url === '/api/task/retry' && request.method === 'POST') {
        sendJson(response, 200, await serialized(() => retryBrowserQuery({
          workspace,
          plan,
          queryRef: body.query_ref,
          now: now(),
        })));
        return;
      }
      sendJson(response, 404, { error: 'NOT_FOUND', message: '未知 endpoint' });
    } catch (error) {
      sendJson(response, statusFor(error), {
        error: error.code ?? 'INVALID_ARGUMENT',
        message: error.message,
        ...(error.diagnostics ? { diagnostics: error.diagnostics } : {}),
      });
    }
  });
}

async function main() {
  try {
    const args = parseBrowserQueryTaskArgs(process.argv.slice(2));
    const workspace = path.resolve(args.workspace);
    const planPath = path.resolve(args.plan);
    const plan = JSON.parse(await readFile(planPath, 'utf8'));
    const token = args.token ?? randomBytes(24).toString('base64url');
    let opened = await openBrowserQueryTask({ workspace, plan });
    if (opened.action === 'resumed' && opened.state.status === 'running') {
      opened = await recoverBrowserQueryTask({ workspace, plan });
    }
    const server = createBrowserQueryTaskServer({ workspace, plan, token });
    server.listen(args.port, args.host, () => {
      console.log(JSON.stringify({
        ok: true,
        service: 'geo-browser-query-task',
        url: `http://${args.host}:${args.port}`,
        session_token: token,
        task_id: opened.state.task_id,
        task_status: opened.state.status,
        state_path: opened.state_path,
      }, null, 2));
    });
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'INVALID_ARGUMENT',
      message: error.message,
    }));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
