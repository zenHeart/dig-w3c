# 数组
**详解数组对象的重点**

---

## 概述
js 的数组实际上就是一个哈希表，由引擎内部实现了索引到元素之间的关联。
js 数组本质也是一个对象,只是会存在一些内置特性。


> 实际上你可以在数组中定义字符串索引,例如 `a = [];a['demo']=1`




## 数组定义
1. 使用数组字面量
2. 使用 Array 构造器
	* 传入一个参数只初始化了数组长度,若需要创建空间可通过  `new Array(length).fill(number).map( ele =>)` 的方式进行创建
	* 传入多个参数则为,各参数作为数组的初始值

js 支持多维数组，引用和 C 相似,数组中的成员可以为不同类型。


## 数组构造器
Array 构造器函数上包含如下方法和属性

* **方法**
	* **Array.isArray** 判断对象是否是数组类型
	* **Array.of** 创建新数组


## 数组原型
数组原型上包含一系列方法和属性概括如下,
按照重要程度和类型分类如下:

* 属性
  * **length** 数组长度
  * **Symbol.iterator** 改变数组 for of 特性
* 方法
  * 创建操作
	* **array.concat** 连接返回新数组
    * **array.fill** 将数组元素填充为某值
	* **array.filter** 创建一个满足测试函数条件的元素集组成的新数组
	* **array.map** 对每个元素执行回调函数，返回处理返回值组成的新函数
	* **array.slice** 返回一个数组切片
    * **array.join** 连接数组元素为字符串
  * 修改操作
	* **array.splice** 实现,特定位置插入,删除,修改的功能
	* **array.pop** 出栈操作，在行末删除数组元素
    * **array.push** 入栈操作，在行末压入新元素
    * **array.shift** 出堆操作，在行首删除新元素
    * **array.unshift** 入堆操作，在行首添加新元素
	* **array.copyWithin** 将数组部分内容复制到另一位置
  * 查询操作
	* **array.every** 测试所有数组元素是否通过验证函数
	* **array.entries** 返回一个迭代器
	* **array.some** 验证部分元素通过测试回调
	* **array.find** 返回满足回调函数条件的第一个元素
	* **array.findIndex** 返回满足回调函数条件的第一个元素索引值
	* **array.forEach** 对每个元素执行回调函数
	* **array.includes** 验证数组中是否包含某元素
    * **array.indexOf** 返回查找元素出现的第一个索引位置
    * **array.lastIndexOf** 返回查找元素出现的的最后一个索引位置
  * 排序操作
    * **array.sort** 对数组元素进行排序
    * **array.reverse** 翻转数组

> 一些方法可能用于多个方面,分类原则基于它经常使用的场景。
> 例如 fill 可以用于修改整个数组元素,但我们多在创建数组时使用它所以归类为创建操作


重点属性的介绍如下:

### length
实例化数组的 `length =  Max(index)+1` index 表示最大的数组索引值(必须为数值)
由于 length 长度是可写的，所以可以同过修改 length 的长度来对数组实现截断。
参看示例 [数组截断](./array.property.test.js#15)


## 构造器方法
### Array.isArray

> **作用**

判断对象类型是否为元素

> **说明**

* 语法
    
    `Array.isArray(obj)`

* 参数
    * obj 验证函数

* 返回值
    * 真为 Array 对象的实例，其他为假


> **注意**
  
[数组类型判断](http://web.mit.edu/jwalden/www/isArray.html)
  
> **举例**
    
```js
    // all following calls return true
    Array.isArray([]);
    Array.isArray([1]);
    Array.isArray(new Array());
    // Little known fact: Array.prototype itself is an array:
    Array.isArray(Array.prototype); 
    
    // all following calls return false
    Array.isArray();
    Array.isArray({});
    Array.isArray(null);
    Array.isArray(undefined);
    Array.isArray(17);
    Array.isArray('Array');
    Array.isArray(true);
    Array.isArray(false);
    Array.isArray({ __proto__: Array.prototype });
```

### Array.of

> **作用**

创建新数组对象实例

> **说明**

* 语法
    
    `Array.of(element0[, element1[, ...[, elementN]]])`

* 参数
    * elementN
      创建一个的元素

* 返回值
    * 返回新创建的数组

> **注意**

Array(n) 表示创建元素个数为 n 的一维数组。
而 Array.of(n) 创建只含有一个元素 n 的一维数组，和 `[n]` 类似。

> **举例**
    
```js
    Array.of(1);         // [1]
    Array.of(1, 2, 3);   // [1, 2, 3]
    Array.of(undefined); // [undefined]
````

### Array.splice

> **作用**

在数组中删除或添加新元素

> **说明**

* 语法
    
    `array.splice(strat)`
    
    `array.splice(start,deleteCount)`
    
    `array.splice(start,deleteCount,item1,itme2,...)`

* 参数
    * start
        返回删除的启始位置,从 0 开始
    * deleteCount
        删除的元素各数
    * item1,item2,...
        要添加进数组的元素

* 返回值
    * 有被删除的元素组成返回值,若没有则为空数组
    
> **举例**
    
```js
var a = [1,2,3,4];

//删除第一个元素
a.splice(1,1); // return [2],a 变为 [1,3,4]

//删除倒数第二个元素
//若所用超过范围则默认为 0
a.splice(-2,1);

//删除元素 3
//注意该使用若元素不存在会误删除最后一个元素
a.splice(a.indexOf(3),1);

```





## 其他方法

其他方法|作用|
:---|---|
array.entries|将数组转换为迭代器|
array.from|以后学习|
array.keys|以后学习|
array.reduce|以后学习|
array.reduceRight|以后学习|



## 其他方法举例

> array.entries

```js
   let chargerNumber = ['a', 'b', 'c'];
   //该方法将每个元素分别保存为包含键名和键值的一维数组
   let eArr = chargerNumber.entries();
   
   for (let e of eArr) {
     console.log(e);
   } 
```

    
    
    
# 不同平台的区别
在安卓机型下发现不支持
`array.includes`的函数。

# 空值判断问题 
由于 js 里一切皆对象，所以在进行判断是极度容易出错。
对于值为空的判断尤为关键。举例如下：
```js
   chargerNumber = [];
   str = '';
   obj = {};
   console.log('\narr is empty:' + !chargerNumber +
   '\nstr is empty:' + !str +
   '\nobj is empty:' + !obj); 
   
   //return
   // chargerNumber is empty:false
   // str is empty:true
   // obj is empty:false
```
可以看到对于数组和对象结果均为假，实际上由于 js 引擎处理的变量均可看做对象.
所以在判断是不可采用`!`这种方式。需直接和 null 比较来判断结果。
```js
   chargerNumber = [];
   str = '';
   obj = {};
   console.log('\narr is empty:' + chargerNumber==null +
   '\nstr is empty:' + str==null +
   '\nobj is empty:' + obj==null); 
   
   //return
   // chargerNumber is empty:false
   // str is empty:true
   // obj is empty:false
```