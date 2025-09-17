require('babel-polyfill');

/**
 * 验证扩展语法
 */
const {expect} = require('chai');

describe("测试 async 函数",function() {
    /**
     * 1. 使用 async 申明函数
     * 2. 使用 await 定义返回值
     * 3. 注意 await 的返回值必须是 promise 对象
     *  */
    it("async 基本使用",function(done) {
        async function  asyncAdd(a,b) {
            return await new Promise(function (resolve,reject) {
                setTimeout(function () {
                    if(Number.isInteger(a) && Number.isInteger(b)) {
                        resolve(a + b);
                    } else {
                        reject(new Eror('确定输入为整型!'));

                    }
                },10)
            })
        }

        asyncAdd(1,2).then(function (result) {
            expect(result).to.equal(3);
            done();
        }).catch(function (e) {
           expect(e).to.throw('确定输入为整型!')
            done();
        });
    });

    it("验证 async 属性",function(done) {
        /**
         * 验证 async 申明函数返回 promise 对象
         * 返回值作为 resolve 结果
         *
         * */
        async function myAdd(a,b) {
            return  a + b;
        }
        
        expect(myAdd(1,2)).to.be.an.a('promise');
        expect(myAdd(1,2)).to.be.an.instanceof(Object);
        myAdd(1,2).then(function (result) {
            expect(result).to.equal(3);
            done();
        });
    });
    it("验证 async 内部错误会以 reject 方式返回",function(done) {
        async function myAdd(a,b) {
            throw new Error('unexpected error')
        }

        myAdd(1,2).catch(function (e) {
            expect(e.message).to.equal('unexpected error');
            done();
        })
    });
    it("验证 await 返回值会被转换为 promise 的 resolve,reject 状态",function(done) {
        async function myAdd(a,b) {
            if(Number.isInteger(a) && Number.isInteger(b)) {
                return await a + b;
            } else {
                return await (() => {throw new Error('unexpected error')})();
            }
        }

        myAdd(1,2).then(function (result) {
            expect(result).to.equal(3);
            return 1;
        }).then(function () {
            return myAdd(1,'2');
        }).catch(function (e) {
            expect(e.message).to.equal('unexpected error');
            done();
        })
    });

    it("验证 await 的异常处理逻辑",function(done) {
        async function myAdd(a,b) {
            await (() => {throw new Error('unexpected error!')})();
            //此处不会执行
            return await (()=>{
                return a+b;
            })()
        }

        myAdd(1,2).catch(function (e) {
            expect(e.message).to.equal('unexpected error!');
            done();
        })
    });

    it("利用 try,catch 结构捕获异步执行的错误",function(done) {
        async function myAdd(a,b) {
            try{
                await (() => {throw new Error('unexpected error!')})();
            } catch (e) {
                /**
                 * 若不期望 await 的执行错误阻断后续操作,利用 catch 捕获错误
                 * 测试发现,无法在非 promise 对象上直接使用 catch 方法进行错误捕获
                 * */
            }
            //此处会继续执行
            return await (()=>{
                return a+b;
            })()
        }

        myAdd(1,2).then(function (result) {
            expect(result).to.equal(3);
            done();
        })
    });

    it("验证 await 的继发特性",function(done) {
        function myAddNs(a,b,n) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(a + b);
                },n);
            })
        }
        async function myTwiceAdd(a,b) {
            /**
             * 由于 await 结果 2 在结果 1 返回 promise 对象后才会触发
             * 变成了顺序执行,执行时间会将近 400ms
             * 在使用 await 时一定要注意,异步函数之间是否有调用关系
             * */

            const result1 = await myAddNs(a,b,200);
            const result2 = await myAddNs(a,b,200);

            return result1 + result2;
        }
        const startTime = process.hrtime();


        myTwiceAdd(1,1).then(function (result) {
            //验证加法执行了两次
            const spendTime = process.hrtime(startTime);
            expect(result).to.equal(4);
            expect(spendTime[1]).to.above(400*1e6);
            done();
        })
    });

    it("修复 await 异步继发导致的函数阻塞",function(done) {
        function myAddNs(a,b,n) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(a + b);
                },n );
            })
        }
        async function myTwiceAdd(a,b) {
            /**
             * 由于 await 结果 2 在结果 1 返回 promise 对象后才会触发
             * 变成了顺序执行,执行时间会将近 4 s
             * 在使用 await 时一定要注意,异步函数之间是否有调用关系
             *
             * 也可使用 await Promise.all() 的方式并行执行上述异步操作
             * */

            const result1Promise = myAddNs(a,b,200);
            const result2Promise = myAddNs(a,b,200);
            //注意这里先执行 promise ,利用 await 等待所有结果
            return await result1Promise + await result2Promise;
        }
        const startTime = process.hrtime();

        myTwiceAdd(1,1).then(function (result) {
            //验证加法执行了两次
            const spendTime = process.hrtime(startTime);

            expect(result).to.equal(4);
            expect(spendTime[1]).to.below(300*1e6);
            done();
        })
    });

    it('验证 async 接收 return 结果',function(done) {
        async function returnVal() {
           return Promise.resolve('res')
        }

        returnVal().then(res => {
            expect(res).to.equal('res')
            done()
        })
    })
    it('验证 async 若不返回结果默认为 undefined',function(done) {
        async function returnVal() {
             Promise.resolve('res')
         }
      
         returnVal().then(res => {
            expect(res).to.undefined
            done()
        })
    })
    it('async of await loop promise',async function() {
        async function loopAsync() {
            let events = [
                Promise.resolve(1),
                Promise.resolve(2),
                Promise.resolve(3),
            ]
            let ret = []
            // be careful await is out side variable
            for await (let  res of  events) {
                ret.push(res)
            }
            return ret
        }
        let res = await loopAsync();
        expect(res).deep.eq([1, 2, 3])
    })
});




