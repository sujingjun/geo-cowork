import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { normalizeCitationUrl } from './source-registry.mjs';
import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

function fail(code, message) {
  throw Object.assign(new Error(message), { code });
}
const json = async (workspace, file) => {
  await assertNoSymlinkPath(workspace, file);
  return JSON.parse(await readFile(resolveWithin(workspace, file), 'utf8'));
};
async function optionalJson(workspace, file) {
  try {
    return await json(workspace, file);
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    throw error;
  }
}
const save = (workspace, file, value, idempotent = true) =>
  writeCreateOnly(workspace, file, stableStringify(value, 2), {
    idempotent,
    conflictCode: 'INTAKE_CONFLICT',
  });

async function context(workspace, plan) {
  if (
    plan.schema_version !== 'oneglanse-run-plan-v1' ||
    !/^RUN-[A-Z0-9-]+$/.test(plan.run_id ?? '') ||
    typeof plan.oneglanse_workspace_id !== 'string' ||
    !plan.oneglanse_workspace_id ||
    !['chatgpt', 'gemini', 'perplexity', 'claude', 'ai-overview'].includes(
      plan.provider,
    ) ||
    plan.authorization?.scope !== 'single-query-engineering' ||
    plan.authorization?.automatic_analysis !== true ||
    typeof plan.authorization?.reference !== 'string' ||
    !plan.authorization.reference
  ) {
    fail(
      'PLAN_INVALID',
      'Explicit single-query authorization, provider and native automatic analysis acknowledgment are required',
    );
  }
  const identity = await json(workspace, 'workspace.json');
  if (identity.workspace_id !== plan.workspace_id)
    fail(
      'WORKSPACE_MISMATCH',
      'Local workspace identity differs from the plan',
    );
  const base = `runs/${plan.run_id}/oneglanse-intake`;
  await assertNoSymlinkPath(workspace, base, { allowMissingLeaf: true });
  const frozenPlan = await optionalJson(workspace, `${base}/plan.json`);
  if (frozenPlan && stableStringify(frozenPlan) !== stableStringify(plan))
    fail('INTAKE_CONFLICT', 'The saved Run plan cannot change between steps');
  return {
    base,
    identity,
    remote: { workspace_id: plan.oneglanse_workspace_id },
  };
}

async function queryInput(workspace, plan) {
  const source = plan.query;
  if (!source || !['query_text', 'normalized_text'].includes(source.field))
    fail('QUERY_INVALID', 'Select an explicit original Query text field');
  await assertNoSymlinkPath(workspace, source.path);
  const bytes = await readFile(resolveWithin(workspace, source.path));
  const { data } = matter(bytes.toString('utf8'));
  if (
    data.record_type !== 'query' ||
    data.id !== source.ref ||
    data.version !== source.version ||
    typeof data[source.field] !== 'string' ||
    !data[source.field].trim()
  )
    fail(
      'QUERY_VERSION_MISMATCH',
      'Query identity/version or selected text field does not match',
    );
  return {
    ...source,
    original_text: data.query_text,
    submitted_text: data[source.field],
    source_sha256: sha256(bytes),
    discovery_source_refs: data.discovery_source_refs ?? [],
  };
}

function assertSingleScope(scope, promptId, text, provider) {
  if (
    scope.prompts?.length !== 1 ||
    scope.prompts[0].id !== promptId ||
    scope.prompts[0].prompt !== text ||
    scope.ready_providers?.length !== 1 ||
    scope.ready_providers[0] !== provider
  ) {
    fail(
      'RUN_SCOPE_MISMATCH',
      'Native workspace scope must be exactly the selected Query and provider; review configuration in OneGlanse',
    );
  }
}

