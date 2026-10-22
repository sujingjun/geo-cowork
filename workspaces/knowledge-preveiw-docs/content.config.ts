import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { catalog } from './lib/build-context'

const markdownFiles = Object.values(catalog?.files || {}).filter(file => file.kind !== 'attachment').map(file => file.sourcePath.replace(/([*?{}[\]()!])/g, '\\$1'))

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      // 仅接入已安全读取的文件，避免 glob 纳入未登记来源或符号链接。
      source: catalog && markdownFiles.length
        ? {
            cwd: catalog.workspace.root,
            include: markdownFiles.length === 1 ? markdownFiles[0]! : `{${markdownFiles.join(',')}}`,
            prefix: '/'
          }
        : [],
      schema: z.object({
        sourcePath: z.string(), locale: z.string(), kind: z.string(), headingId: z.string().optional(),
        recordId: z.string(), recordType: z.string(), status: z.string(),
        version: z.string(), owner: z.string(), lastReviewed: z.string(),
        counterpartPath: z.string(), translationStatus: z.string()
      })
    })
  }
})
