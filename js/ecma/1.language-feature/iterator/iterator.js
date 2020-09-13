// 迭代器函数传入数组，返回迭代器对象
exports.CustomIterator = class CustomIterator {
    constructor(arr) {
        if(!Array.isArray(arr)) {
            throw new Error('input not array');
        }

        this._arr = arr;
        // 记录迭代位置
        this._currentIndex = 0;
    }
    next() {
        // 指针未超出范围
        if(this._currentIndex < this._arr.length) {
            this._currentIndex++;
            return {
                value: this._arr[this._currentIndex - 1],
                done: false
            }
        } else { // 以循环完毕
            return {
                value: undefined,
                done: true
            }
        }
    }
}

// 采用函数方式返回
exports.createIterator = function creatIterator(arr) {
    let i =0 ;
    if(!Array.isArray(arr)) {
        throw new Error('input not error');
    }
    // 返回迭代器对象
    return {
        next() {
            // 基于值考量
            let done = (i >= arr.length);
            let value = !done ? arr[i++] : undefined;
            return {
                done,
                value
            }
        }
    }

}
// 采用函数方式返回
exports.iteratorArr = function * iteratorArr(arr) {
    for(let i =0;i< arr.length;i++) {
         yield arr[i]
    }
}
exports.isIterable = function(obj) {
    return typeof obj[Symbol.iterator] === 'function'
}