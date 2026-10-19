# 二维码（QR Code）识别技术完全指南

> 本文详细介绍 QR 码的工作原理、支持的数据格式，以及浏览器原生 BarcodeDetector API 和主流 JS 库的实战用法。

## 一、QR 码工作原理

### 1.1 什么是 QR 码？

QR 码（Quick Response Code）是一种二维矩阵码，由日本 Denso Wave 公司于 1994 年发明。与传统一维条形码相比，QR 码可以存储更多数据，且支持任意方向快速扫描。

**QR 码结构图解**：

```
┌─────────────────────────────┐
│  ┌───┐         ┌───┐       │  ← 定位图形（3个角）
│  │ ▓ │         │ ▓ │       │
│  └───┘         └───┘       │
│                             │
│        数据区域              │  ← 存储实际数据
│                             │
│  ┌───┐ ┌─────┐ ┌───┐       │
│  │ ▓ │ │     │ │ ▓ │       │  ← 定位图形 + 校正图形
│  └───┘ │     │ └───┘       │
│        └─────┘             │
│                             │
│              ┌───┐         │
│              │ ▓ │         │  ← 定位图形（右下角）
│              └───┘         │
└─────────────────────────────┘
```

### 1.2 核心组件

| 组件 | 数量 | 说明 |
|------|------|------|
| 定位图形（Finder Pattern） | 3个 | 位于三个角落，用于定位 QR 码 |
| 校正图形（Alignment Pattern） | 0-多个 | 帮助校正角度和位置 |
| 时序图案（Timing Pattern） | 2条 | 交替黑白模块，用于确定网格 |
| 版本信息 | 1个 | 指示 QR 码的版本（1-40） |
| 格式信息 | 1个 | 指示纠错级别和掩码模式 |
| 数据和纠错码字 | - | 存储实际数据和纠错信息 |

### 1.3 版本与规格

QR 码有 40 个版本，版本越高，矩阵越大，存储容量越大：

| 版本 | 矩阵尺寸 | 最大数字 | 最大字母 | 最大字节 |
|------|----------|----------|----------|----------|
| 1 | 21×21 | 41 | 25 | 17 |
| 10 | 25×25 | 236 | 143 | 97 |
| 20 | 29×29 | 530 | 320 | 217 |
| 30 | 33×33 | 872 | 526 | 357 |
| 40 | 37×37 | 7089 | 4296 | 2953 |

### 1.4 纠错级别

QR 码采用 Reed-Solomon 纠错算法，支持 4 个纠错级别：

| 级别 | 简称 | 可恢复数据 | 适用场景 |
|------|------|------------|----------|
| L（Low） | 7% | 约 7% 的数据 | 干净环境，最大容量 |
| M（Medium） | 15% | 约 15% 的数据 | 一般环境（默认）|
| Q（Quartile） | 25% | 约 25% 的数据 | 可能受损 |
| H（High） | 30% | 约 30%的数据 | 工业环境、户外 |

---

## 二、QR 码支持的数据格式

### 2.1 数据类型总览

| 类型 | 前缀 | 示例 | 说明 |
|------|------|------|------|
| URL | `http://` / `https://` | `https://example.com` | 网页链接 |
| 文本 | 无 | `Hello World` | 纯文本 |
| 电话 | `tel:` | `tel:+86-138-0000-0000` | 拨打电话 |
| 短信 | `sms:` | `sms:+86-138-0000-0000` | 发送短信 |
| 邮件 | `mailto:` | `mailto:info@example.com` | 发送邮件 |
| WiFi | `WIFI:` | `WIFI:T:WPA;S:MyNetwork;P:password;;` | 连接 WiFi |
| vCard | `BEGIN:VCARD` | 标准联系人格式 | 联系人信息 |
| VEVENT | `BEGIN:VCALENDAR` | 日历事件格式 | 日程安排 |
| MECARD | `MECARD:` | 简化联系人格式 | 快速联系人 |
| Bitcoin | `bitcoin:` | `bitcoin:1Aa...` | 加密货币支付 |
| Geo | `geo:` | `geo:40.7128,-74.0060` | 地理位置 |

