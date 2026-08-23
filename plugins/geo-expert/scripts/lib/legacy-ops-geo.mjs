import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  ObjectContractError,
  parseMarkdownObjectText,
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class LegacyImportError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'LegacyImportError';
    this.code = code;
    Object.assign(this, details);
  }
}

function padded(index) {
  return String(index + 1).padStart(3, '0');
}

function ensureNamespace(namespace) {
  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(namespace ?? '')) {
    throw new LegacyImportError('INVALID_NAMESPACE', 'namespace 必须是大写 stable ID 片段');
  }
  return namespace;
}

async function readWorkspaceFile(workspace, relativePath, missingCode) {
  const safe = assertSafeRelativePath(relativePath);
  try {
    await assertNoSymlinkPath(workspace, safe);
    return await readFile(resolveWithin(workspace, safe));
  } catch (error) {
    if (error.code === 'PATH_NOT_FOUND' || error.code === 'ENOENT') {
      throw new LegacyImportError(missingCode, 'legacy 输入引用的文件不存在', { path: safe });
    }
    throw error;
  }
}

function markdownOutput(data, body) {
  validateObjectData(data);
  const content = serializeMarkdownObject(data, body);
  parseMarkdownObjectText(content);
  return content;
}

function relativeInputPath(workspace, inputPath) {
  const root = path.resolve(workspace);
  const absolute = path.resolve(inputPath);
  const relative = path.relative(root, absolute).split(path.sep).join('/');
  if (!relative || relative.startsWith('../') || path.isAbsolute(relative)) {
    throw new LegacyImportError('PATH_ESCAPE', 'legacy 输入必须位于工作区内');
  }
  return assertSafeRelativePath(relative);
}

