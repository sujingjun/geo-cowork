# MyyShop 工作区状态

> 最近更新：2026-08-25

## 当前阶段

M2 Contract & Provenance Kernel、M3 Knowledge & Query Operating System 与 M4 本地工程已完成既定工程验收；现有 120 条 legacy knowledge 保持原文。Owner 已批准全部 13 个 canonical M3 业务对象，并于 2026-08-24 单独授权 11 个 MyyShop 官网公开端点的首批只读采集。raw/metadata/checksum、11 条 candidate Research Evidence 与 5 页 Site Run 已落盘。独立 Review 已判定 PASS 进入 M5 规划门，并起草六份 `proposed` M5 工件。M5 已完整设计 Citation-driven 持续 Source registry、Playwright base、逐平台真实 collector 与人工 fallback，不包含外部榜单冷启动导入；实现门和真实采集门仍为 FAIL。

## 当前边界

- indexes 是派生导航，不是新的业务事实源；
- M3 validate 只有两条预期 `EVIDENCE_INSUFFICIENT`；两个 Claim 均待 first-party，能力 Claim 另待 data/case；
- 新采集的一方 Evidence 仍为 `candidate`，尚未由事实负责人逐条审核并回写 Claim 新版本，因此不能消除上述 warning；
- trace 关系完整且 `lifecycle_ready:true`，`gates:[]`；批准来源为 Owner 当前会话决定，不是 Agent 自动批准；
- `KR-MYYSHOP-DEFINITION-001` 的 `published/ready` 只表示本地正式知识包，不表示任何外部内容发布；
- 当前 Site 技术结果：For Creators 与 MyyFinds 九项通过；首页、About、Brand Deals 有 canonical 相关 Finding，About 另缺 heading；sitemap 首次假阳性已由 `v1.0.2` 修复并保留旧 Run 轨迹；
- 没有 Evidence 人工批准、Content/Evidence/Product Gap 确认、Proposal、Adoption、Publication、GA4/GSC、消费者平台采样、部署或业务效果验证。
- M5 Requirement、PRD、Architecture、Spec 0006、Plan、Task 均为 `proposed`；其设计覆盖真实 Citation 驱动的 Source identity/lifecycle、五层分类、五项指标、Playwright base 和 ChatGPT/Gemini/Perplexity/Google AI Mode/AI Overviews/Claude adapters。Review PASS 不等于 SDD approved、代码实现或真实 Baseline 授权。
- 信源体系的唯一候选发现入口是获授权真实 Run 的 Citation Observation；无外部综合榜、静态域名表或历史排名 import 路径。

## 下一动作

并行保留两条独立人工门：一是由 `MyyShop Owner` 复核 11 条 candidate 一方 Evidence 的 Claim 支持范围、限定和风险，缺少 data/case 与独立支持继续保留；二是审阅六份 M5 proposed 工件。只有 M5 SDD 获批且另有离线实现授权，才可进入代码；Playwright package、浏览器 binary 与每个消费者平台还需各自决定，当前不得采样。
