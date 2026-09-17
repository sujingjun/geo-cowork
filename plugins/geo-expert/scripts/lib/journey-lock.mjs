import { mkdir, open, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
const busy = () =>
  Object.assign(
    new Error(
      'This workspace already has an active writer; resume after that operation finishes.',
    ),
    { code: 'WORKSPACE_BUSY' },
  );
export async function withJourneyLock(workspace, work) {
  await mkdir(workspace, { recursive: true });
  const file = path.join(workspace, '.geo-writer.lock');
  let handle;
  try {
    handle = await open(file, 'wx', 0o600);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
    const before = await readFile(file, 'utf8');
    let prior;
    try {
      prior = JSON.parse(before);
    } catch {
      throw busy();
    }
    if (!Number.isInteger(prior.pid) || prior.pid < 1) throw busy();
    let alive = true;
    try {
      process.kill(prior.pid, 0);
    } catch (error) {
      if (error.code === 'ESRCH') alive = false;
      else throw busy();
    }
    if (alive || (await readFile(file, 'utf8')) !== before) throw busy();
    await unlink(file);
    handle = await open(file, 'wx', 0o600).catch(() => {
      throw busy();
    });
  }
  const token = JSON.stringify({
    pid: process.pid,
    started_at: new Date().toISOString(),
  });
  await handle.writeFile(token);
  try {
    return await work();
  } finally {
    await handle.close();
    try {
      if ((await readFile(file, 'utf8')) === token) await unlink(file);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }
}
