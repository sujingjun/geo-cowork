# M5 Playwright 与消费者平台账号/隐私授权决定

- 决定人：MyyShop Owner（本会话用户）
- 决定时间：2026-08-25
- 原始指令：批准继续 T08/T09；Playwright 使用最新版并全局安装；五个平台统一使用 Owner 现有 Google 登录身份；按真实用户隐私处理；本地采集 artifact 保留 1 年
- 决定引用：`workspace://cycles/preparation/decisions/2026-08-25-m5-playwright-and-consumer-platform-authorized.md`
- 账号标识：`[REDACTED_ACCOUNT_IDENTIFIER]`；原始邮箱不写入仓库、日志、Profile、Run、截图、DOM 或 collector artifact

## 1. Playwright 依赖决定

| 项目 | 决定 |
| --- | --- |
| package | npm `playwright` |
| exact version | `1.62.1`；2026-08-25 npm `latest` 与 GitHub Latest 均为该版本 |
| 安装范围 | 当前 macOS 用户的全局 npm 环境；不写入仓库 `package.json` 或 lockfile |
| license | Apache-2.0 |
| Node 支持 | package 要求 Node `>=20`；当前实际 Node `v22.14.0` |
| 全局路径 | 运行时通过 `npm root -g` 解析，不在代码硬编码用户目录 |
| 浏览器策略 | 复用当前缓存中已能被 `playwright@1.62.1` 成功启动的 Chrome for Testing `chromium-1234`；本轮不下载新 browser binary |
| browser cache | macOS Playwright 默认缓存；当前约 1.1 GiB，具体绝对路径只在本机 Record 中披露 |
| 磁盘停止条件 | 当前数据卷约 99% 使用、只余约 4.2 GiB；未经新的容量决定不执行 `playwright install` |
| 清理责任 | MyyShop Owner 决定是否清理；任何 browser/cache 删除仍需当次破坏性操作授权 |
| 当前验收宿主 | 仅本机 macOS；CI、Codex/Claude 安装缓存与其他宿主未授权、未验证 |
| 升级责任 | 每次真实运行前核对 npm `latest`、package/browser compatibility 与本 Record；版本变化使用新决定和回归 |

官方依据：

- <https://github.com/microsoft/playwright/releases>
- <https://playwright.dev/docs/browsers>

## 2. 五个平台账号授权

Owner 对以下五个平台分别授权使用同一 Owner-controlled Google 登录身份；授权是逐平台列明的，不表示一个平台的 Smoke 可以替代另一个平台：

| platform | product entry | Owner 账号授权 | 自动执行状态 |
| --- | --- | --- | --- |
| ChatGPT | `https://chatgpt.com/` | approved | `terms_blocked`：消费者条款禁止自动/程序化提取数据或 Output |
| Gemini | `https://gemini.google.com/app` | approved | `manual_only`：未取得官方消费者 UI 自动采集许可，不以账号安全作推断性冒险 |
| Perplexity | `https://www.perplexity.ai/` | approved | `terms_blocked`：消费者条款禁止 bot/scraper/自动采集，并明确禁止为同一目的进行手工采集流程 |
| Google AI Mode / AI Overviews | `https://www.google.com/search` | approved | `terms_blocked`：Google Terms 要求遵守机器可读规则，`robots.txt` 对通用 user-agent 禁止 `/search` |
| Claude | `https://claude.ai/new` | approved | `terms_blocked`：消费者条款禁止非 API 的自动或非人类访问，并禁止 crawl/scrape |

账号授权不能覆盖各平台 Terms、robots、地区、订阅、验证码、challenge 或安全控制。Agent 不读取密码、cookie、local/session storage、浏览器 Profile 或账号设置；如登录未就绪，由 Owner 在用户控制的浏览器中自行完成。

官方边界：

- OpenAI Terms：<https://openai.com/policies/terms-of-use/>
- Anthropic Consumer Terms：<https://www.anthropic.com/legal/consumer-terms>
- Perplexity Terms：<https://www.perplexity.ai/hub/legal/terms-of-service>
- Google Terms：<https://policies.google.com/terms>
- Google robots：<https://www.google.com/robots.txt>

## 3. 隐私、artifact 与保留

| 项目 | 已批准值 |
| --- | --- |
| account/login | Owner 现有 Google 登录身份；Profile 只记录 `logged_in/logged_out/unknown`，不记录邮箱 |
| region/language/model | 无法从 UI 确认时一律 `unknown`；不因账号推断地区、订阅或模型 |
| 允许交互 | 仅在平台条款允许时打开批准入口、创建新会话并提交一次冻结 Query；不修改设置，不点赞、分享、评论、上传文件或调用 Connected Apps |
| 允许 artifact | 完整 answer text、Citation raw、只含答案/Citation 区域的裁剪截图、脱敏 collector log |
| 默认不可用 artifact | 完整页面截图、完整 DOM/HTML/page export；除非能确定不含账号 chrome、邮箱、头像、历史、广告标识或其他个人数据 |
| 最小化 | 写盘前移除账号标识、凭据、cookie、token、local/session storage、历史会话与无关 UI |
| 本地保留期 | captured_at 起 365 天 |
| 平台侧保留 | 服从平台自身政策；本决定不能把平台侧数据强制保留 1 年，也不能改变供应商删除周期 |
| 访问角色 | MyyShop Owner 与当前明确获授权的本地 GEO 操作角色；不得上传第三方或公开发布 |
| 删除责任 | MyyShop Owner；到期只进入删除复核，不自动删除，实际删除需解析精确 Run/path 并再次确认 |
| 外部写入 | 除获准且条款允许的单次 Query 提交外均为否 |

