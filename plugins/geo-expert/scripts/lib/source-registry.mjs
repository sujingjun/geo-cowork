import { readFile, readdir } from 'node:fs/promises';
import {
  readMarkdownObject,
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import { readRun } from './run-store.mjs';
import { sourceClassificationQueueStatus } from './m5-policy.mjs';
import {
  resolveWithin,
  atomicWrite,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class SourceRegistryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'SourceRegistryError';
    this.code = code;
    Object.assign(this, details);
  }
}

async function readExistingSource(workspace, occurrence, proposed) {
  try {
    const existing = await readMarkdownObject(
      resolveWithin(workspace, occurrence.source.path),
      { workspace },
    );
    if (existing.data.id !== proposed.id
        || existing.data.source_kind !== 'consumer_citation'
        || existing.data.locator !== proposed.locator
        || stableStringify(existing.data.identity) !== stableStringify(proposed.identity)) {
      throw new SourceRegistryError('SOURCE_IDENTITY_CONFLICT', '既有 Source identity 与当前 Citation 不一致');
    }
    return existing;
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    throw error;
  }
}

export function normalizeCitationUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new SourceRegistryError('CITATION_URL_INVALID', 'Citation URL 无法解析');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new SourceRegistryError('CITATION_URL_INVALID', 'Citation URL 协议或凭据非法');
  }
  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();
  url.hash = '';
  const citationDomain = url.hostname.replace(/^www\./, '');
  return {
    url_normalized: url.toString(),
    citation_domain: citationDomain,
  };
}

export function sourceIdentityKey(identity) {
  return sha256(stableStringify({
    level: identity.level,
    key: identity.key,
    citation_domain: identity.citation_domain,
    host_platform: identity.host_platform,
    publisher_name: identity.publisher_name,
  }));
}

async function validateSourceRun({ workspace, sample }) {
  const run = await readRun({ workspace, runId: sample.run_ref });
  const recordedAllowed = sample.collection_method === 'recorded_fixture'
    && run.data.authorization_ref?.startsWith('fixture://');
  const manualAllowed = sample.collection_method === 'manual' && !sample.extensions?.['geo.real_capture']
    && run.data.authorization_ref?.startsWith('workspace://');
  const realAllowed = ['browser_automation', 'manual'].includes(sample.collection_method) && sample.extensions?.['geo.real_capture']
    && run.data.execution_scope === 'authorized_real' && run.data.authorization_ref?.startsWith('workspace://');
  if (run.data.skill !== 'geo-answer-cycle' || (!recordedAllowed && !manualAllowed && !realAllowed)) {
    throw new SourceRegistryError(
      'SOURCE_CANDIDATE_UNOBSERVED',
      'Source 候选必须来自具备匹配授权的 M5 Run',
    );
  }
  return run;
}

function pairData({ sample, occurrence, now }) {
  const normalized = normalizeCitationUrl(occurrence.url_raw);
  if (occurrence.source.identity.citation_domain !== normalized.citation_domain) {
    throw new SourceRegistryError('SOURCE_IDENTITY_CONFLICT', 'Source identity 与 Citation domain 不一致');
  }
  const citation = {
    id: occurrence.id,
    record_type: 'citation_observation',
    status: 'observed',
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `Citation ${occurrence.id}`,
    sample_ref: sample.id,
    sample_raw_manifest_sha256: sample.raw_manifest_sha256,
    occurrence_index: occurrence.occurrence_index,
    position: occurrence.position,
    url_raw: occurrence.url_raw,
    url_normalized: normalized.url_normalized,
    citation_domain: normalized.citation_domain,
    source_ref: occurrence.source.id,
    anchor_or_context: occurrence.anchor_or_context,
  };
  const source = {
    id: occurrence.source.id,
    record_type: 'source',
    status: 'active',
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: occurrence.source.name,
    name: occurrence.source.name,
    source_kind: 'consumer_citation',
    locator: occurrence.source.locator,
    identity: occurrence.source.identity,
    ...(occurrence.source.classification_queue ? { classification_queue: occurrence.source.classification_queue } : {}),
    discovery: {
      method: 'consumer_citation',
      citation_ref: occurrence.id,
      observed_at: now,
    },
  };
  validateObjectData(citation, { path: occurrence.path });
  validateObjectData(source, { path: occurrence.source.path });
  return { citation, source };
}

export async function materializeCitationSourcePair({
  workspace,
  sample,
  occurrence,
  now,
  failAfter,
}) {
  await validateSourceRun({ workspace, sample });
  const { citation, source } = pairData({ sample, occurrence, now });
  const citationContent = serializeMarkdownObject(citation, `# ${citation.title}\n`);
  const sourceContent = serializeMarkdownObject(source, `# ${source.title}\n`);
  const existingSource = await readExistingSource(workspace, occurrence, source);
  // Journal precedes either side of the cyclic Citation/Source reference. A
  // restart can repair the pair before the workspace graph is loaded.
  const { action: _action, ...canonicalSample } = sample;
  const journal = { sample: canonicalSample, occurrence, now };
  await writeCreateOnly(workspace, `runs/${sample.run_ref}/outputs/citation-pairs/${occurrence.id}.json`,
    stableStringify({ ...journal, sha256: sha256(stableStringify(journal)) }, 2), { idempotent: true, conflictCode: 'CITATION_SOURCE_PAIR_INCOMPLETE' });
  const citationResult = await writeCreateOnly(
    workspace,
    occurrence.path,
    citationContent,
    { idempotent: true, conflictCode: 'CITATION_SOURCE_PAIR_INCOMPLETE' },
  );
  if (failAfter === 'citation') {
    throw new SourceRegistryError('INJECTED_FAILURE', '测试注入：Citation 后中断');
  }
  const sourceResult = existingSource
    ? { action: 'kept' }
    : await writeCreateOnly(
      workspace,
      occurrence.source.path,
      sourceContent,
      { idempotent: true, conflictCode: 'SOURCE_IDENTITY_CONFLICT' },
    );
  return {
    citation_ref: citation.id,
    source_ref: source.id,
    citation_action: citationResult.action,
    source_action: sourceResult.action,
    materialization_fingerprint: sha256(stableStringify({
      citation_sha256: sha256(citationContent),
      source_sha256: sha256(existingSource?.original ?? sourceContent),
    })),
  };
}

