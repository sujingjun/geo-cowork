import { readFile } from 'node:fs/promises';
import dns from 'node:dns';
import https from 'node:https';
import { isIP } from 'node:net';
import {
  realPublicUrl,
  requireReal,
  realError,
  validatePublicationReceipt,
  buildObservationSchedule,
} from './real-cycle-contract.mjs';
import {
  realContext,
  putObject,
  putJson,
  jsonAt,
  realObject,
  approvalFrom,
  ref,
} from './real-journey-store.mjs';
import {
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
  assertNoSymlinkPath,
} from './workspace-paths.mjs';
import { createOwnerPackage } from './owner-feedback.mjs';
import {
  evaluateSiteManifest,
  technicalRetest,
  SITE_CODES,
} from './site-audit.mjs';
import { validateDiagnosisObject } from './diagnosis-profile.mjs';

// Only globally routable addresses are eligible. In particular, mapped IPv4,
// link-local, documentation, multicast and transition ranges are not public.
export function publicAddress(address) {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split('.').map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  if (isIP(address) !== 6) return false;
  const first = Number.parseInt(address.split(':')[0], 16);
  const second = Number.parseInt(address.split(':')[1] || '0', 16);
  return (
    first >= 0x2000 &&
    first <= 0x3fff &&
    first !== 0x2002 &&
    !(first === 0x2001 && (second <= 0x1ff || second === 0xdb8))
  );
}

export const pageText = (html) =>
  String(html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(
      /<(script|style|template|noscript|head)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      ' ',
    )
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|nbsp|amp|lt|gt|quot|apos);/gi, (_, entity) => {
      if (entity[0] !== '#')
        return { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[
          entity.toLowerCase()
        ];
      const code = Number.parseInt(
        entity.slice(/^#x/i.test(entity) ? 2 : 1),
        /^#x/i.test(entity) ? 16 : 10,
      );
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    })
    .replace(/\s+/g, ' ')
    .trim();

async function pinnedRequest(url) {
  const addresses = await dns.promises.lookup(url.hostname, {
    all: true,
    verbatim: true,
  });
  requireReal(
    addresses.length && addresses.every((a) => publicAddress(a.address)),
    'PUBLICATION_TARGET_INVALID',
    'Private or reserved network targets are forbidden',
  );
  const selected = addresses.find((a) => a.family === 4) ?? addresses[0];
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: 'GET',
        agent: false,
        autoSelectFamily: false,
        servername: url.hostname,
        // The actual TLS socket uses the validated address; it never resolves DNS a second time.
        lookup: (_host, options, callback) =>
          options?.all
            ? callback(null, [selected])
            : callback(null, selected.address, selected.family),
        headers: {
          'User-Agent': 'geo-cowork/0.3 real-cycle-readback',
          Accept:
            'text/html,application/xhtml+xml,application/xml,text/xml,text/plain',
          'Accept-Encoding': 'identity',
        },
      },
      (response) => {
        const chunks = [];
        let size = 0;
        response.on('data', (chunk) => {
          size += chunk.length;
          if (size > 4 * 1024 * 1024)
            request.destroy(
              realError(
                'PUBLICATION_READBACK_FAILED',
                'Page exceeds capture limit',
              ),
            );
          else chunks.push(chunk);
        });
        response.on('error', reject);
        response.on('end', () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            html: Buffer.concat(chunks).toString('utf8'),
          }),
        );
      },
    );
    const timer = setTimeout(
      () =>
        request.destroy(
          realError('PUBLICATION_READBACK_FAILED', 'Read-back timed out'),
        ),
      30000,
    );
    request.on('close', () => clearTimeout(timer));
    request.on('error', reject);
    request.end();
  });
}

