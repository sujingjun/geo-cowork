---
title: Spec 0006 — Consumer Answer Testing 与持续信源体系
status: approved
created: 2026-08-24
updated: 2026-08-25
source:
  - docs/prd/2026-08-24-m5-consumer-answer-testing.md
  - docs/architecture/2026-08-24-consumer-answer-testing-architecture.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - "2026-08-25 当前用户指令：持续维护信源体系，不做冷启动导入；完整设计 Playwright 与真实采集"
  - "2026-08-25 当前用户指令：批准 M5 里程碑方案设计，并实施计划，完成目标"
  - "2026-08-25 当前用户指令：Playwright 使用最新版并全局安装；五个平台统一授权 Owner Google 登录身份，按真实用户隐私，本地 artifact 保留 1 年"
  - "2026-08-25 当前用户指令：后续平台转为平台书面自动采集"
  - "2026-08-25 当前用户指令：去除 Adapter written_permission_ref 限制；平台许可改为全部里程碑完成后的上线前待办"
scope: M5 Collector Profile、Playwright/真实采集、Answer Sample、持续 Source registry、Citation/Review、聚合、恢复与授权门
---

# Spec 0006 — Consumer Answer Testing 与持续信源体系

## 1. 继承与触发范围

所有 M5 canonical 对象继承 Spec 0003 的公共字段、安全、stable ID、refs、checksum、index、Run、create-only artifact 和 supersede 原则，并读取 Spec 0004 的 Goal/Query/Query Set/Claim/Knowledge Release 精确版本。M5 的 `post_change_retest` 另读取 Spec 0005 的 confirmed Publication 与 Technical Retest Run。

本 Spec 适用于 `geo-answer-cycle`、M5 Schema/profile、Playwright collector base、逐平台真实 adapter、持续 Source registry、Citation/Review/aggregation Tool、离线录制 Fixture，以及获得逐平台授权后的消费者 UI Run。当前状态为 `approved`：授权 T02—T08；T09 账号/隐私已授权但真实自动 Smoke 受 Terms/robots 阻塞，T10 未授权。

## 2. 新对象类型

| `record_type` | ID 前缀 | 状态 |
| --- | --- | --- |
| `collector_profile` | `CPF-` | `draft/frozen/superseded` |
| `answer_sample` | `SMP-` | `recorded/superseded` |
| `citation_observation` | `CIT-` | `observed/superseded` |
| `source_classification` | `SCL-` | `candidate/reviewed/superseded` |
| `claim_support_review` | `CSR-` | `candidate/reviewed/superseded` |
| `answer_review` | `ARV-` | `candidate/reviewed/superseded` |
| `answer_aggregation` | `AGG-` | `draft/computed/superseded` |

新对象的实质修订使用新 ID，并可用 `supersedes_ref` 指向同类型旧对象。不得依赖在同一 graph 内解析同 stable ID 的多个历史版本。

M5 不新增第二套 Source 对象，复用 Spec 0003 的 `record_type:source` 并增加 §7 的 M5 可选 profile。外部榜单、域名清单或历史排名没有 import 对象。

## 3. Collector Profile

### 3.1 必需字段

```yaml
platform: chatgpt | gemini | perplexity | google_ai | claude
product_entry: <消费者产品入口标识或 URL>
region: <明确地区或 unknown>
language: <BCP-47 或 unknown>
login_state: logged_out | logged_in | unknown
conversation_state: new | continued | unknown
web_search_state: on | off | automatic | unavailable | unknown
model_mode: <界面可见模型/模式或 unknown>
query_template_version: <semver>
sampling_count: 3
time_window:
  id: <stable window id>
  starts_at: <RFC3339>
  ends_at: <RFC3339>
device:
  class: desktop | mobile | unknown
  os: <value or unknown>
  browser: <value or unknown>
  viewport: <width>x<height> | unknown
collection_method: browser_automation | manual | recorded_fixture
profile_fingerprint: <sha256>
approval: <human approval> # frozen 时必需，只批准配置
```

`profile_fingerprint` 对除 `approval`、公共时间和 title 外的 Profile 采样字段做稳定 JSON SHA-256。`frozen` Profile 内容不得原地改变；任何字段变化创建新 ID。

Profile approval 不等于真实采集授权。真实 Run 还必须提供当前、逐平台的 `authorization_ref`。

### 3.2 `unknown` 规则

