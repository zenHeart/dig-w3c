# set

**详细讲解 set 对象**

----

## 概述

set 对象用于创建一个无重复的值集合

## 对象介绍

### 实例化

采用 `new Set` 传入可用迭代器对象,例如

* 数组 `new Set([1,2])`
* 字符串 `new Set(’demo‘)`
* set `new Set(new Set([1,2,new Set([1,2,3])]))`

### 属性

* `Set.prototype` Set 的原型对象
* `Set.prototype.size` 返回 set 对象的元素各数
    > 实际上这个是一个访问器属性,定义了 get 方法,通过 `forEach`,循环返回元素个数

### 方法

* `Set.prototype.add()` 添加一个元素
* `Set.prototype.delete()` 删除一个元素
* `Set.prototype.clear()` 清除元素集
* `Set.prototype.has()` 判断元素是否存在
    > 注意只用基础类型判断
* `Set.prototype.values()` 获取元素的值集合,返回一个迭代器
    > 注意和 Object.keys 区分！！！
* `Set.prototype.keys()` 该函数是为了和 Map 对应,时间上在规范里面 `keys` 和 `values` 是同一个函数
* `Set.prototype.entries()` 同上
    > 效果同 values 一样,但是由于 Set 不包含 key 所以返回的 value 值和键相同
* `Set.prototype.forEach()` 迭代循环数组
    > 1. **注意该方法 forEach 的 index 属性是元素值而非索引,因为 set 没有索引的概念,为了和 map 保持一致采用值作为索引!!!**,规范也是这么写的,详见 [tc39](https://tc39.github.io/ecma262/#sec-set.prototype.foreach)
    > 2. 第二参数可以传入 this,参见

<!-- [Sets 基本测试](../Map/Set.basic.test) -->

### 其他知识点

* Set[Symbol.species] 返回 **Set** 构造函数
* Set.prototype[Symbol.iterator] 是 **Set.prototype.values** 的引用
  
## 适用场景

<!-- 参看 [set 工具库](./utils/sets.js) -->
重点特性如下:

* 数组去重
* 集合操作

## 参考资料

* [mdn set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set/@@iterator)
* [tc39 set](https://tc39.github.io/ecma262/#sec-set-objects)
