# Spec 0015 — MyyShop 正式真实双周期

- 状态：approved
- 创建/更新：2026-09-20
- 来源：Owner 在本任务明确要求实施《MyyShop 两个正式真实周期：缺口补齐与执行方案》；后续明确委派 GPT-6 Astra xhigh，由主 Agent 最后验收。
- 关联：[实施计划](../plans/2026-09-20-authorized-real-two-cycle-plan.md)、[Spec 0014](0014-knowledge-driven-geo-e2e.md)
- 适用范围：同一 MyyShop Merchant 的两个真实 Cycle、本地实现、真实只读输入和当前任务自动续跑；不含自动 CMS 发布或 Git 远端操作。

## 1. 入口与真实范围

保留 `geo-lifecycle`，新增 `preflight`、`receive-answer`、`record-publication`。`online/authorized_real` 使用真实编排；development-test 保留演练隔离。`preflight/inbox` 零写，`report` 只更新派生报告。授权校验在业务恢复和写入之前完成；原始数据、业务决定与快照分别保存。

真实 `start` 在知识缺失时准备可读审核包，不创建 Cycle。Owner 批准后才能物化 real KBASE、英文 Answer Card 和 Knowledge Release。沿用既有有效批准与证据不足提示，不把 120 条 legacy 条目批量升级。启动检查精确选择本轮 Query Set，验证 release membership、Claim/Document/Evidence/Source 闭包。

底层真实 `create-cycle/createCycle` 同样必须绑定执行runtime、当前授权与相同Cycle/Run/Goal/Query Set/KBASE；不能仅凭knowledge ready创建未接入运行能力的孤立Cycle。第二轮还校验前一真实Review、候选选择、新Goal与知识的独立批准。相互引用的知识对象整组原子发布，身份切换或application记录中断时，continue复用已持久化原Owner决定恢复。

## 2. 正式采样与观察窗口

Cycle 1 主 Query 为英文 `What is MyyShop?`。五个平台为 ChatGPT、Gemini、Perplexity、Google AI、Claude，每个 Query×Platform×Window 固定两个独立槽。前三者为本次授权的 MCP 自动采集，后两者为人工结果接收。正式采集绑定 Cycle、KBASE、Query/Set/Profile 版本、purpose、window、ordinal、Run 与授权摘要；旧工程采集不得直接计入。

跨槽串行提交，相邻提交至少 120 秒。先记录提交意图；状态未知不重发。已保留的原始输入可重试真实 DeepSeek 提取，缓存须匹配原文、provider/model、prompt 与 schema。拒答、无结果、超时、challenge、明确取消可成为有证明的观察终态；system failure 不能补齐观察数。challenge 停止当前平台动作。

每个正式 Sample、Review、Aggregation 和 Citation/Source 都进入精确快照。Source 数量和100条分类触发器不阻断周期。临时聊天通用 URL 相同时，只有经过浏览器上下文绑定的不同会话标识才能证明独立，普通结果 URL 不能重复占槽。

真实 Publication 与 Technical Retest 完成后建立 W1–W4 四个连续七天窗口。记录真实时间，不倒填漏过窗口；四周实际经过且完整矩阵通过后才能进入终局复盘。Analytics 按来源时区取完整自然日并保留数据延迟，因此最终数据就绪可能晚于 W4 结束。

## 3. 诊断、决定与发布

诊断联合 reviewed Baseline、批准知识及其限制、当前页面快照。模型输出须有原文 quote、真实 sample/claim 依据；事实不足不自动升级为 content gap。Evidence Gap 生成具体补证计划，不用更强文案替代事实，也不能将仅补证建议当成 Publication。

Owner 可采用、修改、拒绝、延期。审核包绑定文件、版本和摘要；修改生成 successor 并重新审核。发布由 Site Owner 执行，Agent 接收回执、读取真实页面并核对完整采用文案，随后由独立事后反馈确认 Publication。真实网址、权限、采用项、版本、原文、发布时间与证明摘要必须闭合。未采用的项、仅补证项或合成证明不能通过。

Technical Retest 复用 M4 九项检测，完整保留失败、warning 与不可验证项；技术检测完成不等于所有检查通过。观察时间锚取实际持久化完成时间，恢复不能挪动日期。

## 4. Analytics、复盘与第二轮

保留原固定 smoke；新增真实周期 measurement/policy/signal 合同。仅读取指定 GA4/GSC 聚合信息，冻结资源、字段、AI 来源识别表、来源时区、PRE28/W1–W4 日期映射与数据延迟。GA4 不明时区、未确认注册事件与 API 不可用明确记录，不推断或填零。注册事件数不得冒充去重注册人数。

四类指标为 AI 来源 sessions、经确认的注册事件数、GSC clicks、GSC impressions。零、负向日均变化、质量限制与 unavailable 均保留，不宣称因果。失败重读保留不可变尝试与 successor；阶段门检查所有窗口和来源，不能凭一条 Observation 完成。

Review 由实际冻结证据生成候选结论，Owner 独立决定。Cycle 2 仅从 Cycle 1 decided Review 选择真实候选，再独立批准 Goal 和知识切片。多候选必须明确选择，非法选择在写最终反馈前拒绝。Product Gap 战略分支不自动触发。两个 Cycle 各自 required stages、Trace 与 Owner Review 均通过才计为 completed/full。

## 5. 持续执行

当前任务每天 Asia/Shanghai 10:00 heartbeat，只推进到期、已授权的步骤。无变化保持安静，仅在新结果、失败、完成或需用户动作时通知。登录、人工平台结果、事实决定与实际发布不可代造。两个真实周期结束后停止自动续跑。实现验收、真实输入验证、周期完成及业务效果分别记录。
