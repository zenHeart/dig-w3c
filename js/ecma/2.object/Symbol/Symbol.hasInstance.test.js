const {expect, should, assert} = require ('chai');

describe ('Symbol.hasInstance', function () {
  it ('修改 instanceof 默认行为', function () {
    class Array1 {
      static [Symbol.hasInstance] (instance) {
        return Array.isArray (instance);
      }
    }

    console.log ([] instanceof Array1);
    // expected output: true
  });
});
