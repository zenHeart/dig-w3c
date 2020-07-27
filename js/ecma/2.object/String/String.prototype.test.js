const {expect} = require('chai');

describe("String.prototype 原型方法",function() {
	describe('search(regexp)',function(){
		it('返回首次匹配的索引位置',function() {
			let str = "demo"
			expect(str.search(/demo/)).to.equal(0)
			
		})
		it('未匹配返回 -1',function() {
			let str = "demo"
			expect(str.search(/demo1/)).to.equal(-1)
		})
	} )
	describe('replace(regexp|substr, newSubstr|function)',function(){
		it('将符合模式的字符串替换为新字符串',function() {
			let str = "hello tom"
			let res = str.replace('tom','jack')

			expect(res).to.equal('hello jack')
			
		})
		it('将符合模式的字符串,利用函数将字符替换为大写',function() {
			let str = "hello tom"
			let res = str.replace('tom',(subStr) => subStr.toUpperCase())

			expect(res).to.equal('hello TOM')
			
		})
	} )
});