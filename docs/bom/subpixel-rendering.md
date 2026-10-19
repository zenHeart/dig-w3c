# 0.6px 渲染的底层机制 — CSS 像素与物理像素

> 理解浏览器如何将 CSS 像素值转换为屏幕上的物理像素，以及 sub-pixel rendering 的工作原理。

## 一、CSS 像素 vs 物理像素

### 1.1 基本概念

| 概念 | 说明 |
|------|------|
| **CSS 像素** | CSS 规范中定义的长度单位，逻辑像素 |
| **物理像素** | 屏幕实际发光的像素点，设备固有属性 |
| **devicePixelRatio** | 物理像素与 CSS 像素的比例 |

```
devicePixelRatio = 物理像素 / CSS 像素

例如：
- 标准屏幕：devicePixelRatio = 1（1 CSS 像素 = 1 物理像素）
- Retina 屏幕：devicePixelRatio = 2（1 CSS 像素 = 2x2 = 4 物理像素）
- iPhone 13：devicePixelRatio = 2 或 3
```

### 1.2 渲染过程

```
CSS 像素值（如 0.6px）
    ↓
浏览器根据 devicePixelRatio 计算物理像素需求
    ↓
GPU/Compositor 渲染
    ↓
屏幕显示
```

**关键问题**：当 CSS 像素值 × devicePixelRatio 不是整数时，浏览器如何处理？

---

## 二、Sub-pixel Rendering（子像素渲染）

### 2.1 什么是 Sub-pixel Rendering

Sub-pixel rendering 是指**利用物理像素的子单元（RGB）来显示更精细细节**的技术。

```
物理像素结构：
┌─────────────┐
│ R │ G │ B   │  ← 一个像素包含 R/G/B 三个子像素
└─────────────┘

亚像素渲染：
通过独立控制 R/G/B 子像素，可以实现 3 倍于像素级别的精度
```

### 2.2 浏览器的 Sub-pixel Rendering

现代浏览器在渲染时会对 CSS 像素值进行**取整/抗锯齿处理**，而不是简单截断。

```css
/* 
  在 devicePixelRatio=2 的屏幕上：
  0.6px × 2 = 1.2 物理像素
  浏览器通常会渲染为 1px 或 2px（抗锯齿）
*/
.rule { border-width: 0.6px; }
```

### 2.3 渲染结果

| CSS 值 | devicePixelRatio=1 | devicePixelRatio=2 | devicePixelRatio=3 |
|--------|-------------------|-------------------|-------------------|
| 0.6px | 1px（模糊/清晰取决于渲染器） | 1px 或 2px | 2px |
| 1px | 1px | 2px | 3px |
| 0.5px | 0px 或 1px | 1px | 1px 或 2px |

---

## 三、0.6px 的具体表现

### 3.1 为什么 0.6px 是个特殊值

0.6px 是一个**小于 1 CSS 像素**的值，在大多数屏幕上会表现为：

1. **渲染为 1px**（最常见）：浏览器将 0.6px 向上取整
2. **不渲染**（某些情况）：如果浏览器将其视为"太细"可能完全忽略
3. **模糊效果**：Sub-pixel rendering 可能使边缘看起来模糊

### 3.2 各浏览器表现

| 浏览器 | 0.6px border 表现 |
|--------|------------------|
| Chrome | 渲染为 1px |
| Safari | 渲染为 1px |
| Firefox | 渲染为 1px |
| 移动端浏览器 | 通常渲染为 1px |

### 3.3 渲染图解

```
devicePixelRatio = 2 的屏幕（Retina）

CSS: border-width: 0.6px
计算：0.6 × 2 = 1.2 物理像素

浏览器处理（抗锯齿）：
┌────┬────┬────┬────┐
│ 1px│ 1px│ 1px│ ... │  ← 渲染为整数像素
└────┴────┴────┴────┘

结果：border 显示为 1px（实际占 2 个物理像素）
```

---

## 四、解决方案

