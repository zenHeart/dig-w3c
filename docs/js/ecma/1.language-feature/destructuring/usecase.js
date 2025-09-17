/**
 * 1. 采用数组解构进行值交换
 * 相比采用 temp 中间变量更简洁
 * 你也可以交换多个元素
 */
let a = 1,
    b = 2,
    c = 3;
[b, a] = [a, b];
console.log(a, b);
[c, a, b] = [a, b, c];
console.log(a, b, c);

/**
 * 2. 提取数组元素若没有则使用初始值
 * 一般方法采用导通运算,这里使用结构默认值更简单
 *
 * 注意也可从其他元素取值
 */
let arr = [];
let [name = 'tom'] = arr;
console.log(name);
[name = 'tom'] = ['jack'];
console.log(name);

/**
 * 3. 浅拷贝,从数组中提取部分元素
 *
 */
const numbers = [1, 2, 3];
const [, ...fooNumbers] = numbers;
console.log(fooNumbers);
const big = {
    foo: 'tom',
    bar: 'value bar'
};
const { foo, ...small } = big;
console.log(small);

/**
 * 解构可迭代对象
 */
const movies = {
    list: [{ title: 'Heat' }, { title: 'Interstellar' }],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.list.length) {
                    const value = this.list[index++].title;
                    return { value, done: false };
                }
                return { done: true };
            }
        };
    }
};
const [firstMovieTitle] = movies;
console.log(firstMovieTitle);

/**
 * 5. 解构动态属性
 */
function greet(obj, nameProp) {
    const { [nameProp]: name = 'Unknown' } = obj;
    console.log(`hello ,${name}`);
}

greet({ name: 'Batman' }, 'name');
greet({}, 'name');

/**
 * 结构剩余值
 */
let [a, ...b] = [1, 2, 3];
