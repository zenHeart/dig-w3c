# Proxy

**详解 js 代理对象使用**

---

## 概述
代理用来封装普通对象,隔绝对普通对象的直接操作,通过特定的注入陷阱函数(trap),将对普通对象的操作加工后在转发。

学习代理的重点是理解 es6 对哪些底层操作暴露了陷阱函数,及如何使用这些陷阱函数

## 基本使用
1. 创建目标对象
2. 创建代理对象
   1. 设定目标对象
   2. 配置陷阱函数
3. 使用代理对象

参看示例 [proxy constructor](./1.proxy-constructor.js)

注意如下问题
1. 实例化的 proxy ,需要设置陷阱函数才有价值
2. 对代理对象的操作才会触发陷阱函数

典型的代理函数如下

代理陷阱|被重写的行为|默认反射
:---|:---|:---|
get|读取一个属性的值|Reflect.get()
set|写入一个属性的值|Reflect.set()
has|in 运算符|Reflect.has()
deleteProperty|delete 运算符|Reflect.deleteProperty
getPrototypeOf|Object.getPrototypeOf()|Reflect.getPrototypeOf
setPrototypeOf|Object.setPrototypeOf()|Reflect.setPrototypeOf
isExtensible|Object.isExtensible()|Reflect.isExtensible
preventExtensions|Object.preventExtensions()|Reflect.preventExtensions
getOwnPropertyDescriptor|Object.getOwnPropertyDescriptor|Reflect.getOwnPropertyDescriptor
defineProperty|Object.defineProperty()|Reflect.defineProperty
ownKeys|Object.keys,Object.getOwnPropertyNames(),Object.getOwnPropertySymbols()|Reflet.wonKeys()
apply|调用一个函数|Reflect.apply()
construct|使用 new 调用一个函数|Reflect.construct()


## 常用代理汇总


## 知识点
1. 采用 Proxy 定义代理对象