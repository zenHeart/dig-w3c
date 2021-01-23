const {expect, should, assert} = require ('chai');

//箭头函数
describe ('可选链', function () {
  it ('值存在则取后续值', function () {
    let a= {
      b: 1
    }
    expect (a?.b).to.be.equal (1);
  });

  it ('值不存在返回 undefeind', function () {
    let a = 1
    expect (a?.b?.c).to.undefined;
  });
});
