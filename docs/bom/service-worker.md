# Service Worker 与 Cache Storage 完全指南

> 本文详细介绍 Service Worker 和 Cache Storage API 的使用方法、生命周期及常见应用场景。

## 一、概念概述

### 1.1 Service Worker 是什么？

Service Worker 是浏览器在后台运行的脚本，独立于网页面。它是一种 Web Worker，提供离线体验、拦截网络请求、推送通知等功能。

**核心特性**：

| 特性 | 说明 |
|------|------|
| 独立线程 | 运行在浏览器独立线程，不阻塞主线程 |
| 事件驱动 | 基于事件机制（install、activate、fetch） |
| 离线能力 | 拦截网络请求，提供缓存内容 |
| 生命周期 | 安装 → 激活 → 终止（等待事件唤醒） |

### 1.2 Cache Storage 是什么？

Cache Storage 是 Web API，用于存储 `Request`/`Response` 对象对。它通常与 Service Worker 配合使用，实现资源的缓存和离线访问。

**核心特性**：

| 特性 | 说明 |
|------|------|
| 存储内容 | `Request` / `Response` 对象对 |
| 持久性 | 遵循同源策略 |
| 配额管理 | 受浏览器存储配额限制 |
| 异步 API | 基于 Promise |

---

## 二、生命周期

### 2.1 Service Worker 生命周期

```
注册 → 安装（install）→ 激活（activate）→ 终止 ↔ 事件处理
```

**生命周期图解**：

```
┌─────────────────────────────────────────────────────────────┐
│  页面加载                                                    │
│       ↓                                                      │
│  navigator.serviceWorker.register('/sw.js')                  │
│       ↓                                                      │
│  ┌─────────────────┐                                        │
│  │   install 事件   │ ← 缓存静态资源                          │
│  │  self.skipWaiting()  跳过等待，立即激活                     │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│  ┌─────────────────┐                                        │
│  │  activate 事件   │ ← 清理旧缓存                            │
│  │  self.clients.claim()  立即接管页面                        │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│  ┌─────────────────┐                                        │
│  │   fetch 事件     │ ← 拦截网络请求                          │
│  │   push 事件      │ ← 推送通知                              │
│  │   sync 事件      │ ← 后台同步                              │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│       空闲终止                                                │
│       事件唤醒                                                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 生命周期代码示例

```js
// sw.js - Service Worker 文件

// 1. install 事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open('static-v1').then((cache) => {
      console.log('缓存静态资源');
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
  // 跳过等待，立即激活
  self.skipWaiting();
});

// 2. activate 事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== 'static-v1')
          .map((name) => caches.delete(name))
      );
    })
  );
  // 立即接管所有页面
  self.clients.claim();
});

// 3. fetch 事件 - 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中返回缓存，否则发起网络请求
      return response || fetch(event.request);
    })
  );
});
```

---

## 三、缓存策略

### 3.1 常见缓存策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| Cache First | 缓存优先，失败时网络 | 静态资源（CSS/JS/图片）|
| Network First | 网络优先，失败时缓存 | API 数据 |
| Stale-While-Revalidate | 先返回缓存，后台更新 | 不频繁变化的数据 |
| Network Only | 仅网络 | 实时数据 |
| Cache Only | 仅缓存 | 完全离线 |

### 3.2 策略代码实现

**Cache First（缓存优先）**：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // 缓存命中
      }
      // 缓存未命中，发起网络请求
      return fetch(event.request).then((networkResponse) => {
        // 可选：将新资源加入缓存
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open('dynamic-v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
```

**Network First（网络优先）**：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 网络成功，缓存响应
        if (response.ok) {
          const responseClone = response.clone();
          caches.open('api-v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，返回缓存
        return caches.match(event.request);
      })
  );
});
```

**Stale-While-Revalidate**：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('static-v1').then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // 后台更新缓存
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        // 先返回缓存，后台更新
        return cachedResponse || fetchPromise;
      });
    })
  );
});
```

---

## 四、Cache Storage API

### 4.1 核心 API

| 方法 | 说明 |
|------|------|
| `caches.open(name)` | 打开或创建指定名称的缓存 |
| `caches.has(name)` | 检查缓存是否存在 |
| `caches.keys()` | 获取所有缓存名称 |
| `caches.delete(name)` | 删除指定缓存 |

### 4.2 Cache 对象方法

| 方法 | 说明 |
|------|------|
| `cache.match(request)` | 查找匹配的缓存 |
| `cache.matchAll(request)` | 查找所有匹配的缓存 |
| `cache.add(request)` | 发起请求并缓存响应 |
| `cache.addAll(requests)` | 批量添加请求到缓存 |
| `cache.put(request, response)` | 手动存储请求/响应对 |
| `cache.delete(request)` | 删除指定请求的缓存 |
| `cache.keys()` | 获取所有缓存的请求 |

