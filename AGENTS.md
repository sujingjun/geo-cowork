# AGENTS.md — geo-cowork

## 仓库定位

本仓是**本地优先的企业品牌 GEO 专家插件**仓库：维护跨宿主插件（`plugins/geo-expert`）、品牌工作区（`workspaces/`）、SDD 工作流与文档体系（`docs/`）。

- 产品说明、安装与边界见根 [`README.md`](README.md)；文档导航入口见 [`docs/README.md`](docs/README.md)。
- tracked 内容包括：`docs/`、`plugins/`、`workspaces/`、`tests/`、根 `README.md`、`AGENTS.md`、`CHANGELOG.md`、`package.json`、`.gitignore` 及两个 Marketplace 目录（`.agents/`、`.claude-plugin/`）。
- 与云端系统 `weiyan2026/geo-agents` 当前**无运行时依赖**；双仓分工与交接条件见 `docs/plans/2026-08-20-geo-cowork-local-geo-expert-rebaseline-plan.md`。

## 权威来源与冲突顺序

- 本仓 SDD 流程、文档分类、状态定义、交接规则与授权边界，以 [`docs/workflow.md`](docs/workflow.md) 为唯一细节来源。
- 插件包装契约见 `docs/specs/0001-plugin-package-contract.md`；工作区契约见 `docs/specs/0002-workspace-contract.md`。
- 发生冲突时的处理顺序见 `docs/workflow.md` 第 2 章「知识库-first + 源码验证」：当前用户明确指令优先，其后为本文件。

## Agent 工作约束

- 开始任何实现类任务前，先阅读本文件与 `docs/workflow.md`，并按其第 8 章明确目标、成功标准、范围外事项与授权限制。
- 知识库（`docs/wiki/`）只作导航与关系发现；给出结论或修改前必须回到实际工作区核验，规则见 `docs/workflow.md` 第 2 章。
- 状态使用、批准权限与授权边界（含 commit、push、创建 PR 需当次明确授权）见 `docs/workflow.md` 第 3、16 章。
- 文档命名、元数据与 Wiki Frontmatter 要求见 `docs/workflow.md` 第 2 章「建档、命名与迁移规则」。
- 插件与脚本红线：不把业务文件写入插件安装缓存；不通过 `../../workspaces` 依赖开发仓库结构；三个 Manifest 不复制 GEO 业务规则；完整红线见重新定基线方案第 14 章。
- **替换与清理**：替换功能前核对调用方、框架扫描/动态注册及存量数据依赖，同步清理失效入口、实现、类型、配置、测试和文档引用；兼容保留须有实际依赖及移除条件，旧测试独有的有效行为须由替代实现的测试承接。
- **命名与历史**：新增产品代码、API、表、目录、类型和脚本按业务职责命名，不用 `m0/m1`、`new2/final` 等阶段或临时名称；不改写已执行迁移或历史证据。
- **关键流程注释**：用中文说明原因、分支、副作用和异常，不逐行翻译代码。

## 简洁设计与 OneGlanse 对接

涉及 Query 采集和 OneGlanse 时，先读[对接开发计划](docs/plans/2026-10-17-oneglanse-mcp-integration-plan.md)。以下是当前明确的设计边界，计划中的待实施内容不因此视为已实现。

