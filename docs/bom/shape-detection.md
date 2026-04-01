# Shape Detection API

## 概述

Shape Detection API 是 W3C 标准的浏览器原生计算机视觉接口，通过浏览器内置的硬件/操作系统加速实现形状检测，无需引入第三方库。

## 核心概念

Shape Detection API 通过浏览器的硬件加速能力，实现：
- **人脸检测** — FaceDetector
- **条码/二维码检测** — BarcodeDetector
- **文本识别（OCR）** — TextDetector

所有检测器都遵循统一的异步 API 模式：`detect(image) => Promise<DetectedObject[]>`

## 三个核心子模块

### 1. FaceDetector — 人脸检测

检测图像中的人脸位置和边界框，返回人脸 landmarks（如眼睛、鼻子、嘴）。

```javascript
// 检测支持情况
if ('FaceDetector' in window) {
  const detector = new FaceDetector({
    fastMode: true,          // 快速模式（精度略降）
    maxDetectedFaces: 10     // 最多检测人数
  });

  const faces = await detector.detect(imageElement);
  console.log(faces[0].boundingBox); // { x, y, width, height }
  console.log(faces[0].landmarks);   // [{ type: 'eye', location: {...} }, ...]
} else {
  console.log('FaceDetector not supported');
}
```

**Landmark 类型**：
| 类型 | 说明 |
|------|------|
| `eye` | 眼睛 |
| `mouth` | 嘴巴 |
| `nose` | 鼻子 |

### 2. BarcodeDetector — 条形码/二维码检测

支持 1D 条形码（EAN、UPC）和 2D 二维码（QR Code、Data Matrix）。

```javascript
// 检测支持情况
if ('BarcodeDetector' in window) {
  const detector = new BarcodeDetector({
    formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'upc_a', 'upc_e']
  });

  const barcodes = await detector.detect(imageElement);
  console.log(barcodes[0].rawValue);   // 条码内容字符串
  console.log(barcodes[0].format);      // 'qr_code'
  console.log(barcodes[0].boundingBox); // { x, y, width, height }
}
```

**支持的格式**：

| 类型 | 格式 | 说明 |
|------|------|------|
| 1D | `ean_13`, `ean_8`, `code_128`, `upc_a`, `upc_e` | 商品条码 |
| 2D | `qr_code`, `data_matrix`, `aztec`, `pdf417` | 二维码 |

### 3. TextDetector — 文本识别（OCR）

检测图像中的文本区域，返回文本内容和边界框。

```javascript
const textDetector = new TextDetector();
const texts = await textDetector.detect(imageElement);
console.log(texts[0].rawValue);   // 识别出的文字
console.log(texts[0].boundingBox); // { x, y, width, height }
```

> **注意**：TextDetector 精度有限，对于复杂场景建议使用云端 OCR 服务（如腾讯云、阿里云）。

## API 基本用法

### 统一检测流程

```javascript
async function detectShapes(imageSource) {
  const results = { faces: [], barcodes: [], texts: [] };

  if ('FaceDetector' in window) {
    const faceDetector = new FaceDetector();
    results.faces = await faceDetector.detect(imageSource);
  }

  if ('BarcodeDetector' in window) {
    const barcodeDetector = new BarcodeDetector();
    results.barcodes = await barcodeDetector.detect(imageSource);
  }

  if ('TextDetector' in window) {
    const textDetector = new TextDetector();
    results.texts = await textDetector.detect(imageSource);
  }

  return results;
}

// 使用
const img = document.querySelector('img');
const detected = await detectShapes(img);
console.log(`检测到 ${detected.faces.length} 张人脸`);
console.log(`检测到 ${detected.barcodes.length} 个条码`);
```

### 检测来源

`detect()` 方法接受的 imageSource 可以是：
- `<img>` 元素
- `<canvas>` 元素
- `<video>` 元素
- `ImageBitmap`
- `Blob`

### 检测结果结构

```typescript
interface DetectedObject {
  boundingBox: {
    x: number;      // 左上角 x 坐标
    y: number;      // 左上角 y 坐标
    width: number;  // 宽度
    height: number; // 高度
  };
  // 以下为 FaceDetector 特有
  landmarks?: Array<{
    type: 'eye' | 'mouth' | 'nose';
    location: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  // 以下为 BarcodeDetector 特有
  rawValue?: string;  // 条码内容
  format?: string;     // 条码格式
}
```

