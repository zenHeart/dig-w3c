# 类型

本章解读 js 的类型。


## String

1. String 采用 UTF16 编码,单个字符取决于编码长度
2. 字符串的不可变性,尝试修改 `s = 'hello';s[0]='H' 输出 s 无效`
3. 原始封装类型,为何可直接调用 `'hello world'.toUpperCase()`
4. 操作符的对字符串类型转换的影响
    1. `+` 连接字符串
    2. `*` 转换为数字运算
5. 字符串的常用方法

## null undefined

1. 详细区别参考 [阮一峰 undefined 与 null 的区别](https://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)

准确说明如下

1. **undeclared** 表示为分配空间,可以采用 `try catch` 捕获右引用错误
2. **null** 表示初始化为空,说明此处不该有对象
3. **undefined** 表示缺省值,说明变量已创建但未赋值
