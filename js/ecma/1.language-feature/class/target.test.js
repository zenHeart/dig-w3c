const {expect, should, assert} = require ('chai');

describe('class new.target',function() {
	it('验证 new.target 指向调用 new 的构造器',function () { 
		class Parent {
			constructor() {
				expect(new.target).equal(Parent)
			}
		}
		new Parent();
	 })
	it('验证 new.target 指向调用 new 的目标构造器',function () { 
		class Parent {
			constructor() {
				expect(new.target).equal(Children)
			}
		} 
		class Children extends Parent {

		 }
		 new Children();
	 })
})