- **按职责管理规则与状态**：cowork 负责品牌知识、Query 生成与来源、采样业务规则、结果接收、GEO 分析和人工决定记录，GEO 业务对象与证据以品牌工作区为准。OneGlanse 的原生 prompt/run/response 状态以服务为准；cowork 保存追溯与恢复所需的副本和映射，不复制其服务业务逻辑。
- **通过 Skill 和 MCP 协作**：Skill 说明如何使用能力，MCP 提供可调用接口。优先扩展已有 Skill 和共享工具；采集适配只统一必要的输入、结果和错误，新增层级或抽象须说明解决的现有问题，不另建通用采集框架、第二套任务引擎或重复编排器。
- **OneGlanse 负责服务边界**：其项目维护 MCP Server、连接授权、workspace/资源访问校验、Tools、能力声明及接口实现。cowork 不直接访问其数据库、队列、Cookie、浏览器或仓库内部函数，两仓不通过本地源码路径互相依赖。
- **首版仅封装现有能力**：沿用 OneGlanse 当前平台、采集、正文与引用处理、重试、存储和自动分析行为。仅增加必要的 MCP 授权与接口封装；原始 DOM、引用出现次数、采集算法改造、全新持久任务系统和仅采集模式不作为首版前置。
- **按真实能力验收**：完整回传指 OneGlanse 已保存的答案全文和引用字段无遗漏、无截断；未提供的上下文、质量、原始引用或任务绑定保持未知。不通过推测补齐正式采样条件，不把接口接通当作正式 Baseline 或业务效果。
- **工作区分别归属**：cowork 的 `myyshop` 与 OneGlanse 的 `MyyShop` 通过各自稳定 ID 映射，名称相同不表示共享目录、主键、知识库或授权。实际 ID 和部署信息放在当前计划/本地配置，不写入通用 Skill。
- **先做最小可验收链路**：先完成一个 Query 的授权提交、状态读取、答案与引用接收和 GEO 分析，再按实际缺口扩展。
- **业务目录与测试分开**：当前 `workspaces/` 仅保留 `myyshop`。确定性样例放 `tests/fixtures/`，测试运行使用自动清理的临时目录；人工演练使用显式临时路径，不恢复常驻演练工作区，也不依赖它们运行测试。清理先检查引用和活动进程，保留恢复依据并校验真实工作区。

## 飞书知识库镜像（MyyShop GEO）

本仓在飞书维护一套面向业务阅读的 **MyyShop GEO 知识库镜像**，用于共享知识条目、模版、阶段性治理建议、内容/证据缺口持续报告与业务确认记录。

- **位置**：知识库分组节点 `MyyShop GEO知识库`，URL <https://sjfx.feishu.cn/wiki/U1dqwTq6oiTkGkkUPuScw2mjnIg>（`space_id=7070727875250421762`，根 `node_token=U1dqwTq6oiTkGkkUPuScw2mjnIg`）。
- **操作身份**：lark-cli profile `dh-docs`（应用 `cli_a8c15e8aadb9d00b`「飞书博客」），一律 `--as bot`；该应用已被加为上述知识空间成员。文档归应用所有，便于自动化持续维护。
- **事实源边界**：本地仓库是唯一事实源，飞书为只读镜像/导航。任何结论与修改先在仓库完成并核验，再同步到飞书；禁止以飞书内容反向覆盖仓库。镜像页须标注对应仓库路径。
- **文档与源映射**（仓库 → 飞书子文档）：
  - 知识库总览与宪法 ← `workspaces/myyshop/knowledge/README.md`
  - 知识条目 02–10（9 个分类文档，合并该分类全部条目，不逐条建 doc）← `knowledge/<分类>/`
  - 模版 ← `knowledge/01-templates/`
  - 阶段性治理建议（站内/站外）← `knowledge/00-governance/`、`findings/`、`cycles/m5/`、`workspaces/myyshop/STATUS.md` 综合
  - 内容缺口与证据缺口持续报告 ← `workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md`
  - 业务确认文档 ← `workspaces/myyshop/cycles/preparation/decisions/`
- **同步触发**：上述仓库源文件发生批准的变更后，由 Agent 重新生成对应飞书镜像并更新；分类条目文档由 `tmp/feishu-build/gen-categories.mjs` 一类脚本批量生成，缺口报告仅做相对链接转写。
- **授权边界**：创建/更新飞书文档属对外可见写入，按 `docs/workflow.md` 授权规则需当次明确授权；不在飞书侧做审批、不写入任何凭据或账号标识。
