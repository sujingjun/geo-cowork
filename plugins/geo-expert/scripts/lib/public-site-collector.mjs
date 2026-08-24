import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';
import {
  normalizeCollectionPlan,
  PublicSiteCollectionError,
} from './public-site-collection-plan.mjs';

const RESPONSE_HEADER_ALLOWLIST = [
  'cache-control', 'content-language', 'content-length', 'content-type',
  'etag', 'last-modified', 'x-robots-tag',
];
const ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.1';
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function fail(code, message, details) {
  throw new PublicSiteCollectionError(code, message, details);
}

async function readOptionalArtifact(workspace, relativePath) {
  const safe = assertSafeRelativePath(relativePath);
  try {
    await assertNoSymlinkPath(workspace, safe);
    return await readFile(resolveWithin(workspace, safe));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    throw error;
  }
}

async function writeCreateOnlyArtifact(workspace, relativePath, content) {
  const safe = assertSafeRelativePath(relativePath);
  const parent = path.posix.dirname(safe);
  if (parent !== '.') {
    await assertNoSymlinkPath(workspace, parent, { allowMissingLeaf: true });
    await mkdir(resolveWithin(workspace, parent), { recursive: true });
    await assertNoSymlinkPath(workspace, parent);
  }
  await assertNoSymlinkPath(workspace, safe, { allowMissingLeaf: true });
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  try {
    await writeFile(resolveWithin(workspace, safe), bytes, { flag: 'wx' });
    return { action: 'created', path: safe };
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    await assertNoSymlinkPath(workspace, safe);
    const existing = await readFile(resolveWithin(workspace, safe));
    if (existing.equals(bytes)) return { action: 'kept', path: safe };
    fail('COLLECTION_CONFLICT', 'artifact 已存在且内容不同', { path: safe });
  }
}

function selectedHeaders(headers) {
  return Object.fromEntries(
    RESPONSE_HEADER_ALLOWLIST
      .map((name) => [name, headers.get(name)])
      .filter(([, value]) => value !== null),
  );
}

function mediaType(headers) {
  return (headers.get('content-type') ?? '').split(';', 1)[0].trim().toLowerCase();
}

function createRateLimiter(intervalMs, sleep) {
  let lastRequestAt = null;
  return async () => {
    if (lastRequestAt !== null) {
      const waitMs = Math.max(0, intervalMs - (Date.now() - lastRequestAt));
      if (waitMs > 0) await sleep(waitMs);
    }
    lastRequestAt = Date.now();
  };
}

async function fetchTimed(fetchImpl, url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { ...options, signal: controller.signal });
    return { response, controller, finish: () => clearTimeout(timer) };
  } catch (error) {
    clearTimeout(timer);
    if (controller.signal.aborted || error.name === 'AbortError') {
      fail('REQUEST_TIMEOUT', '公开采集请求超时', { url });
    }
    fail('REQUEST_FAILED', '公开采集请求失败', { url, cause_code: error.code ?? error.name });
  }
}

async function readLimitedBody(response, maxBytes, controller) {
  const declared = Number(response.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) {
    await response.body?.cancel();
    fail('RESPONSE_TOO_LARGE', '响应 Content-Length 超过上限', { declared, max_bytes: maxBytes });
  }
  if (!response.body) return Buffer.alloc(0);
  const chunks = [];
  let total = 0;
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        fail('RESPONSE_TOO_LARGE', '响应正文超过上限', { max_bytes: maxBytes });
      }
      chunks.push(Buffer.from(value));
    }
  } catch (error) {
    if (controller.signal.aborted || error.name === 'AbortError') {
      fail('REQUEST_TIMEOUT', '读取公开响应正文超时');
    }
    throw error;
  }
  return Buffer.concat(chunks, total);
}

