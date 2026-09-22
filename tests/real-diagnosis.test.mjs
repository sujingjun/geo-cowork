import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRealDiagnosis,
  realDiagnosisInputs,
} from '../plugins/geo-expert/scripts/lib/real-diagnosis.mjs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const input = () => ({
  page_text: 'The current page says little about the service.',
  knowledge: [
    {
      id: 'CLM-ONE',
      status: 'published',
      statement: 'Provides documented services.',
      evidence_sufficiency: { status: 'sufficient', missing: [] },
      evidence_refs: ['EVD-ONE'],
    },
  ],
  evidence: [{ id: 'EVD-ONE', status: 'approved' }],
  observations: [
    {
      sample_ref: 'SMP-ONE',
      answer: 'I could not identify the documented service.',
      review_ref: 'ARV-ONE',
    },
  ],
});
const output = () => ({
  findings: [
    {
      kind: 'content_gap',
      quote: 'The current page says little about the service.',
      sample_refs: ['SMP-ONE'],
      claim_refs: ['CLM-ONE'],
      sample_quotes: [
        {
          sample_ref: 'SMP-ONE',
          quote: 'could not identify the documented service',
        },
      ],
      rationale: 'The reviewed sample missed the approved service statement.',
      next_action: 'Place the bounded statement on the page.',
      evidence_needed: [],
    },
  ],
  proposal_markdown:
    'Documented observation, supported recommendation and limitations.',
  replacement_text: 'Provides documented services.',
  limitations: ['No causal effect is established.'],
});

test('real diagnosis requires a baseline sample and quote for every cited sample', () => {
  assert.equal(validateRealDiagnosis(output(), input()).findings.length, 1);
  for (const patch of [
    { sample_refs: [] },
    { sample_refs: ['SMP-OTHER'] },
    { sample_quotes: [] },
    { sample_quotes: [{ sample_ref: 'SMP-ONE', quote: 'Fabricated phrase' }] },
    { quote: 'Text not observed' },
  ]) {
    const invalid = output();
    Object.assign(invalid.findings[0], patch);
    assert.throws(() => validateRealDiagnosis(invalid, input()), {
      code: 'DIAGNOSIS_GROUNDING_INVALID',
    });
  }
});
test('missing internal knowledge cannot be labeled a content gap', () => {
  for (const claim_refs of [[], ['CLM-UNKNOWN']]) {
    const invalid = output();
    invalid.findings[0].claim_refs = claim_refs;
    assert.throws(() => validateRealDiagnosis(invalid, input()), {
      code: 'DIAGNOSIS_GROUNDING_INVALID',
    });
  }
});
test('insufficient or stale approved evidence cannot be upgraded into a content gap', () => {
  for (const status of ['insufficient', 'unknown']) {
    const data = input();
    data.knowledge[0].evidence_sufficiency.status = status;
    assert.throws(() => validateRealDiagnosis(output(), data), {
      code: 'DIAGNOSIS_GROUNDING_INVALID',
    });
  }
  const data = input();
  data.evidence[0].status = 'stale';
  assert.throws(() => validateRealDiagnosis(output(), data), {
    code: 'DIAGNOSIS_GROUNDING_INVALID',
  });
});
test('evidence gaps preserve insufficiency and require a concrete acquisition request', () => {
  const data = input(),
    recommendation = output();
  data.knowledge[0].evidence_sufficiency = {
    status: 'insufficient',
    missing: ['Dated capability specification'],
  };
  recommendation.findings[0].kind = 'evidence_gap';
  recommendation.findings[0].evidence_needed = [
    'Owner supplies the dated capability specification and availability scope.',
  ];
  recommendation.replacement_text = '';
  assert.equal(
    validateRealDiagnosis(recommendation, data).findings[0].kind,
    'evidence_gap',
  );
  assert.throws(() => validateRealDiagnosis(recommendation, input()), {
    code: 'DIAGNOSIS_GROUNDING_INVALID',
  });
  recommendation.findings[0].evidence_needed = [];
  assert.throws(() => validateRealDiagnosis(recommendation, data), {
    code: 'DIAGNOSIS_GROUNDING_INVALID',
  });
});
test('no supported finding is valid; incomplete recommendation and product-gap invention are rejected', () => {
  assert.deepEqual(
    validateRealDiagnosis(
      { findings: [], limitations: ['No supported gap.'] },
      input(),
    ).findings,
    [],
  );
  for (const patch of [
    { proposal_markdown: '' },
    { replacement_text: '' },
    { limitations: undefined },
  ])
    assert.throws(
      () => validateRealDiagnosis({ ...output(), ...patch }, input()),
      { code: 'DIAGNOSIS_GROUNDING_INVALID' },
    );
  const invalid = output();
  invalid.findings[0].kind = 'product_gap';
  assert.throws(() => validateRealDiagnosis(invalid, input()), {
    code: 'DIAGNOSIS_GROUNDING_INVALID',
  });
});
test('diagnosis fails closed before any external call without a reviewed real baseline', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-real-diagnosis-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(
    path.join(root, 'workspace.json'),
    JSON.stringify({
      workspace_mode: 'online',
      execution_scope: 'authorized_real',
    }),
  );
  const original = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error('Network must not be called');
  };
  try {
    await assert.rejects(realDiagnosisInputs(root), {
      code: 'BASELINE_REQUIRED',
    });
  } finally {
    globalThis.fetch = original;
  }
});
