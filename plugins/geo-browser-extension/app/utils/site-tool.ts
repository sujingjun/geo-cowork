export interface GeneratedSite {
  id: string
  title: string
  theme: string
  slug: string
  template: string
  status: string
  productCount?: number
  previewUrl?: string
  createdAt: string | Date
}

export interface UpdatedSection {
  id?: string
  kind?: string
  title?: string
}

export interface UpdatedSite {
  id: string
  slug: string
  previewUrl?: string
  updatedSection?: UpdatedSection
}

interface SiteToolResult<TSite> {
  success?: boolean
  message?: string
  site?: TSite | null
}

function getToolResult<TSite>(part: unknown): SiteToolResult<TSite> | null {
  if (!part || typeof part !== 'object' || !('result' in part)) {
    return null
  }

  const result = (part as Record<string, unknown>).result

  if (!result || typeof result !== 'object') {
    return null
  }

  return result as SiteToolResult<TSite>
}

export function getGenerateSiteResult(part: unknown) {
  return getToolResult<GeneratedSite>(part)
}

export function getGeneratedSite(part: unknown) {
  return getGenerateSiteResult(part)?.site || null
}

export function getUpdateSiteSectionResult(part: unknown) {
  return getToolResult<UpdatedSite>(part)
}

export function getUpdatedSite(part: unknown) {
  return getUpdateSiteSectionResult(part)?.site || null
}

export function getUpdatedSiteSectionLabel(part: unknown) {
  const section = getUpdatedSite(part)?.updatedSection

  return section?.title || section?.kind || section?.id || 'section'
}
