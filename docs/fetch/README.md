# Fetch API 完全指南

> 本文详细介绍 Fetch API 的使用方法、核心概念、错误处理及常见踩坑点。

## 一、API 概述

### 1.1 什么是 Fetch API

Fetch API 是现代浏览器提供的原生网络请求接口，用于替代 XMLHttpRequest。它基于 Promise 设计，支持 async/await 语法，让异步请求代码更加简洁和语义化。

**核心特点**：

| 特性 | 说明 |
|------|------|
| 基于 Promise | 原生支持 Promise 链式调用和 async/await |
| 语法简洁 | 相比 XHR，API 设计更加直观 |
| 语义化 | 方法名和参数设计更加符合直觉 |
| 同构支持 | 可通过 isomorphic-fetch 在 Node.js 中使用 |

### 1.2 基本语法

```js
fetch(input, init)
  .then(response => {
    // 处理响应
  })
  .catch(error => {
    // 处理错误
  });
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| input | string / Request / URL | 请求 URL 或 Request 对象 |
| init | RequestInit | 可选配置对象 |

**init 配置选项**：

| 选项 | 类型 | 说明 |
|------|------|------|
| method | string | HTTP 方法：GET、POST、PUT、DELETE 等 |
| headers | Headers / object | 请求头 |
| body | string / FormData / URLSearchParams / Blob / ArrayBuffer / ReadableStream | 请求体 |
| mode | string | 请求模式：cors、no-cors、same-origin |
| credentials | string | 凭证模式：omit、same-origin、include |
| cache | string | 缓存模式 |
| redirect | string | 重定向模式：follow、error、manual |
| signal | AbortSignal | 中断信号 |
| referrer | string | 请求来源 |
| referrerPolicy | string | 来源策略 |

---

## 二、核心对象

### 2.1 Request 对象

Request 对象表示请求配置，可以在创建时传入 fetch，也可以单独创建。

**创建 Request**：

```js
// 方式一：直接传 URL 和配置
const req = new Request('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'fetch' })
});

// 方式二：从已有 Request 克隆并修改
const req2 = new Request(req, {
  method: 'POST',
  body: JSON.stringify({ name: 'modified' })
});
```

**Request 属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| url | string | 请求 URL |
| method | string | HTTP 方法 |
| headers | Headers | 请求头对象 |
| body | ReadableStream | 请求体流 |
| mode | string | 请求模式 |
| credentials | string | 凭证模式 |
| cache | string | 缓存模式 |
| signal | AbortSignal | 中断信号 |
| destination | string | 请求目标类型 |

**重要：Body 只能读取一次**：

```js
// ❌ 错误：Body 已被消费
const request = new Request('https://api.example.com', {
  method: 'POST',
  body: JSON.stringify({ data: 'test' })
});

fetch(request).then(r => r.json()); // OK
fetch(request).then(r => r.text()); // Error: Body has already been consumed

// ✅ 正确：使用 clone()
const req1 = new Request('https://api.example.com', {
  method: 'POST',
  body: JSON.stringify({ data: 'test' })
});
const req2 = req1.clone();

fetch(req1).then(r => r.json());
fetch(req2).then(r => r.text());
```

### 2.2 Response 对象

Response 对象表示 fetch 请求的响应结果。

**创建 Response**：

```js
// 通常由 fetch() 自动创建，也可手动创建
const response = new Response('Hello World', {
  status: 200,
  statusText: 'OK',
  headers: {
    'Content-Type': 'text/plain'
  }
});
```

**Response 属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| ok | boolean | 是否成功（状态码 200-299）|
| status | number | HTTP 状态码 |
| statusText | string | 状态文本 |
| type | string | 响应类型：basic、cors、opaque、error |
| url | string | 响应 URL |
| headers | Headers | 响应头 |
| body | ReadableStream | 响应体流 |
| redirected | boolean | 是否经过重定向 |

**Response 类型**：

| 类型 | 说明 |
|------|------|
| basic | 同源请求 |
| cors | 跨域 CORS 请求 |
| opaque | no-cors 模式的请求，响应不可读 |
| error | 网络错误产生的响应 |
| opaqueredirect | manual 重定向模式 |

### 2.3 Headers 对象

Headers 对象用于操作请求/响应的 HTTP 头。

**创建 Headers**：

```js
// 方式一：传入对象字面量
const headers1 = new Headers({
  'Content-Type': 'application/json',
  'X-Requested-With': 'fetch'
});

