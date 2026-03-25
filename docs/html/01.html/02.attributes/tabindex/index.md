# tabindex

> tabindex 是 HTML 全局属性，用于控制元素在 Tab 键导航中的顺序

[tabindex - HTML: 超文本标记语言 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/tabindex)

## 取值范围

| 取值 | 行为 | 使用场景 |
|------|------|----------|
| `tabindex="0"` | 元素可被聚焦，且参与自然 Tab 顺序 | 将非交互元素变为可聚焦 |
| `tabindex="-1"` | 元素可被聚焦（通过 JS focus()），但不参与 Tab 键顺序 | ARIA 键盘支持 |
| `tabindex="1,2,3..."` | 显式 Tab 顺序（正整数值越小，优先级越高） | **不推荐** |

## 核心规则

### 1. Tab 键遍历顺序

```
1. 先遍历所有 tabindex="1" 的元素（按数值从小到大）
2. 再遍历所有 tabindex="2,3,..." 的元素（按数值从小到大）
3. 最后遍历所有 tabindex="0" 和无 tabindex 的可聚焦元素
```

### 2. 负值 tabindex

```html
<!-- 无法通过 Tab 键聚焦，但可通过 JS focus() 聚焦 -->
<div tabindex="-1">可通过 element.focus() 聚焦</div>

<!-- 普通元素无法聚焦 -->
<div>无法聚焦</div>
```

### 3. ARIA 无障碍应用

```html
<!-- 使用 tabindex="-1" + role 实现自定义键盘可访问组件 -->
<div role="button" tabindex="-1" onKeyDown="handleKeyDown()">
  自定义按钮（可通过 JS 聚焦，支持键盘事件）
</div>
```

## 常见场景

### 1. 将 div 变为可聚焦

```html
<div tabindex="0" style="border:1px solid; padding:10px;">
  我现在可以聚焦了！
</div>
```

### 2. 跳过链接（隐藏跳转）

```html
<a href="#main" tabindex="-1">跳过导航</a>
<nav>导航内容...</nav>
<main id="main">主要内容</main>
```

### 3. 自定义组件键盘支持

```html
<div class="custom-dropdown" tabindex="0" role="listbox">
  <div role="option" tabindex="-1">选项 1</div>
  <div role="option" tabindex="-1">选项 2</div>
</div>
```

## 最佳实践

| 场景 | 推荐 tabindex |
|------|--------------|
| 可交互的原生元素（button、input） | 不需要 tabindex |
| 非原生元素需要键盘访问 | `tabindex="0"` |
| 需要 JS 聚焦但不需要 Tab 顺序 | `tabindex="-1"` |
| **绝对不要使用正整数** | ❌ |

## 与其他属性的关系

- `accesskey`：设置键盘快捷键（已被废弃，不推荐）
- `role`：定义 ARIA 角色，与 tabindex 配合实现无障碍
- ` contenteditable`：使元素可编辑，默认可聚焦

## 浏览器行为

| 浏览器 | 行为 |
|--------|------|
| Chrome | 完整支持 |
| Firefox | 完整支持 |
| Safari | 完整支持 |
| Edge | 完整支持 |

## 常见错误

### ❌ 错误：使用正整数 tabindex

```html
<!-- 不推荐：维护困难，顺序不直观 -->
<div tabindex="3">第三个</div>
<div tabindex="1">第一个</div>
<div tabindex="2">第二个</div>
```

### ✅ 正确：使用 DOM 顺序或 tabindex="0"

```html
<!-- 推荐：依靠 DOM 顺序 -->
<div>第一个</div>
<div>第二个</div>
<div>第三个</div>

<!-- 或使用 tabindex="0" 让元素参与自然顺序 -->
<div tabindex="0">可聚焦</div>
```
