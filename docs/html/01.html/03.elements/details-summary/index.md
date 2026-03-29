# `<details>` 和 `<summary>` 元素详解

## 概述

`<details>` 和 `<summary>` 是 HTML5 引入的原生折叠组件，用于创建可展开/收起的交互式内容区域。

- `<details>`: 折叠容器的外层元素，包含隐藏/显示的内容
- `<summary>`: 可选的元素，作为折叠区域的标题，点击可切换展开状态

## 基本语法

```html
<details>
  <summary>点击展开</summary>
  <p>这里是隐藏的内容</p>
</details>
```

### 默认折叠
```html
<details>
  <summary>这是标题</summary>
  <p>默认是折叠状态</p>
</details>
```

### 默认展开
添加 `open` 属性即可默认展开：
```html
<details open>
  <summary>默认展开</summary>
  <p>页面加载时就显示的内容</p>
</details>
```

## 核心特性

### 1. 交互行为
- 点击 `<summary>` 或 `<details>` 上的任意位置可切换展开/折叠状态
- 展开时 `details` 元素会添加 `open` 属性
- 切换时触发 `toggle` 事件

### 2. 事件监听
```javascript
const details = document.querySelector('details');

details.addEventListener('toggle', (e) => {
  if (details.open) {
    console.log('展开');
  } else {
    console.log('折叠');
  }
});
```

### 3. 动画效果
CSS `interpolate-size` 属性支持平滑动画（现代浏览器）：
```css
details {
  transition: height 0.3s ease;
}
```

或使用 `grid` 技术实现动画：
```css
details {
  display: grid;
  grid-template-rows: 0fr;
}

details[open] {
  grid-template-rows: 1fr;
}

details > summary,
details > div {
  overflow: hidden;
}
```

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>Details 和 Summary 示例</title>
  <style>
    details {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    
    summary {
      cursor: pointer;
      font-weight: bold;
      user-select: none;
    }
    
    summary::marker {
      content: "▶ ";
    }
    
    details[open] summary::marker {
      content: "▼ ";
    }
    
    details > div {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <h1>Details 和 Summary 示例</h1>
  
  <!-- 基本用法 -->
  <details>
    <summary>基本折叠</summary>
    <p>点击标题可以展开或折叠这段内容。</p>
  </details>
  
  <!-- 默认展开 -->
  <details open>
    <summary>默认展开</summary>
    <p>页面加载时默认显示这段内容。</p>
  </details>
  
  <!-- 嵌套结构 -->
  <details>
    <summary>嵌套示例</summary>
    <div>
      <details>
        <summary>子级折叠</summary>
        <p>这是嵌套的折叠内容。</p>
      </details>
    </div>
  </details>
  
  <script>
    document.querySelectorAll('details').forEach(details => {
      details.addEventListener('toggle', (e) => {
        console.log(`Details ${details.open ? '展开' : '折叠'}`);
      });
    });
  </script>
</body>
</html>
```

## ARIA 角色对应

虽然 `<details>` 和 `<summary>` 有原生的无障碍支持，但有时需要额外的 ARIA 属性：

```html
<!-- 语义化标注 -->
<details>
  <summary aria-expanded="false">展开选项</summary>
  <!-- 内容 -->
</details>

<!-- JavaScript 控制 aria-expanded -->
<script>
const summary = document.querySelector('details summary');
summary.addEventListener('click', () => {
  const isOpen = summary.parentElement.open;
  summary.setAttribute('aria-expanded', !isOpen);
});
</script>
```

## 与 `<dialog>` 的对比

| 特性 | `<details>` | `<dialog>` |
|------|-------------|------------|
| 用途 | 折叠/展开内容 | 模态对话框 |
| 叠加层级 | 不能覆盖其他内容 | 可覆盖全屏 |
| 交互模式 | 点击切换 | 需要明确关闭操作 |
| 动画支持 | 有限 | 良好 |
| 典型场景 | FAQ、文档目录 | 表单弹窗、确认框 |

## 浏览器兼容性

- Chrome 12+ ✅
- Firefox ✅
- Safari 6+ ✅
- Edge 79+ ✅
- 移动端浏览器 ✅

## 常见问题

### 1. 如何只显示图标不显示默认三角符号？
```css
summary {
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}
```

### 2. 如何阻止点击内容区域关闭？
```html
<details>
  <summary>点击这里</summary>
  <div onclick="event.stopPropagation()">
    点击这里的内容不会关闭
  </div>
</details>
```

### 3. 如何设置动画？
使用 `grid` 方法实现平滑展开动画：
```css
details {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

details[open] {
  grid-template-rows: 1fr;
}

summary, details > div {
  overflow: hidden;
}
```

## 参考资源

- [MDN: `<details>` 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/details)
- [MDN: `<summary>` 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/summary)
- [CSS-Tricks: Using the details element](https://css-tricks.com/using-styling-the-details-element/)
- [OpenReplay: Mastering HTML Details and Summary](https://blog.openreplay.com/mastering-html-details-and-summary-elements/)
