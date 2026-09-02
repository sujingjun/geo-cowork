/**
 * Blob storage module — replaces NuxtHub's hub:blob.
 * Uses local file system for uploaded file storage.
 */

import { createWriteStream, existsSync, mkdirSync, readdirSync, statSync, unlinkSync, createReadStream } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { Readable } from 'node:stream'
import { readMultipartFormData } from 'h3'
import { randomUUID } from 'node:crypto'

const BLOB_DIR = join(process.cwd(), 'server/data/uploads')
try {
  mkdirSync(BLOB_DIR, { recursive: true })
} catch {
  // may already exist
}

function getFilePath(pathname: string): string {
  const safe = pathname.replace(/\.\./g, '').replace(/^\//, '')
  return join(BLOB_DIR, safe)
}

function getContentType(filename: string): string {
  const ext = extname(filename).toLowerCase()
  const types: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.csv': 'text/csv'
  }
  return types[ext] || 'application/octet-stream'
}

interface BlobMeta {
  pathname: string
  url: string
  contentType: string
  size: number
  uploadedAt: string
}

async function handleUpload(
  event: any,
  options: {
    formKey: string
    multiple?: boolean
    ensure?: { maxSize?: number; types?: string[] }
    put?: { addRandomSuffix?: boolean; prefix?: string }
  }
): Promise<BlobMeta | BlobMeta[]> {
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw new Error('No form data received')
  }

  const files = formData.filter(field => field.name === options.formKey && field.filename)

  if (files.length === 0) {
    throw new Error(`No file found in form key: ${options.formKey}`)
  }

  const results: BlobMeta[] = []

  for (const file of files) {
    const originalName = file.filename || 'unknown'
    const prefix = options.put?.prefix || ''
    const suffix = options.put?.addRandomSuffix ? `-${randomUUID().slice(0, 8)}` : ''
    const ext = extname(originalName)
    const baseName = originalName.replace(ext, '')
    const pathname = prefix ? `${prefix}/${baseName}${suffix}${ext}` : `${baseName}${suffix}${ext}`

    const filePath = getFilePath(pathname)
    mkdirSync(dirname(filePath), { recursive: true })

    const stream = createWriteStream(filePath)
    await new Promise<void>((resolve, reject) => {
      stream.on('error', reject)
      stream.on('finish', resolve)
      stream.end(file.data)
    })

    const stat = statSync(filePath)
    results.push({
      pathname,
      url: `/api/uploads/${pathname}`,
      contentType: file.type || getContentType(originalName),
      size: stat.size,
      uploadedAt: new Date().toISOString()
    })
  }

  return options.multiple ? results : results[0]!
}

async function list(options: { prefix?: string } = {}): Promise<{ blobs: BlobMeta[] }> {
  const blobs: BlobMeta[] = []

  function walkDir(dir: string, prefix: string) {
    if (!existsSync(dir)) return
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        walkDir(fullPath, relativePath)
      } else {
        if (options.prefix && !relativePath.startsWith(options.prefix)) continue
        const stat = statSync(fullPath)
        blobs.push({
          pathname: relativePath,
          url: `/api/uploads/${relativePath}`,
          contentType: getContentType(entry.name),
          size: stat.size,
          uploadedAt: stat.mtime.toISOString()
        })
      }
    }
  }

  walkDir(BLOB_DIR, '')
  return { blobs }
}

async function del(pathname: string): Promise<void> {
  const filePath = getFilePath(pathname)
  if (existsSync(filePath)) {
    unlinkSync(filePath)
  }
}

async function head(pathname: string): Promise<BlobMeta | null> {
  const filePath = getFilePath(pathname)
  if (!existsSync(filePath)) return null
  const stat = statSync(filePath)
  return {
    pathname,
    url: `/api/uploads/${pathname}`,
    contentType: getContentType(pathname),
    size: stat.size,
    uploadedAt: stat.mtime.toISOString()
  }
}

async function serve(_event: any, pathname: string): Promise<Readable | null> {
  const filePath = getFilePath(pathname)
  if (!existsSync(filePath)) return null
  return createReadStream(filePath)
}

export const blob = { handleUpload, list, del, head, serve }