// 方式二：使用 append
const headers2 = new Headers();
headers2.append('Content-Type', 'application/json');
headers2.append('Authorization', 'Bearer token');
```

**Headers 方法**：

| 方法 | 说明 |
|------|------|
| get(name) | 获取指定头部的值 |
| set(name, value) | 设置或覆盖头部值 |
| append(name, value) | 追加头部值 |
| has(name) | 检查头部是否存在 |
| delete(name) | 删除头部 |
| forEach(callback) | 遍历所有头部 |

**Headers 特色**：

```js
const headers = new Headers({
  'Content-Type': 'application/json'
});

// 自动规范化：键名转为小写
headers.get('content-type'); // 'application/json'
headers.get('Content-Type'); // 'application/json'

// 自动去除首尾空白
headers.set('X-Custom', '  value  ');
headers.get('x-custom'); // 'value'
```

---

## 三、基本用法

### 3.1 GET 请求

```js
// 最简 GET 请求
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// 使用 async/await
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

### 3.2 POST 请求

```js
// POST JSON 数据
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '张三',
    age: 25
  })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));

// POST FormData
const formData = new FormData();
formData.append('username', 'zhangsan');
formData.append('password', '123456');

fetch('https://api.example.com/login', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3.3 设置请求头

```js
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Custom-Header': 'custom-value'
  }
});
```

### 3.4 发送 JSON 数据

```js
async function postJSON(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// 使用
postJSON('https://api.example.com/users', { name: '李四', age: 30 })
  .then(data => console.log('Created:', data))
  .catch(err => console.error('Failed:', err));
```

---

## 四、错误处理

### 4.1 错误类型区分

Fetch API 的错误分为两类，理解它们的区别至关重要：

| 错误类型 | 触发条件 | 示例 | 处理方式 |
|----------|----------|------|----------|
| **Network Error** | 网络断开、DNS 失败、CORS 错误等 | `TypeError: Failed to fetch` | `catch()` 捕获 |
| **HTTP Error** | 服务器返回 4xx、5xx 状态码 | 404 Not Found, 500 Internal Server Error | 需检查 `response.ok` |

**⚠️ 重要**：Fetch 只有在网络错误时才会 reject，HTTP 错误（如 404、500）仍然会 resolve！

```js
// ❌ 错误：认为 404 会被 catch 捕获
fetch('https://api.example.com/not-exist')
  .then(response => {
    // 这里 response.status = 404，不会抛出错误
    return response.json();
  })
  .catch(error => {
    // 永远不会执行到这里
  });

// ✅ 正确：显式检查 HTTP 状态
fetch('https://api.example.com/not-exist')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Request failed:', error.message);
  });
```

### 4.2 完整的错误处理模式

```js
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // 检查 HTTP 错误
    if (!response.ok) {
      // 尝试解析错误信息
      let errorMessage;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } else {
        errorMessage = await response.text();
      }
      
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${errorMessage}`);
    }
    
    // 解析成功响应
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
    
  } catch (error) {
    // 区分网络错误和业务错误
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    throw error;
  }
}
```

### 4.3 常见错误场景

**场景 1：CORS 错误**

```js
// CORS 错误会导致 fetch reject
fetch('https://other-domain.com/api')
  .catch(error => {
    // TypeError: Failed to fetch
    console.error('CORS error:', error);
  });
```

**场景 2：网络断开**

```js
// 离线或网络断开时
fetch('https://api.example.com/data')
  .catch(error => {
    if (!navigator.onLine) {
      console.error('网络已断开');
    } else {
      console.error('请求失败:', error);
    }
  });
```

**场景 3：超时**

```js
// Fetch 原生不支持超时，需要手动实现
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}

fetchWithTimeout('https://api.example.com/slow', {}, 3000)
  .catch(error => {
    if (error.name === 'AbortError') {
      console.error('请求超时');
    }
  });
```

---

## 五、AbortController（取消请求）

### 5.1 基本用法

AbortController 用于中断 fetch 请求，支持在请求进行中随时取消。

```js
const controller = new AbortController();
const signal = controller.signal;

// 发起请求
const fetchPromise = fetch('https://api.example.com/data', { signal });

// 取消请求
controller.abort();

// fetchPromise 会 reject，错误名为 'AbortError'
fetchPromise.catch(error => {
  if (error.name === 'AbortError') {
    console.log('请求已被取消');
  }
});
```

### 5.2 超时取消示例

