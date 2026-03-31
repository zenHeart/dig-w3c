---
title: Chrome 自动下载安全策略
tags: Chrome Download Security CSP Safe-Browsing
birth: 2026-03-31
modified: 2026-03-31
---

# Chrome 自动下载安全策略

**概述：** 整理浏览器自动下载的触发机制、Chrome DownloadRestrictions 策略、Safe Browsing 恶意判断、批量下载限制（10 文件）、CSP 与下载的关系，以及 JavaScript 检测与控制方法。

---

## 1. 自动下载的触发机制

### 1.1 哪些 API 会触发自动下载

| 触发方式 | 示例 | 说明 |
|---------|------|------|
| `<a download>` | `<a href="file.pdf" download>` | 下载属性直接触发 |
| 编程式下载 | `location.href = url` | 简单文件下载 |
| Blob URL | `URL.createObjectURL(blob)` + 点击 | 程序生成文件下载 |
| `<iframe>` | 自动填充表单下载 | 少见 |
| 服务端响应 | `Content-Disposition: attachment` | HTTP 头控制 |

### 1.2 下载 vs 保存

- **下载 (Download)**：浏览器弹出下载对话框或自动保存到默认目录
- **保存 (Save)**：浏览器显示"保存页面"对话框
- 区别在于 `Content-Disposition` 和 MIME 类型

---

## 2. Chrome DownloadRestrictions Policy

Chrome 通过 `DownloadRestrictions` 组策略控制下载行为。

### 2.1 策略值

| 值 | 名称 | 限制行为 |
|----|------|---------|
| 0 | NoRestrictions | 无限制，允许所有下载 |
| 1 | NormalWarning | 禁止危险文件（恶意、钓鱼等） |
| 2 | ExpertWarning | 禁止危险 + 不常见文件 |
| 3 | BlockAllDownloads | 禁止所有下载 |

### 2.2 受限文件类型

即使设置为 0，以下类型也会被阻止：
- 可执行文件（.exe, .msi, .bat, .cmd, .ps1, .vbs, .js, .jar, .sh 等）
- 压缩包（.zip, .tar.gz）在某些配置下受限
- 来自不安全（HTTP）页面的下载

---

## 3. Chrome Safe Browsing 判断机制

### 3.1 Safe Browsing 检查流程

```
用户触发下载
    ↓
Chrome 检查 URL/Download URL
    ↓
Safe Browsing API 查询
    ├── 安全 → 允许下载
    ├── 不安全 → 阻止 + 警告页面
    └── 未知 → 可选：允许但提示
```

### 3.2 检查级别

1. **Hash-based**：文件 SHA-256 与已知恶意文件数据库比对
2. **URL-based**：URL 域名/路径黑名单匹配
3. **AI-based (2023+)**：使用机器学习模型判断文件安全性

### 3.3 被判定为恶意的典型场景

- 可执行文件（.exe, .dll）
- 脚本文件（.js, .ps1, .bat）
- 打包文件（.zip 包含可执行文件）
- 来自已知钓鱼网站的文件

---

## 4. 为什么浏览器会自动下载

### 4.1 合法场景

- 点击网页中的下载链接
- 浏览器设置的"下载前询问每个文件"关闭
- 企业策略强制自动下载到指定目录
- 浏览器扩展程序触发的下载

### 4.2 不良网站行为

- 诱导点击（Fake download buttons）
- `<iframe>` 嵌套触发下载
- `data:` URI 自动下载
- `blob:` URL 点击触发

---

## 5. 如何禁用/控制网站的自动下载

### 5.1 用户侧设置

```
Chrome → 设置 → 下载内容
  → 下载前询问每个文件：开/关
  → 下载位置：选择默认目录
```

### 5.2 企业策略（Chrome Policy）

```
DownloadRestrictions = 1 | 2 | 3
DefaultDownloadDirectory = 指定路径
```

### 5.3 网站侧控制

通过 `<meta>` 或 HTTP 头：
```html
<meta http-equiv="Content-Disposition" content="inline">
```
或
```http
Content-Disposition: inline
```

---

## 6. CSP 与文件下载的关系

### 6.1 CSP 对下载的影响

CSP (Content Security Policy) **不能直接阻止下载**，但可以间接影响：

```http
Content-Security-Policy: script-src 'self'
```
- 限制 `<script>` 执行，但不阻止 `<a download>` 触发下载

### 6.2 如何用 CSP 减少恶意下载

1. 限制 `object-src` 和 `frame-src` 防止嵌入恶意内容
2. 使用 `form-action` 限制表单提交目标
3. 结合 `download` 属性的限制（CSP 无法直接控制 `download` 属性）

### 6.3 实际限制

```http
Content-Security-Policy: object-src 'none'; frame-src 'self'
```
- 防止通过 `<object>`/`<embed>` 触发的下载攻击
- 无法阻止 `<a download>` 触发的合法下载

---

## 7. 批量自动下载 10 文件限制

### 7.1 限制来源

Chrome 对来自同一标签页的**连续自动下载**有限制：
- **硬限制**：10 个文件（通过 `chrome.downloads` API 统计）
- 超出后浏览器弹出"下载已暂停，需要确认"提示

### 7.2 突破方式（恶意软件常用）

恶意软件会通过以下方式绕过：
1. **改变文件名**：每次下载使用不同文件名
2. **改变路径**：每次下载到不同子目录
3. **触发时机**：不同标签页/窗口错开触发
4. **用户操作伪装**：模拟用户点击

### 7.3 Chrome 的检测逻辑

```js
// Chrome 内部判断伪代码（简化）
if (downloadCountFromSameTab > 10 && !userGesture) {
  pauseDownload()
  showDownloadBarWarning()
}
```

---

## 8. JavaScript 检测/控制下载行为

### 8.1 使用 chrome.downloads API（扩展）

```js
// manifest.json
"permissions": ["downloads"]

// background.js
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  // 重定向下载路径或取消
  if (item.url.includes('malware')) {
    suggest({ filename: 'BLOCKED_' + item.filename })
  }
})
```

### 8.2 监听下载事件

```js
chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log('下载开始:', downloadItem.url)
  // 可取消：chrome.downloads.pause(downloadItem.id)
})

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    console.log('下载完成')
  }
})
```

### 8.3 前端网页中检测下载（无法阻止但可统计）

```js
// 使用 MutationObserver 监听新增的 <a download> 元素
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === 'A' && node.hasAttribute('download')) {
        console.log('检测到下载链接:', node.href)
      }
    })
  })
})

observer.observe(document.body, { childList: true, subtree: true })
```

### 8.4 阻止特定文件的客户端检测

```js
// 拦截 fetch/ajax 返回的 blob
const originalFetch = window.fetch
window.fetch = async (...args) => {
  const response = await originalFetch(...args)
  const contentType = response.headers.get('content-type')

  if (contentType === 'application/octet-stream') {
    // 检测到二进制文件下载
    console.warn('检测到二进制下载:', args[0])
  }
  return response
}
```

---

## 9. 相关资料

- [Chrome Download Restrictions Policy](https://chromeenterprise.google/policies/?policy=DownloadRestrictions)
- [Safe Browsing API](https://developers.google.com/safe-browsing)
- [MDN: Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
- [MDN: HTML <a> download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
- [Chrome downloads API](https://developer.chrome.com/docs/extensions/reference/downloads/)
- [CSP object-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src)
