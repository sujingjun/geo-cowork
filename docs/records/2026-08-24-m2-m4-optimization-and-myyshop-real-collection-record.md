---
title: M2–M4 优化与 MyyShop 公开站点真实采集验收记录
status: verified
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ bd82473dd110ae8530159e3dc88812cfdd343df7
source:
  - docs/plans/2026-08-24-m2-m4-optimization-and-myyshop-real-collection-plan.md
  - docs/tasks/2026-08-24-m2-m4-optimization-and-myyshop-real-collection.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md
  - workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-site-detector-correction.md
  - "2026-08-24 当前用户指令：确认首批 allowlist、默认采集参数、raw 保留期限和人工 reviewer；完善 .env.example；执行 M2–M4 优化 Handoff 与真实采集"
scope: MyyShop 11 个公开端点的只读采集、五页 Site Run、第一方 Research Evidence、直接相关 M2–M4 优化与本地验收
---

# M2–M4 优化与 MyyShop 公开站点真实采集验收记录

## 1. 验收结论

本轮获授权范围已验证完成：实现显式同源 allowlist、限速、容量、超时/重试、重定向、脱敏、create-only 和恢复约束的公开 HTTP collector；于 `2026-08-24T20:24:33+08:00` 对 11 个获授权 MyyShop 公开端点各生成 raw、metadata 和 SHA-256；将五个 HTML 落地页运行 M4 Site audit，并将 11 份公开原文登记为待人工复核的 candidate Research Evidence。

本 Record 的 `verified` 只覆盖授权决定、当前工作树实现、公开快照完整性、确定性 Site/Research Run 和本地工程门。它不表示 11 份 Evidence 已被人工批准，不确认 Content/Evidence/Product Gap，不批准 Proposal、Adoption、Publication 或 Technical Retest，也不证明任何生成式平台已经抓取、引用或推荐 MyyShop。

GA4/GSC 本轮只完成 `.env.example` 配置契约。除公开的 GA4 Measurement ID `G-3HEVBJ08SH` 外，仍缺少 GA4 numeric Property ID、GSC 精确 property URI 和只读认证；没有读取任何 Analytics/Search Console 账号数据。没有登录、cookie、表单、消费者平台采样、外部写入、commit、push、PR、release 或 deploy。

## 2. 基线、授权与默认参数

- 工作目录：`/Users/sujingjun/geo-cowork`
- 开工分支与 HEAD：`main @ bd82473dd110ae8530159e3dc88812cfdd343df7`
- 开工远端关系：`main...origin/main [ahead 3]`
- 开工工作树：clean；本轮变更仍保留在本地脏工作树，未覆盖用户既有改动
- 授权事实源：[`../../workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md`](../../workspaces/myyshop/cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md)
- 精确 origin：`https://www.myyshop.com`
- 方法：只读 `GET`；不登录、不带 cookie、不提交表单
- UA：`geo-cowork-m4/0.3.0`；语言：`en-US,en;q=0.9`
- 并发 `1`；请求间隔 `1000 ms`；超时 `20000 ms`；最多重试 `2` 次；最多同源 allowlist 重定向 `5` 次；单响应最多 `5 MiB`
- raw 保留期：`90 天`；只是保留策略，不构成未来删除授权
- reviewer：`MyyShop Owner` 角色；角色登记不等于已完成审核

`.env.example` 已分别解释 Measurement ID 与 numeric Property ID、GSC Domain/URL-prefix property、Application Default Credentials 和只读 scope，并附 Google 官方获取地址；secret/token/cookie/凭据正文均不得提交。

## 3. 实际实现与直接优化

### 3.1 公开 collector 与输入桥接