export async function importLegacyOpsGeo({ workspace, inputPath, namespace, now }) {
  const safeNamespace = ensureNamespace(namespace);
  const inputRelative = relativeInputPath(workspace, inputPath);
  const inputBytes = await readWorkspaceFile(workspace, inputRelative, 'INPUT_NOT_FOUND');
  let legacy;
  try {
    legacy = JSON.parse(inputBytes.toString('utf8'));
  } catch {
    throw new LegacyImportError('INVALID_INPUT', 'legacy audit JSON 无法解析');
  }
  if (!Array.isArray(legacy.snapshots) || !Array.isArray(legacy.findings)) {
    throw new LegacyImportError('INVALID_INPUT', 'legacy audit 缺少 snapshots 或 findings 数组');
  }
  const stableTime = legacy.snapshots[0]?.captured_at
    ?? (legacy.date ? `${legacy.date}T00:00:00Z` : now);

  const evidenceByKey = new Map();
  const outputs = [];
  for (const [index, snapshot] of legacy.snapshots.entries()) {
    if (!snapshot.key || evidenceByKey.has(snapshot.key)) {
      throw new LegacyImportError('INVALID_INPUT', 'snapshot key 缺失或重复');
    }
    const bytes = await readWorkspaceFile(workspace, snapshot.path, 'SNAPSHOT_NOT_FOUND');
    if (sha256(bytes) !== snapshot.sha256) {
      throw new ObjectContractError('CHECKSUM_MISMATCH', 'legacy snapshot checksum 不一致');
    }
    const suffix = padded(index);
    const sourceId = `SRC-LEGACY-${safeNamespace}-${suffix}`;
    const evidenceId = `EVD-LEGACY-${safeNamespace}-${suffix}`;
    const base = `evidence/legacy/${safeNamespace}`;
    const source = {
      id: sourceId,
      record_type: 'source',
      status: 'active',
      version: '1.0.0',
      created_at: stableTime,
      updated_at: stableTime,
      title: `Legacy snapshot source ${snapshot.key}`,
      name: `Legacy ops-geo snapshot ${snapshot.key}`,
      source_kind: 'legacy_audit_origin',
      locator: snapshot.source_url ?? legacy.url,
      extensions: { 'legacy.input_sha256': sha256(inputBytes) },
    };
    const evidence = {
      id: evidenceId,
      record_type: 'evidence',
      status: 'candidate',
      version: '1.0.0',
      created_at: stableTime,
      updated_at: stableTime,
      title: `Legacy snapshot evidence ${snapshot.key}`,
      source_refs: [sourceId],
      locator: snapshot.source_url ?? legacy.url,
      captured_at: snapshot.captured_at,
      snapshot: {
        path: snapshot.path,
        sha256: snapshot.sha256,
        media_type: snapshot.media_type,
      },
      collector: {
        name: snapshot.collector,
        version: snapshot.collector_version,
      },
      extensions: { 'geo.evidence_category': 'legacy' },
    };
    outputs.push({
      path: `${base}/sources/${sourceId.toLowerCase()}.md`,
      content: markdownOutput(source, `# ${source.title}\n`),
    });
    outputs.push({
      path: `${base}/evidence/${evidenceId.toLowerCase()}.md`,
      content: markdownOutput(evidence, `# ${evidence.title}\n`),
    });
    evidenceByKey.set(snapshot.key, evidenceId);
  }

  const findingRefs = [];
  for (const [index, legacyFinding] of legacy.findings.entries()) {
    const evidenceKeys = Array.isArray(legacyFinding.evidence_keys)
      ? legacyFinding.evidence_keys
      : [];
    const evidenceRefs = evidenceKeys.map((key) => evidenceByKey.get(key)).filter(Boolean);
    const observed = evidenceKeys.length > 0 && evidenceRefs.length === evidenceKeys.length;
    const suffix = padded(index);
    const id = `FND-LEGACY-${safeNamespace}-${suffix}`;
    findingRefs.push(id);
    const data = {
      id,
      record_type: 'finding',
      status: 'open',
      version: '1.0.0',
      created_at: stableTime,
      updated_at: stableTime,
      title: legacyFinding.title || `Legacy finding ${suffix}`,
      finding_code: `LEGACY_OBSERVATION_${suffix}`,
      finding_kind: 'legacy_observation',
      item_state: observed ? 'observed' : 'unverifiable',
      rule_version: 'legacy-unknown',
      evidence_refs: observed ? evidenceRefs : [],
      extensions: {
        'legacy.statement': [legacyFinding.title, legacyFinding.description].filter(Boolean).join(': '),
        'legacy.severity': legacyFinding.severity ?? 'unknown',
      },
    };
    outputs.push({
      path: `evidence/legacy/${safeNamespace}/findings/${id.toLowerCase()}.md`,
      content: markdownOutput(data, `# ${data.title}\n`),
    });
  }

  const summary = {
    schema_version: 'legacy-ops-geo-import-1.0.0',
    namespace: safeNamespace,
    input_path: inputRelative,
    input_sha256: sha256(inputBytes),
    source_refs: [...evidenceByKey.values()].map((_, index) =>
      `SRC-LEGACY-${safeNamespace}-${padded(index)}`),
    evidence_refs: [...evidenceByKey.values()],
    finding_refs: findingRefs,
    legacy_score: {
      value: legacy.geo_score ?? null,
      rubric_version: 'legacy-unknown',
      comparable: false,
    },
  };
  outputs.push({
    path: `evidence/legacy/${safeNamespace}/migration-summary.json`,
    content: stableStringify(summary, 2),
  });

  for (const output of outputs) {
    try {
      await assertNoSymlinkPath(workspace, output.path);
      if ((await readFile(resolveWithin(workspace, output.path), 'utf8')) !== output.content) {
        throw new LegacyImportError('IMPORT_CONFLICT', '目标已存在且内容不同', {
          path: output.path,
        });
      }
    } catch (error) {
      if (!['PATH_NOT_FOUND', 'ENOENT'].includes(error.code)) throw error;
    }
  }

  const created = [];
  const kept = [];
  for (const output of outputs) {
    const result = await writeCreateOnly(workspace, output.path, output.content, {
      idempotent: true,
      conflictCode: 'IMPORT_CONFLICT',
    });
    (result.action === 'created' ? created : kept).push(result.path);
  }
  return { ...summary, created, kept };
}
