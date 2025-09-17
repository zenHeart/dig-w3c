# 对象

## 概述
js 对象是一个键值对系统。
对象有一系列属性组成,属性既可以是原始值也可以是函数。
属性可分为如下两类

* **自有属性** 对象上直接定义的属性
* **继承属性** 来自原型链上的属性

js 生态下的对象可分为三类:

* **内建对象** 有 ECMAScript 定义的对象
* **宿主对象** 有 js 运行环境定义的对象
* **自定义对象** 由用户定义的对象

按照重要使用频率,重要程度如下
* 重要
    * Object
    * Array
    * String
    * Promise
    * Number
    * Function
    * RegExp
    * Boolean
    * Symbol
    * Math
    * Date
    
* 需知道
    * **arguments**
    * ***Error**
      * EvalError
      * InrernalError
      * RangeError
      * ReferencError
      * SyntaxError
      * TypeError
      * URIError
    

## 如何学习对象
按照学习程度分为把对象 API 理解程度分为三层

1. **字面理解** 知道核心对象的核心方法,知道各方法出参,入参含义
2. **熟练应用** 知晓核心对象及方法的使用模式及典型应用场景
3. **深入解读** 知晓核心对象及方法的使用局限及适用范围,能够合理改造

