---
title:basis_syntax    
tag:basis_syntax      
birth:2016-12-05      
modified:2016-12-05      
---

basis_syntax
===
**前言:讲解 js 该注意的基本语法层面的差别**

---


# 操作符
## `==` 和 `===`
注意这两种符号的差别。
前者会在比较是进行类型转换。
具体的转换规则如下:
[抽象比较和严格比较](https://tc39.github.io/ecma262/#sec-abstract-equality-comparison)
[连等赋值](http://www.tuicool.com/articles/vUFbeu)

讲解 js 不熟悉的语法特性
===

# 未知语法
## Object keys

利用该方法获取键名.

```js
let person = {name:"test",age:12,friends:{tom:{age:14}}};

//注意只能取出第一层的键名
//[ 'name', 'age', 'friends' ]
console.log(Object.keys(person));
```


## 箭头函数

常见函数定义如下:

```js
function demo(agr1,arg2) {}
```

箭头函数省略了 function 申明.使用

```js
(agr1,arg2) => {} 
```

格式定义匿名函数.

**箭头函数不能用来定义构造函数,可以用来作为回调函数或者常用表达式的缩写形式**

例如:

```js
//箭头函数作为异步回调 
asyncFunc((arg1,arg2)=>{});

//用来缩写表达式
let plus_2 = a => a+2;
let a = 2;

console.log(plus_2(a)); // 4
```


更详细的箭头函数参见 [箭头函数说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)


## 解构赋值

解构赋值作用于赋值操作的左值.
用来提取右值结果.举例如下.

```js
// 定义三个一维数组
let [a,b,c] = [[1,2,3],[2,3,4],[3,5,6]];

console.log(a); //[1,2,3]
console.log(b); //[2,3,4]
console.log(c); //[3,5,6]

//提取对象属性
//注意表达式左边的格式
//{提取属性名:新的变量名} 且新变量名不能和属性名重复

let person = {name:"test",age:12};
let {name:personName,age:personAge} = person;

console.log(personName); //test
console.log(personAge); //12

//复杂对象解构
//复杂的对象解构
let metadata = {
    title: "Scratchpad",
    translations: [
       {
        locale: "de",
        localization_tags: [ ],
        last_edit: "2014-04-14T08:43:37",
        url: "/de/docs/Tools/Scratchpad",
        title: "JavaScript-Umgebung"
       }
    ],
    url: "/en-US/docs/Tools/Scratchpad"
};

let { title: englishTitle, translations: [{ title: localeTitle }] } = metadata;

console.log(englishTitle); // "Scratchpad"
console.log(localeTitle);  // "JavaScript-Umgebung"
```

解构技术的常见应用.

1. 变量值互换

```js
// 利用解构实现变量互换, xor 技术
let [a,b] = [1,2];
[a,b] = [b,a]; 
```

2. 提取结果信息

```js
//提取正则结果
let url = "https://developer.mozilla.org/en-US/Web/JavaScript";

let parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
let [, protocol,fullHost, fullPath] = parsedURL;

console.log(protocol); // "https:" 
console.log(fullHost); // "developer.mozilla.org"
console.log(fullPath); // "en-US/Web/JavaScript"

//提取对象属性
let person = {name:"test",age:12};
let {age,name} = person;

console.log(name); //test
console.log(age); //12

//在加载模块中提取子集
//提取子进程模块中的 spawn 方法
const { spawn } = require('child_process');
```

更详细的结构用法参见:
[mdn 解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)







## >>>
无符号的向右移动。[>>> 符号讲解](https://tc39.github.io/ecma262/#sec-unsigned-right-shift-operator)


## 模板字符串

[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)

```js
// ${expression} 中的内容会被自动解析
// 注意该符号不是单引号而是反引号
console.log(`${ 3 + 4}`);   //return value 7 

// 该模式也可解析函数
console.log(`${JSON.stringify({demo:[1,2,3]})}`);
```


## break 和 continue

break 终止一层循环。
continue 终止本次循环执行。

```js
for(var i = 0;i<6;i++) {
for(var j = 0;j<6;j++) {
    if(j === 3)
        break;
}
}
console.log(`break 中断一层循环 i: ${i},j: ${j}`);

for(i = 0;i<6;i++) {
    for(j = 0;j<6;j++) {
        if(j === 3) {

            continue;
            console.log('can\'t execute');
        }
    }
}
console.log(`continue 中断一次循环 i: ${i},j: ${j}`);

```

## 惰性求值,穿透赋值

当使用或逻辑时,会将结果非假的值赋给左边

```js
var a = false || 1; // a = 1
```

利用该特性给不确定对象赋值.

```js
//防止直接判断 obj1.test 出现引用错误
if(obj1 || obj1.test)
    {
        var a = obj1.test; 
    }
```

**注意对于默认取值为 0 会形成覆盖**

```js
var number = 0; 
//导致原本初始值被后续值取代
var result = number || 10;
```
## 数组形式引用字符串

```js
var  a = 'test'; 

console.log(a[0]); //'t'
```

## 函数重写

用在浏览器嗅探.

```js
function demo() {
    console.log('demo');
    
    demo = function() {
        console.log('hello');
      
    }
  
} 
```

## 嵌套函数

```js
function  demo() {
    var a  = 'demo';
    console.log(a);
    console.log(b);
    function hello() {
        var b = 'hello';
        console.log('a');
        console.log('b');
      
    }
} 
```

内层函数可以访问外层作用域

## 闭包

```js
function  demo() {
    var a  = 'demo';
    console.log(a);
    return function(b) {
        a = b;
        console.log(a);
    }
}

var changeA = demo();
changeA(2);
```

基于嵌套函数的特性.
当函数内部

## 扩展操作
利用  `...var_name` 的结构来展开数组.
使用如下.

1. 函数赋值

```js
function add(a,b,c) {
    return a+b+c;
} 
var a = [1,2,3];
console.log(add(...a)); //6
```

2. 用在数组复制

```js
var a = [1,2,3]; 
var b = [1,2,...a,3,4];

console.log(b);//[1,2,1,2,3,3,4]
```

3. 用在对象复制

```js
var a1 = {a:1,b:2}; 
var a2 = {a:1,b1:2};

var a3 = {...a1,...a2};

//return {a:1,b:1,b1:2}
console.log(a3);
```
[expand operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)


## 理解 let 和 var

[let 和 var](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## 逗号
* [尾后逗号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Trailing_commas)


## 结合性和优先级
* [ ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Associativity)
<!--TODO: 补充结合性和优先级的示例  -->


## instanceOf
1. 判断构造函数的 `prototype` 属性是否存在一个对象的原型链上。
由于 `prototype` 和 `__proto__` 均可动态修改，无法利用此方法判断对象是否继承自某构造器
2. 不同执行环境不共享原型，例如 iframe 之间的内建对象是隔离的