- 无法从消费者界面可靠取得的 model/mode、region 或设备细节记录 `unknown`，不得猜测。
- comparability 计算中 `unknown` 不是通配符；任一关键字段为 `unknown` 时结果最高为 `partial`。

## 4. Sample plan 与独立性

正式 `baseline` 或 `post_change_retest` 对每个 Query × Platform 创建 ordinal `1..3` 的固定 slot。slot key 为以下稳定 JSON 的 SHA-256：

```text
purpose + query ref/version + platform + collector profile ref/version
+ query template version + time window id + ordinal
```

约束：

1. ordinal 唯一且连续为 1、2、3；同一回答或同一会话上下文不能复用到多个 slot。
2. 每个 slot 使用 `conversation_state:new`；平台无法保证时 Profile 必须写明并使 comparability 至多为 `partial`。
3. `exploratory` 可少于三次，但不得与正式集合混入同一 Aggregation。
4. 一个 slot 出现 `success/refusal/timeout/no_result/challenge` 后视为已有平台观察，不得在同一正式 Run 中用成功重试替换。
5. 只有未形成平台观察的 `system_failure` 可以在授权仍有效时重试；新 Sample 使用新 ID、同 slot key、递增 `attempt_no` 和 `retry_of_ref`，旧 attempt 永久保留。

## 5. Answer Sample

### 5.1 必需字段

```yaml
purpose: exploratory | baseline | post_change_retest
query_ref: Q-...
query_version: <semver>
query_set_ref: QS-...
query_set_version: <semver>
intent: <冻结 Query 的 intent 快照>
platform: <与 Profile 一致>
collector_profile_ref: CPF-...
collector_profile_version: <semver>
run_ref: RUN-...
slot_key: <sha256>
ordinal: 1 | 2 | 3
attempt_no: <positive integer>
retry_of_ref: SMP-... # 可选，仅 system_failure 重试
outcome: success | refusal | timeout | no_result | challenge | cancelled | system_failure
captured_at: <RFC3339>
collection_method: browser_automation | manual | recorded_fixture
artifacts:
  - role: answer_text | screenshot | dom | html | page_export | collector_log
    availability: captured | unavailable
    path: <run-relative create-only path, captured 时必需>
    sha256: <captured 时必需>
    media_type: <captured 时必需>
    unavailable_reason: <unavailable 时必需>
raw_manifest_sha256: <artifacts 稳定描述的 sha256>
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true | false
  redaction_notes: [<说明>]
```

### 5.2 状态与 artifact 门

- `success/refusal` 必须有 `answer_text`；若界面可见但无法保存文本，结果只能为 `system_failure`，不得手工概述冒充完整回答。
- `timeout/no_result/challenge/system_failure` 至少有脱敏 `collector_log` 或答案区域截图；`cancelled` 必须记录取消来源和已完成 steps。
- `recorded` Sample 的所有 captured artifact 必须存在、位于对应 Run 的 `raw/` 或 `outputs/`、SHA 匹配且 create-only。
- 截图/DOM/HTML 包含无法安全去除的账号或个人信息时必须 `unavailable`；不得为满足验收而持久化。
- Answer Sample 不含 Review 结果、来源分类或聚合字段。

### 5.3 Retest 前置

`post_change_retest` 必须另外包含：

```yaml
publication_refs: [PUB-...]
technical_retest_run_refs: [RUN-...]
baseline_aggregation_refs: [AGG-...]
```

Publication 必须 `confirmed`，Technical Retest Run 必须引用同一 Asset/Publication。缺任一项返回 `M4_PUBLICATION_REQUIRED`。Baseline 不要求这些字段。

## 6. Citation Observation

每次界面出现的引用均创建一个 Observation：

```yaml
sample_ref: SMP-...
sample_raw_manifest_sha256: <sha256>
occurrence_index: <从 1 开始且 Sample 内唯一>
position:
  kind: character_span | ui_order | unavailable
  start: <integer, character_span 时>
  end: <integer, character_span 时>
  order: <integer, ui_order 时>
  unavailable_reason: <unavailable 时>
url_raw: <界面捕获 URL>
url_normalized: <规范化 URL>
citation_domain: <规范化 hostname>
source_ref: SRC-...
anchor_or_context: <可定位短上下文，不替代完整回答>
```

