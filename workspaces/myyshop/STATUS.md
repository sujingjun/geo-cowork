# MyyShop 工作区状态

> 最近更新：2026-08-26

## 当前阶段

M2 Contract & Provenance Kernel、M3 Knowledge & Query Operating System、M4 与 M5 T02—T08 本地工程已完成既定工程验收；现有 120 条 legacy knowledge 保持原文。M5 已登记 ChatGPT、Gemini、Google AI manual exploratory Sample，Claude CN 中文 Query/US 英文 Query 各 1 个成功 Sample，以及 1 个 Perplexity 用户导出 Markdown Sample。Claude 两次只记录采集基线差异，不执行 IP 对比；美国首次物化失败 Run/Attempt 作为审计历史保留。全部 Sample 都不是真实 Baseline。Adapter `written_permission_ref` 运行时硬门已移除；平台许可只进入 Requirements 需求池，业务状态“待规划”。

## 当前边界

- indexes 是派生导航，不是新的业务事实源；
- M3 validate 只有两条预期 `EVIDENCE_INSUFFICIENT`；两个 Claim 均待 first-party，能力 Claim 另待 data/case；
- 新采集的一方 Evidence 仍为 `candidate`，尚未由事实负责人逐条审核并回写 Claim 新版本，因此不能消除上述 warning；
- trace 关系完整且 `lifecycle_ready:true`，`gates:[]`；批准来源为 Owner 当前会话决定，不是 Agent 自动批准；
- `KR-MYYSHOP-DEFINITION-001` 的 `published/ready` 只表示本地正式知识包，不表示任何外部内容发布；
- 当前 Site 技术结果：For Creators 与 MyyFinds 九项通过；首页、About、Brand Deals 有 canonical 相关 Finding，About 另缺 heading；sitemap 首次假阳性已由 `v1.0.2` 修复并保留旧 Run 轨迹；
- 没有 Evidence 人工批准、Content/Evidence/Product Gap 确认、Proposal、Adoption、Publication、GA4/GSC、正式消费者平台 Baseline、部署或业务效果验证。
- M5 Requirement、PRD、Architecture、Spec 0006 与 Plan 均为 `approved`；Task 为 `implemented`：T02—T08 verified，T09 已有 ChatGPT/Gemini/Google AI manual Smoke、Claude CN/US baseline records 与 Perplexity user-supplied-export/manual Sample；Perplexity 页面 manual 和 browser automation blocked，T10 blocked。账号标识和凭据不落盘。
- 信源体系的唯一候选发现入口是获授权真实 Run 的 Citation Observation；无外部综合榜、静态域名表或历史排名 import 路径。

## 下一动作

并行保留两条独立边界：一是由 `MyyShop Owner` 复核既有 11 条 candidate 一方 Evidence，以及 Google AI/Claude/Perplexity 导出新增 Citation-driven Source/Classification 的来源类型、主体关系、Claim 支持范围、限定和风险；二是平台许可候选需求保持“待规划”，由 Owner 决定是否启动规范。Perplexity 页面 manual 与所有 browser automation 保持 blocked；只有用户提供并冻结哈希的导出文件可进入。没有三个正式 slot 时不得进入 T10。
