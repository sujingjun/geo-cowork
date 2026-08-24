import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  checkMarkdownLinks,
} from '../plugins/geo-expert/scripts/check-doc-links.mjs';

test('Markdown 链接检查忽略外链/代码块并报告仓库内缺失目标', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-doc-links-'));
  try {
    await mkdir(path.join(root, 'docs'), { recursive: true });
    await writeFile(path.join(root, 'README.md'), [
      '[有效](docs/target.md)',
      '[外链](https://example.invalid/)',
      '`[行内代码](docs/not-real.md)`',
      '```markdown',
      '[代码块](docs/not-real-either.md)',
      '```',
    ].join('\n'));
    await writeFile(path.join(root, 'docs/target.md'), '# Target\n');
    const valid = await checkMarkdownLinks({ root, entries: ['README.md', 'docs'] });
    assert.deepEqual(valid.errors, []);

    await writeFile(path.join(root, 'docs/broken.md'), '[缺失](missing.md#section)\n');
    const broken = await checkMarkdownLinks({ root, entries: ['docs'] });
    assert.deepEqual(broken.errors, [{
      file: 'docs/broken.md',
      line: 1,
      target: 'missing.md#section',
      code: 'LINK_TARGET_MISSING',
    }]);
  } finally {
    await rm(root, { recursive: true });
  }
});

