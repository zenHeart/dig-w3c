# WeakSet

**详细讲解 WeakSet 对象**

----

## 概述
WeakSet 存储引用对象的集合

## 对象介绍
### 实例化
采用 `new WeakSet` 传入可用迭代器对象
* 注意只能实例化引用类型

### 属性
* `WeakSet.prototype` Set 的原型对象

### 方法
* `WeakSet.prototype.add()` 添加一个元素
    > 注意只能添加引用类型!!!
* `WeakSet.prototype.delete()` 删除一个元素
* `WeakSet.prototype.clear()` 清除元素集
* `WeakSet.prototype.has()` 判断元素是否存在

### 其他知识点
* WeakSet.prototype[Symbol.iterator] 是 **WeakSet.prototype.values** 的引用
  

## 适用场景
参看 [WeakSet 工具库](./utils/weakset.js)
重点特性如下:

* 弱引用避免内存泄漏

## 参考资料
* [mdn WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
* [何时使用 WeakSet](https://stackoverflow.com/questions/30556078/ecmascript-6-what-is-weakset-for)
* [es 关于 weakset 的讨论](https://mail.mozilla.org/pipermail/es-discuss/2015-June/043026.html)