规范化规则按顺序执行：URL parse → scheme/hostname 小写 → IDN 转 ASCII → 移除默认端口 → 删除 fragment → 保留 path/query → hostname 去除一个前导 `www.` 得到 `citation_domain`。解析失败保留 raw 并返回 `CITATION_URL_INVALID`，不得猜域名。

同一回答重复引用相同 URL 的 Observation 全部保留。聚合 Citation 单元按 `(sample_ref, url_normalized)` 去重；同域不同规范化 URL 分别计数。Observation 写入前必须按 §7 匹配或创建 Source；无法形成可审计 identity 时返回错误，不得只留下猜测分类。

## 7. 持续 Source Registry 与 Classification

### 7.1 复用 Source 的 M5 profile

由真实 Citation 首次发现的 Source 继续使用 `SRC-`、`record_type:source` 与 `active/stale/deprecated`，并增加：

```yaml
source_kind: consumer_citation
locator: <规范化页面、频道、发布者或域名 URL>
identity:
  level: domain | publisher | channel | page
  key: <稳定 identity key>
  citation_domain: <规范化 hostname>
  host_platform: youtube | reddit | linkedin | instagram | tiktok | facebook | other | none
  publisher_name: <可验证名称或 unknown>
discovery:
  method: consumer_citation
  citation_ref: CIT-...
  observed_at: <RFC3339>
```

约束：

- 新 Source 只能由当前 Workspace 中获授权 M5 Run 的 Citation Observation 触发；外部综合榜、静态域名表、历史排名和手工预填清单均不得创建 Source 或 Classification。
- identity key 优先使用可验证发布者、频道或页面身份；只能取得域名时建立 `level:domain` 且分类必须 `review_required:true`。
- YouTube、Reddit、LinkedIn 等是 host/domain，不自动代表生产主体或 Source Type。更具体身份出现时创建新 Source ID 并保留原 domain Source，不原地改写旧 Observation。
- `Source.status:active` 只表示 registry 身份当前可用；不表示权威、Evidence approved、分类 reviewed 或 Claim supported。
- first seen、last seen、平台/Query Cluster/窗口集合和 observation count 从 Citation refs 派生，不作为可手工覆盖的 Source 真值。
- Citation 与首次发现 Source 的双向 ref 必须由一个 `citation_source_materialization_plan` 逻辑事务生成：先从 Sample/raw occurrence 预分配 CIT/SRC ID 和预期 bytes/checksum，在内存中校验完整闭包，再按 create-only 写入。Run step 只能在 Citation/Source 均存在、checksum 一致且 refs 闭合时完成；中断后只能以同一 plan 补齐缺失对象，任一已存在 bytes 不同即冲突。

### 7.2 Source Classification 必需字段

```yaml
source_ref: SRC-...
citation_refs: [CIT-...]
classification_key: <source identity key + 分类规则版本的稳定 key>
primary_source_type: official_fact | institutional_authority | independent_professional | community_experience | content_distribution | unknown
secondary_source_types: [<上述五类，不含 primary/unknown>]
party_relation: first_party | third_party | unknown
subject_workspace: myyshop
basis:
  page_owner: <可验证主体或 unknown>
  content_form: official | editorial | review | community_post | social_post | video | image | podcast | news | government | standard | academic | other | unknown
  evidence: [<可定位理由>]
confidence: high | medium | low | unknown
reviewer:
  kind: deterministic_rule | geo_expert | human
  identifier: <角色或规则版本>
review_required: true | false
```

约束：

- 五层是 GEO 角色，不是权威等级；分类以 Source identity、具体页面、内容生产主体和内容形态为依据，宿主域名本身不能决定类型。
- 视频、播客、新闻或社交页面可把内容传播源作为副标签；聚合只使用唯一主标签。
- `party_relation:first_party` 必须有被评估品牌控制证据；官方品牌视频可为 `official_fact` + `content_distribution`，独立评测频道可为 `independent_professional` + `content_distribution`。
- `unknown/low`、主副标签冲突、平台托管主体不清或直接影响 Cycle 结论时 `review_required:true`。
- `reviewed` 不自动表示人类批准；`reviewer.kind` 必须明确。

## 8. Claim Support Review

每个需要判断的 Citation × Claim 建立独立对象：

```yaml
citation_ref: CIT-...
classification_ref: SCL-...
claim_ref: CLM-...
claim_version: <semver>
verdict: supported | partially_supported | not_supported | unverifiable
support_scope: <Citation 实际支持的范围>
rationale: <非空>
confidence: high | medium | low | unknown
reviewer: <同 Source Classification>
review_required: true | false
```

