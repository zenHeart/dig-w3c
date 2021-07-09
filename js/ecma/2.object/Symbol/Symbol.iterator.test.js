const {expect, should, assert} = require ('chai');

describe ('Symbol.iterator', function () {
  it.skip('修改数组  [...]  扩展行为', function () {
    let obj = [1];
    expect ([...obj]).deep.equal (obj);

    // 修改数组默认迭代器
    obj[Symbol.iterator] = function* () {
      yield 2;
    };
    console.log (obj);

    expect ([...obj]).deep.equal ([2]);
  });

  it ('Symbol.iterator 给对象添加 ... 扩展行为', function () {
    let obj = {
      a: 1,
      *[Symbol.iterator] () {
        yield 1;
      },
    };
    expect (obj).deep.equal ({a: 1});
    expect ([...obj]).deep.equal ([1]);
  });

  it ('Symbol.iterator 给对象添加 for of 行为', function () {
    let obj = {
      a: 1,
      *[Symbol.iterator] () {
        yield 1;
      },
    };
    for (let val of obj) {
      expect (val).to.equal (1);
    }
  });

  it ('赋值非迭代器函数 for of 和 [...] 扩展会抛出错误', function () {
    let obj = {
      a: 1,
      [Symbol.iterator]: () => {},
    };
    let objI = () => {
      for (let val of obj) {
        expect (val).to.equal (1);
      }
	  };
    expect(objI).throw(Error);


    let arr = [1, 2, 3];
    arr[Symbol.iterator] = () => {};
    // 注意由于修改了迭代器行为导致循环次数不在和数组的原始值相关
    // TODO： 此处需要整迭代器导致循环次数变化的特性
    let a = () => {
      for (let val of arr) {
        expect (val).to.equal (1);
      }
    };
    expect (a).throw (Error);
  });
});
