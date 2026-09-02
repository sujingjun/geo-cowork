import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import type { RouterConfig } from '@nuxt/schema'
import { loadNuxtConfig } from 'nuxt/kit'

import appRouterOptions from '../../app/router.options'
import { routerCases } from './router-cases'

const projectRoot = resolve(import.meta.dirname, '../..')
const require = createRequire(import.meta.url)
const nuxtKitPath = require.resolve('nuxt/kit')
const vueRouterPath = require.resolve('vue-router', { paths: [dirname(nuxtKitPath)] })
const vueRouter = await import(pathToFileURL(vueRouterPath).href)

const scannedRoutes = routerCases.map(({ route }) => ({
  path: route,
  component: {}
}))

async function loadBuildRouterOptions(extensionBuild: boolean) {
  const previousBuildMode = process.env.EXTENSION_BUILD
  if (extensionBuild) process.env.EXTENSION_BUILD = '1'
  else delete process.env.EXTENSION_BUILD

  try {
    const nuxtConfig = await loadNuxtConfig({
      cwd: projectRoot,
      dotenv: false,
      jitiOptions: { moduleCache: false }
    })
    const configOptions = nuxtConfig.router.options
    const typedAppRouterOptions = appRouterOptions as RouterConfig
    return {
      baseURL: nuxtConfig.app.baseURL,
      hashMode: typedAppRouterOptions.hashMode ?? configOptions.hashMode ?? false,
      options: { ...configOptions, ...typedAppRouterOptions }
    }
  } finally {
    if (previousBuildMode === undefined) delete process.env.EXTENSION_BUILD
    else process.env.EXTENSION_BUILD = previousBuildMode
  }
}

function installBrowser(initialUrl: string) {
  let currentUrl = new URL(initialUrl)
  const originalGlobals = new Map<string, PropertyDescriptor | undefined>()
  const location = {
    assign(value: string) {
      currentUrl = new URL(value, currentUrl)
    },
    replace(value: string) {
      currentUrl = new URL(value, currentUrl)
    }
  }

  for (const property of ['hash', 'host', 'href', 'pathname', 'protocol', 'search'] as const) {
    Object.defineProperty(location, property, {
      configurable: true,
      get: () => currentUrl[property]
    })
  }

  const browserHistory = {
    length: 1,
    scrollRestoration: 'auto',
    state: null as unknown,
    go() {},
    pushState(state: unknown, _title: string, url?: string | URL | null) {
      this.state = state
      this.length += 1
      if (url != null) currentUrl = new URL(String(url), currentUrl)
    },
    replaceState(state: unknown, _title: string, url?: string | URL | null) {
      this.state = state
      if (url != null) currentUrl = new URL(String(url), currentUrl)
    }
  }
  const document = {
    documentElement: {},
    visibilityState: 'visible',
    addEventListener() {},
    querySelector() {
      return null
    },
    removeEventListener() {}
  }
  const window = {
    document,
    history: browserHistory,
    location,
    scrollX: 0,
    scrollY: 0,
    addEventListener() {},
    removeEventListener() {}
  }

  for (const [name, value] of Object.entries({
    document,
    history: browserHistory,
    location,
    window
  })) {
    originalGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value,
      writable: true
    })
  }

  return {
    get href() {
      return currentUrl.href
    },
    restore() {
      for (const [name, descriptor] of originalGlobals) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor)
        else delete (globalThis as Record<string, unknown>)[name]
      }
    }
  }
}

export async function observeConfiguredRoute(initialUrl: string, extensionBuild: boolean): Promise<string> {
  const buildOptions = await loadBuildRouterOptions(extensionBuild)
  const browser = installBrowser(initialUrl)
  let routerHistory

  try {
    let routerBase = buildOptions.baseURL
    if (buildOptions.hashMode && !routerBase.includes('#')) routerBase += '#'
    routerHistory = buildOptions.options.history?.(routerBase)
      ?? (buildOptions.hashMode
        ? vueRouter.createWebHashHistory(routerBase)
        : vueRouter.createWebHistory(routerBase))
    const routes = await buildOptions.options.routes?.(scannedRoutes) ?? scannedRoutes
    const { hashMode: _hashMode, history: _history, routes: _routes, ...routerOptions } = buildOptions.options
    const router = vueRouter.createRouter({
      ...routerOptions,
      history: routerHistory,
      routes
    })

    await router.push(routerHistory.location)
    await router.isReady()
    return browser.href
  } finally {
    routerHistory?.destroy()
    browser.restore()
  }
}
