# GEO Browser Assistant

本目录是 `geo-cowork` 的 Chrome Manifest V3 薄客户端。当前最小业务切片帮助人工执行一个 frozen Query Set：读取 Query、启动逐条测试、保存完整回答与 Citation、记录失败，并从本地状态重新启动。

## 运行结构

```text
品牌工作区 Query Set
  → loopback Query Task Service
  → Chrome Side Panel
  → 生成式平台或本地 fixture
  → answer.md + citations.json + capture.json
  → browser-query-task-state.json
```

浏览器扩展不直接访问仓库文件。`plugins/geo-expert/scripts/browser-query-task.mjs` 只绑定 loopback，使用临时 session token，把结果写入显式传入的品牌工作区。

## 1. 准备任务计划

任务计划必须引用精确版本的 frozen Query Set。示例：

```json
{
  "schema_version": "geo-browser-query-task-plan-v1",
  "task_id": "BQT-MYYSHOP-CHATGPT-001",
  "cycle_ref": "CYC-MYYSHOP-001",
  "cycle_version": "1.0.0",
  "query_set": {
    "ref": "QS-MYYSHOP-DEFINITION-EN-BASELINE-001",
    "version": "1.0.0"
  },
  "authorization_ref": "workspace://cycles/preparation/decisions/current-platform-manual-approved.json",
  "authorization_sha256": "<decision-json-sha256>",
  "platform": {
    "id": "chatgpt",
    "entry_url": "https://chatgpt.com/",
    "execution_mode": "manual_assist"
  }
}
```

`cycle_ref` 必须是 `active` Cycle，`query_set` 必须匹配该 Cycle frozen input snapshot 中 `goal_tracks[].query_set_entry_key` 指向的精确对象。真实平台授权使用 `geo-browser-query-authorization-v1` JSON，至少冻结 platform/product entry、`logged_in`、region/language、`manual|browser_automation`、Query 提交许可、允许 artifact 及逐项保留期、隐私最小化、访问角色、删除责任、停止条件、外部写入为否、批准人与有效期；计划用 `authorization_sha256` 锁定原始字节。字段模板见 [examples/query-authorization.example.json](examples/query-authorization.example.json)。

当前五个消费者平台沿用 Spec 0006 的许可状态：ChatGPT、Perplexity、Google AI、Claude 是 `terms_blocked`，Gemini 是 `manual_only`。这些平台只能使用 `manual_assist`；登录状态不能替代许可。`dom_automation` 只有在平台注册 adapter 明确为 `allowed` 且扩展 manifest 已声明精确 origin permission 时才会启动。当前可执行自动化只覆盖 loopback fixture，样例见 [examples/query-task.fixture.json](examples/query-task.fixture.json)。

## 2. 启动本地任务服务

从仓库根目录执行：

```bash
node plugins/geo-expert/scripts/browser-query-task.mjs serve \
  --workspace /absolute/path/to/workspace \
  --plan /absolute/path/to/query-task.json
```

服务默认监听 `127.0.0.1:4319`，启动输出包含一次性 `session_token`。Token 不写入计划、品牌工作区或扩展存储。

## 3. 构建并加载扩展

```bash
cd plugins/geo-browser-extension
pnpm test:extension
pnpm build:extension
```

在 `chrome://extensions` 开启开发者模式，选择“加载已解压的扩展程序”，加载 `.output/extension`。点击扩展图标后 Side Panel 打开：

1. 填入 loopback 服务地址与启动时输出的 token。
2. 点击“连接并读取任务”。
3. 点击“开始本条”。
4. `manual_assist` 会复制 Query 并打开平台，由人工提交和粘贴完整回答、结果 URL、Citation URL。
5. `dom_automation` 会在许可通过后输入、提交、等待回答稳定并提取回答区域与 Citation 链接。
6. 成功后自动进入下一条 Query；只有 `system_failure` 可点击“重新启动”，`timeout/no_result/cancelled` 保留为平台终态，`challenge` 会停止当前平台任务。

## 写回与恢复

默认写入：

```text
runs/<task-id>/browser-query-task-state.json
runs/<task-id>/browser-query-attempts/<query-hash>/attempt-<n>/answer.md
runs/<task-id>/browser-query-attempts/<query-hash>/attempt-<n>/citations.json
runs/<task-id>/browser-query-attempts/<query-hash>/attempt-<n>/capture.json
runs/<task-id>/browser-query-attempts/<query-hash>/attempt-<n>/collector-log.json
```

- 回答按原始字节保存，不做摘要或改写。
- Citation occurrence 全部保留并规范化 URL；不在本切片自动分类或判断 Claim 支撑。
- artifact 使用 create-only 写入和 SHA-256；重复完成只接受同一 payload。
- canonical Query 文件不会被改写；变化的是 task 中每条 Query 的执行状态。
- 服务重启会恢复状态。若上次停在 `running`，会先进入 `waiting_human`；若 outcome/artifact 已完整则幂等补齐状态，否则不猜测平台是否已提交。
- 本切片产出是 M5 raw capture 输入，不自动升级为 Answer Review、Aggregation、Evidence、Claim 或业务结论。
