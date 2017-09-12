数组
===
**前言:讲解原生的数组对象**

---

# 概述
js 数组中，元素可以为任意类型。
可以定义多维。实际上索引数组也是关联数组。
可以通过数字的字符串方式进行引用。

```js
   let indexArray = [0,1,2]; 
   
   //可以采用字符串进行引用
   console.log(indexArray['0']);  // result: 0
   console.log(indexArray[0]);     // result: 0
```

## 数组的定义
1. 使用数组字面量
```js
   let literalArrayInit = [1,2,3,4] ;

    console.log(literalArrayInit);
```
2. 使用 Array 构造器

构造器函数通常用来初始化固定长度的数组。
```js
    //定义二维数组
   let constructorArrayInit =  new Array([1,2],[3,4]);
    
    console.log(constructorArrayInit);
    
    //定义初始值为 1 长度为 40 的以为数组
    let initArr = new Array(40).fill(1);
    
```
js 支持多为数组，引用和 C 相似。
数组中的成员可以为不同类型。

```js
   let complexArray = [1,'test',{say:'hello'}]; 
   
    console.log(complexArray[2].say);
```

**js 数组要点**

js 的数组实际上就是一个哈希表，由引擎内部实现了索引到元素之间的关联。
在引用数组时只需关心如何引用变量。而不要放在该结构是如何存储的。



# 数组方法
实例化数组的常用属性

常用属性|作用|
:---|---|
length|长度 32 位无符号整形|

由于 length 长度是可写的，所以可以同过修改 length 的长度来对数组实现截断。

```js
   let testArr = new Array(60).fill(1); 
   const  SLIP_POINT = 50;
   
    if(testArr.length > SLIP_POINT) {
        testArr.length = SLIP_POINT;
    }
    
    console.log(testArr);
```


实例化了的数组对象，常用方法如下

实例化对象常用方法|作用|方法分类
:---|---|---|
array.concat|连接数组|
array.copyWithin|将数组部分内容复制到另一位置|
array.every|测试所有数组元素是否通过验证函数|
array.some|验证部分元素通过测试回调|
array.fill|将数组填充为某值|
array.filter|创建一个满足测试函数条件的元素集组成的新数组|
array.find|返回满足回调函数条件的第一个元素|
array.findIndex|返回满足回调函数条件的第一个元素索引值|
array.forEach|对每个元素执行回调函数，返回 undefined|
array.map|对每个元素执行回调函数，返回处理返回值组成的新函数|
array.includes|验证数组中是否包含某元素|
array.indexOf|返回查找元素出现的第一个索引位置|
array.lastIndexOf|返回查找元素出现的的最后一个索引位置|
array.join|连接数组元素为字符串|
array.pop|出栈操作，在行末删除数组元素|
array.push|入栈操作，在行末压入新元素|
array.shift|出堆操作，在行首删除新元素|
array.unshift|入堆操作，在行首添加新元素|
array.reverse|翻转数组|
array.sort|对数组元素进行排序|
array.slice|返回一个新的浅复制数组|
array.splice|删除特定项|



内建 Array 构造器提供的方法如下

内建构造器常用方法|作用|
:---|---|
Array.isArray|判断对象是否是数组类型|
Array.of|创建新数组|




## 常用方法详解

### array.concat

> **作用**

实现数组的连接。

> **说明**

* 语法
    
    `let new_array = old_array.concat(value1[,...[,valueN]])`

* 参数
    * valueN 需要添加的数据

* 返回值
    * 一个新的实例化数组
    
> **举例**
    
```js
   let alpha = ['a', 'b', 'c'],
       numeric = [1, 2, 3];
   
   let alphaNumeric = alpha.concat(numeric);
   
   console.log(alphaNumeric); // result: ['a', 'b', 'c', 1, 2, 3]  
```


### array.copyWithin

> **作用**

将数组内部的内容复制到该数组其他位置。

> **说明**

* 语法
    
    `arr.copyWithin(target[, start[, end]])`

* 参数
    * target 数组的初始修改节点，为负值时反向计数
    * start 开始复制位置，默认从 0 开始，为负值则反向计数
    * end   结束复制位置，默认为 arr.length ，负数方向计数，

* 返回值
    * 更改过后的目标数组
 
