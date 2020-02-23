# Symbol

**详解 symbol 的使用场景**

----


## 内置符号


### Symbol.iterator
用于修改对象和数组的默认 `[...]`  和 `for of` 下的迭代行为。

<!-- TODO: 为什么对 {...} 无效 -->


### Symbol.toStringTag
修改 toString 默认行为

### Symbol.hasInstance
修改 instance 默认行为。
<!-- TODO: 为何采用构造函数模式无效需研究 -->

## 使用场景
### 作为私有变量