ChatGPT 若采用人工 fallback，优先使用 Temporary Chat；官方说明其不进入历史、不会创建 memory，安全目的副本最多保留 30 天。该平台侧周期独立于本地 365 天 artifact 决定。

## 4. 停止条件

以下任一情况立即停止受影响平台，不重试、不绕过、不切换 API 或其他平台补数：

- Terms、robots 或平台政策禁止自动/手工采集；
- 登录、MFA、验证码、challenge、账号锁定、速率限制或异常安全提示；
- 需要读取/导出密码、cookie、token、local/session storage 或浏览器 Profile；
- 答案区域无法与账号 chrome、邮箱、头像、历史或其他个人数据可靠分离；
- product entry、地区、语言、模型/模式或搜索状态与 Profile 不一致；
- selector/detector 漂移、终态不明、页面跨出批准 allowlist；
- 磁盘不足、需要下载新 browser binary，或将访问范围扩大到 CI/其他宿主；
- 需要外部写入、付费动作、删除平台历史、commit、push、PR、release 或 deploy。

## 5. 当前可执行结论

- T08：允许完成全局 Playwright runtime、本地 fixture base collector 与本机 browser launch Smoke。
- T09：允许实现五个平台的条款感知 adapter 与授权/Profile/隐私合同；真实消费者 UI 自动 Smoke 受上述官方条款阻塞，不得以 Owner 账号授权覆盖。
- T10：本决定不授权真实 Baseline 或 post-change Retest；没有平台真实 Sample 时不得创建 MyyShop M5 Source candidate。

## 6. 2026-08-25 后续平台书面自动采集修订

Owner 在 ChatGPT 与 Gemini 各完成 1 个手工 exploratory Smoke 后明确决定：后续平台不再走人工 fallback，切换为“平台书面自动采集许可”硬门。

本修订的含义：

1. Google AI、Claude、Perplexity 不再请求 Owner 手工提交或复制；
2. ChatGPT/Gemini 的现有 manual Sample 保留为历史 Observation，但不自动授权后续 Run；
3. 任何 platform adapter 从 `terms_blocked/manual_only` 变成 `allowed` 前，必须取得平台方书面许可并建立 Workspace permission ref；
4. 当前 Owner 指令只决定内部策略，不代表 OpenAI、Google、Perplexity 或 Anthropic 已授予许可；
5. 没有有效 permission ref 时，代码必须返回 `PLATFORM_WRITTEN_PERMISSION_REQUIRED`，且在 browser resolve/launch 前停止。

平台书面许可至少必须明确：

- 出具主体与可验证联系人；
- 适用平台和 exact product entry；
- 是否允许 browser automation、Query 提交、Output/Citation 抽取与本地保存；
- 账号、地区、语言、并发、频率、样本数和时间窗；
- 允许 artifact、隐私最小化与本地 365 天保留；
- 生效/到期时间、撤销方式和停止条件；
- 原始文档 URL/path、captured_at 与 SHA-256。

因此当前出口是等待平台书面许可，不继续真实平台操作。

## 7. 2026-08-25 `written_permission_ref` 运行时硬门移除

Owner 后续明确决定：

1. 从五个平台 adapter 与运行时移除 `written_permission_required`、`written_permission_ref` 和 `future_collection_mode`；
2. 不再以 permission ref 缺失阻塞当前工程里程碑；
3. 平台许可改为 Requirements 需求池条目，不创建当前 Task；
4. adapter 现有 `terms_blocked/manual_only`、Terms/robots、challenge、隐私和账号安全门保持不变；
5. 本指令不等于平台已许可，也不授权绕过平台条款开始真实自动采集。

本节覆盖 §6 中“permission ref 作为当前运行时硬门”的决定，但保留 §6 作为历史决策轨迹。需求池条目为：

`docs/requirements/2026-08-25-platform-automation-permission-backlog.md`

该条目业务状态为“待规划”，是否开启 PRD/Spec/Plan/Task 仅由 Owner 另行决定。当前工程出口仍按平台 Terms guard 判断。

## 8. 2026-08-26 开发阶段真实 UI manual adapter 路径

Owner 明确决定开发阶段继续 Owner 手工操作、手工复制的 `manual exploratory` 采样，并先跑通对应真实 UI adapter；平台许可需求池仍只面向未来自动化/正式上线，状态保持“待规划”。

当前 manual 路径：

| platform | manual exploratory | automation |
| --- | --- | --- |
| ChatGPT | allowed；已完成 1 个 Temporary Chat Sample | `terms_blocked` |
| Gemini | allowed；已完成 1 个无 Citation Sample | `manual_only` |
| Google AI Mode/AI Overviews | allowed；由 Owner 手工访问 `/search`、提交和复制 | `terms_blocked` |
| Claude | allowed；由 Owner 手工访问、提交和复制 | `terms_blocked` |
| Perplexity | blocked；consumer Terms 限制同目的手工采集 | `terms_blocked` |

“真实 UI adapter 跑通”在当前开发阶段固定指：

1. Owner 在用户控制浏览器中手工打开 exact product entry；
2. Owner 手工提交冻结 Query、等待终态并复制完整回答；
3. Agent 只读取 Owner 主动复制到系统剪贴板的内容；
4. manual materializer 校验平台 registry/entry、隐私、raw checksum、Citation/Source 关系并写入 exploratory Sample；
5. 不使用 Playwright/DOM/selector 自动提交或提取，不形成正式 Baseline。

本节覆盖 §6 中“不再请求 Google AI/Claude 人工操作”的历史策略；Perplexity 阻断保持。
