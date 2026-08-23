---
title: M4 Diagnosis, Site & Asset Proposal Handoff
status: proposed
created: 2026-08-24
working_directory: /Users/sujingjun/geo-cowork
baseline: main @ 4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd with uncommitted M2/M3 changes
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
  - docs/specs/0004-knowledge-query-operating-system.md
scope: M4 SDD 启动、诊断/站点/资产建议提案边界与真实业务输入门
---

# M4 Diagnosis, Site & Asset Proposal Handoff

## 1. 唯一目标

在 M2/M3 已验证的本地工程基线上，为 M4 建立 Requirement、PRD、Architecture、Spec 0005、Plan 与 Task，经人类批准后再实现“诊断 → Content/Evidence/Product Gap → Own/External Asset 建议稿”的最窄纵切。Handoff 本身不是 M4 批准，不包含任何预制 Finding、Gap、Asset、业务结论或发布决定。

## 2. 新会话与同环境硬门

此前精确 `gpt-5.5-sol-max`、标准速度的新任务创建被当前任务接口拒绝，未产生新任务。自动创建路径当前为明确阻塞；只有用户手工打开且系统实际确认满足精确配置的新会话，或 Owner 另行修改硬门，才可继续。不得由 Agent 自选替代模型。下一次若再次移交新任务：

- 必须由系统实际确认精确模型/速度，不接受近似、别名推断或静默降级；
- 必须打开 `/Users/sujingjun/geo-cowork` 当前 `main` 脏工作树，不新建 worktree、不切换到干净 checkout；
- 必须看到 HEAD `4f4a1a831ca05719b1d3ff0a3e5519f3acc31fbd` 与本 Handoff、M2/M3 全部未提交文件；
- 先执行只读预检，任一项不一致即停止写入并向 Owner 报告。

当前接口无法满足精确配置时，M4 执行状态保持 blocked；Handoff 交付完成不等于 M4 已获启动条件。

建议只读预检：

```bash
pwd
git branch --show-current
git rev-parse HEAD
git status --short --branch
node --version
npm --version
npm ls --depth=0
npm run test:m2-contract
npm run test:m3-knowledge-query
```

除本 Handoff 自身外，当前 M2/M3 脏工作树必须通过以下冻结指纹；它同时检查 tracked 修改和逐文件展开的 untracked 内容。预期路径数与聚合 SHA 见本节末尾，任一不一致都要停止：

```bash
set -o pipefail
git status --porcelain=v1 -uall \
  | sed -E 's/^.. //' \
  | grep -v '^docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md$' \
  | LC_ALL=C sort \
  | while IFS= read -r file; do
      test -f "$file" || exit 1
      printf '%s\0' "$file"
      shasum -a 256 "$file" | awk '{print $1}'
    done \
  | shasum -a 256
```

- 预期路径数：`125`
- 预期聚合 SHA：`21eae73d14cd22103b1f50343c067e5304535cf18c0422ee8ec8e8bef84ad6b1`
- `package-lock.json` SHA：`8b94eb852ca87fb388da6c7ff1ab7dcd7bbc0dd89880491b99fb57b71547eac8`
- 另行核验 MyyShop index aggregate 与 legacy current/HEAD aggregate，以 M3 Record 的命令与期望值为准。

## 3. 已验证、可继承的本地事实

以 M3 Record 为准：

- M2 专项 25 tests、M3 专项 10 tests、全量 47 tests 通过；
- 插件自检 38 项通过；MyyShop object validator 通过；
- 13 个 canonical 对象与 120 个 legacy entries 可重建为 15 个确定性 indexes；
- `Q-MYYSHOP-WHAT-IS-001` 的关系 trace 可到 Goal/Set/Answer/Claims/Evidence/Sources/Document/Release；
- trace 明确返回 `lifecycle_ready:false` 与 9 个 gate；
- 两条 Claim 的 Evidence Sufficiency 均不足；
- 120 条 legacy knowledge 与 HEAD 原始字节一致；
- 没有 commit、push、PR、真实采集、业务批准、发布或部署。

## 4. 真实 M4 输入门尚未通过

下列对象是准备材料，不是可启动真实 GEO 诊断的批准输入：

| 对象 | 当前状态 | 进入真实 M4 前至少需要 |
| --- | --- | --- |
| `GOAL-MYYSHOP-DEFINITION-001` | candidate | Owner 可追溯批准，并进入 approved/active |
| `Q-MYYSHOP-WHAT-IS-001` | candidate | 人工确认语义、来源与优先级后成为 formal |
| `QS-MYYSHOP-DEFINITION-001` | draft | formal Query、精确版本、内容哈希、freeze metadata 与人工 approval |
| `EVD-MYYSHOP-LEGACY-DEFINITION-001` | candidate | 足够的一方事实/数据或案例 Evidence；当前 legacy/product-plan snapshot 不够 |
| `DOC-MYYSHOP-WHAT-IS-001` | draft | 事实 Owner 审核范围与来源后批准 |
| 两个 `CLM-*` | candidate/insufficient | 补证、review、approval；不得跨门宣称 published |
| `ANS-MYYSHOP-WHAT-IS-001` | candidate | formal Query、approved Claims、人工批准 |
| `KR-MYYSHOP-DEFINITION-001` | draft/incomplete | approved 闭包、`readiness:ready`、人工发布决定 |

