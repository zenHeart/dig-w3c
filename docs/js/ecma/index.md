---
title: ecma262    
tags: node js ecmascript      
birth: 2017-09-12      
modified: 2017-09-12      
---

ecma262
===
**前言:记录阅读 ecma 的笔记**

---

## overview
ecmascript 一切皆对象.
所有值分为如下类型.
* 原始类型,基于内建的类型
    * undefined
    * null
    * boolean
    * number
    * string
    * symbol
* object
    * 基础对象 Object,Function,Boolean,Symbol,Error 对象
      **特别是函数,是具有执行权限的对象**
    * 数字操作,Math,Number,Date
    * 文本处理 String,RegExp
    * 集合器 Array,Map,Set,Json,ArrayBuffer,ShareArrayBuffer,DataView
    * 流程控制 Promise,Proxy,Reflect
    
> 来自 [ecmascript overview](https://tc39.github.io/ecma262/#sec-ecmascript-overview)


### 对象   
* `prototype` 是构造函数属性,作为对象初始化时原型链的初始值
* 类语言,对象存储状态,类存储方法.js 状态和方法均由对象持有,利用对象实现共享

### 关键术语
* `prototype` 实现继承和属性共享
    
    > 默认创建对象基于构造函数`prototype`属性实现继承
    > 也可利用 `Object.create` 显示申明继承
* `string` 16 位 utf-16 编码
* `Number` 64 位 ieee 754-2008 编码
* `Symbol` 可以理解为 hash 值

### 文档结构
* 1-4 介绍性章节
* 5 文档的注释规范
* 6-9 ecmascript 代码的执行环境
* 10-16 语言所有特性的语义解析和执行词法
* 17-26 定义 emacscript 的标准库

## ECMASCript 语言特性
* 基础类型
    * `UNDEIFNED` 初始化了空间,但未进行复制操作
    * `null` 类似空指针
    * `boolean` 
    * [ ] > 底层实现是位变量还是字节需考证?
    * `string` utf-16 编码的字符串.
    * `symbol` 内部生成的一个索引 hash
    > [] > 估计是一个自增整形变量
    * `number` ieee-754-2008 标准,存储均为 64 位
* 引用类型
    * Object 一系列基础和引用类型的属性集合.
      属性包括
        * 数据属性,利用空间进行值存储
            * `value`,存储引用地址和原始类型的值
            * `writable` 写属性,布尔值
            * `enumerabe` 枚举属性,布尔值
            * `configurable` 配置属性,布尔值
        * 访问器属性,利用函数进行值存取?
            * `get` 获取器,
            * `set` 设置器,
            * `enumerable` 枚举属性,
            * `configurable` 配置属性,
        > 访问器属性存在的意义?
    * 属性控制,引擎内部提供一系列内部方法用于对象属性控制
    详见 [pdf 6.2.1](ecmas8.pdf)
    * 内部对象,详见 [pdf 6.1.7.4](ecmas8.pdf)

## 执行代码和执行环境
### 词法环境
符合 js 语义的 js 代码块结构极为词法环境.
用来确定变量和函数的作用范围,词法环境包括

* 全局环境
* 模块环境,利用 module 语法申明
* 函数环境,利用函数语言进行申明
* 

### 环境记录
记录变量所绑定的词法环境和作用域.
原始的环境记录值包括:
* `申明环境记录` 利用申明语义定义的环境,例如变量申明,
函数申明,`try,catch` 结构等.
* `对象环境记录` 绑定在对象上的属性标识.

实际上所有的环境记录继承自 `申明环境记录` 这个抽象类.
详见 [8.1.1-table14](ecmas8.pdf)



## [数据类型和值](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) 

## 7.1 抽象操作
### 7.2 测试比较操作
#### 7.2.14 抽象相等比较
1. x == y ,类型相同直接调用严格比较
2. null == undefined 返回 true
3.  