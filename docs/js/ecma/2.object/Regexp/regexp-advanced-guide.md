# JavaScript RegExp 高级指南：从 W3C 标准视角

> 本文档从 ECMAScript 规范和浏览器实现角度，深入梳理 JavaScript 正则表达式的高级特性与底层原理。

---

## 目录

1. [ECMAScript RegExp 规范](#1-ecmascript-regexp-规范)
2. [RegExp 对象底层机制](#2-regexp-对象底层机制)
3. [Unicode 属性转义](#3-unicode-属性转义)
4. [具名捕获组](#4-具名捕获组-named-capture-groups)
5. [后行断言（Lookbehind）](#5-后行断言lookbehind)
6. [Dotall 模式](#6-dotall-模式)
7. [Sticky 粘性模式](#7-sticky-粘性模式)
8. [RegExp 相关的 Well-Known Symbols](#8-regexp-相关的-well-known-symbols)
9. [浏览器对 RegExp 的优化](#9-浏览器对-regexp-的优化)
10. [常见踩坑与最佳实践](#10-常见踩坑与最佳实践)

---

## 1. ECMAScript RegExp 规范

### 1.1 RegExp 是 ECMAScript 的内置对象

RegExp 构造器对应 ECMAScript 规范的 [RegExp ( @@species )](https://tc39.es/ecma262/#sec-regexp-@@species) 内部对象。

关键规范引用：
- [22.2.3 RegExp Constructor](https://tc39.es/ecma262/#sec-regexp-constructor)
- [22.2.4 Properties of the RegExp Constructor](https://tc39.es/ecma262/#sec-properties-of-the-regexp-constructor)
- [22.2.5 Properties of the RegExp Prototype Object](https://tc39.es/ecma262/#sec-properties-of-the-regexp-prototype-object)

### 1.2 RegExp 语法遵循何标准

JavaScript RegExp 语法主要遵循：
- **ECMA-262** ECMAScript 语言规范（RegExp 构造函数和实例）
- **ECMA-262 Annex B**（Web 历史遗留的 RegExp 特性，如 `RegExp.multiline` → 已废弃）
- 实际浏览器实现参考 **WHATWG RegExp** 规范

### 1.3 RegExp 实例继承的方法

```js
const re = /test/gi;

// 继承自 Object
re.hasOwnProperty('constructor') // true
re.toString() // "/test/gi"

// 继承自 RegExp.prototype
re.test('Test string') // true（test 执行一次匹配）
re.exec('Test string')  // ["test", index: 0, input: "Test string", groups: undefined]
re.source  // "test"（源模式字符串，不含斜杠和标志）
re.flags   // "gi"（所有标志字符串）
re.global  // true
re.ignoreCase // true
re.multiline  // false
re.dotAll    // false
re.sticky    // false
re.unicode   // false
re.unicodeSets // false (ES2024)
re.hasIndices // false
```

---

## 2. RegExp 对象底层机制

### 2.1 exec 的内部过程

`RegExp.prototype.exec` 是正则匹配的核心方法，其内部遵循 [21.2.5.2 RegExpBuiltinExec](https://tc39.es/ecma262/#sec-regexpbuiltinexec) 算法：

```js
// 模拟 exec 核心流程
RegExp.prototype.exec = function(str) {
  // 1. 断言：string 是字符串
  // 2. 执行正则匹配，获取所有匹配和捕获组
  // 3. 返回结果数组（含 index 位置）或 null
};

const result = /test/gi.exec('Test test');
// result = ["test", index: 5, input: "Test test", groups: undefined]
// result[0] = "test"（完整匹配）
// result[1..n] = 捕获组
// result.index = 匹配位置
// result.input = 原字符串
// result.groups = 具名捕获组对象
```

### 2.2 test vs exec

```js
// test — 仅返回布尔值，性能更好（不需要返回捕获信息）
/\d/.test('abc123') // true

// exec — 返回匹配详情（含位置、捕获组），更完整
/\d/.exec('abc123') // ["3", index: 5, input: "abc123", groups: undefined]

// ⚠️ 在 global 模式下行为差异
const re = /\d/g;
re.test('abc123') // true（每次调用从上一次结束位置继续）
re.test('abc123') // true
re.test('abc123') // false（第三次已到字符串末尾）
re.test('abc123') // true（循环利用，同一 re 实例）

// ⚠️ 每次创建新实例避免状态问题
/\d/g.test('abc123') // true（每次从头开始）
/\d/g.test('abc123') // true
/\d/g.test('abc123') // true
```

### 2.3 匹配过程的内部机制

```js
// 正则匹配的内部步骤（简化）
function match(regexp, str) {
  // 1. 确定开始位置
  let pos = regexp.lastIndex || 0;
  
  // 2. 尝试从位置 pos 开始匹配
  //    - 使用 NFA（非确定性有限自动机）模拟
  //    - 支持回溯（backtracking）
  
  // 3. 成功：返回结果；失败：返回 null
}

// 回溯示例
/ab{1,3}c/.exec('abbc') 
// 正则引擎过程：a → b{1} → 尝试匹配 c → 失败 → 回溯 → b{2} → 尝试 c → 失败 → 回溯 → b{3} → c → 成功
```

---

## 3. Unicode 属性转义

### 3.1 ES2018 引入 Unicode 属性转义

```js
// \p{...} 匹配 Unicode 属性
/\p{Emoji}/u.test('😊') // true（匹配表情符号）
/\p{Script=Han}/u.test('中') // true（匹配汉字）
/\p{Number}/u.test('①②③') // true（匹配数字符号）

// \P{...} 否定形式
/\P{Emoji}/u.test('a') // true（匹配非表情）
```

### 3.2 常用 Unicode 属性

```js
// 字符集属性
/\p{Script=Latin}/u.test('a')     // true
/\p{Script=Cyrillic}/u.test('Ф')  // true
/\p{Script=Han}/u.test('中')       // true

// 字符类别
/\p{General_Category=Letter}/u.test('A')  // true
/\p{Letter}/u.test('字')                  // true
/\p{Number}/u.test('5')                   // true
/\p{Punctuation}/u.test('!')              // true

// Emoji 属性
/\p{Emoji}/u.test('😊')          // true
/\p{Emoji_Presentation}/u.test('a') // false（a 默认不展示为 Emoji）
/\p{Emoji_Presentation}/u.test('😀') // true

// 组合标记
/\p{Grapheme_Cluster_Break=Extend}/u.test('́') // true（组合用附加符号）
```

### 3.3 ES2024: Unicode Sets (`v` flag)

```js
// ES2024 引入 Unicode Sets，使用 /v 标志
// 更强大的字符类定义能力

// 交集：&& （在 A 中且在 B 中）
/[\p{Decimal_Number}&&[^\p{ASCII}]]/v.test('५') // true（印度数字，非 ASCII）

// 差集：--
/[\p{ASCII}--[aeiou]]/v.test('b') // true（ASCII 辅音）

// 对称差集：~~
/[\p{Decimal_Number}~~[0-9]]/v.test('①②③') // true

// 嵌套属性
/[\p{Script=Han}\p{General_Category=Letter}]/v.test('字') // true
```

---

## 4. 具名捕获组 (Named Capture Groups)

### 4.1 基本语法

```js
// ES2018 引入 (?<name>...) 语法定义具名捕获组
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const result = '2024-03-15'.match(re);

console.log(result.groups); 
// { year: "2024", month: "03", day: "15" }

console.log(result[1]); // "2024"（仍然可用数字索引）
console.log(result.groups.year); // "2024"
```

### 4.2 反向引用具名组

```js
// \k<name> 引用同名捕获组
const re = /(?<quote>["'])[^'"]*\k<quote>/;
// 匹配用相同引号括起的字符串：'hello' 或 "hello"

re.test("'hello'")  // true
re.test('"hello"')  // true
re.test("'hello\"")  // false（引号不匹配）
```

### 4.3 replace 中使用具名组

```js
// String.prototype.replace 支持 $<name> 引用具名组
'2024-03-15'.replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  '$<month>/$<day>/$<year>'
); // "03/15/2024"

// 函数形式的 replace
'2024-03-15'.replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  (match, year, month, day, offset, str, groups) => {
    return `${groups.month}/${groups.day}/${groups.year}`;
  }
); // "03/15/2024"
```

---

## 5. 后行断言 (Lookbehind)

### 5.1 ES2018 引入

```js
// 肯定后行断言：(?<=...)
/(?<=\$)\d+/.exec('the price is $100')[0] // "100"

// 否定后行断言：(?<!...)
/(?<!\$)\d+/.exec('the price is $100')[0] // "the"（失败，从开头匹配失败）
/(?<!\$)\d+/.exec('100 dollars')[0] // "100"（成功，100 前无 $）
```

### 5.2 先行断言与后行断言对比

```js
// 先行断言（lookahead）：检查右侧内容
'foo bar'.match(/\w+(?= bar)/)[0]  // "foo"（"foo" 后面是 " bar"）
'foo bard'.match(/\w+(?= bar)/)    // null（"foo" 后面不是 " bar"）

// 后行断言（lookbehind）：检查左侧内容
'foo bar'.match(/(?<=foo )\w+/)[0] // "bar"（"bar" 前面是 "foo "）
'foo bard'.match(/(?<=foo )\w+/)  // null

// 否定形式
'foo bar'.match(/\w+(?!= bar)/) // "foo" 后不是 " bar"
'foo bard'.match(/\w+(?! bar)/)  // "foo bard" 整体匹配（末尾不满足）
```

### 5.3 在 replace 中应用

```js
// 给数字加上千分位分隔符（负数也适用）
'1234567890'.replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ',')
// "1,234,567,890"

// 价格格式化（添加货币符号）
'1234.56'.replace(/(?<=\d)(?=(\d{3})+\.)/g, ',')
// "1,234.56"
```

---

## 6. Dotall 模式

### 6.1 `s` 标志

ES2018 引入 `s` (dotAll) 标志，使 `.` 匹配任意字符包括换行符：

```js
// 无 dotAll：. 不匹配换行符
/start[\s\S]*?end/.test('start\nend') // true（\s\S 手动处理）
/start.*end/s.test('start\nend')       // true（ES2018+）

// 默认 dotAll = false
/start.*end/.test('start\nend')       // false
```

### 6.2 dotAll vs [\s\S]

```js
// [\s\S] 是 dotAll 出现前的 workaround
// 两者效果相同，但 [\s\S] 更兼容旧环境

const re1 = /start[\s\S]*?end/;     // 兼容所有环境
const re2 = /start.*?end/s;          // 仅 ES2018+

// ⚠️ 注意：[\s\S] 可以用 *、+、? 等量词，dotAll 下 . 同样可以
```

---

## 7. Sticky 粘性模式

### 7.1 `y` 标志

`y` (sticky) 标志确保正则从 `lastIndex` 位置精确匹配：

```js
const re = /\d/y;
re.lastIndex = 0;
re.test('a1b2c3') // true，匹配位置 1
re.lastIndex      // 2（匹配结束后更新）

re.test('a1b2c3') // false，从位置 2 开始匹配（数字在位置 3）

re.lastIndex = 3;
re.test('a1b2c3') // true，匹配位置 4
```

### 7.2 sticky vs global

| 特性 | `g` | `y` |
|------|-----|-----|
| 多次调用行为 | 自动移动 lastIndex | 从 lastIndex 开始匹配 |
| 匹配失败 | lastIndex=0 | lastIndex 不变 |
| 语义 | 全局匹配 | 粘性匹配（精确位置） |

### 7.3 典型应用：分词

```js
// 使用 sticky 标志实现精确分词
const tokenRe = /\d+|\w+|[^\s\w]+/gy;

function tokenize(str) {
  const tokens = [];
  tokenRe.lastIndex = 0;
  let match;
  while ((match = tokenRe.exec(str))) {
    tokens.push({ value: match[0], index: match.index });
  }
  return tokens;
}

tokenize('42 + 3.14 = 45.14');
// [{value:"42",index:0}, {value:"+",index:3}, ...]
```

---

## 8. RegExp 相关的 Well-Known Symbols

### 8.1 Symbol.match

```js
// 字符串的 match 方法会调用 RegExp 的 Symbol.match
const obj = {
  [Symbol.match](str) {
    return str.includes('test');
  }
};

'test value'.match(obj) // true（调用 obj[Symbol.match]）

// 实用：创建可匹配自定义类型的正则
class Username {
  constructor(name) { this.name = name; }
  
  [Symbol.match](str) {
    return new RegExp(`^${this.name}$`, 'i').test(str);
  }
}

const user = new Username('Alice');
'Alice'.match(user) // true
'alice'.match(user) // true
'Bob'.match(user)    // false
```

### 8.2 Symbol.replace

```js
// String.prototype.replace 调用 RegExp 或字符串参数的 Symbol.replace
class Logger {
  constructor(name) { this.name = name; }
  
  [Symbol.replace](str, replacement) {
    return str.replace(this.name, replacement);
  }
}

const logger = new Logger('ERROR');
'ERROR: something failed'.replace(logger, 'INFO')
// "INFO: something failed"
```

### 8.3 Symbol.search / Symbol.split

```js
// Symbol.search
class Version {
  constructor(version) { this.version = version; }
  
  [Symbol.search](str) {
    return str.search(this.version);
  }
}

'hello 1.2.3 world'.search(new Version('\\d+\\.\\d+\\.\\d+')) // 6

// Symbol.split
class SplitByVersion {
  constructor(version) { this.version = version; }
  
  [Symbol.split](str) {
    return str.split(new RegExp(this.version));
  }
}

'v1.2.3-alpha'.split(new SplitByVersion('\\d+\\.\\d+'))
// ["v", ".3-alpha"]
```

---

## 9. 浏览器对 RegExp 的优化

### 9.1 编译与缓存

现代 JavaScript 引擎（如 V8、SpiderMonkey）在首次遇到正则字面量时，会将正则编译为内部表示并缓存：

```js
// 字面量：引擎可优化（编译时已知模式）
const re = /\w+@\w+\.\w+/; // 快速

// 构造函数：每次调用可能重新编译
const re = new RegExp('\\w+@\\w+\\.\\w+'); // 相对较慢（运行时解析字符串）
```

### 9.2 回溯限制

正则引擎使用回溯（backtracking），但对于某些模式可能产生"灾难性回溯"（catastrophic backtracking）：

```js
// ⚠️ 灾难性回溯示例
/(a+)+b/.test('aaaaa...') // 指数级时间复杂度

// ✅ 安全写法：减少回溯
/(a+)+b/ → /a+b/  // 如果内层 + 无意义
/(ab)+c/  → 保留（无嵌套量词）

// ✅ 使用原子组（但 JS 不支持）或其他技巧
// 参考：消除歧义正则，避免嵌套量词
```

### 9.3 hasIndices flag (ES2022)

```js
// ES2022: /d 标志让 exec 返回匹配的开始和结束索引
const re = /test/d;
const result = re.exec('test test');

console.log(result.indices); // [[0, 4], [0, 4]]
// result.indices[0] = [0, 4] = 完整匹配的起止索引
// result.indices[1] = [0, 4] = 第一个捕获组的起止索引
```

---

## 10. 常见踩坑与最佳实践

### 10.1 转义问题

```js
// ⚠️ 字符串中需双重转义
new RegExp('\\d+') // 匹配数字的 \d

// ⚠️ 用户输入需转义
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 使用
escapeRegex('file[1].js') // "file\\[1\\]\\.js"
```

### 10.2 贪婪 vs 非贪婪

```js
// 贪婪：匹配尽可能多
'12345'.match(/\d+/)[0] // "12345"

// 非贪婪：匹配尽可能少（加 ?）
'12345'.match(/\d+?/)[0] // "1"

// ⚠️ 字符串截取场景
'<div>content</div>'.match(/<.*>/)[0] // "<div>content</div>"（贪婪，匹配整个字符串）

'<div>content</div>'.match(/<.*?>/)[0] // "<div>"（非贪婪，匹配第一个闭合标签）
```

### 10.3 lastIndex 在 global/sticky 模式下的问题

```js
// ⚠️ exec 修改 lastIndex
const re = /\d/g;
console.log(re.exec('1')); // ["1", index: 0]
console.log(re.exec('1')); // null（lastIndex = 1，但 '1' 长度 = 1）

// ✅ 解决方案：每次重新创建实例
function findAll(str, pattern) {
  const re = new RegExp(pattern, 'g');
  const results = [];
  let match;
  while ((match = re.exec(str)) !== null) {
    results.push(match[0]);
  }
  return results;
}
```

### 10.4 捕获组编号

```js
// ⚠️ 捕获组编号按左括号出现顺序
/((\w+)\s(\w+))\s(\w+)/.exec('hello world foo')
// ["hello world foo", "hello world", "hello", "world", "foo"]
//  0 = 完整匹配
//  1 = 第一个 (\w+) = "hello"
//  2 = 第二个 (\w+) = "world"
// ...

// ✅ 使用具名组避免混淆
/(?<first>\w+)\s(?<second>\w+)/.exec('hello world')
// groups = { first: "hello", second: "world" }
```

### 10.5 unicode 标志的影响

```js
// ⚠️ 无 u 标志：Unicode 视为两个字节，. 只匹配 ASCII 范围
/./.test('中') // false（无 u，. 不匹配多字节字符）

// ✅ 有 u 标志：正确处理 Unicode 字符
/./u.test('中') // true

// ⚠️ u 标志还影响 \u{...} 语法
/\u{1F600}/u.test('😀') // true（正确匹配 Emoji）
```

---

## 参考资料

- [ECMAScript RegExp 规范 (tc39.es)](https://tc39.es/ecma262/#sec-regexp-regular-expression-objects)
- [WHATWG RegExp 规范](https://webidl.spec.whatwg.org/#idl-RegExp)
- [MDN RegExp 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [MDN 正则表达式指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [V8 引擎 RegExp 优化](https://v8.dev/blog/regexp-tier-up)
- [Regexbuddy 正则测试工具](https://www.regexbuddy.com/)
- [正则表达式可视化](https://regexper.com/)
