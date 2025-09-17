require('babel-polyfill');
const {expect,should,assert} = require('chai');


describe("概述",function() {
    /**
     * symbol 是基本类型
     * 所以非对象,而是 symbol 类型
     * symbol 用来定义不重复的索引 */
    it("测试 symbol 对象生成",function() {
        expect(Symbol()).a('symbol');
        expect(Symbol()).not.to.an.instanceOf(Symbol);
    });

    it("getOwnPropertySymbols 获取属性值",function () {
        let a = Symbol();
        let b = Symbol();

        const Obj = {
            [a]:'foo',
            [b]:'bar'
        };

        const objectSymbols = Object.getOwnPropertySymbols(Obj);

        //返回键名对象的值
        expect(objectSymbols).to.deep.equal([a,b]);
	})
	
	it('symbol.for 全局符号变量注册表',function() {
		let a = Symbol.for('a');
		let b = Symbol.for('a');

		expect(a).eq(b);
	})
});