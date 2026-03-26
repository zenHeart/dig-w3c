# dl, dt, dd — HTML 定义列表

## 概述

`<dl>` (Definition List) 是 HTML 中用于展示**键值对**或**术语定义**的语义化标签组合。

| 标签 | 全称 | 作用 |
|------|------|------|
| `<dl>` | Definition List | 定义列表容器 |
| `<dt>` | Definition Term | 定义术语（键） |
| `<dd>` | Definition Description | 定义描述（值） |

## 基本语法

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言，用于构建网页结构</dd>

  <dt>CSS</dt>
  <dd>层叠样式表，用于控制网页外观和布局</dd>

  <dt>JavaScript</dt>
  <dd>一种脚本语言，为网页添加交互行为</dd>
</dl>
```

渲染效果：

<dl style="margin:1rem 0;border:1px solid #e5e7eb;padding:1rem;border-radius:8px">
  <dt style="font-weight:bold;margin-bottom:0.25rem">HTML</dt>
  <dd style="margin-left:0;color:#6b7280;margin-bottom:1rem">超文本标记语言，用于构建网页结构</dd>
  <dt style="font-weight:bold;margin-bottom:0.25rem">CSS</dt>
  <dd style="margin-left:0;color:#6b7280;margin-bottom:1rem">层叠样式表，用于控制网页外观和布局</dd>
  <dt style="font-weight:bold;margin-bottom:0.25rem">JavaScript</dt>
  <dd style="margin-left:0;color:#6b7280">一种脚本语言，为网页添加交互行为</dd>
</dl>

## 一对多关系

一个 `<dt>` 可以对应多个 `<dd>`：

```html
<dl>
  <dt>前端框架</dt>
  <dd>React — Facebook 开发的声明式 UI 库</dd>
  <dd>Vue — 渐进式 JavaScript 框架</dd>
  <dd>Angular — Google 开发的完整应用框架</dd>
</dl>
```

## 多对一关系

多个 `<dt>` 也可以对应一个 `<dd>`（较少见）：

```html
<dl>
  <dt>Firefox</dt>
  <dt>Mozilla Firefox</dt>
  <dt>Mozilla</dt>
  <dd>Mozilla 基金会开发的免费开源网页浏览器</dd>
</dl>
```

## dl vs ul/ol — 选型决策

| 列表类型 | 适用场景 | 语义含义 |
|----------|----------|----------|
| `<ul>` | 无序条目列表 | 一组相关但无顺序的项 |
| `<ol>` | 有序条目列表 | 有编号或顺序要求的项 |
| `<dl>` | 键值对 / 术语定义 | 概念与解释的对应关系 |

**决策原则**：如果列表项之间是"名词—解释"的关系，用 `<dl>`；如果是"条目—条目"的关系，用 `<ul>` 或 `<ol>`。

## CSS 布局技巧

### 水平布局（Grid）

```css
dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
}

dt {
  grid-column: 1;
  font-weight: bold;
}

dd {
  grid-column: 2;
  margin: 0;
}
```

### 垂直布局（Flex）

```css
dl {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

dt {
  font-weight: bold;
}

dd {
  margin-left: 1.5rem;
  color: #6b7280;
}
```

### 使用 column-count 多列布局

```css
dl {
  column-count: 2;
  column-gap: 2rem;
}
```

## 常见使用场景

### 1. 元数据展示

```html
<dl class="meta">
  <dt>作者</dt>
  <dd>张三</dd>
  <dt>发布日期</dt>
  <dd>2024-01-15</dd>
  <dt>版本</dt>
  <dd>2.1.0</dd>
</dl>
```

### 2. 术语表（Glossary）

```html
<dl class="glossary">
  <dt>API</dt>
  <dd>Application Programming Interface，应用程序编程接口</dd>

  <dt>URL</dt>
  <dd>Uniform Resource Locator，统一资源定位符</dd>

  <dt>HTTP</dt>
  <dd>HyperText Transfer Protocol，超文本传输协议</dd>
</dl>
```

### 3. 问答对（FAQ）

```html
<dl class="faq">
  <dt>什么是 HTML？</dt>
  <dd>HTML 是超文本标记语言，用于定义网页的结构和内容。</dd>

  <dt>HTML 和 HTML5 有什么区别？</dt>
  <dd>HTML5 是 HTML 的最新版本，引入了新的语义元素（如 article、section）、原生多媒体支持（audio、video）和 Canvas 绘图能力。</dd>
</dl>
```

### 4. 产品特性列表

```html
<dl class="product-features">
  <dt>实时协作</dt>
  <dd>多人同时编辑，实时同步更改</dd>

  <dt>版本控制</dt>
  <dd>完整的历史记录，一键回滚</dd>

  <dt>权限管理</dt>
  <dd>细粒度的访问控制，保护数据安全</dd>
</dl>
```

## 语义化注意事项

1. **不要用 div 替代**：`<div>` 无语义，而 `<dl>` 明确表示"这是一组术语定义"
2. **不要用 table 替代**：表格用于展示行列数据，定义列表用于键值对
3. **不要用 ul/ol 替代**：有序/无序列表用于条目列表，不是键值对
4. **可嵌套其他元素**：`<dd>` 内可以包含 `<ul>`、`<ol>` 甚至另一个 `<dl>`

```html
<!-- 正确：用 dl 表示键值对 -->
<dl>
  <dt>颜色</dt>
  <dd>蓝色</dd>
</dl>

<!-- 错误：用 table 表示键值对（语义不当） -->
<table>
  <tr><td>颜色</td><td>蓝色</td></tr>
</table>

<!-- 错误：用 ul 表示键值对（语义不当） -->
<ul>
  <li>颜色: 蓝色</li>
</ul>
```

## 无障碍（Accessibility）

- 屏幕阅读器将 `<dl>` 识别为"描述列表"
- `<dt>` 和 `<dd>` 有明确的关联关系
- 在视觉上可以用 CSS 增强可读性，但不改变语义

## 浏览器兼容

所有主流浏览器均支持 `<dl>`、`<dt>`、`<dd>`，无兼容性问题。

## 参考资料

- [MDN: dl 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dl)
- [MDN: dt 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dt)
- [MDN: dd 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dd)
- [HTML 规范 — Description Lists](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element)
