# NuxtHub Local Database

This project uses NuxtHub Database with Drizzle ORM for local development and production migrations.

## Current Project Setup

- NuxtHub is enabled in `nuxt.config.ts` with `hub.db: 'postgresql'`.
- Local development uses PGlite, an embedded PostgreSQL database, when no remote PostgreSQL environment variables are set.
- Local data is stored under `.data/db/pglite/`.
- The `.data/db/sqlite.db` file is not the active database for the current PostgreSQL setup.
- Schema lives in `server/db/schema.ts`.
- Generated migrations live in `server/db/migrations/postgresql/`.

NuxtHub documentation notes that local databases can be viewed and edited from Nuxt DevTools with Drizzle Studio, and that SQLite is not currently supported by Drizzle Studio. Because this project uses PostgreSQL/PGlite locally, DevTools Database is the preferred UI path.

Official references:

- https://hub.nuxt.com/docs/database#local-development
- https://hub.nuxt.com/docs/database/cli

## View And Edit With Nuxt DevTools

1. Start the dev server:

```bash
pnpm dev
```

2. Open the app in the browser:

```text
http://localhost:3000
```

3. Open Nuxt DevTools from the floating DevTools button or with the keyboard shortcut shown by Nuxt.
4. Open the Database panel.
5. Browse tables and edit rows through Drizzle Studio.

Use this path for manual inspection and quick row edits during local development.

## View And Edit With CLI

The project provides local PGlite helper scripts so common queries exit cleanly without opening a long-running Nuxt process.

List local tables:

```bash
pnpm db:tables
```

Run a read query:

```bash
pnpm db:sql "select id, email, name, provider, created_at from users order by created_at desc limit 20"
```

Run an edit query:

```bash
pnpm db:sql "update stores set store_name = 'David Amazon Store' where store_id = 'mock-store-001'"
```

Useful local inspection queries:

```bash
pnpm db:sql "select id, user_id, title, visibility, created_at from chats order by created_at desc limit 20"
pnpm db:sql "select id, user_id, store_name, store_id, marketplace_id, created_at from stores order by created_at desc"
pnpm db:sql "select id, chat_id, role, created_at from messages order by created_at desc limit 20"
```

The official NuxtHub command is also available and is useful when you want NuxtHub to resolve the active database from environment variables:

```bash
pnpm exec nuxt db sql "select now()"
```

## Schema And Migrations

When changing the database shape:

1. Edit `server/db/schema.ts`.
2. Generate a migration:

```bash
pnpm db:generate
```

3. Apply it locally:

```bash
pnpm db:migrate
```

Running `pnpm dev` also applies pending NuxtHub migrations during development.

Do not hand-write migration files unless NuxtHub/Drizzle requires a custom SQL migration. Prefer `pnpm db:generate` so the migration snapshot stays consistent with the schema.

## Reset And Safety Notes

- `nuxt db drop` and `nuxt db drop-all` are destructive. Use them only after backing up local data.
- For local-only experiments, back up `.data/db/pglite/` before manual edits.
- If a query modifies data, prefer adding a narrow `where` clause and first running a matching `select` query.
- If the project is intentionally switched to SQLite later, update `hub.db` to `sqlite`, install/use the SQLite driver, and expect Drizzle Studio in Nuxt DevTools to be unavailable until SQLite support lands upstream.
