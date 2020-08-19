# 字符串


**字符串对象的详细使用**

---

## 字符串的定义
字符串是一个字符序列，js 支持的字符格式是 utf-16 的字符编码。
js 支持字符串中添加转义字符,序列如下

| 转义编码               | 含义                                     |
| ---------------------- | :--------------------------------------- |
| \0                     | the NUL character (空字符)               |
| \'                     | single quote (单引号)                    |
| \"                     | double quote  (双引号)                   |
| \\|backslash  (反斜杠) |
| \n                     | new line   (换行符)                      |
| \r                     | carriage return ()                       |
| \v                     | vertical tab ()                          |
| \t                     | tab   (制表符)                           |
| \b                     | backspace (空格)                         |
| \f                     | form feed (换页)                         |
| \uXXXX                 | unicode codepoint (unicode 编码)         |
| \u{X} ... \u{XXXXXX}   | unicode codepoint  (可变的 unicode 编码) |
| \xXX                   | the Latin-1 character (ascii 编码)       |


不同于 C 语言，单引号表示单个字符，双引号表示字符串，js 不区分单双引号。
这和 PHP 相似，单 PHP 在双引号引用变量时可以被引擎解析，而 js 不具有此功能。
字符串的定义方式有如下两种

1. 使用字符串常量
	```js
	//对于字符串常量使用数组索引时为只读，不可修改索引值
	str = "test"; 
	str[0][1] = 'a'; //改值不会被修改
	```
2. 使用构造函数
	```js
	//对于字符串常量使用数组索引时为只读，不可修改索引值
	str = new String("test"); 
	str[0][1] = 'a'; //改值不会被修改
	```

