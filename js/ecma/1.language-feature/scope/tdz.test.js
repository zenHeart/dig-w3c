const { expect } = require('chai');

describe('tdz 测试', function () {
  it.skip('函数参数导致的 TDZ 现象', function () {
    function printSomething() {
      let x = 1;
      function a(x = x) {
        return x;
      }
      a();
    }
    expect(printSomething).throw(ReferenceError, /x.*is not defined/);
  });
});