export async function readPublicPage(locator, { resource = 'html' } = {}) {
  const original = realPublicUrl(locator);
  let current = original;
  const redirects = [];
  for (;;) {
    const response = await pinnedRequest(current);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = realPublicUrl(
        new URL(response.headers.location ?? '', current).href,
      );
      requireReal(
        next.origin === original.origin &&
          redirects.length < 3 &&
          next.href !== current.href,
        'PUBLICATION_TARGET_INVALID',
        'Read-back redirects must remain on the approved HTTPS origin',
      );
      redirects.push({
        from: current.href,
        to: next.href,
        status: response.status,
      });
      current = next;
      continue;
    }
    requireReal(
      response.status === 200,
      'PUBLICATION_READBACK_FAILED',
      `Read-back returned HTTP ${response.status}`,
    );
    const contentType = String(response.headers['content-type'] ?? '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    const allowed =
      resource === 'html'
        ? ['text/html', 'application/xhtml+xml']
        : resource === 'robots'
          ? ['text/plain']
          : ['application/xml', 'text/xml'];
    requireReal(
      allowed.includes(contentType),
      'PUBLICATION_READBACK_FAILED',
      `Unexpected ${resource} content type: ${contentType}`,
    );
    requireReal(
      !response.headers['content-encoding'] ||
        response.headers['content-encoding'] === 'identity',
      'PUBLICATION_READBACK_FAILED',
      'Unexpected compressed read-back',
    );
    return {
      locator: original.href,
      final_url: current.href,
      redirects,
      html: response.html,
      fetched_at: new Date().toISOString(),
      status: response.status,
      headers: Object.fromEntries(
        ['content-type', 'x-robots-tag']
          .filter((k) => response.headers[k] !== undefined)
          .map((k) => [k, String(response.headers[k])]),
      ),
    };
  }
}

export async function objectBinding(workspace, object) {
  requireReal(
    object?.data && object?.path,
    'PUBLICATION_INPUT_DRIFT',
    'Bound object is missing',
  );
  await assertNoSymlinkPath(workspace, object.path);
  return {
    ...ref(object),
    path: object.path,
    sha256: sha256(await readFile(resolveWithin(workspace, object.path))),
  };
}
export async function validateBindings(workspace, graph, bindings) {
  requireReal(
    Array.isArray(bindings) && bindings.length > 0,
    'PUBLICATION_INPUT_DRIFT',
    'Exact input bindings are required',
  );
  for (const binding of bindings)
    requireReal(
      stableStringify(
        await objectBinding(workspace, graph.byId.get(binding.ref)),
      ) === stableStringify(binding),
      'PUBLICATION_INPUT_DRIFT',
      `Reviewed input changed: ${binding.ref}`,
    );
}

export async function checkedOwnerDecision(workspace, decisionRef, kind) {
  requireReal(
    /^workspace:\/\/reviews\/decisions\/[A-Za-z0-9-]+\.json$/.test(
      decisionRef ?? '',
    ),
    'OWNER_FEEDBACK_INVALID',
    'Independent Owner decision is required',
  );
  const decision = await jsonAt(workspace, decisionRef.slice(12));
  requireReal(
    decisionRef ===
      `workspace://reviews/decisions/${decision.package_id}.json` &&
      decision.scope === 'authorized_real' &&
      decision.actor?.trim() &&
      Number.isFinite(Date.parse(decision.at)) &&
      Date.parse(decision.at) <= Date.now(),
    'OWNER_FEEDBACK_INVALID',
    'Owner decision identity, scope or time is invalid',
  );
  const bytes = await readFile(
    resolveWithin(workspace, `reviews/packages/${decision.package_id}.json`),
  );
  const pack = JSON.parse(bytes);
  requireReal(
    sha256(bytes) === decision.package_sha256 &&
      pack.id === decision.package_id &&
      pack.kind === kind &&
      pack.actions.includes(decision.decision) &&
      sha256(pack.body) === pack.body_sha256 &&
      pack.targets.length,
    'OWNER_FEEDBACK_CONFLICT',
    'Owner decision does not bind this exact package',
  );
  const { graph, plan } = await realContext(workspace);
  let targets = pack.targets;
  if (kind === 'real_knowledge') {
    const proposal = pack.targets[0];
    requireReal(
      proposal.id === `KNOWLEDGE-${plan.cycle_ref}` &&
        proposal.path === `${plan.cycle_dir}/knowledge-proposal.json`,
      'OWNER_FEEDBACK_CONFLICT',
      'Knowledge package must bind this cycle proposal artifact',
    );
    const proposalBytes = await readFile(
        resolveWithin(workspace, proposal.path),
      ),
      data = JSON.parse(proposalBytes);
    requireReal(
      sha256(proposalBytes) === proposal.sha256 &&
        data.id === proposal.id &&
        data.version === proposal.version &&
        data.knowledge_base_ref === plan.knowledge_base_ref &&
        data.goal_ref === plan.goal_ref &&
        data.query_set_ref === plan.query_set_ref,
      'OWNER_FEEDBACK_CONFLICT',
      'Knowledge proposal artifact changed',
    );
    targets = pack.targets.slice(1);
  }
  await validateBindings(
    workspace,
    graph,
    targets.map((t) => ({
      ref: t.id,
      version: t.version,
      path: t.path,
      sha256: t.sha256,
    })),
  );
  return { decision, package: pack, decision_ref: decisionRef };
}
export async function checkedFeedback(workspace, feedback, kind) {
  const saved = await checkedOwnerDecision(
    workspace,
    feedback.decision_ref,
    kind,
  );
  requireReal(
    stableStringify(saved.package) === stableStringify(feedback.package) &&
      [
        'actor',
        'at',
        'decision',
        'package_id',
        'package_sha256',
        'reason',
        'modified_text',
        'target',
      ].every((k) => saved.decision[k] === feedback.decision[k]),
    'OWNER_FEEDBACK_CONFLICT',
    'Feedback differs from the persisted human decision',
  );
  return saved;
}

