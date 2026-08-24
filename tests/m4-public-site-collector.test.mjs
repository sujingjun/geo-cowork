import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import {
  collectPublicSite,
} from '../plugins/geo-expert/scripts/lib/public-site-collector.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW, temporaryWorkspace } from './helpers/object-fixtures.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/collect-public-site.mjs');

async function startServer(handler) {
  const server = createServer(handler);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
}

function collectionPlan(origin, overrides = {}) {
  const base = {
    schema_version: '1.0.0',
    run_id: 'RUN-M4-PUBLIC-COLLECTION-TEST',
    origin,
    development_fixture: true,
    collector: {
      name: 'geo-cowork-public-site',
      version: '0.3.0',
      mode: 'public_http',
    },
    request: {
      user_agent: 'geo-cowork-m4/0.3.0',
      accept_language: 'en-US,en;q=0.9',
      concurrency: 1,
      request_interval_ms: 0,
      timeout_ms: 200,
      max_retries: 2,
      max_redirects: 5,
      max_response_bytes: 1024,
    },
    raw_retention_days: 90,
    reviewer_role: 'MyyShop Owner',
    allowlist: ['/'],
    targets: [{
      id: 'homepage',
      path: '/',
      file: 'homepage.html',
      expected_statuses: [200],
      expected_media_types: ['text/html'],
    }],
  };
  return {
    ...base,
    ...overrides,
    collector: { ...base.collector, ...overrides.collector },
    request: { ...base.request, ...overrides.request },
    targets: overrides.targets ?? base.targets,
  };
}

test('public collector 保存 raw、脱敏 metadata、SHA 与稳定 summary，重复执行不联网', async () => {
  let requests = 0;
  const server = await startServer((request, response) => {
    requests += 1;
    assert.equal(request.headers.authorization, undefined);
    assert.equal(request.headers.cookie, undefined);
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'set-cookie': 'session=secret',
      'x-api-key': 'sensitive-response-value',
      etag: 'fixture-etag',
    });
    response.end('<html><title>Fixture</title></html>');
  });
  const root = await temporaryWorkspace('geo-public-collector-');
  try {
    const plan = collectionPlan(server.origin);
    const first = await collectPublicSite({ workspace: root, plan, now: NOW });
    assert.equal(first.created.length, 3);
    assert.equal(first.kept.length, 0);
    assert.equal(first.items[0].state, 'captured');
    assert.equal(requests, 1);

    const bodyPath = path.join(
      root,
      'runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site/homepage.html',
    );
    const metadataPath = path.join(
      root,
      'runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site/homepage.metadata.json',
    );
    const summaryPath = path.join(
      root,
      'runs/RUN-M4-PUBLIC-COLLECTION-TEST/outputs/public-site-collection.json',
    );
    const body = await readFile(bodyPath);
    const metadataText = await readFile(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataText);
    const summaryText = await readFile(summaryPath, 'utf8');
    assert.equal(metadata.sha256, sha256(body));
    assert.equal(metadata.byte_length, body.length);
    assert.equal(metadata.captured_at, NOW);
    assert.equal(metadata.collector.version, '0.3.0');
    assert.equal(metadata.raw_retention_days, 90);
    assert.equal(metadata.response.headers.etag, 'fixture-etag');
    assert.equal('set-cookie' in metadata.response.headers, false);
    assert.equal('x-api-key' in metadata.response.headers, false);
    assert.equal(metadataText.includes('session=secret'), false);
    assert.equal(metadataText.includes('sensitive-response-value'), false);

    const second = await collectPublicSite({
      workspace: root,
      plan,
      now: '2026-08-24T01:00:00+08:00',
    });
    assert.equal(requests, 1);
    assert.equal(second.created.length, 0);
    assert.equal(second.kept.length, 3);
    assert.equal(await readFile(summaryPath, 'utf8'), summaryText);

    const tamperedSummary = JSON.parse(summaryText);
    tamperedSummary.item_count = 2;
    await writeFile(summaryPath, JSON.stringify(tamperedSummary));
    await assert.rejects(
      collectPublicSite({
        workspace: root,
        plan,
        now: '2026-08-24T02:00:00+08:00',
      }),
      (error) => error.code === 'COLLECTION_CONFLICT',
    );
    assert.equal(requests, 1);
  } finally {
    await server.close();
    await rm(root, { recursive: true });
  }
});

