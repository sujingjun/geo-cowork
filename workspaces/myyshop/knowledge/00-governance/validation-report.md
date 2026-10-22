# Initial bilingual knowledge verification

- Date: 2026-10-22
- Edition: 0.2.0
- Result: local draft curation and the checks described here completed; all knowledge entries remain draft.
- Business fact confirmation, formal Knowledge Release and external publication: not completed by this task.

## Deliverables

120 English primary entries and 120 complete Simplified Chinese counterparts represent 120 logical entries: 94 source-fact entries and 26 derived answers. Nine bilingual category indexes, four English/Chinese template pairs, source coverage, consolidated requests and a reusable read-only localization check are available.

[English home](../README.md) · [中文对照](../translations/zh-CN/README.md) · [Pair index](file-manifest.md) · [Coverage CSV](initial-knowledge-coverage.csv)

## Executed checks

| Check | Result |
| --- | --- |
| Language pairing and identity | 120 matching pairs; original IDs and category membership retained |
| English source version and SHA-256 | All Chinese source versions and hashes match the English primary |
| Numeric meaning, product names and evidence links | No mismatches in the checked business sections |
| Localization-check scenarios | 8 passed: valid pair, stale source, wrong version, changed amount, product substitution, duplicate business-object Frontmatter, missing section, empty section |
| Workspace structure and objects | Passed; no object errors or warnings |
| Built and stored knowledge index | 120 entries, 120 unique IDs, 0 Chinese copies registered, 0 file-hash mismatches |
| Historical preservation | 17 existing canonical/decision files and 8 reused Source records unchanged; original PR files unchanged |
| Source locators | All locators used by the 69 bilingual fact units were found in the corresponding captured text |
| Documentation links and whitespace | Passed within the recorded scope; exact commands and counts are in the execution record and machine-readable result |

[Machine-readable results](validation-results.json) · [Execution record](../../../../docs/records/2026-10-22-myyshop-initial-knowledge-curation-record.md)

## Semantic review

The curation uses 69 bilingual fact units, 120 question pairs and 36 custom answer pairs. The English and Chinese wording was prepared together and checked for scope and commitment strength. Specific review points included current positioning, zero followers versus eligibility, TikTok CPM versus MyyFinds, valid views and campaign limits, fees versus limited-time reports, revenue calculation versus receipt, content ownership versus licensing, and age exceptions.

Automated checks detect structural, numeric, reference and freshness defects; they do not independently prove complete linguistic equivalence, product delivery or business truth. This was the implementing agent’s review, not independent business or professional translation acceptance.

## Source coverage and remaining work

The register contains 35 source/capture entries: 8 reused Source records and 27 new ones, with 32 new candidate Evidence captures. N3’s 891 total-link rows are retained, including one exact duplicate URL; the 890 unique URL strings are not independent endorsements. Fifteen IMH article bodies were captured; the category listing is partial.

Instagram account bio, 30 captions in the frozen window and 3 pinned captions were read in Chrome, with 3 older boundary posts retained separately. Caption bodies matched the profile-grid text after whitespace normalization and each post’s DOM timestamp was read. Video speech and every image/carousel slide were not comprehensively transcribed.

TikTok redirects to a regional-unavailability page. The internal IMH final-copy document body was not obtained because the configured CLI executable was unavailable. No hidden content, login identity, cookies or private navigation were stored.

[Source register](source-register.md) · [17 consolidated requests](pending-items.md)

102 entries point to at least one specific evidence request. The other 18 have no additional item-specific request for their limited draft statements; they are still not business-approved. Positioning change is not a prerequisite. No formal sample, release, website publication, Feishu write, Git commit or push was performed.

## Rechecking

From the repository root, run:

```bash
python3 workspaces/myyshop/knowledge/00-governance/check-localization.py
python3 workspaces/myyshop/knowledge/00-governance/check-localization.py --self-test
```

This checker includes the historical-preservation baseline of this curation batch. A later authorized change to canonical objects needs a new explicitly documented verification baseline; do not overwrite the archived originals.
