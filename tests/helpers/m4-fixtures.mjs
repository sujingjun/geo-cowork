import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { querySetContentSha } from '../../plugins/geo-expert/scripts/lib/knowledge-query.mjs';
import { sha256 } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  NOW,
  evidence,
  query,
  source,
  temporaryWorkspace,
  writeObject,
} from './object-fixtures.mjs';

export const APPROVAL = {
  approved_by: 'Fixture Human Reviewer',
  approved_at: NOW,
  decision_ref: 'fixture://approval/m4-001',
};

export const SITE_CODES = [
  'HTTP_STATUS',
  'CANONICAL',
  'ROBOTS',
  'SITEMAP',
  'SCHEMA_SYNTAX',
  'TITLE_PRESENT',
  'META_DESCRIPTION_PRESENT',
  'HEADING_PRESENT',
  'CRAWLABILITY',
];

export async function m4ReadyWorkspace() {
  const root = await temporaryWorkspace('geo-m4-test-');
  await mkdir(path.join(root, 'evidence/snapshots'), { recursive: true });
  const brandSnapshot = 'Synthetic Brand provides a documented service.\n';
  const assetSnapshot = '<html><body><h1>About</h1><p>Current text omits the approved capability.</p></body></html>\n';
  await writeFile(path.join(root, 'evidence/snapshots/brand.txt'), brandSnapshot);
  await writeFile(path.join(root, 'evidence/snapshots/asset.html'), assetSnapshot);

  await writeObject(root, 'evidence/sources/brand.md', source());
  await writeObject(root, 'evidence/sources/site.md', source({
    id: 'SRC-SITE-001',
    title: 'Synthetic site source',
    name: 'Synthetic site source',
    source_kind: 'development_fixture',
    locator: 'https://brand.example.invalid/about',
  }));
  await writeObject(root, 'evidence/records/brand.md', evidence(
    'evidence/snapshots/brand.txt',
    sha256(brandSnapshot),
    {
      claim_refs: ['CLM-TEST-001'],
      scope: 'Synthetic capability statement.',
    },
  ));
  await writeObject(root, 'evidence/records/asset.md', evidence(
    'evidence/snapshots/asset.html',
    sha256(assetSnapshot),
    {
      id: 'EVD-TEST-ASSET-001',
      status: 'candidate',
      approval: undefined,
      title: 'Synthetic Asset observation',
      source_refs: ['SRC-SITE-001'],
      claim_refs: ['CLM-TEST-001'],
      locator: 'https://brand.example.invalid/about',
      scope: 'The captured Asset omits the approved capability statement.',
      collection_state: 'captured',
      proof_scope: 'target_content',
      detector_code: 'CONTENT_PRESENT',
    },
  ));
  await writeObject(root, 'knowledge/documents/document.md', {
    id: 'DOC-TEST-001',
    record_type: 'document',
    status: 'approved',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic baseline',
    scope: 'Synthetic fixture only.',
    source_refs: ['SRC-TEST-001'],
    claim_refs: ['CLM-TEST-001'],
    approval: APPROVAL,
  });
  await writeObject(root, 'cycles/preparation/goal.md', {
    id: 'GOAL-TEST-001',
    record_type: 'perception_goal',
    status: 'approved',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic definition goal',
    goal_statement: 'Represent Synthetic Brand accurately.',
    success_question: 'What is Synthetic Brand?',
    query_set_refs: ['QS-TEST-001'],
    approval: APPROVAL,
  });
  await writeObject(root, 'queries/formal/query.md', {
    ...query(),
    status: 'formal',
    goal_refs: ['GOAL-TEST-001'],
    discovery_source_refs: ['SRC-TEST-001'],
    approval: APPROVAL,
  });
  await writeObject(root, 'knowledge/claims/claim.md', {
    id: 'CLM-TEST-001',
    record_type: 'claim',
    status: 'published',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic capability',
    statement: 'Synthetic Brand provides a documented service.',
    risk_type: 'capability_fact',
    risk_level: 'low',
    evidence_refs: ['EVD-TEST-001'],
    document_refs: ['DOC-TEST-001'],
    scope: 'Synthetic fixture only.',
    evidence_sufficiency: {
      status: 'sufficient',
      rule_version: 'm3-evidence-sufficiency-v1',
      missing: [],
    },
    release_refs: ['KR-TEST-001'],
    approval: APPROVAL,
  });
  await writeObject(root, 'knowledge/answer-cards/answer.md', {
    id: 'ANS-TEST-001',
    record_type: 'answer_card',
    status: 'published',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic answer',
    query_refs: ['Q-TEST-001'],
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    evidence_refs: ['EVD-TEST-001'],
    direct_answer: 'Synthetic Brand provides a documented service.',
    limitations: ['Synthetic fixture only.'],
    forbidden_statements: ['No guaranteed outcomes.'],
    release_refs: ['KR-TEST-001'],
    approval: APPROVAL,
  });
  const versions = [{
    ref: 'Q-TEST-001',
    version: '1.0.0',
    query_text: 'What is Synthetic Brand?',
    language: 'en',
  }];
  await writeObject(root, 'queries/sets/set.md', {
    id: 'QS-TEST-001',
    record_type: 'query_set',
    status: 'frozen',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic frozen set',
    goal_refs: ['GOAL-TEST-001'],
    query_versions: versions.map(({ ref, version }) => ({ ref, version })),
    frozen_at: NOW,
    frozen_by: 'Fixture Human Reviewer',
    content_sha256: querySetContentSha(versions),
    approval: APPROVAL,
  });
  await writeObject(root, 'knowledge/releases/release.md', {
    id: 'KR-TEST-001',
    record_type: 'knowledge_release',
    status: 'published',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic release',
    release_version: '1.0.0',
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    answer_card_versions: [{ ref: 'ANS-TEST-001', version: '1.0.0' }],
    readiness: 'ready',
    approval: APPROVAL,
  });
  await writeObject(root, 'assets/own/about.md', {
    id: 'AST-TEST-ABOUT-001',
    record_type: 'asset',
    status: 'active',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic About asset',
    asset_kind: 'own',
    locator: 'https://brand.example.invalid/about',
    source_refs: ['SRC-SITE-001'],
    asset_role: 'about',
    control_scope: 'own',
    goal_refs: ['GOAL-TEST-001'],
    query_refs: ['Q-TEST-001'],
    claim_versions: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
  });
  return root;
}