test('public collector 拒绝非 allowlist 与跨源重定向且不写 raw', async () => {
  const external = await startServer((_request, response) => {
    response.end('must not be reached');
  });
  const server = await startServer((request, response) => {
    if (request.url === '/') {
      response.writeHead(302, { location: `${external.origin}/outside` });
      response.end();
      return;
    }
    response.end('unexpected');
  });
  const root = await temporaryWorkspace('geo-public-collector-redirect-');
  try {
    await assert.rejects(
      collectPublicSite({ workspace: root, plan: collectionPlan(server.origin), now: NOW }),
      (error) => error.code === 'REDIRECT_NOT_ALLOWED',
    );
    await assert.rejects(readFile(path.join(
      root,
      'runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site/homepage.html',
    )));

    await assert.rejects(
      collectPublicSite({
        workspace: root,
        plan: collectionPlan(server.origin, {
          targets: [{
            id: 'outside',
            path: '/outside',
            file: 'outside.html',
            expected_statuses: [200],
            expected_media_types: ['text/html'],
          }],
        }),
        now: NOW,
      }),
      (error) => error.code === 'TARGET_NOT_ALLOWED',
    );
  } finally {
    await server.close();
    await external.close();
    await rm(root, { recursive: true });
  }
});

test('public collector 在响应过大时停止且不留下半成品', async () => {
  const server = await startServer((_request, response) => {
    response.writeHead(200, {
      'content-type': 'text/plain',
      'content-length': '2048',
    });
    response.end('x'.repeat(2048));
  });
  const root = await temporaryWorkspace('geo-public-collector-size-');
  try {
    await assert.rejects(
      collectPublicSite({ workspace: root, plan: collectionPlan(server.origin), now: NOW }),
      (error) => error.code === 'RESPONSE_TOO_LARGE',
    );
    await assert.rejects(readFile(path.join(
      root,
      'runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site/homepage.html',
    )));
  } finally {
    await server.close();
    await rm(root, { recursive: true });
  }
});

test('public collector 对超时最多重试两次并返回稳定错误码', async () => {
  let requests = 0;
  const server = await startServer((_request, response) => {
    requests += 1;
    setTimeout(() => response.end('late'), 80);
  });
  const root = await temporaryWorkspace('geo-public-collector-timeout-');
  try {
    await assert.rejects(
      collectPublicSite({
        workspace: root,
        plan: collectionPlan(server.origin, { request: { timeout_ms: 20 } }),
        now: NOW,
      }),
      (error) => error.code === 'REQUEST_TIMEOUT' && error.attempts === 3,
    );
    assert.equal(requests, 3);
  } finally {
    await server.close();
    await rm(root, { recursive: true });
  }
});

test('public collector 发现 body/metadata 半成品时显式冲突且不联网', async () => {
  let requests = 0;
  const server = await startServer((_request, response) => {
    requests += 1;
    response.end('should not be fetched');
  });
  const root = await temporaryWorkspace('geo-public-collector-partial-');
  const rawRoot = path.join(
    root,
    'runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site',
  );
  try {
    await mkdir(rawRoot, { recursive: true });
    await writeFile(path.join(rawRoot, 'homepage.html'), 'partial');
    await assert.rejects(
      collectPublicSite({ workspace: root, plan: collectionPlan(server.origin), now: NOW }),
      (error) => error.code === 'PARTIAL_ARTIFACT',
    );
    assert.equal(requests, 0);
  } finally {
    await server.close();
    await rm(root, { recursive: true });
  }
});

test('public collector CLI 可从非仓库 cwd 执行并输出结构化摘要', async () => {
  const server = await startServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end('<html><title>CLI fixture</title></html>');
  });
  const root = await temporaryWorkspace('geo-public-collector-cli-');
  try {
    const planPath = path.join(root, 'collection-plan.json');
    await writeFile(planPath, JSON.stringify(collectionPlan(server.origin)));
    const result = await exec(process.execPath, [
      CLI,
      '--workspace', root,
      '--plan', planPath,
      '--now', NOW,
    ], { cwd: os.tmpdir() });
    const output = JSON.parse(result.stdout);
    assert.equal(output.state, 'completed');
    assert.equal(output.item_count, 1);
  } finally {
    await server.close();
    await rm(root, { recursive: true });
  }
});
