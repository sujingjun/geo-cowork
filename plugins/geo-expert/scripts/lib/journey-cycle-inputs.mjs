import { readFile } from 'node:fs/promises';
import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  writeCreateOnly,
  stableStringify,
  atomicWrite,
  resolveWithin,
} from './workspace-paths.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  writeKnowledgeObject,
  readJourneyInput,
  scopedObject,
} from './knowledge-workspace.mjs';
import { querySetContentSha } from './knowledge-query.mjs';
import { collectorProfileFingerprint } from './answer-profile.mjs';
import { createCycle } from '../geo-lifecycle.mjs';
import { applyGoalSelection } from './cycle-two-apply.mjs';
import { modelHash } from './model-client.mjs';
import { supportingArtifacts } from './snapshot-support.mjs';

export const JOURNEY_PLATFORMS = [
  'chatgpt',
  'gemini',
  'perplexity',
  'google_ai',
  'claude',
];
export const JOURNEY_CONTRACTS = {
  measurement_contract: {
    schema_version: 'm6-measurement-contract/1.0.0',
    id: 'geo-e2e-measurement-v1',
    version: '1.0.0',
    scope: 'test_only',
    metrics: [
      {
        metric_id: 'ai_visits',
        definition: 'Synthetic aggregate visits; not real attribution.',
        unit: 'visits',
      },
      {
        metric_id: 'ai_registrations',
        definition: 'Synthetic aggregate completed registrations.',
        unit: 'registrations',
      },
    ],
    causal_claim_allowed: false,
  },
  signal_rule: {
    schema_version: 'm6-signal-rule/1.0.0',
    id: 'geo-e2e-signal-v1',
    version: '1.0.0',
    scope: 'test_only',
    signal_kind: 'ai_registration',
    numerator_metric_id: 'ai_registrations',
    denominator_metric_id: 'ai_visits',
    calculation: 'numerator / denominator',
    causal_claim: false,
  },
  sensitive_data_policy: {
    schema_version: 'm6-sensitive-data-policy/1.0.0',
    id: 'geo-e2e-policy-v1',
    version: '1.0.0',
    scope: 'test_only',
    allowed_fields: [
      'schema_version',
      'time_window',
      'metrics',
      'metric_id',
      'value',
      'unit',
      'dimensions',
    ],
    forbidden_field_patterns: [
      'email',
      'phone',
      'ip',
      'cookie',
      'authorization',
      'token',
      'secret',
      'password',
    ],
    max_input_bytes: 65536,
    unknown_binary: 'reject',
  },
};
export const journeyObjectPath = (folder, id) =>
  `${folder}/${id.toLowerCase()}.md`;
export const refVersion = (object) => ({
  ref: object.data?.id ?? object.id,
  version: object.data?.version ?? object.version,
});
export async function findJourneyCycle(workspace) {
  const graph = await loadWorkspaceGraph({ workspace });
  const context = await readJourneyInput(workspace);
  return { graph, context, cycle: graph.byId.get(context.cycle_ref) };
}
export function journeyApproval(feedback) {
  return {
    approved_by: feedback.actor,
    approved_at: feedback.at,
    decision_ref: `workspace://reviews/decisions/${feedback.package_id}.json`,
  };
}