Source Type 不决定 verdict。Citation 页面无法取得、只见摘要、Claim Scope 不匹配或证据矛盾时不得标 `supported`。低置信度、关键红线或直接影响 Cycle 结论时必须人工确认后才能进入正式 reviewed Aggregation。

## 9. Answer Review

### 9.1 绑定

```yaml
sample_ref: SMP-...
sample_raw_manifest_sha256: <sha256>
rubric:
  version: <semver>
  sha256: <rubric artifact checksum>
claim_support_review_refs: [CSR-...]
core:
  entity_recognition: pass | partial | fail | not_applicable
  core_fact_accuracy: pass | partial | fail | not_applicable
  current_positioning: pass | partial | fail | not_applicable
  risk_boundary: pass | partial | fail | not_applicable
  citation_quality: pass | partial | fail | not_applicable
exploratory:
  comparison_dimensions: [<文本>]
  recommendation_reasons: [<文本>]
  exclusion_reasons: [<文本>]
  competitor_mentions: [<文本>]
  source_structure_notes: [<文本>]
  decision_dimension_candidates: [<文本>]
reviewer: <结构同上>
review_required: true | false
```

Rubric 变化创建新 Answer Review ID；不修改 Sample 或旧 Review。探索字段不进入正式 pass/partial/fail 汇总，也不自动创建 Product Gap 或战略结论。

## 10. Answer Aggregation 与分析链

### 10.1 输入

```yaml
purpose: exploratory | baseline | post_change_retest
industry: <非空稳定值>
platform: <单一平台>
query_cluster:
  id: <稳定 key>
  label: <可读名称>
  query_versions: [{ ref: Q-..., version: <semver> }]
time_window: { id, starts_at, ends_at }
profile_versions: [{ ref: CPF-..., version: <semver> }]
selected_sample_versions:
  - { slot_key, ref: SMP-..., version: <semver>, raw_manifest_sha256: <sha256> }
citation_versions: [{ ref: CIT-..., version: <semver> }]
source_versions: [{ ref: SRC-..., version: <semver> }]
classification_versions: [{ ref: SCL-..., version: <semver> }]
claim_support_review_versions: [{ ref: CSR-..., version: <semver> }]
answer_review_versions: [{ ref: ARV-..., version: <semver>, rubric_sha256: <sha256> }]
comparability:
  result: true | partial | false
  compared_to_ref: AGG-... # 可选
  field_differences: [{ field, before, after, severity }]
  notes: [<非空，partial/false 时>]
metrics: <§10.2>
```

正式 Aggregation 必须每个 Query version 恰有三个 slot、ordinal 1..3，且每个 slot 恰有一个 selected Sample。所有 attempts 继续可追溯；`system_failure` 重试只选择符合 §4 的最终 attempt。

分析链由 refs 强制形成：

```text
Query/version
→ Sample.platform + Query.intent
→ Citation Observation.citation_domain
→ Citation Observation.source_ref + Source.identity
→ Source Classification.primary_source_type
→ Claim Support Review.claim_ref + verdict
```

任一边缺失返回 `ANALYSIS_CHAIN_INCOMPLETE`。无 Citation Sample 可以没有后三条边，但必须进入状态计数。

### 10.2 指标公式

先定义 Citation 单元：同一 Sample 内相同 `url_normalized` 的所有 occurrence 合并为一个；其域名、分类和 party relation 必须无冲突，否则聚合失败并等待 Review。

1. **Top Citation Domains**
   - `domain_count(d)` = 属于域名 d 的 Citation 单元数；
   - 排序为 count 降序、domain ASCII 升序；
   - 输出 `top_n`（默认 10）、count 和 share。
2. **Citation Share**
   - 分母 `total_citation_units` = 全部去重 Citation 单元；
   - `citation_share(d) = domain_count(d) / total_citation_units`；
   - 分母为 0 时所有 share 为 `null`，并记录 `NO_CITATIONS`。
3. **Source Diversity**
   - `distinct_source_types` = 已知主标签数量；
   - `distinct_citation_domains` = Citation domain 数量；
   - `classification_coverage = known_primary_units / total_citation_units`；
   - `normalized_source_type_entropy = -Σ(p_i * ln p_i) / ln(5)`；只有已知主标签单元且总数大于 0 时计算，否则 `null`。coverage 小于 1 时 metric 状态为 `partial`。
