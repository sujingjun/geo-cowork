import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveExtensionApiBase } from '../../extension/config'

test('扩展本地测试默认连接 localhost，已保存地址优先覆盖', () => {
  assert.equal(resolveExtensionApiBase(undefined, true), 'http://localhost:3000')
  assert.equal(resolveExtensionApiBase(undefined, false), '')
  assert.equal(resolveExtensionApiBase('  https://api.example.test/  ', false), 'https://api.example.test')
})
