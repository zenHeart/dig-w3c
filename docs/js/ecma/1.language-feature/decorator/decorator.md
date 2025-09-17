装饰器


## decorator
修饰器的作用是对实例化对象进行增强.

```js
@decorator 
class A {}

//执行修饰器函数对 A 进行强化
A = decorator(A) || A;
```

使用装饰器步骤.

1. 定义装饰器函数

2. 调用装饰器


参考资料
* [decorators 提议](https://github.com/wycats/javascript-decorators)
* [decorators 使用](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)
* [阮一峰 decorators 讲解]()

