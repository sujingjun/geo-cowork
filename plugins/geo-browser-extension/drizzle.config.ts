import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  driver: 'pglite',
  dbCredentials: {
    url: './.data/db/pglite',
    port: 4983
  }
})
