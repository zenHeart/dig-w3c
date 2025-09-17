require ('babel-polyfill');
const {expect, should, assert} = require ('chai');

//箭头函数
describe ('测试运算符', function () {
  it ('** 幂运算', function () {
    expect (2 ** 2).to.be.equal (4);
  });

  it ('in 检查可枚举属性', function () {
    // 注意 in 不区分自有属性和继承属性
    let obj = Object.create (null, {
      hi: {
        value: 1,
        enumerable: false,
      },
    });
    expect ('hasOwnProperty' in {}).to.true;
    expect ('hasOwnProperty' in obj).to.false;
  });
});
