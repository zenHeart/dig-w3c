---
title:closure    
tag:closure      
birth:2017-03-03      
modified:2017-03-03      
---

closure
===
**前言:透彻讲解 js 闭包原理**

---

## 词法作用域
1. 变量的取值取决于当前的词法环境,而非运行环境
2. 词法环境在函数执行时创建,而非申明时



## 闭包函数和普通函数区别
1. 闭包指针返回了内部变量的调用栈

在函数内部有 [[calle]] 属性中有 [[scopes]] 用来表示闭包的作用域。


## 参考

[闭包](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)

[学习闭包](https://commons.lbl.gov/display/~jwelcher@lbl.gov/Making+Caps+Lock+a+Control+Key)

[升入  es 系列](http://dmitrysoshnikov.com/)

[函数变元问题](https://en.wikipedia.org/wiki/Funarg_problem)

[变量,作用域,闭包](http://rednaxelafx.iteye.com/blog/184199)

[scope](https://en.m.wikipedia.org/wiki/Scope_(computer_science)#Dynamic_scoping)
