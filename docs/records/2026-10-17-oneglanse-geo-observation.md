# MyyShop 单 Query 的 GEO 候选观察

- 状态：implemented
- 创建/更新：2026-10-17
- 来源：[单 Query 任务](../tasks/2026-10-17-oneglanse-mcp-integration.md)、[联调验证记录](2026-10-17-oneglanse-mcp-integration-record.md)。
- 工作目录：`/Users/sujingjun/geo-cowork`；本次仅新增工程观察，不变更业务批准。
- 适用范围：Gemini 一次原生运行收到的回答及来源列表；非正式 Baseline、非业务事实确认。

## 证据

- Query：`Q-MYYSHOP-WHAT-IS-EN-BASELINE-001@1.0.0`；使用其明确的 `normalized_text` 字段 `what is myyshop`，原文 `What is MyyShop?` 和文件 SHA-256 保存在[映射](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/prepared.json)。
- 原生 response ID：`503b9927-2727-4f65-a699-50d49aad512a`；[完整原始返回值](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/responses/751ef8f4008668c49ca333e0f02cde919cbd392a49348aa17ff9f3696bca2064.json)。
- JSON 为 5,053 字节，SHA-256 为 `c99edfa62d5feee8b4ec0f3fe806a019b35cdb9313c5a25843d4152f255b882e`；答案为 1,954 个 Unicode 字符。来源列表 6 条，4 个不同 URL。
- [确定性本地分析](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/analysis.json)保留来源原字段、规范化 URL 和未知证据。

## 可观察结果

回答提到了品牌、创作者合作、内容收益和 MyyFinds，也在开头使用社交电商/软件服务的定位，并用独立章节描述 dropshipping、采购和履约。它呈现出创作者服务与历史电商表述并存的回答结构。

与[已有 M5 定位评估合同](../../workspaces/myyshop/cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md)的“全球内容创作者服务平台”方向相比，可形成一个待复核问题：新定位是否在模型的首段定义中足够突出，以及旧电商能力是否仍被描述为当前核心功能。这是对单次回答的候选观察，不等于断定相关能力已经下线或事实错误。

来源域名为 `businesswire.com`、`dhgate.com`、`apps.apple.com`、`stufftotalk.wordpress.com`。两个 URL 各出现两条不同 excerpt，不能把 6 条 Source 列表项算成 6 个独立网页或原始引用 occurrence。本次列表未出现 `myyshop.com`；只能描述已返回列表，不能证明 Gemini 页面全部来源也没有该域名。

## 结论边界与后续

本次未读取引用页面原文，未核验每项能力、收费、结算或适用地区；不根据域名直接授予来源权威，也不输出 Claim supported。当前真实 KBASE 仍未批准，故事实准确性、正式定位评分和 Claim Support 均保持未判断。

后续可在明确业务授权后复核品牌最新公开定义及相关来源，再决定是否形成内容/证据 Gap。这个工程观察不创建正式 Sample、Citation occurrence、Publication、Review 批准或新的真实 Cycle。
