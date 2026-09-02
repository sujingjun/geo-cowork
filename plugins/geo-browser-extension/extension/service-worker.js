import { registerServiceWorker } from './service-worker-core.js'

async function startServiceWorker() {
  try {
    await registerServiceWorker(globalThis.chrome)
  } catch (error) {
    console.error('[GEO Browser Assistant] Side Panel initialization failed', error)
  }
}

void startServiceWorker()
