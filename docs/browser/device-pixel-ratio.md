# devicePixelRatio 详解

## 1. 计算公式

```
devicePixelRatio = physical pixels / CSS pixels (device-independent pixels)
```

`devicePixelRatio`（简称 DPR）是浏览器用来描述**物理像素**与**CSS 像素**之间比率的接口。它告诉浏览器需要用多少个物理像素来绘制 1 个 CSS 像素。

---

## 2. 核心概念

### 物理像素（Physical Pixels）

屏幕实际发光/显示的像素点数量，由硬件决定。

```
┌─────────────────────────────┐
│  1920 × 1080 显示器          │
│  ┌───┬───┬───┬───┬───┐      │
│  │   │   │   │   │   │ ...  │ ← 横向 1920 个发光点
│  └───┴───┴───┴───┴───┘      │
│  ...                        │ ← 纵向 1080 个发光点
│  共 2,073,600 个像素点        │
└─────────────────────────────┘
```

### CSS 像素（CSS Pixels）

浏览器用于布局的抽象单位，又称**设备独立像素（Device-Independent Pixels, DIP）**。

- 在标准屏幕上（无缩放），**1 CSS 像素 = 1 物理像素**
- 当用户缩放页面时，CSS 像素会被拉伸或压缩
- CSS 像素是 Web 开发者编写样式时使用的单位

### devicePixelRatio 的本质

```
┌──────────────────────────────────────────────────┐
│  DPR = 1  (标准显示器)                             │
│  1 CSS pixel = 1 Physical pixel                   │
│  ┌─┐                                               │
│  └─┘ → ┌─┐                                         │
│         └─┘                                        │
│                                                   │
│  DPR = 2  (Retina/HiDPI)                          │
│  1 CSS pixel = 2×2 = 4 Physical pixels            │
│  ┌─┐                                               │
│  └─┘ → ┌─┬─┐                                       │
│         ├─┼─┤                                      │
│         └─┴─┘                                      │
└──────────────────────────────────────────────────┘
```

---

## 3. 计算示例

| 设备 | 物理分辨率 | CSS 分辨率 | DPR 计算 | DPR |
|------|-----------|-----------|---------|-----|
| 标准显示器 | 1920×1080 | 1920×1080 | 1920/1920 | **1** |
| Retina MacBook | 2560×1600 | 1280×800 | 2560/1280 | **2** |
| iPhone 13 Pro | 2532×1170 | 844×390 | 2532/844 ≈ 3 | **3** |
| 高端 Android | 3200×1440 | 800×360 | 3200/800 = 4 | **4** |

### 物理分辨率 vs CSS 分辨率

```
┌──────────────────────────────────────────────────────┐
│                    iPhone 13 Pro                     │
│                                                      │
│  物理分辨率: 2532 × 1170 (硬件)                      │
│  CSS 分辨率:  844 × 390  (逻辑/布局)                 │
│  DPR: 3                                              │
│                                                      │
│  为什么不同？                                         │
│  → 苹果将逻辑分辨率设计为 428×926 (points)           │
│  → DPR = 3，所以 CSS 像素为 428×3 × 926×3           │
│  → 但实际屏幕略有裁剪 → 844×390                     │
└──────────────────────────────────────────────────────┘
```

### JavaScript 获取当前 DPR

```javascript
// 获取当前设备的 DPR
const dpr = window.devicePixelRatio;
console.log(`当前 DPR: ${dpr}`);

// 获取物理分辨率
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
console.log(`物理分辨率: ${screenWidth}×${screenHeight}`);

// 获取 CSS 分辨率（即 viewport 宽度）
const cssWidth = window.innerWidth;
const cssHeight = window.innerHeight;
console.log(`CSS 分辨率: ${cssWidth}×${cssHeight}`);
```

---

## 4. DPR 与 DPI 对照

**DPI（Dots Per Inch）** 是打印领域的度量，**PPI（Pixels Per Inch）** 是屏幕密度度量。Web 标准中 DPR 与传统 DPI 有对应关系：

| DPR | DPI / PPI | 常见设备类型 | 说明 |
|-----|-----------|------------|------|
| 1.0 | 96 DPI | 标准显示器 | 1 CSS 像素 = 1 物理像素 |
| 1.25 | 120 DPI | 低精度显示器 | Windows 缩放 125% |
| 1.5 | 144 DPI | 中等精度 | Windows 缩放 150% |
| 2.0 | 192 DPI | Retina / HiDPI | 苹果 Retina 屏，iPhone 6-8 |
| 3.0 | 288 DPI | iPhone X/11/12/13 Pro | 苹果超 Retina |
| 4.0 | 384 DPI |极少数高端 Android | 极小屏幕超高分 |

### DPR × 96 = 近似 DPI

