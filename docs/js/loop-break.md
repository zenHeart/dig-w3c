# 寰幆鎺у埗锛歜reak 涓?continue 鍦ㄥ悇寰幆涓殑琛ㄧ幇

## 闂鑳屾櫙

涓轰粈涔?`break` 鏈夋椂鏃犳硶姝ｇ‘璺冲嚭寰幆锛熸湰涓婚鍒嗘瀽 `break` 鍜?`continue` 鍦?JavaScript 鍚勭寰幆涓殑琛屼负宸紓銆?
## 寰幆绫诲瀷瀵规瘮琛?
| 寰幆绫诲瀷 | break | continue | 璇存槑 |
|---------|-------|----------|-----|
| `for` | 鉁?鏀寔 | 鉁?鏀寔 | 浼犵粺璁℃暟寰幆 |
| `while` | 鉁?鏀寔 | 鉁?鏀寔 | 鍓嶇疆鏉′欢寰幆 |
| `do...while` | 鉁?鏀寔 | 鉁?鏀寔 | 鍚庣疆鏉′欢寰幆 |
| `for...in` | 鉁?鏀寔 | 鉁?鏀寔 | 閬嶅巻瀵硅薄鍙灇涓惧睘鎬?|
| `for...of` | 鉁?鏀寔 | 鉁?鏀寔 | 閬嶅巻鍙凯浠ｅ璞?|
| `forEach` | 鉂?涓嶆敮鎸?| 鉂?涓嶆敮鎸?| 鏁扮粍鏂规硶 |
| `map/filter/reduce` | 鉂?涓嶆敮鎸?| 鉂?涓嶆敮鎸?| 鏁扮粍鏂规硶 |

## 璇︾粏鍒嗘瀽

### for 寰幆

```javascript
// break 瀹屽叏鏀寔
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0,1,2,3,4
}

// continue 瀹屽叏鏀寔
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i); // 0,1,3,4
}
```

### for...in 寰幆

```javascript
const obj = { a: 1, b: 2, c: 3 };

// break 瀹屽叏鏀寔
for (const key in obj) {
  if (key === 'b') break;
  console.log(key, obj[key]); // a:1
}

// continue 瀹屽叏鏀寔
for (const key in obj) {
  if (key === 'b') continue;
  console.log(key, obj[key]); // a:1, c:3
}
```

### for...of 寰幆

```javascript
const arr = [1, 2, 3, 4, 5];

// break 瀹屽叏鏀寔
for (const item of arr) {
  if (item === 3) break;
  console.log(item); // 1, 2
}

// continue 瀹屽叏鏀寔
for (const item of arr) {
  if (item === 3) continue;
  console.log(item); // 1, 2, 4, 5
}
```

### forEach锛堜笉鏀寔 break/continue锛?
```javascript
const arr = [1, 2, 3, 4, 5];

// 鉂?鏃犳硶浣跨敤 break/continue
arr.forEach(item => {
  if (item === 3) break; // 璇硶閿欒
});
```

**鏇夸唬鏂规**锛?- 浣跨敤 `for...of` + `break`
- 浣跨敤 `Array.some()` 杩斿洖 `true` 鍙仠姝?- 浣跨敤 `Array.find()` 鎵惧埌鍚庤嚜鍔ㄥ仠姝?
```javascript
// 鏇夸唬 forEach + break
for (const item of arr) {
  if (item === 3) break;
  console.log(item); // 1, 2
}

// 浣跨敤 some 妯℃嫙 break
arr.some(item => {
  if (item === 3) return true; // 鍋滄
  console.log(item); // 1, 2
  return false;
});
```

## 宓屽寰幆涓殑 break

**鍏抽敭鐐?*锛歚break` 鍙兘璺冲嚭**鐩存帴鍖呭惈**鐨勯偅涓€灞傚惊鐜€?
```javascript
// 鉂?break 鍙兘璺冲嚭鍐呭眰寰幆
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break; // 鍙烦鍑哄唴灞?j 寰幆
    console.log(i, j);
  }
}
// 杈撳嚭: (0,0), (1,0), (2,0)

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1) break; // 鍙烦鍑?i=1 鏃剁殑鍐呭眰寰幆
    console.log(i, j);
  }
}
// 杈撳嚭: (0,0),(0,1),(0,2), (2,0),(2,1),(2,2)
```

### 璺冲嚭澶栧眰寰幆鐨勬柟娉?
```javascript
// 鏂规硶 1锛氭爣璁帮紙涓嶆帹鑽愶級
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break outer; // 璺冲嚭澶栧眰寰幆
    console.log(i, j);
  }
}
// 杈撳嚭: (0,0)

