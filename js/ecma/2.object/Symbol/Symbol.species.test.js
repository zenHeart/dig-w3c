const {expect, should, assert} = require ('chai');

describe ('Symbol.species', function () {
  it ('修改 new 使用哪个构造器', function () {
    class Array1 {
		// 使用 Array 构造器创建数组
      static  get [Symbol.species]() {
        return Array;
      }
	}
	let arr = new  Array1([1,2,3])

	console.log(arr)
	expect(arr).instanceOf(Object)
  });
});
