import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { loadModelEnvironment } from './model-client.mjs';
import { connectPlaywrightMcp } from './playwright-mcp-client.mjs';
import {
  prepareEngineeringCapture,
  claimEngineeringSubmission,
  recordEngineeringCapture,
  extractEngineeringCapture,
  readEngineeringCaptureRun,
  ENGINEERING_PLATFORMS,
  bindEngineeringContext,
} from './capture-run.mjs';

export const FORMAL_COLLECTION_METHODS = Object.freeze({
  chatgpt: 'browser_automation',
  gemini: 'browser_automation',
  perplexity: 'browser_automation',
  google_ai: 'manual',
  claude: 'manual',
});

const adapters = {
  chatgpt: {
    entry: 'https://chatgpt.com/?temporary-chat=true',
    input: '#prompt-textarea',
    answer: '[data-message-author-role="assistant"]',
    stop: '[data-testid="stop-button"]',
  },
  gemini: {
    entry: 'https://gemini.google.com/app',
    input: '[contenteditable="true"][role="textbox"]',
    answer: 'model-response message-content',
    stop: 'button[aria-label="停止回答"],button[aria-label="Stop response"]',
  },
  perplexity: {
    entry: 'https://www.perplexity.ai/',
    input: '#ask-input',
    answer: 'main div.prose',
    stop: 'button[aria-label^="停止响应"],button[aria-label^="Stop response"]',
  },
};
function resultJSON(result) {
  if (result.isError)
    throw Object.assign(
      new Error('MCP browser tool failed; inspect MCP call record'),
      { code: 'MCP_BROWSER_ERROR' },
    );
  const text = result.content.find((c) => c.type === 'text')?.text ?? '';
  const body = text.split('### Result\n')[1]?.split('\n### ')[0];
  if (!body) throw new Error('MCP result has no JSON body');
  return JSON.parse(body);
}
export async function collectPlaywright({
  outputDir,
  platform,
  provider,
  model,
  resume = false,
  query = 'What is MyyShop?',
  formalPlan,
  beforeSubmit,
  extract = true,
}) {
  if (
    formalPlan &&
    (formalPlan.platform !== platform ||
      formalPlan.query_text !== query ||
      formalPlan.collection_method !== FORMAL_COLLECTION_METHODS[platform] ||
      formalPlan.collection_method !== 'browser_automation')
  )
    throw Object.assign(
      new Error('Formal MCP execution differs from its frozen slot'),
      { code: 'FORMAL_SLOT_MISMATCH' },
    );
  await prepareEngineeringCapture(outputDir, query, formalPlan);
  const run = await readEngineeringCaptureRun(outputDir);
  if (!adapters[platform]) throw new Error('Unsupported engineering platform');
  const state = run.platforms[platform];
  await loadModelEnvironment();
  provider ??= process.env.GEO_MODEL_PROVIDER ?? 'deepseek';
  if (state.status === 'completed') {
    if (!extract) return { platform, status: 'captured', replay: true };
    const latest = JSON.parse(
      await readFile(path.join(outputDir, state.extractions.at(-1)), 'utf8'),
    );
    const wantedModel =
      model ??
      process.env[provider === 'deepseek' ? 'DEEPSEEK_MODEL' : 'OPENAI_MODEL'];
    if (
      latest.audit.provider !== provider ||
      (wantedModel && latest.audit.model !== wantedModel)
    )
      return extractEngineeringCapture(outputDir, platform, {
        provider,
        model,
      });
    return {
      platform,
      status: 'completed',
      replay: true,
      extractions: state.extractions,
    };
  }
  if (state.status === 'captured')
    return extract
      ? extractEngineeringCapture(outputDir, platform, { provider, model })
      : { platform, status: 'captured' };
  if (state.submissions && !resume)
    throw Object.assign(
      new Error('Use resume-collection; never resubmit an unknown Query'),
      { code: 'SUBMISSION_UNKNOWN' },
    );
  if (state.submissions && !state.context_token)
    return {
      platform,
      status: 'waiting_human',
      reason: 'RESULT_BINDING_REQUIRED',
      message: '请选择原始结果；没有已持久化的页面绑定，不能猜测或重新提交。',
    };
  const session = await connectPlaywrightMcp({
    outputDir,
    auditMode: formalPlan ? 'metadata' : 'full',
  });
  const adapter = adapters[platform];
  try {
    if (!state.submissions) {
      await session.call('browser_tabs', { action: 'new', url: adapter.entry });
      const ready = resultJSON(
        await session.call('browser_evaluate', {
          function: `() => ({input:!!document.querySelector(${JSON.stringify(adapter.input)})?.getBoundingClientRect().width,existing_answer:!!document.querySelector(${JSON.stringify(adapter.answer)}),challenge:!!document.querySelector('iframe[src*="captcha"],iframe[src*="challenges.cloudflare"],[data-testid="challenge-stage"]'),url:location.href})`,
        }),
      );
      if (
        !ready.input ||
        ready.challenge ||
        ready.existing_answer ||
        new URL(ready.url).origin !==
          new URL(ENGINEERING_PLATFORMS[platform]).origin
      )
        return {
          platform,
          status: 'waiting_human',
          reason: ready.challenge
            ? 'challenge_no_submission'
            : 'login_or_input_required',
        };
      const token = randomUUID();
      await bindEngineeringContext(outputDir, platform, token);
      state.context_token = token;
      const tagged = await session.call('browser_evaluate', {
        function: `() => {document.documentElement.dataset.geoCaptureContext=${JSON.stringify(token)};return true;}`,
      });
      if (tagged.isError)
        return {
          platform,
          status: 'waiting_human',
          reason: 'CONTEXT_BINDING_FAILED',
        };
      await claimEngineeringSubmission(
        outputDir,
        platform,
        new Date(),
        beforeSubmit,
      );
      const typed = await session.call('browser_type', {
        target: adapter.input,
        text: run.query.text,
        submit: true,
      });
      if (typed.isError)
        return {
          platform,
          status: 'waiting_human',
          reason: 'submission_unknown',
        };
    }
    let previous = '';
    let stable = 0;
    for (let step = 0; step < 60; step++) {
      const result = resultJSON(
        await session.call('browser_evaluate', {
          function: `() => {const a=document.querySelector(${JSON.stringify(adapter.answer)});return {url:location.href,context_token:document.documentElement.dataset.geoCaptureContext,answer:a?.innerText||'',busy:!!document.querySelector(${JSON.stringify(adapter.stop)}),challenge:!!document.querySelector('iframe[src*="captcha"],iframe[src*="challenges.cloudflare"],[data-testid="challenge-stage"]')}}`,
        }),
      );
      if (
        new URL(result.url).origin !==
        new URL(ENGINEERING_PLATFORMS[platform]).origin
      )
        return {
          platform,
          status: 'waiting_human',
          reason: 'navigation_or_login',
        };
      if (result.context_token !== state.context_token)
        return {
          platform,
          status: 'waiting_human',
          reason: 'RESULT_BINDING_CHANGED',
        };
      if (result.challenge)
        return {
          platform,
          status: 'waiting_human',
          reason: 'challenge_no_resubmission',
        };
      stable =
        result.answer && !result.busy && result.answer === previous
          ? stable + 1
          : 0;
      previous = result.answer;
      if (stable >= 2) {
        const raw = resultJSON(
          await session.call('browser_evaluate', {
            function: `() => {const a=document.querySelector(${JSON.stringify(adapter.answer)});return {answer_text:a.innerText,${formalPlan ? '' : 'answer_html:a.outerHTML,'}context_token:document.documentElement.dataset.geoCaptureContext,result_url:location.href,captured_at:new Date().toISOString(),outcome:'success',conversation_state:'new',observed_model:'unknown',citations:[...a.querySelectorAll('a[href],[data-pplx-citation-url]')].filter(e=>/^https?:/.test(e.getAttribute('data-pplx-citation-url')||e.href)).map((e,i)=>({occurrence_ordinal:i+1,url:e.getAttribute('data-pplx-citation-url')||e.href,title:e.innerText||'unknown',context:e.closest('p,li')?.innerText||e.parentElement?.innerText||'unknown'}))}}`,
          }),
        );
        if (raw.context_token !== state.context_token)
          return {
            platform,
            status: 'waiting_human',
            reason: 'RESULT_BINDING_CHANGED',
          };
        await recordEngineeringCapture(outputDir, platform, raw);
        if (!extract) return { platform, status: 'captured' };
        return extractEngineeringCapture(outputDir, platform, {
          provider,
          model,
        });
      }
      await session.call('browser_wait_for', { time: 5 });
    }
    return {
      platform,
      status: 'waiting_human',
      reason: 'answer_timeout_no_resubmission',
    };
  } finally {
    await session.close();
  }
}
