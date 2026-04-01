# Cache API 完整指南

> 本文详细介绍 Web Cache API 的概念、使用方法、代码示例及最佳实践。

## 一、概述

Cache API 提供 Request/Response 对象对的持久化存储机制，是 Web 平台离线能力和性能优化的核心接口。

```javascript
// 核心接口
caches.open('my-cache')           // 打开或创建缓存
cache.match(request)               // 查找单个请求
cache.matchAll(request)            // 查找所有匹配请求
cache.put(request, response)       // 存储请求-响应对
cache.add(request)                 // 请求 URL 并存储响应
cache.delete(request)              // 删除缓存条目
```

**规范参考**：
- [MDN Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [MDN CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)
- [whatwg/spec: cache](https://fetch.spec.whatwg.org/#cache)

---

## 二、核心接口

### 2.1 Cache 接口

`Cache` 对象存储 Request/Response 对象对，采用 FIFO 策略（大多数浏览器限制单个缓存最多 50 个条目）。

#### 常用方法

| 方法 | 说明 |
|------|------|
| `cache.match(request)` | 查找匹配的缓存条目，返回 Response 或 undefined |
| `cache.matchAll(request, options)` | 返回所有匹配条应的数组 |
| `cache.add(request)` | fetch URL 并将结果存入缓存 |
| `cache.addAll(requests)` | 批量添加多个 URL 到缓存 |
| `cache.put(request, response)` | 手动存储请求-响应对 |
| `cache.delete(request, options)` | 删除匹配条目 |
| `cache.keys(request, options)` | 返回所有缓存键的 Request 对象数组 |

### 2.2 CacheStorage 接口

全局缓存存储器，管理多个命名 Cache 对象。

```javascript
// 全局 caches 对象
caches.open('v1')                  // 打开/创建命名缓存
caches.match(request)              // 在所有缓存中查找（快捷方法）
caches.has('v1')                   // 检查缓存是否存在
caches.delete('v1')               // 删除命名缓存
caches.keys()                      // 返回所有缓存名称
```

---

## 三、基本用法

### 3.1 打开并操作缓存

```javascript
// 打开或创建名为 'app-cache-v1' 的缓存
const cacheName = 'app-cache-v1';

caches.open(cacheName).then(async (cache) => {
  console.log('缓存已打开:', cacheName);

  // 添加资源到缓存
  await cache.add('/index.html');

  // 批量添加资源
  await cache.addAll([
    '/styles.css',
    '/app.js',
    '/images/logo.png'
  ]);

  // 从缓存中取出
  const response = await cache.match('/index.html');
  if (response) {
    const text = await response.text();
    console.log('从缓存读取:', text.substring(0, 100));
  }
});
```

### 3.2 存储自定义 Response

```javascript
caches.open('data-cache').then(async (cache) => {
  const url = '/api/users';

  // 手动构造 Response 并存入
  const response = new Response(JSON.stringify({ name: '张三', age: 25 }), {
    headers: { 'Content-Type': 'application/json' }
  });

  await cache.put(url, response);

  // 验证存入
  const cached = await cache.match(url);
  const data = await cached.json();
  console.log(data); // { name: '张三', age: 25 }
});
```

### 3.3 跨域请求缓存

Cache API 不仅可以缓存同源响应，也可以缓存跨域响应（但只能存储，不能修改）：

```javascript
caches.open('cross-origin-cache').then(async (cache) => {
  // 跨域请求会自动存储（如果返回成功）
  await cache.add('https://api.example.com/data.json');

  // 取出跨域响应
  const response = await cache.match('https://api.example.com/data.json');
  console.log('来自跨域缓存:', response);
});
```

---

## 四、缓存策略

### 4.1 Cache First（缓存优先）

优先从缓存读取，缓存未命中时访问网络。适合静态资源（CSS/JS/图片）。

```javascript
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  const cache = await caches.open('cache-first');
  cache.put(request, response.clone());
  return response;
}
```

### 4.2 Network First（网络优先）

优先访问网络，网络失败时回退到缓存。适合 API 数据（需要实时性）。

```javascript
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open('network-first');
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error; // 缓存也没有，抛出错误
  }
}
```

### 4.3 Stale-While-Revalidate（陈旧时重新验证）

立即返回缓存（如果存在），同时在后台更新缓存。适合读多写少的资源。

```javascript
async function staleWhileRevalidate(request) {
  const cache = await caches.open('swr');

  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });

  // 如果没有缓存，等待网络响应
  return cachedResponse || fetchPromise;
}
```

### 4.4 Cache Only（仅缓存）

只从缓存读取，不访问网络。适合完全离线的静态资源。

```javascript
async function cacheOnly(request) {
  const cached = await caches.match(request);
  if (!cached) {
    return new Response('资源未缓存', { status: 404 });
  }
  return cached;
}
```

### 4.5 Network Only（仅网络）

绕过缓存，直接访问网络。

```javascript
async function networkOnly(request) {
  return fetch(request);
}
```

---

## 五、常见使用场景

### 5.1 离线应用（Service Worker 集成）

```javascript
// service-worker.js
const CACHE_NAME = 'offline-app-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        OFFLINE_URL
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

### 5.2 API 响应缓存

```javascript
// 缓存 API 响应，设置合理的过期时间
async function fetchWithCache(url, cacheName = 'api-cache') {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(url);

  if (cached) {
    // 检查缓存是否过期（示例：1小时）
    const dateHeader = cached.headers.get('date');
    const cachedTime = dateHeader ? new Date(dateHeader).getTime() : 0;
    const now = Date.now();

    if (now - cachedTime < 3600000) {
      console.log('使用缓存:', url);
      return cached;
    }
  }

  const response = await fetch(url);
  if (response.ok) {
    await cache.put(url, response.clone());
  }
  return response;
}
```

### 5.3 预缓存关键资源

```javascript
// 在 Service Worker 激活时预缓存关键资源
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open('precache-v1').then(async (cache) => {
      const criticalResources = [
        '/app.js',
        '/styles.css',
        '/fonts/iconfont.woff2'
      ];
      await cache.addAll(criticalResources);

      // 清理旧缓存
      const oldCaches = await caches.keys();
      await Promise.all(
        oldCaches
          .filter(name => name !== 'precache-v1')
          .map(name => caches.delete(name))
      );
    })
  );
});
```

### 5.4 图片懒加载缓存

```javascript
// 页面图片缓存策略
async function cacheImage(src) {
  const cache = await caches.open('image-cache');

  // 缓存优先
  const cached = await cache.match(src);
  if (cached) {
    return cached;
  }

  // 网络获取后缓存
  try {
    const response = await fetch(src);
    if (response.ok) {
      await cache.put(src, response.clone());
    }
    return response;
  } catch (e) {
    console.error('图片加载失败:', src);
    throw e;
  }
}
```

---

## 六、CacheStorage 全局方法

`caches` 是全局对象，直接暴露在 Service Worker 和窗口上下文中：

```javascript
// 检查某个缓存是否存在
caches.has('v1').then(bool => console.log('v1 存在:', bool));

