require ('babel-polyfill');
const {expect, should, assert} = require ('chai');

// TODO: 此处需要私用替身
describe('for in', function () {
  it ('循环包含原型链所有可枚举属性', function () {
	  let obj = {
		  foo:1
	  }
	  for(let key in obj) {
		  expect(obj[key]).to.equal(1)
	  }
  });

});
