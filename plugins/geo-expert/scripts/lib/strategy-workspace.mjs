import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { readMarkdownObject } from './object-contract.mjs';
import { sha256, walkMarkdownFiles } from './workspace-paths.mjs';

function fail(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  throw error;
}

export async function strategyCanonicalObjects(root) {
  const result = [];
  for (const file of await walkMarkdownFiles(root, {
    ignore: (relative) => relative.startsWith('runs/') || relative.startsWith('indexes/'),
  })) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    if (!relative.startsWith('strategy/')
        && !relative.startsWith('cycles/m6/snapshots/')) continue;
    const parsed = await readMarkdownObject(file, { workspace: root });
    result.push({
      ...parsed, path: relative, file_sha256: sha256(await readFile(file)),
    });
  }
  return result;
}

export async function findStrategyCanonical(root, id, type) {
  const matches = (await strategyCanonicalObjects(root)).filter((item) => item.data.id === id);
  if (matches.length !== 1 || (type && matches[0].data.record_type !== type)) {
    fail('TRACE_INCOMPLETE', 'canonical stable ID 缺失、重复或类型错误', { id });
  }
  return matches[0];
}