* 说明
    
    当 target 长度大于 arr.length 不会复制。
    当修改位置或被修改位置到达 arr.length 时都会停止复制。
   
    
    
> **举例**
    
```js
  //将索引为 0 的值,从倒数第 2 个位置开始逐一复制到 arr.length 的位置
  [1, 2, 3, 4, 5].copyWithin(-2);
  // [1, 2, 3, 1, 2]
  
  //将索引为 3 的值,从索引为 0 的位置开始开始逐一复制到 arr.length 的位置
  [1, 2, 3, 4, 5].copyWithin(0, 3);
  // [4, 5, 3, 4, 5]
  
  [1, 2, 3, 4, 5].copyWithin(0, 3, 4);
  // [4, 2, 3, 4, 5]
  
  [1, 2, 3, 4, 5].copyWithin(-2, -3, -1);
  // [1, 2, 3, 3, 4]
  
  [].copyWithin.call({length: 5, 3: 1}, 0, 3);
  // {0: 1, 3: 1, length: 5}
```
### array.every

> **作用**

验证数组所有元素是否通过传入函数的要求。

> **说明**

* 语法
    
    `arr.every(callback[, thisArg])`

* 参数
    * callback 传入的验证函数
        * currentValue 目前被处理的数组元素
        * index        目前的索引号
        * array        调用该方法的数组实体
    * thisArg 可选参数作为 this 的执行环境
  
* 返回值
    * 当所有放回结果均为 truthy 时为 true,否则为 false
 
> **注意**

该函数，当执行到回调返回为 false 时会停止执行。

    
> **举例**
    
```js
   //验证数组中元素是否都大于 5
   let testArr = [7,4,7,8]; 
   let lwOrEqual5Array = [];
   function checkGt5(ele,index,arr) {
        if(ele > 5) {
            return true;
        }
        else {
            lwOrEqual5Array.push({indexofArr:index});
        }
   }
   
   if(testArr.every(checkGt5)) {
       console.log('all element in array greater than 5');
   }
   else {
       console.log(lwOrEqual5Array);
   }
```

### array.some

> **作用**

和 every 相似，只要一个元素通过验证即返回真。

> **说明**

* 语法
    
    `arr.some(callback[, thisArg])`

* 参数
    * callback 传入的验证函数
        * currentValue 目前被处理的数组元素
        * index        目前的索引号
        * array        调用该方法的数组实体
    * thisArg 可选参数作为 this 的执行环境
  
* 返回值
    * 当任意元素结果执行为 truthy 时为 true,否则为 false
 
> **注意**

该函数，当执行到回调返回为 ture 时会停止执行。

    
> **举例**
    
```js
    function isBiggerThan10(element, index, array) {
      return element > 10;
    }
    [2, 5, 8, 1, 4].some(isBiggerThan10);  // false
    [12, 5, 8, 1, 4].some(isBiggerThan10); // true
```
### array.fill

> **作用**

将数组元素填充为某元素值

> **说明**

* 语法
    
    `arr.fill(value[, start = 0[, end = this.length]])`

* 参数
    * value 填充的值，支持基本类型和对象
    * start 填充的初始位置，默认为 0
    * end   填充的结束位置，默认为 arr.length
  
* 返回值
    * 返回修改以后的数组
    

> **举例**
    
```js
   //初始化一个 10*10 的数组默认值为 1
   let testArr = [Array(10).fill(1),Array(10).fill(1)]; 
   
    console.log(testArr);
    
   //重置数组的值为空
    function clearArr(array) {
        return array.fill(null);
    }
    
    let clearArrData = [1,2,34,5];
    console.log(clearArr(clearArrData));
```

### array.filter

> **作用**

过滤出满足回调函数条件的数组，并返回满足条件的新数组。

> **说明**

* 语法
    
    `var new_array = arr.filter(callback[, thisArg])`

* 参数
    * callback 过滤函数的回调函数
        * element 正在运行中的元素
        * index 对应元素的索引值
        * array 执行过滤函数的对象引用    
    * thisArg 改变运行是的 this 对象可选参数

  
* 返回值
    * 返回符合过滤条件的新数组
    
> **举例**
    
```js
   //初始化一个 10*10 的数组默认值为 1
   let testArr = [1,2,3,6,7,8]; 
    let COMPARE_VAR = 5;
  
    function lowerFilter(ele,index,array) {
        return (ele < COMPARE_VAR);
    }
  
    console.log(testArr.filter(lowerFilter));
```

