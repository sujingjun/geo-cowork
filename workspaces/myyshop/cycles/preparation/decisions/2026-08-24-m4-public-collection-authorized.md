# M4 首批公开站点采集授权决定

- 决定人：MyyShop Owner（本会话用户）
- 决定时间：2026-08-24T20:10:01+08:00
- 原始指令：`OK，确认首批 allowlist，默认采集参数、raw 保留期限、人工 reviewer，需要确认的环境变量写到.env.example，写好注释和获取地址说明。然后下一步开始执行m2-m4优化handoff河真实采集`
- 决定引用：`workspace://cycles/preparation/decisions/2026-08-24-m4-public-collection-authorized.md`

## 获授权目标

Origin 固定为 `https://www.myyshop.com`，仅允许公开、无需登录的只读 GET：

1. `/`
2. `/about-us`
3. `/for-creators`
4. `/brand-deals-opportunies`
5. `/earn-from-every-view-myyfinds`
6. `/robots.txt`
7. `/llms.txt`
8. `/llms-full.txt`
9. `/sitemap_index.xml`
10. `/__sitemap__/pages.xml`
11. `/__sitemap__/blogs.xml`

sitemap 只作为获授权快照和页面检查输入；其中出现的新 URL 不自动获得采集授权。

## 默认采集参数

| 参数 | 已确认值 |
| --- | --- |
| 方法 | 只读 `GET`；不登录、不携带 cookie、不提交表单 |
| User-Agent | `geo-cowork-m4/0.3.0` |
| Accept-Language | `en-US,en;q=0.9` |
| 并发 | `1` |
| 请求间隔 | `1000 ms` |
| 单请求超时 | `20000 ms` |
| 最大重试 | `2`（首次请求之外最多重试两次） |
| 最大重定向 | `5`，每一跳必须保持同一精确 origin 且目标仍在 allowlist |
| 最大响应正文 | `5242880 bytes`（5 MiB） |
| raw 保留期限 | `90 天` |
| 外部写入 | 不允许 |
| 人工 reviewer | `MyyShop Owner` 角色 |

raw 到期策略不等于删除授权。本轮不自动清理既有快照；未来删除必须解析到明确 Run/路径并遵守当次破坏性操作确认。

## 证据与人工门

- 每个端点必须保存 raw、脱敏 metadata、`captured_at`、collector/version 与 SHA-256。
- 可访问只证明公开读取成功；不自动等于 Evidence approved、Claim 充分、Gap confirmed 或业务结论成立。
- reviewer 角色只指定后续人工复核责任，不代表 reviewer 已经完成审核。
- Site detector pass 只进入 Run；失败、阻断或不可验证项按 Spec 0005 生成 scoped Evidence/Finding。

## 保留边界

本决定不授权：

- allowlist 之外的 URL、登录区、后台、密码重置、账号或个人数据；
- GA4/GSC 数据读取、Google 凭据创建或权限变更；
- ChatGPT、Gemini、Perplexity、AI Mode/AI Overviews 等消费者平台采样；
- CMS、社区或第三方平台写入，Adoption、Publication、Technical Retest；
- M5/M6/M7、付费模型、commit、push、PR、merge、release 或 deploy。

GA4/GSC 本轮只允许在 `.env.example` 中登记非秘密标识符、待确认字段、凭据路径占位和官方获取说明；任何密钥、token、cookie 或凭据正文不得写入仓库。
