const {expect} = require('chai')

describe('regexp prototype ',function() {
	
	describe('RegExp.prototype.flags',function() {
		it('以字符串保存标志位的配置信息,不存在为空字符串',function() {
			let r1 = /\d/gi;
			let r2 = /\d/;

			expect(r1.flags).to.equal('gi')
			expect(r2.flags).to.empty.string
		})
	})
	describe('RegExp.prototype.global',function() {
		it('g 决定是否全局匹配',function() {
			let r1 = /\d\w/g;

			//TODO: 添加 global 标志位示例

		})
	})
	describe('RegExp.prototype.ignoreCase',function() {
		it('i 控制忽略大小写',function() {
			let r1 = /\dW/i;
			let r2 = /\dW/;

			expect(r1.test('1w')).to.true
			expect(r2.test('1w')).to.false
		})
	})
	describe('RegExp.prototype.multiline',function() {
		it('m 控制是否开启多行匹配',function() {
			let r1 = /\dw$/m;
			let r2 = /\dW$/;

			// 由于开启了多行模式,$可以标识每行末尾
			expect(r1.test('1w\n--')).to.true
			expect(r2.test('1w\n--')).to.false
		})
	})
	describe('RegExp.prototype.sticky',function() {
		it('y  打开粘滞模式',function() {
			let r1 = /\dw$/m;

		})
	})
	describe('RegExp.prototype.unicode',function() {
		it('u 是否开启 unicode 匹配',function() {
			let r1 = /\dw$/m;

		})
	})
	describe('RegExp.prototype.dotAll',function() {
		it('决定 . 是否匹配换行符,由 s 标志位控制',function() {
			let r1 = /\d./s;
			let r2 = /\d./;
			
			expect(r1.test('1\n')).to.true
			expect(r2.test('1\n')).to.false
		})
	})
	
	describe('RegExp.prototype.source',function() {
		it('保存正则实例化原型的字符串',function() {
			let r1 = /\dw$/m;

			// 由于开启了多行模式,$可以标识每行末尾
			expect(r1.source).to.equal('\\dw$')
		})
	})

	describe('RegExp.prototype.exec',function() {
		it('返回符合查询条件的内容,g 修改 lastIndex 的值',function() {
			let r = /(\d(\d{2}))/g;
			let res = r.exec('a123-2343-343');


			expect(res).to.deep.equal(['123','123','23']);
			expect(res).to.has.property('index',1)
			expect(res).to.has.property('input','a123-2343-343')
			expect(r).to.has.property('lastIndex',4)

			res = r.exec('a123-2343-343');

			expect(res).to.deep.equal(['234','234','34']);
			expect(res).to.has.property('index',5)
			expect(res).to.has.property('input','a123-2343-343')
			expect(r).to.has.property('lastIndex',8)
		})
		it('返回符合查询条件的内容,包含 g 匹配失败时也会重置 lastIndex',function() {
			let r = /(\d(\d{2}))/g;
			let res = r.exec('a123-2343-343');

			expect(r).to.has.property('lastIndex',4)
			res = r.exec('a');
			// 由于从索引 = 4 开始匹配 a 无法找到,lastIndex 被重置
			expect(r).to.has.property('lastIndex',0)
		})
		it('返回符合查询条件的内容,g 修改 lastIndex 的值',function() {
			let r = /(\d(\d{2}))/g;
			let res = r.exec('a123-2343-343');


			expect(res).to.deep.equal(['123','123','23']);
			expect(res).to.has.property('index',1)
			expect(res).to.has.property('input','a123-2343-343')
			expect(r).to.has.property('lastIndex',4)

			res = r.exec('a123-2343-343');

			expect(res).to.deep.equal(['234','234','34']);
			expect(res).to.has.property('index',5)
			expect(res).to.has.property('input','a123-2343-343')
			expect(r).to.has.property('lastIndex',8)
		})
		it('返回符合查询条件的内容,无 g 每次重置 lastIndex 为 0',function() {
			let r = /(\d(\d{2}))/;
			let res = r.exec('a123-2343-343');


			expect(res).to.deep.equal(['123','123','23']);
			expect(res).to.has.property('index',1)
			expect(res).to.has.property('input','a123-2343-343')
			expect(r).to.has.property('lastIndex',0)

			res = r.exec('a123-2343-343');

			expect(r).to.has.property('lastIndex',0)
		})
	})

	describe('RegExp.prototype[Symbol.match](str)',function() {
		it('字符串 match 方法,内部调用为此正则方法',function() {
			let str = 'demo';

			expect(str.match(/\w/g)).deep.equal(str.split(''))
		})
	})

	describe('RegExp.prototype.test',function() {
		it('验证字符串是否符合匹配模式',function() {
			let hasNumber = /\d/g;

			expect(hasNumber.test('foo')).to.false
			expect(hasNumber.test('foo1bar`')).to.true
		})
	})
})