```js
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timerId));
}

// 使用
async function loadData() {
  try {
    const data = await fetchWithTimeout('https://api.example.com/data', {
      method: 'GET'
    }, 3000);
    console.log('Data:', data);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求超时');
    }
  }
}
```

### 5.3 取消多个请求

```js
const controller = new AbortController();

// 同时发起多个请求
const requests = [
  fetch('https://api.example.com/user', { signal: controller.signal }),
  fetch('https://api.example.com/posts', { signal: controller.signal }),
  fetch('https://api.example.com/comments', { signal: controller.signal })
];

// 等待所有请求完成
Promise.all(requests)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(([user, posts, comments]) => {
    console.log({ user, posts, comments });
  })
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    }
  });

// 在某个条件满足时取消所有请求
if (someCondition) {
  controller.abort();
}
```

### 5.4 组件中使用 AbortController

```js
// React 组件中的典型用法
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function loadUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
    
    // 清理函数：组件卸载时取消请求
    return () => controller.abort();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}
```

---

## 六、流式请求（ReadableStream）

### 6.1 为什么使用流

传统的响应读取方式（如 `response.json()`）需要等待整个响应体下载完成后才能解析。流式读取允许你：

- **即时处理**：数据一到达就能处理，无需等待全部下载
- **节省内存**：大文件不需要全部加载到内存
- **实时数据**：适合处理 SSE、WebSocket 等实时数据

### 6.2 读取流数据

```js
async function* streamText(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
  // 处理最后一帧
  yield decoder.decode();
}

// 使用
async function fetchAndStream(url) {
  const response = await fetch(url);
  const stream = streamText(response);
  
  for await (const chunk of stream) {
    console.log('Received:', chunk);
  }
}
```

### 6.3 流式读取大文件

```js
// 模拟大文件下载进度
async function downloadLargeFile(url) {
  const response = await fetch(url);
  const contentLength = response.headers.get('content-length');
  let receivedLength = 0;
  
  const reader = response.body.getReader();
  const chunks = [];
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    receivedLength += value.length;
    
    // 计算进度
    if (contentLength) {
      const progress = ((receivedLength / contentLength) * 100).toFixed(2);
      console.log(`下载进度: ${progress}%`);
    }
  }
  
  // 合并所有 chunk
  const blob = new Blob(chunks);
  return blob;
}
```

### 6.4 处理 JSON 流

```js
// 逐行解析 JSON 流（如 NDJSON）
async function* readNDJSONStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      if (buffer.trim()) yield JSON.parse(buffer);
      break;
    }
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // 保留未完成的行
    
    for (const line of lines) {
      if (line.trim()) {
        yield JSON.parse(line);
      }
    }
  }
}

// 使用
async function fetchNDJSON(url) {
  const response = await fetch(url);
  
  for await (const item of readNDJSONStream(response)) {
    console.log('Item:', item);
  }
}
```

### 6.5 流式上传

```js
// 使用 ReadableStream 上传大文件
async function uploadWithStream(file) {
  const stream = file.stream();
  const reader = stream.getReader();
  
  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    headers: {
      'Content-Type': file.type
    },
    body: new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          controller.enqueue(value);
        }
      }
    })
  });
  
  return response.json();
}
```

---

## 七、Fetch vs XHR 对比

### 7.1 核心区别

| 维度 | Fetch | XMLHttpRequest |
|------|-------|----------------|
| API 设计 | 基于 Promise，链式调用 | 基于事件，回调嵌套 |
| 语法简洁性 | 简洁，语义化 | 繁琐，配置混乱 |
| 异步模型 | Promise + async/await | 事件监听 |
| 错误处理 | 仅网络错误 reject，HTTP 错误需手动判断 | status < 200 或 > 206 时 onerror |
| 超时控制 | 需借助 AbortController | 原生支持 timeout |
| 取消请求 | AbortController | abort() |
| 流处理 | ReadableStream | 不支持 |
| 同构支持 | isomorphic-fetch | 不可用 |

### 7.2 代码对比

**发送 JSON POST 请求**：

