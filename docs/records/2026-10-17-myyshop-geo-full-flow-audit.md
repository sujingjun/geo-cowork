# MyyShop「what is myyshop」完整流程试跑与能力缺口

- 状态：verified（本次诊断、有限真实试跑与缺口记录）；正式 GEO 闭环未完成。
- 创建/更新：2026-10-17
- 来源：用户要求以 `/Users/sujingjun/dhnb/oneglanse` 的改动为准，尝试 `what is myyshop` 的整体流程并记录能力缺口；随后明确允许复用已有 Gemini 登录凭证。
- 工作目录/基线：cowork `/Users/sujingjun/geo-cowork`，`main@eb8512a`；OneGlanse `/Users/sujingjun/dhnb/oneglanse`，`feat/mcp-stdio@b2c6e73`，均有未提交实现。
- 关联：[OneGlanse 计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)、[首次接口联调](2026-10-17-oneglanse-mcp-integration-record.md)、[Spec 0014](../specs/0014-knowledge-driven-geo-e2e.md)、[Spec 0015](../specs/0015-authorized-real-two-cycle.md)。
- 适用范围：当前源码的一个 Gemini Query、MCP 完整接收、正式知识准备的临时回放、官网只读采集、实际模型诊断和各阶段入口检查。未批准知识、采用、发布或恢复正式 Cycle。

## 1. 结论

**接入采集后，当前工程仍未形成正式 GEO 闭环。** 已具备知识对象、候选答案卡/知识包、采集与 MCP 接收、网站检查和模型诊断的基础能力；本次确实完成了从当前 OneGlanse 新回答到候选 GEO 建议的有限链路。

当前缺少从 OneGlanse intake 到正式 Sample/Source/Review/周期的接续实现及适用证据合同。真实 KBASE、所选真实 Release 与知识证据也未就绪。因此，可以开始正式知识库建设的准备和审核，不能把当前状态表述为已经具备可直接运行的正式知识库 GEO 闭环。

实现依据：[OneGlanse 接收](../../plugins/geo-expert/scripts/lib/oneglanse-intake.mjs)、[正式采样](../../plugins/geo-expert/scripts/lib/real-sampling.mjs)、[知识构建](../../plugins/geo-expert/scripts/lib/knowledge-query.mjs)、[正式诊断](../../plugins/geo-expert/scripts/lib/real-diagnosis.mjs)。

本次下游诊断由 Agent 调用既有能力并显式组装输入完成。它证明这些步骤可以组合使用，不证明插件已有自动接续的正式工作流。`oneglanse.mjs analyze` 本身仍是原始完整性、品牌提及和来源列表分析；真实语义诊断是本次另行调用的 `model-client.mjs/chatJSON`。

## 2. 当前源码和运行归属

采集 Agent、MCP Server、共享 Services、构建产物、本次运行进程及会话目录均位于 **`/Users/sujingjun/dhnb/oneglanse`**。MCP 启动配置仍由 cowork 私有连接文件引用该项目发布的 stdio 入口；没有跨仓源码 import。

- Agent：`apps/agent/src` → `apps/agent/dist/index.js`。
- MCP：`apps/mcp/src` → `apps/mcp/dist/index.js`。
- Services：`packages/services/src`。
- 当前采集源码快照标识：`b2c6e73+source-e252c1b710a3`。
- Python/Camoufox 环境：当前目录 `.oneglanse-storage/python`，使用既有固定依赖 `cloverlabs-camoufox==0.5.5`。
- 登录凭证按用户本次明确要求一次性导入当前 `.oneglanse-storage/auth`；没有复用另一 checkout 的源码、Agent 构建或运行进程。

首次联调记录中的另一 checkout 只保留为历史过程证据，不再作为当前插件采集实现的验收基线。当前配置已移除对其登录目录的持续引用。

## 3. 按流程实际执行的结果

