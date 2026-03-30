# Web Lifecycle API 完全指南

> 本文详细介绍 Web Lifecycle API 的状态机制、核心事件、实际应用场景及浏览器兼容性。

## 一、概念概述

### 1.1 什么是 Web Lifecycle API？

Web Lifecycle API 是一组浏览器提供的页面生命周期管理接口，让网页能够在不同系统条件下正确响应生命周期变化。它解决了以下问题：

- 页面被切换到后台时，节省资源
- 页面被冻结或卸载前，保存关键状态
- 跨浏览器和操作系统提供一致的页面生命周期行为

**核心价值**：

- 帮助开发者构建"可中断"的页面体验
- 支持浏览器的"后退缓存"（bfcache）机制
- 在资源受限环境下优化页面性能

### 1.2 生命周期 vs 传统事件

传统的 `beforeunload` 和 `unload` 事件不可靠且已被逐渐弱化。Web Lifecycle API 提供了更可靠的机制：

- `beforeunload` / `unload`：浏览器行为不一致，部分场景下不触发
- `visibilitychange` / `pageshow` / `pagehide`：由 Page Lifecycle 规范定义，行为更一致

---

## 二、页面生命周期状态机

### 2.1 状态流转图

```
┌──────────────────────────────────────────────────────────────────────┐
│                       页面生命周期状态机                                │
│                                                                      │
│  ┌─────────┐    切换标签    ┌─────────┐    最小化/切标签   ┌────────┐│
│  │  Active │ ─────────────▶│ Passive │ ─────────────────▶│ Hidden ││
│  └─────────┘               └─────────┘                   └────────┘│
│       │                         │                               │    │
│       │                         │                               │    │
│       │                         │                               │ ▼  ┌─────────┐
│       │                         │                               ├───▶│ Frozen  │ (可以被唤醒)
│       │                         │                               │    └─────────┘
│       │                         │                               │
│       │                         │                               │    ┌───────────┐
│       │                         │                               ├───▶│ Terminated│ (页面销毁)
│       │                         │                                   └───────────┘
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 状态详解

**Active（活动）**

- 页面处于前台且可交互
- 是页面的正常运行状态
- 浏览器会正常调度所有任务

**Passive（被动）**

- 页面刚从前台切换，尚未完全隐藏
- 触发条件：用户切换到其他标签页但当前标签仍可见
- 浏览器可能会降低帧率

**Hidden（隐藏）**

- 页面完全不可见，但尚未被冻结
- 触发条件：用户切换到其他标签页、最小化窗口、或切换到其他应用
- 页面事件停止执行，但页面仍保持活跃

**Frozen（冻结）**

- 浏览器暂停了页面中的 JavaScript 执行
- 计时器（setTimeout/setInterval）暂停
- WebSocket 连接保持但不活跃
- 页面可以随时恢复或被终止

**Terminated（终止）**

- 页面被完全销毁，内存释放
- 触发条件：用户关闭标签页、导航到其他页面、或浏览器需要回收资源
- 不可恢复，只能重新加载

---

## 三、核心事件详解

### 3.1 visibilitychange

当文档的可见性发生变化时触发。

**触发时机**：

- 页面从可见变为不可见（切换标签、最小化、切换应用）
- 页面从不可见变为可见

**事件属性**：

```javascript
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    console.log('页面可见');
    resumeAnimation();
  } else {
    console.log('页面不可见');
    pauseAnimation();
  }
});
```

**visibilityState 值**：

- `visible`：页面至少部分可见（对应 Active 或 Passive 状态）
- `hidden`：页面完全不可见（对应 Hidden、Frozen 或 Terminated 状态）

### 3.2 pageshow

页面首次加载和每次显示时触发（包括从 bfcache 恢复）。

**特性**：

- 页面首次加载时必定触发（与 `load` 事件时机相近）
- 从 bfcache 恢复时也会触发，此时 `event.persisted` 为 `true`
- `event.persisted` 为 `false` 表示首次加载，`true` 表示从缓存恢复

```javascript
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    console.log('页面从 bfcache 恢复');
    restoreState();
  } else {
    console.log('页面首次加载');
  }
});
```

### 3.3 pagehide

页面隐藏时触发（切换标签、关闭页面、导航到其他页面）。

**特性**：

- 用户可能永远不会再回到这个页面
- `event.persisted` 为 `true` 表示页面进入 bfcache，仍可恢复
- `event.persisted` 为 `false` 表示页面将被卸载

```javascript
window.addEventListener('pagehide', function(event) {
  if (event.persisted) {
    console.log('页面进入 bfcache，可以恢复');
  } else {
    console.log('页面即将被卸载');
    saveState();
  }
});
```

### 3.4 freeze（待定标准）

当页面被冻结时触发，浏览器停止执行页面中的 JavaScript。

**注意事项**：

- 该事件目前不是所有浏览器都支持
- 冻结后，页面无法执行任何 JavaScript 代码
- 只能通过 `resume` 事件或页面重新获得焦点来恢复

```javascript
document.addEventListener('freeze', function() {
  console.log('页面已被冻结');
  // 注意：此时无法执行异步操作
  // 必须在此之前完成所有清理工作
});
```

### 3.5 resume（待定标准）

当页面从冻结状态恢复时触发。

```javascript
document.addEventListener('resume', function() {
  console.log('页面从冻结状态恢复');
  restoreResources();
});
```

---

## 四、frozen 和 terminated 状态详解

### 4.1 frozen（冻结）

**浏览器行为**：

- 暂停所有 JavaScript 执行（代码停止运行）
- 暂停所有计时器（setTimeout/setInterval 不触发）
- 释放 GPU 资源
- 保持网络连接但不活跃
- 保持 WebSocket 连接（取决于浏览器实现）

**开发者应对策略**：

- 在 `freeze` 事件触发前（通过 `visibilitychange` 或 `pagehide`）保存所有必要状态
- 冻结后页面无法执行任何代码，不要在冻结状态下安排任何工作
- 使用 `resume` 事件来恢复资源

**与 bfcache 的关系**：

- 冻结的页面通常保存在 bfcache 中，可以快速恢复
- 浏览器可能会在后台将冻结的页面从内存中清除（变为 Terminated）

### 4.2 terminated（终止）

**浏览器行为**：

- 页面文档被从 DOM 中移除
- 页面所有资源（图片、iframe、脚本等）被释放
- 页面不可恢复，只能重新加载

**触发条件**：

- 用户关闭标签页
- 用户导航到其他网站
- 浏览器内存压力过大，回收后台页面
- 用户手动刷新包含 `unload` 处理器的页面（在部分浏览器中）

**开发者应对策略**：

- 永远不要将关键业务逻辑依赖在 `unload` 事件上
- 使用 `pagehide` 事件的 `persisted` 属性判断页面是否真正卸载
- 重要数据必须实时保存，不要等到页面卸载时才保存

---

## 五、实际应用场景

### 5.1 页面可见性变化时暂停/恢复动画

```javascript
var animationId = null;
var isRunning = false;

