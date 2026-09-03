import { createMcpHandler, McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod/v4'

import { BrowserQueryError } from './errors'
import {
  acknowledgementSchema,
  artifactReadSchema,
  cycleQueryInputSchema,
  pendingListSchema,
  taskListSchema
} from './schemas'
import type { BrowserQueryService } from './service'

const id = (prefix: string) => z.string().regex(new RegExp(`^${prefix}-(?:[A-Z0-9]+-)*[A-Z0-9]+$`))
const resultSchema = z.object({
  schema_version: z.literal('geo-browser-mcp-result-v1'),
  ok: z.boolean(),
  action: z.string().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  data: z.unknown().optional()
}).strict()

function success(data: unknown, action = 'returned') {
  const structuredContent = {
    schema_version: 'geo-browser-mcp-result-v1' as const,
    ok: true,
    action,
    data
  }
  return {
    structuredContent,
    content: [{ type: 'text' as const, text: `${action}: Browser Query result ready.` }]
  }
}

function failure(error: unknown) {
  const safe = error instanceof BrowserQueryError
    ? { code: error.code, message: error.message }
    : { code: 'INTERNAL_ERROR', message: 'Browser Query operation failed' }
  const structuredContent = {
    schema_version: 'geo-browser-mcp-result-v1' as const,
    ok: false,
    ...safe
  }
  return {
    isError: true,
    structuredContent,
    content: [{ type: 'text' as const, text: `${safe.code}: ${safe.message}` }]
  }
}

export function createBrowserMcpServer(service: BrowserQueryService) {
  const server = new McpServer(
    { name: 'geo-browser', version: '1.0.0' },
    {
      instructions: '先用 register_cycle_query_input 注册 active Cycle 与 frozen Query Set；Browser Query Task 只能在扩展创建。结果按 list_pending_query_results → get_query_result → get_query_result_artifact 分块保存并校验 SHA-256 → acknowledge_query_result。Ack 只表示可靠接收，不表示 M5 物化、Review 或业务批准。不得用任何 Tool 提升平台自动化许可。'
    }
  )

  server.registerTool('register_cycle_query_input', {
    title: 'Register Cycle Query Input',
    description: 'Create-only register an active Cycle and its exact frozen Query input.',
    inputSchema: z.object({ input: cycleQueryInputSchema }).strict(),
    outputSchema: resultSchema,
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  }, async ({ input }) => {
    try {
      const value = await service.registerCycleQueryInput(input)
      return success(value, value.action)
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('get_cycle_query_input', {
    title: 'Get Cycle Query Input',
    description: 'Read registered Cycle input metadata and its frozen fingerprint.',
    inputSchema: z.object({ input_id: id('CQI') }).strict(),
    outputSchema: resultSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }, async ({ input_id }) => {
    try {
      return success(await service.getCycleQueryInput(input_id))
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('list_browser_query_tasks', {
    title: 'List Browser Query Tasks',
    description: 'List Browser-owned task summaries for one Cycle.',
    inputSchema: taskListSchema,
    outputSchema: resultSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }, async (input) => {
    try {
      return success(await service.listBrowserQueryTasks(input))
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('get_browser_query_task_summary', {
    title: 'Get Browser Query Task Summary',
    description: 'Read Query and attempt terminal states without controlling the task.',
    inputSchema: z.object({ task_id: id('BQT') }).strict(),
    outputSchema: resultSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }, async ({ task_id }) => {
    try {
      return success(await service.getTaskSummary(task_id))
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('list_pending_query_results', {
    title: 'List Pending Query Results',
    description: 'Page through pending result metadata without returning raw answer HTML.',
    inputSchema: pendingListSchema,
    outputSchema: resultSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }, async (input) => {
    try {
      return success(await service.listPendingResults(input))
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('get_query_result', {
    title: 'Get Query Result',
    description: 'Read Capture metadata, Citation occurrences, and Extraction Result.',
    inputSchema: z.object({ result_id: id('BQR') }).strict(),
    outputSchema: resultSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }, async ({ result_id }) => {
    try {
      return success(await service.getQueryResult(result_id))
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('get_query_result_artifact', {
    title: 'Read Query Result Artifact',
    description: 'Read a bounded base64 chunk of immutable raw answer HTML.',
    inputSchema: artifactReadSchema,
    outputSchema: resultSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
  }, async (input) => {
    try {
      return success(await service.getResultArtifact(input))
    } catch (error) {
      return failure(error)
    }
  })

  server.registerTool('acknowledge_query_result', {
    title: 'Acknowledge Query Result',
    description: 'Idempotently confirm that Cowork durably stored exact raw and extraction bytes.',
    inputSchema: acknowledgementSchema,
    outputSchema: resultSchema,
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false }
  }, async (input) => {
    try {
      const value = await service.acknowledgeResult(input)
      return success(value, value.action)
    } catch (error) {
      return failure(error)
    }
  })

  return server
}

export function createBrowserMcpHandler({ service }: { service: BrowserQueryService }) {
  return createMcpHandler(() => createBrowserMcpServer(service), {
    responseMode: 'json',
    legacy: 'stateless'
  })
}