### 2.2 常用格式详解

**URL（网页链接）**：
```
https://www.example.com
http://example.com/page?id=123
```

**电话（tel:）**：
```
tel:+86-138-0000-0000
tel:400-888-8888
```

**短信（sms:）**：
```
sms:+86-138-0000-0000?body=Hello
sms:+86-138-0000-0000;body=Hello
```

**邮件（mailto:）**：
```
mailto:info@example.com
mailto:info@example.com?subject=Hello&body=Content
```

**WiFi 连接**：
```
WIFI:T:WPA;S:MyNetwork;P:password;;
WIFI:T:WEP;S:MyNetwork;P:password;;
WIFI:T:nopass;S:OpenNetwork;;
```
参数说明：
- `T:` 加密类型（WPA/WEP/nopass）
- `S:` 网络名称（SSID）
- `P:` 密码

**vCard 3.0 联系人**：
```
BEGIN:VCARD
VERSION:3.0
FN:张三
TEL:+86-138-0000-0000
EMAIL:zhangsan@example.com
ORG:公司名称
TITLE:工程师
URL:https://example.com
END:VCARD
```

**MECARD 简化联系人**：
```
MECARD:
N:张三
TEL:+86-138-0000-0000
EMAIL:zhangsan@example.com
ORG:公司名称
;
```

**VEVENT 日历事件**：
```
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20240315T090000
DTEND:20240315T100000
SUMMARY:团队会议
LOCATION:会议室A
DESCRIPTION:讨论项目进度
END:VEVENT
END:VCALENDAR
```

**Bitcoin 支付**：
```
bitcoin:1AaBo3Ziv1e3ER8F1h2zEzq6JqW3yK9Jv?amount=0.01&label=Payment
```

**地理位置（geo:）**：
```
geo:40.7128,-74.0060
geo:40.7128,-74.0060?q=New+York
```

### 2.3 格式检测建议

解析 QR 码后，可按以下顺序检测数据类型：

```js
function detectQRType(data) {
  if (/^https?:\/\//.test(data)) return 'URL';
  if (/^tel:/.test(data)) return '电话';
  if (/^sms:/.test(data)) return '短信';
  if (/^mailto:/.test(data)) return '邮件';
  if (/^WIFI:/.test(data)) return 'WiFi';
  if (/^BEGIN:VCARD/.test(data)) return 'vCard';
  if (/^BEGIN:VCALENDAR/.test(data)) return '日历事件';
  if (/^MECARD:/.test(data)) return 'MECARD';
  if (/^bitcoin:/.test(data)) return 'Bitcoin';
  if (/^geo:/.test(data)) return '地理位置';
  return '文本';
}
```

---

## 三、BarcodeDetector API

### 3.1 概述

BarcodeDetector 是 Chrome 83+ 引入的原生 Web API，专门用于检测条形码和二维码。无需第三方库，即可实现扫码功能。

**浏览器兼容性**：

| 浏览器 | 支持版本 | 说明 |
|--------|----------|------|
| Chrome | 83+ | 全面支持 |
| Edge | 83+ | 全面支持 |
| Opera | 70+ | 全面支持 |
| Firefox | 不支持 | - |
| Safari | 不支持 | - |

**注意**：Chrome for Android、Edge mobile 等移动端浏览器也支持此 API。

### 3.2 基本用法

**检测 API 是否可用**：
```js
if ('BarcodeDetector' in window) {
  console.log('BarcodeDetector API 可用');
} else {
  console.log('BarcodeDetector API 不可用');
}
```

**创建检测器并指定格式**：
```js
// 支持的格式：'qr_code', 'ean_13', 'ean_8', 'code_39', 'code_128', 'upc_a', 'upc_e'
const formats = ['qr_code', 'ean_13', 'code_128'];

const detector = new BarcodeDetector({
  formats: formats
});
```

