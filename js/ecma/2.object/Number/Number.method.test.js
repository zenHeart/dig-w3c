const { expect } = require('chai');
describe('Number 静态方法测试', function() {
  describe('Number.isInteger(value)', function() {
    it('判断是否为整数', function() {
      let testData = [
        [0x01, true],
        [1, true],
        [1.0, true],
        [0, true],
        [-1, true],
        [NaN, false],
        [0.1, false],
        ['a', false]
      ];

      testData.forEach(ele => {
        expect(Number.isInteger(ele[0])).to.eq(ele[1]);
      });
    });
  });
});
