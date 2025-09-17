/* // 验证 promise.all 在挂起时的逻辑
function createPromise(num) {
    return new Promise((resolve, reject) => {
        if (num < 4) {
            return resolve(num);
        } else {
            // throw new Error('df')
            // reject(new Error('df'));
        }
    });
}

Promise.all(new Array(6).fill(0).map((ele, index) => createPromise(index)))
    .then(res => console.log(res))
    .catch(err => console.log(err.message));

// 验证 reject 后 resolve 会不会执行
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
        console.log('demo');
        // throw new Error ('demo');
        reject(new Error('demo'));
    }, 1000);
})
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log('err:', err.message);
    });
 */
// 验证 返回的值若包含 then 方法,则
/* let newPromise;
a = Promise.resolve(100)
    .then(function(res) {
        newPromise = Promise.resolve(res);
        // return newPromise;
        return { then: f => f(newPromise) };
    })
    .then(res => {
        console.log(res);
    }); */

// 避免 promise 递归
a = Promise.resolve(1);
b = a.then(() => a);
b.then(console.log);
