/**
 * 验证 weakset 由于需要出发 gc 回收，weakset 才可以有效
 */
const { inspect } = require('util');

let a = {a:1}
let b = new WeakSet()
b.add(a)

console.log(inspect(b, { showHidden: true }));
a=undefined


setTimeout(() => {gc();console.log('gc already run')},5000)
setInterval(() => console.log(inspect(b, { showHidden: true })),2000)
