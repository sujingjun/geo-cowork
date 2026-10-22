# 英文知识主条目模板：中文说明

英文为主版本。更新条目时保留既有 KB ID 和路径，在 translations/zh-CN 对应分类维护完整中文阅读版。来源发布不构成条目批准。

## 元数据

沿用 knowledge_entry 的 id、query_id、title、title_en、domain、entry_type、priority、status、version、owner、approver 和复核日期。标题使用英文，language 为 en。尚未确认的材料保持 draft；负责人岗位在落实前只作建议。

## 条目正文

1. 问题：英文编辑性问题，不表述为经过测量的需求。
2. 现状答案：直接、带边界，并由已识别材料支持。
3. 详细说明与条件：按适用情况明确产品、用户、地区、时间、审批和支付条件。
4. 适用范围与限制：区分现有表述、实际运行观察和无依据扩展。
5. 证据缺口与复核：条目专属请求、最低材料要求及建议事实负责人。
6. 支撑知识：可复用事实与准确条目编号，避免每个答案独立维护同一主张。
7. 来源：原始位置、快照、段落或章节、来源关系与观察日期。

## 中文对照

使用普通 Markdown，不设置业务对象 Frontmatter。用项目列表记录 Knowledge ID、Source file、Source version、Source SHA-256、Translation reviewed、Language 和 Translation status。完整对应七个章节，保留数字、单位、条件、否定、例外和证据链接。

## 更新

同批更新英文与中文。无法完成翻译时标为 stale 并报告缺口，不继续呈现为 synchronized。校对后重新计算英文源文件校验值，更新覆盖表。保留原始材料及历史决定，交付前运行 check-localization.py 和本地链接检查。

[English template](../../../01-templates/knowledge-entry-template.md)
