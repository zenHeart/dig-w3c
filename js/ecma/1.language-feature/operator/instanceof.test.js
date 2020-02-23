const { expect } = require('chai');
describe('instanceof', function() {
  it('检测构造器的 prototype 是否出现在实例对象原型链', function() {
    function Foo() {}

    let foo = new Foo();
    expect(foo instanceof Foo).to.true;
    expect(foo instanceof Object).to.true;
  });
  it('构造器返回另一个对象实例时 instanceof 会丢失', function() {
    function Foo() {}
    function Bar() {
      return new Foo();
    }
    let bar = new Bar();

    expect(bar instanceof Bar).to.false;
    expect(bar instanceof Foo).to.true;
    expect(bar instanceof Object).to.true;
  });

  it('动态修改构造函数 prototype 造成 instanceof 失效', function() {
    function Foo() {}
    let foo = new Foo();

    expect(foo instanceof Foo).to.true;

    Foo.prototype = {};
    expect(foo instanceof Foo).to.false;
  });

  it('动态修改对象 __proto__ 也会造成 instanceof 失效', function() {
    function Foo() {}
    let foo = new Foo();

    expect(foo instanceof Foo).to.true;

    foo.__proto__ = {};
    expect(foo instanceof Foo).to.false;
  });
});