### 4.3 API 代码示例

```js
// 打开缓存
const cache = await caches.open('my-cache-v1');

// 添加单个资源
await cache.add('/api/data.json');

// 批量添加资源
await cache.addAll([
  '/index.html',
  '/styles.css',
  '/app.js'
]);

// 查找缓存
const response = await cache.match('/api/data.json');

// 查找所有匹配
const responses = await cache.matchAll('/api/', {
  ignoreSearch: true
});

// 手动存储
const request = new Request('/api/user');
const response = new Response(JSON.stringify({ name: 'John' }));
await cache.put(request, response);

// 删除
await cache.delete('/api/data.json');
```

---

## 五、离线应用实战

### 5.1 完整离线应用示例

```js
// sw.js
const CACHE_NAME = 'offline-app-v1';
const OFFLINE_URL = '/offline.html';

// 需要缓存的资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/app.js',
  '/logo.png'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// fetch 事件 - 离线优先策略
self.addEventListener('fetch', (event) => {
  // 仅处理同源请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 网络成功，克隆并缓存
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，返回缓存或离线页面
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 返回离线页面
          return caches.match(OFFLINE_URL);
        });
      })
  );
});
```

### 5.2 页面注册 Service Worker

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW 注册成功:', registration.scope);
      
      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新版本可用
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('SW 注册失败:', error);
    }
  });
}

function showUpdateNotification() {
  if (confirm('有新版本可用，是否更新？')) {
    window.location.reload();
  }
}
</script>
```

---

## 六、进阶功能

### 6.1 后台同步（Background Sync）

```js
// 页面端
async function sendData(data) {
  // 先发送到服务器
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    // 请求失败，注册后台同步
    await navigator.serviceWorker.ready;
    const syncManager = registration.sync;
    await syncManager.register('sync-data');
  }
}

// Service Worker 端
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: localStorage.getItem('pendingData')
  });
  if (response.ok) {
    localStorage.removeItem('pendingData');
  }
}
```

### 6.2 推送通知

```js
// Service Worker 订阅推送
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 点击通知
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

### 6.3 消息通信

```js
// 页面 → Service Worker
navigator.serviceWorker.controller.postMessage({
  type: 'SKIP_WAITING'
});

// Service Worker → 页面
self.clients.matchAll().then((clients) => {
  clients.forEach((client) => {
    client.postMessage({
      type: 'CACHE_UPDATED',
      payload: { url: '/new-content' }
    });
  });
});
```

---

## 七、调试技巧

### 7.1 Chrome DevTools

| 功能 | 位置 | 说明 |
|------|------|------|
| Service Workers | Application → Service Workers | 查看注册的 SW |
| Cache Storage | Application → Cache Storage | 查看缓存内容 |
| Clear storage | Application → Clear storage | 清除所有缓存 |

### 7.2 控制台命令

```js
// 注销 Service Worker
navigator.serviceWorker.getRegistration().then(reg => reg.unregister());

// 获取所有注册
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => console.log(reg.scope));
});

// 手动触发更新
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
});
```

---

## 八、常见问题

### Q1：Service Worker 和 Web Worker 的区别？

| 维度 | Service Worker | Web Worker |
|------|----------------|-------------|
| 生命周期 | 长期运行，可监听事件 | 任务结束即终止 |
| 作用域 | 整个-origin 或子路径 | 创建时的脚本路径 |
| 缓存 | 内置缓存 API | 无内置缓存 |
| 离线能力 | 支持 | 不支持 |
| 拦截请求 | 支持 | 不支持 |

### Q2：为什么需要 skipWaiting 和 clients.claim？

- `skipWaiting()`：让新的 Service Worker 立即激活，不等待旧页面关闭
- `clients.claim()`：让新的 Service Worker 立即接管所有客户端页面

### Q3：缓存配额是多少？

不同浏览器配额不同，通常：
- Chrome：配额共享（LocalStorage / IndexedDB / Cache Storage）
- 大约 50MB-无限制（根据可用空间）

### Q4：如何更新缓存？

```js
// 在 activate 事件中清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name === 'my-cache' && !name.endsWith('-v2'))
          .map((name) => caches.delete(name))
      );
    })
  );
});
```

---

## 九、总结

**核心要点**：

| 规则 | 说明 |
|------|------|
| ✅ 注册在页面 load 事件中 | 避免阻塞渲染 |
| ✅ install 事件缓存静态资源 | 提前准备离线能力 |
| ✅ activate 事件清理旧缓存 | 避免占用过多空间 |
| ✅ fetch 事件实现缓存策略 | 根据需求选择策略 |
| ✅ 使用 skipWaiting + clients.claim | 快速更新 |
| ✅ 提供离线回退页面 | 提升离线体验 |
