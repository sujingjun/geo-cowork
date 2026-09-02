# Round 01 真实 UI 验收记录

## 环境

- 时间：2026-08-30 16:10 CST（UTC+08:00）
- 仓库：`/Users/sujingjun/myyshop/dhnb-wavith-extension`
- 分支：`master`
- HEAD：`764513756400ccf3a94357064fa3c5c9295bdb0a`
- 工作区基线：干净
- remote：未配置
- Chrome：152.0.7977.64
- 扩展：Creator Workbench 1.0.0，ID `elcjielgenpjedfjocamoejhglgaadbl`
- 本地服务：本仓库 `pnpm dev` 正在监听 3000 端口
- 扩展监听构建：本仓库 `pnpm dev:extension` 正在运行

## 自动门禁

- `pnpm test`：PASS，62/62。
- `pnpm build:extension:test`：PASS，产物为 `.output/extension`。
- `pnpm typecheck`：基线未通过；仍是 4 个既有文件位置，没有新增位置：
  - `app/components/creator/CreatorFilter.vue:82`
  - `app/composables/useFileUpload.ts:30`
  - `app/pages/popup/analysis.vue:56`
  - `server/api/upload/[chatId].put.ts:30`

## 场景记录

### S1 扩展加载与基础导航

- 状态：FAIL
- 操作：打开 `chrome://extensions`，确认开发者模式已开启、扩展已启用，并刷新已加载的 Creator Workbench。
- 实际：刷新成功，Chrome 显示“已重新加载”；工作台、找达人、私信触达三个入口均能打开。工作台从弹窗打开或在正常地址刷新后，URL 会变成重复哈希路由。
- 缺陷：UI-003。
- 控制台：错误面板存在同步错误，登记为 UI-002；扩展刷新导致的旧页面 `Extension context invalidated` 暂列为历史噪声，需在新上下文中区分。
- 是否改变本地测试数据：否。

### S2 真实 TikTok 达人主页识别

- 状态：FAIL
- 页面：验收开始前已经打开的 TikTok 公开达人主页（URL 已脱敏）。
- 操作：刷新页面，等待自然加载约 5 秒；未自动滚动、点击或发起额外平台动作。
- 预期：弹窗自动出现且只显示当前主页达人。
- 实际：弹窗自动出现一次，但显示 32 位达人，混入推荐账号和当前登录账号；摘要数量与列表数量不一致。
- 缺陷：UI-001。
- 截图：
  - TikTok 页面：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s2-profile.png`
  - 扩展弹窗：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s2-popup.png`
- 页面控制台：观察到 TikTok 自身与其他已安装扩展的错误/警告；未观察到本扩展页面脚本错误。未将第三方噪声登记为本项目缺陷。
- 是否改变本地测试数据：页面发现流程读取并更新扩展本地数据；未删除、未发送、未修改平台数据。

### S3 真实搜索页面多达人识别

- 状态：BLOCKED
- 原因：当前没有已打开的 TikTok 搜索结果页，且本轮尚未取得搜索关键词授权。

### S4 真实推荐流/列表页识别

- 状态：FAIL
- 页面：验收开始前已经打开的 TikTok 探索页。
- 操作：刷新页面，等待自然加载；未自动滚动、点击内容或触发平台动作。
- 预期：弹窗只显示当前页面实际识别的达人。
- 实际：当前页面可见结构约有 33 个达人链接，弹窗却显示 170 位达人并混入旧页面数据；摘要“发现 17”与列表总数也不一致。
- 缺陷：UI-004。
- 截图：
  - 页面：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s4-explore.png`
  - 弹窗：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s4-popup.png`
- 控制台：扩展刷新前的旧脚本记录过 `Extension context invalidated`；本次刷新后的新内容脚本正常加载，未将旧错误重复登记为新缺陷。
- 是否改变本地测试数据：发现流程更新扩展本地数据；未删除、未发送、未修改平台数据。

### S5 真实视频页与评论采集引导

