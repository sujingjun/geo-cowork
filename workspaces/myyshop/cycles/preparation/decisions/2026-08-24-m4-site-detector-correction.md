# M4 sitemap detector 修正决定

- 决定类型：工程检测规则修正，不是业务批准
- 记录时间：2026-08-24T20:32:46+08:00
- 触发 Run：`RUN-MYYSHOP-M4-SITE-HOMEPAGE-20260824`
- 当前规则：`m4-site-detectors-v1.0.2`
- 当前首页 Run：`RUN-MYYSHOP-M4-SITE-HOMEPAGE-20260824-V102`

## 事实

首次真实 Site audit 暴露两种合法 sitemap XML 格式：

1. 根节点前存在 `xml-stylesheet` processing instruction；
2. `</urlset>` 后存在 sitemap generator comment。

原 `m4-site-detectors-v1` 对这两种格式返回 `SITEMAP: fail`。两条合成红测稳定复现后，解析器增加根节点前后 processing instruction/comment 处理，规则版本依次升级并最终冻结为 `v1.0.2`。

## 证据边界

- 旧 Run、旧 Evidence/Finding 保留原字节，作为 detector 缺陷与修复轨迹；不得把旧 `SITEMAP` Finding 作为当前站点事实。
- `v1.0.1` 修正版计划在 materialize 前因尾部 comment 仍失败，没有生成 Run、Evidence 或 Finding。
- 当前首页权威技术结果使用 `RUN-MYYSHOP-M4-SITE-HOMEPAGE-20260824-V102`：SITEMAP 通过；CANONICAL 与由其连带的 CRAWLABILITY 仍失败。
- 本修正不批准任何 Evidence/Gap、内容建议、外部发布或效果结论。
