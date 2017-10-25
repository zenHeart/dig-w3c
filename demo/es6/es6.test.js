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
   it("(arg1,arg2,..)=> {代码块},返回代码块结果",function () {
       var squareN = (n) => {
           n = n^2;
           return n;
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