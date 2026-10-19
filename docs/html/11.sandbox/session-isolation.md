# 浏览器沙箱与 Session 隔离

> 本文档探讨 Web 页面嵌入第三方 URL 时，如何实现不同"登录态"隔离，模拟 Electron sessionStorage 隔离效果。

## 背景问题

### 核心诉求

Web 页面内部嵌入第三方 URL，切换 Tab 时需要支持不同登录态，类似 Electron sessionStorage 隔离效果。

### Electron 的实现原理

Electron 中的 `sessionStorage` 隔离机制：
- 每个 BrowserWindow 有独立的 Session
- 每个 Session 有独立的 storage partition
- sessionStorage 按 origin 隔离，但不同窗口/分区之间互相不可见

### Web 环境的困境

- 传统 Web 中，第三方 iframe 与宿主页面共享同一 storage partition
- 即便不同 Tab，由于同源策略限制，storage 仍按 origin 划分
- 想要让同一 origin 下的不同"身份"隔离，需要额外的浏览器机制

---

## 一、浏览器安全模型基础

### 1.1 Origin 模型

```
origin = protocol + host + port
https://example.com:443 → 唯一 origin
```

存储 API（sessionStorage/localStorage/cookies）按 origin 隔离。

### 1.2 沙箱属性（Sandbox Attribute）

`<iframe sandbox>` 通过设置 `allow-same-origin` 等指令控制隔离级别：

| sandbox 值 | 效果 |
|-----------|------|
| 无 sandbox | 继承父页面全部权限 |
| `allow-same-origin` | 将 iframe 视为同源（可访问父页面 DOM） |
| 无 `allow-same-origin` | iframe 成为 unique origin，无法访问父页面 |
| `allow-scripts` | 允许执行脚本 |
| `allow-forms` | 允许表单提交 |
| `allow-popups` | 允许 window.open/popups |
| `allow-modals` | 允许 alert/confirm 等 |
| `allow-pointer-lock` | 允许 Pointer Lock API |

### 1.3 存储分区（Storage Partition）

现代浏览器为防止跨站追踪，对顶级页面和第三方 iframe 采用**存储分区**：

- 顶级页面：partition key = `(top-level origin, agentClusterId)`
- 第三方 iframe：partition key = `(top-level origin, nave site, agentClusterId)`

这意味着即使 iframe 内 URL 相同，不同顶级页面下的 iframe 也有不同的存储空间。

---

## 二、关键隔离机制详解

### 2.1 COOP（Cross-Origin-Opener-Policy）

COOP 响应头控制窗口关系：

```
Cross-Origin-Opener-Policy: same-origin | same-origin-allow-popups | unsafe-none
```

| 值 | 效果 |
|----|------|
| `same-origin` | 强制同源窗口组，与任何跨域窗口断开连接 |
| `same-origin-allow-popups` | 允许与跨域弹出窗口通信 |
| `unsafe-none` | 默认值，允许跨域访问 |

**隔离效果**：
- 使用 `same-origin` 的文档会进入独立的 Browsing Context Group
- 不同 BC Group 之间的窗口无法通过 `window.opener` 相互引用
- 无法共享 `sessionStorage`（即使同 origin）

**sessionStorage 隔离应用**：

```
# 第三方应用 A（登录态甲）
Cross-Origin-Opener-Policy: same-origin

# 第三方应用 B（登录态乙）
Cross-Origin-Opener-Policy: same-origin
```

两个窗口即使 `top-level origin` 相同，也会因为 COOP 进入不同 BC Group，sessionStorage 完全隔离。

### 2.2 COEP（Cross-Origin-Embedder-Policy）

```
Cross-Origin-Embedder-Policy: require-corp | credentialless
```

| 值 | 效果 |
|----|------|
| `require-corp` | 禁止加载未明确允许跨域访问的资源（通过 CORP 头） |
| `credentialless` | 以无凭证模式加载跨域子资源（匿名 iframe） |

**credentialless iframe**：
- `<iframe credentialless csp="...">` 让 iframe 以匿名模式加载
- 不携带 cookies/credentials
- 可以通过 `SharedWorker` / `BroadcastChannel` 与同 BC Group 内其他文档通信
- 适合隐私敏感场景

