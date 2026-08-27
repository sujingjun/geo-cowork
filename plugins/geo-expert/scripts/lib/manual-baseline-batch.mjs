import { collectorProfileFingerprint } from './answer-profile.mjs';
import { ingestManualSample } from './answer-manual.mjs';
import {
  M5_FORMAL_SAMPLE_COUNT,
  M5_PRIMARY_LANGUAGE,
  M5_SOURCE_CLASSIFICATION_THRESHOLD,
} from './m5-policy.mjs';

function citationId(platform, ordinal, index) {
  return `CIT-MYYSHOP-${platform.toUpperCase().replaceAll('_', '-')}-EN-BASELINE-S${ordinal}-${String(index).padStart(3, '0')}`;
}

function citationPath(id) {
  return `cycles/m5/citations/${id.toLowerCase()}.md`;
}

function expandCitations(platform, ordinal, items) {
  const occurrences = [];
  const createdSources = new Set();
  for (const item of items) {
    const repeat = item.repeat ?? 1;
    for (let index = 0; index < repeat; index += 1) {
      const occurrenceIndex = occurrences.length + 1;
      const id = citationId(platform, ordinal, occurrenceIndex);
      const sourceId = item.source_ref ?? item.source?.id;
      const createSource = item.source && !createdSources.has(sourceId);
      if (createSource) createdSources.add(sourceId);
      occurrences.push({
        id,
        path: citationPath(id),
        occurrence_index: occurrenceIndex,
        position: { kind: 'ui_order', order: occurrenceIndex },
        url_raw: item.url,
        anchor_or_context: item.context,
        ...(createSource ? { source: item.source } : { existing_source_ref: sourceId }),
      });
    }
  }
  return occurrences;
}

function buildPlan(manifest, entry) {
  const profileFrozenAt = manifest.profile_frozen_at ?? manifest.captured_at;
  const languageContract = {
    role: 'primary',
    object_key: manifest.object_key,
    primary_language: M5_PRIMARY_LANGUAGE,
    primary_query_ref: manifest.query.ref,
    semantic_contract_ref: manifest.decision_ref,
  };
  const profile = {
    id: entry.profile_id,
    record_type: 'collector_profile',
    status: 'frozen',
    version: '1.0.0',
    created_at: profileFrozenAt,
    updated_at: profileFrozenAt,
    title: `${entry.platform} English two-slot manual baseline profile`,
    platform: entry.platform,
    product_entry: entry.product_entry,
    region: entry.region ?? 'unknown',
    language: M5_PRIMARY_LANGUAGE,
    login_state: entry.login_state ?? 'unknown',
    conversation_state: 'new',
    web_search_state: entry.web_search_state ?? 'unknown',
    model_mode: entry.model_mode ?? 'unknown',
    query_template_version: '1.0.0',
    sampling_count: M5_FORMAL_SAMPLE_COUNT,
    language_contract: languageContract,
    time_window: manifest.time_window,
    device: {
      class: 'desktop',
      os: 'macOS',
      browser: 'Chrome with user-approved extension',
      viewport: 'unknown',
    },
    collection_method: 'manual',
    approval: {
      approved_by: 'MyyShop Owner',
      approved_at: profileFrozenAt,
      decision_ref: manifest.decision_ref,
    },
  };
  profile.profile_fingerprint = collectorProfileFingerprint(profile);
  return {
    schema_version: 'm5-manual-baseline-plan-v2',
    purpose: 'baseline',
    authorization_ref: manifest.decision_ref,
    classification_policy: {
      mode: 'batch_at_source_threshold',
      threshold: M5_SOURCE_CLASSIFICATION_THRESHOLD,
      decision_ref: manifest.decision_ref,
    },
    language_contract: languageContract,
    manual_source: {
      kind: 'user_supplied_result_url',
      result_url: entry.result_url,
      capture_surface: 'chrome_extension',
      ...(entry.observed_model_mode ? { observed_model_mode: entry.observed_model_mode } : {}),
    },
    profile: {
      path: `cycles/m5/profiles/${entry.profile_id.toLowerCase()}.md`,
      data: profile,
    },
    run: { id: entry.run_id },
    input_versions: {
      [manifest.goal.ref]: manifest.goal.version,
      [manifest.query.ref]: manifest.query.version,
      [manifest.query_set.ref]: manifest.query_set.version,
      [manifest.knowledge_release.ref]: manifest.knowledge_release.version,
      ...Object.fromEntries(manifest.claims.map((item) => [item.ref, item.version])),
      [entry.profile_id]: '1.0.0',
    },
    goal_refs: [manifest.goal.ref],
    query_set_versions: [manifest.query_set],
    knowledge_release_versions: [manifest.knowledge_release],
    query_version: manifest.query,
    collector_contract: {
      schema_version: '2.0.0',
      collector_version: 'manual-chrome-result-v2',
      tool_policy_version: 'm5-two-slot-source-batch-v1',
    },
    samples: [{ ordinal: 1 }, { ordinal: 2 }],
    sample: {
      id: entry.sample_id,
      path: `cycles/m5/samples/${entry.sample_id.toLowerCase()}.md`,
      ordinal: manifest.ordinal,
      outcome: 'success',
      captured_at: manifest.captured_at,
      answer_output_path: `raw/slot-${manifest.ordinal}/answer.md`,
      log_output_path: `raw/slot-${manifest.ordinal}/collector-log.json`,
      citations: expandCitations(entry.platform, manifest.ordinal, entry.citations),
    },
  };
}

export async function ingestManualBaselineBatch({ workspace, manifest }) {
  if (manifest.schema_version !== 'm5-manual-baseline-batch-v1'
      || manifest.ordinal < 1 || manifest.ordinal > M5_FORMAL_SAMPLE_COUNT
      || manifest.query.language !== M5_PRIMARY_LANGUAGE
      || !Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    const error = new Error('manual baseline batch manifest 合同不完整');
    error.code = 'M5_FIELD_REQUIRED';
    throw error;
  }
  const results = [];
  for (const entry of manifest.entries) {
    results.push(await ingestManualSample({
      workspace,
      plan: buildPlan(manifest, entry),
      answerText: entry.answer_text,
    }));
  }
  return { ok: true, ordinal: manifest.ordinal, results };
}
