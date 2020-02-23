const {expect} = require('chai')

describe('regexp 初始化',function() {
	it('字面量模式',function() {
		let r = /^a/
		expect(r).to.instanceOf(RegExp)
		expect(r.test('a')).to.true
	})
	it('构造函数模式-传入正则',function() {
		let r = new RegExp(/^a/,'g')
		expect(r).instanceOf(RegExp)
		expect(r.test('a')).to.true
	})
	it('构造函数模式-传入字符串',function() {
		// 注意\需转义,否则会当做普通字符串处理
		let r = new RegExp('^a\\d','g')
		expect(r).instanceOf(RegExp)
		expect(r.test('a1')).to.true
	})
})