### 2.3 Cross-Origin-Resource-Sharing (CORP)

配合 COEP 使用，控制谁能加载资源：

```
Cross-Origin-Resource-Policy: same-origin | same-site | cross-origin
```

| 值 | 效果 |
|----|------|
| `same-origin` | 仅同源可加载 |
| `same-site` | 仅同站可加载 |
| `cross-origin` | 允许任何人加载 |

### 2.4 Storage Access API

允许被嵌入的第三方 iframe 在用户交互后访问其自身 origin 的 cookies：

```js
// 在 iframe 内调用
const granted = await document.requestStorageAccess();
if (granted) {
  // 可以访问 cookies / sessionStorage / localStorage
}
```

**限制**：
- 仅在顶级页面与子 iframe origin 不同时有效
- 需要用户交互触发
- 浏览器可能拒绝（如用户未曾在顶级页面与该 iframe origin 交互过）

### 2.5 弹出窗口方案（Window Opener）

不使用 iframe，改用 `window.open()` 创建独立窗口：

```js
// 窗口 A（登录态甲）
const winA = window.open('https://third-party.com/app', 'winA', 'width=800,height=600');

// 窗口 B（登录态乙）
const winB = window.open('https://third-party.com/app', 'winB', 'width=800,height=600');
```

每个 `window.open()` 创建独立窗口，拥有独立：
- Session（但 sessionStorage 仍按 origin 隔离）
- Cookies 池（首次创建时为空）
- Document origins

**缺陷**：sessionStorage 仍按 origin 共享，窗口间无法共享 sessionStorage。

---

## 三、实现多登录态隔离的方案

### 方案对比

| 方案 | 隔离强度 | 用户体验 | 复杂度 | sessionStorage 隔离 |
|------|---------|---------|--------|-------------------|
| 多个 window.open | ⭐⭐ | ⭐⭐⭐⭐ | 低 | ❌ 同 origin 共享 |
| sandbox iframe | ⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | ❌ 依赖父页面 |
| COOP same-origin | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | ✅ 真正隔离 |
| COOP + 匿名 iframe | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中高 | ✅ 隔离 + 隐私 |
| 动态 origin 方案 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 高 | ✅ 完全隔离 |

### 推荐方案：COOP + 多实例

**核心思路**：为每个"登录态"创建独立的浏览上下文组（BC Group）。

步骤：

1. **第三方应用配置 COOP**

```nginx
# 第三方应用 server
location / {
    add_header Cross-Origin-Opener-Policy "same-origin";
}
```

2. **宿主页面管理多个 iframe 实例**

```html
<script>
const sessions = {};

function createSession(sessionId) {
  const iframe = document.createElement('iframe');
  iframe.sandbox = 'allow-scripts allow-forms allow-popups';
  // 注意：不加 allow-same-origin，iframe 成为 unique origin
  // 但 COOP 会让顶级页面和 iframe 进入独立 BC Group
  iframe.src = `https://third-party.com/app?session=${sessionId}`;
  
  iframe.id = `session-${sessionId}`;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  sessions[sessionId] = iframe;
}

function switchSession(sessionId) {
  // 隐藏当前 iframe，显示目标 iframe
  Object.values(sessions).forEach(iframe => {
    iframe.style.display = 'none';
  });
  sessions[sessionId].style.display = 'block';
}
</script>
```

3. **sessionStorage 隔离原理**

- COOP: `same-origin` 强制创建独立 BC Group
- 即使顶级页面和 iframe origin 相同，也属于不同 BC Group
- sessionStorage 按 BC Group + origin 隔离

### 替代方案：动态子域名

为每个登录态分配独立子域名，实现完全 origin 隔离：

```
session-a.third-party.com  → 登录态甲
session-b.third-party.com  → 登录态乙
session-c.third-party.com  → 登录态丙
```

```html
<script>
const sessionDomains = {
  'user-a': 'https://session-a.third-party.com',
  'user-b': 'https://session-b.third-party.com',
};