```js
// XHR 方式
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/data');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.responseType = 'json';

xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(xhr.response);
  } else {
    console.error('Error:', xhr.statusText);
  }
};

xhr.onerror = function() {
  console.error('Network Error');
};

xhr.send(JSON.stringify({ name: 'fetch' }));

// Fetch 方式
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'fetch' })
})
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Fetch + async/await
async function postData() {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'fetch' })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 7.3 特性对比表

| 特性 | Fetch 支持 | XHR 支持 |
|------|------------|----------|
| Promise API | ✅ | ❌ |
| async/await | ✅ | ❌ |
| 流式响应 | ✅ ReadableStream | ❌ |
| 流式请求 | ✅ | ❌ |
| 请求/响应头操作 | ✅ Headers 对象 | ✅ setRequestHeader |
| 进度事件 | ❌（需用 Stream） | ✅ onprogress |
| 超时设置 | ❌（需 AbortController） | ✅ timeout |
| 同步模式 | ❌ | ✅（已废弃） |
| 请求取消 | ✅ AbortController | ✅ abort() |
| CORS 跨域 | ✅ | ✅ |
| credentials 控制 | ✅ | ❌（依赖服务器） |
| mode 控制 | ✅ | ❌ |

### 7.4 Fetch 的优势

1. **代码更简洁**：避免回调地狱，逻辑更清晰
2. **更好的错误处理**：统一的 Promise 错误处理机制
3. **支持现代异步语法**：async/await 让异步代码像同步
4. **更好的模块化**：Request、Response、Headers 解耦清晰
5. **流处理能力**：原生支持流式读写
6. **Service Worker 友好**：Fetch 是 Service Worker 的核心 API

### 7.5 XHR 的适用场景

1. **需要进度事件**：上传/下载大文件需要实时进度
2. **同步请求**：某些遗留代码需要同步请求（虽已废弃）
3. **旧浏览器兼容**：需要支持 IE9 及以下（Fetch 不支持）

---

## 八、常见踩坑点

### 8.1 Cookie 默认不发送

**问题**：Fetch 请求默认不携带 Cookie，导致会话丢失。

```js
// ❌ 错误：Cookie 不会发送
fetch('https://api.example.com/user')
  .then(r => r.json());

// ✅ 正确：设置 credentials
fetch('https://api.example.com/user', {
  credentials: 'include'  // 始终发送 Cookie
});
```

**credentials 选项**：

| 选项 | 说明 |
|------|------|
| omit | 从不发送 Cookie（默认）|
| same-origin | 仅同源请求发送 |
| include | 始终发送（包括跨域）|

### 8.2 Body 只能读取一次

**问题**：Response 或 Request 的 body 是一个流，读取后就会耗尽。

```js
// ❌ 错误：第二次读取会失败
fetch('https://api.example.com/data')
  .then(response => {
    console.log(response.json()); // 第一次读取
    console.log(response.text()); // 第二次读取会失败！
  });

// ✅ 正确：只能选择一种方式读取
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// 或者 clone 后再读取
fetch('https://api.example.com/data')
  .then(async response => {
    const clone = response.clone();
    const json = await response.json();
    const text = await clone.text();
    return { json, text };
  });
```

### 8.3 HTTP 错误不会 reject

**问题**：服务器返回 404、500 等错误时，fetch 不会 reject。

```js
// ❌ 错误：认为 404 会被 catch
fetch('https://api.example.com/not-exist')
  .then(response => {
    // response.status = 404，但不会抛出错误
    return response.json();
  })
  .catch(err => console.log('不会到这里'));

// ✅ 正确：检查 response.ok
fetch('https://api.example.com/not-exist')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .catch(err => console.error('这里才会捕获错误'));
```

### 8.4 请求不会自动超时

**问题**：Fetch 没有内置超时机制，请求可能永远挂起。

```js
// ❌ 错误：无超时，可能永远等待
fetch('https://slow-api.example.com/data');

// ✅ 正确：使用 AbortController 实现超时
function fetchWithTimeout(url, options = {}, ms = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}
```

### 8.5 no-cors 模式响应不可读

**问题**：使用 `mode: 'no-cors'` 时，响应类型为 opaque，无法读取 body 和 headers。

```js
// ❌ 错误：no-cors 响应不可读
fetch('https://other-domain.com/api', { mode: 'no-cors' })
  .then(response => {
    console.log(response.status); // 0
    console.log(response.headers); // 空
    return response.json(); // 失败
  });

// ✅ 正确：确保服务器支持 CORS
fetch('https://other-domain.com/api', {
  mode: 'cors', // 需要服务器设置 CORS 头
  credentials: 'include'
});
```

### 8.6 请求体类型自动设置

**问题**：手动设置 Content-Type 可能与实际 body 类型不匹配。

```js
// ❌ 错误：FormData 会自动设置 Content-Type
const formData = new FormData();
formData.append('file', file);

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data' // 不要手动设置！
  },
  body: formData
});

