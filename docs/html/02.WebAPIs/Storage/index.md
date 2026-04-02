# Storage

**讲解**

本节介绍浏览器客户端存储的三大 API：localStorage、sessionStorage、IndexedDB。

## 存储类型对比

| 特性 | localStorage | sessionStorage | IndexedDB |
|------|------------|-----------------|-----------|
| 容量 | ~5-10MB | ~5-10MB | ~50MB+ |
| 有效期 | 永久（手动删除） | 标签页关闭 | 永久（手动删除） |
| 访问范围 | 同源 | 同源+同标签页 | 同源 |
| API 形式 | 同步 | 同步 | 异步 |
| 数据类型 | 仅字符串 | 仅字符串 | 任意类型 |

## 常见问题

1. **容量限制**：超出配额时抛出 `QuotaExceededError`
2. **类型转换**：所有值自动转为字符串，存储对象需 `JSON.stringify`
3. **同源策略**：不同源的页面无法互相访问存储
4. **同步 API**：localStorage/sessionStorage 会阻塞主线程，大数据不适用
5. **IndexedDB vs Web SQL**：Web SQL 已废弃，IndexedDB 是标准方案
