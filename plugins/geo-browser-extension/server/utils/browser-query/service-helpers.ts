import type { ZodType } from 'zod/v4'

import type {
  BrowserQueryTask,
  BrowserTaskQuery,
  BrowserQueryAttempt
} from '../../../shared/types/browser-query'
import { fail } from './errors'

const FORBIDDEN_KEYS = /^(?:cookie|cookies|password|access_token|api_key|account_email|credentials|local_storage|session_storage)$/i

export function parseContract<T>(schema: ZodType<T>, value: unknown, code: string): T {
  const result = schema.safeParse(value)
  if (!result.success) {
    fail(code, 'Input does not match Browser Query contract', {
      issues: result.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }))
    })
  }
  return result.data
}

export function scanForbiddenKeys(value: unknown, path: PropertyKey[] = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbiddenKeys(item, [...path, index]))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.test(key)) {
      fail('PRIVACY_SCOPE_VIOLATION', 'Browser Query payload contains a forbidden field', {
        field: [...path, key].join('.')
      })
    }
    scanForbiddenKeys(item, [...path, key])
  }
}

export function assertPrivateTextSafe(value: string) {
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value)
    || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i.test(value)
    || /(?:authorization|cookie|access[_-]?token)\s*[:=]/i.test(value)) {
    fail('PRIVACY_SCOPE_VIOLATION', 'Answer payload contains account or credential-shaped text')
  }
}

export function requireTask(task: BrowserQueryTask | null): BrowserQueryTask {
  if (!task) fail('BROWSER_QUERY_TASK_NOT_FOUND', 'Browser Query Task not found')
  return task
}

export function currentAttempt(task: BrowserQueryTask, attemptId: string): {
  query: BrowserTaskQuery
  attempt: BrowserQueryAttempt
} {
  for (const query of task.queries) {
    const attempt = query.attempts.find(item => item.attempt_id === attemptId)
    if (attempt) return { query, attempt }
  }
  fail('QUERY_ATTEMPT_NOT_FOUND', 'Query attempt not found')
}

export function checkedUrl(value: string, code: string) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    fail(code, 'URL protocol or credentials are not allowed')
  }
  return url
}

export function nextTaskStatus(task: BrowserQueryTask) {
  if (task.queries.every(query => ['completed', 'cancelled'].includes(query.status))) return 'completed'
  if (task.queries.some(query => query.status === 'blocked')) return 'blocked'
  if (task.queries.some(query => query.status === 'failed')) return 'failed'
  if (task.queries.some(query => query.status === 'waiting_human')) return 'waiting_human'
  if (task.queries.some(query => query.status === 'running')) return 'running'
  return 'pending'
}
