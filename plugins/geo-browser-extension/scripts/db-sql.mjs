#!/usr/bin/env node
/* eslint-disable no-console */

import { existsSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'

const databasePath = '.data/db/pglite'

function printUsage() {
  console.log('Usage: pnpm db:sql "select * from users limit 5"')
  console.log('       echo "select now()" | pnpm db:sql')
}

async function readStdin() {
  if (process.stdin.isTTY) {
    return ''
  }

  let input = ''
  for await (const chunk of process.stdin) {
    input += chunk
  }
  return input.trim()
}

function printResult(result) {
  const rows = result.rows || []

  if (rows.length > 0) {
    console.table(rows)
    return
  } else {
    console.log('Query executed. No rows returned.')
  }

  if (typeof result.affectedRows === 'number') {
    console.log(`${result.affectedRows} row(s) affected.`)
  }
}

async function main() {
  const queryFromArgs = process.argv.slice(2).join(' ').trim()
  const query = queryFromArgs || await readStdin()

  if (!query) {
    printUsage()
    process.exit(1)
  }

  if (!existsSync(databasePath)) {
    console.error(`Local PGlite database was not found at ${databasePath}.`)
    console.error('Run pnpm dev or pnpm db:migrate first.')
    process.exit(1)
  }

  const db = new PGlite(databasePath)

  try {
    const result = await db.query(query)
    printResult(result)
  } finally {
    await db.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
