import type { ModuleOptions } from 'nuxt-csurf'

declare module 'nitropack/types' {
  interface NitroRouteConfig {
    csurf?: Partial<ModuleOptions> | false
  }
}

export {}