export async function prepareJourneyFreeze(workspace) {
  let { graph, context, cycle } = await findJourneyCycle(workspace);
  if (cycle) return cycle;
  const suffix = `C${context.cycle_number}`;
  const decision = JSON.parse(
    await readFile(
      resolveWithin(
        workspace,
        `reviews/decisions/${context.knowledge_package_id}.json`,
      ),
      'utf8',
    ),
  );
  if (decision.decision !== 'approve')
    throw Object.assign(new Error('Knowledge approval is required'), {
      code: 'OWNER_FEEDBACK_REQUIRED',
    });
  const approval = journeyApproval(decision);
  const queries = context.selected_query_refs.map((id) => graph.byId.get(id));
  if (queries.length !== 6 || queries.some((q) => q?.data.status !== 'formal'))
    throw new Error('Six approved Queries are required');
  const claims = graph.objects.filter(
    (o) =>
      o.data.record_type === 'claim' &&
      ['approved', 'published'].includes(o.data.status),
  );
  if (!claims.length) throw new Error('No approved knowledge slice');
  const evidences = graph.objects.filter(
    (o) => o.data.record_type === 'evidence' && o.data.status === 'approved',
  );
  const krId = `KR-GEO-E2E-${suffix}`;
  const answerCards = [];
  for (const [i, query] of queries.entries()) {
    const id = `ANS-GEO-E2E-${suffix}-${i + 1}`;
    answerCards.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('knowledge/answer-cards', id),
        {
          ...scopedObject(
            context,
            id,
            'answer_card',
            'published',
            query.data.query_text,
          ),
          query_refs: [query.data.id],
          claim_versions: claims.map(refVersion),
          evidence_refs: evidences.map((o) => o.data.id),
          direct_answer: claims.map((o) => o.data.statement).join(' '),
          limitations: [
            'Synthetic rehearsal only; unsupported and expired facts excluded.',
          ],
          forbidden_statements: ['No real business or platform outcome.'],
          release_refs: [krId],
          approval,
        },
      ),
    );
  }
  const release = await writeKnowledgeObject(
    workspace,
    journeyObjectPath('knowledge/releases', krId),
    {
      ...scopedObject(
        context,
        krId,
        'knowledge_release',
        'published',
        'Approved rehearsal knowledge slice',
      ),
      release_version: '1.0.0',
      claim_versions: claims.map(refVersion),
      answer_card_versions: answerCards.map(refVersion),
      readiness: 'ready',
      approval,
    },
  );
  const qsId = `QS-GEO-E2E-${suffix}`;
  const querySet = await writeKnowledgeObject(
    workspace,
    journeyObjectPath('queries/sets', qsId),
    {
      ...scopedObject(
        context,
        qsId,
        'query_set',
        'frozen',
        'Frozen rehearsal questions',
      ),
      goal_refs: [context.goal_ref],
      query_versions: queries.map(refVersion),
      content_sha256: querySetContentSha(
        queries.map((q) => ({
          ...refVersion(q),
          query_text: q.data.query_text,
          language: q.data.language,
        })),
      ),
      frozen_at: context.created_at,
      frozen_by: decision.actor,
      approval,
    },
  );
  const assets = [];
  for (const asset of context.seed.assets) {
    const id = `AST-GEO-E2E-${suffix}-${asset.key.toUpperCase()}`;
    assets.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath(
          'assets/' + (asset.kind === 'own' ? 'own' : 'external'),
          id,
        ),
        {
          ...scopedObject(context, id, 'asset', 'active', asset.key),
          asset_kind: asset.kind,
          locator: asset.locator,
          asset_role: asset.role,
          control_scope: asset.control,
          source_refs: [],
          goal_refs: [context.goal_ref],
          query_refs: queries.map((q) => q.data.id),
          claim_versions: claims.map(refVersion),
          knowledge_release_versions: [refVersion(release)],
          extensions: {
            'geo.rehearsal': {
              raw_path: `assets/raw/${suffix}/${asset.key}.html`,
            },
          },
        },
      ),
    );
    await writeCreateOnly(
      workspace,
      `assets/raw/${suffix}/${asset.key}.html`,
      asset.html,
      { idempotent: true },
    );
  }
  const profiles = await createJourneyProfiles(
    workspace,
    context,
    'baseline',
    approval,
  );
  const artifactPaths = [];
  for (const [role, data] of Object.entries(JOURNEY_CONTRACTS)) {
    const relative = `execution/contracts/${role.replaceAll('_', '-')}.json`;
    await writeCreateOnly(workspace, relative, stableStringify(data, 2), {
      idempotent: true,
    });
    artifactPaths.push({
      role,
      path: relative,
      media_type: 'application/json',
    });
  }
  graph = await loadWorkspaceGraph({ workspace });
  const sourcePaths = [
    ...new Set(
      [
        ...graph.objects.filter((o) =>
          ['merchant', 'brand_knowledge_base'].includes(o.data.record_type),
        ),
        graph.byId.get(context.goal_ref),
        ...queries,
        ...claims,
        ...evidences,
        ...answerCards,
        release,
        querySet,
        ...assets,
        ...profiles,
        ...graph.objects.filter(
          (o) =>
            o.data.record_type === 'document' && o.data.status === 'approved',
        ),
        ...graph.objects.filter((o) => o.data.record_type === 'source'),
      ].map((o) => o.path),
    ),
  ];
  await writeCreateOnly(
    workspace,
    `cycles/preparation/knowledge-input-${suffix}.json`,
    stableStringify(context, 2),
    { idempotent: true },
  );
  artifactPaths.push(
    ...(await supportingArtifacts(
      workspace,
      graph,
      sourcePaths.map((p) => graph.objects.find((o) => o.path === p)),
    )),
  );
  const plan = {
    schema_version: 'm6-create-cycle-plan/1.0.0',
    cycle_id: context.cycle_ref,
    cycle_path: journeyObjectPath('cycles/m6', context.cycle_ref),
    run_id: `RUN-GEO-E2E-${suffix}`,
    snapshot_id: `CIS-GEO-E2E-FREEZE-${suffix}`,
    merchant_ref: context.test_scope.merchant_ref,
    knowledge_base_ref: context.test_scope.knowledge_base_ref,
    goal_ref: context.goal_ref,
    source_paths: sourcePaths,
    artifact_paths: artifactPaths,
  };
  await writeCreateOnly(
    workspace,
    `cycles/preparation/create-${suffix}.json`,
    stableStringify(plan, 2),
    { idempotent: true },
  );
  let result;
  if (context.cycle_number === 2) {
    const selected = graph.byId.get(context.selected_candidate_ref);
    const selection = graph.byId.get(context.goal_selection_ref);
    const review = graph.byId.get(context.predecessor_review_ref);
    const goal = graph.byId.get(context.goal_ref);
    const applyPlan = {
      ...plan,
      cycle_number: 2,
      network_access: false,
      real_execution_authorized: false,
      predecessor_review_version: {
        ...refVersion(review),
        file_sha256: modelHash(
          await readFile(resolveWithin(workspace, review.path), 'utf8'),
        ),
      },
      goal_selection_version: refVersion(selection),
      selected_candidate_version: refVersion(selected),
      new_goal: {
        id: goal.data.id,
        path: goal.path,
        statement: goal.data.goal_statement,
        success_question: goal.data.success_question,
        query_cluster_key: selected.data.proposed_goal.query_cluster_key,
        approval: goal.data.approval,
      },
      source_objects: sourcePaths
        .map((p) => graph.objects.find((o) => o.path === p))
        .filter(
          (o) =>
            !['merchant', 'brand_knowledge_base'].includes(o.data.record_type),
        )
        .map((o) => ({ path: o.path, data: o.data, body: o.content })),
      workspace_files: [],
      stages: [
        'baseline_recorded',
        'diagnosis_ready',
        'adoption_decided',
        'publication_confirmed',
        'technical_retest_completed',
        'answer_retest_completed',
        'analytics_recorded',
        'review_waiting_human',
        'review_decided',
      ],
    };
    await writeCreateOnly(
      workspace,
      'cycles/preparation/apply-cycle-two.json',
      stableStringify(applyPlan, 2),
      { idempotent: true },
    );
    result = await applyGoalSelection({ workspace, plan: applyPlan });
  } else result = await createCycle(workspace, plan);
  // Runtime instructions are a derived plan stored with the canonical Cycle, never a second state machine.
  graph = await loadWorkspaceGraph({ workspace });
  const created = graph.byId.get(context.cycle_ref);
  const data = {
    ...created.data,
    cycle_number: context.cycle_number,
    extensions: {
      ...created.data.extensions,
      'geo.journey': {
        query_refs: queries.map((q) => q.data.id),
        query_set_ref: qsId,
        knowledge_release_ref: krId,
        asset_refs: assets.map((a) => a.data.id),
        baseline_profile_refs: profiles.map((p) => p.data.id),
        input_path: `cycles/preparation/knowledge-input-${suffix}.json`,
      },
    },
  };
  validateObjectData(data);
  await atomicWrite(
    workspace,
    created.path,
    serializeMarkdownObject(data, created.content),
  );
  return { ...result, data, path: created.path };
}

