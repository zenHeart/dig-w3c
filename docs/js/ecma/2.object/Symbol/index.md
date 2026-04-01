# Symbol

## 概述

`Symbol` 是 ECMAScript 6 引入的**基本数据类型**，用于创建**唯一**的属性键值。与字符串和数字不同，每个 Symbol 都是**唯一**的，即使描述相同也不相等。

```js
const s1 = Symbol('description');
const s2 = Symbol('description');

s1 === s2  // false - 每次调用 Symbol() 都创建新值
```

### Symbol 的特性

| 特性 | 说明 |
|------|------|
| 基本类型 | `typeof Symbol()` 返回 `'symbol'` |
| 唯一性 | 每次 `Symbol()` 调用创建新值 |
| 不可枚举 | Symbol 属性不会出现在 `for...in`、`for...of`、`Object.keys()` 中 |
| 可用作属性键 | 可以作为对象的属性键（property key） |
| 可配置全局注册 | `Symbol.for()` 在全局符号注册表中注册和查找 |

---

## 创建 Symbol

### Symbol()

使用 `Symbol()` 创建新的 Symbol 值：

```js
const s = Symbol();           // 无描述
const s1 = Symbol('name');    // 带描述，便于调试
const s2 = Symbol('name');
```

### Symbol.for()

在**全局符号注册表**中创建或查找符号：

```js
const s1 = Symbol.for('global');  // 首次调用，创建并注册
const s2 = Symbol.for('global');  // 查找已存在的

s1 === s2  // true - 同一个全局符号
```

### Symbol.keyFor()

查询全局符号注册表，返回已注册符号的**键**：

```js
const s = Symbol.for('myKey');
Symbol.keyFor(s);  // 'myKey'

const local = Symbol('local');
Symbol.keyFor(local);  // undefined - 局部符号不在注册表中
```

---

## Well-known Symbols（常见内置符号）

JavaScript 提供了一系列内置符号（Well-known Symbols），用于定制语言内部行为。

### Symbol.iterator

定义对象的**默认迭代器**，使对象可用于 `for...of` 循环和扩展运算符 `...`：

```js
const obj = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.items.length) {
          return { value: this.items[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const item of obj) {
  console.log(item);  // 1, 2, 3
}

console.log([...obj]);  // [1, 2, 3]
```

使用生成器简化实现：

```js
const obj = {
  items: [1, 2, 3],
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }
};
```

### Symbol.toStringTag

定制 `Object.prototype.toString()` 的返回内容：

```js
const person = {
  [Symbol.toStringTag]: 'Person'
};

Object.prototype.toString.call(person);  // '[object Person]'

// 数组默认返回 '[object Array]'
const arr = [1, 2, 3];
Object.prototype.toString.call(arr);  // '[object Array]'

// 定制类数组对象的标签
const domNode = {
  [Symbol.toStringTag]: 'HTMLDivElement',
  length: 0
};
Object.prototype.toString.call(domNode);  // '[object HTMLDivElement]'
```

### Symbol.hasInstance

定制 `instanceof` 操作符的行为：

```js
class EvenNumbers {
  static [Symbol.hasInstance](instance) {
    return typeof instance === 'number' && instance % 2 === 0;
  }
}

42 instanceof EvenNumbers;  // true
37 instanceof EvenNumbers;  // false
```

### Symbol.toPrimitive

定制对象到**基本类型**的转换规则：

```js
const counter = {
  value: 0,
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'string':
        return `Counter: ${this.value}`;
      case 'number':
        return this.value;
      default:  // 'default'
        return this.value;
    }
  }
};

// 字符串转换
String(counter);       // 'Counter: 0'

// 数值转换
+counter;              // 0
counter * 2;           // 0

// 默认转换（通常与数值相同）
counter + 1;           // 1
```

### Symbol.isConcatSpreadable

控制对象在 `Array.prototype.concat()` 中是否展开：

