# English primary knowledge-entry template

English is the primary version. Keep an existing KB ID and file path when updating an entry. Use a complete Chinese reading counterpart under the matching translations/zh-CN category. Source publication does not approve the entry.

## Metadata

Use the existing knowledge_entry metadata: id, query_id, title, title_en, domain, entry_type, priority, status, version, owner, approver and review dates. Use English titles and language: en. Start unconfirmed material as draft. Owner roles are proposals until assigned.

## Entry body

1. Question — an English editorial question; do not present it as measured demand.
2. Current answer — a direct, bounded statement supported by identified material.
3. Details and conditions — product, user, geographic, timing, approval and payment conditions as applicable.
4. Scope and limits — distinguish current statements, observed operation and unsupported extrapolation.
5. Evidence gaps and review — item-specific requests, minimum evidence and proposed fact owner.
6. Supporting knowledge — reusable facts and exact entry IDs; avoid independently maintaining the same claim in every answer.
7. Sources — original locator, capture, paragraph or section, source relationship and observation date.

## Chinese counterpart

Use ordinary Markdown, with no business-object Frontmatter. Include Knowledge ID, Source file, Source version, Source SHA-256, Translation reviewed, Language and Translation status in a bullet list. Match the seven sections completely. Preserve numbers, units, conditions, negation, exceptions and evidence links.

## Updating

Update English and Chinese in the same batch. If translation cannot be completed, label it stale and report the gap; do not leave it presented as synchronized. Recalculate the English source hash and update the coverage register after review. Preserve original material and historical decisions. Run check-localization.py and local link checks before handoff.

[中文说明](../translations/zh-CN/01-templates/knowledge-entry-template.md)