```
DPR 1.0 →  96 DPI
DPR 2.0 → 192 DPI  (Retina)
DPR 3.0 → 288 DPI  (iPhone Retina+)
DPR 4.0 → 384 DPI  (极少数 Android)
```

---

## 5. 缩放对 DPR 的影响

### 页面缩放（Page Zoom）

页面缩放会改变 CSS 像素的物理大小，直接影响 DPR：

```
┌──────────────────────────────────────────────────────┐
│  无缩放 (100%)                                       │
│  DPR = 1, CSS 分辨率 = 1920×1080                     │
│  每个 CSS 像素 = 1 个物理像素                         │
│                                                      │
│  放大 200% (Page Zoom)                                │
│  DPR = 2, CSS 分辨率 = 960×540                       │
│  每个 CSS 像素 = 2×2 = 4 个物理像素                   │
│                                                      │
│  浏览器所见 CSS 像素变少，DPR 增大                     │
│  CSS 分辨率 = 物理分辨率 / (缩放比例 × 基准 DPR)       │
└──────────────────────────────────────────────────────┘
```

### 捏合缩放（Pinch Zoom）

移动端特有的缩放方式，仅改变视觉显示，不影响 CSS 布局分辨率，不影响 DPR：

```
┌──────────────────────────────────────────────────────┐
│  捏合缩放（移动端）                                   │
│                                                      │
│  ┌────────────────┐                                  │
│  │  ████████████  │  ← 手指捏合放大                    │
│  │  ████████████  │                                  │
│  │  ████████████  │                                  │
│  └────────────────┘                                  │
│                                                      │
│  CSS 分辨率不变（viewport 尺寸不变）                  │
│  DPR 不变                                            │
│  仅视觉放大，内容仍然以 CSS 分辨率渲染                 │
└──────────────────────────────────────────────────────┘
```

### JavaScript 监听缩放变化

```javascript
// 方法1：监听 matchMedia 变化
const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
mq.addEventListener('change', () => {
  console.log('DPR changed to', window.devicePixelRatio);
  console.log('缩放比例 changed');
});

// 方法2：定期轮询（不推荐，但更兼容）
let lastDPR = window.devicePixelRatio;
setInterval(() => {
  const currentDPR = window.devicePixelRatio;
  if (currentDPR !== lastDPR) {
    console.log(`DPR 变化: ${lastDPR} → ${currentDPR}`);
    lastDPR = currentDPR;
  }
}, 500);

// 方法3：监听 resize（配合 DPR 检测）
window.addEventListener('resize', () => {
  console.log('DPR:', window.devicePixelRatio);
  console.log('CSS 分辨率:', window.innerWidth, '×', window.innerHeight);
});
```

---

## 6. CSS 和 Canvas 中的实际应用

### Canvas 高清适配

Canvas 默认以 CSS 像素为单位绘制，高清屏上需要手动适配物理像素：

```
┌──────────────────────────────────────────────────────┐
│  Canvas 未适配高清 (DPR=2)                            │
│                                                      │
│  <canvas width="200" height="200">                  │
│                                                      │
│  CSS 尺寸: 200×200                                   │
│  物理尺寸: 200×200 像素                               │
│  实际显示: 模糊（每个 CSS 像素只有 1 个物理像素，      │
│           而屏幕需要 2×2 个来显示）                   │
│                                                      │
│  Canvas 适配高清 (DPR=2)                              │
│                                                      │
│  <canvas width="400" height="400"                   │
│          style="width:200px;height:200px">           │
│                                                      │
│  Canvas 内存缓冲区: 400×400 像素                      │
│  CSS 尺寸: 200×200                                   │
│  实际显示: 清晰（每个 CSS 像素对应 2×2 物理像素）      │
└──────────────────────────────────────────────────────┘
```

```javascript
// Canvas 高清适配完整示例
function setupHighDPICanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio;

  // 设置 Canvas 实际像素缓冲区
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  // 设置 CSS 显示尺寸
  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';

  // 获取 2D 渲染上下文
  const ctx = canvas.getContext('2d');

  // 缩放上下文，使绘图操作以 CSS 像素为单位
  ctx.scale(dpr, dpr);

  return ctx;
}

// 使用示例
const canvas = document.getElementById('myCanvas');
const ctx = setupHighDPICanvas(canvas, 400, 300);

// 现在可以像普通 Canvas 一样绘图
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 400, 300);  // 这会在高清屏上显示正确的尺寸
```

### CSS 图片高清适配

```css
/* 高清屏检测与图片适配 */
.logo {
  /* 默认：标准分辨率图片 */
  background-image: url('logo@1x.png');
  background-size: 200px 100px;
}

/* DPR >= 2 的设备（Retina） */
@media (-webkit-min-device-pixel-ratio: 2),
       (min-resolution: 192dpi),
       (min-resolution: 2dppx) {
  .logo {
    background-image: url('logo@2x.png');
  }
}

/* DPR >= 3 的设备（iPhone Pro） */
@media (-webkit-min-device-pixel-ratio: 3),
       (min-resolution: 288dpi),
       (min-resolution: 3dppx) {
  .logo {
    background-image: url('logo@3x.png');
  }
}
```