async function publicationInputs(workspace, graph, adoption) {
  const proposal = graph.byId.get(adoption?.data.proposal_ref),
    asset = graph.byId.get(adoption?.data.asset_ref);
  requireReal(
    adoption?.data.record_type === 'adoption_record' &&
      proposal?.data.record_type === 'asset_proposal' &&
      asset?.data.record_type === 'asset',
    'PUBLICATION_TARGET_INVALID',
    'Publication needs a canonical adoption, proposal and asset',
  );
  const adopted = await checkedOwnerDecision(
    workspace,
    adoption.data.approval?.decision_ref,
    'adoption',
  );
  requireReal(
    adopted.decision.decision === 'approve' &&
      adopted.decision.actor === adoption.data.approval.approved_by &&
      adopted.decision.at === adoption.data.approval.approved_at &&
      adopted.package.targets.some((t) => t.id === proposal.data.id),
    'PUBLICATION_ADOPTION_MISMATCH',
    'Adoption was not approved for this proposal',
  );
  requireReal(
    !graph.objects.some(
      (o) =>
        o.data.record_type === 'asset_proposal' &&
        o.data.supersedes_ref === proposal.data.id,
    ),
    'PUBLICATION_INPUT_DRIFT',
    'Proposal has a newer revision requiring review',
  );
  await validateBindings(
    workspace,
    graph,
    adoption.data.extensions?.['geo.real_adoption']?.input_bindings,
  );
  const profile = validateDiagnosisObject(graph, adoption);
  requireReal(
    !profile.errors.length,
    'PUBLICATION_ADOPTION_MISMATCH',
    'Adoption does not satisfy the asset contract',
  );
  return { adoption, proposal, asset };
}

function assertContentChecks(receipt, proposal, adoption) {
  const checks = receipt.content_checks;
  requireReal(
    Array.isArray(checks) &&
      checks.length === receipt.item_ids.length &&
      new Set(checks.map((c) => c.item_id)).size === checks.length &&
      checks.every((c) => {
        const item = proposal.data.recommendation_items.find(
          (i) => i.item_id === c.item_id,
        );
        const decision = adoption.data.decisions.find(
          (d) => d.item_id === c.item_id,
        );
        const expected =
          decision?.decision === 'modified'
            ? decision.modified_text
            : item?.proposed_text;
        return (
          receipt.item_ids.includes(c.item_id) &&
          typeof c.text === 'string' &&
          pageText(c.text).length > 0 &&
          typeof expected === 'string' &&
          pageText(c.text) === pageText(expected) &&
          proposal.content.includes(expected)
        );
      }),
    'PUBLICATION_CONTENT_CHECK_REQUIRED',
    'Each published item must match its complete approved replacement',
  );
}

