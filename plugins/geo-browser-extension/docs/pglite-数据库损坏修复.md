# PGlite 数据库损坏修复指南

## 错误现象

启动 `pnpm dev` 时出现以下错误：

```text
[nuxt:hub]  ERROR  Failed to create migrations table
Aborted(). Build with -sASSERTIONS for more info.
```

后续 API 请求也会报 WASM 运行时崩溃：

```text
Error: Failed query: select ... from "chats" ...
RuntimeError: Aborted(). Build with -sASSERTIONS for more info.
```

## 根因分析

本地开发使用 PGlite（嵌入式 PostgreSQL WASM），数据存储在 `.data/db/pglite/`。该错误的根因链路如下：

1. **残留进程占用**：多次启动 `pnpm dev` 后，旧 Nuxt 进程未被正确退出，持续占用 PGlite 的 WAL 文件（`pg_wal/`）。
2. **锁文件冲突**：PGlite 启动时检测到 `postmaster.pid` 锁文件，认为已有实例在运行而中止。即使删除锁文件，残留进程也会立即重新创建。
3. **数据目录损坏**：残留进程的异常写入导致 PGlite 内部数据文件损坏，WASM 运行时直接 `Aborted()`，无法恢复。

## 诊断步骤

### 1. 检查残留 Nuxt 进程

```bash
ps aux | grep -E 'nuxt|nitro' | grep -v grep | grep -v "Visual Studio"
```

如果看到多个 `nuxt dev` 或 `@nuxt/cli` 进程，说明有残留。

### 2. 检查锁文件和文件占用

```bash
# 检查 postmaster.pid 是否存在
cat .data/db/pglite/postmaster.pid

# 检查哪些进程在占用数据库文件
lsof +D .data/db/pglite/
```

`postmaster.pid` 中的 PID 为负数（如 `-42`）是 PGlite 内部的假 PID，属于正常现象。关键看是否有真实 node 进程在占用 WAL 文件。

### 3. 确认数据目录是否损坏

```bash
pnpm db:tables
```

如果输出 `RuntimeError: Aborted()`，说明 PGlite 数据目录已损坏，需要重建。

## 修复步骤

### 情况一：仅有残留进程（数据目录未损坏）

```bash
# 1. 杀掉所有残留 Nuxt 进程（替换为实际 PID）
kill <PID1> <PID2> <PID3>

# 2. 确认进程已退出
ps aux | grep -E 'nuxt|nitro' | grep -v grep

# 3. 删除残留锁文件
rm -f .data/db/pglite/postmaster.pid

# 4. 重新启动
pnpm dev
```

### 情况二：数据目录已损坏（WASM Aborted）

```bash
# 1. 杀掉所有残留 Nuxt 进程
ps aux | grep -E 'nuxt|nitro' | grep -v grep | grep -v "Visual Studio"
kill <PID1> <PID2> ...

# 2. 备份损坏的数据目录（以防万一）
mv .data/db/pglite .data/db/pglite-broken-$(date +%Y%m%d-%H%M%S)

# 3. 清理 NuxtHub 迁移缓存
rm -rf .data/db/migrations

# 4. 重新执行迁移，重建数据库
pnpm db:migrate

# 5. 验证表结构
pnpm db:tables

# 6. 按需重新初始化测试数据（需先启动 dev server）
pnpm db:seed

# 7. 启动开发服务器
pnpm dev
```

## 验证修复

```bash
# 检查表结构是否正常（应输出 11 张表）
pnpm db:tables

# 启动 dev server，确认无报错
pnpm dev
```

正常输出应包含以下表：

```text
_hub_migrations, chats, messages, products, site_products,
sites, store_auth_events, store_sync_logs, stores, users, votes
```

## 预防措施

- **正常退出 dev server**：使用 `Ctrl+C` 退出 `pnpm dev`，不要直接关闭终端窗口。
- **启动前检查**：启动前如发现端口被占用或数据库报错，先检查残留进程：
  ```bash
  ps aux | grep nuxt | grep -v grep
  ```
- **定期清理备份**：`.data/db/pglite-broken-*` 备份会累积，定期清理：
  ```bash
  rm -rf .data/db/pglite-broken-*
  ```

## 相关文档

- [nuxthub-本地-数据库](./nuxthub-本地-数据库.md) - 本地数据库查看、编辑和迁移说明
- [数据-初始化](./数据-初始化.md) - 本地测试数据、种子脚本和初始化流程
- [生产-部署](./生产-部署.md) - 生产环境数据库迁移注意事项
