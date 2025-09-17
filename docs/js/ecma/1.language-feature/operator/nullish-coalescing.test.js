const {expect, should, assert} = require ('chai');

//箭头函数
describe ('??', function () {
    it('when left null or undefined use right value', function() {
      let a;
      expect(a ?? 3).eq(3)
    })
    it('when left has value not change', function() {
      let a = 0;
      expect(a ?? 3).eq(0)
    })
});
