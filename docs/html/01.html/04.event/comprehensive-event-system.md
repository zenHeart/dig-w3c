# JavaScript 事件体系完全指南

> 本文档系统梳理浏览器 DOM 事件体系的完整知识，包括事件传播机制、事件委托、原生事件对象、自定义事件、事件循环时序，以及常见踩坑点。

---

## 目录

1. [DOM Events Architecture](#1-dom-events-architecture)
2. [事件传播：捕获 → 目标 → 冒泡](#2-事件传播捕获--目标--冒泡)
3. [事件委托（Event Delegation）](#3-事件委托event-delegation)
4. [原生事件对象](#4-原生事件对象)
5. [CustomEvent 自定义事件](#5-customevent-自定义事件)
6. [事件循环与渲染时序](#6-事件循环与渲染时序)
7. [常见踩坑点](#7-常见踩坑点)
8. [最佳实践](#8-最佳实践)

---

## 1. DOM Events Architecture

### 1.1 核心接口

DOM Events 基于 W3C UI Events 规范，核心接口关系：

```
EventTarget
    ├── addEventListener(type, listener, options)
    ├── removeEventListener(type, listener, options)
    ├── dispatchEvent(event) → boolean
    └── EventTarget() 构造函数

Event
    ├── type: string
    ├── target: EventTarget
    ├── currentTarget: EventTarget
    ├── eventPhase: number (NONE=0|CAPTURING=1|AT_TARGET=2|BUBBLING=3)
    ├── bubbles: boolean
    ├── cancelable: boolean
    ├── defaultPrevented: boolean
    ├── timeStamp: number
    ├── stopPropagation()
    ├── stopImmediatePropagation()
    └── preventDefault()

UIEvent → Event
    ├── view: Window
    └── detail: number

MouseEvent → UIEvent
    ├── clientX/clientY, pageX/pageY, screenX/screenY
    ├── offsetX/offsetY
    ├── button, buttons
    ├── relatedTarget
    └── ...

KeyboardEvent → UIEvent
    ├── key, code
    ├── keyCode (已废弃), which (已废弃)
    ├── ctrlKey, shiftKey, altKey, metaKey
    └── ...
```

### 1.2 EventTarget 实现

所有可绑定事件的 DOM 节点都实现了 EventTarget 接口：

```js
// EventTarget 是基础接口
class MyEmitter extends EventTarget {
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

const emitter = new MyEmitter();
emitter.addEventListener('data', e => console.log(e.detail));
emitter.emit('data', { msg: 'hello' });
```

---

## 2. 事件传播：捕获 → 目标 → 冒泡

### 2.1 三个阶段

当事件发生在嵌套元素上时，事件传播经历三个阶段（依据 W3C UI Events 规范）：

```
 phase 1: CAPTURING_PHASE (1)  — 从 document 向下到目标父元素
 phase 2: AT_TARGET (2)        — 事件到达目标元素
 phase 3: BUBBLING_PHASE (3)    — 从目标元素向上到 document
```

### 2.2 addEventListener 的第三个参数

```js
element.addEventListener('click', handler, options)

// options 对象
{
  capture: boolean,   // true = 捕获阶段触发，false = 冒泡阶段触发（默认）
  once: boolean,      // 只触发一次后自动移除
  passive: boolean,   // 承诺不调用 preventDefault，提升滚动性能
  signal: AbortSignal // 通过 AbortController 中止监听
}

// 或使用简洁写法
element.addEventListener('click', handler, true);  // true = capture: true
```

### 2.3 完整示例：观察三个阶段

```js
// HTML 结构：<div id="outer"><div id="inner"></div></div>

const outer = document.getElementById('outer');
const inner = document.getElementById('inner');

outer.addEventListener('click', e => {
  console.log('outer CAPTURE', e.eventPhase); // 1
}, { capture: true });

outer.addEventListener('click', e => {
  console.log('outer BUBBLE', e.eventPhase); // 3
}, { capture: false });

inner.addEventListener('click', e => {
  console.log('inner AT_TARGET', e.eventPhase); // 2（目标阶段两种都触发）
}, { capture: true });

inner.addEventListener('click', e => {
  console.log('inner AT_TARGET', e.eventPhase); // 2
}, { capture: false });
// 点击 inner 输出顺序：outer CAPTURE → inner AT_TARGET × 2 → outer BUBBLE
```

### 2.4 事件流图示

```
document
  │
  ▼ [CAPTURE 阶段下行]
<div id="outer">
  │
  ▼ [CAPTURE 阶段继续下行]
  <div id="inner">  ← 点击目标（AT_TARGET 阶段）
  │
  ▲ [BUBBLE 阶段上行]
</div>
  │
  ▲ [BUBBLE 阶段继续上行]
document
```

### 2.5 阻止传播

```js
event.stopPropagation()
// 阻止当前事件继续传播到下一个节点（但同节点的其他同类型监听器仍执行）

event.stopImmediatePropagation()
// 阻止传播，且阻止同节点同类型后续监听器执行

event.preventDefault()
// 阻止默认行为，与传播无关
// 搭配 passive: false 使用才有效
```

### 2.6 不冒泡的事件

以下事件不冒泡（`bubbles: false`）：

- `focus` / `blur`（使用 `focusin` / `focusout` 替代，它们冒泡）
- `load` / `unload`
- `scroll`（但 `document.scrollingElement` 的 scroll 在 Chromium 上冒泡）
- `mouseenter` / `mouseleave`（使用 `mouseover` / `mouseout` 替代，它们冒泡）
- `pointerenter` / `pointerleave`（使用 `pointerover` / `pointerout` 替代）

---

## 3. 事件委托（Event Delegation）

### 3.1 核心原理

利用事件冒泡机制，在父元素上监听子元素的事件，避免为每个子元素单独绑定监听器。

```js
// 反模式：为每个按钮单独绑定
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// 最佳实践：事件委托
document.getElementById('list').addEventListener('click', e => {
  if (e.target.matches('.btn')) {
    handleClick(e);
  }
});
```

### 3.2 delegation vs 直接绑定对比

| 维度 | 直接绑定 | 事件委托 |
|------|---------|---------|
| 监听器数量 | O(n) | O(1) |
| 动态元素 | 需重新绑定 | 自动覆盖（冒泡） |
| 内存 | 高（每个元素一个监听器） | 低（一个监听器） |
| 调试 | 简单 | 需注意 target 判断 |
| 适用场景 | 少量固定元素 | 动态列表/大量元素 |

### 3.3 closest() 方法判断冒泡路径

```js
// 在委托监听器中判断事件是否来自特定子元素
parent.addEventListener('click', e => {
  // closest() 向上遍历找匹配选择器的祖先（含自身）
  const btn = e.target.closest('.btn');
  if (btn) {
    console.log('按钮被点击', btn.textContent);
  }
});
```

### 3.4 jQuery 风格的 live 委托（原生实现）

```js
function liveDelegate(root, selector, eventType, handler) {
  root.addEventListener(eventType, e => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) {
      handler.call(target, e);
    }
  });
}

// 使用
liveDelegate(document, '.btn-delete', 'click', function(e) {
  // this 指向匹配的元素
  this.remove();
});
```

### 3.5 事件委托的限制

- `focus` / `blur` / `mouseenter` / `mouseleave` 等不冒泡的事件无法委托（可用 `focusin` / `focusout` 替代）
- `scroll` 事件在 `document` 上委托不可靠
- 需要额外判断 `e.target`，增加代码复杂度

---

## 4. 原生事件对象

### 4.1 Event 接口通用属性

```js
element.addEventListener('click', e => {
  // 基础属性
  e.type              // 事件类型，如 'click'
  e.target            // 触发事件的实际元素（最深层）
  e.currentTarget     // 绑定监听器的元素（即 this）
  e.eventPhase        // 1=捕获, 2=目标, 3=冒泡
  e.bubbles           // 是否冒泡
  e.cancelable        // 是否可取消默认行为
  e.defaultPrevented  // 是否已调用 preventDefault
  e.timeStamp         // 事件创建时间（毫秒）
  
  // 控制方法
  e.preventDefault()           // 取消默认行为
  e.stopPropagation()          // 阻止传播到下一个节点
  e.stopImmediatePropagation() // 阻止传播且阻止同节点后续监听器
  e.composedPath()             // 返回事件路径数组
}, false);
```

### 4.2 Event.composedPath()

返回事件传播路径，帮助调试事件流：

```js
element.addEventListener('click', e => {
  console.log(e.composedPath());
  // [#shadow-root, element, div#outer, body, html, document, Window]
}, true);
```

### 4.3 MouseEvent 特有属性

```js
element.addEventListener('mousedown', e => {
  // 坐标系统
  e.clientX / e.clientY   // 视口坐标（不含滚动）
  e.pageX / e.pageY       // 页面坐标（含滚动）
  e.screenX / e.screenY   // 屏幕坐标
  e.offsetX / e.offsetY   // 元素内坐标
  
  // 按钮状态
  e.button     // 0=左键, 1=中键, 2=右键
  e.buttons    // 位掩码：1=左, 2=右, 4=中（可同时检测多个）
  e.ctrlKey   // Ctrl 键
  e.shiftKey  // Shift 键
  e.altKey    // Alt 键
  e.metaKey   // Meta/Command 键
  
  // relatedTarget 相关元素（mouseover/out 时用到）
  e.relatedTarget
}, false);
```

### 4.4 KeyboardEvent 关键属性

```js
element.addEventListener('keydown', e => {
  e.key       // 实际字符或按键名（'a', 'Enter', 'ArrowUp'）
  e.code      // 物理按键码（'KeyA', 'Enter', 'ArrowUp'）
  
  // 组合键判断
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault(); // 阻止 Ctrl+S
  }
  
  // 废弃属性（不推荐使用）
  // e.keyCode  — 已废弃，用 e.key 替代
  // e.which    — 已废弃，用 e.key 替代
}, false);
```

### 4.5 Event 接口的演进

| 版本 | 规范 | 新增接口 |
|------|------|---------|
| DOM Level 0 | 历史遗留 | 无正式接口 |
| DOM Level 2 | Events | Event, EventTarget, addEventListener |
| DOM Level 3 | UI Events | UIEvent, MouseEvent, KeyboardEvent, focusin/focusout |
| DOM Level 4 | Pointer Events | PointerEvent, touch events 统一 |
| Modern | Input Events | InputEvent, beforeinput |

---

## 5. CustomEvent 自定义事件

### 5.1 CustomEvent vs Event

```js
// Event — 基础事件，无额外数据
const event = new Event('build', { bubbles: true, cancelable: false });

// CustomEvent — 可传递任意数据
const customEvent = new CustomEvent('build', {
  detail: { timestamp: Date.now(), data: { id: 1 } },
  bubbles: true,
  cancelable: true
});
```

### 5.2 完整使用示例

```js
// 定义一个事件发射器类
class EventEmitter extends EventTarget {
  emit(type, data) {
    const event = new CustomEvent(type, {
      detail: data,
      bubbles: false,
      cancelable: true
    });
    this.dispatchEvent(event);
  }
  
  on(type, handler) {
    this.addEventListener(type, handler);
  }
  
  off(type, handler) {
    this.removeEventListener(type, handler);
  }
}

// 使用
const emitter = new EventEmitter();

emitter.on('data', e => {
  console.log('收到数据:', e.detail); // { id: 1, value: 'hello' }
});

emitter.emit('data', { id: 1, value: 'hello' });
```

### 5.3 旧式 createEvent（不推荐）

```js
// 已废弃，不推荐使用
const event = document.createEvent('Event');
event.initEvent('build', true, true); // type, bubbles, cancelable

// 推荐直接用 Event 或 CustomEvent 构造函数
```

### 5.4 跨窗口事件通信

```js
// iframe 向父窗口发消息
iframe.contentWindow.postMessage('hello', '*');

// 父窗口监听
window.addEventListener('message', e => {
  if (e.origin !== 'https://expected-origin.com') return;
  console.log('收到消息:', e.data);
});
```

---

## 6. 事件循环与渲染时序

### 6.1 浏览器任务分类

```
┌─────────────────────────────────────────────┐
│                 主线程 Main Thread            │
├─────────────────────────────────────────────┤
│  执行栈 (Call Stack)                        │
│  执行同步代码 → 出栈                         │
├─────────────────────────────────────────────┤
│  任务队列 (Task Queue / Macrotask Queue)    │
│  setTimeout | setInterval | I/O | UI渲染    │
│  → 每轮事件循环取一个 macrotask            │
├─────────────────────────────────────────────┤
│  微任务队列 (Microtask Queue)               │
│  Promise.then | MutationObserver | queueMicrotask
│  → 当前任务结束后，清空所有微任务           │
├─────────────────────────────────────────────┤
│  渲染 (Rendering)                           │
│  requestAnimationFrame → rAF callbacks       │
│  → requestIdleCallback →ric callbacks        │
└─────────────────────────────────────────────┘
```

### 6.2 执行顺序示例

```js
console.log('1. 同步开始');

setTimeout(() => console.log('4. setTimeout (macrotask)'), 0);

Promise.resolve()
  .then(() => console.log('2. Promise.then (microtask)'))
  .then(() => console.log('3. Promise.then chain (microtask)'));

console.log('1. 同步结束');

// 输出顺序：1.同步开始 → 1.同步结束 → 2.Promise.then → 3.chain → 4.setTimeout
```

### 6.3 事件与渲染时机

浏览器的渲染更新发生在 macrotask 执行完毕后、微任务清空之后：

```js
// 验证渲染时机
let count = 0;
const div = document.getElementById('count');

new Promise(resolve => {
  // 同步更新 DOM
  div.textContent = ++count; // 不触发重排
  resolve();
}).then(() => {
  // 微任务中更新样式
  div.style.color = 'red'; // 合并到同一帧渲染
});

setTimeout(() => {
  div.style.color = 'blue'; // 下一个 macrotask，触发新渲染
}, 0);
```

### 6.4 requestAnimationFrame 与事件

`requestAnimationFrame` (rAF) 回调在渲染之前执行，适合做动画：

```js
// rAF 在每帧渲染前调用
function animate() {
  // 更新动画状态
  updateAnimation();
  
  // 请求下一帧
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// 与事件的关系：rAF 回调在事件处理之后、渲染之前执行
element.addEventListener('click', () => {
  // 1. 先执行事件处理
  updateState();
  
  requestAnimationFrame(() => {
    // 2. rAF 在本帧渲染前执行（如果浏览器决定渲染）
    updateAnimation();
  });
});
```

### 6.5 事件处理与长任务

同步事件处理会阻塞渲染：

```js
// ❌ 长时间同步计算阻塞渲染
element.addEventListener('click', () => {
  while (heavyComputation()) {} // 阻塞主线程，无法渲染
});

// ✅ 使用 setTimeout 分割任务
element.addEventListener('click', () => {
  setTimeout(() => doHeavyWork(), 0); // 让出主线程，允许渲染
});

// ✅ 使用 Web Worker（完全不阻塞主线程）
element.addEventListener('click', () => {
  const worker = new Worker('worker.js');
  worker.postMessage(data);
});
```

---

## 7. 常见踩坑点

### 7.1 事件监听器重复添加

```js
// ❌ 每次渲染都会添加新监听器，导致重复执行
function render() {
  element.addEventListener('click', handleClick); // 累积！
}

// ✅ 先移除后添加，或使用 once 选项
function render() {
  element.removeEventListener('click', handleClick); // 先移除
  element.addEventListener('click', handleClick);
}

// ✅ 更好的方式：使用 once
element.addEventListener('click', handleClick, { once: true });

// ✅ 或使用 AbortController
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// 后续移除
controller.abort();
```

### 7.2 异步操作中的 this 指向

```js
// ❌ 回调中 this 丢失
element.addEventListener('click', async function() {
  const data = await fetchData();
  this.render(data); // this 指向 element，OK
});

// ❌ 使用箭头函数时 this 问题
element.addEventListener('click', async (e) => {
  const data = await fetchData();
  e.currentTarget.render(data); // 用 e.currentTarget 代替 this
});
```

### 7.3 passive 事件监听器中调用 preventDefault

```js
// ❌ passive: true 的监听器中调用 preventDefault 无效（Chrome 会警告）
element.addEventListener('touchmove', e => {
  e.preventDefault(); // 无效！passive 承诺不阻止默认行为
}, { passive: true });

// ✅ 需要阻止默认行为时，用 passive: false
element.addEventListener('touchmove', e => {
  e.preventDefault(); // 有效，但可能影响滚动性能
}, { passive: false });

// ✅ 或使用 wheel 事件替代（本身可取消）
element.addEventListener('wheel', e => {
  e.preventDefault();
}, { passive: false });
```

### 7.4 focus/blur 不冒泡

```js
// ❌ 事件委托无法捕获 focus 事件（不冒泡）
parent.addEventListener('focus', e => { /* 不触发 */ }, true);

// ✅ 使用 focusin（冒泡版）
parent.addEventListener('focusin', e => {
  console.log('input 获得焦点');
});

// ✅ 同理 blur → focusout
parent.addEventListener('focusout', e => {
  console.log('input 失去焦点');
});
```

### 7.5 mouseenter/leave 不冒泡

```js
// ❌ 事件委托无法捕获 mouseenter/leave（不冒泡）
parent.addEventListener('mouseenter', e => { /* 不触发 */ });

// ✅ 使用 mouseover/mouseout（会冒泡，但需判断 relatedTarget）
parent.addEventListener('mouseover', e => {
  if (!parent.contains(e.relatedTarget)) {
    console.log('鼠标进入 parent');
  }
});

parent.addEventListener('mouseout', e => {
  if (!parent.contains(e.relatedTarget)) {
    console.log('鼠标离开 parent');
  }
});
```

### 7.6 事件对象被复用

```js
// ❌ 在异步回调中访问已重置的事件对象
let clickEvent;
element.addEventListener('click', e => {
  clickEvent = e; // 保存引用
  setTimeout(() => {
    console.log(clickEvent.target); // 可能已被重置！
  }, 1000);
});

// ✅ 立即读取需要的数据
element.addEventListener('click', e => {
  const target = e.target; // 立即保存
  setTimeout(() => {
    console.log(target); // 正确
  }, 1000);
});
```

### 7.7 dispatchEvent 同步执行

```js
// dispatchEvent 是同步的（大多数浏览器）
element.addEventListener('click', () => console.log('clicked'));

element.dispatchEvent(new MouseEvent('click'));
console.log('after dispatch');
// 输出：clicked → after dispatch（顺序执行，非异步）
```

### 7.8 事件委托中 target 可能是文本节点

```js
// ❌ 文本节点也会触发事件
// <div><span>点击我</span></div>
div.addEventListener('click', e => {
  if (e.target.tagName === 'SPAN') { /* 正常 */ }
  // 当点击"点击我"文本时，target 是文本节点，tagName undefined
});

// ✅ 使用 closest() 更安全
div.addEventListener('click', e => {
  const span = e.target.closest('span'); // 向上找到 span 或 null
  if (span) handleClick(span);
});
```

---

## 8. 最佳实践

### 8.1 监听器管理

```js
// 使用 AbortController 管理监听器生命周期
class Component {
  constructor() {
    this.controller = new AbortController();
  }
  
  mount() {
    this.el.addEventListener('click', this.handleClick, {
      signal: this.controller.signal
    });
  }
  
  unmount() {
    this.controller.abort(); // 移除所有通过此 controller 注册的监听器
  }
}
```

### 8.2 性能优化

```js
// 1. 优先使用 passive 提升滚动性能
element.addEventListener('touchstart', handler, { passive: true });

// 2. 动画使用 requestAnimationFrame
element.addEventListener('pointermove', e => {
  requestAnimationFrame(() => {
    updatePosition(e.clientX, e.clientY);
  });
});

// 3. 避免在事件处理中触发重排/重绘
element.addEventListener('click', () => {
  // ❌ 触发重排
  el.style.width = el.offsetWidth + 10 + 'px';
  
  // ✅ 批量读取后写入
  const width = el.offsetWidth; // 读取
  el.style.width = width + 10 + 'px'; // 写入
});

// 4. 事件委托减少监听器数量
// 用一个监听器代替数百个子元素监听器
```

### 8.3 无障碍事件

```js
// 确保键盘操作触发相同逻辑
element.addEventListener('click', handleActivate);
element.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleActivate();
  }
});

// 使用 role 属性确保语义正确
```

---

## 参考资料

- [W3C UI Events 规范](https://www.w3.org/TR/uievents/)
- [MDN Event 接口文档](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [MDN 事件参考](https://developer.mozilla.org/en-US/docs/Web/Events)
- [MDN addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [HTML Spec: DOM Events](https://html.spec.whatwg.org/multipage/indices.html#events)
- [JavaScript 事件循环](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [WICG 事件委托规范讨论](https://github.com/WICG/ui-event-performance)