function loadSession(sessionId) {
  const iframe = document.createElement('iframe');
  iframe.src = sessionDomains[sessionId];
  iframe.id = 'app-frame';
  document.body.appendChild(iframe);
}
</script>
```

**优点**：完全同 origin 隔离，符合标准浏览器行为
**缺点**：需要服务端配置多子域名

---

## 四、跨实例通信

即使 sessionStorage 隔离，不同上下文间仍需要通信：

### 4.1 BroadcastChannel

```js
// iframe 内
const channel = new BroadcastChannel('session-sync');
channel.postMessage({ type: 'login', user: 'Alice' });

// 宿主页面
const channel = new BroadcastChannel('session-sync');
channel.onmessage = (e) => {
  console.log('收到:', e.data);
};
```

**限制**：需要同 BC Group（COOP 会影响）

### 4.2 postMessage

```js
// 宿主页面 → iframe
const iframe = document.querySelector('#session-iframe');
iframe.contentWindow.postMessage('hello', 'https://third-party.com');

// iframe → 宿主页面
window.parent.postMessage('reply', 'https://parent-origin.com');
```

### 4.3 MessageChannel

```js
// 创建端到端通道
const channel = new MessageChannel();
iframe.contentWindow.postMessage('init', '*', [channel.port2]);

channel.port1.onmessage = (e) => {
  console.log('收到:', e.data);
};
```

---

## 五、实战：Credentialless Iframe 隔离演示

Credentialless iframe 允许加载第三方内容但不携带 cookies，适合多租户隔离场景：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Credentialless Iframe 隔离演示</title>
</head>
<body>
  <h1>Credentialless Iframe 示例</h1>
  
  <h2>1. 普通 iframe（携带 cookies）</h2>
  <iframe 
    src="https://example.com"
    width="400" height="200"
    id="normal-iframe"
  ></iframe>

  <h2>2. Credentialless iframe（无 cookies）</h2>
  <iframe 
    credentialless
    csp="default-src 'none'; script-src 'unsafe-inline'"
    src="https://example.com"
    width="400" height="200"
    id="credentialless-iframe"
  ></iframe>

  <h2>3. Sandbox iframe（完全隔离）</h2>
  <iframe 
    sandbox="allow-scripts allow-forms"
    src="https://example.com"
    width="400" height="200"
    id="sandbox-iframe"
  ></iframe>

  <div id="log"></div>
  
  <script>
    function log(msg) {
      document.getElementById('log').innerHTML += `<p>${msg}</p>`;
    }
    
    // 检测存储访问
    try {
      const storage = sessionStorage;
      log('✅ sessionStorage 可访问（同 origin）');
    } catch (e) {
      log('❌ sessionStorage 不可访问（跨域隔离）');
    }
  </script>
</body>
</html>
```

---

## 六、浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| sandbox attribute | ✅ | ✅ | ✅ | ✅ |
| COOP | ✅ 83+ | ✅ 79+ | ✅ 15.4+ | ✅ 79+ |
| COEP | ✅ 83+ | ✅ 79+ | ✅ 15.4+ | ✅ 79+ |
| credentialless | ✅ 100+ | ❌ | ✅ 17+ | ✅ 100+ |
| Storage Access API | ❌ | ✅ | ✅ | ❌ |

---

## 七、结论与建议

### 场景选择

| 场景 | 推荐方案 |
|------|----------|
| 简单隔离（不同用户） | 多个 window.open 或多子域名 |
| 强隔离（多租户） | COOP same-origin + 独立 iframe 实例 |
| 隐私优先（无追踪） | credentialless iframe |
| 第三方内容沙箱 | sandbox attribute |

### Electron 类比

Electron 的 `sessionStorage` 隔离效果 ≈ **COOP same-origin + 独立 window 实例**

在纯 Web 环境中，实现完全等同于 Electron 的 sessionStorage 隔离，需要：
1. 第三方应用配置 `Cross-Origin-Opener-Policy: same-origin`
2. 宿主页面为每个会话创建独立的 window 或 COOP 隔离 iframe
3. 通过 postMessage / BroadcastChannel 进行必要的跨上下文通信

---

## 参考资料

- [COOP 规范](https://html.spec.whatwg.org/multipage/origin.html#cross-origin-opener-policy)
- [COEP 规范](https://html.spec.whatwg.org/multipage/origin.html#cross-origin-embedder-policy)
- [Storage Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/State_Partitioning)
- [credentialless iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#credentialless)
- [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API)
