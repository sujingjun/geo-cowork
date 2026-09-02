import { describe, expect, it } from 'vitest'
import type { SiteBuilderSection } from '#shared/utils'
import {
  getSectionActions,
  getSectionBadges,
  getSectionCategories,
  getSectionLinks,
  getSectionText
} from './content'

describe('site section content helpers', () => {
  const section: SiteBuilderSection = {
    id: 'contact',
    kind: 'contact',
    title: 'Need help choosing?',
    components: ['UPageSection', 'UPageCTA', 'UPageLinks', 'UButton'],
    content: {
      ctaTitle: 'Talk to a specialist',
      ctaDescription: 'We can narrow the catalog for your exact setup.',
      badges: ['Concierge', 'Fast reply'],
      actions: [
        {
          label: 'Book a consult',
          to: '/contact',
          icon: 'i-lucide-message-circle',
          color: 'primary',
          variant: 'solid'
        },
        {
          label: 'Email support',
          to: 'mailto:hello@example.com',
          color: 'neutral',
          variant: 'outline'
        }
      ]
    }
  }

  it('prefers configured text over fallback copy', () => {
    expect(getSectionText(section, 'ctaTitle', 'Fallback title')).toBe('Talk to a specialist')
    expect(getSectionText(section, 'ctaDescription', 'Fallback description')).toBe('We can narrow the catalog for your exact setup.')
  })

  it('returns configured badges and actions', () => {
    expect(getSectionBadges(section, ['Default'])).toEqual(['Concierge', 'Fast reply'])
    expect(getSectionActions(section, [{ label: 'Fallback', to: '#collection' }])).toEqual([
      {
        label: 'Book a consult',
        to: '/contact',
        icon: 'i-lucide-message-circle',
        color: 'primary',
        variant: 'solid'
      },
      {
        label: 'Email support',
        to: 'mailto:hello@example.com',
        color: 'neutral',
        variant: 'outline'
      }
    ])
  })

  it('returns configured categories and links', () => {
    const discoverSection: SiteBuilderSection = {
      id: 'discover',
      kind: 'social-links',
      title: 'Discover more',
      components: ['UPageSection', 'UPageGrid', 'UPageCard'],
      content: {
        categories: ['Desk Setup', 'Audio', 'Lighting'],
        links: [
          {
            label: 'YouTube walkthrough',
            description: 'See the full setup in action.',
            icon: 'i-simple-icons-youtube',
            to: 'https://www.youtube.com/watch?v=123',
            external: true
          }
        ]
      }
    }

    expect(getSectionCategories(discoverSection, ['Fallback'])).toEqual(['Desk Setup', 'Audio', 'Lighting'])
    expect(getSectionLinks(discoverSection, [{ label: 'Fallback', icon: 'i-lucide-link', to: '#' }])).toEqual([
      {
        label: 'YouTube walkthrough',
        description: 'See the full setup in action.',
        icon: 'i-simple-icons-youtube',
        to: 'https://www.youtube.com/watch?v=123',
        external: true
      }
    ])
  })

  it('drops invalid action color and variant values', () => {
    const unsafeSection: SiteBuilderSection = {
      id: 'hero',
      kind: 'commerce-hero',
      title: 'Hero',
      components: ['UButton'],
      content: {
        actions: [
          {
            label: 'Browse',
            to: '#collection',
            color: 'brand',
            variant: 'loud'
          }
        ]
      }
    }

    expect(getSectionActions(unsafeSection, [{ label: 'Fallback', to: '#collection' }])).toEqual([
      {
        label: 'Browse',
        to: '#collection'
      }
    ])
  })
})
