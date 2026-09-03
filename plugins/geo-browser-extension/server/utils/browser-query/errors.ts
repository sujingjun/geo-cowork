export class BrowserQueryError extends Error {
  code: string
  diagnostics?: Record<string, unknown>

  constructor(code: string, message: string, diagnostics?: Record<string, unknown>) {
    super(message)
    this.name = 'BrowserQueryError'
    this.code = code
    this.diagnostics = diagnostics
  }
}

export function fail(
  code: string,
  message: string,
  diagnostics?: Record<string, unknown>
): never {
  throw new BrowserQueryError(code, message, diagnostics)
}

export function safeError(error: unknown) {
  if (error instanceof BrowserQueryError) {
    return { code: error.code, message: error.message }
  }
  return { code: 'EXTRACTION_MODEL_FAILED', message: 'Extractor failed' }
}
