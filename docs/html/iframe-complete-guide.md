# iframe 完整指南

> 本文档详细介绍 HTML iframe 元素的所有属性、浏览器兼容性、安全考虑及最佳实践。

## 目录

- [基础属性](#基础属性)
- [内容加载属性](#内容加载属性)
- [安全属性](#安全属性)
- [样式属性](#样式属性)
- [其他属性](#其他属性)
- [sandbox 属性详解](#sandbox-属性详解)
- [常见使用场景](#常见使用场景)

---

## 基础属性

### src

指定 iframe 要加载的 URL。

| 属性 | 值 |
|------|-----|
| 默认值 | 无（空） |
| 兼容性 | 所有浏览器 |

```html
<iframe src="https://example.com"></iframe>
```

**使用场景**：
- 嵌入外部网页
- 加载同源或跨源内容

**注意事项**：
- 跨域限制：主页面无法访问 iframe 内部内容（Same-Origin Policy）
- HTTPS 页面中嵌入 HTTP 内容会导致"混合内容"警告

---

### srcdoc

直接在 iframe 中嵌入 HTML 内容，优先级高于 `src`。

| 属性 | 值 |
|------|-----|
| 默认值 | 无 |
| 兼容性 | IE 不支持，Chrome 20+, Firefox 25+, Safari 6+ |

```html
<iframe srcdoc="<p>Hello World!</p>"></iframe>
```

**使用场景**：
- 嵌入静态 HTML 内容
- 在不支持 src 的情况下展示内容
- 结合 sandbox 实现安全隔离内容

**注意事项**：
- 如果同时指定 `src` 和 `srcdoc`，`srcdoc` 优先
- 内容中的脚本会执行（除非配合 sandbox）

---

### name

为 iframe 设置名称，用于以下场景：
- `<a target="iframe-name">` 链接在 iframe 中打开
- 表单的 `target` 属性
- JavaScript 中通过 `window.frames['name']` 访问

| 属性 | 值 |
|------|-----|
| 默认值 | 无 |
| 兼容性 | 所有浏览器 |

```html
<iframe name="myFrame" src="page.html"></iframe>
<a href="https://example.com" target="myFrame">在 iframe 中打开</a>
```

---

### width / height

设置 iframe 的宽度和高度。

| 属性 | 值 | 默认值 |
|------|-----|--------|
| width | 像素值或百分比 | 300 |
| height | 像素值或百分比 | 150 |

```html
<iframe src="page.html" width="600" height="400"></iframe>

<!-- CSS 方式 -->
<iframe src="page.html" style="width: 600px; height: 400px;"></iframe>
```

**最佳实践**：
- 使用 CSS 而非 HTML 属性，便于响应式设计
- 保持宽高比可使用 `aspect-ratio` 属性

---

## 内容加载属性

### loading

控制 iframe 的加载策略。

| 值 | 说明 |
|----|------|
| `eager` | 立即加载（默认） |
| `lazy` | 懒加载，当进入视口时加载 |

| 兼容性 | Chrome 77+, Firefox 121+, Safari 16+ |

```html
<!-- 懒加载 iframe -->
<iframe src="heavy-page.html" loading="lazy"></iframe>

<!-- 立即加载 -->
<iframe src="page.html" loading="eager"></iframe>
```

**使用场景**：
- `lazy`：长页面中的多个 iframe，减少初始加载负担
- `eager`：首屏关键内容或用户即将看到的内容

**注意事项**：
- 不影响 `srcdoc` 属性
- `loading="lazy"` 等同于原生图片的 `loading="lazy"`

---

## 安全属性

### sandbox

对 iframe 内容施加安全限制，防止潜在恶意操作。

| 值 | 作用 |
|----|------|
| 无值（仅 `sandbox`） | 最严格，禁止所有权限 |
| `allow-forms` | 允许表单提交 |
| `allow-scripts` | 允许执行脚本 |
| `allow-same-origin` | 允许内容被视为同源 |
| `allow-top-navigation` | 允许导航顶层窗口 |
| `allow-popups` | 允许弹出窗口（如 window.open） |
| `allow-pointer-lock` | 允许指针锁定 API |
| `allow-orientation-lock` | 允许屏幕方向锁定 |
| `allow-modals` | 允许显示模态对话框 |
| `allow-presentation` | 允许演示模式 API |

| 兼容性 | Chrome 4+, Firefox 17+, Safari 5+, IE 10+ |

```html
<!-- 最严格隔离 -->
<iframe sandbox src="untrusted-content.html"></iframe>

<!-- 允许表单和脚本 -->
<iframe sandbox="allow-forms allow-scripts" src="form-page.html"></iframe>

<!-- 允许同源脚本执行 -->
<iframe sandbox="allow-same-origin allow-scripts" src="same-origin-content.html"></iframe>
```

**安全影响**：

| sandbox 值 | 安全风险 |
|------------|----------|
| 无 sandbox | 内容完全信任，可执行脚本、导航父页面 |
| 仅 sandbox | 禁止脚本、表单、弹窗、顶层导航 |
| allow-scripts | 可执行脚本，但无法访问父页面 DOM（同源限制） |
| allow-same-origin | 允许与父页面通信，慎用 |
| allow-top-navigation | 可能被用于钓鱼攻击 |

**与 CSP 的关系**：
- sandbox 是一种嵌入策略，限制 iframe 内部行为
- CSP（Content Security Policy）是父页面声明的防护策略
- 两者可同时使用，限制叠加生效

```html
<!-- CSP 头示例 -->
<!-- Content-Security-Policy: frame-ancestors 'none' -->

<!-- sandbox 与 CSP 配合 -->
<iframe sandbox="allow-scripts" src="widget.html"></iframe>
```

---

### allow

指定 iframe 可以使用的浏览器特性权限。

| 值 | 权限说明 |
|----|----------|
| `fullscreen` | 全屏 API |
| `payment` | 支付 API（如 Payment Request） |
| `camera` | 摄像头 |
| `microphone` | 麦克风 |
| `midi` | MIDI 设备 |
| `geolocation` | 地理位置 |
| `encrypted-media` | 加密媒体扩展（EME） |
| `autoplay` | 自动播放媒体 |
| `vr` | 虚拟现实 |

| 兼容性 | Chrome 53+, Firefox 74+, Safari 15.4+ |

```html
<iframe
  src="video-player.html"
  allow="fullscreen; accelerometer; gyroscope; autoplay"
></iframe>

<!-- 仅允许全屏 -->
<iframe src="game.html" allow="fullscreen"></iframe>
```

**注意事项**：
- 用户仍需授权（如摄像头、麦克风等）
- `allow` 是_permission_指令，与实际 API 调用分离

---

### allowfullscreen

允许 iframe 内容进入全屏模式。

| 属性 | 值 |
|------|-----|
| 兼容性 | Chrome 56+, Firefox 50+, Safari 16.4+（旧版使用 `webkitallowfullscreen`） |

```html
<iframe src="video.html" allowfullscreen></iframe>

<!-- 旧版兼容 -->
<iframe src="video.html" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
```

**推荐写法**（新版）：
```html
<iframe src="video.html" allow="fullscreen"></iframe>
```

---

## 样式属性

### frameborder

设置 iframe 边框。（已废弃，推荐使用 CSS）

| 值 | 说明 |
|----|------|
| 1 | 显示边框（默认） |
| 0 | 隐藏边框 |

| 兼容性 | 所有浏览器（但已废弃） |

```html
<!-- HTML 方式（已废弃） -->
<iframe src="page.html" frameborder="0"></iframe>

<!-- CSS 方式（推荐） -->
<iframe src="page.html" style="border: none;"></iframe>
```

---

### marginheight / marginwidth

设置 iframe 内部内容与边框的间距。（已废弃）

| 属性 | 值 | 默认值 |
|------|-----|--------|
| marginheight | 像素 | 0 |
| marginwidth | 像素 | 0 |

| 兼容性 | 所有浏览器（但已废弃） |

```html
<!-- HTML 方式（已废弃） -->
<iframe src="page.html" marginheight="10" marginwidth="10"></iframe>

<!-- CSS 方式（推荐） -->
<iframe src="page.html" style="margin: 10px;"></iframe>
```

---

### scrolling

控制 iframe 滚动条显示。（已废弃）

| 值 | 说明 |
|----|------|
| `yes` | 始终显示滚动条 |
| `no` | 始终隐藏滚动条 |
| `auto` | 根据内容自动决定（默认） |

| 兼容性 | 所有浏览器（但已废弃） |

```html
<!-- HTML 方式（已废弃） -->
<iframe src="long-page.html" scrolling="no"></iframe>

<!-- CSS 方式（推荐） -->
<iframe src="long-page.html" style="overflow: hidden;"></iframe>
```

---

## 其他属性

### referrerpolicy

控制请求 iframe 资源时发送的 Referer 头。

| 值 | 说明 |
|----|------|
| `no-referrer` | 不发送 Referer |
| `no-referrer-when-downgrade` | 仅同源/HTTPS→HTTPS 时发送（默认） |
| `origin` | 仅发送协议+主机+端口 |
| `origin-when-cross-origin` | 同源发送完整 URL，跨域仅发送 origin |
| `same-origin` | 同源发送，跨域不发送 |
| `strict-origin-when-cross-origin` | 更安全的默认策略 |
| `unsafe-url` | 始终发送完整 URL（不安全） |

| 兼容性 | Chrome 56+, Firefox 50+, Safari 11.1+ |

```html
<!-- 保护隐私：不发送 Referer -->
<iframe src="https://example.com" referrerpolicy="no-referrer"></iframe>

<!-- 仅发送 origin -->
<iframe src="https://example.com" referrerpolicy="origin"></iframe>
```

**使用场景**：
- 嵌入第三方内容时保护隐私
- 防止敏感 URL 路径泄露到外部

---

### csp

指定 iframe 内容的安全策略（不同于父页面的 CSP）。

| 兼容性 | Chrome 61+, Firefox 69+, Safari 15.4+ |

```html
<!-- 限制 iframe 内部脚本和样式 -->
<iframe
  src="widget.html"
  csp="script-src 'self'; style-src 'self' 'unsafe-inline'"
></iframe>
```

**使用场景**：
- 父页面无需 CSP，但需要限制子页面
- 嵌入第三方 widgets 时施加额外限制

---

### loading

> 已在 [内容加载属性](#内容加载属性) 中详细说明。

---

## sandbox 属性详解

### 完整权限列表

```html
<!-- 最严格：禁止一切 -->
<iframe sandbox src="content.html"></iframe>

<!-- 基础权限 -->
<iframe sandbox="allow-forms" src="form.html"></iframe>
<iframe sandbox="allow-scripts" src="script.html"></iframe>

<!-- 组合权限 -->
<iframe
  sandbox="allow-forms allow-scripts allow-same-origin"
  src="trusted-widget.html"
></iframe>
```

### 权限矩阵

| 权限 | 表单提交 | 脚本执行 | 同源访问 | 弹窗 | 顶层导航 | 全屏 | 指针锁定 |
|------|---------|---------|---------|------|---------|------|---------|
| 无 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| allow-forms | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| allow-scripts | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| allow-same-origin | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| allow-popups | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| allow-top-navigation | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| allow-pointer-lock | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### 安全最佳实践

1. **始终使用 sandbox**：即使嵌入信任内容，也应添加最小权限集

2. **最小权限原则**：只启用必需的权限

```html
<!-- 好的做法：精确控制权限 -->
<iframe
  sandbox="allow-forms allow-scripts"
  src="calculator-widget.html"
></iframe>

<!-- 坏的做法：过于宽松 -->
<iframe
  sandbox="allow-same-origin allow-scripts allow-top-navigation"
  src="any-page.html"
></iframe>
```

3. **sandbox + CSP 双重防护**

```html
<!-- 父页面 CSP -->
<!-- Content-Security-Policy: frame-ancestors 'self' -->

<!-- iframe 自身 CSP -->
<iframe
  src="widget.html"
  csp="script-src 'self'; object-src 'none'"
  sandbox="allow-forms allow-scripts"
></iframe>
```

### 与 frame-ancestors 的区别

| 特性 | sandbox | frame-ancestors (CSP) |
|------|---------|----------------------|
| 作用对象 | iframe 内部 | 谁能嵌入当前页面 |
| 设置位置 | HTML 属性或 HTTP 头 | HTTP CSP 头 |
| 灵活性 | 可为不同 iframe 设置不同限制 | 整站统一策略 |
| IE 支持 | 10+ | 不支持 |

---

## 常见使用场景

### 1. 嵌入外部网页

```html
<!-- 基础嵌入 -->
<iframe src="https://example.com" width="100%" height="600"></iframe>

<!-- 带安全限制 -->
<iframe
  src="https://example.com"
  width="100%"
  height="600"
  referrerpolicy="no-referrer"
  sandbox="allow-scripts"
></iframe>
```

### 2. 内联内容（srcdoc）

```html
<!-- 直接嵌入 HTML -->
<iframe
  srcdoc="<h1>Hello!</h1><p>This is inline content.</p>"
  width="100%"
  height="200"
></iframe>

<!-- 带样式的内联内容 -->
<iframe
  srcdoc="
    <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .card { background: #f0f0f0; padding: 16px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class='card'>
          <h2>通知</h2>
          <p>您的订单已确认</p>
        </div>
      </body>
    </html>
  "
  width="100%"
  height="200"
></iframe>
```

### 3. 安全隔离（sandbox）

```html
<!-- 隔离的用户评论系统 -->
<iframe
  src="comments-embed.html"
  sandbox="allow-forms allow-scripts"
  width="100%"
  height="500"
></iframe>

<!-- 隔离的代码编辑器预览 -->
<iframe
  srcdoc="<p>Preview will appear here...</p>"
  sandbox="allow-scripts"
  id="preview-frame"
  width="100%"
  height="400"
></iframe>
```

### 4. 懒加载（loading）

```html
<!-- 页面底部 iframe 懒加载 -->
<iframe
  src="footer-widget.html"
  loading="lazy"
  width="100%"
  height="300"
></iframe>

<!-- 首屏 iframe 立即加载 -->
<iframe
  src="hero-content.html"
  loading="eager"
  width="100%"
  height="600"
></iframe>
```

### 5. 第三方 Widget 嵌入

```html
<!-- 社交媒体分享按钮 -->
<iframe
  src="https://platform.twitter.com/widgets.html"
  width="200"
  height="100"
  allow="accelerometer; autoplay; encrypted-media"
  sandbox="allow-scripts allow-popups"
></iframe>

<!-- 地图嵌入 -->
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  width="600"
  height="450"
  style="border:0;"
  allowfullscreen
  loading="lazy"
></iframe>

<!-- 支付按钮 -->
<iframe
  src="payment-button.html"
  width="200"
  height="100"
  allow="payment"
  sandbox="allow-forms allow-scripts"
></iframe>
```

---

## 浏览器兼容性问题汇总

| 属性 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| src | ✓ | ✓ | ✓ | ✓ | ✓ |
| srcdoc | 20+ | 25+ | 6+ | 79+ | ✗ |
| sandbox | 4+ | 17+ | 5+ | 79+ | 10+ |
| allow | 53+ | 74+ | 15.4+ | 79+ | ✗ |
| allowfullscreen | 56+ | 50+ | 16.4+ | 79+ | 11+ |
| loading | 77+ | 121+ | 16+ | 79+ | ✗ |
| referrerpolicy | 56+ | 50+ | 11.1+ | 79+ | ✗ |
| csp | 61+ | 69+ | 15.4+ | 79+ | ✗ |

**Polyfill 建议**：
- 对于不支持 `loading="lazy"` 的浏览器，可使用 Intersection Observer 实现懒加载
- 对于不支持 `allow` 属性的浏览器，回退到 `allowfullscreen` 等单独属性

---

## 最佳实践清单

- [ ] 使用 `sandbox` 属性隔离不受信任的内容
- [ ] 遵循最小权限原则，只启用必需的 sandbox 权限
- [ ] 嵌入 HTTPS 内容时使用 HTTPS
- [ ] 使用 `referrerpolicy` 保护用户隐私
- [ ] 长页面中的 iframe 使用 `loading="lazy"`
- [ ] 使用 CSS 替代已废弃的 `frameborder`、`marginheight`、`scrolling` 属性
- [ ] 第三方内容同时使用 sandbox 和 CSP
- [ ] 避免 `allow-same-origin` + `allow-scripts` 组合（安全风险）
- [ ] 为 iframe 添加明确的 `width` 和 `height`
