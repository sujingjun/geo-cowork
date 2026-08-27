import { readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { inputFingerprint } from '../../plugins/geo-expert/scripts/lib/run-store.mjs';
import { sampleSlotKey } from '../../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { sha256 } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { materializeM6E2EGates } from './m6-e2e-fixtures.mjs';
import {
  createM6FixtureWorkspace,
  readM6FixtureJson,
  seedM6FreezeInputs,
  writeM6Object,
} from './m6-fixtures.mjs';

const CORE_IDS = Object.freeze({
  'TMT-M6-TEST-001': 'TMT-M6-TEST-001',
  'GOAL-M6-TEST-001': 'GOAL-M7-CYCLE-2-001',
  'Q-M6-TEST-001': 'Q-M7-CYCLE-2-001',
  'QS-M6-TEST-001': 'QS-M7-CYCLE-2-001',
  'KR-M6-TEST-001': 'KR-M7-CYCLE-2-001',
  'CLM-M6-TEST-001': 'CLM-M7-CYCLE-2-001',
  'AST-M6-TEST-001': 'AST-M7-CYCLE-2-001',
  'CPF-M6-TEST-001': 'CPF-M7-CYCLE-2-001',
  'SRC-M6-TEST-001': 'SRC-M7-CYCLE-2-001',
  'EVD-M6-TEST-001': 'EVD-M7-CYCLE-2-001',
});

function remapString(value) {
  if (CORE_IDS[value]) return CORE_IDS[value];
  if (/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/.test(value)) {
    return value.replace('-M6-', '-M7-C2-');
  }
  if (value.startsWith('fixture://')) return value.replaceAll('m6-', 'm7-cycle-2-');
  if (value.includes('/')) {
    return value.replace('cycles/m6/', 'cycles/m7/cycle-2/')
      .replaceAll('m6-', 'm7-c2-')
      .replaceAll('M6-', 'M7-C2-');
  }
  return value;
}

function remap(value) {
  if (typeof value === 'string') return remapString(value);
  if (Array.isArray(value)) return value.map(remap);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .map(([key, item]) => [remapString(key), remap(item)]));
  }
  return value;
}

async function copyFileWithDirs(source, target) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await readFile(source));
}

function refreshObject(data, allObjects) {
  if (data.record_type === 'evidence' && data.id === 'EVD-M7-C2-ASSET-001') {
    data.locator = 'https://m6-test-merchant.invalid/cycle-2/pricing';
  }
  if (data.record_type === 'answer_sample') {
    data.slot_key = sampleSlotKey({
      purpose: data.purpose,
      queryRef: data.query_ref,
      queryVersion: data.query_version,
      platform: data.platform,
      collectorProfileRef: data.collector_profile_ref,
      collectorProfileVersion: data.collector_profile_version,
      queryTemplateVersion: '1.0.0',
      timeWindowId: 'TW-M7-CYCLE-2-001',
      ordinal: data.ordinal,
    });
  }
  if (data.record_type === 'run') {
    data.input_fingerprint = inputFingerprint(data.input_versions);
    for (const slot of data.sample_slots ?? []) {
      const sample = allObjects.find((item) =>
        item.data.record_type === 'answer_sample'
        && item.data.run_ref === data.id
        && item.data.ordinal === slot.ordinal);
      if (sample) slot.slot_key = sample.data.slot_key;
    }
  }
  if (data.record_type === 'answer_aggregation') {
    for (const selected of data.selected_sample_versions ?? []) {
      const sample = allObjects.find((item) => item.data.id === selected.ref);
      if (sample) selected.slot_key = sample.data.slot_key;
    }
    if (data.query_cluster) data.query_cluster.id = 'QC-M7-CYCLE-2-PRICING';
    if (data.time_window) data.time_window.id = `TW-M7-CYCLE-2-${data.purpose}`;
  }
  return data;
}

async function cloneGateObjects(temp, root, descriptors) {
  const objects = [];
  for (const descriptor of descriptors) {
    const sourcePath = path.join(temp, ...descriptor.path.split('/'));
    const text = await readFile(sourcePath, 'utf8');
    const parsed = matter(text);
    objects.push({
      old: parsed.data,
      data: remap(parsed.data),
      body: parsed.content,
      path: remapString(descriptor.path),
    });
  }
  for (const object of objects) refreshObject(object.data, objects);
  for (const object of objects) {
    if (object.old.record_type === 'evidence') {
      const oldSnapshot = object.old.snapshot?.path;
      const newSnapshot = object.data.snapshot?.path;
      if (oldSnapshot && newSnapshot) {
        await copyFileWithDirs(
          path.join(temp, ...oldSnapshot.split('/')),
          path.join(root, ...newSnapshot.split('/')),
        );
      }
    }
    if (object.old.record_type === 'answer_sample') {
      for (const artifact of object.old.artifacts ?? []) {
        if (artifact.availability !== 'captured') continue;
        const newArtifact = object.data.artifacts.find((item) => item.role === artifact.role);
        await copyFileWithDirs(
          path.join(temp, 'runs', object.old.run_ref, ...artifact.path.split('/')),
          path.join(root, 'runs', object.data.run_ref, ...newArtifact.path.split('/')),
        );
      }
    }
    await writeM6Object(root, object.path, object.data, object.body);
  }
  return Promise.all(objects.map(async (object) => ({
    id: object.data.id,
    record_type: object.data.record_type,
    status: object.data.status,
    version: object.data.version,
    path: object.path,
    sha256: sha256(await readFile(path.join(root, ...object.path.split('/')))),
  })));
}

export async function materializeCycle2GateFixtures(root) {
  const temp = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(temp);
    const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
    const graph = await materializeM6E2EGates(temp, bundle);
    const all = await cloneGateObjects(temp, root, graph.all);
    const byId = new Map(all.map((item) => [item.id, item]));
    const byGate = {};
    for (const name of [
      'baseline', 'diagnosis', 'adoption', 'publication',
      'technical_retest', 'answer_retest',
    ]) byGate[name] = graph.byGate[name]
      .map((item) => byId.get(remapString(item.id))).filter(Boolean);
    return { byGate };
  } finally {
    await rm(temp, { recursive: true });
  }
}
