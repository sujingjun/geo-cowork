import test from 'node:test';
import assert from 'node:assert/strict';
import dns from 'node:dns';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createM6FrozenCycleWorkspace } from './helpers/m6-cycle-fixtures.mjs';
import { writeObject } from './helpers/object-fixtures.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  realContext,
  realObject,
  putObject,
  putJson,
  jsonAt,
  ref,
} from '../plugins/geo-expert/scripts/lib/real-journey-store.mjs';
import {
  publicAddress,
  pageText,
  readPublicPage,
  captureRealSite,
  objectBinding,
  prepareRealPublication,
  confirmRealPublication,
  validateRealPublicationProof,
  retestRealPublications,
} from '../plugins/geo-expert/scripts/lib/real-publication.mjs';
import { applyRealAdoption } from '../plugins/geo-expert/scripts/lib/real-diagnosis.mjs';
import { proposeAssets } from '../plugins/geo-expert/scripts/lib/asset-proposal.mjs';
import {
  createOwnerPackage,
  acceptOwnerFeedback,
} from '../plugins/geo-expert/scripts/lib/owner-feedback.mjs';
import { validateDiagnosisObject } from '../plugins/geo-expert/scripts/lib/diagnosis-profile.mjs';
import {
  sha256,
  stableStringify,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

// This suite tests transport and state contracts with isolated HTTP responses.
// It never calls, replaces, or fabricates a model extraction or a real Cycle.
const LOCATOR = 'https://www.example.com/about';
const TEXT =
  'The development test knowledge base contains a documented fixture capability.';
const html = `<html><head><title>About</title><link rel="canonical" href="${LOCATOR}"><script type="application/ld+json">{"@context":"https://schema.org"}</script></head><body><h1>About</h1><p>${TEXT}</p></body></html>`;

function transport(
  t,
  response = () => ({ status: 200, contentType: 'text/html', body: html }),
) {
  const calls = [];
  t.mock.method(dns.promises, 'lookup', async () => [
    { address: '93.184.216.34', family: 4 },
  ]);
  t.mock.method(https, 'request', (url, options, callback) => {
    calls.push({ url: url.href, options });
    const request = new EventEmitter();
    request.destroy = (error) => {
      if (error) request.emit('error', error);
      request.emit('close');
    };
    request.end = () =>
      queueMicrotask(() => {
        const item = response(url, calls.length);
        const stream = Readable.from([Buffer.from(item.body ?? '')]);
        stream.statusCode = item.status;
        stream.headers = { 'content-type': item.contentType, ...item.headers };
        stream.on('end', () => request.emit('close'));
        callback(stream);
      });
    return request;
  });
  return calls;
}
function defaultResponse(url) {
  if (url.pathname === '/robots.txt')
    return {
      status: 200,
      contentType: 'text/plain',
      body: 'User-agent: *\nAllow: /\n',
    };
  if (url.pathname === '/sitemap.xml')
    return { status: 404, contentType: 'text/plain', body: 'Not found' };
  return { status: 200, contentType: 'text/html', body: html };
}
async function owner(workspace, pack, decision = 'approve', extra = '') {
  return acceptOwnerFeedback({
    workspace,
    text: `包：${pack.id}\n校验：${pack.sha256}\n决定：${decision}\n决定人：Isolated contract reviewer\n时间：${new Date().toISOString()}\n说明：Verify isolated state contract.\n${extra}`,
  });
}
async function fixture(t) {
  const { root, cycle } = await createM6FrozenCycleWorkspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  const identity = await jsonAt(root, 'workspace.json');
  await writeFile(
    path.join(root, 'workspace.json'),
    JSON.stringify({
      ...identity,
      workspace_mode: 'online',
      execution_scope: 'authorized_real',
    }),
  );
  let graph = await loadWorkspaceGraph({ workspace: root });
  const asset = graph.byId.get('AST-M6-TEST-001');
  delete asset.data.test_scope;
  asset.data.locator = LOCATOR;
  await writeObject(root, asset.path, asset.data, asset.content);
  delete cycle.test_scope;
  cycle.scope = 'authorized_real';
  cycle.execution_scope = 'authorized_real';
  cycle.aggregate_stage = 'diagnosis_ready';
  cycle.goal_tracks[0].stage = 'diagnosis_ready';
  const plan = {
    cycle_ref: cycle.id,
    cycle_number: 1,
    cycle_dir: 'cycles/real-contract',
    run_ref: 'RUN-REAL-CONTRACT',
    asset_refs: [asset.data.id],
    query_set_ref: 'QS-M6-TEST-001',
    knowledge: { release_ref: 'KR-M6-TEST-001' },
    execution_owner: 'Isolated reviewer',
  };
  await putJson(root, 'cycles/preparation/real-cycle-plan.json', plan);
  await writeObject(root, 'cycles/m6/cycle.md', cycle);
  const capture = await captureRealSite(
    root,
    asset,
    'runs/RUN-REAL-CONTRACT/raw/diagnosis',
  );
  const fid = 'FND-REAL-CONTRACT';
  await putObject(root, 'findings', {
    ...realObject(
      fid,
      'finding',
      'waiting_human',
      'Supported contract finding',
    ),
    finding_code: 'GEO_CONTENT_GAP',
    finding_kind: 'semantic',
    item_state: 'inferred',
    rule_version: 'test-v1',
    diagnosis_class: 'content_gap',
    query_refs: asset.data.query_refs,
    claim_refs: asset.data.claim_versions.map((v) => v.ref),
    evidence_refs: ['EVD-M6-TEST-001', capture.evidence.data.id],
    asset_refs: [asset.data.id],
    source_refs: [capture.source.data.id],
    gap_basis: {
      supporting_evidence_refs: ['EVD-M6-TEST-001', capture.evidence.data.id],
      counter_evidence_refs: [],
      unresolved_conflicts: [],
      rationale: 'Isolated profile contract.',
    },
  });
  ({ graph } = await realContext(root));
  const inputBindings = await Promise.all(
    [
      asset,
      ...asset.data.claim_versions.map((v) => graph.byId.get(v.ref)),
      ...asset.data.knowledge_release_versions.map((v) =>
        graph.byId.get(v.ref),
      ),
    ].map((o) => objectBinding(root, o)),
  );
  await proposeAssets({
    workspace: root,
    now: '2026-08-28T00:00:00Z',
    plan: {
      proposals: [
        {
          id: 'PRP-REAL-CONTRACT',
          path: 'assets/proposals/contract.md',
          title: 'Contract replacement',
          asset_ref: asset.data.id,
          goal_refs: asset.data.goal_refs,
          query_refs: asset.data.query_refs,
          finding_refs: [fid],
          knowledge_release_versions: asset.data.knowledge_release_versions,
          claim_versions: asset.data.claim_versions,
          evidence_refs: ['EVD-M6-TEST-001', capture.evidence.data.id],
          body: `## Proposed replacement\n${TEXT}\n`,
          recommendation_items: [
            {
              item_id: 'REC-REAL-CONTRACT',
              section: 'Proposed replacement',
              action: 'Human publishes after review.',
              proposed_text: TEXT,
              claim_refs: asset.data.claim_versions.map((v) => v.ref),
              evidence_refs: ['EVD-M6-TEST-001', capture.evidence.data.id],
              finding_refs: [fid],
              risk: {
                level: 'low',
                type: 'scope_limit',
                reason: 'Contract only.',
                suggested_weakening: 'Preserve limitations.',
              },
            },
          ],
          extensions: {
            'geo.real_diagnosis': {
              cycle_ref: cycle.id,
              input_bindings: inputBindings,
              artifacts: [],
              publication_ready: true,
            },
          },
        },
      ],
    },
  });
  ({ graph } = await realContext(root));
  const proposal = graph.byId.get('PRP-REAL-CONTRACT');
  const pack = await createOwnerPackage({
    workspace: root,
    id: 'OWNER-REAL-CONTRACT',
    kind: 'adoption',
    objects: [proposal],
    title: 'Contract review',
    body: proposal.content,
  });
  const feedback = await owner(root, pack);
  const adopted = await applyRealAdoption(root, feedback);
  cycle.aggregate_stage = 'adoption_decided';
  cycle.goal_tracks[0].stage = 'adoption_decided';
  cycle.goal_tracks[0].adoption_record_refs = adopted.adoption_refs;
  await writeObject(root, 'cycles/m6/cycle.md', cycle);
  const receipt = {
    locator: LOCATOR,
    published_at: new Date().toISOString(),
    actor: 'Isolated manual publisher',
    adoption_ref: adopted.adoption_refs[0],
    item_ids: ['REC-REAL-CONTRACT'],
    content_checks: [{ item_id: 'REC-REAL-CONTRACT', text: TEXT }],
  };
  return { root, cycle, plan, receipt, feedback, proposal };
}
async function publish(f) {
  const prepared = await prepareRealPublication(f.root, f.receipt);
  const pack = await jsonAt(f.root, prepared.package.replace(/\.md$/, '.json'));
  pack.sha256 = sha256(
    await readFile(
      path.join(f.root, prepared.package.replace(/\.md$/, '.json')),
    ),
  );
  const feedback = await owner(f.root, pack);
  const publication = await confirmRealPublication(f.root, feedback);
  return { prepared, publication, feedback };
}

test('public read-back rejects private, mapped, reserved and multicast DNS answers', async (t) => {
  for (const ip of [
    '0.0.0.0',
    '10.1.1.1',
    '127.1.2.3',
    '100.64.0.1',
    '169.254.1.1',
    '172.31.0.1',
    '192.168.0.1',
    '192.0.2.5',
    '198.19.0.1',
    '198.51.100.8',
    '203.0.113.1',
    '225.1.1.1',
    '239.0.0.1',
    '255.255.255.255',
    '::1',
    '::ffff:8.8.8.8',
    'fe80::1',
    'fc00::1',
    '2001:db8::1',
    '2002:7f00:1::',
  ])
    assert.equal(publicAddress(ip), false, ip);
  assert.equal(publicAddress('8.8.8.8'), true);
  assert.equal(publicAddress('2606:4700:4700::1111'), true);
  const calls = transport(t);
  t.mock.method(dns.promises, 'lookup', async () => [
    { address: '8.8.8.8', family: 4 },
    { address: '10.0.0.1', family: 4 },
  ]);
  await assert.rejects(readPublicPage(LOCATOR), {
    code: 'PUBLICATION_TARGET_INVALID',
  });
  assert.equal(calls.length, 0);
});
test('HTTPS socket is pinned to checked DNS and cross-origin redirects are rejected', async (t) => {
  const calls = transport(t, (url) => ({
    status: 302,
    contentType: 'text/html',
    headers: { location: 'https://other.example.com/' },
  }));
  await assert.rejects(readPublicPage(LOCATOR), {
    code: 'PUBLICATION_TARGET_INVALID',
  });
  const options = calls[0].options;
  assert.equal(options.servername, 'www.example.com');
  assert.equal(options.agent, false);
  options.lookup('www.example.com', {}, (error, address, family) => {
    assert.equal(error, null);
    assert.equal(address, '93.184.216.34');
    assert.equal(family, 4);
  });
});
test('same-origin bounded redirects work and non-HTML responses are not publication proof', async (t) => {
  transport(t, (url) =>
    url.pathname === '/about'
      ? { status: 301, headers: { location: '/about/' }, body: '' }
      : { status: 200, contentType: 'text/html', body: html },
  );
  const page = await readPublicPage(LOCATOR);
  assert.equal(page.final_url, `${LOCATOR}/`);
  assert.equal(page.redirects.length, 1);
  t.mock.restoreAll();
  transport(t, () => ({
    status: 200,
    contentType: 'application/json',
    body: '{}',
  }));
  await assert.rejects(readPublicPage(LOCATOR), {
    code: 'PUBLICATION_READBACK_FAILED',
  });
  assert.equal(
    pageText(
      '<script>approved</script><!-- approved --><p>A &amp; B &#x26; C</p>',
    ),
    'A & B & C',
  );
});
test('manual receipt creates a draft before a distinct Owner confirmation; retries reuse capture', async (t) => {
  const calls = transport(t, defaultResponse),
    f = await fixture(t);
  const before = calls.length;
  const prepared = await prepareRealPublication(f.root, f.receipt);
  assert.equal(calls.length, before + 1);
  assert.equal(
    (await realContext(f.root)).graph.objects.filter(
      (o) =>
        o.data.record_type === 'asset_publication' &&
        o.data.status === 'confirmed',
    ).length,
    0,
  );
  assert.deepEqual(await prepareRealPublication(f.root, f.receipt), prepared);
  assert.equal(calls.length, before + 1);
  const result = await publish(f);
  assert.equal(result.publication.data.status, 'confirmed');
  await validateRealPublicationProof(f.root, result.publication.data);
  assert.deepEqual(
    (await confirmRealPublication(f.root, result.feedback)).data,
    result.publication.data,
  );
});
test('read-back rejects partial excerpts and text absent from actual page', async (t) => {
  transport(t, defaultResponse);
  const f = await fixture(t);
  await assert.rejects(
    prepareRealPublication(f.root, {
      ...f.receipt,
      content_checks: [
        { item_id: 'REC-REAL-CONTRACT', text: TEXT.slice(0, 30) },
      ],
    }),
    { code: 'PUBLICATION_CONTENT_CHECK_REQUIRED' },
  );
  t.mock.restoreAll();
  transport(t, () => ({
    status: 200,
    contentType: 'text/html',
    body: `<html><script>${TEXT}</script><body>Missing</body></html>`,
  }));
  await assert.rejects(prepareRealPublication(f.root, f.receipt), {
    code: 'PUBLICATION_CONTENT_MISMATCH',
  });
});
test('foreign or modified publication decisions cannot confirm a draft', async (t) => {
  transport(t, defaultResponse);
  const f = await fixture(t);
  const result = await publish(f);
  await assert.rejects(
    confirmRealPublication(f.root, {
      ...result.feedback,
      decision: { ...result.feedback.decision, actor: 'Another person' },
    }),
    { code: 'OWNER_FEEDBACK_CONFLICT' },
  );
  await assert.rejects(
    validateRealPublicationProof(f.root, {
      ...result.publication.data,
      approval: {
        ...result.publication.data.approval,
        decision_ref: f.feedback.decision_ref,
      },
    }),
  );
  await assert.rejects(
    validateRealPublicationProof(f.root, {
      ...result.publication.data,
      published_item_ids: ['unadopted'],
    }),
    { code: 'PUBLICATION_PROOF_INVALID' },
  );
});
test('confirmed proof rejects stale proposal bytes and raw proof tampering', async (t) => {
  transport(t, defaultResponse);
  const f = await fixture(t);
  const { publication } = await publish(f);
  const original = await readFile(path.join(f.root, f.proposal.path));
  await writeFile(
    path.join(f.root, f.proposal.path),
    Buffer.concat([original, Buffer.from('\nChanged wording\n')]),
  );
  await assert.rejects(validateRealPublicationProof(f.root, publication.data), {
    code: 'PUBLICATION_INPUT_DRIFT',
  });
  await writeFile(path.join(f.root, f.proposal.path), original);
  const proof = await jsonAt(
    f.root,
    publication.data.extensions['geo.publication_proof'].path,
  );
  await writeFile(path.join(f.root, proof.raw.path), '{}');
  await assert.rejects(validateRealPublicationProof(f.root, publication.data), {
    code: 'PUBLICATION_PROOF_INVALID',
  });
});
test('technical retest records all nine M4 outcomes, warnings, and recovers missing schedule', async (t) => {
  const calls = transport(t, defaultResponse),
    f = await fixture(t);
  const { publication } = await publish(f);
  f.cycle.aggregate_stage = 'publication_confirmed';
  f.cycle.goal_tracks[0].stage = 'publication_confirmed';
  f.cycle.goal_tracks[0].publication_refs = [publication.data.id];
  await writeObject(f.root, 'cycles/m6/cycle.md', f.cycle);
  const runs = await retestRealPublications(f.root);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].data.detector_results.length, 9);
  assert.equal(
    runs[0].data.detector_results.find((c) => c.code === 'SITEMAP').state,
    'unverifiable',
  );
  assert.equal(
    runs[0].data.detector_results.find(
      (c) => c.code === 'META_DESCRIPTION_PRESENT',
    ).state,
    'fail',
  );
  const graph = (await realContext(f.root)).graph;
  for (const o of graph.objects.filter(
    (o) => o.data.id.includes('REAL-TECH') || o.data.id === runs[0].data.id,
  ))
    assert.deepEqual(validateDiagnosisObject(graph, o).errors, []);
  const schedule = await jsonAt(f.root, `${f.plan.cycle_dir}/schedule.json`);
  assert.equal(schedule.windows.length, 4);
  const report = await jsonAt(
    f.root,
    `runs/${runs[0].data.id}/outputs/technical-readback.json`,
  );
  assert.equal(report.all_checks_passed, false);
  assert.equal(report.warnings.length, 2);
  await rm(path.join(f.root, `${f.plan.cycle_dir}/schedule.json`));
  const before = calls.length;
  assert.deepEqual(
    (await retestRealPublications(f.root)).map((o) => o.data.id),
    runs.map((o) => o.data.id),
  );
  assert.deepEqual(
    await jsonAt(f.root, `${f.plan.cycle_dir}/schedule.json`),
    schedule,
  );
  assert.equal(calls.length, before);
});

