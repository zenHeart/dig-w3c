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