export async function createJourneyProfiles(
  workspace,
  context,
  purpose,
  approval,
) {
  const suffix = `C${context.cycle_number}`;
  const after = purpose !== 'baseline';
  const start = new Date(context.created_at);
  if (after) start.setUTCDate(start.getUTCDate() + 7);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  const profiles = [];
  for (const platform of JOURNEY_PLATFORMS) {
    const id = `CPF-GEO-E2E-${suffix}-${after ? 'AFTER' : 'BASE'}-${platform.toUpperCase().replaceAll('_', '-')}`;
    const data = {
      ...scopedObject(
        context,
        id,
        'collector_profile',
        'frozen',
        `${platform} ${purpose} simulated protocol`,
      ),
      platform,
      product_entry: `https://${platform.replaceAll('_', '-')}.geo-e2e.invalid/`,
      region: 'US',
      language: 'en-US',
      login_state: 'logged_out',
      conversation_state: 'new',
      web_search_state: 'on',
      model_mode: 'simulated-consumer-input',
      query_template_version: '1.0.0',
      sampling_count: 2,
      time_window: {
        id: `TW-GEO-E2E-${suffix}-${after ? 'AFTER' : 'BASE'}`,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
      },
      device: {
        class: 'desktop',
        os: 'fixture',
        browser: 'fixture',
        viewport: '1280x720',
      },
      collection_method: 'recorded_fixture',
      approval,
    };
    data.profile_fingerprint = collectorProfileFingerprint(data);
    profiles.push(
      await writeKnowledgeObject(
        workspace,
        journeyObjectPath('cycles/preparation/profiles', id),
        data,
      ),
    );
  }
  return profiles;
}