### 4.1 使用 1px 并使用 transform 缩放

```css
/* 视觉上达到 0.6px 效果 */
.rule {
  border-width: 1px;
  transform: scaleY(0.6);
  /* 注意：需要调整 transform-origin */
}
```

### 4.2 使用渐变模拟

```css
/* 利用渐变创建 0.6px 效果 */
.rule {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    #000 40%,
    #000 60%,
    transparent 60%,
    transparent 100%
  );
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
}
```

### 4.3 使用 box-shadow

```css
/* 利用 box-shadow 实现 0.6px */
.rule {
  box-shadow: 0 0.6px 0 #000;
}
```

### 4.4 直接使用 0.6px（现代浏览器）

```css
/* 现代浏览器基本都支持小于 1px 的边框 */
.rule {
  border-width: 0.6px;
}
```

### 4.5 方案对比

| 方案 | 兼容性 | 性能 | 复杂度 |
|------|--------|------|--------|
| 直接 0.6px | 现代浏览器 | 最优 | 简单 |
| transform: scale | 全部 | 良好 | 中等 |
| 渐变 | 全部 | 良好 | 较高 |
| box-shadow | 全部 | 良好 | 简单 |

---

## 五、devicePixelRatio 与渲染精度

### 5.1 高 PPI 屏幕的优势

高 devicePixelRatio 屏幕（如 Retina）实际上更容易实现细线渲染：

- devicePixelRatio=1：0.6px → 0.6 物理像素（无法细分）
- devicePixelRatio=2：0.6px → 1.2 物理像素（可渲染 1px 或 1.5px 效果）
- devicePixelRatio=3：0.6px → 1.8 物理像素（更精细）

### 5.2 实际测试方法

```javascript
// 检测 devicePixelRatio
console.log(window.devicePixelRatio);

// 检测屏幕物理分辨率
console.log(screen.width, screen.height);
console.log(window.innerWidth, window.innerHeight);
```

### 5.3 适配策略

```css
/* 使用媒体查询针对高 PPI 屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .hairline {
    border-width: 0.6px; /* 在高 PPI 屏幕上更清晰 */
  }
}
```

---

## 六、浏览器渲染管线

```
┌─────────────────────────────────────────────────────────────┐
│                    浏览器渲染管线                             │
├─────────────────────────────────────────────────────────────┤
│  1. 解析 HTML/CSS → DOM/CSSOM                              │
│  2. 构建 Render Tree                                        │
│  3. Layout（计算几何信息）— 0.6px 在这里会被计算             │
│  4. Paint（绘制）— 调用 GPU 绘制                            │
│  5. Composite（合成）— 图层合并                             │
└─────────────────────────────────────────────────────────────┘

在 Layout 阶段：
- 浏览器将 CSS 像素值乘以 devicePixelRatio
- 结果可能不是整数
- 浏览器进行取整/抗锯齿处理
```

---

## 七、常见问题

### Q: 为什么 border-width: 0.1px 在屏幕上看不见？

**答**：0.1px 乘以 devicePixelRatio 后太小，浏览器可能将其渲染为 0px（完全不可见）或进行抗锯齿处理后变成 1px。

### Q: 0.6px 和 transform: scale(0.6) 有什么区别？

**答**：
- `border-width: 0.6px`：浏览器按抗锯齿规则渲染
- `transform: scale(0.6)`：视觉上缩放到 60%，但实际占位不变

### Q: 移动端 0.6px 和桌面端表现一样吗？

**答**：基本一致，但移动端 devicePixelRatio 通常更高（如 2x/3x），渲染精度更好。

---

## 八、相关资源

- [CSS Values and Units - W3C](https://www.w3.org/TR/css-values-4/)
- [MDN: CSS Pixel](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel)
- [Subpixel Rendering Wiki](https://en.wikipedia.org/wiki/Subpixel_rendering)
- [Chromium Source: Subpixel Rendering](https://chromium.googlesource.com/chromium/src/+/main/docs/subpixel_render.md)