**完整检测示例**：
```js
async function detectQRCode(imageSource) {
  // imageSource 可以是 Image, SVG, Canvas, Video, Blob 等
  const detector = new BarcodeDetector({ formats: ['qr_code'] });

  try {
    const barcodes = await detector.detect(imageSource);

    if (barcodes.length === 0) {
      console.log('未检测到二维码');
      return null;
    }

    barcodes.forEach(barcode => {
      console.log('检测到 QR 码：');
      console.log('  原始值:', barcode.rawValue);
      console.log('  格式:', barcode.format);
      console.log('  边界:', barcode.boundingBox);
      console.log('  角点:', barcode.cornerPoints);
    });

    return barcodes;
  } catch (error) {
    console.error('检测失败:', error);
    return [];
  }
}
```

### 3.3 返回值结构

`detect()` 方法返回一个 `BarcodeDetectorResult` 数组，每个结果包含：

| 属性 | 类型 | 说明 |
|------|------|------|
| `rawValue` | string | 解码后的原始数据 |
| `format` | string | 条码格式（如 'qr_code'）|
| `boundingBox` | DOMRectReadOnly | 检测区域的边界框 |
| `cornerPoints` | Array<{x, y}> | 四个角的位置坐标 |

**cornerPoints 示意图**：

```
cornerPoints 数组顺序：
[0] 左上角  ────── [1] 右上角
   │                    │
   │                    │
[3] 左下角  ────── [2] 右下角
```

### 3.4 实时检测示例

```js
// 摄像头实时检测
const video = document.querySelector('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');

let detector;
let isDetecting = false;

async function startDetection() {
  // 获取摄像头流
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  video.srcObject = stream;
  await video.play();

  // 创建检测器
  detector = new BarcodeDetector({ formats: ['qr_code'] });
  isDetecting = true;

  // 开始检测循环
  detectLoop();
}

async function detectLoop() {
  if (!isDetecting) return;

  // 设置画布尺寸
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 绘制当前帧
  ctx.drawImage(video, 0, 0);

  try {
    const barcodes = await detector.detect(canvas);

    if (barcodes.length > 0) {
      // 显示第一个检测结果
      resultDiv.textContent = '检测到: ' + barcodes[0].rawValue;

      // 绘制检测框
      drawDetection(barcodes[0]);
    }
  } catch (error) {
    console.error('检测错误:', error);
  }

  // 继续检测
  requestAnimationFrame(detectLoop);
}

function drawDetection(barcode) {
  const { boundingBox, cornerPoints } = barcode;

  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 3;
  ctx.strokeRect(
    boundingBox.x,
    boundingBox.y,
    boundingBox.width,
    boundingBox.height
  );

  // 绘制角点
  ctx.fillStyle = '#ff0000';
  cornerPoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}
```

---

## 四、jsQR 库

### 4.1 简介

jsQR 是一个纯 JavaScript 实现的 QR 码解析库，不依赖任何原生 API，通过 WASM 或 ASM.js 在浏览器中运行。

**特点**：
- 纯 JavaScript 实现，兼容性极好
- 支持所有现代浏览器
- 体积较小（约 25KB gzipped）
- 可以解析任何图片源

### 4.2 基本用法

```html
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
```

```js
// 从 Canvas 检测 QR 码
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const code = jsQR(imageData.data, canvas.width, canvas.height);

if (code) {
  console.log('检测到 QR 码:', code.data);
  console.log('位置:', code.location);
} else {
  console.log('未检测到 QR 码');
}
```

### 4.3 完整演示

```js
async function scanQRCode(imageSource) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // 如果是 video 元素
  if (imageSource instanceof HTMLVideoElement) {
    canvas.width = imageSource.videoWidth;
    canvas.height = imageSource.videoHeight;
  } else {
    // 如果是 img 元素
    canvas.width = imageSource.naturalWidth;
    canvas.height = imageSource.naturalHeight;
  }

  ctx.drawImage(imageSource, 0, 0);

  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 检测 QR 码
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    return {
      data: code.data,
      location: code.location
    };
  }

  return null;
}
```

---

## 五、浏览器原生 API vs JS 库对比

