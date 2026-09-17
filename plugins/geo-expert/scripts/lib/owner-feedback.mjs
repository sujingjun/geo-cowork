import { readFile, readdir } from 'node:fs/promises';
import { modelHash } from './model-client.mjs';
import {
  resolveWithin,
  writeCreateOnly,
  stableStringify,
  atomicWrite,
} from './workspace-paths.mjs';
const fail = (code, message) => {
  throw Object.assign(new Error(message), { code });
};

function renderPackage(pack, checksum) {
  return `# ${pack.title}\n\n${pack.body}\n\n## 反馈\n\n请填写独立反馈文件：\n\n包：${pack.id}\n校验：${checksum}\n决定：${pack.actions.join(' / ')}\n决定人：\n时间：\n说明：\n\n本包为待审核材料，尚无批准。\n`;
}

export async function createOwnerPackage({
  workspace,
  id,
  kind,
  objects,
  title,
  body,
  actions = kind === 'adoption'
    ? ['approve', 'modify', 'reject', 'defer']
    : ['approve', 'reject', 'defer'],
  parentPackageId,
}) {
  const targets = await Promise.all(
    objects.map(async (object) => ({
      id: object.data.id,
      version: object.data.version,
      path: object.path,
      sha256: modelHash(
        await readFile(resolveWithin(workspace, object.path), 'utf8'),
      ),
    })),
  );
  const data = {
    schema_version: 'geo-owner-package-v1',
    id,
    kind,
    targets,
    actions,
    title,
    body,
    body_sha256: modelHash(body),
    ...(parentPackageId ? { parent_package_id: parentPackageId } : {}),
  };
  const content = stableStringify(data, 2);
  const packageSha = modelHash(content);
  await writeCreateOnly(workspace, `reviews/packages/${id}.json`, content, {
    idempotent: true,
  });
  await writeCreateOnly(
    workspace,
    `reviews/packages/${id}.md`,
    renderPackage(data, packageSha),
    { idempotent: true },
  );
  const feedbackFile = `reviews/feedback/${id}.md`;
  try {
    await readFile(resolveWithin(workspace, feedbackFile));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeCreateOnly(
      workspace,
      feedbackFile,
      `# 填写业务反馈；包与校验字段由工具维护\n\n包：${id}\n校验：${packageSha}\n决定：\n决定人：\n时间：\n说明：\n`,
      { idempotent: true },
    );
  }
  return {
    ...data,
    sha256: packageSha,
    file: `reviews/packages/${id}.md`,
    feedback_file: feedbackFile,
  };
}

export function parseOwnerFeedback(text) {
  const names = {
    包: 'package_id',
    校验: 'package_sha256',
    决定: 'decision',
    决定人: 'actor',
    时间: 'at',
    说明: 'reason',
    下一目标: 'next_goal',
    对象: 'target',
    修改内容: 'modified_text',
  };
  const data = {};
  let currentField;
  for (const line of text.split(/\r?\n/)) {
    if (currentField === 'modified_text') {
      data.modified_text += `\n${line}`;
      continue;
    }
    const m = line.match(/^([^：:]+)[：:]\s*(.*)$/);
    if (m && names[m[1].trim()]) {
      currentField = names[m[1].trim()];
      if (data[currentField] !== undefined)
        fail('OWNER_FEEDBACK_INVALID', 'Duplicate feedback field');
      data[currentField] = m[2].trim();
    } else if (currentField === 'modified_text')
      data.modified_text += `\n${line}`;
  }
  if (!data.at) {
    data.at = new Date().toISOString();
    data.time_source = 'received';
  }
  if (
    !data.package_id ||
    !/^[a-f0-9]{64}$/.test(data.package_sha256 ?? '') ||
    !data.actor ||
    !data.reason ||
    !Number.isFinite(Date.parse(data.at))
  )
    fail(
      'OWNER_FEEDBACK_INVALID',
      'Complete package/hash/decision/actor/time/reason fields',
    );
  return data;
}

