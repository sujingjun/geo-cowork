import { isIP } from 'node:net';

export const REAL_PLATFORMS = Object.freeze({
  chatgpt: 'https://chatgpt.com/',
  gemini: 'https://gemini.google.com/app',
  perplexity: 'https://www.perplexity.ai/',
  google_ai: 'https://www.google.com/',
  claude: 'https://claude.ai/',
});
export function realError(code, message) {
  return Object.assign(new Error(message), { code });
}
export function requireReal(condition, code, message) {
  if (!condition) throw realError(code, message);
}
export function realPublicUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw realError('PUBLICATION_TARGET_INVALID', 'Invalid public URL');
  }
  requireReal(
    url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      !isIP(url.hostname.replace(/[\[\]]/g, '')) &&
      url.hostname.includes('.') &&
      !/\.(invalid|localhost|local|internal|test)$/.test(url.hostname),
    'PUBLICATION_TARGET_INVALID',
    'Expected a public HTTPS hostname',
  );
  return url;
}
export function buildObservationSchedule({
  cycleRef,
  publicationAt,
  technicalAt,
}) {
  const start = Date.parse(technicalAt),
    published = Date.parse(publicationAt);
  requireReal(
    Number.isFinite(start) && Number.isFinite(published) && start >= published,
    'OBSERVATION_ANCHOR_INVALID',
    'Technical retest must follow publication',
  );
  return {
    schema_version: 'geo-real-observation-schedule-v1',
    cycle_ref: cycleRef,
    publication_at: new Date(published).toISOString(),
    technical_retest_at: new Date(start).toISOString(),
    windows: Array.from({ length: 4 }, (_, i) => ({
      id: `W${i + 1}`,
      ordinal: i + 1,
      starts_at: new Date(start + i * 7 * 86400000).toISOString(),
      ends_at: new Date(start + (i + 1) * 7 * 86400000).toISOString(),
    })),
  };
}
export function observationWindowState(window, now = new Date()) {
  const time = new Date(now).getTime(),
    start = Date.parse(window.starts_at),
    end = Date.parse(window.ends_at);
  requireReal(
    Number.isFinite(time) && Number.isFinite(start) && end > start,
    'OBSERVATION_WINDOW_INVALID',
    'Invalid observation window',
  );
  return time < start ? 'waiting_window' : time >= end ? 'missed' : 'due';
}
export function validatePublicationReceipt(
  receipt,
  { adoption, asset, now = new Date(), requireAttestation = true },
) {
  realPublicUrl(receipt.locator);
  requireReal(
    receipt.locator === asset?.locator &&
      ['own', 'official_external'].includes(asset.control_scope) &&
      adoption?.asset_ref === asset.id &&
      receipt.adoption_ref === adoption.id &&
      adoption.status === 'decided' &&
      adoption.approval,
    'PUBLICATION_TARGET_INVALID',
    'Receipt must identify the adopted controlled asset',
  );
  const published = Date.parse(receipt.published_at);
  requireReal(
    Number.isFinite(published) &&
      published <= new Date(now).getTime() &&
      typeof receipt.actor === 'string' &&
      receipt.actor.trim() &&
      (!requireAttestation ||
        (/^workspace:\/\/reviews\/decisions\/[A-Za-z0-9.-]+\.json$/.test(
          receipt.decision_ref ?? '',
        ) &&
          receipt.decision_ref !== adoption.approval.decision_ref)),
    'PUBLICATION_ATTESTATION_REQUIRED',
    'A distinct human post-publication attestation is required',
  );
  const allowed = new Set(
    adoption.decisions
      .filter((d) => ['accepted', 'modified'].includes(d.decision))
      .map((d) => d.item_id),
  );
  requireReal(
    receipt.item_ids?.length &&
      new Set(receipt.item_ids).size === receipt.item_ids.length &&
      receipt.item_ids.every((id) => allowed.has(id)),
    'PUBLICATION_ADOPTION_MISMATCH',
    'Only adopted items may be confirmed',
  );
  return true;
}
export function assertRealSlot(slot, capture, prior = []) {
  const fields = [
    'cycle_ref',
    'knowledge_base_ref',
    'query_ref',
    'query_version',
    'query_set_ref',
    'query_set_version',
    'profile_ref',
    'profile_version',
    'platform',
    'ordinal',
    'purpose',
  ];
  requireReal(
    fields.every((k) => slot[k] != null && slot[k] === capture[k]) &&
      [1, 2].includes(slot.ordinal) &&
      REAL_PLATFORMS[slot.platform] &&
      capture.synthetic === false,
    'FORMAL_SLOT_MISMATCH',
    'Capture must match the complete frozen slot',
  );
  requireReal(
    capture.window?.id === slot.window.id &&
      Number.isFinite(Date.parse(capture.captured_at)) &&
      observationWindowState(slot.window, capture.captured_at) === 'due' &&
      Date.parse(capture.captured_at) <= Date.now(),
    'OBSERVATION_WINDOW_INVALID',
    'Capture must fall inside its actual window',
  );
  requireReal(
    [
      'success',
      'refusal',
      'timeout',
      'no_result',
      'challenge',
      'cancelled',
    ].includes(capture.outcome),
    'OBSERVATION_TERMINAL_REQUIRED',
    'System failure is not a completed platform observation',
  );
  if (capture.outcome === 'success')
    requireReal(
      capture.answer_text?.trim(),
      'RAW_ANSWER_REQUIRED',
      'Success requires original answer',
    );
  requireReal(
    capture.conversation_id && capture.result_url,
    'INDEPENDENT_OBSERVATION_REQUIRED',
    'Conversation binding is required',
  );
  const origin = realPublicUrl(capture.result_url).origin;
  const allowed = [new URL(REAL_PLATFORMS[slot.platform]).origin];
  if (slot.platform === 'google_ai') allowed.push('https://share.google');
  if (slot.platform === 'gemini') allowed.push('https://share.gemini.google');
  requireReal(
    allowed.includes(origin),
    'FORMAL_SLOT_MISMATCH',
    'Wrong platform result',
  );
  const independentTemporaryEntry = (priorCapture) => {
    const url = new URL(capture.result_url);
    const uuid =
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    return (
      capture.platform === 'chatgpt' &&
      url.pathname === '/' &&
      url.searchParams.get('temporary-chat') === 'true' &&
      [priorCapture, capture].every(
        (p) =>
          p.collection_method === 'browser_automation' &&
          p.browser_conditions?.conversation_state === 'new' &&
          uuid.test(p.conversation_id),
      ) &&
      priorCapture.conversation_id !== capture.conversation_id
    );
  };
  requireReal(
    !prior.some(
      (p) =>
        p.platform === capture.platform &&
        p.query_ref === capture.query_ref &&
        p.window?.id === capture.window.id &&
        p.ordinal !== capture.ordinal &&
        (p.conversation_id === capture.conversation_id ||
          (p.result_url === capture.result_url &&
            !independentTemporaryEntry(p))),
    ),
    'SAMPLE_NOT_INDEPENDENT',
    'Two slots must use distinct conversations',
  );
  return true;
}
export function selectNextGoal(candidates, selection) {
  if (!selection && candidates.length === 1) return candidates[0];
  const matches = candidates.filter((c) =>
    [c.data.id, c.data.title, c.data.proposed_goal?.statement].includes(
      selection,
    ),
  );
  requireReal(
    matches.length === 1,
    'GOAL_SELECTION_REQUIRED',
    'Select one unambiguous next-goal candidate',
  );
  return matches[0];
}
