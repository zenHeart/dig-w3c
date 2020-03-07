const { expect, should, assert } = require('chai');

//箭头函数
describe('自动分号插入', function() {
  it('return 导致自动分号插入', function() {
    let result = (() => {
      // 注意此处会由于 return 导致自动插入分号抛出结果非对象
      return;
      {
        color: 'white';
      }
    })();
    expect(result).to.undefined;
  });
});
