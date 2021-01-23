const { expect } = require('chai');


describe("String.prototype 原型方法", function () {
  describe('string.length is determine by unicode length',function() {
		it('ascii length same unicode lenght', function() {
			let a = "hello"
			expect(a.length).eq(5)
		})
		it('emoji length', function() {
			let a = "😁"
			expect(a.length).eq(2)
		})
	})
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
	describe('string extensions',function() {
		it('expand strings',function() {
			let a = 'hello'
			expect([...a]).to.deep.eq(['h','e','l','l','o'])
		})
	})
	describe('String.prototype.charAt', function () {
		it('get certain index value', function () {
			
			let str = 'abcd'

			// 无法修改 string 的值
			expect(str.charAt(0)).eq('a')
		})
		it('default return first character ', function () {
			expect('abcd'.charAt()).eq('a')
		})
		it('negative value or invaled value return empty', function () {
			expect('abcd'.charAt(-2)).eq('')
			expect('abcd'.charAt(10)).eq('')
		})
	})
	describe('String.prototype.charCodeAt', function () {
		it('get char encode number', function () {
			expect('012'.charCodeAt(1)).eq(49)
		})
  })
  describe('String.prototype.codePointAt', function () {
    it('get char unicode number', function () {
      expect('012'.codePointAt(1)).eq(49);
    });
  });
  describe('String.prototype.concat', function () {
    it('link multi string ', function () {
      let str = 'hello';
      let res = str.concat(' ', 'world');
      expect(res).eq('hello world');
    });
    it('link multi string， no string ', function () {
      let str = 'hello';
      let res = str.concat(1, { a: 1, toString: () => ' a' });
      expect(res).eq('hello1 a');
    });
    it('add performance better than concat', function () {
      let str = 'hello';
      let res = str + ' ' + 'world';
      expect(res).eq('hello world');
    });
  });
  describe('String.prototype.endsWith', function () {
    it('check end certain string', function () {
      let str = 'hello world';
      let end = 'world';
      expect(str.endsWith(end)).to.true;
    });
    it('second argument can determine string end ', function () {
      let str = 'hello world';
      let end = 'o';
      expect(str.endsWith(end, 5)).to.true;
    });
  });

  describe('String.prototype.includes', function () {
    it('check  string contain another', function () {
      let str = 'hello world';
      let end = 'world';
      expect(str.includes(end)).to.true;
    });
    it('second argument can determine search start position ', function () {
      let str = 'hello world';
      let end = 'hello';
      expect(str.includes('hello')).to.true;
      expect(str.includes('hello', 5)).to.false;
      // be careful position start from 0
      expect(str.includes(' world', 5)).to.true;
    });
  });
	describe('search(regexp)', function () {
		it('返回首次匹配的索引位置', function () {
			let str = "demo"
			expect(str.search(/demo/)).to.equal(0)

		})
		it('未匹配返回 -1', function () {
			let str = "demo"
			expect(str.search(/demo1/)).to.equal(-1)
		})
	})
	describe('replace(regexp|substr, newSubstr|function)', function () {
		it('将符合模式的字符串替换为新字符串', function () {
			let str = "hello tom"
			let res = str.replace('tom', 'jack')

			expect(res).to.equal('hello jack')

		})
		it('将符合模式的字符串,利用函数将字符替换为大写', function () {
			let str = "hello tom"
			let res = str.replace('tom', (subStr) => subStr.toUpperCase())

			expect(res).to.equal('hello TOM')

		})
	})

  describe('replaceAll(regexp|substr, newSubstr|function)', function () {
		it('第一个参数为字符串', function () {
			let str = "hello tom hello tom hello"
			let res = str.replaceAll('tom', 'jack')

			expect(res).to.equal('hello jack hello jack hello')

		})
		it('第一个参数为正则，全量替换模板', function () {
			let str = "a {demo} b c {demo}"
      let reg = /{\s*demo\s*}/g;

			let res = str.replaceAll(reg, 'a')
			expect(res).to.equal('a a b c a')
		})
		it('正则全量替换模板', function () {
			let str = "a {demo} b c {demo}"
      let reg = /{\s*demo\s*}/g;

			let res = str.replaceAll(reg, 'a')
			expect(res).to.equal('a a b c a')
		})
	})
});
