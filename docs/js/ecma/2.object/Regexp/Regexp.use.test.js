const {expect} = require ('chai');
const {searchAllMatch,validPassword,isDateStr} = require ('./src/utils');

describe ('regexp 使用举例 ', function () {
  describe ('searchAllMatch', function () {
    it ('searchAllMatch 查找符合条件的所有结果', function () {
      let testData = {
        input: [/(\d{2})-/, '12-sdf12sdf45-'],
        expect: {
          match: [['12-', '12'], ['45-', '45']],
          times: 2,
        },
	  };
	  
      expect (searchAllMatch.apply (this, testData.input)).to.deep.equal (
        testData.expect
      );
    });
  });
  describe ('validPassword', function () {
    it ('符合条件的密码', function () {
		let testData = [
			{input:'1111',expect:false}, // 长度不够
			{input:'111111',expect:false}, // 字符单一
			{input:'abcdefg',expect:false}, // 字符单一
			{input:'12abcdefgABFFFF',expect:false}, // 超出 12 个字符
			{input:'12abBFFFF',expect:true}, //合法密码
			{input:'11111a',expect:true} //合法密码
		]
      
	  
		testData.forEach(ele => {
			expect(validPassword(ele.input)).to.equal(ele.expect);
		})
    });
  });
  describe ('isDateStr', function () {
    it ('符合条件的密码', function () {
		let testData = [
			{input:'2010-10/12',expect:false}, // 不是相同分隔符
			{input:'2010-10-12',expect:true}, // 合法
			{input:'2010.10.12',expect:true}, // 合法
		]
      
	  
		testData.forEach(ele => {
			expect(isDateStr(ele.input)).to.equal(ele.expect);
		})
    });
  });
});
