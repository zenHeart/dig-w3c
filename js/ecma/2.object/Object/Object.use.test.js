const {expect} = require ('chai');

describe ('Object 方法应用举例', function () {
	describe('classOf',function() {
		let {classOf} = require('./src/classOf')

		it('判断基础类型',function() {
			expect(classOf('1')).to.equal('String')
			expect(classOf(1)).to.equal('Number')
		})
	})
});
