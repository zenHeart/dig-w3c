const { expect, should, assert } = require('chai');
const { beforeMonth } = require('./src/index')


describe('Date 实例代码', function () {
  describe('之前的某个月', function () {
    it('格式化区间的错误', function () {
      // 注意在 chrome 报错返回 24:00:20
      expect(beforeMonth('2020-07-31').getMonth()+1).eq(7)
    });
  });
});
