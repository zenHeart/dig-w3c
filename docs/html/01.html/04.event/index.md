# event

**前言:详解 dom 3 规范下的事件模型**

---

## 概述

所有讲述参考 [UI EVENT](https://www.w3.org/TR/DOM-Level-3-Events/#dom-event-architecture)

## [Event syntax](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)

### 创建一个 event 对象

```js
//1. 创建事件对象,确定绑定元素
var event = new Event('test',{detail:'custom_event'});
var ele = document.querySelector('#create_event');

//2. 绑定事件监听
ele.addEventListener('test',function (e) {
    console.log('receive event type is: ',e.detail);
});

//3. 触发事件
ele.dispatchEvent(event);
```

可以看出自定义事件的步骤如下.

1. 创建事件,确定事件绑定元素
2. 绑定监听事件
3. 触发事件

若期望模拟点击事件则如下.

```js
var custom_click = new MouseEvent('click',{
    'view':window,
    'bubbles':true,
    'cancelable':true
});
var ele = document.querySelector('#custom_click');

ele.addEventListener('click',function() {
    console.log('模拟触发点击事件!');  
});

ele.dispatchEvent(custom_click);

```

[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/DEVICE_API/CustomEvent)

## 困惑

* [ ] 阻止事件传递
* [ ] 上层事件对象的识别

## 调试事件

查看 [监控事件](https://developers.google.com/web/tools/chrome-devtools/console/events#monitor_events)

* **monitorEvents()** 监听元素上的所有事件

## 键盘事件

### 事件概述

类型分为三种

* **keydown** 任何键按下触发
* **keypress** 任何键按下触发，持续触发
* **keyup** 按键释放触发

## 参考资料

[mdn 所有 event 汇总](https://developer.mozilla.org/en-US/docs/Web/Events)
[mdn 自定义事件描述](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)

* [ ] [html event target 介绍](https://www.w3.org/TR/2015/REC-dom-20151119/#eventtarget)
* [ui 事件模型](https://www.w3.org/TR/uievents/#dom-event-architecture)
* [dom events 列表](https://developer.mozilla.org/en-US/docs/Web/Events)
* [event reference](https://developer.mozilla.org/en-US/docs/Web/Events#See_also)
* 看完 mdn events 介绍 <https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events>
