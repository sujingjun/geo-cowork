export type StoreStatus = 'connected' | 'disconnected' | 'expired' | 'error'
export type StoreSyncStatus = 'success' | 'failed' | 'partial' | 'never'
export type StoreAuthEventType = 'authorized' | 'reauthorized' | 'disconnected' | 'expired' | 'reconnect_failed'
export type StoreDiagnosticCode = 'AUTH_EXPIRED' | 'TOKEN_MISSING' | 'SCOPE_MISSING' | 'PLATFORM_API_ERROR' | 'CONFIG_MISSING' | 'DISCONNECTED' | 'UNKNOWN'
export type StoreDiagnosticAction = 'REAUTHORIZE' | 'CHECK_CONFIG' | 'RETRY_LATER' | 'NONE'
export type StoreDiagnosticCheckStatus = 'pass' | 'warn' | 'fail'

export interface StoreDiagnosticCheck {
  name: string
  status: StoreDiagnosticCheckStatus
  message: string
}

export interface StoreDiagnostics {
  status: StoreStatus | 'healthy'
  code?: StoreDiagnosticCode
  message: string
  action: StoreDiagnosticAction
  checks: StoreDiagnosticCheck[]
}

export interface StoreLifecycleState {
  status?: StoreStatus | null
  expiresAt?: Date | string | null
}

export interface NormalizedStoreError {
  code: StoreDiagnosticCode
  action: StoreDiagnosticAction
  message: string
  status: StoreStatus
}

export interface StoreAuthEventInput {
  storeId: string
  userId: string
  platform: 'amazon' | 'shopify'
  type: StoreAuthEventType
  message: string
  metadata?: Record<string, unknown> | null
  now?: Date
}

export function getEffectiveStoreStatus(store: StoreLifecycleState, now = new Date()): StoreStatus {
  if (store.status === 'disconnected')
    return 'disconnected'

  if (store.status === 'error')
    return 'error'

  if (store.expiresAt) {
    const expiresAt = store.expiresAt instanceof Date ? store.expiresAt : new Date(store.expiresAt)

    if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= now.getTime())
      return 'expired'
  }

  return store.status || 'connected'
}

export function buildDisconnectedStoreUpdate(now = new Date()) {
  return {
    accessToken: '',
    refreshToken: '',
    status: 'disconnected' as const,
    lastSyncStatus: 'failed' as const,
    lastSyncError: '店铺授权已断开，需要重新授权后才能同步商品。',
    lastDiagnosedAt: now,
    diagnostics: buildDiagnostics({
      status: 'disconnected',
      code: 'DISCONNECTED',
      action: 'REAUTHORIZE',
      message: '店铺授权已断开，需要重新授权后恢复同步。',
      checks: [
        {
          name: '授权连接',
          status: 'fail',
          message: '当前店铺没有可用访问令牌。'
        }
      ]
    }),
    disconnectedAt: now
  }
}

export function buildAuthExpiredStoreUpdate(message = '店铺授权已过期，请重新授权。', now = new Date()) {
  return {
    status: 'expired' as const,
    lastSyncStatus: 'failed' as const,
    lastSyncError: message,
    lastDiagnosedAt: now,
    diagnostics: buildDiagnostics({
      status: 'expired',
      code: 'AUTH_EXPIRED',
      action: 'REAUTHORIZE',
      message,
      checks: [
        {
          name: '授权有效性',
          status: 'fail',
          message: '平台返回授权失效或令牌已过期。'
        }
      ]
    })
  }
}

export function normalizeStoreError(error: unknown): NormalizedStoreError {
  const statusCode = getErrorStatusCode(error)
  const message = getErrorMessage(error) || '店铺操作失败，请稍后重试。'

  if (statusCode === 401 || statusCode === 403 || /unauthori[sz]ed|forbidden|invalid.*token|token.*expired|access.*denied/i.test(message)) {
    return {
      code: 'AUTH_EXPIRED',
      action: 'REAUTHORIZE',
      message,
      status: 'expired'
    }
  }

  if (statusCode === 429 || /rate limit|too many requests/i.test(message)) {
    return {
      code: 'PLATFORM_API_ERROR',
      action: 'RETRY_LATER',
      message,
      status: 'error'
    }
  }

  if (/missing|required|config|credential|client/i.test(message)) {
    return {
      code: 'CONFIG_MISSING',
      action: 'CHECK_CONFIG',
      message,
      status: 'error'
    }
  }

  return {
    code: 'UNKNOWN',
    action: 'RETRY_LATER',
    message,
    status: 'error'
  }
}

export function buildDiagnostics(input: {
  status: StoreDiagnostics['status']
  code?: StoreDiagnosticCode
  action?: StoreDiagnosticAction
  message: string
  checks?: StoreDiagnosticCheck[]
}): StoreDiagnostics {
  return {
    status: input.status,
    code: input.code,
    message: input.message,
    action: input.action || 'NONE',
    checks: input.checks || []
  }
}

export function buildStoreAuthEvent(input: StoreAuthEventInput) {
  return {
    storeId: input.storeId,
    userId: input.userId,
    platform: input.platform,
    type: input.type,
    message: input.message,
    metadata: input.metadata || null,
    createdAt: input.now || new Date()
  }
}

function getErrorStatusCode(error: unknown) {
  if (!error || typeof error !== 'object')
    return undefined

  const maybeError = error as {
    statusCode?: number
    status?: number
    response?: { status?: number }
    data?: { statusCode?: number, status?: number }
  }

  return maybeError.statusCode || maybeError.status || maybeError.response?.status || maybeError.data?.statusCode || maybeError.data?.status
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'string')
    return error

  if (!error || typeof error !== 'object')
    return undefined

  const maybeError = error as {
    message?: string
    statusMessage?: string
    data?: { message?: string, statusMessage?: string, error?: string }
  }

  return maybeError.data?.message || maybeError.data?.statusMessage || maybeError.data?.error || maybeError.statusMessage || maybeError.message
}