async function requestTarget({ normalized, target, fetchImpl, beforeRequest }) {
  const allowedUrls = new Set(normalized.allowlist.map((item) => new URL(item, normalized.origin).href));
  const requestHeaders = {
    Accept: ACCEPT,
    'Accept-Language': normalized.request.accept_language,
    'User-Agent': normalized.request.user_agent,
  };
  let lastError;
  for (let attempt = 1; attempt <= normalized.request.max_retries + 1; attempt += 1) {
    let currentUrl = new URL(target.path, normalized.origin).href;
    const redirects = [];
    try {
      while (true) {
        await beforeRequest();
        const timed = await fetchTimed(fetchImpl, currentUrl, {
          method: 'GET',
          headers: requestHeaders,
          redirect: 'manual',
        }, normalized.request.timeout_ms);
        const { response } = timed;
        if (response.status >= 300 && response.status <= 399 && response.headers.get('location')) {
          timed.finish();
          await response.body?.cancel();
          if (redirects.length >= normalized.request.max_redirects) {
            fail('TOO_MANY_REDIRECTS', '重定向次数超过上限', { url: currentUrl });
          }
          const nextUrl = new URL(response.headers.get('location'), currentUrl).href;
          if (!allowedUrls.has(nextUrl) || new URL(nextUrl).origin !== normalized.origin) {
            fail('REDIRECT_NOT_ALLOWED', '重定向目标不在同源 allowlist', {
              from: currentUrl,
              to: nextUrl,
            });
          }
          redirects.push({ status: response.status, from: currentUrl, to: nextUrl });
          currentUrl = nextUrl;
          continue;
        }
        if (RETRYABLE_STATUS.has(response.status) && attempt <= normalized.request.max_retries) {
          timed.finish();
          await response.body?.cancel();
          lastError = new PublicSiteCollectionError('RETRYABLE_HTTP_STATUS', '可重试 HTTP 状态', {
            status: response.status,
          });
          break;
        }
        try {
          const body = await readLimitedBody(
            response,
            normalized.request.max_response_bytes,
            timed.controller,
          );
          return {
            body,
            response,
            finalUrl: currentUrl,
            redirects,
            attempts: attempt,
            requestHeaders,
          };
        } finally {
          timed.finish();
        }
      }
    } catch (error) {
      if (!['REQUEST_TIMEOUT', 'REQUEST_FAILED'].includes(error.code)) throw error;
      lastError = error;
    }
  }
  const error = lastError ?? new PublicSiteCollectionError('REQUEST_FAILED', '公开采集请求失败');
  error.attempts = normalized.request.max_retries + 1;
  throw error;
}

function targetPaths(normalized, target) {
  const rawRoot = `runs/${normalized.run_id}/raw/public-site`;
  return {
    body: `${rawRoot}/${target.file}`,
    metadata: `${rawRoot}/${target.id}.metadata.json`,
  };
}

function targetFingerprint(normalized, target) {
  return sha256(stableStringify({
    origin: normalized.origin,
    collector: normalized.collector,
    request: normalized.request,
    raw_retention_days: normalized.raw_retention_days,
    target,
  }));
}

function collectionSummary({ normalized, planFingerprint, items, completedAt }) {
  return {
    schema_version: '1.0.0',
    run_id: normalized.run_id,
    state: 'completed',
    completed_at: completedAt,
    origin: normalized.origin,
    collector: normalized.collector,
    plan_fingerprint: planFingerprint,
    raw_retention_days: normalized.raw_retention_days,
    reviewer_role: normalized.reviewer_role,
    item_count: items.length,
    expectation_failure_count: items.filter((item) =>
      !item.expectation.status_met || !item.expectation.media_type_met).length,
    items,
  };
}

async function existingTarget({ workspace, normalized, target, planFingerprint }) {
  const paths = targetPaths(normalized, target);
  const [body, metadataBytes] = await Promise.all([
    readOptionalArtifact(workspace, paths.body),
    readOptionalArtifact(workspace, paths.metadata),
  ]);
  if ((body === null) !== (metadataBytes === null)) {
    fail('PARTIAL_ARTIFACT', 'raw body 与 metadata 必须同时存在或同时缺失', paths);
  }
  if (body === null) return null;
  let metadata;
  try {
    metadata = JSON.parse(metadataBytes.toString('utf8'));
  } catch {
    fail('COLLECTION_CONFLICT', 'metadata 不是合法 JSON', { path: paths.metadata });
  }
  if (
    metadata.plan_fingerprint !== planFingerprint
    || metadata.target_fingerprint !== targetFingerprint(normalized, target)
    || metadata.sha256 !== sha256(body)
    || metadata.byte_length !== body.length
    || metadata.snapshot_path !== paths.body
  ) {
    fail('COLLECTION_CONFLICT', '现有 raw/metadata 与当前 plan 不一致', { target: target.id });
  }
  return { metadata, paths };
}