export async function acceptOwnerFeedback({ workspace, text }) {
  const decision = parseOwnerFeedback(text);
  if (!/^[A-Za-z0-9-]+$/.test(decision.package_id))
    fail('OWNER_FEEDBACK_INVALID', 'Invalid package ID');
  const bytes = await readFile(
    resolveWithin(workspace, `reviews/packages/${decision.package_id}.json`),
    'utf8',
  );
  const pack = JSON.parse(bytes);
  if (
    modelHash(bytes) !== decision.package_sha256 ||
    !pack.actions.includes(decision.decision)
  )
    fail('OWNER_FEEDBACK_CONFLICT', 'Package hash or decision mismatch');
  if (pack.body !== undefined) {
    const readable = await readFile(
      resolveWithin(workspace, `reviews/packages/${pack.id}.md`),
      'utf8',
    );
    if (readable !== renderPackage(pack, modelHash(bytes)))
      fail(
        'OWNER_PACKAGE_EDITED',
        'The readable review package changed; submit feedback in a separate file',
      );
  }
  const relative = `reviews/decisions/${decision.package_id}.json`;
  let prior;
  try {
    prior = await readFile(resolveWithin(workspace, relative), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (prior) {
    const previous = JSON.parse(prior);
    if (previous.raw_feedback === text)
      return {
        decision: { ...decision, at: previous.at },
        package: pack,
        decision_ref: `workspace://${relative}`,
        replay: true,
      };
    if (previous.decision !== 'defer')
      fail('OWNER_FEEDBACK_CONFLICT', 'A final decision already exists');
  }
  for (const target of pack.targets)
    if (
      modelHash(
        await readFile(resolveWithin(workspace, target.path), 'utf8'),
      ) !== target.sha256
    )
      fail('OWNER_FEEDBACK_STALE', 'Reviewed object has changed');
  const receipt = stableStringify(
    {
      ...decision,
      raw_feedback: text,
      scope:
        JSON.parse(
          await readFile(resolveWithin(workspace, 'workspace.json'), 'utf8'),
        ).workspace_mode === 'development_test'
          ? 'test_only'
          : 'authorized_real',
    },
    2,
  );
  if (prior) {
    await writeCreateOnly(
      workspace,
      `reviews/decisions/history/${decision.package_id}-${modelHash(prior)}.json`,
      prior,
      { idempotent: true },
    );
    await atomicWrite(workspace, relative, receipt);
  } else
    await writeCreateOnly(workspace, relative, receipt, {
      idempotent: true,
      conflictCode: 'OWNER_FEEDBACK_CONFLICT',
    });
  return { decision, package: pack, decision_ref: `workspace://${relative}` };
}

export async function ownerInbox(workspace) {
  let names;
  try {
    names = await readdir(resolveWithin(workspace, 'reviews/packages'));
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  const result = [];
  for (const name of names.filter((n) => n.endsWith('.json'))) {
    const bytes = await readFile(
      resolveWithin(workspace, `reviews/packages/${name}`),
      'utf8',
    );
    const pack = JSON.parse(bytes);
    try {
      const decision = JSON.parse(
        await readFile(
          resolveWithin(workspace, `reviews/decisions/${name}`),
          'utf8',
        ),
      );
      if (
        decision.decision === 'defer' ||
        (decision.decision === 'reject' && pack.kind !== 'adoption')
      ) {
        result.push({
          ...pack,
          sha256: modelHash(bytes),
          file: `reviews/packages/${name.slice(0, -5)}.md`,
          feedback_decision: decision.decision,
        });
      }
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      result.push({
        ...pack,
        sha256: modelHash(bytes),
        file: `reviews/packages/${name.slice(0, -5)}.md`,
        feedback_file: `reviews/feedback/${name.slice(0, -5)}.md`,
      });
    }
  }
  return result;
}
