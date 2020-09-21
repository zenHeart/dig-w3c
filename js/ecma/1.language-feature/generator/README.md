# generator

## 解决了什么问题？
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
1. 生成器构造函数
2. 生成器对象 [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator), [GeneratorFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction)
   
   ```js
   // 1. 函数关键字后加 * 号申名生成器函数
   function* a() {
     // 2. yield 用在值和表达式之前，申名迭代位置
     yield 1

   }
   ```

   1. 利用 throw 抛出错误
   2. next 支持传值
   3. next 为惰性求值
3. 代理生成器，可采用 `yield *` 定义代理迭代器  
4. 使用场景, 迭代器改变了数据和值的消费模式，消费者可以依据值的生产速度消费结果
   1. 任务调度，函数暂停的协程功能，详见 [迭代器调度](https://javascript-concurrency.gitbook.io/javascript-concurrency/04.-di-si-zhang-shi-yong-generators-shi-xian-duo-xing-ji-suan)
   2. 无限状态机
5.  es6 迭代器如何转为 es5，详见 [regenerator](https://facebook.github.io/regenerator/)

## 参考迭代器规范
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)

## 参考资料
* [ES6 Generators: Complete Series](https://davidwalsh.name/concurrent-generators)