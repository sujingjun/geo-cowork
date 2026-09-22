# MyyShop 正式真实双周期操作手册

- 状态：implemented
- 创建/更新：2026-09-20
- 来源：[Spec 0015](../specs/0015-authorized-real-two-cycle.md)、[Plan](../plans/2026-09-20-authorized-real-two-cycle-plan.md)
- 范围：同一 MyyShop Workspace 的真实采样、Owner 决定、发布读回、四周观察与第二轮；不自动发布外部内容。

## 当前暂停

Owner已明确要求真实业务周期先不推进，知识批准为defer；当前执行计划 `execution_paused:true`，heartbeat为PAUSED。下文描述明确恢复后的操作能力。只有Owner明确恢复，才解除两处暂停并重核业务前置；不得把恢复执行当成事实批准。

## 入口

从仓库根目录运行，配置仍由根 `.env` 或显式 `GEO_ENV_FILE` 读取，不在输出或业务工件中保存凭据。

```bash
node plugins/geo-expert/scripts/geo-lifecycle.mjs preflight --workspace workspaces/myyshop
node plugins/geo-expert/scripts/geo-lifecycle.mjs inbox --workspace workspaces/myyshop
node plugins/geo-expert/scripts/geo-lifecycle.mjs start --workspace workspaces/myyshop
node plugins/geo-expert/scripts/geo-lifecycle.mjs continue --workspace workspaces/myyshop
node plugins/geo-expert/scripts/geo-lifecycle.mjs report --workspace workspaces/myyshop
```

`preflight/inbox` 零写；`report` 只更新派生报告。`start` 在知识缺席时准备审核包；它不自动批准事实或创建尚未就绪的 Cycle。Agent 根据工具提供的下一动作续跑；出现 `waiting_window` 按真实时间等待，出现 `waiting_human` 展示具体材料，出现 `needs_input` 处理具名数据缺口。

## Owner 知识与业务决定

Owner 阅读 `reviews/packages/*.md`，在当前任务表达采用、修改、拒绝或延期及原因。Agent 原样记录原始决定，补齐包与校验字段，通过 `apply-feedback --file <feedback.md>` 执行。不要修改原审核包，不要复制演练反馈。修改建议须指明对象与修改文本；多候选目标须明确“下一目标”。错误选择在最终决定持久化前拒绝。

已批准 Claim 的证据不足和范围限制不随 KBASE 建立而消失。首轮现有资料仍可能只支持 Evidence Gap；相应建议用于索取政策、能力覆盖、数据或案例，不构成可发布文案。新增 Evidence/Claim/Release 需新批准和明确版本处理，不能直接更改已冻结 Cycle 的输入。

## 正式答案

真实 Cycle 冻结后，`continue` 返回缺失槽位和人工待办。三平台 MCP 调用每次最多提交一个槽，跨槽至少间隔120秒；返回 progress 后继续，节流返回后等待，不生成重复 Run。未知提交仅恢复原页面/提取，不能重发。

Google AI 与 Claude 由 Owner 在独立新会话提交冻结 Query 并提供完整原始答案、引用、实际时间、原始结果URL与浏览器条件。Agent 将其绑定工具生成的槽位，调用：

```bash
node plugins/geo-expert/scripts/geo-lifecycle.mjs receive-answer --workspace workspaces/myyshop --file <bound-capture.json>
```

未知浏览器条件如实保存。拒答、无结果与挑战不替换为成功；完成判断依据观察证据，不能凭工作区中“有两个文件”。提取与语义处理使用真实 DeepSeek，原文、引用和模型审计可复核。

## 发布与技术复测

Site Owner 执行实际发布。Agent 接收 locator、published_at、actor、adoption_ref、item_ids，生成真实 receipt 后调用 `record-publication`。完整已采用 `proposed_text` 必须在真实页面读回；Receipt 先产生待确认 draft，Owner 再确认真实发布结果，不能拿事前建议批准当事后回执。

确认后 `continue` 执行既有 M4 九项技术检查，保存 HTML、robots、sitemap、manifest、检查结果与局限。technical completed 表示检测执行完成，报告仍可能有失败或不可验证项。W1–W4 从持久化实际完成时间建立，恢复不挪动时间锚。

## Analytics 与自动续跑

每日北京时间10:00的当前任务 heartbeat 只处理到期动作，无变化不通知；有新结果、失败、完成或人工待办时通知。人工待办不由自动化代答。四周的采样窗口与 GA4/GSC 自然日统计分别保存；默认等待3天数据延迟。未到期或漏过窗口均不得倒填。

GA4/GSC ADC 过期时通过现有 Google 登录流程刷新，保持现有只读资源范围。先核对 GA4 属性时区；注册事件须有独立业务定义、批准和校验过的实际证明。`sign_up` 等事件名只是候选，不自动算作本产品已验证注册。Unknown、zero、unavailable、negative 与误差分别呈现。

数据合同使用 [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport) 和 [GSC Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)。原固定 smoke 合同继续保留，不能通过改写旧日期/授权来伪装新窗口。

## 完成与核验

```bash
npm run test:real-cycle
npm test
npm run format:check
npm run check:docs
npm run validate:plugin
```

真实 Cycle 1 Review 决定后才生成第二轮候选；独立选择、批准新 Goal 和知识切片，再进入 Cycle 2。完成两个真实 `completed/full` 且 Trace 无缺口后停止 heartbeat。工程通过、真实输入可用、周期完成、业务效果与发布范围在 Record 中分别记录。
