const {expect,should,assert} = require('chai');

describe('prototype',function(){
	it('prototype 传递原始值无效',function() {
		function Person(name) {
			this.name= name;
		}
		// 该复制无效
		Person.prototype = 1;
		Person.prototype = null;
		
		let tom = new Person('tom')
		expect(tom.__proto__).to.deep.equal({})
	})

});



