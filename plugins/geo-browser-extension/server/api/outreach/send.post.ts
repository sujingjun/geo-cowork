/**
 * POST /api/outreach/send — Send a DM to a creator.
 *
 * Placeholder for Phase 5.
 */

import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return {
    status: 'not_implemented',
    message: 'DM sending will be implemented in Phase 5',
    receivedParams: body
  }
})
