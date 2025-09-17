const {expect, should, assert} = require ('chai');

describe ('Proxy.get', function () {
  it ('验证 get 陷阱', function () {
    let obj = {
      foo: 1,
    };
    let trap = {
      get (target, key, context) {
        return 'demo';
      },
    };
    let pobj = new Proxy (obj, trap);

    expect (pobj.demo).to.equal ('demo');
  });
});
