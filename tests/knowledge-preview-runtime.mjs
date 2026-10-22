import { spawn } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  realpathSync,
  renameSync,
  openSync,
  closeSync,
} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { digest } from '../workspaces/knowledge-preveiw-docs/lib/workspace.ts';
const repo = fileURLToPath(new URL('../', import.meta.url)),
  app = path.join(repo, 'workspaces/knowledge-preveiw-docs');
mkdirSync(path.join(repo, 'tmp/knowledge-preview'), { recursive: true });
const root = realpathSync(
  mkdtempSync(path.join(os.tmpdir(), 'reader-runtime-')),
);
const a = path.join(root, 'alpha'),
  b = path.join(root, 'beta');
const put = (dir, file, text) => {
  const p = path.join(dir, file);
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, text);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const checks = [];
let server, browser, page;
const frozenText =
  'FROZEN BETA TEXT\n<script>window.__snapshotExecuted=true</script>';
function launch(args, env = {}) {
  const log = openSync(
    path.join(repo, 'tmp/knowledge-preview/runtime-server.log'),
    'a',
  );
  const child = spawn(process.execPath, args, {
    cwd: app,
    detached: true,
    stdio: ['ignore', log, log],
    env: { ...process.env, ...env },
  });
  closeSync(log);
  return child;
}
async function stop() {
  if (!server) return;
  const child = server;
  server = null;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {}
  await Promise.race([new Promise((r) => child.once('exit', r)), sleep(4000)]);
}
async function poll(fn, description, timeout = 90000) {
  const end = Date.now() + timeout;
  let last;
  while (Date.now() < end) {
    try {
      if (await fn()) return;
    } catch (e) {
      last = e;
    }
    await sleep(500);
  }
  throw new Error('Timeout ' + description + ' ' + (last?.message || ''));
}
async function ready(base) {
  await poll(async () => {
    const r = await fetch(
      base + '/api/knowledge/file?path=knowledge%2FREADME.md',
      { signal: AbortSignal.timeout(2000) },
    );
    return r.status === 200;
  }, 'server ready');
}
async function launchDev(dir) {
  server = launch([
    '--experimental-strip-types',
    path.join(app, 'scripts/knowledge.mjs'),
    'dev',
    '--workspace',
    dir,
    '--port',
    '3117',
  ]);
  await ready('http://127.0.0.1:3117');
}
const base = 'http://127.0.0.1:3117';
try {
  put(
    a,
    'workspace.json',
    JSON.stringify({ workspace_id: 'test_alpha', brand: 'Alpha' }),
  );
  put(a, 'knowledge/README.md', '# Alpha Home\n\n[Name](02-identity/name.md)');
  const en =
    '---\nid: KB-ALPHA\nrecord_type: knowledge_entry\nstatus: draft\nversion: "1.0"\n---\n# Alpha Name\n\nInitial Alpha fact. [Text](../../evidence/snapshots/source.txt)';
  put(a, 'knowledge/02-identity/name.md', en);
  put(
    a,
    'knowledge/translations/zh-CN/02-identity/name.md',
    `# Alpha 中文\n\n- Knowledge ID: KB-ALPHA\n- Source file: 02-identity/name.md\n- Source version: 1.0\n- Source SHA-256: ${digest(en)}\n- Translation status: synchronized\n\n初始内容。`,
  );
  put(a, 'evidence/snapshots/source.txt', 'ORIGINAL SNAPSHOT');
  await launchDev(a);
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  await page.goto(base + '/zh-CN/02-identity/name', {
    waitUntil: 'networkidle',
  });
  assert.equal(
    await page.getByText('中文对照需要重新核对', { exact: true }).count(),
    0,
  );
  put(a, 'knowledge/02-identity/name.md', en + '\n\nChanged Alpha fact.');
  await poll(
    () => page.getByText('中文对照需要重新核对', { exact: true }).isVisible(),
    'automatic stale translation refresh',
  );
  checks.push('automatic source edit and counterpart stale refresh');
  console.log('PASS', checks.at(-1));
  // 等待当前刷新完成，再通过页面入口切换语言，避免测试导航与 Vite 重连争抢。
  await page.waitForLoadState('networkidle');
  await page
    .getByRole('link', { name: 'English primary', exact: true })
    .click();
  await page.waitForURL('**/en/02-identity/name');
  await page.waitForLoadState('networkidle');
  put(
    a,
    'knowledge/02-identity/added.md',
    '# Added Document\n\nUnique AddedPhrase.',
  );
  await poll(async () => {
    const r = await fetch(base + '/en/02-identity/added', {
      signal: AbortSignal.timeout(3000),
    });
    return r.ok && (await r.text()).includes('Unique AddedPhrase');
  }, 'new document');
  await poll(
    () => page.locator('a[href="/en/02-identity/added"]').first().isVisible(),
    'automatic navigation addition',
  );
  await page.locator('a[href="/en/02-identity/added"]').first().click();
  await page.waitForURL('**/en/02-identity/added');
  await page.waitForFunction(
    () => document.querySelector('h1')?.textContent === 'Added Document',
  );
  await page.waitForLoadState('networkidle');
  assert.match(await page.locator('main').innerText(), /Unique AddedPhrase/);
  await page
    .getByRole('button', { name: /Search/ })
    .first()
    .click();
  await page
    .getByRole('dialog')
    .getByRole('textbox')
    .fill('Unique AddedPhrase');
  await page
    .getByRole('option')
    .filter({ hasText: 'Added Document' })
    .first()
    .waitFor({ timeout: 20000 });
  await page.keyboard.press('Escape');
  checks.push('new page, navigation, and full-text search');
  console.log('PASS', checks.at(-1));
  rmSync(path.join(a, 'knowledge/02-identity/added.md'));
  await poll(async () => {
    const r = await fetch(base + '/en/02-identity/added', {
      signal: AbortSignal.timeout(3000),
    });
    return r.status === 404;
  }, 'removed route');
  await poll(
    () => page.getByRole('link', { name: /Back to knowledge/ }).isVisible(),
    'automatic removed-page error',
  );
  await page.getByRole('link', { name: /Back to knowledge/ }).click();
  await page.waitForURL('**/en');
  await page.waitForLoadState('networkidle');
  await page
    .getByRole('button', { name: /Search/ })
    .first()
    .click();
  await page
    .getByRole('dialog')
    .getByRole('textbox')
    .fill('Unique AddedPhrase');
  await sleep(600);
  assert.equal(
    await page
      .getByRole('option')
      .filter({ hasText: 'Added Document' })
      .count(),
    0,
  );
  await page.keyboard.press('Escape');
  checks.push('deletion removes route and search result');
  console.log('PASS', checks.at(-1));
  await page.goto(base + '/files/evidence/snapshots/source.txt', {
    waitUntil: 'networkidle',
  });
  put(a, 'evidence/snapshots/source.txt', 'UPDATED SNAPSHOT');
  await poll(
    async () =>
      (await page.getByTestId('file-content').innerText()) ===
      'UPDATED SNAPSHOT',
    'automatic attachment refresh',
  );
  checks.push('automatic referenced attachment refresh');
  console.log('PASS', checks.at(-1));
  await stop();
  put(
    b,
    'workspace.json',
    JSON.stringify({ workspace_id: 'test_beta', brand: 'Beta' }),
  );
  put(
    b,
    'knowledge/README.md',
    '# Beta Home\n\n[Snapshot](../evidence/snapshots/frozen.txt)',
  );
  put(b, 'evidence/snapshots/frozen.txt', frozenText);
  await launchDev(b);
  await page.goto(base + '/en', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').innerText(), 'Beta Home');
  assert.equal((await fetch(base + '/en/02-identity/name')).status, 404);
  assert.equal(
    (
      await fetch(
        base + '/api/knowledge/file?path=evidence%2Fsnapshots%2Fsource.txt',
      )
    ).status,
    404,
  );
  checks.push('workspace switch has no Alpha pages or files');
  console.log('PASS', checks.at(-1));
  await stop();
  const build = launch([
    '--experimental-strip-types',
    path.join(app, 'scripts/knowledge.mjs'),
    'build',
    '--workspace',
    b,
  ]);
  const code = await new Promise((r) => build.once('exit', r));
  assert.equal(code, 0, 'fixture build');
  renameSync(b, b + '-removed');
  server = launch([path.join(app, '.output/server/index.mjs')], {
    NITRO_HOST: '127.0.0.1',
    NITRO_PORT: '3117',
  });
  await ready(base);
  await page.goto(base + '/en', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').innerText(), 'Beta Home');
  await page.locator('a[href="/files/evidence/snapshots/frozen.txt"]').click();
  assert.equal(await page.getByTestId('file-content').innerText(), frozenText);
  assert.equal(await page.evaluate(() => window.__snapshotExecuted), undefined);
  checks.push('production snapshot renders with original workspace removed');
  console.log('PASS', checks.at(-1));
  writeFileSync(
    path.join(repo, 'tmp/knowledge-preview/runtime-result.json'),
    JSON.stringify({ ok: true, checks }, null, 2),
  );
  console.log(JSON.stringify({ ok: true, checks }));
} catch (e) {
  console.error(e.stack);
  if (page)
    await page
      .screenshot({
        path: path.join(repo, 'tmp/knowledge-preview/runtime-failure.png'),
        fullPage: true,
      })
      .catch(() => {});
  process.exitCode = 1;
} finally {
  await stop();
  await browser?.close();
  rmSync(root, { recursive: true, force: true });
}