// 鏂规硶 2锛氭彁鍙栦负鍑芥暟锛堟帹鑽愶級
function findPair() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j === 1) return; // 鍑芥暟杩斿洖鍗宠烦鍑烘墍鏈夊惊鐜?      console.log(i, j);
    }
  }
}
findPair();
// 杈撳嚭: (0,0)

// 鏂规硶 3锛氳缃爣蹇椾綅
let found = false;
for (let i = 0; i < 3 && !found; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) { found = true; break; }
    console.log(i, j);
  }
}
// 杈撳嚭: (0,0)
```

## for...in 鐨勭壒娈婃敞鎰忎簨椤?
### 1. key 鏄瓧绗︿覆涓嶆槸鏁板瓧

```javascript
const arr = ['a', 'b', 'c'];
for (const i in arr) {
  console.log(typeof i, i); // "string" "0", "1", "2"
}
```

### 2. 浼氶亶鍘嗗師鍨嬮摼涓婄殑灞炴€?
```javascript
const parent = { x: 1 };
const child = Object.create(parent);
child.y = 2;
child.z = 3;

for (const key in child) {
  if (!Object.hasOwn(child, key)) continue;
  console.log(key, child[key]); // y:2, z:3 (涓嶄細杈撳嚭 x:1)
}
```

### 3. 涓嶄繚璇侀『搴?
```javascript
// for...in 涓嶄繚璇佸睘鎬ч亶鍘嗛『搴?const obj = { b: 2, a: 1, c: 3 };
for (const key in obj) {
  console.log(key, obj[key]); // 椤哄簭涓嶇‘瀹?}
```

## 寰幆閫夋嫨鎸囧崡

| 鍦烘櫙 | 鎺ㄨ崘寰幆 | 鍘熷洜 |
|-----|---------|-----|
| 璁℃暟寰幆 | `for` | 鎬ц兘鏈€濂?|
| 瀵硅薄灞炴€ч亶鍘?| `for...in` + `hasOwnProperty` | 鍞竴閫夋嫨 |
| 鏁扮粍閬嶅巻锛堥渶 break锛墊 `for...of` | 鏀寔 break/continue |
| 鏁扮粍閬嶅巻锛堟棤闇€ break锛墊 `forEach`/`map` | 璇箟娓呮櫚 |
| 鏌ユ壘鍏冪礌 | `find`/`some` | 鎵惧埌鍗冲仠 |
| 鏉′欢杩囨护 | `filter` | 鍘熺敓鏀寔 |

## 甯歌璇尯

### 璇尯 1锛氬湪 forEach 涓娇鐢?break

```javascript
// 鉂?閿欒
[1, 2, 3].forEach(item => {
  if (item === 2) break; // SyntaxError
});

// 鉁?姝ｇ‘
for (const item of [1, 2, 3]) {
  if (item === 2) break;
  console.log(item);
}
```

### 璇尯 2锛氭贩娣?for...in 鍜?for...of

```javascript
const arr = ['a', 'b', 'c'];

// 鉂?for...in 閬嶅巻鐨勬槸绱㈠紩锛堝瓧绗︿覆锛?for (const index in arr) {
  console.log(index, typeof index); // "0" string
}

// 鉁?for...of 閬嶅巻鐨勬槸鍊?for (const value of arr) {
  console.log(value); // "a", "b", "c"
}
```

### 璇尯 3锛氬湪宓屽寰幆涓湡鏈?break 璺冲嚭鎵€鏈夊眰

```javascript
// 鉂?閿欒鐞嗚В
for (const outer of outers) {
  for (const inner of inners) {
    if (condition) break; // 鍙烦鍑?inner
  }
}

// 鉁?濡傛灉闇€瑕佽烦鍑烘墍鏈夊眰锛屼娇鐢ㄦ爣璁版垨鍑芥暟杩斿洖
```

## 鎬荤粨

1. `break` 鍜?`continue` **瀹屽叏鏀寔** `for`/`while`/`for...in`/`for...of`
2. `forEach`/`map` 绛夋暟缁勬柟娉?**涓嶆敮鎸?* `break`/`continue`
3. `break` 鍦ㄥ祵濂楀惊鐜腑**鍙兘璺冲嚭鐩存帴鍖呭惈鐨勪竴灞?*
4. `for...in` 閬嶅巻**閿紙瀛楃涓诧級**涓斿寘鍚師鍨嬮摼灞炴€э紝闇€鐢?`hasOwnProperty` 杩囨护

## 鍙傝€冭祫鏂?
- [MDN - for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
- [MDN - for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [MDN - break](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/break)
- [MDN - continue](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue)