4. **First-party vs Third-party Ratio**
   - 按 `party_relation` 统计 first/third/unknown 单元；
   - 分别输出 count、share 和 `party_coverage`；
   - `ratio = first_party_count / third_party_count`；third-party 为 0 时 ratio 为 `null` 并记录原因，不使用无穷大。
5. **Source Volatility**
   - 只比较相同 industry/platform/query cluster 且 comparability 为 `true` 的相邻非重叠时间窗；
   - 以两个窗口域名 share 分布的并集计算 `0.5 * Σ|p_current(d)-p_previous(d)|`，范围 0..1；
   - 任一窗口无 Citation 或 comparability 非 true 时为 `null + reason`；
   - 可同时输出头部域名集合的 Jaccard distance 作为辅助，不替代主公式。

Aggregation 另必须输出：expected/selected sample 数、各 outcome 数、system failure attempt 数、`no_citation_answer_count`、unknown classification 数、人工待复核数、metric coverage，以及当前时间窗的 new/returning Source 数、candidate/reviewed/unresolved classification 数。

### 10.3 外部榜单不导入

M5 不定义外部综合榜、静态域名表或历史排名的 Schema、CLI、adapter、materializer 或候选生成路径。它们不得进入 Workspace Source registry、Classification、Aggregation 输入、指标分母或决策状态。持续信源体系的唯一发现入口是当前 Workspace 内获授权真实 Run 的 Citation Observation。

## 11. Comparability 规则

比较字段分为硬条件和软条件：

- 硬条件：platform、product_entry、region、language、login_state、web_search_state、Query ref/version、Query template version、purpose、正式 sampling_count/slot 完整性、time window 口径；任一已知值不同即 `false`。
- 软条件：可见 model/mode、device/browser、collection_method、conversation_state 的已记录差异；没有硬差异时结果为 `partial`。
- 任一硬条件为 `unknown` 时最高 `partial`；不得把两个 unknown 判成相等并输出 true。
- `true` 要求硬条件完全相同、无硬条件 unknown、三个 slot 完整、collection_method 相同，且 Rubric/分类规则对所比较指标一致。

比较输出必须列出所有字段差异；调用方不能通过传入布尔值覆盖计算结果。

## 12. M5 Run 扩展与恢复

M5 collection Run 在 Spec 0003 Run 上增加：

```yaml
authorization_ref: <workspace-local human decision>
purpose: exploratory | baseline | post_change_retest
profile_versions: [{ ref: CPF-..., version: <semver> }]
query_set_versions: [{ ref: QS-..., version: <semver> }]
sample_slots:
  - slot_key: <sha256>
    query_ref: Q-...
    platform: <value>
    ordinal: 1 | 2 | 3
    completed_steps: [<collector step>]
    attempt_refs: [SMP-...]
    selected_sample_ref: SMP-... | null
lease:
  scope_key: <stable key>
  owner_id: <local process/run identity>
  acquired_at: <RFC3339>
  heartbeat_at: <RFC3339>
  expires_at: <RFC3339>
collector_contract:
  schema_version: <semver>
  collector_version: <semver>
  tool_policy_version: <semver>
```

恢复规则：

1. 同一 `scope_key` 只有一个未过期 lease；竞争者失败而不是并行提交 Query。
2. 只有 lease 过期且 input fingerprint 相同才可接管；接管写入新的 lease revision 并记录前 owner。
3. 每个 completed step 必须有对应 checksum/ref；缺证明时不得跳过。
4. `query_submitted` 后但终态不明的中断必须进入 `waiting_human`，不得自动再次提交。
5. raw 已写、Sample 未写时，校验 artifact plan/checksum 后幂等补齐；内容冲突失败。
6. 取消不删除 artifact；输入变化使用 M2 supersede 关系创建新 Run。
7. 故障注入至少覆盖每个 step 边界、stale lease、双进程竞争和 raw/metadata 半成品。

## 13. 授权、隐私与 Playwright 门

### 13.1 真实采集授权

非 Fixture Run 的 `authorization_ref` 必须指向当前 Workspace 内人类决定，并明确：platform/product entry、账号/登录态、地区/语言、自动化/人工方式、允许 artifact、最小化/脱敏、各 artifact 保留期、访问角色、删除责任、停止条件和外部写入为否。决定缺字段、过期或范围不匹配返回 `COLLECTION_AUTHORIZATION_REQUIRED`。

