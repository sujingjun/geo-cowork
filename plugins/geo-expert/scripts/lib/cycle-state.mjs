const STAGES = [
  'prepared', 'frozen', 'baseline_recorded', 'diagnosis_ready',
  'adoption_decided', 'publication_confirmed', 'technical_retest_completed',
  'answer_retest_completed', 'analytics_recorded', 'review_waiting_human',
  'review_decided',
];

function stateError(code, message) {
  const error = new Error(message);
  error.name = 'CycleStateError';
  error.code = code;
  return error;
}

function terminal(stage) {
  return stage === 'review_decided' || stage === 'cancelled_no_adoption';
}

export function deriveCycleSummary(goalTracks) {
  const stages = goalTracks.map((track) => track.stage);
  const unique = new Set(stages);
  const aggregate = unique.size === 1 ? stages[0] : 'mixed';
  if (stages.every((stage) => stage === 'prepared')) {
    return { status: 'proposed', aggregate_stage: aggregate, completion_scope: 'none' };
  }
  if (stages.every((stage) => stage === 'review_decided')) {
    return { status: 'completed', aggregate_stage: aggregate, completion_scope: 'full' };
  }
  if (stages.every((stage) => stage === 'cancelled_no_adoption')) {
    return { status: 'cancelled', aggregate_stage: aggregate, completion_scope: 'none' };
  }
  if (stages.every(terminal)) {
    return { status: 'completed', aggregate_stage: 'mixed', completion_scope: 'partial' };
  }
  if (stages.some((stage) => [
    'diagnosis_ready', 'adoption_decided', 'review_waiting_human',
  ].includes(stage))) {
    return { status: 'waiting_human', aggregate_stage: aggregate, completion_scope: 'none' };
  }
  return { status: 'active', aggregate_stage: aggregate, completion_scope: 'none' };
}

export function validateCycleAdvance({
  cycle,
  goalEntryKey,
  fromStage,
  toStage,
  gateGoalEntryKey = goalEntryKey,
}) {
  if (['completed', 'cancelled', 'superseded'].includes(cycle.status)) {
    throw stateError('INVALID_CYCLE_TRANSITION', 'terminal Cycle 不能继续');
  }
  const track = cycle.goal_tracks.find((item) => item.goal_entry_key === goalEntryKey);
  if (!track || track.stage !== fromStage) {
    throw stateError('CYCLE_CAS_MISMATCH', 'Goal track 当前 stage 不匹配');
  }
  if (gateGoalEntryKey !== goalEntryKey) {
    throw stateError('CYCLE_GATE_REQUIRED', '不能用其他 Goal gate 推进当前 Goal');
  }
  const fromIndex = STAGES.indexOf(fromStage);
  const toIndex = STAGES.indexOf(toStage);
  const cancel = fromStage === 'adoption_decided' && toStage === 'cancelled_no_adoption';
  if (!cancel && (fromIndex < 0 || toIndex !== fromIndex + 1)) {
    throw stateError('INVALID_CYCLE_TRANSITION', 'Cycle stage 跳步或倒退');
  }
  return { track };
}
