import type { RouterConfig } from '@nuxt/schema'

export default {
  routes: scanned => [
    { path: '/', redirect: '/workbench' },
    ...scanned.filter(route => route.path !== '/'),
    { path: '/:pathMatch(.*)*', redirect: '/workbench' }
  ]
} satisfies RouterConfig