M4 的公开官网 allowlist、M3 approval 或 Profile approval 均不能替代本授权。

### 13.2 Playwright 依赖门

在以下条件全部满足前，仓库不得增加 Playwright package、运行安装命令或下载浏览器：

1. Owner 批准本 Spec/Plan 和 M5 离线实现；
2. 单独记录 exact package、exact version、lockfile 变化、license、Node 支持与升级责任；
3. 单独决定浏览器下载位置、大小、缓存、CI/macOS/三宿主验收范围和清理责任；
4. 录制 Fixture 的 collector seam、no-network 测试和 adapter allowlist 已先通过；
5. 安装动作获得当次明确授权。

package 安装与 browser binary 下载是两个门，不能互相推导。

### 13.3 Playwright collector base 合同

base 输入固定为：frozen Collector Profile 及其 fingerprint、`authorization_ref`、Query ref/version、slot/attempt、artifact plan、platform adapter ID/version 和 timeout policy。输出只能是 Answer Sample outcome、已授权 artifacts、Citation raw 与确定性 diagnostics；base 不做 Classification、Claim Support、Review 或 Aggregation。

每个 attempt 必须：

1. 创建新 browser context，不复用 cookie、对话或页面状态；
2. 只能导航至 authorization 与 adapter 共同 allowlist 的消费者入口，并按 Profile 设置 locale、viewport 和可控状态；
3. 显式校验登录态、搜索态、模型/模式与新对话；无法确认时记录 `unknown`，不猜测；
4. 使用版本化 selector 提交一次冻结 Query，等待明确的 success/refusal/timeout/no_result/challenge/cancelled 终态；
5. 仅捕获答案/Citation 区域和获授权 diagnostics，先最小化/脱敏，再以 create-only 语义写入 artifact 并计算 checksum；
6. 关闭 page/context，将所有阶段、耗时、selector 版本和终态证据写入 collector log。

base 不得自由浏览、修改 Query、跨入口探索、发送额外消息、点赞/评论/提交表单或执行其他外部写入，也不得让 LLM 决定点击、终态或数据提取范围。selector 或终态 detector 漂移返回 `PLATFORM_SELECTOR_DRIFT`；challenge 立即停止该平台。不得改用 API、搜索摘要或另一平台补数。

### 13.4 平台 adapter 与人工 fallback

ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews 与 Claude 分别拥有 adapter，每个 adapter 冻结：入口 allowlist、可支持 Profile 状态、selector/detector 版本、Citation 提取规则、可保留 artifact、禁止动作和平台特定停止条件。平台授权、帐号与 Smoke 结果不得互相继承。

人工 fallback 只在对应平台 authorization 明确允许时使用，并记录 operator role、逐步操作、时间、完整回答与 Citation raw。人工概述不得代替完整回答；manual 与 browser automation 比较最高为 `partial`，除非后续 Spec 及对应验收证据另行批准。

## 14. Tool/CLI 预期行为

未来 CLI 最小入口：

```text
answer-cycle.mjs validate --workspace <path>
answer-cycle.mjs plan --workspace <path> --plan <json>
answer-cycle.mjs collect-fixture --workspace <path> --plan <json>
answer-cycle.mjs collect --workspace <path> --plan <json> --platform <platform>
answer-cycle.mjs normalize-citations --workspace <path> --sample <SMP-ID>
answer-cycle.mjs review --workspace <path> --plan <json>
answer-cycle.mjs aggregate --workspace <path> --plan <json>
answer-cycle.mjs resume --workspace <path> --run <RUN-ID>
```

`collect-fixture` 只允许 `.invalid`/Workspace-local 录制输入。`collect` 是 M5 设计的真实入口，但只有在 Playwright package/browser 与对应平台 authorization/adapter/Smoke 全部通过后才可执行；必须由 `--platform` 选择已注册 adapter，不接受通用 URL，不得绕过 allowlist。M5 不提供外部榜单 import 命令。

## 15. 错误与 warning

错误至少包括：

