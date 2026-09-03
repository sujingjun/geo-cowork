import { z } from 'zod/v4'

const nonEmpty = z.string().trim().min(1)
const version = z.string().regex(/^\d+\.\d+\.\d+$/)
const sha = z.string().regex(/^[a-f0-9]{64}$/)
const timestamp = z.string().datetime({ offset: true })
const ref = (prefix: string) => z.string().regex(new RegExp(`^${prefix}-(?:[A-Z0-9]+-)*[A-Z0-9]+$`))

export const cycleQueryInputSchema = z.object({
  schema_version: z.literal('geo-cycle-query-input-v1'),
  request_id: ref('REQ'),
  cycle: z.object({
    ref: ref('CYC'),
    version,
    status: z.literal('active')
  }).strict(),
  query_set: z.object({
    ref: ref('QS'),
    version,
    content_sha256: sha
  }).strict(),
  queries: z.array(z.object({
    ref: ref('Q'),
    version,
    query_text: nonEmpty.max(4000),
    language: nonEmpty.max(80),
    ordinal: z.number().int().positive()
  }).strict()).min(1).max(100),
  platform: z.object({
    id: nonEmpty.max(80),
    entry_url: z.url(),
    execution_mode: z.enum(['dom_automation', 'manual_assist']),
    policy_status: z.enum(['allowed', 'manual_only']),
    profile_ref: ref('CPF'),
    profile_version: version,
    authorization_ref: nonEmpty.max(500),
    authorization_sha256: sha
  }).strict(),
  registered_at: timestamp
}).strict()

export const taskCreateSchema = z.object({
  schema_version: z.literal('geo-browser-query-task-create-v1'),
  request_id: ref('REQ'),
  input_id: ref('CQI'),
  input_fingerprint: sha,
  created_at: timestamp
}).strict()

export const taskRevisionSchema = z.object({
  task_id: ref('BQT'),
  expected_revision: z.number().int().nonnegative(),
  now: timestamp
}).strict()

export const attemptAdvanceSchema = taskRevisionSchema.extend({
  attempt_id: nonEmpty.max(200),
  stage: z.enum(['checking_login', 'ready', 'submitted', 'waiting_response']),
  conversation_state: z.enum(['new', 'continued', 'unknown']).optional(),
  conversation_proof: z.record(z.string(), z.unknown()).optional()
}).strict()

export const waitForHumanSchema = taskRevisionSchema.extend({
  attempt_id: nonEmpty.max(200),
  reason: z.enum(['login_required', 'challenge', 'submission_unknown', 'result_confirmation'])
}).strict()

export const continueAttemptSchema = taskRevisionSchema.extend({
  attempt_id: nonEmpty.max(200)
}).strict()

export const failAttemptSchema = taskRevisionSchema.extend({
  attempt_id: nonEmpty.max(200),
  outcome: z.enum(['system_failure', 'timeout', 'no_result', 'refused', 'cancelled', 'challenge']),
  failure_reason: nonEmpty.max(4000)
}).strict()

export const retryQuerySchema = taskRevisionSchema.extend({
  query_ref: ref('Q')
}).strict()

export const captureSubmissionSchema = z.object({
  schema_version: z.literal('geo-browser-query-capture-submission-v1'),
  task_id: ref('BQT'),
  attempt_id: nonEmpty.max(200),
  expected_revision: z.number().int().nonnegative(),
  outcome: z.enum(['success', 'refusal']),
  answer_html: z.string().min(1).max(2 * 1024 * 1024),
  answer_text: z.string().trim().min(1).max(2 * 1024 * 1024),
  citations: z.array(z.object({
    ordinal: z.number().int().positive(),
    href_raw: z.url(),
    href_normalized: z.url(),
    title: z.string().max(1000),
    anchor_or_context: z.string().max(4000)
  }).strict()).max(1000),
  result_url: z.url(),
  detector_diagnostics: z.record(z.string(), z.unknown()),
  captured_at: timestamp
}).strict()

export const extractionOutputSchema = z.object({
  answer: z.object({
    text: z.string(),
    html_structure_summary: z.string(),
    refusal: z.boolean(),
    completeness: z.enum(['complete', 'partial', 'unknown'])
  }).strict(),
  citations: z.array(z.object({
    occurrence_ordinal: z.number().int().positive(),
    url: z.url(),
    title: z.string(),
    context: z.string()
  }).strict()),
  platform_annotations: z.array(z.string()),
  warnings: z.array(z.string())
}).strict()

export const acknowledgementSchema = z.object({
  result_id: ref('BQR'),
  capture_sha256: sha,
  extraction_sha256: sha,
  receiver_fingerprint: sha,
  received_at: timestamp
}).strict()

export const pendingListSchema = z.object({
  cycle_ref: ref('CYC').optional(),
  task_id: ref('BQT').optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50)
}).strict()

export const taskListSchema = z.object({
  cycle_ref: ref('CYC').optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50)
}).strict()

export const artifactReadSchema = z.object({
  result_id: ref('BQR'),
  artifact_id: nonEmpty.max(160),
  offset: z.number().int().nonnegative(),
  max_bytes: z.number().int().min(1).max(262_144)
}).strict()

export type CycleQueryInputParsed = z.infer<typeof cycleQueryInputSchema>
export type TaskCreateParsed = z.infer<typeof taskCreateSchema>
export type CaptureSubmissionParsed = z.infer<typeof captureSubmissionSchema>
