
---
title:erro    
tag:erro      
birth:2017-01-12      
modified:2017-01-12      
---

error
===
**前言:讲解错误类**

---

## node 错误类型

* js 标准错误类型
    * EvalError 解析 eval() 语句失败
    * SyntaxError 语法解析错误
    * RangeError 值范围错误
    * ReferenceError 左值引用错误
    * TypeError 右值赋值错误
    * URIError 全局 URI 处理错误
* 系统错误
    * 有底层触发
* 用户自定义错误
    * 用户触发
* 断言错误,js 引擎触发,使用 assert 时产生

所有错误都继承自 Error 类.


## 错误处理
**同步情况**

使用 throw 抛出错误.
当遇到 `try,catch` 结构是会接收到错误消息.
否则会立即终止进程.

**异步情况**

1. 作为异步回调的第一个参数传入
2. 作为 error 事件传入给监听对象
3. 任然使用 try,catch 捕获

在异步事件中,对于未捕获的的 `EventEmitter` error 事件.
会抛出 `uncaughtException` 的情况.
可以利用 `process.on('uncaughtException')` 捕获.



## 自定义 error

**error name**

注意必须把 name 放在,捕获栈前面定义.
否则捕获栈会使用默认的 `error` 来处理错误.

# 何时使用 错误
1. 和 php 类似当函数的输入来自外界时，需要利用抛出错误。
2. 对于可以确定输入的私有函数不要抛出错误。这样做会导致性能缺陷。


# 常见使用场景
1. 在使用框架是，错误的使用方式会使框架抛出异常来告知用户。

# 注意问题
不要在异步实践中使用 `try` `catch` 来进行异常的捕获。
捕获异常只能在同步代码中出现。使用一种正常的方式来描述出现的问题。




# 参考资料
[node error](https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_class_error)

[错误处理](https://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/)
