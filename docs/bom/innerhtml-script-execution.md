# 为什么 innerHTML 插入的 script 不执行

## 问题背景

通过 `element.innerHTML` 赋值包含 `<script>` 标签的 HTML 字符串时，插入的 script 标签内容不会作为 JavaScript 执行。这是浏览器 HTML 解析器的安全行为。

## 根本原因

### HTML 解析器的行为差异

使用 `innerHTML` 设置 HTML 内容时，浏览器会：

1. 解析 HTML 字符串，构建 DOM 节点；
2. **不执行** `<script>` 标签内的脚本；
3. 脚本只有在以“插入文档”的方式被识别时才会执行，而 `innerHTML` 设置后的状态是“已解析但不执行”。

### 与常规 DOM 插入的区别

| 操作方式 | script 是否执行 |
|---|---|
| `document.createElement('script')` + `appendChild()` | 执行 |
| `innerHTML` 赋值 | 不执行 |
| `insertAdjacentHTML()` | 不执行 |
| `document.write()` | 执行（但会阻塞渲染，已废弃） |

### 规范定义

根据 WHATWG HTML Living Standard：

> When the `innerHTML` attribute is set, the user agent must run the **innerHTML fragment parsing algorithm** on the given value, inserting the resulting nodes into the context node.

解析过程中，`<script>` 标签被插入时会被标记为 “already started”，从而阻止执行：

> The script element must be **marked as "already started"** when it is inserted into a document, which prevents it from executing.

## 正确的插入方式

### 方案一：createElement + appendChild（推荐）

```javascript
const script = document.createElement('script');
script.src = 'https://example.com/bundle.js';
script.type = 'module';
document.body.appendChild(script);

// 内联脚本
const inlineScript = document.createElement('script');
inlineScript.textContent = 'console.log("Hello");';
document.body.appendChild(inlineScript);
```

### 方案二：replaceWith + 克隆模板

```javascript
const template = document.createElement('template');
template.innerHTML = '<script>console.log("test")<\/script>';

const oldScript = document.querySelector('#target-script');
oldScript.replaceWith(template.content.cloneNode(true));
```

### 方案三：SVG 场景

对于 SVG 内的脚本，需要使用 `getSVGDocument()` 等与 HTML 不同的插入路径；具体行为取决于 SVG 的解析上下文。

## CSP 与 innerHTML 的关系

**Content Security Policy (CSP)** 会进一步限制脚本执行：

```html
<!-- CSP 禁止内联脚本 -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">

<!-- 即使使用 createElement，内联脚本也会被 CSP 阻止 -->
<script>
  const script = document.createElement('script');
  script.textContent = 'console.log("test")';
  document.body.appendChild(script);
</script>
```

### CSP 指令影响

| CSP 指令 | 影响 |
|---|---|
| `script-src 'unsafe-inline'` | 允许内联脚本（不推荐） |
| `script-src 'self'` | 只允许同源脚本 |
| `script-src nonce-xxx` | 只允许带正确 nonce 的脚本 |
| `script-src 'strict-dynamic'` | 允许受信任脚本加载的脚本 |

## 哪些情况下 innerHTML 插入的 script 可能执行

### 场景 1：跨域脚本通过 document.write

```javascript
// 不推荐：document.write 会阻塞渲染，且有安全风险
document.write('<script src="https://other.com/bundle.js"><\/script>');
```

### 场景 2：SVG/XML 解析

某些 SVG 解析路径下脚本行为不同，需要按具体解析上下文验证。

### 场景 3：已执行过的脚本重新插入

同一个脚本元素再次插入 DOM 不会重复执行。

## 安全考虑

### XSS 风险

使用 `innerHTML` 插入用户输入是 **XSS（跨站脚本攻击）** 的常见来源：

```javascript
// 危险：用户输入可能是恶意脚本
userInput = '<script>stealCookies()</script>';
element.innerHTML = userInput;

// 安全做法：使用 textContent 或先 sanitize
element.textContent = userInput;
```

### 推荐的安全做法

```javascript
// 1. 使用 textContent 插入纯文本
element.textContent = '<script>alert("xss")</script>'; // 不执行

// 2. 使用 DOMPurify 清理 HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// 3. 使用模板字面量 + 手动构建 DOM
const div = document.createElement('div');
const span = document.createElement('span');
span.textContent = userInput;
div.appendChild(span);
```

## 浏览器兼容性

| 浏览器 | 行为 |
|---|---|
| Chrome | innerHTML 脚本不执行 |
| Firefox | innerHTML 脚本不执行 |
| Safari | innerHTML 脚本不执行 |
| Edge | innerHTML 脚本不执行 |

所有现代浏览器行为一致。

## 总结

| 问题 | 答案 |
|---|---|
| 为什么 innerHTML 插入的 script 不执行？ | HTML 解析器将脚本标记为 “already started”，防止重复执行 |
| 规范名称是什么？ | HTML 规范中的 “already started” 检查 |
| 如何正确插入脚本？ | `document.createElement('script')` + `appendChild()` |
| CSP 会影响吗？ | 会，CSP 会进一步限制脚本执行来源 |
| innerHTML 有 XSS 风险吗？ | 有，插入用户输入时必须先清理 |

## 参考资料

- [WHATWG HTML Living Standard - The innerHTML attribute](https://html.spec.whatwg.org/multipage/parsing.html#innerhtml)
- [MDN - innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP - XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