export async function prepareRealPublication(workspace, receipt) {
  const { plan, graph, cycle } = await realContext(workspace);
  requireReal(
    cycle?.data.aggregate_stage === 'adoption_decided',
    'PUBLICATION_STAGE_INVALID',
    'Publication requires decided adoption',
  );
  requireReal(
    cycle.data.goal_tracks[0].adoption_record_refs.includes(
      receipt.adoption_ref,
    ),
    'PUBLICATION_ADOPTION_MISMATCH',
    'Adoption is outside this cycle',
  );
  const { adoption, asset, proposal } = await publicationInputs(
    workspace,
    graph,
    graph.byId.get(receipt.adoption_ref),
  );
  validatePublicationReceipt(receipt, {
    adoption: adoption.data,
    asset: asset.data,
    requireAttestation: false,
  });
  requireReal(
    Date.parse(receipt.published_at) >=
      Date.parse(adoption.data.approval.approved_at),
    'PUBLICATION_ATTESTATION_REQUIRED',
    'Publication must follow approval',
  );
  assertContentChecks(receipt, proposal, adoption);
  const bindings = await Promise.all(
    [adoption, asset, proposal].map((o) => objectBinding(workspace, o)),
  );
  const key = sha256(
    stableStringify({ cycle_ref: cycle.data.id, receipt, bindings }),
  )
    .slice(0, 16)
    .toUpperCase();
  const rawPath = `runs/${plan.run_ref}/outputs/publication-${key}-page.json`;
  let page = await jsonAt(workspace, rawPath, null);
  if (!page) {
    page = await readPublicPage(receipt.locator);
    await putJson(workspace, rawPath, page);
  }
  requireReal(
    page.locator === receipt.locator &&
      page.status === 200 &&
      Date.parse(page.fetched_at) >= Date.parse(receipt.published_at) &&
      receipt.content_checks.every((c) =>
        pageText(page.html).includes(pageText(c.text)),
      ),
    'PUBLICATION_CONTENT_MISMATCH',
    'Published page does not contain the complete adopted text',
  );
  const raw = await putJson(workspace, rawPath, page);
  const proof = await putJson(
    workspace,
    `runs/${plan.run_ref}/outputs/publication-${key}.json`,
    {
      synthetic: false,
      cycle_ref: cycle.data.id,
      logical_locator: receipt.locator,
      status: 200,
      content_sha256: sha256(page.html),
      fetched_at: page.fetched_at,
      receipt,
      content_checks: receipt.content_checks,
      raw,
      input_bindings: bindings,
    },
  );
  const data = {
    ...realObject(
      `PUB-REAL-${key}-DRAFT`,
      'asset_publication',
      'draft',
      `Publication ${receipt.locator}`,
      page.fetched_at,
    ),
    proposal_ref: proposal.data.id,
    adoption_ref: adoption.data.id,
    asset_ref: asset.data.id,
    published_locator: receipt.locator,
    published_at: receipt.published_at,
    published_item_ids: receipt.item_ids,
    content_sha256: sha256(page.html),
    extensions: { 'geo.publication_proof': proof },
  };
  const object = await putObject(workspace, 'assets/publications', data);
  const pack = await createOwnerPackage({
    workspace,
    id: `OWNER-PUBLICATION-${key}`,
    kind: 'real_publication',
    objects: [object, adoption, proposal, asset],
    title: '确认真实发布读回结果',
    body: `目标：${receipt.locator}\n发布人：${receipt.actor}\n发布时间：${receipt.published_at}\n读回时间：${page.fetched_at}\n采用项：${receipt.item_ids.join(', ')}\n完整批准内容已与真实页面读回匹配：\n${receipt.content_checks.map((c) => `- ${c.text}`).join('\n')}\n请确认实际发布事实；批准建议本身不代表已发布。`,
  });
  return { waiting_human: true, package: pack.file };
}
export async function confirmRealPublication(workspace, feedback) {
  feedback = await checkedFeedback(workspace, feedback, 'real_publication');
  const { graph } = await realContext(workspace);
  const drafts = feedback.package.targets
    .map((t) => graph.byId.get(t.id))
    .filter((o) => o?.data.record_type === 'asset_publication');
  requireReal(
    drafts.length === 1 &&
      drafts[0].data.status === 'draft' &&
      feedback.decision.decision === 'approve',
    'PUBLICATION_ATTESTATION_REQUIRED',
    'Publication confirmation required',
  );
  const draft = drafts[0];
  const data = {
    ...draft.data,
    id: draft.data.id.replace(/-DRAFT$/, '-CONFIRMED'),
    status: 'confirmed',
    supersedes_ref: draft.data.id,
    approval: approvalFrom(feedback),
    updated_at: feedback.decision.at,
  };
  await validateRealPublicationProof(workspace, data);
  return putObject(workspace, 'assets/publications', data, draft.content);
}
export async function validateRealPublicationProof(workspace, publication) {
  realPublicUrl(publication.published_locator);
  const p = publication.extensions?.['geo.publication_proof'];
  requireReal(
    p?.path && p.sha256,
    'PUBLICATION_PROOF_REQUIRED',
    'Real publication requires read-back proof',
  );
  const bytes = await readFile(resolveWithin(workspace, p.path)),
    proof = JSON.parse(bytes);
  const { graph } = await realContext(workspace);
  const ownerCycle = graph.byId.get(proof.cycle_ref);
  requireReal(
    sha256(bytes) === p.sha256 &&
      proof.synthetic === false &&
      proof.status === 200 &&
      ownerCycle?.data.execution_scope === 'authorized_real' &&
      ownerCycle.data.goal_tracks.some((track) =>
        track.adoption_record_refs.includes(publication.adoption_ref),
      ) &&
      publication.status === 'confirmed' &&
      !publication.test_scope &&
      proof.logical_locator === publication.published_locator &&
      proof.content_sha256 === publication.content_sha256 &&
      proof.receipt.published_at === publication.published_at &&
      stableStringify(proof.receipt.item_ids) ===
        stableStringify(publication.published_item_ids) &&
      proof.receipt.adoption_ref === publication.adoption_ref,
    'PUBLICATION_PROOF_INVALID',
    'Read-back proof binding differs',
  );
  await validateBindings(workspace, graph, proof.input_bindings);
  const rawBytes = await readFile(resolveWithin(workspace, proof.raw.path)),
    raw = JSON.parse(rawBytes);
  requireReal(
    sha256(rawBytes) === proof.raw.sha256 &&
      raw.status === 200 &&
      raw.locator === publication.published_locator &&
      raw.fetched_at === proof.fetched_at &&
      Date.parse(raw.fetched_at) >= Date.parse(publication.published_at) &&
      sha256(raw.html) === publication.content_sha256 &&
      stableStringify(proof.content_checks) ===
        stableStringify(proof.receipt.content_checks) &&
      proof.content_checks?.length &&
      proof.content_checks.every((c) =>
        pageText(raw.html).includes(pageText(c.text)),
      ),
    'PUBLICATION_PROOF_INVALID',
    'Publication bytes or adopted text differ',
  );
  const { adoption, asset, proposal } = await publicationInputs(
    workspace,
    graph,
    graph.byId.get(publication.adoption_ref),
  );
  requireReal(
    proposal.data.id === publication.proposal_ref &&
      asset.data.id === publication.asset_ref,
    'PUBLICATION_PROOF_INVALID',
    'Publication refers to another asset or proposal',
  );
  assertContentChecks(proof.receipt, proposal, adoption);
  validatePublicationReceipt(
    {
      ...proof.receipt,
      decision_ref: publication.approval?.decision_ref,
      actor: publication.approval?.approved_by,
    },
    { adoption: adoption.data, asset: asset.data },
  );
  const feedback = await checkedOwnerDecision(
    workspace,
    publication.approval.decision_ref,
    'real_publication',
  );
  const draft = graph.byId.get(publication.supersedes_ref);
  requireReal(
    feedback.decision.decision === 'approve' &&
      feedback.decision.actor === publication.approval.approved_by &&
      feedback.decision.at === publication.approval.approved_at &&
      Date.parse(feedback.decision.at) >= Date.parse(raw.fetched_at) &&
      feedback.package.targets.some(
        (t) => t.id === publication.supersedes_ref,
      ) &&
      draft?.data.extensions?.['geo.publication_proof']?.sha256 === p.sha256 &&
      [
        'adoption_ref',
        'proposal_ref',
        'asset_ref',
        'published_locator',
        'published_at',
        'content_sha256',
      ].every((k) => draft.data[k] === publication[k]) &&
      stableStringify(draft.data.published_item_ids) ===
        stableStringify(publication.published_item_ids),
    'PUBLICATION_ATTESTATION_REQUIRED',
    'Independent post-readback decision for this exact publication is missing',
  );
  return proof;
}