// ✅ 正确：让 Fetch 自动处理 Content-Type
const formData = new FormData();
formData.append('file', file);

fetch(url, {
  method: 'POST',
  body: formData // 自动设置正确的 Content-Type
});
```

### 8.7 跨域请求头限制

**问题**：某些请求头不能手动设置，由浏览器自动处理。

```js
// ❌ 错误：这些头不能手动设置
fetch(url, {
  headers: {
    'Origin': 'https://example.com', // Forbidden
    'User-Agent': 'Custom Agent',    // Forbidden
    'Referer': 'https://example.com'  // 部分浏览器限制
  }
});

// ✅ 正确：这些头可以正常设置
fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value'
  }
});
```

### 8.8 中断请求后继续读取会报错

**问题**：请求被 abort 后，如果继续读取 body 会抛出 AbortError。

```js
async function fetchData() {
  const controller = new AbortController();
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    
    // 在读取 body 之前中断
    controller.abort();
    
    // 这里会抛出 AbortError
    const data = await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求已取消');
    }
  }
}
```

---

## 九、最佳实践

### 9.1 封装通用请求函数

```js
class FetchClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  async request(url, options = {}) {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    // 处理 body
    if (config.body && typeof config.body === 'object' && 
        !(config.body instanceof FormData) && 
        !(config.body instanceof Blob) &&
        !(config.body instanceof ArrayBuffer)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(fullURL, config);

      // 检查 HTTP 错误
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      // 自动解析 JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text();

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('网络连接失败，请检查网络设置');
      }
      throw error;
    }
  }

  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  post(url, body, options = {}) {
    return this.request(url, { ...options, method: 'POST', body });
  }

  put(url, body, options = {}) {
    return this.request(url, { ...options, method: 'PUT', body });
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// 使用
const api = new FetchClient('https://api.example.com');

api.get('/users')
  .then(users => console.log(users));

api.post('/users', { name: '张三', age: 25 })
  .then(user => console.log(user));
```

### 9.2 并行请求处理

```js
// 并行发送多个请求
async function fetchAll() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  
  return { users, posts, comments };
}

// 请求失败不影响其他请求
async function fetchAllSettled() {
  const results = await Promise.allSettled([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  
  return results.map((result, index) => ({
    index,
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}
```

### 9.3 请求缓存策略

```js
// 简单的内存缓存
const cache = new Map();

async function fetchWithCache(url, options = {}) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  // 缓存有效期 5 分钟
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}
```

---

## 十、浏览器兼容性

### 10.1 原生支持情况

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 42+ |
| Firefox | 39+ |
| Safari | 10.1+ |
| Edge | 14+ |
| IE | 不支持 |

### 10.2 Polyfill 方案

对于需要支持旧版浏览器（IE8+）的场景，可以使用 polyfill：

```html
<!-- 必须先引入 ES5 polyfill -->
<script src="https://cdn.jsdelivr.net/npm/es5-shim@4.5.14/es5-shim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/es5-shim@4.5.14/es5-sham.min.js"></script>

<!-- 引入 Promise polyfill -->
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4.3.0/dist/es6-promise.min.js"></script>

<!-- 引入 Fetch polyfill -->
<script src="https://cdn.jsdelivr.net/npm/fetch-ie8@1.6.0/fetch.min.js"></script>
```

**常用 polyfill 库**：

| 库 | 说明 |
|----|------|
| [github/fetch](https://github.com/github/fetch) | 官方 Fetch polyfill |
| [fetch-ie8](https://github.com/camsong/fetch-ie8) | 支持 IE8 的 Fetch polyfill |
| [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) | 前后端同构 Fetch |

---

## 十一、总结

**核心要点**：

| 规则 | 说明 |
|------|------|
| ✅ 检查 response.ok | HTTP 错误不会自动抛出 |
| ✅ 设置 credentials | 需要 Cookie 时必须设置 |
| ✅ 处理超时 | 使用 AbortController |
| ✅ Body 只能读一次 | 需要多次读取时 clone |
| ✅ 正确设置 Headers | 不要手动设置 FormData 的 Content-Type |
| ✅ 理解 Response 类型 | opaque 类型响应不可读 |

**推荐封装模式**：

```js
// 推荐的 fetch 封装
async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    ...options
  });
  
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = response;
    throw error;
  }
  
  return response.json();
}
```

**MDN 参考文档**：

- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [Using Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
- [Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)
- [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)
- [Headers](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers)
- [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)
