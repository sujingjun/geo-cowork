import matter from 'gray-matter';
import { readKnowledgeMarkdown } from './knowledge-markdown.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  initializeDevelopmentKnowledgeWorkspace,
  preflightTestKnowledgeWrite,
  assertNoTestKnowledgeContamination,
} from './workspace-scope.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  writeCreateOnly,
  atomicWrite,
  stableStringify,
  resolveWithin,
} from './workspace-paths.mjs';
import { modelHash } from './model-client.mjs';
import {
  ingestQueryInputs,
  parseQueryImport,
  generateKnowledgeQueries,
} from './query-inputs.mjs';
import { createOwnerPackage } from './owner-feedback.mjs';

export const BUSINESS_SEED = fileURLToPath(
  new URL(
    '../../assets/knowledge-driven-seed/business-input.json',
    import.meta.url,
  ),
);
export async function writeKnowledgeObject(
  workspace,
  relative,
  data,
  body = '',
) {
  validateObjectData(data, { path: relative });
  if (data.test_scope) {
    assertNoTestKnowledgeContamination(data);
    const identity = JSON.parse(
      await readFile(resolveWithin(workspace, 'workspace.json'), 'utf8'),
    );
    if (
      identity.workspace_mode !== 'development_test' ||
      identity.workspace_id !== data.test_scope.workspace_id ||
      identity.merchant_ref !== data.test_scope.merchant_ref ||
      identity.knowledge_base_ref !== data.test_scope.knowledge_base_ref
    )
      throw Object.assign(new Error('Object and workspace scope differ'), {
        code: 'SYNTHETIC_REAL_REF_CONTAMINATION',
      });
  }
  await writeCreateOnly(
    workspace,
    relative,
    serializeMarkdownObject(data, body || `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'OBJECT_CONFLICT' },
  );
  return { data, path: relative };
}
export async function readJourneyInput(workspace) {
  return JSON.parse(
    await readFile(
      resolveWithin(workspace, 'cycles/preparation/knowledge-input.json'),
      'utf8',
    ),
  );
}
export function scopedObject(context, id, type, status, title) {
  return {
    id,
    record_type: type,
    status,
    version: '1.0.0',
    created_at: context.created_at,
    updated_at: context.created_at,
    title,
    test_scope: context.test_scope,
  };
}

export async function startKnowledgeWorkspace({
  workspace,
  input = BUSINESS_SEED,
  inputDir,
  goalText,
  provider,
  model,
}) {
  let rawBytes = await readFile(input, 'utf8');
  const seed = JSON.parse(rawBytes);
  if (inputDir) {
    seed.entries = await readKnowledgeMarkdown(inputDir);
    if (goalText) seed.goal = goalText;
    rawBytes = stableStringify(seed, 2);
  }
  if (
    seed.schema_version !== 'geo-business-input-v1' ||
    seed.synthetic !== true ||
    !Array.isArray(seed.entries) ||
    !seed.entries.length
  )
    throw Object.assign(
      new Error(
        'This rehearsal entry requires explicitly synthetic business inputs',
      ),
      { code: 'BUSINESS_INPUT_INVALID' },
    );
  const identity = modelHash({
    workspace: path.resolve(workspace),
    input_sha256: modelHash(rawBytes),
  });
  const scope = {
    kind: 'synthetic',
    usage: 'test_only',
    merchant_ref: 'MER-MYYSHOP-001',
    workspace_id: `ws_${identity.slice(0, 26)}`,
    knowledge_base_ref: `KBASE-GEO-E2E-${identity.slice(0, 12).toUpperCase()}`,
  };
  const context = {
    schema_version: 'geo-knowledge-journey-input-v1',
    created_at: '2026-09-16T00:00:00Z',
    seed_sha256: modelHash(rawBytes),
    test_scope: scope,
    seed,
    goal_ref: 'GOAL-GEO-E2E-C1',
    cycle_ref: 'CYC-GEO-E2E-C1',
    cycle_number: 1,
    knowledge_paths: [],
    selected_query_refs: [],
    provider: provider ?? 'deepseek',
    model: model ?? null,
  };
  try {
    return await readJourneyInput(workspace);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  await initializeDevelopmentKnowledgeWorkspace({
    workspace,
    plan: {
      schema_version: 'development-knowledge-workspace/1.0.0',
      brand: seed.brand,
      workspace_id: scope.workspace_id,
      created_at: context.created_at,
      merchant: {
        id: scope.merchant_ref,
        path: 'execution/identity/merchant.md',
        canonical_locator: 'https://www.myyshop.com/',
      },
      knowledge_base: {
        id: scope.knowledge_base_ref,
        path: 'knowledge/meta/knowledge-base.md',
        root_path: 'knowledge',
        mode: 'test_only',
      },
      execution_scope: 'synthetic_test',
      online_configuration: {
        ga4_property_id: '356373250',
        gsc_site_url: 'https://www.myyshop.com/',
        analytics_plan:
          'cycles/preparation/analytics/ga4-gsc-readonly-plan.json',
      },
      decision_ref: 'fixture://owner-authorized-workspace-rehearsal',
    },
  });
  await writeCreateOnly(
    workspace,
    'knowledge/00-governance/business-input.json',
    rawBytes,
    { idempotent: true },
  );
  await writeCreateOnly(
    workspace,
    'knowledge/01-templates/entry.md',
    '# Knowledge entry\n\nUsage: synthetic/test_only\n\n主题：\n事实：\n原始证据：\n适用范围：\n负责人：\n生效时间：\n复核时间：\n待补项：\n',
    { idempotent: true },
  );
  const packObjects = [];
  const goal = await writeKnowledgeObject(
    workspace,
    'cycles/preparation/goal-c1.md',
    {
      ...scopedObject(
        context,
        context.goal_ref,
        'perception_goal',
        'candidate',
        'Rehearsal Goal',
      ),
      goal_statement: seed.goal,
      success_question:
        'What must an eligible creator know before choosing this rehearsal service?',
    },
  );
  packObjects.push(goal);
  const maintenance = [];
  for (const entry of seed.entries) {
    if (
      !/^[a-z0-9-]+$/.test(entry.key) ||
      !/^\d{2}-[a-z-]+$/.test(entry.category) ||
      typeof entry.fact !== 'string'
    )
      throw new Error('Invalid knowledge entry');
    const suffix = entry.key.toUpperCase();
    const rawPath = `knowledge/${entry.category}/${entry.key}.md`;
    await writeCreateOnly(
      workspace,
      rawPath,
      `# ${entry.title}\n\nSynthetic/test_only; not real MyyShop facts.\n\n${entry.fact}\n\n## Original evidence\n\n${entry.evidence || 'Not provided'}\n\nReview after: ${entry.review_after ?? '2026-12-31'}\n`,
      { idempotent: true },
    );
    if (entry.source_text)
      await writeCreateOnly(
        workspace,
        `knowledge/originals/${entry.key}.txt`,
        entry.source_text,
        { idempotent: true },
      );
    context.knowledge_paths.push(rawPath);
    const source = await writeKnowledgeObject(
      workspace,
      `evidence/sources/src-e2e-${entry.key}.md`,
      {
        ...scopedObject(
          context,
          `SRC-GEO-E2E-${suffix}`,
          'source',
          'active',
          entry.title,
        ),
        name: entry.title,
        source_kind: 'synthetic_business_input',
        locator: `https://knowledge.geo-e2e.invalid/${entry.key}`,
      },
    );
    const expired =
      entry.superseded ||
      (entry.review_after &&
        entry.review_after < context.created_at.slice(0, 10));
    const supported = Boolean(entry.evidence) && !expired;
    maintenance.push({
      key: entry.key,
      category: entry.category,
      state: expired ? 'stale' : supported ? 'candidate' : 'evidence_missing',
      path: rawPath,
    });
    const doc = await writeKnowledgeObject(
      workspace,
      `knowledge/documents/doc-e2e-${entry.key}.md`,
      {
        ...scopedObject(
          context,
          `DOC-GEO-E2E-${suffix}`,
          'document',
          'draft',
          entry.title,
        ),
        scope: 'Synthetic rehearsal only.',
        source_refs: [source.data.id],
        extensions: {
          'geo.knowledge_input': {
            raw_path: rawPath,
            sha256: modelHash(
              await readFile(resolveWithin(workspace, rawPath), 'utf8'),
            ),
            supported,
            ...(entry.source_text
              ? {
                  original_path: `knowledge/originals/${entry.key}.txt`,
                  original_sha256: entry.source_sha256,
                }
              : {}),
          },
        },
      },
      `# ${entry.title}\n\n${entry.fact}\n`,
    );
    packObjects.push(doc);
    if (supported) {
      const snapshotPath = `evidence/snapshots/${entry.key}.txt`;
      await writeCreateOnly(workspace, snapshotPath, entry.evidence, {
        idempotent: true,
      });
      const evidence = await writeKnowledgeObject(
        workspace,
        `evidence/records/evd-e2e-${entry.key}.md`,
        {
          ...scopedObject(
            context,
            `EVD-GEO-E2E-${suffix}`,
            'evidence',
            'candidate',
            entry.title,
          ),
          source_refs: [source.data.id],
          locator: source.data.locator,
          captured_at: context.created_at,
          snapshot: {
            path: snapshotPath,
            sha256: modelHash(entry.evidence),
            media_type: 'text/plain',
          },
          collector: { name: 'business-input-reader', version: '1.0.0' },
          scope: 'Synthetic rehearsal only.',
        },
      );
      packObjects.push(evidence);
      const claim = await writeKnowledgeObject(
        workspace,
        `knowledge/claims/clm-e2e-${entry.key}.md`,
        {
          ...scopedObject(
            context,
            `CLM-GEO-E2E-${suffix}`,
            'claim',
            'candidate',
            entry.title,
          ),
          statement: entry.fact,
          risk_type: 'capability_fact',
          risk_level: 'low',
          evidence_refs: [evidence.data.id],
          document_refs: [doc.data.id],
          scope: 'Synthetic rehearsal only.',
          evidence_sufficiency: {
            status: 'unknown',
            rule_version: 'm3-evidence-sufficiency-v1',
            missing: [],
          },
        },
      );
      packObjects.push(claim);
    }
  }
  await writeCreateOnly(
    workspace,
    'knowledge/README.md',
    `# Knowledge maintenance\n\nSynthetic/test_only. Canonical documents, claims and evidence are authoritative; this index is derived.\n\n${maintenance.map((x) => `- [${x.category}/${x.key}](${x.path.slice('knowledge/'.length)}): ${x.state}`).join('\n')}\n`,
    { idempotent: true },
  );
  await writeCreateOnly(
    workspace,
    'knowledge/00-governance/maintenance.json',
    stableStringify(maintenance, 2),
    { idempotent: true },
  );
  if (seed.manual_queries?.length)
    await ingestQueryInputs({
      workspace,
      goal: context.goal_ref,
      entries: parseQueryImport(JSON.stringify(seed.manual_queries), 'json'),
      sourceKind: 'manual_import',
      sourceDetail: { kind: 'business_input' },
      raw: seed.manual_queries,
    });
  const generated = await generateKnowledgeQueries({
    workspace,
    goal: context.goal_ref,
    knowledgeFiles: context.knowledge_paths,
    count: 6,
    provider,
    model,
  });
  context.selected_query_refs = generated.queries.map((q) => q.id);
  const graph = await loadWorkspaceGraph({ workspace });
  for (const ref of context.selected_query_refs)
    packObjects.push(graph.byId.get(ref));
  const pack = await createOwnerPackage({
    workspace,
    id: 'OWNER-KNOWLEDGE-C1',
    kind: 'knowledge',
    title: 'Review rehearsal knowledge and Query selection',
    objects: packObjects,
    body: `Goal: ${seed.goal}\n\n## Candidate questions\n${context.selected_query_refs.map((ref) => `- ${graph.byId.get(ref).data.query_text}`).join('\n')}\n\n## Maintenance\n${maintenance.map((x) => `- ${x.key}: ${x.state}`).join('\n')}\n\nApproval covers supported facts and this Query selection. Missing or expired evidence remains outside the frozen knowledge slice.`,
  });
  context.knowledge_package_id = pack.id;
  await writeCreateOnly(
    workspace,
    'cycles/preparation/knowledge-input.json',
    stableStringify(context, 2),
    { idempotent: true },
  );
  return { ...context, awaiting: pack.file };
}

