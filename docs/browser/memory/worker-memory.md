# Worker 与渲染进程内存模型

> 深入理解 Worker 与浏览器渲染进程内存模型的关系

## 1. Chrome 多进程架构

Chrome 采用多进程架构来隔离和保护浏览器各个部分。以下是主要进程类型：

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Process                        │
│                   (浏览器主进程)                              │
│  • 地址栏、书签、前进/后退                                  │
│  • 网络请求、下载管理                                       │
│  • UI 渲染、插件管理                                        │
│  • 进程间通信协调                                           │
└─────────────────────────────────────────────────────────────┘
           │                │                │
           ▼                ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│ Renderer Process  │ │GPU Process   │ │ Plugin Process   │
│ (渲染进程)        │ │ (GPU 进程)   │ │  (插件进程)       │
│                  │ │              │ │                  │
│ • HTML 解析       │ │ GPU 硬件     │ │ Flash 等插件     │
│ • CSS 布局        │ │ 加速渲染     │ │ 独立运行         │
│ • JavaScript 执行 │ │              │ │                  │
│ • DOM 树管理      │ │              │ │                  │
└──────────────────┘ └──────────────┘ └──────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Renderer Process                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Main Thread │  │  V8 Engine  │  │  Worker Threads     │ │
│  │ (主线程)     │  │  (V8 堆)    │  │  (Worker 线程/进程) │ │
│  │             │  │             │  │                     │ │
│  │ DOM Tree    │  │ Heap        │  │ Dedicated Workers   │ │
│  │ Style Calc  │  │ (独立堆)    │  │                     │ │
│  │ Layout     │  │             │  │                     │ │
│  │ Painting   │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 进程类型对比

| 进程类型 | 职责 | 数量 | 内存共享 |
|---------|------|------|---------|
| Browser Process | 浏览器核心协调 | 1 | 不共享 |
| Renderer Process | 页面渲染 + JS 执行 | 每个标签页一个 | V8 堆独立 |
| GPU Process | 图形渲染加速 | 1 | 共享 |
| Plugin Process | 第三方插件运行 | 按需 | 独立 |

## 2. Worker 类型与内存关系

### 2.1 Web Worker (DedicatedWorker)

**关键结论：Web Worker 运行在渲染进程内的独立 V8 堆，不直接占用主线程内存。**

```
Renderer Process
├── Main Thread (主线程)
│   ├── DOM Tree ──────────────┐
│   ├── Style Calc             │
│   ├── Layout                 │
│   └── Painting               │
│                              │
└── V8 Isolates (独立 V8 堆)    │
    ├── Main Thread's Heap     │
    └── Dedicated Worker Heap  ◄── Web Worker 使用独立的 V8 堆
```

**特点：**
- 每个 Dedicated Worker 有独立的 V8 堆
- 与创建它的主线程一一对应
- 不能被其他线程/ Worker 共享
- 通信通过 `postMessage` 进行

```js
// 主线程
const worker = new Worker('worker.js');
worker.postMessage({ type: 'init' });
worker.onmessage = (e) => console.log(e.data);

// worker.js
self.onmessage = (e) => {
  // 独立堆内存中运行
  const data = new Array(10000).fill(e.data);
  self.postMessage({ result: data.length });
};
```

### 2.2 SharedWorker

**SharedWorker 运行在独立进程中，可被多个标签页/ Worker 共享。**

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser Process                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SharedWorker Process                      │ │
│  │  • 独立于渲染进程的 V8 堆                               │ │
│  │  • 可被多个 Renderer Process 共享                        │ │
│  │  • 通过 port 连接进行通信                               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
           ▲                    ▲                    ▲
    ┌──────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐
    │ Renderer A  │      │ Renderer B  │      │ Renderer C  │
    │ (Tab 1)     │      │ (Tab 2)     │      │ (Tab 3)     │
    └─────────────┘      └─────────────┘      └─────────────┘
```

**特点：**
- 独立于任何渲染进程
- 同源的所有标签页可以共享
- 通过 `SharedWorkerPort` 进行通信

```js
// 页面 A 和页面 B 共享一个 SharedWorker
const sharedWorker = new SharedWorker('shared-worker.js');

sharedWorker.port.start();
sharedWorker.port.postMessage({ from: 'page-a' });