```js
// 默认：数组被展开
const arr1 = [1, 2];
const arr2 = [3, 4];
arr1.concat(arr2);  // [1, 2, 3, 4]

// 禁止展开
const arr = [1, 2];
arr[Symbol.isConcatSpreadable] = false;
[0].concat(arr);  // [0, [1, 2]]

// 类数组对象
const arrayLike = {
  0: 'a',
  1: 'b',
  length: 2,
  [Symbol.isConcatSpreadable]: true
};
[].concat(arrayLike);  // ['a', 'b']
```

### Symbol.species

定义派生对象的构造函数（用于 `Array.map()`、`Array.filter()` 等方法）：

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;  // 派生方法返回普通 Array 实例
  }
}

const myArr = new MyArray(1, 2, 3);
const mapped = myArr.map(x => x * 2);

mapped instanceof MyArray;  // false
mapped instanceof Array;    // true
```

### Symbol.split

定制 `String.prototype.split()` 的行为：

```js
const csvParser = {
  [Symbol.split](string) {
    return string.split(',');
  }
};

'a,b,c'.split(csvParser);  // ['a', 'b', 'c']
```

### Symbol.match

定制 `String.prototype.match()` 和 `RegExp` 的交互：

```js
const validator = {
  [Symbol.match](input) {
    return input.length > 3 ? ['valid'] : null;
  }
};

