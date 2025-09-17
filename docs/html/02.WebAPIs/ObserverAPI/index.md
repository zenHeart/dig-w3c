# Observer API

## Observer 概述

1. observer 是微任务
2. observer 是弱引用

```js
function callback(event) {
  console.log(event)
}
// 1. 申明一个观察者绑定回调
const observer = new Observer(callback)

// 2. dom 节点绑定对应的 observer
observer.observe(node)
observer.observe(node1)

// 3. 节点会在触发相应场景后，调用回调

// 4. 取消对某个节点的 observe
observer.unobserve(node)
// 5. 取消对所有节点的观察
observer.disconnect()

// 6. 获取所有还未处理的监听事件，该行为会清空
// observer 的处理内容，需要手动消费
// 在调用 disconnect 时可以通过此方法，来清空处理
observer.takeRecords()

```

## ResizeObserver


1. `observe(dom, { box: 'border-box'} )` 控制监听的尺寸变化类型
   1. box 配置修改监听策略
      1. `content-box` 内容和尺寸变化才会触发，border 变化不会触发，除非修改了 box-sizing 策略为 `border-box`
      2. `border-box` border 变化也会触发变更
      3. `device-pixel-content-box` 设备分辨率变化或者内容尺寸变化会触发此逻辑



