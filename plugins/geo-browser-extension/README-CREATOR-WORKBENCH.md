# Creator Workbench — AI Agent 驱动的达人建联工作台

基于 Nuxt 4 构建的 Chrome 插件，以 AI Agent 为核心驱动引擎，实现智能达人挖掘、私信触达和对话转化。

## 技术栈

- **框架**: Nuxt 4 (ssr: false, SPA 模式, nuxt generate 静态输出)
- **UI**: Nuxt UI + Tailwind CSS
- **状态管理**: Pinia
- **AI Agent**: AI SDK (streamText + Tool Use, SSE 流式)
- **LLM Provider**: `createOpenAI` / `createDeepSeek` 对接 OpenAI-compatible 自定义网关
- **后端**: Nuxt Server Routes (Nitro) BFF 层
- **Chrome 插件**: Manifest V3, esbuild 编译扩展脚本

## 快速开始

### 开发模式

```bash
pnpm install
pnpm dev
```

### 构建 Chrome 插件

```bash
pnpm build:extension
```

构建产物在 `.output/extension/` 目录，可在 `chrome://extensions` 中加载。

### 本地智能达人流程测试

先启动本地服务，再生成带 localhost 权限的测试构建：

```bash
pnpm dev
pnpm build:extension:test
```

在 `chrome://extensions` 中加载或刷新 `.output/extension/`，随后打开 TikTok 达人主页。测试构建默认把画像候选发送到 `http://localhost:3000`；如果 `chrome.storage.local.api_base` 已保存其他地址，则优先使用保存值。普通 `pnpm build:extension` 不包含 localhost 权限，也不会设置本地默认地址。

### 本地开发 watch 模式（改动实时打包）

先在一个终端启动 Agent 服务端，再在另一个终端启动扩展监听构建：

```bash
pnpm dev
pnpm dev:extension
```

`dev:extension` 默认启用 localhost 权限和 `http://localhost:3000` 服务端地址。启动后先做一次完整构建，然后监听源文件改动并自动重新打包到 `.output/extension/`：

- `extension/`、`manifest.json`、`public/icons/` → **快速重建**（esbuild，亚秒级）
- `app/`、`nuxt.config.ts`、其他 `public/` 资源 → **完整重建**（`nuxt generate`，约 30–40s）

每次重建后在 `chrome://extensions` 扩展卡片上点「刷新」即可加载最新产物。按 `Ctrl+C` 停止。

### TikTok 页面被动发现

加载扩展后，浏览当前 TikTok 页面时会被动处理页面已经加载的数据：

- 达人主页、搜索、推荐流和视频页中的达人结构会按稳定用户 ID 或用户名合并到达人池。
- 页面已有的视频结构会保存视频地址及点赞、播放、收藏、评论、分享次数，并计算互动率。
- 页面已经加载的公开评论会在本地进入“待分析”状态；只有在达人详情点击「分析评论」后，评论原文才会发送给已配置的服务端模型。
- 工具栏弹窗展示最近页面的发现、新增、完善和待分析数量；工作台达人详情展示视频与评论洞察。
- 性别、肤色、年龄段不根据头像或视频画面自动推断，只接受本人公开声明或人工确认。

当前没有 TikTok 自动采集授权，因此此版本不会创建后台标签页、自动滚动或点击，也不会额外请求 TikTok 接口。自动测试使用脱敏数据；真实页面结构仍需人工验收。

### 加载扩展跑通 demo

1. 运行 `pnpm build:extension` 生成 `.output/extension/`。
2. 打开 `chrome://extensions`，开启右上角「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择 `.output/extension/` 目录。
4. 确认 Service Worker 正常注册（扩展卡片上无红色错误，可点「Service Worker」查看 console，应有 `[CreatorWorkbench] Hydrated: ...` 日志）。
5. 点击工具栏扩展图标，popup 会直接打开**工作台**页面（首次安装也会自动打开 `index.html#/workbench`）。
6. 打开 `https://www.douyin.com/`，F12 控制台应出现 `[CreatorWorkbench] Inject script loaded`。浏览视频、触发评论/搜索接口后，回到 popup 即可看到达人池与统计数据。

> 说明：popup 内展示的是工作台 demo（达人挖掘 / 数据看板 / 私信触达），通过 `chrome.runtime` 与 background 通信。聊天首页、AI 对话、登录、数据库等依赖服务端的功能不在扩展 demo 范围内，`/` 路由已重定向到 `/workbench`。

## 架构

### 三层注入模型（对标 wavith）

```
extension/
├── background.ts    # Service Worker — 核心业务编排引擎
├── content.ts       # Content Script — 页面消息桥接
├── inject.ts        # Main World 注入 — fetch/XHR 拦截
├── bridge.ts        # Main World 注入 — 可编程 API
├── dm-sender.ts     # DM 发送流程 + 限频检测
└── types.ts         # 共享类型定义
```

### AI Agent 工具

| 工具 | 功能 |
|------|------|
| search_creators | 搜索达人 |
| crawl_comments | 抓取评论用户 |
| get_creator_profile | 获取达人详情 |
| send_dm | 按平台发送私信（抖音 `sec_uid` / TikTok 用户名），真实发送前人工确认 |
| create_message_template | 生成文案模板 |
| check_outreach_status | 查看触达状态 |

### Web/插件双模式

- **插件模式**: 通过 `chrome.runtime` 消息通信
- **Web 模式**: 降级为 Nuxt Server API 调用
- 自动检测 `chrome.runtime.id` 判断环境

## 页面

- `/workbench` — 统一工作台（数据看板 + 状态跟踪 + 自动跟进）
- `/discover` — 找达人（全部 / 抖音 / TikTok 平台过滤 + 达人列表 + AI Agent）
- `/outreach` — 私信触达（抖音 / TikTok + 模板管理 + 批量发送 + 限频检测）
- `/` — AI Chat（原始聊天模板）
