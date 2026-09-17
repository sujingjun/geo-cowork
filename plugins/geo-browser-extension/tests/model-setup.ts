import { fileURLToPath } from 'node:url'
import { loadModelEnvironment } from '../../geo-expert/scripts/lib/model-client.mjs'

await loadModelEnvironment(fileURLToPath(new URL('../../../.env', import.meta.url)))
process.env.GEO_MODEL_AUDIT_DIR ??= fileURLToPath(new URL('../../../tmp/geo-e2e/model-calls', import.meta.url))
