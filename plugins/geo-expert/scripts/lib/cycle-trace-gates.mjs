export function traceStageGateValid(objects, toStage) {
  const byType = (type) => objects.filter((object) => object.record_type === type);
  const minimum = {
    baseline_recorded: [['answer_sample', 2], ['answer_review', 2], ['answer_aggregation', 1]],
    diagnosis_ready: [['finding', 1], ['asset_proposal', 1]],
    adoption_decided: [['adoption_record', 1]],
    publication_confirmed: [['asset_publication', 1]],
    technical_retest_completed: [['run', 1]],
    answer_retest_completed: [['answer_sample', 2], ['answer_review', 2], ['answer_aggregation', 1]],
    analytics_recorded: [['analytics_observation', 1], ['business_signal', 1]],
    review_waiting_human: [['cycle_review', 1]],
    review_decided: [['cycle_review', 1]],
  }[toStage] ?? [];
  if (minimum.some(([type, count]) => byType(type).length < count)) return false;
  if (toStage === 'baseline_recorded' || toStage === 'answer_retest_completed') {
    const purpose = toStage === 'baseline_recorded' ? 'baseline' : 'post_change_retest';
    const samples = byType('answer_sample');
    return samples.every((object) => object.status === 'recorded' && object.purpose === purpose)
      && new Set(samples.map((object) => object.ordinal)).size >= 2
      && byType('answer_review').every((object) => object.status === 'reviewed')
      && byType('answer_aggregation').every((object) =>
        object.status === 'computed' && object.purpose === purpose);
  }
  if (toStage === 'diagnosis_ready') {
    return byType('finding').every((object) => ['open', 'waiting_human'].includes(object.status))
      && byType('asset_proposal').every((object) => object.status === 'draft');
  }
  if (toStage === 'adoption_decided') {
    return byType('adoption_record').every((object) => object.status === 'decided' && object.approval);
  }
  if (toStage === 'publication_confirmed') {
    return byType('asset_publication').every((object) => object.status === 'confirmed' && object.approval);
  }
  if (toStage === 'technical_retest_completed') {
    return byType('run').every((object) => object.status === 'completed');
  }
  if (toStage === 'analytics_recorded') {
    return byType('analytics_observation').every((object) => object.status === 'recorded')
      && byType('business_signal').every((object) => object.status === 'computed');
  }
  if (toStage === 'review_waiting_human') {
    return byType('cycle_review').every((object) => object.status === 'waiting_human');
  }
  if (toStage === 'review_decided') {
    return byType('cycle_review').every((object) => object.status === 'decided' && object.approval);
  }
  return true;
}
