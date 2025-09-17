const {expect, should, assert} = require ('chai');
// symbol 使用详解

describe ('symbol 作为私有变量', function () {
	let obj = {};
  beforeEach(() => {
    {
      obj = function () {
        let _id = Symbol ('id');

        return {
          [_id]: 1,
          info: 'test',
        };
      }();
    }
  });

  it ('私有变量无法被遍历', function () {
    let keys = Object.keys (obj);
    expect (keys).to.not.members (['_id']);
  });

  it ('symbol 私有变量不会被 JSON.stringify 转换', function () {
    let res = JSON.stringify(obj);
    expect (res).to.equal('{"info":"test"}');
  });

  it ('Object.getOwnPropertySymbols 获取私有变量的键名', function () {
	let [_id] = Object.getOwnPropertySymbols(obj);
	expect(obj[_id]).to.eq(1)
  });
});
