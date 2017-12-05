require('babel-polyfill');
const {expect,should,assert} = require('chai');

//箭头函数
describe('[传入参数] => [表达式|代码块] 测试箭头函数',function () {
   it(" () => 表达式,函数返回表达式结果",function () {
       var ret1 = () =>  1;
       expect(ret1()).to.be.equal(1);
   });
   it(" arg => 表达式,可以不带括号 ",function () {
       var autoAdd1 = n => n + 1;
       expect(autoAdd1(1)).to.be.equal(2);
   });
   it(" (arg1,arg2) => 表达式",function () {

       var autoAddn = (n1,n) => n1 + n;
       expect(autoAddn(1,4)).to.be.equal(5);
   });

   //todo 该函数返回非预期
   it.skip("(arg1,arg2,..)=> {代码块},返回代码块结果",function () {
       var squareN = (n) => {
           n = n^2;
           return n^2;
       };

       //todo 返回非预期需要分析
       expect(squareN(2)).to.be.equal(4);
   })
});

describe('class 语法,底层仍采用原型链封装',function(){
    it('class 申明类',function() {
        class Person {
            constructor(name) {
                this.name = name;
            } //声明类

            //申明方法无需使用函数字面量形式
            showName() {
                console.log(this.name);
            }
        }

        var person = new Person('zenheart');

        expect(person).to.be.instanceOf(Person);
        expect(person.name).to.be.equal('zenheart');
    })
    it('extends 定义继承模式',function() {
        class Person {

            constructor(name) {
                this.name = name;
            } //声明类

            //申明方法无需使用函数字面量形式
            showName() {
                console.log(this.name);
            }
        }
        class Student extends Person {
            constructor(name,school) {
                super(name);
                this.school = school;
            } //声明类

            //申明方法无需使用函数字面量形式
            showInfo() {
                console.log(`name:%s,school:%s`,this.name,this.school);
            }
        }

        var student = new Student('zenheart','test');

        expect(student).to.be.instanceOf(Student);
        expect(student.name).to.be.equal('zenheart');
        expect(student.school).to.be.equal('test');
    })

});

/*
* 必须在顶层导出模块
* 变量名必须和模块中导出变量一致
* 可以使用 as 重命名
* import 会被提升
* */

//import 属于静态加载,一个模块只能加载一次,多次加载会被覆盖
import {arr as arrValue,foo}  from './test_module';
describe('Module 语法',function(){
    it('import 基本导入',function() {
        expect(arrValue).to.be.deep.equal([1,2,3]);
        expect(foo).to.be.equal(1);
    })
})

describe('generator 测试',function(){
    it('function * 申明 generator 函数,next 向下执行函数',function() {
        function * Sum(a,b) {
            return a + b;
        }
        var gSum = Sum(1,2);

        expect(gSum,'执行 Sum() 相当于实例化一个迭代器,并没有真正运行函数').to.be.instanceof(Sum);
        expect(gSum.next(),'利用 next 方法触发函数执行,返回对象,value 属性保存执行结果,done 判断执行是否结束').to.be.deep.equal({value:3,done:true});
        expect(gSum.next(),'继续调用 next 返回 undefined').to.be.deep.equal({value:undefined,done:true});
    });

    it('yield 放在表达式或代码块前,申明函数的执行阶段',function() {
        function * sunMove() {
            yield 'sunrise';
            yield ;//申明一个空的 yield 阶段返回 undefined
            console.log((yield 'noon'));//yield 在另一个表达式中必须包含括号
            yield 'sundown';
        }
        //实例化一个迭代器
        var g = sunMove();

        /*
        * yield 申明函数阶段
        * next 切换函数阶段*/
        expect(g.next(),'next 切换到第一个 yield 状态,返回对象,value 指代 yield 当前表达式的值,done 表示是否迭代结束').to.be.deep.equal({ value: 'sunrise', done: false });
        expect(g.next(),'next 空的 yiled 表达式 value 为 undefined').to.be.deep.equal({ value: undefined, done: false });
        expect(g.next(),'yield 嵌套在其他表达使用必须带括号').to.be.deep.equal({ value: 'noon', done: false });
        expect(g.next()).to.be.deep.equal({ value:'sundown', done: false });
        expect(g.next(),'执行结束后的调用 next 返回 undefined').to.be.deep.equal({ value:undefined, done: true });
        expect(sunMove().next(),'重新实例化一个迭代器').to.be.deep.equal({ value: 'sunrise', done: false });
    })
})

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

        expect(myAdd(1,2)).to.be.an.instanceOf(Promise);
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
                console.log('此处不会执行!');
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
                console.log('----捕获错误成功-------', e.message);
            }
            //此处会继续执行
            return await (()=>{
                console.log('此处会继续执行!');
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
});