test('content modification creates an immutable successor and requires a new Owner decision', async (t) => {
  transport(t, defaultResponse);
  const f = await fixture(t);
  const pack = await createOwnerPackage({
    workspace: f.root,
    id: 'OWNER-CONTRACT-MODIFY',
    kind: 'adoption',
    objects: [f.proposal],
    title: 'Modify recommendation',
    body: f.proposal.content,
  });
  const feedback = await owner(
    f.root,
    pack,
    'modify',
    `对象：${f.proposal.data.id}\n修改内容：${TEXT}\n`,
  );
  const revised = await applyRealAdoption(f.root, feedback);
  assert.equal(revised.waiting_human, true);
  assert.notEqual(revised.proposal_ref, f.proposal.data.id);
  assert.deepEqual(await applyRealAdoption(f.root, feedback), revised);
  const graph = (await realContext(f.root)).graph;
  assert.equal(
    graph.byId.get(revised.proposal_ref).data.supersedes_ref,
    f.proposal.data.id,
  );
  assert.equal(
    graph.objects.some(
      (o) =>
        o.data.record_type === 'adoption_record' &&
        o.data.proposal_ref === revised.proposal_ref,
    ),
    false,
  );
  await assert.rejects(prepareRealPublication(f.root, f.receipt), {
    code: 'PUBLICATION_INPUT_DRIFT',
  });
});

