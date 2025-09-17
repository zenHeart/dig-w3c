const { expect, should, assert } = require('chai');

//箭头函数
describe('template string', function () {
  describe('tagged templates', function () {
    it('test tagged parameter 0 is split string array', function () {
      let tag = (a) => a;
      let testData = {
        input: tag`${0}a ${1} b ${2} 3${4}`,
        // be careful when start or end has expression result will have empty string
        expect: ["", 'a ', ' b ', ' 3', ""]
      }
      // be careful space also keep 
      expect(testData.input).deep.equal(testData.expect)
    })
    it('test empty value will convert to string',function() {
      expect(`${undefined}`).deep.equal('undefined')
      expect(`${null}`).deep.equal('null')
    })
    it('test tagged parameter 0 has raw property', function () {
      let tag = (a) => a.raw;
      let testData = {
        input: tag`a${1}b${2}3\n`,
        // 注意转移字符会加额外的 \ 区分
        expect: ['a', 'b', '3\\n']
      }
      // be careful space also keep 
      expect(testData.input).deep.equal(testData.expect)
    })
    it('test tagged parameter others is expression result', function () {
      let tag = (a, ...args) => args;
      let testData = {
        input: tag`a ${1 + 3} b ${2 + 4} 3${true} ${{ a: 1 }}`,
        expect: [4, 6, true, { a: 1 }]
      }
      // be careful space also keep 
      expect(testData.input).deep.equal(testData.expect)
    })
    it('test tagged return  can any value', function () {
      let testData = {
        input: ((a, ...args) => 1)`a ${1 + 3} b ${2 + 4} 3${true} ${{ a: 1 }}`,
        expect: 1
      }
      // be careful space also keep 
      expect(testData.input).equal(testData.expect)
    })
  })

  describe('tagged template use case', function () {
    it('use tagged template process highlight', function () {
      let hightLight = (str, ...values) => str.reduce((sum, el, i) => (sum += el + (values[i] !== undefined ? `<span class="h1">${values[i]} </span>` : '')), '')

      let testData = {
        input: hightLight`${1} 2 3 4 ${5}${6}7${0}`,
        expect: '<span class="h1">1 </span> 2 3 4 <span class="h1">5 </span><span class="h1">6 </span>7<span class="h1">0 </span>'
      }
      expect(testData.input).eq(testData.expect)
    })
  })
});