- `public-site-collection-plan.mjs` 冻结真实 HTTPS origin、精确 allowlist、目标文件、预期状态/媒体类型与采集默认值；本地 HTTP 只在 `development_fixture:true` 下可用。
- `public-site-collector.mjs` 禁止调用方注入任意 header、认证或 cookie；每个重定向都重新校验同源精确 allowlist；响应按流限制大小，metadata 只保留响应 header 白名单。
- raw、metadata 与 summary 使用 create-only；完整工件恢复时先逐项核对 raw/metadata SHA、plan/target fingerprint，再核对 summary 与这些 metadata 的字节语义一致性，全程不发网络请求；任一半缺失、指纹/hash 或 summary 不一致都会显式冲突。
- `collect-public-site.mjs` 从任意当前目录读取显式 plan；`prepare-public-site-m4-inputs.mjs` 把已校验的 raw/metadata 映射成五组 Site manifest/plan 和一组 Research manifest/plan，不自动扩展 sitemap。

### 3.2 canonical 对象与文档可复验

- 新增 11 个精确 URL Source、7 个自有 Asset、11 个 candidate Research Evidence、五页当前 Site Run 和对应 scoped Evidence/Finding；Claims 与已批准 M3 Knowledge Release 均未被静默改版。
- 新增仓库级 Markdown 本地链接检查并纳入 `npm test`；插件 validator 检查新增 CLI/library。
- 修复 sitemap 合法 XML processing instruction 与根节点后 generator comment 的解析缺陷，detector 冻结为 `m4-site-detectors-v1.0.2`。旧首页 Run/Finding 保留为修复轨迹，当前首页事实只使用 `RUN-MYYSHOP-M4-SITE-HOMEPAGE-20260824-V102`。
- 较大的 registry、profile helper 和 Fixture 重构没有直接收益，未在本轮扩大范围；仍交由整体 Handoff 和 M5 独立评审判断。

## 4. 真实采集结果

Collection Run：`RUN-MYYSHOP-M4-PUBLIC-COLLECTION-20260824`；plan fingerprint：`0b813aa643e74272302f7d0702c2185332ebf83121f2e65c9d3577951e8c103e`。11/11 均为 HTTP 200，媒体类型符合计划，首次请求成功，无重定向；23 个工件为 11 raw + 11 metadata + 1 summary。

| target | bytes | SHA-256 |
| --- | ---: | --- |
| `/` | 81,328 | `d4e31e38b70d17083740e4a60c50159bdde2c97defe932a6b9db4fcbd09da467` |
| `/about-us` | 60,643 | `4dde7c1962f57c0038399f1fadb68723cc760b85fc58f0b1479b2f22b12caaed` |
| `/for-creators` | 64,510 | `4e3d941c17e63562dd11a1ef16cfbc13580a2e0bfe7c87259e54d31bbc63ba9a` |
| `/brand-deals-opportunies` | 59,077 | `7ede9ff46af61af4459c706cca93d29d7ee3e42b44019dda357be4ac8970b499` |
| `/earn-from-every-view-myyfinds` | 59,643 | `1dbc0200be0a4c18271e19ddf4d9de09cc9340d7521f67ab92abce2409e8fe2c` |
| `/robots.txt` | 959 | `61f72bad0b67837d7d85213ad4ee4f588bfa076bc06ff40260435a55df7051c4` |
| `/llms.txt` | 9,678 | `d5657c772c7ff0b4064bf27d80d1f466d11b246297680671894ba9cc788a5173` |
| `/llms-full.txt` | 59,727 | `85f95a7bcdb103a38655e63ab3fdb71e715d2c7c72a0bc55e4cefe6265ab4b4c` |
| `/sitemap_index.xml` | 466 | `c236bb1913fe5722129ac7334e3aa1f80d12fa0ce53fa7d8d5b70889196bda99` |
| `/__sitemap__/pages.xml` | 10,899 | `9a3e677d4d396a9cb4cdb6059a186749a343c640c520cc2a73a4a2d6f3075f72` |
| `/__sitemap__/blogs.xml` | 10,779 | `49a97542ec3f27145fb295222f2f4fa3c7c0601ccb85b9789499206fa73e38e7` |

完整恢复复验返回 `created:0`、`kept:23`、`item_count:11`、`expectation_failure_count:0`；collector 在 summary/raw/metadata 完整时没有再次访问网络。sitemap 内其他 URL、`llms*.txt` 中提到的登录/后台 URL 均未被自动采集。