export async function prepareOneGlanse({ workspace, plan, call }) {
  const { base, remote } = await context(workspace, plan);
  const query = await queryInput(workspace, plan);
  await save(workspace, `${base}/plan.json`, plan);
  const prepared = await optionalJson(workspace, `${base}/prepared.json`);
  if (prepared) {
    if (prepared.query.source_sha256 !== query.source_sha256)
      fail('QUERY_VERSION_MISMATCH', 'Prepared Query bytes have changed');
    return {
      state: 'prepared',
      prompt_id: prepared.prompt_id,
      path: `${base}/prepared.json`,
    };
  }
  const capabilities = await call('oneglanse_capabilities', remote);
  if (
    capabilities.contract_version !== '1.0.0' ||
    capabilities.limits?.automatic_analysis !== true
  )
    fail(
      'MCP_VERSION_UNSUPPORTED',
      'Expected OneGlanse contract 1.0.0 with explicit native analysis',
    );
  if (
    !capabilities.allowed?.providers?.includes(plan.provider) ||
    !capabilities.allowed?.prompt_texts?.includes(query.submitted_text.trim())
  )
    fail('SCOPE_FORBIDDEN', 'Query/provider is outside the OneGlanse grant');
  const before = await call('oneglanse_prompts_read', remote);
  const merged = [
    ...new Set([...before.prompts.map((p) => p.prompt), query.submitted_text]),
  ];
  const request = { query, original_prompts: before, merged_prompts: merged };
  await save(
    workspace,
    `${base}/prepare-requests/${sha256(stableStringify(request))}.json`,
    request,
  );
  const after = await call('oneglanse_prompts_save', {
    ...remote,
    prompts: merged,
    expected_revision: before.revision,
  });
  const accepted = after.prompts.filter(
    (p) => p.prompt === query.submitted_text.trim(),
  );
  if (
    accepted.length !== 1 ||
    before.prompts.some(
      (p) =>
        !after.prompts.some(
          (next) => next.id === p.id && next.prompt === p.prompt,
        ),
    )
  )
    fail(
      'PROMPT_MAPPING_CONFLICT',
      'Prompt save lost existing prompts or returned ambiguous IDs',
    );
  const state = await call('oneglanse_workspace_read', remote);
  assertSingleScope(
    state.run_scope,
    accepted[0].id,
    accepted[0].prompt,
    plan.provider,
  );
  await save(workspace, `${base}/prepared.json`, {
    query,
    accepted_text: accepted[0].prompt,
    prompt_id: accepted[0].id,
    capabilities,
    workspace: state,
    prepared_at: new Date().toISOString(),
  });
  return {
    state: 'prepared',
    prompt_id: accepted[0].id,
    path: `${base}/prepared.json`,
  };
}

export async function startOneGlanse({ workspace, plan, call }) {
  const { base, remote } = await context(workspace, plan);
  if (
    stableStringify(await json(workspace, `${base}/plan.json`)) !==
    stableStringify(plan)
  )
    fail('INTAKE_CONFLICT', 'Run plan changed');
  const previous = await optionalJson(workspace, `${base}/start-result.json`);
  if (previous)
    return { state: previous.status, job_id: previous.job_id, reused: true };
  if (await optionalJson(workspace, `${base}/start-intent.json`))
    fail(
      'SUBMISSION_UNKNOWN',
      'An earlier start has no durable result; do not resubmit',
    );
  const prepared = await json(workspace, `${base}/prepared.json`);
  const query = await queryInput(workspace, plan);
  if (query.source_sha256 !== prepared.query.source_sha256)
    fail('QUERY_VERSION_MISMATCH', 'Prepared Query bytes changed');
  const state = await call('oneglanse_workspace_read', remote);
  assertSingleScope(
    state.run_scope,
    prepared.prompt_id,
    prepared.accepted_text,
    plan.provider,
  );
  await save(
    workspace,
    `${base}/start-intent.json`,
    {
      submitted_at: new Date().toISOString(),
      scope_revision: state.run_scope.revision,
      authorization: plan.authorization,
    },
    false,
  );
  try {
    const result = await call('oneglanse_run_start', {
      ...remote,
      expected_scope_revision: state.run_scope.revision,
    });
    await save(workspace, `${base}/start-result.json`, result);
    return { state: result.status, job_id: result.job_id, reused: false };
  } catch (error) {
    await save(workspace, `${base}/start-error.json`, {
      code: error.code ?? 'SUBMISSION_UNKNOWN',
      automatic_resubmit: false,
    });
    throw error;
  }
}

export async function statusOneGlanse({ workspace, plan, call }) {
  const { base, remote } = await context(workspace, plan);
  const started = await json(workspace, `${base}/start-result.json`);
  if (!started.job_receipt)
    fail('RUN_NOT_STARTED', 'Native run was not queued');
  const status = await call('oneglanse_run_status', {
    ...remote,
    job_receipt: started.job_receipt,
  });
  const filename = `${base}/status/${sha256(stableStringify(status))}.json`;
  await save(workspace, filename, status);
  return status;
}