sharedWorker.port.onmessage = (e) => {
  console.log('Received:', e.data);
};
```

### 2.3 ServiceWorker

**ServiceWorker 运行在独立进程，不属于任何渲染进程。**

```
┌─────────────────────────────────────────────────────────────┐
│                   ServiceWorker Process                      │
│  • 运行在独立进程                                           │
│  • 独立 V8 堆                                              │
│  • 生命周期与页面无关                                       │
│  • 可在页面关闭后继续运行                                   │
└─────────────────────────────────────────────────────────────┘
           ▲                              ▲
           │                              │
    ┌──────┴──────┐                ┌──────┴──────┐
    │  Page A     │                │  Page B    │
    └─────────────┘                └─────────────┘
```

**特点：**
- 独立于渲染进程
- 可在页面后台运行
- 主要用于离线缓存和网络代理
- 通过 `postMessage` 与页面通信

## 3. 关键结论

> **Worker 运行在独立进程/线程，不直接占用渲染进程主线程内存**

```
┌────────────────────────────────────────────────────────────────┐
│                      内存模型总结                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  主线程内存消耗          │  Worker 内存消耗                     │
│  ─────────────────────┼─────────────────────────               │
│  • DOM 节点             │  • 独立 V8 堆（ Dedicated Worker）   │
│  • CSSOM               │  • 独立进程（SharedWorker）           │
│  • Layout 信息          │  • 独立进程（ServiceWorker）           │
│  • 主线程 JS 堆         │  • 独立 V8 堆                        │
│  • 事件队列             │                                      │
│                                                                │
│  ✓ Worker 不持有 DOM 引用                                     │
│  ✓ Worker 堆内存独立于渲染进程                                 │
│  ✓ Worker 间通信需要序列化（postMessage）                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 验证实验

在 Chrome DevTools 中验证：

1. 打开 DevTools → Memory 面板
2. 选择 "JavaScript Heap" 快照
3. 观察 Main Thread 和 Worker 的堆是分开的

```
Memory 面板快照显示：
┌────────────────────────────────────────────┐
│   JS Heap Snapshot                          │
├────────────────────────────────────────────┤
│  ▼ VM Context 1 (Main Thread)              │
│      ├─ window (object)                    │
│      ├─ document                          │
│      └─ ...                               │
│                                             │
│  ▼ VM Context 2 (Dedicated Worker)         │
│      └─ self (DedicatedWorkerGlobalScope) │
│                                             │
└────────────────────────────────────────────┘
```

## 4. postMessage 内存影响

### 4.1 默认行为：结构化克隆（Structured Clone）

`postMessage` 默认使用**结构化克隆算法**，会**拷贝**数据到目标上下文的堆中。

```js
// 主线程
const largeData = new Array(1000000).fill({ value: Math.random() });

worker.postMessage({ data: largeData });
// 内存变化：
// 1. 主线程仍保留 largeData
// 2. Worker 堆中创建一份拷贝
// 内存使用翻倍！
```

### 4.2 Transferable 接口：零拷贝转移

使用 `transferable` 可以**转移**所有权，而非拷贝：

```js
// 主线程
const buffer = new ArrayBuffer(1024 * 1024 * 10); // 10MB

worker.postMessage({ buffer }, [buffer]);
// buffer 的所有权转移到 Worker
// 主线程中的 buffer 变为无效（长度为 0）
// 内存使用不会翻倍！
```

### 4.3 SharedArrayBuffer：共享内存

`SharedArrayBuffer` 允许多个上下文共享同一块内存：

```js
// 主线程
const sharedBuffer = new SharedArrayBuffer(1024 * 1024);
const sharedArray = new Int32Array(sharedBuffer);

worker.postMessage({ sharedBuffer }, [sharedBuffer]);
// ⚠️ transfer 无效！SharedArrayBuffer 不能被 transfer
// 双方共享同一块内存，修改互相可见
```

**警告：** `SharedArrayBuffer` 需要 `SharedArrayBuffer` 和适当的头部才能使用（防止 Spectre 攻击）。

### 4.4 对比总结

