import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { once } from 'node:events';
import path from 'node:path';
import {
  findJourneyCycle,
  journeyObjectPath,
  refVersion,
} from './journey-cycle-inputs.mjs';
import { scopedObject, writeKnowledgeObject } from './knowledge-workspace.mjs';
import { chatJSON, loadModelEnvironment, modelHash } from './model-client.mjs';
import {
  resolveWithin,
  writeCreateOnly,
  stableStringify,
} from './workspace-paths.mjs';
import { proposeAssets, prepareAdoption } from './asset-proposal.mjs';
import { auditSite, technicalRetest, SITE_CODES } from './site-audit.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import { createOwnerPackage } from './owner-feedback.mjs';

const htmlEscape = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
async function readBack(workspace, relative) {
  const server = createServer(async (req, res) => {
    if (req.url !== '/asset') {
      res.writeHead(404).end();
      return;
    }
    try {
      const bytes = await readFile(resolveWithin(workspace, relative));
      res
        .writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
        .end(bytes);
    } catch {
      res.writeHead(500).end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const transport = `http://127.0.0.1:${server.address().port}/asset`;
    const response = await fetch(transport);
    const text = await response.text();
    if (response.status !== 200) throw new Error('Rehearsal read-back failed');
    return {
      text,
      status: response.status,
      transport,
      read_at: new Date().toISOString(),
    };
  } finally {
    await new Promise((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
  }
}
export async function inspectJourneySite(
  workspace,
  asset,
  context,
  { after = false, publicationRefs = [], priorFindings = [] } = {},
) {
  const suffix = `C${context.cycle_number}`;
  const code = asset.data.title.toUpperCase();
  const phase = after ? 'AFTER' : 'BASE';
  const rawPath = after
    ? `assets/published/${suffix}/${asset.data.title}.html`
    : asset.data.extensions['geo.rehearsal'].raw_path;
  const root = `assets/snapshots/${suffix}/${phase}/${asset.data.title}`;
  try {
    const saved = JSON.parse(
      await readFile(resolveWithin(workspace, `${root}/result.json`), 'utf8'),
    );
    if (
      modelHash(await readFile(resolveWithin(workspace, rawPath), 'utf8')) !==
      saved.manifest.snapshots.find((s) => s.role === 'html').sha256
    )
      throw new Error('Site input changed; use a new version');
    return saved.result;
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const read = await readBack(workspace, rawPath);
  await writeCreateOnly(workspace, `${root}/html.txt`, read.text, {
    idempotent: true,
  });
  const robots = 'User-agent: *\nAllow: /\n';
  const sitemap = `<urlset><url><loc>${asset.data.locator}</loc></url></urlset>`;
  for (const [role, text] of [
    ['robots', robots],
    ['sitemap', sitemap],
  ])
    await writeCreateOnly(workspace, `${root}/${role}.txt`, text, {
      idempotent: true,
    });
  const sourceId = `SRC-GEO-SITE-${suffix}-${code}`;
  await writeKnowledgeObject(
    workspace,
    journeyObjectPath('evidence/sources', sourceId),
    {
      ...scopedObject(
        context,
        sourceId,
        'source',
        'active',
        `Rehearsal ${asset.data.title} asset`,
      ),
      name: `Rehearsal ${asset.data.title}`,
      source_kind: 'synthetic_asset',
      locator: asset.data.locator,
    },
  );
  const manifest = {
    schema_version: 'm4-site-manifest-v1',
    target: { asset_ref: asset.data.id, locator: asset.data.locator },
    captured_at: after
      ? new Date(Date.parse(context.created_at) + 3 * 86400000).toISOString()
      : context.created_at,
    collector: {
      name: 'rehearsal-http-readback',
      version: '1.0.0',
      mode: 'development_fixture',
    },
    collection_state: 'captured',
    http: {
      status: read.status,
      final_url: asset.data.locator,
      headers: { 'content-type': 'text/html' },
    },
    snapshots: [
      {
        role: 'html',
        path: `${root}/html.txt`,
        sha256: modelHash(read.text),
        media_type: 'text/html',
      },
      {
        role: 'robots',
        path: `${root}/robots.txt`,
        sha256: modelHash(robots),
        media_type: 'text/plain',
      },
      {
        role: 'sitemap',
        path: `${root}/sitemap.txt`,
        sha256: modelHash(sitemap),
        media_type: 'application/xml',
      },
    ],
    transport_mapping: {
      logical: asset.data.locator,
      transport: read.transport,
      read_at: read.read_at,
    },
    expected: { canonical: asset.data.locator },
  };
  const contentEvidenceId = `EVD-GEO-SITE-${suffix}-${phase}-${code}-CONTENT`;
  await writeKnowledgeObject(
    workspace,
    journeyObjectPath('evidence/records', contentEvidenceId),
    {
      ...scopedObject(
        context,
        contentEvidenceId,
        'evidence',
        'candidate',
        'Observed asset content',
      ),
      source_refs: [sourceId],
      locator: asset.data.locator,
      captured_at: manifest.captured_at,
      snapshot: {
        path: `${root}/html.txt`,
        sha256: modelHash(read.text),
        media_type: 'text/html',
      },
      collector: { name: 'rehearsal-http-readback', version: '1.0.0' },
      scope:
        'Observed test page content; does not establish that its claims are true.',
      collection_state: 'captured',
      access_state: 'accessible',
      original_content_state: 'captured',
      support_kind: ['own', 'official_external'].includes(
        asset.data.control_scope,
      )
        ? 'first_party'
        : 'independent',
      proof_scope: 'target_content',
      confidence: 'high',
      confidence_reason: 'Exact bytes from the isolated HTTP read-back.',
    },
  );
  const graph = await loadWorkspaceGraph({ workspace });
  const { cycle } = await findJourneyCycle(workspace);
  const meta = cycle.data.extensions['geo.journey'];
  const refs = [
    sourceId,
    context.goal_ref,
    asset.data.id,
    meta.query_set_ref,
    meta.knowledge_release_ref,
    ...publicationRefs,
    ...priorFindings,
  ];
  const plan = {
    run: {
      id: `RUN-GEO-SITE-${suffix}-${phase}-${code}`,
      path: journeyObjectPath(
        'cycles/m4/runs',
        `RUN-GEO-SITE-${suffix}-${phase}-${code}`,
      ),
      test_scope: context.test_scope,
    },
    source_ref: sourceId,
    input_versions: Object.fromEntries(
      refs.map((id) => [id, graph.byId.get(id).data.version]),
    ),
    asset_refs: [asset.data.id],
    goal_refs: [context.goal_ref],
    query_set_versions: [refVersion(graph.byId.get(meta.query_set_ref))],
    knowledge_release_versions: [
      refVersion(graph.byId.get(meta.knowledge_release_ref)),
    ],
    publication_refs: publicationRefs,
    retest_of_refs: priorFindings,
    development_fixture: true,
    outputs: {},
  };
  for (const detector of SITE_CODES) {
    const token = detector.replaceAll('_', '-');
    const evd = `EVD-GEO-SITE-${suffix}-${phase}-${code}-${token}`;
    const fnd = `FND-GEO-SITE-${suffix}-${phase}-${code}-${token}`;
    plan.outputs[detector] = {
      evidence: {
        id: evd,
        path: journeyObjectPath('evidence/records', evd),
        test_scope: context.test_scope,
      },
      finding: {
        id: fnd,
        path: journeyObjectPath('findings', fnd),
        test_scope: context.test_scope,
      },
    };
  }
  const result = await (after ? technicalRetest : auditSite)({
    workspace,
    manifest,
    plan,
    now: after
      ? new Date(Date.parse(context.created_at) + 3 * 86400000).toISOString()
      : context.created_at,
  });
  result.evidence_refs = [
    ...new Set([...result.evidence_refs, contentEvidenceId]),
  ];
  await writeCreateOnly(
    workspace,
    `${root}/result.json`,
    stableStringify({ manifest, result }, 2),
    { idempotent: true },
  );
  return result;
}

export async function diagnoseJourney(workspace) {
  await loadModelEnvironment();
  let { context, cycle, graph } = await findJourneyCycle(workspace);
  const suffix = `C${context.cycle_number}`;
  const meta = cycle.data.extensions['geo.journey'];
  const claims = graph.objects.filter(
    (o) => o.data.record_type === 'claim' && o.data.status === 'approved',
  );
  const evd = graph.objects.filter(
    (o) => o.data.record_type === 'evidence' && o.data.status === 'approved',
  );
  const knowledge = claims.map((o) => ({
    id: o.data.id,
    statement: o.data.statement,
  }));
  const proposals = [];
  const allFindings = [];
  for (const assetId of meta.asset_refs) {
    const asset = graph.byId.get(assetId);
    const site = await inspectJourneySite(workspace, asset, context);
    allFindings.push(...site.finding_refs);
    const html = await readFile(
      resolveWithin(workspace, asset.data.extensions['geo.rehearsal'].raw_path),
      'utf8',
    );
    const reportPath = `findings/reports/${suffix}-${asset.data.title}.json`;
    let analysis;
    try {
      analysis = JSON.parse(
        await readFile(resolveWithin(workspace, reportPath), 'utf8'),
      );
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    if (!analysis) {
      const input = {
        asset: { id: assetId, control: asset.data.control_scope, html },
        knowledge,
        unresolved_inputs: context.seed.entries.filter(
          (e) => !e.evidence || e.superseded,
        ),
        queries: context.selected_query_refs.map(
          (q) => graph.byId.get(q).data.query_text,
        ),
      };
      let failures = [];
      const attempts = [];
      for (let attempt = 0; attempt < 2; attempt++) {
        analysis = await chatJSON({
          provider: context.provider,
          model: context.model ?? undefined,
          maxTokens: 24000,
          timeoutMs: 240000,
          auditDir: path.join(workspace, 'runs', 'model-calls'),
          system:
            'Diagnose the supplied synthetic asset against supported knowledge. Outdated wholesale positioning and unsupported guarantees on a page are content mismatches when current knowledge already defines the service. Product gaps require supplied user demand evidence AND capability evidence; this input has no user demand evidence, so do not emit product_gap. Put unproven feature requests in limitations. Evidence gaps concern unresolved support, not missing page wording. Return JSON {findings:[{kind,quote,claim_refs,rationale,next_action}],limitations:[]}. kind is content_gap|evidence_gap|product_gap. Cite claim_refs from supplied IDs; quote must be a verbatim fragment of the asset HTML or a supplied statement. Include only supported gaps. Missing knowledge is an input limitation, not a content gap. For uncontrolled third-party assets recommend a correction request, never claim authority to publish. Do not approve facts or decisions.',
          input: attempt
            ? {
                original_input: input,
                previous_output: analysis.output,
                validation_errors: failures,
                repair_instruction:
                  'Repair invalid references and quotes using only the supplied exact IDs and text.',
              }
            : input,
        });
        attempts.push(analysis.audit.id);
        failures = [];
        if (!Array.isArray(analysis.output.findings))
          failures.push({ code: 'FINDINGS_ARRAY_REQUIRED' });
        else
          for (const [index, f] of analysis.output.findings.entries()) {
            if (!['content_gap', 'evidence_gap'].includes(f?.kind))
              failures.push({ index, code: 'GAP_KIND_UNSUPPORTED_BY_INPUT' });
            if (
              !f?.quote ||
              ![
                html,
                ...knowledge.map((k) => k.statement),
                ...input.unresolved_inputs.flatMap((e) => [e.fact, e.evidence]),
              ].some((t) => t.includes(f.quote))
            )
              failures.push({
                index,
                code: 'QUOTE_NOT_IN_INPUT',
                quote: f?.quote,
              });
            if (
              !Array.isArray(f?.claim_refs) ||
              !f.claim_refs.length ||
              f.claim_refs.some((id) => !knowledge.some((k) => k.id === id))
            )
              failures.push({
                index,
                code: 'UNKNOWN_CLAIM_REFERENCE',
                allowed: knowledge.map((k) => k.id),
              });
          }
        await writeCreateOnly(
          workspace,
          `runs/RUN-GEO-DIAGNOSIS/outputs/${analysis.audit.id}.json`,
          stableStringify({ ...analysis, validation_errors: failures }, 2),
          { idempotent: true },
        );
        if (!failures.length) break;
        if (attempt === 1)
          throw Object.assign(new Error('Ungrounded diagnosis'), {
            code: 'DIAGNOSIS_GROUNDING_INVALID',
            diagnostics: failures,
          });
      }
      analysis.audit.attempts = attempts;
      await writeCreateOnly(
        workspace,
        reportPath,
        stableStringify(analysis, 2),
        { idempotent: true },
      );
    }
    if (!analysis.output.findings.length) continue;
    graph = await loadWorkspaceGraph({ workspace });
    const siteEvidence = site.evidence_refs.map((id) => graph.byId.get(id));
    const selectedEvidence = [...evd, ...siteEvidence];
    const findingIds = [];
    for (const [i, f] of analysis.output.findings.entries()) {
      const id = `FND-GEO-${suffix}-${asset.data.title.toUpperCase()}-${i + 1}`;
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('findings', id),
        {
          ...scopedObject(context, id, 'finding', 'waiting_human', f.rationale),
          finding_code: `GEO_${f.kind.toUpperCase()}`,
          finding_kind: 'semantic',
          item_state: 'inferred',
          rule_version: 'knowledge-diagnosis-v1',
          diagnosis_class: f.kind,
          query_refs: meta.query_refs,
          claim_refs: f.claim_refs,
          evidence_refs: selectedEvidence.map((o) => o.data.id),
          asset_refs: [assetId],
          source_refs: [
            `SRC-GEO-SITE-${suffix}-${asset.data.title.toUpperCase()}`,
          ],
          gap_basis: {
            supporting_evidence_refs: selectedEvidence.map((o) => o.data.id),
            counter_evidence_refs: [],
            unresolved_conflicts:
              f.kind === 'evidence_gap' ? [f.rationale] : [],
            rationale: f.rationale,
          },
          extensions: {
            'geo.semantic_analysis': {
              quote: f.quote,
              next_action: f.next_action,
              model_call: analysis.audit.id,
              raw_report: reportPath,
            },
          },
        },
        `# ${f.kind}\n\n${f.rationale}\n\nQuote: ${f.quote}\n\nNext action: ${f.next_action}\n`,
      );
      findingIds.push(id);
      allFindings.push(id);
    }
    const id = `PRP-GEO-${suffix}-${asset.data.title.toUpperCase()}`;
    const controllable = ['own', 'official_external'].includes(
      asset.data.control_scope,
    );
    const body = `# ${asset.data.title} proposal\n\n## Evidence and diagnosis\n${analysis.output.findings.map((f) => `- ${f.kind}: ${f.rationale}; ${f.next_action}`).join('\n')}\n\n## Approved replacement\n${claims.map((c) => c.data.statement).join('\n\n')}\n\n## Responsibility and acceptance\n${controllable ? 'Owner may approve a change on the isolated rehearsal asset.' : 'Third-party asset: prepare a correction request only; publication is outside our control.'}\nAccept when supported facts are accurately represented, unsupported guarantees are absent, and both technical and platform retests are recorded. No causal benefit is promised.\n`;
    proposals.push({
      id,
      path: journeyObjectPath('assets/proposals', id),
      test_scope: context.test_scope,
      title: `${asset.data.title} evidence-backed proposal`,
      asset_ref: assetId,
      goal_refs: [context.goal_ref],
      query_refs: meta.query_refs,
      finding_refs: findingIds,
      knowledge_release_versions: [
        refVersion(graph.byId.get(meta.knowledge_release_ref)),
      ],
      claim_versions: claims.map(refVersion),
      evidence_refs: selectedEvidence.map((o) => o.data.id),
      body,
      recommendation_items: [
        {
          item_id: `REC-GEO-${suffix}-${asset.data.title.toUpperCase()}`,
          section: 'Approved replacement',
          action: controllable
            ? 'Replace outdated rehearsal wording with the supported facts below.'
            : 'Prepare a factual correction request; no third-party publication.',
          claim_refs: claims.map((c) => c.data.id),
          evidence_refs: selectedEvidence.map((o) => o.data.id),
          finding_refs: findingIds,
          risk: {
            level: 'low',
            type: 'scope_limit',
            reason:
              'Synthetic rehearsal only; publication authority is asset-specific.',
            suggested_weakening:
              'Retain knowledge limitations and do not promise earnings.',
          },
        },
      ],
    });
  }
  if (!proposals.length)
    return {
      waiting_human: true,
      needs_input: true,
      reason: 'NO_ACTIONABLE_GAP',
      next_action:
        '当前采集资产没有可操作的已支持缺口；请选择新 Goal 或补充原始观察，不会生成占位建议。',
    };
  const evidencePlans = await createJourneyEvidencePlans(workspace);
  await proposeAssets({
    workspace,
    plan: { proposals },
    now: context.created_at,
  });
  graph = await loadWorkspaceGraph({ workspace });
  const objects = proposals.map((p) => graph.byId.get(p.id));
  const pack = await createOwnerPackage({
    workspace,
    id: `OWNER-${suffix}-ADOPTION`,
    kind: 'adoption',
    title: `${suffix} proposals and asset control`,
    objects,
    body: objects
      .map((o) => `## ${o.data.asset_ref}\n\n${o.content}`)
      .join('\n\n'),
  });
  return {
    waiting_human: true,
    package: pack.file,
    finding_refs: allFindings,
    proposal_refs: proposals.map((p) => p.id),
    evidence_plan_refs: evidencePlans.map((p) => p.data.id),
  };
}

export async function approveJourneyAdoption(workspace, feedback) {
  if (feedback.decision.decision === 'modify')
    return (await import('./proposal-revision.mjs')).reviseProposalFromFeedback(
      workspace,
      feedback,
    );
  if (feedback.decision.decision === 'defer')
    return { waiting_human: true, deferred: true };
  const { context, graph } = await findJourneyCycle(workspace);
  const suffix = `C${context.cycle_number}`;
  const results = [];
  for (const target of feedback.package.targets) {
    const proposal = graph.byId.get(target.id);
    const id = proposal.data.id.replace(/^PRP-/, 'ADR-');
    const draft = await prepareAdoption({
      workspace,
      proposalId: proposal.data.id,
      id,
      relativePath: journeyObjectPath('assets/adoptions', id),
      now: context.created_at,
    });
    const decided = {
      ...draft.data,
      id: `${id}-DECIDED`,
      status: 'decided',
      decisions: draft.data.decisions.map((d) => ({
        ...d,
        decision:
          feedback.decision.decision === 'approve' ? 'accepted' : 'rejected',
        reason: feedback.decision.reason,
      })),
      approval: {
        approved_by: feedback.decision.actor,
        approved_at: feedback.decision.at,
        decision_ref: feedback.decision_ref,
      },
      extensions: {
        'geo.feedback': {
          predecessor: refVersion(draft.data),
          package_sha256: feedback.decision.package_sha256,
        },
      },
    };
    results.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('assets/adoptions', decided.id),
        decided,
      ),
    );
  }
  return { adoptions: results.map((o) => o.data.id), cycle: suffix };
}

export async function publishJourneyAssets(workspace) {
  const { context, cycle, graph } = await findJourneyCycle(workspace);
  const suffix = `C${context.cycle_number}`;
  const objects = [];
  for (const ref of cycle.data.goal_tracks[0].adoption_record_refs) {
    const adoption = graph.byId.get(ref);
    const asset = graph.byId.get(adoption.data.asset_ref);
    if (
      !['own', 'official_external'].includes(asset.data.control_scope) ||
      adoption.data.decisions.every((d) => d.decision === 'rejected')
    )
      continue;
    const proposal = graph.byId.get(adoption.data.proposal_ref);
    const accepted = new Set(
      adoption.data.decisions
        .filter((d) => d.decision !== 'rejected')
        .map((d) => d.item_id),
    );
    const items = proposal.data.recommendation_items.filter((i) =>
      accepted.has(i.item_id),
    );
    if (
      items.some(
        (i) =>
          i.risk.type === 'unapproved_claim' ||
          i.risk.type === 'evidence_insufficient' ||
          i.risk.type === 'stale_evidence',
      )
    )
      throw Object.assign(
        new Error('Proposed wording needs approved knowledge support'),
        { code: 'KNOWLEDGE_APPROVAL_REQUIRED' },
      );
    const claims = items.flatMap((item) =>
      item.proposed_text
        ? item.proposed_text.split(/\n\s*\n/)
        : item.claim_refs.map((ref) => graph.byId.get(ref).data.statement),
    );
    const html = `<!doctype html><html lang="en"><head><title>${htmlEscape(context.seed.brand)}</title><meta name="description" content="Supported rehearsal facts and limitations"><link rel="canonical" href="${htmlEscape(asset.data.locator)}"><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: context.seed.brand, url: asset.data.locator })}</script></head><body><h1>${htmlEscape(context.seed.brand)}</h1>${claims.map((t) => `<p>${htmlEscape(t)}</p>`).join('')}</body></html>`;
    const relative = `assets/published/${suffix}/${asset.data.title}.html`;
    await writeCreateOnly(workspace, relative, html, { idempotent: true });
    const proofPath = `assets/published/${suffix}/${asset.data.title}-readback.json`;
    let proof;
    try {
      proof = JSON.parse(
        await readFile(resolveWithin(workspace, proofPath), 'utf8'),
      );
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      const read = await readBack(workspace, relative);
      if (read.text !== html) throw new Error('Published read-back mismatch');
      proof = {
        logical_locator: asset.data.locator,
        transport: read.transport,
        read_at: read.read_at,
        content_sha256: modelHash(read.text),
        status: read.status,
        synthetic: true,
      };
      await writeCreateOnly(workspace, proofPath, stableStringify(proof, 2), {
        idempotent: true,
      });
    }
    const id = `PUB-GEO-${suffix}-${asset.data.title.toUpperCase()}-V2`;
    objects.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('assets/publications', id),
        {
          ...scopedObject(
            context,
            id,
            'asset_publication',
            'draft',
            'Awaiting simulated publication attestation',
          ),
          proposal_ref: proposal.data.id,
          adoption_ref: adoption.data.id,
          asset_ref: asset.data.id,
          published_item_ids: adoption.data.decisions
            .filter((d) => d.decision !== 'rejected')
            .map((d) => d.item_id),
          published_locator: asset.data.locator,
          content_sha256: proof.content_sha256,
          published_at: new Date(
            Date.parse(context.created_at) + 2 * 86400000,
          ).toISOString(),
          extensions: {
            'geo.publication_proof': {
              path: proofPath,
              sha256: modelHash(stableStringify(proof, 2)),
              transport_kind: 'loopback_http_fixture',
              read_at: proof.read_at,
              http_status: proof.status,
            },
          },
        },
      ),
    );
  }
  if (!objects.length)
    return {
      waiting_human: true,
      needs_input: true,
      reason: 'NO_CONTROLLED_ADOPTION',
      next_action:
        '没有已采用的可控发布对象；请调整 Goal 或采用范围。不会生成虚假 Publication。',
    };
  const pack = await createOwnerPackage({
    workspace,
    id: `OWNER-${suffix}-PUBLICATION-V2`,
    kind: 'publication',
    title: 'Attest actual isolated read-back',
    objects,
    body: objects
      .map(
        (o) =>
          `- ${o.data.published_locator}: ${o.data.content_sha256}; proof ${o.data.extensions['geo.publication_proof'].path}`,
      )
      .join('\n'),
  });
  return { waiting_human: true, package: pack.file };
}
export async function confirmJourneyPublication(workspace, feedback) {
  if (feedback.decision.decision !== 'approve') return { waiting_human: true };
  const { graph } = await findJourneyCycle(workspace);
  const result = [];
  for (const target of feedback.package.targets) {
    const draft = graph.byId.get(target.id);
    const data = {
      ...draft.data,
      id: `${draft.data.id}-CONFIRMED`,
      status: 'confirmed',
      extensions: {
        ...draft.data.extensions,
        'geo.feedback': {
          predecessor: refVersion(draft),
          package_sha256: feedback.decision.package_sha256,
        },
      },
      approval: {
        approved_by: feedback.decision.actor,
        approved_at: feedback.decision.at,
        decision_ref: feedback.decision_ref,
      },
    };
    result.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('assets/publications', data.id),
        data,
      ),
    );
  }
  return { confirmed: result.map((o) => o.data.id) };
}
export async function retestJourneySites(workspace) {
  const { context, cycle, graph } = await findJourneyCycle(workspace);
  const results = [];
  for (const ref of cycle.data.goal_tracks[0].publication_refs) {
    const publication = graph.byId.get(ref);
    const asset = graph.byId.get(publication.data.asset_ref);
    const prior = graph.objects
      .filter(
        (o) =>
          o.data.record_type === 'finding' &&
          o.data.finding_kind === 'technical' &&
          o.data.asset_refs?.includes(asset.data.id) &&
          !o.data.retest_of_ref,
      )
      .map((o) => o.data.id);
    results.push(
      await inspectJourneySite(workspace, asset, context, {
        after: true,
        publicationRefs: [ref],
        priorFindings: prior,
      }),
    );
  }
  return results;
}

