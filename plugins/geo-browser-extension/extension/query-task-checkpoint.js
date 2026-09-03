const PREFIX = 'geo-browser-query-checkpoint:'
const ACTIVE_TASK_KEY = 'geo-browser-query-active-task'
const FORBIDDEN = /token|authorization|cookie|password|credential/i

function assertSafe(value, path = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSafe(item, [...path, index]))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN.test(key)) throw new Error(`checkpoint 禁止字段: ${[...path, key].join('.')}`)
    assertSafe(item, [...path, key])
  }
}

export class BrowserTaskCheckpointStore {
  constructor(storage = globalThis.chrome?.storage?.local) {
    if (!storage) throw new Error('chrome.storage.local 不可用')
    this.storage = storage
  }

  key(taskId) {
    return `${PREFIX}${taskId}`
  }

  async load(taskId) {
    const key = this.key(taskId)
    const result = await this.storage.get(key)
    return result[key] || null
  }

  async save(taskId, checkpoint) {
    assertSafe(checkpoint)
    if (checkpoint.task_id !== taskId) throw new Error('checkpoint task_id 不一致')
    await this.storage.set({ [this.key(taskId)]: structuredClone(checkpoint) })
    return checkpoint
  }

  async clear(taskId) {
    await this.storage.remove(this.key(taskId))
  }

  async loadActiveTask() {
    return (await this.storage.get(ACTIVE_TASK_KEY))[ACTIVE_TASK_KEY] || null
  }

  async saveActiveTask(taskId) {
    await this.storage.set({ [ACTIVE_TASK_KEY]: taskId })
  }

  async clearActiveTask() {
    await this.storage.remove(ACTIVE_TASK_KEY)
  }
}
