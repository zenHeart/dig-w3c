date
===
**前言:讲解 js 的时间函数库**

---

## 时间函数库函数举例
```js
   const testTime = "Thu Oct 20 2016 17:12:20.123 GMT+0800 (中国标准时间)";
   testDate = new Date(testTime);
   
   /*************自定义对象方法********************/
   //获取当地时间
   testDate.getFullYear();  //结果: 2016  返回对应年份
   testDate.getMonth();  //结果: 9  返回月份，注意它是从 0 开始计数的，所以实际值要加 1
   testDate.getDate(); //结果: 20 返回对应时间月份天数
   testDate.getDay();  //结果: 4  返回对应的星期
   testDate.getHours();  //结果: 17  返回对应小时
   testDate.getMinutes();  //结果: 12  返回对应分钟
   testDate.getSeconds();  //结果: 20  返回对应秒
   testDate.getMilliseconds();  //结果: 123  返回对应毫秒
   testDate.getTime();  //结果:1476954740000  返回相距 1970 00:00:00 时间戳
   
   //设置当地时间
   testDate.setFullYear();  //结果: 2016  返回对应年份
   testDate.setMonth();  //结果: 9  返回月份，注意它是从 0 开始计数的，所以实际值要加 1
   testDate.setDate(); //结果: 20 返回对应时间月份天数
   testDate.setHours();  //结果: 17  返回对应小时
   testDate.setMinutes();  //结果: 12  返回对应分钟
   testDate.setSeconds();  //结果: 20  返回对应秒
   testDate.setMilliseconds();  //结果: 123  返回对应毫秒
   testDate.setTime();  //结果:1476954740000  返回相距 1970 00:00:00 时间戳
 
   //获取UTC 时区
   testDate.getTimezoneOffset();  //结果:8 相对 UTC 标准的时差
   testDate.getUTCFullYear();  //结果: 2016  返回 UTC 对应年份
   testDate.getUTCMonth();  //结果: 9  返回 UTC 月份，注意它是从 0 开始计数的，所以实际值要加 1
   testDate.getUTCDate(); //结果: 20 返回 UTC 对应时间月份天数
   testDate.getUTCDay();  //结果: 4  返回 UTC 对应的星期
   testDate.getUTCHours();  //结果: 17  返回 UTC 对应小时
   testDate.getUTCMinutes();  //结果: 12  返回 UTC 对应分钟
   testDate.getUTCSeconds();  //结果: 20  返回 UTC 对应秒
   testDate.getUTCMilliseconds();  //结果: 123  返回 UTC 对应毫秒
   
   //设置 UTC 时间
   testDate.setUTCFullYear();  //结果: 2016  返回 UTC 对应年份
   testDate.setUTCMonth();  //结果: 9  返回 UTC 月份，注意它是从 0 开始计数的，所以实际值要加 1
   testDate.setUTCDate(); //结果: 20 返回 UTC 对应时间月份天数
   testDate.setUTCHours();  //结果: 17  返回 UTC 对应小时
   testDate.setUTCMinutes();  //结果: 12  返回 UTC 对应分钟
   testDate.setUTCSeconds();  //结果: 20  返回 UTC 对应秒
   testDate.setUTCMilliseconds();  //结果: 123  返回 UTC 对应毫秒
  
   //时间对象变换
   timeData.toDateString(); //将时间对象变为字符串
   timeData.toISOString();  //将时间对象转变为 ISO 格式
   timeData.toJSON();  //将时间对象转变为 json 格式
   timeData.toLocaleDateString();  //重点函数
   timeData.toLocaleString();      //重点函数
   timeData.toLocaleTimeString();      //重点函数
   timeData.toString();      //重点函数
   timeData.toTimeString();      //重点函数
   timeData.toUTCString();      //重点函数
   timeData.valueOf();      //返回是时间对象原始值
   
   
   
  /*************宿主对象方法********************/
  Date.now(); //返回时间戳
  Date.parse(); //重点函数
  Date.UTC(); //UTC 模式构建时间对象   
```

## 重点函数讲解

## 常用案例
获取时间戳
```js
   timestamp = new Date().getTime(); 
```

## setMonth 有副作用直接影响了原函数
月份只减去 30d 

## 参考资料