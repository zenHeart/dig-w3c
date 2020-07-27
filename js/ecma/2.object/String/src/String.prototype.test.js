const {expect, should, assert} = require ('chai');

describe ('String.prototype', function () {
  describe('String.prototype.charAt',function() {
    it('get certain index value',function() {
      let str = 'abcd'

      // 无法修改 string 的值
      expect(str.charAt(0)).eq('a')
    })
    it('default return first character ',function() {
      expect('abcd'.charAt()).eq('a')
    })
    it('negative value or invaled value return empty',function() {
      expect('abcd'.charAt(-2)).eq('')
      expect('abcd'.charAt(10)).eq('')
    })
  })
  describe('String.prototype.charCodeAt',function() {
    it('get char encode number',function() {
      expect('012'.charCodeAt(1)).eq(49)
    })
  })

});
