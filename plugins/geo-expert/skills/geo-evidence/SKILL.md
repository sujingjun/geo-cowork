---
name: geo-evidence
description: 登记 Source 与可校验 snapshot 的 Evidence，准备 Evidence Plan，并对 stale、checksum 和充分性缺口作只读判断。
---

# geo-evidence

## 触发场景

- 为 Claim 登记来源、快照与证据；
- 对缺证主张创建 Evidence Plan；
- 导入脱敏 legacy ops-geo audit，或检查 Evidence stale/checksum。

## 输入

工作区路径、来源定位、工作区内 snapshot 路径与 SHA-256、采集时间/方式、Claim refs；legacy import 另需工作区内 JSON 与大写 namespace。

## 开工前必读

读取工作区根文件、目标 Claim/Document、Spec 0003、Spec 0004。确认数据授权与脱敏情况；禁止读取未授权父目录和凭据文件。

## 步骤

1. 分开登记 Source 主体和 Evidence 观察，不写综合可信分。
2. 把快照保存在工作区内，记录 locator、captured_at、collector/version 和真实 SHA-256。
3. 使用模板创建 `candidate/reviewed` Evidence；只有人类批准后才允许 `approved`。
4. legacy 输入使用：

   ```bash
   node <plugin-root>/scripts/legacy-ops-geo-import.mjs --workspace <path> --input <path/in/workspace.json> --namespace <UPPER-ID>
   ```

5. 运行对象校验与 index check；对缺失类别创建 draft Evidence Plan，不自动改变 Claim。

## 输出

Source、Evidence、Evidence Plan、legacy migration summary，以及 checksum/stale/充分性诊断。

## 可做事项

- 创建候选证据链和脱敏迁移对象；
- 将无精确快照的 legacy Finding 降级为 `unverifiable`；
- 对 stale Evidence 发 warning。

## 禁止事项

- 不保留 Token、Cookie、私钥或 `.env` 值；
- 不把 URL 可访问等同于证据已批准；
- 不因 stale 自动回退 Claim/Release；不把 legacy 分数当作可比较指标。

## 失败与停止条件

快照不存在、checksum 不一致、路径逃逸、symlink、secret marker、引用错误或输入授权不明时停止，不生成观察性 Finding。

## 验收方式

Evidence 文件可复算 checksum，refs 闭包完整；legacy 输入字节未改变，重复导入幂等；warning 与业务状态保持分离。

## 示例

```bash
node <plugin-root>/scripts/workspace-validate.mjs --workspace ./brand-workspace --objects
node <plugin-root>/scripts/build-index.mjs --workspace ./brand-workspace --check
```