### `<img>` 标签的高清适配

```html
<!-- 使用 srcset 属性 -->
<img
  src="logo@1x.png"
  srcset="
    logo@1x.png 1x,
    logo@2x.png 2x,
    logo@3x.png 3x
  "
  alt="Logo"
  width="200"
  height="100"
>

<!-- 也可以用 w 描述符 + sizes -->
<img
  src="logo-400.png"
  srcset="
    logo-400.png 400w,
    logo-800.png 800w,
    logo-1200.png 1200w
  "
  sizes="(max-width: 600px) 100vw, 200px"
  alt="Logo"
>
```

---

## 7. devicePixelRatio 在各浏览器中的行为

### 属性兼容性

| 浏览器 | 支持度 | 备注 |
|-------|--------|------|
| Chrome | ✅ 完整支持 | 支持 `dppx` 单位 media query |
| Firefox | ✅ 完整支持 | 从 Firefox 4 开始支持 |
| Safari | ✅ 完整支持 | iOS Safari 支持良好 |
| Edge | ✅ 完整支持 | Chromium 内核 |
| IE | ⚠️ 部分支持 | IE 9+ 支持 `window.devicePixelRatio`，不支持 `dppx` |

### 获取 DPR 的方法

```javascript
// 标准化方法
const dpr = window.devicePixelRatio;

// 旧浏览器兼容
const dpr = window.devicePixelRatio
         || window.webkitDevicePixelRatio
         || window.mozDevicePixelRatio
         || window.msDevicePixelRatio
         || 1;

// 检测是否高清屏
const isHighDPI = window.devicePixelRatio > 1;
const isRetina = window.devicePixelRatio >= 2;
```

### DPR 与 `dppx` 单位

`dppx` 是 CSS 中表示"每 CSS 像素的物理像素数"的单位，与 `devicePixelRatio` 等价：

```css
/* 以下三行等价 */
@media (min-resolution: 2dppx) { }
@media (min-resolution: 192dpi) { }
@media (min-resolution: 2x) { }

/* 负向检测 */
@media (max-resolution: 1dppx) {
  /* 非高清屏样式 */
}
```

---

## 8. 实际开发建议

### 何时需要关注 DPR

| 场景 | 是否需要适配 DPR |
|------|-----------------|
| 固定宽度 Web 应用（< 1200px） | ❌ 通常不需要 |
| 响应式设计 | ⚠️ 仅关键图片需要 |
| Canvas 绘图 | ✅ 必须适配 |
| SVG / Icon Font | ❌ 矢量图无需适配 |
| 高清屏图片展示 | ✅ 必须适配 |
| 地图 / 图表渲染 | ✅ 必须适配 |

### DPR 适配最佳实践

```javascript
// 1. 检测函数
function isHighDPI() {
  return window.devicePixelRatio > 1;
}

// 2. Canvas 适配模板
function createRetinaCanvas(cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio;
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';
  return canvas;
}

// 3. 图片 URL 选择
function getOptimalImageUrl(baseUrl, dpr) {
  if (dpr >= 3) return baseUrl.replace('.', '@3x.');
  if (dpr >= 2) return baseUrl.replace('.', '@2x.');
  return baseUrl;
}
```

---

## 9. 总结

```
┌─────────────────────────────────────────────────────────┐
│                    devicePixelRatio                      │
│                                                         │
│    physical pixels                                       │
    ─────────────────  = devicePixelRatio                  │
│    CSS pixels                                            │
│                                                         │
│  ┌──────────────┬───────────────┬──────────────────┐  │
│  │  物理像素     │  CSS 像素      │  DPR              │  │
│  ├──────────────┼───────────────┼──────────────────┤  │
│  │  1920×1080   │  1920×1080     │  1 (标准)         │  │
│  │  2560×1600   │  1280×800      │  2 (Retina)       │  │
│  │  2532×1170   │  844×390       │  3 (iPhone Pro)   │  │
│  │  3200×1440   │  800×360       │  4 (高端 Android) │  │
│  └──────────────┴───────────────┴──────────────────┘  │
│                                                         │
│  关键原则：                                              │
│  • DPR 告诉浏览器 1 个 CSS 像素 = 多少物理像素          │
│  • Canvas 高清适配：width×DPR, height×DPR, scale(DPR)  │
│  • 页面缩放会改变 DPR，捏合缩放不会                      │
│  • 高清屏用 2x/3x 图片源，矢量图无需适配                │
└─────────────────────────────────────────────────────────┘
```
