import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Site slug is required'
    })
  }

  const site = await db.query.sites.findFirst({
    where: eq(schema.sites.slug, slug),
    columns: {
      slug: true
    }
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      message: 'Site not found'
    })
  }

  return sendRedirect(event, `/sites/internal/${site.slug}`, 302)
})