| 环节 | 实际执行 | 结果与边界 |
| --- | --- | --- |
| 正式入口预检 | `geo-lifecycle.mjs preflight` | `real_cycle_start_ready:false`、`safe_to_create:false`；KBASE 缺失、真实 Release 未批准、执行暂停、GA4 时区未确认。 |
| 既有知识校验 | `knowledge-query.mjs validate` | 0 errors；两个既有 Claim 仍缺 first-party，其中生命周期能力另缺 data/case。 |
| 英文 Query 追溯 | `knowledge-query.mjs trace --query Q-MYYSHOP-WHAT-IS-EN-BASELINE-001` | 返回 `TRACE_INCOMPLETE`；当前正式对象中该英文 Query 未连到完整 Answer Card/Release 链。 |
| 知识构建回放 | 在自动清理的临时副本执行 `propose`、`assemble-release`、`trace`、`validate` | 4 个命令退出码均为 0；生成 1 个 candidate 英文 Answer Card、1 个 draft/incomplete Release，完整关系可追溯，`lifecycle_ready:false`。未激活真实 KBASE、未写正式知识对象。 |
| 公开资产采集 | 现有 `collect-public-site.mjs`，仅首页、About、robots、sitemap | 4/4 实际 HTTP 200，原文/hash 落盘。公开页面观察不自动成为已批准 Evidence。 |
| 网站技术检查 | 现有 `evaluateSiteManifest` | 首页 7/9 pass；About 6/9 pass。两页 HTTP 原文均未发现 canonical，About 无 h1–h6；crawlability 随依赖条件 fail。未验证浏览器渲染后 DOM。 |
| 当前 OneGlanse 采集 | 当前 Agent，1 prompt × Gemini，原生重试策略不变 | MCP 只启动 1 个 job；原生前两次报告提交失败，第 3 次成功。无法据此确定平台实际接收次数。 |
| MCP 结果接收 | prepare → start → status → receive → analyze | completed，1 条新回答、0 条存储来源；1,151 bytes，与 OneGlanse 已存结果 SHA-256 一致。 |
| OneGlanse 默认分析 | 当前 `.env` 的 `gpt-5.4` / Responses / 已配置网关凭据 | 原生后台分析失败；独立受限诊断返回 `Connection error.`，未取得 HTTP 状态。该新回答的原生分析记录数为 0。不能沿用旧环境“缺密钥”的原因。 |
| cowork 实际语义诊断 | DeepSeek 对新回答、当前官网快照、两个既有批准声明作候选分析 | 成功生成 4 个观察、4 个建议及知识表述草案；全部回答引用能在原文找到，Claim refs 属于输入集合。所有结果仍为 candidate。 |
| 正式周期推进 | `geo-lifecycle.mjs continue` | 实际返回 `REAL_EXECUTION_PAUSED`；没有擅自解除历史业务暂停。 |
| 正式 M4 诊断输入 | `realDiagnosisInputs` | 实际返回 `BASELINE_REQUIRED`，要求已审核的正式 Baseline。工程 intake 没有被伪装为该 Baseline。 |
| 采用、发布、复测、业务观察、Review | 无可用的本次正式 Baseline/采用决定/Publication | 未执行；未假造 Owner 决定、发布回执或 W1–W4 时间。 |

知识临时副本已删除，输出通过 [draft bundle](../../workspaces/myyshop/runs/RUN-GEO-FLOW-MYYSHOP-20261017-01/outputs/knowledge-draft-bundle.json) 保存为可审阅文本，不进入真实工作区对象索引。原有 KBASE/Cycle/Publication 数量仍为 0。

## 4. 当前采集与模型证据

- Query 原文：`What is MyyShop?`；明确使用已有 `normalized_text=what is myyshop`，来源 `Q-MYYSHOP-WHAT-IS-EN-BASELINE-001@1.0.0`。
- 原生 job：`05b614de-3647-4907-b87b-4e63495a368d`。
- 原生 response：`fd5dc1e6-e872-48f2-b0dc-70ebae4aca9b`。
- 原生执行约为北京时间 16:24:33–16:25:54。
- JSON 字节数：`1151`；SHA-256：`6e62e28c1a4e2aac031d0de20e977fec6a745b2c5da07568322e21dc1ba02b78`。
- [当前 MCP intake](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-02/oneglanse-intake/received.json)、[完整原始回答](../../workspaces/myyshop/runs/RUN-ONEGLANSE-MYYSHOP-20261017-02/oneglanse-intake/responses/6fc8f5cc8a5674a9e0efeb2fe4c25cae27b9dd7e919eaf2228c204f80a3cae45.json)。
- [模型诊断及输入引用](../../workspaces/myyshop/runs/RUN-GEO-FLOW-MYYSHOP-20261017-01/outputs/semantic-review.json)，成功调用 `MODEL-1507e472-517f-4cfa-9a58-0bc9514110ad`，DeepSeek `deepseek-flash`，HTTP 200、finish=stop、5,601 tokens。
- 首次诊断由本次脚本设置 `maxTokens:4096`，返回 finish=length；恢复为现有客户端默认的 8,192 上限后，从同一已保存输入重新分析成功。原失败审计保留，没有重新提交平台 Query。这是本次试跑参数修正，不据此认定产品缺少模型能力。

新回答将创作者营销与跨境电商、建店、货源和供应链描述并列。当前官网快照强调创作者营销、品牌合作与变现工具；既有批准声明的范围更概括，且证据充分性不足。模型建议分别澄清定位、索取能力与适用条件证据、单列建店/跨境/供应链待证事项、说明来源覆盖未知。没有据此宣称旧业务已经停止、模型事实一定错误或 GEO 效果已改善。

## 5. 能力缺口清单

