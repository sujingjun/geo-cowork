/**
 * Database module — replaces NuxtHub's `hub:db`.
 *
 * Uses @libsql/client + drizzle-orm to connect to a local SQLite file.
 * Exports `db` and `schema` — matching the hub:db interface.
 */

import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import * as schema from '../db/schema'
import { ensureTikTokDiscoveryTables } from './tiktok-discovery-repository'

const DB_PATH = join(process.cwd(), 'server/data/local.db')
try {
  mkdirSync(dirname(DB_PATH), { recursive: true })
} catch {
  // may already exist
}

export const client = createClient({ url: `file:${DB_PATH}` })

export const db = drizzle(client, { schema })
export { schema }

export async function migrate() {
  await client.execute(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL, avatar TEXT NOT NULL, username TEXT NOT NULL, provider TEXT NOT NULL, provider_id TEXT NOT NULL)`)
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS users_provider_id_idx ON users(provider, provider_id)`)
  await client.execute(`CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, title TEXT, user_id TEXT NOT NULL, visibility TEXT NOT NULL DEFAULT 'private', created_at INTEGER NOT NULL)`)
  await client.execute(`CREATE INDEX IF NOT EXISTS chats_user_id_idx ON chats(user_id)`)
  await client.execute(`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE, role TEXT NOT NULL, parts TEXT, created_at INTEGER NOT NULL)`)
  await client.execute(`CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON messages(chat_id)`)
  await client.execute(`CREATE TABLE IF NOT EXISTS votes (chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE, message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE, is_upvoted INTEGER NOT NULL, PRIMARY KEY (chat_id, message_id))`)
  await ensureTikTokDiscoveryTables(client)
}

migrate().catch(err => console.error('[db] Migration failed:', err))
