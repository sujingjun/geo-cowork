import { createHash } from 'node:crypto'

function sortedKeys(value: Record<string, unknown>) {
  return Object.keys(value).sort((left, right) =>
    Buffer.from(left).compare(Buffer.from(right)))
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue)
  if (value && typeof value === 'object' && !(value instanceof Uint8Array)) {
    return Object.fromEntries(sortedKeys(value as Record<string, unknown>)
      .map(key => [key, canonicalValue((value as Record<string, unknown>)[key])]))
  }
  return value
}

export function canonicalJson(value: unknown) {
  return JSON.stringify(canonicalValue(value))
}

export function sha256(value: string | Uint8Array) {
  return createHash('sha256').update(value).digest('hex')
}

export function fingerprint(value: unknown) {
  return sha256(canonicalJson(value))
}

export function stableId(prefix: string, value: unknown) {
  return `${prefix}-${fingerprint(value).slice(0, 32).toUpperCase()}`
}
