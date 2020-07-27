const { expect, should, assert } = require('chai');

describe('String', function () {
  describe('String init', function () {
    it('charcter is readonly', function () {
      let str = 'abcd'
      str[0] = 'f';
      delete str[0]
      str[0] = undefined;

      // 无法修改 string 的值
      expect(str).eq('abcd')
    })
    it('new String create primitive object', function () {
      let str = new String('abcd')

      expect(typeof str).eq('object')
    })
    it('string compare use dictionay ', function () {
      let str1 = 'bcd'
      let str2 = 'a'

      expect(str1 > str2).eq(true)
    })
  })
  describe('String.fromCharCode', function () {
    it('convert utf-16 to string', function () {
      let str = String.fromCharCode(0x30, 0x42, 0x43)

      expect(str).eq('0BC')
    })
    it('use pair convert over date', function () {
      let str = String.fromCharCode(55356, 57091);

      expect(str).eq('🌃')
    })
  })
  describe('String.fromCodePoint', function () {
    it('convert  to string', function () {
      let str = String.fromCodePoint(0x30, 0x42, 0x43)

      expect(str).eq('0BC')
    })
    it('convert over utf-16 data', function () {
      let str = String.fromCodePoint(55356, 57091);
      let str1 = String.fromCodePoint(0x1F303);

      expect(str).eq('🌃')
      expect(str1).eq('🌃')
    })
  })


});
