import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { modelHash } from './model-client.mjs';

export async function readKnowledgeMarkdown(directory) {
  const entries = [];
  for (const category of await readdir(directory, { withFileTypes: true })) {
    if (!category.isDirectory() || !/^0[2-9]-|^10-/.test(category.name))
      continue;
    for (const file of await readdir(path.join(directory, category.name))) {
      if (!file.endsWith('.md')) continue;
      const text = await readFile(
        path.join(directory, category.name, file),
        'utf8',
      );
      if (
        Buffer.byteLength(text) > 256 * 1024 ||
        !/(synthetic|test_only|模拟|演练)/i.test(text)
      )
        throw Object.assign(
          new Error('当前入口仅接受明确标注的演练知识 Markdown'),
          { code: 'BUSINESS_INPUT_SCOPE_REQUIRED' },
        );
      if (
        /(?:api[_-]?key|access[_-]?token|authorization|password)\s*[:=]/i.test(
          text,
        )
      )
        throw Object.assign(new Error('知识输入含凭据形态'), {
          code: 'BUSINESS_INPUT_SENSITIVE',
        });
      const title = text.match(/^#\s+(.+)$/m)?.[1] ?? file.slice(0, -3);
      let fact = text.match(/^事实[：:]\s*(.+)$/m)?.[1];
      let evidence = text.match(/^原始证据[：:]\s*(.+)$/m)?.[1];
      if (!fact) {
        fact = text
          .split(/\n## Original evidence\s*\n/i)[0]
          .replace(/^#.*\n/, '')
          .replace(/^.*(?:Synthetic\/test_only|Usage[:：]).*\n/gim, '')
          .trim();
      }
      if (evidence === undefined)
        evidence =
          text
            .split(/\n## Original evidence\s*\n/i)[1]
            ?.split(/\nReview after:/i)[0]
            ?.trim() ?? '';
      if (/^Not provided$/i.test(evidence)) evidence = '';
      if (!fact)
        throw Object.assign(new Error(`缺少事实正文：${file}`), {
          code: 'BUSINESS_INPUT_INVALID',
        });
      const stem = file.slice(0, -3);
      const key = /^[a-z0-9-]+$/.test(stem)
        ? stem
        : `entry-${modelHash(`${category.name}/${file}`).slice(0, 12)}`;
      entries.push({
        key,
        category: category.name,
        title,
        fact,
        evidence,
        review_after: text.match(
          /(?:Review after|复核时间)[：:]\s*(\d{4}-\d{2}-\d{2})/i,
        )?.[1],
        source_markdown: `${category.name}/${file}`,
        source_sha256: modelHash(text),
        source_text: text,
      });
    }
  }
  if (!entries.length)
    throw Object.assign(new Error('没有找到九类目录中的知识条目'), {
      code: 'KNOWLEDGE_INPUT_REQUIRED',
    });
  return entries;
}