## String 构造器
**单个字符索引**
1. 利用 `charAt 的方法`
```js
   //返回字符 `a`
   console.log(`cat`.charAt(1)); 
```
2. 利用数组模式进行索引
```js
   //返回字母 `a`
   //使用括号访问变量时字符串的只读性
   console.log(`cat`[1]);
```
**字符串比较**
直接使用大小判断符即可   
```js
   var a = "a"; 
   var b = "b"; 
   if (a < b) // true
   (a +s" is less than " + b);
   else if (a > b)
    pconsole.logrint(a + " is greater than " + b);
   else
     print(a + " and " + b + " are equal.");
```
## 字符串的方法
```js
    /******自定义字符串对象方法*************/
    //取出对应位置的字符，结果's',无返回空
    'test'.charAt(2)
    
    //返回对应位置的 ascii 值，结果 115,无为 NAN
    'test'.charCodeAt(2)
    
    //返回对应位置的 unicode 码，结果 115,无为 NAN
    'test'.codePointAt(2)
    
    //组合多个字符串并返回行的字符串
    'test'.concat('test1','test2');
    
    //判断特定位置字符串是否为指定内容
    var str = 'To be, or not to be, that is the question.';  
    console.log(str.endsWith('question.')); // true
    console.log(str.endsWith('to be'));     // false
    console.log(str.endsWith('to be', 19)); // true

    //测试字符串中是否包含搜索字符串 重点函数
     'test'.includes('te'); // true
     
    //返回匹配搜寻字符串的初始位置  重点函数
     'Blue Whale'.indexOf('Blue');     // returns  0
     'Blue Whale'.indexOf('Blute');    // returns -1
     'Blue Whale'.indexOf('Whale', 2); // 从第 3 个字符的为开始搜索 returns  5
     'Blue Whale'.indexOf('Whale', 0); // 从第 1 个字符的为开始搜索 returns  5
    
    //返回最后一次出现搜寻字符串的位置， 重点函数
    'canal'.lastIndexOf('a');     // returns 3
    'canal'.lastIndexOf('a', 2);  // 搜索包含第3个字符左边的字符串 returns 1
    'canal'.lastIndexOf('a', 0);  // 搜索包含第1个字符左边的字符串 returns -1
    'canal'.lastIndexOf('x');     // returns -1
    'canal'.lastIndexOf('c', -5); // 搜索包含第1个字符左边的字符串 returns 0
    'canal'.lastIndexOf('c', 0);  // 搜索包含第1个字符左边的字符串 returns 0
    'canal'.lastIndexOf('');      // 搜索空字符 returns 5
    'canal'.lastIndexOf('', 2);   // 搜索包含第3个字符左边的字符串中为空的位置 returns 2
    
    //返回字符串长度 重点函数
    'canal'.length;     // returns 5
     
     //返回生成的超链接标签，注意和 string.anchor 对比
    var hotText = 'MDN';
    var URL = 'https://developer.mozilla.org/';
    // Click to return to <a href="https://developer.mozilla.org/">MDN</a>
    console.log('Click to return to ' + hotText.link(URL));
    
    //会生成 "<a name="test">test</a>" 的 html字符串
    'test'.anchor('test')
        
    //返回字符串长度 重点函数
    'canal'.localeCompare;     // returns 5
    
    //不懂
   var str = '\u1E9B\u0323';
   str.normalize('NFC'); // '\u1E9B\u0323'
   str.normalize();      // same as above

    
    //重复字符串 创建函数
    'canal'.repeat(2);     // returns "canalcanal"
  
    //返回字符串长度 重点函数
    'canal'.replace;     // returns 5

    //拆分字符串 重点函数
    'canal'.split('an',1);     // returns ['c']
   
    //拆分字符串 重点函数
    'canal'.split('an',1);     // returns ['c']
    //拆分字符串返回新字符串
    'canal'.slice(0,3);     //返回从0到2的字符 returns 'c'
    'canal'.slice(-2,-1);     //返回从倒数的第2个字符到倒数第1各字符前的内容 returns 'a'
    //提取从开始到结束位置子字符串 
    'canal'.substring();      //提取整个字符串 returns 'canal'
    'canal'.substring(1,3);    //提取从 1 到 2 的字符 returns 'an'
    'canal'.substring(3,1);    //返回结果同上    returns 'an'
    //提取从开始位置指定长度子字符串
    'canal'.substr();      //提取整个字符串 returns 'canal'
    'canal'.substr(1,3);    //提取从 1 开始，3个字符 returns 'can'
    'canal'.substr(3,1);    //提取从 3 开始，1个字符    returns 'a'
       
     
    
    //判断指定位置的字符串匹配 重点函数
    'canal'.startsWith('an',1);     // returns true
    
    


    //和 valueof 类似
    'canal'.toString();    // returns 'canal'
    
    //返回字符串 
    'canal'.valueOf();     // returns 'canal'

      

    //所有大写字母变小写
    'CANAL'.toLowerCase();    // returns 'canal'
    //所有小写字母变大写
    'canal'.toUpperCase();    // returns 'CANAL'
    //所有小写字母变大写
    'canal'.toLocaleLowerCase();    // returns 'CANAL'
    //所有大写字母变小写
    'CANAL'.toLocaleUpperCase();    // returns 'canal'

    //移除字符串之前之后的空白
    ' c a nal   '.trim(); // returns 'c a nal'
        

    /******内建字符串对象方法***************/
    //返回对应 ascii 码对应的字符串组合
    String.fromCharCode(0x30,0x31,0x32); // 012 
    
    //返回对应位置的 ascii 值，结果 115,无为 NAN
    String.fromCodePoint(0x30,0x31,0x32); // 012 
    
    //创建初始字符串
    String.raw({raw: 'test' }, 0, 1, 2); //结果 "t0e1s2t"
      

    //返回对应位置的 ascii 值，结果 115,无为 NAN
    'test'.charCodeAt(2)
    
   /******实验方法还未在浏览器中实现***************/
   //string.padEnd
   //string.padStart
   //string.quote
    
            
```
> charCodeAt 和 codePointAt

注意这两个的返回值没有区别，在类似于中文等编码时，
`charCodeAt`返回的也是对应的编码值。
```js
    // 返回结果相同，均为 21644
   '和'.charCodeAt(0); 
   '和'.codePointAt(0); 
```

> string.localeCompare

对字符串进行字典比较，注意配置选项。

> string.match

利用正则查找匹配字符串。用法如下
1. 搜索所有目标结果,必须在正则后加`g`全局配置选项
```js
   'test test1'.match(/test.{1}/g) //return  ["test ", "test1"]
```

2. 返回匹配分组结果，结尾不可加`g`全局配置项,返回结果和匹配分组
```js
   'test test1'.match(/((t)e)s/) //return ["tes", "te", "t"]
```

> string.replace

`str.replace(regexp|substr, newSubStr|function)`   
替换查找内容的函数。
* regexp
    查找方式可以是正则
* substr
    查找方式可以为字符串，只会替换第一次出现位置
* newSubstr
    替换字符串
* function
    替换方法可以为函数 
     
返回结果为新的替换字符串。    
替换的字符串具有如下模式

