[draggable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable) 实现拖曳操作

<!-- ## [basic](./basic.html) -->

<!-- ## [use-drag](./use-drag.html) -->

使用拖曳步骤

1. 在 `ondragstart` 返回的事件对象中,调用 [DataTransfer.setData](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData) 方法设置拖曳数据
2. 在被拖入对象中阻止 `ondragover` 事件
3. 在被拖曳对象中设置 `ondrop` 句柄,采用 [DataTransfer.getData](file:///Users/lockepc/code/github/dig-w3c/html/attributes/draggable/use-drag.html) 获取拖曳数据.
4. 处理拖曳信息

拖曳重点

1. 理解 [DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) 对象

## todo

* [ ] 如何获取拖曳选择对象?

## 参考资料

* [使用拖曳](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations)
