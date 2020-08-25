const { expect } = require('chai');
describe('静态方法', function () {
  it('static 可继承', function () {
    class Parent {
      static a = 1;
      static getA() {
        return Parent.a;
      }
    }
    class Children extends Parent {}
    expect(Children.a).to.eq(1);
    s;
    expect(Children.getA()).to.eq(1);
    // Parent 是 类 Children 的原型
    expect(Parent.isPrototypeOf(Children)).to.true;
  });
});
