import type { SiteBuilderSection } from '#shared/utils'
import type { SiteAction, SiteLinkItem } from './types'

const actionColors = new Set<NonNullable<SiteAction['color']>>([
  'primary',
  'neutral',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
])
const actionVariants = new Set<NonNullable<SiteAction['variant']>>([
  'solid',
  'outline',
  'soft',
  'subtle',
  'ghost',
  'link'
])

function getContentValue(section: SiteBuilderSection, key: string) {
  return section.content?.[key]
}

function getActionColor(value: unknown) {
  return typeof value === 'string' && actionColors.has(value as NonNullable<SiteAction['color']>)
    ? value as SiteAction['color']
    : undefined
}

function getActionVariant(value: unknown) {
  return typeof value === 'string' && actionVariants.has(value as NonNullable<SiteAction['variant']>)
    ? value as SiteAction['variant']
    : undefined
}

export function getSectionText(section: SiteBuilderSection, key: string, fallback: string) {
  const value = getContentValue(section, key)

  return typeof value === 'string' && value.trim() ? value : fallback
}

export function getSectionBadges(section: SiteBuilderSection, fallback: string[]) {
  const value = getContentValue(section, 'badges')

  if (!Array.isArray(value)) {
    return fallback
  }

  const badges = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)

  return badges.length > 0 ? badges : fallback
}

export function getSectionCategories(section: SiteBuilderSection, fallback: string[]) {
  const value = getContentValue(section, 'categories')

  if (!Array.isArray(value)) {
    return fallback
  }

  const categories = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)

  return categories.length > 0 ? categories : fallback
}

export function getSectionLinks(section: SiteBuilderSection, fallback: SiteLinkItem[]) {
  const value = getContentValue(section, 'links')

  if (!Array.isArray(value)) {
    return fallback
  }

  const links = value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const candidate = item as Record<string, unknown>

    if (typeof candidate.label !== 'string' || typeof candidate.to !== 'string') {
      return []
    }

    return [{
      label: candidate.label,
      to: candidate.to,
      icon: typeof candidate.icon === 'string' ? candidate.icon : 'i-lucide-link',
      ...(typeof candidate.description === 'string' ? { description: candidate.description } : {}),
      ...(candidate.external === true ? { external: true } : {})
    }]
  })

  return links.length > 0 ? links : fallback
}

export function getSectionActions(section: SiteBuilderSection, fallback: SiteAction[]) {
  const value = getContentValue(section, 'actions')

  if (!Array.isArray(value)) {
    return fallback
  }

  const actions = value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const candidate = item as Record<string, unknown>

    if (typeof candidate.label !== 'string' || typeof candidate.to !== 'string') {
      return []
    }

    const color = getActionColor(candidate.color)
    const variant = getActionVariant(candidate.variant)

    return [{
      label: candidate.label,
      to: candidate.to,
      ...(typeof candidate.icon === 'string' ? { icon: candidate.icon } : {}),
      ...(color ? { color } : {}),
      ...(variant ? { variant } : {}),
      ...(typeof candidate.target === 'string' ? { target: candidate.target } : {}),
      ...(candidate.external === true ? { external: true } : {})
    }]
  })

  return actions.length > 0 ? actions : fallback
}
