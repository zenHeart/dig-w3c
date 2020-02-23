const {expect, should, assert} = require ('chai');

describe ('Symbol.toStringTag', function () {
  it ('修改 toString 默认行为', function () {
	let obj = {
		a:1
	}
	expect (obj.toString()).equal ('[object Object]');
	obj[Symbol.toStringTag] = 'obj';
    expect (obj.toString()).equal ('[object obj]');
  });


});
