// 迭代器函数传入数组，返回迭代器对象
const { expect, should, assert } = require('chai');
const {
    CustomIterator,
    createIterator,
    isIterable,
    RandomNumberGenerator
  } = require('./iterator');  

describe('iterator',function() {
    let testData = {
        input: [1, 2, 3],
        expect: [
          [1, false],
          [2, false],
          [3, false],
          [undefined, true],
          [undefined, true]
        ]
      };
      describe('验证自定义迭代器', function () {
    
        it('验证自定义迭代器类', function () {
          let iterator = new CustomIterator(testData.input);
          testData.expect.forEach((el) => {
            expect(iterator.next()).to.deep.eq({
              value: el[0],
              done: el[1]
            });
          });
        });
        it('验证自定义迭代器函数', function () {
          let iterator = createIterator(testData.input);
          testData.expect.forEach((el) => {
            expect(iterator.next()).to.deep.eq({
              value: el[0],
              done: el[1]
            });
          });
        });
    });
    
    describe('Symbol.iterator 使用', function () {
        it('数组使用 Symbol.iterator 创建迭代器', function () {
          let iarr = testData.input[Symbol.iterator]();
          testData.expect.forEach((el) => {
            expect(iarr.next()).to.deep.eq({
              value: el[0],
              done: el[1]
            });
          });
        });
        it('检查属性是否可迭代', function () {
          expect(isIterable({})).to.false;
        });
      });
      describe('迭代器使用',function() {
          it('for of 提取随机值',function() {
              let randomIterator = new RandomNumberGenerator(10);
              let add =[];
              // TODO： 核心在于懒加载生成数据，场景问题
              for(let val of randomIterator) {
                  add.push(val)
              }
              expect(add.length).eq(10)
          })
          it('for await of 提取异步',function() {
              const asyncObj = {
                  [Symbol.asyncIterator]() {
                    return {
                        i: 0,
                        next() {
                          if (this.i < 3) {
                            return Promise.resolve({ value: this.i++, done: false });
                          }
                          return Promise.resolve({ done: true });
                        }
                      };
                  }
              }

              let arr =[];
              return (async function() {
                for await (let val of asyncObj) {
                    arr.push(val)
                }
                expect(arr).deep.eq([0,1,2])
              })()
          })
      })
      describe('... expand in iterator',function() {
          it('验证对象扩展',function() {
              let obj = {
                  [Symbol.iterator]() {
                      return {
                        i: 0,
                        next() {
                            return this.i++<3?{value: this.i}:{done: true}
                        }
                      }
                  }
              }
              //可迭代的 iterator 对象支持，对象扩展
              expect([...obj]).deep.eq([1,2,3])
          })
      })
})