function startAnimation() {
  function tick() {
    // 更新动画帧
    updateFrame();
    animationId = requestAnimationFrame(tick);
  }
  animationId = requestAnimationFrame(tick);
  isRunning = true;
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  isRunning = false;
}

function resumeAnimation() {
  if (!isRunning) {
    startAnimation();
  }
}

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    resumeAnimation();
  } else {
    stopAnimation();
  }
});
```

### 5.2 后退缓存（bfcache）机制

bfcache（Back-Forward Cache）是浏览器的特殊缓存，保存整个页面状态（包含 JavaScript 堆），使得"后退"操作可以瞬间恢复页面而无需重新加载。

**bfcache 的优势**：

- 后退操作几乎即时
- 表单数据、滚动位置、JavaScript 状态全部保留
- 用户体验显著提升

**如何支持 bfcache**：

```javascript
// 页面卸载前的处理
window.addEventListener('pagehide', function(event) {
  if (event.persisted) {
    // 页面进入 bfcache，暂停非必要资源
    pausePolling();
    releaseLock();
  } else {
    // 页面即将被卸载
    saveCriticalState();
    closeConnections();
  }
});

// 页面从 bfcache 恢复
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    restoreAllState();
    resumePolling();
  }
});
```

**哪些情况会导致页面无法进入 bfcache**：

- 页面包含未释放的 `beforeunload` 监听器（部分浏览器）
- 页面持有 `XMLHttpRequest` 或 `fetch` 请求（未取消）
- 页面包含 `IndexedDB` 事务
- 页面包含打开的 `WebSocket` 连接
- iframe 指向跨域页面且满足特定条件

### 5.3 页面卸载前保存状态

```javascript
// 在页面隐藏时保存状态（更可靠）
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    saveState();
  }
});

// 同时监听 pagehide 作为补充
window.addEventListener('pagehide', function(event) {
  saveState();
});

