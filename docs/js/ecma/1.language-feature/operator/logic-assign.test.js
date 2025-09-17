const {expect, should, assert} = require ('chai');

//箭头函数
describe('logic assignment operator', function () {
  describe('||=', function() {
    it('when left empty use right value', function() {
      let a;
      expect(a||=3).eq(3)
    })
    it('when left has value no change', function() {
      let a = 1;
      expect(a||=3).eq(1)
    })
  })

  describe('&&=', function() {
    it('when left has value use right value', function() {
      let a = 1;
      expect(a&&=3).eq(3)
    })
    it('when left empty no change', function() {
      let a;
      expect(a&&=3).undefined
    })
  })

  describe('??=', function() {
    it('when left is null or empty use right value', function() {
      let a;
      let b;
      expect(a??=3).eq(3)
      expect(b??=3).eq(3)
    })
    it('when left is not null or empty no change', function() {
      let a = 0;
      let b = 1;
      expect(a??=3).eq(0)
      expect(b??=3).eq(1)
    })
  })
});
