---
name: geo-site
description: 从显式、带 checksum 的本地采集 manifest 执行 HTTP、canonical、robots、sitemap、Schema、title/meta/heading 与 crawlability 确定性检查；不负责联网抓取。
---

# geo-site

## 触发场景

- 校验已授权 Collector 或 development fixture 的站点 snapshot；
- 对已发布 Asset 做 Technical Retest。

## 输入

工作区、site manifest、显式输出 plan 和时间。manifest 必须锁定 Asset、locator、collector/version、collection state、snapshot path/SHA 和允许的 HTTP headers。

## 开工前必读

读取目标 Asset、相关 Goal/Query/Claim/KR、Spec 0005 §9/§12。确认 snapshot 在工作区内且没有 secret、cookie 或 Authorization。

## 步骤

1. 先全量校验路径、checksum、Asset locator 和 plan refs/version。
2. 运行本地检测：

   ```bash
   node <plugin-root>/scripts/diagnosis.mjs site-audit --workspace <path> --manifest <manifest.json> --plan <plan.json>
   ```

3. pass 只进入 Run summary；fail/blocked/unverifiable 才生成 Evidence/Finding。
4. Retest 使用新 manifest、新 Evidence 和新 Finding；旧 Finding 不覆盖。

## 输出

九项带稳定 code/version 的结果、Evidence/Finding refs、Run 和 warnings；不输出综合 GEO 分。

## 可做事项

- 读取本地 immutable snapshot；
- 判断可直接观察的语法、存在性和抓取前置条件；
- 在 confirmed Publication 或 development fixture 后技术复测。

## 禁止事项

- 不联网、不启动浏览器、不调用 Crawlee/Playwright/Unlighthouse；
- 不从 403、登录页、challenge 或 timeout 推断目标正文；
- 不宣称特定生成式平台必然抓取。

## 失败与停止条件

缺 snapshot、checksum 不符、locator/版本漂移、禁止 header 或 Publication gate 缺失时停止，预期冲突前不得留下半成品。

## 验收方式

相同 manifest/plan/rule version 产生相同结果；Evidence proof scope 与 item state 一致；Retest 保留旧对象字节。

## 示例

```bash
node <plugin-root>/scripts/diagnosis.mjs technical-retest --workspace <path> --manifest <manifest.json> --plan <plan.json>
```