只有 approved/active Goal、formal Query、frozen Query Set 和 published Knowledge Release 的一致版本同时成立，才具备真实 M4 基线诊断资格。Agent 不得代替 Owner 写 `approval` 或提升状态。

## 5. M4 SDD 必须先建立

第一执行阶段只建立并请求批准：

1. `docs/requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md`
2. `docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md`
3. `docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md`
4. `docs/specs/0005-diagnosis-site-asset-proposal.md`
5. `docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md`
6. `docs/tasks/2026-08-24-m4-diagnosis-site-asset-proposal.md`

这些工件保持 `proposed`，直到 Owner 明确批准。必须把实现准备、真实 MyyShop 诊断、建议采用、发布与效果复测分成独立门。

## 6. 建议的 M4 最窄纵切

### Slice A — Finding/Asset/Gap 契约

- 复用 M2 Finding/Asset/Evidence，不另造综合 GEO 分；
- 明确定义 Content Gap、Evidence Gap、Product Gap 的输入、反例、证据闭包和人工决策边界；
- 所有 observed Finding 必须有 Evidence，inferred/unverifiable/blocked 不得伪装成观察事实。

### Slice B — `geo-site` 确定性技术诊断

- 先用 `.invalid` 或本地 Fixture 覆盖 HTTP、canonical、robots、sitemap、Schema 语法、title/meta/heading presence 与 crawlability；
- 只复用本仓 `plugins/geo-expert/scripts/lib/legacy-ops-geo.mjs`、对应 M2 合成 Fixture/测试已经验证的 snapshot、manifest、SHA、item_state 与版本语义；上游 `ops-geo` v2 只有计划，不读取、复制或声称复用其未实现代码，也不继承综合总分；
- 若需要 Crawlee、Playwright 或外网采集，必须在 Spec 与授权门后引入。

### Slice C — `geo-reputation` / `geo-competitor` 研究输入

- Source 可访问性、原文、Evidence、独立支持和置信度分别记录；
- 登录、403、challenge、无原文均标为 blocked/unverifiable；
- 不自动社区发帖、评论、媒体联络或竞争对手结论。

### Slice D — Asset 级完整建议稿

- 同一批准 KR 派生 About、Homepage、FAQ、Organization Schema、llms 文件或 Answer Card 建议；
- Claim 未批准或 Evidence 不足时允许生成带风险段的建议稿，但不得用模型推测补事实；
- Adoption Record 以建议项记录 `accepted/modified/rejected`，人工采用与实际发布另设门。

## 7. 禁止静默扩张

未获得当次明确授权前，不得：

- 对 MyyShop 真实站点、GA4、GSC、消费者生成式平台或内部业务系统采集；
- 创建真实业务 Finding、Gap、Asset 定论或把候选内容写入外部系统；
- 调用付费模型/第三方 API、自动发布、CMS 写入、社区运营；
- 把 M3 产品方案 Source 当 approved business Evidence；
- 自行批准 M4 PRD/Spec、MyyShop 对象或发布决定；
- commit、push、PR、merge、部署或发布。

## 8. 已知设计限制

- 当前 canonical graph 在一个 checkout 中只保留每个 stable ID 的一个当前版本；精确 pin 能阻止漂移，但不能同时解析同 ID 多 revision。若 M4 需要并行读取旧、新版本，先立单独 revision-history Spec/Task。
- Claim 历史状态顺序没有 append-only transition ledger；M3 validator 只能验证当前目标状态的前置。M4 不得把当前字段反推成完整审批历史。
- propose 的确定性冲突可预检；意外 I/O 不是跨文件事务，恢复依赖 create-only 幂等重试与 Run 记录。

## 9. M4 验收与出口

M4 Record 至少应分别证明：

- Schema/Tool 正常、非法、边界、路径、checksum、refs、幂等与故障恢复测试；
- 合成 Site/Asset/Gap Fixture 的确定性结果，不含虚假真实结论；
- 若 Owner 之后批准真实 MyyShop 输入，真实诊断的每条 Finding/Evidence/Asset trace；
- suggestion、Adoption、实际发布、Technical Retest 与业务观察仍为分离状态；
- M0—M3 全量回归、插件自检、Workspace/index 确定性和 legacy 不变。

出口 Handoff 只能交给 M5 或后续真实执行门，不能凭代码测试声明建议已采用、页面已发布或 GEO 效果成立。
