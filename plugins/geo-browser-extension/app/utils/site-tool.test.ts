import { describe, expect, it } from 'vitest'
import {
  getUpdateSiteSectionResult,
  getUpdatedSite,
  getUpdatedSiteSectionLabel
} from './site-tool'

describe('site-tool', () => {
  it('reads update_site_section tool result payloads', () => {
    const part = {
      type: 'tool-update_site_section',
      result: {
        success: true,
        message: 'Updated module "Shopping questions".',
        site: {
          id: 'site_1',
          slug: 'creator-desk-setup',
          previewUrl: '/sites/internal/creator-desk-setup',
          updatedSection: {
            id: 'faq',
            kind: 'faq',
            title: 'Shopping questions'
          }
        }
      }
    }

    expect(getUpdateSiteSectionResult(part)?.success).toBe(true)
    expect(getUpdatedSite(part)?.slug).toBe('creator-desk-setup')
    expect(getUpdatedSiteSectionLabel(part)).toBe('Shopping questions')
  })

  it('falls back to section kind when title is missing', () => {
    const part = {
      type: 'tool-update_site_section',
      result: {
        success: true,
        site: {
          id: 'site_2',
          slug: 'smart-home-drops',
          updatedSection: {
            id: 'cta',
            kind: 'product-cta'
          }
        }
      }
    }

    expect(getUpdatedSiteSectionLabel(part)).toBe('product-cta')
  })
})
