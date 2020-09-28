# 模板字符串

**详解模板字符串语法**

---

## 概述
模板字符串用于动态生成字符串,相比加号更简洁。

语法如下:
```js
// 定义字符串
var str = `string text`;
// 多行文本,注意多行之间的空格换行均会保留
var str1 = `string line 1
			string line 2`;

//包含表达式的字符串
var str2 = `string text ${(1+3.452).toFixed(2)}`;
```

模板字符串中可以嵌套多个表达式。

## 标签模板字符串
参看 [标签模板](./tag-template.js)
标签模板的语法结构如下:

```
<expression>`<template>`
```

* `expression` 表达式需要返回一个函数,其中该函数会接收如下参数
  * `arguments[0]` 模板字符串数组,分隔点为模板字符串的表达式
	> 注意模板字符串第一个参数即使分隔表达式没有内容也会一空字符占据元素位置
 * `arguments[1]` 模板字符串中第一个表达式的值
 * ...
* `template` 模板字符串

基于上述原理参看此示例
```js
(function showStr(){
	let res = [].slice.call(arguments).flat().filter((ele)=>ele).join(' ');
	console.log(arguments);
	return res;
})`count${1}${2}`
```
该示例会将模板中表达式结果按照空格隔开后显示。


## 知识点
1. 注意 `${var}` 时，undefined 和 null 会被转换为字符串