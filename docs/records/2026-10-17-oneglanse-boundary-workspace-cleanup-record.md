# OneGlanse 首版边界、AGENTS 与工作区清理记录

- 状态：verified（仅边界文档、目录清理及受影响测试；MCP 尚未实现）
- 创建/更新：2026-10-17
- 来源：用户要求清理 `workspaces/` 中除 myyshop 外的工作区；cowork 通过 Skill/MCP 对接，OneGlanse 负责 MCP Server 授权、Tools 和能力接口，第一版不变更能力；同步简洁设计约定到 cowork 的 AGENTS。
- 关联：[开发计划](../plans/2026-10-17-oneglanse-mcp-integration-plan.md)、[AGENTS](../../AGENTS.md)、[首次核验](2026-10-17-oneglanse-mcp-planning-record.md)。
- 工作目录：`/Users/sujingjun/geo-cowork`。
- 基线/分支：`main@eb8512a3db29e2d9f848c9db41ef607f504536c0`；保留同会话上一轮五份规划文档改动。本轮无 commit/push/PR。
- 任务范围：计划收紧、协作规则、演练目录清理、受影响测试和导航修复；不开发 MCP 或改造 OneGlanse 业务功能。

## 1. 已调整的首版边界

计划由采集能力改造方案收紧为现有能力的接口封装：OneGlanse 维护 MCP 授权、scope、Tools、能力声明和完整结果传输；cowork 保持本地知识/Query/GEO 分析职责，通过现有 Skill 调用并落盘接收。

保留 OneGlanse 原有提取、引用、内部重试、存储、调度和自动分析。原始 DOM、occurrence 保真、新持久任务系统、独立 artifact/ack 和仅采集模式移出首版。能力不足按 unknown/unsupported 报告，不放宽正式采样证据要求。AGENTS 只保存稳定约定，接口细节引用计划。

## 2. MyyShop 与运行实例核验

- cowork：`workspace_id=ws_myyshop2026082400000000000`，`merchant_ref=MER-MYYSHOP-001`，`workspace_mode=online`，`knowledge_base_ref=null`。
- OneGlanse：本地 PostgreSQL 的只读 SELECT 返回唯一 `MyyShop / myyshop / www.myyshop.com`，工作区 ID 为 `workspace_abeabd53-ba17-4fae-b3c8-c2001f208a4e`。使用 `PGOPTIONS=-c default_transaction_read_only=on`；只读了 id/name/slug/domain，未读取账号或答案，未修改业务数据库。
- 当前 Compose 项目为 `oneglanse-app`，容器标签指向 `/Users/sujingjun/github/oneglanse`；其 HEAD 为 `92640e2`，有用户已有未提交改动。前轮源码核验目录 `/Users/sujingjun/dhnb/oneglanse` 为干净的 `b2c6e73`。本轮只读确认相关 prompt/run/result 服务形状，不将两份代码视为同一运行版本，也没有修改任一 OneGlanse checkout。
- 两侧 workspace 通过稳定 ID 关联，未合并数据或登录态；正式业务暂停保持原状。

## 3. 清理范围与恢复

清理前通过目录、文件计数、Git 状态、`du`、进程匹配和三次 `lsof +D` 检查。目标无本地改动/未跟踪文件、无 symlink、无活动进程或打开文件匹配。`lsof` 无匹配返回 1，不作为清理失败。

| 已移出目录 | 文件数 | 文件内容 bytes |
| --- | ---: | ---: |
| `workspaces/myyshop-development-test` | 71 | 27,371 |
| `workspaces/myyshop-geo-e2e` | 5,146 | 13,272,496 |
| `workspaces/myyshop-geo-e2e-verified` | 7,280 | 19,331,524 |
| 合计 | 12,497 | 32,631,391 |

同时移出 `workspaces/.DS_Store`。全部通过目录 rename 移到 `/Users/sujingjun/.Trash/geo-cowork-workspaces-20261017-141458/`，保留可恢复内容，不宣称因此释放磁盘空间。现在 `workspaces/` 只含 `myyshop`。

保留的 `myyshop` 共 2,139 文件。对排序后的相对路径、bytes、逐文件 SHA-256 清单计算 tree hash，清理前后均为：

```text
ea454fb700221216cc9ed6fb1ab54f0f54d4194ad53520ea610feced0dfe1039
```

三个移出目录也逐文件核对恢复副本，内容一致。完整本地清单与收据在被忽略的 `tmp/workspace-cleanup-20261017/`；废纸篓副本包含 `cleanup-receipt.json`。

这些目录原来均受 Git 跟踪。除本地恢复副本外，也可按历史基线读取具体证据，例如：

```bash
git show eb8512a:workspaces/myyshop-geo-e2e-verified/reports/engineering-acceptance.json
```

需要恢复整个目录时应按新的明确任务范围决定；本次没有恢复常驻测试目录。

## 4. 受影响依赖修复

- `tests/m8-conformance.test.mjs` 原先直接读取已清理工作区。改为复用 `createM6FixtureWorkspace` / `seedM6FreezeInputs`，在临时目录构造相同语义的 conformance 输入，测试结束自动删除；保留两套 packaging、shared Tool 和 WorkBuddy semantic fixture 的原验收断言。
- README 与当前 runbook 改用临时演练路径或现有确定性测试入口，不引导重新建立已清理常驻目录。
- 两份历史验收记录保留原结论和旧路径，新增恢复说明，撤下失效的本地文件链接。其余历史 Record/Handoff/Changelog 中的旧命令保留历史语义，不改写为本轮执行事实。
- `AGENTS.md` 新增简洁设计、两仓职责、首版能力边界、工作区映射和测试目录约定；同步计划、Wiki 与文档导航。

## 5. 检查结果与限制

| 检查 | 实际结果 |
| --- | --- |
| 清理脚本与前后逐文件比较 | 退出码 0；只剩 myyshop，2,139 个文件内容不变，12,497 个移出文件与恢复副本一致 |
| `npm run test:m8-conformance` | 退出码 0；5/5，通过临时 fixture 继续覆盖原有 conformance 合同 |
| `node --test tests/lifecycle-readiness.test.mjs` | 退出码 0；4/4 |
| `npm run check:docs` | 退出码 0；163 份 Markdown、327 条本地链接，0 错误 |
| `npm run validate:plugin` | 退出码 0；已有 Manifest、MCP 配置、Skills 与共享契约通过 |
| `git diff --check`、Wiki source/Frontmatter、Markdown 围栏检查 | 退出码 0 |
| tests/plugins 对旧常驻 workspace 路径的精确搜索 | 无匹配；`tests/fixtures/` 中同名的确定性素材保留 |

验证限于清理依赖与文档，未重复执行无关全仓测试。本轮没有执行真实消费者采集、模型调用、正式业务恢复或飞书同步；MCP 接口仍为 proposed。
