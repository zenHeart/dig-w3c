# Number

**详细讲解 number 类型的使用**

----

## 概述

## 基础知识

## Number 构造器

## Number.prototype 原型


## 其他知识
### 原始封装类型的方法调用
参看如下代码:

```js
12.3333.toFixed(2) // 合法
12..toFixed(2) // 合法
2 .toString(); // 合法
(2).toString(); // 合法
12.toFixed(2) //非法
```

一般在原始类型上调用方法时,引擎解析为原始类型的成员调用会创建临时对象进行方法调用。

在数值类型中由于 `.` 号表示浮点,则当只出现一个点号时会由于优先解析浮点类型导致语法错误,无法正确执行。正是因为此原因才会出现上述示例效果。

> 重点是先正确解析数字,在触发成员调用即可

参考 [js 对象](https://bonsaiden.github.io/JavaScript-Garden/zh/#object)