export async function writeSiteSnapshots(root, {
  html,
  prefix = '',
  robots = 'User-agent: *\nAllow: /\n',
  sitemap = '<urlset><url><loc>https://brand.example.invalid/about</loc></url></urlset>\n',
} = {}) {
  const content = html ?? [
    '<html><head><title>Synthetic Brand</title>',
    '<meta name="description" content="Synthetic description">',
    '<meta name="robots" content="index,follow">',
    '<link rel="canonical" href="https://brand.example.invalid/about">',
    '<script type="application/ld+json">{"@context":"https://schema.org"}</script>',
    '</head><body><h1>About Synthetic Brand</h1></body></html>',
  ].join('');
  const snapshots = {
    html: content,
    robots,
    sitemap,
  };
  for (const [name, bytes] of Object.entries(snapshots)) {
    await writeFile(path.join(root, `evidence/snapshots/${prefix}${name}.${name === 'html' ? 'html' : 'txt'}`), bytes);
  }
  return {
    schema_version: 'm4-site-manifest-v1',
    target: {
      asset_ref: 'AST-TEST-ABOUT-001',
      locator: 'https://brand.example.invalid/about',
    },
    captured_at: NOW,
    collector: { name: 'synthetic-fixture', version: '1.0.0', mode: 'development_fixture' },
    collection_state: 'captured',
    snapshots: Object.entries(snapshots).map(([role, bytes]) => ({
      role,
      path: `evidence/snapshots/${prefix}${role}.${role === 'html' ? 'html' : 'txt'}`,
      sha256: sha256(bytes),
      media_type: role === 'html' ? 'text/html' : 'text/plain',
    })),
    http: { status: 200, headers: { 'content-type': 'text/html' } },
    expectations: { expected_http_statuses: [200], target_path: '/about' },
  };
}

export function sitePlan(runId = 'RUN-M4-SITE-001') {
  return {
    source_ref: 'SRC-SITE-001',
    run: { id: runId, path: `runs/${runId}/run.md` },
    input_versions: {
      'AST-TEST-ABOUT-001': '1.0.0',
      'GOAL-TEST-001': '1.0.0',
      'Q-TEST-001': '1.0.0',
      'QS-TEST-001': '1.0.0',
      'KR-TEST-001': '1.0.0',
      'CLM-TEST-001': '1.0.0',
      'SRC-SITE-001': '1.0.0',
    },
    goal_refs: ['GOAL-TEST-001'],
    query_set_versions: [{ ref: 'QS-TEST-001', version: '1.0.0' }],
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
    asset_refs: ['AST-TEST-ABOUT-001'],
    development_fixture: true,
    outputs: Object.fromEntries(SITE_CODES.map((code) => {
      const idCode = code.replaceAll('_', '-');
      return [code, {
        evidence: {
          id: `EVD-M4-${idCode}-001`,
          path: `evidence/records/m4-${code.toLowerCase().replaceAll('_', '-')}.md`,
        },
        finding: {
          id: `FND-M4-${idCode}-001`,
          path: `findings/m4-${code.toLowerCase().replaceAll('_', '-')}.md`,
        },
      }];
    })),
  };
}