function saveState() {
  var state = {
    formData: getFormData(),
    scrollPosition: window.scrollY,
    userPreferences: getUserPrefs(),
    lastModified: Date.now()
  };
  try {
    localStorage.setItem('app_state', JSON.stringify(state));
  } catch (e) {
    // localStorage 写满时降级处理
    console.warn('无法保存状态:', e);
  }
}
```

---

## 六、浏览器兼容性和注意事项

### 6.1 事件支持情况

| 事件 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| visibilitychange | 33+ | 56+ | 14.1+ | 79+ |
| pageshow | 早期版本 | 早期版本 | 早期版本 | 早期版本 |
| pagehide | 早期版本 | 早期版本 | 早期版本 | 早期版本 |
| freeze | 68+ | ~? | 不支持 | 79+ |
| resume | 68+ | ~? | 不支持 | 79+ |

### 6.2 visibilityState 支持情况

| visibilityState | Chrome | Firefox | Safari | Edge |
|----------------|--------|---------|--------|------|
| visible | 33+ | 56+ | 14.1+ | 79+ |
| hidden | 33+ | 56+ | 14.1+ | 79+ |

### 6.3 注意事项

**不要依赖 unload 事件**：

- `unload` 事件在多种常见场景下不会触发
- iOS Safari 的"后退按钮"不会触发 `unload`
- 现代浏览器在部分情况下会忽略 `unload` 处理
- bfcache 恢复页面时 `unload` 不会触发

**使用 visibilitychange 作为主入口**：

- 最可靠的可见性检测方式
- 在 `hidden` 状态下安全地保存状态
- 兼容所有主流浏览器

**使用 pagehide 作为卸载处理**：

- 比 `unload` 更可靠
- `persisted` 属性可以判断是否进入 bfcache
- 跨浏览器支持良好

**避免的反模式**：

```javascript
// ❌ 错误：在 beforeunload 中执行异步操作
window.addEventListener('beforeunload', async function() {
  await saveData(); // 可能不会执行
});

// ❌ 错误：依赖 unload 保存关键状态
window.addEventListener('unload', function() {
  localStorage.setItem('state', 'critical'); // 可能不触发
});

// ✅ 正确：实时保存状态
function onInputChange() {
  localStorage.setItem('draft', this.value); // 每次输入时保存
}

// ✅ 正确：在 visibilitychange 中保存
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    saveAllState();
  }
});
```

---

## 七、与 beforeunload / unload 的区别

### 7.1 beforeunload

**触发时机**：用户即将离开页面时（可取消）

**特性**：

- 可以通过返回字符串来显示确认对话框（已被浏览器限制）
- 现代浏览器只显示浏览器默认消息或完全禁止自定义消息
- 不保证触发（浏览器优化、用户强制关闭等场景）

**适用场景**：

- 仅用于提示用户"有未保存的数据"
- 不要用于执行关键业务逻辑

### 7.2 unload

**触发时机**：页面即将被卸载时

**特性**：

- 极不可靠，以下场景不触发：
  - iOS Safari 的后退按钮
  - Chrome 的"轻松创建"功能
  - bfcache 恢复的页面
  - 浏览器崩溃或强制关闭
- 即使触发，异步操作也不会执行

**适用场景**：

- **无可靠适用场景**
- 所有清理和保存工作应使用其他事件替代

### 7.3 对比总结

| 特性 | visibilitychange | pagehide | beforeunload | unload |
|------|-------------------|----------|--------------|--------|
| **触发可靠性** | 高 | 高 | 中 | 低 |
| **iOS Safari 支持** | 支持 | 支持 | 不触发 | 不触发 |
| **bfcache 场景** | 触发 | 触发 | 不确定 | 不触发 |
| **最小化时触发** | 是 | 是 | 否 | 否 |
| **可取消** | 否 | 否 | 是 | 否 |
| **推荐使用** | ✅ 是 | ✅ 是 | ⚠️ 谨慎 | ❌ 不推荐 |

### 7.4 推荐的事件使用策略

```
页面加载完成：
  └─ pageshow（persisted = false）

页面可见性变化：
  └─ visibilitychange
       ├── visible  → 恢复页面活动（动画、计时器等）
       └── hidden   → 暂停活动 + 保存状态

页面隐藏（任何原因）：
  └─ pagehide
       ├── persisted = true  → 页面进入 bfcache，准备冻结
       └── persisted = false → 页面即将卸载

页面冻结（如果支持）：
  └─ freeze

页面恢复（如果支持）：
  └─ resume
```

---

## 八、参考资料

- [Page Lifecycle API - Chrome Developers](https://developer.chrome.com/docs/web-platform/page lifecycle/)
- [Page Visibility API - W3C](https://www.w3.org/TR/page-visibility/)
- [bfcache - Web Developers](https://web.dev/articles/bfcache)
- [Willful Violation: Unloading Documents — Meaning?](https://www.chromium.org/owners/disallowing-page-destruction/)
