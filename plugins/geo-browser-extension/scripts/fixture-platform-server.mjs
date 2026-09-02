import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve } from 'node:path'

const fixturePath = resolve(import.meta.dirname, '../tests/fixtures/generative-platform.html')
const html = await readFile(fixturePath)

createServer((request, response) => {
  if (!['/', '/task', '/result'].includes(new URL(request.url, 'http://127.0.0.1').pathname)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': html.length,
    'Cache-Control': 'no-store'
  })
  response.end(html)
}).listen(9321, '127.0.0.1', () => {
  console.warn('[fixture-platform] http://127.0.0.1:9321/task')
})
