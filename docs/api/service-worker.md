# Service Worker API

> Service Worker 是运行在浏览器独立线程中的脚本，可拦截网络请求、缓存资源、实现离线应用和 PWA

## 概述

Service Worker 是浏览器提供的在后端运行的脚本，独立于网页存在，用于：
- 拦截和修改网络请求
- 缓存资源实现离线访问
- 推送通知
- 后台同步

**关键特性**：
- 运行在独立进程，不阻塞主线程
- 完全异步，基于 Promise
- 无法访问 DOM
- 仅在 HTTPS（ 或 localhost）环境下可用

## 生命周期

```
Installing → Installed → Activating → Activated → Redundant
```

### 1. Installing（安装中）

```js
// service-worker.js

// 缓存资源
const CACHE_NAME = 'my-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/images/logo.png'
];

// 安装事件
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...');
  
  // 等待缓存完成
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存资源...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('资源缓存完成');
        return self.skipWaiting(); // 立即激活
      })
  );
});
```

### 2. Activating（激活中）

```js
// 激活事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活中...');
  
  event.waitUntil(
    // 清理旧缓存
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        console.log('Service Worker 已激活');
        return self.clients.claim(); // 立即接管所有页面
      })
  );
});
```

### 3. Fetch（拦截请求）

```js
// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 仅处理同源请求
  if (url.origin !== location.origin) return;
  
  event.respondWith(
    // 缓存优先策略
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // 缓存未命中，发送网络请求
        return fetch(request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 缓存新的响应
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
            
            return response;
          });
      })
  );
});
```

## 核心 API

### ServiceWorkerContainer

主页面控制 Service Worker 的入口：

```js
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('注册成功:', registration.scope);
    })
    .catch((error) => {
      console.error('注册失败:', error);
    });
}

// 监听状态变化
navigator.serviceWorker.ready.then((registration) => {
  console.log('Service Worker 就绪');
});

// 获取当前活动的 Service Worker
navigator.serviceWorker.controller
```

### ServiceWorkerRegistration

```js
navigator.serviceWorker.register('/sw.js')
  .then((registration) => {
    // 作用域
    console.log(registration.scope);
    
    // 更新检查
    registration.update();
    
    // 卸载
    // registration.unregister();
    
    // 状态
    console.log(registration.active);      // 活动的 Worker
    console.log(registration.waiting);     // 等待中的 Worker
    console.log(registration.installing);   // 安装中的 Worker
  });
```

### ServiceWorkerGlobalScope

Service Worker 脚本的全局上下文：

```js
// Service Worker 内部
console.log(self); // ServiceWorkerGlobalScope

// 可用事件
self.addEventListener('install', ...);
self.addEventListener('activate', ...);
self.addEventListener('fetch', ...);
self.addEventListener('message', ...);
self.addEventListener('sync', ...);
self.addEventListener('push', ...);
```

## 缓存策略

### 1. Cache First（缓存优先）

适用于静态资源（CSS、JS、图片）：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open('static-v1')
              .then((cache) => cache.put(event.request, clone));
            return response;
          });
      })
  );
});
```

### 2. Network First（网络优先）

适用于 API 数据：

```js
self.addEventListener('fetch', (event) => {
  // 仅处理 API 请求
  if (!event.request.url.includes('/api/')) return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open('api-v1')
          .then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // 网络失败，返回缓存
        return caches.match(event.request);
      })
  );
});
```

### 3. Stale While Revalidate

先返回缓存，同时后台更新：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('static-v1')
      .then((cache) => {
        return cache.match(event.request)
          .then((cachedResponse) => {
            // 后台更新
            const fetchPromise = fetch(event.request)
              .then((networkResponse) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            
            // 返回缓存或等待网络
            return cachedResponse || fetchPromise;
          });
      })
  );
});
```

## 消息通信

### 主页面 → Service Worker

```js
// 主页面
navigator.serviceWorker.controller.postMessage({
  type: 'SKIP_WAITING'
});

// 接收消息
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### Service Worker → 主页面

```js
// Service Worker
self.clients.matchAll()
  .then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'CACHE_UPDATED',
        url: '/new-content'
      });
    });
  });
```

## 离线支持

### 完整离线应用

```js
const CACHE_NAME = 'offline-app-v1';

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // 网络失败，返回缓存的离线页面
        return caches.match('/offline.html');
      })
  );
});
```

## PWA 清单

- [ ] 在 HTTPS 下运行（或 localhost）
- [ ] 注册 Service Worker
- [ ] 实现 install 事件缓存静态资源
- [ ] 实现 activate 事件清理旧缓存
- [ ] 实现 fetch 事件拦截请求
- [ ] 提供离线回退页面
- [ ] 支持 Web App Manifest

## 调试技巧

### Chrome DevTools

1. 打开 `chrome://inspect/service-workers`
2. 或在 DevTools → Application → Service Workers

### Console 日志

```js
// Service Worker 中使用 console
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
});
```

### 跳过等待

```js
// 强制立即激活
self.skipWaiting();

// 接管所有页面
self.clients.claim();
```

## 浏览器支持

- Chrome 40+
- Firefox 44+
- Safari 11.1+
- Edge 17+

## 相关链接

- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [Google Workbox](https://developers.google.com/web/tools/workbox) - Service Worker 工具库
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
