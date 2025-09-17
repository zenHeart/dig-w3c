const {expect, should, assert} = require ('chai');

describe('Function name',function() {
	it('匿名箭头函数 name 为空',function() {
		expect((()=>{}).name).is.empty;
	})
	it('具名箭头函数 name 为变量名',function() {
    let a =()=>{};
		expect(a.name).is.equal('a');
	})
	it('匿名函数构造器为 anonymous',function() {
		expect((new Function()).name).is.equal('anonymous');
	})
	it('具名函数构造器为变量名',function() {
    let a = new Function();
		expect(a.name).is.equal('anonymous');
	})
	it('匿名函数字面量形式为空',function() {
		expect((function(){}).name).is.empty
	})
	it('匿名函数字面量赋值为变量名',function() {
    let b= function(){};
		expect(b.name).is.equal('b')
	})

	it('具名函数字面量赋值为初始名',function() {
    let b = function a(){};
		expect(b.name).is.equal('a')
	})

	it('匿名函数对象形式为键名',function() {
		let obj = {
			foo:() => {},
			bar:function(){},
			baz:new Function()
		}
		expect(obj.foo.name).is.equal('foo')
		expect(obj.bar.name).is.equal('bar')
		// TODO： 注意此处的采用函数构造器名称非键名
		expect(obj.baz.name).is.equal('anonymous')
	})
	it('具名函数对象形式为键名',function() {
		let obj = {
			bar:function a(){}
		}
		expect(obj.bar.name).is.equal('a')
	})

})