- 状态：FAIL
- 页面：验收开始前已经打开的 TikTok 公开视频页；首次为 403，正常刷新后成功加载，没有绕过安全提示或登录。
- 操作：等待页面自然加载，点击页面正常提供的评论按钮；未滚动评论列表、未回复、未点赞。
- 页面实际：点赞 16.4K、评论 163、收藏 1391、分享 352；首屏自然显示若干评论。
- 扩展详情：保存播放 1,100,000、点赞 16,400、评论 163、分享 352、互动率 1.54%；达人级整体互动率 1.70%，待分析评论 42，并显示主页补全和继续采集评论引导。
- 通过项：视频指标、评论待分析数量与采集引导可见；详情弹窗可滚动。
- 失败项：视频页弹窗仍串入 75-77 位旧达人，归入 UI-004；列表出现负获赞数，登记 UI-005。
- 截图：
  - 视频与评论：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s5-video-comments.png`
  - 视频页弹窗：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s5-popup.png`
- 敏感信息：截图含公开账号和评论，只保存在系统临时目录。
- 是否改变本地测试数据：发现流程更新扩展本地数据；未触发评论分析，未把评论发送给模型。

### S6 popup 达人卡片操作

- 状态：PARTIAL
- 通过项：固定弹窗外框可用；长列表在内部滚动；卡片、主页和删除按钮没有重叠；缺少昵称时显示 `@用户名`。
- 失败项：当前页数据范围不正确（UI-001、UI-004）；大数指标错误（UI-005）。
- 待验证：只对本轮明确标记测试记录执行“取消删除”和经用户确认后的实际删除。
- 截图：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s6-popup-scrolled.png`

### S7 找达人列表与详情

- 状态：PARTIAL
- 通过项：关键词筛选可定位视频作者；列表展示名称、平台、来源、指标和状态；详情展示画像、采集建议、视频指标与评论洞察入口；768px 高窗口下详情可内部滚动，底部操作按钮可达。
- 待验证：主页跳转；取消删除与经确认后的实际删除同步。
- 截图：
  - 顶部：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s7-detail-top.png`
  - 滚动后：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s7-detail-scrolled.png`

### S8 工作台最近活动

- 状态：PARTIAL
- 通过项：本轮视频作者和评论用户出现在最近活动；缺昵称条目显示 `@用户名`，未出现“未知达人”；时间和状态选择器布局正常。
- 待验证：删除本轮测试记录后，刷新工作台并确认活动同步移除。
- 截图：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s8-recent-activity.png`

### S9 Agent 会话真实体验

- 状态：FAIL
- 通过项：
  - 空会话连续点击两次“New chat”没有继续新增空会话。
  - 发送无副作用能力询问后完成真实流式回复，没有触发工具。
  - 切到找达人再返回、创建第二会话并往返切换、刷新页面后，消息和标题均保留且不串会话。
- 失败项：历史恢复后始终存在两个不可区分的空白“新对话”，登记 UI-006。
- 截图：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s9-agent.png`
- 是否改变平台数据：否；发生两次最小模型调用，不执行浏览器或私信工具。

### S10 Agent 服务不可达体验

- 状态：PASS
- 操作：停止本仓库 `pnpm dev`，确认 3000 端口关闭，发送一条无副作用文本；随后重新启动服务并发送最小恢复请求。
- 离线实际：显示“无法连接 AI Agent 服务端（http://localhost:3000）。请确认服务已启动，并使用本地测试扩展构建。”，未裸露 `Failed to fetch`。
- 恢复实际：服务启动后下一次请求正常回复“恢复成功”。
- 截图：
  - 离线：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s10-offline.png`
  - 恢复：`/var/folders/tv/9s8m70lj5ds074n7p27c124m0000gn/T/creator-workbench-ui-acceptance/round-01-s10-recovery.png`

## Round 01 结论

- 已登记：UI-001 至 UI-006。
- 已通过：S10；S5、S6、S7、S8、S9 的部分子项。
- 失败：S1、S2、S4、S5、S9。
- 阻塞：S3 缺少用户批准的 TikTok 搜索关键词；S6-S8 的真实删除需在最终确认删除前取得用户授权。
- 本轮不是最终验收；修复后必须从 S1 开始重跑完整轮次。
