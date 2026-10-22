#!/usr/bin/env python3
"""Read-only checks for the MyyShop English/Chinese knowledge files."""
from pathlib import Path
from collections import Counter
import argparse
import csv
import hashlib
import json
import re

KNOWLEDGE = Path(__file__).resolve().parents[1]
WORKSPACE = KNOWLEDGE.parent


def digest(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def metadata(text):
    if not text.startswith('---\n'):
        return {}
    result = {}
    for line in text.split('---', 2)[1].splitlines():
        key, sep, value = line.partition(':')
        if sep:
            try:
                result[key] = json.loads(value.strip())
            except ValueError:
                result[key] = value.strip().strip("'\"")
    return result


def reading_field(text, name):
    match = re.search(r'^- ' + re.escape(name) + r': (.+)$', text, re.M)
    return match.group(1) if match else None


def business_body(text):
    # 只比较业务正文，元数据、文件路径和来源标题不参与数字/术语比较。
    start = re.search(r'^## 1\. ', text, re.M)
    end = re.search(r'^## 6\. ', text, re.M)
    return text[start.start():end.start()] if start and end else ''


def numeric_signature(text):
    text = re.sub(r'\[[^\]]*\]\([^)]*\)', '', business_body(text))
    return Counter(re.findall(r'(?<![A-Za-z])\$?\d+(?:,\d{3})*(?:\.\d+)?(?:M|K|%)?', text))


def pair_errors(en, zh, row):
    errors = []
    m = metadata(en)
    if m.get('id') != row['knowledge_id'] or m.get('record_type') != 'knowledge_entry':
        errors.append('EN_ID_OR_TYPE_MISMATCH')
    if m.get('language') != 'en':
        errors.append('EN_PRIMARY_LANGUAGE_MISSING')
    if m.get('version') != row['fact_version'] or reading_field(zh, 'Source version') != row['fact_version']:
        errors.append('SOURCE_VERSION_MISMATCH')
    if reading_field(zh, 'Knowledge ID') != row['knowledge_id']:
        errors.append('TRANSLATION_ID_MISMATCH')
    if reading_field(zh, 'Source file') != row['english_path']:
        errors.append('TRANSLATION_PATH_MISMATCH')
    if reading_field(zh, 'Source SHA-256') != digest(en):
        errors.append('STALE_TRANSLATION')
    if zh.startswith('---'):
        errors.append('TRANSLATION_REGISTERED_AS_OBJECT')
    if reading_field(zh, 'Translation status') != 'synchronized':
        errors.append('TRANSLATION_NOT_SYNCHRONIZED')
    en_sections = re.findall(r'^## (\d+)\. ', en, re.M)
    zh_sections = re.findall(r'^## (\d+)\. ', zh, re.M)
    if en_sections != list(map(str, range(1, 8))) or en_sections != zh_sections:
        errors.append('INCOMPLETE_SECTION_PAIR')
    # 只有标题、没有正文的译文不能通过“章节齐全”检查。
    for text in (en, zh):
        sections = re.split(r'^## \d+\. [^\n]+\n', text, flags=re.M)[1:]
        if any(not section.strip() for section in sections):
            errors.append('EMPTY_SECTION')
            break
    if numeric_signature(en) != numeric_signature(zh):
        errors.append('NUMERIC_MEANING_MISMATCH')
    products = ['MyyFinds', 'TikTok', 'Brand Deals', 'Free Value Report', 'Find Your Lane', 'CPM']
    for term in products:
        if (term in business_body(en)) != (term in business_body(zh)):
            errors.append('PRODUCT_TERM_MISMATCH:' + term)
    en_sources = Counter(re.findall(r'src-[a-z0-9-]+\.md', en))
    zh_sources = Counter(re.findall(r'src-[a-z0-9-]+\.md', zh))
    if en_sources != zh_sources:
        errors.append('EVIDENCE_REFERENCE_MISMATCH')
    return errors


def self_test():
    # 这些场景验证会改变业务含义或让译文过期的问题，不依赖真实业务文件。
    row = {'knowledge_id':'KB-TEST-001','fact_version':'0.2.0','english_path':'test.md'}
    en = '---\nrecord_type: "knowledge_entry"\nid: "KB-TEST-001"\nlanguage: "en"\nversion: "0.2.0"\n---\n'
    for n in range(1, 8):
        en += f'\n## {n}. Section\n\nMyyFinds may earn $25 from eligible views.\n'
    zh = '# 对照\n- Knowledge ID: KB-TEST-001\n- Source file: test.md\n- Source version: 0.2.0\n- Source SHA-256: '+digest(en)+'\n- Translation status: synchronized\n'
    for n in range(1, 8):
        zh += f'\n## {n}. 章节\n\nMyyFinds 的有效浏览可能产生 $25 收益。\n'
    assert not pair_errors(en, zh, row)
    assert 'STALE_TRANSLATION' in pair_errors(en+'Changed\n', zh, row)
    assert 'SOURCE_VERSION_MISMATCH' in pair_errors(en, zh.replace('Source version: 0.2.0', 'Source version: 0.1.0'), row)
    assert 'NUMERIC_MEANING_MISMATCH' in pair_errors(en, zh.replace('$25', '$250'), row)
    assert any(x.startswith('PRODUCT_TERM_MISMATCH') for x in pair_errors(en, zh.replace('MyyFinds', 'CPM'), row))
    assert 'TRANSLATION_REGISTERED_AS_OBJECT' in pair_errors(en, '---\nrecord_type: knowledge_entry\n---\n'+zh, row)
    assert 'INCOMPLETE_SECTION_PAIR' in pair_errors(en, zh.replace('## 3. 章节', '### 3. 章节'), row)
    assert 'EMPTY_SECTION' in pair_errors(en, zh.replace('## 4. 章节\n\nMyyFinds 的有效浏览可能产生 $25 收益。', '## 4. 章节\n'), row)
    return 8


def validate():
    rows = list(csv.DictReader((KNOWLEDGE/'00-governance/initial-knowledge-coverage.csv').open()))
    errors = []
    ids = [r['knowledge_id'] for r in rows]
    if len(ids) != 120 or len(set(ids)) != 120:
        errors.append({'code':'LOGICAL_ENTRY_COUNT','count':len(ids)})
    kinds = Counter(r['entry_kind'] for r in rows)
    if kinds != {'source_fact':94,'derived_answer':26}:
        errors.append({'code':'ENTRY_KIND_COUNTS','counts':dict(kinds)})
    source_ids = {r['knowledge_id'] for r in rows if r['entry_kind']=='source_fact'}
    for row in rows:
        enp, zhp = KNOWLEDGE/row['english_path'], KNOWLEDGE/row['chinese_path']
        if not enp.is_file() or not zhp.is_file():
            errors.append({'id':row['knowledge_id'],'code':'MISSING_LANGUAGE_FILE'})
            continue
        en, zh = enp.read_text(), zhp.read_text()
        for code in pair_errors(en, zh, row):
            errors.append({'id':row['knowledge_id'],'code':code})
        if digest(en) != row['english_sha256'] or digest(zh) != row['chinese_sha256']:
            errors.append({'id':row['knowledge_id'],'code':'COVERAGE_HASH_MISMATCH'})
        if row['entry_kind']=='derived_answer':
            support = set(filter(None, row['supporting_knowledge'].split(';')))
            if not support or not support <= source_ids:
                errors.append({'id':row['knowledge_id'],'code':'ANSWER_SUPPORT_INVALID'})
        # 英文正文允许切换链接出现“中文”，但不能留下中文正文或占位文本。
        primary = re.sub(r'\[中文对照\]\([^)]*\)', '', en.split('---', 2)[-1])
        if re.search(r'[\u4e00-\u9fff]', primary):
            errors.append({'id':row['knowledge_id'],'code':'EN_BODY_CONTAINS_CHINESE'})
    snapshots = WORKSPACE/'evidence/snapshots/2026-10-22-initial-knowledge'
    sources = json.loads((snapshots/'sources.json').read_text())
    for source in sources:
        if source.get('text_path') and digest((snapshots/source['text_path']).read_text()) != source['text_sha256']:
            errors.append({'source':source['key'],'code':'SOURCE_TEXT_HASH_MISMATCH'})
        if source.get('raw_path') and hashlib.sha256((snapshots/source['raw_path']).read_bytes()).hexdigest() != source['raw_sha256']:
            errors.append({'source':source['key'],'code':'SOURCE_RAW_HASH_MISMATCH'})
    for original in json.loads((snapshots/'input-files.json').read_text()):
        if hashlib.sha256((WORKSPACE/original['path']).read_bytes()).hexdigest() != original['sha256']:
            errors.append({'path':original['path'],'code':'ORIGINAL_INPUT_CHANGED'})
    history = json.loads((snapshots/'legacy-before.json').read_text())['historical_sha256']
    for filename, expected in history.items():
        if hashlib.sha256((WORKSPACE/filename).read_bytes()).hexdigest() != expected:
            errors.append({'path':filename,'code':'HISTORICAL_OBJECT_CHANGED'})
    reused = json.loads((snapshots/'reused-source-records.json').read_text())
    for source in reused:
        if hashlib.sha256((WORKSPACE/source['path']).read_bytes()).hexdigest() != source['sha256']:
            errors.append({'path':source['path'],'code':'REUSED_SOURCE_CHANGED'})
    return {'ok':not errors,'logical_entries':len(rows),'english_files':len(rows),'chinese_files':len(rows),'entry_kinds':dict(kinds),'historical_files_preserved':len(history),'reused_source_records_preserved':len(reused),'source_records':len(sources),'errors':errors}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    result = {'ok':True,'contract_scenarios':self_test()} if args.self_test else validate()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result['ok'] else 1)