## 5. M4 Site 与 Research 结果

### 5.1 五页当前 Site Run

| 页面 | 当前 Run | 确定性结果 |
| --- | --- | --- |
| 首页 | `RUN-MYYSHOP-M4-SITE-HOMEPAGE-20260824-V102` | `CANONICAL`、`CRAWLABILITY` fail；其余 7 项 pass |
| About | `RUN-MYYSHOP-M4-SITE-ABOUT-20260824` | `CANONICAL`、`HEADING_PRESENT`、`CRAWLABILITY` fail；其余 6 项 pass |
| For Creators | `RUN-MYYSHOP-M4-SITE-FOR-CREATORS-20260824` | 9/9 pass |
| Brand Deals | `RUN-MYYSHOP-M4-SITE-BRAND-DEALS-20260824` | `CANONICAL`、`CRAWLABILITY` fail；其余 7 项 pass |
| MyyFinds | `RUN-MYYSHOP-M4-SITE-MYYFINDS-20260824` | 9/9 pass |

HTML 原文显示首页和 About 缺少 canonical，About 还缺少 heading；获授权 Brand Deals 路径为 `/brand-deals-opportunies`，页面 canonical 指向 `/brand-deals-opportunities`，而 pages sitemap 仍包含获授权的拼写路径。正确拼写 URL 不在 allowlist，未追加抓取。上述只是不经人工业务判断的技术 Finding；没有自动提升为 confirmed Gap。

`robots.txt` 原文允许若干命名搜索/问答 bot 访问 `/`，同时对另一些 bot 和后台路径存在限制。该文件只证明采集时的声明文本，不证明平台实际抓取、索引、引用或回答行为。

### 5.2 Research Evidence 与 M3 边界

- `RUN-MYYSHOP-M4-RESEARCH-PUBLIC-WEB-20260824` 创建 11 份第一方公开原文 candidate Evidence；没有创建语义 Research Finding。
- Diagnosis validate 保留 11 条 `INDEPENDENT_SUPPORT_MISSING` warning，符合全部来源均为第一方的事实。
- Knowledge validate 仍保留两条既有 `EVIDENCE_INSUFFICIENT`：Audience 缺 `first_party`；Lifecycle Service 缺 `first_party` 与 `data_or_case`。candidate Evidence 尚未人工批准，因此 Claims 仍为 `1.0.1`，trace 继续只引用旧的已批准 Evidence。
- M3 trace 仍为 `lifecycle_ready:true`、`gates:[]`；这只表示既有内部 Knowledge Release 生命周期闭包，不把本轮 candidate Evidence 自动纳入，也不表示外部发布。

## 6. 失败测试与修复轨迹

| 红测/实际失败 | 最小修复与保留边界 |
| --- | --- |
| collector library 与 CLI 不存在，专项测试先以模块/入口缺失失败 | 建立 plan validator、collector 与 CLI；逐条满足 allowlist、redirect、size、timeout/retry、脱敏、恢复与冲突断言 |
| M4 input builder 与 CLI 不存在 | 只建立 collection metadata 到现有 Site/Research 合同的确定性桥接，不修改 M4 对象语义 |
| 文档链接检查入口不存在 | 新增只检查本地 Markdown 链接的最小脚本并纳入全量测试 |
| 首次真实首页 Site Run 把合法 sitemap processing instruction 判为 fail | 增加合成红测后修复；随后根节点尾部 comment 再次失败，再加回归并冻结 v1.0.2；旧 Run 不改写 |
| `v1.0.1` 首页计划仍被尾部 comment 阻断 | 在 materialize 前停止，没有生成半成品 Run/Evidence/Finding；用新计划和新 Run ID 生成 v1.0.2 当前结果 |
| 最终自审发现恢复只校验 raw/metadata 与 summary plan fingerprint，单独篡改 summary 未被拒绝 | 先加入稳定失败断言，再以已校验 metadata 重建期望 summary 并逐字段比较；真实 23 工件恢复复验仍为 `created:0`、`kept:23` 且不联网 |