### array.find

> **作用**

返回满足回调函数的第一个元素

> **说明**

* 语法
    
    `arr.find(callback[, thisArg])`

* 参数
    * callback 过滤函数的回调函数
        * element 正在运行中的元素
        * index 对应元素的索引值
        * array 执行过滤函数的对象引用    
    * thisArg 改变运行是的 this 对象可选参数

  
* 返回值
    * 返回符合过滤条件的新元素，没有时返回 undefined

> **注意**

当回调函数返回真时，find 会停止遍历。并返回此时的元素。

    
> **举例**
    
```js
   //初始化一个 10*10 的数组默认值为 1
   let testArr = [1,2,3,6,7,8]; 
   let COMPARE_VAR = 5;
  
    function lowerFind(ele,index,array) {
        return (ele < COMPARE_VAR);
    }
  
    console.log(testArr.find(lowerFind));
```

### array.findIndex

> **作用**

和 find 相似，返回符合回调函数条件的数组索引值

> **说明**

* 语法
    
    `arr.findIndex(callback[, thisArg])`

* 参数
    * callback 过滤函数的回调函数
        * element 正在运行中的元素
        * index 对应元素的索引值
        * array 执行过滤函数的对象引用    
    * thisArg 改变运行是的 this 对象可选参数

  
* 返回值
    * 返回符合过滤条件的新元素的索引值，没有时返回 -1

> **注意**

注意没有结果是返回的是 **-1**,不要误以为返回 `undifined`
和 find 类似查找到符合条件的元素后，会中断执行。
    
> **举例**
    
```js
   //初始化一个 10*10 的数组默认值为 1
   let testArr = [1,2,3,6,7,8]; 
   let COMPARE_VAR = 5;
  
    function lowerFind(ele,index,array) {
        return (ele < COMPARE_VAR);
    }
  
    console.log(testArr.findIndex(lowerFind));
```

### array.forEach

> **作用**

对数组中的元素执行回调函数

> **说明**

* 语法
    
    `arr.forEach(callback[, thisArg])`

* 参数
    * callback 过滤函数的回调函数
        * element 正在运行中的元素
        * index 对应元素的索引值
        * array 执行过滤函数的对象引用    
    * thisArg 改变运行是的 this 对象可选参数

  
* 返回值
    * 返回 undefined

  
> **举例**
    
```js
   //将数组各元素平方后返回新数组
   let testArr = [1,2,3,4,5,6]; 
  
    function squareArr(ele,index,array) {
        array[index] = ele*ele;
    }
    testArr.forEach(squareArr)
    
    console.log(testArr);
```

### array.map

> **作用**

对数组每个元素执行回调函数，并返回回调函数结果组成的新数组

> **说明**

* 语法
    
    `arr.map(callback[, thisArg])`

* 参数
    * callback 过滤函数的回调函数
        * element 正在运行中的元素
        * index 对应元素的索引值
        * array 执行过滤函数的对象引用    
    * thisArg 改变运行是的 this 对象可选参数

  
* 返回值
    * 返回回调函数返回值组成的新数组

  
> **举例**
    
```js
   //将数组各元素平方后返回新数组
 let numbers = [1, 4, 9];
 let rootNumbers = numbers.map(Math.sqrt);
 
 console.log(rootNumbers);
 // roots is now [1, 2, 3], numbers is still [1, 4, 9]
```

### array.includes

> **作用**

验证数组中是否包含某元素

> **说明**

* 语法
    
    `array.includes(searchElement[, fromIndex])`

* 参数
    * searchElement 查找的元素
    * fromIndex 查找位置的起始点可选参数

  
* 返回值
    * 返回 Boolean ，有为真，无为假

  
> **举例**
    
```js
    [1, 2, 3].includes(2);     // true
    [1, 2, 3].includes(4);     // false
    [1, 2, 3].includes(3, 3);  // false
    [1, 2, 3].includes(3, -1); // true
    [1, 2, NaN].includes(NaN); // true
```

### array.indexOf

> **作用**

返回查找元素对应的索引位置

> **说明**

* 语法
    
    `arr.indexOf(searchElement[, fromIndex = 0])`

* 参数
    * searchElement 查找的元素
    * fromIndex 查找位置的起始点可选参数

  
