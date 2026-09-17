import { db } from 'hub:db'

import { browserAdapterRegistry } from './adapters'
import {
  DrizzleBrowserQueryRepository,
  type BrowserQueryDatabase
} from './drizzle-repository'
import { createBrowserExtractor } from './extractor'
import { createBrowserProductFetch, secureBrowserMcpFetch } from './http'
import { createBrowserMcpHandler } from './mcp'
import { BrowserQueryService } from './service'

const repository = new DrizzleBrowserQueryRepository(db as unknown as BrowserQueryDatabase)
const service = new BrowserQueryService({
  repository,
  adapterRegistry: browserAdapterRegistry,
  extractor: createBrowserExtractor(process.env.GEO_MODEL_PROVIDER, process.env.GEO_MODEL_NAME)
})
const mcpHandler = createBrowserMcpHandler({ service })

export function getBrowserQueryService() {
  return service
}

export function browserMcpFetch(request: Request) {
  return secureBrowserMcpFetch({
    fetch: mcpHandler.fetch,
    token: process.env.GEO_BROWSER_MCP_TOKEN ?? ''
  })(request)
}

export function browserProductFetch(request: Request) {
  return createBrowserProductFetch({
    service,
    token: process.env.GEO_BROWSER_PRODUCT_TOKEN ?? ''
  })(request)
}
