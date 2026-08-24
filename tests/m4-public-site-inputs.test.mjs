import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import {
  buildPublicSiteM4Inputs,
} from '../plugins/geo-expert/scripts/lib/public-site-m4-inputs.mjs';
import { evaluateSiteManifest } from '../plugins/geo-expert/scripts/lib/site-audit.mjs';
import { ingestResearch } from '../plugins/geo-expert/scripts/lib/research-input.mjs';
import { sha256, stableStringify } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW } from './helpers/object-fixtures.mjs';
import { m4ReadyWorkspace } from './helpers/m4-fixtures.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/prepare-public-site-m4-inputs.mjs');

async function writeCollected(root, targetId, file, body, contentType) {
  const relativePath = `runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site/${file}`;
  await writeFile(path.join(root, relativePath), body);
  return {
    target_id: targetId,
    state: 'captured',
    requested_url: targetId === 'about'
      ? 'https://brand.example.invalid/about'
      : `https://brand.example.invalid/${targetId}`,
    final_url: targetId === 'about'
      ? 'https://brand.example.invalid/about'
      : `https://brand.example.invalid/${targetId}`,
    captured_at: NOW,
    collector: { name: 'geo-cowork-public-site', version: '0.3.0', mode: 'public_http' },
    response: { status: 200, headers: { 'content-type': contentType } },
    expectation: { expected_statuses: [200], status_met: true, media_type_met: true },
    snapshot_path: relativePath,
    sha256: sha256(body),
    byte_length: Buffer.byteLength(body),
  };
}

test('collection summary 确定性生成可执行 Site/Research manifest 与 plan', async () => {
  const root = await m4ReadyWorkspace();
  const outputRoot = 'runs/RUN-M4-PUBLIC-COLLECTION-TEST/inputs/m4';
  try {
    const rawRoot = path.join(root, 'runs/RUN-M4-PUBLIC-COLLECTION-TEST/raw/public-site');
    const outputsRoot = path.join(root, 'runs/RUN-M4-PUBLIC-COLLECTION-TEST/outputs');
    await mkdir(rawRoot, { recursive: true });
    await mkdir(outputsRoot, { recursive: true });
    const html = [
      '<html><head><title>Synthetic Brand</title>',
      '<meta name="description" content="Synthetic description">',
      '<meta name="robots" content="index,follow">',
      '<link rel="canonical" href="https://brand.example.invalid/about">',
      '<script type="application/ld+json">{"@context":"https://schema.org"}</script>',
      '</head><body><h1>About Synthetic Brand</h1></body></html>',
    ].join('');
    const robots = 'User-agent: *\nAllow: /\n';
    const sitemap = '<urlset><url><loc>https://brand.example.invalid/about</loc></url></urlset>\n';
    const items = [
      await writeCollected(root, 'about', 'about.html', html, 'text/html; charset=utf-8'),
      await writeCollected(root, 'robots', 'robots.txt', robots, 'text/plain'),
      await writeCollected(root, 'sitemap-pages', 'sitemap-pages.xml', sitemap, 'text/xml'),
    ];
    const summaryPath = 'runs/RUN-M4-PUBLIC-COLLECTION-TEST/outputs/public-site-collection.json';
    await writeFile(path.join(root, summaryPath), stableStringify({
      schema_version: '1.0.0',
      run_id: 'RUN-M4-PUBLIC-COLLECTION-TEST',
      state: 'completed',
      completed_at: NOW,
      collector: items[0].collector,
      plan_fingerprint: 'a'.repeat(64),
      items,
    }, 2));
    const mapping = {
      schema_version: 'm4-public-site-input-map-v1',
      output_root: outputRoot,
      development_fixture: true,
      shared: {
        goal_versions: [{ ref: 'GOAL-TEST-001', version: '1.0.0' }],
        query_set_versions: [{ ref: 'QS-TEST-001', version: '1.0.0' }],
        knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
        claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
      },
      site_defaults: { robots_target_id: 'robots', sitemap_target_id: 'sitemap-pages' },
      site_targets: [{
        target_id: 'about',
        asset_ref: 'AST-TEST-ABOUT-001',
        source_ref: 'SRC-SITE-001',
        run_id: 'RUN-M4-SITE-GENERATED-001',
        output_id_prefix: 'TEST-SITE-ABOUT-001',
      }],
      research: {
        run_id: 'RUN-M4-RESEARCH-GENERATED-001',
        skill: 'geo-reputation',
        asset_refs: ['AST-TEST-ABOUT-001'],
        observations: [{
          target_id: 'about',
          source_ref: 'SRC-SITE-001',
          evidence_id: 'EVD-M4-RESEARCH-GENERATED-001',
          evidence_path: 'evidence/records/m4-research-generated-001.md',
          claim_refs: ['CLM-TEST-001'],
          confidence: 'medium',
          confidence_reason: '一方公开原文已采集，Claim 支持范围仍待人工复核。',
        }],
      },
    };

    const first = await buildPublicSiteM4Inputs({
      workspace: root,
      collectionSummaryPath: summaryPath,
      mapping,
    });
    assert.equal(first.created.length, 4);
    const second = await buildPublicSiteM4Inputs({
      workspace: root,
      collectionSummaryPath: summaryPath,
      mapping,
    });
    assert.equal(second.created.length, 0);
    assert.equal(second.kept.length, 4);

    const mappingPath = path.join(root, 'public-site-m4-input-map.json');
    await writeFile(mappingPath, stableStringify(mapping, 2));
    const cliResult = await exec(process.execPath, [
      CLI,
      '--workspace', root,
      '--summary', summaryPath,
      '--mapping', mappingPath,
    ], { cwd: os.tmpdir() });
    assert.equal(JSON.parse(cliResult.stdout).kept.length, 4);

    const siteManifest = JSON.parse(await readFile(
      path.join(root, outputRoot, 'about.site-manifest.json'),
      'utf8',
    ));
    const evaluation = await evaluateSiteManifest({ workspace: root, manifest: siteManifest });
    assert.ok(evaluation.checks.every((item) => item.state === 'pass'));

    const researchManifest = JSON.parse(await readFile(
      path.join(root, outputRoot, 'research-manifest.json'),
      'utf8',
    ));
    const researchPlan = JSON.parse(await readFile(
      path.join(root, outputRoot, 'research-plan.json'),
      'utf8',
    ));
    const ingested = await ingestResearch({
      workspace: root,
      manifest: researchManifest,
      plan: researchPlan,
      now: NOW,
    });
    assert.deepEqual(ingested.evidence_refs, ['EVD-M4-RESEARCH-GENERATED-001']);
  } finally {
    await rm(root, { recursive: true });
  }
});
