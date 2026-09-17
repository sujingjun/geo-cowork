export type BrowserExecutionMode = 'dom_automation' | 'manual_assist'
export type BrowserPolicyStatus = 'allowed' | 'manual_only'
export type BrowserTaskStatus
  = | 'pending'
    | 'running'
    | 'waiting_human'
    | 'completed'
    | 'blocked'
    | 'failed'
    | 'cancelled'
export type BrowserQueryStatus = BrowserTaskStatus
export type BrowserAttemptStage
  = | 'pending'
    | 'opening_platform'
    | 'checking_login'
    | 'waiting_human'
    | 'ready'
    | 'submitted'
    | 'waiting_response'
    | 'captured'
    | 'extraction_pending'
    | 'result_pending'
    | 'acknowledged'
export type WaitingHumanReason
  = | 'login_required'
    | 'challenge'
    | 'submission_unknown'
    | 'result_confirmation'
export type ConversationState = 'new' | 'continued' | 'unknown'

export interface CycleQueryInputRegistration {
  schema_version: 'geo-cycle-query-input-v1'
  request_id: string
  cycle: { ref: string, version: string, status: 'active' }
  query_set: { ref: string, version: string, content_sha256: string }
  queries: Array<{
    ref: string
    version: string
    query_text: string
    language: string
    ordinal: number
  }>
  platform: {
    id: string
    entry_url: string
    execution_mode: BrowserExecutionMode
    policy_status: BrowserPolicyStatus
    profile_ref: string
    profile_version: string
    authorization_ref: string
    authorization_sha256: string
  }
  registered_at: string
}

export interface BrowserPlatformAdapter {
  id: string
  version: string
  policyStatus: BrowserPolicyStatus
  exactEntryUrls: string[]
  resultUrlOrigins?: string[]
  selectorVersion: string
  terminalDetectorVersion: string
  selectors?: {
    input: string
    submit: string
    answer: string
    citation: string
    busy?: string
    loggedIn?: string
    loggedOut?: string
    timeoutMs: number
    stableMs: number
  }
}

export type BrowserPlatformAdapterRegistry = Record<string, BrowserPlatformAdapter>

export interface StoredCycleQueryInput extends CycleQueryInputRegistration {
  input_id: string
  fingerprint: string
  adapter: BrowserPlatformAdapter
  queries: Array<CycleQueryInputRegistration['queries'][number] & {
    query_text_sha256: string
  }>
}

export interface BrowserQueryAttempt {
  attempt_id: string
  attempt_no: number
  stage: BrowserAttemptStage
  outcome?: string
  failure_reason?: string
  waiting_reason?: WaitingHumanReason
  conversation_state?: ConversationState
  conversation_proof?: Record<string, unknown>
  capture_id?: string
  extraction_id?: string
  result_id?: string
  extraction_failure?: { code: string, message: string }
  started_at: string
  submitted_at?: string
  captured_at?: string
  completed_at?: string
}

export interface BrowserTaskQuery {
  ref: string
  version: string
  query_text: string
  query_text_sha256: string
  language: string
  ordinal: number
  status: BrowserQueryStatus
  attempts: BrowserQueryAttempt[]
}

export interface BrowserQueryTask {
  schema_version: 'geo-browser-query-task-v2'
  task_id: string
  request_id: string
  input_id: string
  input_fingerprint: string
  cycle: StoredCycleQueryInput['cycle']
  query_set: StoredCycleQueryInput['query_set']
  platform: StoredCycleQueryInput['platform'] & {
    adapter_id: string
    adapter_version: string
    selector_version: string
    terminal_detector_version: string
    result_url_origins: string[]
    selectors?: BrowserPlatformAdapter['selectors']
  }
  status: BrowserTaskStatus
  revision: number
  queries: BrowserTaskQuery[]
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface BrowserArtifact {
  artifact_id: string
  media_type: string
  bytes: Uint8Array
  byte_length: number
  sha256: string
  created_at: string
}

export interface QueryCapture {
  schema_version: 'geo-browser-query-capture-v2'
  capture_id: string
  task_id: string
  attempt_id: string
  cycle: { ref: string, version: string }
  query_set: { ref: string, version: string, content_sha256: string }
  query: { ref: string, version: string, query_text_sha256: string }
  platform: string
  profile: { ref: string, version: string }
  collection_mode: BrowserExecutionMode
  conversation_state: ConversationState
  conversation_proof: Record<string, unknown>
  outcome: 'success' | 'refusal'
  result_url: string
  captured_at: string
  answer_text: string
  answer_html_artifact: {
    artifact_id: string
    media_type: 'text/html'
    byte_length: number
    sha256: string
  }
  citations: Array<{
    ordinal: number
    href_raw: string
    href_normalized: string
    title: string
    anchor_or_context: string
  }>
  selector_version: string
  terminal_detector_version: string
  detector_diagnostics: Record<string, unknown>
  capture_payload_sha256: string
}

export interface ExtractionRecord {
  schema_version: 'geo-browser-extraction-result-v1'
  extraction_id: string
  capture_id: string
  attempt_no: number
  raw_sha256: string
  status: 'completed' | 'failed'
  answer?: {
    text: string
    html_structure_summary: string
    refusal: boolean
    completeness: 'complete' | 'partial' | 'unknown'
  }
  citations?: Array<{
    occurrence_ordinal: number
    url: string
    title: string
    context: string
  }>
  platform_annotations?: string[]
  warnings?: string[]
  diagnostics?: { code: string, message: string }
  provenance: {
    provider: string
    model: string
    prompt_version: string
    prompt_sha256: string
    schema_version: string
    started_at: string
    completed_at: string
    call_id?: string
    duration_ms?: number
    response_model?: string
    usage?: Record<string, unknown> | null
  }
  output_sha256: string
}

export interface PendingQueryResult {
  schema_version: 'geo-browser-pending-result-v1'
  result_id: string
  task_id: string
  capture_id: string
  extraction_id: string
  cycle_ref: string
  query_ref: string
  outcome: string
  capture_sha256: string
  extraction_sha256: string
  raw_artifact_id: string
  raw_byte_length: number
  raw_sha256: string
  status: 'pending' | 'acknowledged'
  created_at: string
  acknowledged_at?: string
  receiver_fingerprint?: string
}

export interface BrowserExtractor {
  profile: {
    provider: string
    model: string
    promptVersion: string
    promptSha256: string
    schemaVersion: 'geo-browser-extraction-result-v1'
  }
  extract(input: {
    query: QueryCapture['query']
    outcome: QueryCapture['outcome']
    answerText: string
    safeHtmlText: string
    citations: Array<{
      occurrence_ordinal: number
      url: string
      title: string
      context: string
    }>
    rawSha256: string
  }): Promise<unknown>
}
