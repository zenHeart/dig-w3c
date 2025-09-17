# 分号

**详解 js 默认分号插入规则**


---

## 引言
编写如下代码模拟 map 方法。

```js
Array.prototype.selfMap = function selfMap(cb) {
	let result = [];

	for(let i =0;i<this.length;i++) {
		result.push(cb(this[i],i,this));
	}
	return result;
}
[1,2,3].selfMap(ele => ele*ele);
```

可是执行时抛出如下错误
> TypeError: Cannot read property 'selfMap' of undefined

通过查找发现是没有在 selfMap 定义的函数后添加分号导致。于是重新阅读自动分号插入规则理解此现象的原因

## 自动分号插入规则
阅读规范 [Automatic Semicolon Insertion](https://tc39.es/ecma262/#sec-automatic-semicolon-insertion) 章节总结如下

1. 下一行若为表达式则连接上一行内容
2. 若下一行开始为 `}` 则在之前添加分号
3. 当到达文件末尾时添加
4. 当存在如下语句时添加分号 `return,break,throw,continue`


## 参考资料
* [Semicolons in JavaScript](https://flaviocopes.com/javascript-automatic-semicolon-insertion/)
* [Understanding Automatic Semicolon Insertion in JavaScript ](http://www.bradoncode.com/blog/2015/08/26/javascript-semi-colon-insertion/)