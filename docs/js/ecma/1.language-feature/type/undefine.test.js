const { expect } = require('chai');

describe('undefined', function() {
  it('undefined 在局部作用域会被重写', function() {
    let undefined = 1;
    expect(undefined).to.eq(1);
  });
  it('采用 void 0 代替 undefined 可以节约字节,并避免判断错误', function() {
    expect(undefined).to.eq(void 0);
  });
});
