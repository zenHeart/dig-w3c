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
   it("(arg1,arg2,..)=> {代码块},返回代码块结果",function () {
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
            yield 'sundown';
        }
        //实例化一个迭代器
        var g = sunMove();

        //next 切换状态到
        expect(g.next(),'next 切换到第一个 yield 状态,返回对象,value 指代 yield 当前表达式的值,done 表示是否迭代结束').to.be.deep.equal({ value: 'sunrise', done: false });
        expect(g.next(),'next 切换状态状态到 sundown').to.be.deep.equal({ value: 'sundown', done: false });
        expect(g.next(),'next 执行结束,value 返回函数执行结果,没有则为 undefined').to.be.deep.equal({ value:undefined, done: true });
        expect(g.next(),'执行结束后的迭代调用 next 返回相同结果').to.be.deep.equal({ value:undefined, done: true });
        expect(sunMove().next(),'重新实例化一个迭代器').to.be.deep.equal({ value: 'sunrise', done: false });
    })
})

