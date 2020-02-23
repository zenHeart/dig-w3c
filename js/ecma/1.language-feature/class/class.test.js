const {expect,should,assert} = require('chai');

describe('class 语法,底层仍采用原型链封装',function(){
    it('class 申明类',function() {
        class Person {
            constructor(name) {
                this.name = name;
            } //声明类

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

        }
        class Student extends Person {
            constructor(name,school) {
                super(name);
                this.school = school;
            } //声明类
        }

        var student = new Student('zenheart','test');

        expect(student).to.be.instanceOf(Student);
        expect(student.name).to.be.equal('zenheart');
        expect(student.school).to.be.equal('test');
    })

});