| 机制 | 内存复制 | 所有权转移 | 跨线程修改可见 |
|------|---------|-----------|--------------|
| 默认 postMessage | ✅ 完全拷贝 | ❌ | ❌ |
| Transferable | ❌ | ✅ | N/A |
| SharedArrayBuffer | ❌ | ❌ | ✅ |

### 4.5 性能优化建议

1. **大对象使用 Transferable**
   ```js
   // 避免拷贝
   const buffer = new ArrayBuffer(1024 * 1024 * 100);
   worker.postMessage({ buffer }, [buffer]);
   ```

2. **避免频繁传递大对象**
   ```js
   // 不好：每次都拷贝
   function processData(data) {
     worker.postMessage(data);
   }

   // 好：使用 SharedArrayBuffer 或预分配缓冲区
   const sharedBuffer = new SharedArrayBuffer(1024 * 1024 * 100);
   worker.postMessage({ sharedBuffer });
   ```

3. **合理选择 Worker 类型**
   - 计算密集型 → DedicatedWorker
   - 跨标签页共享 → SharedWorker
   - 后台任务/离线 → ServiceWorker

## 5. Chrome DevTools Memory 面板使用

### 5.1 面板概述

```
┌─────────────────────────────────────────────────────────────┐
│  Memory 面板                                                │
├─────────────────────────────────────────────────────────────┤
│  [Profile] [Snapshot] [Allocation Timeline]                │
│                                                              │
│  ┌─ Profiler ─────────────────────────────────────────────┐ │
│  │  JS Profile    │  CSS Selector Profile  │  Heap Stats  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ Snapshot ─────────────────────────────────────────────┐ │
│  │  ▶ VM Context 1 (Main Thread)                         │ │
│  │  ▶ VM Context 2 (Worker: worker.js)                    │ │
│  │                                                          │ │
│  │  Class filters: ┌──────────────────┐ [Filter]          │ │
│  │                  │ strings, arrays  │                   │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 关键功能

#### 堆快照分析

1. **拍摄快照**：点击 "Take heap snapshot"
2. **筛选对象**：使用 class filter 查找特定类型
3. **比较快照**：拍摄两个快照，用 "Comparison" 模式对比差异

#### Worker 内存查看

1. **切换上下文**：在快照中展开 "VM Context" 节点
2. **查看 Worker 堆**：每个 Worker 有独立的 VM Context
3. **识别泄漏**：比较快照中 Worker 堆的大小变化

#### 内存分配时间线

1. **记录分配**："Record allocation timeline"
2. **查看分配**：蓝色条表示新分配，灰色表示已释放
3. **定位泄漏**：持续增长的蓝色条表示潜在泄漏

### 5.3 常见问题排查

| 问题 | 症状 | 排查方法 |
|------|------|---------|
| Worker 内存泄漏 | Worker 堆持续增长 | 定期拍快照，对比大小 |
| postMessage 拷贝 | 内存翻倍 | 使用 DevTools Memory 记录传输大小 |
| DOM 泄漏 | detach 元素未释放 | 检查 Memory 面板中 detached DOM 树 |

### 5.4 实用技巧

```js
// 1. 使用 console.memory 查看堆信息（Chrome 支持）
console.memory;

// 2. 使用 performance.memory（部分支持）
if (performance.memory) {
  console.log('JS Heap:', performance.memory.usedJSHeapSize);
}

// 3. Worker 中使用 self.onmessage 处理消息
// 4. 使用 structuredClone 测试拷贝开销
const original = new Array(100000).fill(0);
const cloned = structuredClone(original); // 测量拷贝时间
```

## 6. 总结

1. **Worker 不直接占用渲染进程主线程内存**
   - Dedicated Worker：独立 V8 堆（同进程不同堆）
   - SharedWorker：独立进程
   - ServiceWorker：独立进程

2. **postMessage 有内存开销**
   - 默认：结构化克隆，完全拷贝
   - Transferable：零拷贝转移所有权
   - SharedArrayBuffer：共享内存无拷贝

3. **合理使用 Worker**
   - CPU 密集型任务用 Worker
   - 大数据传输用 Transferable
   - 使用 DevTools Memory 面板监控内存

## 7. 参考资料

- [Chrome Multi-Process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [Worker Type MDN](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
- [Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
- [Transferable 接口](https://developer.mozilla.org/en-US/docs/Web/API/Transferable)
