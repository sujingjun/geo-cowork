import type {
  BrowserArtifact,
  BrowserQueryTask,
  ExtractionRecord,
  PendingQueryResult,
  QueryCapture,
  StoredCycleQueryInput
} from '../../../shared/types/browser-query'

export interface BrowserQueryRepository {
  getCycleInput(id: string): Promise<StoredCycleQueryInput | null>
  getCycleInputByRequestId(requestId: string): Promise<StoredCycleQueryInput | null>
  listCycleInputs(cycleRef?: string): Promise<StoredCycleQueryInput[]>
  createCycleInput(input: StoredCycleQueryInput): Promise<'created' | 'kept'>

  getTask(id: string): Promise<BrowserQueryTask | null>
  getTaskByRequestId(requestId: string): Promise<BrowserQueryTask | null>
  listTasks(cycleRef?: string): Promise<BrowserQueryTask[]>
  createTask(task: BrowserQueryTask): Promise<'created' | 'kept'>
  saveTask(task: BrowserQueryTask, expectedRevision: number): Promise<void>

  getArtifact(id: string): Promise<BrowserArtifact | null>
  createArtifact(artifact: BrowserArtifact): Promise<'created' | 'kept'>
  getCapture(id: string): Promise<QueryCapture | null>
  findCaptureByResultUrl(platform: string, resultUrl: string): Promise<QueryCapture | null>
  createCapture(capture: QueryCapture): Promise<'created' | 'kept'>
  listExtractions(captureId: string): Promise<ExtractionRecord[]>
  getExtraction(id: string): Promise<ExtractionRecord | null>
  createExtraction(extraction: ExtractionRecord): Promise<'created' | 'kept'>

  getPendingResult(id: string): Promise<PendingQueryResult | null>
  listPendingResults(filters: {
    cycleRef?: string
    taskId?: string
  }): Promise<PendingQueryResult[]>
  createPendingResult(result: PendingQueryResult): Promise<'created' | 'kept'>
  acknowledgePendingResult(
    id: string,
    input: { receiverFingerprint: string, receivedAt: string }
  ): Promise<'acknowledged' | 'kept'>
}
