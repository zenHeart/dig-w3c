const { expect } = require('chai');

describe('Symbol 属性验证', function() {
  describe('Symbol.toPrimitive', function() {
    it('利用此方法决定对象转换初始值的规则', function() {
      let obj = {
        [Symbol.toPrimitive](hint) {
          if (hint === 'number') {
            return 1;
          } else if (hint === 'string') {
            return 'obj';
          } else {
            return true;
          }
        }
      };
      // 触发字符串转换
      expect(`${obj}`).to.deep.eq('obj');
      // 触发数值转换
      expect(obj * 1).to.eq(1);
      // 触发默认操作
      expect(obj + '').to.eq('true');
    });
  });
  describe('Symbol.prototype.description', function() {
    it('accessor property to get description for symbol', function() {
        let a = Symbol('test foo');
        expect(a.description).eq('test foo')
    });
  });
});