export async function applyKnowledgeApproval(workspace, feedback) {
  const context = await readJourneyInput(workspace);
  if (feedback.decision.decision !== 'approve')
    return { waiting: true, decision: feedback.decision.decision };
  const graph = await loadWorkspaceGraph({ workspace });
  for (const target of feedback.package.targets) {
    let original = graph.byId.get(target.id);
    if (!original)
      throw Object.assign(new Error('Feedback target is no longer active'), {
        code: 'OWNER_FEEDBACK_SUPERSEDED',
      });
    const historyPath = `reviews/history/${feedback.package.id}/${original.data.id}.txt`;
    let initialBytes;
    try {
      initialBytes = await readFile(
        resolveWithin(workspace, historyPath),
        'utf8',
      );
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (initialBytes) {
      if (modelHash(initialBytes) !== target.sha256)
        throw new Error('Feedback history checksum mismatch');
      const parsed = matter(initialBytes);
      original = { ...original, data: parsed.data, content: parsed.content };
    }
    if (
      original.data.record_type === 'document' &&
      !original.data.extensions?.['geo.knowledge_input']?.supported
    )
      continue;
    const status = {
      perception_goal: 'approved',
      document: 'approved',
      evidence: 'approved',
      claim: 'approved',
      query: 'formal',
    }[original.data.record_type];
    if (!status) continue;
    const data = {
      ...original.data,
      status,
      approval: {
        approved_by: feedback.decision.actor,
        approved_at: feedback.decision.at,
        decision_ref: feedback.decision_ref,
      },
    };
    if (data.record_type === 'claim')
      data.evidence_sufficiency = {
        status: 'sufficient',
        rule_version: 'm3-evidence-sufficiency-v1',
        missing: [],
      };
    validateObjectData(data);
    const currentBytes = await readFile(
      resolveWithin(workspace, original.path),
      'utf8',
    );
    const expected = serializeMarkdownObject(data, original.content);
    if (currentBytes === expected) continue;
    if (modelHash(currentBytes) !== target.sha256)
      throw Object.assign(new Error('Feedback target changed'), {
        code: 'OWNER_FEEDBACK_STALE',
      });
    await writeCreateOnly(workspace, historyPath, currentBytes, {
      idempotent: true,
    });
    await atomicWrite(workspace, original.path, expected);
  }
  return { approved: true, context };
}
