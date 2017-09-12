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

### 4.2.1 对象   
尽管 ECMAScript 包含 class 语法定义，但 ECMAScript 对象并不像 c++ 等语言是基于类的。   
相反对象有不同的方式被创建，包括字面量定义、构造器(创建一个对象时执行的初始化对象属性的代码)。
每一个构造器都是一个包含原型(`prototype`)属性的函数，用它来实现基于原型的继承和共享属性。   
对象的创建利用 new 来调用构造函数，如果不使用 new 关键字，结果取决于构造函数的特性。   
每一个由构造函数创建的对象都会隐式引用，其值等于构造函数的原型属性的值，此外每一个构造函数
同样也拥有一个可能指向它自己原型的隐式引用。这个隐式引用称为原型链。当这个引用指向一个原型对象时。
当引用的对象创建了一个属性，原型链中的第一个对象，也会包含这个属性。
换种说法，原型链首的对象若检查自身不包含该属性，会顺着原型链向下寻找。
<p style="color:red">
在基于类的面向对象编程中，属性是被实例持有的，方法由类和继承构造的方法持有。   
而在 ECMAScripipt ，属性和方法是由类持有，构造，属性，和方法全部都是继承。</p>
下面这张图解释了原型链的特性

![](../img/frontend_object1.png)

CF 是一个构造函数，同时是一个对象，cf1-cf5 是利用 CF 创建的对象，由于
构造函数的原型指针指向了 CFp,所以所有 CF 创建的对象就共享了 CFp 的属性，
CFP1，其中虚线代表隐式引用的原型链，实现代表显示属性。这里我们需要理解几个关键字。   
1. 构造器   
它是用来初始化和创建对象的函数对象   
2. 原型   
向其它的对象提供共享属性的对象  
3. 函数   
一个可被调用的代码片段，它也是对象
