// 验证 promise.all 在挂起时的逻辑
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
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));