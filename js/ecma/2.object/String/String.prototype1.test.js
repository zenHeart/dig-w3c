const { expect } = require('chai');

describe("String.prototype", function () {
	describe('String.prototype.indexOf', function () {
		it('get first match index', function () {
			let str = 'hello world'

			// 无法修改 string 的值
			expect(str.indexOf('world')).eq(6)
			expect(str.indexOf('h')).eq(0)
		})
		it('no mactch return -1 , not zero',function() {
			expect('demo'.indexOf('z')).to.eq(-1)
		})

		it('second argument determine where to start match', function () {
			let str = 'hello world'

			// 无法修改 string 的值
			expect(str.indexOf('o')).eq(4)
			expect(str.indexOf('o', 5)).eq(7)
		})
		
	})
	describe('String.prototype.lastIndexOf', function () {
		it('get last match index', function () {
			let str = 'hello world'

			// 无法修改 string 的值
			expect(str.lastIndexOf('o')).eq(7)
		})
		it('no mactch return -1 , not zero',function() {
			expect('demo'.lastIndexOf('z')).to.eq(-1)
		})

		it('second argument determine where to start match', function () {
			let str = 'hello world'

			// 无法修改 string 的值
			expect(str.indexOf('l')).eq(2)
			expect(str.indexOf('l', 5)).eq(9)
		})
		
	})
});