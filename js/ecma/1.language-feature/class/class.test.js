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
      expect(() => Message.greet()).throw(/get private field on non-instance/);
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

  describe('super', function() {
    it('can`t return super', function() {
      // add test case
    })
    it('super only access in method and object literal', function() {
      // add test case
    })
    it('super can access parent method', function() {
      class A {
        greet() {
          return 1
        }
      }
      class B extends A {
        greet() {
          return 2;
        }
        a() {
          return super.greet()
        }
      }
      let b = new B();

      expect(b.a()).eq(1)
      expect(b.greet()).eq(2)
    })
    it('access super property', function() {
      class A { }
      A.prototype.x = 100;
      
      class B extends A {
        m() {
          return super.x;
        }
      }
      const b = new B();
      
      expect(b.m()).eq(100)

    })
  })
});
