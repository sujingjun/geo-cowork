import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  serializeMarkdownObject,
} from '../../plugins/geo-expert/scripts/lib/object-contract.mjs';

export const NOW = '2026-08-24T00:00:00+08:00';

export async function temporaryWorkspace(prefix = 'geo-contract-test-') {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
  for (const dir of [
    'knowledge/documents',
    'knowledge/00-governance',
    'knowledge/01-templates',
    'knowledge/claims',
    'knowledge/answer-cards',
    'knowledge/releases',
    'queries/candidates',
    'queries/formal',
    'queries/sets',
    'evidence/sources',
    'evidence/records',
    'evidence/plans',
    'assets/own',
    'assets/external',
    'indexes',
    'runs',
    'cycles',
  ]) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  return root;
}

export async function writeObject(root, relativePath, data, body = '# Fixture\n') {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, serializeMarkdownObject(data, body));
  return target;
}

export function source(overrides = {}) {
  return {
    id: 'SRC-TEST-001',
    record_type: 'source',
    status: 'active',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic source',
    name: 'Synthetic source',
    source_kind: 'first_party_document',
    locator: 'https://example.invalid/source',
    extensions: {
      'geo.evidence_category': 'first_party',
    },
    ...overrides,
  };
}

export function evidence(snapshotPath, sha256, overrides = {}) {
  return {
    id: 'EVD-TEST-001',
    record_type: 'evidence',
    status: 'approved',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic evidence',
    source_refs: ['SRC-TEST-001'],
    locator: 'https://example.invalid/source#fact',
    captured_at: NOW,
    snapshot: {
      path: snapshotPath,
      sha256,
      media_type: 'text/plain',
    },
    collector: {
      name: 'synthetic-fixture',
      version: '1.0.0',
    },
    approval: {
      approved_by: 'Fixture Reviewer',
      approved_at: NOW,
      decision_ref: 'fixture://approval/evidence-001',
    },
    extensions: {
      'geo.evidence_category': 'first_party',
    },
    ...overrides,
  };
}

export function claim(overrides = {}) {
  return {
    id: 'CLM-TEST-001',
    record_type: 'claim',
    status: 'candidate',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'Synthetic claim',
    statement: 'Synthetic Brand provides a documented capability.',
    risk_type: 'capability_fact',
    risk_level: 'medium',
    evidence_refs: ['EVD-TEST-001'],
    document_refs: [],
    scope: 'Synthetic test only',
    evidence_sufficiency: {
      status: 'unknown',
      rule_version: 'm3-evidence-sufficiency-v1',
      missing: [],
    },
    ...overrides,
  };
}

export function query(overrides = {}) {
  return {
    id: 'Q-TEST-001',
    record_type: 'query',
    status: 'candidate',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    title: 'What is Synthetic Brand?',
    query_text: 'What is Synthetic Brand?',
    language: 'en',
    normalized_text: 'what is synthetic brand',
    intent: 'definition',
    priority: 'P0',
    goal_refs: [],
    discovery_source_refs: [],
    legacy_refs: [],
    ...overrides,
  };
}