export async function createJourneyEvidencePlans(workspace) {
  const { context, graph } = await findJourneyCycle(workspace);
  const suffix = `C${context.cycle_number}`;
  const result = [];
  for (const finding of graph.objects.filter(
    (o) =>
      o.data.record_type === 'finding' &&
      o.data.diagnosis_class === 'evidence_gap' &&
      o.data.id.startsWith(`FND-GEO-${suffix}-`),
  )) {
    const id = finding.data.id.replace(/^FND-/, 'EPL-');
    const data = {
      ...scopedObject(
        context,
        id,
        'evidence_plan',
        'draft',
        'Evidence acquisition task',
      ),
      claim_refs: finding.data.claim_refs,
      current_gap: finding.data.gap_basis.rationale,
      required_evidence: [
        finding.data.extensions['geo.semantic_analysis'].next_action,
      ],
      minimum_acceptance:
        'Dated original evidence with scope, source identity and Owner review; no stronger wording as a substitute.',
      source_categories: ['first_party_document', 'independent_support'],
      provider_owner: 'Knowledge evidence Owner',
      acceptance_method:
        'Verify provenance, original snapshot, applicable period and Claim scope before approval.',
      retest_query_refs: finding.data.query_refs,
      finding_refs: [finding.data.id],
      asset_refs: finding.data.asset_refs,
      deployment_targets: [],
    };
    result.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('evidence/plans', id),
        data,
      ),
    );
  }
  return result;
}