| 编号/优先级 | 缺口类型与责任 | 本次依据 | 最小下一步与验收 |
| --- | --- | --- | --- |
| G01 / P0 | **cowork 工程对接**：OneGlanse intake 未接入正式 Sample、Source、Review 和 Cycle | 正式模块仍调用原 Playwright 路径；本次只有 intake/候选分析，正式诊断返回 BASELINE_REQUIRED。 | 在既有 Skill/共享工具中补最薄的适配和物化路径；用真实可提供字段通过正式合同验证。不得新造 occurrence、独立会话或 job 强绑定。 |
| G02 / P0 | **知识数据与审批**：真实 KBASE/选定 Release 未激活，英文 Query 关系缺失 | 初始 TRACE_INCOMPLETE；临时生成后链完整但 candidate/draft 审批门仍在。 | 基于现有 approved Document 审阅英文 Answer Card/Release；补一方证据和能力/地区/资格资料，明确激活哪个真实知识版本。不能用模拟审批完成。 |
| G03 / P1 | **采集证据合同**：sources 空值语义、引用覆盖、模型版本、新会话、实际提交时间、slot、job 绑定不完备 | 当前回传 sources=[]；Server 显式声明上述 unknown/unsupported，正式采样合同需要更多证明。 | 明确首版受限观察可用于哪些 GEO 阶段；正式采样需要的新增证明另列范围。完整回传只保证已保存字段，不能升级为原页面采集完整。 |
| G04 / P1 | **OneGlanse 运行配置/连通性**：默认模型分析未成功 | 本仓凭据存在；原生调用及受限探针均失败，探针为 Connection error，新回答分析行数 0。 | 验证当前网关网络与协议路径；成功分析已保存回答即可，不应重采 Query。未确认是凭据错误，不自动换模型或复制其他项目密钥。 |
| G05 / P1 | **OneGlanse 可观测性**：collection completed 与模型分析成功没有同一状态证据 | 三条后台分析失败后仍出现 Background analysis completed；MCP run.status 只回传采集进度。 | 向调用方明确分析结果状态/错误来源；沿用已有服务数据，不新建任务引擎。采集完成不得作为分析成功。 |
| G06 / P1 | **正式业务启动条件**：暂停、五平台/双槽 Baseline、GA4 时区及注册定义未满足 | preflight 阻塞、plan 中时区/事件定义为空、单次 Gemini 不满足正式采样。 | 按实际业务决定和证据逐项补齐；需要恢复时明确解除暂停并重新 preflight。审批和真实时间窗口不是工程可自动消除的错误。 |
| G07 / P1 | **站点待核实问题**：当前 HTTP 文本 canonical/heading 检查失败 | 首页和 About 无 canonical；About 无 heading。 | Site Owner 复核服务端与渲染后页面、确定修复；本次未改网站，技术结果不证明商业影响。 |
| G08 / P2 | **采集稳定性/次数解释**：本次原生第 3 次才成功 | Agent 原生日志；MCP 无额外启动。 | 保留原生重试证据，不能承诺平台 exactly-once；如需改进提交确认，再由 OneGlanse 单独审查采集能力变更。 |

本次已关闭的环境问题：当前 Agent 构建、当前 Python/Camoufox 准备、登录凭证导入、MCP 绑定当前 auth root。它们不再是源码归属缺口。上表中的业务审批/数据条件、首版明确未承诺的采集证明与新增工程适配分别管理。

## 6. 完整流程的实际停止位置

```text
已有批准 Document/Claim
  → 临时生成 candidate 英文 Answer Card / draft Release（通过；待审核）
已有 Query
  → 当前 OneGlanse 原生采集（通过，内部 3 次尝试）
  → MCP 原始答案完整接收（通过，sources=[]）
  → 官网观察 + DeepSeek 候选诊断/建议（通过，尚未物化正式对象）
  → 正式 Sample/Review/Source/Cycle（缺适配与必要证据；KBASE 未激活）
  → 正式 M4（BASELINE_REQUIRED）
  → 人工采用/真实发布/复测/业务观察（未进入）
```

本次没有修改采集算法、正文/来源提取、内部重试、正式合同或批准状态；没有 commit/push/PR、飞书、对外发布或远端部署。当前生效的真实周期暂停保持不变。

## 7. 收尾检查

- 当前 Agent 及依赖构建：6/6，退出码 0。
- cowork `npm run test:oneglanse`：6/6；OneGlanse MCP：8/8；Services MCP 保存/运行测试：7/7。
- `workspace-validate.mjs --objects` 无错误；`build-index.mjs --check` 保持 1052 个对象、120 个 legacy、无写入。
- 知识校验前后均为 0 errors、2 个既有证据充分性 warning；正式 preflight 前后四个 blocker 完全一致，`formal_cycle_created:false`。
- 两仓 `git diff --check` 通过；OneGlanse `apps/agent/src` 没有本次采集算法改动。当前 Python/auth 路径已保存在该项目私有 `.env`，模型配置没有更换。
- 本次 Agent 已在队列为空、后台分析退出后正常停止，退出码 0；凭证和运行配置保留，MCP stdio 仍按客户端调用按需启动。
- 文档/Wiki/STATUS 已同步，未更新飞书镜像。保留失败原因和临时回放证据；不把检查通过计作正式业务验收。

候选建议可直接阅读 [建议文本](../../workspaces/myyshop/runs/RUN-GEO-FLOW-MYYSHOP-20261017-01/outputs/candidate-recommendations.txt)。后续最小工程优先级是 G01 的正式接续与 G03 的证据合同；知识批准和业务恢复由对应负责人决定。
