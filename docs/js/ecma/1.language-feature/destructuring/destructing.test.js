const { expect } = require('chai');

describe('destructing 解构', function() {
  it('对象解构数组属性', function() {
    let url = 'quiz.typeofnan.dev';
    let { length: ln, [ln - 1]: domain = 'quiz' } = url
      .split('.')
      .filter(Boolean);

    expect(domain).eq('dev');
  });
  describe('对象解构', function() {
    it('对象剩余项实现特定去除子集', function() {
      let foo = {
        a: 1,
        b: 2,
        c: 3
      };
      // 排出 b 字段
      let { b, ...exceptB } = foo;
      expect(exceptB).to.deep.eq({
        a: 1,
        c: 3
      });
    });
    it('嵌套对象使用剩余项', function() {
      let foo = {
        a: 1,
        b: 2,
        c: 3,
        bar: {
          a: 1,
          b: 2,
          c: 3
        }
      };
      // 排出 b 字段
      let {
        b,
        bar: { c, ...exceptC }
      } = foo;
      expect(exceptC).to.deep.eq({
        a: 1,
        b: 2
      });
    });
  });
});
