require('babel-polyfill');
const { expect, should, assert } = require('chai');

const sinon = require ('sinon');


describe('iterator', function () {

  describe('生成器语法', function () {
    it('基本示例', function () {
      // 1. 采用 * 在函数 关键字后申名迭代器
      function* demo() {
        yield 1;
        yield 2;
        yield 3;
      }
      let i = demo();
      expect(i).has.property('next');
      let expectRes = [
        [1, false],
        [2, false],
        [3, false],
        [undefined, true],
        [undefined, true]
      ];
      expectRes.forEach((el) => {
        expect(i.next()).to.deep.eq({
          value: el[0],
          done: el[1]
        });
      });
    });

    it('对象中申名生成器函数', function () {
      // 1. 采用 * 在函数 关键字后申名迭代器
      let obj = {
        arr: [1, 2, 3],
        *iterator() {
          for (let i = 0; i < this.arr.length; i++) {
            yield this.arr[i];
          }
        }
      };
      // 注意生成器的创建的时机
      let objIterator = obj.iterator();
      expect(objIterator).has.property('next');
      let expectRes = [
        [1, false],
        [2, false],
        [3, false],
        [undefined, true],
        [undefined, true]
      ];
      expectRes.forEach((el) => {
        expect(objIterator.next()).to.deep.eq({
          value: el[0],
          done: el[1]
        });
      });
    });
    it('采用 Symbol.iterator 定义对象迭代器，使用 for of 引用', function () {
      let obj = {
        *[Symbol.iterator]() {
          yield 1;
          yield 2;
          yield 3;
        }
      };
      let i = obj[Symbol.iterator]();
      // js 引擎内部会创建迭代器,提取 value 值返回
      for (let val of obj) {
        expect(val).to.eq(i.next().value);
      }
    });
    it('next 为惰性求值', function () {
        let spy = sinon.spy();
        let spy1 = sinon.spy();

        function *f1() {
            yield (spy(), 1);
            yield (spy1(), 2);
        }
        let iterator=f1();
        // 未触发 next spy  没被触发
        expect(spy.called).to.false;
        iterator.next();
        expect(spy.called).to.true;

        // sp1 在下一次迭代被触发
        expect(spy1.called).to.false;
        iterator.next();
        expect(spy1.called).to.true;




    });
    describe('yield', function (param) {
      it('yield 接收传入值', function() {
        let spy = sinon.spy();
        function *f1() {
          spy(yield 3)
          // 此处接收
          spy(yield)
          spy(yield)
        }
        let generator = f1();
        generator.next(1);
        expect(spy.called).to.false
        generator.next(2);
        expect(spy.args[0]).to.deep.eq([2])
        generator.next(3);
        expect(spy.args[1]).to.deep.eq([3])
        generator.next(4);
        expect(spy.args[2]).to.deep.eq([4])
      })
    });
    describe('yield * 迭代器委托语法', function () {
      it('yield 委托，可返回迭代器', function () {
        function* f1() {
          yield 1;
          yield 2;
        }
        function* f2() {
          yield 3;
          yield 4;
        }
        function* combineGenerator() {
          // 注意 yield * 表示迭代委托给内部迭代器，不使用 * 号表示返回迭代器，而非委托
          yield* f1();
          yield* f2();
          yield 5;
        }
        let expectData = [1, 2, 3, 4, 5, undefined];
        let iterator = combineGenerator();
        expectData.forEach((el) => {
          expect(iterator.next().value).eq(el);
        });
      });
      it('迭代器委托，将之前的迭代器结果作为下一个迭代器入参', function () {
        function* f1() {
          yield 1;
          yield 2;
          return 3;
        }
        function* f2(res) {
          for (let i = 0; i < res; i++) {
            yield 'repeat';
          }
        }
        function* combineGenerator() {
          // 利用生成器的返回值，作为下个生成器的入参
          let res = yield* f1();
          yield* f2(res);
        }
        let expectData = [1, 2, 'repeat', 'repeat', 'repeat', undefined];
        let iterator = combineGenerator();
        expectData.forEach((el) => {
          expect(iterator.next().value).eq(el);
        });
      });
      it('字符串使用迭代器委托', function () {
        function* f1() {
          // 会逐步结构迭代器的各个值
          yield* 'hello';
        }
        let expectData = 'hello'.split('');
        let iterator = f1();
        expectData.forEach((el, i) => {
          expect(iterator.next().value).eq(expectData[i]);
        });
      });
    });

    describe('next 传值给生成器', function () {
      it('next 无法修改第一次，生成器的值', function () {
        let func = function* () {
          yield 1;
        };
        expect(func().next(2)).to.deep.eq({
          value: 1,
          done: false
        });
      });
      it('next 传值可修改后续生成器的返回值', function () {
        let func = function* () {
          let a = 0,
            b = 0,
            c = 0;
          a = yield 1;
          b = yield a + 1; // a 接收第二次 next 传入的值
          c = yield b + 1; // b 接收第三次 next 传入的值
        };
        let testData = [
          [1, 2, 3],
          [
            [1, false],
            [3, false],
            [4, false]
          ]
        ];
        let iterator = func();
        testData[0].forEach((el, i) => {
          expect(iterator.next(el)).to.deep.eq({
            value: testData[1][i][0],
            done: testData[1][i][1]
          });
        });
      });
    });
    describe('throw 控制迭代器', function () {
      it('throw 可触发生成器抛出错误', function () {
        let func = function* () {
          let a = 0,
            b = 0,
            c = 0;
          a = yield 1;
          b = yield a + 1; // a 接收第二次 next 传入的值
          c = yield b + 1; // b 接收第三次 next 传入的值
        };
        let testData = [
          [1, 2, 3],
          [
            [1, false],
            [3, false],
            [4, false]
          ]
        ];
        let iterator = func();
        testData[0].forEach((el, i) => {
          if (i < 2) {
            expect(iterator.next(el)).to.deep.eq({
              value: testData[1][i][0],
              done: testData[1][i][1]
            });
          } else {
            // throw error 控制迭代器抛出错误
            expect(() => iterator.throw(new Error('test'))).throw(
              Error,
              /test/
            );
          }
        });
      });
    });
    describe('迭代器中使用 return', function () {
      it('return 会提前结束迭代', function () {
        let func = function* () {
          yield 1;
          return;
          yield 2;
        };
        let iterator = func();
        expect(iterator.next().value).eq(1);
        expect(iterator.next().value).undefined;
      });
      it('return 的返回值会作为终值', function () {
        let func = function* () {
          yield 1;
          return 1;
          yield 2;
        };
        let iterator = func();
        expect(iterator.next().value).eq(1);
        expect(iterator.next()).to.deep.eq({
          value: 1,
          done: true
        });
      });
    });
  });
});