```text
M5_FIELD_REQUIRED
PROFILE_NOT_FROZEN
PROFILE_FINGERPRINT_MISMATCH
COLLECTION_AUTHORIZATION_REQUIRED
PLAYWRIGHT_GATE_NOT_APPROVED
PLAYWRIGHT_RUNTIME_MISMATCH
BROWSER_BINARY_UNAVAILABLE
PLATFORM_ADAPTER_NOT_FOUND
PLATFORM_ADAPTER_INVALID
PLATFORM_ALLOWLIST_VIOLATION
PLATFORM_TERMS_BLOCKED
SAMPLE_SLOT_CONFLICT
SAMPLE_NOT_INDEPENDENT
RAW_ARTIFACT_REQUIRED
RAW_ARTIFACT_CONFLICT
PRIVACY_SCOPE_VIOLATION
CITATION_URL_INVALID
SOURCE_REF_REQUIRED
SOURCE_IDENTITY_CONFLICT
SOURCE_CANDIDATE_UNOBSERVED
CITATION_SOURCE_PAIR_INCOMPLETE
SOURCE_CLASSIFICATION_CONFLICT
CLAIM_SUPPORT_INCOMPLETE
RUBRIC_DRIFT
ANALYSIS_CHAIN_INCOMPLETE
AGGREGATION_INPUT_DRIFT
COMPARABILITY_FALSE
LEASE_ACTIVE
LEASE_STALE_RECOVERY_REQUIRED
SAMPLE_TERMINAL_STATE_UNKNOWN
PLATFORM_SELECTOR_DRIFT
EXTERNAL_RANKING_IMPORT_FORBIDDEN
M4_PUBLICATION_REQUIRED
```

warning 至少包括：

```text
PROFILE_FIELD_UNKNOWN
MANUAL_FALLBACK_USED
NO_CITATIONS
SOURCE_TYPE_UNKNOWN
SOURCE_IDENTITY_UNRESOLVED
CLASSIFICATION_REVIEW_REQUIRED
CLAIM_SUPPORT_REVIEW_REQUIRED
COMPARABILITY_PARTIAL
```

## 16. 测试与验收范围

离线实现必须先以失败测试覆盖：

- 新对象 Schema、未知字段、空集合、ID/status/refs/version/checksum；
- Profile fingerprint、unknown 与 frozen/new-ID 规则；
- 三个 slot、独立会话、全部 outcome、system failure retry 与失败保留；
- raw create-only、半成品恢复、隐私禁止字段和 artifact unavailable；
- Citation URL/domain 规范化、重复引用、无 Citation 和无效 URL；
- Citation 触发 Source 匹配/创建、双向 ref 预分配/闭包/半成品恢复、host/publisher/channel/page identity、new/returning 派生、无观测候选拒绝和外部榜单导入禁止；
- 五层主/副标签、party relation、host 不等于类型、低置信度与人工门；
- Citation 与 Claim Support 分离、Rubric 重评且 raw 不变；
- 五项指标的精确 Fixture、排序、零分母、coverage 和 volatility；
- comparability true/partial/false 与 unknown；
- lease、heartbeat、stale recovery、双进程、取消、故障注入和 supersede；
- API/探索/正式 UI 隔离、Baseline/Retest 前置和 Playwright gate；
- Playwright 每 attempt 隔离 context、allowlist、版本化 selector/终态漂移、artifact 最小化、平台 adapter 隔离和 manual fallback 可比性；
- M2–M4、插件、Workspace/index、trace、warnings、文档链接与 legacy 120 回归。

真实平台、浏览器二进制、账号登录、选择器实时稳定性和跨宿主 Smoke 不属于未批准的离线 Fixture 验收；但它们的实现合同、验收门和失败语义属于本 Spec 的 M5 必须设计。

## 17. 非目标与当前授权

本 Spec 完整设计 Playwright base、逐平台真实 collector 与持续信源维护。Owner 已授权 T02—T08，并授权五个平台使用 Owner-controlled Google 登录身份、真实用户隐私最小化与本地 365 天保留；该账号授权不能覆盖平台 Terms、robots、challenge 或安全控制。ChatGPT/Gemini 已各完成 1 个 manual exploratory Smoke。Adapter 不再保存或强制 `written_permission_ref`；平台许可只进入 Requirements 需求池，`planning_state:待规划`，是否开启后续规范仅由 Owner 决定。当前真实自动采集仍由各 adapter 的 `terms_blocked/manual_only` 状态控制。不授权 M4 业务对象补写、GA4/GSC、外部写入、commit、push、PR、发布、部署或 Git 远端动作。外部榜单、API 样本和探索性回答均不能创建持续 Source 候选或替代正式消费者 UI 数据。