export async function collectPublicSite({
  workspace,
  plan,
  now = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
}) {
  const normalized = normalizeCollectionPlan(plan);
  if (typeof fetchImpl !== 'function') fail('FETCH_UNAVAILABLE', '当前 Runtime 不支持 fetch');
  const planFingerprint = sha256(stableStringify(normalized));
  const summaryPath = `runs/${normalized.run_id}/outputs/public-site-collection.json`;
  const existingSummaryBytes = await readOptionalArtifact(workspace, summaryPath);
  const created = [];
  const kept = [];
  const existing = new Map();
  for (const target of normalized.targets) {
    const item = await existingTarget({ workspace, normalized, target, planFingerprint });
    if (item) existing.set(target.id, item);
  }
  if (existingSummaryBytes !== null) {
    let summary;
    try {
      summary = JSON.parse(existingSummaryBytes.toString('utf8'));
    } catch {
      fail('COLLECTION_CONFLICT', 'collection summary 不是合法 JSON', { path: summaryPath });
    }
    if (summary.plan_fingerprint !== planFingerprint || existing.size !== normalized.targets.length) {
      fail('PARTIAL_ARTIFACT', 'summary 与 raw artifacts 不完整或不一致');
    }
    const items = normalized.targets.map((target) => existing.get(target.id).metadata);
    const completedAt = summary.completed_at;
    const validCompletedAt = typeof completedAt === 'string'
      && /(?:Z|[+-]\d{2}:\d{2})$/.test(completedAt)
      && !Number.isNaN(Date.parse(completedAt));
    const expectedSummary = collectionSummary({
      normalized,
      planFingerprint,
      items,
      completedAt,
    });
    if (!validCompletedAt || stableStringify(summary) !== stableStringify(expectedSummary)) {
      fail('COLLECTION_CONFLICT', 'collection summary 与已校验 raw/metadata 不一致', {
        path: summaryPath,
      });
    }
    for (const item of existing.values()) kept.push(item.paths.body, item.paths.metadata);
    kept.push(summaryPath);
    return { ...expectedSummary, created, kept, summary_path: summaryPath };
  }

  const beforeRequest = createRateLimiter(normalized.request.request_interval_ms, sleep);
  const items = [];
  for (const target of normalized.targets) {
    const prior = existing.get(target.id);
    if (prior) {
      kept.push(prior.paths.body, prior.paths.metadata);
      items.push(prior.metadata);
      continue;
    }
    const paths = targetPaths(normalized, target);
    const result = await requestTarget({ normalized, target, fetchImpl, beforeRequest });
    const actualMediaType = mediaType(result.response.headers);
    const metadata = {
      schema_version: '1.0.0',
      target_id: target.id,
      state: 'captured',
      requested_url: new URL(target.path, normalized.origin).href,
      final_url: result.finalUrl,
      captured_at: now,
      collector: normalized.collector,
      request: {
        method: 'GET',
        headers: {
          accept: ACCEPT,
          'accept-language': normalized.request.accept_language,
          'user-agent': normalized.request.user_agent,
        },
        attempts: result.attempts,
        redirect_count: result.redirects.length,
      },
      response: {
        status: result.response.status,
        status_text: result.response.statusText,
        headers: selectedHeaders(result.response.headers),
      },
      redirects: result.redirects,
      expectation: {
        expected_statuses: target.expected_statuses,
        expected_media_types: target.expected_media_types,
        status_met: target.expected_statuses.includes(result.response.status),
        media_type_met: target.expected_media_types.includes(actualMediaType),
      },
      snapshot_path: paths.body,
      sha256: sha256(result.body),
      byte_length: result.body.length,
      raw_retention_days: normalized.raw_retention_days,
      reviewer_role: normalized.reviewer_role,
      plan_fingerprint: planFingerprint,
      target_fingerprint: targetFingerprint(normalized, target),
    };
    const bodyWrite = await writeCreateOnlyArtifact(workspace, paths.body, result.body);
    const metadataWrite = await writeCreateOnlyArtifact(
      workspace,
      paths.metadata,
      stableStringify(metadata, 2),
    );
    (bodyWrite.action === 'created' ? created : kept).push(bodyWrite.path);
    (metadataWrite.action === 'created' ? created : kept).push(metadataWrite.path);
    items.push(metadata);
  }

  const summary = collectionSummary({
    normalized,
    planFingerprint,
    items,
    completedAt: now,
  });
  const summaryWrite = await writeCreateOnlyArtifact(
    workspace,
    summaryPath,
    stableStringify(summary, 2),
  );
  (summaryWrite.action === 'created' ? created : kept).push(summaryWrite.path);
  return { ...summary, created, kept, summary_path: summaryPath };
}
