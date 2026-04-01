# URL.createObjectURL 完全指南

> 本文详细介绍 `window.URL.createObjectURL` 的使用方法、内存管理及常见问题。

## 一、API 概述

### 1.1 基本语法

```js
const objectURL = URL.createObjectURL(blob | File | MediaStream);
```

**参数**：
| 参数 | 类型 | 说明 |
|------|------|------|
| blob | Blob | Blob 对象 |
| file | File | 继承自 Blob 的 File 对象 |
| MediaStream | MediaStream | 媒体流（摄像头、麦克风等）|

**返回值**：Blob URL，格式为 `blob:<origin>/<uuid>`

**示例**：
```js
const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
console.log(url); // "blob:null/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## 二、生命周期

### 2.1 生命周期规则

```
创建 → 使用 → 释放
```

**关键规则**：

| 特性 | 说明 |
|------|------|
| 生命周期 | 仅在当前文档生命周期内有效 |
| 标签页关闭 | Blob URL 自动失效 |
| 文档卸载 | 浏览器会自动释放 |
| 手动释放 | 必须调用 `revokeObjectURL()` |

### 2.2 生命周期图解

```
┌─────────────────────────────────────────┐
│  页面加载                                │
│  const url = createObjectURL(blob)      │
│         ↓                                │
│  使用 url（img.src = url）               │
│         ↓                                │
│  页面运行中（url 有效）                   │
│         ↓                                │
│  调用 revokeObjectURL(url)               │
│         ↓                                │
│  url 失效，内存释放 ✓                     │
└─────────────────────────────────────────┘
```

---

## 三、内存管理

### 3.1 内存泄漏问题

**⚠️ 核心问题**：如果忘记调用 `revokeObjectURL()`，Blob 对象会一直留在内存中。

**泄漏场景**：
```js
// ❌ 错误：每次选择文件都创建 URL，但从不释放
fileInput.addEventListener('change', (e) => {
  const url = URL.createObjectURL(e.target.files[0]);
  img.src = url; // img.src 被覆盖，但旧 URL 仍在内存
  // 多次选择后，内存持续增长
});
```

**正确做法**：
```js
// ✅ 正确：在使用完后释放
let currentUrl = null;
fileInput.addEventListener('change', (e) => {
  // 释放旧 URL
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
  }
  // 创建新 URL
  currentUrl = URL.createObjectURL(e.target.files[0]);
  img.src = currentUrl;
});

// 在组件卸载时也要释放
window.addEventListener('beforeunload', () => {
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
  }
});
```

### 3.2 最佳实践

**实践 1：封装为工具函数**

```js
class ObjectURLManager {
  constructor() {
    this.urls = new Set();
  }

  create(blob) {
    const url = URL.createObjectURL(blob);
    this.urls.add(url);
    return url;
  }

  revoke(url) {
    if (this.urls.has(url)) {
      URL.revokeObjectURL(url);
      this.urls.delete(url);
    }
  }

  revokeAll() {
    this.urls.forEach(url => URL.revokeObjectURL(url));
    this.urls.clear();
  }
}

// 使用
const manager = new ObjectURLManager();
const url = manager.create(blob);
img.src = url;
// 组件卸载时
manager.revokeAll();
```

**实践 2：结合 useEffect 自动清理（React）**

```js
function ImagePreview({ file }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    // 清理函数：组件卸载或 file 变化时自动释放
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url ? <img src={url} alt="preview" /> : null;
}
```

---

## 四、常见使用场景

### 4.1 图片预览

```js
function previewImage(file) {
  const url = URL.createObjectURL(file);
  
  const img = new Image();
  img.onload = () => {
    console.log(`图片尺寸: ${img.width}x${img.height}`);
    // 使用完毕后释放
    URL.revokeObjectURL(url);
  };
  img.src = url;
  
  return url; // 返回 URL 供 img.src 使用
}

// 多图预览
function previewMultiple(files) {
  return Array.from(files).map(file => ({
    file,
    url: URL.createObjectURL(file)
  }));
}
```

### 4.2 文件下载

```js
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 下载 JSON 文件
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  downloadBlob(blob, filename);
}
```

### 4.3 视频播放

```js
function playVideo(file) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.autoplay = true;
  document.body.appendChild(video);
  
  // 播放结束或页面卸载时释放
  video.addEventListener('ended', () => {
    URL.revokeObjectURL(url);
    video.remove();
  });
}
```

### 4.4 音频播放

```js
function playAudio(file) {
  const url = URL.createObjectURL(file);
  const audio = new Audio(url);
  audio.controls = true;
  document.body.appendChild(audio);
  
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(url);
    audio.remove();
  });
  
  return audio;
}
```

---

## 五、安全注意事项

### 5.1 同源限制

Blob URL 只能被同源页面访问。

```js
// ❌ 跨域 iframe 无法访问
const url = URL.createObjectURL(blob);
// iframe.src = url; // 访问被拒绝
```

### 5.2 隐私模式差异

| 环境 | 行为 |
|------|------|
| 正常模式 | Blob 存储在内存中 |
| 隐私模式 | Blob 存储在临时文件系统 |
| 隐私模式退出 | 所有 Blob URL 自动失效 |

### 5.3 XSS 风险

```js
// ⚠️ 谨慎：不要将 Blob URL 用于用户输入的内容
const userInput = '<img src="blob:..." onerror="...">';
// 这可能导致 XSS 攻击
```

---

## 六、与 createImageBitmap 对比

| API | 特点 | 适用场景 |
|-----|------|----------|
| `createObjectURL` | 同步，返回字符串 URL | 图片预览、下载、video/audio src |
| `createImageBitmap` | 异步，返回 Promise | 图片处理、Canvas 绘制 |
| `FileReader` | 同步/异步，返回 Data URL | 小文件、需要 base64 时 |

```js
// 对比示例
const blob = new Blob(['image data'], { type: 'image/png' });

// createObjectURL：同步，字符串 URL
const url = URL.createObjectURL(blob); // "blob:null/xxx"

// createImageBitmap：异步，Bitmap 对象
const bitmap = await createImageBitmap(blob); // ImageBitmap 对象
const canvas = document.createElement('canvas');
canvas.getContext('2d').drawImage(bitmap, 0, 0);
```

---

## 七、常见问题

### Q1：createObjectURL 和 data URL 的区别？

| 维度 | createObjectURL | data URL |
|------|----------------|----------|
| 格式 | `blob:` 协议 | `data:` 协议 |
| 大小 | 无限制（浏览器内存）| 受 URL 长度限制（IE 2KB）|
| 性能 | 更快（直接引用）| 更慢（base64 编码）|
| 生命周期 | 需手动释放 | 无需释放 |
| 适用 | 大文件 | 小文件 |

### Q2：为什么 revokeObjectURL 后 URL 仍能访问？

**原因**：浏览器可能缓存了引用。只有当所有引用都断开后，内存才会真正释放。

### Q3：Blob URL 会发送请求吗？

**不会**。Blob URL 是浏览器内部的引用，不经过网络请求。数据直接从内存读取。

---

## 八、总结

**核心要点**：

| 规则 | 说明 |
|------|------|
| ✅ 每次创建后要释放 | `URL.revokeObjectURL()` |
| ✅ 在组件卸载时清理 | React: `useEffect` 清理函数 |
| ✅ 封装管理工具 | 避免手动管理遗漏 |
| ✅ 注意同源限制 | Blob URL 不能跨域 |
| ✅ 隐私模式下慎用 | 退出后 URL 自动失效 |
