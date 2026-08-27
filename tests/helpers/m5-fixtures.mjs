import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  collectorProfileFingerprint,
} from '../../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { m4ReadyWorkspace, APPROVAL } from './m4-fixtures.mjs';
import { NOW } from './object-fixtures.mjs';

const TEST_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_ROOT = path.join(TEST_ROOT, 'fixtures/m5-answer-testing');

export const M5_APPROVAL = {
  ...APPROVAL,
  decision_ref: 'fixture://approval/m5-offline-001',
};

export function collectorProfile(overrides = {}) {
  const data = {
    id: 'CPF-TEST-001',
    record_type: 'collector_profile',
    status: 'frozen',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic recorded collector profile',
    platform: 'chatgpt',
    product_entry: 'https://consumer.example.invalid/chat',
    region: 'US',
    language: 'en-US',
    login_state: 'logged_out',
    conversation_state: 'new',
    web_search_state: 'on',
    model_mode: 'recorded-fixture',
    query_template_version: '1.0.0',
    sampling_count: 2,
    time_window: {
      id: 'TW-TEST-20260825',
      starts_at: '2026-08-25T00:00:00+08:00',
      ends_at: '2026-08-26T00:00:00+08:00',
    },
    device: {
      class: 'desktop',
      os: 'fixture-os',
      browser: 'fixture-browser',
      viewport: '1280x720',
    },
    collection_method: 'recorded_fixture',
    approval: M5_APPROVAL,
    ...overrides,
  };
  data.profile_fingerprint = collectorProfileFingerprint(data);
  return data;
}

export async function m5ReadyWorkspace() {
  const root = await m4ReadyWorkspace();
  await mkdir(path.join(root, 'fixtures/m5'), { recursive: true });
  for (const file of ['slot-1-answer.txt', 'slot-2-refusal.txt', 'slot-3-timeout-log.json']) {
    await writeFile(
      path.join(root, 'fixtures/m5', file),
      await readFile(path.join(FIXTURE_ROOT, file)),
    );
  }
  return root;
}

function citation({ id, sourceId, domain, url, classification, party, verdict }) {
  const suffix = id.split('-').at(-1).toLowerCase();
  return {
    id,
    path: `cycles/m5/citations/${suffix}.md`,
    occurrence_index: Number.parseInt(id.split('-').at(-1), 10),
    position: { kind: 'ui_order', order: Number.parseInt(id.split('-').at(-1), 10) },
    url_raw: url,
    anchor_or_context: `Synthetic citation ${id}`,
    source: {
      id: sourceId,
      path: `evidence/sources/${sourceId.toLowerCase()}.md`,
      name: `${domain} source`,
      locator: `https://${domain}/`,
      identity: {
        level: 'domain',
        key: `domain:${domain}`,
        citation_domain: domain,
        host_platform: 'none',
        publisher_name: domain,
      },
    },
    classification: {
      id: `SCL-TEST-${id.split('-').at(-1)}`,
      path: `cycles/m5/classifications/scl-${suffix}.md`,
      primary_source_type: classification,
      secondary_source_types: [],
      party_relation: party,
      subject_workspace: 'synthetic-brand',
      basis: {
        page_owner: domain,
        content_form: classification === 'official_fact' ? 'official' : 'review',
        evidence: [`Recorded fixture identifies ${domain}.`],
      },
      confidence: 'high',
      reviewer: { kind: 'deterministic_rule', identifier: 'fixture-classifier-v1' },
      review_required: false,
      status: 'reviewed',
    },
    claim_support: {
      id: `CSR-TEST-${id.split('-').at(-1)}`,
      path: `cycles/m5/claim-support/csr-${suffix}.md`,
      claim_ref: 'CLM-TEST-001',
      claim_version: '1.0.0',
      verdict,
      support_scope: 'Synthetic fixture statement only.',
      rationale: 'Explicit fixture judgment; not a business fact.',
      confidence: 'high',
      reviewer: { kind: 'geo_expert', identifier: 'fixture-reviewer' },
      review_required: false,
      status: 'reviewed',
    },
  };
}

