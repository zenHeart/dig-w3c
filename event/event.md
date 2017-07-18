---
title: event    
tags: event      
birth: 2017-06-05      
modified: 2017-06-05      
---

event
===
**前言:详解 js 事件体系**

---


## 事件基础


#  [event 对象](https://developer.mozilla.org/en-US/docs/Web/API/Event)
## 创建一个 event 对象

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

[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

# 参考资料

[mdn 所有 event 汇总](https://developer.mozilla.org/en-US/docs/Web/Events)
[mdn 自定义事件描述](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)