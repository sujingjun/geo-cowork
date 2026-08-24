import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  auditSite,
  evaluateSiteManifest,
} from '../plugins/geo-expert/scripts/lib/site-audit.mjs';
import {
  ingestResearch,
} from '../plugins/geo-expert/scripts/lib/research-input.mjs';
import { validateDiagnosisWorkspace } from '../plugins/geo-expert/scripts/lib/diagnosis-profile.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW } from './helpers/object-fixtures.mjs';
import {
  m4ReadyWorkspace,
  sitePlan,
  writeSiteSnapshots,
} from './helpers/m4-fixtures.mjs';

function siteHtml({
  canonical = 'https://brand.example.invalid/about',
  schema = '{"@context":"https://schema.org"}',
  title = 'Synthetic Brand',
  description = 'Synthetic description',
  heading = 'About Synthetic Brand',
  robots = 'index,follow',
} = {}) {
  return [
    '<html><head>',
    title === null ? '' : `<title>${title}</title>`,
    description === null ? '' : `<meta name="description" content="${description}">`,
    robots === null ? '' : `<meta name="robots" content="${robots}">`,
    canonical === null ? '' : `<link rel="canonical" href="${canonical}">`,
    schema === null ? '' : `<script type="application/ld+json">${schema}</script>`,
    '</head><body>',
    heading === null ? '' : `<h1>${heading}</h1>`,
    '</body></html>',
  ].join('');
}