'Hello'.match(validator);  // ['valid']
'ab'.match(validator);     // null
```

### Symbol.replace

定制 `String.prototype.replace()` 的行为：

```js
const replacer = {
  [Symbol.replace](string, replacement) {
    return string.replace(//g, replacement);
  }
};

'Hello World'.replace(replacer, '-');  // 'Hello-World'
```

### Symbol.search

定制 `String.prototype.search()` 的行为：

```js
const caseInsensitive = {
  [Symbol.search](string) {
    return string.toLowerCase().indexOf('foo');
  }
};

'JavaScript Foo'.search(caseInsensitive);  // 11
```

### Symbol.unscopables

定义 `with` 语句中排除的属性：

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.unscopables]: {
    a: true  // 'a' 在 with 环境中不可访问
  }
};

with (obj) {
  console.log(b);  // 2 - b 可访问
  // console.log(a); // ReferenceError - a 被排除
}
```

### Symbol.asyncIterator

定义对象的**异步迭代器**，用于 `for await...of` 循环：

```js
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let step = 0;
    return {
      next() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              value: step++,
              done: step > 3
            });
          }, 100);
        });
      }
    };
  }
};

(async () => {
  for await (const value of asyncIterable) {
    console.log(value);  // 0, 1, 2
  }
})();
```

---

## Symbol 作为对象属性键

### 基本用法

```js
const myMethod = Symbol('myMethod');

const obj = {
  [myMethod]() {
    return 'Hello';
  }
};

obj[myMethod]();  // 'Hello'
```

### 私有属性的实现

Symbol 常用于实现**真正的私有属性**：

```js
const _password = Symbol('password');
const _hash = Symbol('hash');

class User {
  constructor(name, password) {
    this.name = name;
    this[_password] = password;
    this[_hash] = this._hashPassword(password);
  }

  authenticate(input) {
    return this[_hash] === this._hashPassword(input);
  }

  _hashPassword(pwd) {
    // 简化的哈希演示
    return String(pwd).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  }
}

const user = new User('alice', 'secret123');
console.log(user.name);           // 'alice'
console.log(user._password);      // undefined - 外部无法访问
console.log(user.authenticate('secret123'));  // true
```

> ⚠️ **注意**：使用 `Object.getOwnPropertySymbols()` 仍可访问 Symbol 属性。这只是"软私有"，不是真正的语言级私有（可用 `#` 私有字段实现）。

### 避免命名冲突

在库或模块中，使用 Symbol 作为扩展点避免与用户属性冲突：

```js
const MyLib = (() => {
  const _internal = Symbol('internal');

  return {
    create(options) {
      const instance = { public: options.value };
      instance[_internal] = { /* 内部数据 */ };
      return instance;
    }
  };
})();
```

---

## Symbol 在内置对象中的应用

### Map 的键

```js
const key = Symbol('myKey');
const map = new Map();
map.set(key, 'value');
map.get(key);  // 'value'
map.has(key); // true
```

### Set 的值

```js
const s = Symbol('s');
const set = new Set([s, s, s]);
set.size;  // 1 - Symbol 唯一性确保不重复
```

### WeakMap / WeakSet

```js
const wm = new WeakMap();
const sym = Symbol('key');
wm.set(sym, 'value');  // 可以使用 Symbol 作为键
```

### Object.defineProperty

```js
const myProp = Symbol('myProp');
const obj = {};

Object.defineProperty(obj, myProp, {
  value: 'secret',
  writable: true,
  enumerable: false  // 不可枚举
});

console.log(Object.keys(obj));     // []
console.log(Object.getOwnPropertySymbols(obj));  // [Symbol(myProp)]
```

---

## 获取 Symbol 属性

### Object.getOwnPropertySymbols()

获取对象的所有 Symbol 属性：

```js
const a = Symbol('a');
const b = Symbol('b');

const obj = {
  [a]: 'valueA',
  [b]: 'valueB',
  c: 'valueC'
};

Object.getOwnPropertySymbols(obj);
// [Symbol(a), Symbol(b)]
```

### Reflect.ownKeys()

获取**所有**属性键（包括字符串和 Symbol）：

```js
Reflect.ownKeys(obj);
// [Symbol(a), Symbol(b), 'c']
```

---

## 常见错误与最佳实践

### ❌ 错误：Symbol 无法 new

```js
// 错误！
const s = new Symbol();  // TypeError

// 正确
const s = Symbol();
```

### ❌ 错误：Symbol 属性默认不可枚举

```js
const s = Symbol('test');
const obj = { [s]: 'value' };

Object.keys(obj);           // [] - 不包含 Symbol
Object.getOwnPropertyNames(obj);  // [] - 不包含 Symbol

// 正确获取
Object.getOwnPropertySymbols(obj);  // [Symbol(test)]
Reflect.ownKeys(obj);              // [Symbol(test)]
```

### ❌ 错误：JSON.stringify 忽略 Symbol

```js
const obj = {
  name: 'test',
  [Symbol('secret')]: 'hidden'
};

JSON.stringify(obj);  // '{"name":"test"}'
```

### ✅ 最佳实践：使用描述便于调试

```js
const s1 = Symbol('userId');
const s2 = Symbol('userId');

console.log(s1);  // Symbol(userId)
console.log(s2);  // Symbol(userId)
console.log(s1 === s2);  // false
```

### ✅ 最佳实践：使用 Symbol.for() 跨模块共享

```js
// module-a.js
const CONFIG = Symbol.for('config');

// module-b.js
const CONFIG = Symbol.for('config');
// 获得相同引用
```

### ✅ 最佳实践：Symbol 用于库扩展点

```js
// 库内部
const PluginSymbol = Symbol('plugin');

// 库提供扩展点
class PluginHost {
  constructor() {
    this[PluginSymbol] = [];
  }

  register(plugin) {
    this[PluginSymbol].push(plugin);
  }
}

// 用户代码
const myPlugin = {
  [Symbol.toStringTag]: 'MyPlugin',
  apply() { /* ... */ }
};
```

---

## 完整示例

### 迭代器与生成器

```js
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}

const range = new Range(1, 5);
[...range];        // [1, 2, 3, 4, 5]
for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}
```

### 自定义迭代类数组

```js
class NodeList {
  constructor(items) {
    this.items = items;
  }

  get length() {
    return this.items.length;
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

const nodes = new NodeList(['a', 'b', 'c']);
[...nodes];  // ['a', 'b', 'c']
```

### Symbol 在数据结构中的应用

```js
// 使用 Symbol 避免与用户属性冲突
const _cache = Symbol('cache');

class Cache {
  constructor() {
    this[_cache] = new Map();
  }

  set(key, value) {
    this[_cache].set(key, value);
  }

  get(key) {
    return this[_cache].get(key);
  }
}
```

---

## 相关资源

- [MDN: Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [ECMAScript 规范 - Symbol 对象](https://tc39.es/ecma262/#sec-symbol-objects)
- [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)