* 返回值
    * 返回第一次出现查找元素的位置 ，无返回 -1

  
> **举例**
    
```js
    let array = [2, 9, 9];
    array.indexOf(2);     // 0
    array.indexOf(7);     // -1
    array.indexOf(9, 2);  // 2
    array.indexOf(2, -1); // -1
    array.indexOf(2, -3); // 0
```

### array.lastIndexOf

> **作用**

返回查找元素对应的最后索引位置

> **说明**

* 语法
    
    `arr.lastIndexOf(searchElement[, fromIndex = 0])`

* 参数
    * searchElement 查找的元素
    * fromIndex 查找位置的起始点可选参数

  
* 返回值
    * 返回最后一次出现查找元素的位置 ，无返回 -1

  
> **举例**
    
```js
    let array = [2, 9, 9,2];
    array.lastIndexOf(2);     // 0
    array.lastIndexOf(7);     // -1
    array.lastIndexOf(9, 2);  // 2
    array.lastIndexOf(2, -1); // -1
    array.lastIndexOf(2, -3); // 0
```

### array.join

> **作用**

连接数组为字符串。

> **说明**

* 语法
    
    ` arr.join([separator = ','])`

* 参数
    * separator 可选，采用何种方式划分元素

  
* 返回值
    * 连接后的字符串

  
> **举例**
    
```js
    let array = ['wind', 'Rain', 'Fire'];
    let myVar1 = a.join();      // assigns 'Wind,Rain,Fire' to myVar1
    let myVar2 = a.join(', ');  // assigns 'Wind, Rain, Fire' to myVar2
    let myVar3 = a.join(' + '); // assigns 'Wind + Rain + Fire' to myVar3
    let myVar4 = a.join('');    // assigns 'WindRainFire' to myVar4
```

### array.reverse

> **作用**

翻转数组顺序。

> **说明**

* 语法
    
    `arr.reverse()`

* 返回值
    * 返回翻转后的数组

  
> **举例**
    
```js
    let array = ['wind', 'Rain', 'Fire'];
    array.reverse();
```

### array.sort

> **作用**

对数组元素进行排序。

> **说明**

* 语法
    
    `arr.sort([compareFunction])`
    
* compareFunction 可选，比较函数，省略会采用字典排序。
    * element 正在运行中的元素
    * index 对应元素的索引值
    * array 执行过滤函数的对象引用   

* 返回值
    * 返回排序后的数组

* 注意
搞清楚数据结构中基本的排序算法。和相关说明。
  
> **举例**
    
```js
    var testArr = [10,9,2,3,4,5,6]; 
    
    function compareNumber(a,b) {
      return ((a - b)>0)?true:false;
    }
    
    console.log(testArr.sort(compareNumber));
```

### array.slice

> **作用**

返回一个新的浅复制数组。

> **说明**

* 语法
    
    `arr.slice([begin[, end]])`

* 参数
    * begin 浅复制的开始位置，若为负值则方向记录引用值，默认为 0
    * end   浅复制结束位置，若为负值则反向记录引用值，默认为 0

* 返回值
    * 返回浅复制的新数组

  
> **举例**
    
```js
    var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
    
    //返回索引位置从 1 到 3 的新数组
    console.log(fruits.slice(1, 3));
    
    //返回倒数索引位置 2 到 1 的新数组
    console.log(fruits.slice(-2, -1));
```



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
   let arr = ['a', 'b', 'c'];
   //该方法将每个元素分别保存为包含键名和键值的一维数组
   let eArr = arr.entries();
   
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
   arr = [];
   str = '';
   obj = {};
   console.log('\narr is empty:' + !arr +
   '\nstr is empty:' + !str +
   '\nobj is empty:' + !obj); 
   
   //return
   // arr is empty:false
   // str is empty:true
   // obj is empty:false
```
可以看到对于数组和对象结果均为假，实际上由于 js 引擎处理的变量均可看做对象.
所以在判断是不可采用`!`这种方式。需直接和 null 比较来判断结果。
```js
   arr = [];
   str = '';
   obj = {};
   console.log('\narr is empty:' + arr==null +
   '\nstr is empty:' + str==null +
   '\nobj is empty:' + obj==null); 
   
   //return
   // arr is empty:false
   // str is empty:true
   // obj is empty:false
```