test('site detector 九项确定、无综合分且不访问网络', async () => {
  const root = await m4ReadyWorkspace();
  const manifest = await writeSiteSnapshots(root);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('network forbidden'); };
  try {
    const first = await evaluateSiteManifest({ workspace: root, manifest });
    const second = await evaluateSiteManifest({ workspace: root, manifest });
    assert.deepEqual(second, first);
    assert.equal(first.checks.length, 9);
    assert.ok(first.checks.every((item) => item.state === 'pass'));
    assert.equal('score' in first, false);
    assert.equal(JSON.stringify(first).includes('geo_score'), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
  await rm(root, { recursive: true });
});

test('site detector 九项逐项覆盖 fail，robots 按最长匹配 Allow/Disallow 判定', async () => {
  const root = await m4ReadyWorkspace();
  const cases = [{
    code: 'HTTP_STATUS',
    configure(manifest) { manifest.http.status = 503; },
  }, {
    code: 'CANONICAL',
    html: siteHtml({ canonical: 'https://brand.example.invalid/other' }),
  }, {
    code: 'ROBOTS',
    robots: 'User-agent: *\nDisallow: /about\n',
  }, {
    code: 'SITEMAP',
    sitemap: '<urlset></urlset>\n',
  }, {
    code: 'SCHEMA_SYNTAX',
    html: siteHtml({ schema: '{invalid' }),
  }, {
    code: 'TITLE_PRESENT',
    html: siteHtml({ title: null }),
  }, {
    code: 'META_DESCRIPTION_PRESENT',
    html: siteHtml({ description: null }),
  }, {
    code: 'HEADING_PRESENT',
    html: siteHtml({ heading: null }),
  }, {
    code: 'CRAWLABILITY',
    html: siteHtml({ robots: 'noindex,follow' }),
  }];

  for (const [index, item] of cases.entries()) {
    const manifest = await writeSiteSnapshots(root, {
      prefix: `matrix-${index}-`,
      ...(item.html ? { html: item.html } : {}),
      ...(item.robots ? { robots: item.robots } : {}),
      ...(item.sitemap ? { sitemap: item.sitemap } : {}),
    });
    item.configure?.(manifest);
    const evaluation = await evaluateSiteManifest({ workspace: root, manifest });
    assert.equal(
      evaluation.checks.find(({ code }) => code === item.code).state,
      'fail',
      item.code,
    );
  }

  const allowed = await writeSiteSnapshots(root, {
    prefix: 'robots-allow-',
    robots: 'User-agent: *\nDisallow: /\nAllow: /about\n',
  });
  const allowedEvaluation = await evaluateSiteManifest({ workspace: root, manifest: allowed });
  assert.equal(allowedEvaluation.checks.find(({ code }) => code === 'ROBOTS').state, 'pass');
  assert.equal(allowedEvaluation.checks.find(({ code }) => code === 'CRAWLABILITY').state, 'pass');

  const malformedSitemap = await writeSiteSnapshots(root, {
    prefix: 'malformed-sitemap-',
    sitemap: '<urlset>https://brand.example.invalid/about',
  });
  const malformedEvaluation = await evaluateSiteManifest({ workspace: root, manifest: malformedSitemap });
  assert.equal(malformedEvaluation.checks.find(({ code }) => code === 'SITEMAP').state, 'fail');

  const mismatchedSitemap = await writeSiteSnapshots(root, {
    prefix: 'mismatched-sitemap-',
    sitemap: '<urlset><url><loc>https://brand.example.invalid/about</loc></url></sitemapindex>',
  });
  const mismatchedEvaluation = await evaluateSiteManifest({ workspace: root, manifest: mismatchedSitemap });
  assert.equal(mismatchedEvaluation.checks.find(({ code }) => code === 'SITEMAP').state, 'fail');

  const headerNoindex = await writeSiteSnapshots(root, { prefix: 'header-noindex-' });
  headerNoindex.http.headers['X-Robots-Tag'] = 'noindex';
  const headerEvaluation = await evaluateSiteManifest({ workspace: root, manifest: headerNoindex });
  assert.equal(headerEvaluation.checks.find(({ code }) => code === 'CRAWLABILITY').state, 'fail');
  await rm(root, { recursive: true });
});

test('site audit 失败项创建 Evidence/Finding/Run，checksum 冲突前无写入', async () => {
  const root = await m4ReadyWorkspace();
  const manifest = await writeSiteSnapshots(root, {
    html: [
      '<html><head><meta name="description" content="Synthetic">',
      '<meta name="robots" content="index,follow">',
      '<link rel="canonical" href="https://brand.example.invalid/about">',
      '<script type="application/ld+json">{"@context":"https://schema.org"}</script>',
      '</head><body><h1>About</h1></body></html>',
    ].join(''),
  });
  const plan = sitePlan();
  const result = await auditSite({ workspace: root, manifest, plan, now: NOW });
  assert.equal(result.checks.find((item) => item.code === 'TITLE_PRESENT').state, 'fail');
  assert.deepEqual(result.finding_refs, ['FND-M4-TITLE-PRESENT-001']);
  const finding = await readMarkdownObject(path.join(root, 'findings/m4-title-present.md'), { workspace: root });
  assert.equal(finding.data.item_state, 'observed');
  assert.equal(finding.data.diagnosis_class, 'technical');
  assert.deepEqual(finding.data.query_refs, ['Q-TEST-001']);
  const evidence = await readMarkdownObject(
    path.join(root, 'evidence/records/m4-title-present.md'),
    { workspace: root },
  );
  assert.equal(evidence.data.proof_scope, 'target_content');
  const run = await readMarkdownObject(path.join(root, 'runs/RUN-M4-SITE-001/run.md'), { workspace: root });
  assert.equal(run.data.status, 'completed');
  assert.deepEqual(run.data.finding_refs, ['FND-M4-TITLE-PRESENT-001']);
  assert.equal(run.data.manifest_fingerprint, result.manifest_fingerprint);
  assert.equal(run.data.detector_results.length, 9);
  assert.equal(run.data.detector_results.find(({ code }) => code === 'HTTP_STATUS').state, 'pass');
  assert.equal(run.data.detector_results.find(({ code }) => code === 'TITLE_PRESENT').state, 'fail');

  const repeated = await auditSite({
    workspace: root,
    manifest,
    plan,
    now: '2026-08-24T01:00:00+08:00',
  });
  assert.ok(repeated.kept.includes('findings/m4-title-present.md'));

  await rm(path.join(root, 'runs/RUN-M4-SITE-001/run.md'));
  const recovered = await auditSite({ workspace: root, manifest, plan, now: NOW });
  assert.ok(recovered.kept.includes('findings/m4-title-present.md'));
  assert.ok(recovered.created.includes('runs/RUN-M4-SITE-001/run.md'));

  const other = await m4ReadyWorkspace();
  const broken = await writeSiteSnapshots(other);
  broken.snapshots[0].sha256 = '0'.repeat(64);
  await assert.rejects(
    auditSite({ workspace: other, manifest: broken, plan: sitePlan('RUN-M4-BROKEN-001'), now: NOW }),
    (error) => error.code === 'CHECKSUM_MISMATCH',
  );
  await assert.rejects(readFile(path.join(other, 'runs/RUN-M4-BROKEN-001/run.md')));
  await rm(root, { recursive: true });
  await rm(other, { recursive: true });
});

test('site metadata detector Evidence 引用各自 snapshot 与 metadata scope', async () => {
  const root = await m4ReadyWorkspace();
  const manifest = await writeSiteSnapshots(root, {
    robots: 'User-agent: *\nDisallow: /about\n',
    sitemap: '<urlset></urlset>\n',
  });
  await auditSite({
    workspace: root,
    manifest,
    plan: sitePlan('RUN-M4-METADATA-001'),
    now: NOW,
  });
  const robots = await readMarkdownObject(
    path.join(root, 'evidence/records/m4-robots.md'),
    { workspace: root },
  );
  const sitemap = await readMarkdownObject(
    path.join(root, 'evidence/records/m4-sitemap.md'),
    { workspace: root },
  );
  assert.equal(robots.data.snapshot.path, 'evidence/snapshots/robots.txt');
  assert.equal(sitemap.data.snapshot.path, 'evidence/snapshots/sitemap.txt');
  assert.equal(robots.data.proof_scope, 'metadata_only');
  assert.equal(sitemap.data.proof_scope, 'metadata_only');
  await rm(root, { recursive: true });
});

test('captured 页面缺少 detector snapshot 时持久化为 unverifiable scope', async () => {
  const root = await m4ReadyWorkspace();
  const manifest = await writeSiteSnapshots(root, { prefix: 'missing-role-' });
  manifest.snapshots = manifest.snapshots.filter(({ role }) => role === 'html');
  const result = await auditSite({
    workspace: root,
    manifest,
    plan: sitePlan('RUN-M4-MISSING-ROLE-001'),
    now: NOW,
  });
  assert.equal(result.checks.find(({ code }) => code === 'ROBOTS').state, 'unverifiable');
  assert.equal(result.checks.find(({ code }) => code === 'SITEMAP').state, 'unverifiable');
  const evidence = await readMarkdownObject(
    path.join(root, 'evidence/records/m4-robots.md'),
    { workspace: root },
  );
  assert.equal(evidence.data.collection_state, 'unverifiable');
  assert.equal(evidence.data.proof_scope, 'collection_failure');
  assert.deepEqual((await validateDiagnosisWorkspace({ workspace: root })).errors, []);
  await rm(root, { recursive: true });
});

test('blocked/unverifiable snapshot 只证明采集失败', async () => {
  const root = await m4ReadyWorkspace();
  const log = 'HTTP 403 challenge encountered; no target content captured.\n';
  await writeFile(path.join(root, 'evidence/snapshots/collector-log.txt'), log);
  const manifest = {
    schema_version: 'm4-site-manifest-v1',
    target: { asset_ref: 'AST-TEST-ABOUT-001', locator: 'https://brand.example.invalid/about' },
    captured_at: NOW,
    collector: { name: 'synthetic-fixture', version: '1.0.0', mode: 'development_fixture' },
    collection_state: 'blocked',
    snapshots: [{
      role: 'collector_log', path: 'evidence/snapshots/collector-log.txt',
      sha256: sha256(log), media_type: 'text/plain',
    }],
    http: { status: 403, headers: { 'content-type': 'text/plain' } },
  };
  const result = await auditSite({ workspace: root, manifest, plan: sitePlan(), now: NOW });
  assert.ok(result.checks.every((item) => item.state === 'blocked'));
  const evidence = await readMarkdownObject(
    path.join(root, 'evidence/records/m4-http-status.md'),
    { workspace: root },
  );
  assert.equal(evidence.data.proof_scope, 'collection_failure');
  const finding = await readMarkdownObject(path.join(root, 'findings/m4-http-status.md'), { workspace: root });
  assert.equal(finding.data.item_state, 'blocked');
  assert.equal(finding.content.includes('页面不存在'), false);

  const unverifiable = {
    ...manifest,
    collection_state: 'unverifiable',
  };
  const unverifiableResult = await evaluateSiteManifest({ workspace: root, manifest: unverifiable });
  assert.ok(unverifiableResult.checks.every((item) => item.state === 'unverifiable'));
  await rm(root, { recursive: true });
});

test('research access、原文、独立支持与 confidence 分离并保留 warning', async () => {
  const root = await m4ReadyWorkspace();
  const original = 'Independent synthetic review text.\n';
  const blocked = 'Login required.\n';
  await writeFile(path.join(root, 'evidence/snapshots/research.txt'), original);
  await writeFile(path.join(root, 'evidence/snapshots/research-blocked.txt'), blocked);
  const manifest = {
    schema_version: 'm4-research-manifest-v1',
    observations: [{
      source_ref: 'SRC-TEST-001', access_state: 'accessible',
      original_content_state: 'captured',
      snapshot: { path: 'evidence/snapshots/research.txt', sha256: sha256(original), media_type: 'text/plain' },
      support_kind: 'independent', independent_support_refs: [], counter_evidence_refs: [],
      confidence: 'low', confidence_reason: 'Single synthetic source.',
    }, {
      source_ref: 'SRC-SITE-001', access_state: 'blocked',
      original_content_state: 'missing',
      snapshot: { path: 'evidence/snapshots/research-blocked.txt', sha256: sha256(blocked), media_type: 'text/plain' },
      support_kind: 'platform_observation', independent_support_refs: [], counter_evidence_refs: [],
      confidence: 'unknown', confidence_reason: 'Login wall.',
    }],
  };
  const basePlan = sitePlan('RUN-M4-RESEARCH-001');
  basePlan.input_versions['SRC-TEST-001'] = '1.0.0';
  const plan = {
    ...basePlan,
    observations: [{
      source_ref: 'SRC-TEST-001', id: 'EVD-M4-RESEARCH-001',
      path: 'evidence/records/research-001.md',
    }, {
      source_ref: 'SRC-SITE-001', id: 'EVD-M4-RESEARCH-002',
      path: 'evidence/records/research-002.md',
    }],
  };
  const result = await ingestResearch({ workspace: root, manifest, plan, now: NOW });
  assert.ok(result.warnings.some((item) => item.code === 'LOW_CONFIDENCE'));
  assert.ok(result.warnings.some((item) => item.code === 'SOURCE_BLOCKED'));
  assert.ok(result.warnings.some((item) => item.code === 'ORIGINAL_CONTENT_MISSING'));
  assert.ok(result.warnings.some((item) => item.code === 'INDEPENDENT_SUPPORT_MISSING'));
  const accessible = await readMarkdownObject(
    path.join(root, 'evidence/records/research-001.md'),
    { workspace: root },
  );
  const blockedEvidence = await readMarkdownObject(
    path.join(root, 'evidence/records/research-002.md'),
    { workspace: root },
  );
  assert.equal(accessible.data.proof_scope, 'original_content');
  assert.equal(blockedEvidence.data.proof_scope, 'collection_failure');
  assert.equal(blockedEvidence.data.original_content_state, 'missing');
  const run = await readMarkdownObject(
    path.join(root, 'runs/RUN-M4-RESEARCH-001/run.md'),
    { workspace: root },
  );
  assert.match(run.data.manifest_fingerprint, /^[a-f0-9]{64}$/);
  await rm(root, { recursive: true });
});

test('research 拒绝把 blocked snapshot 标为已取得目标原文', async () => {
  const root = await m4ReadyWorkspace();
  const blocked = 'Challenge response only.\n';
  await writeFile(path.join(root, 'evidence/snapshots/research-invalid.txt'), blocked);
  const manifest = {
    schema_version: 'm4-research-manifest-v1',
    observations: [{
      source_ref: 'SRC-SITE-001', access_state: 'blocked',
      original_content_state: 'captured',
      snapshot: {
        path: 'evidence/snapshots/research-invalid.txt',
        sha256: sha256(blocked), media_type: 'text/plain',
      },
      support_kind: 'platform_observation', independent_support_refs: [], counter_evidence_refs: [],
      confidence: 'unknown', confidence_reason: 'Challenge response only.',
    }],
  };
  const plan = {
    ...sitePlan('RUN-M4-RESEARCH-INVALID-001'),
    observations: [{
      source_ref: 'SRC-SITE-001', id: 'EVD-M4-RESEARCH-INVALID-001',
      path: 'evidence/records/research-invalid.md',
    }],
  };
  await assert.rejects(
    ingestResearch({ workspace: root, manifest, plan, now: NOW }),
    (error) => error.code === 'EVIDENCE_SCOPE_MISMATCH',
  );
  await assert.rejects(readFile(path.join(root, 'evidence/records/research-invalid.md')));
  await rm(root, { recursive: true });
});
