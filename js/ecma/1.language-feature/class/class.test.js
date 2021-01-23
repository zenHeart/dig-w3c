const { expect, should, assert } = require('chai');

describe('class 语法,底层仍采用原型链封装', function() {
  it('class 申明类', function() {
    class Person {
      constructor(name) {
        this.name = name;
      } //声明类
    }

    var person = new Person('zenheart');

    expect(person).to.be.instanceOf(Person);
    expect(person.name).to.be.equal('zenheart');
  });
  it('extends 定义继承模式', function() {
    class Person {
      constructor(name) {
        this.name = name;
      } //声明类
    }
    class Student extends Person {
      constructor(name, school) {
        super(name);
        this.school = school;
      } //声明类
    }

    var student = new Student('zenheart', 'test');

    expect(student).to.be.instanceOf(Student);
    expect(student.name).to.be.equal('zenheart');
    expect(student.school).to.be.equal('test');
  });
  describe('private', function() {
    it('私有变量可以在类中访问', function() {
      class Message {
        #message;
        constructor(msg) {
          this.#message = msg;
        }
        static greet() {
         let a = this.#message
        }
        getMsg() {
         return this.#message; 
        }
      }
      expect(new Message('home').getMsg()).eq('home');
    });
    it('私有变量无法在外部和静态方法访问', function() {
      class Message {
        #message;
        constructor(msg) {
          this.#message = msg;
        }
        static greet() {
         let a = this.#message
        }
      }
      expect(() => Message.greet()).throw(/private member #message/);
    });
    it('私有访问器属性', function() {
      class Message {
        log() {
          return this.#time;
        }
        get #time() {
          return new Date();
        }
      }
      expect(new Message().log()).match(new RegExp(new Date().getFullYear()));
    });
  });
});
