import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import { assertSamplingMatrix } from './sampling-matrix.mjs';
import { walkMarkdownFiles, resolveWithin, sha256, assertNoSymlinkPath } from './workspace-paths.mjs';

function gateError(message) {
  const error = new Error(message);
  error.name = 'CycleGateError';
  error.code = 'CYCLE_GATE_REQUIRED';
  return error;
}

async function findObject(workspace, id) {
  for (const file of await walkMarkdownFiles(workspace, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const data = matter(text).data;
    if (data.id === id) return data;
  }
  return null;
}

export async function assertStageGate(workspace, snapshotPlan, toStage) {
  const cycle = await findObject(workspace, snapshotPlan.cycle_ref);
  const counts = new Map();
  const objects = [];
  for (const entry of snapshotPlan.source_entries) {
    counts.set(entry.record_type, (counts.get(entry.record_type) ?? 0) + 1);
    objects.push(matter(await readFile(
      path.join(workspace, ...entry.object_path.split('/')),
      'utf8',
    )).data);
  }
  for (const object of objects) {
    if (object.cycle_ref && object.cycle_ref !== snapshotPlan.cycle_ref) throw gateError('跨 Cycle gate object');
    if (object.test_scope && (object.test_scope.merchant_ref !== snapshotPlan.merchant_ref || object.test_scope.knowledge_base_ref !== snapshotPlan.knowledge_base_ref)) throw gateError('跨 scope gate object');
  }
  await assertSamplingMatrix(workspace, snapshotPlan, toStage, objects);
  const required = {
    baseline_recorded: [['answer_sample', 2], ['answer_review', 2], ['answer_aggregation', 1]],
    diagnosis_ready: [['finding', 1], ['asset_proposal', 1]],
    adoption_decided: [['adoption_record', 1]],
    publication_confirmed: [['asset_publication', 1]],
    technical_retest_completed: [['run', 1]],
    answer_retest_completed: [['answer_sample', 2], ['answer_review', 2], ['answer_aggregation', 1]],
    analytics_recorded: [['analytics_observation', 1], ['business_signal', 1]],
    review_waiting_human: [['cycle_review', 1]],
    review_decided: [['cycle_review', 1]],
    cancelled_no_adoption: [['adoption_record', 1]],
  }[toStage] ?? [];
  if (required.some(([type, minimum]) => (counts.get(type) ?? 0) < minimum)) {
    throw gateError(`阶段 ${toStage} 缺 canonical gate objects`);
  }
  const byType = (type) => objects.filter((object) => object.record_type === type);
  let invalid = false;
  if (toStage === 'baseline_recorded' || toStage === 'answer_retest_completed') {
    const purpose = toStage === 'baseline_recorded' ? 'baseline' : 'post_change_retest';
    const samples = byType('answer_sample');
    invalid = samples.some((object) => object.status !== 'recorded' || object.purpose !== purpose)
      || new Set(samples.map((object) => object.ordinal)).size < 2
      || byType('answer_review').some((object) => object.status !== 'reviewed')
      || byType('answer_aggregation').some((object) =>
        object.status !== 'computed' || object.purpose !== purpose);
  } else if (toStage === 'diagnosis_ready') {
    invalid = byType('finding').some((object) => !['open', 'waiting_human'].includes(object.status))
      || byType('asset_proposal').some((object) => object.status !== 'draft');
  } else if (toStage === 'adoption_decided' || toStage === 'cancelled_no_adoption') {
    const adoptions = byType('adoption_record');
    invalid = adoptions.some((object) => object.status !== 'decided' || !object.approval)
      || toStage === 'cancelled_no_adoption'
        && adoptions.some((object) => object.decisions.some((item) => item.decision !== 'rejected'));
  } else if (toStage === 'publication_confirmed') {
    for (const object of byType('asset_publication')) {
      let locatorInvalid = true;
      try { locatorInvalid = !new URL(object.published_locator).hostname.endsWith('.invalid'); } catch {}
      if (cycle?.extensions?.['geo.journey']) {
        const proofRef = object.extensions?.['geo.publication_proof'];
        if (!proofRef?.path || !proofRef.sha256) throw gateError('Publication 缺少读回证明');
        await assertNoSymlinkPath(workspace, proofRef.path);
        const bytes = await readFile(resolveWithin(workspace, proofRef.path));
        const proof = JSON.parse(bytes);
        if (sha256(bytes) !== proofRef.sha256 || proof.logical_locator !== object.published_locator
            || proof.content_sha256 !== object.content_sha256 || proof.status !== 200 || proof.synthetic !== true) throw gateError('Publication 读回证明不匹配');
        const decisionPath = object.approval?.decision_ref?.replace(/^workspace:\/\//, '');
        if (!decisionPath || !object.approval.decision_ref.startsWith('workspace://')) throw gateError('Publication 缺少人工证明决定');
        await assertNoSymlinkPath(workspace, decisionPath);
        const decision = JSON.parse(await readFile(resolveWithin(workspace, decisionPath),'utf8'));
        if (decision.decision !== 'approve' || decision.actor !== object.approval.approved_by) throw gateError('Publication 决定不匹配');
      }
      const adoption = await findObject(workspace, object.adoption_ref);
      invalid ||= object.status !== 'confirmed' || !object.approval || locatorInvalid
        || !adoption || adoption.status !== 'decided'
        || adoption.decisions.every((item) => item.decision === 'rejected')
        || object.published_item_ids.some((id) => adoption.decisions
          .some((item) => item.item_id === id && item.decision === 'rejected'));
    }
  } else if (toStage === 'technical_retest_completed') {
    invalid = byType('run').some((object) => object.status !== 'completed')
      || byType('finding').some((object) => !['resolved', 'open'].includes(object.status));
  } else if (toStage === 'analytics_recorded') {
    invalid = byType('analytics_observation').some((object) => object.status !== 'recorded')
      || byType('business_signal').some((object) => object.status !== 'computed');
  } else if (toStage === 'review_waiting_human') {
    invalid = byType('cycle_review').some((object) => object.status !== 'waiting_human');
  } else if (toStage === 'review_decided') {
    invalid = byType('cycle_review').some((object) => object.status !== 'decided' || !object.approval);
  }
  if (invalid) throw gateError(`阶段 ${toStage} gate 语义非法`);
}