function answerReview(id) {
  const suffix = id.split('-').at(-1).toLowerCase();
  return {
    id: `ARV-TEST-${id.split('-').at(-1)}`,
    path: `cycles/m5/reviews/arv-${suffix}.md`,
    status: 'reviewed',
    rubric: {
      version: '1.0.0',
      definition: {
        core_fields: [
          'entity_recognition', 'core_fact_accuracy', 'current_positioning',
          'risk_boundary', 'citation_quality',
        ],
      },
    },
    core: {
      entity_recognition: 'pass',
      core_fact_accuracy: 'pass',
      current_positioning: 'partial',
      risk_boundary: 'pass',
      citation_quality: 'partial',
    },
    exploratory: {
      comparison_dimensions: [],
      recommendation_reasons: [],
      exclusion_reasons: [],
      competitor_mentions: [],
      source_structure_notes: [],
      decision_dimension_candidates: [],
    },
    reviewer: { kind: 'geo_expert', identifier: 'fixture-reviewer' },
    review_required: false,
  };
}

export function m5FixturePlan() {
  const profile = collectorProfile();
  return {
    schema_version: 'm5-recorded-fixture-plan-v1',
    purpose: 'baseline',
    authorization_ref: 'fixture://authorization/m5-recorded-001',
    industry: 'synthetic-services',
    query_cluster: {
      id: 'QC-TEST-DEFINITION',
      label: 'Synthetic definition',
      query_versions: [{ ref: 'Q-TEST-001', version: '1.0.0' }],
    },
    profile: {
      path: 'cycles/m5/profiles/cpf-test-001.md',
      data: profile,
    },
    run: { id: 'RUN-TEST-M5-001' },
    input_versions: {
      'GOAL-TEST-001': '1.0.0',
      'Q-TEST-001': '1.0.0',
      'QS-TEST-001': '1.0.0',
      'KR-TEST-001': '1.0.0',
      'CLM-TEST-001': '1.0.0',
      'CPF-TEST-001': '1.0.0',
    },
    goal_refs: ['GOAL-TEST-001'],
    query_set_versions: [{ ref: 'QS-TEST-001', version: '1.0.0' }],
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
    collector_contract: {
      schema_version: '1.0.0',
      collector_version: 'recorded-fixture-v1',
      tool_policy_version: 'm5-offline-v1',
    },
    samples: [
      {
        id: 'SMP-TEST-001',
        path: 'cycles/m5/samples/smp-test-001.md',
        ordinal: 1,
        outcome: 'success',
        captured_at: '2026-08-25T01:00:00+08:00',
        artifacts: [
          {
            role: 'answer_text',
            source_path: 'fixtures/m5/slot-1-answer.txt',
            output_path: 'raw/slot-1/answer.txt',
            media_type: 'text/plain',
          },
          {
            role: 'collector_log',
            content: '{"terminal_state":"success","credentials_stored":false}\n',
            output_path: 'raw/slot-1/collector-log.json',
            media_type: 'application/json',
          },
        ],
        citations: [
          citation({
            id: 'CIT-TEST-001', sourceId: 'SRC-M5-BRAND-001',
            domain: 'brand.example.invalid',
            url: 'HTTPS://www.brand.example.invalid:443/about#answer',
            classification: 'official_fact', party: 'first_party', verdict: 'supported',
          }),
          citation({
            id: 'CIT-TEST-002', sourceId: 'SRC-M5-REVIEWS-001',
            domain: 'reviews.example.invalid',
            url: 'https://reviews.example.invalid/story?case=1#fragment',
            classification: 'independent_professional', party: 'third_party',
            verdict: 'partially_supported',
          }),
        ],
        answer_review: answerReview('SMP-TEST-001'),
      },
      {
        id: 'SMP-TEST-002',
        path: 'cycles/m5/samples/smp-test-002.md',
        ordinal: 2,
        outcome: 'refusal',
        captured_at: '2026-08-25T01:05:00+08:00',
        artifacts: [{
          role: 'answer_text',
          source_path: 'fixtures/m5/slot-2-refusal.txt',
          output_path: 'raw/slot-2/answer.txt',
          media_type: 'text/plain',
        }],
        citations: [],
        answer_review: answerReview('SMP-TEST-002'),
      },
    ],
    aggregation: {
      id: 'AGG-TEST-001',
      path: 'cycles/m5/aggregations/agg-test-001.md',
      top_n: 10,
    },
  };
}
