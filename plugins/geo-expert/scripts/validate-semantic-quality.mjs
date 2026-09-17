#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { chatJSON, loadModelEnvironment } from './lib/model-client.mjs';
await loadModelEnvironment();
const cases = [
  {
    id: 'CONTENT',
    knowledge:
      'The service supports adult US creators. Evidence is approved and current.',
    asset: 'The service supports everyone in every country.',
    expected: 'content_gap',
  },
  {
    id: 'EVIDENCE',
    knowledge:
      'An 80% income growth claim was proposed, with no source or measurement definition.',
    asset: 'No growth claim has been published.',
    expected: 'evidence_gap',
  },
  {
    id: 'ABSENCE',
    knowledge: null,
    asset: null,
    expected: 'knowledge_input_absence',
  },
  {
    id: 'PRODUCT',
    knowledge:
      'The capability inventory explicitly says bulk campaign approval is unavailable.',
    demand:
      'A dated user interview explicitly requests bulk campaign approval for 200 applications.',
    asset:
      'The official product page correctly states that approval is manual.',
    expected: 'product_gap',
  },
  {
    id: 'UNCONTROLLED',
    knowledge: 'The supported fact is creator marketing, not wholesale.',
    asset: 'An independent third-party page says wholesale.',
    control: 'uncontrolled_third_party',
    expected: 'content_gap',
    action: 'correction_request',
  },
];
const result = await chatJSON({
  system:
    'Classify each case from evidence only. Return JSON {cases:[{id,kind,action,reason}]}. kind: content_gap|evidence_gap|knowledge_input_absence|product_gap. Missing knowledge is not a content gap. A Product Gap needs explicit user demand and a verified capability limitation that content cannot solve. For uncontrolled third-party assets, action must be correction_request, never publish.',
  input: cases.map(({ expected, action, ...input }) => input),
  auditDir: 'tmp/geo-e2e/quality/model-calls',
});
const checks = cases.map((c) => {
  const r = result.output.cases?.find((r) => r.id === c.id);
  return {
    id: c.id,
    passed: r?.kind === c.expected && (!c.action || r.action === c.action),
    expected: c.expected,
    actual: r,
  };
});
await mkdir('tmp/geo-e2e/quality', { recursive: true });
await writeFile(
  'tmp/geo-e2e/quality/semantic-quality.json',
  JSON.stringify({ checks, model_call: result.audit }, null, 2),
);
console.log(
  JSON.stringify({
    passed: checks.filter((c) => c.passed).length,
    total: checks.length,
  }),
);
if (checks.some((c) => !c.passed)) process.exitCode = 1;
