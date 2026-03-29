# navigator.sendBeacon

> 用于在页面卸载时可靠地发送小量数据到服务器

## 概述

`navigator.sendBeacon()` 是浏览器 BOM API，设计用于在页面即将被卸载（unload）时可靠地发送小量数据到服务器。与 `fetch`/`XMLHttpRequest` 不同，`sendBeacon` 保证请求在页面关闭时仍能发送，不会被浏览器的页面生命周期中断。

## 基本语法

```js
navigator.sendBeacon(url, data)
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| url | String | 数据发送到的服务器地址 |
| data | ArrayBufferView, Blob, DOMString, FormData, URLSearchParams, ReadableStream | 要发送的数据（可选） |

### 返回值

- `true`：浏览器已接受数据并即将发送
- `false`：无法将数据加入传输队列（极少见）

## 核心特点

### 1. 页面卸载时可靠发送

```js
// 页面卸载时发送数据
window.addEventListener('unload', () => {
  navigator.sendBeacon('/analytics', JSON.stringify({ event: 'page_leave' }));
});
```

### 2. 异步非阻塞

`sendBeacon` 是异步的，不会阻塞页面卸载或影响导航性能。

### 3. 使用 HTTP POST

`sendBeacon` 始终使用 HTTP POST 方法发送数据。

### 4. 支持多种数据格式

```js
// DOMString
navigator.sendBeacon('/api', 'text data');

// Blob
const blob = new Blob(['data'], { type: 'text/plain' });
navigator.sendBeacon('/api', blob);

// FormData
const form = new FormData();
form.append('name', 'value');
navigator.sendBeacon('/api', form);

// JSON
const json = JSON.stringify({ key: 'value' });
navigator.sendBeacon('/api', json);
```

## 常见使用场景

### 1. Analytics 数据上报

```js
// 发送页面浏览数据
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/analytics', JSON.stringify({
      event: 'page_view',
      path: location.pathname,
      time: Date.now()
    }));
  }
});
```

### 2. 离开页面时的状态保存

```js
// 用户离开页面时保存草稿
window.addEventListener('beforeunload', () => {
  const draft = editor.getContent();
  navigator.sendBeacon('/api/save-draft', draft);
});
```

### 3. 性能日志发送

```js
// 发送性能数据
const perfData = performance.getEntriesByType('navigation')[0];
navigator.sendBeacon('/analytics/perf', JSON.stringify(perfData));
```

## sendBeacon vs fetch + keepalive

| 特性 | sendBeacon | fetch + keepalive |
|------|-----------|-------------------|
| 页面卸载时发送 | ✅ 保证 | ⚠️ 可能被取消 |
| 异步 | ✅ 非阻塞 | ✅ 非阻塞 |
| 返回响应数据 | ❌ 不支持 | ✅ 支持 |
| 请求方法 | 仅 POST | GET/POST/PUT/DELETE |
| 数据格式 | 多种 | 多种 |
| 浏览器支持 | 现代浏览器 | 现代浏览器 |

### fetch + keepalive 示例

```js
// 使用 fetch + keepalive 也可以在页面卸载时发送
window.addEventListener('unload', () => {
  fetch('/analytics', {
    method: 'POST',
    keepalive: true,
    body: JSON.stringify({ event: 'page_leave' }),
    headers: { 'Content-Type': 'application/json' }
  });
});
```

## 注意事项

### 1. 数据大小限制

虽然规范没有明确限制，但浏览器通常对 `sendBeacon` 的数据大小有限制（通常几 MB）。发送大量数据时应使用其他方案。

### 2. 无法获取响应

`sendBeacon` 不返回服务器响应数据。如果需要服务器确认收货，应使用 `fetch + keepalive`。

### 3. HTTPS 建议

建议在 HTTPS 环境下使用 `sendBeacon`，否则某些浏览器可能会降级或拒绝发送。

### 4. 与 visibilitychange 配合

推荐结合 `visibilitychange` 事件而非 `unload`/`beforeunload`，因为后者在移动端浏览器中可靠性较低：

```js
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/analytics', data);
  }
});
```

## 浏览器支持

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 59+ |
| Firefox | 31+ |
| Safari | 16.4+ |
| Edge | 79+ |
| IE | ❌ 不支持 |

## 参考资料

- [MDN: navigator.sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [W3C Beacon 规范](https://www.w3.org/TR/beacon/)