// Persist each response before materialization so interrupted retries use exactly
// the captured bytes, without moving either the evidence or observation clock.
export async function captureRealSite(
  workspace,
  asset,
  root,
  { afterAt } = {},
) {
  realPublicUrl(asset.data.locator);
  const pagePath = `${root}/page.json`;
  let page = await jsonAt(workspace, pagePath, null);
  if (!page) {
    page = await readPublicPage(asset.data.locator);
    await putJson(workspace, pagePath, page);
  }
  requireReal(
    page.locator === asset.data.locator &&
      page.status === 200 &&
      (!afterAt || Date.parse(page.fetched_at) >= Date.parse(afterAt)),
    'TECHNICAL_RETEST_FAILED',
    'Read-back must match the asset and follow publication',
  );
  const snapshots = [];
  const save = async (role, text, mediaType) => {
    const relative = `${root}/${role}.txt`;
    await writeCreateOnly(workspace, relative, text, { idempotent: true });
    snapshots.push({
      role,
      path: relative,
      sha256: sha256(text),
      media_type: mediaType,
    });
  };
  await save('html', page.html, 'text/html');
  const resources = [];
  for (const role of ['robots', 'sitemap']) {
    const locator = new URL(
      role === 'robots' ? '/robots.txt' : '/sitemap.xml',
      asset.data.locator,
    ).href;
    const resourcePath = `${root}/${role}.json`;
    let resource = await jsonAt(workspace, resourcePath, null);
    if (!resource) {
      try {
        resource = await readPublicPage(locator, { resource: role });
      } catch (error) {
        resource = {
          locator,
          fetched_at: new Date().toISOString(),
          status: 'unavailable',
          error: error.code ?? 'PUBLICATION_READBACK_FAILED',
        };
      }
      await putJson(workspace, resourcePath, resource);
    }
    requireReal(
      resource.locator === locator,
      'PUBLICATION_INPUT_DRIFT',
      'Technical resource locator drift',
    );
    resources.push({ role, ...resource, html: undefined });
    if (resource.status === 200)
      await save(
        role,
        resource.html,
        role === 'robots' ? 'text/plain' : 'application/xml',
      );
  }
  const key = sha256(root).slice(0, 16).toUpperCase(),
    sourceId = `SRC-REAL-SITE-${key}`,
    evidenceId = `EVD-REAL-SITE-${key}`;
  const source = await putObject(workspace, 'evidence/sources', {
    ...realObject(
      sourceId,
      'source',
      'active',
      `Public page ${asset.data.locator}`,
      page.fetched_at,
    ),
    name: asset.data.locator,
    source_kind: 'official_site',
    locator: asset.data.locator,
  });
  const evidence = await putObject(workspace, 'evidence/records', {
    ...realObject(
      evidenceId,
      'evidence',
      'candidate',
      'Observed real page content',
      page.fetched_at,
    ),
    source_refs: [sourceId],
    claim_refs: asset.data.claim_versions.map((v) => v.ref),
    locator: asset.data.locator,
    captured_at: page.fetched_at,
    snapshot: {
      path: snapshots[0].path,
      sha256: snapshots[0].sha256,
      media_type: 'text/html',
    },
    collector: { name: 'public-https-readback', version: '1.0.0' },
    scope:
      'Observed current page text only; does not establish the truth of its claims.',
    collection_state: 'captured',
    proof_scope: 'target_content',
    detector_code: 'CONTENT_PRESENT',
  });
  const manifest = {
    schema_version: 'm4-site-manifest-v1',
    target: { asset_ref: asset.data.id, locator: asset.data.locator },
    captured_at: page.fetched_at,
    collector: {
      name: 'public-https-readback',
      version: '1.0.0',
      mode: 'authorized_real',
    },
    collection_state: 'captured',
    http: {
      status: page.status,
      final_url: page.final_url,
      headers: page.headers,
    },
    snapshots,
  };
  const descriptor = await putJson(
    workspace,
    `${root}/manifest.json`,
    manifest,
  );
  return { page, pagePath, manifest, descriptor, resources, source, evidence };
}

