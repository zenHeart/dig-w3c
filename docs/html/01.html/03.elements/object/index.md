# `<object>` 元素详解

## 概述

`<object>` 是 HTML 中用于嵌入外部资源的元素，可作为图片、嵌套浏览上下文或由插件处理的资源。它是 W3C 标准元素，比 `<embed>` 更早出现，支持更丰富的参数配置。

- **核心用途**：嵌入外部资源（PDF、Flash、嵌套页面等）
- **W3C 标准**：HTML 2.0 引入，是最早的资源嵌入元素之一
- **与 `<embed>` 的区别**：支持 `<param>` 子元素传参给插件，支持备用内容

## 基本语法

```html
<object data="resource-url" type="mime-type" width="500" height="400">
  <param name="quality" value="high" />
  备用文本（当插件不可用时显示）
</object>
```

## 核心属性

### data
指定要嵌入资源的 URL。

| 属性值 | 说明 |
|--------|------|
| URL | 外部资源的地址（必需，除非使用 `<param>` 指定） |

```html
<object data="movie.pdf" type="application/pdf"></object>
```

### type
指定资源的 MIME 类型。浏览器会根据此属性判断是否支持该类型。

| 属性值 | 说明 |
|--------|------|
| `application/pdf` | PDF 文档 |
| `image/svg+xml` | SVG 图像 |
| `application/x-shockwave-flash` | Flash（已淘汰） |
| `text/html` | HTML 内容 |

```html
<object data="chart.svg" type="image/svg+xml" width="500" height="300"></object>
```

### name
为对象定义名称，用于与其他脚本或对象通信。

```html
<object data="video.mp4" type="video/mp4" name="myVideo"></object>
```

### width / height
设置对象的显示尺寸（像素）。

```html
<object data="document.pdf" type="application/pdf" width="600" height="800"></object>
```

### form
将对象关联到表单元素（通过表单 ID）。

```html
<form id="myForm">
  <input type="text" name="title" />
</form>

<object data="preview.pdf" form="myForm" width="500" height="600"></object>
```

### type Must Match
`typemustmatch` 属性：强制浏览器仅在 MIME 类型匹配时显示内容。

```html
<object data="secure-document.pdf" type="application/pdf" typemustmatch>
  您的浏览器不支持此 PDF
</object>
```

## `<param>` 子元素

`<param>` 用于向插件或对象传递参数，仅在 `<object>` 内部使用。

```html
<object data="player.swf" type="application/x-shockwave-flash" width="400" height="300">
  <param name="movie" value="player.swf" />
  <param name="quality" value="high" />
  <param name="allowFullScreen" value="true" />
</object>
```

常用参数：
- `movie`：SWF 文件路径
- `quality`：播放质量（high / low）
- `allowFullScreen`：是否允许全屏

## 与 `<embed>` 和 `<iframe>` 的区别

| 特性 | `<object>` | `<embed>` | `<iframe>` |
|------|-----------|-----------|------------|
| W3C 标准 | ✅ HTML 2.0 | ✅ HTML5 | ✅ HTML4 |
| `<param>` 支持 | ✅ | ❌ | ❌ |
| 备用内容 | ✅ | ❌ | ✅ |
| 插件参数传递 | ✅ | ❌ | ❌ |
| 嵌套浏览上下文 | ✅ | ❌ | ✅ |
| 浏览器兼容性 | 广泛 | 现代浏览器 | 广泛 |
| 现代使用场景 | PDF、备用 | 简单嵌入 | 网页嵌入 |

### 选择建议

- **PDF 嵌入**：`<object>` 或 `<iframe>` + PDF.js
- **网页嵌套**：`<iframe>`
- **需要传参给插件**：`<object>`
- **简单资源嵌入**（SVG、图片）：`<embed>` 或 `<img>`

## 使用场景

### 1. PDF 嵌入

```html
<object data="document.pdf" type="application/pdf" width="600" height="800">
  <p>您的浏览器不支持 PDF 预览。
    <a href="document.pdf">下载 PDF</a>
  </p>
</object>
```

**现代替代方案**：
- Google Docs Viewer：`https://docs.google.com/viewer?url=document.pdf`
- PDF.js：基于 Canvas 的纯 JS PDF 渲染库

### 2. SVG 嵌入

```html
<object data="diagram.svg" type="image/svg+xml" width="500" height="400">
  您的浏览器不支持 SVG
</object>
```

### 3. 嵌套浏览上下文

```html
<object data="https://example.com" type="text/html" width="100%" height="600">
  <a href="https://example.com">打开链接</a>
</object>
```

### 4. Flash 内容（已不推荐）

```html
<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0"
        width="400" height="300">
  <param name="movie" value="animation.swf" />
  <param name="quality" value="high" />
  <embed src="animation.swf" quality="high"
         type="application/x-shockwave-flash"
         width="400" height="300">
  </embed>
</object>
```

> ⚠️ Flash 已于 2020 年底淘汰，不建议在任何新项目中使用。

## JavaScript 交互

### 检测浏览器支持

```javascript
const isObjectSupported = (mimeType) => {
  const obj = document.createElement('object');
  obj.type = mimeType;
  return obj.canPlayType && obj.canPlayType(mimeType) !== '';
};
```

### 动态创建

```javascript
function embedObject(url, mimeType, width, height, fallback) {
  const obj = document.createElement('object');
  obj.data = url;
  obj.type = mimeType;
  obj.width = width;
  obj.height = height;
  obj.textContent = fallback;
  return obj;
}

document.body.appendChild(
  embedObject('chart.svg', 'image/svg+xml', 500, 400, 'SVG not supported')
);
```

## 注意事项

1. **现代替代方案**：
   - PDF → Google Docs Viewer / PDF.js
   - Flash → 已淘汰，使用 Canvas/WebGL 替代
   - 嵌套页面 → `<iframe>`

2. **备用内容**：始终在 `<object>` 内提供备用文本，确保不支持时用户能看到提示

3. **CORS 限制**：嵌入跨域资源时需正确配置 CORS 头

4. **安全性**：避免嵌入来源不明的资源，警惕 XSS 攻击

5. **类型声明**：始终指定 `type` 属性，帮助浏览器提前判断是否支持

6. **参数传递**：需要向插件传参时必须使用 `<object>`，不能用 `<embed>`

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>object 元素示例</title>
  <style>
    object {
      border: 1px solid #ddd;
      display: block;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <h1>PDF 嵌入示例</h1>
  <object data="sample.pdf" type="application/pdf" width="600" height="800">
    <p>您的浏览器不支持 PDF 预览。
      <a href="sample.pdf">下载 PDF</a>
    </p>
  </object>

  <h1>SVG 嵌入示例</h1>
  <object data="diagram.svg" type="image/svg+xml" width="500" height="400">
    <p>您的浏览器不支持 SVG。</p>
  </object>
</body>
</html>
```

## 参考资料

- [MDN: object - HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)
- [MDN: param - HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param)
- [W3C HTML5 Specification - object](https://www.w3.org/TR/html52/obsolete.html#the-object-element)
