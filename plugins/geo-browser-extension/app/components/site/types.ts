export interface SiteProduct {
  id: string
  title: string
  description: string | null
  price: string | null
  currency: string | null
  imageUrl: string | null
  asin: string | null
  category: string | null
  platform: string | null
  productUrl: string | null
  vendor?: string | null
  productType?: string | null
  tags?: string[] | null
  position?: number | null
}

export interface SiteBrandFeature {
  title: string
  description: string
  icon?: string
}

export interface SiteTestimonial {
  quote: string
  name?: string
  detail?: string
  author?: {
    name: string
    description?: string
  }
}

export interface SiteFaqItem {
  label: string
  content: string
}

export interface SiteFaqCategory {
  label: string
  key: string
  questions: SiteFaqItem[]
}

export interface SiteArticleCard {
  title: string
  description: string
  icon?: string
  date?: string
}

export interface SiteLinkItem {
  label: string
  icon: string
  to: string
  description?: string
  external?: boolean
}

export interface SiteAction {
  label: string
  to: string
  icon?: string
  color?: 'primary' | 'neutral' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
  target?: string
  external?: boolean
}