export async function retestRealPublications(workspace) {
  let { cycle, plan, graph } = await realContext(workspace);
  const ids = cycle?.data.goal_tracks[0].publication_refs ?? [];
  requireReal(
    ids.length &&
      ['publication_confirmed', 'technical_retest_completed'].includes(
        cycle.data.aggregate_stage,
      ),
    'PUBLICATION_STAGE_INVALID',
    'Technical retest requires confirmed publications',
  );
  const publications = ids.map((id) => graph.byId.get(id)),
    results = [];
  for (const publication of publications) {
    requireReal(
      publication?.data.status === 'confirmed',
      'PUBLICATION_REQUIRED',
      'Confirmed publication missing',
    );
    const proof = await validateRealPublicationProof(
      workspace,
      publication.data,
    );
    const asset = graph.byId.get(publication.data.asset_ref);
    const key = sha256(publication.data.id).slice(0, 12).toUpperCase(),
      runId = `${plan.run_ref}-TECHNICAL-${key}`;
    const captured = await captureRealSite(
      workspace,
      asset,
      `runs/${runId}/raw/site`,
      { afterAt: publication.data.published_at },
    );
    requireReal(
      proof.content_checks.every((c) =>
        pageText(captured.page.html).includes(pageText(c.text)),
      ),
      'TECHNICAL_RETEST_FAILED',
      'Adopted content changed after publication',
    );
    const inputRefs = [
      asset.data.id,
      publication.data.id,
      captured.source.data.id,
      ...asset.data.goal_refs,
      plan.query_set_ref,
      ...asset.data.knowledge_release_versions.map((v) => v.ref),
    ];
    ({ graph } = await realContext(workspace));
    const outputs = Object.fromEntries(
      SITE_CODES.map((code) => [
        code,
        {
          evidence: {
            id: `EVD-REAL-TECH-${key}-${code.replaceAll('_', '-')}`,
            path: `evidence/records/real-tech-${key.toLowerCase()}-${code.toLowerCase()}.md`,
          },
          finding: {
            id: `FND-REAL-TECH-${key}-${code.replaceAll('_', '-')}`,
            path: `findings/real-tech-${key.toLowerCase()}-${code.toLowerCase()}.md`,
          },
        },
      ]),
    );
    const completionPath = `runs/${runId}/outputs/technical-completion.json`;
    const evaluated = await evaluateSiteManifest({
      workspace,
      manifest: captured.manifest,
    });
    let completion = await jsonAt(workspace, completionPath, null);
    if (!completion) {
      completion = {
        completed_at: new Date().toISOString(),
        manifest_sha256: captured.descriptor.sha256,
        checks: evaluated.checks,
      };
      await putJson(workspace, completionPath, completion);
    }
    requireReal(
      completion.manifest_sha256 === captured.descriptor.sha256 &&
        stableStringify(completion.checks) ===
          stableStringify(evaluated.checks) &&
        Date.parse(completion.completed_at) >=
          Date.parse(captured.page.fetched_at) &&
        Date.parse(completion.completed_at) <= Date.now(),
      'TECHNICAL_RETEST_FAILED',
      'Technical completion differs from captured evidence',
    );
    const result = await technicalRetest({
      workspace,
      manifest: captured.manifest,
      now: completion.completed_at,
      plan: {
        run: { id: runId, path: `runs/${runId}/run.md` },
        source_ref: captured.source.data.id,
        input_versions: Object.fromEntries(
          inputRefs.map((id) => [id, graph.byId.get(id).data.version]),
        ),
        asset_refs: [asset.data.id],
        goal_refs: asset.data.goal_refs,
        query_set_versions: [ref(graph.byId.get(plan.query_set_ref))],
        knowledge_release_versions: asset.data.knowledge_release_versions,
        publication_refs: [publication.data.id],
        retest_of_refs: [],
        development_fixture: false,
        outputs,
      },
    });
    const report = {
      publication_ref: publication.data.id,
      captured_at: captured.page.fetched_at,
      completed_at: completion.completed_at,
      content_sha256: sha256(captured.page.html),
      content_present: true,
      manifest: captured.descriptor,
      resource_observations: captured.resources,
      checks: result.checks,
      warnings: result.checks.filter((c) => c.state !== 'pass'),
      all_checks_passed: result.checks.every((c) => c.state === 'pass'),
      run_ref: runId,
    };
    await putJson(
      workspace,
      `runs/${runId}/outputs/technical-readback.json`,
      report,
    );
    results.push(report);
  }
  const schedule = buildObservationSchedule({
    cycleRef: cycle.data.id,
    publicationAt: new Date(
      Math.max(...publications.map((p) => Date.parse(p.data.published_at))),
    ).toISOString(),
    technicalAt: new Date(
      Math.max(...results.map((r) => Date.parse(r.completed_at))),
    ).toISOString(),
  });
  // Always repair a missing schedule, including after all M4 runs already completed.
  await putJson(workspace, `${plan.cycle_dir}/schedule.json`, schedule);
  ({ graph } = await realContext(workspace));
  return results.map((result) => graph.byId.get(result.run_ref));
}
