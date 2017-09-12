---
title:object    
tag:object      
birth:2016-12-21      
modified:2016-12-21      
---

object
===
**前言:讲解 js 的对象**

---


# 概述

在使用 js 引擎时，引擎内部会存在初始化对象，
这些对象叫做内建对象。作用如下。
1. 利用内建对象创建自定义对象。
2. 通过内建对象暴露了相关方法。

核心的内建对象如下，级别和顺序标识了对象的重要程度。

* 一级
    * Object
    * Function
    * Array
    * RegExp
    * String
    * Number
    * Boolean
    * Symbol
    * Math
    * Date
    * Promise
    
* 二级   
    * arguments
    * Error
    * EvalError
    * InrernalError
    * RangeError
    * ReferencError
    * SyntaxError
    * TypeError
    * <span style="color:red">URIError</span>
    

## 对象学习描述
1. 先理解核心对象，理解核心对象的方法。
2. 按照日常行为中常用的模式，来决定 API 的重要程度。
3. 难于理解的 API 需重点关注。不常用的 API 有简单的例子即可。

资料整理方式。
1. 功能及适用范围，注意关心 API 使用条件
2. 输入输出参数
3. 应用场景举例