| 模式 | 插入                                                |
| :--- | :-------------------------------------------------- |
| $$   | 插入`$`字符                                         |
| $&   | 利用搜索到的字符串替作为替换字符串                  |
| $`   | 搜索到的字符串前面的字符内容作为替换字符串          |
| $'   | 搜索到的字符串后面的内容作为替换字符                |
| $n   | 利用匹配分组的字符结果作为替换字符串，做多从{1,100} |

你也可以用函数作为替换方法。替换函数有如下参数可用

| 形参        | 作用                                 |
| :---------- | :----------------------------------- |
| match       | 匹配的字符串                         |
| p1, p2, ... | 匹配分组                             |
| offset      | 匹配搜索到的位置                     |
| $'          | 搜索到的字符串后面的内容作为替换字符 |
| string      | 搜索的初始字符串                     |

1. 将单词首字母变为大写,注意不要忘记全局匹配
```js
   var str= 'hello world!'; 
   str.replace(/\b[a-zA-Z]/g,function(match) {
       return match.toUpperCase();
   });
```
2. 交换两个单词的位置
```js
   var str= 'hello world!'; 
   str.replace(/(\w+)\s(\w+)/g,'$2 $1');
```

3. 华氏温度变摄氏温度
```js
function f2c(x) {
  function convert(str, p1, offset, s) {
    return ((p1 - 32) * 5/9).toFixed(3) + 'C';
  }
  var s = String(x);
  var test = /(-?\d+(?:\.\d*)?)[fF]\b/g;
  return s.replace(test, convert);
}
f2c('-15f');
```

4. 将特殊字符转变为对象
```js
    /**
    * x-x_              
    * x---x---x---x---  
    * x-xxx-xx-x__      
    * 以上字符 x表示on -表示off _表示on的持续次数,出现一次加一
    * 将上面的字符串变为数组，
    * 每一行为一个对象{on:bool,onLength:} 
    * bool 表示最后开关状态，lenth 表示最后开的次数，若 bool 值为假则onLength为1
    * 例如上述结果为
    * [
    *   { on: true, onLength: 1 },
    *   { on: false, onLength: 0 },
    *   { on: true, onLength: 2 }
    * ]  
    */  
    var str = 'x-x_';
    var retArr = [];
    str.replace(/(x_*)|(-)/g, function(match, p1, p2) {
      if (p1) { retArr.push({ on: true, onlength: p1.length }); }
      if (p2) { retArr.push({ on: false, onlength: 1 }); }
    });
    console.table(retArr);
   
```

> string.split



`str.split([separator[, limit]])`
将字符串拆分为指定模式。
* separator
    分隔方式可以是字符串或者正则
* limit
  限制分隔的数量

1. 以空格分隔单词
```js
    // return ["test", "test1", "test2"]
    ' test   test1  test2  '.trim().split(/ +/); 
    
```    
2. 取出第一行
```js
    // return ["test", "test1", "test2"]
    var str = "第一行\n第二行\n"
    str.split(/\n/,1);   
```       

> string.search

`str.search(regexp)`
搜索指定字符串。返回第一次索引到的位置
* regexp
    分隔方式可以是字符串或者正则







## String.prototype

* 方法
  * 

核心方法详解

### replace
用于实现字符串替换。典型的用例

1. 数字千分位
2. 货币格式化
3. `yyyy-mm-dd` -> `mm/dd/yyyy`
4. * [ ] 驼峰转换
5. * [ ] HTML 转义和反转义
6. * [ ] 匹配成对标签
## 知识点
### textarea 对回车换行的转换
`\n` 换行符 ascii 码 0a 对应键盘`ctrl + enter`   
`\r` 回车符 ascii 码 0d 对应键盘`enter`      
在文本编辑器中`\n\r`都会被转义为一个字符，`\n`
对于文本字符的回车只会转义为一个字符。`\n`所以发送时需要转义为两个字符。
1. 使用 `textarea`利用 ajax 选中向其中输入`\n\r`
2. 利用 escape($('textarea').value) 以转义字符显示结果为`%a%a`
3. 利用 escape('\n\r')显示结果为`%d%a`说明，文本中的换行都解释为了`%a`
实际上这两个值是完全不一样的，在利用 HTTP 通讯是尤为注意。



## 字符串结合运算
[Why is the result of ('b'+'a'+ + 'a' + 'a').toLowerCase() 'banana'?](https://stackoverflow.com/questions/57456188/why-is-the-result-of-ba-a-a-tolowercase-banana)


## 字符串编码
### 比较问题
* [ ] 参考 [Is it Safe to Compare JavaScript Strings?](https://dmitripavlutin.com/compare-javascript-strings/)