## 7. 实际验证结果

| 检查 | 结果 |
| --- | --- |
| `node --test tests/m4-public-site-collector.test.mjs` | 6/6 通过 |
| `node --test tests/m4-public-site-inputs.test.mjs` | 1/1 通过 |
| `node --test tests/doc-links.test.mjs` | 1/1 通过 |
| `npm run test:m4-diagnosis` | 27/27 通过 |
| `npm run test:m2-contract` | 25/25 通过 |
| `npm run test:m3-knowledge-query` | 10/10 通过 |
| `npm test` | 75 tests、71 个顶层 subtest 全部通过，无失败/跳过/取消 |
| `npm run validate:plugin` | `ok:true`，60 个检查路径通过 |
| `npm run check:docs` | 53 个 Markdown 文件、92 个本地链接；errors 为 0 |
| Workspace object validate | `ok:true`；missing/errors/object_errors/warnings 均为空 |
| Diagnosis validate | errors 为空；11 条预期的 `INDEPENDENT_SUPPORT_MISSING` warning |
| Knowledge validate / trace | errors 为空；两条预期 sufficiency warning；trace `lifecycle_ready:true`、`gates:[]` |
| collection JSON / checksum | 28 个 JSON 均可解析；11/11 raw SHA 同时匹配 metadata 与 summary |
| node syntax | 8 个新增/修改脚本 `node --check` 通过 |
| secret 静态检查 | 126 个当前变更文件的高风险凭据模式命中 0；28 个 collection/input JSON 禁止字段/凭据模式命中 0；`.env.example` 非空敏感变量 0 |
| `npm ls --depth=0` / `npm audit --omit=dev` | `ajv@8.20.0`、`gray-matter@4.0.3`；0 vulnerabilities |
| index 双构建 | 两次均为 69 canonical、120 legacy、18 indexes、warnings 为空；按“相对路径 + NUL + 原始字节”聚合均为 `9046d9a3589b44b4a6c28f20f4c656c14d250d0afe02868d7e252c9fd7712a15` |
| legacy current/HEAD | 120 条路径和原始字节相同；按“相对路径 + NUL + 原始字节”聚合均为 `ddaab9c77a399ffcc3b3626e9308e7574469205cf5784c019540ec0c58ef65f8` |
| `git diff --check` | 通过 |

当前 indexes：13 Sources、7 Assets、22 Evidence、10 Findings、8 canonical Runs，共 69 canonical 对象和 120 legacy；10 Findings 包含首次错误 sitemap Run 的 3 条历史 Finding，读取当前站点结果时必须按 detector 版本和 Run ID 选择 v1.0.2。

## 8. 未验证、待人工决定与下一门

1. `MyyShop Owner` 尚未复核 11 份 candidate Evidence 的 Claim 支持范围、限定和风险；未确认任何 Gap 或内容动作。
2. GA4/GSC 账号读取保持 blocked。需要 numeric Property ID、精确 GSC property URI、只读授权和当次采集批准后，才能建立独立 Run。
3. 当前公开站点授权不延伸到 ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews、Claude、YouTube、Reddit 或其他外部平台。
4. 没有真实 Asset Proposal、Adoption、Publication 或 Technical Retest；M5 不能把本轮 Site/Research Run 描述成发布后效果。
5. M5 是否可进入由新的独立任务依据最终产品方案、本 Record 与整体 Handoff 重新评审；只有通过才制定 M5 里程碑计划，本 Record 不自行作出该批准。

## 9. Git 与交付边界

收口时仍在 `main @ bd82473dd110ae8530159e3dc88812cfdd343df7`，相对 `origin/main` ahead 3；工作树只包含本轮授权范围内的 SDD、实现、测试、MyyShop raw/canonical 对象、派生 indexes、Record/Handoff/导航变更。没有 commit、push、PR、merge、release、deploy 或任何外部写入。
