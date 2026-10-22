import type { Catalog } from '../../../lib/workspace'
import { catalogFile } from '../../../lib/workspace'

export default defineEventHandler(async (event) => {
  const sourcePath = getQuery(event).path
  if (typeof sourcePath !== 'string') throw createError({ statusCode: 400, statusMessage: 'A file path is required' })
  const snapshot = await useStorage('assets:knowledge').getItem<Catalog>('snapshot.json')
  if (!snapshot) throw createError({ statusCode: 503, statusMessage: 'Knowledge snapshot is unavailable' })
  try {
    const file = catalogFile(snapshot, sourcePath, import.meta.dev)
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    setHeader(event, 'Cache-Control', 'no-store')
    return file.raw
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'File not available in this knowledge reader' })
  }
})
