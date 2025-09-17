# event 对象

## 事件的触发方式
1. 用户操作触发例如点击,键盘输入等
2. DOM 接口触发例如 `HTMLElement.click` 触发点击
3. 采用 `EventTarget.dispatchEvent` 方法触发事件

## 典型的事件类型
详见 [interface event](https://developer.mozilla.org/en-US/docs/Web/API/Event#Introduction)

## 核心方法

* **preventDefault** 阻止事件默认行为,不影响事件的分发
  * 利用 `defaultPrevented` 判断元素是否阻止了默认行为
* **stopImmediatePropagation** 取消当前元素后续绑定事件和将要执行的分发事件
* **stopPropagation** 只阻止将要分发的事件