export async function readCompleteResponse(call, remote, responseId) {
  let offset = 0;
  let total;
  let hash;
  const chunks = [];
  while (true) {
    const chunk = await call('oneglanse_response_read', {
      ...remote,
      response_id: responseId,
      offset_bytes: offset,
      max_bytes: 49152,
    });
    total ??= chunk.total_bytes;
    hash ??= chunk.sha256;
    if (
      chunk.response_id !== responseId ||
      chunk.encoding !== 'base64' ||
      chunk.content_type !== 'application/json; charset=utf-8' ||
      chunk.total_bytes !== total ||
      chunk.sha256 !== hash ||
      chunk.offset_bytes !== offset ||
      !Number.isSafeInteger(total) ||
      total <= 0 ||
      !/^[a-f0-9]{64}$/.test(hash ?? '') ||
      typeof chunk.data !== 'string'
    )
      fail('INTAKE_INTEGRITY', 'Response chunk metadata is inconsistent');
    const bytes = Buffer.from(chunk.data, 'base64');
    if (
      !bytes.length ||
      bytes.length > 49152 ||
      bytes.toString('base64') !== chunk.data ||
      offset + bytes.length > total
    )
      fail('INTAKE_INTEGRITY', 'Invalid response chunk bytes');
    chunks.push(bytes);
    offset += bytes.length;
    if (chunk.next_offset === null) {
      if (offset !== total)
        fail('INTAKE_INTEGRITY', 'Response ended before total_bytes');
      break;
    }
    if (chunk.next_offset !== offset || offset >= total)
      fail(
        'INTAKE_INTEGRITY',
        'Non-progressing or inconsistent response offset',
      );
  }
  const bytes = Buffer.concat(chunks);
  if (sha256(bytes) !== hash)
    fail('INTAKE_INTEGRITY', 'Response SHA-256 mismatch');
  const value = JSON.parse(bytes.toString('utf8'));
  const required = [
    'id',
    'workspace_id',
    'prompt_id',
    'prompt',
    'model',
    'model_provider',
    'prompt_run_at',
    'created_at',
    'response',
    'sources',
  ];
  if (
    required.some((field) => !Object.hasOwn(value, field)) ||
    value.id !== responseId ||
    value.workspace_id !== remote.workspace_id ||
    typeof value.response !== 'string' ||
    !Array.isArray(value.sources)
  )
    fail('INTAKE_INTEGRITY', 'Response identity or required fields mismatch');
  if (
    value.sources.some(
      (source) =>
        !source ||
        typeof source !== 'object' ||
        ['title', 'cited_text', 'url', 'domain', 'favicon'].some(
          (field) => !Object.hasOwn(source, field),
        ),
    )
  )
    fail('INTAKE_INTEGRITY', 'Stored Source fields are missing');
  return { bytes, value, sha256: hash, total_bytes: total };
}

export async function receiveOneGlanse({ workspace, plan, call }) {
  const { base, remote } = await context(workspace, plan);
  const prepared = await json(workspace, `${base}/prepared.json`);
  const intent = await json(workspace, `${base}/start-intent.json`);
  const started = await json(workspace, `${base}/start-result.json`);
  if (!started.job_id) fail('RUN_NOT_STARTED', 'Native run was not queued');
  const status = await statusOneGlanse({ workspace, plan, call });
  if (
    status.availability === 'available' &&
    status.progress?.status !== 'completed'
  )
    fail(
      'RUN_IN_PROGRESS',
      'Wait for the native run before freezing the response window',
    );
  let filter = await optionalJson(workspace, `${base}/response-filter.json`);
  if (!filter) {
    // ClickHouse native timestamps have second precision. This is a candidate window, not an exact job binding.
    filter = {
      ...remote,
      prompt_id: prepared.prompt_id,
      provider: plan.provider,
      from: new Date(
        Math.floor(Date.parse(intent.submitted_at) / 1000) * 1000,
      ).toISOString(),
      to: new Date().toISOString(),
      limit: 25,
    };
  }
  const items = [];
  const seen = new Set();
  let cursor;
  do {
    const page = await call('oneglanse_responses_list', {
      ...filter,
      ...(cursor ? { after_id: cursor } : {}),
    });
    if (!Array.isArray(page.items) || !('next_cursor' in page))
      fail('MCP_CONTRACT_INVALID', 'Invalid response list');
    for (const item of page.items) {
      if (!item.id || seen.has(item.id))
        fail('INTAKE_INTEGRITY', 'Duplicate/missing response ID across pages');
      seen.add(item.id);
      items.push(item);
    }
    if (
      page.next_cursor &&
      (page.next_cursor === cursor ||
        page.items.at(-1)?.id !== page.next_cursor)
    )
      fail('INTAKE_INTEGRITY', 'Response cursor does not progress');
    cursor = page.next_cursor;
  } while (cursor);
  if (!items.length)
    fail(
      'NO_RESPONSES_YET',
      'No stored response in this candidate time window; query status before reading again',
    );
  await save(workspace, `${base}/response-filter.json`, filter);
  const receipts = [];
  for (const item of items) {
    const response = await readCompleteResponse(call, remote, item.id);
    if (
      response.value.prompt_id !== prepared.prompt_id ||
      response.value.prompt !== prepared.accepted_text ||
      response.value.model_provider !== plan.provider
    )
      fail(
        'INTAKE_INTEGRITY',
        'Stored response does not match the Query/provider filter',
      );
    const filename = `${base}/responses/${sha256(item.id)}.json`;
    await writeCreateOnly(workspace, filename, response.bytes, {
      idempotent: true,
      conflictCode: 'INTAKE_CONFLICT',
    });
    const receipt = {
      response_id: item.id,
      path: filename,
      sha256: response.sha256,
      total_bytes: response.total_bytes,
      source_entry_count: response.value.sources.length,
      association: 'candidate-by-workspace-prompt-provider-time',
      exact_job_binding: false,
    };
    await save(workspace, `${base}/receipts/${sha256(item.id)}.json`, receipt);
    receipts.push(receipt);
  }
  await save(workspace, `${base}/received.json`, {
    contract_version: prepared.capabilities.contract_version,
    server_version: prepared.capabilities.server_version,
    collector_version: prepared.capabilities.collector_version,
    query: prepared.query,
    prompt_id: prepared.prompt_id,
    native_job_id: started.job_id,
    filter,
    responses: receipts,
  });
  return {
    state: 'received',
    response_count: receipts.length,
    source_entry_count: receipts.reduce((n, r) => n + r.source_entry_count, 0),
    path: `${base}/received.json`,
  };
}

