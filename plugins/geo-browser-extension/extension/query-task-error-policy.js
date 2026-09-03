export function isPostSubmitFailure(error, attemptStage) {
  return ['submitted', 'unknown'].includes(error?.stage)
    || ['submitted', 'waiting_response', 'captured', 'extraction_pending'].includes(attemptStage)
}