| 维度 | BarcodeDetector API | jsQR 等 JS 库 |
|------|---------------------|---------------|
| 浏览器支持 | Chrome/Edge 83+ | 所有现代浏览器 |
| 移动端支持 | Android Chrome | 所有移动浏览器 |
| 性能 | 原生优化，通常更快 | 依赖 JS 解释器 |
| 准确率 | 高 | 较高（但略低于原生）|
| 隐私 | 需摄像头权限 | 需摄像头权限 |
| 条码格式 | 多种格式支持 | 仅 QR 码（jsQR）|
| 实时检测 | 原生支持 | 需手动循环 |
| 离线能力 | 需浏览器实现 | 可打包进网站 |
| 维护 | 由浏览器厂商 | 社区维护 |

**选择建议**：

| 场景 | 推荐方案 |
|------|----------|
| 仅 Chrome/Edge 用户 | BarcodeDetector API |
| 需要跨浏览器兼容 | jsQR |
| 需要支持多种条码 | BarcodeDetector API |
| 离线环境使用 | jsQR |
| 追求最佳性能 | BarcodeDetector API |

---

## 六、实际应用场景

### 6.1 扫码登录

扫码登录是一种常见的身份验证方式，用户使用手机扫描网页上的二维码完成登录。

**流程**：
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   PC 浏览器  │         │   手机 App   │         │   服务器     │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                        │                        │
       │  1. 展示登录二维码        │                        │
       │────────────────────────>│                        │
       │                        │                        │
       │                        │  2. 扫描二维码           │
       │                        │  扫码获取 session ID     │
       │                        │                        │
       │                        │  3. 输入账号密码          │
       │                        │───────────────────────>│
       │                        │                        │
       │                        │  4. 确认登录             │
       │                        │───────────────────────>│
       │                        │                        │
       │  5. 轮询登录状态         │                        │
       │<───────────────────────│                        │
       │                        │                        │
       │  6. 登录成功            │                        │
       │                        │                        │
```

### 6.2 扫码支付

支付场景中，用户扫描商家二维码完成支付。

```js
// 检测支付二维码
const detector = new BarcodeDetector({ formats: ['qr_code'] });

async function handlePaymentQR(imageSource) {
  const barcodes = await detector.detect(imageSource);

  if (barcodes.length === 0) return null;

  const data = barcodes[0].rawValue;

  // 解析支付链接
  if (data.startsWith('weixin://') ||
      data.startsWith('alipays://') ||
      data.startsWith('https://qr.alipay.com/')) {
    return {
      type: 'payment',
      provider: data.startsWith('weixin') ? 'wechat' : 'alipay',
      url: data
    };
  }

  // Bitcoin 支付
  if (data.startsWith('bitcoin:')) {
    const uri = parseBitcoinURI(data);
    return { type: 'crypto', provider: 'bitcoin', ...uri };
  }

  return { type: 'unknown', data };
}
```

### 6.3 扫码连 WiFi

```js
// 解析 WiFi 二维码
function parseWiFiQRCode(data) {
  if (!data.startsWith('WIFI:')) return null;

  const result = {};
  const parts = data.slice(5).split(';');

  for (const part of parts) {
    const [key, value] = part.split(':');
    if (key === 'T') result.encryption = value;
    if (key === 'S') result.ssid = value;
    if (key === 'P') result.password = value;
    if (key === 'H') result.hidden = value === 'true';
  }

  return result;
}

// 连接 WiFi（Android Chrome）
async function connectToWiFi(wifi) {
  if (!('connect' in navigator.wifi)) {
    console.log('WiFi Connect API 不可用');
    return;
  }

  const config = {
    ssid: wifi.ssid,
    password: wifi.password
  };

  try {
    await navigator.wifi.connect(config);
    console.log('WiFi 连接成功');
  } catch (error) {
    console.error('WiFi 连接失败:', error);
  }
}
```

---

## 七、参考资料

| 资源 | 链接 |
|------|------|
| QR 码官方规格 | https://www.qrcode.com/en/about/standards.html |
| ISO/IEC 18004 | 国际标准文档 |
| BarcodeDetector API | https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector |
| jsQR 库 | https://github.com/nick在同一仓库/jsQR |
| ZXing 库 | https://github.com/zxing-js/library |
| QR Code Generator | https://www.qrcode.com/en/ |