export async function analyzeOneGlanse({ workspace, plan }) {
  const { base, identity } = await context(workspace, plan);
  const intake = await json(workspace, `${base}/received.json`);
  const observations = [];
  for (const receipt of intake.responses) {
    await assertNoSymlinkPath(workspace, receipt.path);
    const bytes = await readFile(resolveWithin(workspace, receipt.path));
    if (
      bytes.length !== receipt.total_bytes ||
      sha256(bytes) !== receipt.sha256
    )
      fail(
        'INTAKE_INTEGRITY',
        'Stored response bytes differ from their receipt',
      );
    const raw = JSON.parse(bytes.toString('utf8'));
    const sources = raw.sources.map((source, index) => {
      let normalized;
      try {
        normalized = normalizeCitationUrl(source.url);
      } catch {
        normalized = { url_normalized: null, citation_domain: null };
      }
      return {
        source_list_index: index,
        ...source,
        ...normalized,
        evidence_kind: 'source-list',
        occurrence_count: null,
        page_content_verified: false,
        source_type: null,
        claim_support: null,
      };
    });
    observations.push({
      response_id: raw.id,
      raw_path: receipt.path,
      raw_sha256: receipt.sha256,
      query_ref: intake.query.ref,
      provider: raw.model_provider,
      brand_mentioned: raw.response
        .toLowerCase()
        .includes(identity.brand.toLowerCase()),
      response_characters: [...raw.response].length,
      source_list_entry_count: sources.length,
      unique_url_count: new Set(
        sources.map((s) => s.url_normalized).filter(Boolean),
      ).size,
      citation_domains: [
        ...new Set(sources.map((s) => s.citation_domain).filter(Boolean)),
      ].sort(),
      sources,
      fact_accuracy: null,
      positioning_review: 'pending-human-or-geo-expert-review',
      formal_baseline_eligible: false,
      missing_evidence: [
        'independent_session',
        'actual_model_version',
        'actual_submission_time',
        'collector_profile_and_slot',
        'citation_occurrences',
        'exact_job_response_binding',
      ],
    });
  }
  const analysis = {
    schema_version: 'oneglanse-geo-observation-v1',
    scope: 'engineering-candidate',
    query: intake.query,
    observations,
    business_approval: false,
    formal_cycle_resumed: false,
  };
  await save(workspace, `${base}/analysis.json`, analysis);
  return {
    state: 'analyzed',
    response_count: observations.length,
    source_entry_count: observations.reduce(
      (n, r) => n + r.source_list_entry_count,
      0,
    ),
    formal_baseline_eligible: false,
    path: `${base}/analysis.json`,
  };
}
