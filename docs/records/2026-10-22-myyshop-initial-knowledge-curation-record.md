# MyyShop 初始双语知识库整理记录

- 状态：verified（本地初稿整理及本记录所列验证；不代表业务事实批准或正式发布）
- 创建/更新：2026-10-22
- 来源：[任务](../tasks/2026-10-22-myyshop-initial-knowledge-curation.md)、[计划](../plans/2026-10-22-myyshop-initial-knowledge-curation-plan.md)。
- 工作目录：`/Users/sujingjun/geo-cowork`
- 基线/分支：`main@7f56b9d2285c136393e198f0249e46d7be5168b2`
- 任务范围：素材读取、英文知识与中文对照、来源/覆盖/缺口、导航与验证；不包含业务事实批准、正式发布或采样。

## 基线与已执行动作

- 开始时 `workspace-validate.mjs --workspace workspaces/myyshop --objects` 退出码 0，缺失、错误、对象错误与 warnings 均为空。
- 原 120 条条目及 hash 保存到 `evidence/snapshots/2026-10-22-initial-knowledge/legacy-before.json`；历史正式知识与决定的 hash 同时保存用于最终不变检查。
- 两份 PR 表格只读提取，原件 hash、工作表、行和 URL 保存为快照。网络读取已保存原始 HTML 与提取文本；短正文首次来自页面推荐卡片，已改为提取实际 body，保留原始 HTML 作为核对依据。
- `lark-cli` 不在当前命令路径，已检查常见安装位置仍未找到；IMH 终稿文档正文暂未取得，线上可读文章继续处理。
- 按用户后续要求改用 Chrome。Instagram 的公开简介、置顶与近期正文可读取；TikTok 的可用范围继续核对。只保存官方内容，不保存登录身份、Cookie 或私人导航。

## 实际交付

- [英文主版](../../workspaces/myyshop/knowledge/README.md)默认可读；[中文完整对照](../../workspaces/myyshop/knowledge/translations/zh-CN/README.md)镜像分类及文件名。保留 120 个 KB ID，含 94 条源事实和 26 条派生答案，条目版本为 0.2.0，全部保持 draft。
- 更新九组分类导航、四组双语模板、来源登记、120 行覆盖表、版本基准、问题目录、集中补证、初稿检查清单和工作区导航。
- 沿用当前官网定位，修订旧草案中已完成/正在转型的预设及据此形成的禁用、失败判定；保留历史正式对象和决定，不追改既往平台评估。
- 中文文件为普通 Markdown 阅读副本，包含英文源版本、SHA-256 和校对日期，不重复注册业务对象。增加只读 `check-localization.py`，不新增运行时 API、类型、服务或调度。

## 来源与缺口

- 两份原始表格 hash 不变。N3 总链 891 行、原始 URL 字符串去重 890 条；全部 URL 单元格及显式超链接进入登记表，未读取的转载保持未读，不视为独立支持。
- IMH 的 16 个落地目标中，取得 15 篇文章正文，分类列表页为部分读取。内部终稿未取得，未用线上文章冒充内部终稿。
- 读取 13 个官网/官方资源页面或入口；Blog、Academy、Newsroom 等仅为已取得的落地页范围，不声称全站遍历或实际产品流程完成。
- Chrome 中读取 Instagram 简介、30 天冻结窗口内 30 篇文案、3 篇置顶及 3 篇较早边界帖子。窗口为 `2026-09-22T09:35:49Z` 至 `2026-10-22T09:35:49Z`（右侧不含）；每篇检查正文与 DOM 发布时间，原始英文文案、URL、日期、规范化方式和覆盖范围落盘。图像与视频媒体尚未完整转写。
- TikTok 在 Chrome 和应用内浏览器均跳转至地区不可用页面，未取得账号正文或发文。
- 35 项来源/采集登记中复用 8 份既有 Source，不修改其历史发现/分类；新增 27 份 Source、32 份 candidate Evidence。来源状态、公开表述和业务批准分别保留。
- [17 项集中补证](../../workspaces/myyshop/knowledge/translations/zh-CN/00-governance/pending-items.md)覆盖主体、资格地区、CPM/MyyFinds 规则、费用结算、许可隐私、数据证明、案例及读取缺口。102 条关联具体补证；其余 18 条仅表示当前有边界初稿未另列专属请求，仍非已批准事实。

## 实际验证

| 检查 | 实际结果 |
| --- | --- |
| `python3 workspaces/myyshop/knowledge/00-governance/check-localization.py` | 退出码 0；120 个逻辑条目、120/120 语言文件、94/26 类型一致；版本、hash、数字、产品术语和证据引用无不一致 |
| 同脚本 `--self-test` | 退出码 0；8 个场景通过，包含过期、版本、金额、产品、重复对象、缺章和空章节 |
| `node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects` | 退出码 0；missing/errors/object_errors/warnings 全为空 |
| `node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop` 及 `--check` | 均退出码 0；legacy_count 120；落盘索引 120 个唯一 ID、0 个中文副本、0 个文件 hash 不一致 |
| 来源片段定位核对 | 69 组事实引用的定位文字全部在相应快照中找到；初次 2 个定位字符串已修正后复核通过 |
| 历史与原件保留 | 17 份旧正式知识/决定、8 份复用 Source 和两份 PR 原件 hash 不变 |
| 文档链接与 `git diff --check` | 退出码 0；文档检查覆盖 598 个 Markdown 文件、6,815 个本地链接，0 个错误 |

验证证据：[机器可读结果](../../workspaces/myyshop/knowledge/00-governance/validation-results.json)、[英文报告](../../workspaces/myyshop/knowledge/00-governance/validation-report.md)、[中文报告](../../workspaces/myyshop/knowledge/translations/zh-CN/00-governance/validation-report.md)。本次为资料与知识文件整理，未运行不相关的全仓工程测试。

## 语义核对与结果边界

英文/中文共用 69 组事实内容、120 组问题及 36 组自定义答案。编写与复核时重点保留定位未决、零粉丝与参与资格、CPM 视频播放与 MyyFinds 商品浏览、活动预算与有效期、免费平台费用与限时报告、收益计算与实际到账、知识产权所有权与许可、年龄法律例外等边界。自动检查不代替独立翻译审校、业务事实确认或实际产品验证。

源文提取曾误选推荐卡片造成部分 IMH 文本过短，已定位并改为从保存的页面 body 提取；原始 HTML 保留。PR 原页直连 403 后通过可读取的网页工具取得正文并保存来源；未绕过登录、验证码或地区限制。源登记审阅发现 8 个 URL 已有 Source，已复用旧记录并清理本次新建的重复草稿，不改动历史记录。

本轮完成的是内部待确认初稿及所列检查。未批准任何具体品牌事实，未发布正式 Knowledge Release，未恢复正式 Cycle 或采样，未写飞书、改官网、提交或推送 Git。工作区原有 AGENTS.md、CONTEXT.md 及访谈相关未提交内容保持；本次只在导航中增量加入本专题入口。
