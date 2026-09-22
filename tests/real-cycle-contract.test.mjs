import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildObservationSchedule,
  observationWindowState,
  validatePublicationReceipt,
  assertRealSlot,
  selectNextGoal,
} from '../plugins/geo-expert/scripts/lib/real-cycle-contract.mjs';

test('real observation uses four consecutive elapsed-time windows and never backdates a missed week', () => {
  const schedule = buildObservationSchedule({
    cycleRef: 'CYC-REAL-001',
    publicationAt: '2026-09-20T01:00:00Z',
    technicalAt: '2026-09-20T02:00:00Z',
  });
  assert.equal(schedule.windows.length, 4);
  assert.equal(schedule.windows[0].starts_at, '2026-09-20T02:00:00.000Z');
  assert.equal(schedule.windows[3].ends_at, '2026-10-18T02:00:00.000Z');
  assert.equal(
    observationWindowState(schedule.windows[1], '2026-09-21T00:00:00Z'),
    'waiting_window',
  );
  assert.equal(
    observationWindowState(schedule.windows[0], '2026-09-21T00:00:00Z'),
    'due',
  );
  assert.equal(
    observationWindowState(schedule.windows[0], '2026-09-28T00:00:00Z'),
    'missed',
  );
  assert.throws(
    () =>
      buildObservationSchedule({
        publicationAt: '2026-09-21',
        technicalAt: '2026-09-20',
      }),
    /technical/i,
  );
});

test('publication receipt must bind a real allowed target, adopted content and distinct human attestation', () => {
  const receipt = {
    locator: 'https://www.myyshop.com/about-us',
    published_at: '2026-09-20T01:00:00Z',
    actor: 'Site Owner',
    decision_ref: 'workspace://reviews/decisions/published.json',
    adoption_ref: 'ADR-REAL-001',
    item_ids: ['definition'],
  };
  const adoption = {
    id: 'ADR-REAL-001',
    asset_ref: 'AST-REAL-001',
    status: 'decided',
    approval: { decision_ref: 'workspace://reviews/decisions/adopt.json' },
    decisions: [{ item_id: 'definition', decision: 'accepted' }],
  };
  const asset = {
    id: 'AST-REAL-001',
    locator: receipt.locator,
    control_scope: 'own',
  };
  assert.doesNotThrow(() =>
    validatePublicationReceipt(receipt, {
      adoption,
      asset,
      now: '2026-09-20T02:00:00Z',
    }),
  );
  for (const locator of [
    'https://site.invalid/about',
    'http://127.0.0.1/',
    'https://other.example/about',
  ])
    assert.throws(() =>
      validatePublicationReceipt({ ...receipt, locator }, { adoption, asset }),
    );
  assert.throws(() =>
    validatePublicationReceipt(
      { ...receipt, decision_ref: adoption.approval.decision_ref },
      { adoption, asset },
    ),
  );
  assert.throws(() =>
    validatePublicationReceipt(
      { ...receipt, item_ids: ['not-adopted'] },
      { adoption, asset },
    ),
  );
});

test('formal slots require exact frozen provenance and two independent observations', () => {
  const slot = {
    cycle_ref: 'CYC-REAL-001',
    knowledge_base_ref: 'KBASE-REAL-001',
    query_ref: 'Q-REAL-001',
    query_version: '1.0.0',
    query_set_ref: 'QS-REAL-001',
    query_set_version: '1.0.0',
    profile_ref: 'CPF-REAL-001',
    profile_version: '1.0.0',
    platform: 'chatgpt',
    ordinal: 1,
    purpose: 'baseline',
    window: {
      id: 'TW-REAL-BASE',
      starts_at: '2026-08-20T00:00:00Z',
      ends_at: '2026-08-27T00:00:00Z',
    },
  };
  const capture = {
    ...slot,
    synthetic: false,
    captured_at: '2026-08-21T00:00:00Z',
    result_url: 'https://chatgpt.com/c/one',
    outcome: 'success',
    answer_text: 'A complete answer',
    conversation_id: 'one',
  };
  assert.doesNotThrow(() => assertRealSlot(slot, capture));
  for (const patch of [
    { ordinal: 2 },
    { query_version: '2.0.0' },
    { synthetic: true },
    { captured_at: '2026-08-28T00:00:00Z' },
    { outcome: 'system_failure' },
  ])
    assert.throws(() => assertRealSlot(slot, { ...capture, ...patch }));
  assert.throws(() =>
    assertRealSlot(slot, capture, [{ ...capture, ordinal: 2 }]),
  );
  assert.doesNotThrow(() =>
    assertRealSlot(slot, {
      ...capture,
      outcome: 'refusal',
      answer_text: 'Cannot answer',
    }),
  );
  const temporary = {
    ...capture,
    result_url: 'https://chatgpt.com/?temporary-chat=true',
    collection_method: 'browser_automation',
    browser_conditions: { conversation_state: 'new' },
    conversation_id: 'aaaaaaaa-1111-2222-3333-444444444444',
  };
  assert.doesNotThrow(() =>
    assertRealSlot(slot, temporary, [
      {
        ...temporary,
        ordinal: 2,
        conversation_id: 'bbbbbbbb-1111-2222-3333-444444444444',
      },
    ]),
  );
  assert.throws(() =>
    assertRealSlot(slot, temporary, [{ ...temporary, ordinal: 2 }]),
  );
  assert.throws(() =>
    assertRealSlot(slot, { ...temporary, collection_method: 'manual' }, [
      {
        ...temporary,
        ordinal: 2,
        conversation_id: 'bbbbbbbb-1111-2222-3333-444444444444',
      },
    ]),
  );
});

test('Owner can explicitly choose among multiple next-goal candidates; no implicit choice', () => {
  const candidates = [
    { data: { id: 'GCD-A', title: 'Audience' } },
    { data: { id: 'GCD-B', title: 'Capabilities' } },
  ];
  assert.equal(selectNextGoal(candidates, 'Capabilities').data.id, 'GCD-B');
  assert.throws(() => selectNextGoal(candidates), /select/i);
  assert.throws(() => selectNextGoal(candidates, 'missing'), /select/i);
});
