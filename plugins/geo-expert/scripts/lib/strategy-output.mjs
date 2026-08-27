import { readFile } from 'node:fs/promises';

import { serializeMarkdownObject } from './object-contract.mjs';
import { preflightSyntheticWrite } from './m6-test-merchant.mjs';
import {
  compareUtf8,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

const ROLES = Object.freeze([
  'opportunity_analysis',
  'prd_draft',
  'human_validation_plan',
]);

export function strategyArtifactFingerprint(artifacts) {
  const manifest = artifacts.map(({ role, path, sha256: checksum, media_type: mediaType }) => ({
    role, path, sha256: checksum, media_type: mediaType,
  })).sort((left, right) => compareUtf8(left.role, right.role)
    || compareUtf8(left.path, right.path));
  return sha256(stableStringify(manifest));
}

export function validateStrategyOutput({ data, body, artifactContents = new Map() }) {
  const errors = [];
  const roles = data.artifacts?.map((item) => item.role) ?? [];
  if (roles.length !== 3 || new Set(roles).size !== 3
      || [...roles].sort(compareUtf8).join('\0') !== [...ROLES].sort(compareUtf8).join('\0')) {
    errors.push({ code: 'STRATEGY_OUTPUT_CONFLICT', field: 'artifacts.role' });
  }
  if (!body.includes('测试商户战略建议') || data.status !== 'draft') {
    errors.push({ code: 'STRATEGY_OUTPUT_CONFLICT', field: 'body' });
  }
  if (data.body_sha256 !== sha256(body)) {
    errors.push({ code: 'STRATEGY_OUTPUT_CONFLICT', field: 'body_sha256' });
  }
  if (data.artifact_manifest_fingerprint !== strategyArtifactFingerprint(data.artifacts ?? [])) {
    errors.push({ code: 'STRATEGY_OUTPUT_CONFLICT', field: 'artifact_manifest_fingerprint' });
  }
  for (const artifact of data.artifacts ?? []) {
    const content = artifactContents.get(artifact.role);
    if (!artifact.path.startsWith('outputs/') || artifact.media_type !== 'text/markdown'
        || content === undefined || sha256(content) !== artifact.sha256) {
      errors.push({ code: 'STRATEGY_OUTPUT_CONFLICT', role: artifact.role });
    }
  }
  const contract = data.validation_plan_contract;
  if (contract?.real_execution_authorized !== false || contract?.auto_approval !== false) {
    errors.push({ code: 'STRATEGY_AUTO_TRIGGER_FORBIDDEN' });
  }
  return { errors };
}

async function existingBytes(workspace, target) {
  try {
    return await readFile(resolveWithin(workspace, target));
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'PATH_NOT_FOUND') return null;
    throw error;
  }
}

export async function materializeStrategyOutput({ workspace, path, data, body, artifactContents }) {
  const checked = validateStrategyOutput({ data, body, artifactContents });
  if (checked.errors.length > 0) {
    const failure = new Error('Strategy Output 校验失败');
    failure.code = checked.errors[0].code;
    failure.diagnostics = checked.errors;
    throw failure;
  }
  const canonical = Buffer.from(serializeMarkdownObject(data, body));
  const targets = [
    { path, bytes: canonical },
    ...data.artifacts.map((artifact) => ({
      path: `runs/${data.run_ref}/${artifact.path}`,
      bytes: Buffer.from(artifactContents.get(artifact.role)),
    })),
  ];
  await preflightSyntheticWrite({
    workspace,
    data,
    body,
    manifest: data.artifacts,
  });
  for (const target of targets) {
    const existing = await existingBytes(workspace, target.path);
    if (existing && !existing.equals(target.bytes)) {
      const failure = new Error('Strategy Output create-only bytes 冲突');
      failure.code = 'STRATEGY_OUTPUT_CONFLICT';
      failure.path = target.path;
      throw failure;
    }
  }
  const results = [];
  for (const target of targets) {
    results.push(await writeCreateOnly(workspace, target.path, target.bytes, {
      idempotent: true,
      conflictCode: 'STRATEGY_OUTPUT_CONFLICT',
    }));
  }
  return { action: results.every((item) => item.action === 'kept') ? 'kept' : 'created', results };
}
