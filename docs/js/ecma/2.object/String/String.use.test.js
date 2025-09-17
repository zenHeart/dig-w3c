const { expect } = require('chai');
const utils = require('./src/utils');

describe('String 用例', function () {
  describe('numberFormat 数字千分位', function () {
    it('多为转换', function () {
      expect(utils.numberFormat(2331)).to.equal('2,331');
      expect(utils.numberFormat(2111331)).to.equal('2,111,331');
      expect(utils.numberFormat(123)).to.equal('123');
    });
  });
  describe('timeConvert', function () {
    it('格式转换', function () {
      expect(utils.timeConvert('2019-03-12')).to.equal('03/12/2019');
    });
  });
  describe('strTrim', function () {
    it('删除行首行尾空白', function () {
      let testData = [
        {
          input: '  a ',
          expect: 'a',
        },
        {
          input: '  a  a 11 ',
          expect: 'a  a 11',
        },
        {
          input: `  a a \n11\n `,
          expect: `a a \n11`,
        },
      ];

      testData.forEach(ele => {
        expect(utils.strTrim(ele.input)).to.equal(ele.expect);
      });
    });
  });
  describe.skip('upperWord', function () {
    it('删除行首行尾空白', function () {
      let testData = [
        {
          input: 'tom-jack',
          expect: 'Tom Jack',
        }
      ];

      testData.forEach(ele => {
        expect(utils.upperWord(ele.input)).to.equal(ele.expect);
      });
    });
  });
  describe.skip('camelWord', function () {
    it('驼峰转换', function () {
      let testData = [
        {
          input: 'tom_jack',
          expect: 'tomJack',
        }
      ];

      testData.forEach(ele => {
        expect(utils.upperWord(ele.input)).to.equal(ele.expect);
      });
    });
  });
  describe('letter occurence times', function () {
    it('check letter', function () {
      let str = 'abcdaaa';
      expect(utils.occurrenceNum(str, 'a')).eq(4)
      expect(utils.occurrenceNum(str, 'ab')).eq(1)
      expect(utils.occurrenceNum(str, 'abcg')).eq(0)
    })
  })
});
