export interface BuiltRouteRequest {
  initialPath: string
  expectedTitle: string
  expectedText: string
}

export interface ChromeTarget {
  id: string
  webSocketDebuggerUrl: string
}

export interface CdpMessage {
  id?: number
  error?: { message: string }
  result?: { result?: { value?: unknown } }
}

export interface PageObservation {
  href?: string
  nuxtReady?: boolean
  textSample?: string
  textReady?: boolean
  titleReady?: boolean
}
