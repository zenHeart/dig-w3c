# iterator

## 迭代器解决了什么问题？
1. 简化多层 for 循环引用(出自理解 es6 第八章)

## 迭代器(iterator)是什么
1. 迭代器具有 next 方法的特殊对象 
2. 特殊对象调用 next 方法会返回一个结果对象
3. 结果对象包含 `value,done` 两个属性
   1. value 代表特殊对象的迭代值
   2. done 表示特殊对象是否迭代完成
4. 当特殊对象调用 next 到最后一个值后，继续调用 next,返回的结果对象为
   1. value 是 next 函数默认的 return 值
   2. done 为 true


基于上述规则可实现一个迭代器函数，将数组转换为迭代器。

## 生成器(generator)
es6 提供生成器语法避免手动创建迭代器的复杂性。

```js
// 1. 在函数关键字后加上 * 申名函数为迭代器
function * iteratorDemo() {
    // 2. 采用 yield 语法申名每次 next 返回的内容
    yield 1
    yield 2
}
```

1. `*`， function 关键字后的星号指明为迭代器函数
2. `yield`， 函数体中的 `yield` 关键字指明每个 next 的返回内容

<!-- TODO: yield 是如何停止执行的 -->

### yield
yield 关键字可用于，值和表达式之前。可以在语句内部使用该关键字。
采用迭代器语法，修改数组转换为迭代启动方法。

```js
function * iteratorArr(arr) {
    for(let i =0;i++;i< arr.length) {
        yield arr[i]
    } 
}
```

注意 yield 的所属的函数体必须为生成器函数，无法用于其他函数体内部。


由于生成器是一个函数，可采用函数表达式声明生成器，也可在
对象内部，采用简写模式直接申名。

```js
// 函数表达式创建生成器
const iteratorArr = function * iteratorArr(arr) {
    for(let i =0;i++;i< arr.length) {
        yield arr[i]
    } 
}

// 对象内部采用简写申名生成器
let obj = {
    // 生成器
    *iterator {

    }
}
```

> 注意箭头函数不支持生成器语法

<!-- TODO: 生成器在引擎内部如何表征 -->


## 知识点
1. 迭代器概述，循环集合时需要额外参数记录循环位置的问题，同时提供了暂停执行能力，提供了程序控制的更多可能性
2. [迭代器协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)
   1. 利用 next 触发迭代，返回结果为 `value,done` 的对象
3. [可迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)，可采用 `for of ` 循环结果，同时支持对象扩展语法
   1. `Symbol.iterator` 内建属性定义迭代器，可采用 `Symbol.iterator` 判断是否可迭代
   2. 内建的可迭代对象 `array,set,map,string` 支持迭代器
      1. 字符串按照字符而非码元返回值
      2. 数组，set 返回 value
      3. 数组 `for in` 循环会迭代所有属性，而 keys 只返回数值索引
      4. Map  `for, of ` 返回 value 为 [key,value]
      5. nodeList 为可迭代对象
   3. 返回可迭代对象的内建函数
      1. `entries` 迭代器返回的 value 为 [key,value] 索引
         1. 对于 Set 集合 key 值就是 value
      2. `values` 迭代器返回 value 为值的迭代器
      3.  `keys` 迭代器返回 value 为键的迭代器，对于 set 键为值
4. `for await (for of)` 异步迭代，可采用 `Symbol.asyncIterator` 迭代 
5. iterator 可使用 `...`