## 浏览器支持

| 检测器 | Chrome | Edge | Safari | Firefox |
|--------|--------|------|--------|---------|
| FaceDetector | ✅ 83+ | ✅ 83+ | ❌ | ❌ |
| BarcodeDetector | ✅ 83+ | ✅ 83+ | ❌ | ❌ |
| TextDetector | ✅ 83+ | ✅ 83+ | ❌ | ❌ |

**环境要求**：
- 必须 HTTPS 或 localhost
- 部分平台需要硬件支持（如 Android 上的 Google Play 服务）

## 与第三方库对比

| 维度 | Shape Detection API | TensorFlow.js | OpenCV.js |
|------|--------------------|---------------------|-------------|
| **体积** | 浏览器内置（0 KB）| ~1.5 MB | ~1.5 MB |
| **性能** | 硬件加速 | GPU/CPU | WASM |
| **功能** | 有限（人脸/条码/文本）| 丰富（自定义模型）| 丰富 |
| **精度** | 依赖平台 | 高（可自定义模型）| 高 |
| **离线** | ✅ | ✅ | ✅ |
| **隐私** | 本地处理 | 本地处理 | 本地处理 |

## 应用场景

| 场景 | 推荐检测器 | 示例 |
|------|-----------|------|
| **扫码登录** | BarcodeDetector | 扫码识别替代手动输入 |
| **人脸认证** | FaceDetector | 身份验证第一步 |
| **文档扫描** | TextDetector | 拍照提取文字 |
| **AR 应用** | FaceDetector | 实时人脸追踪/虚拟滤镜 |
| **电商图片** | FaceDetector + BarcodeDetector | 商品搜索/比价 |

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Shape Detection Demo</title>
  <style>
    .container { display: flex; gap: 16px; flex-wrap: wrap; }
    .card { border: 1px solid #ddd; padding: 8px; }
    canvas { max-width: 300px; }
  </style>
</head>
<body>
  <h1>Shape Detection API Demo</h1>
  <input type="file" id="fileInput" accept="image/*">
  <div class="container" id="results"></div>

  <script>
    document.getElementById('fileInput').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const results = document.getElementById('results');
      results.innerHTML = `<div class="card"><h3>原图</h3><img src="${URL.createObjectURL(file)}" style="max-width:300px;"></div>`;

      // 条码检测
      if ('BarcodeDetector' in window) {
        const start = performance.now();
        const barcodes = await new BarcodeDetector().detect(canvas);
        const ms = (performance.now() - start).toFixed(1);
        results.innerHTML += `<div class="card">
          <h3>BarcodeDetector (${ms}ms)</h3>
          <p>检测到 ${barcodes.length} 个条码</p>
          ${barcodes.map(b => `<pre>${b.format}: ${b.rawValue}</pre>`).join('')}
        </div>`;
      }

      // 人脸检测
      if ('FaceDetector' in window) {
        const start = performance.now();
        const faces = await new FaceDetector().detect(canvas);
        const ms = (performance.now() - start).toFixed(1);
        results.innerHTML += `<div class="card">
          <h3>FaceDetector (${ms}ms)</h3>
          <p>检测到 ${faces.length} 张人脸</p>
        </div>`;
      }
    });
  </script>
</body>
</html>
```

## 检测支持情况检测

```javascript
// 统一检测函数
function getSupportedDetectors() {
  return {
    FaceDetector: 'FaceDetector' in window,
    BarcodeDetector: 'BarcodeDetector' in window,
    TextDetector: 'TextDetector' in window
  };
}

console.log(getSupportedDetectors());
// { FaceDetector: true, BarcodeDetector: true, TextDetector: false }
```

## 参考资源

- [WICG Shape Detection Specification](https://wicg.github.io/shape-detection-api/)
- [Chrome 官方文档](https://developer.chrome.com/docs/web-platform/shape-detection)
- [MDN FaceDetector](https://developer.mozilla.org/en-US/docs/Web/API/FaceDetector)
- [MDN BarcodeDetector](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector)
- [MDN TextDetector](https://developer.mozilla.org/en-US/docs/Web/API/TextDetector)