export async function materializeCitationObservation({
  workspace,
  sample,
  occurrence,
  now,
}) {
  await validateSourceRun({ workspace, sample });
  const graph = await loadWorkspaceGraph({ workspace });
  const source = graph.byId.get(occurrence.existing_source_ref)?.data;
  if (!source || source.record_type !== 'source') {
    throw new SourceRegistryError('SOURCE_REF_REQUIRED', '既有 Source ref 不存在');
  }
  const normalized = normalizeCitationUrl(occurrence.url_raw);
  let sourceDomain;
  try {
    sourceDomain = new URL(source.locator).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    throw new SourceRegistryError('SOURCE_IDENTITY_CONFLICT', '既有 Source locator 不是可比较 URL');
  }
  if (sourceDomain !== normalized.citation_domain) {
    throw new SourceRegistryError('SOURCE_IDENTITY_CONFLICT', 'Citation domain 与既有 Source 不一致');
  }
  const data = {
    id: occurrence.id,
    record_type: 'citation_observation',
    status: 'observed',
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `Citation ${occurrence.id}`,
    sample_ref: sample.id,
    sample_raw_manifest_sha256: sample.raw_manifest_sha256,
    occurrence_index: occurrence.occurrence_index,
    position: occurrence.position,
    url_raw: occurrence.url_raw,
    url_normalized: normalized.url_normalized,
    citation_domain: normalized.citation_domain,
    source_ref: source.id,
    anchor_or_context: occurrence.anchor_or_context,
  };
  validateObjectData(data, { path: occurrence.path });
  const result = await writeCreateOnly(
    workspace,
    occurrence.path,
    serializeMarkdownObject(data, `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'CITATION_SOURCE_PAIR_INCOMPLETE' },
  );
  return { ...data, action: result.action };
}

export function deriveSourceLifecycle(citations, currentWindow) {
  const sorted = [...citations].sort((a, b) =>
    Date.parse(a.captured_at) - Date.parse(b.captured_at) || a.id.localeCompare(b.id));
  if (sorted.length === 0) return null;
  const prior = sorted.some((item) => Date.parse(item.captured_at) < Date.parse(currentWindow.starts_at));
  return {
    first_seen: sorted[0].captured_at,
    last_seen: sorted.at(-1).captured_at,
    observation_count: sorted.length,
    lifecycle: prior ? 'returning' : 'new',
  };
}

export async function recoverCitationSourcePairs(workspace) {
  let runs;
  try { runs = await readdir(resolveWithin(workspace, 'runs'), { withFileTypes: true }); }
  catch (e) { if (e.code === 'ENOENT') return; throw e; }
  for (const run of runs.filter(r => r.isDirectory())) {
    const folder = `runs/${run.name}/outputs/citation-pairs`;
    let files;
    try { files = await readdir(resolveWithin(workspace, folder)); }
    catch (e) { if (e.code === 'ENOENT') continue; throw e; }
    for (const file of files.filter(f => /^CIT-[A-Z0-9-]+\.json$/.test(f))) {
      const { sha256: checksum, ...journal } = JSON.parse(await readFile(resolveWithin(workspace, `${folder}/${file}`), 'utf8'));
      if (checksum !== sha256(stableStringify(journal)) || journal.sample.run_ref !== run.name || file !== `${journal.occurrence.id}.json`)
        throw new SourceRegistryError('CITATION_SOURCE_PAIR_INCOMPLETE', 'Citation recovery journal changed');
      const present = await Promise.all([journal.occurrence.path, journal.occurrence.source.path].map(async p => {
        try { await readFile(resolveWithin(workspace, p)); return true; }
        catch (e) { if (e.code === 'ENOENT') return false; throw e; }
      }));
      if (present.every(Boolean)) continue;
      await materializeCitationSourcePair({ workspace, ...journal });
    }
  }
}

// Queue maintenance never replaces a classification or promotes a candidate.
export async function refreshFormalSourceQueue(workspace, now, { sampleRef, decisionRef } = {}) {
  const graph = await loadWorkspaceGraph({ workspace });
  const observed = new Set(graph.objects.filter(o => o.data.record_type === 'citation_observation' && o.data.status !== 'superseded').map(o => o.data.source_ref));
  const status = sourceClassificationQueueStatus(observed.size);
  const sampleSources = new Set(graph.objects.filter(o => o.data.record_type === 'citation_observation' && o.data.sample_ref === sampleRef).map(o => o.data.source_ref));
  for (const id of observed) {
    const source = graph.byId.get(id), originalQueue = source?.data.classification_queue;
    const queue = originalQueue ?? (sampleSources.has(id) && decisionRef?.startsWith('workspace://') ? { status, threshold: 100, decision_ref: decisionRef } : null);
    if (!queue || queue.status === 'classified' || originalQueue?.status === status) continue;
    const parts = source.data.version.split('.').map(Number);parts[2]++;
    const data = { ...source.data, version: parts.join('.'), updated_at: now, classification_queue: { ...queue, status } };
    validateObjectData(data, { path: source.path });
    await atomicWrite(workspace, source.path, serializeMarkdownObject(data, source.content));
  }
  return { status, threshold: 100, unique_source_count: observed.size };
}