// 获取所有缓存名称
caches.keys().then(names => console.log('所有缓存:', names));

// 在所有缓存中查找
caches.match('/data.json').then(response => {
  console.log('在所有缓存中查找:', response);
});

// 删除所有缓存
caches.keys().then(names => {
  return Promise.all(names.map(name => caches.delete(name)));
});
```

---

## 七、请求匹配选项

`match()` 和 `delete()` 支持细粒度的匹配控制：

```javascript
// 匹配选项
const options = {
  ignoreSearch: false,      // 是否忽略 URL 查询参数
  ignoreMethod: false,       // 是否忽略 HTTP 方法（只匹配 GET）
  ignoreVary: false,        // 是否忽略 Vary 头
  cacheName: 'my-cache'     // 指定要搜索的缓存名
};

// 示例：忽略查询参数，匹配 /api/data?id=1 和 /api/data?id=2
cache.match('/api/data', { ignoreSearch: true })
  .then(response => console.log('忽略查询参数匹配:', response));
```

---

## 八、浏览器支持

| 浏览器 | 支持版本 |
|--------|---------|
| Chrome | 43+ |
| Firefox | 39+ |
| Safari | 11.1+ |
| Edge | 16+ |
| Opera | 30+ |
| iOS Safari | 11.1+ |
| Samsung Internet | 4+ |

**注意**：
- Cache API 有存储配额限制（不同浏览器限制不同）
- 跨域请求的 Response 不能被修改（只能存储原始响应）
- Cache API 在主线程和 Service Worker 中都可使用

---

## 九、最佳实践

### 9.1 缓存命名规范

```javascript
// 使用版本号管理缓存
const CACHE_VERSION = 'v1';
const CACHE_NAME = `app-${CACHE_VERSION}`;

// 更新时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('app-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
```

### 9.2 避免存储过大资源

```javascript
// 检查响应大小，避免缓存超过限制的资源
async function safePut(request, response, cache) {
  const cloned = response.clone();
  const body = await cloned.blob();

  // 跳过超过 5MB 的响应
  if (body.size > 5 * 1024 * 1024) {
    console.warn('资源过大，跳过缓存:', request.url);
    return;
  }

  await cache.put(request, response);
}
```

### 9.3 及时清理过期缓存

```javascript
// 定期清理旧缓存
async function cleanupOldCaches(keepVersions = ['v1', 'v2']) {
  const cacheNames = await caches.keys();
  const toDelete = cacheNames.filter(name => !keepVersions.includes(name));
  await Promise.all(toDelete.map(name => caches.delete(name)));
  console.log('清理了', toDelete.length, '个旧缓存');
}
```

### 9.4 错误处理

```javascript
async function safeCacheOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('缓存配额已满，需要清理旧缓存');
      // 清理策略...
    } else {
      console.error('缓存操作失败:', error);
    }
    throw error;
  }
}
```

---

## 十、参考资料

- [MDN Cache API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [MDN CacheStorage 文档](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)
- [web.dev: Cache API 指南](https://web.dev/articles/cache-api-quick-guide)
- [Google Developers: Service Worker 缓存策略](https://developer.chrome.com/docs/workbox/modules/workbox-strategies)
