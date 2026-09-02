# One Merchant with a development test knowledge base

MyyShop 始终使用唯一线上 Merchant 身份；0→1 开发期允许在隔离 Workspace 中建立一套 `test_only` 品牌知识库，并复用同一套非凭据线上配置。运行通过显式 `knowledge_base_ref` 选择知识库；真实知识切片到位后，测试知识库冻结归档且绝不自动转正或混入真实知识库。旧 `test_merchant` 身份模型在完成迁移验证后删除，因为测试边界属于知识库与执行范围，而不是第二个商户。