test('evidence-only recommendations remain nonpublishable after modification and reapproval', async (t) => {
  transport(t, defaultResponse);
  const f = await fixture(t);
  const data = structuredClone(f.proposal.data);
  delete data.recommendation_items[0].proposed_text;
  data.extensions['geo.real_diagnosis'].publication_ready = false;
  await writeObject(f.root, f.proposal.path, data, f.proposal.content);
  const proposal = (await realContext(f.root)).graph.byId.get(data.id);
  const pack = await createOwnerPackage({
    workspace: f.root,
    id: 'OWNER-EVIDENCE-MODIFY',
    kind: 'adoption',
    objects: [proposal],
    title: 'Evidence review',
    body: proposal.content,
  });
  const feedback = await owner(
    f.root,
    pack,
    'modify',
    '修改内容：Ask the capability owner for dated scope evidence.\n',
  );
  const result = await applyRealAdoption(f.root, feedback);
  assert.equal(result.publication_ready, false);
  assert.deepEqual(await applyRealAdoption(f.root, feedback), result);
  const revisedPack = await jsonAt(
    f.root,
    result.package.replace(/\.md$/, '.json'),
  );
  revisedPack.sha256 = sha256(
    await readFile(path.join(f.root, result.package.replace(/\.md$/, '.json'))),
  );
  const decision = await owner(f.root, revisedPack);
  const adopted = await applyRealAdoption(f.root, decision);
  assert.equal(adopted.publication_ready, false);
  const graph = (await realContext(f.root)).graph;
  assert.equal(
    graph.byId
      .get(result.proposal_ref)
      .data.recommendation_items.some((i) => i.proposed_text),
    false,
  );
});
