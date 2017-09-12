---
title:variable    
tag:variable      
creat:2016-10-20      
modified:2016-10-20      
---

variable
===
**前言:讲解 JS 的变量特点**

---

# 概述
js 语言运行在 js 的解析引擎，对于 node 和 chrome js 的解析引擎
都为 V8。该解释器是利用 c 和 c++ 实现的。由于 js 时动态脚本语言。
所以在使用时要理解引擎的执行环境。这里可以将 js 的变量种类分为 3 种。
1. 自定义变量
包括所有自定义的脚本
2. 内置变量
这是基于 Ecmascript 的规则，引擎内部实现的全局对象，例如 Object,Date,Array,String.
这些变量可以直接使用
3. 宿主变量
这一类变量是指，使用 js 的解析器执行环境定义的变量。这里 js 
的执行环境我们也称为宿主。例如浏览器的宿主变量包括 windows ，DOM,微信内置的 Wx 等都是如此，
而对于node 内部有 process 的进程变量。

弄清楚变量种类的意义在于，如果 js 运行在不同的环境，就知道那些方法是与环境无关那些是依赖与宿主的。
例如同样的脚本运行在浏览器和 node 上时，String 是引擎内置对象所以两个环境都含有，但
DOM 对象和 process 对象是和宿主有关的。

## 变量的作用域
js 的变量运行在 js 解析引擎上，所以当脚本执行时最大作用域就是该进程的范围。
这里的全局变量就是如此，在申明 js 变量时，若不带有 `var` 申明符，则变量的作用
范围就是全局作用域。这一点要格外注意，例子如下：
```js
function simulateBtnClick(btnId, times, interval) {
   var myElement = document.getElementById(btnId);
   /*
   * 初始代码为 
   * var  countTime = 1;
   * 修改后代码
   * var  countTime = 1,intervalTimer = null;
   */   
   var  countTime = 1,intervalTimer = null;
  
   intervalTimer = setInterval(function() {
       angular.element(myElement).triggerHandler('click');
       if (countTime++ >=  times) {
           clearInterval(intervalTimer);
       }
   }, interval);
}; 
```
由于在开始没有将定时器的值赋值为局部变量，导致该函数如若调用两次，
后一个定时器不会再执行相应次数后删除，因为`intervalTimer`为全局变量。
